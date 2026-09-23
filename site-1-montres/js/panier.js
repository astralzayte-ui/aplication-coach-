/* =========================================================
   panier.js — Toute la logique du panier
   ---------------------------------------------------------
   Le panier est un tableau de lignes { id, quantite }.
   Il est sauvegardé dans le localStorage du navigateur :
   il survit à un rechargement de page ou à la fermeture
   de l'onglet, sans serveur.

   Chaque modification déclenche un événement "panier:change".
   Les pages qui affichent le panier (badge du menu, page
   panier…) écoutent cet événement pour se mettre à jour.
   ========================================================= */

// Copie de secours en mémoire, si le localStorage est bloqué
// (navigation privée sur certains navigateurs, par exemple).
let panierMemoire = [];

// Lit le panier. On ne garde que les produits qui existent encore.
function lirePanier() {
  try {
    const brut = localStorage.getItem(CONFIG.clePanier);
    const panier = brut ? JSON.parse(brut) : [];
    if (!Array.isArray(panier)) return [];
    // On ne fait jamais confiance aux données enregistrées (elles ont pu être abîmées) :
    // produit existant, quantité entière entre 1 et le stock, une seule ligne par produit.
    const propre = [];
    panier.forEach(function (ligne) {
      const produit = ligne && trouverProduit(ligne.id);
      const quantite = Math.min(parseInt(ligne && ligne.quantite, 10) || 0, produit ? produit.stock : 0);
      if (!produit || quantite <= 0) return;
      const existante = propre.find(function (l) { return l.id === ligne.id; });
      if (existante) existante.quantite = Math.min(existante.quantite + quantite, produit.stock);
      else propre.push({ id: ligne.id, quantite: quantite });
    });
    return propre;
  } catch (erreur) {
    return panierMemoire;
  }
}

// Enregistre le panier puis prévient toute la page qu'il a changé.
function sauverPanier(panier) {
  panierMemoire = panier;
  try {
    localStorage.setItem(CONFIG.clePanier, JSON.stringify(panier));
  } catch (erreur) {
    // Pas grave : on garde la copie en mémoire.
  }
  window.dispatchEvent(new CustomEvent('panier:change'));
}

// Ajoute une quantité d'un produit sans dépasser le stock disponible.
// Renvoie le nombre d'articles réellement ajoutés (0 si le stock est déjà atteint),
// pour que la page puisse afficher le bon message.
function ajouterAuPanier(id, quantite) {
  const produit = trouverProduit(id);
  if (!produit) return 0;
  const panier = lirePanier();
  let ligne = panier.find(function (l) { return l.id === id; });
  if (!ligne) {
    ligne = { id: id, quantite: 0 };
    panier.push(ligne);
  }
  const avant = ligne.quantite;
  ligne.quantite = Math.min(avant + quantite, produit.stock);
  const ajoutes = ligne.quantite - avant;
  if (ajoutes > 0) sauverPanier(panier.filter(function (l) { return l.quantite > 0; }));
  return ajoutes;
}

// Fixe la quantité exacte d'une ligne. 0 ou moins = on retire le produit.
function changerQuantite(id, quantite) {
  const produit = trouverProduit(id);
  if (!produit) return;
  let panier = lirePanier();
  if (quantite <= 0) {
    panier = panier.filter(function (l) { return l.id !== id; });
  } else {
    panier.forEach(function (l) {
      if (l.id === id) l.quantite = Math.min(quantite, produit.stock);
    });
  }
  sauverPanier(panier);
}

function retirerDuPanier(id) {
  changerQuantite(id, 0);
}

function viderPanier() {
  sauverPanier([]);
}

// Nombre total d'articles (pour le badge dans le menu).
function nombreArticles() {
  return lirePanier().reduce(function (total, l) { return total + l.quantite; }, 0);
}

// Calcule tout ce qu'il faut pour afficher un récapitulatif :
// les lignes avec leur produit, le sous-total, la livraison et le total.
function detailPanier() {
  const lignes = lirePanier().map(function (l) {
    const produit = trouverProduit(l.id);
    return { produit: produit, quantite: l.quantite, total: produit.prix * l.quantite };
  });
  const sousTotal = lignes.reduce(function (s, l) { return s + l.total; }, 0);
  const livraison = sousTotal === 0 || sousTotal >= CONFIG.livraisonOfferteDes ? 0 : CONFIG.fraisLivraison;
  return { lignes: lignes, sousTotal: sousTotal, livraison: livraison, total: sousTotal + livraison };
}

// Si le panier change dans un AUTRE onglet, l'événement "storage" nous prévient :
// on relaie l'information pour garder tous les onglets synchronisés.
window.addEventListener('storage', function (e) {
  if (e.key === CONFIG.clePanier) window.dispatchEvent(new CustomEvent('panier:change'));
});
