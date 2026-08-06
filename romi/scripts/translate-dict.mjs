/**
 * Traduit les noms de recettes TheMealDB EN→FR par dictionnaire culinaire.
 * Aussi traduit les noms AR qui sont encore en anglais.
 */
import { readFileSync, writeFileSync } from 'fs'

// ── Dictionnaire de substitution mot par mot (casse-insensible) ──────────────
const WORD_MAP = {
  // Viandes
  beef: 'bœuf', chicken: 'poulet', pork: 'porc', lamb: 'agneau',
  veal: 'veau', duck: 'canard', turkey: 'dinde', rabbit: 'lapin',
  venison: 'cerf', goat: 'chèvre', oxtail: 'queue de bœuf',
  sausage: 'saucisse', sausages: 'saucisses', meatball: 'boulette',
  meatballs: 'boulettes de viande', meat: 'viande', minced: 'haché',
  ground: 'haché',
  // Poissons & fruits de mer
  fish: 'poisson', salmon: 'saumon', tuna: 'thon', cod: 'morue',
  trout: 'truite', shrimp: 'crevettes', prawn: 'crevettes',
  prawns: 'crevettes', lobster: 'homard', crab: 'crabe',
  scallop: 'saint-jacques', scallops: 'noix de saint-jacques',
  clam: 'palourde', clams: 'palourdes', oyster: 'huître',
  oysters: 'huîtres', squid: 'calmar', octopus: 'poulpe',
  anchovy: 'anchois', anchovies: 'anchois', sardine: 'sardine',
  sardines: 'sardines', haddock: 'aiglefin', mackerel: 'maquereau',
  seabass: 'bar', sea: 'mer',
  // Légumes
  potato: 'pomme de terre', potatoes: 'pommes de terre',
  sweet: 'doux', tomato: 'tomate', tomatoes: 'tomates',
  onion: 'oignon', onions: 'oignons', garlic: 'ail',
  carrot: 'carotte', carrots: 'carottes', mushroom: 'champignon',
  mushrooms: 'champignons', spinach: 'épinards', broccoli: 'brocoli',
  pepper: 'poivron', peppers: 'poivrons', corn: 'maïs',
  pea: 'petit pois', peas: 'petits pois', leek: 'poireau',
  leeks: 'poireaux', zucchini: 'courgette', eggplant: 'aubergine',
  cauliflower: 'chou-fleur', cabbage: 'chou', kale: 'chou frisé',
  artichoke: 'artichaut', asparagus: 'asperges', celery: 'céleri',
  cucumber: 'concombre', lettuce: 'laitue', avocado: 'avocat',
  beet: 'betterave', radish: 'radis', turnip: 'navet',
  pumpkin: 'citrouille', squash: 'courge', bean: 'haricot',
  beans: 'haricots', lentil: 'lentille', lentils: 'lentilles',
  chickpea: 'pois chiche', chickpeas: 'pois chiches',
  // Fruits
  apple: 'pomme', banana: 'banane', orange: 'orange',
  lemon: 'citron', lime: 'citron vert', mango: 'mangue',
  pineapple: 'ananas', strawberry: 'fraise', blueberry: 'myrtille',
  raspberry: 'framboise', cherry: 'cerise', grape: 'raisin',
  peach: 'pêche', pear: 'poire', plum: 'prune', fig: 'figue',
  coconut: 'noix de coco', date: 'datte', dates: 'dattes',
  // Produits laitiers & œufs
  egg: 'œuf', eggs: 'œufs', cheese: 'fromage', butter: 'beurre',
  cream: 'crème', milk: 'lait', yogurt: 'yaourt',
  // Féculents & céréales
  rice: 'riz', pasta: 'pâtes', noodle: 'nouille',
  noodles: 'nouilles', bread: 'pain', flour: 'farine',
  oat: 'flocon d\'avoine', oats: 'flocons d\'avoine',
  // Épices & aromatiques
  ginger: 'gingembre', turmeric: 'curcuma', cumin: 'cumin',
  coriander: 'coriandre', cinnamon: 'cannelle', chili: 'piment',
  chilli: 'piment', mint: 'menthe', basil: 'basilic',
  parsley: 'persil', thyme: 'thym', rosemary: 'romarin',
  oregano: 'origan', bay: 'laurier', saffron: 'safran',
  vanilla: 'vanille', paprika: 'paprika',
  // Sauces & condiments
  sauce: 'sauce', gravy: 'sauce', oil: 'huile',
  vinegar: 'vinaigre', mustard: 'moutarde', honey: 'miel',
  sugar: 'sucre', salt: 'sel',
  // Techniques culinaires
  baked: 'au four', roasted: 'rôti', roast: 'rôti',
  grilled: 'grillé', fried: 'frit', sautéed: 'sauté',
  sauteed: 'sauté', steamed: 'à la vapeur', boiled: 'bouilli',
  poached: 'poché', smoked: 'fumé', stuffed: 'farci',
  braised: 'braisé', stewed: 'mijoté',
  // Plats & préparations
  stew: 'ragoût', soup: 'soupe', salad: 'salade',
  pie: 'tourte', tart: 'tarte', cake: 'gâteau',
  pudding: 'pudding', curry: 'curry', stir: 'sauté',
  fry: 'poêlée', roll: 'roulé', rolls: 'roulés',
  dumpling: 'ravioli', dumplings: 'raviolis', burger: 'burger',
  burgers: 'burgers', sandwich: 'sandwich', wrap: 'wrap',
  pizza: 'pizza', casserole: 'casserole', hotpot: 'casserole',
  broth: 'bouillon', 'stir-fry': 'poêlée',
  // Descriptifs
  spicy: 'épicé', crispy: 'croustillant', creamy: 'crémeux',
  smoky: 'fumé', hearty: 'consistant', tender: 'tendre',
  slow: 'lent', quick: 'rapide', easy: 'facile',
  homemade: 'fait maison', traditional: 'traditionnel',
  classic: 'classique', simple: 'simple',
  // Connecteurs
  with: 'au', and: 'et', in: 'au', on: 'sur',
  'the': '', a: '', 'of': 'de',
  // Couleurs
  red: 'rouge', green: 'vert', black: 'noir', white: 'blanc', golden: 'doré',
  // Viandes spéciales
  wing: 'aile', wings: 'ailes', leg: 'cuisse', legs: 'cuisses',
  breast: 'filet', thigh: 'cuisse', chop: 'côtelette', chops: 'côtelettes',
  ribs: 'côtes', fillet: 'filet', steak: 'steak', cutlet: 'escalope',
  // Divers
  hot: 'chaud', cold: 'froid', fresh: 'frais', dried: 'séché',
  whole: 'entier', baby: 'petit', mini: 'mini',
}

