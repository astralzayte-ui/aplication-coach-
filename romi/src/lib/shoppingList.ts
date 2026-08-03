import type { IngredientCategory, Lang, Loc, OnboardingState, PlannedMeal, SoldBy } from '../data/types'
import { ingredientMap } from '../data/ingredients'
import { recipeMap } from '../data/recipes'
import { getStore } from '../data/stores'
import { priceLine, fmtMAD } from './pricing'

export interface ShoppingItem {
  ingredientId: string
  name: Loc
  emoji: string
  category: IngredientCategory
  qty: number // total quantity the recipes need
  unit: 'g' | 'ml' | 'piece'
  gramsPerPiece?: number
  soldBy: SoldBy
  packSize?: number
  packs?: number
  pieces?: number
  price: number // MAD, store-adjusted, for whole packs/pieces/exact weight
  usedIn: Loc[] // recipe names that need this ingredient
}

export interface ShoppingGroup {
  category: IngredientCategory
  items: ShoppingItem[]
}

export const CATEGORY_LABELS: Record<IngredientCategory, Loc> = {
  viande_poisson: { fr: 'Viande & poisson', ar: 'لحوم وأسماك' },
  fruits_legumes: { fr: 'Fruits & légumes', ar: 'خضر وفواكه' },
  cremerie: { fr: 'Crèmerie', ar: 'مشتقات الحليب' },
  epicerie: { fr: 'Épicerie', ar: 'بقالة' },
  boulangerie: { fr: 'Boulangerie', ar: 'مخبزة' },
  epices: { fr: 'Épices', ar: 'توابل' },
}

const CATEGORY_ORDER: IngredientCategory[] = [
  'viande_poisson', 'fruits_legumes', 'cremerie', 'epicerie', 'boulangerie', 'epices',
]

export function buildShoppingList(
  meals: PlannedMeal[],
  o: OnboardingState,
  pantry?: Record<string, number>,
): ShoppingGroup[] {
  const store = getStore(o.storeId)
  const acc = new Map<string, ShoppingItem>()

  for (const m of meals) {
    const recipe = recipeMap[m.recipeId]
    if (!recipe) continue
    for (const ri of recipe.ingredients) {
      const ing = ingredientMap[ri.id]
      if (!ing) continue
      const qty = ri.qtyPerPerson * m.people
      const existing = acc.get(ing.id)
      if (existing) {
        existing.qty += qty
        if (!existing.usedIn.some((u) => u.fr === recipe.name.fr)) existing.usedIn.push(recipe.name)
      } else {
        acc.set(ing.id, {
          ingredientId: ing.id,
          name: ing.name,
          emoji: ing.emoji,
          category: ing.category,
          qty,
          unit: ing.unit,
          gramsPerPiece: ing.gramsPerPiece,
          soldBy: ing.soldBy,
          packSize: ing.packSize,
          price: 0,
          usedIn: [recipe.name],
        })
      }
    }
  }

  // price each aggregated line with pack/piece/weight rules, subtracting any
  // leftover stock carried over from a previous cycle (the "pantry").
  const buyable: ShoppingItem[] = []
  for (const item of acc.values()) {
    const ing = ingredientMap[item.ingredientId]!
    const available = pantry?.[item.ingredientId] ?? 0
    const toBuy = Math.max(0, item.qty - available)
    if (available > 0 && toBuy <= 0.0001) continue // fully covered by leftovers
    item.qty = toBuy > 0 ? toBuy : item.qty
    const line = priceLine(ing, item.qty, store)
    item.price = line.price
    item.packs = line.packs
    item.pieces = line.pieces
    buyable.push(item)
  }

  const groups: ShoppingGroup[] = CATEGORY_ORDER.map((category) => ({
    category,
    items: buyable.filter((i) => i.category === category).sort((a, b) => b.price - a.price),
  })).filter((g) => g.items.length)

  return groups
}

