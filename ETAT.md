# Où on en est

> Mis à jour le **03/10/2026**.
> Claude le lit en ouvrant une session, et l'écrit à chaque décision.
> **Trois lignes suffisent à savoir. Le reste est du détail.**

---

```
PROJET      SILENCE — streetwear, France et Maroc
ÉTAPE       7 sur 15 faites · le site (11) construit, sans les vraies infos
ON ATTEND   l'agent (muet depuis le 30/09) · la société de la LLC (TVA, médiateur)
LA SUITE    relancer l'agent — tout le reste en dépend
```

---

## Ce qui est fait

| | |
|---|---|
| **Étude de marché** | prix concurrents relevés pour de vrai |
| **Le client** | Yanis, 19 ans, Vitry |
| **Les hooks** | 49, dont 18 tirés d'avis 1 étoile réels |
| **Le budget** | **4 244 MAD** ≈ 392 € → **18 ventes** · le projet 2 : 1 244 MAD → 6 ventes |
| **Les prix** | figés, France et Maroc |
| **Le questionnaire** | en ligne, vérifié, 18 conditions, 5 langues |
| **Metricool** | branché — Insta + TikTok, je lis et je publie |
| **Les 3 commis** | agents en parallèle — releveur de prix, lecteur d'avis, écrivain de scripts |
| **Le montage vidéo** | `video/` — le moule rendu en code, pas par Higgs Field |
| **Les 4 pages légales** | écrites en brouillon dans `partage/legal/` — crochets à remplir |
| **La boutique** | 3 écrans — refaits sur le système ORYZO, survols et vidéo au défilement |
| **Les 4 vidéos** | lues ; ce qu'on en garde est dans les décisions ci-dessous |
| **Le lien envoyé** | 30/09 — à relancer s'il n'a rien dit sous 3 jours |

## 🔴 LA TVA — le trou trouvé le 30/09

Une LLC américaine ne paie pas d'impôt **américain**. Elle doit quand même la
**TVA française** : la TVA suit la marchandise et le client, pas la
nationalité de la société. Le seuil de 10 000 € ne s'applique qu'aux sociétés
établies dans l'UE → **zéro seuil, dès la première vente**.

```
Sweat + jogging  34,90 €  →  −5,82 €
T-shirt          11,00 €  →  −1,83 €
Ensemble         84,00 €  →  −14,00 €
```

**Les 18 ventes pour rentrer dans les frais sont donc FAUSSES.** À recalculer
dès que l'agent donne son prix d'achat.

**Solution : le guichet unique (OSS)** — une inscription, une déclaration par
trimestre. Sauf si l'entrepôt est EN France : alors il faut un numéro de TVA
français.

**3 questions à poser à l'agent dans la relance :**
```
1.  l'entrepôt européen est dans quel pays ?
2.  qui est l'importateur quand la marchandise entre dans l'entrepôt ?
    (lui, normalement — à écrire noir sur blanc)
3.  la composition des fibres, pièce par pièce — obligatoire avant l'achat
```

---

## Ce qui bloque

**Le lien est parti chez l'agent le 30/09.** Tout attend sa réponse. Sans son catalogue :
pas de scripts vidéo, pas de site, pas de marge réelle.

## Ce qu'il doit faire, lui

```
🟠  recharger Higgs Field
🟠  Stripe en lecture seule            ← inutile tant qu'il n'y a pas de vente
```

## Les chiffres qui manquent encore

```
❌  la commission de l'agent, en %
❌  le médiateur de la consommation — obligatoire, ~100 à 300 €/an
❌  Refashion (éco-contribution textile) — obligatoire pour vendre du
    textile en France, quelques centimes la pièce + l'inscription
❌  le prix du contrôle qualité
❌  le prix de l'échantillon
✅  l'entreprise 2 500 MAD · le numéro américain 500 MAD — une seule fois
❌  ce qui a déjà été payé à l'agent
```

---

## Les adresses et les accès

