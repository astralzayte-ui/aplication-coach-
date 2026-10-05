/* SILENCE — le relevé.
   Rend les chiffres par vidéo : visites, clics, paniers, commandes, montant.
   Protégé par une clé rangée dans les réglages Netlify (RELEVE_CLE),
   jamais écrite dans le code.

   GET /api/releve?depuis=2026-10-01      en-tête  x-cle: <RELEVE_CLE> */
import { getStore } from '@netlify/blobs';

export default async (req) => {
  const cle = process.env.RELEVE_CLE;
  if (!cle || req.headers.get('x-cle') !== cle) return new Response('', { status: 404 });

  const url = new URL(req.url);
  const depuis = url.searchParams.get('depuis') || '2000-01-01';
  const store = getStore({ name: 'compteur', consistency: 'strong' });

  const parVideo = {};
  const ligne = (v) => (parVideo[v] = parVideo[v] || { visites: 0, clics_produit: 0, ajouts_panier: 0, paniers_ouverts: 0, complete_tenue: 0, commandes: 0, montant: 0 });
  const NOMS = { visite: 'visites', clic_produit: 'clics_produit', ajout_panier: 'ajouts_panier', ouvre_panier: 'paniers_ouverts', complete_tenue: 'complete_tenue' };
  const parJour = {}, articles = {};

  const { blobs: jours } = await store.list({ prefix: 'jours/' });
  for (const b of jours) {
    const jour = b.key.slice(6);
    if (jour < depuis) continue;
    const c = (await store.get(b.key, { type: 'json' })) || {};
    parJour[jour] = { visites: 0, commandes: 0 };
    for (const [signal, videos] of Object.entries(c)) {
      if (signal === 'articles') { for (const [k, n] of Object.entries(videos)) articles[k] = (articles[k] || 0) + n; continue; }
      if (!NOMS[signal]) continue;
      for (const [v, n] of Object.entries(videos)) {
        ligne(v)[NOMS[signal]] += n;
        if (signal === 'visite') parJour[jour].visites += n;
      }
    }
  }

  const { blobs: cmds } = await store.list({ prefix: 'commandes/' });
  const commandes = [];
  for (const b of cmds) {
    const jour = b.key.split('/')[1];
    if (jour < depuis) continue;
    const c = await store.get(b.key, { type: 'json' });
    if (!c) continue;
    commandes.push(c);
    ligne(c.video).commandes += 1;
    ligne(c.video).montant = Math.round((ligne(c.video).montant + c.total) * 100) / 100;
    (parJour[jour] = parJour[jour] || { visites: 0, commandes: 0 }).commandes += 1;
  }

  return Response.json({ depuis, parVideo, parJour, articles, commandes }, { headers: { 'cache-control': 'no-store' } });
};

export const config = { path: '/api/releve' };
