---
name: preferences-portfolio
description: Préférences et leçons apprises de l'utilisateur (développeur web junior à Marrakech) pour ses sites de portfolio. À charger AVANT tout travail sur un site de ce dépôt (site 1 montres, site 2 devis et factures, site 3 restaurant, site 4 tableau de bord, ou tout nouveau site), et à METTRE À JOUR chaque fois que l'utilisateur corrige, critique ou demande d'améliorer quelque chose, ou qu'une erreur est découverte.
---

# Préférences portfolio — comment travailler avec cet utilisateur

Ce skill est vivant. **Règle n° 1 : chaque fois que l'utilisateur corrige quelque chose, critique un rendu ou qu'on découvre un bug, ajoute la leçon ici** (section « Journal des leçons » + la règle générale dans la bonne section), puis commite. Le but : ne jamais refaire la même erreur sur le site suivant.

## 1. Communication

- Répondre **en français**, simplement : l'utilisateur est développeur junior et écrit souvent vite, en abrégé. Interpréter avec bon sens.
- **Ne jamais montrer de code** dans les réponses : ni blocs, ni extraits, ni diffs. Expliquer avec des mots ce que fait le code, pour qu'il puisse le raconter en entretien.
- **Toujours montrer le résultat en artifact** (aperçu publié) après chaque étape, et rappeler le lien. S'il dit « je vois rien », rouvrir l'artifact (action open) et redonner le lien cliquable. Il peut regarder l'écran des diffs de l'application par erreur.
- Envoyer aussi des **captures d'écran mobiles** (SendUserFile) quand c'est utile.
- Quand un choix est vraiment une question de goût (couleurs, style), poser la question **avec 3 ou 4 options visuelles** (AskUserQuestion avec aperçus), et une option recommandée.
- Être autonome pour le reste : il a dit « gère le côté pro, tu as tous les skills ».
- Lui dire clairement ce qu'il est seul à pouvoir faire (compte Netlify, droits des photos…), sans jamais lui demander de coller un mot de passe ou une clé dans le chat.

## 2. Design (exigences fermes)

