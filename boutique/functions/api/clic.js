/* SILENCE — le compteur.
   Reçoit les petits signaux du site (visite, clic produit, panier, commande)
   et les additionne PAR JOUR et PAR VIDÉO.

   Ce qu'on garde : le type de signal, le nom de la vidéo (?v=video12),
   l'article, le montant d'une commande. Rien d'autre : ni adresse IP,
   ni appareil, ni identifiant de personne. (Voir la page confidentialité.) */
import { preparer } from '../../lib/bd.js';

const SIGNAUX = new Set(['visite', 'clic_produit', 'ajout_panier', 'ouvre_panier', 'complete_tenue', 'commande']);
const propre = (s, max) => String(s || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, max);
const texte = (s, max) => String(s || '').replace(/[<>\u0000-\u001f]/g, '').slice(0, max);

export async function onRequestPost({ request, env }) {
  if (!env.DB) return new Response(null, { status: 503 });
  const brut = await request.text();
  if (brut.length > 2000) return new Response(null, { status: 413 });

  let e;
  try { e = JSON.parse(brut); } catch { return new Response(null, { status: 400 }); }
  const quoi = String(e.quoi || '');
  if (!SIGNAUX.has(quoi)) return new Response(null, { status: 400 });

  const video = propre(e.v, 40) || 'direct';             // sans ?v= : venu sans lien de vidéo
  const jour = new Date().toISOString().slice(0, 10);
  const db = env.DB;
  await preparer(db);

  const ordres = [db.prepare('INSERT INTO signaux (jour, signal, video, n) VALUES (?1, ?2, ?3, 1) ON CONFLICT (jour, signal, video) DO UPDATE SET n = n + 1').bind(jour, quoi, video)];
  if (quoi === 'commande') {
    // une commande = une ligne à part, jamais additionnée à l'aveugle
    const total = Math.max(0, Math.min(5000, Number(e.total) || 0));
    ordres.push(db.prepare('INSERT INTO commandes (jour, video, total, articles) VALUES (?1, ?2, ?3, ?4)')
      .bind(jour, video, Math.round(total * 100) / 100, Math.min(50, Number(e.articles) || 0)));
  }
  if (quoi === 'clic_produit' || quoi === 'ajout_panier') {
    const article = texte(e.article, 60);
    if (article) ordres.push(db.prepare('INSERT INTO articles (jour, cle, n) VALUES (?1, ?2, 1) ON CONFLICT (jour, cle) DO UPDATE SET n = n + 1').bind(jour, quoi + ' · ' + article));
  }
  await db.batch(ordres);
  return new Response(null, { status: 204 });
}
