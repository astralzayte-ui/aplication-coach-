/* =========================================================
   composants.js — Composants d'interface faits sur mesure
   ---------------------------------------------------------
   Aucun contrôle de formulaire n'utilise le style par défaut
   du navigateur : liste déroulante et calendrier sont
   dessinés ici, aux couleurs de l'application, et restent
   utilisables au clavier et par les lecteurs d'écran.
   ========================================================= */

/* ---------- Outils ---------- */

// Sécurité : neutralise le HTML dans un texte avant de l'insérer avec innerHTML (faille XSS).
function echapper(texte) {
  return String(texte == null ? '' : texte)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Icônes SVG en ligne (tracés simples, 24×24, couleur héritée du texte).
const ICONES = (function () {
  const i = function (d) { return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>'; };
  return {
    tableau: i('<rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/>'),
    devis: i('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>'),
    facture: i('<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h3"/>'),
    clients: i('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6 6 0 0 1 3.5 5.5"/>'),
    reglages: i('<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>'),
    plus: i('<path d="M12 5v14M5 12h14"/>'),
    chercher: i('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
    chevron: i('<path d="M6 9l6 6 6-6"/>'),
    gauche: i('<path d="M15 6l-6 6 6 6"/>'),
    droite: i('<path d="M9 6l6 6-6 6"/>'),
    coche: i('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    croix: i('<path d="M6 6l12 12M18 6L6 18"/>'),
    poubelle: i('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
    copie: i('<rect x="8" y="8" width="12" height="12" rx="1"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>'),
    imprimer: i('<path d="M7 9V3h10v6M7 17H4v-7h16v7h-3"/><rect x="7" y="14" width="10" height="7"/>'),
    envoyer: i('<path d="M4 12l16-8-6 17-3-7z"/><path d="M11 14l9-10"/>'),
    transformer: i('<path d="M4 7h13l-3-3M20 17H7l3 3"/>'),
    calendrier: i('<rect x="3.5" y="5" width="17" height="15.5" rx="1"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    retour: i('<path d="M19 12H5M11 6l-6 6 6 6"/>'),
    lune: i('<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>'),
    soleil: i('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.4 1.4M17.6 17.6L19 19M5 19l1.4-1.4M17.6 6.4L19 5"/>'),
    clavier: i('<rect x="2.5" y="6" width="19" height="12" rx="1"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'),
    telecharger: i('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    importer: i('<path d="M12 15V4M7 9l5-5 5 5M5 20h14"/>'),
    alerte: i('<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5h.01"/>'),
    whatsapp: i('<path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3z"/>')
  };
})();

/* ---------- Notifications ("toasts") ---------- */

let minuteurToast;
function toast(message, type) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    el.setAttribute('role', 'status');           // annoncé par les lecteurs d'écran
    document.body.appendChild(el);
  }
  el.className = 'toast visible' + (type ? ' toast-' + type : '');
  el.innerHTML = message;
  clearTimeout(minuteurToast);
  minuteurToast = setTimeout(function () { el.classList.remove('visible'); }, 3200);
}

/* ---------- Confirmation en deux clics ---------- */
// Pas de confirm() du navigateur (bloqué dans certains contextes et peu élégant) :
// le 1er clic transforme le bouton en « Confirmer ? », le 2e exécute l'action.
// Sans 2e clic dans les 4 secondes, le bouton revient à son état normal.
function confirmerEnDeuxClics(bouton, texteConfirmation, action) {
  if (bouton.dataset.confirmation === 'oui') {
    delete bouton.dataset.confirmation;
    action();
    return;
  }
  const original = bouton.innerHTML;
  bouton.dataset.confirmation = 'oui';
  bouton.classList.add('a-confirmer');
  bouton.innerHTML = ICONES.alerte + '<span>' + texteConfirmation + '</span>';
  setTimeout(function () {
    if (bouton.isConnected && bouton.dataset.confirmation === 'oui') {
      delete bouton.dataset.confirmation;
      bouton.classList.remove('a-confirmer');
      bouton.innerHTML = original;
    }
  }, 4000);
}

/* ---------- Fenêtres de dialogue ---------- */
// On s'appuie sur <dialog> (fermeture avec Échap, focus bloqué à l'intérieur),
// entièrement restylé en CSS.
function ouvrirDialogue(id) {
  const d = document.getElementById(id);
  if (d && !d.open) d.showModal();
  return d;
}
function fermerDialogue(id) {
  const d = document.getElementById(id);
  if (d && d.open) d.close();
}

/* ---------- Liste déroulante sur mesure ---------- */
// Remplace visuellement un <select>. Le <select> reste caché dans la page et garde
// la valeur : le reste du code lit toujours select.value et écoute "change".
// Rôles ARIA "listbox"/"option" + clavier : flèches, Entrée, Échap, Tab, et saisie
// d'une lettre pour aller à l'option qui commence par cette lettre.

function ameliorerListes(racine) {
  (racine || document).querySelectorAll('select:not([data-ameliore])').forEach(creerListe);
}

function creerListe(select) {
  select.dataset.ameliore = 'oui';
  const idListe = (select.id || 'liste' + Math.random().toString(36).slice(2)) + '-options';
  const conteneur = document.createElement('div');
  conteneur.className = 'liste' + (select.dataset.taille ? ' liste-' + select.dataset.taille : '');
  conteneur.innerHTML =
    '<button type="button" class="liste-bouton" aria-haspopup="listbox" aria-expanded="false" aria-controls="' + idListe + '">' +
      '<span class="liste-valeur"></span>' + ICONES.chevron +
    '</button>' +
    '<ul class="liste-options" id="' + idListe + '" role="listbox" tabindex="-1" hidden></ul>';
  select.classList.add('visuellement-cache');
  select.setAttribute('tabindex', '-1');
  select.setAttribute('aria-hidden', 'true');
  select.insertAdjacentElement('afterend', conteneur);

  const bouton = conteneur.querySelector('.liste-bouton');
  const liste = conteneur.querySelector('.liste-options');
  if (select.id) bouton.id = select.id + '-bouton';
  const libelle = select.id && document.querySelector('label[for="' + select.id + '"]');
  if (libelle) {
    libelle.setAttribute('for', bouton.id);
    bouton.setAttribute('aria-label', libelle.textContent.trim());
  } else if (select.getAttribute('aria-label')) {
    bouton.setAttribute('aria-label', select.getAttribute('aria-label'));
  }
  select.focus = function () { bouton.focus(); };
  bouton.disabled = select.disabled;          // un <select> désactivé donne une liste désactivée
  let actif = 0;

  // Les options sont (re)construites à l'ouverture : si le <select> a changé, la liste suit.
  function construire() {
    liste.innerHTML = Array.from(select.options).map(function (o, i) {
      return '<li role="option" id="' + idListe + '-' + i + '"' + (o.value === '' && o.dataset.invite ? ' class="invite"' : '') + ' aria-selected="' + (i === select.selectedIndex) + '">' +
        '<span>' + echapper(o.textContent) + '</span>' + ICONES.coche + '</li>';
    }).join('');
  }
  function synchroniser() {
    if (select.selectedIndex < 0 && select.options.length) select.selectedIndex = 0;
    const o = select.options[select.selectedIndex];
    bouton.querySelector('.liste-valeur').textContent = o ? o.textContent : '';
    bouton.classList.toggle('vide', !select.value);
    bouton.classList.toggle('erreur', select.getAttribute('aria-invalid') === 'true');
  }
  function elements() { return Array.from(liste.children); }
  function mettreEnAvant(i) {
    const els = elements();
    if (!els.length) return;
    actif = (i + els.length) % els.length;
    if (els[actif].classList.contains('invite') && els.length > 1) actif = (actif + 1) % els.length;
    els.forEach(function (li, j) { li.classList.toggle('actif', j === actif); });
    els[actif].scrollIntoView({ block: 'nearest' });
    liste.setAttribute('aria-activedescendant', els[actif].id);
  }
  function ouvrir() {
    construire();
    liste.hidden = false;
    conteneur.classList.add('ouverte');
    bouton.setAttribute('aria-expanded', 'true');
    // Si la liste déborderait en bas de l'écran, on l'ouvre vers le haut.
    const r = bouton.getBoundingClientRect();
    conteneur.classList.toggle('vers-le-haut', window.innerHeight - r.bottom < 260 && r.top > 260);
    mettreEnAvant(Math.max(select.selectedIndex, 0));
    liste.focus();
  }
  function fermer(rendreFocus) {
    liste.hidden = true;
    conteneur.classList.remove('ouverte');
    bouton.setAttribute('aria-expanded', 'false');
    if (rendreFocus) bouton.focus();
  }
  function choisir(i) {
    if (select.selectedIndex !== i) {
      select.selectedIndex = i;
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
    synchroniser();
    fermer(true);
  }

  bouton.addEventListener('click', function () { if (liste.hidden) ouvrir(); else fermer(true); });
  bouton.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); ouvrir(); }
  });
  liste.addEventListener('click', function (e) {
    const li = e.target.closest('[role="option"]');
    if (li) choisir(elements().indexOf(li));
  });
  liste.addEventListener('mousemove', function (e) {
    const li = e.target.closest('[role="option"]');
    if (li && !li.classList.contains('actif')) mettreEnAvant(elements().indexOf(li));
  });
  liste.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); mettreEnAvant(actif + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); mettreEnAvant(actif - 1); }
    else if (e.key === 'Home') { e.preventDefault(); mettreEnAvant(0); }
    else if (e.key === 'End') { e.preventDefault(); mettreEnAvant(-1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisir(actif); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fermer(true); }
    else if (e.key === 'Tab') { fermer(false); }
    else if (e.key.length === 1) {
      // Saisie d'une lettre : on saute à la première option qui commence par elle.
      const lettre = e.key.toLowerCase();
      const i = elements().findIndex(function (li, j) { return j > actif && li.textContent.trim().toLowerCase().startsWith(lettre); });
      const j = i !== -1 ? i : elements().findIndex(function (li) { return li.textContent.trim().toLowerCase().startsWith(lettre); });
      if (j !== -1) mettreEnAvant(j);
    }
  });
  document.addEventListener('click', function (e) {
    if (!liste.hidden && !conteneur.contains(e.target)) fermer(false);
  });
  select.addEventListener('change', synchroniser);
  select.addEventListener('rafraichir', synchroniser);   // valeur changée par un autre code
  synchroniser();
}

