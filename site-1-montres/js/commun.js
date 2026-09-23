/* =========================================================
   commun.js — Code partagé par toutes les pages
   ---------------------------------------------------------
   - petites fonctions utiles (prix, sécurité, WhatsApp)
   - en-tête et pied de page, générés ici une seule fois
     au lieu d'être copiés-collés dans chaque fichier HTML
   - carte produit réutilisée sur l'accueil, le catalogue
     et la fiche produit
   - notifications "toast" et bouton WhatsApp flottant
   ========================================================= */

/* ---------- 1. Fonctions utilitaires ---------- */

// Sécurité : transforme les caractères spéciaux HTML en texte inoffensif.
// Indispensable avant d'insérer un texte saisi par l'utilisateur avec innerHTML
// (sinon quelqu'un pourrait injecter du code : c'est une faille "XSS").
function echapperHTML(texte) {
  return String(texte)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// 4890 → "4 890 DH" (espace des milliers à la française).
function formaterPrix(montant) {
  return new Intl.NumberFormat('fr-FR').format(montant) + ' ' + CONFIG.devise;
}

// Construit un lien WhatsApp avec un message déjà rédigé.
// encodeURIComponent transforme les espaces, accents, retours à la ligne
// en caractères acceptés dans une URL.
function lienWhatsApp(message) {
  return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(message);
}

// Message pré-rempli pour commander un produit précis.
function messageProduit(produit, quantite) {
  return 'Bonjour ' + CONFIG.nomBoutique + ', je souhaite commander :\n' +
    '• ' + produit.nom + ' (réf. ' + produit.ref + ') × ' + (quantite || 1) + '\n' +
    'Prix : ' + formaterPrix(produit.prix * (quantite || 1)) + '\n' +
    'Pouvez-vous me confirmer la disponibilité ?';
}

// Message pré-rempli pour tout le panier.
function messagePanier() {
  const d = detailPanier();
  let texte = 'Bonjour ' + CONFIG.nomBoutique + ', je souhaite commander :\n';
  d.lignes.forEach(function (l) {
    texte += '• ' + l.produit.nom + ' (réf. ' + l.produit.ref + ') × ' + l.quantite + ' = ' + formaterPrix(l.total) + '\n';
  });
  texte += 'Total : ' + formaterPrix(d.total);
  return texte;
}

// Enlève les accents et met en minuscules : "Médina" → "medina".
// Permet une recherche qui ne tient pas compte des accents.
function normaliser(texte) {
  return texte.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/* ---------- 2. Icônes (SVG en ligne, aucune librairie) ---------- */

const ICONES = {
  panier: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1 13H7L6 7z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 7a3 3 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  fermer: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2L9 8.5z" fill="currentColor"/></svg>',
  etoile: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/></svg>'
};

/* ---------- 3. En-tête et pied de page ---------- */

function afficherEntete() {
  const page = document.body.dataset.page;   // lu depuis <body data-page="...">
  const liens = [
    { url: 'index.html', texte: 'Accueil', cle: 'accueil' },
    { url: 'catalogue.html', texte: 'Collection', cle: 'catalogue' },
    { url: 'index.html#maison', texte: 'La maison', cle: 'maison' },
    { url: 'index.html#faq', texte: 'FAQ', cle: 'faq' }
  ];

  const nav = liens.map(function (l) {
    const actif = l.cle === page ? ' aria-current="page"' : '';
    return '<li><a href="' + l.url + '"' + actif + '>' + l.texte + '</a></li>';
  }).join('');

  document.getElementById('entete').innerHTML =
    '<div class="conteneur entete-interieur">' +
      '<button class="bouton-icone bouton-menu" id="bouton-menu" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="navigation">' + ICONES.menu + '</button>' +
      '<a href="index.html" class="logo" aria-label="' + CONFIG.nomBoutique + ' — accueil">' + logoSVG() + '</a>' +
      '<nav id="navigation" class="navigation" aria-label="Navigation principale"><ul>' + nav + '</ul></nav>' +
      '<a href="panier.html" class="bouton-icone lien-panier" aria-label="Voir le panier">' + ICONES.panier +
        '<span class="badge-panier" id="badge-panier" hidden>0</span></a>' +
    '</div>';

  // Menu mobile : on ouvre/ferme en ajoutant une classe CSS,
  // et on met à jour aria-expanded pour les lecteurs d'écran.
  const bouton = document.getElementById('bouton-menu');
  const navigation = document.getElementById('navigation');
  bouton.addEventListener('click', function () {
    const ouvert = navigation.classList.toggle('ouvert');
    bouton.setAttribute('aria-expanded', ouvert);
    bouton.setAttribute('aria-label', ouvert ? 'Fermer le menu' : 'Ouvrir le menu');
    bouton.innerHTML = ouvert ? ICONES.fermer : ICONES.menu;
  });
  // On referme le menu quand on clique sur un lien (utile pour les ancres #maison, #faq).
  navigation.addEventListener('click', function (e) {
    if (e.target.closest('a') && navigation.classList.contains('ouvert')) bouton.click();
  });
}

// Le logo : un monogramme "A" dans un cercle + le nom, en SVG.
function logoSVG() {
  return '<svg class="logo-svg" viewBox="0 0 150 36" aria-hidden="true">' +
    '<circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" stroke-width="1"/>' +
    '<path d="M11 26l7-17 7 17M13.8 20h8.4" fill="none" stroke="currentColor" stroke-width="1.3"/>' +
    '<text x="44" y="24.5" font-family="Cormorant Garamond, serif" font-size="20" letter-spacing="6" fill="currentColor">' + CONFIG.nomBoutique.toUpperCase() + '</text>' +
  '</svg>';
}

function afficherPied() {
  const annee = new Date().getFullYear();
  document.getElementById('pied').innerHTML =
    '<div class="conteneur pied-grille">' +
      '<div>' +
        '<a href="index.html" class="logo">' + logoSVG() + '</a>' +
        '<p class="texte-doux">' + CONFIG.slogan + '.<br>Montres automatiques et chronographes.</p>' +
      '</div>' +
      '<div><h2 class="pied-titre">Boutique</h2><ul class="pied-liens">' +
        '<li><a href="catalogue.html">Toute la collection</a></li>' +
        '<li><a href="catalogue.html?q=chrono">Chronographes</a></li>' +
        '<li><a href="catalogue.html?matiereBracelet=cuir">Bracelets cuir</a></li>' +
        '<li><a href="panier.html">Mon panier</a></li>' +
      '</ul></div>' +
      '<div><h2 class="pied-titre">Aide</h2><ul class="pied-liens">' +
        '<li><a href="index.html#faq">Questions fréquentes</a></li>' +
        '<li><a href="index.html#engagements">Livraison & garantie</a></li>' +
        '<li><a href="mentions-legales.html">Mentions légales & CGV</a></li>' +
      '</ul></div>' +
      '<div><h2 class="pied-titre">Contact</h2><ul class="pied-liens">' +
        '<li>Guéliz, Marrakech</li>' +
        '<li><a href="' + lienWhatsApp('Bonjour ' + CONFIG.nomBoutique + ', j\'ai une question.') + '" target="_blank" rel="noopener">WhatsApp</a></li>' +
        '<li>Lun – Sam · 10h – 20h</li>' +
      '</ul></div>' +
    '</div>' +
    '<div class="conteneur pied-bas">' +
      '<p>© ' + annee + ' ' + CONFIG.nomBoutique + '. Projet de portfolio : produits et paiement fictifs.</p>' +
    '</div>';
}

// Met à jour la pastille avec le nombre d'articles sur l'icône panier.
function mettreAJourBadgePanier() {
  const badge = document.getElementById('badge-panier');
  if (!badge) return;
  const n = nombreArticles();
  badge.textContent = n;
  badge.hidden = n === 0;
}

/* ---------- 4. Composants réutilisables ---------- */

// Carte produit : utilisée sur l'accueil, le catalogue et "Vous aimerez aussi".
function carteProduit(p) {
  const promo = p.ancienPrix ? '<span class="etiquette etiquette-promo">−' + Math.round((1 - p.prix / p.ancienPrix) * 100) + ' %</span>' : '';
  const nouveau = p.nouveaute ? '<span class="etiquette">Nouveauté</span>' : '';
  return '<article class="carte-produit">' +
    '<a href="produit.html?id=' + p.id + '" class="carte-lien">' +
      '<div class="carte-visuel">' + nouveau + promo + visuelProduit(p, true) + '</div>' +
      '<p class="carte-collection">' + LIBELLES.collection[p.collection] + ' · ' + LIBELLES.mouvement[p.mouvement] + '</p>' +
      '<h3 class="carte-nom">' + echapperHTML(p.nom) + '</h3>' +
      '<p class="carte-prix">' + formaterPrix(p.prix) +
        (p.ancienPrix ? ' <s>' + formaterPrix(p.ancienPrix) + '</s>' : '') + '</p>' +
    '</a>' +
    '<div class="carte-actions">' +
      '<button class="btn btn-or btn-petit" data-ajouter="' + p.id + '">Ajouter<span class="texte-long"> au panier</span></button>' +
      '<a class="btn btn-whatsapp btn-petit" href="' + lienWhatsApp(messageProduit(p, 1)) + '" target="_blank" rel="noopener" aria-label="Commander ' + echapperHTML(p.nom) + ' sur WhatsApp">' + ICONES.whatsapp + '<span>WhatsApp</span></a>' +
    '</div>' +
  '</article>';
}

// Petite notification en bas de l'écran, qui disparaît seule.
let minuteurToast;
function afficherToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.setAttribute('role', 'status');      // lu par les lecteurs d'écran
    document.body.appendChild(toast);
  }
  toast.innerHTML = message;
  toast.classList.add('visible');
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(function () { toast.classList.remove('visible'); }, 2800);
}

