import { NextResponse } from "next/server";

// Route serveur de commande.
// Ici transitent les commandes. La clé privée YouCan Pay reste sur le serveur
// (variable d'environnement YOUCAN_PRIVATE_KEY) et n'est JAMAIS exposée au navigateur.

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  const { customer, items, total, currency } = body || {};
  if (!customer?.name || !customer?.email || !Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Commande incomplète" }, { status: 400 });
  }

  const orderId = "ONYX-" + Date.now().toString(36).toUpperCase();

  // Trace de la commande (visible dans les logs Vercel).
  // Étape suivante possible : envoyer un email / enregistrer en base.
  console.log("[ONYX] Nouvelle commande", orderId, {
    customer,
    total,
    currency,
    lines: items.map((i) => `${i.name} (${i.colorLabel}${i.size ? " " + i.size : ""}) x${i.qty}`),
  });

  const privateKey = process.env.YOUCAN_PRIVATE_KEY;

  // ---------------------------------------------------------------
  //  PAIEMENT YOUCAN PAY — à activer quand tu auras tes clés API.
  //
  //  1. Mets tes clés dans les variables d'environnement (voir .env.example)
  //     - YOUCAN_PRIVATE_KEY (secrète, ici)
  //     - NEXT_PUBLIC_YOUCAN_PUBLIC_KEY (côté navigateur)
  //  2. Décommente le bloc ci-dessous. Il crée un "token" de paiement
  //     sécurisé côté serveur, que la page de commande utilise ensuite
  //     avec le SDK YouCan Pay pour afficher le formulaire de carte.
  //
  //  if (privateKey) {
  //    const yc = await fetch("https://youcanpay.com/api/v1/tokenize", {
  //      method: "POST",
  //      headers: { "Content-Type": "application/json" },
  //      body: JSON.stringify({
  //        pri_key: privateKey,
  //        amount: Math.round(total * 100), // en centimes
  //        currency: currency || "EUR",
  //        order_id: orderId,
  //        customer_ip: req.headers.get("x-forwarded-for") || "0.0.0.0",
  //        success_url: `${process.env.SITE_URL}/commande?ok=1`,
  //        error_url: `${process.env.SITE_URL}/commande?err=1`,
  //      }),
  //    }).then((r) => r.json());
  //    return NextResponse.json({ mode: "youcan", orderId, token: yc.data?.id });
  //  }
  // ---------------------------------------------------------------

  // Pour l'instant (paiement pas encore configuré) : on enregistre la commande.
  return NextResponse.json({ mode: "pending", orderId });
}