/**
 * Leftover stock after a cycle: for each ingredient, whatever whole packs /
 * pieces you had to buy beyond what the recipes used stays in the pantry for
 * next time (e.g. buy a 500 g bag, use 200 g → 300 g carried over). Weight
 * items are bought to the gram, so they leave nothing.
 */
export function computeLeftovers(
  meals: PlannedMeal[],
  o: OnboardingState,
  prev: Record<string, number> = {},
): Record<string, number> {
  const need = new Map<string, number>()
  for (const m of meals) {
    const r = recipeMap[m.recipeId]
    if (!r) continue
    for (const ri of r.ingredients) need.set(ri.id, (need.get(ri.id) ?? 0) + ri.qtyPerPerson * m.people)
  }
  const next: Record<string, number> = { ...prev }
  for (const [id, needed] of need) {
    const ing = ingredientMap[id]
    if (!ing) continue
    const available = prev[id] ?? 0
    const toBuy = Math.max(0, needed - available)
    let bought = toBuy
    if (ing.soldBy === 'pack' && ing.packSize) bought = Math.ceil(toBuy / ing.packSize - 1e-9) * ing.packSize
    else if (ing.soldBy === 'piece') bought = Math.ceil(toBuy - 1e-9)
    next[id] = Math.max(0, Math.round((available + bought - needed) * 100) / 100)
  }
  return next
}

export function shoppingTotal(groups: ShoppingGroup[]): number {
  return groups.reduce((s, g) => s + g.items.reduce((t, i) => t + i.price, 0), 0)
}

export function shoppingCount(groups: ShoppingGroup[]): number {
  return groups.reduce((s, g) => s + g.items.length, 0)
}

function fmtSize(unit: 'g' | 'ml' | 'piece', qty: number): string {
  const round1 = (n: number) => Math.round(n * 10) / 10
  if (unit === 'ml') return qty >= 1000 ? `${round1(qty / 1000)} L` : `${Math.round(qty)} ml`
  if (unit === 'g') return qty >= 1000 ? `${round1(qty / 1000)} kg` : `${Math.round(qty)} g`
  return `${round1(qty)}`
}

/**
 * What to buy, e.g. "1 × 500 g" for a packet, "3 pièces · ~360 g" for produce,
 * "480 g" for loose weight.
 */
export function qtyLabel(item: ShoppingItem, lang: Lang): string {
  if (item.soldBy === 'pack' && item.packSize && item.packs) {
    return `${item.packs} × ${fmtSize(item.unit, item.packSize)}`
  }
  if (item.soldBy === 'piece') {
    const pieces = item.pieces ?? Math.ceil(item.qty)
    const grams = item.gramsPerPiece ? Math.round(pieces * item.gramsPerPiece) : 0
    const pieceWord = lang === 'ar' ? 'وحدة' : pieces > 1 ? 'pièces' : 'pièce'
    return grams ? `${pieces} ${pieceWord} · ~${grams} g` : `${pieces} ${pieceWord}`
  }
  return fmtSize(item.unit, item.qty)
}

/** Plain-text version for sharing (WhatsApp, etc.). */
export function shoppingListToText(groups: ShoppingGroup[], lang: Lang, storeName: string): string {
  const lines: string[] = []
  lines.push(lang === 'ar' ? `🛒 لائحة المشتريات — ${storeName}` : `🛒 Liste de courses — ${storeName}`)
  lines.push('')
  for (const g of groups) {
    lines.push(`— ${CATEGORY_LABELS[g.category][lang]} —`)
    for (const i of g.items) {
      lines.push(`• ${i.name[lang]} (${qtyLabel(i, lang)}) — ${fmtMAD(i.price)}`)
    }
    lines.push('')
  }
  lines.push(`Total ≈ ${fmtMAD(shoppingTotal(groups))}`)
  lines.push('Romi 🥗')
  return lines.join('\n')
}
