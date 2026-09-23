---
name: nouveau-client
description: Onboarding complet d'un nouveau client de l'agence (réseaux sociaux, WhatsApp IA, site web). Utiliser dès que l'utilisateur dit « nouveau client », « j'ai un client », ou colle les réponses d'un client au questionnaire.
---

# Nouveau client

But : l'utilisateur fait le minimum (≈ 20 min par client, en 2 blocs de 10 min). Claude fait tout le reste.
Donner des durées réalistes, jamais gonflées.

## Étape 1 — Questionnaire (utilisateur : 1 min)
Donner à l'utilisateur le message prêt à copier de `clients/_modele/message-client.md`,
adapté si on connaît déjà le nom / le secteur. Il l'envoie au client sur WhatsApp.

## Étape 2 — Réponses du client (utilisateur : 1 min)
L'utilisateur colle les réponses (texte, ou capture d'écran) dans la conversation. Claude :
1. Crée `clients/<slug>/profil.md` depuis `clients/_modele/profil.md`. Laisser `À COMPLÉTER` pour ce qui manque
   et lister en une fois les questions manquantes (jamais au compte-gouttes).
2. Si le secteur n'a pas de skill `.claude/skills/secteur-<secteur>/` : le créer
   (recherche web, analyse de 5-10 comptes concurrents performants, vidéos YouTube d'experts → règles concrètes,
   accroches, formats, horaires, hashtags, 5 scripts UGC types).
3. Commit + push.

## Étape 3 — Actions de l'utilisateur (≈ 15 min, une fois l'acompte reçu)
Lui donner cette checklist, pré-remplie avec le nom du client :
- [ ] Acheter la puce (le numéro sert à tout : comptes + WhatsApp IA).
- [ ] Comptes : si le client a déjà des comptes actifs avec des abonnés → se faire ajouter admin
      (Meta Business Suite pour Instagram/Facebook, identifiants seulement pour TikTok).
      Sinon → créer Instagram (pro), Page Facebook, TikTok avec la puce. (~9 min)
- [ ] Relier les comptes à Buffer. (~2 min)
- [ ] Ajouter le numéro dans WhatsApp (API) sur Meta Business et valider le code SMS. (~3 min)
- [ ] Acheter le nom de domaine choisi. (~2 min)
Claude ne peut pas créer les comptes lui-même (vérification SMS + captchas).

## Étape 4 — Claude livre (automatique)
- Fiche du client branchée au robot WhatsApp (prix, horaires, FAQ, ton, transfert au gérant).
- Site web : codé à partir du profil, mis en ligne sur le domaine.
- 1re semaine de contenu : scripts UGC → vidéos (Higgsfield) → légendes → programmation (Buffer / TikTok).
- Mettre à jour `clients/<slug>/calendrier.md`.

## Étape 5 — Récap (1 message)
Envoyer à l'utilisateur : ce qui est en ligne (liens), ce qui reste à faire de son côté (idéalement rien),
et un message prêt à transférer au client (« votre site est en ligne, testez votre WhatsApp : … »).

## Contenu hebdomadaire (routine automatique)
Une fois le client lancé, créer une routine (scheduled trigger) : chaque dimanche 20h (heure du Maroc) :
1. Lire `profil.md`, le skill du secteur, et les stats de la semaine passée.
2. Remplir la semaine suivante dans `clients/<slug>/calendrier.md` (depuis `clients/_modele/calendrier.md`).
3. Générer les vidéos UGC (Higgsfield) + légendes + hashtags par réseau.
4. Si le client est en mode « validation » : envoyer l'aperçu à l'utilisateur et attendre « OK ».
   Sinon : programmer directement dans Buffer à l'heure prévue (stories comprises si Buffer les publie
   pour ce compte, sinon rappel de publication).
5. Commit + push, puis un récap court à l'utilisateur.

## Stratégie de test (test & learn)
Chaque semaine, le calendrier suit la règle 70 / 30 :
- 70 % des posts reprennent ce qui a déjà gagné (meilleure accroche, format, heure).
- 30 % testent UNE seule variable à la fois, pour savoir ce qui a fait la différence :
  accroche (question / chiffre / avant-après / témoignage) · format (UGC face caméra, visite du lieu, coulisses, offre)
  · durée (7-15 s vs 30-45 s) · heure de publication · musique tendance vs voix off.
Semaines 1-2 (aucune donnée) : tester large, en partant des règles du skill du secteur.

Mesure : 48 h après chaque post, relever vues, taux de visionnage complet, partages, enregistrements, messages reçus
(stats publiques via scrape_reseaux + stats Buffer). Critère principal : messages WhatsApp / réservations, puis partages et enregistrements.
Noter chaque test dans `clients/<slug>/tests.md` (hypothèse → résultat → décision). Une variante gagne si elle fait ≥ 30 % de mieux
sur 2 posts minimum. Les enseignements valables pour tout le secteur remontent dans le skill du secteur.
