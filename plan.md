# Plan de lancement — suivi

Statuts : ✅ fait · 🔄 en cours · ⬜ à faire · ⏸ en attente

## Étape 0 — Cerveau de l'agence ✅
- ✅ Skill `lancement-produit` (e-commerce) à jour — géré dans les skills du compte claude.ai
- ✅ Dépôt, fiches clients, skills, stratégie de test, coûts (`couts.md`)

## Étape 1 — Outils de l'agence (toi, ~15 min, une fois — servent à tous les clients)
Guide pas à pas : `guides/etape-1-outils.md`
- ⬜ Meta Business
- ⬜ Cloudflare
- ⬜ Clé Gemini API (ne jamais la coller dans la conversation)
- ⬜ Buffer (gratuit)
- ⏸ Higgsfield Plus (au 1er client payant)

## Étape 2 — Démos (moi, puis toi ~10 min pour brancher)
- ⬜ Démo WhatsApp IA (faux spa, écrit + vocal, français + arabe)
- ⬜ Démo site du faux spa
- ⬜ Vidéo de présentation FR (script : `prospection/video-demo.md`)
- ⬜ Vidéo de présentation arabe classique

## Étape 3 — Prospection (toi)
- ✅ Accès Google Drive testé (compte astralzayte@gmail.com)
- ✅ Lien client (vérifié, version V3) : https://docs.google.com/forms/d/e/1FAIpQLSdi8TdPCkn8NXu9gUG9mdvEtbMgEiSgeX3q3PuiUMrK3mrKTQ/viewform
- ✅ Formulaire mis à jour (numéro WhatsApp obligatoire + nouveau message de fin)
- ✅ Google Form créé : https://docs.google.com/forms/d/1ldDv-l5HZtRyAnomwYz6TWRs56snThL90FLpsl73_jQ/edit · Réponses : Google Sheet id 1bL_39qJ3cPVC8J0j0wiW8Wm4OXotvLpkU6s91tEtioE
- ✅ Nom : **Sahir Digital** (ساهر ديجيتال) — ⬜ vérifier dispo (OMPIC, nom de domaine, Instagram)
- ✅ Prix validés (questionnaire `clients/_modele/message-client.md`)
- ⬜ Pitch appris (`prospection/pitch.md`)
- ⬜ 1er commerce démarché

## Étape 4 — Premier client (skill `nouveau-client`)
- ⬜ Questionnaire envoyé (lien client : voir Étape 3) → services cochés → acompte 400 DH
- ⬜ Étude de marché · fiche client · puce + comptes · site · WhatsApp IA · 1re semaine de contenu

## Étape 5 — Pilote automatique
- ⬜ Routine du dimanche 20h activée · test & learn en place

## À rappeler à l'utilisateur (à chaque « on en est où »)
- 👉 PROCHAINE ÉTAPE PRIORITAIRE : faire la vidéo de démo universelle (plus pro). Prompts : `prospection/prompts-video-demo.md`. Il faut des crédits Higgsfield.
- Script d'appel universel (le même pour tous) : `prospection/script-appel-universel.md`
- Positionnement : Sahir Digital cherche des CLIENTS (prestataire), pas un employeur. À développer plus tard.
- Plus tard : liste des sites où poster ses annonces + publication automatique
- Prospection en ligne : `prospection/approche-en-ligne.md` (fiche prospects + lien WhatsApp 1 clic)
- Pitch appel + message : `prospection/pitch-appel-message.md`
- ✅ Fiche prospects automatique (V3, sans emoji, lien WhatsApp = audit complet) : Google Sheet « Sahir Digital — Prospects » id 1rdMYXguMDDb9hl84ina2mNt6FZQiOxEbpVnBj6T8LEo. Cible : SALONS DE BEAUTÉ uniquement (pas de barbiers, on ne mélange pas). 30 prospects chargés le 24/09.
  Ajout de lignes : POST JSON {token, rows:[…]} sur https://script.google.com/macros/s/AKfycbye2-0QXlh9jogL7HdK25HZ6OB_kPvBx8rJ-SNhXiYuxJa1ppwUz_kLjHsBMaZ6nQsUQg/exec (curl -L).
  Le jeton est dans le Google Doc « Sahir Digital — Script fiche prospects » (id 1s69VElVoQkIcKPw72ppG76a0U82hmgUa86uuca0KoUA), jamais dans le dépôt.
  Lot quotidien : Apify compass/crawler-google-places (Marrakech, 15 avis, contacts) → outils/lot_prospects.py → POST.
  Routine : trig_015zQEr54xvSjHyenvT9m2xF, chaque jour 8h30 UTC (9h30 Maroc), message avec les liens avant 10h, dans cette session.
  Script d'appel V2 (court) : Google Doc 1gcgQ0fnpw9G7hppIa45bYbJgdfRVA28s9wH6y6trsTg. Présentation : Google Doc 1Ib7KM6cMAuo_6Q2Pp096CxbSuRZkf1JmQMU5BCmGVFU.
  Recherches déjà utilisées : salon de beauté, salon de coiffure, onglerie, barber shop (Marrakech) ; 2026-09-24 : salon de beauté Guéliz, institut de beauté Daoudiate, onglerie Targa (30 ajoutés : 22 chauds, 8 tièdes). ; 2026-09-25 : salon de beauté Hivernage, salon de coiffure femme Massira, institut esthétique Semlalia (26 ajoutés : 16 chauds, 10 tièdes). ; 2026-09-26 : hammam spa Marrakech, salon de beauté Mhamid, prothésiste ongulaire Marrakech, salon de coiffure femme Azzouzia, institut de beauté Agdal, salon de beauté Palmeraie (27 ajoutés : 15 chauds, 12 tièdes). ATTENTION : quota Apify du mois atteint le 26/09.
- ✅ Lot 1 (2026-09-24) : 30 salons de beauté Marrakech → Google Sheet id 1MD8DD3JzoKP715BueMNAPgetPDRcKfaMbJ2fApT_ezw (11 chauds, 16 tièdes, 3 froids). Données prospects hors du dépôt (public).
- ✅ Lot 2 (2026-09-24) : 30 coiffure/onglerie/barbiers → Google Sheet id 1zPOd33juHGA8ZmpCNfX1nNZG2fKuqg7ckNt_jp_cicA (12 chauds, 18 tièdes). Les lots n'incluent plus les FROIDS.
- ⚠️ Le dépôt GitHub est PUBLIC : le passer en privé avant d'y mettre des données clients
- Brancher Gemini (lecture native des vidéos + recherche web) — il a des vidéos tuto
- Installer un connecteur de lecture native TikTok / Instagram (pour mieux scraper)
- Faire scraper Internet (outil à ajouter, vidéos tuto)
- Site du faux spa (validé : on le fait)
- Vidéos de présentation FR + arabe classique
- IA messages privés (vérifié le 2026-09-23) :
  - Instagram ✅ API officielle Meta, même serveur que WhatsApp. Compte pro relié à une Page Facebook. Le client doit écrire en premier, réponse sous 24 h. Validation de l'app par Meta (App Review) nécessaire pour gérer les comptes des clients.
  - TikTok ❌ abandonné (décision 2026-09-23 : on reste sur Instagram). Pour info : API Business Messaging en ligne, mais accès seulement via des partenaires agréés (SleekFlow, respond.io, ManyChat, MessageGate), donc payant. Disponibilité au Maroc à vérifier. Gratuit en natif : message de bienvenue + réponses par mots-clés (pas d'IA).

## Décisions en attente
- Vérifier la disponibilité du nom Sahir Digital
