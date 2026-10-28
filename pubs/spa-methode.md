# Pubs pour un spa — exemples et méthode

## Les 5 pubs d'exemple (à envoyer aux prospects)

Pubs vidéo de spas en France, toujours actives au 28/10/2026. Une pub qui tourne depuis plus de 30 jours rapporte, sinon le spa l'aurait coupée.
Vidéos téléchargées dans `video/public/ads/spa/` (hors git).

| Spa | Active depuis | Personnes touchées (UE) | Format | Accroche / angle | Lien |
|---|---|---|---|---|---|
| Rien Que Nous, loft-spa privatif | 266 jours | 688 000 | Visite du lieu, lumières, jacuzzi, ambiance romantique | « Des moments à deux, hors du temps » : le couple, la surprise | https://www.facebook.com/ads/library/?id=1596550434796160 |
| Arboressence Spa | 348 jours | 174 000 | Images tournées sur place : accueil, sauna, massage, produits | « Un havre de paix où authenticité et luxe se rejoignent » | https://www.facebook.com/ads/library/?id=849400997773944 |
| Eliospa (Mallemort) | 118 jours, 3 versions | 160 000 | Vidéo verticale, texte à l'écran, lieu → massage → soin visage → accueil | « Et si vous faisiez une pause ? » + réservation sur le site | https://www.facebook.com/ads/library/?id=1794992671492522 |
| Spa Clēmēns (Paris) | 148 jours | 64 000 | Voix off + sous-titres, arrivée au spa → peignoir → massage flottant | La carte cadeau, une expérience unique seul ou en duo | https://www.facebook.com/ads/library/?id=2044319919527458 |
| Les Bains d'Agnia (hammam, 92) | 56 jours, relancée 3 fois depuis mai | 9 000 | « Une journée chez nous » : hammam, soins, détente entre femmes | « Plus qu'un spa, une expérience » + réservation Planity | https://www.facebook.com/ads/library/?id=1515623233665581 |

Ce qui revient : de vraies images du lieu (pas de visage qui parle), une ambiance avant les soins, le lien de réservation en fin, et souvent le cadeau ou le duo.

## Quand on a un client spa : la méthode

1. **Ses vraies photos et vidéos** : fiche Google (Apify `compass/crawler-google-places`, `maxImages: 60`), son site, son Instagram. On écarte les photos d'une autre enseigne ou avec des personnes reconnaissables. On lui demande des vidéos tournées sur place : c'est ce que font les pubs qui marchent.
2. **40 pubs concurrentes** :
   - Bibliothèque Meta : Apify `curious_coder/facebook-ads-library-scraper`, `scrapeAdDetails: true`, `maxItems` au moins 10, URL de recherche `active_status=active`, `media_type=video`, pays du client, mots-clés « spa massage », « hammam », « institut spa », sa ville. On garde les pubs actives depuis 30 jours ou plus, classées par personnes touchées (`aaa_info.eu_total_reach`, donnée disponible seulement dans l'UE).
   - TikTok et Instagram : Apify `clockworks/tiktok-scraper` (`searchQueries` + `searchSection: "/video"`), puis on télécharge les meilleures (`postURLs` + `shouldDownloadVideos`).
   - Pour chaque pub : lien, durée de diffusion, nombre de versions, format, accroche, angle, offre. Tableau dans `clients/<spa>/pubs-concurrents.md` (dossier client, pas dans ce dépôt public si le nom du client y figure).
3. **Les formats qui reviennent** chez 3 concurrents ou plus deviennent notre règle. On copie le format, le rythme et la durée, jamais leurs phrases, leurs images ou leur musique.
4. **Fabriquer** :
   - Motion design (Remotion) : `video/src/Spa.tsx`, une entrée par pub dans `video/src/spa.ts`. Voix, minutage et musique : `python3 spa.py`. Voir la pub Les Bains d'Andalous.
   - Vidéos à partir de ses photos : Higgsfield (Kling, environ 7,5 crédits pour 5 s), toujours avec un plan et le coût annoncés avant.
   - 5 accroches différentes sur le même corps de vidéo : c'est le début qui décide.
5. **Montrer au client** avant de publier. Aucune promesse qu'on ne peut pas prouver (note Google, avis, horaires : uniquement les vrais).
