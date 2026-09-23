/* =========================================================
   catalogue.js — Filtres, recherche et tri
   ---------------------------------------------------------
   Principe : un objet "filtres" décrit ce que l'utilisateur
   a choisi. À chaque changement, on recalcule la liste :
     PRODUITS → filtrer() → trier() → afficher()
   On ne touche jamais au tableau PRODUITS d'origine.

   Les filtres sont aussi écrits dans l'URL (?collection=sport…) :
   on peut partager un lien vers une recherche précise, et
   les liens de l'accueil arrivent déjà filtrés.
   Exemple : catalogue.html?collection=sport&matiereBracelet=cuir
   ========================================================= */

// Prix le plus élevé du catalogue, arrondi à la centaine supérieure.
const PRIX_PLAFOND = Math.ceil(Math.max.apply(null, PRODUITS.map(function (p) { return p.prix; })) / 100) * 100;

// État des filtres (valeurs par défaut = aucun filtre).
const filtres = {
  recherche: '',
  collection: [],
  mouvement: [],
  matiereBracelet: [],
  prixMax: PRIX_PLAFOND,
  tri: 'pertinence'
};

// Noms des filtres à cases = noms des champs dans PRODUITS (et dans l'URL).
const CATEGORIES = ['collection', 'mouvement', 'matiereBracelet'];

// Raccourcis vers les éléments HTML utilisés souvent.
const elRecherche = document.getElementById('recherche');
const elTri = document.getElementById('tri');
const elPrix = document.getElementById('prix-max');
const elValeurPrix = document.getElementById('valeur-prix');
const elFiltres = document.getElementById('filtres');
const elGrille = document.getElementById('grille');
const elCompteur = document.getElementById('compteur');

/* ---------- Lecture / écriture de l'URL ---------- */

function lireURL() {
  const params = new URLSearchParams(window.location.search);
  CATEGORIES.forEach(function (cle) {
    if (params.get(cle)) filtres[cle] = params.get(cle).split(',');
  });
  if (params.get('q')) filtres.recherche = params.get('q');
  if (params.get('tri')) filtres.tri = params.get('tri');
  const prix = parseInt(params.get('prix'), 10);
  if (prix > 0) filtres.prixMax = Math.min(prix, PRIX_PLAFOND);
}

function ecrireURL() {
  const params = new URLSearchParams();
  CATEGORIES.forEach(function (cle) {
    if (filtres[cle].length) params.set(cle, filtres[cle].join(','));
  });
  if (filtres.recherche) params.set('q', filtres.recherche);
  if (filtres.tri !== 'pertinence') params.set('tri', filtres.tri);
  if (filtres.prixMax < PRIX_PLAFOND) params.set('prix', filtres.prixMax);
  const texte = params.toString();
  // replaceState change l'URL sans recharger la page ni ajouter d'entrée à l'historique.
  history.replaceState(null, '', texte ? '?' + texte : window.location.pathname);
}

/* ---------- Synchronisation formulaire ⇄ état ---------- */

// Met les champs du formulaire dans le même état que l'objet "filtres".
function remplirFormulaire() {
  elRecherche.value = filtres.recherche;
  elTri.value = filtres.tri;
  elTri.dispatchEvent(new Event('rafraichir'));   // met à jour le menu de tri doré (menu-deroulant.js)
  elPrix.min = 2000;
  elPrix.max = PRIX_PLAFOND;
  elPrix.value = filtres.prixMax;
  elFiltres.querySelectorAll('input[type=checkbox]').forEach(function (caseACocher) {
    caseACocher.checked = filtres[caseACocher.name].indexOf(caseACocher.value) !== -1;
  });
  afficherValeurPrix();
}

// Lit le formulaire et met à jour l'objet "filtres".
function lireFormulaire() {
  filtres.recherche = elRecherche.value.trim();
  filtres.tri = elTri.value;
  filtres.prixMax = parseInt(elPrix.value, 10);
  CATEGORIES.forEach(function (cle) {
    const cochees = elFiltres.querySelectorAll('input[name="' + cle + '"]:checked');
    filtres[cle] = Array.from(cochees).map(function (c) { return c.value; });
  });
}