| | |
|---|---|
| La boutique — la source | dossier **`boutique/`** (HTML simple) — `node boutique/construire.cjs` puis publication |
| La boutique — à regarder | **silence-boutique.netlify.app** — refaite le 03/10 sur la structure de boutique-streetwear.com |
| Questionnaire fournisseur | **silence-supplier.netlify.app** |
| Netlify | clé dans les Identifiants API — Claude publie et renomme seul |
| Gemini | clé dans les Identifiants API |
| Photos provisoires | `flourishing-dasik-35d194.netlify.app` ⚠️ **jamais public** |
| Metricool | connecteur branché — marque `SILENCE | Menswear`, id **7079823** |
| E-mail | **silenceworlwide@gmail.com** |
| WhatsApp | **+212 728 861 105** |
| Responsable publication | **Julien Wail Colly** |
| Instagram | `silence.worldwide` — compte professionnel ✅ |
| TikTok France | `silence.worldwide` |
| TikTok Maroc | `silence.worldwide_maroc` |
| YouTube | branchée ✅ mais au nom **« Julien Colly »** — 🔴 à refaire au nom de SILENCE |
| TikTok | `SILENCE | Menswear` — ⚠️ **compte personnel**, stats réduites |

## 🔴 LE SITE — repris par Claude, sur la structure d'un concurrent

**Décidé le 02/10 au soir.** Il ne le refait plus lui-même.

```
la recherche concurrents   →  quand IL le demande
la construction             →  Claude, directement
la méthode                  →  copier l'ORDRE des blocs d'un
                                concurrent qui vend vraiment,
                                remplir avec nos mots et nos prix
```

Écrit dans le skill, étape 11. **On ne copie jamais le dessin, les textes
ni les photos.**

Tout ce qu'il faut recoller reste dans `site/A-RECOLLER.md`.

**✅ Fait le 03/10 :** concurrent n°1 choisi = **boutique-streetwear.com**.
Copié : l'ordre des blocs, les onglets, le popup −10 % contre l'e-mail,
le menu, la fiche produit. Pas copié : leurs photos, leurs textes,
leurs faux avis.

```
le code                 boutique/  (data.js = prix, produits, FAQ)
les e-mails du popup    Netlify → Forms → « newsletter »
le code de bienvenue    BIENVENUE10 = −10 % (baisse la marge)
caché tant que flou     prix et délai de livraison, composition,
                        mesures, avis clients
```

🔴 Photos provisoires = d'autres marques → **jamais public** tant
qu'elles ne sont pas remplacées (le site est en « noindex »).

**📌 DÉCIDÉ LE 04/10 — la prochaine refonte (il la demandera cette semaine) :**
```
le but        refaire boutique-streetwear.com EN MIEUX, pas une copie
le mode       il met Claude en capacité maximale — tu prends le temps
              de penser avant de dessiner
avant         relire marque/structure-concurrent.md
après         passer le skill site-legal, verdict en couleurs
```

**À régler avec la refonte :**
```
✅  05/10 : les polices sont copiées sur le site (plus rien chez Google)
✅  05/10 : « Contrôlé avant l'envoi » retiré de la pub du site (bandeau,
    héros, réassurance, fiche), puis de la FAQ et des CGV à sa demande.
    On le remet seulement si l'agent le confirme PAR ÉCRIT
✅  05/10 : le lot tenue + veste (49,90 €) s'applique tout seul dans le
    panier, avec la suggestion « complète la tenue »
✅  05/10 : LE TABLEAU DE BORD du site — le compteur /api/clic range
    visites, clics, paniers, commandes PAR VIDÉO (aucune donnée perso).
    Claude lit : node boutique/outils/releve.mjs
    🔴 Publier UNIQUEMENT avec boutique/outils/publier.sh — un zip
    envoyé à l'ancienne efface les 2 fonctions
    Les étiquettes des vidéos : marque/etiquettes-videos.md
✅  04/10 : case « j'accepte les e-mails » obligatoire (popup + pied)
✅  04/10 : page Retours et remboursements (carte, pas de bon imposé)
✅  04/10 : la mesure des vidéos écrite dans la confidentialité
❌  pas de bandeau cookies, pas de CGU — décidé, pas besoin
```

