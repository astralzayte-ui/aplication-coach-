# Studio motion design

Les 8 outils sont installés comme skills Claude Code dans `.claude/skills/`. Ils se chargent tout seuls quand la demande correspond. Pas besoin de les appeler par leur nom.

| Outil (dépôt d'origine) | Skills installés | Pour quoi |
|---|---|---|
| Product Launch Motion (AbubakrChan) | `product-launch-motion`, `product-launch-motion-v1` | Vidéo de lancement à partir d'une URL. La v1 sert aux explainers avec voix off |
| Motion Graphics Skills (charlie947) | `brand-intake`, `motion-brief-writer`, `motion-prompt-writer`, `reference-to-motion`, `launch-video`, `apple-launch-film`, `vox-explainer`, `animated-chart`, `milestone-reveal`, `motion-effects`, `title-sequence-3d`, `model-showdown`, `newsletter-promo`, `loop-cover`, `reel-export` | Reels, graphiques animés, lancements, export 9:16 |
| HyperFrames (HeyGen) | `hyperframes`, `hyperframes-cli`, `hyperframes-registry`, `media-use`, `reverse-any-video`, `remotion-to-hyperframes`, `style-sampling`, `figma`, `slideshow` | HTML vers vidéo, montage, sous-titres, environ 450 blocs prêts à l'emploi |
| Motion Graphics (Barty-Bart) | `motion-broll`, `object-separation`, `explainer-default`, `explainer-engaging`, `explainer-high-energy`, `sound-effects` | B-roll calé sur la voix, détourage, explainers, bruitages |
| Animate (cth9191) | `animate` | Storyboards et explainers en 7 styles (papier découpé, riso, pixel…) |
| Claude Motion (whaleyxbt) | `claude-motion-design`, `sound-design`, `review-loop`, `web-sims` + le toolkit dans `motion-studio/claude-motion/` | Remotion, moteur de son, relecture image par image, simulations 60 fps |
| Motion (motiondivision) | `motion` + serveur MCP Motion (`.mcp.json`) | Animations de sites web (Motion / Framer Motion, ressorts CSS) |
| Motion Design Skill (LottieFiles) | `motion-design` | Les 12 principes de l'animation, timing et easing |

## Pour commencer

1. Lance `brand-intake` une fois : « Configure ma marque pour le motion design ». Ça crée `brand.md` et `MOTION.md`, que les autres skills lisent ensuite.
2. Demande ce que tu veux, par exemple :
   - « Fais une vidéo de lancement pour https://mon-site.com »
   - « Fais un reel vertical de 15 s pour annoncer mon programme de coaching »
   - « Anime ce graphique de résultats clients »
   - « Fais un explainer de 45 s style papier découpé sur la méthode FORMA »
   - « Ajoute des animations Motion à l'appli coach »

## Bon à savoir

- **Toolkit claude-motion** : dans une nouvelle session, lancer `cd motion-studio/claude-motion && npm install` avant le premier rendu.
- **Télémétrie HyperFrames coupée** dans `.claude/settings.json` (`HYPERFRAMES_NO_TELEMETRY=1`, `DO_NOT_TRACK=1`).
- **En option, non installé** : Creator MCP de LottieFiles (export Lottie/GIF, nécessite un compte LottieFiles), MotionScore et l'agent `motion-reviewer` (abonnement payant Motion+), et pour HyperFrames : whisper-cpp (transcription), Kokoro (voix locale), MusicGen (musique locale).
- Les licences d'origine (MIT, ou Apache-2.0 pour HyperFrames) sont gardées dans chaque dossier. Seule exception, `motion` : son dépôt n'a pas de fichier de licence, mais Motion annonce ce skill comme MIT.
