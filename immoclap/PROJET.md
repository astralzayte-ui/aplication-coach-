# ImmoClap — mémoire du projet (pour Claude, ne pas envoyer au fondateur)

Dernière mise à jour : 08/10/2026. À tenir à jour à chaque décision importante.

## Le fondateur
- Julien Wail COLLY, Marrakech (Lot Zohour Targa, Tranche 20, N° 91, Targa, Marrakech). Né le 07/11/2006.
- Veut des réponses COURTES (skill `adhd`) : répondre à la question posée, rester dessus jusqu'à ce qu'elle soit réglée ou « à plus tard ». Pas de pavés.
- Banque : CIH (Crédit Immobilier et Hôtelier), SWIFT CIHMMAMC, compte en MAD.

## Le produit
- SaaS : photos d'un bien immobilier → vidéo cinématique (mouvements de caméra IA via API Higgsfield, musique, voix off, logo agence, 3 formats 16:9 / 9:16 / 1:1).
- Cible : agences immobilières et propriétaires, France + Maroc.
- Promesse : vidéo en 5 minutes (pas encore chronométré pour de vrai).

## Marque et comptes
- Nom : ImmoClap (ancien nom abandonné : ImmoMotion).
- E-mail : contact.immoclap@gmail.com.
- Réseaux : Instagram / TikTok / YouTube @immoclap ; comptes France Instagram + TikTok @immoclap.fr (créés par sa demi-sœur).
- ⚠️ Les bios disent « 1ère vidéo offerte » → à remplacer (plus d'essai gratuit).
- Bio validée (mêmes sur les 2 Insta, sans drapeaux) : « 🎬 Vos biens immobiliers en vidéo cinématique / 📸 Vos photos → une vidéo en 5 min / 🏠 Pour agences et propriétaires / 👇 Votre 1ère vidéo offerte ». Nom Insta et TikTok : « ImmoClap · Vidéo immobilière ».
- Logo : maison en traits fins + bouton play, « Immo » crème + « Clap » doré. Fichiers : `assets/logo.svg`, `icon.svg`, `favicon.svg`, `photo-profil-reseaux.jpg`.
- Charte : fond #0B0A09 / #181614, crème #F3EFE7, secondaire #B4AA9D, doré #F6BC28 ; titres Newsreader (2e ligne italique soulignée d'un trait doré), texte Inter (polices auto-hébergées `assets/fonts.css`).

## Site
- En ligne : https://immoclap.netlify.app (site Netlify id 564a29fb-0393-4e75-82f5-d82504027713, compte « NovaSites »). Déploiement : zip via API Netlify (le proxy authentifie api.netlify.com).
- Fichiers : `immoclap/index.html` (landing style Reel-E), `cgv.html`, `mentions-legales.html`, `confidentialite.html`, `remboursement.html`, `merci.html`. Pages légales générées par un script (copie dans le scratchpad, `legal.py`) — l'éditeur est rempli, identifiant auto-entrepreneur « en cours d'immatriculation ».
- ⚠️ Netlify (08/10) : déploiements en production bloqués « Account credit usage exceeded » alors que l'API affiche 0/300 crédits utilisés (bug signalé par d'autres sur le forum Netlify). Contournement qui marche : déploiement BROUILLON (POST …/deploys?draft=true avec le zip) puis publication par POST …/deploys/<id>/restore. Chaque déploiement en prod = 15 crédits sur 300/mois : grouper les mises en ligne.
- Préférence du fondateur (08/10) : mettre en ligne SANS demander et lui envoyer le lien direct. Aperçus de travail = déploiements brouillon (gratuits) ; mise en prod groupée en fin de chantier. Zip : exclure seulement les *.json de la racine (garder assets/musique/pistes.json).
- 08/10 : nouvelle version mise en ligne (refonte + finitions + fenêtre de choix du pays Maroc/France → DH/€, clé immoclap_cur partagée site/app).
- Formulaire Netlify « inscription » (e-mail) actif ; détection des formulaires activée. Pas encore de vrais comptes / Google login / paiement.
- Variables d'env Netlify secrètes : HF_API_KEY_ID, HF_API_KEY_SECRET (clé Higgsfield, expire dans 1 an ~ sept. 2027).
- Vidéos de démo réelles (fournies par le fondateur, générées IA) : `assets/videos/villa-marrakech-*` et `penthouse-casablanca-*` (mp4 H.264 + webm VP9, 9x16 avec son, 16x9 sans son). Intégrées : hero en autoplay, bouton « Voir un exemple », cartes Exemples Marrakech/Casablanca, lien sous les tarifs. Le Chromium de test n'a pas H.264 → toujours fournir le webm.
- Photos de démo : `assets/exemples/{marrakech,paris,fes,casablanca,bordeaux}.jpg` (Tanger jamais reçue en fichier).
- Règle : copier le STYLE de Reel-E, jamais leurs textes / images / code. Visuels IA toujours étiquetés « démonstration ». Pas de faux avis.
- 06/10 : à acheter AVANT l'ouverture des paiements (entonnoir) : adhésion à un médiateur de la consommation (quelques dizaines d'€/an, obligatoire pour vendre aux particuliers en France) → puis mettre nom, site et adresse au §15 des CGV (script `scratchpad/site/gen_pages.py`). Comparatif du site : Shoootin « à partir de 219 € » (résidentiel ; Visite guidée 249 € HT), Minutedrone 350 € (montage 220 € à part), Oh My Drone 500 € HT (relevés le 06/10, revérifiés le 08/10) → ces prix restent seulement dans la note sous le tableau (sources). 08/10 (contrôle) : tableau du comparatif refait en 5 critères tirés de NOTRE offre : ce que vous fournissez, voix off FR/AR/EN, musique (vidéaste « incluse ou en option » : Shoootin musique catalogue dès 79 € ou la vôtre sans frais, Oh My Drone musique libre de droits incluse), logo et coordonnées en fin de vidéo, façon de payer (ImmoClap : à la vidéo ou au mois, « Agence : 99 € HT / mois, 10 vidéos », bascule €/DH). Retirés car c'étaient des critères Reel-E sous un autre nom : « Prête pour WhatsApp/Avito… » (= leur « All video formats included ») et « Prix au mois pour une agence » (219–500 € par bien vs dès 9,90 € = leur « Cost per listing »). Règle : aucune ligne de prix par bien, de délai, de rendez-vous, de qualité constante, de formats, de disponibilité ou de retouches (les 7 critères Reel-E). Lignes alignées par subgrid. À propos (gen_pages.py) : phrase fausse « Pas de fonction annoncée avant qu'elle existe » remplacée ; « Où nous en sommes » dit que génération, voix off, comptes et paiement sont en cours de mise en place et qu'aucune commande n'est possible. FAQ « Quand pourrai-je commander » : idem.
- ⚠️ Bios Insta/TikTok (@immoclap, @immoclap.fr) encore « 1ère vidéo offerte » + « 5 min » alors que le site les lie : le fondateur doit les changer (proposition : « 🎬 Vos biens immobiliers en vidéo / 📸 De vos photos à la vidéo en quelques minutes / 🏠 Agences et propriétaires · FR · MA / 👇 Ouverture très bientôt »).

