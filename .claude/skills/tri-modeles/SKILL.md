---
name: tri-modeles
description: Trie chaque tâche AVANT de la faire et envoie le travail mécanique (chercher des fichiers, lire des logs, lister, résumer un gros fichier, renommer, déplacer, éditions répétitives) à des sous-agents Haiku, pour ne garder sur Opus que la réflexion difficile. À utiliser dès qu'une demande contient du travail de recherche, de lecture ou d'exécution simple, quand Atakan parle de limite, de quota, d'économiser des tokens, ou dit « trie », « délègue », « mode éco ».
---

# Tri des tâches : Haiku pour l'exécution, Opus pour la réflexion

Chaque token lu ou écrit par Opus coûte cher sur la limite. Une grosse partie du travail
(fouiller des dossiers, lire 2 000 lignes de logs, renommer 30 fichiers) ne demande aucune
réflexion. Ce skill fait passer ce travail sur Haiku, et Opus ne reçoit que le résultat condensé.

## Étape 1 : trier avant d'agir

Avant le premier appel d'outil, découpe la demande en sous-tâches et classe chacune :

| Classe | Exemples | Qui le fait |
|---|---|---|
| **MÉCANIQUE** | trouver où est défini X, lister des fichiers, lire et résumer un log ou un gros fichier, grep sur tout un dossier, extraire des chiffres d'un CSV, renommer/déplacer, appliquer la même petite modif à N fichiers, lancer des commandes et rapporter la sortie | Agent `eclaireur-haiku` (lecture) ou `executant-haiku` (écriture) |
| **RÉFLEXION** | décider d'une architecture, déboguer une cause racine floue, écrire un script/texte qui demande du goût (voix de Léo, hooks, stratégie), arbitrer entre options, relire un travail pour juger sa qualité | Opus, ici même |
| **TRIVIAL** | lire UN fichier dont on connaît le chemin, une seule commande, une réponse directe | Opus directement : lancer un agent coûterait plus cher que de le faire |

Règle de seuil : déléguer seulement si la sous-tâche va lire ou produire **beaucoup** de texte
(plusieurs fichiers, un long log, plus de ~3 appels d'outils). Sinon, le faire soi-même.

## Étape 2 : déléguer le mécanique

Appeler l'outil Agent avec :
- `subagent_type: "eclaireur-haiku"` pour chercher / lire / résumer (aucune écriture possible) ;
- `subagent_type: "executant-haiku"` pour des modifs simples et entièrement spécifiées ;
- à défaut, n'importe quel agent avec `model: "haiku"`.

Le brief doit être **fermé** : Haiku exécute, il ne décide pas.
- dire exactement quoi chercher / modifier, où, et quand s'arrêter ;
- imposer le format du retour : court, chemins `fichier:ligne`, chiffres exacts, pas de recopie de fichiers entiers ;
- interdire toute initiative hors brief (« si c'est ambigu, ne fais rien et signale-le »).

Les sous-tâches mécaniques indépendantes partent **en parallèle** dans un même message.

## Étape 3 : Opus garde le jugement

- Opus raisonne sur les retours condensés, pas sur les fichiers bruts.
- Si un retour est flou ou contradictoire, relancer Haiku avec une question précise plutôt que tout relire soi-même.
- Un point décisif (un chiffre qui va dans un livrable, une ligne de code qu'on va modifier) : Opus le vérifie lui-même en lisant juste cet extrait.
- Jamais de délégation à Haiku pour : écrire dans la voix de Léo, choisir un angle, juger si un contenu est bon, décider d'un plan.

## Ce que le skill ne fait pas

Il ne change pas le modèle de la conversation principale : celle-ci reste sur le modèle choisi
dans l'app. Pour une session entière de travail simple, passer directement la session sur Haiku
dans le sélecteur de modèle de l'app est encore plus économe.
