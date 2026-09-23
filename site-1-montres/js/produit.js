/* =========================================================
   produit.js — Fiche d'une montre
   ---------------------------------------------------------
   Une seule page HTML sert pour toutes les montres : on lit
   l'identifiant dans l'URL (produit.html?id=tichka-pilote),
   on retrouve la montre dans PRODUITS et on génère la page.
   C'est le même principe qu'un site avec base de données.
   ========================================================= */

const params = new URLSearchParams(window.location.search);
const produit = trouverProduit(params.get('id'));
const elFiche = document.getElementById('fiche');
let quantite = 1;

if (!produit) {
  // Identifiant absent ou inconnu : on affiche un message clair au lieu d'une page cassée.
  elFiche.innerHTML =
    '<div class="etat-vide" style="margin:60px 0">' +
      '<h1 style="font-size:2rem">Cette montre est introuvable</h1>' +
      '<p class="texte-doux">Elle a peut-être quitté notre collection.</p>' +
      '<a class="btn btn-or" href="catalogue.html">Voir la collection</a>' +
    '</div>';
} else {
  afficherFiche();
  afficherSuggestions();
}

function afficherFiche() {
  // Titre de l'onglet et description pour Google, propres à chaque montre.
  document.title = produit.nom + ' — ' + formaterPrix(produit.prix) + ' | ' + CONFIG.nomBoutique;
  document.querySelector('meta[name="description"]').setAttribute('content',
    produit.nom + ' : ' + produit.description.slice(0, 140) + '…');

  const stockFaible = produit.stock <= 3;
  const promo = produit.ancienPrix ? ' <s>' + formaterPrix(produit.ancienPrix) + '</s>' : '';

  elFiche.innerHTML =
    '<nav class="fil-ariane" aria-label="Fil d\'Ariane">' +
      '<a href="index.html">Accueil</a><span>/</span>' +
      '<a href="catalogue.html">Collection</a><span>/</span>' + echapperHTML(produit.nom) +
    '</nav>' +
    '<article class="fiche">' +
      '<div class="fiche-visuel">' +
        (produit.nouveaute ? '<span class="etiquette">Nouveauté</span>' : '') +
        visuelProduit(produit, false) +
      '</div>' +
      '<div class="fiche-infos">' +
        '<p class="surtitre">Collection ' + LIBELLES.collection[produit.collection] + '</p>' +
        '<h1>' + echapperHTML(produit.nom) + '</h1>' +
        '<span class="fiche-ref">Réf. ' + produit.ref + ' · ' + LIBELLES.genre[produit.genre] + '</span>' +
        '<p class="fiche-prix">' + formaterPrix(produit.prix) + promo + '</p>' +
        '<p class="fiche-description">' + echapperHTML(produit.description) + '</p>' +
        '<p class="stock' + (stockFaible ? ' stock-faible' : '') + '">' +
          (stockFaible ? 'Plus que ' + produit.stock + ' en stock' : 'En stock · expédiée sous 24 h') +
        '</p>' +

        '<div class="fiche-achat">' +
          '<div class="quantite" role="group" aria-label="Quantité">' +
            '<button type="button" id="moins" aria-label="Diminuer la quantité">−</button>' +
            '<output id="valeur-quantite" aria-live="polite">1</output>' +
            '<button type="button" id="plus" aria-label="Augmenter la quantité">+</button>' +
          '</div>' +
          '<button class="btn btn-or" type="button" id="ajouter">Ajouter au panier</button>' +
          '<a class="btn btn-whatsapp" id="whatsapp" target="_blank" rel="noopener">' + ICONES.whatsapp + 'Commander sur WhatsApp</a>' +
        '</div>' +

        '<div class="rassurance">' +
          '<span>Livraison offerte partout au Maroc</span>' +
          '<span>Paiement par carte ou à la livraison</span>' +
          '<span>Garantie 2 ans · retour sous 14 jours</span>' +
        '</div>' +

        '<table class="caracteristiques">' +
          '<caption class="visuellement-cache">Caractéristiques techniques</caption>' +
          ligneCaracteristique('Mouvement', LIBELLES.mouvement[produit.mouvement] + (produit.chrono ? ' · chronographe' : '')) +
          ligneCaracteristique('Diamètre', produit.diametre + ' mm') +
          ligneCaracteristique('Boîtier', produit.boitier) +
          ligneCaracteristique('Bracelet', produit.bracelet) +
          ligneCaracteristique('Étanchéité', produit.etancheite + ' m') +
          ligneCaracteristique('Garantie', '2 ans') +
        '</table>' +
      '</div>' +
    '</article>';

  // Les éléments existent maintenant : on peut brancher les boutons.
  document.getElementById('moins').addEventListener('click', function () { changerQuantiteFiche(-1); });
  document.getElementById('plus').addEventListener('click', function () { changerQuantiteFiche(1); });
  document.getElementById('ajouter').addEventListener('click', function () {
    ajouterAuPanier(produit.id, quantite);
    afficherToast('<strong>' + echapperHTML(produit.nom) + '</strong> × ' + quantite + ' ajoutée au panier · <a href="panier.html">Voir le panier</a>');
  });
  changerQuantiteFiche(0);   // met à jour l'affichage et le lien WhatsApp
}

function ligneCaracteristique(nom, valeur) {
  return '<tr><th scope="row">' + nom + '</th><td>' + echapperHTML(valeur) + '</td></tr>';
}

// +1, −1, ou 0 pour simplement rafraîchir. La quantité reste entre 1 et le stock.
function changerQuantiteFiche(delta) {
  quantite = Math.max(1, Math.min(produit.stock, quantite + delta));
  document.getElementById('valeur-quantite').textContent = quantite;
  document.getElementById('moins').disabled = quantite === 1;
  document.getElementById('plus').disabled = quantite === produit.stock;
  // Le message WhatsApp suit la quantité choisie.
  document.getElementById('whatsapp').href = lienWhatsApp(messageProduit(produit, quantite));
}

// "Vous aimerez aussi" : d'abord la même collection, puis on complète avec le même genre (homme, mixte…).
function afficherSuggestions() {
  const autres = PRODUITS.filter(function (p) { return p.id !== produit.id; });
  const memeCollection = autres.filter(function (p) { return p.collection === produit.collection; });
  const memeGenre = autres.filter(function (p) { return p.collection !== produit.collection && p.genre === produit.genre; });
  const suggestions = memeCollection.concat(memeGenre).slice(0, 3);
  if (!suggestions.length) return;
  document.getElementById('grille-suggestions').innerHTML = suggestions.map(carteProduit).join('');
  document.getElementById('suggestions').hidden = false;
}
