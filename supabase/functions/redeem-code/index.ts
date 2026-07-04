// =====================================================================
// FORMA — Edge Function « redeem-code »
// C'est le SEUL point d'entrée pour se connecter avec un code.
// Elle tourne côté serveur avec la clé de service (jamais dans l'app) :
//   1. vérifie le code (rôle, durée, expiration, usage unique) via la base ;
//   2. crée ou retrouve le compte ;
//   3. renvoie une vraie session (access_token + refresh_token) à l'app.
// La logique de règles est dans la base (forma_peek_code / forma_provision_account) :
// même si quelqu'un bidouille l'app, il ne peut pas contourner ces règles.
// =====================================================================
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { cors, json } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const MASTER_MANAGER_CODE = Deno.env.get("MASTER_MANAGER_CODE") ?? "2006117";
const MANAGER_EMAIL = Deno.env.get("MANAGER_EMAIL") ?? "manager@forma.app";

// Limite anti-abus : nb max de tentatives par IP sur 15 minutes.
const MAX_ATTEMPTS = 10;

function randomPassword(): string {
  return crypto.randomUUID() + crypto.randomUUID().replace(/-/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let code = "";
  let expectedRole = ""; // 'coach' | 'student' | 'manager' | '' (profil choisi dans l'app)
  try {
    const body = await req.json();
    code = String(body.code ?? "").trim();
    expectedRole = String(body.role ?? "").trim();
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  if (!code) return json({ error: "missing_code" }, 400);

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  // ---- Anti-abus : compter les tentatives récentes de cette IP -------------
  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("login_attempts")
    .select("*", { count: "exact", head: true })
    .eq("ip", ip)
    .gte("created_at", since);
  if ((count ?? 0) >= MAX_ATTEMPTS) {
    return json({ error: "too_many_attempts" }, 429);
  }

  const logAttempt = (success: boolean, masked?: string) =>
    admin.from("login_attempts").insert({ ip, success, code_masked: masked ?? null });

  // ---- Cas MANAGER : code maître -------------------------------------------
  if (expectedRole && expectedRole === "manager" && code !== MASTER_MANAGER_CODE) {
    await logAttempt(false, "MANAGER");
    return json({ error: "invalid_code" }, 400);
  }
  if (code === MASTER_MANAGER_CODE) {
    const session = await signInOrCreateManager(admin);
    if (!session) {
      await logAttempt(false, "MANAGER");
      return json({ error: "manager_bootstrap_failed" }, 500);
    }
    await logAttempt(true, "MANAGER");
    return json({ role: "manager", session });
  }

  // ---- Cas COACH / ÉLÈVE : vérifier le code côté base ----------------------
  const { data: peek, error: peekErr } = await admin.rpc("forma_peek_code", { p_code: code });
  if (peekErr) return json({ error: "server_error" }, 500);
  const info = Array.isArray(peek) ? peek[0] : peek;

  if (!info || !info.valid) {
    await logAttempt(false);
    // reason: invalid_code | code_expired | revoked
    return json({ error: info?.reason ?? "invalid_code" }, 400);
  }

  // Le profil choisi dans l'app doit correspondre au type du code
  // (un coach ne peut pas entrer avec un code élève, et inversement).
  if (
    expectedRole &&
    (expectedRole === "coach" || expectedRole === "student") &&
    info.role !== expectedRole
  ) {
    await logAttempt(false, info.code_masked);
    return json({ error: "wrong_role_for_code" }, 400);
  }

  try {
    let userId: string;
    let email: string;

    if (!info.already_used) {
      // Première utilisation : créer le compte auth, puis provisionner en base.
      email = `${info.role}.${crypto.randomUUID()}@forma.app`;
      const password = randomPassword();
      const { data: created, error: cErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
      if (cErr || !created.user) throw new Error("create_user_failed");
      userId = created.user.id;

      const { error: provErr } = await admin.rpc("forma_provision_account", {
        p_code_id: info.code_id,
        p_user_id: userId,
      });
      if (provErr) {
        // Rollback du compte auth si la provision échoue (ex. code utilisé entre-temps)
        await admin.auth.admin.deleteUser(userId);
        throw new Error(provErr.message ?? "provision_failed");
      }
      const session = await signIn(admin, email, password);
      await logAttempt(true, info.code_masked);
      return json({ role: info.role, session, first_login: true });
    } else {
      // Reconnexion : retrouver le compte lié et rouvrir une session.
      userId = info.used_by;
      const { data: got, error: gErr } = await admin.auth.admin.getUserById(userId);
      if (gErr || !got.user?.email) throw new Error("user_not_found");
      email = got.user.email;
      const password = randomPassword();
      const { error: uErr } = await admin.auth.admin.updateUserById(userId, { password });
      if (uErr) throw new Error("reset_password_failed");
      const session = await signIn(admin, email, password);
      await logAttempt(true, info.code_masked);
      return json({ role: info.role, session, first_login: false });
    }
  } catch (e) {
    await logAttempt(false, info.code_masked);
    return json({ error: String((e as Error).message ?? "error") }, 400);
  }
});

// Ouvre une session pour un email/mot de passe et renvoie les jetons.
async function signIn(admin: ReturnType<typeof createClient>, email: string, password: string) {
  const { data, error } = await admin.auth.signInWithPassword({ email, password });
  if (error || !data.session) throw new Error("sign_in_failed");
  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  };
}

// Crée le compte manager la 1re fois, sinon rouvre une session.
async function signInOrCreateManager(admin: ReturnType<typeof createClient>) {
  const password = randomPassword();
  // Chercher un profil manager existant
  const { data: existing } = await admin
    .from("profiles")
    .select("id")
    .eq("role", "manager")
    .limit(1)
    .maybeSingle();

  if (existing?.id) {
    const { data: u } = await admin.auth.admin.getUserById(existing.id);
    if (!u.user?.email) return null;
    await admin.auth.admin.updateUserById(existing.id, { password });
    return signIn(admin, u.user.email, password);
  }

  // Amorçage : créer le compte manager
  const { data: created, error } = await admin.auth.admin.createUser({
    email: MANAGER_EMAIL,
    password,
    email_confirm: true,
  });
  if (error || !created.user) return null;
  await admin.from("profiles").insert({ id: created.user.id, role: "manager" });
  return signIn(admin, MANAGER_EMAIL, password);
}
