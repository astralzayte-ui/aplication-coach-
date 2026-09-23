/* =========================================================
   reservation.js — Réserver une table
   ---------------------------------------------------------
   Tout le formulaire est fait "sur mesure" (pas de contrôles
   natifs du navigateur) :
   - un calendrier toujours visible : les jours passés, les lundis
     (fermeture) et au-delà de 60 jours sont désactivés ;
   - les créneaux de 30 minutes, calculés par horaires.js ;
   - un compteur − / + pour le nombre de personnes ;
   - une liste déroulante accessible au clavier pour l'occasion.
   Les règles (date valide, créneau libre, téléphone…) sont dans
   horaires.js, testé automatiquement. Ici on ne fait qu'afficher.
   À la fin, la demande est rédigée dans un message WhatsApp.
   ========================================================= */

const H = Horaires.HORAIRES;
const OCCASIONS = ['aucune', 'anniversaire', 'demande', 'affaires'];

// L'état du formulaire : une seule source de vérité, l'écran en découle.
const resa = { date: null, heure: null, couverts: 2, occasion: 'aucune' };
let moisAffiche;                       // "2026-09" : le mois visible dans le calendrier
let formulaireEnvoye = false;          // après un premier essai, on revalide pendant la saisie

/* ---------- Dates lisibles (dans la langue choisie) ---------- */
function dateUTC(iso) { const p = iso.split('-').map(Number); return new Date(Date.UTC(p[0], p[1] - 1, p[2])); }
function formater(iso, options) {
  return new Intl.DateTimeFormat(I18N.langue === 'fr' ? 'fr-FR' : 'en-GB', Object.assign({ timeZone: 'UTC' }, options)).format(dateUTC(iso));
}
function dateLongue(iso) { return formater(iso, { weekday: 'long', day: 'numeric', month: 'long' }); }

// Un jour est proposé s'il est réservable ET qu'il lui reste au moins un créneau libre.
function jourDisponible(iso, maintenant) {
  return Horaires.dateReservable(iso, maintenant) && Horaires.creneaux(iso, maintenant).some(function (c) { return c.disponible; });
}

/* ---------- Calendrier ---------- */
function afficherCalendrier() {
  const maintenant = maintenantMarrakech();
  const annee = Number(moisAffiche.slice(0, 4)), mois = Number(moisAffiche.slice(5, 7));
  const premier = moisAffiche + '-01';
  const nbJours = new Date(Date.UTC(annee, mois, 0)).getUTCDate();
  const decalage = (Horaires.jourSemaine(premier) + 6) % 7;          // semaine qui commence le lundi
  const dernierJour = Horaires.ajouterJours(maintenant.date, H.joursMaximum);

  // Noms des jours : on part d'un lundi connu (5 janvier 2026).
  const nomsJours = [];
  for (let i = 0; i < 7; i++) nomsJours.push(formater(Horaires.ajouterJours('2026-01-05', i), { weekday: 'short' }).replace('.', ''));

  let cases = '';
  for (let i = 0; i < decalage; i++) cases += '<span class="jour vide-case" aria-hidden="true"></span>';
  for (let j = 1; j <= nbJours; j++) {
    const iso = moisAffiche + '-' + String(j).padStart(2, '0');
    const libre = jourDisponible(iso, maintenant);
    cases += '<button type="button" class="jour' + (iso === maintenant.date ? ' aujourdhui' : '') + '" data-date="' + iso + '"' +
      ' aria-pressed="' + (iso === resa.date) + '" aria-label="' + echapper(dateLongue(iso)) + '"' +
      (libre ? '' : ' disabled') + ' tabindex="-1">' + j + '</button>';
  }

  const calendrier = document.getElementById('calendrier');
  calendrier.innerHTML =
    '<div class="calendrier-entete">' +
      '<button type="button" class="bouton-carre" data-mois="-1" aria-label="' + I18N.t('resa.mois-precedent') + '"' + (moisAffiche <= maintenant.date.slice(0, 7) ? ' disabled' : '') + '>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>' +
      '<strong aria-live="polite">' + formater(premier, { month: 'long', year: 'numeric' }) + '</strong>' +
      '<button type="button" class="bouton-carre" data-mois="1" aria-label="' + I18N.t('resa.mois-suivant') + '"' + (moisAffiche >= dernierJour.slice(0, 7) ? ' disabled' : '') + '>' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>' +
    '</div>' +
    '<div class="calendrier-jours" aria-hidden="true">' + nomsJours.map(function (n) { return '<span>' + n + '</span>'; }).join('') + '</div>' +
    '<div class="calendrier-grille">' + cases + '</div>';

  // Un seul jour reçoit le focus avec Tab (le jour choisi, sinon le premier libre) ; les flèches font le reste.
  const cible = calendrier.querySelector('.jour[aria-pressed="true"]') || calendrier.querySelector('.jour:not(:disabled):not(.vide-case)');
  if (cible) cible.tabIndex = 0;
}

