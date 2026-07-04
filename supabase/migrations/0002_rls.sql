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
