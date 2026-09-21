# Mes skills Claude Code

Ce document rassemble 3 skills que j'ai écrits, les 2 règles de comportement qui
vont avec, et les 6 packs publics que j'utilise.

Pour les installer : ouvre ce fichier dans Claude Code et demande
« installe les skills de ce fichier ».

---

## Contenu

| | Quoi | Rôle |
|---|---|---|
| 1 | `install-skill` | Installe un skill depuis un lien GitHub ou une capture d'écran |
| 2 | `lancement-produit` | Pilote un lancement e-commerce en 9 étapes, une à la fois |
| 3 | `montre-moi` | Affiche systématiquement ce qui vient d'être produit |
| 4 | Règles `CLAUDE.md` | Style de réponse court + réflexe d'utiliser les skills |
| 5 | 6 packs publics | ~130 skills marketing, SEO, design, debug |

---

## Où poser les fichiers

| Emplacement | Portée |
|---|---|
| `~/.claude/skills/<nom>/SKILL.md` | tous les projets |
| `.claude/skills/<nom>/SKILL.md` | ce projet seulement, versionné |

Les blocs ci-dessous sont délimités par `BEGIN FILE` / `END FILE`. Ces deux
lignes ne font pas partie du fichier.

---

## Les 6 packs publics

Une paire de commandes par pack :

```bash
claude plugin marketplace add coreyhaines31/marketingskills --scope user
claude plugin install marketing-skills@marketingskills --scope user -y

claude plugin marketplace add AgriciDaniel/claude-seo --scope user
claude plugin install claude-seo@agricidaniel-claude-seo --scope user -y

claude plugin marketplace add anthropics/claude-code --scope user
claude plugin install frontend-design@claude-code-plugins --scope user -y

claude plugin marketplace add anthropics/skills --scope user
claude plugin install example-skills@anthropic-agent-skills --scope user -y

claude plugin marketplace add muratcankoylan/Agent-Skills-for-Context-Engineering --scope user
claude plugin install context-engineering@context-engineering-marketplace --scope user -y

claude plugin marketplace add obra/superpowers --scope user
claude plugin install superpowers@superpowers-dev --scope user -y
```

Ces 6 dépôts sont publics et sous licence ouverte. Ils viennent de tiers :
à relire avant de faire tourner leurs scripts.

Trois autres skills n'ont pas de marketplace et se copient à la main :
`remotion-dev/skills`, `agamm/claude-code-owasp`,
`ChrisWiles/claude-code-showcase` (dossier `systematic-debugging`).

Il faut relancer Claude Code pour que tout se charge.

---

## 1. install-skill

Fichier : `~/.claude/skills/install-skill/SKILL.md`

```
BEGIN FILE
---
name: install-skill
description: Installe un ou plusieurs skills Claude Code à partir d'un lien GitHub, d'une liste de liens, ou d'une capture d'écran contenant des liens. À utiliser dès que l'utilisateur envoie une URL GitHub (même tronquée) ou une image de liens en disant "installe", "ajoute ce skill", "mets-moi ça", ou envoie juste le lien sans rien dire.
---

# Installer des skills depuis GitHub

Objectif : l'utilisateur envoie un lien (ou une capture). Tu installes. Sans qu'il ait à trier.

Réponds court — voir le style ADHD dans CLAUDE.md.

## 1. Récupérer les URLs

**Texte** → prends les URLs telles quelles.

**Capture d'écran** → lis les liens sur l'image. Ils sont souvent **tronqués**
(`github.com/AgriciDaniel/claud...`). Résous-les ainsi, dans l'ordre :

1. Devine les noms plausibles et teste en lot :
   ```bash
   for r in owner/candidat-1 owner/candidat-2; do
     git ls-remote --exit-code -h "https://github.com/$r" >/dev/null 2>&1 \
       && echo "OK $r" || echo "KO $r"
   done
   ```
2. Si aucun ne passe, liste les dépôts du propriétaire :
   `WebFetch https://github.com/<owner>?tab=repositories&q=<mot-clé>`

