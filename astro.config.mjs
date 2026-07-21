// @ts-check
import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'
import sitemap from '@astrojs/sitemap'
import { splitAlgorithmChunks } from './scripts/split-algorithm-chunks.mjs'

export default defineConfig({
  site: 'https://alg0.dev',
  devToolbar: {
    enabled: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/algorithm-content/') && !page.includes('/algorithm-code/'),
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          es: 'es',
        },
      },
      serialize(item) {
        // Mirror HTML hreflang: point x-default at the English (unprefixed) URL.
        const links = item.links ?? []
        const en = links.find((link) => link.lang === 'en')
        if (en && !links.some((link) => link.lang === 'x-default')) {
          item.links = [...links, { ...en, lang: 'x-default' }]
        }
        return item
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