// Noms internationaux à garder tels quels (ne pas traduire)
const KEEP_AS_IS = new Set([
  'asado', 'arepa', 'arepa pelua', 'bistek', 'moussaka', 'borscht', 'borsch',
  'goulash', 'ramen', 'sushi', 'sashimi', 'tempura', 'teriyaki', 'miso',
  'yakitori', 'katsu', 'tonkatsu', 'pho', 'bibimbap', 'kimchi', 'bulgogi',
  'dim sum', 'gyoza', 'pad thai', 'pad see ew', 'massaman', 'green curry',
  'red curry', 'rendang', 'satay', 'nasi goreng', 'mee goreng', 'laksa',
  'banh mi', 'poke', 'tacos', 'burrito', 'quesadilla', 'enchilada',
  'tamale', 'guacamole', 'mole', 'fajita', 'empanada', 'empanadas',
  'ceviche', 'tiradito', 'lomo saltado', 'carbonada', 'matambre',
  'chivito', 'golabki', 'bigos', 'pierogi', 'borscht', 'stroganoff',
  'goulash', 'wiener schnitzel', 'sauerbraten', 'bratwurst', 'leberkase',
  'rosti', 'fondue', 'raclette', 'tiramisu', 'panna cotta', 'risotto',
  'osso buco', 'saltimbocca', 'piccata', 'milanese', 'scallopine',
  'carbonara', 'cacio e pepe', 'amatriciana', 'puttanesca', 'arrabiata',
  'gnocchi', 'bruschetta', 'caprese', 'antipasto', 'minestrone',
  'ribollita', 'cacciucco', 'brodetto', 'bouillabaisse', 'ratatouille',
  'cassoulet', 'pot-au-feu', 'blanquette', 'tapenade',
  'shakshuka', 'falafel', 'hummus', 'baba ganoush', 'labneh',
  'tabouleh', 'fattoush', 'kibbeh', 'kofta', 'shawarma', 'kebab',
  'tagine', 'couscous', 'pastilla', 'harira', 'bastilla',
  'jerk chicken', 'jerk pork', 'ackee', 'roti', 'doubles',
  'jollof', 'fufu', 'egusi', 'suya', 'injera', 'doro wat',
  'naan', 'samosa', 'biryani', 'korma', 'tikka masala', 'saag',
  'dal', 'chana masala', 'palak paneer', 'vindaloo', 'dhokla',
  'idli', 'dosa', 'uttapam', 'vada', 'halwa', 'kheer',
  'lahmacun', 'kofte', 'manti', 'dolma', 'iskender', 'adana',
  'miso soup', 'edamame', 'onigiri', 'yakisoba',
  'big mac', 'hotdog', 'nachos', 'pretzel',
  'mulukhiyah', 'ful medames', 'kushari', 'koshari',
  'ayam percik', 'rendang', 'gulai', 'opor', 'soto',
  'golabki', 'bitterballen', 'stoemp', 'waterzooi',
  'cevapi', 'cevapi', 'peka', 'burek',
  'bistek', 'kare kare', 'adobo', 'sinigang', 'mechado', 'caldereta',
  'pate chinois', 'tourtière', 'poutine',
  'ma po tofu', 'mapo tofu', 'kung pao', 'moo shu',
  'chick-fil-a', 'steak diane', 'beef wellington', 'eggs benedict',
])

