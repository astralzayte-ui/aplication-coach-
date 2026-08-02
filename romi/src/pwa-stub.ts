// Stub used for the single-file "artifact" build, where the PWA service
// worker isn't available. Replaces `virtual:pwa-register` via a Vite alias.
export function registerSW(_opts?: unknown) {
  return () => {}
}
