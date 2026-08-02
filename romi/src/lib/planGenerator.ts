import type { MealType, OnboardingState, PlannedMeal, Recipe, Tag } from '../data/types'
import { RECIPES } from '../data/recipes'
import { getStore } from '../data/stores'
import { recipePricePerPerson } from './pricing'

// --- deterministic RNG so a given seed reproduces a plan ---
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Which recipe pool serves a requested meal slot. */
export function poolFor(mealType: MealType): (r: Recipe) => boolean {
  switch (mealType) {
    case 'petit_dejeuner':
      return (r) => r.mealType === 'petit_dejeuner'
    case 'dejeuner':
    case 'diner':
      return (r) => r.mealType === 'dejeuner' || r.mealType === 'diner'
    case 'casse_croute':
    case 'gouter':
    case 'encas':
      return (r) => r.mealType === 'gouter'
  }
}

/** Does a recipe satisfy diet + allergy + equipment constraints? */
export function isEligible(r: Recipe, o: OnboardingState): boolean {
  const diets = o.diets
  if (diets.includes('vegetarien') && !r.vegetarian) return false
  if (diets.includes('pescetarien') && !r.pescetarian) return false
  if (diets.includes('sans_gluten') && !r.glutenFree) return false
  if (diets.includes('sans_lactose') && !r.lactoseFree) return false
  if (diets.includes('enceinte') && !r.pregnancySafe) return false

  // equipment: every required appliance must be owned (empty = always ok)
  const equip = o.equipment
  if (r.equipment.length && !r.equipment.every((e) => equip.includes(e))) return false

  // allergies: exclude any recipe using an excluded ingredient
  const excluded = new Set(o.allergies.flatMap((a) => a.ingredientIds))
  if (excluded.size && r.ingredients.some((ri) => excluded.has(ri.id))) return false

  return true
}

function ambianceScore(r: Recipe, ambiance: Tag[]): number {
  if (!ambiance.length) return 0
  return r.tags.filter((t) => ambiance.includes(t)).length
}

interface GenOptions {
  seed?: number
  /** recipe ids to avoid (e.g. when swapping) */
  avoid?: string[]
}

export interface GenResult {
  meals: PlannedMeal[]
  overBudget: boolean
  totalCost: number
}

/**
 * Builds a plan for `planDays` days covering the selected meal types,
 * respecting diet/allergy/equipment, favouring the chosen ambiance and
 * trying to stay under the weekly budget.
 */
export function generatePlan(o: OnboardingState, planDays: number, opts: GenOptions = {}): GenResult {
  const rng = mulberry32(opts.seed ?? Date.now() % 1e9)
  const store = getStore(o.storeId)
  const avoid = new Set(opts.avoid ?? [])
  const eligible = RECIPES.filter((r) => isEligible(r, o))

  const meals: PlannedMeal[] = []
  const recentByType: Record<string, string[]> = {}

  for (let day = 0; day < planDays; day++) {
    for (const mealType of o.mealsPerDay) {
      const inPool = poolFor(mealType)
      let pool = eligible.filter((r) => inPool(r) && !avoid.has(r.id))
      if (!pool.length) pool = RECIPES.filter((r) => inPool(r)) // fallback so a slot is never empty

      const recent = recentByType[mealType] ?? []
      const scored = pool.map((r) => {
        const repeatPenalty = recent.includes(r.id) ? -3 : 0
        const jitter = rng() * 0.9
        return { r, s: ambianceScore(r, o.ambiance) + repeatPenalty + jitter }
      })
      scored.sort((a, b) => b.s - a.s)
      const pick = scored[0].r

      meals.push({ dayIndex: day, mealType, recipeId: pick.id, people: o.people })
      recentByType[mealType] = [pick.id, ...recent].slice(0, 2)
    }
  }

  // budget pass: while over budget, swap the priciest "main" for a cheaper eligible one
  const cost = () => totalPlanCost(meals, o)
  let guard = 0
  while (cost() > o.budget && guard < 30) {
    guard++
    const mains = meals
      .map((m, i) => ({ m, i, r: RECIPES.find((x) => x.id === m.recipeId)! }))
      .filter((x) => x.r.mealType === 'diner' || x.r.mealType === 'dejeuner')
      .sort((a, b) => recipePricePerPerson(b.r, store) - recipePricePerPerson(a.r, store))
    if (!mains.length) break
    const target = mains[0]
    const inPool = poolFor(target.m.mealType)
    const cheaper = eligible
      .filter((r) => inPool(r) && r.id !== target.r.id)
      .sort((a, b) => recipePricePerPerson(a, store) - recipePricePerPerson(b, store))[0]
    if (!cheaper || recipePricePerPerson(cheaper, store) >= recipePricePerPerson(target.r, store)) break
    meals[target.i] = { ...target.m, recipeId: cheaper.id }
  }

  const totalCost = cost()
  return { meals, overBudget: totalCost > o.budget, totalCost }
}

export function totalPlanCost(meals: PlannedMeal[], o: OnboardingState): number {
  const store = getStore(o.storeId)
  return meals.reduce((sum, m) => {
    const r = RECIPES.find((x) => x.id === m.recipeId)
    if (!r) return sum
    return sum + recipePricePerPerson(r, store) * m.people
  }, 0)
}

/** Candidate replacements for one meal slot (for the "Changer" button). */
export function alternativesFor(recipeId: string, o: OnboardingState): Recipe[] {
  const current = RECIPES.find((r) => r.id === recipeId)
  if (!current) return []
  const inPool = poolFor(current.mealType === 'gouter' ? 'gouter' : current.mealType === 'petit_dejeuner' ? 'petit_dejeuner' : 'diner')
  return RECIPES.filter((r) => r.id !== recipeId && inPool(r) && isEligible(r, o))
}

/** Suggests easy recipes you can cook from what's already in the fridge. */
export function fridgeSuggestions(haveIds: string[], o: OnboardingState): Recipe[] {
  if (!haveIds.length) return []
  const have = new Set(haveIds)
  return RECIPES.filter((r) => isEligible(r, o))
    .map((r) => {
      const matched = r.ingredients.filter((ri) => have.has(ri.id)).length
      const ratio = matched / r.ingredients.length
      return { r, matched, ratio }
    })
    .filter((x) => x.matched > 0)
    .sort((a, b) => b.ratio - a.ratio || a.r.timeMin - b.r.timeMin)
    .slice(0, 8)
    .map((x) => x.r)
}
