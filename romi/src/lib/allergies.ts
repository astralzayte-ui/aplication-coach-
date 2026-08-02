import type { Allergen } from '../data/types'
import { INGREDIENTS } from '../data/ingredients'

// Maps common free-text allergy words (FR/AR-ish) to our allergen categories.
const ALLERGEN_KEYWORDS: Record<Allergen, string[]> = {
  gluten: ['gluten', 'ble', 'blé', 'wheat', 'قمح', 'غلوتين'],
  lactose: ['lactose', 'lait', 'laitier', 'lactfor', 'حليب', 'لاكتوز'],
  oeuf: ['oeuf', 'œuf', 'oeufs', 'egg', 'بيض'],
  poisson: ['poisson', 'fish', 'thon', 'saumon', 'sardine', 'سمك', 'حوت'],
  crustace: ['crustace', 'crustacé', 'crevette', 'gamba', 'crabe', 'قشريات', 'روبيان'],
  fruits_coque: ['noix', 'amande', 'noisette', 'cajou', 'fruits a coque', 'fruits à coque', 'مكسرات', 'لوز'],
  soja: ['soja', 'soya', 'soja', 'صويا'],
  arachide: ['arachide', 'cacahuete', 'cacahuète', 'peanut', 'فول سوداني'],
}

const norm = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()

/**
 * Expands a free-text allergy into the set of ingredient ids to exclude:
 *  - direct ingredient-name matches
 *  - every ingredient carrying a matched allergen category
 */
export function expandAllergy(text: string): { ingredientIds: string[]; allergens: Allergen[] } {
  const t = norm(text)
  if (!t) return { ingredientIds: [], allergens: [] }
  const ids = new Set<string>()
  const allergens = new Set<Allergen>()

  // allergen keyword match
  for (const [al, words] of Object.entries(ALLERGEN_KEYWORDS) as [Allergen, string[]][]) {
    if (words.some((w) => t.includes(norm(w)))) allergens.add(al)
  }

  for (const ing of INGREDIENTS) {
    const nameFr = norm(ing.name.fr)
    const nameAr = ing.name.ar
    // name match either direction
    if (t.length >= 3 && (nameFr.includes(t) || t.includes(nameFr) || nameAr.includes(text.trim()))) {
      ids.add(ing.id)
    }
    // allergen match
    if (ing.allergens.some((a) => allergens.has(a))) ids.add(ing.id)
  }

  return { ingredientIds: [...ids], allergens: [...allergens] }
}
