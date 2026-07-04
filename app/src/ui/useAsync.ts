// Hook standard de chargement de données : gère chargement / erreur / recharger.
// Garantit qu'aucun écran ne reste vide sans explication.
import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/net";

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null; // code d'erreur ('network', 'server_error', …)
  reload: () => void;
  setData: (d: T) => void;
};

export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fn();
      setData(r);
    } catch (e) {
      setError(e instanceof ApiError ? e.code : "server_error");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, reload: load, setData };
}
