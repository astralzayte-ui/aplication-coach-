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

  // ===== Premium mains (for higher budgets) =====
  {
    id: 'entrecote_frites', name: { fr: 'Entrecôte grillée & frites', ar: 'شريحة لحم مشوية وبطاطس' },
    emoji: '🥩', mealType: 'diner', tags: ['proteine', 'gourmand'], timeMin: 30,
    kcal: 720, protein: 42, carbs: 45, fat: 38,
    ingredients: [
      { id: 'entrecote', qtyPerPerson: 180 }, { id: 'pomme_terre', qtyPerPerson: 220 },
      { id: 'beurre', qtyPerPerson: 12 }, { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['grill', 'four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'crevettes_ail', name: { fr: "Crevettes à l'ail & riz", ar: 'قمرون بالثوم والأرز' },
    emoji: '🦐', mealType: 'diner', tags: ['du_monde', 'proteine', 'gourmand'], timeMin: 25,
    kcal: 480, protein: 34, carbs: 55, fat: 12,
    ingredients: [
      { id: 'crevettes', qtyPerPerson: 150 }, { id: 'riz', qtyPerPerson: 70 },
      { id: 'ail', qtyPerPerson: 2 }, { id: 'huile_olive', qtyPerPerson: 10 },
      { id: 'citron', qtyPerPerson: 0.5 }, { id: 'coriandre', qtyPerPerson: 0.3 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'poke_saumon', name: { fr: 'Poke bowl saumon avocat', ar: 'بوكي بول بالسلمون والأفوكادو' },
    emoji: '🍱', mealType: 'diner', tags: ['du_monde', 'healthy', 'proteine'], timeMin: 20,
    kcal: 560, protein: 30, carbs: 55, fat: 22,
    ingredients: [
      { id: 'saumon', qtyPerPerson: 120 }, { id: 'riz', qtyPerPerson: 70 },
      { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'concombre', qtyPerPerson: 0.3 },
      { id: 'sauce_soja', qtyPerPerson: 10 }, { id: 'chou_rouge', qtyPerPerson: 40 },
    ],
    equipment: [], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: false,
  },
  {
    id: 'dorade_four', name: { fr: 'Dorade rôtie & légumes', ar: 'قرب مشوي بالخضر' },
    emoji: '🐟', mealType: 'diner', tags: ['healthy', 'proteine'], timeMin: 35,
    kcal: 490, protein: 36, carbs: 30, fat: 22,
    ingredients: [
      { id: 'dorade', qtyPerPerson: 200 }, { id: 'courgette', qtyPerPerson: 1 },
      { id: 'tomate', qtyPerPerson: 1 }, { id: 'pomme_terre', qtyPerPerson: 150 },
      { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'citron', qtyPerPerson: 0.5 },
    ],
    equipment: ['four'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'tajine_agneau', name: { fr: "Tajine d'agneau aux amandes", ar: 'طاجين لحم باللوز' },
    emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'gourmand', 'famille'], timeMin: 70,
    kcal: 640, protein: 34, carbs: 35, fat: 38,
    ingredients: [
      { id: 'agneau', qtyPerPerson: 160 }, { id: 'oignon', qtyPerPerson: 1 },
      { id: 'carotte', qtyPerPerson: 1 }, { id: 'amandes', qtyPerPerson: 15 },
      { id: 'miel', qtyPerPerson: 10 }, { id: 'huile_olive', qtyPerPerson: 10 },
    ],
    equipment: ['mijoteuse', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'couscous_legumes', name: { fr: 'Couscous légumes & agneau', ar: 'كسكس بالخضر واللحم' },
    emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'famille', 'gourmand'], timeMin: 60,
    kcal: 620, protein: 30, carbs: 70, fat: 22,
    ingredients: [
      { id: 'agneau', qtyPerPerson: 120 }, { id: 'semoule', qtyPerPerson: 90 },
      { id: 'carotte', qtyPerPerson: 1 }, { id: 'courgette', qtyPerPerson: 1 },
      { id: 'pois_chiche', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 0.5 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'pates_saumon', name: { fr: 'Pâtes crémeuses au saumon', ar: 'معكرونة كريمية بالسلمون' },
    emoji: '🍝', mealType: 'diner', tags: ['gourmand', 'proteine'], timeMin: 25,
    kcal: 620, protein: 30, carbs: 65, fat: 24,
    ingredients: [
      { id: 'pates', qtyPerPerson: 90 }, { id: 'saumon', qtyPerPerson: 100 },
      { id: 'creme', qtyPerPerson: 40 }, { id: 'epinard', qtyPerPerson: 40 },
      { id: 'ail', qtyPerPerson: 1 }, { id: 'parmesan', qtyPerPerson: 10 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'risotto_champignons', name: { fr: 'Risotto aux champignons', ar: 'ريزوتو بالفطر' },
    emoji: '🍚', mealType: 'diner', tags: ['gourmand', 'vegetarien'], timeMin: 40,
    kcal: 560, protein: 14, carbs: 70, fat: 22,
    ingredients: [
      { id: 'riz', qtyPerPerson: 80 }, { id: 'champignon', qtyPerPerson: 120 },
      { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'parmesan', qtyPerPerson: 20 },
      { id: 'creme', qtyPerPerson: 20 }, { id: 'beurre', qtyPerPerson: 10 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'dinde_creme', name: { fr: 'Escalope de dinde à la crème', ar: 'إسكالوب الديك الرومي بالكريمة' },
    emoji: '🍗', mealType: 'diner', tags: ['proteine', 'rapide'], timeMin: 25,
    kcal: 520, protein: 38, carbs: 45, fat: 18,
    ingredients: [
      { id: 'dinde', qtyPerPerson: 130 }, { id: 'creme', qtyPerPerson: 40 },
      { id: 'champignon', qtyPerPerson: 80 }, { id: 'riz', qtyPerPerson: 70 },
      { id: 'oignon', qtyPerPerson: 0.5 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'burger_maison', name: { fr: 'Burger maison & frites', ar: 'برغر منزلي وبطاطس' },
    emoji: '🍔', mealType: 'diner', tags: ['gourmand', 'famille'], timeMin: 30,
    kcal: 720, protein: 34, carbs: 60, fat: 38,
    ingredients: [
      { id: 'viande_hachee', qtyPerPerson: 125 }, { id: 'pain_burger', qtyPerPerson: 1 },
      { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'salade', qtyPerPerson: 0.2 },
      { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'pomme_terre', qtyPerPerson: 180 },
    ],
    equipment: ['plaque', 'four'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'pizza_maison', name: { fr: 'Pizza maison légumes', ar: 'بيتزا منزلية بالخضر' },
    emoji: '🍕', mealType: 'diner', tags: ['gourmand', 'famille', 'vegetarien'], timeMin: 30,
    kcal: 620, protein: 22, carbs: 72, fat: 24,
    ingredients: [
      { id: 'pate_pizza', qtyPerPerson: 130 }, { id: 'tomate_concassee', qtyPerPerson: 80 },
      { id: 'mozzarella', qtyPerPerson: 60 }, { id: 'champignon', qtyPerPerson: 50 },
      { id: 'poivron', qtyPerPerson: 0.3 },
    ],
    equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'chili_con_carne', name: { fr: 'Chili con carne', ar: 'تشيلي كون كارني' },
    emoji: '🌶️', mealType: 'diner', tags: ['du_monde', 'famille', 'proteine'], timeMin: 40,
    kcal: 560, protein: 30, carbs: 62, fat: 18,
    ingredients: [
      { id: 'viande_hachee', qtyPerPerson: 100 }, { id: 'haricots_rouges', qtyPerPerson: 90 },
      { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'oignon', qtyPerPerson: 0.5 },
      { id: 'poivron', qtyPerPerson: 0.3 }, { id: 'riz', qtyPerPerson: 60 }, { id: 'cumin', qtyPerPerson: 2 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'buddha_bowl', name: { fr: 'Buddha bowl patate douce', ar: 'بودا بول بالبطاطا الحلوة' },
    emoji: '🥗', mealType: 'diner', tags: ['healthy', 'vegetarien'], timeMin: 35,
    kcal: 520, protein: 18, carbs: 65, fat: 18,
    ingredients: [
      { id: 'quinoa', qtyPerPerson: 70 }, { id: 'patate_douce', qtyPerPerson: 150 },
      { id: 'pois_chiche', qtyPerPerson: 60 }, { id: 'avocat', qtyPerPerson: 0.5 },
      { id: 'epinard', qtyPerPerson: 40 }, { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },

  // ===== Lunches =====
  {
    id: 'salade_cesar', name: { fr: 'Salade César au poulet', ar: 'سلطة سيزر بالدجاج' },
    emoji: '🥗', mealType: 'dejeuner', tags: ['proteine', 'gourmand'], timeMin: 20,
    kcal: 480, protein: 34, carbs: 25, fat: 26,
    ingredients: [
      { id: 'poulet', qtyPerPerson: 100 }, { id: 'salade', qtyPerPerson: 0.5 },
      { id: 'pain', qtyPerPerson: 1 }, { id: 'parmesan', qtyPerPerson: 15 },
      { id: 'oeuf', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'shakshuka', name: { fr: 'Shakshuka', ar: 'شكشوكة' },
    emoji: '🍳', mealType: 'dejeuner', tags: ['du_monde', 'vegetarien', 'proteine'], timeMin: 25,
    kcal: 380, protein: 20, carbs: 28, fat: 20,
    ingredients: [
      { id: 'oeuf', qtyPerPerson: 2 }, { id: 'tomate_concassee', qtyPerPerson: 120 },
      { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.5 },
      { id: 'cumin', qtyPerPerson: 2 }, { id: 'pain', qtyPerPerson: 1 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'soupe_legumes', name: { fr: 'Soupe de légumes maison', ar: 'شوربة الخضر' },
    emoji: '🥣', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'famille'], timeMin: 30,
    kcal: 260, protein: 8, carbs: 40, fat: 8,
    ingredients: [
      { id: 'carotte', qtyPerPerson: 2 }, { id: 'pomme_terre', qtyPerPerson: 150 },
      { id: 'courgette', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 1 },
      { id: 'ail', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 8 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },
  {
    id: 'wrap_veggie', name: { fr: 'Wrap veggie houmous', ar: 'راب نباتي بالحمص' },
    emoji: '🌯', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'rapide'], timeMin: 15,
    kcal: 440, protein: 16, carbs: 55, fat: 18,
    ingredients: [
      { id: 'tortilla', qtyPerPerson: 1.5 }, { id: 'pois_chiche', qtyPerPerson: 70 },
      { id: 'avocat', qtyPerPerson: 0.3 }, { id: 'salade', qtyPerPerson: 0.3 },
      { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'carotte', qtyPerPerson: 1 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true,
  },

  // ===== Breakfasts =====
  {
    id: 'pancakes_banane', name: { fr: 'Pancakes banane', ar: 'بانكيك بالموز' },
    emoji: '🥞', mealType: 'petit_dejeuner', tags: ['gourmand', 'famille'], timeMin: 20,
    kcal: 420, protein: 14, carbs: 62, fat: 12,
    ingredients: [
      { id: 'farine', qtyPerPerson: 60 }, { id: 'oeuf', qtyPerPerson: 1 },
      { id: 'lait', qtyPerPerson: 120 }, { id: 'banane', qtyPerPerson: 1 },
      { id: 'miel', qtyPerPerson: 10 },
    ],
    equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'smoothie_bowl', name: { fr: 'Smoothie bowl fruits rouges', ar: 'سموذي بول بالفواكه الحمراء' },
    emoji: '🍓', mealType: 'petit_dejeuner', tags: ['healthy', 'gourmand'], timeMin: 10,
    kcal: 360, protein: 12, carbs: 55, fat: 10,
    ingredients: [
      { id: 'fruits_rouges', qtyPerPerson: 100 }, { id: 'banane', qtyPerPerson: 1 },
      { id: 'yaourt', qtyPerPerson: 1 }, { id: 'flocons_avoine', qtyPerPerson: 30 },
      { id: 'miel', qtyPerPerson: 10 }, { id: 'amandes', qtyPerPerson: 15 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'toast_saumon', name: { fr: 'Toast saumon fumé & avocat', ar: 'توست بالسلمون المدخن والأفوكادو' },
    emoji: '🥑', mealType: 'petit_dejeuner', tags: ['gourmand', 'healthy'], timeMin: 10,
    kcal: 420, protein: 22, carbs: 30, fat: 22,
    ingredients: [
      { id: 'pain', qtyPerPerson: 2 }, { id: 'saumon_fume', qtyPerPerson: 40 },
      { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'citron', qtyPerPerson: 0.2 },
    ],
    equipment: [], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: false,
  },

  // ===== Snacks =====
  {
    id: 'fromage_blanc_miel', name: { fr: 'Fromage blanc, miel & amandes', ar: 'جبن أبيض بالعسل واللوز' },
    emoji: '🍶', mealType: 'gouter', tags: ['healthy', 'proteine'], timeMin: 3,
    kcal: 260, protein: 16, carbs: 22, fat: 12,
    ingredients: [
      { id: 'fromage_frais', qtyPerPerson: 100 }, { id: 'miel', qtyPerPerson: 10 },
      { id: 'amandes', qtyPerPerson: 15 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true,
  },
  {
    id: 'dattes_amandes', name: { fr: 'Dattes & amandes', ar: 'تمر ولوز' },
    emoji: '🌴', mealType: 'gouter', tags: ['healthy', 'rapide'], timeMin: 2,
    kcal: 240, protein: 6, carbs: 38, fat: 10,
    ingredients: [
      { id: 'dattes', qtyPerPerson: 40 }, { id: 'amandes', qtyPerPerson: 20 },
    ],
    equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true,
  },

  // ================= MAROCAIN =================
  { id: 'tajine_poulet_citron', name: { fr: 'Tajine poulet, citron & olives', ar: 'طاجين دجاج بالليمون والزيتون' }, emoji: '🍗', mealType: 'diner', tags: ['du_monde', 'proteine', 'famille'], timeMin: 55, kcal: 430, protein: 32, carbs: 20, fat: 24, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'olives', qtyPerPerson: 30 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['plaque', 'mijoteuse'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'tajine_poisson', name: { fr: 'Tajine de poisson chermoula', ar: 'طاجين السمك بالشرمولة' }, emoji: '🐟', mealType: 'diner', tags: ['du_monde', 'healthy', 'proteine'], timeMin: 45, kcal: 420, protein: 34, carbs: 30, fat: 16, ingredients: [{ id: 'dorade', qtyPerPerson: 180 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'pomme_terre', qtyPerPerson: 120 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'tajine_kefta_oeuf', name: { fr: "Tajine kefta & œuf", ar: 'طاجين كفتة بالبيض' }, emoji: '🍳', mealType: 'diner', tags: ['du_monde', 'proteine', 'famille'], timeMin: 35, kcal: 480, protein: 28, carbs: 18, fat: 32, ingredients: [{ id: 'viande_hachee', qtyPerPerson: 120 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'tajine_agneau_pruneaux', name: { fr: "Tajine d'agneau aux pruneaux", ar: 'طاجين اللحم بالبرقوق' }, emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'gourmand', 'famille'], timeMin: 80, kcal: 660, protein: 34, carbs: 40, fat: 36, ingredients: [{ id: 'agneau', qtyPerPerson: 150 }, { id: 'pruneaux', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 1 }, { id: 'amandes', qtyPerPerson: 15 }, { id: 'cannelle', qtyPerPerson: 1 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['mijoteuse', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'rfissa', name: { fr: 'Rfissa au poulet', ar: 'الرفيسة بالدجاج' }, emoji: '🍛', mealType: 'diner', tags: ['du_monde', 'famille', 'gourmand'], timeMin: 60, kcal: 560, protein: 34, carbs: 45, fat: 22, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'lentilles', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 1 }, { id: 'pain', qtyPerPerson: 1.5 }, { id: 'ras_el_hanout', qtyPerPerson: 2 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'harira', name: { fr: 'Harira marocaine', ar: 'الحريرة' }, emoji: '🥣', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'famille'], timeMin: 45, kcal: 320, protein: 16, carbs: 45, fat: 8, ingredients: [{ id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'lentilles', qtyPerPerson: 40 }, { id: 'pois_chiche', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'farine', qtyPerPerson: 10 }, { id: 'cumin', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'zaalouk', name: { fr: "Zaalouk d'aubergine", ar: 'زعلوك الباذنجان' }, emoji: '🍆', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 30, kcal: 240, protein: 6, carbs: 22, fat: 14, ingredients: [{ id: 'aubergine', qtyPerPerson: 1 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'cumin', qtyPerPerson: 1 }, { id: 'paprika', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 12 }, { id: 'coriandre', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'loubia', name: { fr: 'Loubia (haricots blancs)', ar: 'اللوبيا' }, emoji: '🫘', mealType: 'diner', tags: ['du_monde', 'famille', 'healthy'], timeMin: 40, kcal: 380, protein: 18, carbs: 50, fat: 8, ingredients: [{ id: 'haricots_blancs', qtyPerPerson: 120 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'paprika', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'sardines_chermoula', name: { fr: 'Sardines farcies chermoula', ar: 'سردين معمر بالشرمولة' }, emoji: '🐟', mealType: 'diner', tags: ['du_monde', 'proteine'], timeMin: 30, kcal: 440, protein: 30, carbs: 22, fat: 24, ingredients: [{ id: 'sardines', qtyPerPerson: 150 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'cumin', qtyPerPerson: 1 }, { id: 'paprika', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'pomme_terre', qtyPerPerson: 120 }], equipment: ['four', 'plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'merguez_frites', name: { fr: 'Merguez & frites', ar: 'مرقاز وبطاطس' }, emoji: '🌭', mealType: 'diner', tags: ['du_monde', 'rapide', 'gourmand'], timeMin: 30, kcal: 620, protein: 26, carbs: 45, fat: 38, ingredients: [{ id: 'merguez', qtyPerPerson: 140 }, { id: 'pomme_terre', qtyPerPerson: 220 }, { id: 'harissa', qtyPerPerson: 8 }, { id: 'oignon', qtyPerPerson: 0.5 }], equipment: ['plaque', 'four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'pastilla_poulet', name: { fr: 'Pastilla au poulet', ar: 'بسطيلة الدجاج' }, emoji: '🥧', mealType: 'diner', tags: ['du_monde', 'gourmand', 'famille'], timeMin: 70, kcal: 560, protein: 30, carbs: 40, fat: 30, ingredients: [{ id: 'feuille_brick', qtyPerPerson: 3 }, { id: 'poulet', qtyPerPerson: 120 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'amandes', qtyPerPerson: 20 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'cannelle', qtyPerPerson: 1 }, { id: 'sucre', qtyPerPerson: 8 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'batbout_kefta', name: { fr: 'Batbout farci à la kefta', ar: 'بطبوط معمر بالكفتة' }, emoji: '🥙', mealType: 'dejeuner', tags: ['du_monde', 'rapide'], timeMin: 25, kcal: 480, protein: 26, carbs: 40, fat: 22, ingredients: [{ id: 'pain_pita', qtyPerPerson: 1.5 }, { id: 'viande_hachee', qtyPerPerson: 100 }, { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'cumin', qtyPerPerson: 1 }, { id: 'harissa', qtyPerPerson: 5 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },

  // ================= MOYEN-ORIENT =================
  { id: 'falafel_pita', name: { fr: 'Falafel en pita', ar: 'فلافل في خبز البيتا' }, emoji: '🧆', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 30, kcal: 480, protein: 18, carbs: 55, fat: 20, ingredients: [{ id: 'pois_chiche', qtyPerPerson: 100 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'pain_pita', qtyPerPerson: 1.5 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 0.5 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'chawarma_poulet', name: { fr: 'Chawarma de poulet', ar: 'شاورما الدجاج' }, emoji: '🌯', mealType: 'dejeuner', tags: ['du_monde', 'rapide', 'proteine'], timeMin: 25, kcal: 560, protein: 32, carbs: 45, fat: 24, ingredients: [{ id: 'poulet', qtyPerPerson: 120 }, { id: 'pain_pita', qtyPerPerson: 1.5 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'yaourt', qtyPerPerson: 0.3 }, { id: 'cumin', qtyPerPerson: 1 }, { id: 'paprika', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'taboule_libanais', name: { fr: 'Taboulé libanais', ar: 'تبولة لبنانية' }, emoji: '🥗', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 20, kcal: 340, protein: 8, carbs: 50, fat: 12, ingredients: [{ id: 'boulgour', qtyPerPerson: 70 }, { id: 'persil', qtyPerPerson: 0.5 }, { id: 'menthe', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'fattoush', name: { fr: 'Fattoush', ar: 'فتوش' }, emoji: '🥗', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 15, kcal: 300, protein: 8, carbs: 35, fat: 14, ingredients: [{ id: 'salade', qtyPerPerson: 0.5 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'poivron', qtyPerPerson: 0.3 }, { id: 'pain_pita', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'menthe', qtyPerPerson: 0.2 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'moussaka', name: { fr: 'Moussaka', ar: 'مساقعة' }, emoji: '🍆', mealType: 'diner', tags: ['du_monde', 'gourmand', 'famille'], timeMin: 60, kcal: 560, protein: 26, carbs: 30, fat: 36, ingredients: [{ id: 'aubergine', qtyPerPerson: 1.5 }, { id: 'viande_hachee', qtyPerPerson: 120 }, { id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'parmesan', qtyPerPerson: 15 }, { id: 'huile_olive', qtyPerPerson: 12 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'mujadara', name: { fr: 'Mujadara (lentilles & riz)', ar: 'مجدرة' }, emoji: '🍚', mealType: 'diner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 40, kcal: 420, protein: 16, carbs: 62, fat: 10, ingredients: [{ id: 'lentilles', qtyPerPerson: 90 }, { id: 'riz', qtyPerPerson: 60 }, { id: 'oignon', qtyPerPerson: 1 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= ASIE =================
  { id: 'poulet_teriyaki', name: { fr: 'Poulet teriyaki', ar: 'دجاجترياكي' }, emoji: '🍗', mealType: 'diner', tags: ['du_monde', 'proteine'], timeMin: 30, kcal: 520, protein: 34, carbs: 55, fat: 14, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'brocoli', qtyPerPerson: 80 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'boeuf_saute_legumes', name: { fr: 'Bœuf sauté aux légumes (wok)', ar: 'لحم مقلي بالخضر' }, emoji: '🥢', mealType: 'diner', tags: ['du_monde', 'proteine', 'rapide'], timeMin: 25, kcal: 540, protein: 32, carbs: 45, fat: 22, ingredients: [{ id: 'boeuf', qtyPerPerson: 130 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'brocoli', qtyPerPerson: 60 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'nouilles_sautees_poulet', name: { fr: 'Nouilles sautées au poulet', ar: 'نودلز مقلية بالدجاج' }, emoji: '🍜', mealType: 'diner', tags: ['du_monde', 'rapide'], timeMin: 25, kcal: 520, protein: 28, carbs: 60, fat: 16, ingredients: [{ id: 'nouilles', qtyPerPerson: 90 }, { id: 'poulet', qtyPerPerson: 100 }, { id: 'chou_rouge', qtyPerPerson: 40 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'gingembre', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'riz_cantonais', name: { fr: 'Riz cantonais', ar: 'أرز كانتوني' }, emoji: '🍚', mealType: 'dejeuner', tags: ['du_monde', 'rapide', 'famille'], timeMin: 20, kcal: 480, protein: 22, carbs: 60, fat: 14, ingredients: [{ id: 'riz', qtyPerPerson: 80 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'petit_pois', qtyPerPerson: 40 }, { id: 'jambon_dinde', qtyPerPerson: 40 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'sauce_soja', qtyPerPerson: 10 }, { id: 'oignon', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'curry_vert_thai', name: { fr: 'Curry vert thaï au poulet', ar: 'كاري أخضر تايلاندي' }, emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'proteine', 'gourmand'], timeMin: 30, kcal: 540, protein: 32, carbs: 50, fat: 22, ingredients: [{ id: 'poulet', qtyPerPerson: 120 }, { id: 'lait_coco', qtyPerPerson: 80 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'curry', qtyPerPerson: 3 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'gingembre', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'pad_thai', name: { fr: 'Pad thaï aux crevettes', ar: 'باد تاي بالقمرون' }, emoji: '🍤', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 30, kcal: 560, protein: 28, carbs: 60, fat: 20, ingredients: [{ id: 'nouilles_riz', qtyPerPerson: 90 }, { id: 'crevettes', qtyPerPerson: 100 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'chou_rouge', qtyPerPerson: 40 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'sauce_soja', qtyPerPerson: 10 }, { id: 'beurre_cacahuete', qtyPerPerson: 15 }, { id: 'citron', qtyPerPerson: 0.5 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'ramen_poulet', name: { fr: 'Ramen au poulet', ar: 'رامن بالدجاج' }, emoji: '🍜', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 35, kcal: 560, protein: 30, carbs: 60, fat: 18, ingredients: [{ id: 'nouilles', qtyPerPerson: 90 }, { id: 'poulet', qtyPerPerson: 100 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'champignon', qtyPerPerson: 60 }, { id: 'epinard', qtyPerPerson: 40 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'bouillon', qtyPerPerson: 5 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'bo_bun', name: { fr: 'Bo bun au bœuf', ar: 'بو بون باللحم' }, emoji: '🥗', mealType: 'dejeuner', tags: ['du_monde', 'healthy'], timeMin: 25, kcal: 520, protein: 26, carbs: 55, fat: 18, ingredients: [{ id: 'nouilles_riz', qtyPerPerson: 80 }, { id: 'boeuf', qtyPerPerson: 100 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'menthe', qtyPerPerson: 0.2 }, { id: 'beurre_cacahuete', qtyPerPerson: 12 }, { id: 'citron', qtyPerPerson: 0.5 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'tofu_saute_legumes', name: { fr: 'Tofu sauté aux légumes', ar: 'توفو مقلي بالخضر' }, emoji: '🥡', mealType: 'diner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 25, kcal: 440, protein: 20, carbs: 50, fat: 16, ingredients: [{ id: 'tofu', qtyPerPerson: 120 }, { id: 'brocoli', qtyPerPerson: 80 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'maki_saumon', name: { fr: 'Makis saumon avocat', ar: 'ماكي بالسلمون والأفوكادو' }, emoji: '🍣', mealType: 'dejeuner', tags: ['du_monde', 'gourmand'], timeMin: 30, kcal: 420, protein: 20, carbs: 60, fat: 10, ingredients: [{ id: 'riz', qtyPerPerson: 80 }, { id: 'saumon', qtyPerPerson: 80 }, { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'sauce_soja', qtyPerPerson: 8 }], equipment: [], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: false },

  // ================= INDE =================
  { id: 'poulet_tikka_masala', name: { fr: 'Poulet tikka masala', ar: 'دجاج تيكا ماسالا' }, emoji: '🍛', mealType: 'diner', tags: ['du_monde', 'gourmand', 'proteine'], timeMin: 35, kcal: 580, protein: 34, carbs: 55, fat: 22, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'garam_masala', qtyPerPerson: 3 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'dahl_lentilles', name: { fr: 'Dahl de lentilles corail', ar: 'دال العدس الأحمر' }, emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 35, kcal: 460, protein: 18, carbs: 62, fat: 14, ingredients: [{ id: 'lentilles', qtyPerPerson: 90 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'curcuma', qtyPerPerson: 2 }, { id: 'lait_coco', qtyPerPerson: 60 }, { id: 'riz', qtyPerPerson: 60 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'butter_chicken', name: { fr: 'Butter chicken', ar: 'بتر تشيكن' }, emoji: '🍗', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 35, kcal: 620, protein: 34, carbs: 50, fat: 30, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'garam_masala', qtyPerPerson: 3 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'biryani_poulet', name: { fr: 'Biryani au poulet', ar: 'برياني الدجاج' }, emoji: '🍛', mealType: 'diner', tags: ['du_monde', 'famille', 'gourmand'], timeMin: 50, kcal: 600, protein: 32, carbs: 65, fat: 22, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'riz', qtyPerPerson: 90 }, { id: 'oignon', qtyPerPerson: 1 }, { id: 'yaourt', qtyPerPerson: 0.3 }, { id: 'garam_masala', qtyPerPerson: 3 }, { id: 'curcuma', qtyPerPerson: 1 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'gingembre', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'palak_paneer', name: { fr: 'Palak paneer', ar: 'بالاك بانير' }, emoji: '🧀', mealType: 'diner', tags: ['du_monde', 'vegetarien'], timeMin: 35, kcal: 520, protein: 22, carbs: 40, fat: 28, ingredients: [{ id: 'paneer', qtyPerPerson: 100 }, { id: 'epinard', qtyPerPerson: 80 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'garam_masala', qtyPerPerson: 2 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },

  // ================= ITALIE =================
  { id: 'lasagnes_boeuf', name: { fr: 'Lasagnes à la bolognaise', ar: 'لازانيا بولونيز' }, emoji: '🍝', mealType: 'diner', tags: ['gourmand', 'famille'], timeMin: 60, kcal: 640, protein: 30, carbs: 60, fat: 30, ingredients: [{ id: 'pate_lasagne', qtyPerPerson: 90 }, { id: 'viande_hachee', qtyPerPerson: 110 }, { id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'creme', qtyPerPerson: 30 }, { id: 'mozzarella', qtyPerPerson: 50 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'spaghetti_carbonara', name: { fr: 'Spaghetti carbonara', ar: 'سباغيتي كاربونارا' }, emoji: '🍝', mealType: 'diner', tags: ['gourmand', 'rapide'], timeMin: 20, kcal: 620, protein: 28, carbs: 65, fat: 26, ingredients: [{ id: 'pates', qtyPerPerson: 90 }, { id: 'jambon_dinde', qtyPerPerson: 50 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'parmesan', qtyPerPerson: 20 }, { id: 'ail', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'pates_pesto', name: { fr: 'Pâtes au pesto', ar: 'معكرونة بالبيستو' }, emoji: '🌿', mealType: 'dejeuner', tags: ['vegetarien', 'rapide', 'gourmand'], timeMin: 15, kcal: 560, protein: 16, carbs: 65, fat: 24, ingredients: [{ id: 'pates', qtyPerPerson: 90 }, { id: 'pesto', qtyPerPerson: 30 }, { id: 'tomate_cerise', qtyPerPerson: 60 }, { id: 'parmesan', qtyPerPerson: 15 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'aubergines_parmigiana', name: { fr: 'Aubergines parmigiana', ar: 'باذنجان بارميجانا' }, emoji: '🍆', mealType: 'diner', tags: ['du_monde', 'gourmand', 'vegetarien'], timeMin: 50, kcal: 520, protein: 20, carbs: 35, fat: 30, ingredients: [{ id: 'aubergine', qtyPerPerson: 1.5 }, { id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'mozzarella', qtyPerPerson: 60 }, { id: 'parmesan', qtyPerPerson: 15 }, { id: 'basilic', qtyPerPerson: 0.2 }, { id: 'huile_olive', qtyPerPerson: 12 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'risotto_asperges', name: { fr: 'Risotto aux asperges', ar: 'ريزوتو بالهليون' }, emoji: '🍚', mealType: 'diner', tags: ['gourmand', 'vegetarien'], timeMin: 40, kcal: 560, protein: 16, carbs: 65, fat: 24, ingredients: [{ id: 'riz', qtyPerPerson: 80 }, { id: 'asperges', qtyPerPerson: 120 }, { id: 'parmesan', qtyPerPerson: 20 }, { id: 'creme', qtyPerPerson: 20 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'beurre', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'gnocchi_creme_epinards', name: { fr: 'Gnocchis crème & épinards', ar: 'نيوكي بالكريمة والسبانخ' }, emoji: '🥟', mealType: 'diner', tags: ['gourmand', 'vegetarien'], timeMin: 25, kcal: 600, protein: 18, carbs: 70, fat: 26, ingredients: [{ id: 'gnocchi', qtyPerPerson: 150 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'brie', qtyPerPerson: 40 }, { id: 'epinard', qtyPerPerson: 40 }, { id: 'parmesan', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'salade_caprese', name: { fr: 'Salade caprese', ar: 'سلطة كابريزي' }, emoji: '🍅', mealType: 'dejeuner', tags: ['healthy', 'du_monde', 'vegetarien'], timeMin: 10, kcal: 380, protein: 16, carbs: 25, fat: 24, ingredients: [{ id: 'mozzarella', qtyPerPerson: 80 }, { id: 'tomate', qtyPerPerson: 2 }, { id: 'basilic', qtyPerPerson: 0.2 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'pain', qtyPerPerson: 1 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'minestrone', name: { fr: 'Minestrone', ar: 'مينيسترون' }, emoji: '🥣', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'famille'], timeMin: 35, kcal: 320, protein: 12, carbs: 45, fat: 10, ingredients: [{ id: 'haricots_blancs', qtyPerPerson: 60 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'pates', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },

  // ================= MEXIQUE =================
  { id: 'tacos_boeuf', name: { fr: 'Tacos de bœuf', ar: 'تاكوس باللحم' }, emoji: '🌮', mealType: 'diner', tags: ['du_monde', 'famille', 'gourmand'], timeMin: 30, kcal: 620, protein: 30, carbs: 55, fat: 30, ingredients: [{ id: 'tortilla', qtyPerPerson: 2 }, { id: 'viande_hachee', qtyPerPerson: 110 }, { id: 'cheddar', qtyPerPerson: 40 }, { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'harissa', qtyPerPerson: 5 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'fajitas_poulet', name: { fr: 'Fajitas de poulet', ar: 'فاهيتا الدجاج' }, emoji: '🌯', mealType: 'diner', tags: ['du_monde', 'rapide', 'famille'], timeMin: 25, kcal: 560, protein: 32, carbs: 50, fat: 22, ingredients: [{ id: 'poulet', qtyPerPerson: 120 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'tortilla', qtyPerPerson: 2 }, { id: 'paprika', qtyPerPerson: 2 }, { id: 'cumin', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'quesadilla_poulet', name: { fr: 'Quesadilla au poulet', ar: 'كساديا بالدجاج' }, emoji: '🫓', mealType: 'dejeuner', tags: ['du_monde', 'rapide'], timeMin: 20, kcal: 520, protein: 28, carbs: 45, fat: 24, ingredients: [{ id: 'tortilla', qtyPerPerson: 2 }, { id: 'cheddar', qtyPerPerson: 50 }, { id: 'poulet', qtyPerPerson: 90 }, { id: 'poivron', qtyPerPerson: 0.3 }, { id: 'oignon', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'chili_vegetarien', name: { fr: 'Chili végétarien', ar: 'تشيلي نباتي' }, emoji: '🌶️', mealType: 'diner', tags: ['du_monde', 'vegetarien', 'famille'], timeMin: 40, kcal: 480, protein: 18, carbs: 70, fat: 12, ingredients: [{ id: 'haricots_rouges', qtyPerPerson: 90 }, { id: 'mais', qtyPerPerson: 60 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'riz', qtyPerPerson: 60 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'burrito_haricots', name: { fr: 'Burrito haricots & avocat', ar: 'بوريتو باللوبيا والأفوكادو' }, emoji: '🌯', mealType: 'dejeuner', tags: ['du_monde', 'vegetarien'], timeMin: 20, kcal: 560, protein: 20, carbs: 70, fat: 22, ingredients: [{ id: 'tortilla', qtyPerPerson: 2 }, { id: 'haricots_rouges', qtyPerPerson: 80 }, { id: 'riz', qtyPerPerson: 60 }, { id: 'mais', qtyPerPerson: 40 }, { id: 'cheddar', qtyPerPerson: 30 }, { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'avocat', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },

  // ================= FRANCE / EUROPE =================
  { id: 'boeuf_bourguignon', name: { fr: 'Bœuf bourguignon', ar: 'لحم بورغينيون' }, emoji: '🍲', mealType: 'diner', tags: ['famille', 'gourmand'], timeMin: 90, kcal: 620, protein: 38, carbs: 35, fat: 30, ingredients: [{ id: 'boeuf', qtyPerPerson: 160 }, { id: 'carotte', qtyPerPerson: 2 }, { id: 'champignon', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 1 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'concentre_tomate', qtyPerPerson: 20 }, { id: 'bouillon', qtyPerPerson: 5 }, { id: 'pomme_terre', qtyPerPerson: 120 }], equipment: ['mijoteuse', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'blanquette_veau', name: { fr: 'Blanquette de veau', ar: 'بلانكيت العجل' }, emoji: '🍲', mealType: 'diner', tags: ['famille', 'gourmand'], timeMin: 80, kcal: 620, protein: 36, carbs: 40, fat: 28, ingredients: [{ id: 'veau', qtyPerPerson: 150 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'champignon', qtyPerPerson: 80 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'ratatouille', name: { fr: 'Ratatouille', ar: 'راتاتوي' }, emoji: '🍆', mealType: 'diner', tags: ['healthy', 'du_monde', 'vegetarien'], timeMin: 45, kcal: 320, protein: 8, carbs: 35, fat: 16, ingredients: [{ id: 'aubergine', qtyPerPerson: 1 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'tomate', qtyPerPerson: 2 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 14 }, { id: 'basilic', qtyPerPerson: 0.2 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'quiche_legumes', name: { fr: 'Quiche aux légumes', ar: 'كيش بالخضر' }, emoji: '🥧', mealType: 'dejeuner', tags: ['gourmand', 'vegetarien'], timeMin: 45, kcal: 520, protein: 18, carbs: 40, fat: 30, ingredients: [{ id: 'pate_pizza', qtyPerPerson: 120 }, { id: 'oeuf', qtyPerPerson: 2 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'fromage_frais', qtyPerPerson: 30 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'croque_monsieur', name: { fr: 'Croque-monsieur', ar: 'كروك مسيو' }, emoji: '🥪', mealType: 'dejeuner', tags: ['rapide', 'famille', 'gourmand'], timeMin: 15, kcal: 560, protein: 28, carbs: 40, fat: 32, ingredients: [{ id: 'pain_mie', qtyPerPerson: 120 }, { id: 'jambon_dinde', qtyPerPerson: 50 }, { id: 'cheddar', qtyPerPerson: 50 }, { id: 'beurre', qtyPerPerson: 10 }], equipment: ['four', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'hachis_parmentier', name: { fr: 'Hachis parmentier', ar: 'هاشي بارمنتييه' }, emoji: '🥔', mealType: 'diner', tags: ['famille', 'gourmand'], timeMin: 45, kcal: 580, protein: 28, carbs: 50, fat: 28, ingredients: [{ id: 'pomme_terre', qtyPerPerson: 250 }, { id: 'viande_hachee', qtyPerPerson: 110 }, { id: 'lait', qtyPerPerson: 60 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'parmesan', qtyPerPerson: 15 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'poulet_roti_legumes', name: { fr: 'Poulet rôti & légumes', ar: 'دجاج مشوي بالخضر' }, emoji: '🍗', mealType: 'diner', tags: ['famille', 'proteine'], timeMin: 60, kcal: 520, protein: 36, carbs: 40, fat: 20, ingredients: [{ id: 'poulet', qtyPerPerson: 150 }, { id: 'pomme_terre', qtyPerPerson: 200 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'gratin_chou_fleur', name: { fr: 'Gratin de chou-fleur', ar: 'غراتان القرنبيط' }, emoji: '🥦', mealType: 'diner', tags: ['vegetarien', 'famille'], timeMin: 45, kcal: 440, protein: 18, carbs: 25, fat: 28, ingredients: [{ id: 'chou_fleur', qtyPerPerson: 250 }, { id: 'creme', qtyPerPerson: 60 }, { id: 'lait', qtyPerPerson: 60 }, { id: 'parmesan', qtyPerPerson: 20 }, { id: 'beurre', qtyPerPerson: 8 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'salade_nicoise', name: { fr: 'Salade niçoise', ar: 'سلطة نيسواز' }, emoji: '🥗', mealType: 'dejeuner', tags: ['healthy', 'proteine'], timeMin: 25, kcal: 460, protein: 28, carbs: 30, fat: 24, ingredients: [{ id: 'thon', qtyPerPerson: 80 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'pomme_terre', qtyPerPerson: 120 }, { id: 'haricots_verts', qtyPerPerson: 80 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'olives', qtyPerPerson: 20 }, { id: 'salade', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'moules_frites', name: { fr: 'Moules-frites', ar: 'بوزروگ وبطاطس' }, emoji: '🦪', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 35, kcal: 560, protein: 28, carbs: 50, fat: 24, ingredients: [{ id: 'moules', qtyPerPerson: 300 }, { id: 'pomme_terre', qtyPerPerson: 200 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'creme', qtyPerPerson: 30 }], equipment: ['plaque', 'four'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'poireaux_oeuf', name: { fr: 'Poireaux, œuf & moutarde', ar: 'كراث بالبيض والخردل' }, emoji: '🥬', mealType: 'dejeuner', tags: ['healthy', 'vegetarien'], timeMin: 25, kcal: 300, protein: 12, carbs: 20, fat: 18, ingredients: [{ id: 'poireau', qtyPerPerson: 2 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'moutarde', qtyPerPerson: 5 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'citron', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= LUXE =================
  { id: 'cote_de_boeuf', name: { fr: 'Côte de bœuf & pommes de terre', ar: 'ضلع بقري وبطاطس' }, emoji: '🥩', mealType: 'diner', tags: ['gourmand', 'proteine'], timeMin: 35, kcal: 760, protein: 44, carbs: 40, fat: 44, ingredients: [{ id: 'entrecote', qtyPerPerson: 200 }, { id: 'pomme_terre', qtyPerPerson: 200 }, { id: 'beurre', qtyPerPerson: 14 }, { id: 'ail', qtyPerPerson: 1 }], equipment: ['grill', 'four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'magret_canard_miel', name: { fr: 'Magret de canard au miel', ar: 'صدر بط بالعسل' }, emoji: '🦆', mealType: 'diner', tags: ['gourmand', 'proteine'], timeMin: 30, kcal: 680, protein: 38, carbs: 35, fat: 40, ingredients: [{ id: 'magret_canard', qtyPerPerson: 160 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'pomme_terre', qtyPerPerson: 180 }, { id: 'haricots_verts', qtyPerPerson: 80 }], equipment: ['plaque', 'four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'saint_jacques_poelees', name: { fr: 'Saint-Jacques poêlées', ar: 'الإسكالوب المقلية' }, emoji: '🦪', mealType: 'diner', tags: ['gourmand', 'proteine'], timeMin: 25, kcal: 480, protein: 28, carbs: 30, fat: 24, ingredients: [{ id: 'saint_jacques', qtyPerPerson: 150 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'pomme_terre', qtyPerPerson: 150 }, { id: 'lait', qtyPerPerson: 40 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'homard_grille', name: { fr: 'Homard grillé au beurre', ar: 'كركند مشوي بالزبدة' }, emoji: '🦞', mealType: 'diner', tags: ['gourmand', 'proteine'], timeMin: 35, kcal: 520, protein: 34, carbs: 25, fat: 28, ingredients: [{ id: 'homard', qtyPerPerson: 0.5 }, { id: 'beurre', qtyPerPerson: 14 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['four', 'grill'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'gambas_flambees', name: { fr: 'Gambas flambées & riz', ar: 'قمرون بالأرز' }, emoji: '🦐', mealType: 'diner', tags: ['du_monde', 'gourmand', 'proteine'], timeMin: 25, kcal: 460, protein: 32, carbs: 40, fat: 16, ingredients: [{ id: 'gambas', qtyPerPerson: 160 }, { id: 'ail', qtyPerPerson: 2 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'risotto_truffe', name: { fr: 'Risotto à la truffe', ar: 'ريزوتو بالكمأة' }, emoji: '🍚', mealType: 'diner', tags: ['gourmand', 'vegetarien'], timeMin: 40, kcal: 600, protein: 16, carbs: 68, fat: 28, ingredients: [{ id: 'riz', qtyPerPerson: 80 }, { id: 'champignon', qtyPerPerson: 120 }, { id: 'parmesan', qtyPerPerson: 25 }, { id: 'creme', qtyPerPerson: 20 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'huile_olive', qtyPerPerson: 6 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'plateau_fruits_mer', name: { fr: 'Plateau de fruits de mer', ar: 'طبق فواكه البحر' }, emoji: '🦐', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 25, kcal: 420, protein: 40, carbs: 20, fat: 18, ingredients: [{ id: 'crevettes', qtyPerPerson: 100 }, { id: 'moules', qtyPerPerson: 150 }, { id: 'calamar', qtyPerPerson: 80 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'pain', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: false },
  { id: 'filet_boeuf_poivre', name: { fr: 'Filet de bœuf sauce poivre', ar: 'فيليه بقري بصلصة الفلفل' }, emoji: '🥩', mealType: 'diner', tags: ['gourmand', 'proteine'], timeMin: 30, kcal: 720, protein: 42, carbs: 35, fat: 42, ingredients: [{ id: 'entrecote', qtyPerPerson: 180 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'pomme_terre', qtyPerPerson: 180 }, { id: 'champignon', qtyPerPerson: 60 }, { id: 'beurre', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },

  // ================= HEALTHY / BOWLS =================
  { id: 'salade_grecque', name: { fr: 'Salade grecque', ar: 'سلطة يونانية' }, emoji: '🥗', mealType: 'dejeuner', tags: ['healthy', 'du_monde', 'vegetarien'], timeMin: 15, kcal: 360, protein: 12, carbs: 20, fat: 26, ingredients: [{ id: 'tomate', qtyPerPerson: 2 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'poivron', qtyPerPerson: 0.3 }, { id: 'feta', qtyPerPerson: 60 }, { id: 'olives', qtyPerPerson: 20 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'salade_lentilles_feta', name: { fr: 'Salade lentilles & feta', ar: 'سلطة العدس والفيتا' }, emoji: '🥗', mealType: 'dejeuner', tags: ['healthy', 'proteine', 'vegetarien'], timeMin: 20, kcal: 420, protein: 20, carbs: 45, fat: 18, ingredients: [{ id: 'lentilles', qtyPerPerson: 90 }, { id: 'feta', qtyPerPerson: 40 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'bowl_poulet_patate', name: { fr: 'Bowl poulet & patate douce', ar: 'بول الدجاج والبطاطا الحلوة' }, emoji: '🥗', mealType: 'diner', tags: ['healthy', 'proteine'], timeMin: 35, kcal: 520, protein: 34, carbs: 50, fat: 16, ingredients: [{ id: 'poulet', qtyPerPerson: 120 }, { id: 'patate_douce', qtyPerPerson: 150 }, { id: 'brocoli', qtyPerPerson: 80 }, { id: 'quinoa', qtyPerPerson: 60 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'poke_thon', name: { fr: 'Poke bowl thon & edamame', ar: 'بوكي بول بالتونة والإدامامي' }, emoji: '🍱', mealType: 'diner', tags: ['du_monde', 'healthy', 'proteine'], timeMin: 20, kcal: 520, protein: 30, carbs: 55, fat: 16, ingredients: [{ id: 'thon_frais', qtyPerPerson: 120 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'edamame', qtyPerPerson: 40 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'sauce_soja', qtyPerPerson: 10 }], equipment: [], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: false },
  { id: 'salade_avocat_crevette', name: { fr: 'Salade avocat & crevettes', ar: 'سلطة الأفوكادو والقمرون' }, emoji: '🥗', mealType: 'dejeuner', tags: ['healthy', 'proteine', 'du_monde'], timeMin: 15, kcal: 420, protein: 26, carbs: 20, fat: 26, ingredients: [{ id: 'crevettes', qtyPerPerson: 120 }, { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'buddha_bowl_falafel', name: { fr: 'Buddha bowl falafel & betterave', ar: 'بودا بول بالفلافل والبربة' }, emoji: '🥗', mealType: 'diner', tags: ['healthy', 'vegetarien'], timeMin: 30, kcal: 520, protein: 18, carbs: 62, fat: 20, ingredients: [{ id: 'pois_chiche', qtyPerPerson: 80 }, { id: 'quinoa', qtyPerPerson: 60 }, { id: 'betterave', qtyPerPerson: 80 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'epinard', qtyPerPerson: 40 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'citron', qtyPerPerson: 0.5 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'taboule_quinoa', name: { fr: 'Taboulé de quinoa', ar: 'تبولة الكينوا' }, emoji: '🥗', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'rapide'], timeMin: 20, kcal: 400, protein: 12, carbs: 55, fat: 14, ingredients: [{ id: 'quinoa', qtyPerPerson: 70 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'menthe', qtyPerPerson: 0.2 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'wrap_thon', name: { fr: 'Wrap au thon', ar: 'راب بالتونة' }, emoji: '🌯', mealType: 'dejeuner', tags: ['rapide', 'proteine'], timeMin: 15, kcal: 480, protein: 26, carbs: 45, fat: 22, ingredients: [{ id: 'tortilla', qtyPerPerson: 1.5 }, { id: 'thon', qtyPerPerson: 60 }, { id: 'mais', qtyPerPerson: 40 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'mayonnaise', qtyPerPerson: 20 }], equipment: [], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },

  // ================= PETIT-DÉJEUNER =================
  { id: 'msemen_miel', name: { fr: 'Msemen au miel', ar: 'مسمن بالعسل' }, emoji: '🫓', mealType: 'petit_dejeuner', tags: ['du_monde', 'gourmand'], timeMin: 25, kcal: 420, protein: 8, carbs: 60, fat: 16, ingredients: [{ id: 'farine', qtyPerPerson: 70 }, { id: 'semoule', qtyPerPerson: 20 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'miel', qtyPerPerson: 15 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'baghrir_miel', name: { fr: 'Baghrir (crêpes mille trous)', ar: 'بغرير بالعسل' }, emoji: '🥞', mealType: 'petit_dejeuner', tags: ['du_monde', 'gourmand'], timeMin: 25, kcal: 400, protein: 10, carbs: 62, fat: 12, ingredients: [{ id: 'semoule', qtyPerPerson: 60 }, { id: 'farine', qtyPerPerson: 20 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'miel', qtyPerPerson: 15 }, { id: 'beurre', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'harcha_fromage', name: { fr: 'Harcha au fromage', ar: 'حرشة بالجبن' }, emoji: '🧀', mealType: 'petit_dejeuner', tags: ['du_monde'], timeMin: 20, kcal: 420, protein: 12, carbs: 50, fat: 18, ingredients: [{ id: 'semoule', qtyPerPerson: 80 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'lait', qtyPerPerson: 60 }, { id: 'fromage_frais', qtyPerPerson: 30 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'oeufs_benedicte', name: { fr: 'Œufs bénédicte', ar: 'بيض بنديكت' }, emoji: '🍳', mealType: 'petit_dejeuner', tags: ['gourmand', 'proteine'], timeMin: 20, kcal: 460, protein: 24, carbs: 30, fat: 28, ingredients: [{ id: 'oeuf', qtyPerPerson: 2 }, { id: 'pain_mie', qtyPerPerson: 80 }, { id: 'jambon_dinde', qtyPerPerson: 40 }, { id: 'beurre', qtyPerPerson: 12 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'overnight_oats', name: { fr: 'Overnight oats fruits rouges', ar: 'شوفان بالفواكه الحمراء' }, emoji: '🥣', mealType: 'petit_dejeuner', tags: ['healthy'], timeMin: 5, kcal: 400, protein: 16, carbs: 55, fat: 12, ingredients: [{ id: 'flocons_avoine', qtyPerPerson: 60 }, { id: 'lait', qtyPerPerson: 150 }, { id: 'yaourt', qtyPerPerson: 1 }, { id: 'fruits_rouges', qtyPerPerson: 60 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'graines_chia', qtyPerPerson: 10 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'chia_pudding', name: { fr: 'Chia pudding mangue', ar: 'بودينغ الشيا بالمانجو' }, emoji: '🥭', mealType: 'petit_dejeuner', tags: ['healthy'], timeMin: 5, kcal: 340, protein: 10, carbs: 40, fat: 16, ingredients: [{ id: 'graines_chia', qtyPerPerson: 30 }, { id: 'lait_coco', qtyPerPerson: 120 }, { id: 'mangue', qtyPerPerson: 0.5 }, { id: 'miel', qtyPerPerson: 10 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'bowl_acai', name: { fr: 'Bowl açaï', ar: 'بول أساي' }, emoji: '🍓', mealType: 'petit_dejeuner', tags: ['healthy', 'gourmand'], timeMin: 10, kcal: 400, protein: 12, carbs: 60, fat: 14, ingredients: [{ id: 'fruits_rouges', qtyPerPerson: 100 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'yaourt_grec', qtyPerPerson: 80 }, { id: 'flocons_avoine', qtyPerPerson: 30 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'noix', qtyPerPerson: 15 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'gaufres', name: { fr: 'Gaufres maison', ar: 'وافل منزلي' }, emoji: '🧇', mealType: 'petit_dejeuner', tags: ['gourmand', 'famille'], timeMin: 25, kcal: 440, protein: 12, carbs: 58, fat: 18, ingredients: [{ id: 'farine', qtyPerPerson: 70 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 120 }, { id: 'sucre', qtyPerPerson: 15 }, { id: 'beurre', qtyPerPerson: 12 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'omelette_feta_epinards', name: { fr: 'Omelette feta & épinards', ar: 'أومليت بالفيتا والسبانخ' }, emoji: '🍳', mealType: 'petit_dejeuner', tags: ['healthy', 'proteine', 'vegetarien'], timeMin: 12, kcal: 340, protein: 22, carbs: 8, fat: 24, ingredients: [{ id: 'oeuf', qtyPerPerson: 3 }, { id: 'feta', qtyPerPerson: 40 }, { id: 'epinard', qtyPerPerson: 60 }, { id: 'huile_olive', qtyPerPerson: 6 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },

  // ================= GOÛTERS / DESSERTS =================
  { id: 'yaourt_grec_fruits', name: { fr: 'Yaourt grec, fruits & noix', ar: 'زبادي يوناني بالفواكه' }, emoji: '🥛', mealType: 'gouter', tags: ['healthy', 'proteine'], timeMin: 5, kcal: 300, protein: 16, carbs: 30, fat: 12, ingredients: [{ id: 'yaourt_grec', qtyPerPerson: 120 }, { id: 'fruits_rouges', qtyPerPerson: 60 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'noix', qtyPerPerson: 15 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'energy_balls', name: { fr: 'Energy balls dattes-cacao', ar: 'كرات الطاقة بالتمر' }, emoji: '🍫', mealType: 'gouter', tags: ['healthy'], timeMin: 10, kcal: 320, protein: 10, carbs: 40, fat: 14, ingredients: [{ id: 'dattes', qtyPerPerson: 40 }, { id: 'flocons_avoine', qtyPerPerson: 30 }, { id: 'cacao', qtyPerPerson: 10 }, { id: 'beurre_cacahuete', qtyPerPerson: 15 }, { id: 'amandes', qtyPerPerson: 15 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'salade_de_fruits', name: { fr: 'Salade de fruits frais', ar: 'سلطة فواكه' }, emoji: '🍉', mealType: 'gouter', tags: ['healthy', 'rapide'], timeMin: 10, kcal: 220, protein: 4, carbs: 50, fat: 2, ingredients: [{ id: 'pomme', qtyPerPerson: 1 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'orange', qtyPerPerson: 1 }, { id: 'mangue', qtyPerPerson: 0.5 }, { id: 'citron', qtyPerPerson: 0.2 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'smoothie_mangue', name: { fr: 'Smoothie mangue', ar: 'سموذي المانجو' }, emoji: '🥭', mealType: 'gouter', tags: ['rapide', 'gourmand'], timeMin: 5, kcal: 280, protein: 8, carbs: 50, fat: 6, ingredients: [{ id: 'mangue', qtyPerPerson: 0.5 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 150 }, { id: 'miel', qtyPerPerson: 10 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'chocolat_chaud', name: { fr: 'Chocolat chaud maison', ar: 'شوكولاطة ساخنة' }, emoji: '☕', mealType: 'gouter', tags: ['gourmand'], timeMin: 8, kcal: 320, protein: 10, carbs: 40, fat: 14, ingredients: [{ id: 'lait', qtyPerPerson: 200 }, { id: 'chocolat', qtyPerPerson: 30 }, { id: 'cacao', qtyPerPerson: 5 }, { id: 'sucre', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'pancakes_myrtilles', name: { fr: 'Pancakes aux fruits rouges', ar: 'بانكيك بالفواكه الحمراء' }, emoji: '🥞', mealType: 'gouter', tags: ['gourmand'], timeMin: 20, kcal: 420, protein: 12, carbs: 60, fat: 14, ingredients: [{ id: 'farine', qtyPerPerson: 60 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 120 }, { id: 'fruits_rouges', qtyPerPerson: 50 }, { id: 'miel', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'dattes_farcies', name: { fr: 'Dattes farcies aux noix', ar: 'تمر معمر بالجوز' }, emoji: '🌴', mealType: 'gouter', tags: ['healthy', 'du_monde'], timeMin: 10, kcal: 300, protein: 8, carbs: 45, fat: 12, ingredients: [{ id: 'dattes', qtyPerPerson: 50 }, { id: 'amandes', qtyPerPerson: 20 }, { id: 'noix', qtyPerPerson: 15 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'compote_pomme_cannelle', name: { fr: 'Compote pomme-cannelle', ar: 'كومبوت التفاح والقرفة' }, emoji: '🍎', mealType: 'gouter', tags: ['healthy', 'rapide'], timeMin: 15, kcal: 180, protein: 2, carbs: 42, fat: 1, ingredients: [{ id: 'pomme', qtyPerPerson: 2 }, { id: 'cannelle', qtyPerPerson: 1 }, { id: 'sucre', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= JAPON / CORÉE / VIETNAM =================
  { id: 'oyakodon', name: { fr: 'Oyakodon (poulet-œuf)', ar: 'أوياكودون' }, emoji: '🍚', mealType: 'diner', tags: ['du_monde', 'proteine', 'rapide'], timeMin: 25, kcal: 520, protein: 32, carbs: 60, fat: 14, ingredients: [{ id: 'poulet', qtyPerPerson: 110 }, { id: 'oeuf', qtyPerPerson: 2 }, { id: 'riz', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'bouillon', qtyPerPerson: 5 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'katsu_curry', name: { fr: 'Katsu curry poulet', ar: 'كاتسو كاري' }, emoji: '🍛', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 35, kcal: 640, protein: 34, carbs: 65, fat: 26, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'chapelure', qtyPerPerson: 30 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'riz', qtyPerPerson: 80 }, { id: 'curry', qtyPerPerson: 3 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'carotte', qtyPerPerson: 1 }], equipment: ['plaque', 'four'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'saumon_teriyaki', name: { fr: 'Saumon teriyaki', ar: 'سلمون ترياكي' }, emoji: '🍣', mealType: 'diner', tags: ['du_monde', 'healthy', 'proteine'], timeMin: 25, kcal: 520, protein: 32, carbs: 50, fat: 20, ingredients: [{ id: 'saumon', qtyPerPerson: 130 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'brocoli', qtyPerPerson: 80 }, { id: 'sesame', qtyPerPerson: 3 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'tempura_legumes', name: { fr: 'Tempura de légumes', ar: 'تمبورا الخضر' }, emoji: '🍤', mealType: 'dejeuner', tags: ['du_monde', 'vegetarien'], timeMin: 30, kcal: 460, protein: 12, carbs: 55, fat: 20, ingredients: [{ id: 'courgette', qtyPerPerson: 1 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'brocoli', qtyPerPerson: 60 }, { id: 'farine', qtyPerPerson: 50 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'sauce_soja', qtyPerPerson: 10 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'bibimbap', name: { fr: 'Bibimbap', ar: 'بيبيمباب' }, emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'proteine', 'healthy'], timeMin: 35, kcal: 560, protein: 30, carbs: 60, fat: 18, ingredients: [{ id: 'riz', qtyPerPerson: 80 }, { id: 'boeuf', qtyPerPerson: 100 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'epinard', qtyPerPerson: 40 }, { id: 'champignon', qtyPerPerson: 50 }, { id: 'sauce_soja', qtyPerPerson: 10 }, { id: 'germes_soja', qtyPerPerson: 40 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'poulet_coreen', name: { fr: 'Poulet croustillant coréen', ar: 'دجاج كوري مقرمش' }, emoji: '🍗', mealType: 'diner', tags: ['du_monde', 'gourmand', 'proteine'], timeMin: 30, kcal: 600, protein: 34, carbs: 55, fat: 24, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'miel', qtyPerPerson: 12 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'sesame', qtyPerPerson: 3 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque', 'air_fryer'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'bulgogi', name: { fr: 'Bulgogi de bœuf', ar: 'بولغوغي' }, emoji: '🥩', mealType: 'diner', tags: ['du_monde', 'proteine'], timeMin: 25, kcal: 560, protein: 32, carbs: 50, fat: 22, ingredients: [{ id: 'boeuf', qtyPerPerson: 130 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'sesame', qtyPerPerson: 3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'pho_boeuf', name: { fr: 'Pho bœuf', ar: 'فو باللحم' }, emoji: '🍜', mealType: 'diner', tags: ['du_monde', 'healthy'], timeMin: 40, kcal: 460, protein: 28, carbs: 55, fat: 12, ingredients: [{ id: 'nouilles_riz', qtyPerPerson: 90 }, { id: 'boeuf', qtyPerPerson: 100 }, { id: 'bouillon', qtyPerPerson: 6 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'gingembre', qtyPerPerson: 0.3 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'germes_soja', qtyPerPerson: 40 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'rouleaux_printemps', name: { fr: 'Rouleaux de printemps', ar: 'لفائف الربيع' }, emoji: '🥬', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'rapide'], timeMin: 20, kcal: 300, protein: 18, carbs: 40, fat: 6, ingredients: [{ id: 'feuille_riz', qtyPerPerson: 3 }, { id: 'crevettes', qtyPerPerson: 80 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'menthe', qtyPerPerson: 0.2 }, { id: 'nouilles_riz', qtyPerPerson: 40 }], equipment: [], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= ESPAGNE =================
  { id: 'paella', name: { fr: 'Paella', ar: 'باييلا' }, emoji: '🥘', mealType: 'diner', tags: ['du_monde', 'famille', 'gourmand'], timeMin: 50, kcal: 580, protein: 32, carbs: 60, fat: 18, ingredients: [{ id: 'riz', qtyPerPerson: 90 }, { id: 'poulet', qtyPerPerson: 80 }, { id: 'crevettes', qtyPerPerson: 70 }, { id: 'moules', qtyPerPerson: 80 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'petit_pois', qtyPerPerson: 40 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'curcuma', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'tortilla_espagnole', name: { fr: 'Tortilla espagnole', ar: 'تورتييا إسبانية' }, emoji: '🍳', mealType: 'dejeuner', tags: ['du_monde', 'vegetarien', 'proteine'], timeMin: 30, kcal: 420, protein: 18, carbs: 35, fat: 22, ingredients: [{ id: 'oeuf', qtyPerPerson: 3 }, { id: 'pomme_terre', qtyPerPerson: 180 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 12 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'gazpacho', name: { fr: 'Gazpacho', ar: 'غازباتشو' }, emoji: '🥣', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 15, kcal: 240, protein: 6, carbs: 30, fat: 12, ingredients: [{ id: 'tomate', qtyPerPerson: 2 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'poivron', qtyPerPerson: 0.3 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'pain', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'patatas_bravas', name: { fr: 'Patatas bravas', ar: 'باتاتاس برافاس' }, emoji: '🥔', mealType: 'dejeuner', tags: ['du_monde', 'vegetarien'], timeMin: 30, kcal: 380, protein: 6, carbs: 55, fat: 16, ingredients: [{ id: 'pomme_terre', qtyPerPerson: 220 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'paprika', qtyPerPerson: 2 }, { id: 'harissa', qtyPerPerson: 5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= GRÈCE / TURQUIE =================
  { id: 'souvlaki_poulet', name: { fr: 'Souvlaki de poulet', ar: 'سوفلاكي الدجاج' }, emoji: '🍢', mealType: 'dejeuner', tags: ['du_monde', 'proteine'], timeMin: 25, kcal: 520, protein: 32, carbs: 40, fat: 24, ingredients: [{ id: 'poulet', qtyPerPerson: 120 }, { id: 'pain_pita', qtyPerPerson: 1.5 }, { id: 'yaourt', qtyPerPerson: 0.3 }, { id: 'concombre', qtyPerPerson: 0.3 }, { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'ail', qtyPerPerson: 1 }], equipment: ['grill', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'imam_bayildi', name: { fr: 'Imam bayildi (aubergines)', ar: 'إمام بايلدي' }, emoji: '🍆', mealType: 'diner', tags: ['du_monde', 'vegetarien', 'healthy'], timeMin: 50, kcal: 320, protein: 6, carbs: 30, fat: 18, ingredients: [{ id: 'aubergine', qtyPerPerson: 1.5 }, { id: 'tomate', qtyPerPerson: 1.5 }, { id: 'oignon', qtyPerPerson: 1 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 14 }, { id: 'persil', qtyPerPerson: 0.3 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'keftedes', name: { fr: 'Keftedes (boulettes grecques)', ar: 'كفتة يونانية' }, emoji: '🧆', mealType: 'diner', tags: ['du_monde', 'famille'], timeMin: 30, kcal: 520, protein: 26, carbs: 45, fat: 26, ingredients: [{ id: 'viande_hachee', qtyPerPerson: 120 }, { id: 'oeuf', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'menthe', qtyPerPerson: 0.2 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'riz', qtyPerPerson: 60 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= AFRIQUE =================
  { id: 'yassa_poulet', name: { fr: 'Poulet yassa', ar: 'دجاج ياسا' }, emoji: '🍗', mealType: 'diner', tags: ['du_monde', 'famille', 'proteine'], timeMin: 45, kcal: 520, protein: 32, carbs: 50, fat: 18, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'oignon', qtyPerPerson: 1.5 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'moutarde', qtyPerPerson: 8 }, { id: 'riz', qtyPerPerson: 80 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'mafe_poulet', name: { fr: "Mafé au poulet", ar: 'مافي بالدجاج' }, emoji: '🥜', mealType: 'diner', tags: ['du_monde', 'gourmand', 'famille'], timeMin: 45, kcal: 620, protein: 30, carbs: 55, fat: 28, ingredients: [{ id: 'poulet', qtyPerPerson: 120 }, { id: 'beurre_cacahuete', qtyPerPerson: 25 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'patate_douce', qtyPerPerson: 120 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'thieboudienne', name: { fr: 'Thiéboudienne (riz au poisson)', ar: 'تشيبوجين' }, emoji: '🐟', mealType: 'diner', tags: ['du_monde', 'famille', 'proteine'], timeMin: 60, kcal: 560, protein: 30, carbs: 65, fat: 16, ingredients: [{ id: 'riz', qtyPerPerson: 90 }, { id: 'dorade', qtyPerPerson: 150 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'chou_fleur', qtyPerPerson: 80 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'poivron', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= AMÉRIQUE / UK / ALLEMAGNE =================
  { id: 'mac_and_cheese', name: { fr: 'Mac & cheese', ar: 'ماك أند تشيز' }, emoji: '🧀', mealType: 'diner', tags: ['famille', 'gourmand', 'vegetarien'], timeMin: 30, kcal: 620, protein: 22, carbs: 65, fat: 30, ingredients: [{ id: 'pates', qtyPerPerson: 90 }, { id: 'cheddar', qtyPerPerson: 60 }, { id: 'lait', qtyPerPerson: 80 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'parmesan', qtyPerPerson: 10 }], equipment: ['four', 'plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'club_sandwich', name: { fr: 'Club sandwich', ar: 'كلوب ساندويتش' }, emoji: '🥪', mealType: 'dejeuner', tags: ['rapide', 'gourmand'], timeMin: 15, kcal: 560, protein: 30, carbs: 45, fat: 28, ingredients: [{ id: 'pain_mie', qtyPerPerson: 120 }, { id: 'poulet', qtyPerPerson: 80 }, { id: 'jambon_dinde', qtyPerPerson: 30 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'salade', qtyPerPerson: 0.2 }, { id: 'tomate', qtyPerPerson: 0.5 }, { id: 'mayonnaise', qtyPerPerson: 15 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'buffalo_wings', name: { fr: 'Ailes de poulet buffalo', ar: 'أجنحة الدجاج بافلو' }, emoji: '🍗', mealType: 'diner', tags: ['du_monde', 'gourmand', 'proteine'], timeMin: 35, kcal: 600, protein: 34, carbs: 40, fat: 30, ingredients: [{ id: 'poulet', qtyPerPerson: 140 }, { id: 'harissa', qtyPerPerson: 10 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'pomme_terre', qtyPerPerson: 180 }], equipment: ['four', 'air_fryer'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'caesar_wrap', name: { fr: 'Wrap César', ar: 'راب سيزر' }, emoji: '🌯', mealType: 'dejeuner', tags: ['rapide', 'proteine'], timeMin: 15, kcal: 520, protein: 28, carbs: 45, fat: 24, ingredients: [{ id: 'tortilla', qtyPerPerson: 1.5 }, { id: 'poulet', qtyPerPerson: 100 }, { id: 'salade', qtyPerPerson: 0.3 }, { id: 'parmesan', qtyPerPerson: 15 }, { id: 'mayonnaise', qtyPerPerson: 20 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'fish_and_chips', name: { fr: 'Fish & chips', ar: 'فيش أند شيبس' }, emoji: '🍟', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 35, kcal: 660, protein: 30, carbs: 60, fat: 32, ingredients: [{ id: 'cabillaud', qtyPerPerson: 160 }, { id: 'farine', qtyPerPerson: 40 }, { id: 'pomme_terre', qtyPerPerson: 220 }, { id: 'oeuf', qtyPerPerson: 0.5 }, { id: 'citron', qtyPerPerson: 0.5 }], equipment: ['four', 'plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'currywurst', name: { fr: 'Currywurst & frites', ar: 'كاريفورست' }, emoji: '🌭', mealType: 'diner', tags: ['du_monde', 'rapide'], timeMin: 25, kcal: 620, protein: 24, carbs: 50, fat: 36, ingredients: [{ id: 'merguez', qtyPerPerson: 140 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'curry', qtyPerPerson: 3 }, { id: 'pomme_terre', qtyPerPerson: 200 }, { id: 'oignon', qtyPerPerson: 0.5 }], equipment: ['plaque', 'four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= AMÉRIQUE LATINE =================
  { id: 'ceviche', name: { fr: 'Ceviche de cabillaud', ar: 'سيفيتشي' }, emoji: '🐟', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'proteine'], timeMin: 20, kcal: 280, protein: 26, carbs: 15, fat: 12, ingredients: [{ id: 'cabillaud', qtyPerPerson: 120 }, { id: 'citron', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'tomate', qtyPerPerson: 0.5 }], equipment: [], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: false },
  { id: 'moqueca', name: { fr: 'Moqueca de poisson', ar: 'موكيكا' }, emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'healthy', 'gourmand'], timeMin: 35, kcal: 480, protein: 30, carbs: 40, fat: 20, ingredients: [{ id: 'cabillaud', qtyPerPerson: 150 }, { id: 'lait_coco', qtyPerPerson: 80 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'fish_tacos', name: { fr: 'Tacos de poisson', ar: 'تاكوس السمك' }, emoji: '🌮', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 25, kcal: 520, protein: 26, carbs: 50, fat: 22, ingredients: [{ id: 'tortilla', qtyPerPerson: 2 }, { id: 'cabillaud', qtyPerPerson: 120 }, { id: 'chou_rouge', qtyPerPerson: 40 }, { id: 'avocat', qtyPerPerson: 0.3 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'mayonnaise', qtyPerPerson: 15 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },

  // ================= VÉGÉTARIEN / EUROPE =================
  { id: 'tarte_tomate_moutarde', name: { fr: 'Tarte tomate & moutarde', ar: 'تارت الطماطم والخردل' }, emoji: '🥧', mealType: 'dejeuner', tags: ['vegetarien', 'gourmand'], timeMin: 40, kcal: 460, protein: 16, carbs: 45, fat: 24, ingredients: [{ id: 'pate_pizza', qtyPerPerson: 120 }, { id: 'tomate', qtyPerPerson: 2 }, { id: 'moutarde', qtyPerPerson: 8 }, { id: 'mozzarella', qtyPerPerson: 50 }, { id: 'basilic', qtyPerPerson: 0.2 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'galette_sarrasin', name: { fr: 'Galette de sarrasin complète', ar: 'كريب الحنطة السوداء' }, emoji: '🫓', mealType: 'dejeuner', tags: ['du_monde', 'rapide'], timeMin: 20, kcal: 460, protein: 22, carbs: 40, fat: 22, ingredients: [{ id: 'farine_sarrasin', qtyPerPerson: 70 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'jambon_dinde', qtyPerPerson: 40 }, { id: 'cheddar', qtyPerPerson: 40 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'veloute_potiron', name: { fr: 'Velouté de potiron', ar: 'شوربة القرع' }, emoji: '🎃', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'famille'], timeMin: 30, kcal: 280, protein: 8, carbs: 35, fat: 12, ingredients: [{ id: 'courge', qtyPerPerson: 200 }, { id: 'pomme_terre', qtyPerPerson: 100 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'creme', qtyPerPerson: 20 }, { id: 'bouillon', qtyPerPerson: 5 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'gratin_courgettes', name: { fr: 'Gratin de courgettes', ar: 'غراتان الكوسة' }, emoji: '🥒', mealType: 'diner', tags: ['vegetarien', 'famille'], timeMin: 45, kcal: 420, protein: 16, carbs: 35, fat: 24, ingredients: [{ id: 'courgette', qtyPerPerson: 2 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'parmesan', qtyPerPerson: 20 }, { id: 'riz', qtyPerPerson: 60 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'curry_aubergine', name: { fr: "Curry d'aubergine au coco", ar: 'كاري الباذنجان' }, emoji: '🍆', mealType: 'diner', tags: ['du_monde', 'vegetarien', 'healthy'], timeMin: 35, kcal: 460, protein: 12, carbs: 60, fat: 18, ingredients: [{ id: 'aubergine', qtyPerPerson: 1.5 }, { id: 'lait_coco', qtyPerPerson: 80 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'curry', qtyPerPerson: 3 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'coriandre', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= VIANDE / POISSON supplémentaires =================
  { id: 'escalope_milanaise', name: { fr: 'Escalope milanaise', ar: 'إسكالوب ميلانيز' }, emoji: '🍝', mealType: 'diner', tags: ['famille', 'gourmand'], timeMin: 30, kcal: 640, protein: 34, carbs: 55, fat: 28, ingredients: [{ id: 'dinde', qtyPerPerson: 130 }, { id: 'chapelure', qtyPerPerson: 30 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'pates', qtyPerPerson: 80 }, { id: 'tomate_concassee', qtyPerPerson: 80 }, { id: 'parmesan', qtyPerPerson: 15 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'cordon_bleu', name: { fr: 'Cordon bleu maison', ar: 'كوردون بلو' }, emoji: '🍗', mealType: 'diner', tags: ['famille', 'gourmand'], timeMin: 35, kcal: 640, protein: 38, carbs: 45, fat: 32, ingredients: [{ id: 'dinde', qtyPerPerson: 130 }, { id: 'jambon_dinde', qtyPerPerson: 30 }, { id: 'cheddar', qtyPerPerson: 30 }, { id: 'chapelure', qtyPerPerson: 30 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'pomme_terre', qtyPerPerson: 180 }], equipment: ['four', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'poulet_basquaise', name: { fr: 'Poulet basquaise', ar: 'دجاج باسك' }, emoji: '🍗', mealType: 'diner', tags: ['du_monde', 'famille', 'proteine'], timeMin: 45, kcal: 520, protein: 34, carbs: 45, fat: 18, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'poivron', qtyPerPerson: 0.7 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'boulettes_sauce_tomate', name: { fr: 'Boulettes sauce tomate', ar: 'كرات اللحم بصلصة الطماطم' }, emoji: '🍝', mealType: 'diner', tags: ['famille', 'gourmand'], timeMin: 35, kcal: 600, protein: 30, carbs: 60, fat: 24, ingredients: [{ id: 'viande_hachee', qtyPerPerson: 110 }, { id: 'oeuf', qtyPerPerson: 0.5 }, { id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'pates', qtyPerPerson: 80 }, { id: 'parmesan', qtyPerPerson: 12 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'navarin_agneau', name: { fr: "Navarin d'agneau", ar: 'نافاران اللحم' }, emoji: '🍲', mealType: 'diner', tags: ['famille', 'gourmand'], timeMin: 80, kcal: 620, protein: 34, carbs: 45, fat: 30, ingredients: [{ id: 'agneau', qtyPerPerson: 150 }, { id: 'carotte', qtyPerPerson: 2 }, { id: 'pomme_terre', qtyPerPerson: 150 }, { id: 'petit_pois', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'concentre_tomate', qtyPerPerson: 15 }], equipment: ['mijoteuse', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'brochettes_agneau', name: { fr: "Brochettes d'agneau", ar: 'أسياخ اللحم' }, emoji: '🍢', mealType: 'diner', tags: ['du_monde', 'proteine', 'gourmand'], timeMin: 30, kcal: 560, protein: 32, carbs: 35, fat: 30, ingredients: [{ id: 'agneau', qtyPerPerson: 150 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'pain_pita', qtyPerPerson: 1 }, { id: 'yaourt', qtyPerPerson: 0.3 }], equipment: ['grill'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'cabillaud_four', name: { fr: 'Cabillaud rôti aux tomates', ar: 'سمك القد بالطماطم' }, emoji: '🐟', mealType: 'diner', tags: ['healthy', 'proteine'], timeMin: 30, kcal: 420, protein: 32, carbs: 25, fat: 18, ingredients: [{ id: 'cabillaud', qtyPerPerson: 170 }, { id: 'tomate_cerise', qtyPerPerson: 80 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'olives', qtyPerPerson: 15 }], equipment: ['four'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'brochettes_saumon', name: { fr: 'Brochettes de saumon', ar: 'أسياخ السلمون' }, emoji: '🍢', mealType: 'diner', tags: ['healthy', 'proteine'], timeMin: 25, kcal: 480, protein: 32, carbs: 40, fat: 20, ingredients: [{ id: 'saumon', qtyPerPerson: 140 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 8 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['grill', 'four'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'calamars_frits', name: { fr: 'Calamars frits & citron', ar: 'حبار مقلي' }, emoji: '🦑', mealType: 'dejeuner', tags: ['du_monde', 'gourmand'], timeMin: 25, kcal: 460, protein: 26, carbs: 40, fat: 22, ingredients: [{ id: 'calamar', qtyPerPerson: 150 }, { id: 'farine', qtyPerPerson: 40 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'mayonnaise', qtyPerPerson: 20 }, { id: 'salade', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },

  // ================= PETIT-DÉJEUNER supplémentaires =================
  { id: 'pain_perdu', name: { fr: 'Pain perdu', ar: 'الخبز الضائع' }, emoji: '🍞', mealType: 'petit_dejeuner', tags: ['gourmand', 'famille'], timeMin: 15, kcal: 420, protein: 14, carbs: 55, fat: 16, ingredients: [{ id: 'pain_mie', qtyPerPerson: 100 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 120 }, { id: 'sucre', qtyPerPerson: 12 }, { id: 'cannelle', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'oeufs_cocotte', name: { fr: 'Œufs cocotte épinards', ar: 'بيض بالسبانخ' }, emoji: '🥚', mealType: 'petit_dejeuner', tags: ['proteine', 'gourmand'], timeMin: 15, kcal: 340, protein: 20, carbs: 15, fat: 22, ingredients: [{ id: 'oeuf', qtyPerPerson: 2 }, { id: 'creme', qtyPerPerson: 30 }, { id: 'epinard', qtyPerPerson: 50 }, { id: 'fromage_frais', qtyPerPerson: 20 }, { id: 'pain', qtyPerPerson: 1 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'granola_yaourt', name: { fr: 'Granola & yaourt grec', ar: 'غرانولا بالزبادي' }, emoji: '🥣', mealType: 'petit_dejeuner', tags: ['healthy', 'proteine'], timeMin: 5, kcal: 420, protein: 16, carbs: 50, fat: 18, ingredients: [{ id: 'flocons_avoine', qtyPerPerson: 50 }, { id: 'miel', qtyPerPerson: 10 }, { id: 'noix', qtyPerPerson: 15 }, { id: 'amandes', qtyPerPerson: 15 }, { id: 'yaourt_grec', qtyPerPerson: 80 }, { id: 'fruits_rouges', qtyPerPerson: 40 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'tartine_ricotta_miel', name: { fr: 'Tartine ricotta, miel & noix', ar: 'خبز بالريكوتا والعسل' }, emoji: '🍯', mealType: 'petit_dejeuner', tags: ['healthy', 'gourmand'], timeMin: 8, kcal: 380, protein: 14, carbs: 40, fat: 18, ingredients: [{ id: 'pain', qtyPerPerson: 2 }, { id: 'ricotta', qtyPerPerson: 60 }, { id: 'miel', qtyPerPerson: 12 }, { id: 'noix', qtyPerPerson: 15 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'smoothie_vert', name: { fr: 'Smoothie vert', ar: 'سموذي أخضر' }, emoji: '🥬', mealType: 'petit_dejeuner', tags: ['healthy', 'rapide'], timeMin: 5, kcal: 240, protein: 8, carbs: 40, fat: 6, ingredients: [{ id: 'epinard', qtyPerPerson: 40 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'pomme', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.2 }, { id: 'lait', qtyPerPerson: 120 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'porridge_cacao', name: { fr: 'Porridge cacao-banane', ar: 'شوفان بالكاكاو والموز' }, emoji: '🍫', mealType: 'petit_dejeuner', tags: ['gourmand', 'healthy'], timeMin: 10, kcal: 400, protein: 14, carbs: 60, fat: 12, ingredients: [{ id: 'flocons_avoine', qtyPerPerson: 60 }, { id: 'lait', qtyPerPerson: 200 }, { id: 'cacao', qtyPerPerson: 8 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'miel', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },

  // ================= DESSERTS supplémentaires =================
  { id: 'mousse_chocolat', name: { fr: 'Mousse au chocolat', ar: 'موس الشوكولاطة' }, emoji: '🍫', mealType: 'gouter', tags: ['gourmand'], timeMin: 15, kcal: 360, protein: 8, carbs: 35, fat: 22, ingredients: [{ id: 'chocolat', qtyPerPerson: 40 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'sucre', qtyPerPerson: 10 }, { id: 'creme', qtyPerPerson: 20 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: false },
  { id: 'riz_au_lait', name: { fr: 'Riz au lait', ar: 'أرز بالحليب' }, emoji: '🍚', mealType: 'gouter', tags: ['gourmand', 'famille'], timeMin: 30, kcal: 320, protein: 8, carbs: 55, fat: 8, ingredients: [{ id: 'riz', qtyPerPerson: 50 }, { id: 'lait', qtyPerPerson: 200 }, { id: 'sucre', qtyPerPerson: 15 }, { id: 'cannelle', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'tiramisu', name: { fr: 'Tiramisu', ar: 'تيراميسو' }, emoji: '🍮', mealType: 'gouter', tags: ['gourmand'], timeMin: 25, kcal: 420, protein: 8, carbs: 40, fat: 26, ingredients: [{ id: 'mascarpone', qtyPerPerson: 60 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'sucre', qtyPerPerson: 15 }, { id: 'cacao', qtyPerPerson: 5 }, { id: 'biscuits', qtyPerPerson: 40 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: false },
  { id: 'crepes_sucre', name: { fr: 'Crêpes sucrées', ar: 'كريب بالسكر' }, emoji: '🥞', mealType: 'gouter', tags: ['gourmand', 'famille'], timeMin: 20, kcal: 380, protein: 12, carbs: 55, fat: 12, ingredients: [{ id: 'farine', qtyPerPerson: 60 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 150 }, { id: 'sucre', qtyPerPerson: 12 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'banana_bread', name: { fr: 'Banana bread', ar: 'خبز الموز' }, emoji: '🍌', mealType: 'gouter', tags: ['gourmand'], timeMin: 50, kcal: 420, protein: 10, carbs: 60, fat: 16, ingredients: [{ id: 'farine', qtyPerPerson: 60 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'sucre', qtyPerPerson: 15 }, { id: 'beurre', qtyPerPerson: 12 }, { id: 'noix', qtyPerPerson: 12 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },

  // ================= MAROCAIN (suite) =================
  { id: 'tanjia', name: { fr: 'Tanjia marrakchia', ar: 'طنجية مراكشية' }, emoji: '🍲', mealType: 'diner', tags: ['du_monde', 'gourmand', 'famille'], timeMin: 90, kcal: 640, protein: 36, carbs: 15, fat: 44, ingredients: [{ id: 'agneau', qtyPerPerson: 170 }, { id: 'ail', qtyPerPerson: 2 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'ras_el_hanout', qtyPerPerson: 2 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'chorba', name: { fr: 'Chorba', ar: 'شربة' }, emoji: '🥣', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'famille'], timeMin: 40, kcal: 320, protein: 18, carbs: 40, fat: 8, ingredients: [{ id: 'vermicelle', qtyPerPerson: 40 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'poulet', qtyPerPerson: 70 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'courgette', qtyPerPerson: 0.5 }, { id: 'coriandre', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'briouates_viande', name: { fr: 'Briouates à la viande', ar: 'بريوات باللحم' }, emoji: '🥟', mealType: 'diner', tags: ['du_monde', 'gourmand'], timeMin: 45, kcal: 480, protein: 22, carbs: 40, fat: 26, ingredients: [{ id: 'feuille_brick', qtyPerPerson: 3 }, { id: 'viande_hachee', qtyPerPerson: 90 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'oeuf', qtyPerPerson: 0.5 }], equipment: ['four', 'plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'seffa_medfouna', name: { fr: 'Seffa medfouna', ar: 'السفة المدفونة' }, emoji: '🍜', mealType: 'diner', tags: ['du_monde', 'gourmand', 'famille'], timeMin: 60, kcal: 620, protein: 28, carbs: 70, fat: 22, ingredients: [{ id: 'vermicelle', qtyPerPerson: 90 }, { id: 'poulet', qtyPerPerson: 110 }, { id: 'cannelle', qtyPerPerson: 1 }, { id: 'sucre', qtyPerPerson: 10 }, { id: 'amandes', qtyPerPerson: 15 }, { id: 'raisins_secs', qtyPerPerson: 20 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'brochettes_poulet_marocaines', name: { fr: 'Brochettes de poulet marocaines', ar: 'أسياخ الدجاج' }, emoji: '🍢', mealType: 'diner', tags: ['du_monde', 'proteine'], timeMin: 30, kcal: 480, protein: 34, carbs: 35, fat: 20, ingredients: [{ id: 'poulet', qtyPerPerson: 150 }, { id: 'cumin', qtyPerPerson: 2 }, { id: 'paprika', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'pain', qtyPerPerson: 1 }], equipment: ['grill'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'salade_marocaine', name: { fr: 'Salade marocaine', ar: 'سلطة مغربية' }, emoji: '🥗', mealType: 'dejeuner', tags: ['du_monde', 'healthy', 'vegetarien'], timeMin: 15, kcal: 200, protein: 5, carbs: 20, fat: 12, ingredients: [{ id: 'tomate', qtyPerPerson: 1 }, { id: 'concombre', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'poivron', qtyPerPerson: 0.3 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'huile_olive', qtyPerPerson: 8 }, { id: 'citron', qtyPerPerson: 0.3 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= PÂTES / RIZ / VÉGÉ =================
  { id: 'pates_arrabiata', name: { fr: "Pâtes all'arrabiata", ar: 'معكرونة أرابياتا' }, emoji: '🍝', mealType: 'dejeuner', tags: ['vegetarien', 'rapide'], timeMin: 20, kcal: 520, protein: 14, carbs: 75, fat: 16, ingredients: [{ id: 'pates', qtyPerPerson: 90 }, { id: 'tomate_concassee', qtyPerPerson: 120 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'harissa', qtyPerPerson: 5 }, { id: 'basilic', qtyPerPerson: 0.2 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'pates_aglio_olio', name: { fr: 'Pâtes aglio e olio', ar: 'معكرونة بالثوم والزيت' }, emoji: '🍝', mealType: 'dejeuner', tags: ['vegetarien', 'rapide'], timeMin: 15, kcal: 540, protein: 14, carbs: 72, fat: 20, ingredients: [{ id: 'pates', qtyPerPerson: 90 }, { id: 'ail', qtyPerPerson: 2 }, { id: 'huile_olive', qtyPerPerson: 14 }, { id: 'persil', qtyPerPerson: 0.3 }, { id: 'parmesan', qtyPerPerson: 12 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'risotto_tomate', name: { fr: 'Risotto tomate & basilic', ar: 'ريزوتو بالطماطم' }, emoji: '🍚', mealType: 'diner', tags: ['vegetarien', 'gourmand'], timeMin: 35, kcal: 520, protein: 14, carbs: 70, fat: 18, ingredients: [{ id: 'riz', qtyPerPerson: 80 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'parmesan', qtyPerPerson: 18 }, { id: 'basilic', qtyPerPerson: 0.2 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'one_pot_pasta', name: { fr: 'One-pot pasta épinards', ar: 'باستا الوعاء الواحد' }, emoji: '🍝', mealType: 'diner', tags: ['vegetarien', 'rapide', 'famille'], timeMin: 20, kcal: 540, protein: 16, carbs: 72, fat: 18, ingredients: [{ id: 'pates', qtyPerPerson: 90 }, { id: 'tomate_cerise', qtyPerPerson: 70 }, { id: 'epinard', qtyPerPerson: 50 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'parmesan', qtyPerPerson: 15 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'poelee_quinoa_legumes', name: { fr: 'Poêlée quinoa & légumes', ar: 'كينوا بالخضر' }, emoji: '🥗', mealType: 'diner', tags: ['healthy', 'vegetarien'], timeMin: 25, kcal: 460, protein: 16, carbs: 60, fat: 16, ingredients: [{ id: 'quinoa', qtyPerPerson: 70 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'champignon', qtyPerPerson: 60 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'curry_courge_coco', name: { fr: 'Curry de courge au coco', ar: 'كاري القرع بجوز الهند' }, emoji: '🎃', mealType: 'diner', tags: ['du_monde', 'vegetarien', 'healthy'], timeMin: 35, kcal: 460, protein: 12, carbs: 62, fat: 16, ingredients: [{ id: 'courge', qtyPerPerson: 180 }, { id: 'lait_coco', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'curry', qtyPerPerson: 3 }, { id: 'riz', qtyPerPerson: 70 }, { id: 'epinard', qtyPerPerson: 40 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'tarte_courgette_chevre', name: { fr: 'Tarte courgette & chèvre', ar: 'تارت الكوسة وجبن الماعز' }, emoji: '🥧', mealType: 'dejeuner', tags: ['vegetarien', 'gourmand'], timeMin: 45, kcal: 500, protein: 18, carbs: 42, fat: 28, ingredients: [{ id: 'pate_pizza', qtyPerPerson: 120 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'chevre', qtyPerPerson: 50 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'creme', qtyPerPerson: 30 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'salade_betterave_chevre', name: { fr: 'Salade betterave & chèvre', ar: 'سلطة البربة وجبن الماعز' }, emoji: '🥗', mealType: 'dejeuner', tags: ['healthy', 'vegetarien'], timeMin: 15, kcal: 380, protein: 14, carbs: 25, fat: 26, ingredients: [{ id: 'betterave', qtyPerPerson: 100 }, { id: 'chevre', qtyPerPerson: 40 }, { id: 'roquette', qtyPerPerson: 0.4 }, { id: 'noix', qtyPerPerson: 15 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'wok_nouilles_legumes', name: { fr: 'Wok de nouilles aux légumes', ar: 'ووك النودلز بالخضر' }, emoji: '🍜', mealType: 'diner', tags: ['du_monde', 'vegetarien', 'rapide'], timeMin: 20, kcal: 480, protein: 14, carbs: 70, fat: 14, ingredients: [{ id: 'nouilles', qtyPerPerson: 90 }, { id: 'brocoli', qtyPerPerson: 70 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'sauce_soja', qtyPerPerson: 12 }, { id: 'gingembre', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'soupe_tomate_basilic', name: { fr: 'Soupe tomate-basilic', ar: 'شوربة الطماطم والحبق' }, emoji: '🍅', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'famille'], timeMin: 25, kcal: 260, protein: 6, carbs: 30, fat: 12, ingredients: [{ id: 'tomate_concassee', qtyPerPerson: 150 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'creme', qtyPerPerson: 20 }, { id: 'basilic', qtyPerPerson: 0.2 }, { id: 'pain', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'veloute_carotte', name: { fr: 'Velouté de carottes au cumin', ar: 'شوربة الجزر بالكمون' }, emoji: '🥕', mealType: 'dejeuner', tags: ['healthy', 'vegetarien', 'famille'], timeMin: 30, kcal: 240, protein: 6, carbs: 35, fat: 8, ingredients: [{ id: 'carotte', qtyPerPerson: 3 }, { id: 'pomme_terre', qtyPerPerson: 80 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'creme', qtyPerPerson: 20 }, { id: 'cumin', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'coleslaw_poulet', name: { fr: 'Coleslaw & poulet', ar: 'كولسلو بالدجاج' }, emoji: '🥗', mealType: 'dejeuner', tags: ['rapide', 'proteine'], timeMin: 15, kcal: 420, protein: 26, carbs: 25, fat: 24, ingredients: [{ id: 'chou_rouge', qtyPerPerson: 60 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'poulet', qtyPerPerson: 90 }, { id: 'mayonnaise', qtyPerPerson: 20 }, { id: 'pomme', qtyPerPerson: 0.5 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= POISSON (suite) =================
  { id: 'maquereau_grille', name: { fr: 'Maquereau grillé', ar: 'ماكريل مشوي' }, emoji: '🐟', mealType: 'diner', tags: ['healthy', 'proteine', 'du_monde'], timeMin: 25, kcal: 460, protein: 30, carbs: 25, fat: 26, ingredients: [{ id: 'maquereau', qtyPerPerson: 180 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 8 }, { id: 'pomme_terre', qtyPerPerson: 150 }, { id: 'salade', qtyPerPerson: 0.3 }], equipment: ['grill'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'papillote_cabillaud', name: { fr: 'Papillote de cabillaud', ar: 'سمك القد في ورق' }, emoji: '🐟', mealType: 'diner', tags: ['healthy', 'proteine'], timeMin: 30, kcal: 380, protein: 32, carbs: 20, fat: 16, ingredients: [{ id: 'cabillaud', qtyPerPerson: 170 }, { id: 'courgette', qtyPerPerson: 1 }, { id: 'tomate_cerise', qtyPerPerson: 60 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['four'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'soupe_de_poisson', name: { fr: 'Soupe de poisson', ar: 'شوربة السمك' }, emoji: '🍲', mealType: 'dejeuner', tags: ['du_monde', 'healthy'], timeMin: 40, kcal: 360, protein: 26, carbs: 30, fat: 14, ingredients: [{ id: 'cabillaud', qtyPerPerson: 120 }, { id: 'tomate_concassee', qtyPerPerson: 100 }, { id: 'poireau', qtyPerPerson: 1 }, { id: 'pomme_terre', qtyPerPerson: 100 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 8 }], equipment: ['plaque'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'tartare_saumon', name: { fr: 'Tartare de saumon', ar: 'تارتار السلمون' }, emoji: '🍣', mealType: 'dejeuner', tags: ['du_monde', 'gourmand', 'proteine'], timeMin: 20, kcal: 420, protein: 26, carbs: 25, fat: 24, ingredients: [{ id: 'saumon', qtyPerPerson: 130 }, { id: 'avocat', qtyPerPerson: 0.5 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.2 }, { id: 'coriandre', qtyPerPerson: 0.3 }, { id: 'pain', qtyPerPerson: 1 }], equipment: [], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: false },
  { id: 'brochettes_gambas', name: { fr: 'Brochettes de gambas', ar: 'أسياخ القمرون' }, emoji: '🦐', mealType: 'diner', tags: ['du_monde', 'proteine', 'gourmand'], timeMin: 25, kcal: 440, protein: 30, carbs: 40, fat: 14, ingredients: [{ id: 'gambas', qtyPerPerson: 150 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'courgette', qtyPerPerson: 0.5 }, { id: 'ail', qtyPerPerson: 1 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['grill'], vegetarian: false, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },

  // ================= VIANDE (suite) =================
  { id: 'poulet_moutarde', name: { fr: 'Poulet à la moutarde', ar: 'دجاج بالخردل' }, emoji: '🍗', mealType: 'diner', tags: ['proteine', 'gourmand'], timeMin: 30, kcal: 540, protein: 34, carbs: 45, fat: 22, ingredients: [{ id: 'poulet', qtyPerPerson: 130 }, { id: 'moutarde', qtyPerPerson: 10 }, { id: 'creme', qtyPerPerson: 40 }, { id: 'champignon', qtyPerPerson: 70 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'steak_hache_puree', name: { fr: 'Steak haché & purée', ar: 'ستيك مفروم وبطاطس مهروسة' }, emoji: '🥩', mealType: 'diner', tags: ['famille', 'proteine', 'rapide'], timeMin: 25, kcal: 560, protein: 32, carbs: 45, fat: 26, ingredients: [{ id: 'viande_hachee', qtyPerPerson: 130 }, { id: 'pomme_terre', qtyPerPerson: 220 }, { id: 'lait', qtyPerPerson: 50 }, { id: 'beurre', qtyPerPerson: 10 }, { id: 'oignon', qtyPerPerson: 0.3 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'carpaccio_boeuf', name: { fr: 'Carpaccio de bœuf', ar: 'كارباتشيو اللحم' }, emoji: '🥩', mealType: 'dejeuner', tags: ['gourmand', 'proteine'], timeMin: 15, kcal: 380, protein: 28, carbs: 15, fat: 24, ingredients: [{ id: 'boeuf', qtyPerPerson: 120 }, { id: 'roquette', qtyPerPerson: 0.4 }, { id: 'parmesan', qtyPerPerson: 15 }, { id: 'citron', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }, { id: 'pain', qtyPerPerson: 1 }], equipment: [], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: false },
  { id: 'roti_boeuf_legumes', name: { fr: 'Rôti de bœuf & légumes', ar: 'لحم بقري مشوي بالخضر' }, emoji: '🥩', mealType: 'diner', tags: ['famille', 'proteine', 'gourmand'], timeMin: 55, kcal: 600, protein: 40, carbs: 40, fat: 28, ingredients: [{ id: 'boeuf', qtyPerPerson: 160 }, { id: 'pomme_terre', qtyPerPerson: 180 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'huile_olive', qtyPerPerson: 10 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'brochettes_dinde', name: { fr: 'Brochettes de dinde marinée', ar: 'أسياخ الديك الرومي' }, emoji: '🍢', mealType: 'diner', tags: ['healthy', 'proteine'], timeMin: 25, kcal: 460, protein: 36, carbs: 40, fat: 14, ingredients: [{ id: 'dinde', qtyPerPerson: 150 }, { id: 'poivron', qtyPerPerson: 0.5 }, { id: 'courgette', qtyPerPerson: 0.5 }, { id: 'paprika', qtyPerPerson: 1 }, { id: 'riz', qtyPerPerson: 70 }], equipment: ['grill'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'hot_dog', name: { fr: 'Hot-dog maison', ar: 'هوت دوغ' }, emoji: '🌭', mealType: 'dejeuner', tags: ['rapide', 'gourmand'], timeMin: 15, kcal: 520, protein: 20, carbs: 45, fat: 30, ingredients: [{ id: 'pain_burger', qtyPerPerson: 1 }, { id: 'merguez', qtyPerPerson: 100 }, { id: 'moutarde', qtyPerPerson: 8 }, { id: 'oignon', qtyPerPerson: 0.3 }, { id: 'cheddar', qtyPerPerson: 20 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: false, pregnancySafe: true },

  // ================= STREET FOOD MONDE =================
  { id: 'samossa_legumes', name: { fr: 'Samoussas de légumes', ar: 'سمبوسة الخضر' }, emoji: '🥟', mealType: 'dejeuner', tags: ['du_monde', 'vegetarien'], timeMin: 35, kcal: 420, protein: 10, carbs: 55, fat: 18, ingredients: [{ id: 'feuille_brick', qtyPerPerson: 3 }, { id: 'pomme_terre', qtyPerPerson: 120 }, { id: 'petit_pois', qtyPerPerson: 40 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'curry', qtyPerPerson: 2 }], equipment: ['four', 'plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'nems_poulet', name: { fr: 'Nems au poulet', ar: 'نيمس بالدجاج' }, emoji: '🥢', mealType: 'dejeuner', tags: ['du_monde', 'gourmand'], timeMin: 40, kcal: 440, protein: 20, carbs: 45, fat: 20, ingredients: [{ id: 'feuille_riz', qtyPerPerson: 3 }, { id: 'poulet', qtyPerPerson: 80 }, { id: 'carotte', qtyPerPerson: 1 }, { id: 'champignon', qtyPerPerson: 40 }, { id: 'sauce_soja', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: false, pescetarian: false, glutenFree: true, lactoseFree: true, pregnancySafe: true },
  { id: 'empanadas', name: { fr: 'Empanadas au bœuf', ar: 'إمباناداس' }, emoji: '🥟', mealType: 'diner', tags: ['du_monde', 'famille', 'gourmand'], timeMin: 45, kcal: 560, protein: 24, carbs: 50, fat: 28, ingredients: [{ id: 'pate_pizza', qtyPerPerson: 120 }, { id: 'viande_hachee', qtyPerPerson: 90 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'oeuf', qtyPerPerson: 0.5 }, { id: 'olives', qtyPerPerson: 15 }], equipment: ['four'], vegetarian: false, pescetarian: false, glutenFree: false, lactoseFree: true, pregnancySafe: true },

  // ================= PETIT-DÉJEUNER (suite) =================
  { id: 'bagel_saumon', name: { fr: 'Bagel saumon & fromage frais', ar: 'بيغل بالسلمون' }, emoji: '🥯', mealType: 'petit_dejeuner', tags: ['gourmand', 'proteine'], timeMin: 10, kcal: 440, protein: 24, carbs: 40, fat: 20, ingredients: [{ id: 'pain', qtyPerPerson: 2 }, { id: 'saumon_fume', qtyPerPerson: 40 }, { id: 'fromage_frais', qtyPerPerson: 30 }, { id: 'concombre', qtyPerPerson: 0.2 }], equipment: [], vegetarian: false, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: false },
  { id: 'shakshuka_verte', name: { fr: 'Shakshuka verte', ar: 'شكشوكة خضراء' }, emoji: '🍳', mealType: 'petit_dejeuner', tags: ['du_monde', 'vegetarien', 'proteine'], timeMin: 20, kcal: 340, protein: 20, carbs: 15, fat: 22, ingredients: [{ id: 'oeuf', qtyPerPerson: 2 }, { id: 'epinard', qtyPerPerson: 80 }, { id: 'courgette', qtyPerPerson: 0.5 }, { id: 'oignon', qtyPerPerson: 0.5 }, { id: 'feta', qtyPerPerson: 30 }, { id: 'pain', qtyPerPerson: 1 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'muffins_myrtilles', name: { fr: 'Muffins aux fruits rouges', ar: 'مافن بالفواكه الحمراء' }, emoji: '🧁', mealType: 'petit_dejeuner', tags: ['gourmand', 'famille'], timeMin: 30, kcal: 400, protein: 10, carbs: 58, fat: 14, ingredients: [{ id: 'farine', qtyPerPerson: 60 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 80 }, { id: 'fruits_rouges', qtyPerPerson: 40 }, { id: 'sucre', qtyPerPerson: 15 }, { id: 'beurre', qtyPerPerson: 10 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'porridge_pomme', name: { fr: 'Porridge pomme-cannelle', ar: 'شوفان بالتفاح والقرفة' }, emoji: '🥣', mealType: 'petit_dejeuner', tags: ['healthy'], timeMin: 10, kcal: 380, protein: 12, carbs: 60, fat: 10, ingredients: [{ id: 'flocons_avoine', qtyPerPerson: 60 }, { id: 'lait', qtyPerPerson: 200 }, { id: 'pomme', qtyPerPerson: 1 }, { id: 'cannelle', qtyPerPerson: 1 }, { id: 'miel', qtyPerPerson: 10 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'oeufs_plat_tomate', name: { fr: 'Œufs au plat & tomates', ar: 'بيض مقلي بالطماطم' }, emoji: '🍳', mealType: 'petit_dejeuner', tags: ['rapide', 'proteine'], timeMin: 10, kcal: 320, protein: 18, carbs: 20, fat: 20, ingredients: [{ id: 'oeuf', qtyPerPerson: 2 }, { id: 'tomate', qtyPerPerson: 1 }, { id: 'pain', qtyPerPerson: 1 }, { id: 'huile_olive', qtyPerPerson: 6 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: true, pregnancySafe: true },
  { id: 'smoothie_fraise_banane', name: { fr: 'Smoothie fraise-banane', ar: 'سموذي الفراولة والموز' }, emoji: '🍓', mealType: 'petit_dejeuner', tags: ['rapide', 'healthy'], timeMin: 5, kcal: 280, protein: 10, carbs: 48, fat: 6, ingredients: [{ id: 'fruits_rouges', qtyPerPerson: 80 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'yaourt', qtyPerPerson: 1 }, { id: 'lait', qtyPerPerson: 100 }, { id: 'miel', qtyPerPerson: 10 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },

  // ================= DESSERTS (suite) =================
  { id: 'crumble_pomme', name: { fr: 'Crumble aux pommes', ar: 'كرامبل التفاح' }, emoji: '🍏', mealType: 'gouter', tags: ['gourmand', 'famille'], timeMin: 40, kcal: 400, protein: 5, carbs: 60, fat: 16, ingredients: [{ id: 'pomme', qtyPerPerson: 1.5 }, { id: 'farine', qtyPerPerson: 40 }, { id: 'beurre', qtyPerPerson: 20 }, { id: 'sucre', qtyPerPerson: 20 }, { id: 'cannelle', qtyPerPerson: 1 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'creme_caramel', name: { fr: 'Crème caramel', ar: 'كريم كراميل' }, emoji: '🍮', mealType: 'gouter', tags: ['gourmand', 'famille'], timeMin: 40, kcal: 300, protein: 9, carbs: 45, fat: 9, ingredients: [{ id: 'lait', qtyPerPerson: 180 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'sucre', qtyPerPerson: 25 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'panna_cotta', name: { fr: 'Panna cotta fruits rouges', ar: 'بانا كوتا' }, emoji: '🍮', mealType: 'gouter', tags: ['gourmand'], timeMin: 20, kcal: 340, protein: 5, carbs: 35, fat: 20, ingredients: [{ id: 'creme', qtyPerPerson: 120 }, { id: 'lait', qtyPerPerson: 60 }, { id: 'sucre', qtyPerPerson: 18 }, { id: 'fruits_rouges', qtyPerPerson: 40 }], equipment: ['plaque'], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: false, pregnancySafe: true },
  { id: 'cookies', name: { fr: 'Cookies au chocolat', ar: 'كوكيز الشوكولاطة' }, emoji: '🍪', mealType: 'gouter', tags: ['gourmand', 'famille'], timeMin: 25, kcal: 420, protein: 6, carbs: 55, fat: 20, ingredients: [{ id: 'farine', qtyPerPerson: 50 }, { id: 'chocolat', qtyPerPerson: 25 }, { id: 'beurre', qtyPerPerson: 20 }, { id: 'sucre', qtyPerPerson: 20 }, { id: 'oeuf', qtyPerPerson: 0.5 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'flan_patissier', name: { fr: 'Flan pâtissier', ar: 'فلان' }, emoji: '🍮', mealType: 'gouter', tags: ['gourmand', 'famille'], timeMin: 50, kcal: 360, protein: 9, carbs: 55, fat: 11, ingredients: [{ id: 'lait', qtyPerPerson: 180 }, { id: 'oeuf', qtyPerPerson: 1 }, { id: 'farine', qtyPerPerson: 25 }, { id: 'sucre', qtyPerPerson: 20 }], equipment: ['four'], vegetarian: true, pescetarian: true, glutenFree: false, lactoseFree: false, pregnancySafe: true },
  { id: 'brochettes_fruits', name: { fr: 'Brochettes de fruits', ar: 'أسياخ الفواكه' }, emoji: '🍡', mealType: 'gouter', tags: ['healthy', 'rapide'], timeMin: 10, kcal: 180, protein: 3, carbs: 42, fat: 1, ingredients: [{ id: 'fruits_rouges', qtyPerPerson: 60 }, { id: 'banane', qtyPerPerson: 1 }, { id: 'mangue', qtyPerPerson: 0.5 }, { id: 'pomme', qtyPerPerson: 0.5 }], equipment: [], vegetarian: true, pescetarian: true, glutenFree: true, lactoseFree: true, pregnancySafe: true },
]

export const recipeMap: Record<string, Recipe> = Object.fromEntries(
  RECIPES.map((r) => [r.id, r]),
)
export const getRecipe = (id: string): Recipe | undefined => recipeMap[id]
