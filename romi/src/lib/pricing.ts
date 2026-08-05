import type { Ingredient, Recipe, Store } from '../data/types'
import { ingredientMap } from '../data/ingredients'

/** Cost in MAD of a quantity of an ingredient (in its own unit), before store multiplier. */
export function ingredientCost(ing: Ingredient, qty: number): number {
  switch (ing.unit) {
    case 'g':
      return (qty / 1000) * ing.basePrice // basePrice per kg
    case 'ml':
      return (qty / 1000) * ing.basePrice // basePrice per litre
    case 'piece':
      return qty * ing.basePrice
  }
}

export interface PricedLine {
  /** MAD, store-adjusted, for what you actually have to buy */
  price: number
  /** number of packs bought (soldBy 'pack') */
  packs?: number
  /** number of whole pieces bought (soldBy 'piece') */
  pieces?: number
  /** the quantity actually bought (packs×packSize, pieces, or exact grams) */
  boughtQty: number
}

/**
 * Real shopping cost of one aggregated ingredient line. Packs/pots/cans are
 * billed as whole units (so a recipe needing 20 g of oats still costs a full
 * packet); loose weight is billed to the gram; pieces are rounded up.
 */
export function priceLine(ing: Ingredient, neededQty: number, store: Store): PricedLine {
  const m = store.multiplier
  if (ing.soldBy === 'pack' && ing.packSize) {
    const packs = Math.max(1, Math.ceil(neededQty / ing.packSize - 1e-9))
    return { price: packs * ingredientCost(ing, ing.packSize) * m, packs, boughtQty: packs * ing.packSize }
  }
  if (ing.soldBy === 'piece') {
    const pieces = Math.max(1, Math.ceil(neededQty - 1e-9))
    return { price: pieces * ing.basePrice * m, pieces, boughtQty: pieces }
  }
  // weight (g/ml), exact
  return { price: ingredientCost(ing, neededQty) * m, boughtQty: neededQty }
}

/**
 * Fallback cost in MAD for an ingredient not in our catalog.
 * Uses 50 MAD/kg as a generic food average so prices never show 0.
 */
function fallbackCost(qty: number): number {
  return (qty / 1000) * 50 // 50 MAD/kg average
}

/** Price per person for a recipe at a given store (portion estimate). */
export function recipePricePerPerson(recipe: Recipe, store: Store): number {
  let total = 0
  for (const ri of recipe.ingredients) {
    const ing = ingredientMap[ri.id]
    if (!ing) {
      // Unknown ingredient → use generic fallback so price is never 0
      total += fallbackCost(ri.qtyPerPerson)
      continue
    }
    total += ingredientCost(ing, ri.qtyPerPerson)
  }
  return total * store.multiplier
}

export function recipeTotalPrice(recipe: Recipe, store: Store, people: number): number {
  return recipePricePerPerson(recipe, store) * people
}

export const fmtMAD = (v: number, decimals = 2): string =>
  `${v.toFixed(decimals).replace('.', ',')} DH`

export const fmtMAD0 = (v: number): string => `${Math.round(v)} DH`
