// Configuration publique de l'app. On n'y met JAMAIS de secret :
// seule la clé « anon » de Supabase est présente (elle est publique et sans danger,
// la vraie sécurité est assurée côté serveur par la RLS et les Edge Functions).
import Constants from "expo-constants";

const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, string>;

export const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? extra.supabaseUrl ?? "";

export const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? extra.supabaseAnonKey ?? "";

export const IS_CONFIGURED = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
