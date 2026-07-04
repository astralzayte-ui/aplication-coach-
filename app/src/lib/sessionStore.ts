// =====================================================================
// Stockage de session pour « Se souvenir de moi ».
//   - Si l'utilisateur COCHE « se souvenir de moi » : la session est écrite de
//     façon SÉCURISÉE (expo-secure-store, chiffré par le système) → il reste
//     connecté après fermeture/réouverture de l'app.
//   - Si NON coché : la session ne vit qu'en mémoire → il devra se reconnecter
//     au prochain démarrage.
// Les jetons pouvant dépasser la taille max de SecureStore, on les découpe en
// morceaux (« chunks »).
// =====================================================================
import * as SecureStore from "expo-secure-store";

const CHUNK = 1800; // marge sous la limite ~2 Ko de SecureStore
const REMEMBER_KEY = "forma_remember";

let remember = true; // rechargé au démarrage depuis SecureStore
const memory = new Map<string, string>();

function safeKey(key: string): string {
  // SecureStore n'accepte que [A-Za-z0-9._-]
  return key.replace(/[^A-Za-z0-9._-]/g, "_");
}

async function setLarge(key: string, value: string): Promise<void> {
  await removeLarge(key);
  const k = safeKey(key);
  const n = Math.ceil(value.length / CHUNK);
  await SecureStore.setItemAsync(`${k}__n`, String(n));
  for (let i = 0; i < n; i++) {
    await SecureStore.setItemAsync(`${k}__${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK));
  }
}

async function getLarge(key: string): Promise<string | null> {
  const k = safeKey(key);
  const nStr = await SecureStore.getItemAsync(`${k}__n`);
  if (!nStr) return null;
  const n = parseInt(nStr, 10);
  let out = "";
  for (let i = 0; i < n; i++) {
    const part = await SecureStore.getItemAsync(`${k}__${i}`);
    if (part == null) return null;
    out += part;
  }
  return out;
}

async function removeLarge(key: string): Promise<void> {
  const k = safeKey(key);
  const nStr = await SecureStore.getItemAsync(`${k}__n`);
  if (nStr) {
    const n = parseInt(nStr, 10);
    for (let i = 0; i < n; i++) await SecureStore.deleteItemAsync(`${k}__${i}`);
    await SecureStore.deleteItemAsync(`${k}__n`);
  }
}

// À appeler au démarrage pour connaître le choix précédent de l'utilisateur.
export async function initRemember(): Promise<boolean> {
  const v = await SecureStore.getItemAsync(REMEMBER_KEY);
  remember = v !== "0";
  return remember;
}

// À appeler AVANT de se connecter, selon la case cochée ou non.
export async function setRemember(value: boolean): Promise<void> {
  remember = value;
  await SecureStore.setItemAsync(REMEMBER_KEY, value ? "1" : "0");
  if (!value) {
    // On efface toute session persistée pour ne rien laisser traîner.
    await removeLarge("forma-session");
  }
}

export function getRemember(): boolean {
  return remember;
}

// Adaptateur attendu par supabase-js (getItem/setItem/removeItem).
export const sessionStore = {
  getItem: async (key: string): Promise<string | null> => {
    if (!remember) return memory.get(key) ?? null;
    return getLarge(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (!remember) {
      memory.set(key, value);
      return;
    }
    await setLarge(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    memory.delete(key);
    await removeLarge(key);
  },
};