/* ---------- Champ date avec calendrier sur mesure ---------- */
// Un bouton affiche la date en toutes lettres ; il ouvre un calendrier mensuel.
// Clavier : flèches = jour par jour / semaine par semaine, PageUp/PageDown = mois,
// Entrée = choisir, Échap = fermer. La valeur est stockée au format ISO (2026-09-23).

const JOURS_COURTS = ['lu', 'ma', 'me', 'je', 've', 'sa', 'di'];
const MOIS_LONGS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function creerChampDate(conteneur, options) {
  let valeur = options.valeur || '';
  let affiche = valeur || Calculs.dateISO();      // mois affiché dans le calendrier
  let focus = affiche;                            // jour mis en avant au clavier
  const id = options.id;
  conteneur.classList.add('champ-date');
  conteneur.innerHTML =
    '<button type="button" class="champ champ-date-bouton" id="' + id + '" aria-haspopup="dialog" aria-expanded="false">' +
      ICONES.calendrier + '<span class="champ-date-texte"></span></button>' +
    '<div class="calendrier" role="dialog" aria-label="Choisir une date" hidden></div>';
  const bouton = conteneur.querySelector('button');
  const panneau = conteneur.querySelector('.calendrier');

  function afficherValeur() {
    bouton.querySelector('.champ-date-texte').textContent = valeur ? Calculs.formaterDate(valeur) : 'Choisir une date';
    bouton.classList.toggle('vide', !valeur);
  }

  function dessiner() {
    const p = affiche.split('-').map(Number);
    const premier = new Date(p[0], p[1] - 1, 1);
    const decalage = (premier.getDay() + 6) % 7;            // lundi = 0
    const debut = Calculs.ajouterJours(Calculs.dateISO(premier), -decalage);
    const aujourdhui = Calculs.dateISO();
    let cases = '';
    for (let i = 0; i < 42; i++) {
      const jour = Calculs.ajouterJours(debut, i);
      const autreMois = Number(jour.slice(5, 7)) !== p[1];
      cases += '<button type="button" class="jour' + (autreMois ? ' autre-mois' : '') + (jour === aujourdhui ? ' aujourdhui' : '') +
        '" data-jour="' + jour + '" tabindex="' + (jour === focus ? 0 : -1) + '" aria-pressed="' + (jour === valeur) +
        '" aria-label="' + Calculs.formaterDate(jour) + '">' + Number(jour.slice(8)) + '</button>';
    }
    panneau.innerHTML =
      '<div class="calendrier-entete">' +
        '<button type="button" class="bouton-icone" data-mois="-1" aria-label="Mois précédent">' + ICONES.gauche + '</button>' +
        '<strong>' + MOIS_LONGS[p[1] - 1] + ' ' + p[0] + '</strong>' +
        '<button type="button" class="bouton-icone" data-mois="1" aria-label="Mois suivant">' + ICONES.droite + '</button>' +
      '</div>' +
      '<div class="calendrier-jours" aria-hidden="true">' + JOURS_COURTS.map(function (j) { return '<span>' + j + '</span>'; }).join('') + '</div>' +
      '<div class="calendrier-grille">' + cases + '</div>' +
      '<div class="calendrier-pied">' +
        '<button type="button" class="bouton-lien" data-raccourci="0">Aujourd\'hui</button>' +
        (options.raccourcis || []).map(function (r) { return '<button type="button" class="bouton-lien" data-raccourci="' + r.jours + '">' + r.texte + '</button>'; }).join('') +
      '</div>';
  }

  function changerMois(delta) {
    const p = affiche.split('-').map(Number);
    affiche = Calculs.dateISO(new Date(p[0], p[1] - 1 + delta, 1));
    const f = focus.split('-').map(Number);
    const dernier = new Date(p[0], p[1] - 1 + delta + 1, 0).getDate();
    focus = affiche.slice(0, 8) + String(Math.min(f[2], dernier)).padStart(2, '0');
  }

  function ouvrir() {
    affiche = valeur || Calculs.dateISO();
    focus = affiche;
    dessiner();
    panneau.hidden = false;
    bouton.setAttribute('aria-expanded', 'true');
    const r = bouton.getBoundingClientRect();
    conteneur.classList.toggle('vers-le-haut', window.innerHeight - r.bottom < 360 && r.top > 360);
    panneau.querySelector('[data-jour="' + focus + '"]').focus();
  }
  function fermer(rendreFocus) {
    panneau.hidden = true;
    bouton.setAttribute('aria-expanded', 'false');
    if (rendreFocus) bouton.focus();
  }
  function choisir(jour) {
    valeur = jour;
    afficherValeur();
    fermer(true);
    if (options.surChangement) options.surChangement(jour);
  }
  function deplacerFocus(jours) {
    focus = Calculs.ajouterJours(focus, jours);
    if (focus.slice(0, 7) !== affiche.slice(0, 7)) affiche = focus.slice(0, 8) + '01';
    dessiner();
    panneau.querySelector('[data-jour="' + focus + '"]').focus();
  }

  bouton.addEventListener('click', function () { if (panneau.hidden) ouvrir(); else fermer(true); });
  panneau.addEventListener('click', function (e) {
    const j = e.target.closest('[data-jour]');
    const m = e.target.closest('[data-mois]');
    const r = e.target.closest('[data-raccourci]');
    if (j) choisir(j.dataset.jour);
    else if (m) { changerMois(Number(m.dataset.mois)); dessiner(); panneau.querySelector('[data-mois="' + m.dataset.mois + '"]').focus(); }
    else if (r) choisir(Calculs.ajouterJours(options.base ? options.base() : Calculs.dateISO(), Number(r.dataset.raccourci)));
  });
  panneau.addEventListener('keydown', function (e) {
    const surJour = e.target.matches('[data-jour]');
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fermer(true); return; }
    if (!surJour) return;
    const deplacements = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (deplacements[e.key]) { e.preventDefault(); deplacerFocus(deplacements[e.key]); }
    else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); changerMois(e.key === 'PageUp' ? -1 : 1); dessiner(); panneau.querySelector('[data-jour="' + focus + '"]').focus(); }
  });
  document.addEventListener('click', function (e) {
    if (!panneau.hidden && !conteneur.contains(e.target)) fermer(false);
  });

  afficherValeur();
  return {
    get valeur() { return valeur; },
    definir: function (v) { valeur = v; afficherValeur(); }
  };
}
