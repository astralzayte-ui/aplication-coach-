import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Lang, OnboardingState, PlannedMeal } from '../data/types'
import { BUDGET_DEFAULT } from '../config'
import { generatePlan } from '../lib/planGenerator'
import { computeTrial } from '../lib/trial'
import type { TrialInfo } from '../lib/trial'
import { makeT } from '../i18n/strings'

const STORAGE_KEY = 'romi_state_v1'

const defaultOnboarding: OnboardingState = {
  phone: '',
  password: '',
  storeId: null,
  budget: BUDGET_DEFAULT,
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
  planSeed: number
  trialStartISO: string | null
  checked: Record<string, boolean>
  fridge: string[]
}

const defaultState: AppState = {
  lang: 'fr',
  account: null,
  loggedIn: false,
  onboarding: defaultOnboarding,
  plan: null,
  planSeed: 1,
  trialStartISO: null,
  checked: {},
  fridge: [],
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
  setLang: (l: Lang) => void
  updateOnboarding: (patch: Partial<OnboardingState>) => void
  register: (phone: string, password: string) => void
  login: (phone: string, password: string) => boolean
  logout: () => void
  generate: () => void
  regenerate: () => void
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
      const startISO = s.trialStartISO ?? new Date().toISOString()
      const trial = computeTrial(startISO)
      const seed = Math.floor(Math.random() * 1e9)
      const { meals } = generatePlan(s.onboarding, trial.planDays, { seed })
      return { ...s, plan: meals, planSeed: seed, trialStartISO: startISO, checked: {} }
    })
  }, [])

  const regenerate = useCallback(() => {
    setState((s) => {
      if (!s.trialStartISO) return s
      const trial = computeTrial(s.trialStartISO)
      const seed = Math.floor(Math.random() * 1e9)
      const { meals } = generatePlan(s.onboarding, trial.planDays, { seed })
      return { ...s, plan: meals, planSeed: seed, checked: {} }
    })
  }, [])

  const swapMeal = useCallback((dayIndex: number, mealType: string, newRecipeId: string) => {
    setState((s) => {
      if (!s.plan) return s
      const plan = s.plan.map((m) =>
        m.dayIndex === dayIndex && m.mealType === mealType ? { ...m, recipeId: newRecipeId } : m,
      )
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

  const value: AppContextValue = {
    state,
    lang: state.lang,
    t,
    setLang,
    updateOnboarding,
    register,
    login,
    logout,
    generate,
    regenerate,
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
