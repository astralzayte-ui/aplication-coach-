-- =====================================================================
-- FORMA — Logique serveur des codes (générer / vérifier / utiliser)
-- =====================================================================
-- Ces fonctions tournent CÔTÉ SERVEUR. L'application ne fait que les appeler ;
-- elle ne peut pas contourner les règles (rôle, durée, expiration, usage unique).
--
-- Note sécurité : les codes sont stockés HACHÉS (SHA-256). On ne compare jamais
-- le code en clair stocké — on hache le code reçu et on cherche l'empreinte.

-- ---------------------------------------------------------------------
-- Normalisation + hachage d'un code
-- ---------------------------------------------------------------------
-- Note : `digest` vient de l'extension pgcrypto. Sur Supabase elle est installée
-- dans le schéma `extensions` ; on l'inclut donc dans le search_path pour que la
-- fonction la trouve aussi bien en local (public) que sur Supabase (extensions).
create or replace function public.forma_hash_code(p_code text)
returns text
language sql
immutable
set search_path = public, extensions
as $$
  select encode(digest(upper(trim(p_code)), 'sha256'), 'hex');
$$;

-- ---------------------------------------------------------------------
-- Génère une chaîne aléatoire depuis un alphabet sans caractères ambigus
-- (pas de I, O, 0, 1 pour éviter les confusions à la lecture)
-- ---------------------------------------------------------------------
create or replace function public.forma_random_str(p_len integer)
returns text
language plpgsql
volatile
as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  out text := '';
  i integer;
begin
  for i in 1..p_len loop
    out := out || substr(alphabet, 1 + floor(random() * length(alphabet))::int, 1);
  end loop;
  return out;
end;
$$;

-- ---------------------------------------------------------------------
-- Masque un code pour l'affichage : garde le préfixe + révèle les 2 derniers
-- ex. FORMA-COACH-K7P9 -> FORMA-COACH-••P9
-- ---------------------------------------------------------------------
create or replace function public.forma_mask_code(p_code text)
returns text
language sql
immutable
as $$
  select case
    when length(p_code) <= 2 then p_code
    else regexp_replace(p_code, '.(?=.{2})', '•', 'g')
  end;
$$;

-- ---------------------------------------------------------------------
-- Rôle du compte appelant (depuis la table profiles). null si non connecté.
-- ---------------------------------------------------------------------
create or replace function public.forma_current_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- GÉNÉRATION D'UN CODE
--   - Manager : peut générer un code 'coach' OU 'student'
--   - Coach   : peut générer UNIQUEMENT un code 'student'
--   Renvoie le code EN CLAIR une seule fois (à afficher/partager tout de suite),
--   plus la version masquée. Le clair n'est jamais restocké.
-- ---------------------------------------------------------------------
create or replace function public.forma_generate_code(p_role code_role, p_days integer)
returns table (code text, masked text, code_id uuid)
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_caller_role user_role;
  v_plain text;
  v_masked text;
  v_hash text;
  v_id uuid;
  v_prefix text;
begin
  v_caller_role := public.forma_current_role();

  if v_caller_role is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  -- Règles d'autorisation
  if v_caller_role = 'student' then
    raise exception 'forbidden' using errcode = '42501';
  end if;
  if v_caller_role = 'coach' and p_role <> 'student' then
    raise exception 'coach_can_only_generate_student_codes' using errcode = '42501';
  end if;

  if p_days not in (7, 30, 90, 180, 365) then
    raise exception 'invalid_duration' using errcode = '22023';
  end if;

  -- Format du code selon qui le génère (cf. README)
  if v_caller_role = 'coach' then
    v_plain := 'FORMA-EL-' || public.forma_random_str(4) || '-' || p_days || 'J';
  elsif p_role = 'coach' then
    v_plain := 'FORMA-COACH-' || public.forma_random_str(4);
  else
    v_plain := 'FORMA-ELV-' || public.forma_random_str(4);
  end if;

  v_masked := public.forma_mask_code(v_plain);
  v_hash := public.forma_hash_code(v_plain);

  insert into public.access_codes (
    code_hash, code_masked, role, duration_days,
    created_by, created_by_role, redeem_by
  ) values (
    v_hash, v_masked, p_role, p_days,
    auth.uid(), v_caller_role, now() + interval '90 days'  -- un code non utilisé expire après 90 j
  )
  returning id into v_id;

  return query select v_plain, v_masked, v_id;
