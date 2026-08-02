import type { IngredientCategory, Lang, Loc, OnboardingState, PlannedMeal } from '../data/types'
import { ingredientMap } from '../data/ingredients'
import { recipeMap } from '../data/recipes'
import { getStore } from '../data/stores'
import { ingredientCost, fmtMAD } from './pricing'

export interface ShoppingItem {
  ingredientId: string
  name: Loc
  emoji: string
  category: IngredientCategory
  qty: number
  unit: 'g' | 'ml' | 'piece'
  gramsPerPiece?: number
  price: number // MAD, store-adjusted
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
          price: 0,
          usedIn: [recipe.name],
        })
      }
    }
  }

  // price each aggregated line
  for (const item of acc.values()) {
    const ing = ingredientMap[item.ingredientId]!
    item.price = ingredientCost(ing, item.qty) * store.multiplier
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

/** Human quantity label, e.g. "496 g", "1 pièce · ~300 g", "0,2 L". */
export function qtyLabel(item: ShoppingItem, lang: Lang): string {
  const round1 = (n: number) => Math.round(n * 10) / 10
  if (item.unit === 'piece') {
    const pieces = round1(item.qty)
    const grams = item.gramsPerPiece ? Math.round(item.qty * item.gramsPerPiece) : 0
    const pieceWord = lang === 'ar' ? 'وحدة' : 'pièce'
    return grams ? `${pieces} ${pieceWord} · ~${grams} g` : `${pieces} ${pieceWord}`
  }
  if (item.unit === 'ml') {
    if (item.qty >= 1000) return `${round1(item.qty / 1000)} L`
    return `${Math.round(item.qty)} ml`
  }
  // grams
  if (item.qty >= 1000) return `${round1(item.qty / 1000)} kg`
  return `${Math.round(item.qty)} g`
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
