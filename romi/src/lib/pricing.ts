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

/** Price per person for a recipe at a given store. */
export function recipePricePerPerson(recipe: Recipe, store: Store): number {
  let total = 0
  for (const ri of recipe.ingredients) {
    const ing = ingredientMap[ri.id]
    if (!ing) continue
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
