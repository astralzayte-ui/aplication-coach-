// =====================================================================
// FORMA — Jetons de design (couleurs, espacements, rayons, typo)
// Repris fidèlement du README / de la maquette. NE PAS confondre l'accent
// (bleu acier) avec les couleurs sémantiques (rouge/ambre/vert).
// =====================================================================

export const colors = {
  // Fonds
  bgDesk: "#07080B",
  bg: "#0D0F13",
  surface: "#15181E",
  surface2: "#1A1E24",

  // Texte
  text: "#F2F4EE",
  textMuted: "rgba(242,244,238,0.7)",
  textFaint: "rgba(242,244,238,0.45)",

  // Accent principal (bleu acier)
  accent: "#4F7DD1",
  accentShadow: "#3A5EA3",
  onAccent: "#0D0F13",
  accentSoft: "rgba(79,125,209,0.15)",

  // Sémantique (états — PAS l'accent)
  danger: "#FF5938", // suppression / alerte
  warn: "#FFB43C", // à surveiller
  good: "#7BD957", // bonne progression

  // Bordures
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.12)",
} as const;

export const radius = {
  sm: 8,
  md: 13,
  lg: 18,
  xl: 22,
  pill: 999,
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

export const font = {
  // Space Grotesk (chargée via expo-font). Fallback système si non chargée.
  regular: "SpaceGrotesk_400Regular",
  medium: "SpaceGrotesk_500Medium",
  bold: "SpaceGrotesk_700Bold",
} as const;

// Couleur d'une courbe de poids selon l'analyse de progression.
export function progressColor(kind: "good" | "warn" | "danger"): string {
  return kind === "good" ? colors.good : kind === "warn" ? colors.warn : colors.danger;
}