end;
$$;

-- ---------------------------------------------------------------------
-- VÉRIFICATION D'UN CODE (sans rien modifier) — appelée par l'Edge Function
--   Renvoie l'état du code : valide ? pourquoi pas ? rôle, durée, déjà utilisé...
--   C'est ICI que sont appliquées les règles : rôle, expiration, révocation.
-- ---------------------------------------------------------------------
create or replace function public.forma_peek_code(p_code text)
returns table (
  valid           boolean,
  reason          text,
  code_id         uuid,
  role            code_role,
  duration_days   integer,
  already_used    boolean,
  used_by         uuid,
  created_by      uuid,
  created_by_role user_role
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  r public.access_codes%rowtype;
begin
  select * into r from public.access_codes where code_hash = public.forma_hash_code(p_code);

  if not found then
    return query select false, 'invalid_code', null::uuid, null::code_role, null::int,
                        null::boolean, null::uuid, null::uuid, null::user_role;
    return;
  end if;

  if r.revoked then
    return query select false, 'revoked', r.id, r.role, r.duration_days,
                        r.used, r.used_by, r.created_by, r.created_by_role;
    return;
  end if;

  -- Un code JAMAIS utilisé doit l'être avant sa date limite ; sinon il est refusé.
  if not r.used and r.redeem_by < now() then
    return query select false, 'code_expired', r.id, r.role, r.duration_days,
                        r.used, r.used_by, r.created_by, r.created_by_role;
    return;
  end if;

  -- Valide : soit première utilisation (création de compte), soit reconnexion (déjà lié).
  return query select true, 'ok', r.id, r.role, r.duration_days,
                      r.used, r.used_by, r.created_by, r.created_by_role;
end;
$$;

-- ---------------------------------------------------------------------
-- PROVISION D'UN COMPTE à partir d'un code (1re utilisation)
--   Appelée par l'Edge Function APRÈS avoir créé le compte auth (p_user_id).
--   Atomique : re-vérifie le code sous verrou, marque used = true (usage unique),
--   crée profile + coach/student, fixe la fin d'abonnement = aujourd'hui + durée.
-- ---------------------------------------------------------------------
create or replace function public.forma_provision_account(p_code_id uuid, p_user_id uuid)
returns jsonb
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  r public.access_codes%rowtype;
  v_sub_end date;
  v_role user_role;
begin
  -- Verrou de ligne : empêche deux utilisations simultanées du même code.
  select * into r from public.access_codes where id = p_code_id for update;
  if not found then
    raise exception 'invalid_code' using errcode = 'P0002';
  end if;
  if r.used then
    raise exception 'already_used' using errcode = 'P0001';
  end if;
  if r.revoked or (r.redeem_by < now()) then
    raise exception 'code_expired' using errcode = 'P0001';
  end if;

  v_sub_end := current_date + (r.duration_days || ' days')::interval;
  v_role := r.role::text::user_role;   -- 'coach'|'student'

  insert into public.profiles (id, role) values (p_user_id, v_role)
    on conflict (id) do nothing;

  if v_role = 'coach' then
    insert into public.coaches (id, subscription_end) values (p_user_id, v_sub_end)
      on conflict (id) do nothing;
  else
    insert into public.students (id, coach_id, subscription_end)
      values (
        p_user_id,
        case when r.created_by_role = 'coach' then r.created_by else null end,
        v_sub_end
      )
      on conflict (id) do nothing;
  end if;

  update public.access_codes
     set used = true, used_by = p_user_id, used_at = now()
   where id = p_code_id;

  return jsonb_build_object('role', v_role, 'subscription_end', v_sub_end);
end;
$$;

-- ---------------------------------------------------------------------
-- ÉTAT D'ABONNEMENT du compte connecté (pour l'écran « abonnement expiré »)
-- ---------------------------------------------------------------------
create or replace function public.forma_my_status()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_role user_role;
  v_end date;
