/* SILENCE — le compteur.
   Reçoit les petits signaux du site (visite, clic produit, panier, commande)
   et les additionne PAR JOUR et PAR VIDÉO.

   Ce qu'on garde : le type de signal, le nom de la vidéo (?v=video12),
   l'article, le montant d'une commande. Rien d'autre : ni adresse IP,
   ni appareil, ni identifiant de personne. (Voir la page confidentialité.) */
import { getStore } from '@netlify/blobs';

const SIGNAUX = new Set(['visite', 'clic_produit', 'ajout_panier', 'ouvre_panier', 'complete_tenue', 'commande']);
const propre = (s, max) => String(s || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, max);
const texte = (s, max) => String(s || '').replace(/[<>\u0000-\u001f]/g, '').slice(0, max);

export default async (req) => {
  if (req.method !== 'POST') return new Response('', { status: 405 });
  const brut = await req.text();
  if (brut.length > 2000) return new Response('', { status: 413 });

  let e;
  try { e = JSON.parse(brut); } catch { return new Response('', { status: 400 }); }
  const quoi = String(e.quoi || '');
  if (!SIGNAUX.has(quoi)) return new Response('', { status: 400 });

  const video = propre(e.v, 40) || 'direct';             // sans ?v= : venu sans lien de vidéo
  const jour = new Date().toISOString().slice(0, 10);
  const store = getStore({ name: 'compteur', consistency: 'strong' });

  if (quoi === 'commande') {
    // une commande = une ligne à part, jamais additionnée à l'aveugle
    const total = Math.max(0, Math.min(5000, Number(e.total) || 0));
    const cle = `commandes/${jour}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(cle, { jour, video, total: Math.round(total * 100) / 100, articles: Math.min(50, Number(e.articles) || 0) });
  }

  // le compteur du jour : { signal: { video: nombre } }
  const cleJour = `jours/${jour}`;
  const compte = (await store.get(cleJour, { type: 'json' })) || {};
  compte[quoi] = compte[quoi] || {};
  compte[quoi][video] = (compte[quoi][video] || 0) + 1;
  if (quoi === 'clic_produit' || quoi === 'ajout_panier') {
    const article = texte(e.article, 60);
    if (article) {
      compte.articles = compte.articles || {};
      const k = quoi + ' · ' + article;
      compte.articles[k] = (compte.articles[k] || 0) + 1;
    }
  }
  await store.setJSON(cleJour, compte);

  return new Response(null, { status: 204 });
};

export const config = { path: '/api/clic' };
