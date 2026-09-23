# Aurel — Boutique de montres en ligne

Site e-commerce de démonstration d'une horlogerie fictive à Marrakech, réalisé pour mon portfolio de développeur web.
Style bordeaux et or, haut de gamme, pensé d'abord pour le mobile.

**Démo en ligne :** _(lien Netlify à ajouter après la mise en ligne)_

> **Projet de démonstration** pour mon portfolio : la marque « Aurel », les produits, les prix, les avis et les paiements sont fictifs. Ce site n'a pas été réalisé pour un client.

![Aperçu mobile de l'accueil](../apercus/1-accueil-mobile.png)

## Fonctionnalités

- **Accueil (landing page)** : accroche, engagements, nouveautés, collections, histoire de la marque, avis clients, FAQ, appel à l'action.
- **Catalogue** : recherche en direct (sans tenir compte des accents), filtres par collection, mouvement, bracelet et prix, tri. Les filtres sont gardés dans l'adresse de la page : on peut partager un lien vers une recherche.
- **Fiche produit** : une seule page pour toutes les montres, remplie selon l'identifiant dans l'adresse. Choix de la quantité, suggestions « Vous aimerez aussi ».
- **Panier** : sauvegardé dans le navigateur (localStorage), synchronisé entre plusieurs onglets, compteur dans le menu.
- **Commande** : formulaire vérifié champ par champ (téléphone marocain, e-mail…), paiement par carte **simulé** avec la vraie vérification des numéros de carte (algorithme de Luhn), ou paiement à la livraison.
- **WhatsApp** : bouton « Commander sur WhatsApp » sur chaque montre, avec un message déjà rédigé (modèle, référence, quantité, prix).
- **Rapidité** : photos WebP en deux tailles (le téléphone charge la petite version), chargement différé, préchargement de la photo principale.
- **Pro** : référencement (titres et descriptions), accessibilité (navigation au clavier, lecteurs d'écran), images WebP chargées au besoin, page 404, mentions légales.

## Technologies

HTML, CSS et JavaScript, **sans framework ni librairie**. Aucune installation nécessaire.

## Structure

| Dossier / fichier | Rôle |
|---|---|
| `index.html`, `catalogue.html`, `produit.html`, `panier.html`, `commande.html` | Les pages |
| `css/style.css` | Tout le design (variables de couleurs, mobile d'abord) |
| `js/config.js` | Réglages : nom, numéro WhatsApp, devise, livraison |
| `js/produits.js` | Le catalogue (données fictives) |
| `js/panier.js` | La logique du panier |
| `js/commun.js` | Menu, pied de page, cartes produit, WhatsApp |
| `js/montre-svg.js` | Dessine une montre en SVG si une photo manque |
| `js/accueil.js`, `catalogue.js`, `produit.js`, `page-panier.js`, `commande.js` | Le code propre à chaque page |
| `images/produits/` | Photos des montres (WebP) |

## Lancer le site en local

Ouvrir `index.html` dans un navigateur suffit.

## Ce que j'explique en entretien

1. **Séparer les données de l'affichage** : les montres sont dans un tableau JavaScript. Pour ajouter une montre, on ajoute une ligne de données, sans toucher au HTML.
2. **Une page pour tous les produits** : `produit.html?id=…` lit l'identifiant et construit la fiche, comme un vrai site avec base de données.
3. **Le panier réagit aux événements** : chaque modification envoie un signal « le panier a changé », et chaque partie de l'écran concernée se met à jour toute seule.
4. **La sécurité** : tout texte inséré dans la page passe par une fonction qui neutralise le HTML (protection contre les failles XSS).
5. **Un bug trouvé en testant** : sur « Payer », le message d'erreur qui disparaissait faisait bouger le bouton pendant le clic. J'ai corrigé en vérifiant les champs pendant la frappe.

## Limites (projet de démonstration)

Pas de serveur : les commandes ne sont pas enregistrées et le paiement est simulé. En production, il faudrait un backend et un prestataire de paiement (CMI au Maroc, ou Stripe).
