# SILENCE — brief pour construire la boutique

> À coller en entier dans Claude Design. Tout ce qu'il faut est ici, rien à aller chercher ailleurs.
> Écrit le 24/09/2026.

---

## 0. Ce qu'on te demande

Construis la boutique en ligne de **SILENCE**, une marque de streetwear neuve qui vend en **France** et au **Maroc**.

**Le trafic vient à 90 % d'un téléphone**, depuis des vidéos TikTok et Instagram. Chaque vidéo pointe vers **une fiche produit**, jamais vers l'accueil.

Donc : **le téléphone d'abord, la fiche produit d'abord.** L'accueil est secondaire.

**Tu n'as pas encore les photos.** Elles arrivent quand le colis du fournisseur arrive. Mets des emplacements clairs au bon format, pas des images bouche-trou.

---

## 1. La marque

**Nom : SILENCE**

**L'idée :** on ne parle pas, on porte. La discrétion comme signe extérieur.

**Le logo** — deux morceaux :

**Le sigil.** Quatre piques de glace de hauteur décroissante, puis une ligne plate.
C'est de la glace qui fond, et c'est un son qui s'éteint. La ligne plate est la seule partie en couleur.

```svg
<svg viewBox="0 0 196 112">
  <polygon points="6,106 18,4 30,106"    fill="#F4F2ED"/>
  <polygon points="38,106 49,34 60,106"  fill="#F4F2ED"/>
  <polygon points="68,106 78,60 88,106"  fill="#F4F2ED"/>
  <polygon points="96,106 105,80 114,106" fill="#F4F2ED"/>
  <rect x="122" y="100" width="68" height="6" fill="#E0A458"/>
</svg>
```

**Le mot.** Lettres très espacées — `letter-spacing: 0.38em`, avec `text-indent` égal pour recentrer.
**Les lettres ne se touchent pas : il y a du silence entre elles.** C'est l'idée du nom en typographie. Ne jamais resserrer.

**Les couleurs — cinq, jamais une de plus :**

| | Hex | Où |
|---|---|---|
| Noir | `#0B0B0C` | le fond, partout |
| Blanc cassé | `#F4F2ED` | le texte, le sigil |
| **Ambre** | `#E0A458` | la ligne du sigil, **le bouton d'achat — rien d'autre** |
| Bleu nuit | `#16324F` | le froid, les détails ; remplace l'ambre sur fond clair |
| Chrome | `#B8BEC8` | les petits textes |

L'ambre et le bleu nuit sont **volontairement opposés** (un chaud, un froid). C'est ce qui évite le look « boutique noir et rouge » de tout le monde.

**Interdits sur le logo :** aucun dégradé, aucune pointe arrondie, aucune ombre, aucun contour, jamais penché ni écrasé, jamais d'autre couleur.

---

## 2. Le design du site

**Le site est un lampadaire dans le noir.**

Ce n'est pas une image : les photos produit seront tournées **la nuit, dans une rue vide, sous un lampadaire orange**. Le site doit être le même monde. Si le site est clair et les photos sombres, ça fait deux marques.

```
FOND           noir #0B0B0C, partout, sans exception
TEXTE          blanc cassé #F4F2ED
UN HALO        ambre #E0A458, un seul, diffus, derrière le produit en vedette
LE BOUTON      ambre plein — la seule tache de couleur saturée de la page
LES DÉTAILS    bleu nuit #16324F
PETIT TEXTE    chrome #B8BEC8
```

**Les règles de forme :**

- **Tout droit.** Zéro coin arrondi mou — le logo n'a que des pointes, le site suit.
- **Photos en portrait, plein écran.** Jamais de paysage.
- **Beaucoup de noir vide** autour des éléments. C'est le silence, en image.
- Les titres en lettres espacées, comme le logo.
- Une seule police, sans-serif, coupée net. Pas d'Inter, pas de Roboto, pas d'Arial.

---

## 3. À qui on vend

**Une seule personne. Tout s'écrit pour lui.**

> **Yanis, 19 ans, Vitry-sur-Seine.** Apprenti, 800 €/mois, vit chez sa mère donc tout part en fringues. Scrolle TikTok 2 h par soir, dans son lit. Achète chez Shein et Zara, le dit à personne.
>
> **Ce qu'il veut vraiment :** qu'on lui demande *« c'est quoi ça ? »*
>
> **Ce qu'il lâche d'un coup : 40 à 60 €.**

Au Maroc c'est **le même mec**. ⚠️ **Il paie par carte** (décidé le 25/09, plus de paiement à la livraison) — alors qu'il n'a **jamais mis sa carte en ligne** et qu'il se méfie à mort des boutiques Instagram. **C'est le plus gros obstacle du site.**

**Ce que ça change pour le site :**

