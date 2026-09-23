/* =========================================================
   commun.js — Code partagé par toutes les pages
   ---------------------------------------------------------
   - en-tête (menu, langue, "ouvert maintenant") et pied de page
   - effet parallaxe : les photos défilent moins vite que la page
   - apparition douce des blocs au défilement
   - bouton WhatsApp, notifications
   ========================================================= */

/* ---------- Outils ---------- */

function echapper(texte) {
  return String(texte == null ? '' : texte)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Lien WhatsApp avec un message déjà rédigé.
function lienWhatsApp(message) {
  return 'https://wa.me/' + RESTAURANT.whatsapp + '?text=' + encodeURIComponent(message);
}

// Balise <img> d'une photo du site : deux tailles (560 px et grande), le navigateur choisit.
function imagePhoto(nom, alt, tailles, prioritaire, classe) {
  return '<img src="images/' + nom + '.webp" srcset="images/' + nom + '-560.webp 560w, images/' + nom + '.webp 1024w"' +
    ' sizes="' + (tailles || '100vw') + '" alt="' + echapper(alt) + '"' + (classe ? ' class="' + classe + '"' : '') +
    (prioritaire ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
}

// "Maintenant", au format attendu par horaires.js : { date: '2026-09-23', minutes: 1170 }.
// Heure de Marrakech (Africa/Casablanca), même si le visiteur est à l'étranger.
function maintenantMarrakech() {
  try {
    const p = {};
    new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Casablanca', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { date: p.year + '-' + p.month + '-' + p.day, minutes: Number(p.hour) * 60 + Number(p.minute) };
  } catch (e) {
    const d = new Date();
    return { date: d.toISOString().slice(0, 10), minutes: d.getHours() * 60 + d.getMinutes() };
  }
}

// Formats d'heure : "19:30" en anglais, "19h30" en français.
function heureLisible(hhmm) { return I18N.langue === 'fr' ? hhmm.replace(':', 'h') : hhmm; }

let minuteurToast;
function toast(message) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.innerHTML = message;
  el.classList.add('visible');
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(function () { el.classList.remove('visible'); }, 3200);
}

const ICONES = {
  whatsapp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .9c-1-.4-2.4-1.8-2.8-2.8l.9-1-1-2L9 8.5z" fill="currentColor"/></svg>',
  menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  fermer: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  point: '<span class="point-etat" aria-hidden="true"></span>',
  fleche: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  etoile: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" fill="currentColor"/></svg>'
};

/* ---------- "Ouvert maintenant" ---------- */
function texteEtat() {
  const e = Horaires.etatOuverture(maintenantMarrakech());
  if (e.ouvert) return { ouvert: true, texte: I18N.t('etat.ouvert', { heure: heureLisible(e.jusqua) }) };
  if (!e.prochaineDate) return { ouvert: false, texte: '' };
  const heure = heureLisible(e.prochaineHeure);
  if (e.joursAvant === 0) return { ouvert: false, texte: I18N.t('etat.ferme-aujourdhui', { heure: heure }) };
  if (e.joursAvant === 1) return { ouvert: false, texte: I18N.t('etat.ferme-demain', { heure: heure }) };
  return { ouvert: false, texte: I18N.t('etat.ferme-jour', { jour: I18N.t('jour.' + Horaires.jourSemaine(e.prochaineDate)).toLowerCase(), heure: heure }) };
}

/* ---------- En-tête et pied de page ---------- */
function afficherEntete() {
  const page = document.body.dataset.page;
  const liens = [['index.html', 'nav.accueil', 'accueil'], ['menu.html', 'nav.menu', 'menu'], ['galerie.html', 'nav.galerie', 'galerie'], ['contact.html', 'nav.contact', 'contact']];
  const etat = texteEtat();
  document.getElementById('entete').innerHTML =
    '<div class="entete-interieur">' +
      '<a class="logo" href="index.html"><span class="logo-nom">Dar Zaafran</span><span class="logo-arabe" lang="ar">' + RESTAURANT.nomArabe + '</span></a>' +
      '<nav class="navigation" id="navigation" aria-label="Navigation"><ul>' +
        liens.map(function (l) {
          return '<li><a href="' + l[0] + '"' + (l[2] === page ? ' aria-current="page"' : '') + '>' + I18N.t(l[1]) + '</a></li>';
        }).join('') +
        '<li class="nav-mobile-seulement"><a href="reservation.html">' + I18N.t('nav.reservation') + '</a></li>' +
      '</ul>' +
      (etat.texte ? '<p class="etat-ouverture ' + (etat.ouvert ? 'ouvert' : 'ferme') + ' nav-mobile-seulement">' + ICONES.point + etat.texte + '</p>' : '') +
      '</nav>' +
      '<div class="entete-actions">' +
        (etat.texte ? '<span class="etat-ouverture ' + (etat.ouvert ? 'ouvert' : 'ferme') + ' bureau-seulement">' + ICONES.point + etat.texte + '</span>' : '') +
        '<div class="langues" role="group" aria-label="' + I18N.t('langue') + '">' +
          '<button type="button" data-langue="fr" aria-pressed="' + (I18N.langue === 'fr') + '" lang="fr">FR</button>' +
          '<button type="button" data-langue="en" aria-pressed="' + (I18N.langue === 'en') + '" lang="en">EN</button>' +
        '</div>' +
        '<a class="btn btn-principal btn-petit bureau-seulement" href="reservation.html">' + I18N.t('nav.reservation') + '</a>' +
        '<button type="button" class="bouton-menu" id="bouton-menu" aria-expanded="false" aria-controls="navigation" aria-label="' + I18N.t('menu.ouvrir') + '">' + ICONES.menu + '</button>' +
      '</div>' +
    '</div>';
}

function afficherPied() {
  const annee = new Date().getFullYear();
  document.getElementById('pied').innerHTML =
    '<div class="conteneur pied-grille">' +
      '<div><p class="logo"><span class="logo-nom">Dar Zaafran</span><span class="logo-arabe" lang="ar">' + RESTAURANT.nomArabe + '</span></p>' +
        '<p class="texte-doux">' + I18N.t('pied.texte') + '</p></div>' +
      '<div><h2 class="pied-titre">' + I18N.t('contact.adresse') + '</h2><p class="texte-doux">' + RESTAURANT.adresse + '<br>' + RESTAURANT.ville + '</p></div>' +
      '<div><h2 class="pied-titre">' + I18N.t('contact.horaires') + '</h2><p class="texte-doux">12h30 – 15h00 · 19h00 – 23h30<br>' + I18N.t('contact.ferme') + ' : ' + I18N.t('jour.1').toLowerCase() + '</p></div>' +
      '<div><h2 class="pied-titre">' + I18N.t('contact.telephone') + '</h2><p class="texte-doux"><a href="' + lienWhatsApp(I18N.t('whatsapp.bonjour')) + '" target="_blank" rel="noopener">' + RESTAURANT.telephoneAffiche + '</a></p></div>' +
    '</div>' +
    '<div class="conteneur pied-bas"><p>© ' + annee + ' Dar Zaafran · ' + I18N.t('pied.demo') + '</p><a href="credits.html">' + I18N.t('pied.credits') + '</a></div>';
}

function brancherEntete() {
  const entete = document.getElementById('entete');
  entete.addEventListener('click', function (e) {
    const langue = e.target.closest('[data-langue]');
    if (langue) { I18N.changer(langue.dataset.langue); return; }
    const bouton = e.target.closest('#bouton-menu');
    if (bouton) {
      const ouvert = document.getElementById('navigation').classList.toggle('ouverte');
      bouton.setAttribute('aria-expanded', ouvert);
      bouton.setAttribute('aria-label', I18N.t(ouvert ? 'menu.fermer' : 'menu.ouvrir'));
      bouton.innerHTML = ouvert ? ICONES.fermer : ICONES.menu;
      document.body.classList.toggle('menu-ouvert', ouvert);
    }
  });
  // En-tête transparent au-dessus de la grande photo, puis plein quand on descend.
  const surPhoto = document.body.classList.contains('avec-hero');
  function majEntete() { entete.classList.toggle('plein', !surPhoto || window.scrollY > 40); }
  window.addEventListener('scroll', majEntete, { passive: true });
  majEntete();
}

/* ---------- Parallaxe ---------- */
// Chaque bloc [data-parallaxe] contient une image plus haute que lui (voir CSS).
// Au défilement, on décale l'image d'une fraction du déplacement : elle semble plus lointaine.
// requestAnimationFrame : au plus un calcul par image affichée (fluide, sans surcharger).
// Si l'utilisateur a demandé moins d'animations dans son système, l'effet est désactivé.
function activerParallaxe() {
  const blocs = Array.from(document.querySelectorAll('[data-parallaxe]'));
  if (!blocs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const visibles = new Set();
  const observateur = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) { if (e.isIntersecting) visibles.add(e.target); else visibles.delete(e.target); });
    demander();
  }, { rootMargin: '100px 0px' });
  blocs.forEach(function (b) { observateur.observe(b); });

  let enAttente = false;
  function demander() { if (!enAttente) { enAttente = true; requestAnimationFrame(calculer); } }
  function calculer() {
    enAttente = false;
    const hauteurEcran = window.innerHeight;
    visibles.forEach(function (bloc) {
      const r = bloc.getBoundingClientRect();
      const vitesse = Number(bloc.dataset.parallaxe) || 0.2;
      // position du centre du bloc par rapport au centre de l'écran (-1 … 1)
      const progression = (r.top + r.height / 2 - hauteurEcran / 2) / hauteurEcran;
      bloc.querySelector('.parallaxe-image').style.transform = 'translate3d(0,' + (progression * vitesse * r.height).toFixed(1) + 'px,0) scale(1.12)';
    });
  }
  window.addEventListener('scroll', demander, { passive: true });
  window.addEventListener('resize', demander);
  demander();
}

