---
name: pub
description: Rappelle le coût (1 144 MAD pour 40 jours) et exige le tableau de bord avant tout lancement. Trouver, décortiquer et fabriquer des pubs et des vidéos qui vendent, à partir des pubs qui marchent VRAIMENT chez les concurrents — avec ses outils (ScrapeCreators, Gemini, Higgs Field, Metricool, Meta). Espionne les pubs actives, les regarde seconde par seconde, en tire les formats et les hooks, produit, teste, et décide quoi payer. À utiliser dès qu'il parle de pub, de hooks, de vidéos à faire, de concurrents qui cartonnent, de quoi tester, ou de mettre de l'argent en pub. Déclencheurs : "pub", "les pubs", "mes hooks", "quelle vidéo faire", "espionne", "ce qui marche chez eux", "Ad Library", "lancer de la pub", "booster", "ma vidéo marche pas", "on paie quoi".
---

# PUB — on ne fabrique que ce qui a déjà gagné ailleurs

**La règle qui passe avant tout :**

> **Pas de pubs gagnantes sous les yeux = pas de création.**
> Un hook écrit sans avoir regardé ce qui vend est une intuition. On n'en
> produit pas.

**Vécu sur SILENCE :** 49 hooks écrits à partir des avis 1 étoile — de bons
mots, mais **aucune vidéo gagnante regardée**. La forme était devinée.
C'est le trou que ce skill bouche.

## Comment tu te comportes

- Court, couleurs (🟢 🟠 🔴 ✅ ❌), zéro jargon — comme partout
- **Un plan avec le coût AVANT chaque recherche qui consomme des crédits**
- Tu ne lances rien de payant sans son oui. Le gratuit, tu le fais.

---

## 🔴 CE QUE ÇA COÛTE — tu le rappelles AVANT chaque lancement

**Dès qu'il dit « on fait des pubs pour tel produit », tu sors ce bloc en
premier**, avant toute recherche :

```
LES VISUELS          80 vidéos × 10 MAD (Higgs Field)       800 MAD
METRICOOL Starter    172 MAD/mois (16 €) × 2 mois             344 MAD
                     (2 vidéos/jour sur 3 réseaux : le gratuit
                      ne suffit pas)
LE SCRAPING          ~65 crédits, pris sur le bonus gratuit      0 MAD
                     si le bonus est vide : le plus petit pack
                     47 $ (≈ 470 MAD), une réserve pour ~100 projets
──────────────────────────────────────────────────────────────────
TOTAL POUR 40 JOURS                                     1 144 MAD
                                                        ≈ 106 €
```

**La pub payante n'est PAS dedans.** Elle ne s'ajoute qu'après le jour 21,
sur une vidéo qui a gagné en gratuit (étape 6).

⚠️ **Tu vérifies les prix au moment du lancement** — Higgs et Metricool
bougent. Un prix vieux de plus de 3 mois se revérifie avant d'être annoncé.

---

## 🔴 LE TABLEAU DE BORD — pas de suivi, pas de lancement

**Aucune vidéo ne sort tant que Claude ne peut pas VOIR ce qui se passe.**
Publier sans pouvoir lire, c'est le seul vrai échec (skill projet, étape 14).

**Ce que Claude doit pouvoir lire seul, sans lui demander :**

```
LES VIDÉOS     Metricool → getAnalyticsDataByMetrics
               vues, rétention 3 s, clics, par vidéo et par réseau
LE SITE        quelle vidéo amène qui : le lien ?v=video12
               mémorisé et joint à la commande
LES VENTES     Stripe, clé en LECTURE SEULE — jamais une clé qui
               peut bouger de l'argent
L'ÉTIQUETTE    le fichier des étiquettes : chaque vidéo, sa source,
               son hook, son format, son début
```

**Pas de rappel automatique — décidé le 05/10.** Claude gère, et
**répond quand il demande** (« ça donne quoi ? », « on en est où les
pubs ? »). À ce moment-là, il lit les 4 sources et répond en 5 lignes :

```
depuis le début   X vidéos sorties · X vues · X clics · X ventes
la meilleure      vidéo 07 · rétention 3 s 62 % · source « pubs concurrentes »
la pire           vidéo 09 · 18 % → à ne pas refaire
le compteur       jour 12 / 40 · 2 ventes · frein : 🟢 / 🟠 / 🔴
à faire           une seule action
```

⚠️ **Claude ne voit rien entre deux conversations.** Les chiffres sont
gardés par Metricool, Stripe et le site : rien ne se perd, tout se lit
d'un coup quand il demande.

**La liste à cocher AVANT la première vidéo :**

```
☐  Metricool branché, les 3 réseaux connectés, Claude lit les chiffres
☐  le site retient la vidéo d'origine ET la joint à la commande
☐  Stripe en lecture seule, Claude voit les ventes
☐  le fichier des étiquettes existe, la vidéo 01 est étiquetée
```

**Une case vide = on ne lance pas.**

---

## LES 6 ÉTAPES

