# SPEC v2 : story ImmoClap 9,5 s (source de vérité, lire en entier)

## Objectif
Story / Reel vertical **9,5 s**, 1080×1920, 30 fps, H.264 yuv420p + AAC. Corrige les défauts de la v1 (`final/ImmoClap_pub_v1.mp4`, 20,5 s) relevés par l'utilisateur et par la recherche marketing :
1. **Voix** : v1 = voix `Kore` (ferme). v2 = voix Gemini TTS **`Sulafat` (chaleureuse)**.
2. **Bruitages** : v1 = sons synthétisés peu attirants. v2 = **vrais sons enregistrés CC0** (`sfx_real/interface/Audio/*.ogg`, Kenney, licence dans `sfx_real/interface/License.txt`), + whooshes/impacts de qualité.
3. **Motion design plus vivant**.
4. **Zone de sécurité Meta** : aucun texte/logo/icône hors de **x∈[65,1015], y∈[270,1250]** (14 % haut, 35 % bas, 6 % côtés). v1 la violait.
5. **Durée** : Stories < 10 s (Meta). Total = 9,5 s.

## Contrat de timing : `timeline_v2.json`
Les DEUX côtés (visuel et audio) s'y calent. **Ne jamais modifier les valeurs existantes ; on peut ajouter des clés.** Il contient : durée, positions des 3 phrases de voix (`voice` + `voice_text`), scènes, segments vidéo de la démo (`demo_segments` : [clip, début, fin] sur `clips/villa.mp4` / `clips/penthouse.mp4`, coupes sur la grille de 0,5 s), fond du CTA (`cta_bg`), coupures (`cuts`), événements visuels (`ev`), **liste des bruitages (`sfx`)**, musique (`music`).

## Script voix (texte exact, « Immo Clap » pour la prononciation)
1. « Votre annonce passe inaperçue ? »  (démarre à 0,25 s)
2. « Avec Immo Clap, vos photos deviennent un film, en dix minutes. »  (2,1 s)
3. « Créez votre vidéo. »  (7,3 s)
Voix `Sulafat`, modèle `gemini-3.1-flash-tts-preview` (le repli `gemini-3.8-flash-tts` est trop lent : si la durée dépasse ~1,5× l'attendu, réessayer). Consigne de style : chaleureuse, souriante, naturelle, rythme vivant. Si chaque phrase doit tenir dans son créneau (s1 ≤ 1,8 s, s2 ≤ 4,8 s, s3 ≤ 2,0 s), accélérer via le texte/la consigne ou `atempo` ≤ 1,12. Faire transcrire l'audio final par Gemini (`gemini-flash-latest`, audio base64 dans un fichier, `curl -d @fichier`) pour vérifier le texte.

## Charte
Fond `#0F0D0A`, or `#EDB62C`, crème `#F4ECE0`. Polices locales : `fonts/fonts.css` (Source Serif 4 titres ; Montserrat petites capitales). Logo = maison + triangle play dessiné en SVG (fonction `house()` dans `overlay.html`, dash-draw), « Immo » crème + « Clap » or. Promesse de marque donnée par l'utilisateur : « Vos biens en vidéo cinématique — en 10 minutes ». **Aucun chiffre ni témoignage inventé.**

## Structure
- 0–2,0 s **HOOK** : fond opaque `build/bg_hook.jpg` (salon désaturé/sombre), texte « Votre annonce / passe inaperçue ? » (mots synchronisés sur `words`).
- 2,0–7,0 s **DÉMO** : vidéo des clients (fond transparent dans l'overlay) ; « 10 photos » (compteur) + éventail des 6 vignettes `photos/*.jpg` + « = 1 vidéo » + anneau « 10 min » (`ev`).
- 7,0–9,5 s **CTA** : fond = clip penthouse crépuscule (transparent dans l'overlay) assombri en bas par un dégradé ; logo horizontal + « Créez votre vidéo » + petite ligne « Vos biens en vidéo cinématique » ; fondu final dès `fade_out`.

## « Plus de vie » : minimum 8 techniques parmi
parallaxe/profondeur, grain animé, vignette, micro-tremblement de caméra, zoom punch sur chaque coupure, whip/flash, stagger 80–120 ms, easing avec dépassement, masques de texte, compteur animé, mini ralenti→accélération, lueur (glow) sur le texte or, light leak, particules/lueurs dorées, lignes d'accent animées. **Aucun plan visuellement statique plus de 1 s** (mesuré par différence d'images). Lisibilité d'abord : texte ≥ 70 px (petites capitales ≥ 28 px), contraste fort, ombre portée.

## Son
Voix + musique (120 BPM, drop à 2,0 s, climax CTA 7,0 s, fondu final) + SFX de `timeline_v2.json`. Les types `click`/`pop`/`tick`/`ding` utilisent de VRAIS sons Kenney (choisir en analysant durée/spectre/nom : `click_*`, `bong_*`, `tick_*`, `select_*`, `confirmation_*`…). `whoosh`/`impact` : synthèse améliorée OU autre pack CC0 (zips : https://kenney.nl/media/pages/assets/impact-sounds/87b4ddecda-1677589768/kenney_impact-sounds.zip , https://kenney.nl/media/pages/assets/sci-fi-sounds/6b296f9ecf-1677589334/kenney_sci-fi-sounds.zip). Mixage : musique abaissée sous la voix (sidechain), `loudnorm I=-14 TP=-1.5`, voix toujours dominante (≥ +6 dB sur la musique pendant la parole). On ne peut pas écouter : mesurer ce qui se mesure.

## Propriété des fichiers (ne pas se marcher dessus ; ne PAS modifier les fichiers v1 : overlay.html, build_audio.py, gen_voice.py, timeline.json, render.js)
- Visuel : `overlay_v2.html`, `render_v2.js`, `build/*_v2.*`.
- Audio : `gen_voice_v2.py`, `build_audio_v2.py`, `audio/*_v2*`, `build/voice_v2_timing.json`.
- Assemblage : `make_v2.sh` (reproductible de bout en bout), `final/ImmoClap_story_v2.mp4`.
Tous les scripts se lancent depuis `/home/user/aplication-coach-/immo-motion`. Playwright : `export PW_PATH=$(npm root -g)/playwright`. Max 4 workers de rendu.

## Contrat visuel pour la vérification
Chaque élément texte/logo/icône du HTML porte l'attribut `data-safe`. `window.seek(t)` reste pur et déterministe. Modes : `?mode=full` (fond de doublure) et `?mode=overlay` (fonds transparents sur 2,0–9,5 s ; seul le hook a un fond opaque).

## Livrables attendus à la fin
`final/ImmoClap_story_v2.mp4` (9,5 s), `build/v2_sheet.jpg` (planche ≥ 24 images), `make_v2.sh`, résumé des choix.
