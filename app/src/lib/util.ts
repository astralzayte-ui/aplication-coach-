// Petits utilitaires : WhatsApp, presse-papiers, formats.
import { Linking } from "react-native";
import * as Clipboard from "expo-clipboard";

export async function copyText(text: string): Promise<void> {
  await Clipboard.setStringAsync(text);
}

// Numéro WhatsApp pour « Prendre un abonnement » (Maroc : 212, sans le 0, sans espaces).
export const SUBSCRIPTION_PHONE = "212786496999";

// Construit le lien WhatsApp (fonction pure → testable).
export function buildWhatsAppUrl(message: string, phone?: string): string {
  const num = (phone ?? "").replace(/[^0-9]/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

// Ouvre WhatsApp avec un message prérempli. Numéro optionnel (sinon choix du contact).
// Ouvre l'app WhatsApp si installée, sinon WhatsApp Web (via le lien wa.me).
export async function openWhatsApp(message: string, phone?: string): Promise<void> {
  const url = buildWhatsAppUrl(message, phone);
  try {
    await Linking.openURL(url);
  } catch {
    // wa.me bascule automatiquement vers WhatsApp Web si l'app n'est pas là.
  }
}

// Ouvre WhatsApp sur le numéro d'abonnement avec le message traduit.
export async function openSubscription(message: string): Promise<void> {
  await openWhatsApp(message, SUBSCRIPTION_PHONE);
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

// Génère un programme d'exemple selon le nb de jours et l'objectif.
// Forme : tableau de jours, chaque jour = liste d'exercices {name, sets, reps}.
export function buildProgram(days: number, objective: string): { name: string; sets: number; reps: string }[][] {
  const pools: Record<string, string[]> = {
    push: ["Développé couché", "Développé militaire", "Dips", "Élévations latérales"],
    pull: ["Tractions", "Rowing", "Curl biceps", "Face pull"],
    legs: ["Squat", "Fentes", "Soulevé de terre", "Mollets"],
    full: ["Squat", "Développé couché", "Rowing", "Gainage"],
  };
  const order = ["push", "pull", "legs", "full", "push", "pull"];
  const sets = objective === "perte" ? 3 : 4;
  const reps = objective === "perte" ? "12-15" : objective === "muscle" ? "8-12" : "6-10";
  return Array.from({ length: days }, (_, i) =>
    (pools[order[i % order.length]] || pools.full).map((name) => ({ name, sets, reps })),
  );
}

// Libellé d'abonnement : « X j restants » ou « Abonnement expiré ».
export function daysLeftLabel(subEnd: string, t: (k: string, o?: any) => string): string {
  const end = new Date(subEnd + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const left = Math.round((end.getTime() - now.getTime()) / 86400000);
  return left <= 0 ? t("expired_title") : t("days_left", { n: left });
}
