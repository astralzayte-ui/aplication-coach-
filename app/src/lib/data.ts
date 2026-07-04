// =====================================================================
// Accès aux données métier (élèves, poids, repas, modèles, messages…).
// Toutes les requêtes passent par Supabase et sont filtrées par la RLS :
// on ne reçoit JAMAIS que ce qu'on a le droit de voir.
// =====================================================================
import { supabase } from "./supabase";
import { run } from "./net";
import { adminDeleteUser } from "./api";

export type Coach = {
  id: string;
  name: string | null;
  whatsapp: string | null;
  city: string | null;
  subscription_end: string;
};

export type Student = {
  id: string;
  coach_id: string | null;
  prenom: string | null;
  weight: number | null;
  height: number | null;
  whatsapp: string | null;
  objective: string;
  subscription_end: string;
  streak: number;
  onboarding_done: boolean;
};

export type Weight = { id: string; measured_on: string; weight: number; waist: number | null };
export type Meal = {
  id: string;
  coach_id: string;
  name: string;
  kcal: number | null;
  protein: number | null;
  category: string;
  ingredients: string | null;
};
export type Template = { id: string; name: string; duration: number | null; data: any };
export type Message = {
  id: string;
  coach_id: string;
  student_id: string;
  sender_role: "coach" | "student" | "manager";
  body: string;
  created_at: string;
};

async function uid(): Promise<string> {
  return (await supabase.auth.getUser()).data.user?.id ?? "";
}

