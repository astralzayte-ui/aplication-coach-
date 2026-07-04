// =====================================================================
// FORMA — Données de démonstration enrichies (à lancer UNE fois après le
// déploiement, pour qu'un testeur voie un coach déjà rempli).
//
// Usage :
//   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node supabase/scripts/seed-demo.mjs
//
// Crée : un coach de démo (code FORMA-COACH-DEMO) avec quelques élèves,
// des poids, des repas et des messages. Idempotent (préfixe demo).
// =====================================================================
import { createClient } from "@supabase/supabase-js";

const URL = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !KEY) {
  console.error("Définis SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}
const db = createClient(URL, KEY, { auth: { persistSession: false } });

async function makeUser(email, role) {
  const { data: created, error } = await db.auth.admin.createUser({ email, password: crypto.randomUUID(), email_confirm: true });
  if (error) {
    // déjà créé : on le retrouve
    const { data: list } = await db.auth.admin.listUsers();
    const found = list.users.find((u) => u.email === email);
    if (!found) throw error;
    return found.id;
  }
  await db.from("profiles").upsert({ id: created.user.id, role, consent_at: new Date().toISOString() });
  return created.user.id;
}

function future(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  console.log("→ Coach de démo…");
  const coachId = await makeUser("demo.coach@forma.app", "coach");
  await db.from("coaches").upsert({ id: coachId, name: "Sofiane", whatsapp: "+212 6 12 34 56 78", city: "Casablanca", subscription_end: future(300), setup_done: true });

  console.log("→ Repas de démo…");
  await db.from("meals").insert([
    { coach_id: coachId, name: "Poulet riz brocoli", kcal: 620, protein: 55, category: "caloric", ingredients: "Poulet, riz, brocoli, huile d'olive" },
    { coach_id: coachId, name: "Omelette avoine", kcal: 480, protein: 38, category: "caloric", ingredients: "Œufs, flocons d'avoine, épinards" },
    { coach_id: coachId, name: "Salade thon", kcal: 320, protein: 30, category: "light", ingredients: "Thon, salade, tomate, maïs" },
  ]);

  const students = [
    { email: "demo.karim@forma.app", prenom: "Karim", weight: 78, height: 178, obj: "muscle", weights: [80, 79, 78, 77.5] },
    { email: "demo.yasmine@forma.app", prenom: "Yasmine", weight: 62, height: 165, obj: "perte", weights: [66, 65, 64, 62] },
    { email: "demo.diego@forma.app", prenom: "Diego", weight: 85, height: 182, obj: "masse", weights: [82, 83, 84, 85] },
  ];

  for (const s of students) {
    console.log(`→ Élève ${s.prenom}…`);
    const id = await makeUser(s.email, "student");
    await db.from("students").upsert({
      id, coach_id: coachId, prenom: s.prenom, weight: s.weight, height: s.height,
      whatsapp: "+212 6 00 00 00 00", objective: s.obj, subscription_end: future(120),
      streak: Math.floor(Math.random() * 15), onboarding_done: true,
    });
    // poids
    let day = 21;
    for (const w of s.weights) {
      await db.from("weights").insert({ student_id: id, weight: w, measured_on: future(-day) });
      day -= 7;
    }
    // un message
    await db.from("messages").insert({ coach_id: coachId, student_id: id, sender_role: "coach", body: `Salut ${s.prenom}, prêt pour la séance ?` });
  }

  console.log("✅ Données de démonstration créées.");
}

main().catch((e) => { console.error(e); process.exit(1); });
