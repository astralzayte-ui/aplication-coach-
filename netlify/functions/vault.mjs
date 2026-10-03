// Coffre de l'application budget.
//
// Reçoit l'état complet de l'application depuis le téléphone et le garde côté
// Netlify, jamais dans le dépôt Git (qui est public). Sert aussi à Claude pour
// relire les données et faire les bilans d'une conversation à l'autre.
//
// Accès : en-tête « Authorization: Bearer XXXX-XXXX-XXXX-XXXX-XXXX-XXXX ».
// La clé est générée sur le téléphone ; le serveur n'en garde que l'empreinte
// SHA-256, si bien que le contenu du magasin ne révèle aucune clé.
//
//   GET                     dernier état enregistré
//   GET ?versions=1         dates des copies journalières disponibles
//   GET ?date=AAAA-MM-JJ    copie de ce jour-là
//   PUT                     enregistre l'état (et la copie du jour)
//   DELETE                  efface tout ce qui est rattaché à la clé

import { getStore } from "@netlify/blobs";

const MAX_OCTETS = 4 * 1024 * 1024;
const FORMAT_CLE = /^[A-Z2-9]{4}(?:-[A-Z2-9]{4}){5}$/;
const FORMAT_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ENTETES = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };

const reponse = (corps, statut = 200) =>
  new Response(typeof corps === "string" ? corps : JSON.stringify(corps), { status: statut, headers: ENTETES });

async function empreinte(cle) {
  const octets = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("bf-coffre:" + cle));
  return Array.from(new Uint8Array(octets), (o) => o.toString(16).padStart(2, "0")).join("");
}

// Date du jour à Casablanca, pour que la copie « du jour » colle à sa journée.
function jourLocal(d = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Casablanca" }).format(d);
}

export default async function coffre(req) {
  const cle = (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "").trim().toUpperCase();
  if (!FORMAT_CLE.test(cle)) return reponse({ erreur: "cle absente ou invalide" }, 401);

  const id = await empreinte(cle);
  const magasin = getStore({ name: "coffre", consistency: "strong" });
  const url = new URL(req.url);

  if (req.method === "GET") {
    if (url.searchParams.get("versions")) {
      const { blobs } = await magasin.list({ prefix: `${id}/j/` });
      const dates = blobs.map((b) => b.key.slice(b.key.lastIndexOf("/") + 1)).sort();
      return reponse({ dates });
    }
    const date = url.searchParams.get("date");
    if (date && !FORMAT_DATE.test(date)) return reponse({ erreur: "date invalide" }, 400);
    const contenu = await magasin.get(date ? `${id}/j/${date}` : `${id}/latest`, { type: "text" });
    if (contenu == null) return reponse({ erreur: "rien pour cette cle" }, 404);
    return reponse(contenu);
  }

  if (req.method === "PUT" || req.method === "POST") {
    const corps = await req.text();
    if (corps.length > MAX_OCTETS) return reponse({ erreur: "trop volumineux" }, 413);
    let objet;
    try { objet = JSON.parse(corps); } catch { return reponse({ erreur: "json illisible" }, 400); }
    if (!objet || typeof objet !== "object" || !objet.state || typeof objet.state !== "object") {
      return reponse({ erreur: "format inattendu" }, 400);
    }
    const recu = new Date();
    const enregistre = JSON.stringify({ ...objet, recuLe: recu.toISOString() });
    await magasin.set(`${id}/latest`, enregistre);
    await magasin.set(`${id}/j/${jourLocal(recu)}`, enregistre);
    return reponse({ ok: true, recuLe: recu.toISOString() });
  }

  if (req.method === "DELETE") {
    const { blobs } = await magasin.list({ prefix: `${id}/` });
    await Promise.all(blobs.map((b) => magasin.delete(b.key)));
    return reponse({ ok: true, effaces: blobs.length });
  }

  return reponse({ erreur: "methode non prise en charge" }, 405);
}
