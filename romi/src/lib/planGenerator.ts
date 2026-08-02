import type { MealType, OnboardingState, PlannedMeal, Recipe, Tag } from '../data/types'
import { RECIPES, recipeMap } from '../data/recipes'
import { ingredientMap } from '../data/ingredients'
import { getStore } from '../data/stores'
import { recipePricePerPerson } from './pricing'
import { buildShoppingList, shoppingTotal } from './shoppingList'

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
  const chosenPacks = new Set<string>() // pack ingredient ids already needed → reuse the same packs
  const usage: Record<string, number> = {} // how many times each recipe is already used

  for (let day = 0; day < planDays; day++) {
    const usedToday = new Set<string>() // never repeat a recipe within the same day
    for (const mealType of o.mealsPerDay) {
      const inPool = poolFor(mealType)
      let pool = eligible.filter((r) => inPool(r) && !avoid.has(r.id))
      if (!pool.length) pool = RECIPES.filter((r) => inPool(r)) // fallback so a slot is never empty

      const recent = recentByType[mealType] ?? []
      const scored = pool.map((r) => {
        const dayPenalty = usedToday.has(r.id) ? -100 : 0
        const recentPenalty = recent.includes(r.id) ? -6 : 0
        // strong variety penalty so no single recipe dominates the week
        const usagePenalty = -(usage[r.id] ?? 0) * 2.4
        // small reward for reusing a PACK already in the basket (real saving),
        // never for pieces/weight (that would just repeat dishes)
        const packReuse = r.ingredients.filter(
          (ri) => chosenPacks.has(ri.id) && ingredientMap[ri.id]?.soldBy === 'pack',
        ).length * 0.18
        const jitter = rng() * 0.8
        return { r, s: ambianceScore(r, o.ambiance) + packReuse + dayPenalty + recentPenalty + usagePenalty + jitter }
      })
      scored.sort((a, b) => b.s - a.s)
      const pick = scored[0].r

      meals.push({ dayIndex: day, mealType, recipeId: pick.id, people: o.people })
      usedToday.add(pick.id)
      usage[pick.id] = (usage[pick.id] ?? 0) + 1
      pick.ingredients.forEach((ri) => {
        if (ingredientMap[ri.id]?.soldBy === 'pack') chosenPacks.add(ri.id)
      })
      recentByType[mealType] = [pick.id, ...recent].slice(0, 3)
    }
  }

  // 1) bring it under budget, then 2) use the budget (upgrade to premium dishes)
  const balanced = rebalance(meals, o, () => false)
  const filled = fillBudget(balanced, o)
  const totalCost = shoppingTotal(buildShoppingList(filled, o))
  return { meals: filled, overBudget: totalCost > o.budget, totalCost }
}

/**
 * Uses the available budget: while well under it, upgrades the cheapest main
 * to a pricier eligible recipe (without exceeding budget and without creating
 * duplicates), so a 2000 DH budget yields premium dishes and a tight budget
 * stays modest.
 */
export function fillBudget(meals: PlannedMeal[], o: OnboardingState): PlannedMeal[] {
  const store = getStore(o.storeId)
  const target = o.budget
  const eligible = RECIPES.filter((r) => isEligible(r, o))
  const cost = (ms: PlannedMeal[]) => shoppingTotal(buildShoppingList(ms, o))
  const cur = meals.slice()
  let guard = 0
  while (cost(cur) < target * 0.9 && guard < 120) {
    guard++
    const slots = cur
      .map((m, i) => ({ m, i, r: recipeMap[m.recipeId] }))
      .filter((x) => x.r)
      .sort((a, b) => recipePricePerPerson(a.r!, store) - recipePricePerPerson(b.r!, store))
    let applied = false
    for (const slot of slots) {
      const inPool = poolFor(slot.m.mealType)
      const others = cur.filter((_, i) => i !== slot.i)
      let bestId: string | null = null
      let bestCost = cost(cur)
      for (const r of eligible) {
        if (!inPool(r) || r.id === slot.m.recipeId) continue
        if (others.some((mm) => mm.dayIndex === slot.m.dayIndex && mm.recipeId === r.id)) continue // no same-day dup
        const c = cost([...others, { ...slot.m, recipeId: r.id }])
        if (c <= target && c > bestCost) { bestCost = c; bestId = r.id }
      }
      if (bestId) { cur[slot.i] = { ...slot.m, recipeId: bestId }; applied = true; break }
    }
    if (!applied) break
  }
  return cur
}

/**
 * Brings a plan's real (pack-based) shopping total under budget by swapping
 * the priciest non-kept main for the eligible recipe that minimises the total
 * — which naturally favours reusing packs already in the basket. `keep`
 * marks slots that must not change (e.g. a dish the user just picked).
 */
export function rebalance(
  meals: PlannedMeal[],
  o: OnboardingState,
  keep: (m: PlannedMeal) => boolean,
): PlannedMeal[] {
  const store = getStore(o.storeId)
  const eligible = RECIPES.filter((r) => isEligible(r, o))
  const cost = (ms: PlannedMeal[]) => shoppingTotal(buildShoppingList(ms, o))
  const cur = meals.slice()
  let guard = 0
  while (cost(cur) > o.budget && guard < 120) {
    guard++
    // consider EVERY meal (breakfasts & snacks included) so we can always
    // drive the total down; swap the priciest one for the cheapest option.
    const swappable = cur
      .map((m, i) => ({ m, i, r: recipeMap[m.recipeId] }))
      .filter((x) => x.r && !keep(x.m))
      .sort((a, b) => recipePricePerPerson(b.r!, store) - recipePricePerPerson(a.r!, store))
    if (!swappable.length) break
    let improved = false
    for (const target of swappable) {
      const inPool = poolFor(target.m.mealType)
      const others = cur.filter((_, i) => i !== target.i)
      let bestId: string | null = null
      let bestCost = cost(cur)
      for (const r of eligible) {
        if (!inPool(r) || r.id === target.m.recipeId) continue
        // only avoid duplicates within the SAME DAY (week-wide repeats are fine
        // and often necessary to hit a tight budget)
        if (others.some((mm) => mm.dayIndex === target.m.dayIndex && mm.recipeId === r.id)) continue
        const c = cost([...others, { ...target.m, recipeId: r.id }])
        if (c < bestCost) { bestCost = c; bestId = r.id }
      }
      if (bestId) { cur[target.i] = { ...target.m, recipeId: bestId }; improved = true; break }
    }
    if (!improved) break
  }
  return cur
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
