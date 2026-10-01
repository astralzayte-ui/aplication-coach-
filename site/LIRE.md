# Le site — la source

**Tout ce qu'il faut pour reconstruire et publier le site est ici.**

```
project/*.dc.html   les 3 écrans — LA SOURCE, on ne modifie que ça
project/img/        les photos et le logo
project/support.js  le moteur Claude Design
shot.cjs            fait les 3 captures d'écran
```

## La chaîne, dans l'ordre

```
1.  on modifie   site/project/*.dc.html
2.  on publie    au canvas Claude Design
                 claude.ai/artifact/RgFKZrBwxEBDBEacQrHRiF
3.  on construit les .dc.html deviennent des .html
4.  on envoie    Netlify, site 49502cec-8837-4717-a444-ec57835f3845
```

🔴 **Netlify est une COPIE. On ne la modifie jamais directement.**

## Publier

```bash
node construire.cjs          # fabrique build/
cd build && zip -qr ../s.zip .
curl -X POST "https://api.netlify.com/api/v1/sites/49502cec-8837-4717-a444-ec57835f3845/deploys" \
     -H "Content-Type: application/zip" --data-binary @../s.zip
```

La clé Netlify est dans les **Identifiants API** de l'environnement : l'en-tête
`Authorization` est injecté tout seul sur `api.netlify.com`. **Il n'y a aucune
clé à écrire dans le code.**

## Les noms de fichiers une fois publié

```
Bureau.dc.html  →  index.html      l'accueil ordinateur
Main.dc.html    →  telephone.html  l'accueil téléphone
Fiche.dc.html   →  fiche.html      la fiche produit
```

Plus les 4 pages légales, fabriquées depuis `partage/legal/*.md`.

## En ligne

**https://silence-boutique.netlify.app** — provisoire.
La version finale ira sur un nom de domaine acheté chez Hostinger,
**pointé vers Netlify** (le nom de domaine seul, ~100 MAD/an).

⚠️ **Ne pas rendre public** tant que les photos sont celles d'autres marques.
