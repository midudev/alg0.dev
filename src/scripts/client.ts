/**
 * Global client bootstrap (plain JS only — no React).
 * Loaded once from Layout.astro.
 */
import { toggleTheme } from '@lib/theme'
import { initSidebar } from '@lib/sidebar'
import { initControls } from '@lib/controls'
import { initCodePanelShell } from '@lib/code-panel-shell'
import { initKeyboardShortcuts } from '@lib/keyboard'
import { initShowcase } from '@lib/showcase'
import { initAllAlgoPages } from '@lib/algo-page'
import { $$ } from '@lib/dom'
import type { Locale } from '@i18n/translations'

// Theme toggle — any element with [data-theme-toggle]
document.addEventListener('click', (event) => {
  const target = event.target
  if (!(target instanceof Element)) return
  if (!target.closest('[data-theme-toggle]')) return
  event.preventDefault()
  toggleTheme()
})

initSidebar()
initControls()
initCodePanelShell()
initKeyboardShortcuts()
initAllAlgoPages()

// Home showcase (only present on welcome pages)
for (const el of $$<HTMLElement>('[data-showcase]')) {
  const locale = (el.dataset.showcaseLocale as Locale | undefined) ?? 'en'
  initShowcase(el, locale)
}