- Il achète au **besoin social**, pas au besoin de se couvrir. Le site vend le moment où on le remarque, pas le tissu.
- **Il ne lit pas.** Photos, prix, avis. Le texte, il le survole.
- **Il n'achète pas du premier coup.** Il regarde, il ferme, il revient 2-3 jours après.
- Carte jeune (Nickel, Revolut) → **prévoir Apple Pay et PayPal**, il évite de taper son numéro.
- **Le paiement en 3 fois pèse lourd** sur cette tranche d'âge.

---

## 4. Le catalogue et les prix

**Cinq catégories. Pas une de plus.** Ne pas en inventer.

**Une catégorie = un prix.** Tous les modèles d'une catégorie coûtent la même chose.

```
5 catégories   =  5 prix
≈ 36 modèles   =  les références réparties dedans, ≈ 7 par catégorie
```

⚠️ **Le nombre exact de modèles n'est pas figé** — le fournisseur est en train
de sourcer. **Le site doit tenir de 3 à 10 modèles par catégorie sans casser.**

Le site montre donc **5 rayons**, pas 5 fiches.

| # | 🇲🇦 | Produit |
|---|---|---|
| 1 | A | Sweat à capuche + jogging *(velours, strass)* |
| 2 | B | Survêtement imperméable *(nylon camo marine)* |
| 3 | C | Veste *(zip-hoodie noir délavé)* |
| 4 | D | Doudoune *(crème matelassée)* |
| 5 | E | Ensemble tête aux pieds *(hoodie + jean baggy)* |

### 🇫🇷 France — en euros

| Produit | Prix |
|---|---|
| Veste | **34,90 €** |
| Sweat + jogging | **39,90 €** |
| Survêtement imperméable | **44,90 €** |
| Doudoune | **59,90 €** |
| Ensemble tête aux pieds | **89,90 €** |

### 🇲🇦 Maroc — en dirhams, jamais en euros convertis

| Produit | Prix |
|---|---|
| Veste | **249 MAD** |
| Sweat + jogging | **299 MAD** |
| Survêtement imperméable | **349 MAD** |
| Doudoune | **449 MAD** |
| Ensemble tête aux pieds | **699 MAD** |

**Ces prix sont figés.** Ne pas les modifier, ne pas en déduire d'autres.

### Le pack — il ne recrute pas, il multiplie

Personne ne lâche 90 € sur une marque découverte dans une story.

| Où | Quoi |
|---|---|
| L'accueil, le panier | le pack en vedette |
| La fiche produit | le pack en complément — « complète la tenue » |
| **En vedette sur l'accueil** | **le sweat + jogging à 39,90 €** — c'est sa fourchette |

**L'économie du pack s'affiche ligne par ligne**, jamais assénée : les pièces séparées, le total, puis le prix du pack. Le lecteur fait la soustraction lui-même — c'est ça qui la rend crédible.

**Le pack à 89,90 € dépasse son plafond d'achat.** Afficher **« ou 3 × 29,97 € »** juste à côté. 30 €, c'est dans sa poche.

**Livraison offerte dès 2 articles.**

### La livraison — elle rapporte, elle ne coûte pas

**Décision du propriétaire :** la livraison est **facturée plus cher qu'elle ne coûte**, et elle sert de levier pour faire monter le panier.

```
Livraison          5,90 €
Offerte dès        59 €
```

**Pourquoi 59 € :** c'est exactement le prix de la doudoune (59,90 €). Quelqu'un qui regarde la veste à 34,90 € voit qu'à 59 € la livraison est offerte → il monte d'un cran au lieu d'ajouter un 2e article qui ferait exploser son budget.

**Affiche le manque, toujours, dans le panier :**

> *« Plus que 19,10 € pour la livraison offerte »*

**Le prix de la livraison est visible dès la fiche produit**, jamais découvert au paiement. Un frais découvert au dernier écran est le premier motif d'abandon — et la 1re plainte relevée chez les concurrents.

⚠️ **Au Maroc, la livraison reste gratuite** ou très basse : le client paie en espèces à la porte, chaque euro ajouté augmente le risque de refus du colis.

---

## 5. Les cinq peurs à tuer

Classées par force. Chacune trouve sa réponse **sur la page**, jamais dans une FAQ que personne n'ouvre.

| La peur | Ce qui la tue |
|---|---|
| **« C'est une arnaque »** | un visage récurrent, un contact visible, une page « qui on est » |
| **« La taille ne va pas m'aller »** | les mensurations en cm par taille, **deux gabarits en photo** |
| **« Ça va arriver dans six semaines »** | **une date précise**, affichée **avant** le paiement |
| **« La matière va décevoir »** | grammage, composition, des chiffres — aucun adjectif |
| **« Le SAV ne répondra jamais »** | un contact direct, avec un délai de réponse annoncé |