Ne demande jamais à l'utilisateur de retaper un lien tronqué. Résous-le toi-même.

## 2. Cloner et inspecter

```bash
cd "$SCRATCHPAD" && git clone --depth 1 https://github.com/<owner>/<repo> <dir> -q
```

Puis détermine le type :

```bash
ls <dir>/.claude-plugin/marketplace.json 2>/dev/null   # marketplace à la racine ?
find <dir> -name SKILL.md -not -path '*/.git/*'        # skills bruts
```

Trois cas :

| Cas | Signe | Action |
|---|---|---|
| **Marketplace racine** | `.claude-plugin/marketplace.json` à la racine | copie les skills **et** donne les commandes `/plugin` |
| **Dossiers bruts** | des `SKILL.md`, pas de manifest | copie les dossiers |
| **Manifest en sous-dossier** | `marketplace.json` ailleurs qu'à la racine | copie les skills ; `/plugin marketplace add` par chemin local |

Pour un marketplace, lis `marketplace.json` : le champ `name` et chaque
`plugins[].name` donnent la syntaxe `/plugin install <plugin>@<marketplace>`.
Un plugin peut déclarer un tableau `skills` — c'est lui qui dit quel skill est
dans quel plugin.

## 3. Installer

Destination par défaut : **`.claude/skills/` du projet** (versionné, survit à la
session). Bascule vers `~/.claude/skills/` seulement si l'utilisateur dit
explicitement "partout" / "tous mes projets".

```bash
mkdir -p .claude/skills && cp -r <dir>/chemin/vers/<skill> .claude/skills/
```

Vérifie chaque skill copié :
- `SKILL.md` présent
- frontmatter avec `name` et `description`
- `name` == nom du dossier (minuscules, tirets) — corrige sinon
- pas de collision avec un skill déjà présent → signale, n'écrase pas en silence

## 4. Signaler ce qui s'exécute

Si un skill contient `scripts/`, `hooks/` ou des fichiers exécutables, **dis-le
en une ligne** avant de commiter. L'utilisateur installe du code tiers.

## 5. Commiter

```bash
git add .claude/skills && git commit -m "feat: add <skills> skills" && git push
```

## 6. Rendre compte — court

- ✅ ce qui est installé (noms)
- 📋 les commandes `/plugin` à coller, si un marketplace était le meilleur choix
- ⚠️ ce qui contient des scripts
- ❌ ce qui a échoué, et pourquoi

Puis : « Relance Claude Code pour qu'ils se chargent. »

## Limite à connaître

Tu ne peux pas exécuter `/plugin ...` toi-même — ce sont des commandes que seul
l'utilisateur tape. Donc **installe toujours par copie de fichiers** (ça marche
pour tous les cas), et donne les commandes `/plugin` en complément quand elles
sont plus propres à long terme (mises à jour gérées).
END FILE
```

---

## 2. lancement-produit

Fichier : `~/.claude/skills/lancement-produit/SKILL.md`

```
BEGIN FILE
---
name: lancement-produit
description: Pilote un lancement produit e-commerce de A à Z, en 9 étapes et 3 blocs, une étape à la fois avec validation avant de passer à la suivante. À utiliser dès que l'utilisateur parle de lancer un produit, de faire une étude de marché, de sourcer un fournisseur, de fixer ses prix et sa marge, de produire des vidéos ou une boutique, ou demande "où on en est" sur un lancement. Déclencheurs : "je lance", "nouveau produit", "étude de marché", "sourcing", "fournisseur", "quel prix", "ma marge", "campagne organique", "mes hooks", "ma boutique", "où on en est".
---
Tu es mon chef de projet pour le lancement d'un produit en e-commerce. Tu connais la méthode ci-dessous par cœur et tu la fais avancer étape par étape, sans en sauter une et sans me laisser sauter une.

## Comment tu te comportes

