/* =========================================================
   montre-svg.js — Dessine une montre en SVG
   ---------------------------------------------------------
   Le SVG est un format d'image "vectoriel" : l'image est
   décrite par du code (cercles, lignes, rectangles…).
   Avantages : aucune photo à télécharger, net sur tous les
   écrans, et on peut changer les couleurs par programme.

   Rôle ici : solution de secours. Chaque montre a une photo ;
   si une photo manque (produit.photo vide), la fonction
   dessinerMontre dessine la montre à partir de ses couleurs.
   visuelProduit() choisit automatiquement l'une ou l'autre.
   ========================================================= */

// Compteur pour donner un identifiant unique à chaque dégradé SVG.
// Sans ça, deux montres sur la même page partageraient le même dégradé.
let compteurSvg = 0;

// Éclaircit (pourcentage > 0) ou assombrit (pourcentage < 0) une couleur hexadécimale.
// Exemple : nuancer('#c9a45c', 30) → un doré plus clair.
function nuancer(hex, pourcentage) {
  const n = parseInt(hex.slice(1), 16);
  const cible = pourcentage < 0 ? 0 : 255;       // vers le noir ou vers le blanc
  const p = Math.abs(pourcentage) / 100;
  // On sépare les composantes rouge, vert, bleu avec des opérations binaires.
  const r = Math.round((n >> 16) + (cible - (n >> 16)) * p);
  const v = Math.round(((n >> 8) & 255) + (cible - ((n >> 8) & 255)) * p);
  const b = Math.round((n & 255) + (cible - (n & 255)) * p);
  return '#' + ((1 << 24) + (r << 16) + (v << 8) + b).toString(16).slice(1);
}

// Calcule un point sur un cercle (utile pour placer les index des heures).
// angle en degrés, 0 = midi, sens des aiguilles d'une montre.
function pointSurCercle(cx, cy, rayon, angle) {
  const rad = (angle * Math.PI) / 180;
  return { x: cx + rayon * Math.sin(rad), y: cy - rayon * Math.cos(rad) };
}

// Dessine le bracelet (partie haute et basse) selon sa matière.
function dessinerBracelet(c, type, id) {
  const clair = nuancer(c.bracelet, 18);
  const fonce = nuancer(c.bracelet, -25);
  let svg =
    '<linearGradient id="' + id + '-br" x1="0" x2="1">' +
      '<stop offset="0" stop-color="' + fonce + '"/>' +
      '<stop offset=".5" stop-color="' + clair + '"/>' +
      '<stop offset="1" stop-color="' + fonce + '"/>' +
    '</linearGradient>' +
    '<rect x="68" y="0" width="64" height="86" rx="10" fill="url(#' + id + '-br)"/>' +
    '<rect x="68" y="194" width="64" height="86" rx="10" fill="url(#' + id + '-br)"/>';

  if (type === 'cuir') {
    // Surpiqûres : une ligne en pointillés le long du bracelet.
    const couture = nuancer(c.bracelet, 40);
    svg +=
      '<rect x="74" y="4" width="52" height="78" rx="7" fill="none" stroke="' + couture + '" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>' +
      '<rect x="74" y="198" width="52" height="78" rx="7" fill="none" stroke="' + couture + '" stroke-width="1" stroke-dasharray="3 3" opacity=".6"/>';
  } else if (type === 'metal') {
    // Maillons : des lignes horizontales régulières.
    for (let y = 10; y < 86; y += 12) {
      svg += '<line x1="68" x2="132" y1="' + y + '" y2="' + y + '" stroke="' + fonce + '" stroke-width="1.2"/>';
      svg += '<line x1="68" x2="132" y1="' + (y + 194) + '" y2="' + (y + 194) + '" stroke="' + fonce + '" stroke-width="1.2"/>';
    }
    svg += '<line x1="88" x2="88" y1="0" y2="86" stroke="' + fonce + '"/><line x1="112" x2="112" y1="0" y2="86" stroke="' + fonce + '"/>';
    svg += '<line x1="88" x2="88" y1="194" y2="280" stroke="' + fonce + '"/><line x1="112" x2="112" y1="194" y2="280" stroke="' + fonce + '"/>';
  } else if (type === 'toile') {
    // Toile : une bande centrale plus claire.
    svg +=
      '<rect x="92" y="0" width="16" height="86" fill="' + clair + '" opacity=".35"/>' +
      '<rect x="92" y="194" width="16" height="86" fill="' + clair + '" opacity=".35"/>';
  } else if (type === 'caoutchouc') {
    // Caoutchouc : des rainures arrondies.
    for (let y = 16; y < 80; y += 16) {
      svg += '<rect x="80" y="' + y + '" width="40" height="5" rx="2.5" fill="' + fonce + '"/>';
      svg += '<rect x="80" y="' + (y + 194) + '" width="40" height="5" rx="2.5" fill="' + fonce + '"/>';
    }
  }
  return svg;
}

