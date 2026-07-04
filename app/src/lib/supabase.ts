// Client Supabase de l'application (côté téléphone).
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";
import { sessionStore } from "./sessionStore";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: sessionStore,
    storageKey: "forma-session",
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
