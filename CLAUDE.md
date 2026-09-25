# Contexte du dépôt

Ce dépôt contient **deux choses sans rapport** :

1. **`index.html`** — l'application budget/Notes de l'utilisateur. C'est elle qui est
   en production. C'est presque toujours de celle-ci qu'il s'agit.
2. **`FORMA - Appli Coach (interactive).dc.html`**, `support.js`, `sw.js`,
   `manifest.json` — un ancien prototype de coaching fitness, sans rapport, décrit
   dans `README.md`. **Ne pas y toucher** sauf demande explicite. Aucun de ces
   fichiers n'est utilisé par `index.html`.

---

# L'application (index.html)

Gestionnaire de budget personnel en **un seul fichier** : tout le HTML, le CSS et le
JavaScript sont en ligne, aucune dépendance externe, aucun build. Interface en
**français**, pensée pour le téléphone.

Trois onglets : **Accueil** (solde, saisie rapide, revenus) · **Dépenses** (charges
fixes + dépenses cochables, réordonnables au doigt) · **Notes** (bloc-notes libre
avec mise en forme).

Sur l'écran d'accueil du téléphone elle se présente comme **« Notes »** avec une
icône de bloc-notes : c'est **voulu**, l'utilisateur ne veut pas qu'on voie une app
de budget. Ne pas « corriger » ce nom.

---

# ⚠️ Règle numéro un : ne jamais perdre les données

Les données de l'utilisateur vivent dans **`localStorage`, clé `bf-v3`**, dans son
navigateur — jamais dans le fichier. Elles ne sont sauvegardées nulle part ailleurs.

**Par conséquent :**

- **Ne jamais renommer la clé `bf-v3`.** La renommer efface tout pour lui.
- **Ne jamais renommer une clé de catégorie** (`nourriture`, `sorties`, `divers`,
  `plaisirs`, `transport`, `boisson`, `remboursement`). Les dépenses enregistrées y
  font référence. Pour changer un libellé, ne changer que le `name` dans `CATS`.
- **Les migrations sont additives.** Un nouveau champ se remplit à la volée dans
  `normalize()` avec une valeur qui **reproduit exactement le comportement
  précédent**. Exemples en place : `ord` (dérivé de l'horodatage, l'ordre affiché
  reste identique) et `coche` (mis à `true`, donc les totaux ne bougent pas d'un
  centime).
- **Vérifier par un test**, pas au jugé : charger un jeu de données au format
  actuellement en production, puis comparer les totaux affichés avant/après.

L'utilisateur a déjà perdu ses données une fois lors d'un changement de schéma. Il y
est très sensible, et il a raison.

## Le piège iPhone : deux tiroirs séparés

Sur iOS, l'application ajoutée à l'écran d'accueil possède **son propre
`localStorage`, distinct de celui de Safari**, alors que l'adresse est la même.
L'utilisateur se sert de l'icône de l'écran d'accueil : **ses données sont dans ce
tiroir-là, et nulle part ailleurs.**

Conséquence, et c'est une erreur déjà commise :

- **Ne jamais lui faire ouvrir l'application dans Safari** pour contourner un cache,
  ni lui proposer une adresse maquillée du genre `…/?v=2`. Il tombe sur un tiroir
  vide, l'assistant de configuration se relance, et il croit tout avoir perdu.
- **Ne jamais lui faire supprimer puis rajouter le raccourci** de l'écran d'accueil
  pour forcer une mise à jour.
- Pour rafraîchir le code **sans quitter le bon tiroir** : tirer l'écran vers le bas
  dans l'application, ou la fermer complètement depuis le sélecteur d'applications
  puis la rouvrir.
- Ne jamais évoquer « Effacer historique et données de site » : cela effacerait tout.

---

# Publication

Le site est branché sur GitHub : **pousser sur la branche
`claude/budget-management-app-1tl45p` déploie automatiquement** en une minute sur

> **https://chic-biscotti-07e6f1.netlify.app**

L'utilisateur n'a rien à faire — il dit « poste » et il recharge. Ne pas lui
demander de télécharger un fichier ni de le déposer sur Netlify : c'était l'ancienne
méthode, elle est terminée.

`netlify.toml` fixe `publish = "."` et empêche la page d'être mise en cache, pour
qu'une mise à jour soit visible tout de suite.

**Pour publier une application différente**, la mettre dans un sous-dossier
(`/quiz/index.html` → `…netlify.app/quiz/`) plutôt que d'écraser `index.html`.

---

# Tests

Chromium est préinstallé dans l'environnement :

```js
chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
```

Avant de pousser : vérifier la syntaxe du script en ligne, puis faire tourner un
parcours navigateur réel en 390×844 avec `hasTouch`. Toujours inclure une épreuve
qui part d'un `localStorage` au format de production et confirme que les totaux sont
inchangés.

---

# Ton des échanges

Répondre **en français**, simplement, sans jargon. L'utilisateur n'est pas
développeur : lui donner les clics à faire, pas les concepts. Quand une manipulation
est irréversible (supprimer, débrancher, écraser), le prévenir **avant**, pas après.

**Automatiser sans qu'il demande.** Consigne permanente de sa part : dès qu'une
tâche peut lui être retirée des mains, la lui retirer, le faire tout de suite, et
l'inscrire ici pour que ça tienne d'une session à l'autre. Déjà en place : le
déploiement part d'un `git push`, l'application se met à jour d'elle-même, une
sauvegarde datée est prise toute seule. Ne jamais lui proposer une manipulation
récurrente qu'un bout de code pourrait faire à sa place.

**Court.** Il l'a demandé explicitement. Faire le travail, puis annoncer le résultat
en quelques lignes. Ne pas dérouler les étapes, les tests, les mesures ni le
raisonnement : il ne les lit pas. Les détails techniques seulement s'il les demande.

## Ergonomie tactile

Il utilise l'application au pouce, sur téléphone. Une cible de moins de 32 px
coincée entre deux autres est intapable, même si un test automatisé la touche sans
problème : le clic programmé vise le pixel exact, pas le doigt. Quand il signale
qu'un bouton « ne marche pas » alors que le code répond, mesurer la taille et
l'écartement des cibles avant de chercher ailleurs.
