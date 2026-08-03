import type { Lang, Loc, Recipe } from '../data/types'
import { ingredientMap } from '../data/ingredients'

// Builds coherent cooking steps for a recipe FROM its real ingredients and
// quantities, so the dosages shown are always exact and consistent with the
// dish. Hand-written `recipe.steps` (when present) take priority.

const AROMATICS = new Set(['oignon', 'ail', 'echalote', 'gingembre', 'coriandre', 'persil', 'menthe', 'basilic', 'poireau'])
const GRAINS = new Set(['riz', 'pates', 'quinoa', 'semoule', 'boulgour', 'nouilles', 'nouilles_riz', 'vermicelle', 'polenta', 'gnocchi'])
const POTATOES = new Set(['pomme_terre', 'patate_douce'])
const SAUCES = new Set(['creme', 'lait_coco', 'sauce_soja', 'pesto', 'harissa', 'moutarde', 'mayonnaise', 'tomate_concassee', 'concentre_tomate', 'bouillon', 'curry', 'garam_masala', 'ras_el_hanout', 'paprika', 'cumin', 'curcuma', 'cannelle'])
const CHEESE = new Set(['parmesan', 'mozzarella', 'feta', 'cheddar', 'brie', 'chevre', 'ricotta', 'mascarpone', 'fromage_frais', 'paneer'])
const PROTEIN_NON_MEAT = new Set(['oeuf', 'tofu', 'pois_chiche', 'lentilles', 'haricots_rouges', 'haricots_blancs', 'edamame'])
const FRUITS = new Set(['banane', 'pomme', 'mangue', 'orange', 'fruits_rouges', 'dattes', 'raisins_secs', 'pruneaux', 'ananas'])
const SWEET = new Set(['sucre', 'miel', 'chocolat', 'cacao'])

function qtyStr(unit: 'g' | 'ml' | 'piece', qpp: number, lang: Lang): string {
  const per = lang === 'ar' ? '/شخص' : '/pers'
  if (unit === 'piece') { const n = Math.round(qpp * 10) / 10; return `${n}` }
  if (unit === 'ml') return qpp >= 1000 ? `${Math.round(qpp / 100) / 10} L${per}` : `${Math.round(qpp)} ml${per}`
  return qpp >= 1000 ? `${Math.round(qpp / 100) / 10} kg${per}` : `${Math.round(qpp)} g${per}`
}

interface Grp { id: string; name: Loc; qpp: number; unit: 'g' | 'ml' | 'piece' }

/** ingredient name without the store-format suffix, e.g. "flocons d'avoine (paquet)" → "flocons d'avoine" */
const nm = (l: Loc, lang: Lang): string => l[lang].replace(/\s*\([^)]*\)\s*$/, '')

function names(list: Grp[], lang: Lang, withQty = false): string {
  return list
    .map((g) => (withQty ? `${nm(g.name, lang)} (${qtyStr(g.unit, g.qpp, lang)})` : nm(g.name, lang)))
    .join(lang === 'ar' ? '، ' : ', ')
}

