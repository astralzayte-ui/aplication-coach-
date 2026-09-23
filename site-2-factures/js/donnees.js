/* =========================================================
   donnees.js — Les données de l'application (le "store")
   ---------------------------------------------------------
   Un seul objet "etat" contient tout : l'entreprise, les
   clients, les documents (devis et factures), les compteurs
   de numérotation et les préférences.

   - Il est enregistré dans le navigateur (localStorage).
   - Toutes les modifications passent par les fonctions de ce
     fichier : le reste de l'application ne modifie jamais
     "etat" directement. Après chaque modification, on
     enregistre et on prévient les écrans abonnés (abonner()).
   - Les données lues sont toujours nettoyées : on ne fait
     jamais confiance à ce qui vient du stockage ou d'un
     fichier importé.
   ========================================================= */

const Donnees = (function () {
  'use strict';

  const CLE = 'qalam_donnees';
  const VERSION = 1;
  const abonnes = [];
  let etat = null;

  /* ---------- Outils ---------- */

  // Identifiant unique : horodatage + hasard, en base 36 (lettres et chiffres).
  function nouvelId(prefixe) {
    return prefixe + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
  function texte(v, max) { return String(v == null ? '' : v).slice(0, max || 500); }
  function entier(v, min, max) {
    const n = Math.round(Number(v));
    return Number.isFinite(n) ? Math.min(Math.max(n, min), max) : min;
  }
  function dateValide(v) { return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : ''; }

  const STATUTS = {
    devis: ['brouillon', 'envoye', 'accepte', 'refuse'],
    facture: ['brouillon', 'emise', 'payee']
  };

  /* ---------- Nettoyage (données du stockage ou d'un import) ---------- */

  function nettoyerLigne(l) {
    return {
      id: texte(l && l.id, 40) || nouvelId('l'),
      designation: texte(l && l.designation, 300),
      quantite: Math.min(Math.max(Number(l && l.quantite) || 0, 0), 1e6),
      prixUnitaire: entier(l && l.prixUnitaire, 0, 1e11),          // centimes
      tva: Calculs.TAUX_TVA.indexOf(Number(l && l.tva)) !== -1 ? Number(l.tva) : 20
    };
  }

  function nettoyerDocument(d, idsClients) {
    if (!d || (d.type !== 'devis' && d.type !== 'facture')) return null;
    return {
      id: texte(d.id, 40) || nouvelId('d'),
      type: d.type,
      numero: texte(d.numero, 30),
      clientId: idsClients.indexOf(d.clientId) !== -1 ? d.clientId : '',
      date: dateValide(d.date) || Calculs.dateISO(),
      echeance: dateValide(d.echeance),
      statut: STATUTS[d.type].indexOf(d.statut) !== -1 ? d.statut : 'brouillon',
      lignes: Array.isArray(d.lignes) ? d.lignes.slice(0, 200).map(nettoyerLigne) : [],
      remise: Math.min(Math.max(Number(d.remise) || 0, 0), 100),
      notes: texte(d.notes, 2000),
      origineId: texte(d.origineId, 40),
      factureId: texte(d.factureId, 40),
      payeeLe: dateValide(d.payeeLe),
      modifieLe: Number(d.modifieLe) || Date.now()
    };
  }

  function nettoyerClient(c) {
    if (!c || !texte(c.nom).trim()) return null;
    return {
      id: texte(c.id, 40) || nouvelId('c'),
      nom: texte(c.nom, 120).trim(),
      ice: texte(c.ice, 20).replace(/\s/g, ''),
      email: texte(c.email, 120).trim(),
      telephone: texte(c.telephone, 30).trim(),
      adresse: texte(c.adresse, 200).trim(),
      ville: texte(c.ville, 60).trim()
    };
  }

  function nettoyerEtat(brut) {
    if (!brut || typeof brut !== 'object' || !Array.isArray(brut.clients) || !Array.isArray(brut.documents)) return null;
    const clients = brut.clients.map(nettoyerClient).filter(Boolean);
    const ids = clients.map(function (c) { return c.id; });
    const e = brut.entreprise || {};
    const compteurs = {};
    Object.keys(brut.compteurs || {}).forEach(function (cle) {
      if (/^(devis|facture)-\d{4}$/.test(cle)) compteurs[cle] = entier(brut.compteurs[cle], 0, 99999);
    });
    const p = brut.preferences || {};
    return {
      version: VERSION,
      entreprise: {
        nom: texte(e.nom, 120), activite: texte(e.activite, 120), adresse: texte(e.adresse, 200),
        ville: texte(e.ville, 60), telephone: texte(e.telephone, 30), email: texte(e.email, 120),
        ice: texte(e.ice, 20), identifiantFiscal: texte(e.identifiantFiscal, 20), rc: texte(e.rc, 30),
        rib: texte(e.rib, 40), conditions: texte(e.conditions, 500)
      },
      clients: clients,
      documents: brut.documents.map(function (d) { return nettoyerDocument(d, ids); }).filter(Boolean),
      compteurs: compteurs,
      preferences: {
        theme: ['systeme', 'clair', 'sombre'].indexOf(p.theme) !== -1 ? p.theme : 'systeme',
        tvaParDefaut: Calculs.TAUX_TVA.indexOf(Number(p.tvaParDefaut)) !== -1 ? Number(p.tvaParDefaut) : 20,
        delaiPaiement: entier(p.delaiPaiement == null ? 30 : p.delaiPaiement, 0, 365)
      }
    };
  }

  /* ---------- Données de démonstration ---------- */
  // Dates calculées à partir d'aujourd'hui : la démo reste réaliste quel que soit le jour.

  function donneesDemo() {
    const auj = Calculs.dateISO();
    const j = function (n) { return Calculs.ajouterJours(auj, n); };
    const an = auj.slice(0, 4);
    const clients = [
      { id: 'c1', nom: 'Riad Les Jardins d\'Amal', ice: '002345678000041', email: 'contact@jardins-amal.ma', telephone: '0524 38 12 45', adresse: '14 Derb Sidi Bouloukat, Médina', ville: 'Marrakech' },
      { id: 'c2', nom: 'Atlas Menuiserie SARL', ice: '001987654000022', email: 'compta@atlas-menuiserie.ma', telephone: '0661 45 78 90', adresse: 'Zone industrielle Sidi Ghanem, lot 212', ville: 'Marrakech' },
      { id: 'c3', nom: 'Galerie Ocre', ice: '003456789000017', email: 'bonjour@galerie-ocre.ma', telephone: '0678 22 10 34', adresse: '8 rue de la Liberté, Guéliz', ville: 'Marrakech' },
      { id: 'c4', nom: 'M. Karim Benali', ice: '', email: 'k.benali@exemple.ma', telephone: '0612 34 56 78', adresse: 'Villa 27, route de Fès, Palmeraie', ville: 'Marrakech' },
      { id: 'c5', nom: 'Hôtel Tadla Essaouira', ice: '004567890000035', email: 'direction@hotel-tadla.ma', telephone: '0524 47 60 11', adresse: '3 avenue Mohammed V', ville: 'Essaouira' }
    ];
    const L = function (designation, quantite, prixDH, tva) {
      return { designation: designation, quantite: quantite, prixUnitaire: Math.round(prixDH * 100), tva: tva == null ? 20 : tva };
    };
    const documents = [
      { id: 'd1', type: 'facture', numero: 'FAC-' + an + '-001', clientId: 'c2', date: j(-74), echeance: j(-44), statut: 'payee', payeeLe: j(-50),
        lignes: [L('Conception d\'un showroom (plans et 3D)', 1, 18000), L('Suivi de chantier (demi-journées)', 6, 1500)], remise: 0 },
      { id: 'd2', type: 'facture', numero: 'FAC-' + an + '-002', clientId: 'c1', date: j(-52), echeance: j(-22), statut: 'payee', payeeLe: j(-25),
        lignes: [L('Rénovation du salon marocain : conception', 1, 12500), L('Sélection et achat du mobilier (honoraires)', 1, 4800), L('Zellige artisanal, pose comprise (m²)', 18, 650)], remise: 5 },
      { id: 'd3', type: 'facture', numero: 'FAC-' + an + '-003', clientId: 'c3', date: j(-40), echeance: j(-10), statut: 'emise',
        lignes: [L('Scénographie de l\'exposition « Terres »', 1, 22000), L('Éclairage d\'exposition (location, forfait)', 1, 6500, 20)], remise: 0 },
      { id: 'd4', type: 'facture', numero: 'FAC-' + an + '-004', clientId: 'c4', date: j(-35), echeance: j(-5), statut: 'emise',
        lignes: [L('Aménagement de la terrasse : plans', 1, 7500), L('Visites de conseil à domicile', 3, 900)], remise: 0 },
      { id: 'd5', type: 'facture', numero: 'FAC-' + an + '-005', clientId: 'c5', date: j(-9), echeance: j(21), statut: 'payee', payeeLe: j(-2),
        lignes: [L('Refonte de 12 chambres : planches d\'ambiance', 12, 2200), L('Déplacement Essaouira (aller-retour)', 2, 850, 20)], remise: 10 },
      { id: 'd6', type: 'facture', numero: 'FAC-' + an + '-006', clientId: 'c1', date: j(-3), echeance: j(27), statut: 'emise',
        lignes: [L('Conception de la suite « Amal »', 1, 9800), L('Tapis berbère sur mesure (fourniture)', 2, 4200)], remise: 0 },
      { id: 'd7', type: 'devis', numero: 'DEV-' + an + '-001', clientId: 'c2', date: j(-20), echeance: j(10), statut: 'accepte', factureId: '',
        lignes: [L('Agencement de bureaux (200 m²)', 1, 26000), L('Mobilier sur mesure : études', 1, 8500)], remise: 5 },
      { id: 'd8', type: 'devis', numero: 'DEV-' + an + '-002', clientId: 'c3', date: j(-12), echeance: j(18), statut: 'envoye',
        lignes: [L('Réaménagement de la boutique de la galerie', 1, 14500), L('Vitrines et présentoirs : conception', 4, 1800)], remise: 0 },
      { id: 'd9', type: 'devis', numero: 'DEV-' + an + '-003', clientId: 'c4', date: j(-6), echeance: j(24), statut: 'envoye',
        lignes: [L('Piscine et pool-house : aménagement paysager', 1, 32000)], remise: 0 },
      { id: 'd10', type: 'devis', numero: 'DEV-' + an + '-004', clientId: 'c5', date: j(-1), echeance: j(29), statut: 'brouillon',
        lignes: [L('Restaurant de l\'hôtel : concept et plans', 1, 18500), L('Choix des luminaires et textiles', 1, 5200)], remise: 0 }
    ];
    return {
      version: VERSION,
      entreprise: {
        nom: 'Atelier Nour', activite: 'Architecture d\'intérieur', adresse: '27 rue Ibn Aïcha, Guéliz', ville: 'Marrakech',
        telephone: '0524 43 21 09', email: 'contact@atelier-nour.ma',
        ice: '001122334000055', identifiantFiscal: '45123789', rc: 'Marrakech 98765', rib: '011 450 0000123456789012 34',
        conditions: 'Paiement par virement bancaire. Pénalités de retard au taux légal en vigueur.'
      },
      clients: clients,
      documents: documents,
      compteurs: { ['facture-' + an]: 6, ['devis-' + an]: 4 },
      preferences: { theme: 'systeme', tvaParDefaut: 20, delaiPaiement: 30 }
    };
  }

  /* ---------- Chargement, enregistrement, abonnements ---------- */

  function charger() {
    try {
      etat = nettoyerEtat(JSON.parse(localStorage.getItem(CLE)));
    } catch (e) {
      etat = null;
    }
    if (!etat) etat = nettoyerEtat(donneesDemo());
    return etat;
  }

  function sauver() {
    try { localStorage.setItem(CLE, JSON.stringify(etat)); } catch (e) { /* stockage indisponible : on garde en mémoire */ }
    abonnes.forEach(function (fn) { fn(); });
  }

  // Un écran s'abonne pour être prévenu de chaque changement de données.
  function abonner(fn) { abonnes.push(fn); }

  // Modification faite dans un autre onglet : on recharge et on prévient les écrans.
  window.addEventListener('storage', function (e) {
    if (e.key === CLE) { charger(); abonnes.forEach(function (fn) { fn(); }); }
  });

  /* ---------- Clients ---------- */

  function client(id) { return etat.clients.find(function (c) { return c.id === id; }); }

  function enregistrerClient(donnees) {
    const propre = nettoyerClient(donnees);
    if (!propre) return null;
    const i = etat.clients.findIndex(function (c) { return c.id === propre.id; });
    if (i === -1) etat.clients.push(propre); else etat.clients[i] = propre;
    sauver();
    return propre;
  }

  // Un client lié à des documents ne peut pas être supprimé (on perdrait l'historique).
  function supprimerClient(id) {
    const utilise = etat.documents.some(function (d) { return d.clientId === id; });
    if (utilise) return false;
    etat.clients = etat.clients.filter(function (c) { return c.id !== id; });
    sauver();
    return true;
  }

  /* ---------- Documents ---------- */

  function documentParId(id) { return etat.documents.find(function (d) { return d.id === id; }); }

  function attribuerNumero(doc) {
    const annee = doc.date.slice(0, 4);
    const n = Calculs.prochainNumero(doc.type, annee, etat.compteurs);
    etat.compteurs[n.cle] = n.valeur;
    doc.numero = n.numero;
  }

  function creerDocument(type, modele) {
    const auj = Calculs.dateISO();
    const doc = nettoyerDocument(Object.assign({
      id: nouvelId('d'), type: type, date: auj,
      echeance: Calculs.ajouterJours(auj, etat.preferences.delaiPaiement),
      statut: 'brouillon',
      lignes: [{ designation: '', quantite: 1, prixUnitaire: 0, tva: etat.preferences.tvaParDefaut }]
    }, modele || {}, { id: nouvelId('d'), type: type }), etat.clients.map(function (c) { return c.id; }));
    // Un devis reçoit son numéro tout de suite. Une facture le reçoit seulement à l'émission :
    // la loi impose une numérotation continue, sans trou, des factures réellement émises.
    doc.numero = '';
    if (type === 'devis') attribuerNumero(doc);
    etat.documents.push(doc);
    sauver();
    return doc;
  }

  function modifierDocument(id, modifications) {
    const doc = documentParId(id);
    if (!doc) return null;
    const ids = etat.clients.map(function (c) { return c.id; });
    const nouveau = nettoyerDocument(Object.assign({}, doc, modifications, { id: doc.id, type: doc.type }), ids);
    nouveau.modifieLe = Date.now();
    Object.assign(doc, nouveau);
    sauver();
    return doc;
  }

  // Émettre une facture : elle reçoit son numéro définitif et ne peut plus être supprimée.
  function emettreFacture(id) {
    const doc = documentParId(id);
    if (!doc || doc.type !== 'facture' || doc.statut !== 'brouillon') return null;
    doc.date = Calculs.dateISO();
    if (!doc.echeance || doc.echeance < doc.date) doc.echeance = Calculs.ajouterJours(doc.date, etat.preferences.delaiPaiement);
    attribuerNumero(doc);
    doc.statut = 'emise';
    doc.modifieLe = Date.now();
    sauver();
    return doc;
  }

  function marquerPayee(id, date) {
    const doc = documentParId(id);
    if (!doc || doc.type !== 'facture' || doc.statut !== 'emise') return null;
    doc.statut = 'payee';
    doc.payeeLe = date || Calculs.dateISO();
    sauver();
    return doc;
  }

  function annulerPaiement(id) {
    const doc = documentParId(id);
    if (!doc || doc.statut !== 'payee') return null;
    doc.statut = 'emise';
    doc.payeeLe = '';
    sauver();
    return doc;
  }

  // Transformer un devis en facture : les lignes, le client et la remise sont repris.
  function transformerEnFacture(idDevis) {
    const devis = documentParId(idDevis);
    if (!devis || devis.type !== 'devis') return null;
    if (devis.factureId && documentParId(devis.factureId)) return documentParId(devis.factureId);   // déjà fait
    const facture = creerDocument('facture', {
      clientId: devis.clientId,
      lignes: devis.lignes.map(function (l) { return Object.assign({}, l, { id: nouvelId('l') }); }),
      remise: devis.remise,
      notes: devis.notes,
      origineId: devis.id
    });
    devis.statut = 'accepte';
    devis.factureId = facture.id;
    sauver();
    return facture;
  }

  function dupliquer(id) {
    const doc = documentParId(id);
    if (!doc) return null;
    return creerDocument(doc.type, {
      clientId: doc.clientId, remise: doc.remise, notes: doc.notes,
      lignes: doc.lignes.map(function (l) { return Object.assign({}, l, { id: nouvelId('l') }); })
    });
  }

  // Une facture émise ou payée ne se supprime pas (obligation légale de conservation).
  function supprimerDocument(id) {
    const doc = documentParId(id);
    if (!doc) return false;
    if (doc.type === 'facture' && doc.statut !== 'brouillon') return false;
    etat.documents = etat.documents.filter(function (d) { return d.id !== id; });
    etat.documents.forEach(function (d) { if (d.factureId === id) d.factureId = ''; });
    sauver();
    return true;
  }

  /* ---------- Réglages, sauvegarde, import ---------- */

  function modifierEntreprise(modifs) {
    Object.assign(etat.entreprise, nettoyerEtat({ clients: [], documents: [], entreprise: Object.assign({}, etat.entreprise, modifs) }).entreprise);
    sauver();
  }
  function modifierPreferences(modifs) {
    etat.preferences = nettoyerEtat({ clients: [], documents: [], preferences: Object.assign({}, etat.preferences, modifs) }).preferences;
    sauver();
  }

  function exporter() { return JSON.stringify(etat, null, 2); }

  // Import d'une sauvegarde : refusé si le fichier n'a pas la bonne forme.
  function importer(texteJSON) {
    let brut;
    try { brut = JSON.parse(texteJSON); } catch (e) { return false; }
    const propre = nettoyerEtat(brut);
    if (!propre) return false;
    etat = propre;
    sauver();
    return true;
  }

  function reinitialiser() {
    etat = nettoyerEtat(donneesDemo());
    sauver();
  }

  charger();

  return {
    get etat() { return etat; },
    abonner: abonner,
    client: client,
    enregistrerClient: enregistrerClient,
    supprimerClient: supprimerClient,
    documentParId: documentParId,
    creerDocument: creerDocument,
    modifierDocument: modifierDocument,
    emettreFacture: emettreFacture,
    marquerPayee: marquerPayee,
    annulerPaiement: annulerPaiement,
    transformerEnFacture: transformerEnFacture,
    dupliquer: dupliquer,
    supprimerDocument: supprimerDocument,
    modifierEntreprise: modifierEntreprise,
    modifierPreferences: modifierPreferences,
    exporter: exporter,
    importer: importer,
    reinitialiser: reinitialiser,
    STATUTS: STATUTS
  };
})();
