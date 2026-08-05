/**
 * Import food photos from TheMealDB (free, no key) + Wikimedia Commons (fallback).
 * Usage: node scripts/import-photos.mjs
 *
 * After run, execute: node scripts/build-photos.mjs
 */
import { createWriteStream, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from 'node:stream/promises'
import https from 'node:https'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'public', 'plats')
mkdirSync(OUT, { recursive: true })

// ─── French → English search term mapping for TheMealDB ───────────────────
const SEARCH_MAP = {
  tajine_poulet_citron: 'Chicken Tajine',
  tajine_poulet:        'Chicken Tajine',
  tajine_poisson:       'Fish Chermoula',
  tajine_kefta_oeuf:    'Kefta Meatballs',
  tajine_agneau_pruneaux: 'Lamb Prunes',
  rfissa:               'Rfissa Chicken',
  harira:               'Harira',
  zaalouk:              'Zaalouk',
  loubia:               'White Bean Stew',
  sardines_chermoula:   'Sardines',
  merguez_frites:       'Sausage Chips',
  pastilla_poulet:      'Chicken Bastilla',
  batbout_kefta:        'Kefta Pita',
  falafel_pita:         'Falafel',
  chawarma_poulet:      'Chicken Shawarma',
  taboule_libanais:     'Tabbouleh',
  fattoush:             'Fattoush',
  moussaka:             'Moussaka',
  mujadara:             'Mujaddara',
  poulet_teriyaki:      'Chicken Teriyaki',
  boeuf_saute_legumes:  'Beef Stir Fry',
  nouilles_sautees_poulet: 'Chicken Noodles',
  riz_cantonais:        'Fried Rice',
  curry_vert_thai:      'Thai Green Curry',
  pad_thai:             'Pad Thai',
  ramen_poulet:         'Chicken Ramen',
  bo_bun:               'Vietnamese Beef',
  tofu_saute_legumes:   'Stir Fry Tofu',
  maki_saumon:          'Sushi',
  poulet_tikka_masala:  'Chicken Tikka Masala',
  dahl_lentilles:       'Dal',
  butter_chicken:       'Butter Chicken',
  biryani_poulet:       'Chicken Biryani',
  palak_paneer:         'Palak Paneer',
  lasagnes_boeuf:       'Lasagne',
  spaghetti_carbonara:  'Spaghetti Carbonara',
  pates_pesto:          'Pasta Pesto',
  aubergines_parmigiana: 'Parmigiana',
  risotto_asperges:     'Asparagus Risotto',
  gnocchi_creme_epinards: 'Gnocchi Spinach',
  salade_caprese:       'Caprese Salad',
  minestrone:           'Minestrone',
  tacos_boeuf:          'Beef Tacos',
  fajitas_poulet:       'Chicken Fajitas',
  quesadilla_poulet:    'Chicken Quesadilla',
  chili_vegetarien:     'Vegetarian Chilli',
  burrito_haricots:     'Bean Burrito',
  boeuf_bourguignon:    'Beef Bourguignon',
  blanquette_veau:      'Blanquette De Veau',
  ratatouille:          'Ratatouille',
  quiche_legumes:       'Vegetable Quiche',
  croque_monsieur:      'Croque Monsieur',
  hachis_parmentier:    'Shepherd Pie',
  poulet_roti_legumes:  'Roast Chicken',
  gratin_dauphinois:    'Gratin Dauphinois',
  soupe_oignon:         'French Onion Soup',
  vol_au_vent:          'Chicken Vol-au-Vent',
  pot_au_feu:           'Pot-au-feu',
  coq_au_vin:           'Coq Au Vin',
  magret_canard:        'Duck Breast',
  steak_pommes_vapeur:  'Steak Chips',
  pave_saumon_legumes:  'Salmon Vegetables',
  lieu_noir_curry:      'Curry Fish',
  crevettes_ail_beurre: 'Garlic Butter Prawns',
  homard_beurre:        'Lobster',
  saint_jacques_risotto: 'Scallop Risotto',
  crumble_saumon_courgette: 'Salmon Courgette',
  saumon_fume_avocado:  'Smoked Salmon Avocado',
  gamberoni_linguine:   'Prawn Linguine',
  omelet_fromage_herbes: 'Omelette Cheese',
  shakshuka:            'Shakshuka',
  oeuf_cocotte_foie_gras: 'Baked Egg',
  bruschetta_tomate:    'Bruschetta',
  tartine_avocat_oeuf:  'Avocado Toast',
  bowl_acai:            'Acai Bowl',
  granola_yaourt_fruits: 'Granola Yoghurt',
  pancakes_myrtilles:   'Blueberry Pancakes',
  french_toast:         'French Toast',
  gaufres:              'Waffles',
  crepes_nutella:       'Crepes',
  oeufs_benedict:       'Eggs Benedict',
  museli_fruits_secs:   'Muesli',
  tiramisu:             'Tiramisu',
  mousse_chocolat:      'Chocolate Mousse',
  fondant_chocolat:     'Chocolate Fudge Cake',
  tarte_tatin:          'Tarte Tatin',
  cheesecake:           'Cheesecake',
  riz_lait_cannelle:    'Rice Pudding',
  ile_flottante:        'Floating Islands',
  panna_cotta:          'Panna Cotta',
  creme_brulee:         'Creme Brulee',
  profiteroles:         'Profiteroles',
  mille_feuille:        'Mille-feuille',
  tarte_citron:         'Lemon Tart',
  eclair_chocolat:      'Chocolate Eclair',
  gateau_carotte:       'Carrot Cake',
  banana_bread:         'Banana Bread',
  crumble_pomme:        'Apple Crumble',
  cookies:              'Chocolate Chip Cookies',
  brownies:             'Brownies',
  muffins_myrtilles:    'Blueberry Muffins',
  creme_caramel:        'Creme Caramel',
  flan_patissier:       'Flan',
  tarte_fraises:        'Strawberry Tart',
  sorbet_citron:        'Lemon Sorbet',
  brochettes_fruits:    'Fruit Skewers',
  salade_fruits:        'Fruit Salad',
  carpaccio_fraises:    'Strawberry Carpaccio',
  bowl_thai:            'Thai Bowl',
  curry_pois_chiche:    'Chickpea Curry',
  pates_bolo:           'Spaghetti Bolognese',
  lentilles_mijotees:   'Lentil Stew',
  saumon_riz:           'Salmon Rice',
  gnocchi_courge_brie:  'Gnocchi Pumpkin',
  poulet_creme_tomate:  'Chicken Tomato Cream',
  kefta_frites:         'Kefta Chips',
  couscous_agneau:      'Lamb Couscous',
  couscous_poulet:      'Chicken Couscous',
  couscous_legumes:     'Vegetable Couscous',
  mechoui:              'Roast Lamb',
  pastilla_fruits_mer:  'Seafood Pastilla',
  seffa_poulet:         'Seffa Chicken',
  tanjia:               'Lamb Stew',
  bissara:              'Bissara',
  khobz_msemen:         'Msemen Bread',
  harcha:               'Harcha',
  sellou:               'Sellou',
  mhancha:              'Mhancha',
  cornes_gazelle:       'Moroccan Pastry',
  shakshouka_marocaine: 'Shakshuka',
  baghrir:              'Baghrir',
  chebakia:             'Chebakia',
  kaab_ghzal:           'Kaab Ghzal',
  gazpacho:             'Gazpacho',
  salade_nicoise:       'Nicoise Salad',
  bouillabaisse:        'Bouillabaisse',
  soupe_lentilles:      'Lentil Soup',
  veloute_champignons:  'Mushroom Soup',
  veloute_carotte:      'Carrot Soup',
  soupe_tomate_basilic: 'Tomato Soup',
  oeufs_plat_tomate:    'Fried Eggs Tomato',
  smoothie_fraise_banane: 'Strawberry Smoothie',
  porridge_pomme:       'Apple Porridge',
  avocado_toast_poulet: 'Chicken Avocado Toast',
  overnight_oats:       'Overnight Oats',
  salade_verte_poulet:  'Chicken Salad',
  salade_pasta_thon:    'Tuna Pasta Salad',
  salade_caesar:        'Caesar Salad',
  wrap_falafel:         'Falafel Wrap',
  bowl_buddha:          'Buddha Bowl',
  poke_bowl:            'Poke Bowl',
  burgers_maison:       'Beef Burger',
  club_sandwich:        'Club Sandwich',
  pizza_margherita:     'Margherita Pizza',
  pizza_jambon_champignons: 'Ham Mushroom Pizza',
  pizza_quatre_fromages: 'Four Cheese Pizza',
  pita_kefta:           'Kefta Pita',
  sandwich_poulet_avocat: 'Chicken Avocado Sandwich',
  bruschetta_poulet:    'Chicken Bruschetta',
  tartine_charcuterie:  'Charcuterie Toast',
  poulet_lemon_thym:    'Lemon Thyme Chicken',
  poulet_moutarde:      'Mustard Chicken',
  steak_hache_puree:    'Beef Steak Mash',
  carpaccio_boeuf:      'Beef Carpaccio',
  roti_boeuf_legumes:   'Roast Beef',
  brochettes_dinde:     'Turkey Skewers',
  hot_dog:              'Hot Dog',
  samossa_legumes:      'Samosa',
  nems_poulet:          'Spring Rolls',
  empanadas:            'Empanadas',
  bagel_saumon:         'Salmon Bagel',
  shakshuka_verte:      'Green Shakshuka',
  wok_nouilles_legumes: 'Noodle Stir Fry',
  coleslaw_poulet:      'Coleslaw Chicken',
  maquereau_grille:     'Grilled Mackerel',
  papillote_cabillaud:  'Cod En Papillote',
  soupe_de_poisson:     'Fish Soup',
  tartare_saumon:       'Salmon Tartare',
  brochettes_gambas:    'Prawn Skewers',
  oeufs_brouilles_champignons: 'Scrambled Eggs Mushroom',
  granola_maison:       'Homemade Granola',
  chia_seeds_mango:     'Mango Chia Pudding',
  cheesecake_framboise: 'Raspberry Cheesecake',
  fondant_caramel:      'Caramel Cake',
}