begin
  select role into v_role from public.profiles where id = auth.uid();
  if v_role is null then
    return jsonb_build_object('authenticated', false);
  end if;
  if v_role = 'coach' then
    select subscription_end into v_end from public.coaches where id = auth.uid();
  elsif v_role = 'student' then
    select subscription_end into v_end from public.students where id = auth.uid();
  end if;
  return jsonb_build_object(
    'authenticated', true,
    'role', v_role,
    'subscription_end', v_end,
    'active', (v_end is null or v_end >= current_date)   -- manager : toujours actif
  );
end;
$$;

-- ---------------------------------------------------------------------
-- Prolonger un abonnement (+ N jours). Manager pour un coach/élève ; coach pour SON élève.
-- ---------------------------------------------------------------------
create or replace function public.forma_extend_subscription(p_target uuid, p_days integer)
returns date
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  v_caller user_role;
  v_new date;
begin
  v_caller := public.forma_current_role();
  if v_caller is null then raise exception 'not_authenticated'; end if;

  -- coach : uniquement un de SES élèves
  if v_caller = 'coach' then
    if not exists (select 1 from public.students where id = p_target and coach_id = auth.uid()) then
      raise exception 'forbidden' using errcode = '42501';
    end if;
  elsif v_caller <> 'manager' then
    raise exception 'forbidden' using errcode = '42501';
  end if;

  update public.coaches
     set subscription_end = greatest(subscription_end, current_date) + p_days
   where id = p_target
   returning subscription_end into v_new;

  if v_new is null then
    update public.students
       set subscription_end = greatest(subscription_end, current_date) + p_days
     where id = p_target
     returning subscription_end into v_new;
  end if;

  return v_new;
end;
$$;

