# Diffusion — comment on publie et comment on mesure

> Étape 1 (livrable 7) et étape 5 de la méthode de lancement.
> Écrit le 24/09/2026.
> **Cette page se ressort automatiquement** quand on dit « on fait les photos » ou « on lance les vidéos ».

---

## 1. Le plan en une image

```
62 vidéos  ·  40 jours  ·  4 sources  ·  1 moule  ·  1 décision au milieu
```

```
VAGUE 1 — jours 1 à 20
  31 hooks, déjà écrits
  19 dans le moule  (60 %)
  12 hors moule     (40 %)  ← le témoin

        🛑 JOUR 21 — ON LIT
        quels hooks ont tenu à 3 secondes
        quelle branche a tenu
        quelle source gagne
        le moule aide ou freine ?

VAGUE 2 — jours 21 à 40
  31 vidéos
  16 REJOUÉ   les gagnants de la vague 1, sur le 2e produit
  15 NEUF     source 4 — les avis 1 étoile
  toutes dans le format qui a gagné au jour 21
```

**La date de départ flotte.** Pas forcément le 1er octobre.

**Rythme : 3 vidéos tous les 2 jours.**
Une toujours **le soir, 21h-1h** — c'est l'heure de Yanis. La deuxième le midi.

---

## 2. Les 4 sources

D'où viennent les mots. Une source, c'est pas un format — c'est un endroit où on va chercher des phrases.

| | Source | Part | État |
|---|---|---|---|
| 1 | **Toi + moi** — tes objections | 40 % · 13 hooks | ✅ fait |
| 2 | **Ad Library** — les pubs qui tournent | 30 % · 9 hooks | ✅ fait |
| 3 | **Scraping UGC** — les vidéos qui font des vues | 30 % · 9 hooks | ✅ fait |
| 4 | **Avis 1 étoile** — ce que les clients gueulent | vague 2 · 15 hooks | ❌ à faire |

Les 31 hooks de la vague 1 sont ici : **https://claude.ai/artifact/Y72XXLkRLn3WeNwi9oZp9q**
Chacun porte sa source. Coût total du scraping : **19 crédits.**

**Les sources 1, 2 et 3 sont épuisées.** Elles ne redonneront rien de neuf sans repayer.
La 4 est la seule qui a encore de la matière — et elle sert **au jour 21**, pas avant.

### Les branches

Les 31 hooks sont rangés dans les **12 angles**. Un angle = une branche, 2 à 3 hooks dedans.

Au jour 21 on lit les deux :
- quel **hook** a tenu → on le rejoue
- quelle **branche** a tenu → **on écrit de nouveaux hooks dedans**

Le deuxième vaut plus. Un hook gagnant donne une vidéo. Une branche gagnante donne les hooks du mois suivant.

---

## 3. Le moule

**Ce n'est pas une source. C'est le contenant.** Il s'applique à 90 % des vidéos.

### Le squelette

```
0-1 s     le hook s'affiche          ← change à chaque fois
1-3 s     il enfile le vêtement      ← même geste, toujours
3-6 s     il marche, plan large      ← même cadrage, toujours
6-8 s     le prix                    ← même place à l'écran
8-10 s    ⬛ SILENCE                  ← écran noir, logo, zéro son
```

**Même structure. Contenu différent.** Ce qui bouge : le texte et le produit. C'est tout.

Écrire un script = **changer une phrase**, pas repartir de zéro.

### Le compteur

Le moule retenu ajoute un compteur qui monte : **Jour 1, Jour 2, Jour 3…**
Ça donne une raison de revenir demain — et ça marche à 0 abonné.

### Le silence à la fin

Les 2 dernières secondes : écran noir, logo, **aucun son**.

C'est la signature. Elle est à la fin et pas au début, parce que 3 secondes de vide en ouverture = 3 secondes où il scrolle. La rétention à 3 s décide de la diffusion, on ne la sacrifie pas.

### Pourquoi un moule

Preuve tirée du scraping : **`no.model.daily.fit` → 22,8 millions de vues.** Aucune accroche. Juste « Tenue du jour », répété tous les jours, cadré pareil.

Trois raisons :
1. Yanis te reconnaît en une demi-seconde
2. L'algo comprend à qui te montrer — 62 vidéos qui se ressemblent = un signal clair
3. Tu arrêtes de réinventer 62 fois

### Le témoin — 60/40

12 vidéos de la vague 1 sont **hors moule**, pour avoir quelque chose à comparer.

Sans témoin, tu ne sauras jamais si le moule aide ou s'il te freine.

⚠️ **19 contre 12, ce n'est pas une preuve scientifique.** Mais si le moule est franchement mauvais, ça se verra au jour 21 — avant d'avoir brûlé les 62.

---

## 4. Les règles techniques

Trois règles. Les rater coûte des vues, pas de l'argent.

### La zone sûre — 720 × 1200 px

L'application recouvre les bords de ta vidéo. Tout texte qui sort de la bande centrale est **caché par l'interface**.

Sur un format 1080 × 1920 :

| Bord | Laisser libre | Pourquoi |
|---|---|---|
| Haut | **220 px** | les onglets |
| Bas | **500 px** | la légende, la musique |
| Gauche | **180 px** | symétrie |
| Droite | **180 px** | la colonne like / commentaire / partage |

→ **Bande utile : 720 × 1200, de y=220 à y=1420.** Tout le texte tient dedans.

C'est l'erreur n°1. Vérifier avec un calque avant une grosse publication.
*(Ces chiffres bougent avec les mises à jour des applis — à revérifier de temps en temps.)*

### Le texte à l'écran

