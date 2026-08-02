import type { Ingredient } from './types'

// Reference prices in MAD. `g` -> price per kg, `ml` -> price per litre,
// `piece` -> price per piece. `soldBy` drives realistic shopping cost:
//   weight = pay the exact grams (butcher/deli/loose produce)
//   piece  = round up to whole units
//   pack   = buy whole packs of `packSize` (pantry, cans, pots, spices…)
export const INGREDIENTS: Ingredient[] = [
  // --- Viande & poisson ---
  { id: 'poulet', name: { fr: 'filet de poulet', ar: 'صدر دجاج' }, emoji: '🍗', category: 'viande_poisson', unit: 'g', basePrice: 68, soldBy: 'weight', allergens: [] },
  { id: 'viande_hachee', name: { fr: 'viande hachée', ar: 'لحم مفروم' }, emoji: '🥩', category: 'viande_poisson', unit: 'g', basePrice: 95, soldBy: 'weight', allergens: [] },
  { id: 'thon', name: { fr: 'thon (boîte)', ar: 'تونة (علبة)' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 140, allergens: ['poisson'] },
  { id: 'sardines', name: { fr: 'sardines (boîte)', ar: 'سردين (علبة)' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 35, soldBy: 'pack', packSize: 120, allergens: ['poisson'] },
  { id: 'saumon', name: { fr: 'saumon', ar: 'سلمون' }, emoji: '🍣', category: 'viande_poisson', unit: 'g', basePrice: 140, soldBy: 'weight', allergens: ['poisson'] },
  { id: 'oeuf', name: { fr: 'œufs', ar: 'بيض' }, emoji: '🥚', category: 'cremerie', unit: 'piece', basePrice: 1.6, gramsPerPiece: 55, soldBy: 'piece', allergens: ['oeuf'] },

  // --- Fruits & légumes ---
  { id: 'carotte', name: { fr: 'carotte', ar: 'جزر' }, emoji: '🥕', category: 'fruits_legumes', unit: 'piece', basePrice: 0.7, gramsPerPiece: 80, soldBy: 'piece', allergens: [] },
  { id: 'concombre', name: { fr: 'concombre', ar: 'خيار' }, emoji: '🥒', category: 'fruits_legumes', unit: 'piece', basePrice: 2.5, gramsPerPiece: 300, soldBy: 'piece', allergens: [] },
  { id: 'echalote', name: { fr: 'échalote', ar: 'بصيلة' }, emoji: '🧅', category: 'fruits_legumes', unit: 'piece', basePrice: 1, gramsPerPiece: 40, soldBy: 'piece', allergens: [] },
  { id: 'oignon', name: { fr: 'oignon', ar: 'بصل' }, emoji: '🧅', category: 'fruits_legumes', unit: 'piece', basePrice: 1.2, gramsPerPiece: 110, soldBy: 'piece', allergens: [] },
  { id: 'ail', name: { fr: 'ail (gousse)', ar: 'ثوم' }, emoji: '🧄', category: 'fruits_legumes', unit: 'piece', basePrice: 0.8, gramsPerPiece: 5, soldBy: 'piece', allergens: [] },
  { id: 'tomate', name: { fr: 'tomate', ar: 'طماطم' }, emoji: '🍅', category: 'fruits_legumes', unit: 'piece', basePrice: 1.4, gramsPerPiece: 120, soldBy: 'piece', allergens: [] },
  { id: 'tomate_concassee', name: { fr: 'tomates concassées (boîte)', ar: 'طماطم مقشرة (علبة)' }, emoji: '🥫', category: 'epicerie', unit: 'g', basePrice: 18, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'poivron', name: { fr: 'poivron', ar: 'فلفل حلو' }, emoji: '🫑', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 150, soldBy: 'piece', allergens: [] },
  { id: 'courge', name: { fr: 'courge butternut', ar: 'قرع' }, emoji: '🎃', category: 'fruits_legumes', unit: 'g', basePrice: 9, soldBy: 'weight', allergens: [] },
  { id: 'courgette', name: { fr: 'courgette', ar: 'كوسة' }, emoji: '🥒', category: 'fruits_legumes', unit: 'piece', basePrice: 2.2, gramsPerPiece: 200, soldBy: 'piece', allergens: [] },
  { id: 'salade', name: { fr: 'salade verte', ar: 'خس' }, emoji: '🥬', category: 'fruits_legumes', unit: 'piece', basePrice: 4, gramsPerPiece: 300, soldBy: 'piece', allergens: [] },
  { id: 'chou_rouge', name: { fr: 'chou rouge', ar: 'كرنب أحمر' }, emoji: '🥬', category: 'fruits_legumes', unit: 'g', basePrice: 8, soldBy: 'weight', allergens: [] },
  { id: 'pomme_terre', name: { fr: 'pommes de terre', ar: 'بطاطس' }, emoji: '🥔', category: 'fruits_legumes', unit: 'g', basePrice: 6, soldBy: 'weight', allergens: [] },
  { id: 'citron', name: { fr: 'citron', ar: 'ليمون' }, emoji: '🍋', category: 'fruits_legumes', unit: 'piece', basePrice: 1.5, gramsPerPiece: 90, soldBy: 'piece', allergens: [] },
  { id: 'avocat', name: { fr: 'avocat', ar: 'أفوكادو' }, emoji: '🥑', category: 'fruits_legumes', unit: 'piece', basePrice: 6, gramsPerPiece: 170, soldBy: 'piece', allergens: [] },
  { id: 'banane', name: { fr: 'banane', ar: 'موز' }, emoji: '🍌', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 120, soldBy: 'piece', allergens: [] },
  { id: 'pomme', name: { fr: 'pomme', ar: 'تفاح' }, emoji: '🍎', category: 'fruits_legumes', unit: 'piece', basePrice: 2.5, gramsPerPiece: 150, soldBy: 'piece', allergens: [] },
  { id: 'epinard', name: { fr: 'épinards', ar: 'سبانخ' }, emoji: '🥬', category: 'fruits_legumes', unit: 'g', basePrice: 14, soldBy: 'weight', allergens: [] },
  { id: 'petit_pois', name: { fr: 'petits pois (boîte)', ar: 'جلبانة (علبة)' }, emoji: '🟢', category: 'fruits_legumes', unit: 'g', basePrice: 16, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'coriandre', name: { fr: 'coriandre (botte)', ar: 'كزبرة' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 30, soldBy: 'piece', allergens: [] },

  // --- Crèmerie ---
  { id: 'creme', name: { fr: 'crème fraîche (pot)', ar: 'كريمة طازجة (علبة)' }, emoji: '🥛', category: 'cremerie', unit: 'ml', basePrice: 22, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },
  { id: 'lait', name: { fr: 'lait (1 L)', ar: 'حليب (لتر)' }, emoji: '🥛', category: 'cremerie', unit: 'ml', basePrice: 8, soldBy: 'pack', packSize: 1000, allergens: ['lactose'] },
  { id: 'brie', name: { fr: 'brie', ar: 'جبن بري' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 95, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },
  { id: 'parmesan', name: { fr: 'parmesan', ar: 'بارميزان' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 160, soldBy: 'pack', packSize: 100, allergens: ['lactose'] },
  { id: 'yaourt', name: { fr: 'yaourt nature', ar: 'زبادي' }, emoji: '🥛', category: 'cremerie', unit: 'piece', basePrice: 2.2, gramsPerPiece: 125, soldBy: 'piece', allergens: ['lactose'] },
  { id: 'fromage_frais', name: { fr: 'fromage frais (pot)', ar: 'جبن طري (علبة)' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },
  { id: 'beurre', name: { fr: 'beurre (plaquette)', ar: 'زبدة' }, emoji: '🧈', category: 'cremerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 250, allergens: ['lactose'] },

  // --- Épicerie (packs / pots / paquets) ---
  { id: 'riz', name: { fr: 'riz (paquet)', ar: 'أرز (كيس)' }, emoji: '🍚', category: 'epicerie', unit: 'g', basePrice: 16, soldBy: 'pack', packSize: 1000, allergens: [] },
  { id: 'quinoa', name: { fr: 'quinoa (paquet)', ar: 'كينوا (كيس)' }, emoji: '🌾', category: 'epicerie', unit: 'g', basePrice: 65, soldBy: 'pack', packSize: 500, allergens: [] },
  { id: 'pates', name: { fr: 'pâtes (paquet)', ar: 'معكرونة (كيس)' }, emoji: '🍝', category: 'epicerie', unit: 'g', basePrice: 14, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'gnocchi', name: { fr: 'gnocchis (paquet)', ar: 'نيوكي (كيس)' }, emoji: '🥟', category: 'epicerie', unit: 'g', basePrice: 32, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'lentilles', name: { fr: 'lentilles (paquet)', ar: 'عدس (كيس)' }, emoji: '🫘', category: 'epicerie', unit: 'g', basePrice: 20, soldBy: 'pack', packSize: 500, allergens: [] },
  { id: 'pois_chiche', name: { fr: 'pois chiches (boîte)', ar: 'حمص (علبة)' }, emoji: '🫘', category: 'epicerie', unit: 'g', basePrice: 18, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'huile_olive', name: { fr: "huile d'olive (bouteille)", ar: 'زيت الزيتون (قنينة)' }, emoji: '🫒', category: 'epicerie', unit: 'ml', basePrice: 70, soldBy: 'pack', packSize: 1000, allergens: [] },
  { id: 'sauce_soja', name: { fr: 'sauce soja (bouteille)', ar: 'صلصة الصويا (قنينة)' }, emoji: '🥢', category: 'epicerie', unit: 'ml', basePrice: 45, soldBy: 'pack', packSize: 250, allergens: ['soja', 'gluten'] },
  { id: 'lait_coco', name: { fr: 'lait de coco (boîte)', ar: 'حليب جوز الهند (علبة)' }, emoji: '🥥', category: 'epicerie', unit: 'ml', basePrice: 30, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'miel', name: { fr: 'miel (pot)', ar: 'عسل (مرطبان)' }, emoji: '🍯', category: 'epicerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'flocons_avoine', name: { fr: "flocons d'avoine (paquet)", ar: 'شوفان (كيس)' }, emoji: '🥣', category: 'epicerie', unit: 'g', basePrice: 22, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'amandes', name: { fr: 'amandes (paquet)', ar: 'لوز (كيس)' }, emoji: '🌰', category: 'epicerie', unit: 'g', basePrice: 120, soldBy: 'pack', packSize: 200, allergens: ['fruits_coque'] },
  { id: 'concentre_tomate', name: { fr: 'concentré de tomate (boîte)', ar: 'معجون الطماطم (علبة)' }, emoji: '🥫', category: 'epicerie', unit: 'g', basePrice: 22, soldBy: 'pack', packSize: 140, allergens: [] },

  // --- Boulangerie ---
  { id: 'pain', name: { fr: 'pain', ar: 'خبز' }, emoji: '🍞', category: 'boulangerie', unit: 'piece', basePrice: 1.2, gramsPerPiece: 50, soldBy: 'piece', allergens: ['gluten'] },
  { id: 'tortilla', name: { fr: 'tortillas (paquet)', ar: 'خبز تورتيا (كيس)' }, emoji: '🫓', category: 'boulangerie', unit: 'piece', basePrice: 3, gramsPerPiece: 60, soldBy: 'pack', packSize: 8, allergens: ['gluten'] },

  // --- Épices (flacons) ---
  { id: 'curry', name: { fr: 'curry (flacon)', ar: 'كاري (علبة)' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 80, soldBy: 'pack', packSize: 40, allergens: [] },
  { id: 'paprika', name: { fr: 'paprika (flacon)', ar: 'بابريكا (علبة)' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 40, allergens: [] },
  { id: 'cumin', name: { fr: 'cumin (flacon)', ar: 'كمون (علبة)' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 70, soldBy: 'pack', packSize: 40, allergens: [] },

  // --- Premium & extended range (price study, MAD) ---
  { id: 'entrecote', name: { fr: 'entrecôte de bœuf', ar: 'شريحة لحم بقري' }, emoji: '🥩', category: 'viande_poisson', unit: 'g', basePrice: 150, soldBy: 'weight', allergens: [] },
  { id: 'agneau', name: { fr: "épaule d'agneau", ar: 'لحم الضأن' }, emoji: '🍖', category: 'viande_poisson', unit: 'g', basePrice: 120, soldBy: 'weight', allergens: [] },
  { id: 'dinde', name: { fr: 'escalope de dinde', ar: 'صدر ديك رومي' }, emoji: '🍗', category: 'viande_poisson', unit: 'g', basePrice: 65, soldBy: 'weight', allergens: [] },
  { id: 'crevettes', name: { fr: 'crevettes', ar: 'قمرون' }, emoji: '🦐', category: 'viande_poisson', unit: 'g', basePrice: 140, soldBy: 'weight', allergens: ['crustace'] },
  { id: 'dorade', name: { fr: 'dorade', ar: 'قرب' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 75, soldBy: 'weight', allergens: ['poisson'] },
  { id: 'saumon_fume', name: { fr: 'saumon fumé', ar: 'سلمون مدخن' }, emoji: '🍣', category: 'viande_poisson', unit: 'g', basePrice: 220, soldBy: 'pack', packSize: 100, allergens: ['poisson'] },
  { id: 'champignon', name: { fr: 'champignons', ar: 'فطر' }, emoji: '🍄', category: 'fruits_legumes', unit: 'g', basePrice: 22, soldBy: 'weight', allergens: [] },
  { id: 'patate_douce', name: { fr: 'patate douce', ar: 'بطاطا حلوة' }, emoji: '🍠', category: 'fruits_legumes', unit: 'g', basePrice: 10, soldBy: 'weight', allergens: [] },
  { id: 'roquette', name: { fr: 'roquette (sachet)', ar: 'جرجير (كيس)' }, emoji: '🥬', category: 'fruits_legumes', unit: 'piece', basePrice: 6, gramsPerPiece: 125, soldBy: 'piece', allergens: [] },
  { id: 'fruits_rouges', name: { fr: 'fruits rouges', ar: 'فواكه حمراء' }, emoji: '🍓', category: 'fruits_legumes', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'mozzarella', name: { fr: 'mozzarella', ar: 'موزاريلا' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 100, soldBy: 'pack', packSize: 125, allergens: ['lactose'] },
  { id: 'feta', name: { fr: 'feta', ar: 'جبن فيتا' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },
  { id: 'semoule', name: { fr: 'semoule (paquet)', ar: 'سميد (كيس)' }, emoji: '🌾', category: 'epicerie', unit: 'g', basePrice: 14, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'farine', name: { fr: 'farine (paquet)', ar: 'دقيق (كيس)' }, emoji: '🌾', category: 'epicerie', unit: 'g', basePrice: 8, soldBy: 'pack', packSize: 1000, allergens: ['gluten'] },
  { id: 'haricots_rouges', name: { fr: 'haricots rouges (boîte)', ar: 'لوبيا حمراء (علبة)' }, emoji: '🫘', category: 'epicerie', unit: 'g', basePrice: 18, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'dattes', name: { fr: 'dattes (paquet)', ar: 'تمر (كيس)' }, emoji: '🌴', category: 'epicerie', unit: 'g', basePrice: 45, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'pain_burger', name: { fr: 'pains burger (x4)', ar: 'خبز برغر (x4)' }, emoji: '🍔', category: 'boulangerie', unit: 'piece', basePrice: 2.5, gramsPerPiece: 70, soldBy: 'pack', packSize: 4, allergens: ['gluten'] },
  { id: 'pate_pizza', name: { fr: 'pâte à pizza', ar: 'عجينة بيتزا' }, emoji: '🍕', category: 'boulangerie', unit: 'g', basePrice: 25, soldBy: 'pack', packSize: 260, allergens: ['gluten'] },
]

export const getIngredient = (id: string): Ingredient | undefined =>
  INGREDIENTS.find((i) => i.id === id)

const ING_MAP: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
)
export const ingredientMap = ING_MAP
