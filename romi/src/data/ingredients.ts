import type { Ingredient } from './types'

// Reference prices in MAD. `g` -> price per kg, `ml` -> price per litre,
// `piece` -> price per piece. Values are realistic-ish Moroccan retail prices.
export const INGREDIENTS: Ingredient[] = [
  // --- Viande & poisson ---
  { id: 'poulet', name: { fr: 'filet de poulet', ar: 'صدر دجاج' }, emoji: '🍗', category: 'viande_poisson', unit: 'g', basePrice: 68, allergens: [] },
  { id: 'viande_hachee', name: { fr: 'viande hachée', ar: 'لحم مفروم' }, emoji: '🥩', category: 'viande_poisson', unit: 'g', basePrice: 95, allergens: [] },
  { id: 'thon', name: { fr: 'thon', ar: 'تونة' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 90, allergens: ['poisson'] },
  { id: 'sardines', name: { fr: 'sardines', ar: 'سردين' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 35, allergens: ['poisson'] },
  { id: 'saumon', name: { fr: 'saumon', ar: 'سلمون' }, emoji: '🍣', category: 'viande_poisson', unit: 'g', basePrice: 140, allergens: ['poisson'] },
  { id: 'oeuf', name: { fr: 'œufs', ar: 'بيض' }, emoji: '🥚', category: 'cremerie', unit: 'piece', basePrice: 1.6, gramsPerPiece: 55, allergens: ['oeuf'] },

  // --- Fruits & légumes ---
  { id: 'carotte', name: { fr: 'carotte', ar: 'جزر' }, emoji: '🥕', category: 'fruits_legumes', unit: 'piece', basePrice: 0.7, gramsPerPiece: 80, allergens: [] },
  { id: 'concombre', name: { fr: 'concombre', ar: 'خيار' }, emoji: '🥒', category: 'fruits_legumes', unit: 'piece', basePrice: 2.5, gramsPerPiece: 300, allergens: [] },
  { id: 'echalote', name: { fr: 'échalote', ar: 'بصيلة' }, emoji: '🧅', category: 'fruits_legumes', unit: 'piece', basePrice: 1, gramsPerPiece: 40, allergens: [] },
  { id: 'oignon', name: { fr: 'oignon', ar: 'بصل' }, emoji: '🧅', category: 'fruits_legumes', unit: 'piece', basePrice: 1.2, gramsPerPiece: 110, allergens: [] },
  { id: 'ail', name: { fr: 'ail', ar: 'ثوم' }, emoji: '🧄', category: 'fruits_legumes', unit: 'piece', basePrice: 0.8, gramsPerPiece: 5, allergens: [] },
  { id: 'tomate', name: { fr: 'tomate', ar: 'طماطم' }, emoji: '🍅', category: 'fruits_legumes', unit: 'piece', basePrice: 1.4, gramsPerPiece: 120, allergens: [] },
  { id: 'tomate_concassee', name: { fr: 'tomates concassées', ar: 'طماطم مقشرة' }, emoji: '🥫', category: 'epicerie', unit: 'g', basePrice: 18, allergens: [] },
  { id: 'poivron', name: { fr: 'poivron', ar: 'فلفل حلو' }, emoji: '🫑', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 150, allergens: [] },
  { id: 'courge', name: { fr: 'courge butternut', ar: 'قرع' }, emoji: '🎃', category: 'fruits_legumes', unit: 'g', basePrice: 9, allergens: [] },
  { id: 'courgette', name: { fr: 'courgette', ar: 'كوسة' }, emoji: '🥒', category: 'fruits_legumes', unit: 'piece', basePrice: 2.2, gramsPerPiece: 200, allergens: [] },
  { id: 'salade', name: { fr: 'salade verte', ar: 'خس' }, emoji: '🥬', category: 'fruits_legumes', unit: 'piece', basePrice: 4, gramsPerPiece: 300, allergens: [] },
  { id: 'chou_rouge', name: { fr: 'chou rouge', ar: 'كرنب أحمر' }, emoji: '🥬', category: 'fruits_legumes', unit: 'g', basePrice: 8, allergens: [] },
  { id: 'pomme_terre', name: { fr: 'pommes de terre', ar: 'بطاطس' }, emoji: '🥔', category: 'fruits_legumes', unit: 'g', basePrice: 6, allergens: [] },
  { id: 'citron', name: { fr: 'citron', ar: 'ليمون' }, emoji: '🍋', category: 'fruits_legumes', unit: 'piece', basePrice: 1.5, gramsPerPiece: 90, allergens: [] },
  { id: 'avocat', name: { fr: 'avocat', ar: 'أفوكادو' }, emoji: '🥑', category: 'fruits_legumes', unit: 'piece', basePrice: 6, gramsPerPiece: 170, allergens: [] },
  { id: 'banane', name: { fr: 'banane', ar: 'موز' }, emoji: '🍌', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 120, allergens: [] },
  { id: 'pomme', name: { fr: 'pomme', ar: 'تفاح' }, emoji: '🍎', category: 'fruits_legumes', unit: 'piece', basePrice: 2.5, gramsPerPiece: 150, allergens: [] },
  { id: 'epinard', name: { fr: 'épinards', ar: 'سبانخ' }, emoji: '🥬', category: 'fruits_legumes', unit: 'g', basePrice: 14, allergens: [] },
  { id: 'petit_pois', name: { fr: 'petits pois', ar: 'جلبانة' }, emoji: '🟢', category: 'fruits_legumes', unit: 'g', basePrice: 16, allergens: [] },

  // --- Crèmerie ---
  { id: 'creme', name: { fr: 'crème fraîche', ar: 'كريمة طازجة' }, emoji: '🥛', category: 'cremerie', unit: 'ml', basePrice: 22, allergens: ['lactose'] },
  { id: 'lait', name: { fr: 'lait', ar: 'حليب' }, emoji: '🥛', category: 'cremerie', unit: 'ml', basePrice: 8, allergens: ['lactose'] },
  { id: 'brie', name: { fr: 'brie', ar: 'جبن بري' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 95, allergens: ['lactose'] },
  { id: 'parmesan', name: { fr: 'parmesan', ar: 'بارميزان' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 160, allergens: ['lactose'] },
  { id: 'yaourt', name: { fr: 'yaourt nature', ar: 'زبادي' }, emoji: '🥛', category: 'cremerie', unit: 'piece', basePrice: 2.2, gramsPerPiece: 125, allergens: ['lactose'] },
  { id: 'fromage_frais', name: { fr: 'fromage frais', ar: 'جبن طري' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 60, allergens: ['lactose'] },
  { id: 'beurre', name: { fr: 'beurre', ar: 'زبدة' }, emoji: '🧈', category: 'cremerie', unit: 'g', basePrice: 90, allergens: ['lactose'] },

  // --- Épicerie ---
  { id: 'riz', name: { fr: 'riz', ar: 'أرز' }, emoji: '🍚', category: 'epicerie', unit: 'g', basePrice: 16, allergens: [] },
  { id: 'quinoa', name: { fr: 'quinoa', ar: 'كينوا' }, emoji: '🌾', category: 'epicerie', unit: 'g', basePrice: 65, allergens: [] },
  { id: 'pates', name: { fr: 'pâtes', ar: 'معكرونة' }, emoji: '🍝', category: 'epicerie', unit: 'g', basePrice: 14, allergens: ['gluten'] },
  { id: 'gnocchi', name: { fr: 'gnocchis', ar: 'نيوكي' }, emoji: '🥟', category: 'epicerie', unit: 'g', basePrice: 32, allergens: ['gluten'] },
  { id: 'lentilles', name: { fr: 'lentilles', ar: 'عدس' }, emoji: '🫘', category: 'epicerie', unit: 'g', basePrice: 20, allergens: [] },
  { id: 'pois_chiche', name: { fr: 'pois chiches', ar: 'حمص' }, emoji: '🫘', category: 'epicerie', unit: 'g', basePrice: 18, allergens: [] },
  { id: 'huile_olive', name: { fr: "huile d'olive", ar: 'زيت الزيتون' }, emoji: '🫒', category: 'epicerie', unit: 'ml', basePrice: 70, allergens: [] },
  { id: 'sauce_soja', name: { fr: 'sauce soja', ar: 'صلصة الصويا' }, emoji: '🥢', category: 'epicerie', unit: 'ml', basePrice: 45, allergens: ['soja', 'gluten'] },
  { id: 'lait_coco', name: { fr: 'lait de coco', ar: 'حليب جوز الهند' }, emoji: '🥥', category: 'epicerie', unit: 'ml', basePrice: 30, allergens: [] },
  { id: 'miel', name: { fr: 'miel', ar: 'عسل' }, emoji: '🍯', category: 'epicerie', unit: 'g', basePrice: 90, allergens: [] },
  { id: 'flocons_avoine', name: { fr: "flocons d'avoine", ar: 'شوفان' }, emoji: '🥣', category: 'epicerie', unit: 'g', basePrice: 22, allergens: ['gluten'] },
  { id: 'amandes', name: { fr: 'amandes', ar: 'لوز' }, emoji: '🌰', category: 'epicerie', unit: 'g', basePrice: 120, allergens: ['fruits_coque'] },
  { id: 'concentre_tomate', name: { fr: 'concentré de tomate', ar: 'معجون الطماطم' }, emoji: '🥫', category: 'epicerie', unit: 'g', basePrice: 22, allergens: [] },

  // --- Boulangerie ---
  { id: 'pain', name: { fr: 'pain de campagne', ar: 'خبز' }, emoji: '🍞', category: 'boulangerie', unit: 'piece', basePrice: 1.2, gramsPerPiece: 50, allergens: ['gluten'] },
  { id: 'tortilla', name: { fr: 'tortillas', ar: 'خبز تورتيا' }, emoji: '🫓', category: 'boulangerie', unit: 'piece', basePrice: 3, gramsPerPiece: 60, allergens: ['gluten'] },

  // --- Épices ---
  { id: 'curry', name: { fr: 'curry', ar: 'كاري' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 80, allergens: [] },
  { id: 'paprika', name: { fr: 'paprika', ar: 'بابريكا' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 60, allergens: [] },
  { id: 'cumin', name: { fr: 'cumin', ar: 'كمون' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 70, allergens: [] },
  { id: 'coriandre', name: { fr: 'coriandre', ar: 'كزبرة' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 30, allergens: [] },
]

export const getIngredient = (id: string): Ingredient | undefined =>
  INGREDIENTS.find((i) => i.id === id)

const ING_MAP: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
)
export const ingredientMap = ING_MAP