```
1  TROUVER      les pubs qui tournent depuis longtemps     crédits, peu
2  REGARDER     chaque vidéo, seconde par seconde         gratuit (Gemini)
3  CLASSER      format · hook · angle · offre · preuve    gratuit
4  FABRIQUER    le format gagnant, avec NOS mots          Higgs / Remotion
5  TESTER       en gratuit d'abord, avec étiquettes        gratuit (Metricool)
6  PAYER        seulement le gagnant, avec la règle        argent
```

---

## 1 — TROUVER : les pubs qui rapportent

### Le seul signal qui ne ment pas

```
🟢  une pub ACTIVE depuis 30 jours et plus   → elle rapporte, sinon coupée
🟢  la MÊME vidéo en 5, 10, 20 versions      → ils la poussent, elle gagne
🟠  une pub de moins de 7 jours              → un test, ça ne prouve rien
❌  les vues, les likes                       → ça ne dit pas qui achète
```

### Les outils, dans cet ordre

| Ce qu'on cherche | L'outil | Coût |
|---|---|---|
| Les pubs Meta d'une marque | `scrape_reseaux` → `v1_facebook_adLibrary_search_companies` puis `v1_facebook_adLibrary_company_ads` | crédits |
| Les pubs Meta par mot-clé | `v1_facebook_adLibrary_search_ads` (« survêtement », « ensemble homme »…) | crédits |
| Le détail et la vidéo d'une pub | `v1_facebook_adLibrary_ad` | crédits |
| Ce qui est DIT dans la pub | `v1_facebook_adLibrary_ad_transcript` | crédits |
| Les pubs TikTok | `v1_tiktok_ad_library_search` puis `v1_tiktok_ad_library_ad` | crédits |
| Les vidéos organiques qui percent | `v1_tiktok_search_keyword`, `v3_tiktok_profile_videos`, `v2_instagram_user_posts` | crédits |
| Ce qui est dit dans une vidéo TikTok / Insta | `v1_tiktok_video_transcript`, `v2_instagram_media_transcript` | crédits |
| Les commentaires sous leurs pubs | `v1_tiktok_video_comments`, `v2_instagram_post_comments` | crédits |
| Meta en direct *(si branché)* | connecteur `meta_ads` → `ads_library_search` | gratuit |

**Crédits ScrapeCreators :** ~1 par appel, le bonus gratuit en couvre des
milliers. **On vérifie le solde avant** : `v1_account_credit_balance`.

⚠️ **On cherche 5 concurrents qui VENDENT** (avis récents, pubs actives),
pas les plus connus. Une grande marque gagne grâce à son nom — on ne peut
pas copier un nom.

**Ce qui sort de l'étape 1 :** 15 à 25 pubs, chacune avec son lien, sa date
de début, son nombre de versions.

---

## 2 — REGARDER : chaque vidéo, seconde par seconde

**Le texte d'une pub ne suffit pas. On regarde la vidéo.**

L'outil : **Gemini** (clé dans les Identifiants API, jamais ailleurs).
Modèles qui marchent : `gemini-3-flash-preview`, `gemini-flash-latest`,
`gemini-2.5-flash` — on les essaie dans cet ordre, quota gratuit par jour.

```
lien YouTube         → envoyé tel quel (file_data.file_uri)
fichier vidéo (mp4)  → envoyé d'abord à l'API Files de Gemini,
                       puis son file_uri
```

*Alternative :* Higgs Field → `video_analysis_create` (crédits Higgs).

### La consigne donnée à Gemini — toujours la même

```
Découpe cette pub vidéo pour une marque de streetwear.
Réponds en français, format exact :

0-3 s        ce qu'on VOIT · le texte à l'écran mot pour mot · ce qu'on ENTEND
3-10 s       idem
10 s - fin   idem
FORMAT       (visage qui parle / tenue portée dans la rue / réaction /
             avant-après / unboxing / interview de rue / écran vert / autre)
QUI          un créateur, le fondateur, un client, personne
LE HOOK      la phrase ou l'image qui arrête le pouce
L'ANGLE      (prix / qualité / objection / preuve / identité / humour / urgence)
L'OFFRE      prix, promo, lot, livraison — ce qui est promis
LA PREUVE    ce qui rend la promesse crédible
LE SON       musique tendance / voix / silence
DURÉE        en secondes · nombre de coupes
POURQUOI ÇA MARCHE   en 2 lignes
```

---

## 3 — CLASSER : trouver ce qui revient

**Une pub qui gagne = un accident. Le même format chez 3 concurrents = une
règle.**

On remplit un tableau, une ligne par pub :

```
marque · active depuis · versions · format · hook · angle · offre · durée
```

Puis on cherche **ce qui revient** :

```
🟢  le format le plus présent chez ceux qui tournent depuis longtemps
🟢  les 3 hooks qui reviennent, sous des mots différents
🟢  l'offre la plus fréquente (lot ? livraison offerte ? prix ?)
🔴  ce que PERSONNE ne fait → soit une ouverture, soit un piège
```

**Les formats qui ouvrent le mieux de nouveaux clients aujourd'hui :**
**un vrai visage** — créateur, fondateur, client qui parle. Les formats sans
personne (texte seul, montage produit) aident à conclure, rarement à
ouvrir.

