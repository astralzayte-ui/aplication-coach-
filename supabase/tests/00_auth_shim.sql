-- =====================================================================
-- Shim LOCAL uniquement (tests) : imite le système de comptes de Supabase.
-- En production, Supabase fournit déjà le schéma `auth`, la table auth.users
-- et la fonction auth.uid(). Ce fichier n'est JAMAIS déployé — il sert
-- seulement à tester les migrations sur un Postgres nu.
-- =====================================================================
create extension if not exists pgcrypto;

create schema if not exists auth;

create table if not exists auth.users (
  id    uuid primary key default gen_random_uuid(),
  email text unique
);

-- auth.uid() : en test, on lit une variable de session `forma.uid`
create or replace function auth.uid()
returns uuid language sql stable as $$
  select nullif(current_setting('forma.uid', true), '')::uuid;
$$;

-- Rôles applicatifs de Supabase (les requêtes clientes tournent en `authenticated`)
do $$ begin create role authenticated nologin; exception when duplicate_object then null; end $$;
do $$ begin create role anon          nologin; exception when duplicate_object then null; end $$;
grant usage on schema auth to authenticated, anon;
grant select on auth.users to authenticated;
