// Renders the Romi logo SVG to PNG icons using Playwright's bundled Chromium.
import { chromium } from 'playwright'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const svg = readFileSync(resolve(__dirname, '../public/favicon.svg'), 'utf8')
const pub = resolve(__dirname, '../public')

const browser = await chromium.launch()
for (const size of [192, 512]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } })
  const html = `<!doctype html><html><body style="margin:0;padding:0">
    <div style="width:${size}px;height:${size}px">${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}</div>
  </body></html>`
  await page.setContent(html, { waitUntil: 'networkidle' })
  const buf = await page.screenshot({ omitBackground: true })
  writeFileSync(resolve(pub, `icon-${size}.png`), buf)
  await page.close()
  console.log('wrote icon-' + size + '.png')
}
await browser.close()
