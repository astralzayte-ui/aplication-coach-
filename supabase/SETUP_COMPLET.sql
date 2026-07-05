-- ================================================================
-- FORMA — Installation complète de la base (à coller dans Supabase)
-- Généré automatiquement : migrations 0001→0004 + données de démo.
-- ================================================================

-- >>> supabase/migrations/0001_schema.sql
-- =====================================================================
-- FORMA — Schéma de base de données (tables)
-- PostgreSQL / Supabase
-- =====================================================================
-- Ce fichier crée les tables. La sécurité (qui voit quoi) est dans 0002_rls.sql.
-- La logique des codes (générer / utiliser / vérifier) est dans 0003_functions.sql.

create extension if not exists pgcrypto;      -- pour le hachage (digest) et gen_random_uuid

-- ---------------------------------------------------------------------
-- Types
-- ---------------------------------------------------------------------
do $$ begin
  create type user_role as enum ('manager', 'coach', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type code_role as enum ('coach', 'student');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- profiles : une ligne par compte (relié au système de comptes Supabase auth.users)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role   not null,
  locale      text        not null default 'fr',
  consent_at  timestamptz,                 -- consentement RGPD (null = pas encore consenti)
  created_at  timestamptz not null default now(),
  deleted_at  timestamptz                  -- suppression douce (RGPD)
);

