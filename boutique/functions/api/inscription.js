/* SILENCE — l'inscription aux e-mails.
   Appelée par le popup et le pied de page, SEULEMENT si la case d'accord est cochée.
   1. garde une copie de l'inscription (table « inscrits »), avec la date de l'accord
   2. ajoute la personne dans Brevo (liste « SILENCE — inscrits »)
   3. lui envoie l'e-mail de bienvenue avec le code −10 % — une seule fois

   La clé Brevo est rangée dans les réglages Cloudflare (BREVO_API_KEY), jamais dans le code. */
import { preparer } from '../../lib/bd.js';

const BREVO = 'https://api.brevo.com/v3';
const LISTE_INSCRITS = 4;      // SILENCE — inscrits (popup + pied de page)
const MAIL_BIENVENUE = 1;      // modèle « SILENCE — 1. Bienvenue (code −10 %) »

const propre = (s, max) => String(s || '').replace(/[<>\u0000-\u001f]/g, '').slice(0, max);

export async function onRequestPost({ request, env }) {
  let d;
  try { d = await request.json(); } catch { return new Response(null, { status: 400 }); }
  const email = String(d.email || '').trim().toLowerCase().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return new Response(null, { status: 400 });
  if (!String(d.accord || '').startsWith('oui')) return new Response(null, { status: 403 });   // pas d'accord, rien

  const accord = propre(d.accord, 60), source = propre(d.source, 20), video = propre(d.v, 40);

  // la copie de sécurité : même si Brevo est en panne, l'inscription n'est pas perdue
  if (env.DB) {
    await preparer(env.DB);
    await env.DB.prepare('INSERT INTO inscrits (email, source, accord, video, jour) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT (email) DO NOTHING')
      .bind(email, source, accord, video, new Date().toISOString().slice(0, 10)).run();
  }

  const cle = env.BREVO_API_KEY;
  if (!cle) return new Response(null, { status: env.DB ? 202 : 503 });

  const h = { 'api-key': cle, 'content-type': 'application/json', accept: 'application/json' };
  const r = await fetch(BREVO + '/contacts', {
    method: 'POST', headers: h,
    body: JSON.stringify({
      email, listIds: [LISTE_INSCRITS], updateEnabled: true,
      attributes: { ACCORD_DATE: accord, SOURCE: source, VIDEO: video, MARQUE: 'SILENCE' }
    })
  });

  // 201 = nouvelle personne → la bienvenue part. 204 = déjà inscrite → on ne renvoie rien.
  if (r.status === 201) {
    await fetch(BREVO + '/smtp/email', {
      method: 'POST', headers: h,
      body: JSON.stringify({ templateId: MAIL_BIENVENUE, to: [{ email }], tags: ['bienvenue'] })
    });
  }
  return new Response(null, { status: r.ok ? 204 : 502 });
}
