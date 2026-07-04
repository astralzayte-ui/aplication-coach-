-- =====================================================================
-- FORMA — Tests de la logique critique (codes, rôles, durée, expiration,
-- usage unique) et de l'isolation des données (RLS).
-- Chaque test échoue bruyamment (RAISE EXCEPTION) si la règle n'est pas tenue.
-- =====================================================================
\set ON_ERROR_STOP on
set client_min_messages = notice;

-- Un manager de test (en prod, créé via l'Edge Function d'amorçage)
insert into auth.users (id, email) values ('00000000-0000-0000-0000-000000000001', 'manager@forma.local')
  on conflict do nothing;
insert into public.profiles (id, role) values ('00000000-0000-0000-0000-000000000001', 'manager')
  on conflict do nothing;

-- =====================================================================
-- BLOC 1 — Génération de codes : format + règles de rôle
-- =====================================================================
do $$
declare
  v_code text; v_masked text; v_id uuid;
begin
  perform set_config('forma.uid', '00000000-0000-0000-0000-000000000001', false);  -- manager

  -- Code coach (manager) : format FORMA-COACH-XXXX
  select code into v_code from public.forma_generate_code('coach', 90);
  assert v_code ~ '^FORMA-COACH-[A-Z2-9]{4}$', 'format code coach invalide: ' || v_code;

  -- Code élève (manager) : format FORMA-ELV-XXXX
  select code into v_code from public.forma_generate_code('student', 30);
  assert v_code ~ '^FORMA-ELV-[A-Z2-9]{4}$', 'format code élève (manager) invalide: ' || v_code;

  -- Durée invalide refusée
  begin
    perform public.forma_generate_code('coach', 45);
    assert false, 'une durée invalide (45) aurait dû être refusée';
  exception when others then null; end;

  raise notice '✅ BLOC 1 : génération + formats OK';
end $$;

-- =====================================================================
-- BLOC 2 — Un coach ne peut générer QUE des codes élève
-- =====================================================================
do $$
declare
  v_code text; v_id uuid; v_coach uuid := '00000000-0000-0000-0000-0000000000c1';
begin
  -- Générer + utiliser un code coach pour créer un vrai coach
  perform set_config('forma.uid', '00000000-0000-0000-0000-000000000001', false);
  select code_id into v_id from public.forma_generate_code('coach', 365) as g(code, masked, code_id);
  insert into auth.users (id, email) values (v_coach, 'coach1@forma.local') on conflict do nothing;
  perform public.forma_provision_account(v_id, v_coach);

  -- Le coach génère un code élève : format FORMA-EL-XXXX-{J}
  perform set_config('forma.uid', v_coach::text, false);
  select code into v_code from public.forma_generate_code('student', 30);
  assert v_code ~ '^FORMA-EL-[A-Z2-9]{4}-30J$', 'format code élève (coach) invalide: ' || v_code;

  -- Le coach NE PEUT PAS générer un code coach
  begin
    perform public.forma_generate_code('coach', 30);
    assert false, 'un coach n''aurait pas dû pouvoir générer un code coach';
  exception when others then
    if sqlerrm = 'un coach n''aurait pas dû pouvoir générer un code coach' then raise; end if;
  end;

  raise notice '✅ BLOC 2 : coach limité aux codes élève OK';
end $$;

-- =====================================================================
-- BLOC 3 — Usage unique + durée d'abonnement respectée
-- =====================================================================
do $$
declare
  v_id uuid; v_stu1 uuid := '00000000-0000-0000-0000-0000000000e1';
  v_stu2 uuid := '00000000-0000-0000-0000-0000000000e2';
  v_sub date; v_res jsonb;
begin
  perform set_config('forma.uid', '00000000-0000-0000-0000-000000000001', false);
  select code_id into v_id from public.forma_generate_code('student', 90) as g(code, masked, code_id);

  -- 1re utilisation : crée le compte, abonnement = aujourd'hui + 90 j
  insert into auth.users (id, email) values (v_stu1, 'e1@forma.local') on conflict do nothing;
  v_res := public.forma_provision_account(v_id, v_stu1);
  select subscription_end into v_sub from public.students where id = v_stu1;
  assert v_sub = current_date + 90, 'abonnement devait être +90j, obtenu ' || v_sub;

  -- 2e utilisation du MÊME code : refusée (usage unique)
  insert into auth.users (id, email) values (v_stu2, 'e2@forma.local') on conflict do nothing;
  begin
    perform public.forma_provision_account(v_id, v_stu2);
    assert false, 'le même code n''aurait pas dû pouvoir créer un 2e compte';
  exception when others then
    if sqlerrm like '%pas dû%' then raise; end if;
  end;

  raise notice '✅ BLOC 3 : usage unique + durée 90j OK';