---

## 🔴 (ancien) Il le refait lui-même

Le 01/10, il n'a pas aimé le site fait ici. **Il le refait sur Claude Design,
seul.** Il l'enverra une fois fini ; le travail sera alors de **le faire
marcher, pas de le redessiner** : recoller le panier, les 4 pages légales,
ses informations, et chasser les bugs.

**Tout ce qu'il faut est listé dans `site/A-RECOLLER.md`.**
Ne rien supprimer de ce fichier ni de `partage/legal/`.

---

## 🎯 LE MILLION — ses réponses (05/10), à ne pas lui reposer

```
QUEL MILLION     1 M€ de CHIFFRE D'AFFAIRES (ce qui rentre)
EN COMBIEN       1 an
L'ARGENT         le budget de lancement seulement (1 144 MAD / 40 jours)
                 + de la pub sur ce qui marche, payée par les ventes
                 → on réinvestit ce que l'organique rapporte
PERTE MAX        le budget de départ, rien de plus
SON TEMPS        le minimum : la publication est automatique (Metricool),
                 Claude analyse vidéos, clics, ventes, et propose
IL REFUSE        montrer SON visage · s'endetter · appeler des gens
```

**LE VISAGE — décidé le 05/10 :** un personnage généré sur Higgs Field,
LE MÊME dans toutes les vidéos (l'image de marque). 🔴 Jamais présenté
comme le fondateur ni comme un client · 🔴 étiquette « contenu IA » mise
automatiquement par Claude via Metricool. Pas de Cowork (décidé le 05/10).

**🔴 08/10 — NETLIFY BLOQUÉ jusqu'au 1ᵉʳ novembre :** le plan gratuit a
épuisé ses crédits du mois (trop de mises en ligne). Le site reste EN LIGNE
mais plus aucune mise à jour ne passe. En attente : l'adresse e-mail
corrigée (silenceworlwide@gmail.com, sans le d) — elle est dans le code,
pas encore sur le site. → grouper les mises en ligne, une par session.

**E-mail de la marque : silenceworlwide@gmail.com (SANS le « d » de world).**
Corrigé partout le 08/10.

**08/10 — Brevo (e-mails) :** compte créé, plan GRATUIT (300/jour),
nom du compte « immoclap » (expéditeur à mettre : SILENCE). Clé rangée
dans les Secrets réseau (hôte api.brevo.com, en-tête api-key) ✅ TESTÉE
le 08/10 : marche. À faire : brancher popup → e-mail de bienvenue + J+10 + J+90. Téléphone à vérifier
dans Brevo avant le 1er envoi.

**Décidé le 08/10 — le plan pub :** au LANCEMENT seulement (pas avant),
vague 1 = 80 % de formats copiés sur les concurrents qui marchent + 20 %
de nos idées · Gemini regarde les vidéos tout seul (testé, 0 €) · s'il
faut payer des crédits de scraping, il paie (le moins cher d'abord).

**Décidé le 05/10 :** contenu gratuit 80/20 (prix dans 1 vidéo sur 5) ·
stocks en Europe · TikTok Shop + créateurs affiliés au palier 3 ·
filière textile réglée au palier 3 · pub payée = seulement la vidéo
gratuite qui a gagné, avec l'argent des ventes.

**✅ Plan écrit le 05/10 : `PLAN-MILLION.md`.** Verdict : 1 M€ en 12 mois 🔴 tel quel ·
année 1 réaliste 100-300 k€ (estimation) · le verrou = la marge (25 €/commande visés).

**Le plan million se lance quand il dit « go million »** — skill
`million`, sans lui reposer ces questions.

---

## 📌 LA DIFFUSION — décidé le 02/10, à mettre en place au lancement

```
Instagram + YouTube   100 % automatique via Metricool
TikTok                sa SŒUR finit à la main sur son téléphone :
                      elle choisit le son, elle appuie
```

**Ce qu'elle fait une fois :** installer Metricool (iPhone ou Android),
se connecter avec `astralzayte@gmail.com`, autoriser les notifications.
Le compte n'est partagé avec personne pour l'instant.

**Ce que Claude fait :** la vidéo, le texte, les hashtags, l'heure, et
chaque TikTok réglé en « rappel à l'heure » (`autoPublish: false`).

🔴 **Reste à trancher** : le son choisi (elle intervient) ou le zéro
effort (TikTok automatique, son au hasard). Il tranchera au lancement.

🔴 Les vidéos iront sur un hébergement gratuit public — **pas besoin de
Google Drive**, Metricool accepte n'importe quelle adresse.

---

## 📌 DEMAIN — ce qu'il fait, lui

```
🟠  refaire la chaîne YouTube au nom de SILENCE
    (elle est au nom « Julien Colly » — les vidéos sortiraient
     sous son nom perso) puis la rebrancher dans Metricool
```

🟢 **Google Drive n'est PAS nécessaire** — il n'apparaît pas dans les
connexions Metricool, et on n'en a pas besoin : Metricool accepte n'importe
quelle adresse publique. Les 80 vidéos seront déposées sur un hébergement
gratuit, et Metricool ira les chercher. Zéro manip pour lui.

---

## 📌 DEMAIN — les 4 vidéos qui restent

Le quota Gemini gratuit s'est vidé le 02/10. **Il se remet à zéro chaque jour.**

4 vidéos sur 6 restent à analyser :
```
https://youtu.be/X4UnU2e24cc     j'ai reconstruit le funnel de cette marque
https://youtu.be/q6ykds4Yhb8     coaching 800 → 15K€/mois
https://youtu.be/fhbcwJJhvGg     l'écosystème pour créer sa marque
https://youtu.be/jeNNWXlNCVQ     0 à 800 € en 2 semaines
```
Le script est prêt : `scratchpad/videos2/v.sh` (modèles qui marchent :
`gemini-3-flash-preview`, `gemini-flash-latest`). Les 2 déjà faites sont
dans `v2.md` et `v5.md`.

🔴 **Il a dit : on attend demain. Ne pas passer par les sous-titres.**

---

## 📌 À ressortir quand il le demande

**« Je suis à l'agence »** → lui renvoyer **les 2 questions pour l'agence de la
LLC** (la TVA, et le médiateur / le droit de la consommation français). Elles
sont dans la conversation du 30/09. Il peut aussi demander **une traduction en
arabe**.

Il les a déjà posées par écrit le 30/09. Il attend la réponse. S'ils écrivent
noir sur blanc qu'une LLC américaine dispense du droit français : corriger le
site, le budget et le skill, et le lui dire franchement.

---

## Les décisions prises, à ne pas rouvrir

```
🔴  pas de paiement à la livraison, nulle part — carte uniquement
🔴  livraison 4,99 € en France, 49 MAD au Maroc
🔴  le produit d'appel est le sweat + jogging, pas la veste
🔴  aucun prix barré qui n'a pas été réellement pratiqué
🔴  entrepôt en Europe — sans lui, les 2-3 jours sont impossibles
🔴  France ET Maroc dès le départ — pas de lancement France seule,
    donc Metricool à 16 €/mois dès le premier jour
🔴  la pub n'est pas dans le budget — au feeling, quand il le sent,
    et seulement sur une vidéo qui a déjà gagné en gratuit
🔴  le scraping coûte 0 — ~65 crédits par projet, 7 000 bonus gratuits à
    réclamer au projet 2 ≈ 100 projets
🔴  le renvoi est à la charge du client s'il change d'avis ;
    gratuit si le produit a un défaut (là c'est la loi)
🔴  14 jours de rétractation pour TOUT LE MONDE — le Maroc n'exige
    que 7 jours, on donne 14 partout pour n'avoir qu'une règle
🔴  LES LOTS : jamais une liste à plat — trois marches, celle du
    milieu marquée « le plus choisi ». Divise le seuil : 23 ventes → 12
🔴  LE 2ᵉ ACHAT : un message WhatsApp à J+10 (« il te va comment ? »),
    le code promo seulement APRÈS sa réponse. Plus un mot dans le colis.
    À la main au lancement — l'envoi programmé WhatsApp est payant.
🔴  LE FREIN : 100 €/jour = produit validé · moins de 3 ventes au
    jour 40 = on arrête. Posé le 02/10, relevé sur le terrain.
🔴  jamais d'accès à sa banque — Stripe en lecture seule, rien d'autre
🔴  le site se modifie dans `boutique/`, jamais sur Netlify —
    Netlify est une copie, republiée derrière chaque modification
🔴  (03/10) le site est BLANC, entête et pied NOIRS (le logo glace
    a besoin du noir), une seule couleur vive : l'ambre #E0A458.
    Remplace l'ancienne règle « glace partout ».
🔴  le logo a un fond bleu nuit #121929 : on l'écrase au noir
    (brightness .82 / contrast 1.32) puis mix-blend-mode: screen
🔴  le site alterne noir et ivoire — deux blocs clairs (les promesses,
    le test à 11 €) cassent le noir. Annule le « fond noir partout,
    sans exception » du cahier des charges, qui reste à corriger.
🔴  sous-titres testés en vague 1 : A (figé) contre C (mot par mot),
    8 vidéos chacun dans le témoin — le gagnant devient la règle
```

---

## Ce qui reste ouvert

```
❓  40 ou 50 jours de diffusion — le skill dit 40, il a dit 50 une fois
❓  marque/budget.md dit encore « 800 MAD de pub, décidé » — à corriger
❓  le prochain projet : nouveau dossier, ou à côté de celui-ci
❓  TikTok en compte personnel — on verra si la rétention 3 s remonte

📌  À REPORTER DANS LE SKILL site-qui-vend, tiré des 4 vidéos :
    Refero (styles.refero.design, gratuit) donne le système de design
    d'un vrai site — on l'injecte AVANT de dessiner, c'est l'écart entre
    « fait par une IA » et « fait par une agence ». Pris chez ORYZO AI :
    majuscules graisse 500 partout sauf une voix en minuscules, titres
    à interligne 0,9, séparateurs pointillés, zéro ombre, une section
    par écran. Refusé : coins arrondis (le logo n'a que des pointes) et
    « l'accent jamais sur un bouton » (chez nous l'ambre EST le bouton).
📌  IL VA ENVOYER D'AUTRES VIDÉOS YOUTUBE sur la fabrication de sites.
    Gemini les lit (image et son, ~2 centimes la vidéo de 20 min).
    Ce qu'on en tire va dans le skill site-qui-vend, pas dans la
    conversation. 🔴 RÈGLE QU'IL A POSÉE : ces vidéos poussent toujours
    des bibliothèques payantes (3D, animations). Pour chacune, on
    cherche l'équivalent gratuit qui donne le même effet — on ne
    recommande un outil payant qu'après avoir montré qu'aucun gratuit
    ne fait l'affaire.
📌  RAPPELER À RECHARGER HIGGS FIELD dès que l'agent envoie le
    catalogue et les vidéos — il l'a demandé le 30/09
📌  Claude Design est accessible directement : plus besoin de lui faire
    faire l'aller-retour pour le site (étape 11 du skill à corriger)
📌  le signe (4 piques + ligne ambre) va sur l'écran de fin des vidéos,
    au prochain rendu — le SVG est dans partage/BRIEF-SITE-SILENCE.md
```

---

## Les fichiers du projet

```
marque/prix.md            la grille, figée
marque/client.md          Yanis + les 49 hooks
marque/diffusion.md       80 vidéos, 40 jours, le moule
marque/budget.md          les coûts et la chaîne de paiement
marque/le-vocabulaire.md  chaque mot en français normal
partage/BRIEF-SITE-SILENCE.md   à envoyer à Claude Design
partage/site-fournisseur/       ce qui est en ligne
```
