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

export function buildShoppingList(meals: PlannedMeal[], o: OnboardingState): ShoppingGroup[] {
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

  // price each aggregated line with pack/piece/weight rules
  for (const item of acc.values()) {
    const ing = ingredientMap[item.ingredientId]!
    const line = priceLine(ing, item.qty, store)
    item.price = line.price
    item.packs = line.packs
    item.pieces = line.pieces
  }

  const groups: ShoppingGroup[] = CATEGORY_ORDER.map((category) => ({
    category,
    items: [...acc.values()]
      .filter((i) => i.category === category)
      .sort((a, b) => b.price - a.price),
  })).filter((g) => g.items.length)

  return groups
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
