---
name: site-legal
description: Le contrôle légal de n'importe quel site qui vend ou collecte des données — boutique, page de vente, site vitrine — pour la France, l'Europe et le Maroc. Sort la liste à cocher, vérifie le site point par point et rend un verdict en couleurs. À utiliser AVANT toute mise en ligne, à chaque création ou refonte de site, et dès qu'il parle de légal. Déclencheurs : "le légal", "c'est légal ?", "vérifie le site", "check légal", "tout est bon ?", "c'est OP ?", "mentions légales", "CGV", "RGPD", "cookies", "confidentialité", "remboursement", "faux avis", "droits des images", "avant de mettre en ligne", "je crée un site", "refais le site".
---

# LE SITE EST BEAU. EST-IL LÉGAL ?

**Ce skill ne parle pas de design.** Couleurs, police, mise en page : ailleurs.
Ici, uniquement ce qui coûte une amende, un procès, un remboursement forcé ou
la fermeture du site.

## Comment tu t'en sers

**Quand il dit « vérifie le site » ou avant chaque mise en ligne :**

```
1.  tu ouvres le site (ou son code) et tu passes les 9 blocs, dans l'ordre
2.  chaque ligne reçoit sa pastille : ✅ fait · ❌ manque · 🟠 à confirmer
3.  tu rends UNIQUEMENT les ❌ et les 🟠, avec la correction en une ligne
4.  tu finis par le verdict :
       🟢 EN LIGNE OK          zéro ❌
       🟠 EN LIGNE, À FINIR    que des 🟠 sans risque d'amende
       🔴 NE PAS PUBLIER       au moins un ❌ des blocs 1, 4, 6 ou 7
```

**Tu vérifies sur le site lui-même, pas sur ce qu'on t'en dit.** Une page
« prévue » n'existe pas. Un texte entre crochets `[à remplir]` = ❌.

⚠️ **Ce skill n'est pas un avocat.** Il attrape 95 % des oublis. Pour la TVA
et le statut de la société, la réponse finale vient d'un comptable du pays
concerné. Tu le dis, tu ne tranches pas à sa place.

---

## BLOC 1 — LES PAGES OBLIGATOIRES

| La page | Ce qu'elle doit contenir | Oubliée = |
|---|---|---|
| **Mentions légales** | nom de la société, forme, adresse, e-mail, téléphone, immatriculation, n° de TVA, responsable de publication, **l'hébergeur (nom, adresse, téléphone)** | amende |
| **CGV** | prix TTC, livraison et délais, paiement, rétractation, garanties légales, **médiateur**, droit applicable | le client n'est engagé à rien |
| **Formulaire de rétractation** | le **modèle officiel**, fourni sur le site | le délai passe de **14 jours à 12 mois** |
| **Confidentialité** | qui, quelles données, pourquoi, combien de temps, qui y a accès, sortie hors UE, droits, plainte à la CNIL | amende |
| **Retours et remboursements** | pas obligatoire seule — mais **le client la cherche**. Résume les CGV en clair | des messages, des litiges |

```
❌  PAS BESOIN de CGU pour une boutique : les CGV suffisent
❌  PAS BESOIN d'une page cookies à part : une section de la confidentialité
```

🔴 **Les 4 obligatoires sont liées en bas de CHAQUE page.**

---

## BLOC 2 — LE BOUTON ET LE PANIER

```
☐  le bouton final dit qu'il ENGAGE À PAYER
      « Valider » ❌   « Commander et payer » ✅
☐  le prix TOTAL est visible AVANT ce bouton, livraison comprise
☐  les frais de renvoi : écrit noir sur blanc qui les paie
      pas écrit = c'est le vendeur qui paie
☐  la date ou le délai de livraison, AVANT le paiement
☐  aucune case pré-cochée (assurance, option, newsletter)
```

---

## BLOC 3 — LE REMBOURSEMENT, CE QUE LA LOI IMPOSE

```
FRANCE / UE    14 jours de rétractation, sans motif
               remboursé sous 14 jours, LIVRAISON ALLER COMPRISE
               par le même moyen de paiement
               🔴 un bon d'achat seulement si le client le demande
MAROC          7 jours de rétractation (loi 31-08)          🟠 à vérifier
LES DEUX       un défaut = garantie de conformité, 2 ans en France,
               tout aux frais du vendeur
```

---

## BLOC 4 — LES PROMESSES (le bloc qui fait le plus de dégâts)

**Chaque phrase du site doit pouvoir être prouvée le jour où on la conteste.**

| Interdit | Pourquoi |
|---|---|
| **un faux avis**, même un seul | pratique commerciale trompeuse, jusqu'à **300 000 €** |
| des avis triés sans le dire | il faut écrire **s'ils sont vérifiés, et comment** |
| un prix barré jamais pratiqué | le prix de référence = **le plus bas des 30 derniers jours** |
| « stock limité », compte à rebours, faux | fausse urgence = trompeuse |
| « −36 % sous le marché » sans relevé | garder **la preuve datée** (captures, liens) |
| « contrôlé avant l'envoi » non confirmé | **promesse non prouvable** → on la retire tant qu'elle n'est pas écrite par le fournisseur |
| « le plus choisi » sans ventes | « Recommandé » tant que les chiffres ne le prouvent pas |
| un délai qu'on ne tient pas | le client peut annuler et être remboursé |

**Le test, phrase par phrase :** *si un client ou la DGCCRF me demande la
preuve demain, je l'ai ?* Non → on retire la phrase.

