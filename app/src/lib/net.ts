// Outils réseau partagés : erreurs « propres » + détection de coupure Internet.
export class ApiError extends Error {
  code: string;
  constructor(code: string, message?: string) {
    super(message ?? code);
    this.code = code;
  }
}

export function isNetworkError(e: unknown): boolean {
  const m = String((e as Error)?.message ?? e ?? "").toLowerCase();
  return (
    m.includes("network") ||
    m.includes("failed to fetch") ||
    m.includes("timeout") ||
    m.includes("connection") ||
    m.includes("fetch failed")
  );
}

// Exécute une opération Supabase et transforme l'erreur en ApiError lisible.
// (Le builder Supabase est « thenable » : PromiseLike suffit.)
export async function run<T>(fn: () => PromiseLike<{ data: T | null; error: any }>): Promise<T> {
  let res: { data: T | null; error: any };
  try {
    res = await fn();
  } catch (e) {
    throw new ApiError(isNetworkError(e) ? "network" : "server_error", String((e as Error).message));
  }
  if (res.error) {
    throw new ApiError(isNetworkError(res.error) ? "network" : "server_error", res.error.message);
  }
  return res.data as T;
}
