// =====================================================================
// État d'authentification global de l'app.
// Gère : démarrage (langue + « se souvenir de moi » + session existante),
// connexion par code, déconnexion, et rafraîchissement du profil.
// =====================================================================
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getMe, Me, redeemCode, signOut } from "@/lib/api";
import { supabase } from "@/lib/supabase";
import { initRemember, setRemember as persistRemember } from "@/lib/sessionStore";
import { initI18n } from "@/i18n";

type Phase = "booting" | "signedOut" | "signedIn";

type AuthValue = {
  phase: Phase;
  me: Me | null;
  remember: boolean;
  bootError: string | null;
  setRemember: (v: boolean) => Promise<void>;
  login: (code: string, role?: string) => Promise<{ role: string; firstLogin: boolean }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<Phase>("booting");
  const [me, setMe] = useState<Me | null>(null);
  const [remember, setRememberState] = useState(true);
  const [bootError, setBootError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      setMe(null);
      setPhase("signedOut");
      return;
    }
    const profile = await getMe();
    if (!profile) {
      setMe(null);
      setPhase("signedOut");
      return;
    }
    setMe(profile);
    setPhase("signedIn");
  }, []);

  // Démarrage
  useEffect(() => {
    (async () => {
      try {
        await initI18n();
        const r = await initRemember();
        setRememberState(r);
        await refresh();
      } catch (e: any) {
        // Si le réseau manque au démarrage, on part sur l'écran de connexion
        // plutôt que de bloquer sur un écran vide.
        setBootError(e?.code ?? "server_error");
        setPhase("signedOut");
      }
    })();
  }, [refresh]);

  const setRemember = useCallback(async (v: boolean) => {
    await persistRemember(v);
    setRememberState(v);
  }, []);

  const login = useCallback(
    async (code: string, role?: string) => {
      const res = await redeemCode(code, role as any);
      await refresh();
      return res;
    },
    [refresh],
  );

  const logout = useCallback(async () => {
    await signOut();
    setMe(null);
    setPhase("signedOut");
  }, []);

  return (
    <Ctx.Provider
      value={{ phase, me, remember, bootError, setRemember, login, logout, refresh }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth(): AuthValue {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
}