function changerMois(sens) {
  const p = moisAffiche.split('-').map(Number);
  const d = new Date(Date.UTC(p[0], p[1] - 1 + sens, 1));
  moisAffiche = d.toISOString().slice(0, 7);
  afficherCalendrier();
}

function choisirDate(iso) {
  resa.date = iso;
  // Si l'heure déjà choisie n'existe pas ce jour-là, on l'efface.
  const libres = Horaires.creneaux(iso, maintenantMarrakech()).filter(function (c) { return c.disponible; });
  if (!libres.some(function (c) { return c.heure === resa.heure; })) resa.heure = null;
  afficherCalendrier();
  afficherCreneaux();
  afficherRecap();
  revalider();
}

document.getElementById('calendrier').addEventListener('click', function (e) {
  const mois = e.target.closest('[data-mois]');
  if (mois) { changerMois(Number(mois.dataset.mois)); return; }
  const jour = e.target.closest('.jour[data-date]');
  if (jour && !jour.disabled) {
    choisirDate(jour.dataset.date);
    const nouveau = document.querySelector('.jour[data-date="' + jour.dataset.date + '"]');
    if (nouveau) nouveau.focus();
  }
});

// Clavier dans la grille : flèches = jour précédent/suivant, haut/bas = semaine.
document.getElementById('calendrier').addEventListener('keydown', function (e) {
  const jour = e.target.closest('.jour[data-date]');
  const pas = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
  if (!jour || !pas) return;
  e.preventDefault();
  const iso = Horaires.ajouterJours(jour.dataset.date, pas);
  if (iso.slice(0, 7) !== moisAffiche) { moisAffiche = iso.slice(0, 7); afficherCalendrier(); }
  const suivant = document.querySelector('.jour[data-date="' + iso + '"]');
  if (suivant) {
    document.querySelectorAll('.jour[data-date]').forEach(function (b) { b.tabIndex = -1; });
    suivant.tabIndex = 0;
    suivant.focus();
  }
});

/* ---------- Créneaux horaires (boutons radio sur mesure) ---------- */
function afficherCreneaux() {
  const zone = document.getElementById('creneaux');
  if (!resa.date) { zone.innerHTML = '<p class="aide">' + I18N.t('resa.choisir-date') + '</p>'; return; }
  const liste = Horaires.creneaux(resa.date, maintenantMarrakech());
  if (!liste.some(function (c) { return c.disponible; })) { zone.innerHTML = '<p class="aide">' + I18N.t('resa.aucun-creneau') + '</p>'; return; }

  zone.innerHTML = H.services.map(function (s) {
    const duService = liste.filter(function (c) { return c.service === s.nom; });
    if (!duService.length) return '';
    return '<div><p class="service-titre" id="service-' + s.nom + '">' + I18N.t('resa.' + s.nom) + '</p>' +
      '<div class="creneaux-liste" role="radiogroup" aria-labelledby="service-' + s.nom + '">' +
      duService.map(function (c) {
        return '<button type="button" class="creneau" role="radio" data-heure="' + c.heure + '" aria-checked="' + (c.heure === resa.heure) + '"' +
          (c.disponible ? '' : ' disabled') + '>' + heureLisible(c.heure) + '</button>';
      }).join('') + '</div></div>';
  }).join('');
}

document.getElementById('creneaux').addEventListener('click', function (e) {
  const b = e.target.closest('.creneau');
  if (!b || b.disabled) return;
  resa.heure = b.dataset.heure;
  document.querySelectorAll('.creneau').forEach(function (x) { x.setAttribute('aria-checked', x === b); });
  afficherRecap();
  revalider();
});

/* ---------- Nombre de personnes ---------- */
function afficherCouverts() {
  document.getElementById('couverts').textContent = resa.couverts;
  document.getElementById('moins').disabled = resa.couverts <= 1;
  document.getElementById('plus').disabled = resa.couverts >= H.couvertsMax;
  document.getElementById('moins').setAttribute('aria-label', I18N.t('resa.couverts') + ' −1');
  document.getElementById('plus').setAttribute('aria-label', I18N.t('resa.couverts') + ' +1');
  // Au maximum, on propose WhatsApp pour les groupes.
  document.getElementById('aide-groupe').innerHTML = resa.couverts >= H.couvertsMax
    ? '<a href="' + lienWhatsApp(I18N.t('whatsapp.bonjour')) + '" target="_blank" rel="noopener">' + I18N.t('resa.groupe') + '</a>' : '';
}
document.getElementById('moins').addEventListener('click', function () { resa.couverts = Math.max(1, resa.couverts - 1); afficherCouverts(); afficherRecap(); });
document.getElementById('plus').addEventListener('click', function () { resa.couverts = Math.min(H.couvertsMax, resa.couverts + 1); afficherCouverts(); afficherRecap(); });

