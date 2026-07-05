// =====================================================================
// FORMA — Edge Function « admin-delete-user »
// Supprime DÉFINITIVEMENT un compte (coach ou élève) à la demande d'un
// manager (n'importe qui) ou d'un coach (uniquement SES élèves).
// L'autorisation est vérifiée CÔTÉ SERVEUR : on ne fait pas confiance à l'app.
// =====================================================================
import { createClient } from "npm:@supabase/supabase-js@2";
import { cors, json } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const token = (req.headers.get("Authorization") ?? "").replace("Bearer ", "").trim();
  if (!token) return json({ error: "not_authenticated" }, 401);

  let targetId = "";
  try {
    targetId = String((await req.json()).target_id ?? "").trim();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (!targetId) return json({ error: "missing_target" }, 400);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Identité réelle de l'appelant
  const { data: userData, error } = await admin.auth.getUser(token);
  if (error || !userData.user) return json({ error: "not_authenticated" }, 401);
  const callerId = userData.user.id;

  // Rôle de l'appelant
  const { data: caller } = await admin.from("profiles").select("role").eq("id", callerId).maybeSingle();
  if (!caller) return json({ error: "forbidden" }, 403);

  let allowed = false;
  if (caller.role === "manager") {
    allowed = true; // le manager peut supprimer un coach ou un élève
  } else if (caller.role === "coach") {
    // un coach ne peut supprimer qu'un de SES élèves
    const { data: stu } = await admin.from("students").select("coach_id").eq("id", targetId).maybeSingle();
    allowed = Boolean(stu && stu.coach_id === callerId);
  }
  if (!allowed) return json({ error: "forbidden" }, 403);

  // Suppression définitive (cascade : profiles → coaches/students → données)
  const { error: delErr } = await admin.auth.admin.deleteUser(targetId);
  if (delErr) return json({ error: "delete_failed" }, 500);

  return json({ ok: true });
});