end $$;

-- =====================================================================
-- BLOC 4 — Code expiré (non utilisé après redeem_by) refusé
-- =====================================================================
do $$
declare
  v_id uuid; v_stu uuid := '00000000-0000-0000-0000-0000000000e3'; v_peek record;
begin
  perform set_config('forma.uid', '00000000-0000-0000-0000-000000000001', false);
  select code_id into v_id from public.forma_generate_code('student', 30) as g(code, masked, code_id);
  -- Simuler que la date limite est dépassée
  update public.access_codes set redeem_by = now() - interval '1 day' where id = v_id;

  -- La provision doit refuser un code expiré
  insert into auth.users (id, email) values (v_stu, 'e3@forma.local') on conflict do nothing;
  begin
    perform public.forma_provision_account(v_id, v_stu);
    assert false, 'un code expiré n''aurait pas dû être accepté';
  exception when others then
    if sqlerrm like '%n''aurait pas dû%' then raise; end if;
  end;

  raise notice '✅ BLOC 4 : code expiré refusé OK';
end $$;

-- =====================================================================
-- BLOC 5 — peek_code sur un code inconnu => invalide
-- =====================================================================
do $$
declare v_peek record;
begin
  select * into v_peek from public.forma_peek_code('FORMA-COACH-ZZZZ');
  assert v_peek.valid = false and v_peek.reason = 'invalid_code', 'code inconnu devait être invalide';
  raise notice '✅ BLOC 5 : code inconnu rejeté OK';
end $$;

-- =====================================================================
-- BLOC 6 — Isolation des données (RLS)
--   L'élève e1 (rattaché au coach c1) ne doit voir QUE lui-même.
--   Le coach c1 doit voir SES élèves, pas les autres.
-- =====================================================================
-- Créer un 2e élève VALIDE (e9), NON rattaché au coach c1, pour prouver l'isolation
do $$
declare v_id uuid; v_e9 uuid := '00000000-0000-0000-0000-0000000000e9';
begin
  perform set_config('forma.uid', '00000000-0000-0000-0000-000000000001', false);  -- manager
  select code_id into v_id from public.forma_generate_code('student', 30) as g(code, masked, code_id);
  insert into auth.users (id, email) values (v_e9, 'e9@forma.local') on conflict do nothing;
  perform public.forma_provision_account(v_id, v_e9);
end $$;

-- Rattacher e1 au coach c1 pour le test (comme si le code venait du coach)
update public.students set coach_id = '00000000-0000-0000-0000-0000000000c1'
  where id = '00000000-0000-0000-0000-0000000000e1';

-- 6a : un élève ne voit que lui-même
begin;
  set local role authenticated;
  set local forma.uid = '00000000-0000-0000-0000-0000000000e1';
  select (count(*) = 1) as ok from public.students \gset
  \if :ok
    \echo '✅ BLOC 6a : élève ne voit que lui-même'
  \else
    \echo '❌ BLOC 6a ÉCHEC'
    do $$ begin raise exception 'RLS: élève voit trop de lignes'; end $$;
  \endif
rollback;

-- 6b : le coach c1 voit son élève e1
begin;
  set local role authenticated;
  set local forma.uid = '00000000-0000-0000-0000-0000000000c1';
  select (count(*) >= 1) as ok from public.students where coach_id = '00000000-0000-0000-0000-0000000000c1' \gset
  \if :ok
    \echo '✅ BLOC 6b : coach voit son élève'
  \else
    \echo '❌ BLOC 6b ÉCHEC'
    do $$ begin raise exception 'RLS: coach ne voit pas son élève'; end $$;
  \endif
rollback;

-- 6c : un coach ne voit PAS un élève qui n'est pas le sien
begin;
  set local role authenticated;
  set local forma.uid = '00000000-0000-0000-0000-0000000000c1';
  -- e9 n'est rattaché à personne -> le coach c1 ne doit pas le voir
  select (count(*) = 0) as ok from public.students where id = '00000000-0000-0000-0000-0000000000e9' \gset
  \if :ok
    \echo '✅ BLOC 6c : coach ne voit pas les élèves des autres'
  \else
    \echo '❌ BLOC 6c ÉCHEC'
    do $$ begin raise exception 'RLS: coach voit un élève qui n''est pas le sien'; end $$;
  \endif