function afficherValeurPrix() {
  elValeurPrix.textContent = 'Jusqu\'à ' + formaterPrix(parseInt(elPrix.value, 10));
}

/* ---------- Filtrer, trier, afficher ---------- */

function filtrer() {
  const recherche = normaliser(filtres.recherche);
  return PRODUITS.filter(function (p) {
    // Dans une catégorie, une liste vide veut dire "tout accepter".
    for (let i = 0; i < CATEGORIES.length; i++) {
      const cle = CATEGORIES[i];
      if (filtres[cle].length && filtres[cle].indexOf(p[cle]) === -1) return false;
    }
    if (p.prix > filtres.prixMax) return false;
    if (recherche) {
      // On cherche dans plusieurs champs à la fois.
      const texte = normaliser([p.nom, p.description, p.boitier, p.bracelet,
        LIBELLES.collection[p.collection], LIBELLES.mouvement[p.mouvement], p.chrono ? 'chronographe chrono' : ''].join(' '));
      if (texte.indexOf(recherche) === -1) return false;
    }
    return true;
  });
}

function trier(liste) {
  // slice() fait une copie : sort() modifierait sinon le tableau d'origine.
  const copie = liste.slice();
  switch (filtres.tri) {
    case 'prix-croissant': return copie.sort(function (a, b) { return a.prix - b.prix; });
    case 'prix-decroissant': return copie.sort(function (a, b) { return b.prix - a.prix; });
    case 'nouveautes': return copie.sort(function (a, b) { return b.nouveaute - a.nouveaute; });
    case 'nom': return copie.sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); });
    default: return copie;
  }
}

function afficher() {
  const resultats = trier(filtrer());

  // Sur mobile, le bouton indique combien de filtres sont actifs : "Filtres (2)".
  const actifs = CATEGORIES.reduce(function (n, cle) { return n + filtres[cle].length; }, 0) +
    (filtres.prixMax < PRIX_PLAFOND ? 1 : 0);
  document.getElementById('btn-filtres').textContent = actifs ? 'Filtres (' + actifs + ')' : 'Filtres';

  elCompteur.textContent = resultats.length + ' montre' + (resultats.length > 1 ? 's' : '') +
    ' sur ' + PRODUITS.length;

  if (resultats.length === 0) {
    elGrille.innerHTML =
      '<div class="etat-vide" style="grid-column:1/-1">' +
        '<h2>Aucune montre ne correspond</h2>' +
        '<p class="texte-doux">Essayez d\'élargir vos critères, ou demandez-nous directement : nous avons peut-être la pièce en réserve.</p>' +
        '<button class="btn btn-contour" type="button" onclick="reinitialiser()">Réinitialiser les filtres</button>' +
      '</div>';
    return;
  }
  elGrille.innerHTML = resultats.map(carteProduit).join('');
}

// Appelée à chaque modification d'un filtre.
function mettreAJour() {
  lireFormulaire();
  afficherValeurPrix();
  ecrireURL();
  afficher();
}

function reinitialiser() {
  filtres.recherche = '';
  CATEGORIES.forEach(function (cle) { filtres[cle] = []; });
  filtres.prixMax = PRIX_PLAFOND;
  filtres.tri = 'pertinence';
  remplirFormulaire();
  ecrireURL();
  afficher();
}

/* ---------- Écouteurs d'événements ---------- */

// "input" se déclenche à chaque frappe ou mouvement du curseur :
// les résultats se mettent à jour en direct.
elRecherche.addEventListener('input', mettreAJour);
elTri.addEventListener('change', mettreAJour);
elFiltres.addEventListener('input', mettreAJour);   // délégation : une écoute pour toutes les cases
document.getElementById('reinitialiser').addEventListener('click', reinitialiser);

// Bouton "Filtres" (visible seulement sur mobile) : ouvre/ferme le panneau.
const btnFiltres = document.getElementById('btn-filtres');
btnFiltres.addEventListener('click', function () {
  const ouvert = elFiltres.classList.toggle('ouvert');
  btnFiltres.setAttribute('aria-expanded', ouvert);
});

/* ---------- Démarrage ---------- */
lireURL();
remplirFormulaire();
afficher();
