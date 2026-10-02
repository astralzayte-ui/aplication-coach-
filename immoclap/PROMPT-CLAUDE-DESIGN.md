# Prompt pour Claude Design — site ImmoClap

Copie tout le bloc ci-dessous dans Claude Design.

---

Crée le site web complet d'**ImmoClap**, un SaaS qui transforme les photos d'un bien immobilier en vidéo cinématique grâce à l'IA (mouvements de caméra, musique, voix off, logo de l'agence). Cible : agences immobilières et propriétaires en **France et au Maroc**. Langue : **français**. Prix affichables en **€ et en DH** (sélecteur).

Niveau attendu : site SaaS haut de gamme type Apple / Linear / Reel-E — luxe, sobre, cinématique, très animé mais élégant. Tout le site est **une seule longue page qui scrolle**, avec des sections qui **alternent fond noir et fond gris très foncé**.

## 1. Direction artistique

- **Couleurs**
  - Fond noir chaud : `#0B0A09`
  - Fond gris alterné : `#181614`
  - Cartes / bordures : `#201D1A` / `#2A2622`
  - Texte principal crème : `#F3EFE7`
  - Texte secondaire : `#B4AA9D`
  - Accent jaune doré (boutons, soulignés, barres de progression) : `#F6BC28`
  - Trait doré fin sous les mots en italique : `#E5C99E`
- **Typographies**
  - Titres : serif élégante (**Newsreader** ou **Instrument Serif**), grande taille, interlignage serré. Dans chaque grand titre, **la 2ᵉ ligne est en italique** et **soulignée d'un trait doré fin dessiné à la main** (SVG légèrement courbé).
  - Texte et boutons : **Inter**.
  - Sur-titres de section : petites majuscules très espacées (letter-spacing 0.3em), précédées d'un **chiffre romain en italique** et d'un petit trait : `II —— CE QUE VOUS OBTENEZ`.
- **Boutons** : jaune doré, texte noir, coins arrondis 10px, flèche → qui glisse au survol.
- **Mockups** : les écrans de l'application sont montrés dans un **cadre type tablette/écran noir arrondi** avec une ombre douce et un léger halo doré derrière.
- Beaucoup d'espace vide, grandes images de maisons de luxe, aucun élément criard.

## 2. Animations (très important)

- **Au chargement (hero)** : les mots du titre apparaissent **un par un en "whoosh"** — chaque mot monte de 20px, passe de flou (blur 8px) à net et de transparent à opaque, décalage de 60ms par mot. Puis le **trait doré se dessine** de gauche à droite sous la ligne en italique. Puis le paragraphe, le bouton et la ligne d'avis apparaissent en fondu.
- **Au scroll** : chaque bloc apparaît en fondu + montée légère quand il entre à l'écran (une seule fois).
- **Header collant** transparent qui devient noir flouté au scroll, avec une **fine barre de progression de lecture** sous le header.
- Le lien du menu correspondant à la section visible est **souligné automatiquement**.
- Survol des cartes : léger zoom de l'image + bordure qui s'éclaircit.
- Compteurs de chiffres qui **défilent de 0 à la valeur** quand ils apparaissent.
- Respecter `prefers-reduced-motion`.

## 3. Structure de la page (dans cet ordre)

