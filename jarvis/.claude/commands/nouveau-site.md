# Commande : /nouveau-site

Lance la création d'un site web complet en suivant ces étapes dans l'ordre. Ne saute aucune étape. Ne déploie jamais sans les deux validations explicites.

---

## ÉTAPE 1 — Créer la structure du site

Demande d'abord :
- Quel type de site ? (boutique vêtements / boutique montres / agence / autre)
- Une couleur ou ambiance préférée ? (sinon tu choisis selon la niche)

Puis génère :
- Page d'accueil avec hero section
- Page catalogue / produits
- Page À propos
- Page Contact (WhatsApp en priorité)
- Design responsive (mobile d'abord, les clients sont sur téléphone)

---

## ÉTAPE 2 — Récupérer les images

Dis à l'utilisateur : "Glisse tes images ici, une par une ou toutes ensemble."

Attend qu'il ait fini d'envoyer ses images avant de continuer.
Signal de fin : il dit "c'est tout" ou "c'est bon" ou il ne répond plus après 30 secondes.

---

## ÉTAPE 3 — Classer et nommer les images

Pour chaque image reçue, génère un nom selon cette priorité :

1. **Nom donné par l'utilisateur** → utilise-le tel quel
2. **Type détecté + couleur** → si tu reconnais le vêtement ou produit :
   - Format : `[type]-[couleur]-[numéro]`
   - Exemples : `hoodie-noir-01`, `robe-rouge-02`, `montre-or-03`, `djellaba-blanche-01`
3. **Inconnu** → demande à l'utilisateur de nommer le produit

Classe ensuite les produits par catégorie :
- Hauts (t-shirts, hoodies, vestes...)
- Bas (pantalons, shorts, jupes...)
- Robes & combinaisons
- Montres & accessoires
- Autre

Affiche le tableau de classement :
```
CLASSEMENT DE TES PRODUITS :

📁 Hauts
  - hoodie-noir-01 ✅
  - tshirt-blanc-02 ✅

📁 Montres
  - montre-or-01 ✅

📁 Non classé
  - image-04 ❓ → comment tu appelles ce produit ?
```

---

## ÉTAPE 4 — Validation du contenu

Montre un aperçu du site avec les produits intégrés.

Pose ces questions :
1. "Est-ce que les noms et catégories sont corrects ?"
2. "Y a-t-il des changements à faire sur le design ou le contenu ?"

**Attends une réponse explicite avant de continuer.**
Si des changements sont demandés → applique-les et représente.
Répète jusqu'à ce que l'utilisateur dise "c'est bon", "ok", "valide" ou équivalent.

---

## ÉTAPE 5 — Confirmation du domaine

Seulement après validation du contenu, demande :
"Quel nom de domaine tu veux utiliser ?"

Vérifie via Hostinger MCP si le domaine est disponible.
Propose 3 alternatives si le domaine choisi est pris.

**Attends la confirmation explicite du domaine avant de déployer.**

---

## ÉTAPE 6 — Déploiement

Seulement après les deux validations (contenu ✅ + domaine ✅) :
1. Déploie sur Hostinger via MCP
2. Configure le domaine
3. Envoie l'URL finale : "Ton site est en ligne : [URL]"

---

## RÈGLES ABSOLUES
- ❌ Jamais de déploiement sans "c'est bon" explicite sur le contenu
- ❌ Jamais de déploiement sans domaine confirmé
- ❌ Jamais directement en production — toujours un aperçu d'abord
- ✅ Mobile first — le site doit être parfait sur téléphone
- ✅ WhatsApp comme canal de contact principal
