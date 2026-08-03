// ---- Core domain types for Romi ----

export type Lang = 'fr' | 'ar'

export type Loc = { fr: string; ar: string }

export type IngredientCategory =
  | 'viande_poisson'
  | 'fruits_legumes'
  | 'cremerie'
  | 'epicerie'
  | 'boulangerie'
  | 'epices'

export type Allergen =
  | 'gluten'
  | 'lactose'
  | 'oeuf'
  | 'poisson'
  | 'crustace'
  | 'fruits_coque'
  | 'soja'
  | 'arachide'

export type Unit = 'g' | 'piece' | 'ml'

/**
 * How the item is actually bought in store — drives realistic pricing:
 *  - 'weight': sold loose by weight (meat, fresh fish, some veg) → pay for the exact grams
 *  - 'piece' : sold per unit (eggs, most produce) → round up to whole pieces
 *  - 'pack'  : sold in a fixed package/pot/can (oats, sauces, oil, spices…) →
 *              you buy whole packs, so the full pack price counts in the budget
 */
export type SoldBy = 'weight' | 'piece' | 'pack'

export interface Ingredient {
  id: string
  name: Loc
  emoji: string
  category: IngredientCategory
  unit: Unit
  /** Base price in MAD per kg (for `g`), per litre (for `ml`) or per piece (for `piece`). */
  basePrice: number
  /** ~grams per piece, for piece-based produce shown as "1 pièce · ~300 g". */
  gramsPerPiece?: number
  soldBy: SoldBy
  /** For soldBy 'pack': the package size in the ingredient's own unit (g/ml/piece). */
  packSize?: number
  allergens: Allergen[]
}

export type MealType =
  | 'petit_dejeuner'
  | 'casse_croute'
  | 'dejeuner'
  | 'gouter'
  | 'diner'
  | 'encas'

export type Tag =
  | 'rapide'
  | 'proteine'
  | 'healthy'
  | 'du_monde'
  | 'gourmand'
  | 'famille'
  | 'vegetarien'

export type Equipment = 'four' | 'plaque' | 'air_fryer' | 'grill' | 'mijoteuse'

export interface RecipeIngredient {
  id: string
  /** quantity per person, expressed in the ingredient's unit */
  qtyPerPerson: number
}

export interface Recipe {
  id: string
  name: Loc
  emoji: string
  mealType: MealType
  tags: Tag[]
  timeMin: number
  /** per person */
  kcal: number
  protein: number
  carbs: number
  fat: number
  ingredients: RecipeIngredient[]
  equipment: Equipment[]
  vegetarian: boolean
  pescetarian: boolean
  glutenFree: boolean
  lactoseFree: boolean
  /** true when suitable for pregnancy (no raw fish / alcohol / high-mercury etc.) */
  pregnancySafe: boolean
  /** Real cooking steps, shown under the ingredients (bilingual). */
  steps?: Loc[]
  /** Optional photo slug; when an image `public/plats/<image>.jpg` exists it is
   *  used, otherwise the emoji tile is shown. Defaults to the recipe id. */
  image?: string
}

export interface Store {
  id: string
  name: string
  bg: string
  fg: string
  /** price multiplier relative to reference basket */
  multiplier: number
}

// ---- User / onboarding state ----

export interface Allergy {
  /** free text the user typed */
  label: string
  /** matched ingredient ids to exclude, if any */
  ingredientIds: string[]
}

export interface OnboardingState {
  phone: string
  password: string
  storeId: string | null
  budget: number // MAD for the chosen duration
  durationWeeks: number // 1..4 — length of the cycle the budget & plan cover
  reuseLeftovers: boolean // carry pack leftovers (e.g. 100 g of pasta) to the next cycle
  people: number
  ambiance: Tag[] // up to 3
  diets: string[] // 'aucun' | 'vegetarien' | 'pescetarien' | 'sans_gluten' | 'sans_lactose' | 'enceinte'
  allergies: Allergy[]
  equipment: Equipment[]
  mealsPerDay: MealType[]
}

export interface PlannedMeal {
  dayIndex: number // 0 = first day of the plan
  mealType: MealType
  recipeId: string
  people: number
}

export interface WeekPlan {
  weekOffset: number // 0 = current week
  meals: PlannedMeal[]
  locked: boolean
}
