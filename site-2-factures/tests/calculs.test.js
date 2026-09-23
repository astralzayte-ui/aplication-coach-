/* =========================================================
   Tests automatiques des calculs
   ---------------------------------------------------------
   Lancer :  node --test site-2-factures/tests/*.test.js
   Aucune installation : on utilise le lanceur de tests
   intégré à Node.js (node:test) et ses vérifications (assert).
   GitHub relance ces tests à chaque envoi de code
   (voir .github/workflows/tests.yml).
   ========================================================= */

const test = require('node:test');
const assert = require('node:assert/strict');
const C = require('../js/calculs.js');

const E = ' '; // espace insécable utilisée dans les montants

test('total d\'une ligne : quantité × prix, arrondi au centime', () => {
  assert.equal(C.totalLigne({ quantite: 3, prixUnitaire: 1250 }), 3750);
  assert.equal(C.totalLigne({ quantite: 2.5, prixUnitaire: 333 }), 833); // 832,5 → 833
  assert.equal(C.totalLigne({ quantite: 0, prixUnitaire: 999 }), 0);
});

test('totaux sans remise, un seul taux de TVA', () => {
  const t = C.calculerTotaux([{ quantite: 2, prixUnitaire: 100000, tva: 20 }], 0);
  assert.equal(t.totalHT, 200000);
  assert.equal(t.totalTVA, 40000);
  assert.equal(t.totalTTC, 240000);
});

test('totaux avec plusieurs taux de TVA et une remise de 10 %', () => {
  const t = C.calculerTotaux([
    { quantite: 1, prixUnitaire: 100000, tva: 20 },
    { quantite: 1, prixUnitaire: 50000, tva: 10 }
  ], 10);
  assert.equal(t.sousTotalHT, 150000);
  assert.equal(t.montantRemise, 15000);
  assert.equal(t.totalHT, 135000);
  assert.deepEqual(t.tvaParTaux, [
    { taux: 20, base: 90000, montant: 18000 },
    { taux: 10, base: 45000, montant: 4500 }
  ]);
  assert.equal(t.totalTTC, 157500);
});

test('pas d\'erreur de virgule flottante (0,1 + 0,2)', () => {
  const t = C.calculerTotaux([
    { quantite: 1, prixUnitaire: 10, tva: 0 },
    { quantite: 1, prixUnitaire: 20, tva: 0 }
  ], 0);
  assert.equal(t.totalTTC, 30);
});

test('la remise est bornée entre 0 et 100 %', () => {
  assert.equal(C.calculerTotaux([{ quantite: 1, prixUnitaire: 1000, tva: 20 }], 150).totalTTC, 0);
  assert.equal(C.calculerTotaux([{ quantite: 1, prixUnitaire: 1000, tva: 20 }], -5).totalHT, 1000);
});

test('formatage des montants', () => {
  assert.equal(C.formaterMontant(1248050), '12' + E + '480,50' + E + 'DH');
  assert.equal(C.formaterMontant(5), '0,05' + E + 'DH');
  assert.equal(C.formaterMontant(123456789, true), '1' + E + '234' + E + '567,89');
});

test('lecture des montants tapés au clavier', () => {
  assert.equal(C.lireMontant('1 234,5'), 123450);
  assert.equal(C.lireMontant('99.99'), 9999);
  assert.equal(C.lireMontant('12,345'), null);   // 3 décimales refusées
  assert.equal(C.lireMontant('abc'), null);
  assert.equal(C.lireMontant(''), null);
});

test('nombres en lettres : règles de l\'orthographe française', () => {
  const cas = {
    0: 'zéro', 1: 'un', 17: 'dix-sept', 21: 'vingt et un', 71: 'soixante et onze', 72: 'soixante-douze',
    80: 'quatre-vingts', 81: 'quatre-vingt-un', 91: 'quatre-vingt-onze', 99: 'quatre-vingt-dix-neuf',
    100: 'cent', 101: 'cent un', 200: 'deux cents', 201: 'deux cent un', 1000: 'mille', 1001: 'mille un',
    2000: 'deux mille', 80000: 'quatre-vingt mille', 200000: 'deux cent mille',
    1000000: 'un million', 2000000: 'deux millions', 12480: 'douze mille quatre cent quatre-vingts'
  };
  for (const [n, attendu] of Object.entries(cas)) assert.equal(C.nombreEnLettres(Number(n)), attendu, 'pour ' + n);
});

test('montant en lettres avec dirhams et centimes', () => {
  assert.equal(C.montantEnLettres(1248050), 'douze mille quatre cent quatre-vingts dirhams et cinquante centimes');
  assert.equal(C.montantEnLettres(100), 'un dirham');
  assert.equal(C.montantEnLettres(1), 'zéro dirham et un centime');
});

test('numérotation continue par type et par année', () => {
  assert.equal(C.prochainNumero('devis', 2026, {}).numero, 'DEV-2026-001');
  assert.equal(C.prochainNumero('facture', 2026, { 'facture-2026': 41 }).numero, 'FAC-2026-042');
  assert.equal(C.prochainNumero('facture', 2027, { 'facture-2026': 41 }).numero, 'FAC-2027-001');
});

test('dates : ajout de jours avec changement de mois et d\'année', () => {
  assert.equal(C.ajouterJours('2026-12-20', 30), '2027-01-19');
  assert.equal(C.ajouterJours('2028-02-28', 1), '2028-02-29'); // année bissextile
  assert.equal(C.ecartEnJours('2026-09-01', '2026-10-01'), 30);
  assert.equal(C.formaterDate('2026-09-01'), '1er septembre 2026');
});

test('une facture émise passe en retard après son échéance', () => {
  const f = { type: 'facture', statut: 'emise', echeance: '2026-09-10' };
  assert.equal(C.statutEffectif(f, '2026-09-10'), 'emise');
  assert.equal(C.statutEffectif(f, '2026-09-11'), 'en-retard');
  assert.equal(C.statutEffectif({ ...f, statut: 'payee' }, '2026-12-01'), 'payee');
});

test('validations : ICE, e-mail, téléphone marocain', () => {
  assert.ok(C.iceValide('001234567000089'));
  assert.ok(!C.iceValide('12345'));
  assert.ok(C.emailValide('contact@atelier.ma'));
  assert.ok(!C.emailValide('contact@atelier'));
  assert.ok(C.telephoneValide('+212 6 12 34 56 78'));
  assert.ok(!C.telephoneValide('0812345678'));
});
