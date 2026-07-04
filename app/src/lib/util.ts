// Petits utilitaires : WhatsApp, presse-papiers, formats.
import { Linking } from "react-native";
import * as Clipboard from "expo-clipboard";

export async function copyText(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}

// Ouvre WhatsApp avec un message prérempli. Numéro optionnel (sinon choix du contact).
export async function openWhatsApp(message: string, phone?: string): Promise<void> {
  const num = (phone ?? "").replace(/[^0-9]/g, "");
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  const ok = await Linking.canOpenURL(url);
  if (ok) await Linking.openURL(url);
}

export const DURATIONS = [7, 30, 90, 180, 365] as const;

export function durationLabel(days: number): string {
  return `${days} j`;
}

// Analyse simple de progression à partir des poids et de l'objectif.
// Renvoie une tendance (kg) et une couleur d'état (bon / à surveiller / alerte).
export function analyzeWeights(
  values: number[],
  objective: string,
): { trend: number; kind: "good" | "warn" | "danger" } {
  if (!values || values.length < 2) return { trend: 0, kind: "warn" };
  const trend = +(values[values.length - 1] - values[Math.max(0, values.length - 3)]).toFixed(1);
  const wantLoss = objective === "perte";
  const wantGain = objective === "muscle" || objective === "masse";
  let kind: "good" | "warn" | "danger" = "warn";
  if (wantLoss) kind = trend < -0.2 ? "good" : trend > 0.3 ? "danger" : "warn";
  else if (wantGain) kind = trend > 0.2 ? "good" : trend < -0.3 ? "danger" : "warn";
  else kind = Math.abs(trend) < 0.5 ? "good" : "warn";
  return { trend, kind };
}

export function trendLabel(trend: number): string {
  return (trend > 0 ? "+" : "") + trend.toFixed(1);
}

// Libellé d'abonnement : « X j restants » ou « Abonnement expiré ».
export function daysLeftLabel(subEnd: string, t: (k: string, o?: any) => string): string {
  const end = new Date(subEnd + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const left = Math.round((end.getTime() - now.getTime()) / 86400000);
  return left <= 0 ? t("expired_title") : t("days_left", { n: left });
}
