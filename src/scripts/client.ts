/**
 * Global client bootstrap for plain-JS interactions outside React.
 * Loaded once from Layout.astro.
 */
import { toggleTheme } from '@lib/theme'
import { initSidebar } from '@lib/sidebar'
import { initControls } from '@lib/controls'
import { initCodePanelShell } from '@lib/code-panel-shell'
import { initKeyboardShortcuts } from '@lib/keyboard'

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
