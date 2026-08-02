import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { resolve } from 'node:path'

// `--mode artifact` produces a single self-contained index.html (no service
// worker) that can be published/tested without a build step.
export default defineConfig(({ mode }) => {
  if (mode === 'artifact') {
    return {
      base: './',
      plugins: [react(), viteSingleFile()],
      resolve: { alias: { 'virtual:pwa-register': resolve(__dirname, 'src/pwa-stub.ts') } },
      build: { assetsInlineLimit: 100000000 },
    }
  }
  return {
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      manifest: {
        name: 'Romi — tes repas de la semaine',
        short_name: 'Romi',
        description: 'Romi prépare tes dîners de la semaine, adaptés à ton budget et ton magasin.',
        lang: 'fr',
        dir: 'auto',
        theme_color: '#14532d',
        background_color: '#f4eee6',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html'
      }
    })
  ]
  }
})