function afficherBoutonWhatsAppFlottant() {
  const a = document.createElement('a');
  a.className = 'whatsapp-flottant';
  a.href = lienWhatsApp('Bonjour ' + CONFIG.nomBoutique + ', je souhaite un conseil pour choisir une montre.');
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Nous écrire sur WhatsApp');
  a.innerHTML = ICONES.whatsapp;
  document.body.appendChild(a);
}

/* ---------- 5. Démarrage ---------- */

// "Délégation d'événement" : un seul écouteur sur toute la page gère
// tous les boutons "Ajouter", même ceux créés plus tard par JavaScript.
document.addEventListener('click', function (e) {
  const bouton = e.target.closest('[data-ajouter]');
  if (!bouton) return;
  const produit = trouverProduit(bouton.dataset.ajouter);
  ajouterAuPanier(produit.id, 1);
  afficherToast('<strong>' + echapperHTML(produit.nom) + '</strong> ajoutée au panier · <a href="panier.html">Voir le panier</a>');
});

window.addEventListener('panier:change', mettreAJourBadgePanier);

// Les scripts sont chargés en bas de page : le HTML existe déjà, on peut démarrer.
afficherEntete();
afficherPied();
afficherBoutonWhatsAppFlottant();
mettreAJourBadgePanier();