/* ---------- Liste déroulante "occasion" (remplace le <select> natif) ---------- */
const liste = document.getElementById('liste-occasion');
let indexActif = 0;

function afficherListe() {
  const ouverte = liste.classList.contains('ouverte');
  liste.innerHTML =
    '<button type="button" class="champ liste-bouton" aria-haspopup="listbox" aria-expanded="' + ouverte + '" aria-labelledby="etiquette-occasion valeur-occasion">' +
      '<span id="valeur-occasion">' + I18N.t('resa.occ.' + resa.occasion) + '</span>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
    '</button>' +
    '<ul class="liste-options" role="listbox" tabindex="-1" aria-labelledby="etiquette-occasion" aria-activedescendant="occasion-' + OCCASIONS[indexActif] + '"' + (ouverte ? '' : ' hidden') + '>' +
      OCCASIONS.map(function (o, i) {
        return '<li role="option" id="occasion-' + o + '" data-occasion="' + o + '" aria-selected="' + (o === resa.occasion) + '"' + (i === indexActif ? ' class="actif"' : '') + '>' +
          I18N.t('resa.occ.' + o) + '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l5 5 9-10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></li>';
      }).join('') +
    '</ul>';
}
function ouvrirListe() {
  indexActif = OCCASIONS.indexOf(resa.occasion);
  liste.classList.add('ouverte');
  afficherListe();
  liste.querySelector('.liste-options').focus();
}
function fermerListe(rendreFocus) {
  liste.classList.remove('ouverte');
  afficherListe();
  if (rendreFocus) liste.querySelector('.liste-bouton').focus();
}
function choisirOccasion(o) { resa.occasion = o; fermerListe(true); afficherRecap(); }

liste.addEventListener('click', function (e) {
  const option = e.target.closest('[data-occasion]');
  if (option) { choisirOccasion(option.dataset.occasion); return; }
  if (e.target.closest('.liste-bouton')) { if (liste.classList.contains('ouverte')) fermerListe(true); else ouvrirListe(); }
});
liste.addEventListener('keydown', function (e) {
  const ouverte = liste.classList.contains('ouverte');
  if (!ouverte && (e.key === 'ArrowDown' || e.key === 'ArrowUp') && e.target.closest('.liste-bouton')) { e.preventDefault(); ouvrirListe(); return; }
  if (!ouverte) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    indexActif = (indexActif + (e.key === 'ArrowDown' ? 1 : -1) + OCCASIONS.length) % OCCASIONS.length;
    afficherListe();
    liste.querySelector('.liste-options').focus();
  } else if (e.key === 'Home' || e.key === 'End') {
    e.preventDefault();
    indexActif = e.key === 'Home' ? 0 : OCCASIONS.length - 1;
    afficherListe();
    liste.querySelector('.liste-options').focus();
  } else if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    choisirOccasion(OCCASIONS[indexActif]);
  } else if (e.key === 'Escape' || e.key === 'Tab') {
    if (e.key === 'Escape') e.preventDefault();
    fermerListe(e.key === 'Escape');
  }
});
// Clic ailleurs : on referme.
document.addEventListener('click', function (e) { if (liste.classList.contains('ouverte') && !liste.contains(e.target)) fermerListe(false); });

/* ---------- Récapitulatif ---------- */
function libelleCouverts() { return resa.couverts + ' ' + I18N.t(resa.couverts > 1 ? 'resa.personnes' : 'resa.personne'); }
function afficherRecap() {
  const aChoisir = '<span style="opacity:.6">' + I18N.t('resa.a-choisir') + '</span>';
  const lignes = [
    ['resa.date', resa.date ? dateLongue(resa.date) : aChoisir],
    ['resa.heure', resa.heure ? heureLisible(resa.heure) : aChoisir],
    ['resa.couverts', libelleCouverts()]
  ];
  if (resa.occasion !== 'aucune') lignes.push(['resa.occasion.label', I18N.t('resa.occ.' + resa.occasion)]);
  document.getElementById('recap-liste').innerHTML = lignes.map(function (l) {
    return '<dt>' + I18N.t(l[0]) + '</dt><dd>' + l[1] + '</dd>';
  }).join('');
}

/* ---------- Validation et envoi ---------- */
const champs = { nom: document.getElementById('nom'), telephone: document.getElementById('telephone'), message: document.getElementById('message') };

