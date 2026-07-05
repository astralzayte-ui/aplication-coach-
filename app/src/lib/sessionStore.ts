// =====================================================================
// Stockage de session pour « Se souvenir de moi ».
//   - Natif : expo-secure-store (chiffré par le système).
//   - Web (test navigateur) : localStorage.
//   - Si « se souvenir » non coché : session en mémoire uniquement.
// Les jetons pouvant dépasser la taille max de SecureStore, on les découpe.
// =====================================================================
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const IS_WEB = Platform.OS === "web";

// Backend de stockage persistant, adapté à la plateforme.
const store = {
  get: async (k: string): Promise<string | null> => {
    if (IS_WEB) return globalThis.localStorage?.getItem(k) ?? null;
    return SecureStore.getItemAsync(k);
  },
  set: async (k: string, v: string): Promise<void> => {
    if (IS_WEB) { globalThis.localStorage?.setItem(k, v); return; }
    await SecureStore.setItemAsync(k, v);
  },
  del: async (k: string): Promise<void> => {
    if (IS_WEB) { globalThis.localStorage?.removeItem(k); return; }
    await SecureStore.deleteItemAsync(k);
  },
};

const CHUNK = 1800; // marge sous la limite ~2 Ko de SecureStore
const REMEMBER_KEY = "forma_remember";

let remember = true; // rechargé au démarrage
const memory = new Map<string, string>();

function safeKey(key: string): string {
  // SecureStore n'accepte que [A-Za-z0-9._-]
  return key.replace(/[^A-Za-z0-9._-]/g, "_");
}

async function setLarge(key: string, value: string): Promise<void> {
  await removeLarge(key);
  const k = safeKey(key);
  const n = Math.ceil(value.length / CHUNK);
  await store.set(`${k}__n`, String(n));
  for (let i = 0; i < n; i++) {
    await store.set(`${k}__${i}`, value.slice(i * CHUNK, (i + 1) * CHUNK));
  }
}

async function getLarge(key: string): Promise<string | null> {
  const k = safeKey(key);
  const nStr = await store.get(`${k}__n`);
  if (!nStr) return null;
  const n = parseInt(nStr, 10);
  let out = "";
  for (let i = 0; i < n; i++) {
    const part = await store.get(`${k}__${i}`);
    if (part == null) return null;
    out += part;
  }
  return out;
}

async function removeLarge(key: string): Promise<void> {
  const k = safeKey(key);
  const nStr = await store.get(`${k}__n`);
  if (nStr) {
    const n = parseInt(nStr, 10);
    for (let i = 0; i < n; i++) await store.del(`${k}__${i}`);
    await store.del(`${k}__n`);
  }
}

// À appeler au démarrage pour connaître le choix précédent de l'utilisateur.
export async function initRemember(): Promise<boolean> {
  const v = await store.get(REMEMBER_KEY);
  remember = v !== "0";
  return remember;
}

// À appeler AVANT de se connecter, selon la case cochée ou non.
export async function setRemember(value: boolean): Promise<void> {
  remember = value;
  await store.set(REMEMBER_KEY, value ? "1" : "0");
  if (!value) {
    await removeLarge("forma-session"); // on n'en garde aucune trace persistée
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
    if (!remember) { memory.set(key, value); return; }
    await setLarge(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    memory.delete(key);
    await removeLarge(key);
  },
};
