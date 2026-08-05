/**
 * TheMealDB full import pipeline — Phase 1 (fast, no translation)
 * 1. Fetches all ~729 meal IDs across all categories
 * 2. Downloads full details for each (cached after first run)
 * 3. Converts US measures → grams
 * 4. Maps ingredient names → our MAD price system
 * 5. Extracts YouTube video IDs
 * 6. Downloads photos to public/plats/
 * 7. Outputs src/data/recipes_mealdb.ts (names stay in English — translate next)
 *
 * Phase 2 (separate): node scripts/translate-mealdb.mjs
 */
import { createWriteStream, existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'
import https from 'node:https'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT_PLATS = join(root, 'public', 'plats')
const CACHE_DIR = join(root, '.mealdb-cache')
mkdirSync(OUT_PLATS, { recursive: true })
mkdirSync(CACHE_DIR, { recursive: true })

// ─── Helpers ───────────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Romi/1.0' }, timeout: 10000 }, (res) => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch (e) { reject(e) } })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function fetchWithRetry(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try { return await fetchJSON(url) } catch (e) {
      if (i < tries - 1) await sleep((i + 1) * 500)
      else throw e
    }
  }
}

function downloadImage(url, dest) {
  if (existsSync(dest)) return Promise.resolve('exists')
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    const req = https.get(url, { headers: { 'User-Agent': 'Romi/1.0' }, timeout: 15000 }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close(); file.destroy()
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) { file.close(); return reject(new Error(`HTTP ${res.statusCode}`)) }
      pipeline(res, file).then(resolve).catch(reject)
    })
    req.on('error', e => { file.close(); reject(e) })
    req.on('timeout', () => { req.destroy(); file.close(); reject(new Error('timeout')) })
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Unit → grams conversion ───────────────────────────────────────────────
const DENSITY = {
  flour: 0.53, 'all purpose flour': 0.53, 'plain flour': 0.53,
  sugar: 0.85, 'brown sugar': 0.85, 'caster sugar': 0.85, 'icing sugar': 0.56,
  rice: 0.77, pasta: 0.53, oats: 0.34, couscous: 0.77,
  milk: 1.03, water: 1, oil: 0.92, 'olive oil': 0.92, butter: 0.91,
  honey: 1.42, 'soy sauce': 1.09, 'coconut milk': 0.97, cream: 1.0,
  yogurt: 1.05, salt: 1.2, cocoa: 0.5, 'cocoa powder': 0.5,
  default: 1,
}
function getDensity(ing) {
  const low = ing.toLowerCase()
  for (const [k, v] of Object.entries(DENSITY)) if (low.includes(k)) return v
  return DENSITY.default
}
function parseFrac(s) {
  s = s.trim()
  if (s === '½') return 0.5; if (s === '¼') return 0.25; if (s === '¾') return 0.75
  if (s.includes('/')) { const [a, b] = s.split('/'); return parseFloat(a) / parseFloat(b) }
  return parseFloat(s) || 1
}
function parseMeasure(measure, ingredient) {
  if (!measure || !measure.trim()) return { grams: 100, unit: 'g' }
  const m = measure.trim()
  const ing = ingredient.toLowerCase()
  // Already metric
  if (/^[\d.]+\s*g$/i.test(m)) return { grams: parseFloat(m), unit: 'g' }
  if (/^[\d.]+\s*kg$/i.test(m)) return { grams: parseFloat(m) * 1000, unit: 'g' }
  if (/^[\d.]+\s*ml$/i.test(m)) return { grams: parseFloat(m), unit: 'ml' }
  if (/^[\d.]+\s*l$/i.test(m)) return { grams: parseFloat(m) * 1000, unit: 'ml' }
  // Parse quantity + unit
  const nm = m.match(/^([\d½¼¾]+(?:\/\d+)?(?:\s*[\d½¼¾]+(?:\/\d+)?)?)\s*(.*)/i)
  const qty = nm ? parseFrac(nm[1]) : 1
  const rest = (nm ? nm[2] : m).toLowerCase().trim()
  const d = getDensity(ing)
  if (rest.startsWith('cup')) return { grams: Math.round(240 * d * qty), unit: ing.match(/oil|milk|water|sauce|cream|juice/) ? 'ml' : 'g' }
  if (rest.startsWith('tbsp') || rest.startsWith('tablespoon')) return { grams: Math.round(15 * d * qty), unit: 'ml' }
  if (rest.startsWith('tsp') || rest.startsWith('teaspoon')) return { grams: Math.round(5 * qty), unit: 'ml' }
  if (rest.startsWith('oz') || rest.startsWith('ounce')) return { grams: Math.round(28 * qty), unit: 'g' }
  if (rest.startsWith('lb') || rest.startsWith('pound')) return { grams: Math.round(454 * qty), unit: 'g' }
  if (rest.startsWith('clove')) return { grams: Math.round(5 * qty), unit: 'g' }
  if (rest.startsWith('pinch') || rest.startsWith('dash')) return { grams: 1, unit: 'g' }
  if (rest.includes('can') || rest.includes('tin')) return { grams: Math.round(400 * qty), unit: 'g' }
  if (rest.includes('packet') || rest.includes('pack') || rest.includes('sachet')) return { grams: Math.round(100 * qty), unit: 'g' }
  // Piece / whole
  const PIECE = { onion: 150, tomato: 120, egg: 60, potato: 150, carrot: 80, lemon: 80, lime: 60,
    pepper: 120, aubergine: 300, eggplant: 300, courgette: 200, zucchini: 200, garlic: 5,
    avocado: 200, banana: 120, apple: 180 }
  for (const [k, v] of Object.entries(PIECE)) {
    if (ing.includes(k)) return { grams: Math.round(v * qty), unit: 'piece' }
  }
  if (!rest || rest.match(/^(large|medium|small|whole|piece|slice)s?$/)) {
    return { grams: Math.round(100 * qty), unit: 'piece' }
  }
  return { grams: Math.round(qty * 100), unit: 'g' }
}

