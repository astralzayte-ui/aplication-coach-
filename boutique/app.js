/* SILENCE — tout ce qui bouge sur le site.
   L'en-tête et le pied sont fabriqués ici, une seule fois, pour toutes les pages. */
(function () {
  'use strict';
  var C = window.CONFIG, P = window.PRODUITS;

  /* ---------- outils ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function euro(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  function echap(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : String(s); return d.innerHTML; }
  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function produit(id) { return P.filter(function (p) { return p.id === id; })[0]; }
  window.SILENCE_OUTILS = { euro: euro, echap: echap, lire: lire, ecrire: ecrire };

  var ICO = {
    loupe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg>',
    coeur: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-9.2-8.6C1.2 8.2 3 5 6.2 5c2 0 3.3 1.1 3.8 2.2h.1C10.6 6.1 11.9 5 13.9 5 17 5 18.8 8.2 17.3 11.4 15.1 15.6 12 20 12 20Z" transform="translate(1 0)"/></svg>',
    sac: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    burger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    fleche: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m6 9 6 6 6-6"/></svg>',
    camion: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/></svg>',
    carte: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/></svg>',
    loupeCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="m8.2 11 2 2 3.6-3.8M20 20l-3.6-3.6"/></svg>',
    bulle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    bouclier: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z"/><path d="m8.5 12 2.3 2.3L15.5 9.6"/></svg>',
    retour: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 12a8 8 0 1 0 2.3-5.6L4 8.7"/><path d="M4 4v4.7h4.7"/></svg>'
  };
  window.SILENCE_ICO = ICO;

  var WA = 'https://wa.me/' + C.whatsapp;
  function waTexte(t) { return WA + '?text=' + encodeURIComponent(t); }

  /* ---------- l'en-tête ---------- */
  function entete() {
    var e = $('#entete'); if (!e) return;
    var messages = [
      '🇫🇷 Livrée en France en 6 à 15 jours',
      'Changé d\'avis ? Remboursé sur ta carte',
      'Paiement par carte',
      'Un vrai contact sur WhatsApp'
    ];
    var piste = messages.concat(messages).map(function (m) { return '<span>' + m + '</span>'; }).join('');
    e.innerHTML =
      '<div class="haut" data-haut>' +
      '<div class="bandeau" aria-hidden="true"><div class="bandeau-piste">' + piste + '</div></div>' +
      '<header class="entete"><div class="enveloppe entete-rangee">' +
        '<div class="entete-gauche">' +
          '<button class="icone burger" type="button" aria-label="Menu" data-ouvre-tiroir>' + ICO.burger + '</button>' +
          '<a class="logo" href="index.html" aria-label="Ambre Noire Paris — accueil"><span class="logo-mot">Ambre<span class="goutte"></span> Noire</span></a>' +
        '</div>' +
        '<div class="icones">' +
          '<button class="icone" type="button" aria-label="Rechercher" data-ouvre-recherche>' + ICO.loupe + '</button>' +
          '<a class="icone favori-tete" href="collection.html?c=favoris" aria-label="Mes favoris">' + ICO.coeur + '<span class="pastille" data-compte-favoris></span></a>' +
          '<button class="icone" type="button" aria-label="Ton panier" data-ouvrir-panier>' + ICO.sac + '<span class="pastille" data-compteur></span></button>' +
        '</div>' +
      '</div>' +
      '<nav class="rayons-barre" aria-label="Catégories"><div class="enveloppe rayons-piste">' +
        '<a href="collection.html?c=tout" data-rayon="tout">Nouveautés</a>' +
        window.RAYONS.map(function (r) { return '<a href="collection.html?c=' + r.id + '" data-rayon="' + r.id + '">' + r.nom + '</a>'; }).join('') +
        '<a href="index.html#faq">F.A.Q</a>' +
      '</div></nav>' +
      '</header></div>' +
      '<div class="tiroir" data-tiroir><div class="tiroir-fond" data-ferme-tiroir></div><div class="tiroir-corps">' +
        '<button class="tiroir-fermer" type="button" aria-label="Fermer" data-ferme-tiroir>&times;</button>' +
        '<a href="collection.html?c=tout">Tout voir</a>' +
        window.RAYONS.map(function (r) { return '<a href="collection.html?c=' + r.id + '">' + r.nom + '</a>'; }).join('') +
        '<a href="collection.html?c=favoris">Mes favoris</a>' +
        '<a href="index.html#faq">F.A.Q</a>' +
        '<a href="' + waTexte('Bonjour, je voudrais suivre ma commande. Mon numéro de commande : ') + '" target="_blank" rel="noopener">Suivre ma commande</a>' +
        '<a href="' + waTexte('Bonjour Ambre Noire, j\'ai une question : ') + '" target="_blank" rel="noopener">Contact WhatsApp <span class="petit">' + C.whatsappAffiche + '</span></a>' +
      '</div></div>' +
      '<div class="recherche" data-recherche><div class="recherche-boite">' +
        '<input type="search" placeholder="Rechercher une pièce…" aria-label="Rechercher" data-champ-recherche>' +
        '<div class="recherche-pop">Recherches populaires : <a href="#" data-cherche="hoodie">Hoodie</a><a href="#" data-cherche="ensemble">Ensemble</a><a href="#" data-cherche="robe">Robe</a><a href="#" data-cherche="bonnet">Bonnet</a></div>' +
        '<div class="recherche-res" data-resultats></div>' +
      '</div></div>';
  }

  function enteteVivante() {
    var c = new URLSearchParams(location.search).get('c');
    if (c) $$('[data-rayon]').forEach(function (a) { a.classList.toggle('actif', a.getAttribute('data-rayon') === c); });
    var h = $('[data-haut]'); if (!h) return;
    var plie = false;
    window.addEventListener('scroll', function () {
      var p = scrollY > 140;
      if (p !== plie) { plie = p; h.classList.toggle('plie', p); }
    }, { passive: true });
  }

  /* ---------- le pied ---------- */
  function pied() {
    var f = $('#pied'); if (!f) return;
    f.innerHTML =
      '<footer class="pied"><div class="enveloppe pied-haut">' +
        '<div class="pied-lettre">' +
          '<a class="logo-pied" href="index.html"><span class="logo-mot logo-pile">Ambre<span class="goutte"></span><br>Noire<small>Paris</small></span></a>' +
          '<h3>Les nouveautés en premier</h3>' +
          '<p>Laisse ton e-mail : tu passes avant tout le monde sur les nouvelles pièces.</p>' +
          formulaire('pied', 'C\'est parti') +
        '</div>' +
        '<div><h4>Aide &amp; Contact</h4>' +
          '<a href="index.html#faq">F.A.Q</a>' +
          '<a href="' + waTexte('Bonjour, je voudrais suivre ma commande. Mon numéro de commande : ') + '" target="_blank" rel="noopener">Suivre ma commande</a>' +
          '<a href="' + WA + '" target="_blank" rel="noopener">WhatsApp ' + C.whatsappAffiche + '</a>' +
          '<a href="mailto:' + C.email + '">' + C.email + '</a>' +
        '</div>' +
        '<div><h4>Nos politiques</h4>' +
          '<a href="cgv.html">Conditions générales de vente</a>' +
          '<a href="remboursements.html">Retours et remboursements</a>' +
          '<a href="retractation.html">Formulaire de rétractation</a>' +
          '<a href="confidentialite.html">Confidentialité</a>' +
          '<a href="mentions-legales.html">Mentions légales</a>' +
        '</div>' +
        '<div><h4>Nous suivre</h4>' +
          '<a href="https://instagram.com/' + C.instagram + '" target="_blank" rel="noopener">Instagram</a>' +
          '<a href="https://tiktok.com/@' + C.tiktok + '" target="_blank" rel="noopener">TikTok</a>' +
        '</div>' +
      '</div>' +
      '<div class="pied-bas"><div class="enveloppe"><span>© ' + new Date().getFullYear() + ' Ambre Noire Paris, une marque de <b>Onyx Street Wear LLC</b> (Wyoming, États-Unis, n° 2026-002050731) · 30 N Gould St Ste R, Sheridan, WY 82801 · <a href="mentions-legales.html" style="display:inline;text-decoration:underline">Mentions légales</a></span>' +
        '<div class="paiements"><span>Carte bancaire</span><span>Visa</span><span>Mastercard</span></div></div></div>' +
      '</footer>';
  }

  /* ---------- le formulaire e-mail (popup + pied) ---------- */
  function accord() {
    return '<label class="accord"><input type="checkbox" name="accord" value="oui">' +
      '<span>J\'accepte de recevoir les e-mails d\'Ambre Noire Paris (nouveautés et offres). Désinscription en un clic. <a href="confidentialite.html">Confidentialité</a></span></label>';
  }

  function formulaire(source, bouton) {
    return '<form class="formulaire-lettre" data-lettre="' + source + '" novalidate>' +
      '<input type="email" name="email" required autocomplete="email" placeholder="Ton e-mail" aria-label="Ton adresse e-mail">' +
      accord() +
      '<button class="btn btn-plein" type="submit">' + bouton + '</button>' +
      '</form>';
  }

  function envoyerLettre(email, source) {
    var accord = 'oui — ' + new Date().toISOString();   // la preuve de l'accord, datée
    // /api/inscription : la copie de sécurité + Brevo (la liste + l'e-mail de bienvenue avec le code)
    var v = ''; try { v = (JSON.parse(localStorage.getItem('silence.source')) || {}).v || ''; } catch (e) {}
    return fetch('/api/inscription', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, source: source, accord: accord, v: v }) }).catch(function () {});
  }

  function activerCode() {
    ecrire('silence.inscrit', true);
    if (window.SILENCE && window.SILENCE.rafraichir) window.SILENCE.rafraichir();
  }

  function secouer(el) { el.classList.add('secoue', 'a-cocher'); setTimeout(function () { el.classList.remove('secoue'); }, 450); }

  function brancherFormulaires() {
    document.addEventListener('submit', function (ev) {
      var f = ev.target.closest && ev.target.closest('[data-lettre]');
      if (!f) return;
      ev.preventDefault();
      var champ = f.querySelector('input[type=email]');
      var v = (champ.value || '').trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { secouer(champ); champ.focus(); return; }
      var coche = f.querySelector('input[name=accord]');
      if (coche && !coche.checked) { secouer(coche.closest('.accord')); coche.focus(); return; }  // pas d'accord, pas d'inscription
      envoyerLettre(v, f.getAttribute('data-lettre'));
      activerCode();
      if (f.getAttribute('data-lettre') === 'popup') {
        $('[data-popup-form]').classList.add('cache');
        $('[data-popup-code]').classList.add('visible');
      } else {
        f.innerHTML = '<p style="color:var(--noir);margin:0">C\'est noté ✓ Tu verras les nouveautés avant tout le monde.</p>';
      }
    });
  }

  /* ---------- le popup -10 % ---------- */
  function popup() {
    var force = /[?&]popup\b/.test(location.search);              // ?popup = toujours l'afficher (pour tester)
    if (!force && lire('silence.inscrit', false)) return;
    var vu = lire('silence.popup-vu', 0);
    if (!force && vu && Date.now() - vu < 7 * 24 * 3600 * 1000) return;  // pas plus d'une fois par semaine
    var p = document.createElement('div');
    p.className = 'popup'; p.setAttribute('role', 'dialog'); p.setAttribute('aria-modal', 'true'); p.setAttribute('aria-label', '−10 % sur ta première commande');
    p.innerHTML =
      '<div class="popup-fond" data-ferme-popup></div>' +
      '<div class="popup-boite">' +
        '<button class="popup-fermer" type="button" aria-label="Fermer" data-ferme-popup>&times;</button>' +
        '<div class="popup-photo"><img src="img/vide.svg" alt=""></div>' +
        '<div class="popup-texte">' +
          '<span class="logo-mot logo-pile popup-logo">Ambre<span class="goutte"></span><br>Noire<small>Paris</small></span>' +
          '<h3>Profite de 10 %<br>de réduction</h3>' +
          '<div data-popup-form><p>Exclusivement pour ta première commande</p>' +
            '<form data-lettre="popup" novalidate>' +
              '<input type="email" name="email" required autocomplete="email" placeholder="Il te suffit de laisser ton e-mail" aria-label="Ton adresse e-mail">' +
              accord() +
              '<button class="btn" type="submit">Accède à ton offre spéciale</button>' +
            '</form>' +
          '</div>' +
          '<div class="popup-code" data-popup-code><p>C\'est fait. Ton code :</p><div class="code">' + C.codeBienvenue + '</div>' +
            '<p style="font-size:15px">Il s\'applique tout seul dans ton panier.</p>' +
            '<button class="btn" type="button" data-ferme-popup>Continuer mes achats</button></div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(p);

    var montre = false;
    function ouvrir() { if (montre || (!force && lire('silence.inscrit', false))) return; montre = true; p.classList.add('ouvert'); ecrire('silence.popup-vu', Date.now()); }
    function fermer() { p.classList.remove('ouvert'); }
    p.addEventListener('click', function (e) { if (e.target.closest('[data-ferme-popup]')) fermer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
    // 6 secondes sur le site AU TOTAL : changer de page ne remet pas le compteur à zéro
    var deja = 0; try { deja = +sessionStorage.getItem('silence.temps') || 0; } catch (e) {}
    var debut = Date.now();
    function noter() { try { sessionStorage.setItem('silence.temps', deja + Date.now() - debut); } catch (e) {} }
    window.addEventListener('pagehide', noter);
    document.addEventListener('visibilitychange', function () { if (document.hidden) noter(); });
    setTimeout(ouvrir, force ? 800 : Math.max(800, 6000 - deja));
    window.addEventListener('scroll', function () {              // ou quand il a descendu la moitié de la page
      if (scrollY > (document.documentElement.scrollHeight - innerHeight) * 0.5 && Date.now() - debut > 2500) ouvrir();
    }, { passive: true });
    document.addEventListener('mouseout', function (e) {         // ou quand la souris quitte la page
      if (!e.relatedTarget && e.clientY < 10) ouvrir();
    });
  }

  /* ---------- tiroir, recherche ---------- */
  function navigation() {
    document.addEventListener('click', function (e) {
      var t = e.target;
      if (t.closest('[data-ouvre-tiroir]')) { $('[data-tiroir]').classList.add('ouvert'); return; }
      if (t.closest('[data-ferme-tiroir]')) { $('[data-tiroir]').classList.remove('ouvert'); return; }
      if (t.closest('[data-ouvre-recherche]')) { var r = $('[data-recherche]'); r.classList.add('ouvert'); setTimeout(function () { $('[data-champ-recherche]').focus(); }, 30); chercher(''); return; }
      if (t.matches('[data-recherche]')) { t.classList.remove('ouvert'); return; }
      var c = t.closest('[data-cherche]');
      if (c) { e.preventDefault(); var ch = $('[data-champ-recherche]'); ch.value = c.getAttribute('data-cherche'); chercher(ch.value); return; }
      var m = t.closest('.menu-deroulant > button');
      if (m) { m.parentNode.classList.toggle('ouvert'); return; }
      $$('.menu-deroulant.ouvert').forEach(function (x) { if (!x.contains(t)) x.classList.remove('ouvert'); });
    });
    document.addEventListener('input', function (e) { if (e.target.matches('[data-champ-recherche]')) chercher(e.target.value); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { $$('.recherche.ouvert, .tiroir.ouvert').forEach(function (x) { x.classList.remove('ouvert'); }); }
    });
  }
  function sansAccent(s) { return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }
  function chercher(q) {
    var zone = $('[data-resultats]'); if (!zone) return;
    var n = sansAccent(q.trim());
    var res = P.filter(function (p) { return !n || sansAccent(p.nom + ' ' + p.note + ' ' + p.rayon).indexOf(n) > -1; });
    zone.innerHTML = res.length ? res.map(function (p) {
      return '<a href="produit.html?p=' + p.id + '"><img src="img/' + p.photos[0] + '" alt=""><div><b>' + echap(p.nom) + '</b><br><span style="color:var(--texte-doux)">' + euro(p.prix) + '</span></div></a>';
    }).join('') : '<p class="vide">Rien trouvé pour « ' + echap(q) + ' ».</p>';
  }

  /* ---------- favoris ---------- */
  function favoris() { return lire('silence.favoris', []); }
  function majFavoris() {
    var n = favoris().length;
    $$('[data-compte-favoris]').forEach(function (e) { e.textContent = n || ''; e.style.display = n ? 'flex' : 'none'; });
    $$('[data-favori]').forEach(function (b) {
      var on = favoris().indexOf(b.getAttribute('data-favori')) > -1;
      b.classList.toggle('aime', on); b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-favori]'); if (!b) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var id = b.getAttribute('data-favori'), f = favoris(), i = f.indexOf(id);
    if (i > -1) f.splice(i, 1); else f.push(id);
    ecrire('silence.favoris', f); majFavoris();
  }, true);

  /* ---------- la carte produit ---------- */
  /* la carte, façon grande boutique : photo haute, petite étiquette, le cœur, le nom, le prix */
  function carte(p) {
    var badge = p.badge ? '<span class="carte-badge">' + echap(p.badge) + '</span>' : '';
    var seconde = p.photos[1] ? '<img class="seconde" src="img/' + p.photos[1] + '" alt="" loading="lazy">' : '';
    return '<a class="carte-produit" href="produit.html?p=' + p.id + '" data-produit="' + echap(p.nom) + '">' +
      '<div class="carte-photo">' +
        '<img class="premiere" src="img/' + p.photos[0] + '" alt="' + echap(p.nom) + '" loading="lazy">' + seconde + badge +
        '<button class="coeur" type="button" aria-label="Ajouter aux favoris" data-favori="' + p.id + '">' + ICO.coeur + '</button>' +
      '</div>' +
      '<div class="carte-nom">' + echap(p.nom) + '</div>' +
      '<div class="carte-prix">' + euro(p.prix) + '</div>' +
    '</a>';
  }
  window.SILENCE_CARTE = carte;

  /* ---------- l'accueil ---------- */
  /* la plus belle photo d'un rayon : celle de sa première pièce qui en a une */
  function photoRayon(id) {
    var avec = P.filter(function (p) { return p.rayon === id && p.photos[0] !== 'vide.svg'; })[0];
    return avec ? avec.photos[0] : 'vide.svg';
  }

  function accueil() {
    if (document.body.getAttribute('data-page') !== 'accueil') return;

    // les rayons en grandes tuiles
    var tu = $('[data-tuiles]');
    if (tu) tu.innerHTML = window.RAYONS.map(function (r) {
      return '<a class="tuile" href="collection.html?c=' + r.id + '">' +
        '<img src="img/' + photoRayon(r.id) + '" alt="" loading="lazy">' +
        '<span class="tuile-texte"><b>' + echap(r.nom) + '</b><span>Voir tout</span></span></a>';
    }).join('');

    // tendance : les pièces vedettes d'abord, puis le reste
    var pi = $('[data-piste]');
    if (pi) pi.innerHTML = P.filter(function (p) { return p.vedette; })
      .concat(P.filter(function (p) { return !p.vedette; })).slice(0, 8).map(carte).join('');

    // nouveautés : toute la boutique, celles qui ont leurs photos en premier
    var grille = $('[data-grille]');
    if (grille) grille.innerHTML = P.slice().sort(function (a, b) {
      return (a.photos[0] === 'vide.svg') - (b.photos[0] === 'vide.svg');
    }).map(carte).join('');

    // insta : 4 photos de la boutique
    var ins = $('[data-insta]');
    if (ins) {
      var photos = [];
      P.forEach(function (p) { p.photos.forEach(function (ph) { if (ph !== 'vide.svg') photos.push(ph); }); });
      while (photos.length < 4) photos.push('vide.svg');
      ins.innerHTML = photos.slice(0, 4).map(function (ph) {
        return '<a href="https://instagram.com/' + C.instagram + '" target="_blank" rel="noopener"><img src="img/' + ph + '" alt="" loading="lazy"></a>';
      }).join('');
      var lien = $('[data-insta-lien]'); if (lien) { lien.href = 'https://instagram.com/' + C.instagram; lien.textContent = '@' + C.instagram; }
    }
    majFavoris();

    // l'escalier des lots
    var esc = $('[data-escalier]');
    if (esc) esc.innerHTML = window.LOTS.map(function (l) {
      return '<div class="marche' + (l.mis ? ' mise' : '') + '">' +
        (l.mis ? '<span class="marche-drapeau">★ ' + echap(l.mis) + '</span>' : '') +
        '<h3>' + echap(l.titre) + '</h3><div class="detail">' + echap(l.detail) + '</div>' +
        '<div class="prix">' + euro(l.prix) + '</div>' +
        (l.gain ? '<span class="gain">Tu économises ' + echap(l.gain) + '</span>' : '<span class="gain">&nbsp;</span>') +
        '<button class="btn ' + (l.mis ? 'btn-plein' : 'btn-vide') + ' btn-large" type="button" data-ajouter="' + echap(l.ajouter) + '" data-prix="' + l.prix.toFixed(2).replace('.', ',') + '">Ajouter au panier</button>' +
      '</div>';
    }).join('');

    // les univers
    var u = $('[data-univers]');
    if (u) {
      u.innerHTML = window.RAYONS.map(function (r, i) {
        var liste = P.filter(function (p) { return p.rayon === r.id; });
        return '<div class="univ' + (i === 0 ? ' ouvert' : '') + '" data-univ tabindex="0" role="button" aria-expanded="' + (i === 0) + '">' +
          '<div class="univ-ferme"><span class="compte">' + liste.length + '</span><span class="vertical">' + echap(r.nom) + '</span><span class="fleche">›</span></div>' +
          '<div class="univ-ouvert">' +
            '<span class="univ-badge">★ ' + (i === 0 ? 'Univers phare · ' : '') + liste.length + ' pièce' + (liste.length > 1 ? 's' : '') + '</span>' +
            '<h3>' + echap(r.nom) + '</h3><p>' + echap(r.texte) + '</p>' +
            '<div class="univ-liste">' + liste.map(function (p) {
              return '<a href="produit.html?p=' + p.id + '"><img src="img/' + p.photos[0] + '" alt=""><div><b>' + echap(p.nom) + '</b>' + euro(p.prix) + '</div></a>';
            }).join('') + '</div>' +
            '<a class="btn btn-plein" href="collection.html?c=' + r.id + '">Explorer · ' + liste.length + ' pièce' + (liste.length > 1 ? 's' : '') + ' →</a>' +
          '</div></div>';
      }).join('');
      u.addEventListener('click', function (e) {
        var c = e.target.closest('[data-univ]');
        if (!c || c.classList.contains('ouvert')) return;
        $$('[data-univ]', u).forEach(function (x) { x.classList.toggle('ouvert', x === c); x.setAttribute('aria-expanded', x === c); });
      });
      u.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('[data-univ]')) { e.preventDefault(); e.target.click(); } });
    }

    // les avis — seulement s'il y en a de vrais
    var av = $('[data-avis]');
    if (av && !window.AVIS.length) {
      av.outerHTML = '<div class="avis-vide"><p><b>Zéro avis pour l\'instant — et zéro avis inventé.</b><br>La boutique ouvre : les premiers avis arriveront avec les premières commandes.</p>' +
        '<a class="btn btn-vide" href="https://instagram.com/' + C.instagram + '" target="_blank" rel="noopener">Tague @' + C.instagram + ' · on te reposte</a></div>';
    }

    faq($('[data-faq]'));
  }

  function faq(zone) {
    if (!zone) return;
    zone.innerHTML = window.FAQ.map(function (f) {
      return '<details><summary>' + echap(f.q) + '</summary><p>' + echap(f.r) + '</p></details>';
    }).join('');
  }

  /* ---------- la fiche produit ---------- */
  /* façon grande boutique : les photos qui glissent, le nom, le prix, la taille, un gros bouton noir,
     puis les détails en tiroirs. Pas d'avis inventés : la zone n'existe pas tant qu'il n'y en a pas. */
  var SANS_TAILLE = { sacs: 1, accessoires: 1 };

  function avecQuoi(p) {
    // deux pièces qui vont avec : un accessoire pour un vêtement, un vêtement pour un accessoire
    var ids = SANS_TAILLE[p.rayon] ? ['hoodie-ailes', 'ensemble-hoodie'] : ['echarpe-grise', 'bonnet-camouflage'];
    if (/^bonnet/.test(p.id)) ids = ['hoodie-ailes', 'echarpe-leopard'];
    return ids.map(produit).filter(function (x) { return x && x.id !== p.id; });
  }

  function fiche() {
    var zone = $('[data-fiche]'); if (!zone) return;
    var id = new URLSearchParams(location.search).get('p') || 'hoodie-ailes';
    var p = produit(id) || window.PRODUITS[0];
    document.title = p.nom + ' — Ambre Noire Paris';
    var sansTaille = !!SANS_TAILLE[p.rayon];
    var tailles = sansTaille ? [] : (p.tailles || ['XS', 'S', 'M', 'L', 'XL', 'XXL']);
    var parDefaut = tailles.indexOf('M') > -1 ? 'M' : tailles[0];
    var prixTexte = p.prix.toFixed(2).replace('.', ',');
    var details = (p.details || [p.note, 'Matière : à confirmer avec le fournisseur']).slice();
    if (!details.some(function (d) { return /^Entretien/.test(d); })) details.push('Entretien et pays de fabrication : à confirmer avec le fournisseur');
    var bonnet = /^bonnet/.test(p.id);

    zone.innerHTML =
      '<div class="galerie2">' +
        '<div class="defile" data-defile>' + p.photos.map(function (ph, i) {
          return '<img src="img/' + ph + '" alt="' + echap(p.nom) + ' — photo ' + (i + 1) + '"' + (i ? ' loading="lazy"' : ' fetchpriority="high"') + '>';
        }).join('') + '</div>' +
        (p.photos.length > 1 ? '<div class="defile-points" data-points>' + p.photos.map(function (ph, i) { return '<span' + (i ? '' : ' class="actif"') + '></span>'; }).join('') + '</div>' : '') +
      '</div>' +
      '<div class="fiche-info">' +
        (p.badge ? '<span class="carte-badge fiche-badge">' + echap(p.badge) + '</span>' : '') +
        '<h1>' + echap(p.nom) + '</h1>' +
        '<div class="fiche-prix">' + euro(p.prix) + '</div>' +
        '<div class="fiche-prix-note">Taxes incluses · + ' + euro(C.livraison) + ' de livraison</div>' +
        (p.couleur ? '<div class="choix-titre"><span>Couleur / <b>' + echap(p.couleur) + '</b></span></div>' : '') +
        (tailles.length ? '<div class="choix-titre"><span>Taille / <b data-taille-affichee>M</b></span><a href="#tailles" data-ouvre-tailles>Guide des tailles</a></div>' +
        '<div class="tailles" role="radiogroup" aria-label="Taille">' + tailles.map(function (t) {
          return '<button type="button" class="taille" role="radio" data-taille="' + t + '" data-choisie="' + (t === parDefaut ? 'oui' : 'non') + '" aria-checked="' + (t === parDefaut) + '">' + t + '</button>';
        }).join('') + '</div>' : '') +
        '<button class="btn btn-noir btn-large btn-pilule" type="button" data-ajouter="' + echap(p.nom) + '" data-prix="' + prixTexte + '">Ajouter au panier ' + ICO.sac + '</button>' +
        '<div class="fiche-lignes">' +
          '<div>' + ICO.camion + '<span><b>Livraison en France</b> · expédiée sous 2 à 5 jours, puis 4 à 10 jours ouvrés de transport</span></div>' +
          '<div>' + ICO.retour + '<span>Changé d\'avis ? <b>Remboursé sur ta carte</b></span></div>' +
          '<div>' + ICO.bulle + '<span>Une question ? <a class="lien-wa" href="' + waTexte('Bonjour Ambre Noire, une question sur : ' + p.nom) + '" target="_blank" rel="noopener"><b>Écris-nous sur WhatsApp</b></a> · ' + C.whatsappAffiche + '</span></div>' +
        '</div>' +
        '<div class="faq tiroirs">' +
          '<details><summary>Détails du produit</summary><div class="tiroir-texte"><p>' + echap(p.description) + '</p><ul>' +
            details.map(function (d) { return '<li>' + echap(d) + '</li>'; }).join('') + '</ul>' +
            '<p class="petit-gris">Photos de présentation réalisées par IA, à partir des photos du produit.</p></div></details>' +
          (tailles.length ? '<details id="tailles"><summary>Guide des tailles</summary><div class="tiroir-texte"><p>Mesure ton tour de poitrine sans serrer et reporte-toi au tableau. Entre deux tailles, prends la plus grande.</p>' +
            '<div class="table-defile"><table class="table-tailles"><thead><tr><th>Taille</th><th>Poitrine</th><th>Longueur</th></tr></thead><tbody>' +
            tailles.map(function (t) { return '<tr><td><b>' + t + '</b></td><td>—</td><td>—</td></tr>'; }).join('') +
            '</tbody></table></div><p class="a-confirmer">Mesures en cm à recevoir du fournisseur.</p></div></details>' : '') +
          '<details><summary>Livraison &amp; retours</summary><div class="tiroir-texte"><p>Expédié depuis l\'entrepôt de notre fournisseur, en Chine : préparation en 2 à 5 jours, puis 4 à 10 jours ouvrés de transport. Le suivi t\'est envoyé dès le départ du colis. Pour changer d\'avis ou signaler un défaut, tout est dans nos <a href="cgv.html">conditions générales de vente</a>.</p></div></details>' +
        '</div>' +
      '</div>';

    // les points sous les photos suivent le glissement
    var def = $('[data-defile]'), pts = $$('[data-points] span');
    if (def && pts.length) def.addEventListener('scroll', function () {
      var i = Math.round(def.scrollLeft / (def.scrollWidth / pts.length));
      pts.forEach(function (s, k) { s.classList.toggle('actif', k === i); });
    }, { passive: true });

    // la barre d'achat collée en bas, sur téléphone
    var barre = document.createElement('div');
    barre.className = 'barre-achat';
    barre.innerHTML = '<div><b>' + euro(p.prix) + '</b></div><button class="btn btn-noir btn-pilule" type="button" data-ajouter="' + echap(p.nom) + '" data-prix="' + prixTexte + '">Ajouter au panier</button>';
    document.body.appendChild(barre);

    zone.addEventListener('click', function (e) {
      var t = e.target.closest('[data-taille]');
      if (t) {
        $$('[data-taille]').forEach(function (x) { var on = x === t; x.setAttribute('data-choisie', on ? 'oui' : 'non'); x.setAttribute('aria-checked', on); });
        $('[data-taille-affichee]').textContent = t.getAttribute('data-taille'); return;
      }
      if (e.target.closest('[data-ouvre-tailles]')) { var d = $('#tailles'); if (d) d.open = true; }
    });

    // porte-le avec
    var av = $('[data-avec]');
    if (av) {
      var liste = avecQuoi(p);
      if (!liste.length) $('[data-avec-zone]').hidden = true;
      av.innerHTML = liste.map(function (x) {
        var direct = !!SANS_TAILLE[x.rayon];
        return '<div class="avec-ligne">' +
          '<a href="produit.html?p=' + x.id + '"><img src="img/' + x.photos[0] + '" alt="" loading="lazy"></a>' +
          '<div><a href="produit.html?p=' + x.id + '" class="avec-nom">' + echap(x.nom) + '</a>' +
          '<div class="avec-prix">' + euro(x.prix) + '</div>' +
          (direct ? '<button class="btn btn-noir btn-pilule btn-petit" type="button" data-ajouter="' + echap(x.nom) + '" data-prix="' + x.prix.toFixed(2).replace('.', ',') + '" data-sans-taille>+ Ajouter</button>'
                  : '<a class="btn btn-noir btn-pilule btn-petit" href="produit.html?p=' + x.id + '">Choisir ma taille</a>') +
          '</div></div>';
      }).join('');
    }

    // tu vas aimer : les pièces du même rayon d'abord
    var autres = $('[data-autres]');
    if (autres) {
      var memes = P.filter(function (x) { return x.id !== p.id && x.rayon === p.rayon; });
      var reste = P.filter(function (x) { return x.id !== p.id && x.rayon !== p.rayon; });
      autres.innerHTML = memes.concat(reste).slice(0, 4).map(carte).join(''); majFavoris();
    }
    faq($('[data-faq]'));
  }

  /* ---------- la collection ---------- */
  function collection() {
    var zone = $('[data-collection]'); if (!zone) return;
    var c = new URLSearchParams(location.search).get('c') || 'tout';
    var r = window.RAYONS.filter(function (x) { return x.id === c; })[0];
    var titre = c === 'favoris' ? 'Mes favoris' : (r ? r.nom : 'Toute la boutique');
    var liste = c === 'favoris' ? P.filter(function (p) { return favoris().indexOf(p.id) > -1; })
              : (r ? P.filter(function (p) { return p.rayon === c; }) : P);
    document.title = titre + ' — Ambre Noire Paris';
    $('[data-col-titre]').textContent = titre;
    $('[data-col-compte]').textContent = liste.length + ' pièce' + (liste.length > 1 ? 's' : '');
    var onglets = $('[data-col-onglets]');
    onglets.innerHTML = [{ id: 'tout', nom: 'Tout' }].concat(window.RAYONS).map(function (x) {
      return '<a class="onglet' + (x.id === c ? ' actif' : '') + '" href="collection.html?c=' + x.id + '">' + x.nom + '</a>';
    }).join('');
    zone.innerHTML = liste.length ? liste.map(carte).join('')
      : '<p class="vide" style="grid-column:1/-1">' + (c === 'favoris' ? 'Aucun favori pour l\'instant. Touche le cœur sur une pièce pour la garder ici.' : 'Rien ici pour l\'instant.') + '</p>';
    majFavoris();
  }

  /* ---------- les icônes posées dans le HTML ---------- */
  /* ---------- le bouton WhatsApp, toujours à portée de pouce ---------- */
  function boutonWhatsApp() {
    if (document.body.getAttribute('data-page') === 'legal') return;
    var a = document.createElement('a');
    a.className = 'wa-flottant';
    a.href = waTexte('Bonjour Ambre Noire, j\'ai une question : ');
    a.target = '_blank'; a.rel = 'noopener';
    a.setAttribute('aria-label', 'Nous écrire sur WhatsApp au ' + C.whatsappAffiche);
    a.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3Z"/></svg><span>WhatsApp</span>';
    document.body.appendChild(a);
  }

  function icones() { $$('[data-ico]').forEach(function (el) { var n = el.getAttribute('data-ico'); if (ICO[n]) el.innerHTML = ICO[n]; }); }

  /* ---------- démarrage ---------- */
  entete(); enteteVivante(); pied(); icones(); navigation(); brancherFormulaires(); boutonWhatsApp();
  accueil(); fiche(); collection(); majFavoris();
  // popup(); — retiré à la demande (plus d'offre −10 %)
  try { localStorage.removeItem('silence.code'); } catch (e) {}   // efface un ancien code −10 % gardé dans le navigateur
})();
