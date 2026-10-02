---
name: motion-design
description: Crée des vidéos motion design verticales (stories, reels, pubs, 9:16) de A à Z — script, voix off, storyboard, animation, musique, bruitages, export MP4 — et sait en produire des dizaines de variantes. Utilise ce skill dès que l'utilisateur demande une pub, une story, un reel, une animation, un motion design, des variantes de vidéos, ou veut améliorer la voix, le son ou la qualité d'une vidéo, quel que soit le sujet (immobilier, e-commerce, app, etc.).
---

# Motion design (tous sujets)

Implémentation de référence qui marche : `immo-motion/` (overlay.html, render.js, build_audio.py, gen_voice.py, timeline.json). Partir de là, ne pas réécrire.

## 0. Règles non négociables
- **Ne jamais envoyer le résultat final** avant que l'utilisateur ait donné son feu vert et fourni ses médias (il l'a demandé explicitement). Il dit « attends » = ne rien lancer.
- **Je ne peux pas écouter l'audio.** Le dire, vérifier ce qui se vérifie (transcription par Gemini, durées, niveaux LUFS), et faire valider voix, musique et bruitages par l'utilisateur à l'écoute.
- **Pas de chiffres ni de témoignages inventés** dans une pub (« +300 % de vues », faux avis). Utiliser seulement des promesses vraies et vérifiables (ex. délai réel du produit).
- Sources et chiffres : citer d'où ils viennent, séparer officiel (Meta) et tiers.

