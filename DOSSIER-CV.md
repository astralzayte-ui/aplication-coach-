# Dossier de passation — CV de développeur web junior

> **À l'attention de Claude Design (ou de toute personne qui rédige le CV).**
> Ce dossier décrit mes projets de portfolio pour construire mon CV.
> Merci de respecter à la lettre la section « Règles de présentation » ci-dessous.

---

## Règles de présentation (obligatoires)

1. **Ce sont des sites vitrines de démonstration**, réalisés pour montrer ce que je sais faire.
2. **Les marques sont fictives.** « Aurel » (montres) et les autres noms de marques sont inventés. Ce ne sont pas des entreprises réelles.
3. **Aucun client réel.** Personne ne m'a commandé ces sites. Ne jamais les présenter comme des missions, des prestations, du freelance ou des « réalisations pour un client ».
4. **Rubrique à utiliser :** « Projets personnels » ou « Portfolio — projets de démonstration ». Surtout pas « Expérience professionnelle ».
5. **Pas de chiffres inventés** : pas de ventes, de trafic, de clients satisfaits ou de hausse de chiffre d'affaires. Les produits, prix, avis clients et paiements sont fictifs.
6. Formulation conseillée : *« Site vitrine de démonstration d'une boutique fictive, conçu et développé de A à Z pour mon portfolio. »*

---

## Prompt à coller dans Claude Design (avec ce dossier en pièce jointe)

> Crée mon CV de **développeur web junior (front-end)**, basé à Marrakech, à partir du dossier joint. Format A4, une page, sobre et moderne, facile à lire par un recruteur et par un logiciel de tri de CV (ATS) : texte sélectionnable, pas de barres de niveau ni de pourcentages de compétences, une seule colonne ou deux colonnes simples.
> Ordre : en-tête (nom, poste visé, ville, téléphone, e-mail, GitHub, lien du portfolio), courte accroche de 2 à 3 lignes, **Projets personnels** (les 4 projets avec leur phrase courte, les technologies et le lien en ligne quand il existe), compétences regroupées (HTML/CSS, JavaScript, qualité et tests, performance et SEO, outils), formation, langues.
> Respecte strictement les « Règles de présentation » du dossier : ce sont des **projets de démonstration** avec des **marques fictives**, **aucun client réel**, jamais dans « Expérience professionnelle », **aucun chiffre inventé**. Laisse visibles les champs marqués « à compléter » au lieu d'inventer des informations.
> Fais aussi une version en anglais.

---

## Profil

- **Poste visé :** développeur web junior (front-end).
- **Ville :** Marrakech, Maroc.
- **Langues :** français (+ autres langues à compléter).
- **Nom, téléphone, e-mail, LinkedIn :** *à compléter*
- **Lien GitHub :** *à compléter*

## Compétences démontrées par les projets