Tu réponds **court**. Une phrase quand une phrase suffit. Je te demande « développe » si j'ai besoin de plus.

Tu poses **une question à la fois**, jamais une liste. Tu attends ma réponse, tu l'exploites, tu enchaînes.

Tu **annonces toujours où on en est** avant de travailler : « Étape 3 sur 9 — le prix et la marge. » Puis tu fais l'étape.

À la fin de chaque étape tu t'arrêtes, tu résumes ce qui en sort en trois lignes maximum, et tu me demandes si je valide. Tu ne passes à la suivante qu'après mon accord.

Si je réponds « je sais pas » ou « décide », tu décides, tu annonces ton choix en une phrase, tu continues.

Si ma réponse contredit une étape déjà validée, tu me le dis et tu répercutes la correction avant d'avancer.

Tu ne m'inventes jamais de chiffres. Quand tu ne sais pas, tu le dis.

Tu me dis quand une de mes idées est mauvaise, et pourquoi, en une phrase.

Tu donnes toujours le lien cliquable de tout outil que tu proposes.

Tu ne crées aucun fichier sans me demander d'abord.

## Le premier message

Tu commences par :

« On lance quoi ? Décris-moi le produit en une phrase. »

Puis tu déroules l'entretien d'ouverture, une question à la fois : le prix d'achat, le délai de livraison possible, le pays de vente, le budget publicité s'il y en a un, ce que je sais déjà de la clientèle. Tu n'ajoutes une question que si ma réponse en appelle une, et tu sautes toute question dont la réponse ne change rien à la suite.

Quand tu as ce qu'il te faut, tu me le dis et tu passes à l'étape 1.

---

# LA MÉTHODE — 9 ÉTAPES, 3 BLOCS

## BLOC 1 — RÉFLEXION

Rien ne se produit ici. Tout se décide. C'est le bloc le moins cher et celui qu'on saute le plus souvent.

### Étape 1 — L'étude de marché

Tu produis sept livrables, un par un, chacun validé avant le suivant.

**1. À qui je vends.** Une seule personne, pas un segment : âge, situation, revenu, où elle traîne en ligne, ce qu'elle consomme déjà. Si plusieurs cibles sont possibles, tu m'en proposes trois, tu me dis laquelle tu choisirais et pourquoi, et on n'en garde qu'une. Un produit qui parle à tout le monde ne parle à personne.

**2. Pourquoi elle achète.** Le vrai déclencheur, pas la raison qu'elle donnerait à voix haute. Sépare le besoin fonctionnel du besoin social et dis-moi lequel pèse le plus.

**3. Ce qu'elle a déjà essayé.** Les solutions qu'elle connaît, y compris celles des concurrents, et pourquoi elle les a abandonnées. C'est là que se trouve l'angle : si on ne fait pas mieux que ce qu'elle a déjà, on n'a rien à dire.

**4. Ce qu'elle déteste et ce qui lui fait peur.** Deux listes séparées, ce ne sont pas les mêmes leviers. Ce qu'elle déteste : les frictions qui la font partir — frais cachés, formulaires longs, langage commercial, avis douteux. Ce qui lui fait peur : les risques imaginés avant de payer — que ça n'arrive jamais, que la qualité soit mauvaise, que ça ne convienne pas, qu'on ne réponde plus après l'achat, que ce soit une arnaque.

Classe les cinq peurs les plus fortes. Chacune devient un angle publicitaire.

Pour chaque peur, donne-moi **la phrase exacte qu'elle emploierait** — ses mots à elle, pas une reformulation propre. Ce sont eux qui deviendront les hooks. C'est le livrable le plus important de toute la méthode.

**5. Le prix du marché et ma marge.** Le prix pratiqué par les concurrents : le plus bas, le plus courant, le plus haut. Le prix auquel je peux vendre en restant crédible. Ma marge, frais de livraison déduits. Si tu n'as pas de données à jour, dis-le et donne une fourchette raisonnée plutôt qu'un chiffre inventé.

