/* SILENCE — le relevé.
   Rend les chiffres par vidéo : visites, clics, paniers, commandes, montant.
   Protégé par une clé rangée dans les réglages Cloudflare (RELEVE_CLE),
   jamais écrite dans le code.

   GET /api/releve?depuis=2026-10-01      en-tête  x-cle: <RELEVE_CLE> */
import { preparer } from '../../lib/bd.js';

const NOMS = { visite: 'visites', clic_produit: 'clics_produit', ajout_panier: 'ajouts_panier', ouvre_panier: 'paniers_ouverts', complete_tenue: 'complete_tenue' };

export async function onRequestGet({ request, env }) {
  const cle = env.RELEVE_CLE;
  if (!cle || request.headers.get('x-cle') !== cle || !env.DB) return new Response(null, { status: 404 });

  const depuis = new URL(request.url).searchParams.get('depuis') || '2000-01-01';
  const db = env.DB;
  await preparer(db);

  const parVideo = {}, parJour = {}, articles = {};
  const ligne = (v) => (parVideo[v] = parVideo[v] || { visites: 0, clics_produit: 0, ajouts_panier: 0, paniers_ouverts: 0, complete_tenue: 0, commandes: 0, montant: 0 });
  const jourDe = (j) => (parJour[j] = parJour[j] || { visites: 0, commandes: 0 });

  const [s, a, c] = await db.batch([
    db.prepare('SELECT jour, signal, video, n FROM signaux WHERE jour >= ?1').bind(depuis),
    db.prepare('SELECT cle, SUM(n) AS n FROM articles WHERE jour >= ?1 GROUP BY cle').bind(depuis),
    db.prepare('SELECT jour, video, total, articles FROM commandes WHERE jour >= ?1 ORDER BY id').bind(depuis)
  ]);

  for (const { jour, signal, video, n } of s.results) {
    jourDe(jour);
    if (!NOMS[signal]) continue;
    ligne(video)[NOMS[signal]] += n;
    if (signal === 'visite') parJour[jour].visites += n;
  }
  for (const { cle: k, n } of a.results) articles[k] = n;
  const commandes = c.results;
  for (const x of commandes) {
    ligne(x.video).commandes += 1;
    ligne(x.video).montant = Math.round((ligne(x.video).montant + x.total) * 100) / 100;
    jourDe(x.jour).commandes += 1;
  }

  return Response.json({ depuis, parVideo, parJour, articles, commandes }, { headers: { 'cache-control': 'no-store' } });
}
