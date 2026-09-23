/* =========================================================
   vues.js — Les écrans de l'application
   ---------------------------------------------------------
   Chaque écran est une fonction qui :
     1. fabrique son HTML à partir des données (Donnees.etat),
     2. l'insère dans la page,
     3. branche ses événements (clics, saisies).
   Les écrans ne modifient jamais les données eux-mêmes :
   ils appellent les fonctions de donnees.js.
   ========================================================= */

const Vues = (function () {
  'use strict';

  const C = Calculs;
  const LIBELLES_STATUT = {
    brouillon: 'Brouillon', envoye: 'Envoyé', accepte: 'Accepté', refuse: 'Refusé',
    emise: 'Émise', payee: 'Payée', 'en-retard': 'En retard'
  };
  const zone = function () { return document.getElementById('vue'); };

  /* ---------- Petits outils partagés ---------- */

  function aujourdhui() { return C.dateISO(); }
  function nomClient(id) { const c = Donnees.client(id); return c ? c.nom : 'Client non renseigné'; }
  function totaux(doc) { return C.calculerTotaux(doc.lignes, doc.remise); }
  function statut(doc) { return C.statutEffectif(doc, aujourdhui()); }
  function badge(doc) { const s = statut(doc); return '<span class="badge badge-' + s + '">' + LIBELLES_STATUT[s] + '</span>'; }
  function titreDocument(doc) {
    if (doc.numero) return doc.numero;
    return doc.type === 'facture' ? 'Facture en brouillon' : 'Devis en brouillon';
  }
  function initiales(nom) {
    return nom.replace(/^(M\.|Mme|Mlle)\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map(function (m) { return m[0]; }).join('').toUpperCase();
  }
  // Un document est-il encore modifiable ? Une facture émise est figée (obligation légale).
  function modifiable(doc) {
    if (doc.type === 'facture') return doc.statut === 'brouillon';
    return !(doc.statut === 'accepte' && doc.factureId && Donnees.documentParId(doc.factureId));
  }
  // Numéro marocain → format international pour WhatsApp : 0612345678 → 212612345678
  function numeroWhatsApp(tel) {
    const chiffres = String(tel || '').replace(/\D/g, '');
    if (/^0[5-7]\d{8}$/.test(chiffres)) return '212' + chiffres.slice(1);
    if (/^212[5-7]\d{8}$/.test(chiffres)) return chiffres;
    return '';
  }
  function lienWhatsApp(doc) {
    const client = Donnees.client(doc.clientId);
    const t = totaux(doc);
    const e = Donnees.etat.entreprise;
    const quoi = doc.type === 'facture' ? 'la facture ' + doc.numero : 'le devis ' + doc.numero;
    let message = 'Bonjour' + (client ? ' ' + client.nom : '') + ',\n\nVoici ' + quoi + ' d\'un montant de ' + C.formaterMontant(t.totalTTC) + ' TTC';
    if (doc.type === 'facture' && doc.echeance) message += ', à régler avant le ' + C.formaterDate(doc.echeance);
    if (doc.type === 'devis' && doc.echeance) message += ', valable jusqu\'au ' + C.formaterDate(doc.echeance);
    message += '.\n\nCordialement,\n' + e.nom;
    return 'https://wa.me/' + numeroWhatsApp(client && client.telephone) + '?text=' + encodeURIComponent(message);
  }

  /* =========================================================
     1. TABLEAU DE BORD
     ========================================================= */
  function tableauDeBord() {
    const etat = Donnees.etat;
    const auj = aujourdhui();
    const mois = auj.slice(0, 7);
    const factures = etat.documents.filter(function (d) { return d.type === 'facture'; });
    const devis = etat.documents.filter(function (d) { return d.type === 'devis'; });
    const somme = function (liste) { return liste.reduce(function (s, d) { return s + totaux(d).totalTTC; }, 0); };

    const payeesMois = factures.filter(function (d) { return d.statut === 'payee' && d.payeeLe.slice(0, 7) === mois; });
    const aEncaisser = factures.filter(function (d) { return statut(d) === 'emise'; });
    const enRetard = factures.filter(function (d) { return statut(d) === 'en-retard'; });
    const devisEnAttente = devis.filter(function (d) { return d.statut === 'envoye'; });
    // Accord au pluriel : accord(2, 'facture', 'factures') → "2 factures"
    const accord = function (n, singulier, pluriel) { return n + ' ' + (n > 1 ? pluriel : singulier); };

    // Liste "À faire" : ce qui demande une action, du plus urgent au moins urgent.
    const taches = [];
    enRetard.forEach(function (d) {
      taches.push({ couleur: 'var(--danger)', doc: d, titre: 'Relancer ' + nomClient(d.clientId),
        detail: d.numero + ' · échue depuis ' + C.ecartEnJours(d.echeance, auj) + ' j · ' + C.formaterMontant(totaux(d).totalTTC) });
    });
    devisEnAttente.filter(function (d) { return C.ecartEnJours(d.date, auj) >= 7; }).forEach(function (d) {
      taches.push({ couleur: 'var(--alerte)', doc: d, titre: 'Relancer le devis de ' + nomClient(d.clientId),
        detail: d.numero + ' · envoyé il y a ' + C.ecartEnJours(d.date, auj) + ' j' });
    });
    etat.documents.filter(function (d) { return d.statut === 'brouillon'; }).forEach(function (d) {
      taches.push({ couleur: 'var(--texte-3)', doc: d, titre: 'Finaliser ' + (d.type === 'facture' ? 'la facture' : 'le devis') + ' de ' + nomClient(d.clientId),
        detail: titreDocument(d) + ' · ' + C.formaterMontant(totaux(d).totalTTC) });
    });

    const recents = etat.documents.slice().sort(function (a, b) { return b.modifieLe - a.modifieLe; }).slice(0, 6);
    const moisTexte = C.formaterDate(mois + '-15').replace(/^\d+\s/, '');

    zone().innerHTML =
      '<div class="entete-vue"><div><h1>Bonjour, ' + echapper(etat.entreprise.nom || 'bienvenue') + '</h1>' +
        '<p>Voici l\'état de votre activité au ' + C.formaterDate(auj) + '.</p></div>' +
        '<div class="actions">' +
          '<a class="btn btn-secondaire" href="#/nouveau/devis">' + ICONES.plus + 'Devis</a>' +
          '<a class="btn btn-principal" href="#/nouveau/facture">' + ICONES.plus + 'Facture</a>' +
        '</div></div>' +
      '<section class="indicateurs" aria-label="Indicateurs">' +
        indicateur('Encaissé en ' + moisTexte, C.formaterMontant(somme(payeesMois)), accord(payeesMois.length, 'facture payée', 'factures payées'), 'var(--succes)') +
        indicateur('À encaisser', C.formaterMontant(somme(aEncaisser)), accord(aEncaisser.length, 'facture', 'factures') + ' dans les délais', 'var(--accent)') +
        indicateur('En retard', C.formaterMontant(somme(enRetard)), enRetard.length ? accord(enRetard.length, 'facture', 'factures') + ' à relancer' : 'Aucun retard', 'var(--danger)', enRetard.length > 0) +
        indicateur('Devis en attente', C.formaterMontant(somme(devisEnAttente)), accord(devisEnAttente.length, 'devis envoyé', 'devis envoyés'), 'var(--alerte)') +
      '</section>' +
      '<div class="colonnes">' +
        '<section class="carte" aria-labelledby="titre-recents"><div class="carte-entete"><h2 id="titre-recents">Derniers documents</h2>' +
          '<a class="bouton-lien" href="#/factures">Tout voir</a></div>' +
          tableauDocuments(recents, true) + '</section>' +
        '<section class="carte" aria-labelledby="titre-afaire"><div class="carte-entete"><h2 id="titre-afaire">À faire</h2>' +
          '<span class="texte-3 chiffres">' + taches.length + '</span></div>' +
          (taches.length
            ? '<ul class="a-faire">' + taches.slice(0, 7).map(function (t) {
                return '<li style="--couleur:' + t.couleur + '"><span class="point"></span><span class="texte"><strong>' + echapper(t.titre) + '</strong><span>' + echapper(t.detail) + '</span></span>' +
                  '<a class="btn btn-discret" href="#/document/' + t.doc.id + '">Ouvrir</a></li>';
              }).join('') + '</ul>'
            : '<div class="vide-etat">' + ICONES.coche + '<strong>Tout est à jour</strong>Aucune relance ni brouillon en attente.</div>') +
        '</section>' +
      '</div>';
    brancherLignesCliquables();
  }

  function indicateur(titre, valeur, detail, couleur, alerte) {
    return '<div class="carte indicateur' + (alerte ? ' alerte' : '') + '" style="--couleur:' + couleur + '">' +
      '<span class="indicateur-titre">' + titre + '</span>' +
      '<span class="indicateur-valeur">' + valeur + '</span>' +
      '<span class="indicateur-detail">' + detail + '</span></div>';
  }

  /* ---------- Tableau de documents (réutilisé partout) ---------- */
  function tableauDocuments(docs, compact) {
    if (!docs.length) return '';
    return '<table class="tableau"><thead><tr>' +
        '<th>Numéro</th><th class="masque-mobile">Client</th>' + (compact ? '' : '<th class="masque-mobile">Date</th><th class="masque-mobile">Échéance</th>') +
        '<th class="droite">Montant TTC</th><th class="droite">Statut</th></tr></thead><tbody>' +
      docs.map(function (d) {
        return '<tr data-lien="#/document/' + d.id + '">' +
          '<td><a class="lien-ligne cellule-principale mono" href="#/document/' + d.id + '">' + echapper(titreDocument(d)) + '</a>' +
            '<span class="cellule-secondaire">' + echapper(nomClient(d.clientId)) + '</span></td>' +
          '<td class="masque-mobile">' + echapper(nomClient(d.clientId)) + '</td>' +
          (compact ? '' : '<td class="masque-mobile chiffres">' + C.formaterDate(d.date) + '</td><td class="masque-mobile chiffres">' + (d.echeance ? C.formaterDate(d.echeance) : '—') + '</td>') +
          '<td class="droite montant cellule-principale">' + C.formaterMontant(totaux(d).totalTTC) + '</td>' +
          '<td class="droite">' + badge(d) + '</td></tr>';
      }).join('') + '</tbody></table>';
  }
  // Toute la ligne du tableau est cliquable (le lien reste accessible au clavier).
  function brancherLignesCliquables() {
    zone().querySelectorAll('tr[data-lien]').forEach(function (tr) {
      tr.addEventListener('click', function (e) { if (!e.target.closest('a')) location.hash = tr.dataset.lien; });
    });
  }

  // Petit utilitaire : a-t-on affaire à un "devis" ou une "facture" ?
  function deviserPluriel(n, mot) { return n + ' ' + (mot === 'devis' ? 'devis' : mot + (n > 1 ? 's' : '')); }

  /* =========================================================
     2. LISTES DE DEVIS / FACTURES
     ========================================================= */
  const filtres = { devis: { statut: 'tous', recherche: '' }, facture: { statut: 'tous', recherche: '' } };

  function listeDocuments(type) {
    const f = filtres[type];
    const statuts = type === 'facture' ? ['brouillon', 'emise', 'en-retard', 'payee'] : Donnees.STATUTS.devis;
    const tous = Donnees.etat.documents.filter(function (d) { return d.type === type; });
    const compte = function (s) { return tous.filter(function (d) { return statut(d) === s; }).length; };

    zone().innerHTML =
      '<div class="entete-vue"><div><h1>' + (type === 'facture' ? 'Factures' : 'Devis') + '</h1>' +
        '<p>' + deviserPluriel(tous.length, type) + ' au total</p></div>' +
        '<div class="actions"><a class="btn btn-principal" href="#/nouveau/' + type + '">' + ICONES.plus +
          (type === 'facture' ? 'Nouvelle facture' : 'Nouveau devis') + '</a></div></div>' +
      '<div class="barre-outils">' +
        '<div class="recherche">' + ICONES.chercher +
          '<label class="visuellement-cache" for="recherche">Rechercher</label>' +
          '<input class="champ" id="recherche" type="search" placeholder="Numéro, client ou montant" autocomplete="off" value="' + echapper(f.recherche) + '"><kbd>/</kbd></div>' +
        '<div class="segments" role="group" aria-label="Filtrer par statut">' +
          '<button type="button" data-statut="tous" aria-pressed="' + (f.statut === 'tous') + '">Tous <span class="nombre">' + tous.length + '</span></button>' +
          statuts.map(function (s) {
            return '<button type="button" data-statut="' + s + '" aria-pressed="' + (f.statut === s) + '">' + LIBELLES_STATUT[s] + ' <span class="nombre">' + compte(s) + '</span></button>';
          }).join('') +
        '</div></div>' +
      '<section class="carte" id="resultats" aria-live="polite"></section>';

    function afficherResultats() {
      const q = f.recherche.trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
      const liste = tous.filter(function (d) {
        if (f.statut !== 'tous' && statut(d) !== f.statut) return false;
        if (!q) return true;
        const cible = (titreDocument(d) + ' ' + nomClient(d.clientId) + ' ' + C.formaterMontant(totaux(d).totalTTC, true).replace(/\s/g, ''))
          .toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        return cible.indexOf(q.replace(/\s/g, '')) !== -1 || cible.indexOf(q) !== -1;
      }).sort(function (a, b) { return b.date.localeCompare(a.date) || b.numero.localeCompare(a.numero); });

      document.getElementById('resultats').innerHTML = liste.length ? tableauDocuments(liste, false) :
        '<div class="vide-etat">' + (type === 'facture' ? ICONES.facture : ICONES.devis) +
          '<strong>' + (tous.length ? 'Aucun résultat' : 'Aucun document pour l\'instant') + '</strong>' +
          (tous.length ? 'Essayez un autre mot ou un autre statut.' : 'Créez votre premier document en un clic.') +
          (tous.length ? '<br><button type="button" class="btn btn-secondaire" id="effacer-filtres">Effacer les filtres</button>' : '') + '</div>';
      brancherLignesCliquables();
      const effacer = document.getElementById('effacer-filtres');
      if (effacer) effacer.addEventListener('click', function () { f.recherche = ''; f.statut = 'tous'; listeDocuments(type); });
    }

    document.getElementById('recherche').addEventListener('input', function (e) { f.recherche = e.target.value; afficherResultats(); });
    zone().querySelector('.segments').addEventListener('click', function (e) {
      const b = e.target.closest('[data-statut]');
      if (!b) return;
      f.statut = b.dataset.statut;
      zone().querySelectorAll('.segments [data-statut]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      afficherResultats();
    });
    afficherResultats();
  }

  /* =========================================================
     3. ÉDITEUR DE DOCUMENT (avec aperçu en direct)
     ========================================================= */
  let docEdite = null;
  let minuteurSauvegarde = null;
  let ongletMobile = 'modifier';

  function editeur(id) {
    const doc = Donnees.documentParId(id);
    if (!doc) {
      zone().innerHTML = '<div class="carte vide-etat">' + ICONES.alerte + '<strong>Document introuvable</strong>Il a peut-être été supprimé.' +
        '<br><a class="btn btn-secondaire" href="#/">Retour au tableau de bord</a></div>';
      return;
    }
    docEdite = doc.id;
    const editable = modifiable(doc);
    const etat = Donnees.etat;
    const estFacture = doc.type === 'facture';
    const s = statut(doc);

    // Actions disponibles selon le type et le statut du document.
    let principal = '';
    if (estFacture && s === 'brouillon') principal = '<button type="button" class="btn btn-principal" data-action="emettre">' + ICONES.envoyer + 'Émettre la facture</button>';
    else if (estFacture && (s === 'emise' || s === 'en-retard')) principal = '<button type="button" class="btn btn-principal" data-action="payer">' + ICONES.coche + 'Marquer payée</button>';
    else if (!estFacture && doc.factureId && Donnees.documentParId(doc.factureId)) principal = '<a class="btn btn-principal" href="#/document/' + doc.factureId + '">' + ICONES.facture + 'Voir la facture</a>';
    else if (!estFacture && doc.statut !== 'refuse') principal = '<button type="button" class="btn btn-principal" data-action="transformer">' + ICONES.transformer + '<span>Transformer <span class="texte-long">en facture</span></span></button>';

    const peutSupprimer = !estFacture || doc.statut === 'brouillon';
    const bandeau = !editable
      ? (estFacture
          ? '<div class="bandeau">' + ICONES.alerte + '<p>Facture émise : son contenu est figé, comme l\'exige la loi. Pour la corriger, créez une nouvelle facture (avoir).</p></div>'
          : '<div class="bandeau">' + ICONES.alerte + '<p>Ce devis a été transformé en facture : il n\'est plus modifiable.</p></div>')
      : (s === 'en-retard' ? '<div class="bandeau bandeau-alerte">' + ICONES.alerte + '<p>Échéance dépassée depuis ' + C.ecartEnJours(doc.echeance, aujourdhui()) + ' jours.</p></div>' : '');

    // Tout l'éditeur est dans un conteneur recréé à chaque affichage : ses écouteurs
    // disparaissent avec lui (sinon chaque clic déclencherait plusieurs fois l'action).
    zone().innerHTML = '<div id="racine-editeur">' +
      '<div class="entete-vue"><div>' +
        '<a class="bouton-lien" href="#/' + (estFacture ? 'factures' : 'devis') + '">← ' + (estFacture ? 'Factures' : 'Devis') + '</a>' +
        '<h1 style="margin-top:6px;display:flex;gap:12px;align-items:center;flex-wrap:wrap"><span class="mono" style="font-size:0.9em">' + echapper(titreDocument(doc)) + '</span>' + badge(doc) + '</h1>' +
        '<p><span class="etat-enregistrement" id="etat-enregistrement">' + ICONES.coche + 'Enregistré automatiquement</span></p></div>' +
        '<div class="actions">' + principal +
          (s === 'payee' ? '<button type="button" class="btn btn-discret" data-action="annuler-paiement">Annuler le paiement</button>' : '') +
          '<button type="button" class="btn btn-secondaire" data-action="pdf" title="Imprimer ou enregistrer en PDF">' + ICONES.imprimer + '<span class="texte-long">PDF</span></button>' +
          '<a class="btn btn-secondaire" data-action="whatsapp" href="' + lienWhatsApp(doc) + '" target="_blank" rel="noopener" title="Envoyer par WhatsApp">' + ICONES.whatsapp + '<span class="texte-long">WhatsApp</span></a>' +
          '<button type="button" class="bouton-icone" data-action="dupliquer" title="Dupliquer" aria-label="Dupliquer">' + ICONES.copie + '</button>' +
          (peutSupprimer ? '<button type="button" class="btn btn-danger" data-action="supprimer" aria-label="Supprimer">' + ICONES.poubelle + '</button>' : '') +
        '</div></div>' +
      '<div class="onglets-editeur"><div class="segments" role="tablist" aria-label="Affichage">' +
        '<button type="button" data-onglet="modifier" aria-pressed="' + (ongletMobile === 'modifier') + '">Modifier</button>' +
        '<button type="button" data-onglet="apercu" aria-pressed="' + (ongletMobile === 'apercu') + '">Aperçu</button></div></div>' +
      '<div class="editeur">' +
        '<div class="panneau-editeur" id="panneau-modifier"' + (ongletMobile === 'apercu' ? ' hidden' : '') + '>' + bandeau +
          '<section class="carte"><div class="carte-entete"><h2>Informations</h2></div><div class="carte-corps grille-champs deux">' +
            '<div class="groupe pleine"><label for="client">Client</label>' +
              '<div style="display:flex;gap:8px"><div style="flex:1;min-width:0"><select id="client"' + (editable ? '' : ' disabled') + '>' +
                '<option value="" data-invite="oui">Choisir un client…</option>' +
                etat.clients.slice().sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); }).map(function (c) {
                  return '<option value="' + c.id + '"' + (c.id === doc.clientId ? ' selected' : '') + '>' + echapper(c.nom) + '</option>';
                }).join('') +
              '</select></div>' + (editable ? '<button type="button" class="btn btn-secondaire" data-action="nouveau-client" title="Nouveau client">' + ICONES.plus + '<span class="texte-long">Nouveau</span></button>' : '') + '</div></div>' +
            '<div class="groupe"><label for="date">Date</label><div id="champ-date"></div></div>' +
            '<div class="groupe"><label for="echeance">' + (estFacture ? 'Échéance' : 'Valable jusqu\'au') + '</label><div id="champ-echeance"></div></div>' +
            (!estFacture ? '<div class="groupe pleine"><label for="statut-devis">Statut du devis</label><select id="statut-devis"' + (editable ? '' : ' disabled') + '>' +
              Donnees.STATUTS.devis.map(function (x) { return '<option value="' + x + '"' + (x === doc.statut ? ' selected' : '') + '>' + LIBELLES_STATUT[x] + '</option>'; }).join('') + '</select></div>' : '') +
          '</div></section>' +
          '<section class="carte"><div class="carte-entete"><h2>Prestations</h2><span class="texte-3 chiffres" id="nb-lignes"></span></div>' +
            '<div class="carte-corps"><div class="lignes" id="lignes"></div>' +
            (editable ? '<button type="button" class="btn btn-secondaire" data-action="ajouter-ligne" style="margin-top:12px">' + ICONES.plus + 'Ajouter une ligne</button>' : '') +
            '<div style="display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;margin-top:20px">' +
              '<div class="groupe"><label for="remise">Remise globale</label><div class="champ-remise"><input class="champ champ-nombre" id="remise" inputmode="decimal" value="' + String(doc.remise).replace('.', ',') + '"' + (editable ? '' : ' disabled') + '><span>%</span></div></div>' +
              '<div class="totaux" id="totaux"></div>' +
            '</div></div></section>' +
          '<section class="carte"><div class="carte-entete"><h2>Notes</h2></div><div class="carte-corps">' +
            '<label class="visuellement-cache" for="notes">Notes</label>' +
            '<textarea class="champ" id="notes" placeholder="Conditions particulières, délais de réalisation, remerciements…"' + (editable ? '' : ' disabled') + '>' + echapper(doc.notes) + '</textarea></div></section>' +
        '</div>' +
        '<div class="apercu" id="panneau-apercu"' + (ongletMobile === 'modifier' ? ' hidden' : '') + '>' +
          '<div class="apercu-cadre" id="apercu-cadre"><div class="apercu-echelle" id="apercu-echelle"></div></div></div>' +
      '</div></div>';

    // Champs date (calendrier sur mesure). L'échéance propose des raccourcis : +15, +30, +60 jours.
    const champDate = creerChampDate(document.getElementById('champ-date'), {
      id: 'date', valeur: doc.date, surChangement: function () { planifierSauvegarde(); }
    });
    const champEcheance = creerChampDate(document.getElementById('champ-echeance'), {
      id: 'echeance', valeur: doc.echeance, surChangement: function () { planifierSauvegarde(); },
      base: function () { return champDate.valeur || aujourdhui(); },
      raccourcis: [{ jours: 15, texte: '+15 j' }, { jours: 30, texte: '+30 j' }, { jours: 60, texte: '+60 j' }]
    });
    if (!editable) zone().querySelectorAll('.champ-date-bouton').forEach(function (b) { b.disabled = true; });

    afficherLignes(doc, editable);
    ameliorerListes(zone());
    mettreAJourApercu();

    /* --- Lecture du formulaire → objet document --- */
    function lireFormulaire() {
      const d = Donnees.documentParId(docEdite);
      const lignes = Array.from(zone().querySelectorAll('.ligne')).map(function (el, i) {
        const ancienne = d.lignes[i] || {};
        const qte = C.lireQuantite(el.querySelector('[data-champ="quantite"]').value);
        const pu = C.lireMontant(el.querySelector('[data-champ="prix"]').value || '0');
        // Une saisie invalide est signalée en rouge, et on garde l'ancienne valeur.
        el.querySelector('[data-champ="quantite"]').setAttribute('aria-invalid', qte === null);
        el.querySelector('[data-champ="prix"]').setAttribute('aria-invalid', pu === null || pu < 0);
        return {
          id: el.dataset.id,
          designation: el.querySelector('[data-champ="designation"]').value,
          quantite: qte === null ? ancienne.quantite : qte,
          prixUnitaire: pu === null || pu < 0 ? ancienne.prixUnitaire : pu,
          tva: Number(el.querySelector('[data-champ="tva"]').value)
        };
      });
      const remise = C.lireQuantite(document.getElementById('remise').value || '0');
      document.getElementById('remise').setAttribute('aria-invalid', remise === null || remise > 100);
      const modifs = {
        clientId: document.getElementById('client').value,
        date: champDate.valeur,
        echeance: champEcheance.valeur,
        lignes: lignes,
        remise: remise === null || remise > 100 ? d.remise : remise,
        notes: document.getElementById('notes').value
      };
      const statutDevis = document.getElementById('statut-devis');
      if (statutDevis) modifs.statut = statutDevis.value;
      return modifs;
    }

    // Sauvegarde automatique, 400 ms après la dernière frappe ("debounce") :
    // on n'enregistre pas à chaque lettre, seulement quand l'utilisateur fait une pause.
    function planifierSauvegarde() {
      if (!modifiable(Donnees.documentParId(docEdite))) return;
      const indicateurEl = document.getElementById('etat-enregistrement');
      indicateurEl.innerHTML = 'Enregistrement…';
      clearTimeout(minuteurSauvegarde);
      minuteurSauvegarde = setTimeout(function () {
        Donnees.modifierDocument(docEdite, lireFormulaire());
        indicateurEl.innerHTML = ICONES.coche + 'Enregistré automatiquement';
      }, 400);
      // L'aperçu et les totaux, eux, se mettent à jour immédiatement.
      mettreAJourApercu(lireFormulaire());
    }

    /* --- Événements --- */
    const panneau = document.getElementById('panneau-modifier');
    panneau.addEventListener('input', planifierSauvegarde);
    panneau.addEventListener('change', planifierSauvegarde);
    // En quittant un champ de prix, on le remet en forme : "1234,5" → "1 234,50".
    panneau.addEventListener('focusout', function (e) {
      if (e.target.dataset.champ === 'prix') {
        const v = C.lireMontant(e.target.value || '0');
        if (v !== null && v >= 0) e.target.value = C.formaterMontant(v, true);
      }
    });

    zone().querySelector('.onglets-editeur').addEventListener('click', function (e) {
      const b = e.target.closest('[data-onglet]');
      if (!b) return;
      ongletMobile = b.dataset.onglet;
      zone().querySelectorAll('[data-onglet]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      document.getElementById('panneau-modifier').hidden = ongletMobile !== 'modifier';
      document.getElementById('panneau-apercu').hidden = ongletMobile !== 'apercu';
      ajusterEchelle();
    });

    document.getElementById('racine-editeur').addEventListener('click', function (e) {
      const b = e.target.closest('[data-action]');
      if (!b) return;
      const action = b.dataset.action;
      const actuel = Donnees.documentParId(docEdite);

      if (action === 'ajouter-ligne') {
        if (modifiable(actuel)) Donnees.modifierDocument(docEdite, lireFormulaire());
        const d = Donnees.documentParId(docEdite);
        Donnees.modifierDocument(docEdite, { lignes: d.lignes.concat([{ designation: '', quantite: 1, prixUnitaire: 0, tva: Donnees.etat.preferences.tvaParDefaut }]) });
        afficherLignes(Donnees.documentParId(docEdite), true);
        ameliorerListes(document.getElementById('lignes'));
        mettreAJourApercu();
        const champs = zone().querySelectorAll('[data-champ="designation"]');
        champs[champs.length - 1].focus();
      } else if (action === 'retirer-ligne') {
        const d = lireFormulaire();
        d.lignes = d.lignes.filter(function (l) { return l.id !== b.dataset.id; });
        if (!d.lignes.length) d.lignes = [{ designation: '', quantite: 1, prixUnitaire: 0, tva: Donnees.etat.preferences.tvaParDefaut }];
        Donnees.modifierDocument(docEdite, d);
        afficherLignes(Donnees.documentParId(docEdite), true);
        ameliorerListes(document.getElementById('lignes'));
        mettreAJourApercu();
      } else if (action === 'emettre') {
        Donnees.modifierDocument(docEdite, lireFormulaire());
        const pret = verifierAvantEmission(Donnees.documentParId(docEdite));
        if (pret !== true) { toast(pret, 'erreur'); return; }
        const f = Donnees.emettreFacture(docEdite);
        toast('Facture <strong>' + f.numero + '</strong> émise');
        editeur(docEdite);
      } else if (action === 'payer') {
        Donnees.marquerPayee(docEdite);
        toast('Facture marquée comme payée');
        editeur(docEdite);
      } else if (action === 'annuler-paiement') {
        Donnees.annulerPaiement(docEdite);
        toast('Paiement annulé');
        editeur(docEdite);
      } else if (action === 'transformer') {
        if (modifiable(actuel)) Donnees.modifierDocument(docEdite, lireFormulaire());
        const f = Donnees.transformerEnFacture(docEdite);
        toast('Facture créée à partir du devis ' + actuel.numero);
        location.hash = '#/document/' + f.id;
      } else if (action === 'dupliquer') {
        const copie = Donnees.dupliquer(docEdite);
        toast('Copie créée');
        location.hash = '#/document/' + copie.id;
      } else if (action === 'supprimer') {
        confirmerEnDeuxClics(b, 'Confirmer', function () {
          const type = actuel.type;
          if (Donnees.supprimerDocument(docEdite)) {
            toast(type === 'facture' ? 'Brouillon supprimé' : 'Devis supprimé');
            location.hash = '#/' + (type === 'facture' ? 'factures' : 'devis');
          } else {
            toast('Une facture émise ne peut pas être supprimée.', 'erreur');
          }
        });
      } else if (action === 'pdf') {
        // Impression : la feuille de style "print" ne garde que la facture.
        // Dans la fenêtre d'impression, choisir « Enregistrer au format PDF ».
        if (modifiable(actuel)) Donnees.modifierDocument(docEdite, lireFormulaire());
        document.getElementById('panneau-apercu').hidden = false;
        ajusterEchelle();
        window.print();
        if (ongletMobile === 'modifier' && window.innerWidth < 1280) document.getElementById('panneau-apercu').hidden = true;
      } else if (action === 'whatsapp') {
        const client = Donnees.client(actuel.clientId);
        if (!numeroWhatsApp(client && client.telephone)) {
          toast('Numéro WhatsApp du client manquant : WhatsApp vous laissera choisir le contact.');
        }
      } else if (action === 'nouveau-client') {
        ouvrirFicheClient(null, function (nouveau) {
          const select = document.getElementById('client');
          const option = document.createElement('option');
          option.value = nouveau.id;
          option.textContent = nouveau.nom;
          select.appendChild(option);
          select.value = nouveau.id;
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }
    });
  }

  // Avant d'émettre une facture, on vérifie qu'elle est complète.
  function verifierAvantEmission(doc) {
    if (!doc.clientId) return 'Choisissez un client avant d\'émettre la facture.';
    const valides = doc.lignes.filter(function (l) { return l.designation.trim() && l.quantite > 0; });
    if (!valides.length) return 'Ajoutez au moins une prestation avec une désignation.';
    if (doc.lignes.some(function (l) { return !l.designation.trim(); })) return 'Une ligne n\'a pas de désignation : complétez-la ou supprimez-la.';
    if (totaux(doc).totalTTC <= 0) return 'Le montant de la facture doit être supérieur à zéro.';
    return true;
  }

  function afficherLignes(doc, editable) {
    const off = editable ? '' : ' disabled';
    document.getElementById('lignes').innerHTML = doc.lignes.map(function (l, i) {
      return '<div class="ligne" data-id="' + l.id + '">' +
        '<div class="l-desc"><label class="etiquette" for="desc-' + i + '">Désignation</label>' +
          '<input class="champ" id="desc-' + i + '" data-champ="designation" value="' + echapper(l.designation) + '" placeholder="Ex. Conception des plans"' + off + '></div>' +
        '<div class="l-qte"><label class="etiquette" for="qte-' + i + '">Qté</label>' +
          '<input class="champ champ-nombre" id="qte-' + i + '" data-champ="quantite" inputmode="decimal" value="' + String(l.quantite).replace('.', ',') + '"' + off + '></div>' +
        '<div class="l-pu"><label class="etiquette" for="pu-' + i + '">Prix unit. HT</label>' +
          '<input class="champ champ-nombre" id="pu-' + i + '" data-champ="prix" inputmode="decimal" value="' + C.formaterMontant(l.prixUnitaire, true) + '"' + off + '></div>' +
        '<div class="l-tva"><label class="etiquette" for="tva-' + i + '">TVA</label>' +
          '<select id="tva-' + i + '" data-champ="tva" data-taille="petite"' + off + '>' +
            C.TAUX_TVA.map(function (t) { return '<option value="' + t + '"' + (t === l.tva ? ' selected' : '') + '>' + t + ' %</option>'; }).join('') +
          '</select></div>' +
        '<div class="l-total"><span class="montant" data-total>' + C.formaterMontant(C.totalLigne(l)) + '</span>' +
          (editable ? '<button type="button" class="bouton-icone" data-action="retirer-ligne" data-id="' + l.id + '" aria-label="Supprimer la ligne ' + (i + 1) + '">' + ICONES.croix + '</button>' : '') + '</div>' +
      '</div>';
    }).join('');
    document.getElementById('nb-lignes').textContent = doc.lignes.length + ' ligne' + (doc.lignes.length > 1 ? 's' : '');
  }

  // Met à jour les totaux du formulaire et l'aperçu A4 (avec les valeurs en cours de saisie).
  function mettreAJourApercu(modifsEnCours) {
    if (!docEdite || !document.getElementById('apercu-echelle')) return;
    const base = Donnees.documentParId(docEdite);
    if (!base) return;
    const doc = Object.assign({}, base, modifsEnCours || {});
    const t = totaux(doc);
    // Totaux de chaque ligne
    zone().querySelectorAll('.ligne').forEach(function (el, i) {
      if (doc.lignes[i]) el.querySelector('[data-total]').textContent = C.formaterMontant(C.totalLigne(doc.lignes[i]));
    });
    document.getElementById('totaux').innerHTML =
      '<div><span>Sous-total HT</span><span>' + C.formaterMontant(t.sousTotalHT) + '</span></div>' +
      (t.montantRemise ? '<div><span>Remise (' + String(doc.remise).replace('.', ',') + ' %)</span><span>− ' + C.formaterMontant(t.montantRemise) + '</span></div>' : '') +
      t.tvaParTaux.map(function (x) { return '<div><span>TVA ' + x.taux + ' %</span><span>' + C.formaterMontant(x.montant) + '</span></div>'; }).join('') +
      '<div class="total-final"><span>Total TTC</span><span>' + C.formaterMontant(t.totalTTC) + '</span></div>';
    document.getElementById('apercu-echelle').innerHTML = papier(doc, t);
    ajusterEchelle();
  }

  // Le document fait 794 px de large (A4) : on le réduit pour qu'il tienne dans sa colonne.
  function ajusterEchelle() {
    const cadre = document.getElementById('apercu-cadre');
    const echelle = document.getElementById('apercu-echelle');
    if (!cadre || !echelle || cadre.offsetParent === null) return;
    const ratio = Math.min(cadre.clientWidth / 794, 1);
    echelle.style.transform = 'scale(' + ratio + ')';
    cadre.style.height = (echelle.firstElementChild.offsetHeight * ratio) + 'px';
  }
  window.addEventListener('resize', ajusterEchelle);

  /* ---------- Le document imprimable ---------- */
  function papier(doc, t) {
    const e = Donnees.etat.entreprise;
    const client = Donnees.client(doc.clientId);
    const estFacture = doc.type === 'facture';
    const s = statut(doc);
    const ligne = function (texte) { return texte ? '<span>' + echapper(texte) + '</span>' : ''; };
    return '<article class="papier">' +
      (s === 'payee' ? '<div class="p-tampon">Payée</div>' : '') +
      '<header class="p-entete">' +
        '<div class="p-emetteur"><strong>' + echapper(e.nom || 'Votre entreprise') + '</strong>' +
          ligne(e.activite) + ligne(e.adresse) + ligne(e.ville) + ligne(e.telephone) + ligne(e.email) + '</div>' +
        '<div class="p-titre"><h2>' + (estFacture ? 'Facture' : 'Devis') + '</h2>' +
          '<div class="p-numero">' + echapper(doc.numero || 'BROUILLON') + '</div>' +
          '<dl><dt>Date</dt><dd>' + C.formaterDate(doc.date) + '</dd>' +
          (doc.echeance ? '<dt>' + (estFacture ? 'Échéance' : 'Valable jusqu\'au') + '</dt><dd>' + C.formaterDate(doc.echeance) + '</dd>' : '') + '</dl></div>' +
      '</header>' +
      '<div class="p-client"><small>' + (estFacture ? 'Facturé à' : 'Adressé à') + '</small>' +
        (client ? '<strong>' + echapper(client.nom) + '</strong>' + ligne(client.adresse) + ligne(client.ville) + (client.ice ? '<span>ICE : ' + echapper(client.ice) + '</span>' : '')
                : '<strong style="color:#b4322a">Client à choisir</strong>') + '</div>' +
      '<table><thead><tr><th>Désignation</th><th class="d">Qté</th><th class="d">P.U. HT</th><th class="d">TVA</th><th class="d">Total HT</th></tr></thead><tbody>' +
        doc.lignes.map(function (l) {
          return '<tr><td>' + (echapper(l.designation) || '<span style="color:#9aa3b5">—</span>') + '</td>' +
            '<td class="d">' + String(l.quantite).replace('.', ',') + '</td>' +
            '<td class="d">' + C.formaterMontant(l.prixUnitaire, true) + '</td>' +
            '<td class="d">' + l.tva + ' %</td>' +
            '<td class="d">' + C.formaterMontant(C.totalLigne(l), true) + '</td></tr>';
        }).join('') +
      '</tbody></table>' +
      '<div class="p-bas">' +
        '<p class="p-lettres">' + (estFacture ? 'Arrêtée la présente facture' : 'Arrêté le présent devis') + ' à la somme de :<br><strong>' +
          C.montantEnLettres(t.totalTTC).replace(/^./, function (x) { return x.toUpperCase(); }) + ' TTC</strong></p>' +
        '<div class="p-totaux">' +
          '<div><span>Sous-total HT</span><span>' + C.formaterMontant(t.sousTotalHT) + '</span></div>' +
          (t.montantRemise ? '<div><span>Remise ' + String(doc.remise).replace('.', ',') + ' %</span><span>− ' + C.formaterMontant(t.montantRemise) + '</span></div>' : '') +
          (t.montantRemise ? '<div><span>Total HT</span><span>' + C.formaterMontant(t.totalHT) + '</span></div>' : '') +
          t.tvaParTaux.map(function (x) { return '<div><span>TVA ' + x.taux + ' %</span><span>' + C.formaterMontant(x.montant) + '</span></div>'; }).join('') +
          '<div class="p-ttc"><span>Total TTC</span><span>' + C.formaterMontant(t.totalTTC) + '</span></div>' +
        '</div></div>' +
      (doc.notes ? '<div class="p-notes">' + echapper(doc.notes) + '</div>' : '') +
      '<footer class="p-pied">' +
        [e.conditions].filter(Boolean).map(echapper).join('') + (e.conditions ? '<br>' : '') +
        [e.ice && 'ICE : ' + e.ice, e.identifiantFiscal && 'IF : ' + e.identifiantFiscal, e.rc && 'RC : ' + e.rc].filter(Boolean).map(echapper).join(' · ') +
        (e.rib ? '<br>RIB : ' + echapper(e.rib) : '') +
      '</footer></article>';
  }

  /* =========================================================
     4. CLIENTS
     ========================================================= */
  let rechercheClients = '';

  function clients() {
    const etat = Donnees.etat;
    zone().innerHTML =
      '<div class="entete-vue"><div><h1>Clients</h1><p>' + etat.clients.length + ' client' + (etat.clients.length > 1 ? 's' : '') + '</p></div>' +
        '<div class="actions"><button type="button" class="btn btn-principal" id="ajouter-client">' + ICONES.plus + 'Nouveau client</button></div></div>' +
      '<div class="barre-outils"><div class="recherche">' + ICONES.chercher +
        '<label class="visuellement-cache" for="recherche">Rechercher un client</label>' +
        '<input class="champ" id="recherche" type="search" placeholder="Nom, ville ou ICE" autocomplete="off" value="' + echapper(rechercheClients) + '"><kbd>/</kbd></div></div>' +
      '<div class="grille-clients" id="grille-clients"></div>';

    function afficherGrille() {
      const q = rechercheClients.trim().toLowerCase();
      const liste = etat.clients.filter(function (c) { return !q || (c.nom + ' ' + c.ville + ' ' + c.ice).toLowerCase().indexOf(q) !== -1; })
        .sort(function (a, b) { return a.nom.localeCompare(b.nom, 'fr'); });
      document.getElementById('grille-clients').innerHTML = liste.length ? liste.map(function (c) {
        const docs = etat.documents.filter(function (d) { return d.clientId === c.id; });
        const facture = docs.filter(function (d) { return d.type === 'facture' && d.statut !== 'brouillon'; })
          .reduce(function (s, d) { return s + totaux(d).totalTTC; }, 0);
        return '<button type="button" class="carte fiche-client" data-client="' + c.id + '">' +
          '<span class="haut"><span class="initiales">' + echapper(initiales(c.nom)) + '</span><span><strong>' + echapper(c.nom) + '</strong>' +
            '<span class="cellule-secondaire">' + echapper(c.ville || '—') + (c.ice ? ' · ICE ' + echapper(c.ice) : '') + '</span></span></span>' +
          '<span class="bas"><span>' + docs.length + ' document' + (docs.length > 1 ? 's' : '') + '</span><span class="chiffres">Facturé : <strong>' + C.formaterMontant(facture) + '</strong></span></span>' +
        '</button>';
      }).join('') : '<div class="carte vide-etat" style="grid-column:1/-1">' + ICONES.clients + '<strong>Aucun client trouvé</strong></div>';
    }

    document.getElementById('recherche').addEventListener('input', function (e) { rechercheClients = e.target.value; afficherGrille(); });
    document.getElementById('ajouter-client').addEventListener('click', function () { ouvrirFicheClient(null); });
    document.getElementById('grille-clients').addEventListener('click', function (e) {
      const b = e.target.closest('[data-client]');
      if (b) ouvrirFicheClient(b.dataset.client);
    });
    afficherGrille();
  }

  // Fiche client dans une fenêtre de dialogue (création ou modification).
  function ouvrirFicheClient(id, apresEnregistrement) {
    const c = (id && Donnees.client(id)) || { nom: '', ice: '', email: '', telephone: '', adresse: '', ville: '' };
    const d = document.getElementById('dialogue-client');
    const utilise = id && Donnees.etat.documents.some(function (doc) { return doc.clientId === id; });
    d.innerHTML =
      '<form method="dialog" id="formulaire-client" novalidate>' +
        '<div class="dialogue-entete"><h2>' + (id ? 'Modifier le client' : 'Nouveau client') + '</h2>' +
          '<button type="button" class="bouton-icone" data-fermer aria-label="Fermer">' + ICONES.croix + '</button></div>' +
        '<div class="dialogue-corps grille-champs deux">' +
          champClient('nom', 'Nom ou raison sociale *', c.nom, 'pleine', 'organization') +
          champClient('ice', 'ICE (15 chiffres)', c.ice, '', 'off', 'numeric') +
          champClient('telephone', 'Téléphone', c.telephone, '', 'tel', 'tel') +
          champClient('email', 'E-mail', c.email, 'pleine', 'email', 'email') +
          champClient('adresse', 'Adresse', c.adresse, 'pleine', 'street-address') +
          champClient('ville', 'Ville', c.ville, '', 'address-level2') +
        '</div>' +
        '<div class="dialogue-pied">' +
          (id ? '<button type="button" class="btn btn-danger gauche" id="supprimer-client">' + ICONES.poubelle + 'Supprimer</button>' : '') +
          '<button type="button" class="btn btn-secondaire" data-fermer>Annuler</button>' +
          '<button type="submit" class="btn btn-principal">Enregistrer</button></div>' +
      '</form>';

    const REGLES = {
      nom: function (v) { return v.trim().length >= 2 || 'Indiquez un nom (2 caractères minimum).'; },
      ice: function (v) { return !v.trim() || C.iceValide(v) || 'L\'ICE compte exactement 15 chiffres.'; },
      telephone: function (v) { return !v.trim() || C.telephoneValide(v) || 'Numéro marocain attendu, ex. 06 12 34 56 78.'; },
      email: function (v) { return !v.trim() || C.emailValide(v) || 'Adresse e-mail invalide.'; }
    };
    function verifier(nom) {
      const champ = d.querySelector('#client-' + nom);
      const resultat = REGLES[nom](champ.value);
      const message = d.querySelector('#erreur-' + nom);
      champ.setAttribute('aria-invalid', resultat !== true);
      message.textContent = resultat === true ? '' : resultat;
      return resultat === true;
    }
    // Vérification pendant la frappe, seulement pour un champ déjà signalé en erreur.
    d.addEventListener('input', function (e) {
      const nom = e.target.id.replace('client-', '');
      if (REGLES[nom] && e.target.getAttribute('aria-invalid') === 'true') verifier(nom);
    });
    d.querySelectorAll('[data-fermer]').forEach(function (b) { b.addEventListener('click', function () { d.close(); }); });
    d.querySelector('form').addEventListener('submit', function (e) {
      e.preventDefault();
      const invalides = Object.keys(REGLES).filter(function (n) { return !verifier(n); });
      if (invalides.length) { d.querySelector('#client-' + invalides[0]).focus(); return; }
      const lire = function (n) { return d.querySelector('#client-' + n).value; };
      const valeurs = {
        id: id || undefined, nom: lire('nom'), ice: lire('ice'), telephone: lire('telephone'),
        email: lire('email'), adresse: lire('adresse'), ville: lire('ville')
      };
      // On ferme la fenêtre AVANT d'enregistrer : l'écran des clients peut alors se redessiner.
      d.close();
      const enregistre = Donnees.enregistrerClient(valeurs);
      toast(id ? 'Client modifié' : 'Client <strong>' + echapper(enregistre.nom) + '</strong> ajouté');
      if (apresEnregistrement) apresEnregistrement(enregistre);
    });
    const suppr = d.querySelector('#supprimer-client');
    if (suppr) suppr.addEventListener('click', function () {
      if (utilise) { toast('Ce client a des documents : il ne peut pas être supprimé.', 'erreur'); return; }
      confirmerEnDeuxClics(suppr, 'Confirmer', function () { d.close(); Donnees.supprimerClient(id); toast('Client supprimé'); });
    });
    d.showModal();
    d.querySelector('#client-nom').focus();
  }
  function champClient(nom, libelle, valeur, classe, autocomplete, mode) {
    return '<div class="groupe ' + (classe || '') + '"><label for="client-' + nom + '">' + libelle + '</label>' +
      '<input class="champ" id="client-' + nom + '" value="' + echapper(valeur) + '" autocomplete="' + autocomplete + '"' +
      (mode ? ' inputmode="' + mode + '"' : '') + ' aria-describedby="erreur-' + nom + '">' +
      '<span class="erreur-champ" id="erreur-' + nom + '" aria-live="polite"></span></div>';
  }

  /* =========================================================
     5. RÉGLAGES
     ========================================================= */
  function reglages() {
    const etat = Donnees.etat;
    const e = etat.entreprise;
    const p = etat.preferences;
    const champ = function (nom, libelle, classe) {
      return '<div class="groupe ' + (classe || '') + '"><label for="e-' + nom + '">' + libelle + '</label>' +
        '<input class="champ" id="e-' + nom + '" data-entreprise="' + nom + '" value="' + echapper(e[nom]) + '"></div>';
    };
    zone().innerHTML =
      '<div class="entete-vue"><div><h1>Réglages</h1><p>Les informations de votre entreprise apparaissent sur chaque document.</p></div></div>' +
      '<div class="reglages">' +
        '<section class="carte"><div class="carte-entete"><h2>Entreprise</h2><span class="etat-enregistrement" id="etat-entreprise"></span></div>' +
          '<div class="carte-corps grille-champs deux">' +
            champ('nom', 'Nom') + champ('activite', 'Activité') + champ('adresse', 'Adresse', 'pleine') + champ('ville', 'Ville') +
            champ('telephone', 'Téléphone') + champ('email', 'E-mail', 'pleine') + champ('ice', 'ICE') + champ('identifiantFiscal', 'Identifiant fiscal (IF)') +
            champ('rc', 'Registre du commerce (RC)') + champ('rib', 'RIB') +
            '<div class="groupe pleine"><label for="e-conditions">Conditions de paiement (pied de page)</label>' +
              '<textarea class="champ" id="e-conditions" data-entreprise="conditions">' + echapper(e.conditions) + '</textarea></div>' +
          '</div></section>' +
        '<section class="carte"><div class="carte-entete"><h2>Préférences</h2></div><div class="carte-corps grille-champs deux">' +
          '<div class="groupe"><label for="tva-defaut">TVA par défaut</label><select id="tva-defaut">' +
            C.TAUX_TVA.map(function (t) { return '<option value="' + t + '"' + (t === p.tvaParDefaut ? ' selected' : '') + '>' + t + ' %</option>'; }).join('') + '</select></div>' +
          '<div class="groupe"><label for="delai">Délai de paiement</label><select id="delai">' +
            [0, 15, 30, 45, 60, 90].map(function (j) { return '<option value="' + j + '"' + (j === p.delaiPaiement ? ' selected' : '') + '>' + (j ? j + ' jours' : 'À réception') + '</option>'; }).join('') + '</select></div>' +
          '<div class="groupe pleine"><span class="etiquette" id="titre-theme">Apparence</span>' +
            '<div class="segments" role="group" aria-labelledby="titre-theme">' +
              [['systeme', 'Automatique', ICONES.reglages], ['clair', 'Clair', ICONES.soleil], ['sombre', 'Sombre', ICONES.lune]].map(function (t) {
                return '<button type="button" data-theme-choix="' + t[0] + '" aria-pressed="' + (p.theme === t[0]) + '">' + t[2] + t[1] + '</button>';
              }).join('') + '</div><span class="aide">« Automatique » suit le réglage de votre téléphone ou ordinateur.</span></div>' +
        '</div></section>' +
        '<section class="carte"><div class="carte-entete"><h2>Vos données</h2></div><div class="carte-corps" style="display:grid;gap:16px">' +
          '<p class="texte-2">Tout est enregistré sur cet appareil, rien n\'est envoyé sur internet. Faites une sauvegarde pour ne rien perdre ou pour changer d\'appareil.</p>' +
          '<div class="actions">' +
            '<button type="button" class="btn btn-secondaire" id="exporter">' + ICONES.telecharger + 'Télécharger une sauvegarde</button>' +
            '<button type="button" class="btn btn-secondaire" id="importer">' + ICONES.importer + 'Restaurer une sauvegarde</button>' +
            '<input type="file" id="fichier-import" accept="application/json,.json" hidden>' +
            '<button type="button" class="btn btn-danger" id="reinitialiser">Remettre les données de démonstration</button>' +
          '</div></div></section>' +
      '</div>';
    ameliorerListes(zone());

    let minuteur;
    zone().querySelectorAll('[data-entreprise]').forEach(function (el) {
      el.addEventListener('input', function () {
        const etatEl = document.getElementById('etat-entreprise');
        etatEl.textContent = 'Enregistrement…';
        clearTimeout(minuteur);
        minuteur = setTimeout(function () {
          const modifs = {};
          zone().querySelectorAll('[data-entreprise]').forEach(function (x) { modifs[x.dataset.entreprise] = x.value; });
          Donnees.modifierEntreprise(modifs);
          etatEl.innerHTML = ICONES.coche + 'Enregistré';
        }, 400);
      });
    });
    document.getElementById('tva-defaut').addEventListener('change', function (e) { Donnees.modifierPreferences({ tvaParDefaut: Number(e.target.value) }); toast('TVA par défaut : ' + e.target.value + ' %'); });
    document.getElementById('delai').addEventListener('change', function (e) { Donnees.modifierPreferences({ delaiPaiement: Number(e.target.value) }); toast('Délai de paiement enregistré'); });
    zone().querySelector('[aria-labelledby="titre-theme"]').addEventListener('click', function (e) {
      const b = e.target.closest('[data-theme-choix]');
      if (!b) return;
      Donnees.modifierPreferences({ theme: b.dataset.themeChoix });
      zone().querySelectorAll('[data-theme-choix]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
      appliquerTheme();
    });
    document.getElementById('exporter').addEventListener('click', function () {
      // On fabrique un fichier en mémoire (Blob) et on déclenche son téléchargement.
      const blob = new Blob([Donnees.exporter()], { type: 'application/json' });
      const lien = document.createElement('a');
      lien.href = URL.createObjectURL(blob);
      lien.download = 'qalam-sauvegarde-' + C.dateISO() + '.json';
      document.body.appendChild(lien);
      lien.click();
      lien.remove();
      setTimeout(function () { URL.revokeObjectURL(lien.href); }, 1000);
      toast('Sauvegarde téléchargée');
    });
    const fichier = document.getElementById('fichier-import');
    document.getElementById('importer').addEventListener('click', function () { fichier.click(); });
    fichier.addEventListener('change', function () {
      const f = fichier.files[0];
      if (!f) return;
      const lecteur = new FileReader();
      lecteur.onload = function () {
        if (Donnees.importer(lecteur.result)) { toast('Sauvegarde restaurée'); appliquerTheme(); reglages(); }
        else toast('Ce fichier n\'est pas une sauvegarde valide.', 'erreur');
      };
      lecteur.readAsText(f);
      fichier.value = '';
    });
    const reinit = document.getElementById('reinitialiser');
    reinit.addEventListener('click', function () {
      confirmerEnDeuxClics(reinit, 'Confirmer : tout remplacer ?', function () {
        Donnees.reinitialiser();
        appliquerTheme();
        toast('Données de démonstration remises');
        reglages();
      });
    });
  }

  /* ---------- Thème clair / sombre ---------- */
  function appliquerTheme() {
    const choix = Donnees.etat.preferences.theme;
    const racine = document.documentElement;
    if (choix === 'clair') racine.setAttribute('data-theme', 'light');
    else if (choix === 'sombre') racine.setAttribute('data-theme', 'dark');
    else racine.removeAttribute('data-theme');
    const sombre = choix === 'sombre' || (choix === 'systeme' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', sombre ? '#151b2b' : '#ffffff');
  }

  return {
    tableauDeBord: tableauDeBord,
    listeDocuments: listeDocuments,
    editeur: editeur,
    mettreAJourApercu: mettreAJourApercu,
    clients: clients,
    reglages: reglages,
    ouvrirFicheClient: ouvrirFicheClient,
    appliquerTheme: appliquerTheme,
    statut: statut
  };
})();
