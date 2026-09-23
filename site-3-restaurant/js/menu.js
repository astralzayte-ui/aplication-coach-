/* =========================================================
   menu.js — La carte
   ---------------------------------------------------------
   - affiche les plats par catégorie, à partir de donnees.js ;
   - filtres "Végétarien" et "Signatures" (cumulables) ;
   - la catégorie visible à l'écran est soulignée dans la barre
     (IntersectionObserver : le navigateur nous prévient quand
     une section entre dans l'écran, sans calcul au défilement).
   ========================================================= */

const filtresActifs = new Set();

function afficherCarte() {
  const L = I18N.langue;
  const plats = CARTE.filter(function (p) {
    return Array.from(filtresActifs).every(function (f) { return p.etiquettes.indexOf(f) !== -1; });
  });

  // Barre des catégories : seulement celles qui ont des plats après filtrage.
  const categories = CATEGORIES.filter(function (c) { return plats.some(function (p) { return p.categorie === c.id; }); });
  document.getElementById('onglets').innerHTML = categories.map(function (c, i) {
    return '<a href="#cat-' + c.id + '"' + (i === 0 ? ' aria-current="true"' : '') + '>' + c[L] + '</a>';
  }).join('');

  document.getElementById('carte').innerHTML = categories.length ? categories.map(function (c) {
    return '<section class="categorie" id="cat-' + c.id + '"><h2>' + c[L] + '</h2><div class="plats">' +
      plats.filter(function (p) { return p.categorie === c.id; }).map(function (p) {
        return '<article class="plat' + (p.photo ? '' : ' sans-photo') + '">' +
          (p.photo ? imagePhoto(p.photo, p[L].nom, '112px') : '') +
          '<div><div class="plat-haut"><h3>' + echapper(p[L].nom) + '</h3><span class="pointilles" aria-hidden="true"></span><span class="prix">' + p.prix + ' DH</span></div>' +
          '<p>' + echapper(p[L].desc) + '</p>' +
          (p.etiquettes.length ? '<div class="etiquettes">' + p.etiquettes.map(function (e) {
            return '<span class="etiquette etiquette-' + e + '">' + I18N.t('etiquette.' + e) + '</span>';
          }).join('') + '</div>' : '') +
          '</div></article>';
      }).join('') + '</div></section>';
  }).join('') : '<p class="vide">' + I18N.t('menu.aucun') + '</p>';

  suivreCategories();
}

// Souligne dans la barre la catégorie actuellement lue.
let observateurCategories;
function suivreCategories() {
  if (observateurCategories) observateurCategories.disconnect();
  if (!('IntersectionObserver' in window)) return;
  observateurCategories = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (!e.isIntersecting) return;
      document.querySelectorAll('#onglets a').forEach(function (a) {
        a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });   // "lue" = passe au milieu de l'écran
  document.querySelectorAll('.categorie').forEach(function (s) { observateurCategories.observe(s); });
}

document.querySelector('.filtres').addEventListener('click', function (e) {
  const b = e.target.closest('[data-filtre]');
  if (!b) return;
  const actif = b.getAttribute('aria-pressed') !== 'true';
  b.setAttribute('aria-pressed', actif);
  if (actif) filtresActifs.add(b.dataset.filtre); else filtresActifs.delete(b.dataset.filtre);
  afficherCarte();
});

afficherCarte();
window.addEventListener('langue:change', afficherCarte);
