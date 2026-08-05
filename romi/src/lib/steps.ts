import type { Lang, Loc, Recipe } from '../data/types'
import { locStr } from '../data/types'
import { ingredientMap } from '../data/ingredients'

// Builds coherent, correctly-dosed cooking steps FROM a recipe's real
// ingredients and quantities, branching by dish type so the result reads like
// a real recipe (not a generic template). Hand-written `recipe.steps` win.

const AROMATICS = new Set(['oignon', 'ail', 'echalote', 'gingembre', 'coriandre', 'persil', 'menthe', 'basilic', 'poireau'])
const GRAINS = new Set(['riz', 'pates', 'quinoa', 'semoule', 'boulgour', 'nouilles', 'nouilles_riz', 'vermicelle', 'polenta', 'gnocchi'])
const POTATOES = new Set(['pomme_terre', 'patate_douce'])
const SAUCES = new Set(['creme', 'lait_coco', 'sauce_soja', 'pesto', 'harissa', 'moutarde', 'mayonnaise', 'tomate_concassee', 'concentre_tomate', 'bouillon', 'curry', 'garam_masala', 'ras_el_hanout', 'paprika', 'cumin', 'curcuma'])
const CHEESE = new Set(['parmesan', 'mozzarella', 'feta', 'cheddar', 'brie', 'chevre', 'ricotta', 'fromage_frais', 'paneer'])
const PROTEIN_NON_MEAT = new Set(['oeuf', 'tofu', 'pois_chiche', 'lentilles', 'haricots_rouges', 'haricots_blancs', 'edamame'])
const FRUITS = new Set(['banane', 'pomme', 'mangue', 'orange', 'fruits_rouges', 'dattes', 'raisins_secs', 'pruneaux', 'ananas'])
const LIQUIDS = new Set(['lait', 'lait_coco'])

function qtyStr(unit: 'g' | 'ml' | 'piece', qpp: number, lang: Lang): string {
  const per = lang === 'ar' ? '/شخص' : '/pers'
  if (unit === 'piece') return `${Math.round(qpp * 10) / 10}`
  if (unit === 'ml') return qpp >= 1000 ? `${Math.round(qpp / 100) / 10} L${per}` : `${Math.round(qpp)} ml${per}`
  return qpp >= 1000 ? `${Math.round(qpp / 100) / 10} kg${per}` : `${Math.round(qpp)} g${per}`
}

interface Grp { id: string; name: Loc; qpp: number; unit: 'g' | 'ml' | 'piece'; cat: string }
const nm = (l: Loc, lang: Lang): string => locStr(l, lang).replace(/\s*\([^)]*\)\s*$/, '')