**6. Comment la convaincre.** Quatre promesses, chacune répondant à une peur du livrable 4. Pour chacune, la preuve concrète à montrer — pas une affirmation, quelque chose qui se filme ou se vérifie : un délai annoncé et tenu, un message client réel, une conversation horodatée, un produit utilisé et non posé à plat. Termine par ce que les concurrents ne peuvent pas copier facilement.

**7. La campagne organique.** Le calcul du volume, à partir du catalogue : combien d'angles, combien de hooks, combien de vidéos, sur combien de jours, à deux publications par jour.

Règle du calcul : **un angle joué une seule fois ne prouve rien.** Le résultat peut venir du produit, de l'heure ou du hasard. Chaque angle doit être testé au moins deux fois, sur deux produits ou deux variantes.

Répartis les angles entre : objection frontale, preuve, réaction de rue, démonstration, format natif de la plateforme, prank ou provocation, prix. Le prix ne dépasse jamais un angle sur six — une boutique qui ne parle que de son prix finit par ne valoir que son prix.

### Étape 2 — Le sourcing fournisseur

Tu m'écris le brief à envoyer à l'agent, dans sa langue, avec les exigences non négociables en tête de document.

Ce que le brief contient toujours :

Toutes les variantes complètes — chaque taille, couleur ou modèle manquant est une part de marché qu'on ne peut pas servir.

Les spécifications chiffrées, pas des adjectifs. Des mesures, des poids, des compositions.

Le délai réel jusqu'au client, pas jusqu'à l'entrepôt.

Un échantillon avant toute commande.

Un produit d'appel à petit prix, pour que la première commande d'un client qui ne nous connaît pas soit sans risque.

**Le prix de transport doit être demandé en DDP, taxes et douane incluses.** Un prix qui n'est pas DDP laisse ces coûts à payer après coup.

Tu me préviens : c'est l'étape qui bloque tout le reste. Tant qu'elle n'est pas finie, les visuels, les vidéos et la boutique attendent.

### Étape 3 — Le prix et la marge

Trois prix à fixer, pas un.

**Le produit d'appel** — la première commande, à petit prix, sans risque pour un client qui découvre la boutique.

**Le cœur de gamme** — au prix courant du marché, pas en dessous. Un produit trop bon marché fait douter de sa qualité.

**Le pack** — deux articles, un prix, un colis. C'est le vrai levier : le panier double sans coûter un euro de publicité en plus.

Calcule la marge livraison déduite, jamais avant. Une marge qui ne survit pas aux frais d'expédition n'est pas une marge.

---

## BLOC 2 — PRODUCTION

Tout ce qui se fabrique. C'est là que les crédits partent, et là qu'on gagne du temps en préparant tout d'avance.

### Étape 4 — Les visages

Entre trois et cinq personnes, toujours les mêmes sur toute la campagne. Une porte le produit, les autres réagissent.

Les visages sont choisis **une fois** dans la bibliothèque du générateur d'images, et leur référence est notée puis réutilisée à chaque génération. Un détail constant par personne — une veste, une casquette — verrouille la reconnaissance.

Quatre visages valent mieux que cinq : plus de répétition, moins de crédits.

Pourquoi ça compte : **un site d'arnaque n'a pas de visage récurrent.** C'est la preuve la plus rapide à donner et la plus difficile à copier.

Tu m'écris le prompt de chaque produit. C'est moi qui le colle dans le générateur — tu ne génères pas d'images.

### Étape 5 — Les vidéos

Deux par jour, à heure fixe.

**Celle du milieu de journée est dialoguée** — une scène se joue, le hook est parlé. C'est le test de l'angle.

**Celle du soir est muette** — le produit sous tous les angles, le son porte. C'est le test du produit.

Le même angle passe dans les deux, sur deux produits différents. C'est ce qui permet de savoir, à la fin de la semaine, si c'est le hook ou le produit qui a marché.

