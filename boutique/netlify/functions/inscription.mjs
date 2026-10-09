/* SILENCE — l'inscription aux e-mails.
   Appelée par le popup et le pied de page, SEULEMENT si la case d'accord est cochée.
   1. ajoute la personne dans Brevo (liste « SILENCE — inscrits »), avec la date de l'accord
   2. lui envoie l'e-mail de bienvenue avec le code −10 % — une seule fois

   La clé Brevo est rangée dans les réglages Netlify (BREVO_API_KEY), jamais dans le code. */
const BREVO = 'https://api.brevo.com/v3';
const LISTE_INSCRITS = 4;      // SILENCE — inscrits (popup + pied de page)
const MAIL_BIENVENUE = 1;      // modèle « SILENCE — 1. Bienvenue (code −10 %) »

const propre = (s, max) => String(s || '').replace(/[<>\u0000-\u001f]/g, '').slice(0, max);

export default async (req) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  const cle = process.env.BREVO_API_KEY;
  if (!cle) return new Response(null, { status: 503 });

  let d;
  try { d = await req.json(); } catch { return new Response(null, { status: 400 }); }
  const email = String(d.email || '').trim().toLowerCase().slice(0, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return new Response(null, { status: 400 });
  if (!String(d.accord || '').startsWith('oui')) return new Response(null, { status: 403 });   // pas d'accord, rien

  const h = { 'api-key': cle, 'content-type': 'application/json', accept: 'application/json' };
  const r = await fetch(BREVO + '/contacts', {
    method: 'POST', headers: h,
    body: JSON.stringify({
      email, listIds: [LISTE_INSCRITS], updateEnabled: true,
      attributes: { ACCORD_DATE: propre(d.accord, 60), SOURCE: propre(d.source, 20), VIDEO: propre(d.v, 40), MARQUE: 'SILENCE' }
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
};

export const config = { path: '/api/inscription' };
