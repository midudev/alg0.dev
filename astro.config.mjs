// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { splitAlgorithmChunks } from './scripts/split-algorithm-chunks.mjs'

export default defineConfig({
  site: 'https://alg0.dev',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/algorithm-content/'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss(), splitAlgorithmChunks()],
  },
})
