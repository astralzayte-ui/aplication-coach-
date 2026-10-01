# Le vrai logo — la glace

> Rangé ici le **30/09/2026**. Avant ça, les logos n'étaient dans aucun
> fichier du projet : le canvas « SILENCE — le logo » du 24/09 et
> `partage/BRIEF-SITE-SILENCE.md` décrivaient tous les deux un autre signe
> (4 piques + une ligne ambre) qui **n'est plus le logo**.

🔴 **Ces deux documents sont périmés. Ils décrivent un logo qui n'existe plus.**
À refaire une fois la couleur du site tranchée.

## 🔴 Qui va où

```
LE MOT ENTIER   la barre du haut et le pied du site
                mot-barre-transparent.png

LE S SEUL       UNIQUEMENT les réseaux et la favicon
                → jamais dans la barre du site
```

## Les fichiers

| Fichier | Taille | Pour quoi |
|---|---|---|
| `mot-barre-transparent.png` | 1240 × 355 | **le site** — fond transparent, va sur n'importe quoi |
| `s-fond-noir-transparent.png` | 800 × 900 | le S détouré — réseaux et favicon |
| `mot-barre.png` | 1240 × 355 | le mot sur fond noir |
| `logo-avatar.png` | 1000 × 1000 | Instagram, TikTok, la favicon |
| `logo-bandeau.jpg` | 2000 × 661 | l'original, avec le fantôme |
| `logo-bandeau-2.jpg` | 2000 × 661 | l'original, deuxième version |
| `logo-vertical.jpg` | 1116 × 2000 | les stories et les vidéos |
| `logo-rond.jpg` | 2000 × 2000 | l'original du rond |

## Pourquoi les versions transparentes

Le logo sort de Gemini avec un fond bleu nuit **#121929**.

On a d'abord essayé `mix-blend-mode: screen` : ça marche sur du noir uni, mais
**ça fait une boîte claire dès qu'il y a une photo derrière**. Vu sur la barre
du haut, au-dessus de la photo d'accueil.

La vraie solution : **le fond est devenu transparent pour de vrai**. Chaque
pixel garde sa couleur, et sa transparence suit sa luminosité — le noir
disparaît, la glace reste. Le logo va désormais sur n'importe quel fond.

## La question ouverte

**La glace est bleue. Le site est ambre.**
Proposé, pas encore tranché : tout passe en glace, **l'ambre gardée
uniquement sur le bouton d'achat** — un seul point chaud dans une page
froide. L'autre option fait disparaître le bouton.
