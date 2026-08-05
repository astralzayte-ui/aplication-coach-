import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang, Loc, OnboardingState, PlannedMeal } from '../data/types'
import { locStr } from '../data/types'
import { BUDGET_DEFAULT } from '../config'
import { generatePlan, rebalance } from '../lib/planGenerator'
import { buildShoppingList, shoppingTotal, computeLeftovers } from '../lib/shoppingList'
import { computeTrial } from '../lib/trial'
import type { TrialInfo } from '../lib/trial'
import { makeT } from '../i18n/strings'

const STORAGE_KEY = 'romi_state_v1'

const defaultOnboarding: OnboardingState = {
  phone: '',
  password: '',
  storeId: null,
  budget: BUDGET_DEFAULT,
  durationWeeks: 1,
  reuseLeftovers: true,
  people: 2,
  ambiance: [],
  diets: ['aucun'],
  allergies: [],
  equipment: ['four', 'plaque'],
  mealsPerDay: ['petit_dejeuner', 'dejeuner', 'diner'],
}

interface AppState {
  lang: Lang
  account: { phone: string; password: string } | null
  loggedIn: boolean
  onboarding: OnboardingState
  plan: PlannedMeal[] | null
  planDays: number
  planSeed: number
  trialStartISO: string | null
  checked: Record<string, boolean>
  fridge: string[]
  pantry: Record<string, number> // leftover stock carried from previous cycles
}

const defaultState: AppState = {
  lang: 'fr',
  account: null,
  loggedIn: false,
  onboarding: defaultOnboarding,
  plan: null,
  planDays: 0,
  planSeed: 1,
  trialStartISO: null,
  checked: {},
  fridge: [],
  pantry: {},
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...defaultState, ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return defaultState
}

interface AppContextValue {
  state: AppState
  lang: Lang
  t: (key: string) => string
  /** Safe Loc lookup for the current lang, with EN→FR fallback. */
  loc: (l: Loc) => string
  setLang: (l: Lang) => void
  updateOnboarding: (patch: Partial<OnboardingState>) => void
  register: (phone: string, password: string) => void
  login: (phone: string, password: string) => boolean
  logout: () => void
  generate: () => void
  regenerate: () => void
  resetAll: () => void
  swapMeal: (dayIndex: number, mealType: string, newRecipeId: string) => void
  toggleChecked: (ingredientId: string) => void
  resetChecked: () => void
  setFridge: (ids: string[]) => void
  simulateTrialEnd: () => void
  trial: TrialInfo | null
  hasPlan: boolean
}

