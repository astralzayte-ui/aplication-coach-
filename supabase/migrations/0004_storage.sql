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
