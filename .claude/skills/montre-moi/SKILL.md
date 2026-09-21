---
name: montre-moi
description: Affiche systématiquement ce qui vient d'être produit — ouvre l'artefact dans le panneau latéral et envoie un aperçu image. À utiliser après avoir créé ou modifié un site, une page, un schéma, un visuel, un document, ou tout livrable visuel. Déclencheurs : "montre-moi", "je veux voir", "affiche", "c'est où", "j'ai rien vu", "ouvre-le", ou juste après avoir publié quoi que ce soit.
---

# Montrer, pas décrire

L'utilisateur ne veut pas lire une description de ce que tu as fait.
Il veut le **voir**. Tout de suite, sans chercher.

## La règle

**Après chaque publication ou modification d'un artefact, tu l'ouvres.**

Pas « voici le lien ». Pas « tu peux le trouver dans ». Tu l'ouvres.

```
Artifact( action: "open", url: "<url de l'artefact>" )
```

Ça vaut aussi pour une **mise à jour** : tu republies, tu rouvres. Même s'il
l'avait déjà ouvert avant. Il ne doit jamais avoir à demander « c'est où ».

## Doubler avec une image

Le panneau latéral peut ne pas s'ouvrir chez lui, ou il peut être sur autre
chose. Donc en plus de l'ouverture, envoie un aperçu :

1. Rends la page avec Playwright (Chromium est déjà là,
   `/opt/node22/lib/node_modules/playwright`)
2. Capture l'accueil + une vue secondaire + le mobile (400 px)
3. Envoie avec `SendUserFile`, `display: "render"`

⚠️ **Limite de taille : reste sous ~5 Mo par image.** Un `fullPage` en
`deviceScaleFactor: 2` dépasse et l'envoi échoue en 400. Utilise
`type: "jpeg", quality: 72, deviceScaleFactor: 1` pour les captures longues.

⚠️ Chromium ne fait pas confiance au proxy TLS : les captures marchent sur
`file://` (local), pas sur une URL `https://` externe.

## Ce qu'on écrit à côté

Court. Ce qui a changé, pas ce qui existe.

- ✅ « J'ai remonté le pack en haut et changé le prix de la veste. »
- ❌ Un inventaire de toutes les sections de la page.

Si c'est une modification, dis **ce qui a bougé depuis la version d'avant**.

## Ne jamais

- Renvoyer un lien brut sans ouvrir l'artefact
- Décrire longuement une page au lieu de la montrer
- Laisser croire qu'un diff Git ou un fichier de code, c'est « le site »
- Publier puis passer à autre chose sans afficher