export function daysLeft(subEnd: string): number {
  const end = new Date(subEnd + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((end.getTime() - now.getTime()) / 86400000);
}

// ---- MANAGER -------------------------------------------------------------
export async function listCoaches(): Promise<Coach[]> {
  return run(() =>
    supabase.from("coaches").select("id, name, whatsapp, city, subscription_end").order("created_at", { ascending: false }),
  );
}

export async function listAllStudents(): Promise<Student[]> {
  return run(() => supabase.from("students").select("*").order("created_at", { ascending: false }));
}

// Suppression DÉFINITIVE du compte (via Edge Function sécurisée côté serveur).
export async function deleteCoachAccount(id: string): Promise<void> {
  await adminDeleteUser(id);
}

export async function deleteStudentAccount(id: string): Promise<void> {
  await adminDeleteUser(id);
}

// ---- COACH : mes élèves --------------------------------------------------
export async function listMyStudents(): Promise<Student[]> {
  const me = await uid();
  return run(() =>
    supabase.from("students").select("*").eq("coach_id", me).order("created_at", { ascending: false }),
  );
}

export async function getStudent(id: string): Promise<Student> {
  return run(() => supabase.from("students").select("*").eq("id", id).single());
}

export async function updateStudent(id: string, patch: Partial<Student>): Promise<void> {
  await run(() => supabase.from("students").update(patch).eq("id", id).select());
}

// Poids de plusieurs élèves en une requête (pour les mini-courbes de la liste).
export async function getWeightsForStudents(ids: string[]): Promise<Record<string, number[]>> {
  if (ids.length === 0) return {};
  const rows = await run(() =>
    supabase.from("weights").select("student_id, weight, measured_on").in("student_id", ids).order("measured_on", { ascending: true }),
  );
  const map: Record<string, number[]> = {};
  for (const r of rows as any[]) {
    (map[r.student_id] ??= []).push(Number(r.weight));
  }
  return map;
}

export async function getStudentWeights(studentId: string): Promise<Weight[]> {
  return run(() =>
    supabase
      .from("weights")
      .select("id, measured_on, weight, waist")
      .eq("student_id", studentId)
      .order("measured_on", { ascending: true }),
  );
}

// Notes privées du coach sur un élève
export async function getNote(studentId: string): Promise<string> {
  const me = await uid();
  const data = await run(() =>
    supabase.from("coach_notes").select("body").eq("coach_id", me).eq("student_id", studentId).maybeSingle(),
  );
  return (data as any)?.body ?? "";
}

export async function saveNote(studentId: string, body: string): Promise<void> {
  const me = await uid();
  await run(() =>
    supabase.from("coach_notes").upsert({ coach_id: me, student_id: studentId, body, updated_at: new Date().toISOString() }).select(),
  );
}

// Programme assigné à un élève
export async function getStudentProgram(studentId: string): Promise<any> {
  const data = await run(() =>
    supabase.from("student_programs").select("data").eq("student_id", studentId).maybeSingle(),
  );
  return (data as any)?.data ?? null;
}

export async function saveStudentProgram(studentId: string, programData: any): Promise<void> {
  await run(() =>
    supabase.from("student_programs").upsert({ student_id: studentId, data: programData, updated_at: new Date().toISOString() }).select(),
  );
}

// ---- COACH : profil ------------------------------------------------------
export async function getMyCoach(): Promise<Coach> {
  const me = await uid();
  return run(() => supabase.from("coaches").select("id, name, whatsapp, city, subscription_end").eq("id", me).single());
}

export async function updateMyCoach(patch: { name?: string; whatsapp?: string }): Promise<void> {
  const me = await uid();
  await run(() => supabase.from("coaches").update(patch).eq("id", me).select());
}

// ---- COACH : repas -------------------------------------------------------
export async function listMeals(): Promise<Meal[]> {
  return run(() => supabase.from("meals").select("*").order("created_at", { ascending: false }));
}

export async function addMeal(m: Omit<Meal, "id" | "coach_id">): Promise<void> {
  const me = await uid();
  await run(() => supabase.from("meals").insert({ ...m, coach_id: me }).select());
}

export async function deleteMeal(id: string): Promise<void> {
  await run(() => supabase.from("meals").delete().eq("id", id).select());
}

// ---- COACH : templates ---------------------------------------------------
export async function listTemplates(): Promise<Template[]> {
  return run(() => supabase.from("templates").select("id, name, duration, data").order("created_at", { ascending: false }));
}

export async function saveTemplate(tpl: { id?: string; name: string; duration: number; data: any }): Promise<void> {
  const me = await uid();
  if (tpl.id) {
    await run(() => supabase.from("templates").update({ name: tpl.name, duration: tpl.duration, data: tpl.data }).eq("id", tpl.id).select());
  } else {
    await run(() => supabase.from("templates").insert({ coach_id: me, name: tpl.name, duration: tpl.duration, data: tpl.data }).select());
  }
}

export async function deleteTemplate(id: string): Promise<void> {
  await run(() => supabase.from("templates").delete().eq("id", id).select());
}

// ---- MESSAGERIE ----------------------------------------------------------
export async function listMessages(coachId: string, studentId: string): Promise<Message[]> {
  return run(() =>
    supabase
      .from("messages")
      .select("*")
      .eq("coach_id", coachId)
      .eq("student_id", studentId)
      .order("created_at", { ascending: true }),
  );
}

export async function sendMessage(
  coachId: string,
  studentId: string,
  senderRole: "coach" | "student",
  body: string,
): Promise<void> {
  await run(() =>
    supabase.from("messages").insert({ coach_id: coachId, student_id: studentId, sender_role: senderRole, body }).select(),
  );
}

// ---- ÉLÈVE ---------------------------------------------------------------
export async function getMyStudent(): Promise<Student> {
  const me = await uid();
  return run(() => supabase.from("students").select("*").eq("id", me).single());
}

export async function getMyCoachInfo(): Promise<Coach | null> {
  const me = await uid();
  const student = await run(() => supabase.from("students").select("coach_id").eq("id", me).single());
  const coachId = (student as any)?.coach_id;
  if (!coachId) return null;
  return run(() => supabase.from("coaches").select("id, name, whatsapp, city, subscription_end").eq("id", coachId).single());
}

export async function listMyMeals(): Promise<Meal[]> {
  return run(() => supabase.from("meals").select("*").order("created_at", { ascending: false }));
}

export async function getMyProgram(): Promise<any> {
  const me = await uid();
  const data = await run(() => supabase.from("student_programs").select("data").eq("student_id", me).maybeSingle());
  return (data as any)?.data ?? null;
}

export async function getMyWeights(): Promise<Weight[]> {
  const me = await uid();
  return run(() =>
    supabase.from("weights").select("id, measured_on, weight, waist").eq("student_id", me).order("measured_on", { ascending: true }),
  );
}

export async function addMyWeight(weight: number, waist?: number): Promise<void> {
  const me = await uid();
  await run(() =>
    supabase.from("weights").insert({ student_id: me, weight, waist: waist ?? null }).select(),
  );
}

// Coches du jour (entraînement / repas)
export async function getTodayChecks(): Promise<{ training: boolean; meal: boolean }> {
  const me = await uid();
  const today = new Date().toISOString().slice(0, 10);
  const data = await run(() =>
    supabase.from("daily_checks").select("training, meal").eq("student_id", me).eq("check_date", today).maybeSingle(),
  );
  return { training: Boolean((data as any)?.training), meal: Boolean((data as any)?.meal) };
}

export async function setTodayCheck(field: "training" | "meal", value: boolean): Promise<void> {
  const me = await uid();
  const today = new Date().toISOString().slice(0, 10);
  await run(() =>
    supabase.from("daily_checks").upsert(
      { student_id: me, check_date: today, [field]: value },
      { onConflict: "student_id,check_date" },
    ).select(),
  );
}

// ---- Photos avant / après (stockées dans Supabase Storage) ---------------
export type Photo = { id: string; kind: string; storage_path: string; taken_at: string; url?: string };

const PHOTO_BUCKET = "progress-photos";

export async function uploadProgressPhoto(uri: string, kind: "before" | "after"): Promise<void> {
  const me = await uid();
  const resp = await fetch(uri);
  const buf = await resp.arrayBuffer();
  const path = `${me}/${Date.now()}_${kind}.jpg`;
  const up = await supabase.storage.from(PHOTO_BUCKET).upload(path, buf, { contentType: "image/jpeg", upsert: false });
  if (up.error) throw up.error;
  await run(() => supabase.from("photos").insert({ student_id: me, kind, storage_path: path }).select());
}

export async function listMyPhotos(): Promise<Photo[]> {
  // Best-effort : si le stockage n'est pas prêt, on renvoie une liste vide
  // plutôt que de casser tout l'écran Progrès.
  try {
    const me = await uid();
    const { data, error } = await supabase
      .from("photos")
      .select("id, kind, storage_path, taken_at")
      .eq("student_id", me)
      .order("taken_at", { ascending: false });
    if (error || !data) return [];
    const rows = data as Photo[];
    for (const p of rows) {
      const signed = await supabase.storage.from(PHOTO_BUCKET).createSignedUrl(p.storage_path, 3600);
      p.url = signed.data?.signedUrl;
    }
    return rows;
  } catch {
    return [];
  }
}

// ---- Notifications push : enregistrer le jeton de l'appareil -------------
export async function registerPushToken(token: string, platform: string): Promise<void> {
  const me = await uid();
  if (!me) return;
  await supabase.from("push_tokens").upsert({ user_id: me, token, platform }).select();
}
