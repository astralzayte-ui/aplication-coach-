# Mémoire Projet — aplication-coach- (Site Djellaba)

> Ce fichier est lu automatiquement à chaque session. Il contient tout le contexte du projet.

---

## 👤 Profil utilisateur

- **Email** : astralzayte@gmail.com
- **Langue préférée** : français (parle aussi arabe)
- **Pays** : Maroc
- **Ton** : direct, informel (tutoiement), pas de blabla inutile
- **⚠️ IMPORTANT** : parler TOUJOURS comme à quelqu'un qui n'est PAS développeur — zéro jargon technique, tout expliquer simplement, jamais de termes comme "JS", "HTML", "CSS", "stack", "branche", "commit", "déployer", etc. sans les expliquer en langage normal. Si besoin de mentionner un truc technique, le dire avec des mots simples (ex: "le fichier du site" plutôt que "le HTML", "sauvegarder" plutôt que "commit", "mettre en ligne" plutôt que "déployer").

---

## 🧥 Projet principal : Site e-commerce Djellaba

### Description
Site e-commerce pour la vente de **djellabas** (habits traditionnels marocains).
- Style : artisanal marocain + sombre + luxueux
- Paiement : **à la livraison uniquement** (cash on delivery) pour l'instant
- Marché cible : **Maroc**
- Langues : **Français + Arabe (bilingue, toggle FR/AR, support RTL)**

### Nom de marque provisoire
- Français : **Dar Al Djellaba**
- Arabe : **دار الجلابة**
*(à confirmer par l'utilisateur)*

### Site publié (Artifact Claude)
- URL artifact : https://claude.ai/code/artifact/6b8eb106-29f7-465b-8c76-9a8428c436c4
- Fichier source : `/tmp/.../scratchpad/djellaba.html`
- Pour mettre à jour : republier le même fichier avec `url` de l'artifact

---

## 📋 Fonctionnalités du site (déjà construites)

| Feature | Statut |
|---|---|
| Design dark luxueux + motif arabesque canvas | ✅ |
| Toggle FR ↔ عربي (RTL automatique) | ✅ |
| 4 fiches produits placeholder (Homme, Femme, Femme Brodée, Enfant) | ✅ |
| Formulaire commande (Nom, Adresse, Ville, WhatsApp, Téléphone, Notes) | ✅ |
| Envoi commande via WhatsApp (message pré-formaté) | ✅ |
| Bannière rappel YouCan Pay | ✅ |
| Responsive mobile | ✅ |

---

## ⚠️ À FAIRE — liste prioritaire

### Critique (bloquant pour le lancement)
- [ ] **Remplacer `212600000000`** dans le JS par le vrai numéro WhatsApp pro
- [ ] **Photos produits** → l'utilisateur les enverra plus tard
- [ ] **Prix fournisseur** → calculer le prix de vente recommandé selon le marché marocain

### Important
- [ ] **Créer un compte YouCan Pay** (pour accepter les paiements carte bancaire en plus du cash)
- [ ] Confirmer le nom de marque officiel
- [ ] Ajouter logo si disponible

### À clarifier avec l'utilisateur
- Tailles disponibles (S/M/L/XL ou numérotées ?)
- Zones de livraison (tout le Maroc ? certaines villes ?)
- Délai de livraison affiché
- Frais de livraison (offerts ou montant fixe ?)
- Catégories exactes de produits

---

## 💰 Pricing — en attente

L'utilisateur enverra les prix fournisseur.  
Objectif : proposer un prix de vente compétitif selon ce qui se fait sur le marché marocain.  
Fourchettes typiques marché :
- Djellaba homme simple : 150–400 DH (fournisseur) → 400–700 DH vente
- Djellaba femme : 100–350 DH → 350–600 DH vente
- Djellaba brodée premium : 300–700 DH → 700–1400 DH vente
- Djellaba enfant : 80–200 DH → 250–400 DH vente

---

## 🔧 Stack technique

- **Site** : HTML/CSS/JS pur (single file, no framework)
- **Hébergement** : Artifact Claude (pour l'instant) → à migrer sur domaine propre
- **Paiement carte** : YouCan Pay (à intégrer plus tard)
- **Commandes** : via WhatsApp (wa.me lien avec message pré-rempli)
- **Branche Git** : `claude/djellaba-ecommerce-site-c0v9ba`

---

## 📝 Notes importantes

- L'utilisateur **n'a PAS encore envoyé les photos** des produits
- Il veut être **rappelé de créer un compte YouCan Pay** à chaque session si pas encore fait
- Toujours proposer les textes en **français ET arabe** pour le site
- Le site doit rester **sombre et luxueux** — ne pas changer le style sans demande explicite

---

## 🚨 RAPPEL AVANT LANCEMENT DU SITE

**OBLIGATOIRE** : Avant de mettre le site en ligne pour de vrai, rappeler ceci mot pour mot :

> "Hey, avant qu'on lance le site — t'as pensé à deux trucs importants :
> 1. **Quand un client commande**, comment ça s'envoie automatiquement au fournisseur avec l'adresse du client ? (on peut connecter ça via Google Sheets + Make.com, ou passer sur YouCan)
> 2. **Tes statistiques de vente** — combien de djellaba n°1 t'as vendu, tes revenus du mois, etc. — t'as un endroit pour suivre ça ?
> On règle ça maintenant ou après ?"

Options discutées :
- **Court terme** : Google Forms + Google Sheets + Make.com (gratuit, envoie un message auto au fournisseur à chaque commande)
- **Moyen terme** : Migrer sur **YouCan** (plateforme marocaine, tout intégré : stats, livraison Amana/Aramex, dropshipping, ~150-300 DH/mois)
