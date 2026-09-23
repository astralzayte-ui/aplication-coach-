---
name: lancement-produit
description: Workflow complet de madoff15 pour lancer un produit e-commerce de A à Z, à répéter à chaque nouveau produit — choix du produit, scraping de tout le web et étude de marché Chine vs Maroc vs France, prix milieu de gamme pour étudiants 20-25 ans, site catalogue pour l'agent avec étude de marge, test et paiement sécurisé de l'agent, site de vente, pubs et hooks en système 30/30/40, publication auto Instagram via Metricool, lancement et mesure. Utilise ce skill dès que madoff15 dit "on lance un projet", "nouveau produit", "on build un projet", "on refait le process", "étude de marché", "trouve-moi un agent", "on met les produits sur le site", "on poste les pubs", "Metricool", ou parle de lancer une catégorie (vêtements, montres, bijoux, mobilier), même s'il ne cite pas le skill.
---

# Lancement produit — le process à répéter

Un lancement = 9 étapes, toujours dans cet ordre.
On valide chaque étape avec madoff15 avant la suivante.

Style de réponse : mode ADHD. Phrases courtes. Une étape à la fois. Liens directs à chaque fois.

## Avant de commencer

Relire en mémoire, s'ils existent :
- `/areas/etude-marche-chine-maroc.md` — prix déjà trouvés
- `/areas/recherche-agent-chine.md` — agents contactés, message type, grille d'évaluation
- `/areas/hooks-pub.md` — hooks et vidéos gagnantes
- `/areas/dropshipping-automation-stack.md` — outils

Si une étape a déjà été faite pour ce produit, on reprend là où on s'est arrêté.

## Étape 1 — Choisir le produit

madoff15 choisit un produit ou une catégorie.
Confirmer en une ligne : produit, marchés visés (Maroc, France, ou les deux).

## Étape 2 — Scraper tout le web et faire l'étude de marché Chine vs Maroc vs France

Claude scrape tout le web pour ce produit. Tous les outils disponibles, en même temps :
- **Chine** : 1688 (Apify `devcake/1688-com-products-scraper`), Alibaba, AliExpress, CJdropshipping.
- **Maroc** : Jumia (Apify `khadinakbar/jumia-product-scraper`, country: ma, par petits lots), Avito, boutiques Instagram et sites marocains.
- **France** : Amazon.fr, Cdiscount, Zalando, sites de marques, boutiques Shopify.
- **Tendances** : TrendTrack, Meta Ads Library, TikTok, Instagram.
- Toujours revérifier les prix par recherche web avant de les donner.

**Positionnement prix — la règle :**
- Cible : **étudiants de 20 à 25 ans**.
- **Milieu de gamme accessible** : ni bas de gamme qui fait "cheap", ni haut de gamme qui fait "trop riche".
- Proposer un prix de vente qui fait qualité, mais qu'un étudiant peut se payer.

**Sortie :** un tableau par produit :
coût Chine · prix bas Maroc · prix moyen Maroc · prix bas France · prix moyen France · **prix de vente proposé**.

Enregistrer les prix dans `/areas/etude-marche-chine-maroc.md`.

## Étape 3 — Site catalogue pour l'agent + étude de marge

**3a. Le site catalogue pour l'agent**
Avant de contacter un agent, on fait un site (page catalogue) avec :
- les produits voulus : photos de référence, matières, tailles, couleurs,
- les prix cibles d'achat,
- nos conditions : MOQ 1 (envoi à l'unité), délai de livraison, prix de livraison max par commande (6 à 10 €), contrôle qualité avec photos, sans marque, moyen de paiement.

On envoie ce lien à tous les agents. Même message, même catalogue pour tous : facile à comparer.

**3b. L'étude de marge**
Pour chaque produit, calculer tout de suite :
- coût d'achat + commission agent + livraison = **coût de revient**,
- prix de vente − coût de revient = **marge par pièce**,
- marge en %,
- combien de ventes pour rembourser le budget pub.

Sortie : tableau de marge. Si un produit fait moins de marge que prévu, le signaler avant d'aller plus loin.

## Étape 4 — Tester l'agent

- Contacter 5 à 8 agents en parallèle, avec le lien du catalogue.
- Plateformes : Alibaba (agents), CJdropshipping, SourcinBox, EPROLO, NicheDropshipping.
- Quand madoff15 colle les réponses : appliquer la grille et dire lequel a le mieux répondu, et pourquoi.

Bons signaux : reprend les produits ligne par ligne, conteste au moins un prix avec une raison, annonce sa commission, cite un transporteur, propose un contrôle qualité.
Mauvais signaux : "yes my friend" sans détail, accepte tous les prix, ne parle pas du transport, demande un acompte avant de montrer un produit.

Test final : une petite commande d'échantillons chez le meilleur (1 pièce par produit).

## Étape 5 — Payer l'agent en sécurité

Règles non négociables :
- Jamais d'acompte avant d'avoir vu des photos ou vidéos réelles du produit.
- Payer par un moyen protégé : Alibaba Trade Assurance ou PayPal. Jamais un virement direct à un inconnu.
- Garder par écrit : prix, commission, délai, transporteur.
- Vérifier chaque échantillon à réception : qualité, taille, finition.

## Étape 6 — Faire le site de vente

- Site codé sur mesure avec Claude (pas Shopify), hébergé sur Hostinger.
- Pour chaque produit : titre, description courte, matière, tailles, prix, photos, bouton de commande WhatsApp.
- Photos : celles du fournisseur ou générées avec Higgsfield. Jamais de photos de marques ou de photographes sans droits.
- Paiement : paiement à la livraison au Maroc, Stripe pour le reste.
- Tester sur mobile avant de lancer.

## Étape 7 — Pubs et hooks, système 30 / 30 / 40

Analyse concurrents automatique : Meta Ads MCP + TrendTrack + Apify, sans attendre qu'il le demande.
Ressortir d'abord les hooks validés de `/areas/hooks-pub.md`.

**Répartition des vidéos :**
- **40 %** : scripts écrits par Claude, from scratch.
- **30 %** : inspirées du scraping TikTok et Instagram (vidéos qui marchent sur le même produit).
- **30 %** : inspirées de la Bibliothèque publicitaire Facebook (Meta Ads Library), les pubs qui tournent depuis longtemps.

But : voir quelle source donne les meilleurs hooks.
Chaque vidéo garde une étiquette de sa source, pour comparer les résultats à l'étape 9.
Vidéos générées avec Higgsfield.

## Étape 8 — Publication automatique avec Metricool

- Connecteur officiel Metricool dans Claude. Marche avec le plan gratuit.
- Si le connecteur n'est pas branché : le proposer tout de suite.
- Programmer tout le lot d'un coup, étalé sur la semaine, sur les meilleurs horaires du compte.
- Instagram en priorité, TikTok et Facebook si le produit s'y prête.

## Étape 9 — Lancement et mesure

Le budget de lancement n'est pas géré ici : madoff15 le calcule lui-même, selon le devis du fournisseur.

**Mesure :**
- Lire les stats via Metricool après quelques jours.
- Comparer les 3 sources de vidéos (Claude / scraping / Ads Library) : laquelle marche le mieux.
- Les hooks gagnants : les ajouter à `/areas/hooks-pub.md`.
- Si un produit convertit : doubler le budget pub dessus.
- Si rien ne convertit : changer de hook avant de changer de produit.

Puis on recommence à l'étape 1 avec le produit suivant.

## Suivi

À la fin de chaque étape, une ligne :
"Étape X faite. Prochaine étape : Y. Ce qu'il te faut : Z."
