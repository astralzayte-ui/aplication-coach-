/* Tests automatiques des horaires et réservations.
   Lancer : node --test site-3-restaurant/tests/*.test.js */

const test = require('node:test');
const assert = require('node:assert/strict');
const H = require('../js/horaires.js');

// 2026-09-23 est un mercredi, 2026-09-28 un lundi.
const mercredi = '2026-09-23';
const lundi = '2026-09-28';
const a = function (date, heure) { return { date: date, minutes: H.enMinutes(heure) }; };

test('conversion heures ↔ minutes', () => {
  assert.equal(H.enMinutes('19:30'), 1170);
  assert.equal(H.enHeure(1170), '19:30');
  assert.equal(H.enHeure(750), '12:30');
});

test('fermé le lundi', () => {
  assert.equal(H.jourSemaine(lundi), 1);
  assert.equal(H.estJourOuvert(lundi), false);
  assert.deepEqual(H.creneaux(lundi, a(mercredi, '10:00')), []);
});

test('créneaux d\'une journée : 12h30 → 14h00 et 19h00 → 22h30', () => {
  const heures = H.creneaux('2026-09-24', a(mercredi, '10:00')).map((c) => c.heure);
  assert.deepEqual(heures, ['12:30', '13:00', '13:30', '14:00', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30']);
});

test('aujourd\'hui : créneaux passés ou à moins d\'une heure indisponibles', () => {
  const c = H.creneaux(mercredi, a(mercredi, '19:10'));
  const dispo = c.filter((x) => x.disponible).map((x) => x.heure);
  assert.deepEqual(dispo, ['20:30', '21:00', '21:30', '22:00', '22:30']);
});

test('ouvert maintenant / prochaine ouverture', () => {
  assert.deepEqual(H.etatOuverture(a(mercredi, '13:00')), { ouvert: true, jusqua: '15:00', service: 'dejeuner' });
  assert.deepEqual(H.etatOuverture(a(mercredi, '16:00')), { ouvert: false, prochaineDate: mercredi, prochaineHeure: '19:00', joursAvant: 0 });
  // Dimanche soir après la fermeture → prochaine ouverture mardi midi (lundi fermé)
  assert.deepEqual(H.etatOuverture(a('2026-09-27', '23:45')), { ouvert: false, prochaineDate: '2026-09-29', prochaineHeure: '12:30', joursAvant: 2 });
});

test('dates réservables : pas dans le passé, pas le lundi, 60 jours maximum', () => {
  const m = a(mercredi, '10:00');
  assert.equal(H.dateReservable('2026-09-22', m), false);
  assert.equal(H.dateReservable(lundi, m), false);
  assert.equal(H.dateReservable('2026-09-24', m), true);
  assert.equal(H.dateReservable(H.ajouterJours(mercredi, 61), m), false);
  // Aujourd'hui à 22h00 : plus aucun créneau disponible → date non réservable
  assert.equal(H.dateReservable(mercredi, a(mercredi, '22:00')), false);
});

test('vérification complète d\'une réservation', () => {
  const m = a(mercredi, '10:00');
  const ok = { date: '2026-09-24', heure: '20:00', couverts: 4, nom: 'Salma', telephone: '06 12 34 56 78' };
  assert.deepEqual(H.verifierReservation(ok, m), []);
  assert.deepEqual(H.verifierReservation({ ...ok, date: lundi }, m), ['date']);
  assert.deepEqual(H.verifierReservation({ ...ok, heure: '17:00' }, m), ['heure']);
  assert.deepEqual(H.verifierReservation({ ...ok, couverts: 20, nom: '', telephone: '123' }, m), ['couverts', 'nom', 'telephone']);
});