// ─── Ingredient mapping ────────────────────────────────────────────────────
const ING_MAP = {
  'chicken':['poulet'],'chicken breast':['poulet'],'chicken thighs':['poulet'],
  'chicken drumsticks':['poulet'],'whole chicken':['poulet'],
  'ground beef':['viande_hachee'],'minced beef':['viande_hachee'],'mince':['viande_hachee'],
  'beef':['boeuf'],'steak':['boeuf'],'beef steak':['boeuf'],'beef mince':['viande_hachee'],
  'lamb':['agneau'],'lamb mince':['viande_hachee'],'lamb shoulder':['agneau'],
  'pork':['porc'],'bacon':['porc'],'pancetta':['porc'],'ham':['porc'],
  'turkey':['dinde'],'duck':['canard'],'duck breast':['canard'],
  'sausages':['merguez'],'chorizo':['chorizo'],'salami':['porc'],
  'salmon':['saumon'],'tuna':['thon'],'cod':['cabillaud'],'sea bass':['dorade'],
  'mackerel':['maquereau'],'tilapia':['cabillaud'],'haddock':['cabillaud'],
  'prawns':['gambas'],'shrimp':['gambas'],'king prawns':['gambas'],
  'clams':['palourdes'],'mussels':['moules'],'squid':['calamar'],
  'scallops':['saint_jacques'],'anchovies':['anchois'],'sardines':['sardines'],
  'eggs':['oeuf'],'egg':['oeuf'],'egg yolks':['oeuf'],'egg whites':['oeuf'],
  'tofu':['tofu'],'tempeh':['tofu'],
  'feta':['feta'],'feta cheese':['feta'],'parmesan':['parmesan'],
  'parmesan cheese':['parmesan'],'mozzarella':['mozzarella'],
  'cheddar':['fromage'],'gruyere':['fromage'],'brie':['brie'],
  'cream cheese':['fromage_frais'],'ricotta':['fromage_frais'],
  'halloumi':['fromage'],'cheese':['fromage'],
  'milk':['lait'],'whole milk':['lait'],'skimmed milk':['lait'],
  'butter':['beurre'],'cream':['creme'],'double cream':['creme'],
  'single cream':['creme'],'heavy cream':['creme'],'soured cream':['creme'],
  'whipping cream':['creme'],'coconut cream':['lait_coco'],
  'yogurt':['yaourt'],'greek yogurt':['yaourt'],'natural yogurt':['yaourt'],
  'coconut milk':['lait_coco'],'evaporated milk':['lait'],
  'pasta':['pates'],'spaghetti':['pates'],'penne':['pates'],
  'tagliatelle':['pates'],'linguine':['pates'],'fettuccine':['pates'],
  'fusilli':['pates'],'rigatoni':['pates'],'farfalle':['pates'],
  'lasagne sheets':['pates'],'lasagna':['pates'],
  'rice':['riz'],'basmati rice':['riz'],'jasmine rice':['riz'],
  'arborio rice':['riz'],'risotto rice':['riz'],'brown rice':['riz'],
  'noodles':['nouilles'],'egg noodles':['nouilles'],'rice noodles':['nouilles'],
  'vermicelli':['nouilles'],'udon noodles':['nouilles'],
  'flour':['farine'],'plain flour':['farine'],'self raising flour':['farine'],
  'bread flour':['farine'],'all purpose flour':['farine'],
  'breadcrumbs':['chapelure'],'panko':['chapelure'],
  'bread':['pain'],'sourdough':['pain'],'baguette':['pain'],
  'tortilla':['tortilla'],'wraps':['tortilla'],
  'pita bread':['pain_pita'],'pitta bread':['pain_pita'],
  'quinoa':['quinoa'],'couscous':['couscous'],'bulgur':['boulgour'],
  'lentils':['lentilles'],'red lentils':['lentilles'],'green lentils':['lentilles'],
  'chickpeas':['pois_chiche'],'garbanzo beans':['pois_chiche'],
  'black beans':['haricots_noirs'],'kidney beans':['haricots_rouges'],
  'white beans':['haricots_blancs'],'cannellini beans':['haricots_blancs'],
  'oats':['flocons_avoine'],'rolled oats':['flocons_avoine'],'porridge oats':['flocons_avoine'],
  'onion':['oignon'],'red onion':['oignon'],'white onion':['oignon'],
  'spring onions':['oignon'],'scallions':['oignon'],
  'shallots':['echalote'],'leek':['poireau'],
  'garlic':['ail'],'garlic cloves':['ail'],
  'tomatoes':['tomate'],'cherry tomatoes':['tomate'],'plum tomatoes':['tomate'],
  'tinned tomatoes':['tomate_concassee'],'chopped tomatoes':['tomate_concassee'],
  'canned tomatoes':['tomate_concassee'],'passata':['tomate_concassee'],
  'crushed tomatoes':['tomate_concassee'],
  'tomato paste':['concentre_tomate'],'tomato puree':['concentre_tomate'],
  'tomato sauce':['tomate_concassee'],
  'potatoes':['pomme_terre'],'sweet potato':['patate_douce'],'yam':['patate_douce'],
  'carrots':['carotte'],'courgette':['courgette'],'zucchini':['courgette'],
  'aubergine':['aubergine'],'eggplant':['aubergine'],
  'peppers':['poivron'],'red pepper':['poivron'],'green pepper':['poivron'],
  'yellow pepper':['poivron'],'bell pepper':['poivron'],
  'spinach':['epinard'],'baby spinach':['epinard'],
  'broccoli':['brocoli'],'cauliflower':['chou_fleur'],'cabbage':['chou'],
  'mushrooms':['champignons'],'button mushrooms':['champignons'],
  'porcini mushrooms':['champignons'],'chestnut mushrooms':['champignons'],
  'celery':['celeri'],'peas':['petits_pois'],'frozen peas':['petits_pois'],
  'green beans':['haricots_verts'],'asparagus':['asperges'],
  'corn':['mais'],'sweetcorn':['mais'],'maize':['mais'],
  'lettuce':['salade'],'romaine':['salade'],'rocket':['salade'],
  'cucumber':['concombre'],'avocado':['avocat'],
  'olives':['olives'],'black olives':['olives'],'green olives':['olives'],
  'butternut squash':['courge'],'pumpkin':['courge'],'squash':['courge'],
  'kale':['chou'],'beetroot':['betterave'],'turnip':['navet'],
  'artichoke':['artichaut'],'fennel':['fenouil'],'radish':['radis'],
  'lemon':['citron'],'lime':['citron_vert'],'orange':['orange'],
  'banana':['banane'],'strawberries':['fraises'],'mango':['mangue'],
  'pineapple':['ananas'],'raspberries':['framboises'],'blueberries':['myrtilles'],
  'apple':['pomme'],'apples':['pomme'],'pear':['poire'],
  'dates':['dattes'],'prunes':['pruneaux'],'raisins':['raisins_secs'],
  'dried apricots':['abricots_secs'],'figs':['figues'],
  'olive oil':['huile_olive'],'vegetable oil':['huile_olive'],
  'sunflower oil':['huile_olive'],'canola oil':['huile_olive'],
  'sesame oil':['huile_sesame'],
  'soy sauce':['sauce_soja'],'fish sauce':['sauce_soja'],
  'oyster sauce':['sauce_soja'],'worcestershire sauce':['sauce_soja'],
  'hot sauce':['harissa'],'sriracha':['harissa'],
  'ketchup':['ketchup'],'mayonnaise':['mayonnaise'],
  'mustard':['moutarde'],'dijon mustard':['moutarde'],
  'honey':['miel'],'maple syrup':['miel'],
  'vinegar':['vinaigre'],'red wine vinegar':['vinaigre'],
  'balsamic vinegar':['vinaigre'],'white wine vinegar':['vinaigre'],
  'white wine':['vin_blanc'],'red wine':['vin_rouge'],
  'chicken stock':['bouillon'],'beef stock':['bouillon'],
  'vegetable stock':['bouillon'],'stock':['bouillon'],'broth':['bouillon'],
  'salt':['sel'],'sea salt':['sel'],'kosher salt':['sel'],
  'pepper':['poivre'],'black pepper':['poivre'],'white pepper':['poivre'],
  'cumin':['cumin'],'coriander':['coriandre'],'ground coriander':['coriandre'],
  'paprika':['paprika'],'smoked paprika':['paprika'],
  'turmeric':['curcuma'],'cinnamon':['cannelle'],'ground cinnamon':['cannelle'],
  'ginger':['gingembre'],'ground ginger':['gingembre'],
  'chilli':['piment'],'chili':['piment'],'red chilli':['piment'],
  'cayenne':['piment'],'cayenne pepper':['piment'],'chilli flakes':['piment'],
  'curry powder':['curry'],'garam masala':['ras_el_hanout'],
  'ras el hanout':['ras_el_hanout'],'baharat':['ras_el_hanout'],
  'saffron':['safran'],'oregano':['origan'],'dried oregano':['origan'],
  'thyme':['thym'],'fresh thyme':['thym'],'dried thyme':['thym'],
  'rosemary':['romarin'],'basil':['basilic'],'fresh basil':['basilic'],
  'mint':['menthe'],'fresh mint':['menthe'],
  'parsley':['persil'],'fresh parsley':['persil'],
  'bay leaves':['laurier'],'dill':['aneth'],
  'tarragon':['estragon'],'sage':['sauge'],'chives':['ciboulette'],
  'cardamom':['cardamome'],'star anise':['anis'],'cloves':['clous_girofle'],
  'allspice':['poivre'],'nutmeg':['muscade'],
  'vanilla':['vanille'],'vanilla extract':['vanille'],'vanilla pod':['vanille'],
  'sugar':['sucre'],'brown sugar':['sucre'],'caster sugar':['sucre'],
  'icing sugar':['sucre_glace'],'powdered sugar':['sucre_glace'],
  'cocoa powder':['cacao'],'dark chocolate':['chocolat'],'chocolate':['chocolat'],
  'white chocolate':['chocolat'],'milk chocolate':['chocolat'],
  'baking powder':['levure'],'yeast':['levure'],'bicarbonate of soda':['levure'],
  'cornstarch':['maizena'],'corn flour':['maizena'],
  'almonds':['amandes'],'walnuts':['noix'],'pine nuts':['pignons'],
  'cashews':['noix_cajou'],'sesame seeds':['sesame'],'tahini':['tahini'],
  'peanut butter':['beurre_cacahuete'],'peanuts':['cacahuetes'],
  'coconut':['noix_coco'],'desiccated coconut':['noix_coco'],
  'capers':['capres'],'gherkins':['cornichons'],
  'sun-dried tomatoes':['tomate_concassee'],
  'water':['eau'],
}

