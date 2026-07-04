# FORMA — Récapitulatif de livraison

> Document en mots simples : ce qui est fait, ce qui marche, et ce que tu auras
> à préparer de ton côté avant de publier sur l'App Store et le Google Play Store.

## ✅ Ce qui est construit et fonctionne

### Les 3 espaces
- **Manageur** : génération de codes (coach / élève, durée 7/30/90/180/365 j),
  liste des codes, abonnements (coachs et élèves) avec jours restants,
  prolongation +30 j, suppression.
- **Coach** : mes élèves (état + mini-courbe), fiche élève (analyse, bilan,
  objectif modifiable, programme, +30 j, WhatsApp, notes privées, suppression),
  assistant « nouvel élève » en 5 étapes, bibliothèque de repas, modèles,
  messagerie, profil éditable.
- **Élève** : accueil (série, coches du jour), programme, repas, progrès
  (poids, courbe colorée, historique, photos avant/après, chrono de repos,
  rappels + notification de test), messagerie.

### Les règles importantes (vérifiées par des tests automatiques)
- Un **coach** ne peut entrer qu'avec un **code coach du manager**.
- Un **élève** ne peut entrer qu'avec un **code du coach ou du manager**.
- **Durée respectée** : le code fixe la fin d'abonnement ; un code **expiré est refusé**.
- **Usage unique** : un code ne crée qu'un seul compte.
- **« Se souvenir de moi »** garde la session de façon chiffrée ; sinon reconnexion.
- Quand un élève se connecte, il **apparaît aussitôt chez son coach et le manager**.
- **Abonnement expiré** → message clair, pas de plantage.

### Sécurité
- Toute la validation (codes, rôles, durées, accès) est faite **côté serveur**.
- **Chacun ne voit que ses données** (règle imposée par la base de données).
- **Codes hachés**, **aucune clé secrète dans l'app**, **limite d'essais** anti-piratage.

### Obligations stores (Apple / Google)
- **Suppression de compte** depuis l'app, **export de données**, **consentement**
  et **politique de confidentialité** intégrés (RGPD).

### Multilingue
- **FR / EN / ES / AR**, arabe de droite à gauche.

## 🧪 Ce que j'ai testé moi-même
- **14 tests automatiques** sur une vraie base de données → tous verts
  (formats de codes, règles de rôles, usage unique, durée, expiration,
  cloisonnement des données, rattachement élève→coach, prolongation).
- **Vérification du code** (typecheck) : 0 erreur.
- **Compilation réelle de l'app** pour **iPhone ET Android** : réussie.

> Note honnête : les tests « bout en bout » sur un vrai téléphone se feront une
> fois le serveur Supabase créé (étape ci-dessous). Toute la logique sensible est
> déjà testée sur une vraie base de données.

## 📋 Ce que TU auras à préparer (je te guiderai pas à pas)
1. Un **compte Supabase** (gratuit) — pour héberger la base de données.
2. Un **compte Apple Developer** (99 $/an) — obligatoire pour publier sur iPhone.
3. Un **compte Google Play Console** (25 $ une seule fois) — pour Android.
4. Un **compte Expo** (gratuit) — pour fabriquer l'app.
5. Un **logo** (image carrée) et éventuellement quelques **captures d'écran**.
   (Si tu n'en as pas, on partira d'un logo simple pour commencer.)

Rien à faire maintenant : garde juste ça en tête. Je t'expliquerai chaque
inscription, une action à la fois, quand tu me diras **« c'est opey »**.

## 🚀 Prochaine étape
Quand tu écris **« c'est opey »**, je te guide pour :
1. créer le serveur Supabase et y installer la base,
2. relier l'app au serveur,
3. fabriquer l'app et la publier sur l'App Store puis le Google Play Store,
en t'expliquant **très simplement, une étape à la fois**.
