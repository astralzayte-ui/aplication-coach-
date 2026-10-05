/* Retire du compteur tout ce qui vient d'un test (vidéo « test-… »).   node boutique/outils/nettoie-tests.mjs */
import { getStore } from '@netlify/blobs';
const store = getStore({ name: 'compteur', siteID: '2d2ee5e1-01be-4cf0-880f-8beff10e76d5', token: 'remplace-par-le-proxy' });
let n = 0;
for (const b of (await store.list({ prefix: 'commandes/' })).blobs) {
  const c = await store.get(b.key, { type: 'json' });
  if (c && String(c.video).startsWith('test-')) { await store.delete(b.key); n++; }
}
for (const b of (await store.list({ prefix: 'jours/' })).blobs) {
  const c = await store.get(b.key, { type: 'json' }) || {};
  let change = false;
  for (const sig of Object.keys(c)) if (sig !== 'articles') for (const v of Object.keys(c[sig])) if (v.startsWith('test-')) { delete c[sig][v]; change = true; }
  if (change) { delete c.articles; await store.setJSON(b.key, c); n++; }
}
console.log(n, 'élément(s) de test retiré(s)');