// ─── Wikimedia Commons search ──────────────────────────────────────────────
async function wikiSearch(query) {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(query)}&prop=pageimages&piprop=original&format=json&origin=*`
  try {
    const data = await fetchJSON(url)
    const pages = Object.values(data?.query?.pages ?? {})
    const img = pages[0]?.original?.source
    if (img && img.match(/\.(jpg|jpeg|png|webp)/i)) return img
  } catch {}
  return null
}

// ─── TheMealDB search ──────────────────────────────────────────────────────
async function mealDbSearch(query) {
  // Try exact search first
  const terms = query.toLowerCase().split(' ')
  for (const word of [query, terms[0]]) {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(word)}`
    try {
      const data = await fetchJSON(url)
      const meal = data?.meals?.[0]
      if (meal?.strMealThumb) return meal.strMealThumb + '/preview'
    } catch {}
  }
  return null
}

// ─── Wikimedia Commons image search ──────────────────────────────────────
async function wikiCommonsSearch(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query + ' food')}&srnamespace=6&format=json&origin=*&srlimit=3`
  try {
    const data = await fetchJSON(url)
    const results = data?.query?.search ?? []
    for (const r of results) {
      const title = r.title
      // Get the image URL
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=imageinfo&iiprop=url&iiurlwidth=600&format=json&origin=*`
      const info = await fetchJSON(infoUrl)
      const pages = Object.values(info?.query?.pages ?? {})
      const imgUrl = pages[0]?.imageinfo?.[0]?.thumburl
      if (imgUrl && imgUrl.match(/\.(jpg|jpeg|png|webp)/i)) return imgUrl
    }
  } catch {}
  return null
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Romi-App/1.0 (food photo import)' } }, (res) => {
      let data = ''
      res.on('data', d => data += d)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) } catch { reject(new Error('JSON parse error')) }
      })
    }).on('error', reject)
  })
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest)
    https.get(url, { headers: { 'User-Agent': 'Romi-App/1.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        return reject(new Error(`HTTP ${res.statusCode}`))
      }
      const contentType = res.headers['content-type'] ?? ''
      if (!contentType.startsWith('image/')) {
        file.close()
        return reject(new Error(`Not an image: ${contentType}`))
      }
      pipeline(res, file).then(resolve).catch(reject)
    }).on('error', reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// ─── Main ──────────────────────────────────────────────────────────────────
const { readFileSync } = await import('node:fs')
const recipes = readFileSync('/tmp/recipes_list.txt', 'utf8')
  .trim().split('\n')
  .map(line => { const [id, fr] = line.split('|'); return { id, fr } })

let done = 0, skipped = 0, failed = 0
const failedList = []

for (const { id, fr } of recipes) {
  const dest = join(OUT, `${id}.jpg`)
  // Skip already-downloaded (webp or jpg)
  const destWebp = join(OUT, `${id}.webp`)
  if (existsSync(dest) || existsSync(destWebp)) {
    skipped++
    continue
  }

  const searchTerm = SEARCH_MAP[id] ?? fr

  // 1. Try TheMealDB
  let imgUrl = await mealDbSearch(searchTerm)

  // 2. Fallback: Wikimedia Commons
  if (!imgUrl) {
    imgUrl = await wikiCommonsSearch(searchTerm)
  }

  // 3. Fallback: Wikipedia page image
  if (!imgUrl) {
    imgUrl = await wikiSearch(searchTerm)
  }

  if (imgUrl) {
    try {
      await downloadImage(imgUrl, dest)
      done++
      process.stdout.write(`✅ [${done}] ${id}\n`)
    } catch (e) {
      failed++
      failedList.push(id)
      process.stdout.write(`❌ ${id}: ${e.message}\n`)
    }
  } else {
    failed++
    failedList.push(id)
    process.stdout.write(`⚠️  No source found: ${id} (${fr})\n`)
  }

  await sleep(250) // be polite to the APIs
}

console.log(`\n✅ Downloaded: ${done}`)
console.log(`⏭️  Already existed: ${skipped}`)
console.log(`❌ Failed/missing: ${failed}`)
if (failedList.length) console.log('Missing:', failedList.join(', '))