- **Blanc, contour noir épais, aucun fond coloré**
- **Figé.** Aucune animation d'entrée ou de sortie
- Il apparaît en entier dès la première image de son passage
- Taille : commencer vers 58 px, réduire jusqu'à ce que ça rentre dans la bande

Un texte qui bouge = « c'est une pub ».
Un texte figé = « c'est un mec ».

### Le son — la règle qui change tout

**En organique : ne colle jamais la musique dans le fichier.**

Publie la vidéo muette, puis **attache le son tendance dans l'application**.

L'algorithme pousse les vidéos qui utilisent un son natif. Musique collée = moins de vues.

*(On ne colle la musique que pour de la pub payante, où on ne peut pas attacher un son natif.)*

- Couper le son des plans par défaut, une seule piste porte tout
- Faire descendre le son sur la dernière seconde — une coupure nette sonne cassé
- Sauf sur le silence final : là, c'est voulu

---

## 5. Les visuels

### Les deux photos

```
Photo fournisseur     →   JAMAIS publiée
                          fond blanc, le vêtement seul
                          c'est la matière première

Higgs Field           →   habille le personnage avec

Photo publiée         →   ton mec, dans la rue, le soir
```

**La moche sert à fabriquer la belle.**

### Ce que le fournisseur doit envoyer

- **Fond blanc uni**, le vêtement seul ou sur mannequin — mais **toujours pareil**
- **De face ET de dos**
- **Chaque coloris**, chaque variante
- **Haute résolution**
- **Zéro filigrane, zéro logo, zéro texte** dessus
- Pas de montage, pas de collage

Le dernier point est le plus important : c'est exactement ce qui a rendu les 36 premières photos inutilisables (marques concurrentes, filigrane Vinted, gants Nike).

### La vraie photo bat l'image générée

Une image générée **peut se voir**. Et une image qui sent l'IA, pour Yanis, dit la même chose qu'un catalogue fournisseur : *« c'est pas une vraie marque »*.

**Ta meilleure arme, c'est le colis.** Le vrai vêtement, porté par un vrai pote, dehors, au téléphone. Ça bat toutes les images générées et ça coûte 0 €.

**Higgs Field sert à compléter** : les coloris pas reçus, les décors impossibles.

⚠️ **Higgs Field est à 0 crédit.** Rien ne se lance tant que ce n'est pas rechargé.

### Le personnage de référence

Higgs Field garde un **personnage**. On le crée **une fois**, on le réutilise partout.
Plus besoin de décrire le mec à chaque image : c'est le même sur les 62 vidéos.

Un visage qui revient, c'est déjà la moitié de la marque.

### L'univers fort — 2 sur 5

**Test :** cache le logo. On sait encore que c'est toi ? Alors l'univers est fort.
Pas parce que c'est beau — parce que **ça se répète**.

| | | |
|---|---|---|
| **Le même mec** | c'est toujours lui qui porte | ❌ à décider |
| **La même lumière** | même heure, même ambiance | ❌ à décider |
| **Le même endroit** | même ville, même type de décor | ❌ à décider |
| **Le même cadrage** | c'est le moule | ✅ |
| **Les mêmes couleurs** | noir, blanc cassé, ambre | ✅ |

Les trois manquants se décident en 10 minutes et coûtent 0 €.

### Où l'univers doit tenir

```
1.  TikTok / Insta     ← 90 % du contact, c'est là qu'il te découvre
2.  Le site            ← il y arrive déjà convaincu, ou pas
3.  Le colis           ← le seul moment où il touche la marque
```

Yanis voit **30 vidéos** avant de voir le site une fois.
Fort dans le feed + mou sur le site → tu vends quand même.
L'inverse → tu vends rien, il n'arrive jamais sur le site.

---

## 6. Le tableau du jour 21

À remplir le jour 21. C'est le seul moment de décision du plan.

| Ce qu'on lit | Ce qu'on en fait |
|---|---|
| Les hooks qui ont tenu à 3 s | rejoués sur le 2ᵉ produit en vague 2 |
| Les hooks morts | jetés |
| La branche qui a tenu | on écrit de nouveaux hooks dedans |
| La source qui gagne | on en fait plus le mois suivant |
| Moule (19) vs témoin (12) | le gagnant prend 100 % de la vague 2 |

**Le chiffre qui compte : la rétention à 3 secondes.** C'est elle qui juge le hook.
Les clics jugent le produit, pas le hook. Ne pas confondre les deux.

---

## 6 bis. Les comptes

```
TikTok France    @silence.worldwide          ✅ ouvert
TikTok Maroc     @silence.worldwide_maroc    ✅ ouvert
Insta Maroc      @silence.worldwide          ✅ ouvert
Insta France     ❌ À CRÉER
```

⚠️ Les trois existants ne s'écrivent pas pareil aujourd'hui. **À uniformiser.**

Email de la marque : **astralzayte@gmail.com**

---

## 7. Ce qui reste à faire

| | État |
|---|---|
| **Créer le compte Insta France** | ❌ **À FAIRE — rappel demandé** |
| **Connecter Metricool à Insta** | ❌ **À FAIRE — rappel demandé** — c'est ce qui automatise les publications |
| Uniformiser les noms des 3 comptes | ❌ `silence.worldwide` partout (+ `.maroc`) |
| Le nom du compte | ❌ à inventer ensemble |
| Les 3 premières vidéos | ❌ **un compte à 0 abonné ne diffuse pas une vidéo qui vend** |
| Le personnage / la lumière / le lieu | ❌ 10 min, 0 € |
| Le découpage 31 hooks → 62 scripts | ❌ attend le catalogue |
| Les avis 1 étoile | ❌ sert au jour 21 |
| Recharger Higgs Field | ❌ |