/* ---------- Apparition au défilement ---------- */
// Les blocs sont toujours visibles (même sans JavaScript) ; ils glissent simplement
// de quelques pixels quand ils entrent à l'écran.
function activerApparitions() {
  const elements = document.querySelectorAll('[data-apparition]');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const obs = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('apparu'); obs.unobserve(e.target); } });
  }, { threshold: 0.12 });
  elements.forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight) { el.classList.add('a-apparaitre'); obs.observe(el); }
  });
}

/* ---------- WhatsApp flottant ---------- */
function afficherWhatsApp() {
  let a = document.getElementById('whatsapp-flottant');
  if (!a) {
    a = document.createElement('a');
    a.id = 'whatsapp-flottant'; a.className = 'whatsapp-flottant'; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = ICONES.whatsapp;
    document.body.appendChild(a);
  }
  a.href = lienWhatsApp(I18N.t('whatsapp.bonjour'));
  a.setAttribute('aria-label', 'WhatsApp ' + RESTAURANT.telephoneAffiche);
}

/* ---------- Démarrage ---------- */
function rafraichirCommun() {
  I18N.appliquer();
  afficherEntete();
  afficherPied();
  afficherWhatsApp();
}
rafraichirCommun();
brancherEntete();
activerParallaxe();
activerApparitions();
window.addEventListener('langue:change', rafraichirCommun);
// L'état "ouvert / fermé" est recalculé chaque minute.
setInterval(function () { if (!document.body.classList.contains('menu-ouvert')) afficherEntete(); }, 60000);   // sans refermer le menu mobile ouvert
