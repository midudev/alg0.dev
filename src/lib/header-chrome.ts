import { $, $$ } from '@lib/dom'
import { getCategoryName, type Locale } from '@i18n/translations'
import { getLocaleUrl } from '@lib/locale-url'
import type { AlgorithmSummary } from '@lib/types'

/**
 * Keep the Astro-rendered site header in sync when the client selects/clears
 * an algorithm (SPA-style navigation inside AlgoViz).
 */
export function syncHeaderChrome(locale: Locale, algorithm: AlgorithmSummary | null): void {
  const title = $('[data-header-title]')
  const crumb = $('[data-header-breadcrumb]')
  const categoryEl = $('[data-header-crumb-category]')
  const nameEl = $('[data-header-crumb-name]')

  if (algorithm) {
    title?.setAttribute('hidden', '')
    crumb?.removeAttribute('hidden')
    if (categoryEl) categoryEl.textContent = getCategoryName(locale, algorithm.category)
    if (nameEl) nameEl.textContent = algorithm.name
  } else {
    title?.removeAttribute('hidden')
    crumb?.setAttribute('hidden', '')
  }

  for (const link of $$<HTMLAnchorElement>('[data-lang-link]')) {
    const lang = link.dataset.lang as Locale | undefined
    if (!lang) continue
    link.href = getLocaleUrl(lang, algorithm?.id)
    const active = lang === locale
    link.classList.toggle('is-active', active)
    if (active) link.setAttribute('aria-current', 'page')
    else link.removeAttribute('aria-current')
  }
}
