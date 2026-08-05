/**
 * Phase 2 — Translate meal names EN → FR + AR
 * Uses MyMemory free API (no key needed, 1000 req/day)
 * Names only (not full steps — those are kept in English for now and
 * displayed via a "show steps" toggle in the UI).
 *
 * Usage: node scripts/translate-mealdb.mjs
 * After: node scripts/merge-recipes.mjs
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import https from 'node:https'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const rawPath = join(root, 'src', 'data', 'mealdb_raw.json')
const tCachePath = join(root, '.mealdb-cache', 'translations.json')

const meals = JSON.parse(readFileSync(rawPath, 'utf8'))
const tCache = existsSync(tCachePath) ? JSON.parse(readFileSync(tCachePath, 'utf8')) : {}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { headers: { 'User-Agent': 'Romi/1.0' }, timeout: 8000 }, (res) => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch { resolve(null) } })
    })
    req.on('error', () => resolve(null))
    req.on('timeout', () => { req.destroy(); resolve(null) })
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Pre-built food translation dictionary (EN → FR) for common terms
// Avoids API calls for known translations
const FOOD_DICT_FR = {
  chicken: 'poulet', beef: 'bœuf', lamb: 'agneau', pork: 'porc',
  salmon: 'saumon', tuna: 'thon', cod: 'cabillaud', shrimp: 'crevettes',
  prawns: 'gambas', mussels: 'moules', squid: 'calamar',
  pasta: 'pâtes', spaghetti: 'spaghetti', rice: 'riz', noodles: 'nouilles',
  soup: 'soupe', stew: 'ragoût', curry: 'curry', salad: 'salade',
  cake: 'gâteau', pie: 'tourte', tart: 'tarte', bread: 'pain',
  pancakes: 'pancakes', waffles: 'gaufres', omelette: 'omelette',
  roast: 'rôti', grilled: 'grillé', fried: 'frit', baked: 'au four',
  creamy: 'crémeux', spicy: 'épicé', sweet: 'sucré',
  with: 'au', and: 'et', in: 'au', sauce: 'sauce',
}

const FOOD_DICT_AR = {
  chicken: 'دجاج', beef: 'لحم بقري', lamb: 'لحم الخروف', pork: 'لحم الخنزير',
  salmon: 'سلمون', tuna: 'تونة', curry: 'كاري', salad: 'سلطة',
  soup: 'شوربة', stew: 'يخنة', rice: 'أرز', pasta: 'معكرونة',
  cake: 'كعكة', bread: 'خبز', grilled: 'مشوي', fried: 'مقلي',
  roast: 'مشوي', baked: 'مخبوز', spicy: 'حار',
}

async function translateMyMemory(text, langpair) {
  const key = `${langpair}:${text}`
  if (tCache[key]) return tCache[key]
  await sleep(400)
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=${langpair}`
  const data = await fetchJSON(url)
  const result = data?.responseData?.translatedText
  if (result && result !== text && !result.includes('MYMEMORY WARNING')) {
    tCache[key] = result
    return result
  }
  return null
}

// Simple rule-based translation for meal names (fast, no API)
function quickTranslateFR(name) {
  let result = name
  const words = name.toLowerCase().split(/\s+/)
  // Try full name substitution for common dishes
  const KNOWN_FR = {
    'beef stew': 'Ragoût de bœuf', 'chicken curry': 'Curry de poulet',
    'fish and chips': 'Fish & chips', 'beef burger': 'Burger de bœuf',
    'chocolate cake': 'Gâteau au chocolat', 'apple pie': 'Tarte aux pommes',
    'lemon tart': 'Tarte au citron', 'cheesecake': 'Cheesecake',
    'chicken soup': 'Soupe de poulet', 'tomato soup': 'Soupe à la tomate',
    'greek salad': 'Salade grecque', 'caesar salad': 'Salade César',
    'spaghetti bolognese': 'Spaghetti bolognaise', 'lasagna': 'Lasagnes',
    'pizza margherita': 'Pizza margherita', 'beef tacos': 'Tacos de bœuf',
    'chicken tikka masala': 'Poulet tikka masala',
    'butter chicken': 'Butter chicken', 'dal': 'Dal de lentilles',
    'pad thai': 'Pad thaï', 'fried rice': 'Riz cantonais',
    'beef stir fry': 'Bœuf sauté au wok',
    'chicken stir fry': 'Poulet sauté au wok',
    'chocolate mousse': 'Mousse au chocolat',
    'creme brulee': 'Crème brûlée', 'tiramisu': 'Tiramisu',
    'panna cotta': 'Panna cotta', 'profiteroles': 'Profiteroles',
    'french onion soup': 'Soupe à l\'oignon gratinée',
    'beef bourguignon': 'Bœuf bourguignon',
    'coq au vin': 'Coq au vin', 'ratatouille': 'Ratatouille',
    'moussaka': 'Moussaka', 'hummus': 'Houmous', 'falafel': 'Falafel',
    'shakshuka': 'Shakshuka', 'tagine': 'Tajine',
    'biryani': 'Biryani', 'lamb biryani': 'Biryani d\'agneau',
    'chicken biryani': 'Biryani de poulet', 'palak paneer': 'Palak paneer',
  }
  const low = name.toLowerCase()
  for (const [k, v] of Object.entries(KNOWN_FR)) {
    if (low === k || low.includes(k)) return v
  }
  // Word substitution
  for (const [en, fr] of Object.entries(FOOD_DICT_FR)) {
    result = result.replace(new RegExp(`\\b${en}\\b`, 'gi'), fr)
  }
  return result
}

function quickTranslateAR(name) {
  const KNOWN_AR = {
    'chicken tikka masala': 'دجاج تيكا ماسالا', 'butter chicken': 'دجاج مع صوص البتر',
    'pad thai': 'باد تاي', 'fried rice': 'أرز مقلي', 'tiramisu': 'تيراميسو',
    'cheesecake': 'كيك الجبن', 'panna cotta': 'بانا كوتا',
    'biryani': 'برياني', 'moussaka': 'مساقعة', 'hummus': 'حمص',
    'falafel': 'فلافل', 'shakshuka': 'شكشوكة', 'tagine': 'طاجين',
    'couscous': 'كسكس', 'harira': 'حريرة',
    'beef bourguignon': 'بوف بورغينيون', 'ratatouille': 'راتاتوي',
  }
  const low = name.toLowerCase()
  for (const [k, v] of Object.entries(KNOWN_AR)) if (low.includes(k)) return v
  return name // Keep English if no match
}

console.log(`🌍 Translating ${meals.length} meal names EN → FR + AR...\n`)

let translated = 0, fromCache = 0, fromDict = 0, fromAPI = 0

for (let i = 0; i < meals.length; i++) {
  const meal = meals[i]
  const name = meal.nameEN

  // FR translation
  const quickFR = quickTranslateFR(name)
  if (quickFR !== name) {
    meal.nameFR = quickFR; fromDict++
  } else {
    const apiFR = await translateMyMemory(name, 'en|fr')
    meal.nameFR = apiFR ?? name
    if (apiFR) fromAPI++; else fromDict++
  }

  // AR translation
  const quickAR = quickTranslateAR(name)
  if (quickAR !== name) {
    meal.nameAR = quickAR; fromDict++
  } else {
    const apiAR = await translateMyMemory(name, 'en|ar')
    meal.nameAR = apiAR ?? name
    if (apiAR) fromAPI++; else fromDict++
  }

  translated++
  if (i % 100 === 0 || i === meals.length - 1) {
    process.stdout.write(`  [${i+1}/${meals.length}] "${name}" → FR:"${meal.nameFR}" AR:"${meal.nameAR}"\n`)
    // Save cache periodically
    writeFileSync(tCachePath, JSON.stringify(tCache))
  }
}

// Save updated raw data
writeFileSync(rawPath, JSON.stringify(meals, null, 2))
writeFileSync(tCachePath, JSON.stringify(tCache))

console.log(`\n✅ Translation done!`)
console.log(`   From dictionary: ${fromDict}`)
console.log(`   From MyMemory API: ${fromAPI}`)
console.log(`\n👉 Next: node scripts/merge-recipes.mjs`)
