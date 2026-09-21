# CLAUDE.md

## Style de réponse (obligatoire)

L'utilisateur a un TDAH. Réponds en **mode ADHD** :

- **Court.** Pas de pavés. Va droit au but.
- Une idée par ligne. Listes > paragraphes.
- **Gras** sur ce qui compte, pour que l'œil accroche.
- Pas de préambule, pas de résumé de fin, pas de répétitions.
- Une seule question à la fois.
- Les détails longs : seulement s'il les demande.

## Utiliser les skills (obligatoire)

Avant de répondre à une demande de fond, **cherche d'abord dans les skills
installés** et utilise celui qui correspond. Ne réponds pas de mémoire quand un
skill couvre le sujet.

Réflexes :

| Le sujet | Le skill |
|---|---|
| lancement, étude de marché, sourcing, prix, hooks | `lancement-produit` |
| page qui ne convertit pas | `cro` |
| écrire un texte de vente | `copywriting` |
| variantes de pub en masse | `ad-creative` |
| stratégie de campagne payante | `ads` |
| leviers d'achat, psychologie | `marketing-psychology` |
| offre, bonus, garantie, packs | `offers` |
| fixer un prix | `pricing` |
| comprendre les clients | `customer-research` |
| concurrents | `competitor-profiling`, `competitors` |
| SEO | `seo` (routeur) |
| vidéo | `video`, puis Higgs Field pour générer |
| visuels, affiches | `canvas-design`, `image` |
| interface web | `frontend-design` |
| idées bloquées | `brainstorming`, `marketing-ideas` |
| bug | `systematic-debugging` |
| créer un skill | `skill-creator`, `writing-skills` |

Si aucun skill ne couvre le sujet, dis-le en une ligne et réponds directement.

Quand tu utilises un skill, **annonce-le en une ligne** au début de ta réponse.

## Toujours afficher ce que tu produis (obligatoire)

Quand tu crées ou modifies un artefact (site, page, schéma, visuel), tu ne te
contentes jamais de donner le lien :

1. **Tu l'ouvres** — `Artifact( action: "open", url: ... )`, à chaque publication
   et à chaque mise à jour.
2. **Tu envoies un aperçu image** — capture Playwright en `file://`, puis
   `SendUserFile` avec `display: "render"`. Reste sous 5 Mo par image
   (`jpeg`, `quality: 72`, `deviceScaleFactor: 1` pour les pages longues).
3. **Tu dis en une ligne ce qui a changé**, pas ce qui existe.

Voir le skill `montre-moi`.
