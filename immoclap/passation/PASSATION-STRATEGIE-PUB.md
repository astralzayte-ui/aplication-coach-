# Passation — la stratégie pub, pour le projet immobilier

> À coller dans la session Claude Code du **projet immobilier**.
> Écrite le 08/10/2026 depuis le projet vêtements (SILENCE).
> Le détail complet est dans le skill **`pub`**, installé sur le compte :
> **l'utiliser.** Ce dossier en est le résumé, et ce qui a été décidé.

---

## Le principe en une phrase

**On ne fabrique que ce qui a déjà gagné ailleurs** : on copie le FORMAT des
vidéos qui marchent chez les concurrents, on teste en gratuit, et on ne paie
de la pub que sur une vidéo qui a déjà gagné.

---

## Les étapes, dans l'ordre

```
AVANT       1. trouver 5 concurrents qui vendent VRAIMENT
(1 soirée)  2. leurs vidéos gratuites qui percent + leurs pubs actives
               depuis 30 jours et plus (une pub qui dure = elle rapporte)
            3. Claude les fait regarder par Gemini, seconde par seconde,
               TOUT SEUL (testé : 0 €, rien à copier-coller)
            4. on classe : format · accroche · angle · offre · durée

JOURS 1-20  40 vidéos, 2 par jour, GRATUITES
            32 (80 %) = formats copiés sur les concurrents
             8 (20 %) = nos idées (objections, vidéos enregistrées,
                         avis 1 étoile des concurrents)

JOUR 21     on lit la rétention à 3 secondes, format par format
            + le tableau de bord du site : quelle vidéo amène quelle vente

JOURS 21-40 40 vidéos : le format gagnant 50 % · le 2ᵉ 30 % · le reste 20 %
            une de « nos idées » qui a percé est retestée

APRÈS       on booste UNIQUEMENT la vidéo gagnante, payée avec l'argent
            des ventes — jamais avec sa poche
```

---

## Les règles décidées (à ne pas rouvrir)

```
🔴  TOUJOURS 80 / 20 : 80 % copié, 20 % nos idées — pour tous les projets
🔴  on copie le FORMAT, jamais la vidéo (illégal + caché par les réseaux)
🟢  le contenu gratuit aussi en 80 / 20 : 80 % de vidéos qui montrent sans
    vendre, 20 % qui vendent (prix, offre, lien). Une vidéo gratuite qui ne
    fait QUE vendre tourne mal. Une vidéo PAYÉE peut vendre à 100 %.
🟢  on ne teste QUE la source et l'angle. Le reste (cadrage, sous-titre)
    ne bouge pas : 80 vidéos ne tranchent qu'un GROS écart.
🟢  un visage récurrent (généré sur Higgs Field) = l'image de marque.
    🔴 jamais présenté comme le fondateur ou un client
    🔴 étiquette « contenu IA » cochée à CHAQUE publication — Claude la met
       via Metricool (instagramData.isAiGenerated, tiktokData.isAigc,
       youtubeData.isAiGeneratedContent)
🔴  chaque vidéo a son ÉTIQUETTE avant de sortir (code, source, angle,
    accroche, 80/20) — sinon les chiffres ne se relient à rien
🔴  aucune promesse dans une vidéo qu'on ne peut pas prouver sur le site
```

---

## Le tableau de bord — pas de suivi, pas de lancement

**Aucune vidéo ne sort tant que Claude ne peut pas lire :**

```
les vidéos   Metricool (vues, rétention 3 s, clics)
le site      chaque lien de vidéo porte son code (?v=video07) → le site
             compte visites, paniers, commandes PAR VIDÉO
             (SILENCE : Netlify Functions + Blobs, 0 €)
les ventes   le paiement, en LECTURE SEULE
```

**Pas de rappel automatique** : il demande « ça donne quoi ? », Claude lit
tout et répond en 5 lignes.

---

## Payer la pub — la règle qui empêche de brûler l'argent

> **Une vente ne doit jamais coûter plus en pub qu'elle ne rapporte.**

```
coût max d'une vente en pub = 70 % de la marge d'une vente
après ~1 000 affichages, rétention basse   → on coupe
après le coût de 2 ventes, zéro vente      → on coupe
une vente sous le coût max, 3 jours        → on garde, 5 nouveaux débuts
budget pub = au plus 30 % de la marge de la semaine précédente
```

---

## Ce que ça coûte (SILENCE — à refaire pour l'immobilier)

```
les 80 vidéos (Higgs Field)       800 MAD   (10 MAD la vidéo)
Metricool, 2 mois                 344 MAD
Gemini qui regarde les vidéos       0 MAD
le scraping des concurrents         0 MAD   avec le bonus gratuit
                                 ~470 MAD   sinon (pack, à vérifier)
──────────────────────────────────────────
TOTAL 40 JOURS                  1 144 MAD  (≈ 106 €)
```

🟠 **Pour l'immobilier, tout est à recalculer** : le prix d'une « vente »
(un mandat, un rendez-vous, un contact ?) change la marge, donc le coût max
d'une vente en pub. **À poser avec lui, une question à la fois.**
