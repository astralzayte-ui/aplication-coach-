// Turns the single-file Vite build into an Artifact-ready HTML fragment:
// keeps the inline <style> and inline module <script>, drops external links.
import { readFileSync, writeFileSync } from 'node:fs'

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8')

const styles = [...html.matchAll(/<style[^>]*>[\s\S]*?<\/style>/g)].map((m) => m[0]).join('\n')
const script = (html.match(/<script[^>]*type="module"[^>]*>[\s\S]*?<\/script>/) || [''])[0]

const fragment = `<title>Romi — tes repas de la semaine</title>
${styles}
<div id="root"></div>
${script}
`

const out = process.argv[2] || './romi-artifact.html'
writeFileSync(out, fragment)
console.log('wrote', out, fragment.length, 'bytes')
