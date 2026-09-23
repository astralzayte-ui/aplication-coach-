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
- **Référencement (SEO)** : titres et descriptions par page, aperçu de partage (Open Graph).
- **Sécurité front-end** : protection contre l'injection de code (XSS).
- **Qualité** : tests unitaires (node:test) relancés automatiquement par GitHub Actions, tests dans un vrai navigateur (Playwright) sur mobile et ordinateur, correction des bugs trouvés.
- **Application web progressive (PWA)** : installable, fonctionne hors connexion (service worker), mode clair / sombre.
- **Outils** : Git, GitHub, Netlify (mise en ligne).

## Liens

- **Projet 1 (Aurel, boutique de montres) :** https://dulcet-sfogliatella-fbc1ba.netlify.app/

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

## Projet 3 — Restaurant à Marrakech *(à venir)*

**Type :** site vitrine de démonstration. Restaurant fictif, aucun client réel.
**Prévu :** accueil, menu, galerie, réservation, contact avec carte, français / anglais, WhatsApp.

## Projet 4 — Tableau de bord de commandes *(à venir)*

**Type :** outil de démonstration avec des données fictives. Aucun client réel.
**Prévu :** liste des commandes, statuts, statistiques du jour, graphiques, export Excel.

---

*Document tenu à jour au fil des projets. Dernière mise à jour : projets 1 et 2 terminés.*