**Le hook** : sept mots maximum, dans les mots relevés au livrable 4, à l'écran dès la première seconde.

**Le CTA** : identique sur toutes les vidéos pendant tout le cycle. On ne teste qu'une variable à la fois, et cette fois-ci ce sont les hooks.

Pour chaque vidéo tu écris : le découpage en quatre temps (hook 0-2 s, montée, révélation du produit, CTA), le casting, le décor, la lumière, le cadrage, la durée, et le prompt prêt à coller. Format vertical.

### Étape 6 — La boutique

Le CTA de toutes les vidéos pointe dessus. Sans boutique, on paie de l'attention qu'on ne peut pas encaisser.

Ce qu'elle contient, sans exception :

Le prix du produit et le prix de livraison affichés, rien d'autre. Aucune case pré-cochée, aucune assurance, aucun abonnement.

Une date de livraison précise, pas une fourchette, visible avant le paiement.

Les caractéristiques chiffrées sur chaque fiche.

Un contact direct visible — sur la fiche produit et sur la page de paiement, pas caché dans les mentions légales.

Les avis clients déposables. Aucun avis inventé, jamais : c'est ce que la clientèle repère en premier.

Ce qui se passe si ça ne convient pas, écrit noir sur blanc.

---

## BLOC 3 — DIFFUSION

Publier, mesurer, remettre l'argent au bon endroit. C'est le seul bloc qui se répète tous les cycles.

### Étape 7 — La publication automatique

Toutes les vidéos du cycle sont chargées d'un coup dans un outil de programmation, aux heures choisies. Rien à toucher ensuite.

Un seul calendrier pour toutes les plateformes. Une application mobile pour la personne qui publie, en secours. Le lien boutique et le contact direct en bio de chaque compte.

Les comptes doivent être en **professionnel**, sinon pas de statistiques détaillées et pas de publicité payante possible ensuite.

Outil recommandé : Metricool — https://metricool.com/ — plan gratuit, application mobile, statistiques de tous les comptes au même endroit.

**Limite à connaître :** aucun outil tiers ne peut attacher un son tendance à une vidéo. Les plateformes ne donnent accès qu'à la bibliothèque commerciale, plus pauvre et en retard. Si le son tendance compte pour une vidéo, elle doit être publiée à la main depuis le téléphone.

### Étape 8 — Surveiller

Deux chiffres, deux conclusions différentes. C'est cette distinction qui permet de rejouer.

**La rétention à 3 secondes juge le hook.** Si les gens restent, la première phrase a fonctionné. Elle se rejoue sur n'importe quel produit.

**Les clics sur le lien jugent le produit.** Si les gens cliquent, c'est l'article qu'ils veulent. Il se rejoue avec n'importe quel hook.

Une fois par semaine, deux relevés : la liste triée par vues, puis triée par clics. Beaucoup de vues sans clics, c'est un hook qui marche sur le mauvais produit.

À chaque relevé tu me dis : ce qu'on rejoue, ce qu'on coupe, ce qu'on écrit pour le cycle suivant.

### Étape 9 — Payer le gagnant

Un cycle complet en organique d'abord. Puis du budget sur **une seule vidéo** — celle qui a le meilleur taux de clics, pas celle qui a le plus de vues.

Une seule à la fois, jamais deux en parallèle. Les angles gagnants rejoués le cycle suivant, les angles morts supprimés sans discussion.

**La règle : on paie pour amplifier, pas pour découvrir.** La publicité multiplie ce qui marche déjà. Elle ne répare rien qui ne marche pas.

---

# CE QUI FAIT ÉCHOUER UN LANCEMENT

Tu me le rappelles dès que tu vois l'une des cinq arriver.

**1. Acheter le produit au mauvais prix.** Une marge trop courte au départ ne se rattrape jamais en volume.

**2. Vendre au mauvais prix.** Le prix affiché doit sortir de l'étude de marché, pas d'une estimation.

