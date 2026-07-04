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
create or replace function public.forma_hash_code(p_code text)
returns text
language sql
immutable
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
