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