// Fonction principale : renvoie le code SVG complet d'une montre.
function dessinerMontre(produit) {
  const c = produit.couleurs;
  const id = 'montre' + (++compteurSvg);
  const cx = 100, cy = 140;                 // centre du cadran
  const carree = produit.forme === 'carree';

  let svg =
    '<svg class="montre-svg" viewBox="0 0 200 280" role="img" aria-label="Montre ' + echapperHTML(produit.nom) + '">' +
    '<defs>' +
      // Dégradé du boîtier : donne un effet métal poli.
      '<linearGradient id="' + id + '-bt" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="' + nuancer(c.boitier, 35) + '"/>' +
        '<stop offset=".5" stop-color="' + c.boitier + '"/>' +
        '<stop offset="1" stop-color="' + nuancer(c.boitier, -35) + '"/>' +
      '</linearGradient>' +
      // Dégradé du cadran : plus clair au centre, comme un cadran soleillé.
      '<radialGradient id="' + id + '-cd" cx=".45" cy=".4" r=".7">' +
        '<stop offset="0" stop-color="' + nuancer(c.cadran, 14) + '"/>' +
        '<stop offset=".6" stop-color="' + c.cadran + '"/>' +
        '<stop offset="1" stop-color="' + nuancer(c.cadran, -28) + '"/>' +
      '</radialGradient>' +
    '</defs>';

  // 1) Bracelet (dessiné en premier : il passe "sous" le boîtier).
  svg += dessinerBracelet(c, produit.braceletType, id);

  // 2) Couronne (le petit bouton sur le côté pour régler l'heure).
  svg += '<rect x="' + (carree ? 170 : 176) + '" y="130" width="12" height="20" rx="3" fill="url(#' + id + '-bt)"/>';

  // 3) Boîtier + cadran : rond ou carré.
  if (carree) {
    svg += '<rect x="30" y="70" width="140" height="140" rx="26" fill="url(#' + id + '-bt)"/>';
    svg += '<rect x="42" y="82" width="116" height="116" rx="18" fill="url(#' + id + '-cd)"/>';
  } else {
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="80" fill="url(#' + id + '-bt)"/>';
    svg += '<circle cx="' + cx + '" cy="' + cy + '" r="70" fill="url(#' + id + '-cd)"/>';
  }

  // 4) Index des heures : 12 traits, plus longs à 12h, 3h, 6h et 9h.
  for (let h = 0; h < 12; h++) {
    const principal = h % 3 === 0;
    const debut = pointSurCercle(cx, cy, principal ? 48 : 53, h * 30);
    const fin = pointSurCercle(cx, cy, 60, h * 30);
    svg += '<line x1="' + debut.x.toFixed(1) + '" y1="' + debut.y.toFixed(1) +
           '" x2="' + fin.x.toFixed(1) + '" y2="' + fin.y.toFixed(1) +
           '" stroke="' + c.aiguilles + '" stroke-width="' + (principal ? 3.2 : 1.6) + '" stroke-linecap="round"/>';
  }

  // 5) Compteurs de chronographe (petits cadrans) si besoin.
  if (produit.chrono) {
    [[78, 150], [122, 150]].forEach(function (pos) {
      svg += '<circle cx="' + pos[0] + '" cy="' + pos[1] + '" r="13" fill="' + nuancer(c.cadran, c.cadran === '#f1f1ee' ? -85 : 10) + '" stroke="' + c.aiguilles + '" stroke-width=".8" opacity=".9"/>';
      svg += '<line x1="' + pos[0] + '" y1="' + pos[1] + '" x2="' + pos[0] + '" y2="' + (pos[1] - 9) + '" stroke="' + c.trotteuse + '" stroke-width="1.4" transform="rotate(40 ' + pos[0] + ' ' + pos[1] + ')"/>';
    });
  }

  // 6) Nom de la marque sur le cadran.
  svg += '<text x="' + cx + '" y="' + (cy - 22) + '" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="11" letter-spacing="3" fill="' + c.aiguilles + '" opacity=".85">' + CONFIG.nomBoutique.toUpperCase() + '</text>';

  // 7) Aiguilles, bloquées sur 10h10 (la pose classique des photos de montres).
  //    Une ligne verticale qu'on fait pivoter avec transform="rotate(angle cx cy)".
  svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy - 30) + '" stroke="' + c.aiguilles + '" stroke-width="4.5" stroke-linecap="round" transform="rotate(-55 ' + cx + ' ' + cy + ')"/>';
  svg += '<line x1="' + cx + '" y1="' + cy + '" x2="' + cx + '" y2="' + (cy - 46) + '" stroke="' + c.aiguilles + '" stroke-width="3" stroke-linecap="round" transform="rotate(60 ' + cx + ' ' + cy + ')"/>';
  svg += '<line x1="' + cx + '" y1="' + (cy + 12) + '" x2="' + cx + '" y2="' + (cy - 54) + '" stroke="' + c.trotteuse + '" stroke-width="1.2" stroke-linecap="round" transform="rotate(200 ' + cx + ' ' + cy + ')"/>';
  svg += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="' + c.trotteuse + '"/>';

  // 8) Reflet sur le verre : une ellipse blanche très transparente.
  svg += '<ellipse cx="78" cy="108" rx="42" ry="22" fill="#fff" opacity=".06" transform="rotate(-30 78 108)"/>';

  svg += '</svg>';
  return svg;
}

