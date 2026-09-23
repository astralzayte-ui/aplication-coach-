/* =========================================================
   app.js — Démarrage, navigation, raccourcis, hors connexion
   ---------------------------------------------------------
   L'application tient dans UNE seule page HTML ("single page
   application"). La partie après le # de l'adresse indique
   l'écran à afficher :
     #/            tableau de bord
     #/devis       liste des devis
     #/factures    liste des factures
     #/clients     clients
     #/reglages    réglages
     #/document/ID un devis ou une facture
     #/nouveau/devis  crée un devis puis l'ouvre
   Changer d'écran ne recharge pas la page : c'est instantané.
   ========================================================= */

(function () {
  'use strict';

  const LIENS = [
    { route: '', texte: 'Tableau de bord', court: 'Accueil', icone: 'tableau' },
    { route: 'devis', texte: 'Devis', court: 'Devis', icone: 'devis' },
    { route: 'factures', texte: 'Factures', court: 'Factures', icone: 'facture' },
    { route: 'clients', texte: 'Clients', court: 'Clients', icone: 'clients' },
    { route: 'reglages', texte: 'Réglages', court: 'Réglages', icone: 'reglages' }
  ];

  // Lit l'adresse : "#/document/d7" → { nom: 'document', parametre: 'd7' }
  function routeActuelle() {
    const morceaux = location.hash.replace(/^#\/?/, '').split('/');
    return { nom: morceaux[0] || '', parametre: morceaux[1] || '' };
  }

  /* ---------- Menus ---------- */
  function afficherMenus() {
    const r = routeActuelle();
    // Sur un document, on met en avant "Devis" ou "Factures" selon son type.
    let actif = r.nom;
    if (r.nom === 'document') {
      const d = Donnees.documentParId(r.parametre);
      actif = d ? (d.type === 'facture' ? 'factures' : 'devis') : '';
    }
    const enRetard = Donnees.etat.documents.filter(function (d) { return Vues.statut(d) === 'en-retard'; }).length;
    const lien = function (l, court) {
      return '<a href="#/' + l.route + '"' + (l.route === actif ? ' aria-current="page"' : '') + '>' + ICONES[l.icone] +
        '<span>' + (court ? l.court : l.texte) + '</span>' +
        (!court && l.route === 'factures' && enRetard ? '<span class="compteur" title="Factures en retard">' + enRetard + '</span>' : '') + '</a>';
    };
    document.getElementById('navigation').innerHTML = LIENS.map(function (l) { return lien(l, false); }).join('');
    document.getElementById('navigation-bas').innerHTML = LIENS.map(function (l) { return lien(l, true); }).join('');
    // Bouton "+" de la barre mobile : crée un document du type de l'écran courant.
    const bouton = document.getElementById('bouton-nouveau-mobile');
    const type = actif === 'devis' ? 'devis' : 'facture';
    bouton.href = '#/nouveau/' + type;
    bouton.innerHTML = ICONES.plus + '<span>' + (type === 'devis' ? 'Devis' : 'Facture') + '</span>';
  }

  /* ---------- Routeur : affiche l'écran demandé par l'adresse ---------- */
  function afficher() {
    const r = routeActuelle();
    // Adresse inconnue → tableau de bord (jamais de page cassée).
    if (r.nom === 'nouveau') {
      const type = r.parametre === 'devis' ? 'devis' : 'facture';
      const doc = Donnees.creerDocument(type);
      location.replace('#/document/' + doc.id);       // replace : "Retour" ne recrée pas un document
      return;
    }
    if (r.nom === 'devis') Vues.listeDocuments('devis');
    else if (r.nom === 'factures') Vues.listeDocuments('facture');
    else if (r.nom === 'clients') Vues.clients();
    else if (r.nom === 'reglages') Vues.reglages();
    else if (r.nom === 'document') Vues.editeur(r.parametre);
    else Vues.tableauDeBord();

    afficherMenus();
    const titres = { devis: 'Devis', factures: 'Factures', clients: 'Clients', reglages: 'Réglages', document: 'Document' };
    document.title = (titres[r.nom] ? titres[r.nom] + ' · ' : '') + 'Qalam — Devis et factures';
  }

  window.addEventListener('hashchange', function () {
    afficher();
    window.scrollTo(0, 0);
    document.getElementById('vue').focus({ preventScroll: true });   // lecteurs d'écran : on annonce le nouvel écran
  });

  // Quand les données changent (ici ou dans un autre onglet) :
  // - listes et tableau de bord sont redessinés ;
  // - dans l'éditeur et les réglages, on ne redessine pas le formulaire
  //   (on perdrait le curseur de l'utilisateur en pleine saisie), seulement l'aperçu.
  Donnees.abonner(function () {
    const nom = routeActuelle().nom;
    // Pendant la création d'un document (#/nouveau/…), on ne redessine rien :
    // sinon la sauvegarde relancerait la création, qui relancerait la sauvegarde… (boucle infinie).
    if (nom === 'nouveau') return;
    if (nom === 'document') Vues.mettreAJourApercu();
    else if (nom !== 'reglages' && !document.getElementById('dialogue-client').open) afficher();
    afficherMenus();
  });

  /* ---------- Raccourcis clavier ---------- */
  let attenteG = false;
  document.addEventListener('keydown', function (e) {
    // Jamais de raccourci pendant une saisie ou avec Ctrl/Cmd/Alt.
    const cible = e.target;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (cible.closest('input, textarea, [contenteditable], dialog[open], [role="listbox"], .calendrier')) return;

    if (attenteG) {
      attenteG = false;
      const destinations = { t: '#/', d: '#/devis', f: '#/factures', c: '#/clients', r: '#/reglages' };
      if (destinations[e.key.toLowerCase()]) { e.preventDefault(); location.hash = destinations[e.key.toLowerCase()]; }
      return;
    }
    if (e.key === 'g' || e.key === 'G') { attenteG = true; setTimeout(function () { attenteG = false; }, 1200); return; }
    if (e.key === '/') {
      const recherche = document.getElementById('recherche');
      if (recherche) { e.preventDefault(); recherche.focus(); recherche.select(); }
      return;
    }
    if (e.key === '?') { e.preventDefault(); ouvrirDialogue('dialogue-raccourcis'); return; }
    if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      location.hash = routeActuelle().nom === 'devis' ? '#/nouveau/devis' : '#/nouveau/facture';
    }
  });

  /* ---------- Boutons globaux ---------- */
  document.getElementById('icone-clavier').innerHTML = ICONES.clavier;
  document.getElementById('icone-installer').innerHTML = ICONES.telecharger;
  document.getElementById('fermer-raccourcis').innerHTML = ICONES.croix;
  document.addEventListener('click', function (e) {
    const ouvrir = e.target.closest('[data-ouvrir]');
    if (ouvrir) ouvrirDialogue(ouvrir.dataset.ouvrir);
    const fermer = e.target.closest('#dialogue-raccourcis [data-fermer]');
    if (fermer) fermerDialogue('dialogue-raccourcis');
  });
  // Clic sur le fond sombre autour d'une fenêtre : on la ferme.
  document.querySelectorAll('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d) d.close(); });
  });

  /* ---------- Thème ---------- */
  Vues.appliquerTheme();
  // Si le système passe en sombre (le soir, par exemple) et que l'utilisateur est en "Automatique".
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', Vues.appliquerTheme);

  /* ---------- Application installable et hors connexion (PWA) ---------- */
  // Le "service worker" est un petit script qui garde une copie des fichiers :
  // l'application s'ouvre même sans internet. (Il ne fonctionne qu'en https ou en local.)
  if ('serviceWorker' in navigator && /^(https:|http:\/\/localhost|http:\/\/127\.0\.0\.1)/.test(location.href)) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* navigateur ou contexte non compatible : l'appli marche quand même */ });
  }
  // Chrome propose l'installation : on affiche notre propre bouton "Installer".
  let invitationInstallation = null;
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    invitationInstallation = e;
    document.getElementById('installer').hidden = false;
  });
  document.getElementById('installer').addEventListener('click', function () {
    if (!invitationInstallation) return;
    invitationInstallation.prompt();
    invitationInstallation = null;
    document.getElementById('installer').hidden = true;
  });

  afficher();
})();
