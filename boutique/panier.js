/* SILENCE — le panier, le code du popup, la mémoire de la vidéo, le comptage.
   Aucune bibliothèque, aucun service extérieur. */
(function () {
  'use strict';
  var C = window.CONFIG || {};
  var CLE_PANIER = 'silence.panier', CLE_SOURCE = 'silence.source';

  function lire(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
  function ecrire(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function euro(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  function echap(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function prixDe(t) { var m = String(t).match(/(\d+)[,.](\d{2})/); return m ? parseFloat(m[1] + '.' + m[2]) : 0; }

  /* ---------- 1. d'où vient le visiteur : ?v=video12 ---------- */
  function source() {
    var q = new URLSearchParams(location.search), v = q.get('v');
    var vieux = lire(CLE_SOURCE, null);
    if (v) { var n = { v: v, le: Date.now() }; ecrire(CLE_SOURCE, n); return n; }
    return vieux || { v: '', le: Date.now() };
  }

  /* ---------- 2. le comptage (la partie serveur reste à brancher) ---------- */
  function compter(quoi, extra) {
    var s = source(), corps = { quoi: quoi, v: s.v, page: location.pathname };
    for (var k in (extra || {})) corps[k] = extra[k];
    try {
      var d = JSON.stringify(corps);
      if (navigator.sendBeacon) navigator.sendBeacon('/api/clic', new Blob([d], { type: 'application/json' }));
    } catch (e) {}
  }

  /* ---------- 3. le panier ---------- */
  function panier() { return lire(CLE_PANIER, []); }
  function code() { return lire('silence.code', null); }
  function combien() { return panier().reduce(function (t, a) { return t + a.n; }, 0); }
  function sousTotal() { return panier().reduce(function (t, a) { return t + a.prix * a.n; }, 0); }
  /* le lot « tenue + veste » : 49,90 € au lieu de 54,80 €, appliqué tout seul dès que les deux sont dans le panier */
  var ENS = 'Sweat à capuche + jogging', VES = 'Veste zippée délavée', GAIN_LOT = 4.90;
  function nombreDe(nom) { return panier().reduce(function (t, a) { return t + (a.nom === nom ? a.n : 0); }, 0); }
  function lots() { return Math.min(nombreDe(ENS), nombreDe(VES)); }
  function remiseLot() { return Math.round(lots() * GAIN_LOT * 100) / 100; }
  function remise() { var c = code(); return c ? Math.round((sousTotal() - remiseLot()) * c.pct) / 100 : 0; }
  function total() { return sousTotal() - remiseLot() - remise() + (C.livraison || 0); }

  function ajouter(a) {
    var p = panier();
    var deja = p.filter(function (x) { return x.nom === a.nom && x.taille === a.taille; })[0];
    if (deja) deja.n += a.n; else p.push({ nom: a.nom, prix: a.prix, taille: a.taille || '', n: a.n });
    ecrire(CLE_PANIER, p);
    rafraichir();
    compter('ajout_panier', { article: a.nom, taille: a.taille || '' });
    ouvrir();
  }
  function changer(i, delta) {
    var p = panier(); if (!p[i]) return;
    p[i].n += delta; if (p[i].n < 1) p.splice(i, 1);
    ecrire(CLE_PANIER, p); rafraichir(); dessiner();
  }

  /* ---------- 4. la pastille ---------- */
  function rafraichir() {
    var n = combien(), t = n ? String(n) : '', vu = n ? 'flex' : 'none';
    var els = document.querySelectorAll('[data-compteur]');
    for (var i = 0; i < els.length; i++) {
      if (els[i].textContent !== t) els[i].textContent = t;
      if (els[i].style.display !== vu) els[i].style.display = vu;
    }
  }

  /* ---------- 5. le panneau ---------- */
  function panneau() {
    var p = document.getElementById('silence-panier');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'silence-panier'; p.hidden = true;
    p.innerHTML =
      '<div data-fond style="position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:998"></div>' +
      '<aside role="dialog" aria-label="Ton panier" style="position:fixed;top:0;right:0;bottom:0;width:min(420px,100%);' +
        'background:#fff;color:#0A0A0A;z-index:999;display:flex;flex-direction:column;font-family:Inter,system-ui,sans-serif;box-shadow:-10px 0 40px rgba(0,0,0,.15)">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:20px 22px;border-bottom:1px solid #E2E2DE">' +
          '<span style="font-family:\'Archivo Black\',sans-serif;font-size:20px;text-transform:uppercase">Ton panier</span>' +
          '<button type="button" data-fermer aria-label="Fermer" style="background:none;border:0;font-size:28px;line-height:1;padding:6px;min-width:44px;min-height:44px">&times;</button>' +
        '</div>' +
        '<div data-lignes style="flex:1;overflow-y:auto;padding:8px 22px"></div>' +
        '<div style="padding:18px 22px 22px;border-top:1px solid #E2E2DE;background:#FAFAF8">' +
          '<div data-totaux></div>' +
          '<button type="button" data-commander style="width:100%;min-height:54px;margin-top:14px;background:#E0A458;border:0;border-radius:4px;' +
            'font-weight:800;font-size:15px;letter-spacing:.04em;text-transform:uppercase;color:#0A0A0A">Commander et payer</button>' +
          '<p style="font-size:12.5px;color:#66665F;text-align:center;margin:12px 0 0;line-height:1.6">Tu reçois ton lien de paiement sur WhatsApp.<br>Paiement par carte, jamais à la livraison.</p>' +
        '</div>' +
      '</aside>';
    document.body.appendChild(p);
    p.querySelector('[data-fond]').onclick = fermer;
    p.querySelector('[data-fermer]').onclick = fermer;
    p.querySelector('[data-commander]').onclick = commander;
    p.addEventListener('click', function (e) {
      var k = e.target.closest('[data-complete]');
      if (k) {
        var nom = k.getAttribute('data-complete');
        ajouter({ nom: nom, prix: nom === VES ? 19.90 : 34.90, taille: k.getAttribute('data-taille-ref') || 'à préciser', n: 1 });
        compter('complete_tenue', { article: nom });
        return;
      }
      var b = e.target.closest('[data-plus],[data-moins]'); if (!b) return;
      changer(+b.getAttribute('data-i'), b.hasAttribute('data-plus') ? 1 : -1);
    });
    return p;
  }

  function ligneTotal(lib, val, fort) {
    return '<div style="display:flex;justify-content:space-between;padding:3px 0;' + (fort ? 'font-weight:800;font-size:18px;padding-top:8px' : 'font-size:14.5px') + '"><span>' + lib + '</span><span>' + val + '</span></div>';
  }

  function suggestion(art) {
    var e = nombreDe(ENS), v = nombreDe(VES), manque = e > v ? VES : (v > e ? ENS : null);
    if (!manque) return '';
    var ref = art.filter(function (a) { return a.nom === (manque === VES ? ENS : VES); })[0];
    var prix = manque === VES ? 19.90 : 34.90;
    return '<div style="margin:18px 0 6px;padding:14px 16px;border:1.5px solid #E0A458;border-radius:4px;background:#FDF6EC">' +
      '<div style="font-weight:800;font-size:14.5px">Complète la tenue : −4,90 €</div>' +
      '<div style="font-size:13px;color:#66665F;margin:3px 0 12px;line-height:1.5">Ajoute ' + (manque === VES ? 'la veste' : 'le sweat + jogging') + ' (' + euro(prix) + ') : le prix du lot s\'applique tout seul.</div>' +
      '<button type="button" data-complete="' + echap(manque) + '" data-taille-ref="' + echap(ref && ref.taille || '') + '" style="min-height:42px;padding:0 16px;background:#0A0A0A;color:#fff;border:0;border-radius:4px;font-weight:800;font-size:13px;letter-spacing:.04em;text-transform:uppercase">Ajouter ' + (manque === VES ? 'la veste' : 'l\'ensemble') + '</button></div>';
  }

  function dessiner() {
    var p = panneau(), l = p.querySelector('[data-lignes]'), art = panier(), c = code();
    if (!art.length) {
      l.innerHTML = '<p style="color:#66665F;line-height:1.7;margin:34px 0;text-align:center">Ton panier est vide.<br>Choisis une pièce, elle t\'attendra ici.</p>';
    } else {
      l.innerHTML = art.map(function (a, i) {
        return '<div style="display:flex;justify-content:space-between;gap:14px;padding:16px 0;border-bottom:1px solid #EEE">' +
          '<div style="min-width:0"><div style="font-weight:700">' + echap(a.nom) + '</div>' +
          '<div style="font-size:13px;color:#66665F;margin-top:3px">' + (a.taille ? 'Taille ' + echap(a.taille) : '') + '</div>' +
          '<div style="display:inline-flex;align-items:center;border:1px solid #E2E2DE;border-radius:4px;margin-top:10px">' +
            '<button type="button" data-moins data-i="' + i + '" aria-label="Moins" style="background:none;border:0;width:36px;height:34px;font-size:17px">−</button>' +
            '<span style="min-width:22px;text-align:center;font-weight:700">' + a.n + '</span>' +
            '<button type="button" data-plus data-i="' + i + '" aria-label="Plus" style="background:none;border:0;width:36px;height:34px;font-size:17px">+</button>' +
          '</div></div>' +
          '<div style="font-weight:700;white-space:nowrap">' + euro(a.prix * a.n) + '</div></div>';
      }).join('') + suggestion(art);
    }
    var t = ligneTotal('Sous-total', euro(sousTotal()));
    if (remiseLot()) t += ligneTotal('Lot tenue + veste' + (lots() > 1 ? ' ×' + lots() : ''), '<span style="color:#1B7F3B;font-weight:700">−' + euro(remiseLot()) + '</span>');
    if (c && art.length) t += ligneTotal('Code ' + echap(c.code) + ' (−' + c.pct + ' %)', '<span style="color:#1B7F3B;font-weight:700">−' + euro(remise()) + '</span>');
    t += ligneTotal('Livraison', C.livraison == null ? 'confirmée sur WhatsApp' : euro(C.livraison));
    t += ligneTotal('Total', euro(total()), true);
    p.querySelector('[data-totaux]').innerHTML = t;
  }

  function ouvrir() { dessiner(); panneau().hidden = false; document.body.style.overflow = 'hidden'; compter('ouvre_panier'); }
  function fermer() { panneau().hidden = true; document.body.style.overflow = ''; }

  /* ---------- 6. commander ---------- */
  function commander() {
    var art = panier(); if (!art.length) return;
    var s = source(), c = code();
    var lignes = art.map(function (a) { return '• ' + a.nom + (a.taille ? ' — taille ' + a.taille : '') + ' ×' + a.n + ' — ' + euro(a.prix * a.n); });
    var txt = 'Bonjour, je veux commander sur SILENCE :\n\n' + lignes.join('\n') +
      '\n\nSous-total : ' + euro(sousTotal()) +
      (remiseLot() ? '\nLot tenue + veste : −' + euro(remiseLot()) : '') +
      (c ? '\nCode ' + c.code + ' : −' + euro(remise()) : '') +
      (C.livraison == null ? '\nLivraison : à confirmer' : '\nLivraison : ' + euro(C.livraison)) +
      '\nTotal : ' + euro(total()) +
      (s.v ? '\n\nref ' + s.v : '');
    compter('commande', { total: Math.round(total() * 100) / 100, articles: art.length });
    window.open('https://wa.me/' + (C.whatsapp || '') + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
  }

  /* ---------- 7. le branchement : on écoute le document entier ---------- */
  function brancher() {
    source(); compter('visite');
    document.addEventListener('click', function (e) {
      var b = e.target.closest && e.target.closest('[data-ouvrir-panier]');
      if (b) { e.preventDefault(); ouvrir(); return; }
      b = e.target.closest && e.target.closest('[data-ajouter]');
      if (b) {
        e.preventDefault();
        var tailles = document.querySelectorAll('[data-taille]');
        var choisie = document.querySelector('[data-taille][data-choisie="oui"]');
        if (tailles.length && !choisie) {
          var zone = document.querySelector('.tailles'); if (zone) { zone.classList.add('secoue'); setTimeout(function () { zone.classList.remove('secoue'); }, 450); }
          return;
        }
        var q = document.querySelector('[data-qte]');
        // un lot ajouté depuis l'accueil n'a pas de taille : on la demandera sur WhatsApp
        var dansFiche = !!b.closest('.fiche-info, .barre-achat');
        ajouter({
          nom: b.getAttribute('data-ajouter'),
          prix: prixDe(b.getAttribute('data-prix')),
          taille: dansFiche && choisie ? choisie.getAttribute('data-taille') : (dansFiche ? '' : 'à préciser'),
          n: dansFiche && q ? Math.max(1, Math.min(9, +q.value || 1)) : 1
        });
        return;
      }
      b = e.target.closest && e.target.closest('[data-produit]');
      if (b) compter('clic_produit', { article: b.getAttribute('data-produit') });
    }, true);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });
    rafraichir();
    setTimeout(rafraichir, 600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher);
  else brancher();

  window.SILENCE = { ajouter: ajouter, ouvrir: ouvrir, panier: panier, source: source, rafraichir: function () { rafraichir(); if (!panneau().hidden) dessiner(); } };
})();
