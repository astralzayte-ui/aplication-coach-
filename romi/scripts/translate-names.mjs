/**
 * Traduit les noms de recettes TheMealDB encore en anglais en français correct
 * en utilisant l'API Claude (claude-haiku-4-5) par lots de 60.
 */
import Anthropic from '@anthropic-ai/sdk'
import { readFileSync, writeFileSync } from 'fs'

const client = new Anthropic()

const SRC = 'src/data/recipes_mealdb.ts'
const raw = readFileSync(SRC, 'utf8')

// --- 1. Extraire tous les noms FR + leur position dans le fichier ---------------
const NAME_RE = /name: \{ fr: "([^"]+)", ar: "([^"]+)"/g
const entries = []
let m
while ((m = NAME_RE.exec(raw)) !== null) {
  entries.push({ fr: m[1], ar: m[2], start: m.index, full: m[0] })
}
console.log(`Trouvé ${entries.length} recettes`)

// --- 2. Repérer celles dont le FR est encore anglais ----------------------------
function looksEnglish(s) {
  const hasAccent = /[éèêëàâäîïôöùûüçœæÉÈÊËÀÂÄÎÏÔÖÙÛÜÇŒÆ]/.test(s)
  const hasArabic = /[؀-ۿ]/.test(s)
  const allAscii  = /^[a-zA-Z0-9\s\-\(\)&,"'.\/!]+$/.test(s)
  return !hasAccent && !hasArabic && allAscii
}

const toTranslate = entries.filter(e => looksEnglish(e.fr))
console.log(`À traduire : ${toTranslate.length} noms`)

// --- 3. Traduire par lots de 60 via claude-haiku-4-5 ----------------------------
const BATCH = 60
const translations = {}   // original FR (anglais) → bon nom FR

for (let i = 0; i < toTranslate.length; i += BATCH) {
  const batch = toTranslate.slice(i, i + BATCH)
  const list = batch.map((e, idx) => `${idx + 1}. ${e.fr}`).join('\n')

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: `Tu es un traducteur culinaire professionnel (EN → FR).
Traduis ces noms de plats en français naturel et correct.
Règles :
- Garde les noms propres de plats internationaux quand il n'y a pas de traduction française établie (ex: "Tacos", "Sushi", "Pad Thai", "Moussaka" → garde tel quel)
- Traduis le reste : "Chicken Stew" → "Ragoût de poulet", "Beef Wellington" → "Bœuf Wellington", etc.
- Réponse UNIQUEMENT : numéro + point + nom traduit, une ligne par plat, RIEN d'autre.
- Pas d'explication, pas de note.

Plats à traduire :
${list}`
    }]
  })

  const lines = resp.content[0].text.trim().split('\n')
  for (let j = 0; j < lines.length; j++) {
    const line = lines[j].replace(/^\d+\.\s*/, '').trim()
    if (line && batch[j]) {
      translations[batch[j].fr] = line
    }
  }
  console.log(`Lot ${Math.floor(i/BATCH)+1}/${Math.ceil(toTranslate.length/BATCH)} — ${Object.keys(translations).length} noms traduits`)
  // Petite pause pour éviter le rate-limit
  if (i + BATCH < toTranslate.length) await new Promise(r => setTimeout(r, 500))
}

// --- 4. Appliquer les traductions dans le fichier --------------------------------
let updated = raw
let count = 0
for (const [orig, trad] of Object.entries(translations)) {
  if (orig === trad) continue  // pas de changement
  // Remplacer uniquement dans les champs name.fr
  const escaped = orig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const re = new RegExp(`(name: \\{ fr: )"${escaped}"`, 'g')
  const before = updated
  updated = updated.replace(re, `$1"${trad}"`)
  if (updated !== before) count++
}
console.log(`\n${count} noms mis à jour`)

writeFileSync(SRC, updated)
console.log('Fichier écrit :', SRC)

// Aperçu de quelques traductions
const sample = Object.entries(translations).filter(([o, t]) => o !== t).slice(0, 20)
console.log('\nExemples :')
for (const [o, t] of sample) console.log(`  "${o}" → "${t}"`)
