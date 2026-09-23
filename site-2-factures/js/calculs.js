/* =========================================================
   calculs.js — Toute la logique de calcul de l'application
   ---------------------------------------------------------
   Ce fichier ne touche JAMAIS à la page (pas de document,
   pas de window) : il ne contient que des fonctions "pures".
   Même entrée = même sortie, toujours. Avantage : on peut
   les tester automatiquement (voir tests/calculs.test.js).

   Règle d'or : tous les montants sont stockés en CENTIMES
   (nombres entiers). 12,50 DH = 1250. Pourquoi ? Parce que
   les ordinateurs calculent mal les décimales :
   0,1 + 0,2 = 0,30000000000000004 en JavaScript.
   Avec des entiers, pas d'erreur d'arrondi sur une facture.
   ========================================================= */

(function (racine) {
  'use strict';

  // Taux de TVA en vigueur au Maroc (en %).
  const TAUX_TVA = [20, 14, 10, 7, 0];

  /* ---------- Montants ---------- */

  // Total d'une ligne en centimes : quantité × prix unitaire, arrondi au centime.
  function totalLigne(ligne) {
    return Math.round((Number(ligne.quantite) || 0) * (Number(ligne.prixUnitaire) || 0));
  }

  // Calcule tous les totaux d'un document.
  // La remise globale (en %) est appliquée à chaque taux de TVA séparément :
  // c'est ce que demande la loi, la TVA se calcule sur le montant APRÈS remise.
  function calculerTotaux(lignes, remisePourcent) {
    const remise = Math.min(Math.max(Number(remisePourcent) || 0, 0), 100);
    const basesParTaux = {};
    let sousTotalHT = 0;

    (lignes || []).forEach(function (ligne) {
      const montant = totalLigne(ligne);
      const taux = Number(ligne.tva) || 0;
      sousTotalHT += montant;
      basesParTaux[taux] = (basesParTaux[taux] || 0) + montant;
    });

    let totalHT = 0;
    let totalTVA = 0;
    const tvaParTaux = Object.keys(basesParTaux)
      .map(Number)
      .sort(function (a, b) { return b - a; })     // du taux le plus élevé au plus bas
      .map(function (taux) {
        const baseNette = basesParTaux[taux] - Math.round(basesParTaux[taux] * remise / 100);
        const montantTVA = Math.round(baseNette * taux / 100);
        totalHT += baseNette;
        totalTVA += montantTVA;
        return { taux: taux, base: baseNette, montant: montantTVA };
      });

    return {
      sousTotalHT: sousTotalHT,
      montantRemise: sousTotalHT - totalHT,  // calculé par différence : toujours cohérent au centime près
      totalHT: totalHT,
      tvaParTaux: tvaParTaux,
      totalTVA: totalTVA,
      totalTTC: totalHT + totalTVA
    };
  }

  // 1248050 → "12 480,50 DH". On formate nous-mêmes (au lieu d'Intl) pour avoir
  // exactement le même résultat sur tous les navigateurs et dans les tests.
  function formaterMontant(centimes, sansDevise) {
    const negatif = centimes < 0;
    const valeur = Math.abs(Math.round(centimes));
    const entiers = String(Math.floor(valeur / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const decimales = String(valeur % 100).padStart(2, '0');
    return (negatif ? '−' : '') + entiers + ',' + decimales + (sansDevise ? '' : ' DH');
  }

  // Lit un montant tapé par l'utilisateur : "1 234,5" ou "1234.50" → 123450 centimes.
  // Renvoie null si ce n'est pas un nombre valide.
  function lireMontant(texte) {
    const propre = String(texte).replace(/[\s  ]/g, '').replace(',', '.');
    if (!/^-?\d*\.?\d{0,2}$/.test(propre) || propre === '' || propre === '.' || propre === '-') return null;
    return Math.round(parseFloat(propre) * 100);
  }

  // Lit une quantité : accepte les décimales (ex. 2,5 heures ou 12,75 m²).
  function lireQuantite(texte) {
    const propre = String(texte).replace(/\s/g, '').replace(',', '.');
    if (!/^\d*\.?\d{0,3}$/.test(propre) || propre === '' || propre === '.') return null;
    return parseFloat(propre);
  }

  /* ---------- Montant en toutes lettres ---------- */
  // Obligatoire sur les factures marocaines : « Arrêtée la présente facture à la somme de… »
  // Règles de l'orthographe française traditionnelle :
  //  - 21, 31, 41, 51, 61, 71 prennent « et » (vingt et un, soixante et onze) ;
  //  - 80 = quatre-vingts (avec s), mais 81 = quatre-vingt-un ;
  //  - cent prend un s au pluriel seulement s'il termine le nombre (deux cents / deux cent un) ;
  //  - mille est invariable ; million et milliard s'accordent.

  const UNITES = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf',
    'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
  const DIZAINES = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

  // De 0 à 99.
  function moinsDeCent(n) {
    if (n < 20) return UNITES[n];
    const dizaine = Math.floor(n / 10);
    const unite = n % 10;
    if (dizaine === 7 || dizaine === 9) {
      // 70-79 = soixante + 10..19 ; 90-99 = quatre-vingt + 10..19
      const base = dizaine === 7 ? 'soixante' : 'quatre-vingt';
      const reste = 10 + unite;
      return base + (dizaine === 7 && unite === 1 ? ' et ' : '-') + UNITES[reste];
    }
    if (dizaine === 8) return unite === 0 ? 'quatre-vingts' : 'quatre-vingt-' + UNITES[unite];
    if (unite === 0) return DIZAINES[dizaine];
    if (unite === 1) return DIZAINES[dizaine] + ' et un';
    return DIZAINES[dizaine] + '-' + UNITES[unite];
  }

  // De 0 à 999. "fin" = ce bloc termine-t-il le nombre ? (pour le s de cents et de quatre-vingts)
  function moinsDeMille(n, fin) {
    const centaines = Math.floor(n / 100);
    const reste = n % 100;
    let texte = '';
    if (centaines > 0) {
      texte = centaines === 1 ? 'cent' : UNITES[centaines] + ' cent';
      if (centaines > 1 && reste === 0 && fin) texte += 's';
    }
    if (reste > 0) {
      let r = moinsDeCent(reste);
      if (!fin && r === 'quatre-vingts') r = 'quatre-vingt';     // quatre-vingt mille
      texte += (texte ? ' ' : '') + r;
    }
    return texte;
  }

  function nombreEnLettres(n) {
    n = Math.floor(Math.abs(n));
    if (n === 0) return 'zéro';
    const milliards = Math.floor(n / 1e9);
    const millions = Math.floor((n % 1e9) / 1e6);
    const milliers = Math.floor((n % 1e6) / 1e3);
    const reste = n % 1e3;
    const morceaux = [];
    if (milliards) morceaux.push(moinsDeMille(milliards, true) + (milliards > 1 ? ' milliards' : ' milliard'));
    if (millions) morceaux.push(moinsDeMille(millions, true) + (millions > 1 ? ' millions' : ' million'));
    if (milliers) morceaux.push(milliers === 1 ? 'mille' : moinsDeMille(milliers, false) + ' mille');
    if (reste) morceaux.push(moinsDeMille(reste, true));
    return morceaux.join(' ');
  }

  // 1248050 → "douze mille quatre cent quatre-vingts dirhams et cinquante centimes"
  function montantEnLettres(centimes) {
    const valeur = Math.abs(Math.round(centimes));
    const dirhams = Math.floor(valeur / 100);
    const cts = valeur % 100;
    let texte = nombreEnLettres(dirhams) + (dirhams > 1 ? ' dirhams' : ' dirham');
    if (cts > 0) texte += ' et ' + nombreEnLettres(cts) + (cts > 1 ? ' centimes' : ' centime');
    return texte;
  }

  /* ---------- Numérotation ---------- */

  // Les numéros se suivent sans trou, un compteur par type et par année :
  // DEV-2026-001, DEV-2026-002… puis FAC-2026-001.
  function prochainNumero(type, annee, compteurs) {
    const cle = type + '-' + annee;
    const suivant = ((compteurs && compteurs[cle]) || 0) + 1;
    const prefixe = type === 'facture' ? 'FAC' : 'DEV';
    return { numero: prefixe + '-' + annee + '-' + String(suivant).padStart(3, '0'), cle: cle, valeur: suivant };
  }

  /* ---------- Dates ---------- */

  // Les dates sont stockées au format ISO "2026-09-23" : elles se trient comme du texte.
  function dateISO(date) {
    const d = date || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function ajouterJours(iso, jours) {
    const p = iso.split('-').map(Number);
    const d = new Date(p[0], p[1] - 1, p[2] + jours);   // new Date gère le passage de mois/année
    return dateISO(d);
  }

  function ecartEnJours(isoA, isoB) {
    const a = isoA.split('-').map(Number);
    const b = isoB.split('-').map(Number);
    return Math.round((Date.UTC(b[0], b[1] - 1, b[2]) - Date.UTC(a[0], a[1] - 1, a[2])) / 86400000);
  }

  const MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  // "2026-09-23" → "23 septembre 2026"
  function formaterDate(iso) {
    if (!iso) return '—';
    const p = iso.split('-').map(Number);
    return p[2] + (p[2] === 1 ? 'er' : '') + ' ' + MOIS[p[1] - 1] + ' ' + p[0];
  }

  /* ---------- Statuts ---------- */

  // Le statut "en retard" n'est jamais enregistré : il est CALCULÉ à partir de la date.
  // Ainsi une facture passe en retard toute seule le lendemain de son échéance.
  function statutEffectif(doc, aujourdhui) {
    if (doc.type === 'facture' && doc.statut === 'emise' && doc.echeance && doc.echeance < aujourdhui) return 'en-retard';
    return doc.statut;
  }

  /* ---------- Validations ---------- */

  // ICE (Identifiant Commun de l'Entreprise, Maroc) : exactement 15 chiffres.
  function iceValide(texte) {
    return /^\d{15}$/.test(String(texte).replace(/\s/g, ''));
  }
  function emailValide(texte) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(texte).trim());
  }
  function telephoneValide(texte) {
    return /^(\+212|0)[5-7]\d{8}$/.test(String(texte).replace(/[\s.-]/g, ''));
  }

  const API = {
    TAUX_TVA: TAUX_TVA,
    totalLigne: totalLigne,
    calculerTotaux: calculerTotaux,
    formaterMontant: formaterMontant,
    lireMontant: lireMontant,
    lireQuantite: lireQuantite,
    nombreEnLettres: nombreEnLettres,
    montantEnLettres: montantEnLettres,
    prochainNumero: prochainNumero,
    dateISO: dateISO,
    ajouterJours: ajouterJours,
    ecartEnJours: ecartEnJours,
    formaterDate: formaterDate,
    statutEffectif: statutEffectif,
    iceValide: iceValide,
    emailValide: emailValide,
    telephoneValide: telephoneValide
  };

  // Le même fichier sert dans le navigateur (variable globale Calculs)
  // et dans Node.js pour les tests (module.exports).
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  else racine.Calculs = API;
})(this);
