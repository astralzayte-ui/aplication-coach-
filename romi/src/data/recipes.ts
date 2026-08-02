import type { Recipe } from './types'

// Per-person quantities. Price & final macros are derived at runtime from
// ingredients × servings × store multiplier. `mealType` buckets:
//  - petit_dejeuner   → breakfast pool
//  - dejeuner | diner → shared "mains" pool (lunch & dinner)
//  - gouter           → snack pool (used for casse_croute / gouter / encas)
export const RECIPES: Recipe[] = [
  {
    id: 'poulet_creme_tomate',
    name: { fr: 'Poulet crémeux à la tomate', ar: 'دجاج كريمي بالطماطم' },
    emoji: '🍛', mealType: 'diner', tags: ['rapide', 'gourmand'], timeMin: 25,
    kcal: 520, protein: 35, carbs: 55, fat: 16,
    ingredients: [
      { id: 'poulet', qtyPerPerson: 133 }, { id: 'creme', qtyPerPerson: 40 },
      { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'riz', qtyPerPerson: 70 },
      { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 },
      { id: 'huile_olive', qtyPerPerson: 5 }, { id: 'coriandre', qtyPerPerson: 0.3 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'kefta_frites',
    name: { fr: 'Kefta & frites maison', ar: 'كفتة وبطاطس' },
    emoji: '🍖', mealType: 'diner', tags: ['rapide', 'du_monde', 'famille'], timeMin: 25,
    kcal: 560, protein: 30, carbs: 45, fat: 28,
    ingredients: [
      { id: 'viande_hachee', qtyPerPerson: 125 }, { id: 'pomme_terre', qtyPerPerson: 220 },
      { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'cumin', qtyPerPerson: 2 },
      { id: 'tomate', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 10 },
    ],
    equipment: ['plaque', 'four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'bowl_thai',
    name: { fr: 'Bowl thaï poulet & quinoa', ar: 'بول تايلاندي بالدجاج والكينوا' },
    emoji: '🥗', mealType: 'diner', tags: ['du_monde', 'proteine', 'healthy'], timeMin: 30,
    kcal: 430, protein: 32, carbs: 48, fat: 12,
    ingredients: [
      { id: 'poulet', qtyPerPerson: 100 }, { id: 'quinoa', qtyPerPerson: 60 },
      { id: 'chou_rouge', qtyPerPerson: 50 }, { id: 'carotte', qtyPerPerson: 1 },
      { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'sauce_soja', qtyPerPerson: 10 },
      { id: 'coriandre', qtyPerPerson: 0.3 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'gnocchi_courge_brie',
    name: { fr: 'Gnocchis de courge & brie', ar: 'نيوكي القرع والجبن' },
    emoji: '🥟', mealType: 'diner', tags: ['gourmand', 'healthy', 'vegetarien'], timeMin: 50,
    kcal: 520, protein: 14, carbs: 60, fat: 22,
    ingredients: [
      { id: 'gnocchi', qtyPerPerson: 150 }, { id: 'courge', qtyPerPerson: 120 },
      { id: 'brie', qtyPerPerson: 40 }, { id: 'creme', qtyPerPerson: 20 },
      { id: 'epinard', qtyPerPerson: 40 },
    ],
    equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'saumon_riz',
    name: { fr: 'Saumon rôti & riz citronné', ar: 'سلمون مشوي وأرز بالليمون' },
    emoji: '🍣', mealType: 'diner', tags: ['healthy', 'proteine'], timeMin: 30,
    kcal: 500, protein: 34, carbs: 45, fat: 20,
    ingredients: [
      { id: 'saumon', qtyPerPerson: 130 }, { id: 'riz', qtyPerPerson: 70 },
      { id: 'citron', qtyPerPerson: 0.5 }, { id: 'courgette', qtyPerPerson: 1 },
      { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['four'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'curry_pois_chiche',
    name: { fr: 'Curry de pois chiches au coco', ar: 'كاري الحمص بحليب جوز الهند' },
    emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 30,
    kcal: 480, protein: 18, carbs: 62, fat: 16,
    ingredients: [
      { id: 'pois_chiche', qtyPerPerson: 120 }, { id: 'lait_coco', qtyPerPerson: 80 },
      { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'oignon', qtyPerPerson: 0.5 },
      { id: 'curry', qtyPerPerson: 3 }, { id: 'riz', qtyPerPerson: 70 },
      { id: 'epinard', qtyPerPerson: 40 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'pates_bolo',
    name: { fr: 'Pâtes à la bolognaise', ar: 'معكرونة بولونيز' },
    emoji: '🍝', mealType: 'diner', tags: ['rapide', 'famille', 'gourmand'], timeMin: 25,
    kcal: 560, protein: 28, carbs: 65, fat: 18,
    ingredients: [
      { id: 'pates', qtyPerPerson: 90 }, { id: 'viande_hachee', qtyPerPerson: 100 },
      { id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'oignon', qtyPerPerson: 0.5 },
      { id: 'ail', qtyPerPerson: 1 }, { id: 'parmesan', qtyPerPerson: 15 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'tajine_poulet',
    name: { fr: 'Tajine de poulet aux légumes', ar: 'طاجين الدجاج بالخضر' },
    emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'famille', 'healthy'], timeMin: 50,
    kcal: 430, protein: 30, carbs: 40, fat: 15,
    ingredients: [
      { id: 'poulet', qtyPerPerson: 130 }, { id: 'carotte', qtyPerPerson: 2 },
      { id: 'courgette', qtyPerPerson: 1 }, { id: 'pomme_terre', qtyPerPerson: 150 },
      { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'cumin', qtyPerPerson: 2 },
      { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['plaque', 'mijoteuse'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'lentilles_mijotees',
    name: { fr: 'Lentilles mijotées aux carottes', ar: 'عدس بالجزر' },
    emoji: '🍲', mealType: 'diner', tags: ['healthy', 'vegetarien', 'famille'], timeMin: 40,
    kcal: 380, protein: 20, carbs: 55, fat: 8,
    ingredients: [
      { id: 'lentilles', qtyPerPerson: 90 }, { id: 'carotte', qtyPerPerson: 2 },
      { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'tomate_concassee', qtyPerPerson: 80 },
      { id: 'cumin', qtyPerPerson: 2 }, { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['mijoteuse', 'plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'air_fryer_poulet',
    name: { fr: 'Poulet croustillant air fryer', ar: 'دجاج مقرمش بالقلاية الهوائية' },
    emoji: '🍗', mealType: 'diner', tags: ['rapide', 'proteine'], timeMin: 30,
    kcal: 470, protein: 34, carbs: 42, fat: 16,
    ingredients: [
      { id: 'poulet', qtyPerPerson: 130 }, { id: 'pomme_terre', qtyPerPerson: 200 },
      { id: 'paprika', qtyPerPerson: 2 }, { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['air_fryer'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'sardines_grillees',
    name: { fr: 'Sardines grillées & salade', ar: 'سردين مشوي وسلطة' },
    emoji: '🐟', mealType: 'diner', tags: ['du_monde', 'proteine', 'healthy'], timeMin: 20,
    kcal: 400, protein: 30, carbs: 20, fat: 22,
    ingredients: [
      { id: 'sardines', qtyPerPerson: 150 }, { id: 'salade', qtyPerPerson: 0.3 },
      { id: 'tomate', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 },
      { id: 'huile_olive', qtyPerPerson: 8 }, { id: 'pain', qtyPerPerson: 1 },
    ],
    equipment: ['grill'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'omelette_legumes',
    name: { fr: 'Omelette aux légumes', ar: 'أومليت بالخضر' },
    emoji: '🍳', mealType: 'dejeuner', tags: ['rapide', 'proteine', 'vegetarien'], timeMin: 15,
    kcal: 300, protein: 22, carbs: 8, fat: 20,
    ingredients: [
      { id: 'oeuf', qtyPerPerson: 3 }, { id: 'poivron', qtyPerPerson: 0.5 },
      { id: 'tomate', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 },
      { id: 'huile_olive', qtyPerPerson: 5 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'wrap_poulet',
    name: { fr: 'Wrap poulet avocat', ar: 'راب الدجاج والأفوكادو' },
    emoji: '🌯', mealType: 'dejeuner', tags: ['rapide', 'du_monde'], timeMin: 15,
    kcal: 480, protein: 30, carbs: 40, fat: 22,
    ingredients: [
      { id: 'tortilla', qtyPerPerson: 1.5 }, { id: 'poulet', qtyPerPerson: 100 },
      { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'salade', qtyPerPerson: 0.3 },
      { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'yaourt', qtyPerPerson: 0.3 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'salade_quinoa',
    name: { fr: 'Salade quinoa healthy', ar: 'سلطة الكينوا' },
    emoji: '🥗', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'rapide'], timeMin: 20,
    kcal: 420, protein: 16, carbs: 55, fat: 14,
    ingredients: [
      { id: 'quinoa', qtyPerPerson: 70 }, { id: 'pois_chiche', qtyPerPerson: 60 },
      { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 1 },
      { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 8 },
      { id: 'coriandre', qtyPerPerson: 0.3 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'oeufs_mimosa_thon',
    name: { fr: 'Œufs mimosa au thon', ar: 'بيض ميموزا بالتونة' },
    emoji: '🥚', mealType: 'dejeuner', tags: ['proteine', 'healthy'], timeMin: 25,
    kcal: 220, protein: 18, carbs: 4, fat: 14,
    ingredients: [
      { id: 'oeuf', qtyPerPerson: 2 }, { id: 'thon', qtyPerPerson: 28 },
      { id: 'fromage_frais', qtyPerPerson: 20 }, { id: 'citron', qtyPerPerson: 0.3 },
      { id: 'salade', qtyPerPerson: 0.2 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'croque_tartine_sardines',
    name: { fr: 'Croque-tartine aux sardines', ar: 'خبز محمص بالسردين' },
    emoji: '🥪', mealType: 'dejeuner', tags: ['rapide', 'healthy'], timeMin: 12,
    kcal: 360, protein: 22, carbs: 30, fat: 16,
    ingredients: [
      { id: 'pain', qtyPerPerson: 2 }, { id: 'sardines', qtyPerPerson: 60 },
      { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'fromage_frais', qtyPerPerson: 20 },
      { id: 'salade', qtyPerPerson: 0.2 },
    ],
    equipment: ['four', 'plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'porridge_banane',
    name: { fr: 'Porridge avoine, banane & miel', ar: 'شوفان بالموز والعسل' },
    emoji: '🥣', mealType: 'petit_dejeuner', tags: ['healthy', 'gourmand'], timeMin: 10,
    kcal: 400, protein: 14, carbs: 60, fat: 12,
    ingredients: [
      { id: 'flocons_avoine', qtyPerPerson: 60 }, { id: 'lait', qtyPerPerson: 200 },
      { id: 'banane', qtyPerPerson: 1 }, { id: 'miel', qtyPerPerson: 10 },
      { id: 'amandes', qtyPerPerson: 15 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'oeufs_brouilles',
    name: { fr: 'Œufs brouillés & pain', ar: 'بيض مخفوق وخبز' },
    emoji: '🍳', mealType: 'petit_dejeuner', tags: ['rapide', 'proteine'], timeMin: 10,
    kcal: 360, protein: 20, carbs: 25, fat: 20,
    ingredients: [
      { id: 'oeuf', qtyPerPerson: 3 }, { id: 'pain', qtyPerPerson: 1.5 },
      { id: 'beurre', qtyPerPerson: 10 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'tartine_avocat',
    name: { fr: 'Tartine avocat & œuf', ar: 'خبز بالأفوكادو والبيض' },
    emoji: '🥑', mealType: 'petit_dejeuner', tags: ['healthy', 'du_monde'], timeMin: 10,
    kcal: 380, protein: 16, carbs: 30, fat: 22,
    ingredients: [
      { id: 'pain', qtyPerPerson: 2 }, { id: 'avocat', qtyPerPerson: 0.5 },
      { id: 'oeuf', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.2 },
      { id: 'huile_olive', qtyPerPerson: 3 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'bowl_yaourt_fruits',
    name: { fr: 'Bowl yaourt, pomme & amandes', ar: 'زبادي بالتفاح واللوز' },
    emoji: '🥛', mealType: 'petit_dejeuner', tags: ['healthy', 'rapide'], timeMin: 5,
    kcal: 350, protein: 14, carbs: 45, fat: 12,
    ingredients: [
      { id: 'yaourt', qtyPerPerson: 2 }, { id: 'pomme', qtyPerPerson: 1 },
      { id: 'amandes', qtyPerPerson: 20 }, { id: 'miel', qtyPerPerson: 10 },
      { id: 'flocons_avoine', qtyPerPerson: 20 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'tartine_miel',
    name: { fr: 'Tartine beurre & miel', ar: 'خبز بالزبدة والعسل' },
    emoji: '🍯', mealType: 'gouter', tags: ['rapide', 'gourmand'], timeMin: 5,
    kcal: 300, protein: 6, carbs: 45, fat: 10,
    ingredients: [
      { id: 'pain', qtyPerPerson: 2 }, { id: 'beurre', qtyPerPerson: 10 },
      { id: 'miel', qtyPerPerson: 15 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'pomme_amandes',
    name: { fr: 'Pomme & amandes', ar: 'تفاح ولوز' },
    emoji: '🍎', mealType: 'gouter', tags: ['healthy', 'rapide'], timeMin: 2,
    kcal: 240, protein: 6, carbs: 22, fat: 15,
    ingredients: [
      { id: 'pomme', qtyPerPerson: 1 }, { id: 'amandes', qtyPerPerson: 25 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'smoothie_banane',
    name: { fr: 'Smoothie banane & avoine', ar: 'سموذي الموز والشوفان' },
    emoji: '🥤', mealType: 'gouter', tags: ['rapide', 'gourmand'], timeMin: 5,
    kcal: 280, protein: 10, carbs: 45, fat: 6,
    ingredients: [
      { id: 'banane', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 200 },
      { id: 'miel', qtyPerPerson: 10 }, { id: 'flocons_avoine', qtyPerPerson: 20 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'houmous_legumes',
    name: { fr: 'Houmous & bâtonnets de légumes', ar: 'حمص وأصابع الخضر' },
    emoji: '🥕', mealType: 'gouter', tags: ['healthy', 'vegetarien'], timeMin: 10,
    kcal: 300, protein: 12, carbs: 30, fat: 16,
    ingredients: [
      { id: 'pois_chiche', qtyPerPerson: 80 }, { id: 'huile_olive', qtyPerPerson: 10 },
      { id: 'citron', qtyPerPerson: 0.3 }, { id: 'carotte', qtyPerPerson: 1 },
      { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'cumin', qtyPerPerson: 1 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
]

export const recipeMap: Record<string, Recipe> = Object.fromEntries(
  RECIPES.map((r) => [r.id, r]),
)
export const getRecipe = (id: string): Recipe | undefined => recipeMap[id]