export function buildSteps(recipe: Recipe, lang: Lang): string[] {
  const items = recipe.ingredients
    .map((ri) => { const ing = ingredientMap[ri.id]; return ing ? { id: ri.id, name: ing.name, qpp: ri.qtyPerPerson, unit: ing.unit, cat: ing.category } : null })
    .filter(Boolean) as (Grp & { cat: string })[]

  const aromatics = items.filter((i) => AROMATICS.has(i.id))
  const grains = items.filter((i) => GRAINS.has(i.id))
  const potatoes = items.filter((i) => POTATOES.has(i.id))
  const proteins = items.filter((i) => i.cat === 'viande_poisson' || PROTEIN_NON_MEAT.has(i.id))
  const sauces = items.filter((i) => SAUCES.has(i.id))
  const cheese = items.filter((i) => CHEESE.has(i.id))
  const veg = items.filter((i) => i.cat === 'fruits_legumes' && !AROMATICS.has(i.id) && !POTATOES.has(i.id) && !FRUITS.has(i.id))
  const fruits = items.filter((i) => FRUITS.has(i.id))
  const sweet = items.filter((i) => SWEET.has(i.id))

  const method = recipe.equipment.includes('four') ? 'four'
    : recipe.equipment.includes('grill') ? 'grill'
    : recipe.equipment.includes('air_fryer') ? 'airfryer'
    : recipe.equipment.includes('mijoteuse') ? 'mijoteuse'
    : recipe.equipment.includes('plaque') ? 'poele' : 'aucun'

  const out: Loc[] = []
  const push = (fr: string, ar: string) => out.push({ fr, ar })
  const isSweet = recipe.mealType === 'gouter' || (sweet.length > 0 && proteins.length === 0 && grains.length === 0)

  // ---- Sweet / dessert / snack path ----
  if (isSweet) {
    if (fruits.length) push(`Préparez les fruits : ${names(fruits, 'fr')}.`, `حضّر الفواكه: ${names(fruits, 'ar')}.`)
    push(
      `Mélangez ${names([...sweet, ...cheese, ...sauces], 'fr', true) || 'les ingrédients'} jusqu’à obtenir une préparation homogène.`,
      `اخلط ${names([...sweet, ...cheese, ...sauces], 'ar', true) || 'المكونات'} حتى تحصل على مزيج متجانس.`,
    )
    if (method === 'four') push('Enfournez à 180 °C ~20–25 min, puis laissez tiédir.', 'اخبز على 180° لمدة 20–25 دقيقة ثم اتركه يبرد.')
    else if (method === 'poele') push('Faites cuire à la poêle quelques minutes de chaque côté.', 'اطبخه في المقلاة بضع دقائق على كل جانب.')
    else push('Réservez au frais 1–2 h avant de déguster.', 'ضعه في الثلاجة ساعة إلى ساعتين قبل التقديم.')
    return out.map((s) => s[lang])
  }

  // ---- Savory path ----
  if (aromatics.length || veg.length) {
    push(
      `Épluchez et émincez ${names([...aromatics], 'fr') || 'les aromates'}${veg.length ? `, lavez et coupez ${names(veg, 'fr')}` : ''}.`,
      `قشّر وقطّع ${names([...aromatics], 'ar') || 'التوابل العطرية'}${veg.length ? `، واغسل وقطّع ${names(veg, 'ar')}` : ''}.`,
    )
  }
  if (grains.length) {
    const g = grains[0]
    push(
      `Faites cuire ${nm(g.name, 'fr')} (${qtyStr(g.unit, g.qpp, 'fr')}) selon les indications du paquet.`,
      `اطبخ ${nm(g.name, 'ar')} (${qtyStr(g.unit, g.qpp, 'ar')}) حسب تعليمات العبوة.`,
    )
  }
  if (potatoes.length) {
    const p = potatoes[0]
    const how = method === 'four' ? { fr: 'au four ~25 min', ar: 'في الفرن ~25 دقيقة' } : { fr: 'à l’eau ~20 min', ar: 'في الماء ~20 دقيقة' }
    push(`Coupez ${nm(p.name, 'fr')} (${qtyStr(p.unit, p.qpp, 'fr')}) et faites cuire ${how.fr}.`, `قطّع ${nm(p.name, 'ar')} (${qtyStr(p.unit, p.qpp, 'ar')}) واطبخه ${how.ar}.`)
  }
  if (proteins.length) {
    const p = proteins[0]
    const cook = method === 'four' ? { fr: 'au four à 200 °C ~20 min', ar: 'في الفرن على 200° ~20 دقيقة' }
      : method === 'grill' ? { fr: 'au grill ~10 min en les retournant', ar: 'على الشواية ~10 دقائق مع التقليب' }
      : method === 'airfryer' ? { fr: 'à l’air fryer à 200 °C ~15 min', ar: 'في القلاية الهوائية على 200° ~15 دقيقة' }
      : method === 'mijoteuse' ? { fr: 'à couvert, à feu doux ~45 min', ar: 'مغطى على نار هادئة ~45 دقيقة' }
      : { fr: 'à la poêle 6–8 min à feu vif', ar: 'في المقلاة 6–8 دقائق على نار قوية' }
    push(
      `Faites cuire ${nm(p.name, 'fr')} (${qtyStr(p.unit, p.qpp, 'fr')}) ${cook.fr}.`,
      `اطبخ ${nm(p.name, 'ar')} (${qtyStr(p.unit, p.qpp, 'ar')}) ${cook.ar}.`,
    )
  }
  if (veg.length && (proteins.length || grains.length)) {
    push(`Ajoutez ${names(veg, 'fr')} et faites revenir 5–8 min.`, `أضف ${names(veg, 'ar')} وقلّبها 5–8 دقائق.`)
  }
  if (sauces.length || cheese.length) {
    push(
      `Incorporez ${names([...sauces, ...cheese], 'fr', true)} et laissez mijoter 3–5 min.`,
      `أضف ${names([...sauces, ...cheese], 'ar', true)} واتركها على نار هادئة 3–5 دقائق.`,
    )
  }
  push(
    `Salez, poivrez, rectifiez l’assaisonnement et servez${grains.length ? ` avec ${nm(grains[0].name, 'fr')}` : potatoes.length ? ` avec ${nm(potatoes[0].name, 'fr')}` : ''}.`,
    `ملّح وتبّل واضبط النكهة ثم قدّم${grains.length ? ` مع ${nm(grains[0].name, 'ar')}` : potatoes.length ? ` مع ${nm(potatoes[0].name, 'ar')}` : ''}.`,
  )

  return out.map((s) => s[lang])
}