const NEW_ING = {}
function mapIng(name) {
  if (!name) return null
  const low = name.toLowerCase().trim()
  if (ING_MAP[low]) return ING_MAP[low][0]
  for (const [k, v] of Object.entries(ING_MAP)) {
    if (low.includes(k) || (k.length > 4 && k.includes(low))) return v[0]
  }
  const id = low.replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  if (id && !NEW_ING[id]) NEW_ING[id] = name
  return id || null
}

// ─── Tags / mealType ─────────────────────────────────────────────────────
const AREA_TAG = {
  moroccan:'du_monde', lebanese:'du_monde', turkish:'du_monde', syrian:'du_monde',
  indian:'du_monde', chinese:'du_monde', japanese:'du_monde', thai:'du_monde',
  vietnamese:'du_monde', korean:'du_monde', mexican:'du_monde', spanish:'du_monde',
  greek:'du_monde', italian:'du_monde', french:'du_monde', tunisian:'du_monde',
  egyptian:'du_monde', algerian:'du_monde', creole:'du_monde',
}
function inferTags(meal) {
  const tags = new Set()
  const cat = (meal.strCategory||'').toLowerCase()
  const area = (meal.strArea||'').toLowerCase()
  const name = (meal.strMeal||'').toLowerCase()
  if (AREA_TAG[area]) tags.add(AREA_TAG[area])
  if (['beef','chicken','lamb','seafood','pork'].includes(cat)) tags.add('proteine')
  if (['vegan','vegetarian'].includes(cat)) tags.add('vegetarien')
  if (cat === 'dessert') tags.add('gourmand')
  if (cat === 'breakfast') { tags.add('rapide'); tags.add('healthy') }
  if (name.match(/salad|light|healthy/)) tags.add('healthy')
  if (name.match(/roast|family|casserole|stew/)) tags.add('famille')
  if (name.match(/quick|easy|simple/)) tags.add('rapide')
  if (tags.size === 0) tags.add('rapide')
  return [...tags].slice(0, 3)
}
function inferMealType(meal) {
  const cat = (meal.strCategory||'').toLowerCase()
  const name = (meal.strMeal||'').toLowerCase()
  if (cat === 'breakfast') return 'petit_dejeuner'
  if (cat === 'dessert') return 'gouter'
  if (cat === 'starter') return 'petit_dejeuner'
  if (name.match(/salad|soup|sandwich|wrap|bowl/)) return 'dejeuner'
  if (cat === 'side') return 'dejeuner'
  return 'diner'
}
const MACROS = {
  Beef:{kcal:520,protein:30,carbs:35,fat:24}, Chicken:{kcal:460,protein:34,carbs:30,fat:16},
  Lamb:{kcal:580,protein:32,carbs:28,fat:32}, Pasta:{kcal:480,protein:20,carbs:60,fat:16},
  Seafood:{kcal:380,protein:32,carbs:22,fat:14}, Vegetarian:{kcal:380,protein:14,carbs:50,fat:14},
  Vegan:{kcal:360,protein:12,carbs:52,fat:12}, Dessert:{kcal:420,protein:6,carbs:60,fat:18},
  Breakfast:{kcal:380,protein:14,carbs:45,fat:16}, Pork:{kcal:500,protein:28,carbs:30,fat:26},
  Side:{kcal:280,protein:8,carbs:40,fat:10}, Starter:{kcal:280,protein:10,carbs:30,fat:14},
  Miscellaneous:{kcal:440,protein:20,carbs:40,fat:18}, Goat:{kcal:480,protein:30,carbs:22,fat:26},
}