**Une date, pas une fourchette.** « Livré entre le 28 et le 2 » bat « 3 à 10 jours ouvrés ».

**Des chiffres, pas des adjectifs.** Une valeur qu'on n'a pas encore s'écrit **« à confirmer »** — jamais inventée.

---

## 6. La fiche produit

C'est la page qui compte. Elle est construite comme une page de vente, mais le client peut circuler.

Dedans, obligatoirement :

- **Le prix et le bouton d'achat visibles sans scroller**
- **Une barre d'achat fixe en bas** de l'écran
- Une photo **de face**, le vêtement en entier
- Une photo **de dos** — c'est là qu'est le print
- Une photo **de près sur la matière** — il voit que c'est pas du Shein
- Le même vêtement porté par **un mec et une meuf** → ça tue la peur de la taille
- Les mensurations en cm par taille
- La date de livraison
- Le contact direct
- Ce qui se passe si ça ne va pas, en clair, **près du bouton**
- Le pack en complément

### Les visages

**Règle absolue, partout : zéro regard caméra.**

Le cadre s'arrête **au nez ou au menton**. On voit le corps, le vêtement, la matière. On ne voit pas les yeux.

Le client vient d'une vidéo où le mec est de dos sous un lampadaire. Il doit retrouver **le même monde**.

**Trois personnages, pas un :** un **maghrébin**, un **noir**, un **blanc**.
Les mêmes sur le site et dans les vidéos. Ils couvrent aussi l'exigence des
« deux gabarits en photo » qui tue la peur de la taille. Ce qui change entre eux :
la peau et les cheveux. **Rien d'autre** — même carrure, même âge, même style.

**Une seule exception : la page « qui on est ».** Là, un vrai visage, une vraie personne, un vrai nom. C'est ce qui tue *« c'est une arnaque »* — et ça ne marche que si c'est réel.

---

## 6 bis. Le site doit répondre aux vidéos — le point le plus important

Les vidéos sont écrites à partir des **plaintes réelles** des clients des concurrents.
Chaque plainte devient une accroche de vidéo. **Le site doit tenir la promesse,
visible, sans avoir à chercher.**

Sinon : il clique sur une vidéo qui dit « ils répondent plus quand t'as payé »,
il arrive sur un site sans contact visible, et **tu viens de prouver que tu es
comme les autres.**

| La vidéo dit | Le site doit montrer |
|---|---|
| **« 60 balles pour du tissu de marché »** | le **grammage en chiffres** + une photo de près sur la matière |
| **« Remboursé… en bon d'achat »** | *« On te rend ton argent. Pas un bon. »* — **près du bouton d'achat** |
| **« Ils répondent plus quand t'as payé »** | le **contact direct** + un **délai de réponse annoncé**, sur la fiche |
| **« Livraison express. Trois semaines. »** | une **date de livraison précise**, affichée **avant** le paiement |
| **« Rose pâle sur la photo. Fuchsia dans le colis. »** | une **vidéo du produit réel**, mention « filmé sans filtre » |
| **« Retour gratuit ? Moins 5 € »** | *« Retour gratuit. Zéro frais. »* — en clair, **près du bouton** |

**La règle :** aucune de ces six réponses ne se cache dans une FAQ, dans les
mentions légales ou en bas de page. **Elles sont sur la fiche produit**, là où
il décide.

⚠️ **Si une promesse ne peut pas être tenue, elle ne va ni sur le site ni dans
une vidéo.** Une promesse non tenue revient en avis 1 étoile — exactement ce
qu'on reproche aux concurrents.

---

## 7. L'ancrage — vrai, ou rien

L'argument le plus fort est la comparaison honnête :

> **« Cette coupe chez les marques : 90 à 130 € »**

Vérifiable, donc crédible.

⚠️ **Jamais de faux prix barré.** En France un prix de référence doit avoir été réellement pratiqué (DGCCRF). Et Yanis le repère immédiatement — c'est le premier signal d'arnaque qu'il cherche.

⚠️ **Aucun avis inventé, jamais.** Une boutique neuve qui assume zéro avis inspire plus confiance qu'une boutique neuve avec quarante avis cinq étoiles datés du même jour.

---

## 8. Le Maroc — carte uniquement

⚠️ **Décidé le 25/09 : plus de paiement à la livraison. Nulle part.**
Au Maroc comme en France, **le client paie par carte avant l'expédition.**

**Ce que ça change, et c'est le point le plus délicat du site :**

Le client marocain n'a **jamais mis sa carte en ligne**. Il se méfie à mort des
boutiques Instagram. Lui demander sa carte, c'est lui demander le plus gros
effort de confiance possible.

**Donc tout ce qui rassure compte deux fois plus sur la version marocaine :**