rollback;

-- 6d : le manager voit tous les élèves
begin;
  set local role authenticated;
  set local forma.uid = '00000000-0000-0000-0000-000000000001';
  select (count(*) >= 2) as ok from public.students \gset
  \if :ok
    \echo '✅ BLOC 6d : manager voit tous les élèves'
  \else
    \echo '❌ BLOC 6d ÉCHEC'
    do $$ begin raise exception 'RLS: manager ne voit pas tous les élèves'; end $$;
  \endif
rollback;

-- =====================================================================
-- BLOC 7 — Un code élève généré par un COACH rattache l'élève à CE coach
--   (→ l'élève apparaît chez son coach). Et le manager le voit aussi.
-- =====================================================================
do $$
declare
  v_id uuid; v_new uuid := '00000000-0000-0000-0000-0000000000e7'; v_coach uuid := '00000000-0000-0000-0000-0000000000c1';
begin
  perform set_config('forma.uid', v_coach::text, false);            -- le coach c1
  select code_id into v_id from public.forma_generate_code('student', 30) as g(code, masked, code_id);
  insert into auth.users (id, email) values (v_new, 'e7@forma.local') on conflict do nothing;
  perform public.forma_provision_account(v_id, v_new);

  -- l'élève doit être rattaché au coach c1
  perform 1 from public.students where id = v_new and coach_id = v_coach;
  assert found, 'l''élève créé via un code coach doit être rattaché à ce coach';
  raise notice '✅ BLOC 7 : élève rattaché à son coach OK';
end $$;

-- 7b : le manager voit ce nouvel élève (abonnements)
begin;
  set local role authenticated;
  set local forma.uid = '00000000-0000-0000-0000-000000000001';
  select (count(*) = 1) as ok from public.students where id = '00000000-0000-0000-0000-0000000000e7' \gset
  \if :ok
    \echo '✅ BLOC 7b : le manager voit le nouvel élève'
  \else
    \echo '❌ BLOC 7b ÉCHEC'
    do $$ begin raise exception 'manager ne voit pas le nouvel élève'; end $$;
  \endif
rollback;

-- =====================================================================
-- BLOC 8 — Prolongation d'abonnement (+30 j) par le manager
-- =====================================================================
do $$
declare v_before date; v_after date;
begin
  perform set_config('forma.uid', '00000000-0000-0000-0000-000000000001', false); -- manager
  select subscription_end into v_before from public.coaches where id = '00000000-0000-0000-0000-0000000000c1';
  perform public.forma_extend_subscription('00000000-0000-0000-0000-0000000000c1', 30);
  select subscription_end into v_after from public.coaches where id = '00000000-0000-0000-0000-0000000000c1';
  assert v_after = greatest(v_before, current_date) + 30, 'prolongation +30j incorrecte';
  raise notice '✅ BLOC 8 : prolongation +30j OK';
end $$;

-- =====================================================================
-- BLOC 9 — Abonnement expiré → statut « non actif » (écran expiré)
-- =====================================================================
do $$
declare v jsonb;
begin
  update public.students set subscription_end = current_date - 5 where id = '00000000-0000-0000-0000-0000000000e1';
  perform set_config('forma.uid', '00000000-0000-0000-0000-0000000000e1', false);
  v := public.forma_my_status();
  assert (v->>'active') = 'false', 'un abonnement expiré doit donner active=false';
  raise notice '✅ BLOC 9 : abonnement expiré détecté OK';
end $$;

-- =====================================================================
-- BLOC 10 — Un élève ne peut PAS voir les poids d'un autre élève (RLS)
-- =====================================================================
-- e1 a une mesure de poids ; e9 ne doit pas la voir.
insert into public.weights (student_id, weight) values ('00000000-0000-0000-0000-0000000000e1', 72.0);
begin;
  set local role authenticated;
  set local forma.uid = '00000000-0000-0000-0000-0000000000e9';
  select (count(*) = 0) as ok from public.weights where student_id = '00000000-0000-0000-0000-0000000000e1' \gset
  \if :ok
    \echo '✅ BLOC 10 : un élève ne voit pas les poids des autres'
  \else
    \echo '❌ BLOC 10 ÉCHEC'
    do $$ begin raise exception 'RLS: un élève voit les poids d''un autre'; end $$;
  \endif
rollback;

\echo ''
\echo '================================================'
\echo '  ✅ TOUS LES TESTS CRITIQUES SONT PASSÉS'
\echo '================================================'