## Prix (crédits + abonnements depuis le 05/10)
- France : 1 vidéo 19 € HT · pack 5 = 79 € · pack 10 = 139 €.
- Maroc : 1 vidéo 149 DH · pack 5 = 599 DH · pack 10 = 999 DH.
- Abonnements affichés sur le site et dans les CGV (05/10) : Solo 39 €/349 DH (3 vidéos/mois), Agence 99 €/899 DH (10 vidéos/mois), sans engagement, prix gardé à vie pour les 100 premiers.
- Suivi d'origine : `?v=xxx` dans l'URL est mémorisé et envoyé avec le formulaire (champ `source`).
- PAS d'essai gratuit (décidé le 05/10) : à la place, bouton « Voir un exemple » qui lit une vraie vidéo de démo. Max 12 photos par vidéo. Crédits valables 12 mois.
- Coût Higgsfield ≈ 5 $ / vidéo (Kling 3.0, 12 plans × 5 s) ; ≈ 2,5 $ avec Kling 2.5.
- Marges nettes calculées (après Lemon Squeezy 5 % + 0,50 $, virement 1 %, impôt AE 1 %, Higgsfield) : France 1 vidéo ≈ 139 DH, pack 10 ≈ 918 DH ; Maroc 1 vidéo ≈ 88 DH, pack 10 ≈ 463 DH.
- Recherche demande (08/10, sources vérifiées) : catégorie « outils marketing immo » = demande prouvée (Danim 4–5 k clients, ~2 M€ CA déclaré mais perte 390 k€ en 2024 ; Virtual Staging AI 1 M$ ARR ; Refined Listings 232 k$/12 mois vérifié Stripe). Vidéo IA seule = faibles revenus vérifiés (AiCasaDesign 24 k$/an, Tour Estate 613 $, PropFade 29 $, annonces Acquire 2,7–50 k$). Acheteurs : vidéo citée par 15 % vs photos 51 % (Toluna 2025). Google FR : « vidéo immobilière » ≈ 1 vs 26,5 « photographe immobilier » → il faut aller chercher les clients. Maroc : marché réel (+6,3 % T2 2026, 708 boutiques pro Avito), shooting humain 1 000–2 500 DH (vs 149 DH), mais 0 vidéo sur les annonces de revente, 83,7 % de paiements en cash, et concurrents IA locaux déjà là (EclatMotion, Vision Estate AI, très peu d'audience). Seuil de test proposé : ≥ 5 payants sur 50 agences contactées. Détails : scratchpad/tâche wcbt8shu0.
- Concurrents : Roomotion (FR) 30–39 € HT/vidéo ; Reel-E 12–20 $/vidéo ; StagingVision 5–40 € ; vidéaste 350–2 000 €. Maroc : offres vidéo IA naissantes (EclatMotion, Vision Estate AI) ; shooting photo 890–2 500 DH.

## Paiement — Lemon Squeezy
- Compte sur astralzayte@gmail.com, boutique encore nommée « ImmoMotion » / URL immomotion → le fondateur doit renommer en ImmoClap / immoclap, e-mail contact → contact.immoclap@gmail.com, devise → EUR, logo.
- 🔴 05/10 : vérification d'identité REFUSÉE (« Rejected », sans raison). Plan : e-mail au support (hello@lemonsqueezy.com) pour la raison + nouvel examen ; en parallèle ouvrir Polar.sh (Merchant of Record, accepte les particuliers, Maroc dans la liste des pays payés via Stripe Connect Express ; frais 4 % + 0,40 $ +1,5 % carte hors US +0,5 % abonnement). Dodo Payments : Maroc fermé aux nouveaux comptes depuis le 23/03/2026. Si on change de prestataire : mettre à jour CGV/remboursement (Lemon Squeezy cité). Cause probable du refus (avis du fondateur) : site pas fini, personne ne pouvait générer de vraie vidéo → impression d'arnaque. Règle Polar : « build first, submit second » (produits + intégration + site en ligne AVANT la demande Finance → Account ; examen jusqu'à 14 jours ; ils peuvent demander une vidéo de démo ou un code -100 % pour tester). Donc : ne soumettre l'examen Polar qu'une fois la vraie génération branchée (après recharge Higgsfield). Technique de l'entonnoir appliquée (skill `.claude/skills/entonnoir/`).
- Vérification d'identité Stripe ENVOYÉE le 04/10 (particulier, Maroc, RIB CIH). Statut « En bref » = en examen, réponse attendue sous 2–3 jours ouvrés (≈ mardi/mercredi 6–7/10).
- Reste : 2FA, créer les produits (1 vidéo, pack 5, pack 10) après validation.
- Lemon Squeezy n'a pas de bouton de suppression de compte (support : hello@lemonsqueezy.com).

## Statut légal
- Décision : auto-entrepreneur d'abord (gratuit, 1 % du CA, plafond 200 000 DH/an), passage en SARL AU vers 80 000 DH (risque : Lemon Squeezy = client unique → règle des 30 % au-delà de 80 000 DH, à faire confirmer par un comptable).
- Inscription : site ae.gov.ma en panne le 04/10 → aller en agence Barid Al-Maghrib (CIN + justificatif d'adresse < 3 mois). Attention aux faux sites (autoentrepreneur.ma).

## Budget de lancement (décidé le 05/10) — voir aussi `BUDGET.md`
- Pour lancer ≈ 800 DH : Metricool Starter ~20 $ + pub payante 19 jours ~30 $ + recharge Higgsfield 200 DH + domaine immoclap.com ~100 DH.
- Ensuite ≈ 400 DH de pubs.
- Les 200 DH Higgsfield = vidéos des CLIENTS (pas les pubs) : ≈ 4 vidéos (Kling 3.0) ou ~8 (Kling 2.5). Les essais gratuits puisent dedans ; recharger avec les ventes.
- Metricool : gratuit = 1 marque + 20 posts/mois → insuffisant ; Starter 16 €/mois (5 marques, illimité). La marque gratuite actuelle est occupée par « silence.worldwide » (autre projet).

## Ordre décidé (entonnoir)
1. Gratuit d'abord : auto-entrepreneur, photos de profil + bios, photos Gemini d'une même maison.
2. Attendre validation AE → finir Lemon Squeezy → attendre validation.
3. Payant ensuite : recharger Higgsfield, acheter immoclap.com, Metricool Starter.

## Chantiers Claude (reportés à la demande du fondateur, rappel programmé le 05/10 à 08:00 UTC)
1. Prospects : 160 agences Maroc déjà dans `prospection/agences-maroc.csv` ; ✅ messages WhatsApp prêts (`prospection/whatsapp-maroc.csv`, 127 avec lien wa.me) + Google Sheet « ImmoClap — Prospection WhatsApp Maroc » (Drive du fondateur, id 11ia25sP2dwW9p7i0Jnu8UQ6Y0BLtqi_3tzTm1oV7WKU, bouton « Ouvrir » par agence, modèle modifiable colonne J). NE PAS envoyer avant Lemon Squeezy validé + code promo -30 % créé (Marrakech, Agadir, Casablanca, Rabat, Tanger). Reste : France (Paris, Lyon, Marseille, Bordeaux, Nice), playbook de prospection (WhatsApp au Maroc + appel ; e-mail/DM en France), Google Sheets avec liens wa.me + message pré-rempli.
2. ✅ App « espace client » en mode test construite le 05/10 : `app.html` (en ligne https://immoclap.netlify.app/app.html, noindex, pas liée depuis le site). Connexion simulée, crédits, paiement par carte de test (4242… acceptée, 4000…0002 refusée, aucune vraie carte acceptée ni envoyée) (unité, packs, abonnements Solo/Agence), assistant 4 étapes (3–12 photos, infos du bien, style/voix/formats/logo, récap), génération simulée → vidéo de démo. Données en localStorage. Pour passer en vrai : coller les liens Lemon Squeezy dans `CONFIG.checkout`, `testMode:false`, vraie connexion (Supabase ou autre) et fonction de génération Higgsfield.
- Annulés : amélioration motion design du site, pub motion design (la recherche YouTube est faite : `pub-recherche-youtube.json`).
- Script de workflow : `/root/.claude/projects/-home-user-aplication-coach-/5c78e82e-7a2c-53e6-8166-801579d546c3/workflows/scripts/immoclap-4-chantiers-wf_73a6474e-56f.js` (args {track: prospects|app|site|ad}). Attention : machine à 4 CPU → 2 agents max par workflow ; limites de session atteintes plusieurs fois.

## Prochaine session (décidé le 05/10)
- Le 06/10 : étapes 1 à 7 seulement (le temps d'économiser). Fondateur : 1 auto-entrepreneur, 2 e-mail Lemon Squeezy, 3 compte Polar (sans Finance→Account), 4 produits sandbox + liens. Claude : 5 paiement test Polar, 6 vrais comptes clients, 7 génération Higgsfield branchée (sans générer de payant). Rappel programmé 06/10 09:00 UTC (trig_01KBT5rcABkf7toEUnTotNoZ).
- Étapes 8 et suivantes (recharge Higgsfield, domaine, examen Polar, prospection, Metricool) : après.

## Décisions du 08/10 (soir) — validées, à coder
- Nouvel objectif : 3 000 € NETS par mois (dans la poche du fondateur), au lieu du million en 1 an.
- À l'arrivée : 1) choix du pays (Maroc/France) puis 2) choix de la langue (arabe / français / anglais). Après le choix du pays, plus de bascule €/DH visible (le client ne voit pas l'autre prix). Gros chantier : traduire site + app en arabe (sens droite-gauche) et en anglais — le fondateur dit « débrouille-toi, fais-le maintenant » (08/10). Bascule €/DH retirée ; seul un petit lien « changer de pays » en pied de page.
- Le fondateur trouve la présentation de l'abonnement pas claire (« il m'apporte quoi ? ») → à refaire après décision sur l'offre (abonnements seuls / vidéos seules / mélange). Proposition de Claude : 3 offres (1 vidéo 19 € pour essayer + Solo 39 €/mois + Agence 99 €/mois), supprimer les packs 5 et 10.

## ⏸️ En pause (08/10 au soir) — au « go » du fondateur, faire DANS CET ORDRE
1. **Studio de montage** (musiques Lyria si gratuites, frise des plans, mouvements, transitions, habillage, aperçu en direct, préréglages) : workflow arrêté en cours → relancer scratchpad/studio-montage.js avec resumeFromRunId wf_a7795583-0b4 (si le scratchpad a disparu : réécrire à partir de cette description).
2. **Nouveaux prix + abonnement expliqué + plus de bascule €/DH + langues FR/AR/EN** → scratchpad/prix-langues.js.
3. **Refaire le site** en conséquence. Mise en ligne : Netlify a bloqué les déploiements (crédit gratuit) → essayer brouillon + publication (a marché le 08/10) ; si refusé, ne pas forcer : envoyer le lien de l'aperçu brouillon (gratuit).
4. **E-mails (Brevo)** — voir `passation/PASSATION-IMMO-EMAILS.md`. Clé dans les secrets réseau de l'environnement (api.brevo.com, testé : GET /v3/account = 200 le 08/10). Expéditeur vérifié « Immoclap » contac.immoclapfrance@gmail.com. Quota 300 e-mails/JOUR partagé avec SILENCE. À faire : case de consentement obligatoire (vide par défaut) + preuve datée ; e-mail de bienvenue avec -10 % ; confirmation/suivi après achat ; lien de désinscription ; page Confidentialité (Brevo). ⚠️ La clé de la session Claude ne sert qu'aux appels de Claude : pour que le SITE envoie, il faut une fonction serveur (ex. Netlify Function + variable d'environnement Netlify BREVO_API_KEY, jamais dans le HTML). Passer le skill `site-legal` (blocs 5 et 6) avant de mettre en ligne.
5. **Stratégie pub** — voir `passation/PASSATION-STRATEGIE-PUB.md` + skill `pub` : 80/20 (80 % formats copiés, 20 % nos idées ; et 80 % de contenu qui montre / 20 % qui vend), visage récurrent IA jamais présenté comme le fondateur ou un client + étiquette « contenu IA » à chaque publication, étiquette par vidéo, tableau de bord avant lancement, pub payée seulement sur la gagnante avec l'argent des ventes (coût max d'une vente = 70 % de la marge ; budget pub ≤ 30 % de la marge de la semaine précédente). À recalculer pour ImmoClap avec le fondateur, une question à la fois : qu'est-ce qu'une « vente » (abonnement Solo ? 1 vidéo ?) → marge → coût max en pub.

## Prochaines étapes (ordre du fondateur, 08/10)
1. Inscription auto-entrepreneur. 2. Ouvrir l'encaissement (Polar). 3. Prochaine dépense = test Higgsfield : photos de villa générées avec Gemini (prompts dans `tests-higgsfield/PROMPTS-VILLA.md`), puis ~7 vidéos : 3 photos × Kling 2.5 et Kling 3.0 (+1 à refaire) → choisir le modèle (qualité vs coût/marge).
- ✅ Prix VALIDÉS le 08/10 : 1 vidéo 15 € / 129 DH ; Solo 3 vidéos 29 €/mois / 249 DH (mis en avant « Recommandé ») ; Agence 10 vidéos 79 €/mois / 699 DH ; packs 5 et 10 supprimés.

## 🔔 À RAPPELER À CHAQUE RÉPONSE (demandé le 08/10) — NE PAS COMMENCER SANS « GO »
- Enrichir le « logiciel de montage » de l'app : bibliothèque de musiques (plusieurs morceaux par ambiance, écoute avant choix), plus d'options de montage (transitions, textes, styles, durée, ordre des plans…), pour rendre le produit attractif et en tirer des angles marketing. À proposer après la fin des points 1 à 4 ; rappeler au fondateur à chaque fin de réponse tant qu'il n'a pas dit « go ».

## À faire quand le fondateur dit « reprends » (mis en pause le 06/10)
- Finitions site + app (workflow immoclap-finitions) puis contrôle et mise en ligne.
- Nouveau : à l'ouverture du site (et de l'app), fenêtre « Vous êtes au Maroc ou en France ? » → prix en DH ou en € selon la réponse (mémorisé ; on peut changer ensuite). Seulement Maroc et France.
  - 08/10 : fait sur le site (index.html, pas encore en ligne) : choix gardé dans `immoclap_cur` ('mad'/'eur', même clé que l'app) ; fermée sans choisir (Échap, ×, clic dehors) → détection fuseau gardée, pas redemandé pendant la session (`immoclap_pays_vu` en sessionStorage, même clé que l'app) ; jamais pour les robots/aperçus ; lien « Changer de pays » en pied de page + bascule €/DH. Confidentialité mise à jour (script `scratchpad/site/gen_pages.py`).
- Ordre décidé le 08/10 : d'abord la recherche « est-ce que ça vend » ; puis au « go » du fondateur : 1) finitions + mise en ligne du site, 2) choix du pays, 3) messages WhatsApp seulement s'il faut les modifier (envoyés par le fondateur quand tout est prêt), 4) publications : suivre le skill `pub` (tester plusieurs sources).
- Polar : organisation « ImmoClap » (individuel), devise par défaut EUR ; ajouter un prix en MAD par produit si Polar le permet.

## Réseaux (06/10)
- TikTok v44.5 : plus d'option gratuite « compte pro » ; lien cliquable = compte Entreprise vérifié (papiers) ou 1 000 abonnés. En attendant : lien en texte dans la bio. Dès réception de l'attestation/carte AE → l'envoyer à TikTok (certification entreprise).
- Bios proposées : Insta « 🎬 Vos biens immobiliers en vidéo / 📸 Vos photos → une vidéo en quelques minutes / 🏠 Agences & propriétaires · France · Maroc / 👇 Ouverture très bientôt » (lien ?v=bio-insta) ; TikTok « 🎬 Vos photos de biens → une vidéo pro / 🏠 Agences FR · MA / 👇 Ouverture bientôt » (?v=bio-tiktok).
- 08/10 : bios TikTok/Insta redirigées vers le WhatsApp du fondateur (au lieu du site). Avantage : contacts entrants = consentement pour WhatsApp plus tard. Suivi : utiliser un lien wa.me avec message pré-rempli par réseau (ex. « Bonjour, je viens de TikTok ») pour savoir d'où vient chaque contact.
- Polar : compte créé le 06/10 (org ImmoClap, slug immoclap). Reste : créer les 5 produits en € (pas besoin du sandbox : test avec codes -100 % avant « go live »).
- Lemon Squeezy : e-mail de contestation à envoyer (site pas fini au moment de la demande, nouvel examen dans quelques jours).
- AE : 1er dossier AE-260626-721646 rejeté (prénom arabe coupé, adresse incomplète, activité 20015 vague) → refaire la demande (ou agence CIH).

## Chantier futur : WhatsApp (décidé le 06/10)
- But : chatbot WhatsApp qui répond aux clients (questions fréquentes : prix, délai, fonctionnement) et passe la main au fondateur pour le reste ; Claude lit les conversations, les analyse (routine quotidienne + à la demande) et propose des réponses (envoi seulement avec accord au début).
- Technique : API WhatsApp Cloud en « coexistence » (même numéro que l'appli WhatsApp Business du téléphone, historique synchronisé, ouvert à tous les pays depuis mai 2026) ; webhook = fonction Netlify qui stocke les messages ; IA du chatbot = Gemini ; jeton Meta en secret d'environnement (jamais dans le chat).
- Coût : 1 000 messages de service gratuits par mois et par numéro (règle Meta au 01/10/2026), au-delà payant ; messages marketing toujours payants. Interdit : prospection à froid par l'API (consentement obligatoire) → les 127 messages restent manuels.
- Quand : après l'ouverture des paiements (étape 14). Le fondateur doit : compte Meta Business + numéro WhatsApp Business ; Claude le guide.
- Polar : jeton d'organisation en lecture seule → variable d'environnement POLAR_ACCESS_TOKEN (+ autoriser api.polar.sh dans le réseau de l'environnement).

## Pubs (skill `pub`)
- Avant toute vidéo : Metricool branché sur les comptes ImmoClap, suivi ?v=videoXX sur le site, ventes lisibles (Lemon Squeezy), fichier d'étiquettes. Rien de coché au 05/10.
- Étape 1 proposée (espionner les pubs actives Reel-E / AutoReel / Roomotion, ~15–20 crédits scraping sur ~45) : pas encore lancée.

## Plan million
- Plan dans `PLAN-MILLION.md` : but = 1 000 000 € de CA en 12 mois (🔴 très peu probable avec ces moyens, tenté quand même ; frein mois 2 < 2 000 €/mois → objectif 4 ans). Abonnements de lancement : Solo 39 €/349 DH (3 vidéos), Agence 99 €/899 DH (10 vidéos), gardés à vie pour les 100 premiers ; hausse ensuite à 79 €/590 DH et 199 €/1 490 DH. Lancé le 05/10 : palier 1 en préparation (voir « Où on en est » dans le plan).

## Outils / accès
- Gemini (clé injectée par le proxy) : script `.claude/skills/analyse-youtube/scripts/gemini_youtube.sh` avec liste de modèles étendue ; modèles TTS (gemini-3.8-flash-tts) et Lyria disponibles.
- Higgsfield API : solde 0 → ne rien générer de payant sans accord.
- Branche git : `claude/serene-edison-m0ja9n`.