export function buildSteps(recipe: Recipe, lang: Lang): string[] {
  const items = recipe.ingredients
    .map((ri) => { const ing = ingredientMap[ri.id]; return ing ? { id: ri.id, name: ing.name, qpp: ri.qtyPerPerson, unit: ing.unit, cat: ing.category } : null })
    .filter(Boolean) as Grp[]
  const byId = new Map(items.map((i) => [i.id, i]))
  const has = (id: string) => byId.has(id)
  const q = (id: string) => { const i = byId.get(id); return i ? qtyStr(i.unit, i.qpp, lang) : '' }

  const out: Loc[] = []
  const push = (fr: string, ar: string) => out.push({ fr, ar })
  const list = (arr: Grp[], withQty = false) => arr
    .map((g) => (withQty ? `${nm(g.name, lang)} (${qtyStr(g.unit, g.qpp, lang)})` : nm(g.name, lang)))
    .join(lang === 'ar' ? '، ' : ', ')

  const aromatics = items.filter((i) => AROMATICS.has(i.id))
  const grains = items.filter((i) => GRAINS.has(i.id))
  const potatoes = items.filter((i) => POTATOES.has(i.id))
  const proteins = items.filter((i) => i.cat === 'viande_poisson' || PROTEIN_NON_MEAT.has(i.id))
  const sauces = items.filter((i) => SAUCES.has(i.id))
  const cheese = items.filter((i) => CHEESE.has(i.id))
  const veg = items.filter((i) => i.cat === 'fruits_legumes' && !AROMATICS.has(i.id) && !POTATOES.has(i.id) && !FRUITS.has(i.id))
  const fruits = items.filter((i) => FRUITS.has(i.id))
  const liquid = items.find((i) => LIQUIDS.has(i.id))

  const name = recipe.name.fr.toLowerCase()
  const equip = recipe.equipment
  const method = equip.includes('four') ? 'four' : equip.includes('grill') ? 'grill' : equip.includes('air_fryer') ? 'airfryer' : equip.includes('mijoteuse') ? 'mijoteuse' : equip.includes('plaque') ? 'poele' : 'aucun'

  const isSweetLike = recipe.mealType === 'gouter' || recipe.mealType === 'petit_dejeuner'
  const hasFlour = has('farine') || has('farine_sarrasin')
  const hasSugar = has('sucre') || has('miel') || has('chocolat') || has('cacao')

  // ---------- 1) Smoothie / boisson mixée ----------
  if (isSweetLike && method === 'aucun' && !hasFlour && (has('lait') || has('yaourt') || has('yaourt_grec') || has('lait_coco')) && fruits.length && !has('flocons_avoine')) {
    push(`Épluchez et coupez ${list(fruits)} en morceaux.`, `قشّر وقطّع ${list(fruits)} إلى قطع.`)
    push(`Mixez ${list(items.filter((i) => i.id !== 'citron'), true)} jusqu’à texture lisse.`, `اخلط ${list(items.filter((i) => i.id !== 'citron'), true)} حتى يصبح ناعما.`)
    push('Versez dans un verre ou un bol et dégustez aussitôt.', 'اسكبه في كأس أو وعاء وتناوله فورا.')
    return out.map((s) => locStr(s, lang))
  }

  // ---------- 2) Porridge / overnight oats ----------
  if (has('flocons_avoine') && (has('lait') || has('lait_coco'))) {
    const cold = recipe.timeMin <= 6 || name.includes('overnight')
    if (cold) {
      push(`Mélangez les flocons d’avoine (${q('flocons_avoine')}) avec le lait (${q('lait') || q('lait_coco')})${has('graines_chia') ? ` et les graines de chia (${q('graines_chia')})` : ''}.`, `اخلط الشوفان (${q('flocons_avoine')}) مع الحليب (${q('lait') || q('lait_coco')})${has('graines_chia') ? ` وبذور الشيا (${q('graines_chia')})` : ''}.`)
      push('Laissez reposer au frais toute la nuit (ou 30 min minimum).', 'اتركه في الثلاجة طوال الليل (أو 30 دقيقة على الأقل).')
    } else {
      push(`Portez le lait (${q('lait') || q('lait_coco')}) à frémissement, ajoutez les flocons (${q('flocons_avoine')}).`, `سخّن الحليب (${q('lait') || q('lait_coco')}) حتى الغليان الخفيف ثم أضف الشوفان (${q('flocons_avoine')}).`)
      push('Faites cuire 4–5 min à feu doux en remuant jusqu’à consistance crémeuse.', 'اطبخه 4–5 دقائق على نار هادئة مع التحريك حتى يصبح كريميا.')
    }
    if (fruits.length) push(`Garnissez de ${list(fruits)}${has('miel') ? ', d’un filet de miel' : ''}${has('amandes') || has('noix') ? ' et de fruits secs' : ''}.`, `زيّنه بـ ${list(fruits)}${has('miel') ? ' وقليل من العسل' : ''}.`)
    return out.map((s) => locStr(s, lang))
  }

  // ---------- 3) Pâte : gaufres, pancakes, crêpes, msemen, harcha, cakes ----------
  const doughBase = byId.get('farine') || byId.get('farine_sarrasin') || byId.get('semoule')
  const meatFish = items.some((i) => i.cat === 'viande_poisson')
  if (doughBase && isSweetLike && !meatFish) {
    const extraSemoule = has('farine') && has('semoule')
    push(`Dans un saladier, mélangez ${nm(doughBase.name, lang)} (${qtyStr(doughBase.unit, doughBase.qpp, lang)})${extraSemoule ? ` et la semoule (${q('semoule')})` : ''}${has('sucre') ? ` et le sucre (${q('sucre')})` : ''} avec une pincée de sel.`, `في وعاء، اخلط ${nm(doughBase.name, lang)} (${qtyStr(doughBase.unit, doughBase.qpp, lang)})${has('sucre') ? ` والسكر (${q('sucre')})` : ''} مع رشّة ملح.`)
    const liqFr = has('lait') ? `le lait (${q('lait')})` : 'de l’eau tiède (~120 ml/pers)'
    const liqAr = has('lait') ? `الحليب (${q('lait')})` : 'ماءً فاترا'
    const finishFr = has('lait') || has('oeuf') ? 'mélangez en une pâte lisse sans grumeaux' : 'pétrissez en une pâte souple'
    push(`Ajoutez ${has('oeuf') ? `les œufs (${q('oeuf')}) et ` : ''}${liqFr}, ${finishFr}.`, `أضف ${has('oeuf') ? `البيض (${q('oeuf')}) و` : ''}${liqAr}، واعجن حتى تصبح عجينة متجانسة.`)
    if (has('beurre')) push(`Incorporez le beurre fondu (${q('beurre')})${fruits.length ? ` puis ${list(fruits)}` : ''}. Laissez reposer 10 min.`, `أضف الزبدة المذابة (${q('beurre')}). اتركها ترتاح 10 دقائق.`)
    if (cheese.length) push(`Garnissez / farcissez avec ${list(cheese, true)}.`, `احشُها بـ ${list(cheese, true)}.`)
    if (method === 'four') {
      push('Versez dans un moule et enfournez à 180 °C pendant 25–30 min ; vérifiez avec la pointe d’un couteau.', 'اسكبها في قالب واخبزها على 180° لمدة 25–30 دقيقة.')
    } else {
      const tool = name.includes('gaufre') ? { fr: 'le gaufrier', ar: 'آلة الوافل' } : { fr: 'une poêle légèrement huilée', ar: 'مقلاة مدهونة قليلا' }
      push(`Faites chauffer ${tool.fr} et faites cuire 2–4 min de chaque côté jusqu’à doré.`, `سخّن ${tool.ar} واطبخها 2–4 دقائق على كل جانب حتى تحمرّ.`)
    }
    push(`Servez tiède${has('miel') ? ', arrosé de miel' : has('chocolat') ? ', avec un peu de chocolat' : cheese.length ? '' : ', avec du sucre ou des fruits'}.`, `قدّمها دافئة${has('miel') ? ' مع العسل' : ''}.`)
    return out.map((s) => locStr(s, lang))
  }

  // ---------- 4) Desserts crémeux (tiramisu, mousse, panna cotta, flan, riz au lait) ----------
  if (recipe.mealType === 'gouter' && !hasFlour) {
    if (has('riz') && has('lait')) {
      push(`Rincez le riz (${q('riz')}), versez-le dans le lait (${q('lait')}) avec le sucre (${q('sucre')}).`, `اغسل الأرز (${q('riz')}) وضعه في الحليب (${q('lait')}) مع السكر (${q('sucre')}).`)
      push('Faites cuire 25–30 min à feu doux en remuant souvent, jusqu’à consistance crémeuse.', 'اطبخه 25–30 دقيقة على نار هادئة مع التحريك حتى يصبح كريميا.')
      if (has('cannelle')) push('Parfumez à la cannelle et servez tiède ou froid.', 'أضف القرفة وقدّمه دافئا أو باردا.')
      return out.map((s) => locStr(s, lang))
    }
    if (has('mascarpone') || has('creme')) {
      push(`Fouettez ${has('mascarpone') ? `le mascarpone (${q('mascarpone')})` : `la crème (${q('creme')})`} avec le sucre (${q('sucre')})${has('oeuf') ? ' et les jaunes d’œufs' : ''} jusqu’à texture mousseuse.`, `اخفق ${has('mascarpone') ? `الماسكاربوني (${q('mascarpone')})` : `الكريمة (${q('creme')})`} مع السكر (${q('sucre')}) حتى يصبح رغويا.`)
      if (has('biscuits')) push(`Trempez rapidement les biscuits (${q('biscuits')}) et alternez avec la crème dans des verrines.`, `اغمس البسكويت (${q('biscuits')}) بسرعة وبدّله مع الكريمة في أكواب.`)
      if (has('cacao')) push('Saupoudrez de cacao.', 'رشّ الكاكاو فوقه.')
      push('Réservez au frais au moins 2 h avant de déguster.', 'ضعه في الثلاجة ساعتين على الأقل قبل التقديم.')
      return out.map((s) => locStr(s, lang))
    }
    // sinon (fruits, dattes, etc.) : assemblage simple
    push(`Préparez ${list(items, true)}.`, `حضّر ${list(items, true)}.`)
    push('Assemblez, mélangez délicatement et réservez au frais avant de servir.', 'اجمع المكونات وامزجها برفق ثم ضعها في الثلاجة قبل التقديم.')
    return out.map((s) => locStr(s, lang))
  }

  // ---------- 5) Soupes / veloutés ----------
  if (/soupe|velout|chorba|harira|gazpacho|minestrone|bissara/.test(name)) {
    if (method === 'aucun') { // gazpacho
      push(`Mixez ${list(veg, true)} avec l’ail et l’huile d’olive jusqu’à obtenir un velouté.`, `اخلط ${list(veg, true)} مع الثوم وزيت الزيتون حتى يصبح ناعما.`)
      push('Salez, ajoutez un peu d’eau si besoin et servez bien frais.', 'ملّح وأضف قليلا من الماء إن لزم وقدّمه باردا.')
      return out.map((s) => locStr(s, lang))
    }
    push(`Émincez ${list(aromatics)} et faites-les revenir 3 min dans un filet d’huile.`, `قطّع ${list(aromatics)} وقلّبها 3 دقائق في قليل من الزيت.`)
    push(`Ajoutez ${list([...veg, ...potatoes], true)}${grains.length ? ` et ${list(grains, true)}` : ''}, couvrez d’eau (~250 ml/pers)${has('bouillon') ? ' avec le bouillon' : ''}.`, `أضف ${list([...veg, ...potatoes], true)}${grains.length ? ` و${list(grains, true)}` : ''} وغطِّها بالماء (~250 مل/شخص)${has('bouillon') ? ' مع المرقة' : ''}.`)
    push('Laissez mijoter 20–25 min à couvert.', 'اتركها على نار هادئة 20–25 دقيقة مغطاة.')
    if (/velout/.test(name)) push(`Mixez finement${has('creme') ? `, ajoutez la crème (${q('creme')})` : ''} et rectifiez l’assaisonnement.`, `اخلطها جيدا${has('creme') ? ` وأضف الكريمة (${q('creme')})` : ''} واضبط الملح.`)
    else push('Rectifiez l’assaisonnement et servez chaud.', 'اضبط النكهة وقدّمها ساخنة.')
    return out.map((s) => locStr(s, lang))
  }

  // ---------- 6) Œufs (omelette, brouillés, shakshuka…) ----------
  if (has('oeuf') && proteins.length === 1 && !grains.length && !potatoes.length && (method === 'poele' || method === 'four')) {
    if (veg.length || has('tomate_concassee')) {
      push(`Faites revenir ${list([...aromatics, ...veg])} 5–7 min dans un filet d’huile.`, `قلّب ${list([...aromatics, ...veg])} 5–7 دقائق في قليل من الزيت.`)
      push(`Cassez les œufs (${q('oeuf')}) par-dessus${has('feta') ? ` avec la feta (${q('feta')})` : ''}, couvrez et laissez cuire 4–5 min.`, `اكسر البيض (${q('oeuf')}) فوقها${has('feta') ? ` مع الفيتا (${q('feta')})` : ''}، غطِّ واتركه 4–5 دقائق.`)
    } else {
      push(`Battez les œufs (${q('oeuf')}) en omelette, salez et poivrez.`, `اخفق البيض (${q('oeuf')})، وملّح وبهّر.`)
      push('Versez dans une poêle beurrée et faites cuire 3–4 min à feu moyen.', 'اسكبه في مقلاة مدهونة بالزبدة واطبخه 3–4 دقائق على نار متوسطة.')
    }
    push(`Servez aussitôt${has('pain') ? ' avec du pain' : ''}.`, `قدّمه فورا${has('pain') ? ' مع الخبز' : ''}.`)
    return out.map((s) => locStr(s, lang))
  }

  // ---------- 7) Salade / assemblage à froid ----------
  if (method === 'aucun' && (has('salade') || has('roquette') || (has('tomate') && has('concombre')) || name.includes('salade') || name.includes('tartare') || name.includes('carpaccio') || name.includes('ceviche') || name.includes('poke') || name.includes('maki'))) {
    if (grains.length) push(`Faites cuire ${list(grains, true)} et laissez refroidir.`, `اطبخ ${list(grains, true)} واتركه يبرد.`)
    if (proteins.length) push(`Préparez ${list(proteins, true)} (émincé/en dés selon la recette).`, `حضّر ${list(proteins, true)} (مقطّعا حسب الوصفة).`)
    push(`Coupez ${list([...veg, ...aromatics])}.`, `قطّع ${list([...veg, ...aromatics])}.`)
    push(`Assaisonnez avec ${has('huile_olive') ? `l’huile d’olive (${q('huile_olive')})` : 'un filet d’huile'}${has('citron') ? ', le jus de citron' : ''}${has('sauce_soja') ? ', la sauce soja' : ''}, mélangez et servez frais.`, `تبّل بـ ${has('huile_olive') ? `زيت الزيتون (${q('huile_olive')})` : 'قليل من الزيت'}${has('citron') ? ' وعصير الليمون' : ''}، امزج وقدّمه باردا.`)
    return out.map((s) => locStr(s, lang))
  }

  // ---------- 8) Plat salé cuisiné (par défaut) ----------
  if (aromatics.length || veg.length) push(`Épluchez et émincez ${list(aromatics) || 'les aromates'}${veg.length ? `, lavez et coupez ${list(veg)}` : ''}.`, `قشّر وقطّع ${list(aromatics) || 'التوابل'}${veg.length ? `، واغسل وقطّع ${list(veg)}` : ''}.`)
  if (grains.length) { const g = grains[0]; push(`Faites cuire ${nm(g.name, 'fr')} (${qtyStr(g.unit, g.qpp, 'fr')}) selon le paquet.`, `اطبخ ${nm(g.name, 'ar')} (${qtyStr(g.unit, g.qpp, 'ar')}) حسب العبوة.`) }
  if (potatoes.length) { const p = potatoes[0]; const how = method === 'four' ? { fr: 'au four ~25 min', ar: 'في الفرن ~25 دقيقة' } : { fr: 'à l’eau ~20 min', ar: 'في الماء ~20 دقيقة' }; push(`Coupez ${nm(p.name, 'fr')} (${qtyStr(p.unit, p.qpp, 'fr')}) et faites cuire ${how.fr}.`, `قطّع ${nm(p.name, 'ar')} واطبخه ${how.ar}.`) }
  if (proteins.length) {
    const p = proteins[0]
    const cook = method === 'four' ? { fr: 'au four à 200 °C ~20 min', ar: 'في الفرن على 200° ~20 دقيقة' }
      : method === 'grill' ? { fr: 'au grill ~10 min en retournant', ar: 'على الشواية ~10 دقائق مع التقليب' }
      : method === 'airfryer' ? { fr: 'à l’air fryer à 200 °C ~15 min', ar: 'في القلاية الهوائية على 200° ~15 دقيقة' }
      : method === 'mijoteuse' ? { fr: 'à couvert à feu doux ~45 min', ar: 'مغطى على نار هادئة ~45 دقيقة' }
      : { fr: 'à la poêle 6–8 min à feu vif', ar: 'في المقلاة 6–8 دقائق على نار قوية' }
    push(`Faites cuire ${nm(p.name, 'fr')} (${qtyStr(p.unit, p.qpp, 'fr')}) ${cook.fr}.`, `اطبخ ${nm(p.name, 'ar')} (${qtyStr(p.unit, p.qpp, 'ar')}) ${cook.ar}.`)
  }
  if (veg.length && (proteins.length || grains.length)) push(`Ajoutez ${list(veg)} et faites revenir 5–8 min.`, `أضف ${list(veg)} وقلّبها 5–8 دقائق.`)
  if (sauces.length || cheese.length) push(`Incorporez ${list([...sauces, ...cheese], true)} et laissez mijoter 3–5 min.`, `أضف ${list([...sauces, ...cheese], true)} واتركها 3–5 دقائق.`)
  push(`Salez, poivrez et servez${grains.length ? ` avec ${nm(grains[0].name, 'fr')}` : potatoes.length ? ` avec ${nm(potatoes[0].name, 'fr')}` : ''}.`, `ملّح وبهّر وقدّم${grains.length ? ` مع ${nm(grains[0].name, 'ar')}` : ''}.`)
  return out.map((s) => locStr(s, lang))
}