// ── Traduction par substitution ──────────────────────────────────────────────
function translateName(name) {
  const lower = name.toLowerCase().trim()

  // Noms à garder tels quels
  if (KEEP_AS_IS.has(lower)) return name

  // Si le nom contient déjà des accents français → capitaliser et retourner
  if (/[éèêëàâäîïôöùûüçœæ]/i.test(name)) {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  let result = name

  // Remplacements de mots clés (plus long d'abord pour éviter les sous-matchs)
  const sortedKeys = Object.keys(WORD_MAP).sort((a, b) => b.length - a.length)
  for (const en of sortedKeys) {
    const fr = WORD_MAP[en]
    // Remplacer le mot entier, insensible à la casse
    const re = new RegExp(`\\b${en}\\b`, 'gi')
    result = result.replace(re, (match) => {
      // Respecter la casse initiale
      return match[0] === match[0].toUpperCase() ? capitalize(fr) : fr
    })
  }

  // Nettoyer les espaces doubles
  result = result.replace(/\s+/g, ' ').trim()
  // Supprimer les articles vides
  result = result.replace(/\b(the|a|an)\b\s*/gi, '')
  result = result.replace(/\s+/g, ' ').trim()

  // Toujours capitaliser la première lettre
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1)
  }

  return result
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

// Traduction AR simplifiée (mot-clé en arabe)
const AR_WORD_MAP = {
  beef: 'لحم بقري', chicken: 'دجاج', pork: 'خنزير', lamb: 'خروف',
  fish: 'سمك', salmon: 'سلمون', shrimp: 'روبيان', egg: 'بيض', eggs: 'بيض',
  rice: 'أرز', pasta: 'مكرونة', noodles: 'شعرية', bread: 'خبز',
  soup: 'شوربة', salad: 'سلطة', stew: 'يخنة', curry: 'كاري',
  cake: 'كعكة', pie: 'فطيرة', sauce: 'صلصة', roasted: 'محمّص',
  grilled: 'مشوي', fried: 'مقلي', baked: 'مخبوز', stuffed: 'محشوّ',
  and: 'و', with: 'مع',
}

function translateNameAR(name) {
  // Si déjà en arabe (contient des caractères arabes), on garde
  if (/[؀-ۿ]/.test(name)) return name
  const lower = name.toLowerCase().trim()
  if (KEEP_AS_IS.has(lower)) return name

  let result = name
  const sortedKeys = Object.keys(AR_WORD_MAP).sort((a, b) => b.length - a.length)
  for (const en of sortedKeys) {
    const ar = AR_WORD_MAP[en]
    const re = new RegExp(`\\b${en}\\b`, 'gi')
    result = result.replace(re, ar)
  }
  return result.replace(/\s+/g, ' ').trim()
}

// ── Appliquer au fichier ─────────────────────────────────────────────────────
const SRC = 'src/data/recipes_mealdb.ts'
let raw = readFileSync(SRC, 'utf8')

const NAME_RE = /name: \{ fr: "([^"]+)", ar: "([^"]+)"/g
let updatedFR = 0, updatedAR = 0

raw = raw.replace(NAME_RE, (match, fr, ar) => {
  const newFR = translateName(fr)
  const newAR = translateNameAR(ar)
  if (newFR !== fr) updatedFR++
  if (newAR !== ar) updatedAR++
  return `name: { fr: "${newFR}", ar: "${newAR}"`
})

writeFileSync(SRC, raw)
console.log(`✅ Noms FR mis à jour : ${updatedFR}`)
console.log(`✅ Noms AR mis à jour : ${updatedAR}`)

// Vérification finale
const names = [...raw.matchAll(/name: \{ fr: "([^"]+)", ar: "([^"]+)"/g)]
const stillEnglish = names.filter(m =>
  /^[a-zA-Z0-9\s\-\(\)&,"'.\/!]+$/.test(m[1]) &&
  !/[éèêëàâäîïôöùûüçœæ]/i.test(m[1])
).length
console.log(`📊 Encore en anglais : ${stillEnglish} / ${names.length}`)

// Afficher quelques exemples
const samples = names.filter(m => /[éèêëàâäîïôöùûüçœæ]/i.test(m[1])).slice(0, 15)
console.log('\nExemples traduits :')
samples.forEach(m => console.log(`  🇫🇷 "${m[1]}" | 🇸🇦 "${m[2]}"`.slice(0, 90)))