**Header** : logo ImmoClap à gauche (logo simple : un maison stylisée en traits fins dont l'intérieur forme un bouton play, en doré, suivie de "Immo" en crème et "Clap" en doré, police serif). Menu : Comment ça marche · Produit (menu déroulant) · Exemples · Comparer · Avis · FAQ · Tarifs. À droite : « Se connecter » + bouton jaune « Ma vidéo gratuite → ».

**I. Hero (fond noir)**
- Sur-titre espacé : `VIDÉOS IMMOBILIÈRES PAR IA · FRANCE & MAROC`
- Titre : « Vos biens méritent mieux / *que des photos.* » (2ᵉ ligne en italique soulignée en doré)
- Paragraphe : « Déposez les photos de votre bien. En quelques minutes, vous obtenez une vidéo cinématique avec votre logo, une voix off et de la musique. **Sans vidéaste. Sans facture à 500 €. Sans attendre.** »
- Bouton jaune : « Ma première vidéo gratuite → »
- Ligne sous le bouton : « Gratuit pour essayer · Sans engagement »
- Juste en dessous : un **grand cadre vidéo** (16:9, coins arrondis) qui contiendra **notre vidéo motion design explicative** (placeholder avec bouton play au centre et image de maison de luxe).
- Sous la vidéo, petite légende espacée : `CHAQUE PLAN A COMMENCÉ PAR UNE SIMPLE PHOTO`
- 3 chiffres animés : « 10 min — des photos à la vidéo » · « 3 formats — portails, Reels, carré » · « 0 € — de vidéaste ».

**II. Ce que vous obtenez (fond gris)** — grille 2×2 de cartes :
1. `VIDÉO DU BIEN` — mockup vidéo avec sélecteur Large / Téléphone / Carré. Titre : « Une vidéo cinématique, calée sur la musique ». Lien « Voir la vidéo → ».
2. `PHOTOS RETOUCHÉES` — **curseur avant/après interactif** (glisser au milieu, étiquettes AVANT / APRÈS, bulle « "Ambiance coucher de soleil" »). Titre : « Retouchez une photo en une phrase ». Mention discrète : « Retouches signalées "image retouchée par IA" ».
3. `PAGE DU BIEN` — mockup navigateur avec une page de présentation du bien. Titre : « Une page web pour chaque bien, en un clic ».
4. `STATISTIQUES` — mini tableau de bord (Vues, Visiteurs, Lectures, Contacts) avec chiffres. Titre : « Puis regardez les résultats ».

**III. Comment ça marche (fond noir)** — titre « Des photos en entrée. / *Une vidéo en sortie.* »
- Un **grand mockup d'écran** au centre qui **change automatiquement toutes les 4 secondes** selon l'étape active.
- En dessous, **3 colonnes numérotées 1 · 2 · 3** (gros chiffres serif). Au-dessus de chaque colonne, une **barre fine qui se remplit en doré** pendant que l'étape est active, puis passe à la suivante (comme des stories Instagram). Cliquer sur une étape l'affiche.
  1. « Déposez vos photos » — « Depuis votre téléphone ou votre ordinateur. Sans brief, sans liste de plans. » → l'écran montre une zone de dépôt en pointillés dorés + une **grille de miniatures de photos qui se remplit une par une**, compteur « 25 photos sur 25 prêtes » et bouton « Continuer ».
  2. « ImmoClap monte votre vidéo » — « Mouvements de caméra sur chaque photo, musique en rythme, un premier montage en quelques minutes. Ajustez ensuite tout ce que vous voulez. » → l'écran montre l'éditeur (voir section IV).
  3. « Publiez partout » — « Tous les formats pour chaque réseau, plus une page web du bien prête à partager. » → l'écran montre 3 aperçus (Écran large 16:9 : YouTube, SeLoger, Avito · Téléphone 9:16 : Reels, TikTok · Carré 1:1 : Instagram, Facebook) avec l'adresse du bien en surimpression et un bouton jaune « Télécharger la vidéo » + « Télécharger toutes les versions (ZIP) ».

**IV. Le studio (fond gris)** — sur-titre `IV —— LE STUDIO` — titre « Le studio ImmoClap. / *Tout sur un seul écran.* » — sous-titre « Votre premier montage est prêt en quelques minutes. Modifiez ce que vous voulez ensuite. »
- **Onglets** espacés en majuscules : PLANS · MUSIQUE · TEXTE · VOIX OFF · IMAGE DE MARQUE (onglet actif souligné en doré). Chaque onglet change le mockup.
- **Mockup de l'éditeur** dans un grand cadre : barre du haut (← Mes biens · adresse du bien · ✓ Votre vidéo est à jour · annuler/rétablir · Télécharger ▾ · bouton jaune Partager · avatar). Barre latérale d'icônes (Plans, Musique, Texte, Voix off, Image de marque). Colonne de **miniatures numérotées** avec étiquettes de transition (« Coupe », « Fondu ») et 2 photos grisées « Pas dans la vidéo » avec un +. À droite, **lecteur vidéo** avec bouton pause, timeline « 0:07 / 1:10 », sélecteur Large / Carré / Téléphone.
  - Onglet MUSIQUE : catalogue de morceaux (titre, ambiance : Luxe, Moderne, Chaleureux, durée, bouton écouter).
  - Onglet TEXTE : titres animés (adresse, prix, surface, nombre de pièces).
  - Onglet VOIX OFF : texte du script + choix de voix (FR, Darija, homme/femme) + bouton générer.
  - Onglet IMAGE DE MARQUE : logo de l'agence, couleurs, carton de fin avec coordonnées de l'agent.

**V. Exemples (fond noir)** — titre « Voyez ce que / *vous obtiendrez.* » — sous-titre « Des vidéos de démonstration. Appuyez sur lecture. »
- Grille de **6 cartes vidéo** (3×2) : image de bien de luxe, bouton play rond en bas à gauche, titre serif du bien (« Villa Palmeraie, Marrakech », « Appartement Haussmannien, Paris 8e », « Riad Médina, Fès », « Penthouse Anfa, Casablanca », « Maison d'architecte, Bordeaux », « Villa vue mer, Tanger ») et sous-titre espacé `VIDÉO DE DÉMONSTRATION`.

**VI. Avis (fond gris)** — titre « Les agents / *en parlent.* » — 3 cartes de témoignage (citation en serif, nom, agence, ville, 5 étoiles). **Placeholders à remplacer par de vrais avis clients** — ne pas inventer de noms d'agences réelles.

**VII. Comparaison (fond noir)** — sur-titre `VII —— LE CALCUL` — titre « Oubliez le tournage à 500 €. / *Et les 7 jours d'attente.* »
- Tableau 3 colonnes : critère · « Vidéaste traditionnel » · colonne **ImmoClap mise en avant** (carte surélevée, bordure, fond légèrement plus clair).
  - Prix par bien : ~~300 – 1 000 €~~ / **dès 29 €**
  - Délai : 3 à 7 jours / **10 minutes**
  - Formats : 1 / **3 (16:9, 9:16, 1:1)**
  - Modifications : payantes / **illimitées**
  - Voix off et musique : en option / **incluses**

**VIII. Tarifs (fond gris)** — sélecteur **€ / DH** et **Mensuel / Annuel (-20 %)**. 3 cartes :
- **Essai** — Gratuit — 1 vidéo offerte, filigrane, connexion requise.
- **Pro** (mise en avant, badge « Le plus choisi », bordure dorée) — 49 € / 490 DH par mois — 5 vidéos par mois, sans filigrane, logo de l'agence, voix off, 3 formats.
- **Agence** — 149 € / 1 490 DH par mois — 20 vidéos par mois, plusieurs agents, page web du bien, statistiques, support prioritaire.
- Ligne sous les cartes : « Ou à l'unité : 39 € / 390 DH la vidéo, sans abonnement. »

**IX. FAQ (fond noir)** — titre « Questions / *fréquentes.* » — accordéon (ligne fine, question en serif, bouton rond « + » qui tourne en « × ») :
Combien de temps ça prend ? · Faut-il être à l'aise avec l'informatique ? · Quelles photos utiliser ? · Combien de photos faut-il ? · Quels formats je reçois ? · La musique est-elle libre de droits ? · Puis-je modifier la vidéo après ? · Puis-je ajouter mon logo ? · Puis-je publier sur SeLoger, Leboncoin, Avito, Instagram, TikTok ? · L'IA modifie-t-elle mon bien ? (réponse : non, seul le mouvement de caméra est ajouté ; les retouches sont signalées) · Comment fonctionne la vidéo gratuite ?

**X. Appel final (fond gris)** — grand titre « Prêt à devenir / *l'agence qui fait de la vidéo ?* » + bouton jaune « Ma première vidéo gratuite → ».

**Footer (fond noir)** — 5 colonnes de liens en petites majuscules : PRODUIT (Fonctionnalités, Studio, Mouvements de caméra, Retouche photo, Voix off, Musique, Image de marque, Page du bien, Tarifs, FAQ) · OUTILS VIDÉO (Vidéo immobilière, Photo en vidéo, Vidéo d'annonce, Reels immobiliers) · SOLUTIONS (Agents immobiliers, Agences, Promoteurs, Location saisonnière, Propriétaires) · RESSOURCES (Tutoriels, Guides, Blog) · ENTREPRISE (À propos, Contact, Confidentialité, CGV, Remboursement). En bas : « © 2026 ImmoClap » + « Retour en haut ↑ ». Et **le mot "ImmoClap" en serif géant** (largeur de l'écran) en filigrane très sombre tout en bas, coupé par le bord de la page.

**Bouton de chat flottant** rond jaune en bas à droite.

## 4. Parcours "vidéo gratuite"

Tous les boutons « Ma vidéo gratuite » ouvrent une **fenêtre de connexion** élégante (même style sombre) :
- Bouton « Continuer avec Google »
- Séparateur « ou »
- Champ e-mail + bouton « Recevoir un lien de connexion »
- Petit texte : « 1 vidéo offerte, sans carte bancaire. »

Après connexion → page **Tableau de bord** (même style) : « Mes biens », bouton jaune « + Nouveau bien », crédits restants, puis l'écran de dépôt de photos (zone en pointillés dorés + grille de miniatures).

## 5. Contraintes

- **Responsive parfait** : mobile d'abord, menu burger, grilles qui passent en 1 colonne, mockups qui se réduisent proprement.
- Images : utiliser des photos de maisons et intérieurs de luxe (placeholders Unsplash), vidéos en placeholder.
- Code propre, sections bien séparées et commentées, pour que le développeur branche ensuite la connexion, l'upload, la génération vidéo et le paiement.
- Ne copier aucun texte ni logo d'un site existant : tout le contenu est celui ci-dessus.
