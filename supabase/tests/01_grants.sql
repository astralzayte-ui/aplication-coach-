-- Droits (en production Supabase les applique tout seul). Local uniquement.
grant usage on schema public to authenticated, anon;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema public to authenticated, anon;