// ─── EMOJI by category ────────────────────────────────────────────────────
const CAT_EMOJI = {
  Beef:'🥩',Chicken:'🍗',Dessert:'🍰',Lamb:'🍖',Pasta:'🍝',Seafood:'🐟',
  Pork:'🥩',Vegetarian:'🥗',Vegan:'🌱',Breakfast:'🍳',Side:'🥙',
  Starter:'🥗',Miscellaneous:'🍽️',Goat:'🍖',
}

// ─── Main ──────────────────────────────────────────────────────────────────
console.log('🚀 TheMealDB pipeline — Phase 1 (fetch + convert, no translation)\n')

// Get all categories
const catData = await fetchWithRetry('https://www.themealdb.com/api/json/v1/1/categories.php')
const categories = catData.categories.map(c => c.strCategory)
console.log(`📂 ${categories.length} categories: ${categories.join(', ')}\n`)

// Get all meal IDs per category
const allIds = new Set()
for (const cat of categories) {
  await sleep(300)
  const data = await fetchWithRetry(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(cat)}`)
  const meals = data?.meals ?? []
  meals.forEach(m => allIds.add(m.idMeal))
  process.stdout.write(`  ${cat}: ${meals.length}\n`)
}
console.log(`\n📊 ${allIds.size} unique meals to process\n`)

// Fetch + process each meal
const results = []
let n = 0
for (const id of allIds) {
  n++
  const cachePath = join(CACHE_DIR, `${id}.json`)
  let meal
  if (existsSync(cachePath)) {
    try { meal = JSON.parse(readFileSync(cachePath, 'utf8')) } catch { continue }
  } else {
    await sleep(300)
    const data = await fetchWithRetry(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    meal = data?.meals?.[0]
    if (!meal) { console.log(`  ⚠️  [${n}] no data for ${id}`); continue }
    writeFileSync(cachePath, JSON.stringify(meal))
  }

  // Ingredients
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`]?.trim()
    const meas = meal[`strMeasure${i}`]?.trim()
    if (!ing) continue
    const ingId = mapIng(ing)
    if (!ingId) continue
    const parsed = parseMeasure(meas, ing)
    // Divide by 4 (average 4 servings), round to 1 decimal
    const qty = Math.round((parsed.grams / 4) * 10) / 10
    if (qty > 0 && qty < 2000) ingredients.push({ id: ingId, qtyPerPerson: qty })
  }
  if (ingredients.length === 0) {
    process.stdout.write(`  ⚠️  [${n}/${allIds.size}] ${meal.strMeal} — no ingredients, skip\n`)
    continue
  }

  // Recipe ID
  const recipeId = (meal.strMeal || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
    .slice(0, 50)

  // YouTube
  const ytMatch = (meal.strYoutube || '').match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  const youtubeId = ytMatch?.[1] ?? null

  // Steps (English for now, translated in phase 2)
  const rawInstr = (meal.strInstructions || '').replace(/\r\n|\r/g, '\n').replace(/\n{2,}/g, '\n').trim()
  const sentences = rawInstr.match(/[^.!?\n]+[.!?\n]+/g)?.map(s => s.trim()).filter(s => s.length > 15) ?? []
  const stepsEN = sentences.slice(0, 8)

  // Photo
  const photoPath = join(OUT_PLATS, `${recipeId}.jpg`)
  try { await downloadImage(meal.strMealThumb, photoPath) } catch {}

  const m2 = MACROS[meal.strCategory] ?? MACROS.Miscellaneous

  results.push({
    id: recipeId,
    nameEN: meal.strMeal,
    nameFR: meal.strMeal,  // will be translated in phase 2
    nameAR: meal.strMeal,  // will be translated in phase 2
    emoji: CAT_EMOJI[meal.strCategory] ?? '🍽️',
    mealType: inferMealType(meal),
    tags: inferTags(meal),
    timeMin: 30,
    kcal: m2.kcal, protein: m2.protein, carbs: m2.carbs, fat: m2.fat,
    ingredients,
    equipment: ['plaque'],
    vegetarian: ['Vegetarian','Vegan'].includes(meal.strCategory),
    pescetarian: ['Seafood','Vegetarian','Vegan'].includes(meal.strCategory),
    glutenFree: false, lactoseFree: false, pregnancySafe: true,
    youtubeId,
    stepsEN,
    stepsFR: [],  // filled in phase 2
    stepsAR: [],  // filled in phase 2
    _source: 'themealdb',
    _category: meal.strCategory,
    _area: meal.strArea ?? '',
  })

  if (n % 50 === 0 || n === allIds.size) {
    process.stdout.write(`  ✅ [${n}/${allIds.size}] processed\n`)
  }
}

