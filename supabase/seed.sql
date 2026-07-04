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
