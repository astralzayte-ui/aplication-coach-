// =====================================================================
// FORMA — Edge Function « delete-account »
// Supprime DÉFINITIVEMENT le compte de l'utilisateur connecté et toutes ses
// données (exigence Apple + RGPD). Appelée depuis l'app par l'utilisateur.
// La suppression du compte auth entraîne, en cascade, la suppression de
// profiles / coaches / students / weights / messages... (clés ON DELETE CASCADE).
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2";
import { cors, json } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const authHeader = req.headers.get("Authorization") ?? "";
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) return json({ error: "not_authenticated" }, 401);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Vérifier le jeton et récupérer l'identité réelle (on ne fait confiance
  // qu'à ce que le serveur peut valider, pas à un id envoyé par l'app).
  const { data: userData, error } = await admin.auth.getUser(token);
  if (error || !userData.user) return json({ error: "not_authenticated" }, 401);

  const userId = userData.user.id;

  // Trace RGPD (soft delete) puis suppression définitive du compte auth.
  await admin.rpc("forma_soft_delete_me").catch(() => {});
  const { error: delErr } = await admin.auth.admin.deleteUser(userId);
  if (delErr) return json({ error: "delete_failed" }, 500);

  return json({ ok: true });
});