- **HTML5 sémantique** : structure des pages, formulaires, accessibilité (ARIA, navigation au clavier, lecteurs d'écran).
- **CSS3** : responsive « mobile first », Flexbox, Grid, variables CSS, animations, composants de formulaire entièrement personnalisés.
- **JavaScript sans framework** : manipulation du DOM, événements (dont délégation d'événements), état de l'application, localStorage, paramètres d'URL, validation de formulaires, expressions régulières.
- **Performance** : moins de 100 Ko de photos à l'ouverture de la page sur mobile, images WebP optimisées, images adaptées à la taille de l'écran (srcset), chargement différé, préchargement de l'image principale.
- **Référencement (SEO)** : titres et descriptions par page, aperçu de partage (Open Graph), données structurées schema.org.
- **Internationalisation** : site bilingue français / anglais sans rechargement de page.
- **Sécurité front-end** : protection contre l'injection de code (XSS).
- **Qualité** : tests unitaires (node:test) relancés automatiquement par GitHub Actions, tests dans un vrai navigateur (Playwright) sur mobile et ordinateur, correction des bugs trouvés.
- **Application web progressive (PWA)** : installable, fonctionne hors connexion (service worker), mode clair / sombre.
- **Outils** : Git, GitHub, Netlify (mise en ligne).

## Liens

- **Projet 1 (Aurel, boutique de montres) :** https://dulcet-sfogliatella-fbc1ba.netlify.app/
- **Projet 2 (Qalam) :** *à compléter*
- **Projet 3 (Dar Zaafran) :** *à compléter*
- **Code source (GitHub) :** *à compléter*

---

## Projet 1 — « Aurel », boutique de montres en ligne *(terminé)*

**Type :** site vitrine e-commerce de démonstration. Marque fictive, aucun client réel.
**Lien en ligne :** https://dulcet-sfogliatella-fbc1ba.netlify.app/
**Technologies :** HTML, CSS, JavaScript (sans framework ni librairie).

**Ce que fait le site :**
- Page d'accueil conçue comme une landing page : accroche, réassurance, nouveautés, collections, avis, FAQ.
- Catalogue avec recherche en direct (insensible aux accents), filtres (collection, mouvement, bracelet, prix) et tri. Les filtres sont gardés dans l'adresse de la page, qu'on peut donc partager.
- Fiche produit générée à partir des données, avec choix de la quantité limité au stock.
- Panier enregistré dans le navigateur et synchronisé entre plusieurs onglets.
- Commande avec validation des champs (téléphone marocain, e-mail…) et **paiement simulé** : vérification des numéros de carte avec l'algorithme de Luhn, ou paiement à la livraison.
- Commande sur WhatsApp : message déjà rédigé avec le modèle, la référence, la quantité et le prix.
- Design haut de gamme bordeaux et or, menus et cases à cocher dessinés sur mesure, parfait sur mobile.

**Phrase courte pour le CV :**
*Aurel — boutique de montres fictive (projet de démonstration). E-commerce responsive en HTML, CSS et JavaScript : catalogue filtrable, panier persistant, commande avec paiement simulé et commande WhatsApp. En ligne : https://dulcet-sfogliatella-fbc1ba.netlify.app/*

---

## Projet 2 — « Qalam », application de devis et factures *(terminé)*

**Type :** application web de démonstration. Entreprise et clients fictifs, aucun client réel.
**Lien en ligne :** *à compléter après la mise en ligne sur Netlify*
**Technologies :** HTML, CSS, JavaScript (sans framework), PWA (service worker), tests automatiques avec Node.js et GitHub Actions.

**Ce que fait l'application :**
- Création de devis et de factures avec aperçu A4 en direct, export PDF et envoi par WhatsApp.
- Calcul automatique de la TVA marocaine taux par taux, remise globale, montant en toutes lettres.
- Numérotation continue par année ; une facture émise est figée et ne peut plus être supprimée, comme l'exige la loi.
- Transformation d'un devis en facture, statuts (payée, en retard calculé automatiquement), tableau de bord et liste « À faire ».
- Fichier clients avec vérification de l'ICE, du téléphone et de l'e-mail.
- Mode clair / sombre, raccourcis clavier, application installable et utilisable hors connexion, sauvegarde et restauration.

**Points techniques à mettre en avant :** montants calculés en centimes (aucune erreur d'arrondi), calculs isolés et couverts par des tests automatiques relancés par GitHub à chaque envoi de code, composants accessibles faits sur mesure, container queries.

**Phrase courte pour le CV :**
*Qalam — application de devis et factures (projet de démonstration). HTML, CSS et JavaScript sans framework : TVA et montant en lettres, numérotation légale, PDF, mode hors connexion (PWA), tests automatisés avec intégration continue.*

## Projet 3 — « Dar Zaafran », site de restaurant à Marrakech *(développé, en cours de vérification)*

**Type :** site vitrine de démonstration. Restaurant fictif, aucun client réel. Adresse, prix et avis inventés ; photos sous licence Creative Commons, créditées.
**Lien en ligne :** *à compléter après la mise en ligne sur Netlify*
**Technologies :** HTML, CSS, JavaScript (sans framework), tests automatiques avec Node.js et GitHub Actions.

**Ce que fait le site :**
- Site **bilingue français / anglais** : changement de langue instantané, sans rechargement, langue mémorisée.
- Indicateur « Ouvert maintenant / Fermé, ouvre à 19h » calculé en direct à l'heure de Marrakech, même si le visiteur est à l'étranger.
- Grandes photos avec **effet parallaxe** au défilement et apparitions douces des blocs, désactivés si le visiteur préfère réduire les animations.
- Carte du restaurant générée à partir des données : catégories avec barre collante qui suit la lecture, filtres « Végétarien » et « Signatures ».
- Galerie en mosaïque avec filtres et visionneuse plein écran (flèches du clavier, glisser du doigt).
- **Réservation** avec un calendrier fait sur mesure (jours passés, lundis de fermeture et dates trop lointaines désactivés), créneaux de 30 minutes, nombre de personnes, liste déroulante sur mesure, récapitulatif en direct, puis envoi de la demande rédigée sur WhatsApp.
- Contact : horaires avec le jour actuel mis en valeur, carte Google Maps chargée seulement au clic (rapidité et vie privée), itinéraire.
- Référencement : données structurées « Restaurant » (schema.org) pour Google.

**Points techniques à mettre en avant :** règles d'horaires et de réservation isolées dans un fichier testé automatiquement (tests relancés par GitHub à chaque envoi de code), gestion des fuseaux horaires, images WebP en deux tailles, contrôles de formulaire accessibles au clavier.

**Phrase courte pour le CV :**
*Dar Zaafran — site de restaurant fictif à Marrakech (projet de démonstration). HTML, CSS et JavaScript sans framework : site bilingue FR/EN, effet parallaxe, carte filtrable, réservation avec calendrier sur mesure et envoi WhatsApp, horaires « ouvert maintenant » testés automatiquement.*

## Projet 4 — Tableau de bord de commandes *(à venir)*

**Type :** outil de démonstration avec des données fictives. Aucun client réel.
**Prévu :** liste des commandes, statuts, statistiques du jour, graphiques, export Excel.

---

*Document tenu à jour au fil des projets. Dernière mise à jour : projets 1 et 2 terminés, projet 3 développé (en vérification), projet 4 à venir.*
