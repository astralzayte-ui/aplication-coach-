# À recoller sur le nouveau site

> Le propriétaire refait le site lui-même sur Claude Design.
> **Rien de ce qui suit n'est du dessin.** Tout se rebranche en quelques
> minutes sur n'importe quelle maquette.

---

## 1. Ses informations — à mettre partout

```
E-mail            silenceworlwide@gmail.com
WhatsApp          +212 728 861 105     (https://wa.me/212728861105)
Instagram         @silence.worldwide
TikTok France     @silence.worldwide
TikTok Maroc      @silence.worldwide_maroc
Responsable       Julien Wail Colly    ← obligatoire, mentions légales
```

**Encore inconnus**, ils attendent la LLC : nom exact de la société, État,
adresse du siège, numéro d'immatriculation, EIN, numéro de TVA.

## 2. Les 4 pages légales

Elles sont dans **`partage/legal/`**, en markdown :

```
mentions-legales.md
cgv.md                      ← contient le dropshipping dit clairement
formulaire-retractation.md  ← modèle officiel, formulation imposée
confidentialite.md
```

🔴 **Sans le formulaire de rétractation fourni, le délai de 14 jours
devient 12 mois.** Ce n'est pas optionnel.

`site/construire.cjs` les transforme en pages HTML sombres, avec un bandeau
orange qui liste ce qui reste à remplir.

## 3. Le panier

**`site/project/panier.js`** — 10 Ko, aucune bibliothèque, aucun service.

Il fait quatre choses :
```
le panier            taille retenue, pastille de comptage, panneau, retrait
la commande          ouvre WhatsApp avec tout déjà écrit
la mémoire           retient ?v=<vidéo> dès la 1re visite, même s'il revient
le comptage          envoie les événements à /api/clic
```

**Comment le rebrancher sur n'importe quelle maquette :**

```html
<script src="panier.js" defer></script>
```

Puis des marqueurs sur les éléments — rien d'autre :

| Où | Quoi écrire |
|---|---|
| le bouton d'ajout | `data-ajouter="Sweat + jogging" data-prix="34,90"` |
| l'icône panier | `data-ouvrir-panier` |
| la pastille du compteur | `data-compteur` |
| chaque bouton de taille | `data-taille="M" data-choisie="oui\|non"` |
| un lien produit | `data-produit="Veste"` |

🔴 **Il écoute le document entier, pas les boutons un par un.** C'est fait
exprès : le moteur de Claude Design dessine la page APRÈS le script et la
redessine à chaque clic. Ne pas « simplifier » ça.

## 4. Ce qui reste à finir

**Le compteur de clics, côté serveur.** La partie navigateur tourne déjà et
envoie dans le vide. Il manque la fonction Netlify qui enregistre, plus la
page privée qui affiche : vidéo / visites / clics / paniers / ventes.

## 5. Les décisions déjà prises, à ne pas rouvrir

```
🔴  livraison 4,99 € France · 49 MAD Maroc, carte uniquement
🔴  rétractation 14 jours pour tout le monde (le Maroc n'exige que 7)
🔴  renvoi à la charge du client s'il change d'avis
    gratuit si le produit a un défaut — là c'est la loi
🔴  le dropshipping est dit clairement, et c'est l'argument
❌  le contrôle qualité : RETIRÉ le 05/10 (pas confirmé par l'agent)
🔴  aucun prix barré qui n'a pas été réellement pratiqué
🔴  les prix viennent de marque/prix.md, jamais du cahier des charges
```

## 6. Le logo

```
LE MOT ENTIER   la barre du haut et le pied
                marque/logo/mot-barre-transparent.png
LE S SEUL       réseaux et favicon UNIQUEMENT
                marque/logo/s-fond-noir-transparent.png
```

Les deux ont un **vrai fond transparent**. Ne pas utiliser
`mix-blend-mode: screen` : ça fait une boîte claire dès qu'il y a une photo
derrière.

---

⚠️ **Les photos actuelles appartiennent à d'autres marques.** Le site ne peut
pas être rendu public tant que le fournisseur n'a pas envoyé les vraies.
