/* =========================================================
   horaires.js — Horaires, créneaux de réservation, "ouvert maintenant"
   ---------------------------------------------------------
   Fonctions "pures" : elles ne lisent ni la page ni l'horloge.
   On leur donne la date et l'heure ("maintenant") en paramètre :
   c'est ce qui permet de les tester automatiquement
   (tests/horaires.test.js) avec n'importe quel jour et heure.

   Les heures sont manipulées en MINUTES depuis minuit :
   19h30 = 19 × 60 + 30 = 1170. Plus simple à comparer et à additionner.
   ========================================================= */

(function (racine) {
  'use strict';

  const HORAIRES = {
    jourFerme: 1,                 // 0 = dimanche, 1 = lundi… (comme Date.getDay())
    delaiMinimum: 60,             // on ne réserve pas moins d'une heure à l'avance
    joursMaximum: 60,             // ni plus de 60 jours à l'avance
    pasMinutes: 30,               // un créneau toutes les 30 minutes
    couvertsMax: 12,              // au-delà : groupe, contact par WhatsApp
    services: [
      { nom: 'dejeuner', debut: '12:30', fin: '15:00', derniereResa: '14:00' },
      { nom: 'diner', debut: '19:00', fin: '23:30', derniereResa: '22:30' }
    ]
  };

  // "19:30" → 1170
  function enMinutes(hhmm) {
    const p = hhmm.split(':').map(Number);
    return p[0] * 60 + p[1];
  }
  // 1170 → "19:30"
  function enHeure(minutes) {
    return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
  }
  // Jour de la semaine d'une date ISO, sans fuseau horaire (0 = dimanche).
  function jourSemaine(iso) {
    const p = iso.split('-').map(Number);
    return new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay();
  }
  function ajouterJours(iso, n) {
    const p = iso.split('-').map(Number);
    const d = new Date(Date.UTC(p[0], p[1] - 1, p[2] + n));
    return d.toISOString().slice(0, 10);
  }
  function ecartJours(isoA, isoB) {
    const a = isoA.split('-').map(Number), b = isoB.split('-').map(Number);
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
  }

  function estJourOuvert(iso) { return jourSemaine(iso) !== HORAIRES.jourFerme; }

  // Une date est-elle réservable ? (pas passée, pas un lundi, pas trop loin)
  function dateReservable(iso, maintenant) {
    const ecart = ecartJours(maintenant.date, iso);
    return ecart >= 0 && ecart <= HORAIRES.joursMaximum && estJourOuvert(iso) && creneaux(iso, maintenant).some(function (c) { return c.disponible; });
  }

  // Tous les créneaux d'une journée, avec leur disponibilité.
  // "maintenant" = { date: '2026-09-23', minutes: 1125 }
  function creneaux(iso, maintenant) {
    if (!estJourOuvert(iso)) return [];
    const limite = iso === maintenant.date ? maintenant.minutes + HORAIRES.delaiMinimum : -1;
    const liste = [];
    HORAIRES.services.forEach(function (s) {
      for (let m = enMinutes(s.debut); m <= enMinutes(s.derniereResa); m += HORAIRES.pasMinutes) {
        liste.push({ heure: enHeure(m), service: s.nom, disponible: iso > maintenant.date || m >= limite });
      }
    });
    return liste;
  }

  // État du restaurant à un instant donné : ouvert ? jusqu'à quand ? sinon, quand rouvre-t-il ?
  function etatOuverture(maintenant) {
    if (estJourOuvert(maintenant.date)) {
      for (const s of HORAIRES.services) {
        if (maintenant.minutes >= enMinutes(s.debut) && maintenant.minutes < enMinutes(s.fin)) {
          return { ouvert: true, jusqua: s.fin, service: s.nom };
        }
      }
    }
    // Fermé : on cherche la prochaine ouverture (aujourd'hui plus tard, ou les jours suivants).
    for (let j = 0; j <= 7; j++) {
      const jour = ajouterJours(maintenant.date, j);
      if (!estJourOuvert(jour)) continue;
      for (const s of HORAIRES.services) {
        if (j > 0 || enMinutes(s.debut) > maintenant.minutes) {
          return { ouvert: false, prochaineDate: jour, prochaineHeure: s.debut, joursAvant: j };
        }
      }
    }
    return { ouvert: false };
  }

  // Vérifie une demande de réservation. Renvoie la liste des erreurs (vide = tout va bien).
  function verifierReservation(r, maintenant) {
    const erreurs = [];
    if (!r.date || !dateReservable(r.date, maintenant)) erreurs.push('date');
    else if (!r.heure || !creneaux(r.date, maintenant).some(function (c) { return c.heure === r.heure && c.disponible; })) erreurs.push('heure');
    if (!(r.couverts >= 1 && r.couverts <= HORAIRES.couvertsMax)) erreurs.push('couverts');
    if (!r.nom || r.nom.trim().length < 2) erreurs.push('nom');
    if (!/^(\+212|0)[5-7]\d{8}$/.test(String(r.telephone || '').replace(/[\s.-]/g, ''))) erreurs.push('telephone');
    return erreurs;
  }

  const API = {
    HORAIRES: HORAIRES, enMinutes: enMinutes, enHeure: enHeure, jourSemaine: jourSemaine,
    ajouterJours: ajouterJours, ecartJours: ecartJours, estJourOuvert: estJourOuvert,
    dateReservable: dateReservable, creneaux: creneaux, etatOuverture: etatOuverture,
    verifierReservation: verifierReservation
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Horaires = API;
})(this);