-- ---------------------------------------------------------------------
-- coaches : infos propres au coach (visibles par le manager)
-- ---------------------------------------------------------------------
create table if not exists public.coaches (
  id                uuid primary key references public.profiles(id) on delete cascade,
  name              text,
  whatsapp          text,
  city              text default '—',
  subscription_end  date not null,
  setup_done        boolean not null default false,   -- formulaire nom+WhatsApp rempli ?
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- students : infos propres à l'élève (visibles par SON coach et le manager)
-- ---------------------------------------------------------------------
create table if not exists public.students (
  id                uuid primary key references public.profiles(id) on delete cascade,
  coach_id          uuid references public.coaches(id) on delete set null,
  prenom            text,
  weight            numeric(5,1),
  height            integer,               -- cm
  whatsapp          text,
  objective         text not null default 'muscle',   -- muscle | masse | perte | poids
  subscription_end  date not null,
  streak            integer not null default 0,
  onboarding_done   boolean not null default false,
  created_at        timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- access_codes : les codes générés par le manager (coach/élève) ou par un coach (élève)
--   - code_hash   : empreinte SHA-256 du code (JAMAIS le code en clair) → sert à la vérification
--   - code_masked : version masquée pour l'affichage (ex. FORMA-COACH-••X9)
--   - duration_days : durée d'abonnement accordée quand le code est utilisé
--   - redeem_by   : date limite pour UTILISER le code (sécurité : un code non utilisé expire)
--   - used        : usage unique (création de compte) — passe à true à la 1re utilisation
-- ---------------------------------------------------------------------
create table if not exists public.access_codes (
  id              uuid primary key default gen_random_uuid(),
  code_hash       text not null unique,
  code_masked     text not null,
  role            code_role not null,
  duration_days   integer not null check (duration_days in (7, 30, 90, 180, 365)),
  created_by      uuid references public.profiles(id) on delete set null,
  created_by_role user_role not null,       -- 'manager' ou 'coach'
  used            boolean not null default false,
  used_by         uuid references public.profiles(id) on delete set null,
  used_at         timestamptz,
  revoked         boolean not null default false,
  redeem_by       timestamptz not null,     -- après cette date, le code non utilisé est refusé
  created_at      timestamptz not null default now()
);
create index if not exists access_codes_created_by_idx on public.access_codes(created_by);
create index if not exists access_codes_used_by_idx     on public.access_codes(used_by);

-- ---------------------------------------------------------------------
-- weights : historique de poids / mensurations de l'élève
-- ---------------------------------------------------------------------
create table if not exists public.weights (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  measured_on date not null default current_date,
  weight      numeric(5,1) not null,
  waist       integer,
  created_at  timestamptz not null default now()
);
create index if not exists weights_student_idx on public.weights(student_id, measured_on);

-- ---------------------------------------------------------------------
-- daily_checks : coches quotidiennes (entraînement / repas)
-- ---------------------------------------------------------------------
create table if not exists public.daily_checks (
  id          uuid primary key default gen_random_uuid(),
  student_id  uuid not null references public.students(id) on delete cascade,
  check_date  date not null default current_date,
  training    boolean not null default false,
  meal        boolean not null default false,
  unique (student_id, check_date)
);

-- ---------------------------------------------------------------------
-- programs : programme assigné à un élève (jsonb) + templates réutilisables du coach
-- ---------------------------------------------------------------------
create table if not exists public.student_programs (
  student_id  uuid primary key references public.students(id) on delete cascade,
  data        jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

create table if not exists public.templates (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid not null references public.coaches(id) on delete cascade,
  name        text not null,
  duration    integer,
  data        jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists templates_coach_idx on public.templates(coach_id);

-- ---------------------------------------------------------------------
-- meals : bibliothèque de repas du coach
-- ---------------------------------------------------------------------
create table if not exists public.meals (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid not null references public.coaches(id) on delete cascade,
  name        text not null,
  kcal        integer,
  protein     integer,
  category    text not null default 'caloric',  -- caloric | light
  ingredients text,
  created_at  timestamptz not null default now()
);
create index if not exists meals_coach_idx on public.meals(coach_id);

-- ---------------------------------------------------------------------
-- messages : messagerie coach <-> élève
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id          uuid primary key default gen_random_uuid(),
  coach_id    uuid not null references public.coaches(id) on delete cascade,
  student_id  uuid not null references public.students(id) on delete cascade,
  sender_role user_role not null,           -- 'coach' ou 'student'
  body        text not null,
  created_at  timestamptz not null default now()
);
create index if not exists messages_thread_idx on public.messages(coach_id, student_id, created_at);

-- ---------------------------------------------------------------------
-- coach_notes : notes privées du coach sur un élève (l'élève ne les voit pas)
-- ---------------------------------------------------------------------
create table if not exists public.coach_notes (
  coach_id    uuid not null references public.coaches(id) on delete cascade,
  student_id  uuid not null references public.students(id) on delete cascade,
  body        text not null default '',
  updated_at  timestamptz not null default now(),
  primary key (coach_id, student_id)
);

-- ---------------------------------------------------------------------
-- photos : photos avant/après (le fichier est dans Supabase Storage ; ici on garde le chemin)
-- ---------------------------------------------------------------------
create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  student_id   uuid not null references public.students(id) on delete cascade,
  kind         text not null default 'before',   -- before | after
  storage_path text not null,
  taken_at     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- push_tokens : jetons de notification push par appareil
-- ---------------------------------------------------------------------
create table if not exists public.push_tokens (
  user_id    uuid not null references public.profiles(id) on delete cascade,
  token      text not null,
  platform   text,
  created_at timestamptz not null default now(),
  primary key (user_id, token)
);

-- ---------------------------------------------------------------------
-- login_attempts : anti-abus (limite d'essais sur les codes)
-- ---------------------------------------------------------------------
create table if not exists public.login_attempts (
  id          uuid primary key default gen_random_uuid(),
  ip          text,
  code_masked text,
  success     boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists login_attempts_ip_idx on public.login_attempts(ip, created_at);

-- >>> supabase/migrations/0002_rls.sql
-- =====================================================================
-- FORMA — Sécurité par ligne (Row Level Security)
-- =====================================================================
-- Règle d'or : chaque utilisateur ne voit et ne modifie QUE ses données.
--   - un élève ne voit que lui-même ;
--   - un coach ne voit que SES élèves ;
--   - le manager voit les coachs et les élèves (abonnements).
-- Ces règles sont appliquées par la base de données : impossible à contourner
-- depuis l'application.

-- ---------------------------------------------------------------------
-- Fonctions d'aide (SECURITY DEFINER = elles lisent profiles sans re-déclencher
-- la sécurité par ligne, ce qui évite les boucles infinies)
-- ---------------------------------------------------------------------
create or replace function public.forma_current_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.forma_is_manager()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select role = 'manager' from public.profiles where id = auth.uid()), false);
$$;

create or replace function public.forma_is_coach_of(p_student uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.students s where s.id = p_student and s.coach_id = auth.uid()
  );
$$;

create or replace function public.forma_my_coach_id()
returns uuid language sql stable security definer set search_path = public as $$
  select coach_id from public.students where id = auth.uid();
$$;

-- ---------------------------------------------------------------------
-- Activer RLS partout
-- ---------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.coaches         enable row level security;
alter table public.students        enable row level security;
alter table public.access_codes    enable row level security;
alter table public.weights         enable row level security;
alter table public.daily_checks    enable row level security;
alter table public.student_programs enable row level security;
alter table public.templates       enable row level security;
alter table public.meals           enable row level security;
alter table public.messages        enable row level security;
alter table public.coach_notes     enable row level security;
alter table public.photos          enable row level security;
alter table public.push_tokens     enable row level security;
alter table public.login_attempts  enable row level security;

-- ---------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.forma_is_manager());
create policy profiles_update on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------------------------------------------------------------------
-- coaches : le coach voit/édite sa fiche ; le manager voit tout ;
--           un élève peut lire la fiche de SON coach (nom pour la messagerie)
-- ---------------------------------------------------------------------
create policy coaches_select on public.coaches for select
  using (id = auth.uid() or public.forma_is_manager() or id = public.forma_my_coach_id());
create policy coaches_update on public.coaches for update
  using (id = auth.uid() or public.forma_is_manager())
  with check (id = auth.uid() or public.forma_is_manager());
create policy coaches_delete on public.coaches for delete
  using (id = auth.uid() or public.forma_is_manager());

-- ---------------------------------------------------------------------
-- students : l'élève voit/édite sa fiche ; SON coach la voit/édite ; le manager voit tout
-- ---------------------------------------------------------------------
create policy students_select on public.students for select
  using (id = auth.uid() or coach_id = auth.uid() or public.forma_is_manager());
create policy students_update on public.students for update
  using (id = auth.uid() or coach_id = auth.uid() or public.forma_is_manager())
  with check (id = auth.uid() or coach_id = auth.uid() or public.forma_is_manager());
create policy students_delete on public.students for delete
  using (id = auth.uid() or coach_id = auth.uid() or public.forma_is_manager());

-- ---------------------------------------------------------------------
-- access_codes : on ne voit QUE les codes qu'on a soi-même générés
--   (le manager voit ses codes ; un coach voit les codes élèves qu'il a créés)
--   L'insertion se fait uniquement via forma_generate_code (fonction serveur).
-- ---------------------------------------------------------------------
create policy codes_select on public.access_codes for select
  using (created_by = auth.uid());
create policy codes_update on public.access_codes for update
  using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy codes_delete on public.access_codes for delete
  using (created_by = auth.uid());

-- ---------------------------------------------------------------------
-- weights : propriété de l'élève ; SON coach et le manager peuvent lire
-- ---------------------------------------------------------------------
create policy weights_select on public.weights for select
  using (student_id = auth.uid() or public.forma_is_coach_of(student_id) or public.forma_is_manager());
create policy weights_write on public.weights for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- ---------------------------------------------------------------------
-- daily_checks : idem
-- ---------------------------------------------------------------------
create policy checks_select on public.daily_checks for select
  using (student_id = auth.uid() or public.forma_is_coach_of(student_id) or public.forma_is_manager());
create policy checks_write on public.daily_checks for all
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

-- ---------------------------------------------------------------------
-- student_programs : l'élève lit son programme ; SON coach lit et écrit
-- ---------------------------------------------------------------------
create policy programs_select on public.student_programs for select
  using (student_id = auth.uid() or public.forma_is_coach_of(student_id));
create policy programs_write on public.student_programs for all
  using (public.forma_is_coach_of(student_id))
  with check (public.forma_is_coach_of(student_id));

-- ---------------------------------------------------------------------
-- templates : propriété du coach
-- ---------------------------------------------------------------------
create policy templates_all on public.templates for all
  using (coach_id = auth.uid()) with check (coach_id = auth.uid());

-- ---------------------------------------------------------------------
-- meals : le coach gère sa bibliothèque ; ses élèves peuvent la lire
-- ---------------------------------------------------------------------
create policy meals_select on public.meals for select
  using (coach_id = auth.uid() or coach_id = public.forma_my_coach_id());
create policy meals_write on public.meals for all
  using (coach_id = auth.uid()) with check (coach_id = auth.uid());

-- ---------------------------------------------------------------------
-- messages : uniquement les deux participants du fil (coach + son élève)
-- ---------------------------------------------------------------------
create policy messages_select on public.messages for select
  using (coach_id = auth.uid() or student_id = auth.uid());
create policy messages_insert on public.messages for insert
  with check (
    (sender_role = 'coach'   and coach_id   = auth.uid()) or
    (sender_role = 'student' and student_id = auth.uid())
  );

-- ---------------------------------------------------------------------
-- coach_notes : PRIVÉ au coach — l'élève ne peut jamais les lire
-- ---------------------------------------------------------------------
create policy notes_all on public.coach_notes for all
  using (coach_id = auth.uid()) with check (coach_id = auth.uid());

-- ---------------------------------------------------------------------
-- photos : propriété de l'élève ; SON coach peut lire
-- ---------------------------------------------------------------------
create policy photos_select on public.photos for select
  using (student_id = auth.uid() or public.forma_is_coach_of(student_id));
create policy photos_write on public.photos for all
  using (student_id = auth.uid()) with check (student_id = auth.uid());

-- ---------------------------------------------------------------------
-- push_tokens : propriété du compte
-- ---------------------------------------------------------------------
create policy push_all on public.push_tokens for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------
-- login_attempts : aucun accès client (géré uniquement par le serveur / service role)
--   RLS activée + aucune policy = tout refus pour anon/authenticated.
-- ---------------------------------------------------------------------

-- >>> supabase/migrations/0003_functions.sql
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

-- >>> supabase/migrations/0004_storage.sql
-- =====================================================================
-- FORMA — Stockage des photos de progression (avant / après)
-- Bucket privé : chaque élève ne peut déposer/lire QUE ses propres photos ;
-- son coach peut les lire. Accès via URL signée temporaire.
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('progress-photos', 'progress-photos', false)
on conflict (id) do nothing;

-- L'élève gère ses fichiers : le chemin commence par son identifiant (uid/...).
create policy "photos_student_insert" on storage.objects for insert to authenticated
  with check (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "photos_student_select" on storage.objects for select to authenticated
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "photos_student_delete" on storage.objects for delete to authenticated
  using (bucket_id = 'progress-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Le coach peut lire les photos de SES élèves (dossier = id d'un de ses élèves).
create policy "photos_coach_select" on storage.objects for select to authenticated
  using (
    bucket_id = 'progress-photos'
    and exists (
      select 1 from public.students s
      where s.id::text = (storage.foldername(name))[1] and s.coach_id = auth.uid()
    )
  );

-- >>> supabase/seed.sql
-- =====================================================================
-- FORMA — Données de démonstration pour testeurs
-- =====================================================================
-- ⚠️  À RETIRER avant la mise en production réelle : ces codes ont un clair
--     connu (pratique pour tester, mais à ne pas laisser en vrai lancement).
--
-- Ces codes n'ont PAS besoin d'un compte existant : un testeur les saisit
-- dans l'app pour créer un vrai compte coach/élève et parcourir tous les écrans.
--
--   Code coach de test   : FORMA-COACH-DEMO   (abonnement 365 j)
--   Code élève de test   : FORMA-ELV-DEMO     (abonnement 90 j)
--
--   Code manager (maître) : 2006117 (géré directement par l'Edge Function)
-- =====================================================================

insert into public.access_codes (code_hash, code_masked, role, duration_days, created_by_role, redeem_by)
values
  (public.forma_hash_code('FORMA-COACH-DEMO'), public.forma_mask_code('FORMA-COACH-DEMO'),
   'coach', 365, 'manager', now() + interval '365 days'),
  (public.forma_hash_code('FORMA-ELV-DEMO'), public.forma_mask_code('FORMA-ELV-DEMO'),
   'student', 90, 'manager', now() + interval '365 days')
on conflict (code_hash) do nothing;