## 1. Format et plateformes (vérifié)
- 1080×1920, 9:16, 30 fps, H.264 `yuv420p`, AAC. Contrôler avec `ffprobe` et `cropdetect` (aucune bande).
- **Zone de sécurité Meta (Stories/Reels)** : laisser libres de tout texte/logo **14 % en haut (~270 px), 35 % en bas (~670 px), 6 % de chaque côté (~65 px)** ; coin bas-droit jusqu'à 40 %. Tout contenu utile entre y=270 et y=1250. (Source : Meta Help Center « text overlays and the safe zone », guide 2026.)
- **Durée** : Meta indique que les pubs Stories donnent les meilleurs résultats **sous 10 s**, et qu'une vidéo de **moins de 16 s** est jouée en entier en Stories ; feed < 15 s ; Reels 6–30 s. Par défaut : **version 9-10 s pour les stories** + version 15 s pour les reels. Ne pas livrer 20 s en story sans le dire.
- **Hook dans les 3 premières secondes** (une analyse tierce citant Meta : ~47 % de la valeur d'une pub vidéo se joue là). Un hook doit être **spécifique** (problème précis, question, avant/après), pas un titre générique.
- Beaucoup de gens regardent **sans le son** : sous-titres/texte animé obligatoires, la voix ne doit jamais être la seule porteuse du message.
- **Concurrence qui dure = ce qui marche** : une pub active depuis des centaines de jours est un gagnant. Les gagnants testent des **variantes du même message** (hooks, titres, CTA) plutôt que des idées toutes différentes. Chercher les concurrents avec `mcp__scrape_reseaux__v1_facebook_adLibrary_search_ads` (trier par impressions, `trim:true`, analyser le fichier de sortie avec un script).

## 2. Pipeline
1. **Brief** : produit, cible, promesse vraie, plateforme, durée, CTA, charte (couleurs, polices, logo).
2. **Script** en temps forts : hook → problème → pivot/solution → preuve → CTA. Une idée par plan, un plan toutes les 0,5–2 s.
3. **Voix** : voir §4.
4. **Storyboard** : plan par plan (ce qu'on voit, mouvement de caméra, texte, transition). Valider avec une planche de stills (`render.js <mode> <dir> t1,t2,...` puis `ffmpeg tile`) AVANT le rendu complet.
5. **Animation** : page HTML avec `window.seek(t)` pure et déterministe (aucun état), rendue image par image par Chromium/Playwright (4 workers). Photos pré-floutées/assombries avec ffmpeg (le flou CSS est lent). Polices téléchargées en local (Google Fonts joignable).
6. **Vidéos fournies (Veo/Flow, etc.)** : Chromium n'a pas H.264, donc **deux couches** : rendre l'overlay en PNG transparent (`omitBackground`), puis `ffmpeg overlay` sur les clips. Couper les clips sur leurs coupures réelles (`select='gt(scene,0.18)'`) et sur la grille de battements.
7. **Son** : voir §4. **Export** : `-crf 17 -preset medium -movflags +faststart`.
8. **QA** : §5.

## 3. Qualité et « vie » du motion design
Ce qui rend une animation vivante (à appliquer par défaut) :
- La caméra **ne s'arrête jamais** : zoom lent, travelling, parallaxe sur chaque plan. Rien de statique plus de ~1,5 s.
- **Easing partout** (jamais linéaire) : sortie en cubic, léger dépassement (back) sur les pop-ups, décalage (stagger) de 80–150 ms entre éléments.
- Texte : révélation par masque/clip, mot par mot synchronisé à la voix, un mot clé en couleur d'accent, ombre portée pour la lisibilité.
- Transitions : flash/whip sur les coupures, match cut, zoom punch à l'arrivée d'un plan, calés sur la musique (battement = 0,5 s à 120 BPM).
- Rythme : alterner plans denses et respirations ; une accélération (speed ramp) avant le CTA.
- Texture : léger grain, vignette, lueurs (light leaks), léger micro-tremblement de caméra pour casser l'aspect numérique.
- Montrer le **produit en action** (maquette d'écran animée de l'app, avant/après, compteur) plutôt que des mots seuls.
- Hiérarchie : 1 message par plan, 2 polices max, contraste fort, texte ≥ 70 px sur mobile.
- Éviter : texte dans les zones de l'interface, plus de 2 lignes de texte par plan, sous-titres < 28 px.

## 4. Audio (leçons de la v1)
- **Voix Gemini TTS** : le choix de la voix compte. `Kore` = *Firm* (ferme, pas chaleureuse). Féminines : `Sulafat` = Warm, `Laomedeia` = Upbeat, `Aoede` = Breezy, `Leda` = Youthful, `Despina` = Smooth, `Vindemiatrix` = Gentle. Toujours **faire comparer 3 voix** à l'utilisateur sur le même texte (il écoute, pas moi).
- Écrire les noms de marque comme ils se prononcent (« Immo Clap »), ponctuer pour les pauses. Générer **en une seule prise** pour un ton cohérent ; le modèle de repli `gemini-3.8-flash-tts` est **beaucoup trop lent** (28 s au lieu de 16) : vérifier la durée, réessayer sur `gemini-3.1-flash-tts-preview`.
- Vérifier le texte réellement dit en faisant transcrire l'audio par Gemini (`gemini-flash-latest`, audio en base64 via `-d @fichier`, pas en argument).
- **Bruitages : préférer de vrais sons enregistrés** aux sons synthétisés. Pack CC0 téléchargé dans `immo-motion/sfx_real/` (Kenney Interface Sounds, 100 sons : clics, boutons, pings) ; autres packs CC0 trouvés : kenney.nl `impact-sounds`, `digital-audio`, `sci-fi-sounds` (jeu vidéo : bons pour clics/pings, moins pour whooshes). Les sons synthétisés par numpy servent de dépannage.
- **Musique** : Lyria API = quota 0 sur la clé gratuite (erreur 429 `limit: 0`) ; modèles d'images idem. Sinon : musique synthétisée (120 BPM) ou piste libre de droits fournie par l'utilisateur.
- **Mixage** : musique abaissée sous la voix (`sidechaincompress`), `loudnorm I=-14 TP=-1.5`, voix à 0,85 de crête. Contrôler avec `ebur128`.

## 5. QA avant livraison
`ffprobe` (1080×1920, 30 fps, durée), `cropdetect` (aucune bande), planche de ≥ 12 images, vérif zone de sécurité (aucun texte dans y<270 ni y>1250), niveau sonore, transcription de la voix, puis **demander la validation à l'écoute**.

## 6. Production en série (30 à 100 variantes)
- C'est faisable : un **gabarit piloté par des données** (`variants/xxx.json` : hook, script, angle, palette, médias, musique, voix, durée) → rendu automatique. Mesure réelle : 20,5 s de vidéo ≈ 2,5 min de rendu + 1 min d'encodage ; une story de 10 s ≈ 2 min → 80 stories ≈ 3 h de calcul, par lots de 10 poussés sur la branche.
- Variété = **hooks (angles) × gabarits visuels × médias**, pas 80 idées différentes : ~12 hooks, 4 gabarits, 20+ visuels différents. Le facteur limitant est le **stock de visuels** (clips, photos), pas le montage.
- Angles types : problème/solution, avant/après, question, liste de 3, « comment ça marche » en 3 étapes, comparaison de coût/temps (vrais chiffres uniquement), objection, urgence, public précis (par métier).
- Ne pas publier 80 stories d'un coup : tester par lots de 5–10, garder les gagnantes, décliner.
- Livraison : dossier + index (nom, hook, durée), ne pas envoyer 80 fichiers un par un.

## 7. Pièges déjà rencontrés
- `page.screenshot` PNG refuse l'option `quality`. Le CSS des polices doit utiliser des chemins relatifs au fichier CSS.
- `curl -d` avec un gros corps : passer par `-d @fichier`.
- Les vignettes de contrôle : 2 images/seconde → chaque case = 0,5 s.
