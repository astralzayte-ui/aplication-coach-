# FORMA — système de marque

Quatre pistes de logo pour l'application de coaching FORMA, plus les déclinaisons
nécessaires pour les poser partout (app, web, impression, WhatsApp).
Planche de présentation : ouvrir **[`logos.html`](logos.html)** dans un navigateur.

## Le parti pris

Chaque marque part d'un mécanisme réel du produit, pas d'une métaphore générique
de sport. Toutes sont dessinées sur une grille de 64 px et n'utilisent que les
tokens déjà en place dans le prototype.

| Piste | Signe | Ce qu'elle raconte | Bon pour |
|---|---|---|---|
| **ORBE** | Anneau ouvert à 300° + `F` | Le cycle de suivi, jamais refermé ; le point terminal est le relevé du jour | Une marque « produit », lisible comme un tracker |
| **ÉLAN** | Deux chevrons emboîtés | Le coach devant, l'élève dans sa foulée — une relation, pas un outil | La plus robuste : 16 px, gravure, fond photo |
| **BARRE** | `F` à barre médiane en haltère | La salle, dite franchement | Reconnaissance immédiate de la catégorie |
| **CAP** | La coche du jour prolongée en flèche | La trajectoire n'est que l'accumulation des jours cochés | L'argument de vente du coaching, en un trait |

**Recommandation** : **ÉLAN** en marque principale (c'est la seule qui tient à
16 px dans la barre d'onglets et la seule qui parle de la relation coach/élève),
**ORBE** si la priorité est de faire lire « application de suivi » dès l'icône.
**BARRE** se brouille en dessous de 24 px — à réserver aux grands formats.

## Contenu

```
brand/
├── logos.html            planche de présentation (à ouvrir en premier)
├── marks/                les 4 marques : couleur, mono clair, mono sombre
├── lockups/              marque + logotype (h. couleur/mono, vertical), logotype seul
├── app-icons/            dalles 1024 px, prêtes pour l'export iOS / Android
├── favicons/             32 px
└── tools/build_logos.py  le générateur — toute la géométrie vit ici
```

Les versions `mono-*` peignent tout en `currentColor` : en HTML, `color:` suffit
à les recolorier, et l'attribut `color` posé sur le `<svg>` sert de repli quand
le fichier est chargé en `<img>` ou ouvert seul.

## Tokens

| | |
|---|---|
| Accent | `#4F7DD1` → `#3A5EA3` (dégradé vertical) |
| Papier | `#F2F4EE` |
| Encre | `#0D0F13` — surface `#15181E` |
| Progression | `#7BD957` (uniquement le point terminal d'ORBE) |
| Police | Space Grotesk Bold, interlettrage +4 % |

Le vert, l'ambre `#FFB43C` et le rouge `#FF5938` sont **sémantiques** dans
l'application (progression / à surveiller / alerte). Le logo ne s'en sert pas,
à la seule exception du point de progression d'ORBE.

## Règles

- **Air** : une marge égale à la hauteur de capitale du mot (34 px pour un lockup
  de 64 px) tout autour. Rien n'entre dedans.
- **Plancher** : marque seule 16 px (24 px pour BARRE) ; lockup horizontal,
  24 px de hauteur de marque. En dessous, marque seule.
- **Jamais** : étirement, rotation, ombre portée, contour ajouté, recoloration.
  Sur fond clair ou photo, version monochrome — jamais la version couleur.

## Régénérer

Les SVG sont des **sorties**. Pour changer une proportion, modifier
`tools/build_logos.py` puis :

```bash
pip install fonttools
python3 brand/tools/build_logos.py
```

Le script télécharge Space Grotesk Bold (SIL OFL 1.1) dans `tools/.cache/` et
**vectorise** le texte : aucun SVG livré ne dépend d'une webfont installée.
