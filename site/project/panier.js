/* SILENCE — le panier, la mémoire de la vidéo, et le comptage des clics.
   Un seul fichier, aucune bibliothèque, aucun service extérieur. */
(function () {
  'use strict';

  var WHATSAPP = '212728861105';
  var CLE_PANIER = 'silence.panier';
  var CLE_SOURCE = 'silence.source';

  /* ---------- 1. D'où vient le visiteur ---------- */
  // ?v=video12&p=sweat  →  retenu dès la 1re visite, gardé s'il revient
  function source() {
    var q = new URLSearchParams(location.search);
    var v = q.get('v'), p = q.get('p');
    var vieux = lire(CLE_SOURCE, null);
    if (v || p) {
      var neuf = { v: v || (vieux && vieux.v) || '', p: p || '', le: Date.now() };
      ecrire(CLE_SOURCE, neuf);
      return neuf;
    }
    return vieux || { v: '', p: '', le: Date.now() };
  }

  /* ---------- 2. Le comptage ---------- */
  function compter(quoi, extra) {
    var s = source();
    var corps = { quoi: quoi, v: s.v, p: s.p, page: location.pathname };
    for (var k in (extra || {})) corps[k] = extra[k];
    try {
      var d = JSON.stringify(corps);
      if (navigator.sendBeacon) navigator.sendBeacon('/api/clic', new Blob([d], { type: 'application/json' }));
      else fetch('/api/clic', { method: 'POST', body: d, headers: { 'Content-Type': 'application/json' }, keepalive: true }).catch(function () {});
    } catch (e) {}
  }

  /* ---------- 3. Le panier ---------- */
  function lire(cle, defaut) { try { return JSON.parse(localStorage.getItem(cle)) || defaut; } catch (e) { return defaut; } }
  function ecrire(cle, val) { try { localStorage.setItem(cle, JSON.stringify(val)); } catch (e) {} }

  function panier() { return lire(CLE_PANIER, []); }

  function ajouter(article) {
    var p = panier();
    var deja = p.filter(function (a) { return a.nom === article.nom && a.taille === article.taille; })[0];
    if (deja) deja.n += 1; else p.push({ nom: article.nom, prix: article.prix, taille: article.taille || '', n: 1 });
    ecrire(CLE_PANIER, p);
    rafraichir();
    compter('ajout_panier', { article: article.nom, taille: article.taille || '' });
    secouer();
  }

  function retirer(i) { var p = panier(); p.splice(i, 1); ecrire(CLE_PANIER, p); rafraichir(); dessinerPanneau(); }

  function combien() { return panier().reduce(function (t, a) { return t + a.n; }, 0); }
  function total()   { return panier().reduce(function (t, a) { return t + a.prix * a.n; }, 0); }

  /* ---------- 4. Le compteur dans la barre ---------- */
  function rafraichir() {
    var n = combien();
    var texte = n ? String(n) : '';
    var vu = n ? 'flex' : 'none';
    document.querySelectorAll('[data-compteur]').forEach(function (e) {
      // on n'écrit QUE si ça change — sinon la surveillance se rappelle
      // elle-même en boucle et la page ne se stabilise jamais
      if (e.textContent !== texte) e.textContent = texte;
      if (e.style.display !== vu) e.style.display = vu;
    });
  }

  function secouer() {
    var b = document.querySelector('[data-ouvrir-panier]');
    if (!b) return;
    b.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], { duration: 320 });
  }

  /* ---------- 5. Le panneau ---------- */
  function panneau() {
    var p = document.getElementById('silence-panier');
    if (p) return p;
    p = document.createElement('div');
    p.id = 'silence-panier';
    p.setAttribute('hidden', '');
    p.innerHTML =
      '<div data-fond style="position:fixed;inset:0;background:rgba(5,5,8,.72);backdrop-filter:blur(3px);z-index:998"></div>' +
      '<aside role="dialog" aria-label="Ton panier" style="position:fixed;top:0;right:0;bottom:0;width:min(400px,100%);' +
        'background:#0B0B0C;border-left:1px solid #26323C;z-index:999;display:flex;flex-direction:column;' +
        'font-family:Archivo,system-ui,sans-serif;color:#F4F2ED">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;padding:22px 20px;border-bottom:1px dashed #26323C">' +
          '<span style="font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:#A5D8F3">Ton panier</span>' +
          '<button type="button" data-fermer style="background:none;border:none;color:#B8BEC8;font-size:24px;line-height:1;cursor:pointer;padding:8px;min-height:44px;min-width:44px">&times;</button>' +
        '</div>' +
        '<div data-lignes style="flex:1;overflow-y:auto;padding:16px 20px"></div>' +
        '<div style="padding:20px;border-top:1px dashed #26323C">' +
          '<div style="display:flex;justify-content:space-between;font-size:17px;font-weight:700;margin-bottom:4px"><span>Total</span><span data-total>0,00 €</span></div>' +
          '<div style="font-size:11px;color:#7E7E8A;margin-bottom:16px">+ 4,99 € de livraison · France · 2 à 3 jours</div>' +
          '<button type="button" data-commander style="width:100%;background:#E0A458;color:#0B0B0C;border:none;padding:17px;' +
            'font-size:14px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;font-family:inherit;cursor:pointer;min-height:44px">Commander et payer</button>' +
          '<div style="font-size:11px;color:#7E7E8A;text-align:center;margin-top:12px;line-height:1.7">On t\'envoie le lien de paiement sur WhatsApp.<br>Paiement par carte, jamais à la livraison.</div>' +
        '</div>' +
      '</aside>';
    document.body.appendChild(p);
    p.querySelector('[data-fond]').onclick = fermer;
    p.querySelector('[data-fermer]').onclick = fermer;
    p.querySelector('[data-commander]').onclick = commander;
    return p;
  }

  function dessinerPanneau() {
    var p = panneau(), l = p.querySelector('[data-lignes]'), art = panier();
    if (!art.length) {
      l.innerHTML = '<p style="color:#7E7E8A;font-size:14px;line-height:1.8;margin:30px 0">Ton panier est vide.<br>Choisis une pièce, elle t\'attendra ici.</p>';
    } else {
      l.innerHTML = art.map(function (a, i) {
        return '<div style="display:flex;justify-content:space-between;gap:14px;padding:14px 0;border-bottom:1px solid #1A1A20">' +
          '<div style="min-width:0"><div style="font-size:14.5px;font-weight:600">' + echap(a.nom) + '</div>' +
          '<div style="font-size:12px;color:#7E7E8A;margin-top:3px">' + (a.taille ? 'Taille ' + echap(a.taille) + ' · ' : '') + 'x' + a.n + '</div></div>' +
          '<div style="text-align:right;flex-shrink:0"><div style="font-size:14.5px;font-weight:700">' + euro(a.prix * a.n) + '</div>' +
          '<button type="button" data-retirer="' + i + '" style="background:none;border:none;color:#7E7E8A;font-size:11px;' +
          'text-decoration:underline;cursor:pointer;padding:6px 0;font-family:inherit">retirer</button></div></div>';
      }).join('');
      l.querySelectorAll('[data-retirer]').forEach(function (b) {
        b.onclick = function () { retirer(parseInt(b.getAttribute('data-retirer'), 10)); };
      });
    }
    p.querySelector('[data-total]').textContent = euro(total());
  }

  function ouvrir() { dessinerPanneau(); panneau().hidden = false; document.body.style.overflow = 'hidden'; compter('ouvre_panier'); }
  function fermer() { panneau().hidden = true; document.body.style.overflow = ''; }

  /* ---------- 6. Commander ---------- */
  function commander() {
    var art = panier();
    if (!art.length) return;
    var s = source();
    var lignes = art.map(function (a) { return '• ' + a.nom + (a.taille ? ' — taille ' + a.taille : '') + ' x' + a.n + ' — ' + euro(a.prix * a.n); });
    var texte = 'Bonjour, je veux commander sur SILENCE :\n\n' + lignes.join('\n') +
                '\n\nTotal : ' + euro(total()) + ' + 4,99 € de livraison' +
                '\nTotal à payer : ' + euro(total() + 4.99) +
                (s.v ? '\n\nref ' + s.v : '');
    compter('commande', { total: total(), articles: art.length });
    window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texte), '_blank', 'noopener');
  }

  /* ---------- 7. Outils ---------- */
  function euro(n) { return n.toFixed(2).replace('.', ',') + ' €'; }
  function echap(s) { var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function prixDe(t) { var m = String(t).match(/(\d+)[,.](\d{2})/); return m ? parseFloat(m[1] + '.' + m[2]) : 0; }

  /* ---------- 8. Branchement ----------
     Le moteur du site dessine la page APRÈS ce script, et la redessine
     à chaque clic. On n'attache donc rien aux boutons : on écoute le
     document entier, une fois pour toutes. */
  function brancher() {
    source();
    compter('visite');

    document.addEventListener('click', function (e) {
      var b;

      b = e.target.closest && e.target.closest('[data-ouvrir-panier]');
      if (b) { e.preventDefault(); ouvrir(); return; }

      b = e.target.closest && e.target.closest('[data-ajouter]');
      if (b) {
        e.preventDefault();
        var choisie = document.querySelector('[data-taille][data-choisie="oui"]');
        ajouter({
          nom: b.getAttribute('data-ajouter'),
          prix: prixDe(b.getAttribute('data-prix')),
          taille: choisie ? choisie.textContent.trim() : ''
        });
        return;
      }

      b = e.target.closest && e.target.closest('[data-produit]');
      if (b) { compter('clic_produit', { article: b.getAttribute('data-produit') }); return; }
    }, true);

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fermer(); });

    // la pastille se remet à jour chaque fois que la page est redessinée
    rafraichir();
    try {
      new MutationObserver(function () { rafraichir(); })
        .observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
    setTimeout(rafraichir, 800);
    setTimeout(rafraichir, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', brancher);
  else brancher();

  window.SILENCE = { ajouter: ajouter, ouvrir: ouvrir, panier: panier, source: source };
})();