// Save raw JSON for phase 2
const rawPath = join(root, 'src', 'data', 'mealdb_raw.json')
writeFileSync(rawPath, JSON.stringify(results, null, 2))
console.log(`\n💾 Saved ${results.length} meals → src/data/mealdb_raw.json`)

// Also generate usable TypeScript immediately (English names, no steps)
// so the app already works while phase 2 translates
const lines = results.map(r => {
  const ings = r.ingredients.map(i => `      { id: '${i.id}', qtyPerPerson: ${i.qtyPerPerson} }`).join(',\n')
  const yt = r.youtubeId ? `,\n    youtubeId: ${JSON.stringify(r.youtubeId)}` : ''
  return `  {
    id: ${JSON.stringify(r.id)},
    name: { fr: ${JSON.stringify(r.nameFR)}, ar: ${JSON.stringify(r.nameAR)} },
    emoji: '${r.emoji}',
    mealType: '${r.mealType}',
    tags: [${r.tags.map(t=>`'${t}'`).join(', ')}],
    timeMin: 30,
    kcal: ${r.kcal}, protein: ${r.protein}, carbs: ${r.carbs}, fat: ${r.fat},
    ingredients: [\n${ings}\n    ],
    equipment: ['plaque'],
    vegetarian: ${r.vegetarian}, pescetarian: ${r.pescetarian},
    glutenFree: false, lactoseFree: false, pregnancySafe: true${yt},
    _source: 'themealdb' as any,
  }`
})

writeFileSync(join(root, 'src', 'data', 'recipes_mealdb.ts'),
`// AUTO-GENERATED — Phase 1 (English names). Run translate-mealdb.mjs for FR/AR.
import type { Recipe } from './types'
export const MEALDB_RECIPES: Recipe[] = [
${lines.join(',\n')}
]
`)

// New ingredients report
const newIngCount = Object.keys(NEW_ING).length
if (newIngCount > 0) {
  writeFileSync(join(root, 'src', 'data', 'new_ingredients_needed.txt'),
    Object.entries(NEW_ING).map(([id, name]) => `${id} // ${name}`).join('\n'))
  console.log(`⚠️  ${newIngCount} unmapped ingredients → src/data/new_ingredients_needed.txt`)
}

const withYt = results.filter(r => r.youtubeId).length
console.log(`\n✅ Done!`)
console.log(`   📋 ${results.length} recipes`)
console.log(`   🎬 ${withYt} with YouTube tutorial`)
console.log(`   📸 Photos → public/plats/`)
console.log(`\n👉 Next: node scripts/translate-mealdb.mjs  (FR+AR names & steps)`)
console.log(`👉 Then: node scripts/merge-recipes.mjs      (merge with Moroccan dishes)`)