function donnees() {
  return { date: resa.date, heure: resa.heure, couverts: resa.couverts, nom: champs.nom.value, telephone: champs.telephone.value };
}
function montrerErreurs(erreurs) {
  ['date', 'heure', 'couverts', 'nom', 'telephone'].forEach(function (cle) {
    const enErreur = erreurs.indexOf(cle) !== -1;
    document.getElementById('erreur-' + cle).textContent = enErreur ? I18N.t('resa.err.' + cle) : '';
    if (champs[cle]) champs[cle].setAttribute('aria-invalid', enErreur);
  });
}
// Après un premier essai, les messages s'effacent dès que le champ est corrigé (pendant la frappe).
function revalider() { if (formulaireEnvoye) montrerErreurs(Horaires.verifierReservation(donnees(), maintenantMarrakech())); }
champs.nom.addEventListener('input', revalider);
champs.telephone.addEventListener('input', revalider);

// Nom et téléphone mémorisés pour la prochaine fois (données nettoyées à la lecture).
try {
  const memo = JSON.parse(localStorage.getItem('dz_client') || '{}');
  if (typeof memo.nom === 'string') champs.nom.value = memo.nom.slice(0, 60);
  if (typeof memo.telephone === 'string') champs.telephone.value = memo.telephone.slice(0, 20);
} catch (e) { /* stockage illisible ou bloqué : on ignore */ }

function messageWhatsApp() {
  const d = donnees();
  const lignes = [
    I18N.t('resa.whatsapp.intro'),
    '• ' + I18N.t('resa.date') + ' : ' + dateLongue(d.date),
    '• ' + I18N.t('resa.heure') + ' : ' + heureLisible(d.heure),
    '• ' + I18N.t('resa.couverts') + ' : ' + resa.couverts,
    '• ' + I18N.t('resa.nom') + ' : ' + d.nom.trim(),
    '• ' + I18N.t('resa.telephone') + ' : ' + d.telephone.trim()
  ];
  if (resa.occasion !== 'aucune') lignes.push('• ' + I18N.t('resa.occasion.label') + ' : ' + I18N.t('resa.occ.' + resa.occasion));
  if (champs.message.value.trim()) lignes.push('• ' + champs.message.value.trim());
  return lignes.join('\n');
}

function afficherConfirmation() {
  document.getElementById('lien-whatsapp').innerHTML = ICONES.whatsapp + I18N.t('resa.ok.whatsapp');
  document.getElementById('lien-whatsapp').href = lienWhatsApp(messageWhatsApp());
}

document.getElementById('formulaire').addEventListener('submit', function (e) {
  e.preventDefault();
  formulaireEnvoye = true;
  const erreurs = Horaires.verifierReservation(donnees(), maintenantMarrakech());
  montrerErreurs(erreurs);
  if (erreurs.length) {
    // On amène le visiteur sur la première erreur.
    const premiere = erreurs[0];
    const cible = champs[premiere] || document.getElementById(premiere === 'date' ? 'calendrier' : premiere === 'heure' ? 'creneaux' : 'plus');
    cible.scrollIntoView({ behavior: 'smooth', block: 'center' });
    if (champs[premiere]) champs[premiere].focus({ preventScroll: true });
    return;
  }
  try { localStorage.setItem('dz_client', JSON.stringify({ nom: champs.nom.value.trim(), telephone: champs.telephone.value.trim() })); } catch (err) { /* rien */ }
  afficherConfirmation();
  this.hidden = true;
  const conf = document.getElementById('confirmation');
  conf.hidden = false;
  conf.focus({ preventScroll: true });
  conf.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.getElementById('modifier').addEventListener('click', function () {
  document.getElementById('confirmation').hidden = true;
  document.getElementById('formulaire').hidden = false;
  champs.nom.focus();
});

/* ---------- Démarrage ---------- */
function toutAfficher() {
  afficherCalendrier();
  afficherCreneaux();
  afficherCouverts();
  afficherListe();
  afficherRecap();
  revalider();
  if (!document.getElementById('confirmation').hidden) afficherConfirmation();
}

(function demarrer() {
  const maintenant = maintenantMarrakech();
  // Premier jour libre présélectionné : on voit tout de suite les créneaux.
  let iso = maintenant.date;
  for (let i = 0; i <= H.joursMaximum && !jourDisponible(iso, maintenant); i++) iso = Horaires.ajouterJours(maintenant.date, i + 1);
  if (jourDisponible(iso, maintenant)) resa.date = iso;
  moisAffiche = (resa.date || maintenant.date).slice(0, 7);
  toutAfficher();
})();
window.addEventListener('langue:change', toutAfficher);
