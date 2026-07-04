// =====================================================================
// Couche d'accès au serveur. Toutes les fonctions renvoient des erreurs
// « propres » : jamais d'écran vide ni de plantage. En cas de coupure réseau,
// on renvoie une erreur `network` que l'app affiche clairement.
// =====================================================================
import { supabase } from "./supabase";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import { ApiError, isNetworkError } from "./net";

export { ApiError } from "./net";
export type Role = "manager" | "coach" | "student";
export type CodeRole = "coach" | "student";

// Appel d'une Edge Function (redeem-code, delete-account).
async function callFunction<T>(name: string, body: unknown, token?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${token ?? SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(body ?? {}),
    });
  } catch (e) {
    throw new ApiError("network");
  }
  let data: any = null;
  try {
    data = await res.json();
  } catch {
    /* réponse vide */
  }
  if (!res.ok) {
    throw new ApiError(data?.error ?? `http_${res.status}`);
  }
  return data as T;
}

// ---- Connexion par code -------------------------------------------------
export async function redeemCode(
  code: string,
  role?: Role,
): Promise<{ role: Role; firstLogin: boolean }> {
  const data = await callFunction<{
    role: Role;
    session: { access_token: string; refresh_token: string };
    first_login?: boolean;
  }>("redeem-code", { code, role });

  const { error } = await supabase.auth.setSession(data.session);
  if (error) throw new ApiError("session_error", error.message);
  return { role: data.role, firstLogin: Boolean(data.first_login) };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

// ---- Statut / abonnement ------------------------------------------------
export type Status = {
  authenticated: boolean;
  role?: Role;
  subscription_end?: string | null;
  active?: boolean;
};

export async function getStatus(): Promise<Status> {
  try {
    const { data, error } = await supabase.rpc("forma_my_status");
    if (error) throw error;
    return data as Status;
  } catch (e) {
    if (isNetworkError(e)) throw new ApiError("network");
    throw new ApiError("server_error", String((e as Error).message));
  }
}

// ---- Génération / gestion des codes (manager & coach) -------------------
export type GeneratedCode = { code: string; masked: string; code_id: string };

export async function generateCode(role: CodeRole, days: number): Promise<GeneratedCode> {
  const { data, error } = await supabase
    .rpc("forma_generate_code", { p_role: role, p_days: days })
    .single();
  if (error) throw new ApiError(isNetworkError(error) ? "network" : "server_error", error.message);
  return data as GeneratedCode;
}

export type CodeRow = {
  id: string;
  code_masked: string;
  role: CodeRole;
  duration_days: number;
  used: boolean;
  revoked: boolean;
  created_at: string;
};

export async function listMyCodes(): Promise<CodeRow[]> {
  const { data, error } = await supabase
    .from("access_codes")
    .select("id, code_masked, role, duration_days, used, revoked, created_at")
    .order("created_at", { ascending: false });
  if (error) throw new ApiError(isNetworkError(error) ? "network" : "server_error", error.message);
  return (data ?? []) as CodeRow[];
}

export async function deleteCode(id: string): Promise<void> {
  const { error } = await supabase.from("access_codes").delete().eq("id", id);
  if (error) throw new ApiError("server_error", error.message);
}

export async function extendSubscription(targetId: string, days: number): Promise<string> {
  const { data, error } = await supabase.rpc("forma_extend_subscription", {
    p_target: targetId,
    p_days: days,
  });
  if (error) throw new ApiError("server_error", error.message);
  return data as string;
}

// ---- RGPD ---------------------------------------------------------------
export async function setConsent(): Promise<void> {
  await supabase.rpc("forma_set_consent");
}

export async function exportMyData(): Promise<unknown> {
  const { data, error } = await supabase.rpc("forma_export_me");
  if (error) throw new ApiError("server_error", error.message);
  return data;
}

export async function deleteMyAccount(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  await callFunction("delete-account", {}, token);
  await supabase.auth.signOut();
}

// ---- « Qui suis-je » : tout ce dont l'app a besoin après connexion --------
export type Me = {
  role: Role;
  active: boolean; // abonnement encore valable ?
  subscriptionEnd: string | null;
  setupDone: boolean; // coach : formulaire nom+WhatsApp rempli ?
  onboardingDone: boolean; // élève : onboarding fait ?
  consentGiven: boolean;
  name: string | null;
  prenom: string | null;
};

export async function getMe(): Promise<Me | null> {
  let status: Status;
  try {
    status = await getStatus();
  } catch (e) {
    if (e instanceof ApiError && e.code === "network") throw e;
    throw new ApiError("server_error");
  }
  if (!status.authenticated || !status.role) return null;

  const uid = (await supabase.auth.getUser()).data.user?.id;
  const base: Me = {
    role: status.role,
    active: status.active ?? true,
    subscriptionEnd: status.subscription_end ?? null,
    setupDone: true,
    onboardingDone: true,
    consentGiven: false,
    name: null,
    prenom: null,
  };

  const { data: profile } = await supabase
    .from("profiles")
    .select("consent_at")
    .eq("id", uid)
    .maybeSingle();
  base.consentGiven = Boolean(profile?.consent_at);

  if (status.role === "coach") {
    const { data } = await supabase
      .from("coaches")
      .select("name, whatsapp, setup_done")
      .eq("id", uid)
      .maybeSingle();
    base.setupDone = Boolean(data?.setup_done);
    base.name = data?.name ?? null;
  } else if (status.role === "student") {
    const { data } = await supabase
      .from("students")
      .select("prenom, onboarding_done")
      .eq("id", uid)
      .maybeSingle();
    base.onboardingDone = Boolean(data?.onboarding_done);
    base.prenom = data?.prenom ?? null;
  }
  return base;
}

// ---- Enregistrer le profil coach (1re connexion) ------------------------
export async function saveCoachSetup(name: string, whatsapp: string): Promise<void> {
  const uid = (await supabase.auth.getUser()).data.user?.id;
  const { error } = await supabase
    .from("coaches")
    .update({ name, whatsapp, setup_done: true })
    .eq("id", uid);
  if (error) throw new ApiError("server_error", error.message);
}

// ---- Enregistrer l'onboarding élève (1re connexion) ---------------------
export async function saveStudentOnboarding(input: {
  prenom: string;
  weight: number;
  height: number;
  whatsapp: string;
}): Promise<void> {
  const uid = (await supabase.auth.getUser()).data.user?.id;
  const { error } = await supabase
    .from("students")
    .update({
      prenom: input.prenom,
      weight: input.weight,
      height: input.height,
      whatsapp: input.whatsapp,
      onboarding_done: true,
    })
    .eq("id", uid);
  if (error) throw new ApiError("server_error", error.message);
}
