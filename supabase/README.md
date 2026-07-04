# Backend FORMA (Supabase)

Ce dossier contient **toute la partie serveur** : base de données, sécurité et
fonctions serveur. Tu n'as rien à installer toi-même pour l'instant — je te
guiderai pas à pas plus tard. Voici ce qu'il contient, pour mémoire.

## Contenu
- `migrations/0001_schema.sql` — les tables (comptes, coachs, élèves, codes, repas, messages…).
- `migrations/0002_rls.sql` — la **sécurité par ligne** : chacun ne voit que ses données.
- `migrations/0003_functions.sql` — la **logique des codes** (générer / vérifier / utiliser), l'abonnement, le RGPD.
- `functions/redeem-code/` — la porte d'entrée : transforme un code en session connectée (côté serveur).
- `functions/delete-account/` — suppression définitive du compte (exigence Apple + RGPD).
- `seed.sql` — codes de démonstration pour tester tout de suite.
- `tests/` — les tests automatiques qui prouvent que les règles marchent.

## Lancer les tests (vérifie la logique critique)
```bash
supabase/tests/run.sh
```
Sortie attendue : « ✅ TOUS LES TESTS CRITIQUES SONT PASSÉS ».

## Déploiement (plus tard, ensemble)
1. Créer un projet sur supabase.com.
2. Appliquer les migrations (`supabase db push`) puis `seed.sql`.
3. Déployer les fonctions (`supabase functions deploy redeem-code delete-account`).
4. Régler les variables secrètes (clé de service, code manager) — **jamais dans l'app**.

## Codes de démonstration
- Manager : `2006117`
- Coach : `FORMA-COACH-DEMO`
- Élève : `FORMA-ELV-DEMO`
