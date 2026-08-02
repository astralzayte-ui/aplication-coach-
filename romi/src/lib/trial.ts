import type { Loc } from '../data/types'

const DAY_MS = 24 * 60 * 60 * 1000
export const TRIAL_LENGTH_DAYS = 7

export const DAY_LABELS: Loc[] = [
  { fr: 'Lun', ar: 'إث' }, // Monday (index 0 here = ISO Monday)
  { fr: 'Mar', ar: 'ثل' },
  { fr: 'Mer', ar: 'أر' },
  { fr: 'Jeu', ar: 'خم' },
  { fr: 'Ven', ar: 'جم' },
  { fr: 'Sam', ar: 'سب' },
  { fr: 'Dim', ar: 'أح' },
]

/** ISO day of week, 1 = Monday … 7 = Sunday. */
export function isoDow(d: Date): number {
  const js = d.getDay() // 0 = Sunday
  return js === 0 ? 7 : js
}

/**
 * Number of days covered by the free "current week" plan.
 *  - Mon/Tue (before Wednesday): the rest of the current week (today → Sunday).
 *  - Wed → Sun: a full 7 days, so late sign-ups still get margin.
 */
export function currentPlanDays(start: Date): number {
  const dow = isoDow(start)
  if (dow >= 3) return TRIAL_LENGTH_DAYS
  return 8 - dow // Mon → 7, Tue → 6
}

export const FULL_DAY_LABELS: Loc[] = [
  { fr: 'Lundi', ar: 'الإثنين' },
  { fr: 'Mardi', ar: 'الثلاثاء' },
  { fr: 'Mercredi', ar: 'الأربعاء' },
  { fr: 'Jeudi', ar: 'الخميس' },
  { fr: 'Vendredi', ar: 'الجمعة' },
  { fr: 'Samedi', ar: 'السبت' },
  { fr: 'Dimanche', ar: 'الأحد' },
]

/** Day-of-week labels for `n` consecutive days starting at `startISO`. */
export function dayLabelsFrom(startISO: string | null, n: number): Loc[] {
  if (!startISO || n <= 0) return []
  const startDow = isoDow(new Date(startISO)) // 1..7
  const out: Loc[] = []
  for (let i = 0; i < n; i++) out.push(DAY_LABELS[(startDow - 1 + i) % 7])
  return out
}

/** Full day-of-week labels ("Lundi"…) for `n` days from `startISO`. */
export function fullDayLabelsFrom(startISO: string | null, n: number): Loc[] {
  if (!startISO || n <= 0) return []
  const startDow = isoDow(new Date(startISO))
  const out: Loc[] = []
  for (let i = 0; i < n; i++) out.push(FULL_DAY_LABELS[(startDow - 1 + i) % 7])
  return out
}

export interface TrialInfo {
  start: Date
  end: Date
  daysLeft: number
  expired: boolean
  planDays: number
  /** day labels for the plan, starting at `start` */
  days: Loc[]
}

export function computeTrial(startISO: string, now: Date = new Date()): TrialInfo {
  const start = new Date(startISO)
  const end = new Date(start.getTime() + TRIAL_LENGTH_DAYS * DAY_MS)
  const msLeft = end.getTime() - now.getTime()
  const daysLeft = Math.max(0, Math.ceil(msLeft / DAY_MS))
  const planDays = currentPlanDays(start)
  const startDow = isoDow(start) // 1..7
  const days: Loc[] = []
  for (let i = 0; i < planDays; i++) {
    days.push(DAY_LABELS[(startDow - 1 + i) % 7])
  }
  return { start, end, daysLeft, expired: msLeft <= 0, planDays, days }
}

/** WhatsApp deep link used when the trial ends. */
export function whatsappUrl(phone: string, message: string): string {
  const num = phone.replace(/[^\d]/g, '')
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}
