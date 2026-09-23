/* =========================================================
   galerie.js — Mosaïque de photos + visionneuse plein écran
   ---------------------------------------------------------
   - filtre Tout / Les plats / Le lieu ;
   - clic sur une photo : visionneuse (<dialog>) avec
     précédente / suivante, flèches du clavier, Échap,
     et glisser du doigt sur mobile (événements "pointer").
   ========================================================= */

let typeGalerie = 'tout';
let photosAffichees = [];
let indexPhoto = 0;
const visionneuse = document.getElementById('visionneuse');

function afficherGalerie() {
  const L = I18N.langue;
  photosAffichees = GALERIE.filter(function (p) { return typeGalerie === 'tout' || p.type === typeGalerie; });
  document.getElementById('mosaique').innerHTML = photosAffichees.map(function (p, i) {
    return '<button type="button" data-index="' + i + '"><figure style="margin:0">' +
      imagePhoto(p.photo, p[L], '(min-width: 900px) 33vw, 50vw') +
      '<figcaption>' + echapper(p[L]) + '</figcaption></figure></button>';
  }).join('');
}

function montrer(i) {
  const L = I18N.langue;
  indexPhoto = (i + photosAffichees.length) % photosAffichees.length;      // boucle au début / à la fin
  const p = photosAffichees[indexPhoto];
  document.getElementById('visionneuse-image').innerHTML = '<img src="images/' + p.photo + '.webp" alt="' + echapper(p[L]) + '">';
  document.getElementById('legende-photo').textContent = p[L];
  document.getElementById('compteur-photo').textContent = (indexPhoto + 1) + ' / ' + photosAffichees.length;
  // On précharge la suivante pour un défilement instantané.
  new Image().src = 'images/' + photosAffichees[(indexPhoto + 1) % photosAffichees.length].photo + '.webp';
}

document.getElementById('mosaique').addEventListener('click', function (e) {
  const b = e.target.closest('[data-index]');
  if (!b) return;
  montrer(Number(b.dataset.index));
  visionneuse.showModal();
});
document.getElementById('photo-precedente').addEventListener('click', function () { montrer(indexPhoto - 1); });
document.getElementById('photo-suivante').addEventListener('click', function () { montrer(indexPhoto + 1); });
document.getElementById('fermer-visionneuse').addEventListener('click', function () { visionneuse.close(); });
visionneuse.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowLeft') montrer(indexPhoto - 1);
  if (e.key === 'ArrowRight') montrer(indexPhoto + 1);
});
// Glisser du doigt : on compare la position au début et à la fin du geste.
let departX = null;
const zone = document.getElementById('visionneuse-image');
zone.addEventListener('pointerdown', function (e) { departX = e.clientX; });
zone.addEventListener('pointerup', function (e) {
  if (departX === null) return;
  const ecart = e.clientX - departX;
  if (Math.abs(ecart) > 50) montrer(indexPhoto + (ecart < 0 ? 1 : -1));
  departX = null;
});

document.getElementById('filtres-galerie').addEventListener('click', function (e) {
  const b = e.target.closest('[data-type]');
  if (!b) return;
  typeGalerie = b.dataset.type;
  document.querySelectorAll('#filtres-galerie [data-type]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
  afficherGalerie();
});

afficherGalerie();
window.addEventListener('langue:change', afficherGalerie);