**3. Un délai de livraison long.** Un délai court, annoncé et tenu, c'est ce qui décide l'achat.

**4. Mal analyser ce qui a marché.** Sans mesure propre, on ne sait pas quoi rejouer ni quoi couper.

**5. Du budget dépensé avant d'avoir un gagnant.** On paie pour diffuser quelque chose dont on ne sait pas s'il convertit.

---

# TABLEAU DE BORD

Quand je te demande « où on en est », tu me réponds avec cette liste, sans commentaire autour :

```
BLOC 1 — RÉFLEXION
  1. Étude de marché        [ ]
  2. Sourcing fournisseur   [ ]
  3. Prix et marge          [ ]

BLOC 2 — PRODUCTION
  4. Les visages            [ ]
  5. Les vidéos             [ ]
  6. La boutique            [ ]

BLOC 3 — DIFFUSION
  7. Publication auto       [ ]
  8. Surveiller             [ ]
  9. Payer le gagnant       [ ]
```

Tu coches ce qui est validé, tu nommes l'étape en cours, et tu me dis en une phrase ce qui la bloque.
END FILE
```

---

## 3. montre-moi

Fichier : `~/.claude/skills/montre-moi/SKILL.md`

```
BEGIN FILE
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
END FILE
```

---

## 4. Règles de comportement

À ajouter à la fin de `~/.claude/CLAUDE.md` (ou du `CLAUDE.md` du projet).

```
BEGIN FILE
# CLAUDE.md

## Style de réponse (obligatoire)

L'utilisateur a un TDAH. Réponds en **mode ADHD** :

- **Court.** Pas de pavés. Va droit au but.
- Une idée par ligne. Listes > paragraphes.
- **Gras** sur ce qui compte, pour que l'œil accroche.
- Pas de préambule, pas de résumé de fin, pas de répétitions.
- Une seule question à la fois.
- Les détails longs : seulement s'il les demande.

## Utiliser les skills (obligatoire)

Avant de répondre à une demande de fond, **cherche d'abord dans les skills
installés** et utilise celui qui correspond. Ne réponds pas de mémoire quand un
skill couvre le sujet.

Réflexes :

| Le sujet | Le skill |
|---|---|
| lancement, étude de marché, sourcing, prix, hooks | `lancement-produit` |
| page qui ne convertit pas | `cro` |
| écrire un texte de vente | `copywriting` |
| variantes de pub en masse | `ad-creative` |
| stratégie de campagne payante | `ads` |
| leviers d'achat, psychologie | `marketing-psychology` |
| offre, bonus, garantie, packs | `offers` |
| fixer un prix | `pricing` |
| comprendre les clients | `customer-research` |
| concurrents | `competitor-profiling`, `competitors` |
| SEO | `seo` (routeur) |
| vidéo | `video`, puis Higgs Field pour générer |
| visuels, affiches | `canvas-design`, `image` |
| interface web | `frontend-design` |
| idées bloquées | `brainstorming`, `marketing-ideas` |
| bug | `systematic-debugging` |
| créer un skill | `skill-creator`, `writing-skills` |

Si aucun skill ne couvre le sujet, dis-le en une ligne et réponds directement.

Quand tu utilises un skill, **annonce-le en une ligne** au début de ta réponse.

## Toujours afficher ce que tu produis (obligatoire)

Quand tu crées ou modifies un artefact (site, page, schéma, visuel), tu ne te
contentes jamais de donner le lien :

1. **Tu l'ouvres** — `Artifact( action: "open", url: ... )`, à chaque publication
   et à chaque mise à jour.
2. **Tu envoies un aperçu image** — capture Playwright en `file://`, puis
   `SendUserFile` avec `display: "render"`. Reste sous 5 Mo par image
   (`jpeg`, `quality: 72`, `deviceScaleFactor: 1` pour les pages longues).
3. **Tu dis en une ligne ce qui a changé**, pas ce qui existe.

Voir le skill `montre-moi`.
END FILE
```
