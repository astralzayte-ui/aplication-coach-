/* =========================================================
   accueil.js — Remplit les parties dynamiques de l'accueil
   ========================================================= */

// Prix de la pièce phare, affiché sur la photo du héro (lu dans les données, jamais écrit en dur).
document.getElementById('hero-prix').textContent = formaterPrix(trouverProduit('atlas-automatique').prix);

// Liens WhatsApp de l'accueil.
document.getElementById('hero-whatsapp').href =
  lienWhatsApp('Bonjour ' + CONFIG.nomBoutique + ', je cherche une montre et j\'aimerais un conseil.');
const ctaWhatsApp = document.getElementById('cta-whatsapp');
ctaWhatsApp.href = lienWhatsApp('Bonjour ' + CONFIG.nomBoutique + ', j\'aimerais être conseillé(e) pour choisir une montre.');
ctaWhatsApp.innerHTML = ICONES.whatsapp + 'Écrire sur WhatsApp';

// Nouveautés : d'abord les produits marqués "nouveaute", complétés par les autres pour en avoir 4.
const nouveautes = PRODUITS.filter(function (p) { return p.nouveaute; })
  .concat(PRODUITS.filter(function (p) { return !p.nouveaute; }))
  .slice(0, 4);
document.getElementById('nouveautes').innerHTML = nouveautes.map(carteProduit).join('');

// Cartes des collections. Chaque carte mène au catalogue déjà filtré (?collection=…).
const collections = [
  { cle: 'heritage', texte: 'Des classiques intemporels, pensés pour traverser les générations.', vitrine: 'tensift-chrono' },
  { cle: 'sport', texte: 'Des chronographes et montres de pilote robustes, pour l\'aventure.', vitrine: 'koutoubia-chrono' },
  { cle: 'elegance', texte: 'Des lignes sobres pour le bureau et les grandes occasions.', vitrine: 'agdal-automatique' }
];
document.getElementById('collections').innerHTML = collections.map(function (c) {
  const nombre = PRODUITS.filter(function (p) { return p.collection === c.cle; }).length;
  return '<a class="carte-collection-lien" href="catalogue.html?collection=' + c.cle + '">' +
    visuelProduit(trouverProduit(c.vitrine), true, '(max-width: 799px) 100vw, 33vw') +
    '<h3>' + LIBELLES.collection[c.cle] + '</h3>' +
    '<p>' + c.texte + '</p>' +
    '<span class="fleche">' + nombre + ' modèles →</span>' +
  '</a>';
}).join('');

// Avis clients (fictifs). Stockés dans un tableau pour ne pas répéter le HTML.
const avis = [
  { nom: 'Youssef B.', ville: 'Casablanca', montre: 'Atlas Automatique', texte: 'Montre magnifique, encore plus belle en vrai. Livrée en 48 h dans un très bel écrin. Le conseil sur WhatsApp a fait la différence.' },
  { nom: 'Salma E.', ville: 'Rabat', montre: 'Tensift Chrono', texte: 'Offerte à mon mari pour notre anniversaire : il ne la quitte plus. Le cadran panda est superbe en vrai.' },
  { nom: 'Karim A.', ville: 'Marrakech', montre: 'Médina Classique', texte: 'Je suis passé à la boutique pour ajuster le bracelet, service impeccable et gratuit. Je recommande.' }
];
const cinqEtoiles = '<div class="avis-etoiles" aria-label="5 étoiles sur 5">' + ICONES.etoile.repeat(5) + '</div>';
document.getElementById('avis').innerHTML = avis.map(function (a) {
  return '<figure class="avis">' + cinqEtoiles +
    '<blockquote>« ' + a.texte + ' »</blockquote>' +
    '<figcaption><strong>' + a.nom + '</strong> · ' + a.ville + ' · ' + a.montre + '</figcaption>' +
  '</figure>';
}).join('');