📁 Le tableau s'écrit dans `marque/pubs-concurrents.md`. **Les liens
avec.** Sans lien, la pub n'a jamais existé.

---

## 4 — FABRIQUER : leur format, nos mots

```
✅  on copie       le FORMAT, le rythme, la place du prix, la durée
✅  on garde       NOS hooks (avis 1 étoile, ses vidéos enregistrées)
❌  jamais         leurs phrases, leurs images, leur musique, leur nom
```

### La recette d'une vidéo

```
1  un format gagnant (étape 3)
2  un hook prouvé, ou tiré de NOS sources
3  le moule (skill projet, étape 9) : même cadrage, même signature
4  5 DÉBUTS différents sur le même corps de vidéo
   → c'est le début qui décide, pas le reste
```

### Les outils

| Pour | L'outil |
|---|---|
| Vidéo générée, mannequin, décor | Higgs Field (`generate_video`, `generate_image`) — **plan + coût avant** |
| Le moule, le texte à l'écran, en série | Remotion, dossier `video/` du projet |
| Juger une vidéo avant de la publier | Higgs `virality_predictor` — un avis, pas une vérité |

🔴 **Vraie personne > personne générée.** Un visage généré qui se fait
passer pour un client ou le fondateur = mensonge (skill projet, étape 10).

🔴 **Chaque promesse de la vidéo doit se voir sur le site** (skill projet,
étape 7) — sinon on achète des clics qui repartent.

---

## 5 — TESTER : en gratuit d'abord

**Le gratuit sert de banc d'essai pour le payant.** Une vidéo qui tient en
organique sera la meilleure pub.

```
publication         Metricool → createScheduledPost
                    (autoPublish:false = rappel sur le téléphone,
                     il choisit la musique dans l'appli)
les chiffres        Metricool → getAnalyticsDataByMetrics
```

### Chaque vidéo porte son étiquette AVANT de sortir

```
vidéo 07 · format « visage qui parle » · hook n°12 · source « pub X » · début B
```

### Les sources : parts égales, puis le gagnant prend plus

```
JOURS 1-20     5 sources × 8 vidéos, parts ÉGALES
               (lui + toi · ses vidéos enregistrées · pubs concurrentes ·
                vidéos qui percent · avis 1 étoile)
JOUR 21        on classe par la MOYENNE de rétention 3 s de chaque source
JOURS 21-40    1ʳᵉ 50 % · 2ᵉ 30 % · les autres 20 %, jamais zéro
```

🔴 **Une seule question par vague :** vague 1 = la source et l'angle
(moule et sous-titre fixes) · vague 2 = le sous-titre. 40 vidéos ne
tranchent qu'un GROS écart.

🟠 **Jamais juger une source sur sa meilleure vidéo** — un coup de chance
ne fait pas une source gagnante.

### Comment on lit

```
la rétention à 3 s     juge le DÉBUT       ← le chiffre roi
le taux de clic        juge la PROMESSE
les ventes             jugent le SITE et le PRIX
```

⚠️ **On ne juge pas une vidéo sous ~1 000 vues.** Avant, c'est du bruit.

---

## 6 — PAYER : seulement le gagnant, avec la règle

### La règle qui empêche de brûler l'argent

> **Ce qu'une vente coûte en pub ne dépasse JAMAIS ce qu'elle rapporte.**

```
la marge d'une vente (après tout : produit, livraison, Stripe, TVA,
agent)                                                    = M
le coût max d'une vente en pub                            = M × 0,7
```

*Exemple SILENCE (estimation) : ~16 € de marge → max ~11 € de pub par
vente. C'est serré — d'où l'intérêt de vendre des LOTS.*

### Garder, couper, pousser

```
après ~1 000 affichages       la rétention 3 s est sous ses vidéos
                              organiques → on COUPE
après le coût de 2 ventes     zéro vente → on COUPE
une vente sous le coût max,   → on GARDE, et on fabrique 5 nouveaux
3 jours de suite                débuts sur la même vidéo
au-dessus du coût max         → on coupe, même si « ça clique »
```

**On concentre :** un petit budget sur UNE vidéo gagnante pendant 2
semaines, pas éparpillé sur 10.

**TikTok :** on booste la vidéo organique gagnante elle-même (elle garde
ses vues et ses commentaires). **Meta :** même principe, la publication
qui a déjà gagné.

---

## LE RYTHME

```
chaque mois    étape 1 à 3 refaites → les pubs gagnantes changent vite
chaque semaine 5 nouveaux débuts sur la vidéo qui gagne
chaque jour    rien à inventer : on publie ce qui est prêt
```

**Les sources qui se rechargent** (ses vidéos enregistrées, les avis, les
commentaires sous leurs pubs) **valent plus que tout le reste** : il en
arrive tous les mois, gratuitement.

---

## Les liens avec les autres skills

```
projet         étapes 7 à 9 (angles, sources, moule) · 12 à 15 (diffusion)
site-legal     aucune promesse dans une pub qu'on ne peut pas prouver
ad-creative    les formats détaillés et les textes de pub, plateforme par
               plateforme
```