// Choisit ce qu'on affiche pour un produit : la vraie photo si elle existe,
// sinon le dessin SVG. Le reste du site n'a pas besoin de savoir lequel.
// "tailles" indique au navigateur la largeur d'affichage de l'image, pour qu'il
// choisisse lui-même le bon fichier (voir srcset ci-dessous).
const TAILLES_CARTE = '(max-width: 699px) 50vw, (max-width: 1099px) 33vw, 25vw';
function visuelProduit(produit, chargementDiffere, tailles) {
  if (produit.photo) {
    // srcset : deux versions de la même photo (480 px et grande taille).
    //   Un téléphone qui affiche 2 cartes par ligne charge la petite (~2 fois plus légère).
    // loading="lazy" : l'image ne se charge que lorsqu'elle approche de l'écran.
    // object-position : garde la montre au centre du recadrage.
    const petite = produit.photo.replace('.webp', '-480.webp');
    return '<img src="' + produit.photo + '" srcset="' + petite + ' 480w, ' + produit.photo + ' 736w"' +
           ' sizes="' + (tailles || TAILLES_CARTE) + '"' +
           ' alt="Montre ' + echapperHTML(produit.nom) + ' portée au poignet"' +
           (chargementDiffere ? ' loading="lazy"' : ' fetchpriority="high"') +
           ' decoding="async" style="object-position:' + (produit.cadrage || '50% 50%') + '">';
  }
  return dessinerMontre(produit);
}