-- ---------------------------------------------------------------------
-- RGPD : suppression douce de MON compte (l'Edge Function supprime ensuite le compte auth)
-- ---------------------------------------------------------------------
create or replace function public.forma_soft_delete_me()
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  update public.profiles set deleted_at = now() where id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------------
-- RGPD : exporter MES données (renvoie un JSON de tout ce qui me concerne)
-- ---------------------------------------------------------------------
create or replace function public.forma_export_me()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  uid uuid := auth.uid();
begin
  return jsonb_build_object(
    'profile', (select to_jsonb(p) from public.profiles p where p.id = uid),
    'coach',   (select to_jsonb(c) from public.coaches c where c.id = uid),
    'student', (select to_jsonb(s) from public.students s where s.id = uid),
    'weights', (select coalesce(jsonb_agg(to_jsonb(w)), '[]'::jsonb) from public.weights w where w.student_id = uid),
    'messages',(select coalesce(jsonb_agg(to_jsonb(m)), '[]'::jsonb) from public.messages m where m.student_id = uid or m.coach_id = uid)
  );
end;
$$;

-- ---------------------------------------------------------------------
-- Enregistrer le consentement RGPD
-- ---------------------------------------------------------------------
create or replace function public.forma_set_consent()
returns void
language plpgsql
volatile
security definer
set search_path = public
as $$
begin
  update public.profiles set consent_at = now() where id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------------
-- Bibliothèque de repas de démarrage (100 repas) donnée à chaque coach
-- ---------------------------------------------------------------------
create or replace function public.forma_seed_coach_content(p_coach uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.meals (coach_id, name, kcal, protein, category, ingredients)
  select p_coach, v.name, v.kcal, v.protein, v.category, v.ingredients
  from (values
    ('Blanc de poulet pates completes brocoli',890,56,'caloric','Blanc de poulet, pates completes, brocoli, huile d''olive'),
    ('Dinde quinoa haricots verts',870,48,'caloric','Dinde, quinoa, haricots verts, huile d''olive'),
    ('Oeufs riz complet brocoli',780,28,'caloric','Oeufs, riz complet, brocoli, huile d''olive'),
    ('Dinde patate douce salade',860,47,'caloric','Dinde, patate douce, salade, huile d''olive'),
    ('Agneau patate douce salade',820,44,'caloric','Agneau, patate douce, salade, huile d''olive'),
    ('Porc lentilles poivrons',770,45,'caloric','Porc, lentilles, poivrons, huile d''olive'),
    ('Cabillaud riz complet champignons',830,39,'caloric','Cabillaud, riz complet, champignons, huile d''olive'),
    ('Dinde pommes de terre haricots verts',780,53,'caloric','Dinde, pommes de terre, haricots verts, huile d''olive'),
    ('Boeuf pommes de terre champignons',850,53,'caloric','Boeuf, pommes de terre, champignons, huile d''olive'),
    ('Filet de boeuf riz basmati ratatouille',890,52,'caloric','Filet de boeuf, riz basmati, ratatouille, huile d''olive'),
    ('Tofu ferme riz complet haricots verts',850,35,'caloric','Tofu ferme, riz complet, haricots verts, huile d''olive'),
    ('Escalope de veau boulgour tomates',840,48,'caloric','Escalope de veau, boulgour, tomates, huile d''olive'),
    ('Cabillaud pates completes brocoli',850,41,'caloric','Cabillaud, pates completes, brocoli, huile d''olive'),
    ('Boeuf patate douce haricots verts',830,53,'caloric','Boeuf, patate douce, haricots verts, huile d''olive'),
    ('Porc boulgour champignons',810,48,'caloric','Porc, boulgour, champignons, huile d''olive'),
    ('Thon patate douce poivrons',780,43,'caloric','Thon, patate douce, poivrons, huile d''olive'),
    ('Agneau gnocchis courgettes',840,48,'caloric','Agneau, gnocchis, courgettes, huile d''olive'),
    ('Crevettes semoule salade',820,42,'caloric','Crevettes, semoule, salade, huile d''olive'),
    ('Escalope de veau riz basmati courgettes',810,50,'caloric','Escalope de veau, riz basmati, courgettes, huile d''olive'),
    ('Crevettes semoule haricots verts',820,42,'caloric','Crevettes, semoule, haricots verts, huile d''olive'),
    ('Dinde boulgour ratatouille',850,54,'caloric','Dinde, boulgour, ratatouille, huile d''olive'),
    ('Steak hache semoule epinards',840,51,'caloric','Steak hache, semoule, epinards, huile d''olive'),
    ('Cabillaud lentilles carottes',830,43,'caloric','Cabillaud, lentilles, carottes, huile d''olive'),
    ('Thon patate douce epinards',830,48,'caloric','Thon, patate douce, epinards, huile d''olive'),
    ('Boeuf riz basmati haricots verts',830,51,'caloric','Boeuf, riz basmati, haricots verts, huile d''olive'),
    ('Filet de boeuf boulgour carottes',880,52,'caloric','Filet de boeuf, boulgour, carottes, huile d''olive'),
    ('Crevettes riz complet tomates',850,41,'caloric','Crevettes, riz complet, tomates, huile d''olive'),
    ('Agneau riz basmati haricots verts',870,45,'caloric','Agneau, riz basmati, haricots verts, huile d''olive'),
    ('Filet de boeuf boulgour champignons',820,55,'caloric','Filet de boeuf, boulgour, champignons, huile d''olive'),
    ('Crevettes quinoa ratatouille',780,41,'caloric','Crevettes, quinoa, ratatouille, huile d''olive'),
    ('Agneau quinoa salade',800,45,'caloric','Agneau, quinoa, salade, huile d''olive'),
    ('Escalope de veau boulgour salade',870,48,'caloric','Escalope de veau, boulgour, salade, huile d''olive'),
    ('Steak hache pommes de terre epinards',840,47,'caloric','Steak hache, pommes de terre, epinards, huile d''olive'),
    ('Oeufs pommes de terre ratatouille',730,28,'caloric','Oeufs, pommes de terre, ratatouille, huile d''olive'),
    ('Tofu ferme pommes de terre poivrons',770,31,'caloric','Tofu ferme, pommes de terre, poivrons, huile d''olive'),
    ('Dinde lentilles haricots verts',790,54,'caloric','Dinde, lentilles, haricots verts, huile d''olive'),
    ('Escalope de veau pates completes salade',850,47,'caloric','Escalope de veau, pates completes, salade, huile d''olive'),
    ('Blanc de poulet pain complet salade',830,57,'caloric','Blanc de poulet, pain complet, salade, huile d''olive'),
    ('Agneau lentilles carottes',800,44,'caloric','Agneau, lentilles, carottes, huile d''olive'),
    ('Cabillaud semoule carottes',840,44,'caloric','Cabillaud, semoule, carottes, huile d''olive'),
    ('Tofu ferme flocons d''avoine ratatouille',770,34,'caloric','Tofu ferme, flocons d''avoine, ratatouille, huile d''olive'),
    ('Dinde pates completes champignons',840,50,'caloric','Dinde, pates completes, champignons, huile d''olive'),
    ('Oeufs patate douce brocoli',750,27,'caloric','Oeufs, patate douce, brocoli, huile d''olive'),
    ('Dinde pates completes brocoli',880,48,'caloric','Dinde, pates completes, brocoli, huile d''olive'),
    ('Agneau patate douce poivrons',830,44,'caloric','Agneau, patate douce, poivrons, huile d''olive'),
    ('Agneau quinoa tomates',860,48,'caloric','Agneau, quinoa, tomates, huile d''olive'),
    ('Dinde pain complet carottes',820,48,'caloric','Dinde, pain complet, carottes, huile d''olive'),
    ('Boeuf boulgour carottes',850,55,'caloric','Boeuf, boulgour, carottes, huile d''olive'),
    ('Crevettes pain complet brocoli',790,37,'caloric','Crevettes, pain complet, brocoli, huile d''olive'),
    ('Crevettes gnocchis champignons',820,40,'caloric','Crevettes, gnocchis, champignons, huile d''olive'),
    ('Porc quinoa carottes',820,47,'caloric','Porc, quinoa, carottes, huile d''olive'),
    ('Porc patate douce haricots verts',830,44,'caloric','Porc, patate douce, haricots verts, huile d''olive'),
    ('Poulet boulgour salade',810,53,'caloric','Poulet, boulgour, salade, huile d''olive'),
    ('Tofu ferme patate douce epinards',800,38,'caloric','Tofu ferme, patate douce, epinards, huile d''olive'),
    ('Porc patate douce carottes',780,45,'caloric','Porc, patate douce, carottes, huile d''olive'),
    ('Salade cesar poulet',340,32,'light','Poulet grille, salade, parmesan, croutons legers'),
    ('Poke bowl saumon',380,30,'light','Saumon, riz, edamame, avocat, concombre'),
    ('Wrap dinde crudites',320,28,'light','Galette complete, dinde, salade, tomate'),
    ('Omelette aux legumes',280,24,'light','3 oeufs, poivrons, epinards, oignons'),
    ('Soupe de lentilles',250,18,'light','Lentilles corail, carottes, cumin'),
    ('Skyr fruits rouges',220,20,'light','Skyr, myrtilles, framboises, amandes'),
    ('Fromage blanc miel noix',260,22,'light','Fromage blanc 0%, miel, noix'),
    ('Tofu saute legumes',300,26,'light','Tofu, brocoli, sauce soja, sesame'),
    ('Salade thon mais',320,30,'light','Thon, salade, mais, tomate, oeuf'),
    ('Buddha bowl legumes',350,20,'light','Pois chiches, quinoa, betterave, avocat'),
    ('Crevettes courgettes',260,34,'light','Crevettes, courgettes, ail, citron'),
    ('Blanc de dinde vapeur',240,38,'light','Dinde, haricots verts, riz complet'),
    ('Salade grecque feta',300,16,'light','Concombre, tomate, feta, olives'),
    ('Cabillaud legumes vapeur',250,36,'light','Cabillaud, brocoli, carottes'),
    ('Salade quinoa avocat',330,18,'light','Quinoa, avocat, tomates, mais'),
    ('Yaourt grec granola',290,20,'light','Yaourt grec, granola, banane'),
    ('Soupe poulet nouilles',280,26,'light','Poulet, nouilles, carottes, celeri'),
    ('Salade lentilles feta',310,22,'light','Lentilles, feta, tomates, oignon rouge'),
    ('Tartare de saumon',300,28,'light','Saumon, citron vert, avocat, aneth'),
    ('Galette sarrasin oeuf',290,22,'light','Galette sarrasin, oeuf, jambon, salade'),
    ('Bowl leger oeuf salade verte',300,28,'light','Oeuf, salade verte, citron, huile d''olive'),
    ('Bowl leger cabillaud epinards',310,35,'light','Cabillaud, epinards, citron, huile d''olive'),
    ('Bowl leger thon roquette',280,26,'light','Thon, roquette, citron, huile d''olive'),
    ('Bowl leger poulet courgettes',340,21,'light','Poulet, courgettes, citron, huile d''olive'),
    ('Bowl leger tofu salade verte',210,35,'light','Tofu, salade verte, citron, huile d''olive'),
    ('Bowl leger thon salade verte',330,22,'light','Thon, salade verte, citron, huile d''olive'),
    ('Bowl leger dinde brocoli',260,32,'light','Dinde, brocoli, citron, huile d''olive'),
    ('Bowl leger dinde courgettes',260,21,'light','Dinde, courgettes, citron, huile d''olive'),
    ('Bowl leger dinde concombre',370,36,'light','Dinde, concombre, citron, huile d''olive'),
    ('Bowl leger tofu epinards',250,30,'light','Tofu, epinards, citron, huile d''olive'),
    ('Bowl leger saumon epinards',300,24,'light','Saumon, epinards, citron, huile d''olive'),
    ('Bowl leger crevettes concombre',280,22,'light','Crevettes, concombre, citron, huile d''olive'),
    ('Bowl leger poulet concombre',360,23,'light','Poulet, concombre, citron, huile d''olive'),
    ('Bowl leger saumon courgettes',270,24,'light','Saumon, courgettes, citron, huile d''olive'),
    ('Bowl leger crevettes roquette',310,29,'light','Crevettes, roquette, citron, huile d''olive'),
    ('Bowl leger poulet brocoli',340,29,'light','Poulet, brocoli, citron, huile d''olive'),
    ('Bowl leger dinde roquette',270,23,'light','Dinde, roquette, citron, huile d''olive'),
    ('Bowl leger thon epinards',270,26,'light','Thon, epinards, citron, huile d''olive'),
    ('Bowl leger tofu roquette',380,28,'light','Tofu, roquette, citron, huile d''olive'),
    ('Bowl leger poulet salade verte',360,33,'light','Poulet, salade verte, citron, huile d''olive'),
    ('Bowl leger crevettes salade verte',200,30,'light','Crevettes, salade verte, citron, huile d''olive'),
    ('Bowl leger thon brocoli',270,25,'light','Thon, brocoli, citron, huile d''olive'),
    ('Bowl leger cabillaud courgettes',380,33,'light','Cabillaud, courgettes, citron, huile d''olive'),
    ('Bowl leger thon courgettes',210,31,'light','Thon, courgettes, citron, huile d''olive'),
    ('Bowl leger thon concombre',230,21,'light','Thon, concombre, citron, huile d''olive')
  ) as v(name, kcal, protein, category, ingredients)
  where not exists (select 1 from public.meals m where m.coach_id = p_coach and m.name = v.name);

  insert into public.templates (coach_id, name, duration, data)
  select p_coach, t.name, t.duration, '{}'::jsonb
  from (values ('Prise de muscle 4 jours',90),('Perte de poids 3 jours',90),('Full body 3 jours',90)) as t(name,duration)
  where not exists (select 1 from public.templates tp where tp.coach_id = p_coach and tp.name = t.name);
end $$;


create or replace function public.forma_coach_after_insert()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  perform public.forma_seed_coach_content(new.id);
  return new;
end $$;
drop trigger if exists coach_seed_content on public.coaches;
create trigger coach_seed_content after insert on public.coaches
  for each row execute function public.forma_coach_after_insert();