---

## BLOC 5 — LES DONNÉES : ON NE PREND QUE LE NÉCESSAIRE

```
☐  chaque champ de formulaire a une raison
      newsletter    l'e-mail, rien d'autre
      commande      nom, adresse, e-mail, téléphone
      ❌ date de naissance, genre, « comment nous as-tu connus » obligatoire
☐  chaque donnée a une durée de conservation écrite
☐  aucune donnée sensible (santé, religion, origine…)
☐  MAROC : déclaration à la CNDP (loi 09-08)                🟠 à vérifier
```

---

## BLOC 6 — LES E-MAILS : L'ACCORD AVANT TOUT

**Envoyer de la pub par e-mail à un particulier = son accord AVANT.**

```
☐  une CASE À COCHER, vide au départ, obligatoire pour s'inscrire
      « J'accepte de recevoir les e-mails de X (nouveautés et offres) »
      une simple phrase en dessous du bouton ❌ ne suffit pas
☐  sans la case cochée, RIEN ne part
☐  la preuve est gardée : l'e-mail + la DATE de l'accord
☐  le lien « se désinscrire » dans chaque e-mail
☐  le lien vers la confidentialité à côté de la case
```

*Vécu sur SILENCE (04/10) : le popup −10 % envoyait l'e-mail avec une
simple phrase. Corrigé : case obligatoire + accord daté envoyé avec l'e-mail.*

---

## BLOC 7 — LES COOKIES ET LE SUIVI

**La question à se poser : est-ce que quelque chose sur le site suit le
visiteur, ou envoie ses infos à une autre société ?**

```
PAS BESOIN DE BANDEAU si TOUT ce qui suit est vrai :
  ✅ ce qu'on garde sert au fonctionnement (panier, favoris, code promo)
  ✅ la mesure est FAITE MAISON, pour nos stats, sans profil, sans revente
     (ex. retenir quelle vidéo a amené le client)
  ✅ elle est EXPLIQUÉE dans la confidentialité, avec le droit de s'y opposer
  ✅ aucun outil d'une autre société : ni Google Analytics, ni pixel
     Meta/TikTok, ni Hotjar

BANDEAU OBLIGATOIRE dès qu'il y a un pixel pub ou un outil de mesure extérieur
  🔴 « Refuser » aussi visible et aussi facile que « Accepter »
  🔴 rien ne se charge AVANT le clic
```

### 🔴 Le piège invisible : les polices d'écriture

**Une police chargée depuis Google (fonts.googleapis.com) envoie l'adresse
internet de chaque visiteur à Google**, sans son accord. Des tribunaux
européens ont condamné pour ça.

```
❌  <link href="https://fonts.googleapis.com/...">
✅  les fichiers de la police copiés SUR le site — gratuit, 10 minutes,
    et le visiteur ne voit aucune différence
```

**Même règle pour :** les vidéos YouTube intégrées, les cartes Google, les
boutons « partager » des réseaux. Une image ou un lien à la place.

### Ce que la page confidentialité doit dire, mot pour mot vrai

**Si le site suit quelque chose, la page le dit.** La phrase « aucun suivi »
alors que le site retient la vidéo d'origine = **mensonge écrit**, pire que
l'absence de page.

---

## BLOC 8 — LES IMAGES ET LES MARQUES

```
🔴  aucune photo avec le logo d'une autre marque (Nike, Adidas…)
      = contrefaçon / atteinte à la marque, même « en attendant »
🔴  aucune photo prise chez un concurrent ou sur Google Images
🟠  photos du fournisseur : son accord ÉCRIT pour les publier
✅  nos propres photos, ou générées par nos outils
✅  le nom de la marque n'imite pas une marque existante
```

**Tant qu'une photo n'a pas de droit clair : le site reste caché**
(« noindex ») et le lien ne se partage pas.

---

## BLOC 9 — CE QUE LE PRODUIT ET LA SOCIÉTÉ DOIVENT AFFICHER

```
☐  TEXTILE : la composition, pièce par pièce, AVANT l'achat
      « 80 % coton, 20 % polyester » — un grammage ne suffit pas
☐  le pays de fabrication, l'entretien
☐  DROPSHIPPING : le mode de vente dit clairement, une fois, visible
      + « ton contrat est avec nous, et avec nous seuls »
☐  le MÉDIATEUR de la consommation : choisi, payé, nommé sur le site
      (~100 à 300 €/an, obligatoire en France)
☐  la FILIÈRE du produit (REP) : textile = Refashion, logo Triman
☐  la TVA — la règle des 3 pays :
      1. où la société est immatriculée  → impôt sur les bénéfices
      2. où il vit                       → son impôt à lui
      3. où est le client + la marchandise → LA TVA
      🔴 une société hors UE n'a AUCUN seuil : TVA dès la 1ʳᵉ vente
```

---

## Hors sujet ici

```
le design, les couleurs, les contrastes, le clavier, les textes des images
   → l'accessibilité est obligatoire en UE depuis juin 2025, SAUF pour les
     micro-entreprises (moins de 10 personnes ET moins de 2 M€)
la conversion, ce qui fait vendre      → skill site-qui-vend
la structure copiée d'un concurrent    → skill projet, étape 11
```

---

## Le modèle des pages

Pour SILENCE, les 5 pages existent dans `partage/legal/` (mentions,
CGV, rétractation, confidentialité, remboursements). **Pour un nouveau
site : on les copie, on change les crochets. On ne réécrit jamais de zéro.**
