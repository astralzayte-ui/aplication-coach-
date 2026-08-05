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
  { id: 'saumon', name: { fr: 'saumon', ar: 'سلمون' }, emoji: '🍣', category: 'viande_poisson', unit: 'g', basePrice: 180, soldBy: 'weight', allergens: ['poisson'] },
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
  { id: 'saumon_fume', name: { fr: 'saumon fumé', ar: 'سلمون مدخن' }, emoji: '🍣', category: 'viande_poisson', unit: 'g', basePrice: 600, soldBy: 'pack', packSize: 100, allergens: ['poisson'] },
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

  // ===== Extended pantry for the large recipe library =====
  // --- Viande & poisson ---
  { id: 'boeuf', name: { fr: 'bœuf à mijoter', ar: 'لحم بقري' }, emoji: '🥩', category: 'viande_poisson', unit: 'g', basePrice: 110, soldBy: 'weight', allergens: [] },
  { id: 'veau', name: { fr: 'veau', ar: 'لحم العجل' }, emoji: '🥩', category: 'viande_poisson', unit: 'g', basePrice: 130, soldBy: 'weight', allergens: [] },
  { id: 'magret_canard', name: { fr: 'magret de canard', ar: 'صدر بط' }, emoji: '🦆', category: 'viande_poisson', unit: 'g', basePrice: 160, soldBy: 'weight', allergens: [] },
  { id: 'merguez', name: { fr: 'merguez', ar: 'مرقاز' }, emoji: '🌭', category: 'viande_poisson', unit: 'g', basePrice: 80, soldBy: 'weight', allergens: [] },
  { id: 'jambon_dinde', name: { fr: 'blanc de dinde', ar: 'شرائح ديك رومي' }, emoji: '🍗', category: 'viande_poisson', unit: 'g', basePrice: 70, soldBy: 'pack', packSize: 200, allergens: [] },
  { id: 'thon_frais', name: { fr: 'thon frais', ar: 'تونة طازجة' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 130, soldBy: 'weight', allergens: ['poisson'] },
  { id: 'saint_jacques', name: { fr: 'noix de Saint-Jacques', ar: 'الإسكالوب' }, emoji: '🦪', category: 'viande_poisson', unit: 'g', basePrice: 380, soldBy: 'weight', allergens: ['crustace'] },
  { id: 'gambas', name: { fr: 'gambas', ar: 'قمرون كبير' }, emoji: '🦐', category: 'viande_poisson', unit: 'g', basePrice: 170, soldBy: 'weight', allergens: ['crustace'] },
  { id: 'moules', name: { fr: 'moules', ar: 'بوزروگ' }, emoji: '🦪', category: 'viande_poisson', unit: 'g', basePrice: 30, soldBy: 'weight', allergens: ['crustace'] },
  { id: 'calamar', name: { fr: 'calamars', ar: 'حبار' }, emoji: '🦑', category: 'viande_poisson', unit: 'g', basePrice: 60, soldBy: 'weight', allergens: ['crustace'] },
  { id: 'homard', name: { fr: 'homard', ar: 'كركند' }, emoji: '🦞', category: 'viande_poisson', unit: 'piece', basePrice: 190, gramsPerPiece: 450, soldBy: 'piece', allergens: ['crustace'] },

  // --- Fruits & légumes ---
  { id: 'aubergine', name: { fr: 'aubergine', ar: 'باذنجان' }, emoji: '🍆', category: 'fruits_legumes', unit: 'piece', basePrice: 3, gramsPerPiece: 250, soldBy: 'piece', allergens: [] },
  { id: 'brocoli', name: { fr: 'brocoli', ar: 'بروكلي' }, emoji: '🥦', category: 'fruits_legumes', unit: 'g', basePrice: 16, soldBy: 'weight', allergens: [] },
  { id: 'chou_fleur', name: { fr: 'chou-fleur', ar: 'قرنبيط' }, emoji: '🥦', category: 'fruits_legumes', unit: 'g', basePrice: 12, soldBy: 'weight', allergens: [] },
  { id: 'haricots_verts', name: { fr: 'haricots verts', ar: 'لوبيا خضراء' }, emoji: '🫛', category: 'fruits_legumes', unit: 'g', basePrice: 18, soldBy: 'weight', allergens: [] },
  { id: 'poireau', name: { fr: 'poireau', ar: 'كراث' }, emoji: '🥬', category: 'fruits_legumes', unit: 'piece', basePrice: 2.5, gramsPerPiece: 150, soldBy: 'piece', allergens: [] },
  { id: 'betterave', name: { fr: 'betterave', ar: 'بربة' }, emoji: '🫜', category: 'fruits_legumes', unit: 'g', basePrice: 10, soldBy: 'weight', allergens: [] },
  { id: 'asperges', name: { fr: 'asperges', ar: 'هليون' }, emoji: '🌿', category: 'fruits_legumes', unit: 'g', basePrice: 40, soldBy: 'weight', allergens: [] },
  { id: 'gingembre', name: { fr: 'gingembre', ar: 'زنجبيل' }, emoji: '🫚', category: 'fruits_legumes', unit: 'piece', basePrice: 3, gramsPerPiece: 30, soldBy: 'piece', allergens: [] },
  { id: 'persil', name: { fr: 'persil (botte)', ar: 'معدنوس' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 30, soldBy: 'piece', allergens: [] },
  { id: 'menthe', name: { fr: 'menthe (botte)', ar: 'نعناع' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 20, soldBy: 'piece', allergens: [] },
  { id: 'basilic', name: { fr: 'basilic', ar: 'حبق' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 8, gramsPerPiece: 20, soldBy: 'piece', allergens: [] },
  { id: 'tomate_cerise', name: { fr: 'tomates cerises (barquette)', ar: 'طماطم كرزية' }, emoji: '🍅', category: 'fruits_legumes', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'olives', name: { fr: 'olives (bocal)', ar: 'زيتون' }, emoji: '🫒', category: 'fruits_legumes', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 200, allergens: [] },
  { id: 'mais', name: { fr: 'maïs (boîte)', ar: 'ذرة (علبة)' }, emoji: '🌽', category: 'fruits_legumes', unit: 'g', basePrice: 15, soldBy: 'pack', packSize: 300, allergens: [] },
  { id: 'mangue', name: { fr: 'mangue', ar: 'مانجو' }, emoji: '🥭', category: 'fruits_legumes', unit: 'piece', basePrice: 8, gramsPerPiece: 200, soldBy: 'piece', allergens: [] },
  { id: 'orange', name: { fr: 'orange', ar: 'برتقال' }, emoji: '🍊', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 180, soldBy: 'piece', allergens: [] },

  // --- Crèmerie ---
  { id: 'yaourt_grec', name: { fr: 'yaourt grec (pot)', ar: 'زبادي يوناني' }, emoji: '🥛', category: 'cremerie', unit: 'g', basePrice: 75, soldBy: 'pack', packSize: 400, allergens: ['lactose'] },
  { id: 'ricotta', name: { fr: 'ricotta', ar: 'ريكوتا' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 250, allergens: ['lactose'] },
  { id: 'cheddar', name: { fr: 'cheddar', ar: 'شيدر' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },
  { id: 'paneer', name: { fr: 'paneer', ar: 'بانير' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },

  // --- Épicerie ---
  { id: 'nouilles', name: { fr: 'nouilles chinoises (paquet)', ar: 'نودلز' }, emoji: '🍜', category: 'epicerie', unit: 'g', basePrice: 20, soldBy: 'pack', packSize: 250, allergens: ['gluten'] },
  { id: 'nouilles_riz', name: { fr: 'nouilles de riz (paquet)', ar: 'نودلز الأرز' }, emoji: '🍜', category: 'epicerie', unit: 'g', basePrice: 30, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'vermicelle', name: { fr: 'vermicelles (paquet)', ar: 'شعرية' }, emoji: '🍝', category: 'epicerie', unit: 'g', basePrice: 16, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'pate_lasagne', name: { fr: 'pâtes à lasagne (paquet)', ar: 'لازانيا' }, emoji: '🍝', category: 'epicerie', unit: 'g', basePrice: 18, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'boulgour', name: { fr: 'boulgour (paquet)', ar: 'برغل' }, emoji: '🌾', category: 'epicerie', unit: 'g', basePrice: 22, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'polenta', name: { fr: 'polenta (paquet)', ar: 'بولنتا' }, emoji: '🌽', category: 'epicerie', unit: 'g', basePrice: 20, soldBy: 'pack', packSize: 500, allergens: [] },
  { id: 'haricots_blancs', name: { fr: 'haricots blancs (boîte)', ar: 'لوبيا بيضاء (علبة)' }, emoji: '🫘', category: 'epicerie', unit: 'g', basePrice: 18, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'graines_chia', name: { fr: 'graines de chia (paquet)', ar: 'بذور الشيا' }, emoji: '🌱', category: 'epicerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 200, allergens: [] },
  { id: 'tofu', name: { fr: 'tofu', ar: 'توفو' }, emoji: '🧈', category: 'epicerie', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 250, allergens: ['soja'] },
  { id: 'edamame', name: { fr: 'edamame', ar: 'إدامامي' }, emoji: '🫛', category: 'epicerie', unit: 'g', basePrice: 45, soldBy: 'pack', packSize: 300, allergens: ['soja'] },
  { id: 'beurre_cacahuete', name: { fr: 'beurre de cacahuète (pot)', ar: 'زبدة الفول السوداني' }, emoji: '🥜', category: 'epicerie', unit: 'g', basePrice: 55, soldBy: 'pack', packSize: 340, allergens: ['arachide'] },
  { id: 'noix', name: { fr: 'noix (paquet)', ar: 'جوز' }, emoji: '🌰', category: 'epicerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 200, allergens: ['fruits_coque'] },
  { id: 'pruneaux', name: { fr: 'pruneaux (paquet)', ar: 'برقوق مجفف' }, emoji: '🫐', category: 'epicerie', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'raisins_secs', name: { fr: 'raisins secs (paquet)', ar: 'زبيب' }, emoji: '🍇', category: 'epicerie', unit: 'g', basePrice: 35, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'pesto', name: { fr: 'pesto (bocal)', ar: 'بيستو' }, emoji: '🌿', category: 'epicerie', unit: 'g', basePrice: 240, soldBy: 'pack', packSize: 190, allergens: ['lactose', 'fruits_coque'] },
  { id: 'harissa', name: { fr: 'harissa (tube)', ar: 'هريسة' }, emoji: '🌶️', category: 'epicerie', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 100, allergens: [] },
  { id: 'moutarde', name: { fr: 'moutarde (pot)', ar: 'خردل' }, emoji: '🍯', category: 'epicerie', unit: 'g', basePrice: 45, soldBy: 'pack', packSize: 200, allergens: [] },
  { id: 'mayonnaise', name: { fr: 'mayonnaise (pot)', ar: 'مايونيز' }, emoji: '🥚', category: 'epicerie', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 250, allergens: ['oeuf'] },
  { id: 'bouillon', name: { fr: 'bouillon (cubes)', ar: 'مرقة' }, emoji: '🧂', category: 'epicerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 100, allergens: [] },
  { id: 'chocolat', name: { fr: 'chocolat (tablette)', ar: 'شوكولاطة' }, emoji: '🍫', category: 'epicerie', unit: 'g', basePrice: 55, soldBy: 'pack', packSize: 100, allergens: ['lactose'] },
  { id: 'cacao', name: { fr: 'cacao (paquet)', ar: 'كاكاو' }, emoji: '🍫', category: 'epicerie', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'sucre', name: { fr: 'sucre (paquet)', ar: 'سكر' }, emoji: '🧂', category: 'epicerie', unit: 'g', basePrice: 8, soldBy: 'pack', packSize: 1000, allergens: [] },

  // --- Boulangerie ---
  { id: 'pain_pita', name: { fr: 'pains pita (x6)', ar: 'خبز البيتا' }, emoji: '🫓', category: 'boulangerie', unit: 'piece', basePrice: 0.9, gramsPerPiece: 60, soldBy: 'pack', packSize: 6, allergens: ['gluten'] },
  { id: 'pain_mie', name: { fr: 'pain de mie', ar: 'خبز التوست' }, emoji: '🍞', category: 'boulangerie', unit: 'g', basePrice: 24, soldBy: 'pack', packSize: 500, allergens: ['gluten'] },
  { id: 'feuille_brick', name: { fr: 'feuilles de brick (x10)', ar: 'ورقة بسطيلة' }, emoji: '🥟', category: 'boulangerie', unit: 'piece', basePrice: 1.2, gramsPerPiece: 20, soldBy: 'pack', packSize: 10, allergens: ['gluten'] },
  { id: 'croissant', name: { fr: 'croissants (x4)', ar: 'كرواسون' }, emoji: '🥐', category: 'boulangerie', unit: 'piece', basePrice: 2.5, gramsPerPiece: 60, soldBy: 'pack', packSize: 4, allergens: ['gluten', 'lactose', 'oeuf'] },

  // --- Épices ---
  { id: 'cannelle', name: { fr: 'cannelle (flacon)', ar: 'قرفة' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 40, allergens: [] },
  { id: 'curcuma', name: { fr: 'curcuma (flacon)', ar: 'كركم' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 55, soldBy: 'pack', packSize: 40, allergens: [] },
  { id: 'garam_masala', name: { fr: 'garam masala (flacon)', ar: 'غارام ماسالا' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 70, soldBy: 'pack', packSize: 40, allergens: [] },
  { id: 'ras_el_hanout', name: { fr: 'ras el hanout (flacon)', ar: 'رأس الحانوت' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 75, soldBy: 'pack', packSize: 40, allergens: [] },

  // ===== Batch 2 pantry =====
  { id: 'cabillaud', name: { fr: 'cabillaud', ar: 'سمك القد' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 90, soldBy: 'weight', allergens: ['poisson'] },
  { id: 'germes_soja', name: { fr: 'germes de soja', ar: 'براعم الصويا' }, emoji: '🌱', category: 'fruits_legumes', unit: 'g', basePrice: 20, soldBy: 'weight', allergens: ['soja'] },
  { id: 'mascarpone', name: { fr: 'mascarpone', ar: 'ماسكاربوني' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 250, allergens: ['lactose'] },
  { id: 'biscuits', name: { fr: 'biscuits (paquet)', ar: 'بسكويت' }, emoji: '🍪', category: 'epicerie', unit: 'g', basePrice: 100, soldBy: 'pack', packSize: 200, allergens: ['gluten'] },
  { id: 'chapelure', name: { fr: 'chapelure (paquet)', ar: 'بقسماط' }, emoji: '🍞', category: 'epicerie', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 250, allergens: ['gluten'] },
  { id: 'farine_sarrasin', name: { fr: 'farine de sarrasin (paquet)', ar: 'دقيق الحنطة السوداء' }, emoji: '🌾', category: 'epicerie', unit: 'g', basePrice: 25, soldBy: 'pack', packSize: 1000, allergens: [] },
  { id: 'sesame', name: { fr: 'graines de sésame (paquet)', ar: 'سمسم' }, emoji: '🌰', category: 'epicerie', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 150, allergens: [] },
  { id: 'feuille_riz', name: { fr: 'galettes de riz (x20)', ar: 'ورق الأرز' }, emoji: '🫓', category: 'boulangerie', unit: 'piece', basePrice: 0.9, gramsPerPiece: 10, soldBy: 'pack', packSize: 20, allergens: [] },

  // ===== Batch 3 pantry =====
  { id: 'chevre', name: { fr: 'fromage de chèvre', ar: 'جبن الماعز' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 100, soldBy: 'pack', packSize: 150, allergens: ['lactose'] },
  { id: 'maquereau', name: { fr: 'maquereau', ar: 'ماكريل' }, emoji: '🐟', category: 'viande_poisson', unit: 'g', basePrice: 40, soldBy: 'weight', allergens: ['poisson'] },

  // ===== TheMealDB unmapped commons =====
  // Basiques cuisine
  { id: 'sel', name: { fr: 'sel (paquet 1 kg)', ar: 'ملح' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 4, soldBy: 'pack', packSize: 1000, allergens: [] },
  { id: 'poivre', name: { fr: 'poivre noir (flacon)', ar: 'فلفل أسود' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 110, soldBy: 'pack', packSize: 50, allergens: [] },
  { id: 'eau', name: { fr: 'eau', ar: 'ماء' }, emoji: '💧', category: 'epicerie', unit: 'ml', basePrice: 1, soldBy: 'weight', allergens: [] },
  { id: 'levure', name: { fr: 'levure chimique (sachet)', ar: 'مسحوق الخميرة' }, emoji: '🧂', category: 'epicerie', unit: 'g', basePrice: 90, soldBy: 'pack', packSize: 11, allergens: ['gluten'] },
  { id: 'maizena', name: { fr: 'maïzena (paquet)', ar: 'نشا الذرة' }, emoji: '🌽', category: 'epicerie', unit: 'g', basePrice: 28, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'vinaigre', name: { fr: 'vinaigre (bouteille)', ar: 'خل' }, emoji: '🍶', category: 'epicerie', unit: 'ml', basePrice: 12, soldBy: 'pack', packSize: 500, allergens: [] },
  { id: 'sucre_glace', name: { fr: 'sucre glace (paquet)', ar: 'سكر ناعم' }, emoji: '🧂', category: 'epicerie', unit: 'g', basePrice: 12, soldBy: 'pack', packSize: 250, allergens: [] },

  // Légumes supplémentaires
  { id: 'chou', name: { fr: 'chou blanc', ar: 'كرنب أبيض' }, emoji: '🥬', category: 'fruits_legumes', unit: 'g', basePrice: 5, soldBy: 'weight', allergens: [] },
  { id: 'champignons', name: { fr: 'champignons (barquette)', ar: 'فطر' }, emoji: '🍄', category: 'fruits_legumes', unit: 'g', basePrice: 35, soldBy: 'pack', packSize: 250, allergens: [] },
  { id: 'celeri', name: { fr: 'céleri branche', ar: 'كرفس' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 8, gramsPerPiece: 200, soldBy: 'piece', allergens: [] },
  { id: 'fenouil', name: { fr: 'fenouil', ar: 'شمر' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 10, gramsPerPiece: 300, soldBy: 'piece', allergens: [] },
  { id: 'citron_vert', name: { fr: 'citron vert', ar: 'ليمون أخضر' }, emoji: '🍋', category: 'fruits_legumes', unit: 'piece', basePrice: 1.5, gramsPerPiece: 70, soldBy: 'piece', allergens: [] },
  { id: 'petits_pois', name: { fr: 'petits pois (boîte)', ar: 'بازلاء (علبة)' }, emoji: '🫛', category: 'epicerie', unit: 'g', basePrice: 22, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'noix_coco', name: { fr: 'noix de coco râpée (paquet)', ar: 'جوز هند مبروش' }, emoji: '🥥', category: 'epicerie', unit: 'g', basePrice: 45, soldBy: 'pack', packSize: 200, allergens: [] },
  { id: 'piment', name: { fr: 'piment rouge', ar: 'فلفل حار' }, emoji: '🌶️', category: 'epices', unit: 'g', basePrice: 8, soldBy: 'pack', packSize: 30, allergens: [] },
  { id: 'scotch_bonnet', name: { fr: 'piment scotch bonnet', ar: 'فلفل حار جداً' }, emoji: '🌶️', category: 'epices', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 5, allergens: [] },
  { id: 'ciboulette', name: { fr: 'ciboulette (botte)', ar: 'ثوم معمر' }, emoji: '🌿', category: 'fruits_legumes', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 30, allergens: [] },

  // Fromages
  { id: 'fromage', name: { fr: 'fromage râpé (paquet)', ar: 'جبن مبروش' }, emoji: '🧀', category: 'cremerie', unit: 'g', basePrice: 150, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },
  { id: 'creme_fraiche', name: { fr: 'crème fraîche (pot)', ar: 'كريمة فرنسية' }, emoji: '🥛', category: 'cremerie', unit: 'ml', basePrice: 25, soldBy: 'pack', packSize: 200, allergens: ['lactose'] },

  // Viandes supplémentaires
  { id: 'porc', name: { fr: 'viande de porc', ar: 'لحم الخنزير' }, emoji: '🥩', category: 'viande_poisson', unit: 'g', basePrice: 80, soldBy: 'weight', allergens: [] },
  { id: 'chorizo', name: { fr: 'chorizo (paquet)', ar: 'شوريثو' }, emoji: '🌭', category: 'viande_poisson', unit: 'g', basePrice: 120, soldBy: 'pack', packSize: 200, allergens: [] },

  // Huiles & sauces
  { id: 'sesame_seed_oil', name: { fr: 'huile de sésame (bouteille)', ar: 'زيت السمسم' }, emoji: '🍶', category: 'epicerie', unit: 'ml', basePrice: 80, soldBy: 'pack', packSize: 200, allergens: [] },
  { id: 'hotsauce', name: { fr: 'sauce piquante', ar: 'صوص حار' }, emoji: '🌶️', category: 'epicerie', unit: 'ml', basePrice: 35, soldBy: 'pack', packSize: 100, allergens: [] },
  { id: 'vin_blanc', name: { fr: 'vin blanc (bouteille)', ar: 'نبيذ أبيض' }, emoji: '🍷', category: 'epicerie', unit: 'ml', basePrice: 55, soldBy: 'pack', packSize: 750, allergens: [] },
  { id: 'vin_rouge', name: { fr: 'vin rouge (bouteille)', ar: 'نبيذ أحمر' }, emoji: '🍷', category: 'epicerie', unit: 'ml', basePrice: 55, soldBy: 'pack', packSize: 750, allergens: [] },
  { id: 'tinned_tomatos', name: { fr: 'tomates pelées (boîte)', ar: 'طماطم مقشرة' }, emoji: '🥫', category: 'epicerie', unit: 'g', basePrice: 18, soldBy: 'pack', packSize: 400, allergens: [] },
  { id: 'puff_pastry', name: { fr: 'pâte feuilletée (rouleau)', ar: 'عجينة ورقية' }, emoji: '🥐', category: 'boulangerie', unit: 'g', basePrice: 60, soldBy: 'pack', packSize: 275, allergens: ['gluten', 'lactose'] },

  // Épices supplémentaires
  { id: 'vanille', name: { fr: 'vanille en poudre (sachet)', ar: 'فانيليا (كيس)' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 250, soldBy: 'pack', packSize: 5, allergens: [] },
  { id: 'thym', name: { fr: 'thym (flacon)', ar: 'زعتر جاف' }, emoji: '🌿', category: 'epices', unit: 'g', basePrice: 55, soldBy: 'pack', packSize: 15, allergens: [] },
  { id: 'bay_leaf', name: { fr: 'feuilles de laurier (paquet)', ar: 'ورق الغار' }, emoji: '🌿', category: 'epices', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 10, allergens: [] },
  { id: 'laurier', name: { fr: 'laurier (paquet)', ar: 'ورق الغار' }, emoji: '🌿', category: 'epices', unit: 'g', basePrice: 40, soldBy: 'pack', packSize: 10, allergens: [] },
  { id: 'muscade', name: { fr: 'noix de muscade (flacon)', ar: 'جوزة الطيب' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 160, soldBy: 'pack', packSize: 25, allergens: [] },
  { id: 'origan', name: { fr: 'origan (flacon)', ar: 'أوريغانو' }, emoji: '🌿', category: 'epices', unit: 'g', basePrice: 55, soldBy: 'pack', packSize: 15, allergens: [] },
  { id: 'aneth', name: { fr: 'aneth (flacon)', ar: 'شبت' }, emoji: '🌿', category: 'epices', unit: 'g', basePrice: 55, soldBy: 'pack', packSize: 15, allergens: [] },
  { id: 'cardamome', name: { fr: 'cardamome (flacon)', ar: 'هيل' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 450, soldBy: 'pack', packSize: 20, allergens: [] },
  { id: 'romarin', name: { fr: 'romarin (flacon)', ar: 'إكليل الجبل' }, emoji: '🌿', category: 'epices', unit: 'g', basePrice: 55, soldBy: 'pack', packSize: 15, allergens: [] },
  { id: 'clous_girofle', name: { fr: 'clous de girofle (flacon)', ar: 'قرنفل' }, emoji: '🧂', category: 'epices', unit: 'g', basePrice: 220, soldBy: 'pack', packSize: 15, allergens: [] },
  { id: 'safran', name: { fr: 'safran (sachet)', ar: 'زعفران' }, emoji: '🌸', category: 'epices', unit: 'g', basePrice: 2200, soldBy: 'pack', packSize: 0.5, allergens: [] },
  { id: 'cilantro', name: { fr: 'coriandre fraîche (botte)', ar: 'كزبرة طازجة' }, emoji: '🌿', category: 'fruits_legumes', unit: 'piece', basePrice: 2, gramsPerPiece: 30, soldBy: 'piece', allergens: [] },
  { id: 'cacahuetes', name: { fr: 'cacahuètes (paquet)', ar: 'فول سوداني' }, emoji: '🥜', category: 'epicerie', unit: 'g', basePrice: 35, soldBy: 'pack', packSize: 200, allergens: ['arachide'] },
]

export const getIngredient = (id: string): Ingredient | undefined =>
  INGREDIENTS.find((i) => i.id === id)

const ING_MAP: Record<string, Ingredient> = Object.fromEntries(
  INGREDIENTS.map((i) => [i.id, i]),
)
export const ingredientMap = ING_MAP
