/* Le relevé, lu par Claude.   node boutique/outils/releve.mjs [depuis AAAA-MM-JJ] [--json]
   La clé est lue dans les réglages Netlify au moment de l'appel : jamais écrite,
   jamais affichée. L'accès à Netlify passe par les Identifiants API de l'environnement. */
const SITE = '2d2ee5e1-01be-4cf0-880f-8beff10e76d5', URL_SITE = 'https://silence-boutique.netlify.app';
const api = (p) => fetch('https://api.netlify.com/api/v1' + p, { headers: { Authorization: 'Bearer x' } }).then((r) => r.json());

const site = await api('/sites/' + SITE);
const env = await api(`/accounts/${site.account_slug}/env/RELEVE_CLE?site_id=${SITE}`);
const cle = env?.values?.[0]?.value;
if (!cle) { console.error('Clé du relevé introuvable dans Netlify.'); process.exit(1); }

const depuis = process.argv.find((a) => /^\d{4}-\d{2}-\d{2}$/.test(a)) || '2000-01-01';
const r = await fetch(`${URL_SITE}/api/releve?depuis=${depuis}`, { headers: { 'x-cle': cle } });
if (!r.ok) { console.error('Relevé refusé :', r.status); process.exit(1); }
const d = await r.json();
if (process.argv.includes('--json')) { console.log(JSON.stringify(d, null, 2)); process.exit(0); }

const lignes = Object.entries(d.parVideo).filter(([v]) => !v.startsWith('test-'));
const tot = lignes.reduce((t, [, x]) => ({ v: t.v + x.visites, c: t.c + x.commandes, m: t.m + x.montant }), { v: 0, c: 0, m: 0 });
console.log(`depuis ${depuis} : ${tot.v} visites · ${tot.c} commandes · ${tot.m.toFixed(2).replace('.', ',')} €`);
console.log('vidéo'.padEnd(16), 'visites', 'clics', 'paniers', 'commandes', 'montant');
console.log('  (commandes = clics sur « Commander et payer » — le paiement se vérifie dans Stripe)');
for (const [v, x] of lignes.sort((a, b) => b[1].commandes - a[1].commandes || b[1].visites - a[1].visites))
  console.log(v.padEnd(16), String(x.visites).padStart(7), String(x.clics_produit).padStart(5), String(x.ajouts_panier).padStart(7), String(x.commandes).padStart(9), (x.montant.toFixed(2).replace('.', ',') + ' €').padStart(9));