- **Rendu haut de gamme et professionnel partout.** Il repère vite ce qui fait « débutant ».
- **Jamais d'élément de formulaire natif** : pas de `<select>` du navigateur (surlignage bleu), pas de case à cocher, bouton radio ou curseur par défaut. Toujours des composants sur mesure, aux couleurs du site, utilisables au clavier (voir le composant `menu-deroulant.js` du site 1, réutilisable).
- Ce qui a fait « débutant » sur le site 1 et qu'il ne faut **pas** refaire :
  - boutons en forme de pilule avec un dégradé → préférer des **coins nets** (2 px) et une couleur **unie** ;
  - gros boutons verts WhatsApp partout → WhatsApp **discret** (contour fin, icône à la couleur d'accent), une icône carrée sur les cartes produit ;
  - coins très arrondis sur tous les blocs, cadres autour des photos ;
  - compteurs inutiles du type « 8 modèles » dans le héro.
- **Demander la palette de couleurs tôt** (4 ambiances au choix). Sur le site 1, il a choisi « Bordeaux & or » après une première version noir et or.
- Libellés trop longs sur mobile : prévoir une version courte (« Ajouter » au lieu de « Ajouter au panier »).

## 3. Technique (checklist avant de montrer quoi que ce soit)

- HTML, CSS, JavaScript **sans framework**, **commentés en français**, un **dossier et un README par site**.
- **Tester dans un vrai navigateur** (Playwright, Chromium dans `/opt/pw-browsers/chromium`) sur mobile (390 px) et ordinateur (1440 px), **avant** de publier :
  - aucune erreur JavaScript ;
  - **aucun débordement horizontal** (vérifier `scrollWidth > innerWidth` sur chaque page) ;
  - tous les liens et toutes les images répondent 200 ;
  - parcours complets : ajout au panier, +/−, retirer, vider, totaux, filtres, formulaire (erreurs puis succès).
- Pour tester le site **en ligne** (Netlify) : Chromium ne fait pas confiance au certificat du proxy de l'environnement. Faire passer les requêtes par Node (`https` + `https-proxy-agent`, qui lit `NODE_EXTRA_CA_CERTS`) et `route.fulfill`. Ne jamais désactiver la vérification TLS.
- **Classe « visuellement caché »** : mettre `!important` sur largeur, hauteur, padding, marges et bordure. Sinon une autre règle (ex. `width: 100%` d'un champ) lui redonne sa taille et fait déborder la page.
- **Image avec attributs width/height + aspect-ratio en CSS** : ajouter `height: auto`, sinon la photo est déformée ou zoomée.
- **Images rapides** : WebP, deux tailles (480 px et grande) avec `srcset` et `sizes`, `loading="lazy"` sauf l'image principale (`fetchpriority="high"` + `<link rel="preload">`). Viser moins de 100 Ko de photos à l'ouverture sur mobile.
- **Pas de `confirm()`, `alert()` ni `prompt()`** : ils ne marchent pas dans l'aperçu artifact. Faire des confirmations dans la page (ex. deux clics).
- **Formulaires** : revalider un champ en erreur **pendant la frappe**, pas quand on le quitte (sinon le message qui disparaît fait bouger le bouton et le clic rate). Bloquer la double soumission.
- **Données stockées dans le navigateur** : ne jamais leur faire confiance (les nettoyer : types, bornes, doublons). Gérer les changements faits dans un autre onglet.
- **Paramètres d'URL** : valider chaque valeur ; une valeur inconnue ne doit rien casser.
- **Stock / limites** : toujours dire à l'utilisateur ce qui s'est vraiment passé (« Stock maximum atteint ») au lieu d'un faux « ajouté ».
- Échapper tout texte inséré avec `innerHTML` (protection XSS).
- Les messages et textes doivent rester vrais quand les données changent (ex. « livraison offerte dès 2000 DH » est devenu faux quand les prix ont baissé : relire les textes après chaque changement de données).

## 4. Contenu et honnêteté

- Ce sont des **sites vitrines de démonstration** : marques fictives, **aucun client réel**. Le dire dans chaque README et dans les mentions légales.
- **Dossier CV** : `DOSSIER-CV.md` à la racine, lu par Claude Design pour faire son CV. Le **mettre à jour à la fin de chaque site** (lien en ligne, fonctionnalités, phrase courte). Toujours : rubrique « Projets personnels », pas de clients, pas de chiffres inventés. **Le lui envoyer à la fin**, quand tout est vérifié.
- **Photos** : vérifier d'où elles viennent. Celles du site 1 semblent venir de Pinterest (736 px de large) et montrent des marques réelles : le signaler et proposer des photos libres de droits ou générées.
- Ne jamais inventer ses informations personnelles (nom, téléphone…) : laisser « à compléter ».

## 5. Mise en ligne

- Hébergement : **Netlify** (pas Vercel).
- Méthode actuelle : lui envoyer un **zip du dossier du site** (sans le README) pour Netlify Drop. Après chaque correction, renvoyer un zip à jour et lui dire de le redéposer.
- Une fois en ligne : ajouter le lien au README, au dossier CV, et mettre les adresses absolues dans les balises Open Graph (`og:url`, `og:image`).
- Commiter et pousser sur la branche de travail après chaque étape.

## 6. Infos projet

- Numéro WhatsApp des sites : +212 693 511 445 (format lien : 212693511445).
- Site 1 « Aurel » (montres, bordeaux et or) : https://dulcet-sfogliatella-fbc1ba.netlify.app/
- Site 2 : **application de devis et factures** (dossier `site-2-factures/`), sans photos, pleine de vraie logique, avec les « trucs pro » dès le départ.
- Site 3 : **restaurant à Marrakech** (FR/EN, carte, WhatsApp). Photos : l'utilisateur veut les prendre sur Pinterest (c'est son choix, prévenu une fois ; ajouter la mention « photos à titre d'illustration »). Pas d'iframe de carte dans l'aperçu artifact : prévoir un lien ou une image de repli.
- Site 4 : tableau de bord de commandes, statuts, statistiques, graphiques, export Excel, données fictives.

## Journal des leçons (ajouter en haut, avec la date)

- **Choix du site 2** — Il ne veut pas de projet où les photos sont difficiles à trouver (restaurant). Il veut un projet qui **fait pro** et qui **prouve qu'il sait coder**. Il demande aussi d'ajouter partout des « petits trucs professionnels » qui montrent le niveau technique (mode sombre, installable hors ligne, tests automatiques, score Lighthouse, API, raccourcis clavier…). Toujours proposer ce genre d'ajouts.

- **Site 1** — Prix : il voulait des montres entre 500–700 DH ou 1500–2000 DH maximum. Adapter les textes liés (livraison offerte) et le curseur de prix.
- **Site 1** — « Ça fait débutant » : coins arrondis, dégradés, boutons verts, compteur « 8 modèles ». Corrigé par coins nets, or uni, WhatsApp discret (voir section 2).
- **Site 1** — `<select>` natif avec surlignage bleu : « ne fais jamais cette erreur ». Tous les contrôles de formulaire sont maintenant sur mesure.
- **Site 1** — Il ne voulait pas voir le code : uniquement l'artifact.
- **Site 1** — Bugs trouvés en testant : clic raté sur « Payer », débordement du catalogue (classe cachée sans !important), photo du héro zoomée (height:auto manquant), faux message d'ajout au-delà du stock, commande possible avec un panier vidé dans un autre onglet, menu de tri cassé par une URL modifiée.
