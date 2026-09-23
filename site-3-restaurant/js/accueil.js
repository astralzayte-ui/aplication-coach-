/* =========================================================
   accueil.js — Parties dynamiques de l'accueil
   Les plats "signatures" viennent de la carte (donnees.js) :
   si un prix change dans la carte, l'accueil suit tout seul.
   ========================================================= */

function afficherAccueil() {
  const langue = I18N.langue;
  const ids = ['agneau', 'couscous', 'mhencha'];
  document.getElementById('signatures').innerHTML = ids.map(function (id) {
    const plat = CARTE.find(function (p) { return p.id === id; });
    return '<article class="signature" data-apparition>' +
      imagePhoto(plat.photo, plat[langue].nom, '(min-width: 800px) 33vw, 100vw') +
      '<h3>' + echapper(plat[langue].nom) + '</h3>' +
      '<p class="texte-doux">' + echapper(plat[langue].desc) + '</p>' +
      '<p class="prix">' + plat.prix + ' DH</p></article>';
  }).join('');

  const noms = ['Sarah & Tom · Londres', 'Yasmine · Casablanca', 'Pierre · Lyon'];
  document.getElementById('avis').innerHTML = [1, 2, 3].map(function (n, i) {
    return '<figure data-apparition><div class="etoiles" aria-label="5/5">' + ICONES.etoile.repeat(5) + '</div>' +
      '<blockquote>' + I18N.t('avis.' + n) + '</blockquote><figcaption>' + noms[i] + '</figcaption></figure>';
  }).join('');
  document.getElementById('icone-fleche').innerHTML = ICONES.fleche;
}

afficherAccueil();
window.addEventListener('langue:change', afficherAccueil);