- La page « qui on est », avec un vrai visage et un vrai nom
- Le contact direct, **avant** le paiement, pas après
- La date de livraison précise
- « On te rend ton argent » et « Retour gratuit », en clair près du bouton
- Le paiement passe par un prestataire connu et visible — le logo rassure

**Les prix restent en MAD**, jamais des euros convertis.
**Pousser le produit d'appel** (249-299 MAD), jamais le pack à 699.

🇫🇷 En France : **carte, Apple Pay, PayPal**, et le paiement en 3 fois si possible.

## 9. Compter les clics — exigence explicite du propriétaire

Le lien en bio Instagram est unique. Sans ça, rien ne distingue les sources et les 62 vidéos n'apprennent rien.

1. Accepter **`?v=<numéro de vidéo>`** et **`?p=<code produit>`** dans l'URL
2. **Mémoriser la source dès la première visite**, et la garder
3. **La rattacher à la commande**, pas seulement à la visite — sinon on sait qui a cliqué, jamais qui a acheté
4. Une page de relevé : clics et commandes **par vidéo, par produit, par jour**

Côté bio Instagram : **un bouton par produit.**

---

## 10. Les infos de contact

```
Email        astralzayte@gmail.com
TikTok FR    @silence.worldwide
TikTok MA    @silence.worldwide_maroc
Insta MA     @silence.worldwide
Insta FR     à créer
```

*(Les trois comptes existants ne s'écrivent pas encore tous pareil — ils seront uniformisés. Utilise l'orthographe ci-dessus.)*

Pas encore de nom de domaine.

---

## 11. Ce qu'on ne fait pas

- ❌ Pas de compte obligatoire pour commander
- ❌ Pas de popup avant que la page ait été lue
- ❌ Pas de faux compte à rebours
- ❌ Pas de « plus que 2 en stock » si c'est faux
- ❌ Pas de case pré-cochée, pas d'assurance glissée dans le panier
- ❌ Pas de photo portant la marque d'un concurrent
- ❌ Pas de sélecteur homme/femme — les produits sont unisexes, ça n'ajoute qu'une porte devant une pièce vide
- ❌ Pas d'emoji, pas de dégradé, pas de carte à bordure colorée à gauche

---

## 12. Les photos — prends celles du site existant

**Le propriétaire a déjà un site avec ses produits dessus :**

```
https://flourishing-dasik-35d194.netlify.app/
```

**Analyse-le, récupère les photos, et mets-les sur le nouveau site comme si
c'étaient les vraies.** Le but : avoir tout de suite une vitrine complète et
belle à regarder, au lieu de zones grises.

⚠️ **Ce sont des photos provisoires.** Certaines portent encore des marques
d'autres boutiques ou un filigrane. **Le site ne doit pas être rendu public
tant qu'elles n'ont pas été remplacées.** C'est une vitrine pour lui, pas
encore une boutique ouverte.

Les vraies photos arriveront avec le colis du fournisseur. Elles se
remplaceront une par une, sans toucher à la structure.

**Donc : prévois que chaque photo soit facile à remplacer**, et garde le même
format partout (portrait).

---

## 13. Téléphone ET ordinateur

**Le téléphone d'abord** — 90 % du trafic vient de là, et c'est là que ça se
joue. Mais **le site doit être beau sur un ordinateur aussi** : c'est là que le
propriétaire le regarde, le montre, et le fait valider.

```
TÉLÉPHONE     le prix et le bouton visibles sans scroller
              une barre d'achat fixe en bas
              photos en portrait, plein écran
              formulaire le plus court possible

ORDINATEUR    la grille de produits respire, elle ne s'étale pas
              une largeur maximale au contenu — pas de texte
              qui traverse tout l'écran
              les photos gardent leur format portrait
              rien n'est coupé, rien n'est étiré
```

⚠️ **Le piège classique :** un site pensé pour le téléphone qui, sur un grand
écran, devient une colonne étroite perdue au milieu du vide. **Ça ne doit pas
arriver.**

---

## 14. Quand c'est fini — publie-le

**Publie le site en artefact**, comme tu le fais d'habitude. Rien à envoyer,
rien à exporter : le propriétaire le retrouve dans ses artefacts, et Claude Code
le lit directement de là pour le mettre dans le dépôt du projet.

Ensuite c'est Claude Code qui le fait vivre : il mesure ce qui marche, il
corrige, il améliore chaque semaine.

**Donne-lui un titre clair** — par exemple *« SILENCE — la boutique »* — pour
qu'il soit reconnaissable dans la liste.

---

## 15. En une ligne

> Une boutique **noire**, pensée **pour un téléphone**, où chaque fiche produit est une page de vente, où **la seule couleur est le bouton d'achat**, et où **personne ne regarde la caméra**.