/** Fires a local notification inviting the user to pay via WhatsApp. */
export function notifyTrialEnded() {
  try {
    if (typeof Notification === 'undefined') return
    const show = () =>
      new Notification('Romi — essai terminé 🔒', {
        body: 'Ton essai de 7 jours est terminé. Appuie pour activer ton abonnement via WhatsApp.',
        icon: './icon-192.png',
      })
    if (Notification.permission === 'granted') show()
    else if (Notification.permission !== 'denied') Notification.requestPermission().then((p) => p === 'granted' && show())
  } catch { /* ignore */ }
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* ignore */ }
  }, [state])

  // keep <html> lang/dir in sync for RTL
  useEffect(() => {
    document.documentElement.lang = state.lang
    document.documentElement.dir = state.lang === 'ar' ? 'rtl' : 'ltr'
    // Store lang in a meta tag so CSS can read it
    document.documentElement.setAttribute('data-lang', state.lang)
  }, [state.lang])

  const setLang = useCallback((l: Lang) => setState((s) => ({ ...s, lang: l })), [])

  const updateOnboarding = useCallback((patch: Partial<OnboardingState>) => {
    setState((s) => ({ ...s, onboarding: { ...s.onboarding, ...patch } }))
  }, [])

  const register = useCallback((phone: string, password: string) => {
    setState((s) => ({
      ...s,
      account: { phone, password },
      loggedIn: true,
      onboarding: { ...s.onboarding, phone, password },
    }))
  }, [])

  const login = useCallback((phone: string, password: string) => {
    let ok = false
    setState((s) => {
      if (s.account && s.account.phone === phone && s.account.password === password) {
        ok = true
        return { ...s, loggedIn: true }
      }
      // demo: if no account yet, accept and create one
      if (!s.account) {
        ok = true
        return { ...s, account: { phone, password }, loggedIn: true, onboarding: { ...s.onboarding, phone, password } }
      }
      return s
    })
    return ok
  }, [])

  const logout = useCallback(() => setState((s) => ({ ...s, loggedIn: false })), [])

  const generate = useCallback(() => {
    setState((s) => {
      const isFirst = !s.plan // very first plan → free-trial "current week" logic
      const startISO = s.trialStartISO ?? new Date().toISOString()
      const trial = computeTrial(startISO)
      const weeks = Math.max(1, s.onboarding.durationWeeks || 1)
      const planDays = isFirst ? trial.planDays : weeks * 7
      const seed = Math.floor(Math.random() * 1e9)
      // Starting a NEW cycle: carry over leftovers from the finished plan
      // (if the option is on) so this cycle buys less. First plan starts empty.
      const pantry = isFirst
        ? {}
        : s.onboarding.reuseLeftovers && s.plan
          ? computeLeftovers(s.plan, s.onboarding, s.pantry)
          : {}
      const { meals } = generatePlan(s.onboarding, planDays, { seed })
      return { ...s, plan: meals, planDays, planSeed: seed, trialStartISO: startISO, checked: {}, pantry }
    })
  }, [])

  const regenerate = useCallback(() => {
    setState((s) => {
      if (!s.plan) return s
      const planDays = s.planDays || 7
      const seed = Math.floor(Math.random() * 1e9)
      const { meals } = generatePlan(s.onboarding, planDays, { seed })
      return { ...s, plan: meals, planSeed: seed, checked: {} }
    })
  }, [])

  // "Tout recommencer": wipe the plan and preferences, keep the account & trial,
  // and send the user back through the questionnaire from the start.
  const resetAll = useCallback(() => {
    setState((s) => ({
      ...s,
      onboarding: { ...defaultOnboarding, phone: s.onboarding.phone, password: s.onboarding.password },
      plan: null,
      planDays: 0,
      checked: {},
      fridge: [],
    }))
  }, [])

  const swapMeal = useCallback((dayIndex: number, mealType: string, newRecipeId: string) => {
    setState((s) => {
      if (!s.plan) return s
      let plan = s.plan.map((m) =>
        m.dayIndex === dayIndex && m.mealType === mealType ? { ...m, recipeId: newRecipeId } : m,
      )
      // Keep the shopping list coherent: if the swap pushes us over budget,
      // adjust OTHER dishes (never the one the user just chose) to fit again.
      const total = shoppingTotal(buildShoppingList(plan, s.onboarding))
      if (total > s.onboarding.budget) {
        plan = rebalance(plan, s.onboarding, (m) => m.dayIndex === dayIndex && m.mealType === mealType)
      }
      return { ...s, plan }
    })
  }, [])

  const toggleChecked = useCallback((ingredientId: string) => {
    setState((s) => ({ ...s, checked: { ...s.checked, [ingredientId]: !s.checked[ingredientId] } }))
  }, [])

  const resetChecked = useCallback(() => setState((s) => ({ ...s, checked: {} })), [])
  const setFridge = useCallback((ids: string[]) => setState((s) => ({ ...s, fridge: ids })), [])

  // Test helper: pushes the trial start 8 days back so the "trial ended" flow
  // (paywall + WhatsApp) can be previewed. Also fires the local notification.
  const simulateTrialEnd = useCallback(() => {
    const past = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
    setState((s) => ({ ...s, trialStartISO: past }))
    notifyTrialEnded()
  }, [])

  const trial = useMemo(
    () => (state.trialStartISO ? computeTrial(state.trialStartISO) : null),
    [state.trialStartISO],
  )

  const t = useMemo(() => makeT(state.lang), [state.lang])
  const loc = useMemo(() => (l: Loc) => locStr(l, state.lang), [state.lang])

  const value: AppContextValue = {
    state,
    lang: state.lang,
    t,
    loc,
    setLang,
    updateOnboarding,
    register,
    login,
    logout,
    generate,
    regenerate,
    resetAll,
    swapMeal,
    toggleChecked,
    resetChecked,
    setFridge,
    simulateTrialEnd,
    trial,
    hasPlan: !!state.plan,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
