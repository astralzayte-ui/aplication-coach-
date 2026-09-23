/* =========================================================
   page-panier.js — Affichage de la page Panier
   ---------------------------------------------------------
   Toute la page est redessinée à partir des données du
   panier (fonction afficherPanier). Quand le panier change
   (quantité, suppression…), l'événement "panier:change"
   relance simplement afficherPanier : l'écran reste
   toujours fidèle aux données.
   ========================================================= */

const elPanier = document.getElementById('contenu-panier');

function afficherPanier() {
  const d = detailPanier();

  if (d.lignes.length === 0) {
    elPanier.innerHTML =
      '<div class="etat-vide" style="margin-bottom:80px">' +
        '<h2>Votre panier est vide</h2>' +
        '<p class="texte-doux">Découvrez nos montres et laissez-vous tenter.</p>' +
        '<a class="btn btn-or" href="catalogue.html">Voir la collection</a>' +
      '</div>';
    return;
  }

  const lignes = d.lignes.map(function (l) {
    const p = l.produit;
    return '<article class="ligne-panier">' +
      '<a class="ligne-visuel" href="produit.html?id=' + p.id + '" tabindex="-1" aria-hidden="true">' + visuelProduit(p, true) + '</a>' +
      '<div class="ligne-infos">' +
        '<h3><a href="produit.html?id=' + p.id + '">' + echapperHTML(p.nom) + '</a></h3>' +
        '<span class="fiche-ref">Réf. ' + p.ref + ' · ' + formaterPrix(p.prix) + ' l\'unité</span>' +
        '<div class="ligne-bas">' +
          '<div class="quantite petite" role="group" aria-label="Quantité de ' + echapperHTML(p.nom) + '">' +
            // data-action et data-id : un seul écouteur gère tous ces boutons (voir plus bas).
            '<button type="button" data-action="moins" data-id="' + p.id + '" aria-label="Diminuer">−</button>' +
            '<output>' + l.quantite + '</output>' +
            '<button type="button" data-action="plus" data-id="' + p.id + '" aria-label="Augmenter"' + (l.quantite >= p.stock ? ' disabled' : '') + '>+</button>' +
          '</div>' +
          '<span class="ligne-prix">' + formaterPrix(l.total) + '</span>' +
        '</div>' +
        '<button type="button" class="btn-lien ligne-retirer" data-action="retirer" data-id="' + p.id + '">Retirer</button>' +
      '</div>' +
    '</article>';
  }).join('');

  elPanier.innerHTML =
    '<div class="mise-en-page-panier">' +
      '<section aria-label="Articles">' + lignes +
        '<button type="button" class="btn-lien" data-action="vider" style="margin-top:12px">Vider le panier</button>' +
      '</section>' +
      '<aside class="recap" aria-label="Récapitulatif">' +
        '<h2>Récapitulatif</h2>' +
        '<div class="recap-ligne"><span>Sous-total</span><span>' + formaterPrix(d.sousTotal) + '</span></div>' +
        '<div class="recap-ligne"><span>Livraison</span><span>' + (d.livraison ? formaterPrix(d.livraison) : 'Offerte') + '</span></div>' +
        '<div class="recap-ligne total"><span>Total</span><span>' + formaterPrix(d.total) + '</span></div>' +
        '<a class="btn btn-or btn-large" href="commande.html">Passer commande</a>' +
        '<a class="btn btn-whatsapp btn-large" href="' + lienWhatsApp(messagePanier()) + '" target="_blank" rel="noopener">' + ICONES.whatsapp + 'Commander sur WhatsApp</a>' +
        '<p class="recap-note">Paiement sécurisé · Livraison 24 à 72 h · Retour sous 14 jours</p>' +
      '</aside>' +
    '</div>';
}

// Délégation d'événement : un seul écouteur pour tous les boutons du panier.
elPanier.addEventListener('click', function (e) {
  const bouton = e.target.closest('[data-action]');
  if (!bouton) return;
  const id = bouton.dataset.id;
  const ligne = lirePanier().find(function (l) { return l.id === id; });

  switch (bouton.dataset.action) {
    case 'plus': changerQuantite(id, ligne.quantite + 1); break;
    case 'moins': changerQuantite(id, ligne.quantite - 1); break;   // à 0, la ligne disparaît
    case 'retirer':
      retirerDuPanier(id);
      afficherToast('Montre retirée du panier');
      break;
    case 'vider':
      // Confirmation en deux clics, directement dans la page (plus élégant qu'une
      // boîte de dialogue du navigateur) : le 1er clic demande, le 2e vide le panier.
      if (bouton.dataset.confirme) {
        viderPanier();
      } else {
        bouton.dataset.confirme = 'oui';
        bouton.textContent = 'Confirmer : vider tout le panier ?';
      }
      break;
  }
});

window.addEventListener('panier:change', afficherPanier);
afficherPanier();
