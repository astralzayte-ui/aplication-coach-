# ImmoClap — mémoire du projet (pour Claude, ne pas envoyer au fondateur)

Dernière mise à jour : 05/10/2026. À tenir à jour à chaque décision importante.

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
- Formulaire Netlify « inscription » (e-mail) actif ; détection des formulaires activée. Pas encore de vrais comptes / Google login / paiement.
- Variables d'env Netlify secrètes : HF_API_KEY_ID, HF_API_KEY_SECRET (clé Higgsfield, expire dans 1 an ~ sept. 2027).
- Vidéos de démo réelles (fournies par le fondateur, générées IA) : `assets/videos/villa-marrakech-*` et `penthouse-casablanca-*` (mp4 H.264 + webm VP9, 9x16 avec son, 16x9 sans son). Intégrées : hero en autoplay, bouton « Voir un exemple », cartes Exemples Marrakech/Casablanca, lien sous les tarifs. Le Chromium de test n'a pas H.264 → toujours fournir le webm.
- Photos de démo : `assets/exemples/{marrakech,paris,fes,casablanca,bordeaux}.jpg` (Tanger jamais reçue en fichier).
- Règle : copier le STYLE de Reel-E, jamais leurs textes / images / code. Visuels IA toujours étiquetés « démonstration ». Pas de faux avis.

## Prix (sans abonnement, crédits)
- France : 1 vidéo 19 € HT · pack 5 = 79 € · pack 10 = 139 €.
- Maroc : 1 vidéo 149 DH · pack 5 = 599 DH · pack 10 = 999 DH.
- PAS d'essai gratuit (décidé le 05/10) : à la place, bouton « Voir un exemple » qui lit une vraie vidéo de démo. Max 12 photos par vidéo. Crédits valables 12 mois.
- Coût Higgsfield ≈ 5 $ / vidéo (Kling 3.0, 12 plans × 5 s) ; ≈ 2,5 $ avec Kling 2.5.
- Marges nettes calculées (après Lemon Squeezy 5 % + 0,50 $, virement 1 %, impôt AE 1 %, Higgsfield) : France 1 vidéo ≈ 139 DH, pack 10 ≈ 918 DH ; Maroc 1 vidéo ≈ 88 DH, pack 10 ≈ 463 DH.
- Concurrents : Roomotion (FR) 30–39 € HT/vidéo ; Reel-E 12–20 $/vidéo ; StagingVision 5–40 € ; vidéaste 350–2 000 €. Maroc : aucune offre vidéo IA ; shooting photo 500–1 500 DH.

## Paiement — Lemon Squeezy
- Compte sur astralzayte@gmail.com, boutique encore nommée « ImmoMotion » / URL immomotion → le fondateur doit renommer en ImmoClap / immoclap, e-mail contact → contact.immoclap@gmail.com, devise → EUR, logo.
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
1. Prospects : 160 agences Maroc déjà dans `prospection/agences-maroc.csv` (Marrakech, Agadir, Casablanca, Rabat, Tanger). Reste : France (Paris, Lyon, Marseille, Bordeaux, Nice), playbook de prospection (WhatsApp au Maroc + appel ; e-mail/DM en France), Google Sheets avec liens wa.me + message pré-rempli.
2. App « espace client » en mode test (Supabase auth + questionnaire 3 min + upload + génération mock + Lemon Squeezy test). Rien construit encore.
- Annulés : amélioration motion design du site, pub motion design (la recherche YouTube est faite : `pub-recherche-youtube.json`).
- Script de workflow : `/root/.claude/projects/-home-user-aplication-coach-/5c78e82e-7a2c-53e6-8166-801579d546c3/workflows/scripts/immoclap-4-chantiers-wf_73a6474e-56f.js` (args {track: prospects|app|site|ad}). Attention : machine à 4 CPU → 2 agents max par workflow ; limites de session atteintes plusieurs fois.

## Pubs (skill `pub`)
- Avant toute vidéo : Metricool branché sur les comptes ImmoClap, suivi ?v=videoXX sur le site, ventes lisibles (Lemon Squeezy), fichier d'étiquettes. Rien de coché au 05/10.
- Étape 1 proposée (espionner les pubs actives Reel-E / AutoReel / Roomotion, ~15–20 crédits scraping sur ~45) : pas encore lancée.

## Outils / accès
- Gemini (clé injectée par le proxy) : script `.claude/skills/analyse-youtube/scripts/gemini_youtube.sh` avec liste de modèles étendue ; modèles TTS (gemini-3.8-flash-tts) et Lyria disponibles.
- Higgsfield API : solde 0 → ne rien générer de payant sans accord.
- Branche git : `claude/serene-edison-m0ja9n`.
