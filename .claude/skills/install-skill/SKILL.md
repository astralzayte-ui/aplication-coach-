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
