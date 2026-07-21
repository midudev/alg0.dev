/**
 * Plain-JS behaviors for the static SiteSidebar.astro (outside React).
 * Catalog, icons, and colors are SSR HTML/CSS — this file only wires interaction.
 */
import { $, $$ } from '@lib/dom'

export const SELECT_ALGORITHM_EVENT = 'alg0:select-algorithm'
export type SelectAlgorithmDetail = { id: string }

const SIDEBAR_MAX = 260
const COLLAPSE_THRESHOLD = 100
const COLLAPSE_FADE_START = 200
/** Below this: mobile drawer (hamburger). */
const MOBILE_MQ = '(max-width: 767px)'
/**
 * Desktop but too narrow for sidebar + viz + code together (~768–1099).
 * Collapse the sidebar and show the expand icon in the header.
 */
const COMPACT_MQ = '(max-width: 1099px)'

function shell(): HTMLElement | null {
  return $('[data-sidebar-shell]')
}

function panel(): HTMLElement | null {
  return $('[data-sidebar-panel]')
}

function isMobile(): boolean {
  return window.matchMedia(MOBILE_MQ).matches
}

function isCompactDesktop(): boolean {
  return !isMobile() && window.matchMedia(COMPACT_MQ).matches
}

function syncSidebarToggle(collapsed: boolean): void {
  const btn = $<HTMLButtonElement>('[data-sidebar-toggle]')
  if (!btn) return
  // Mobile: always show (opens drawer). Desktop: only when sidebar is collapsed.
  const mobile = isMobile()
  btn.hidden = !mobile && !collapsed
  const label = mobile
    ? (btn.dataset.labelMenu ?? btn.getAttribute('aria-label') ?? '')
    : (btn.dataset.labelExpand ?? btn.getAttribute('aria-label') ?? '')
  if (label) btn.setAttribute('aria-label', label)
}

function syncCollapsePreview(width: number): void {
  const sh = shell()
  if (!sh) return
  const opacity = Math.max(0, Math.min(1, width / COLLAPSE_FADE_START))
  sh.style.setProperty('--sidebar-content-opacity', opacity.toFixed(3))
  sh.toggleAttribute('data-will-collapse', width < COLLAPSE_THRESHOLD)
}

function clearCollapsePreview(): void {
  const sh = shell()
  if (!sh) return
  sh.style.removeProperty('--sidebar-content-opacity')
  sh.removeAttribute('data-will-collapse')
}

function setPanelWidth(width: number, { animate = true }: { animate?: boolean } = {}): void {
  const el = panel()
  const sh = shell()
  if (!el || !sh) return

  if (!animate) el.style.transition = 'none'
  else el.style.transition = ''

  el.style.width = `${width}px`
  sh.style.setProperty('--sidebar-width', `${width}px`)

  const collapsed = width === 0
  sh.toggleAttribute('data-collapsed', collapsed)
  el.setAttribute('aria-hidden', collapsed ? 'true' : 'false')
  if (collapsed) el.setAttribute('inert', '')
  else el.removeAttribute('inert')

  syncSidebarToggle(collapsed)

  const resize = $('[data-sidebar-resize]')
  if (resize) {
    resize.classList.toggle('hidden', collapsed)
    resize.setAttribute('tabindex', collapsed ? '-1' : '0')
  }

  if (!animate) {
    void el.offsetWidth
    el.style.transition = ''
  }
}

export function expandSidebar(): void {
  clearCollapsePreview()
  setPanelWidth(SIDEBAR_MAX)
}

export function collapseSidebar(): void {
  clearCollapsePreview()
  setPanelWidth(0)
}

export function openMobileSidebar(): void {
  document.documentElement.setAttribute('data-sidebar-mobile-open', '')
  document.body.style.overflow = 'hidden'
  const el = panel()
  if (el) {
    el.removeAttribute('inert')
    el.setAttribute('aria-hidden', 'false')
  }
}

export function closeMobileSidebar(): void {
  document.documentElement.removeAttribute('data-sidebar-mobile-open')
  document.body.style.overflow = ''
  const el = panel()
  if (el && isMobile()) {
    el.setAttribute('inert', '')
    el.setAttribute('aria-hidden', 'true')
  }
}

/**
 * Pick the right chrome for the current viewport:
 * - mobile: drawer closed, no expand icon
 * - compact desktop: sidebar collapsed + expand icon
 * - wide desktop: sidebar open
 */
function applyViewportLayout({ animate = true }: { animate?: boolean } = {}): void {
  clearCollapsePreview()
  if (isMobile()) {
    closeMobileSidebar()
    const el = panel()
    if (el) {
      // Drawer uses full width when open; keep content width ready
      el.style.width = `${SIDEBAR_MAX}px`
      el.setAttribute('inert', '')
      el.setAttribute('aria-hidden', 'true')
    }
    shell()?.removeAttribute('data-collapsed')
    syncSidebarToggle(false) // mobile: toggle always visible (opens drawer)
    const resize = $('[data-sidebar-resize]')
    if (resize) resize.classList.add('hidden')
    return
  }

  // Desktop (in-flow)
  if (isCompactDesktop()) {
    setPanelWidth(0, { animate })
  } else {
    setPanelWidth(SIDEBAR_MAX, { animate })
  }
}

function applySearchFilter(root: Element, query: string): void {
  const q = query.trim().toLowerCase()
  const clearBtn = $<HTMLButtonElement>('[data-sidebar-search-clear]', root)
  const kbd = $('[data-sidebar-search-kbd]', root)
  const input = $<HTMLInputElement>('[data-sidebar-search]', root)
  const focused = document.activeElement === input

  if (clearBtn) clearBtn.hidden = !q
  if (kbd) kbd.hidden = Boolean(q) || focused

  for (const category of $$<HTMLDetailsElement>('[data-sidebar-category]', root)) {
    let visibleCount = 0
    for (const link of $$<HTMLAnchorElement>('a[data-algo-id]', category)) {
      const name = link.dataset.algoName ?? ''
      const catName = link.dataset.categoryName ?? ''
      const match = !q || name.includes(q) || catName.includes(q)
      link.hidden = !match
      if (match) visibleCount++
    }
    category.hidden = visibleCount === 0
    if (q && visibleCount > 0) category.open = true
  }
}

/**
 * SPA selection highlight — only toggles aria-current; colors/dot via CSS.
 */
export function syncSidebarSelection(selectedId: string | null): void {
  for (const link of $$<HTMLAnchorElement>('[data-sidebar] a[data-algo-id]')) {
    if (selectedId != null && link.dataset.algoId === selectedId) {
      link.setAttribute('aria-current', 'page')
    } else {
      link.removeAttribute('aria-current')
    }
  }
}

function initResize(): void {
  const handle = $('[data-sidebar-resize]')
  const hit = $('[data-sidebar-resize-hit]')
  if (!handle) return

  let dragging = false
  let startX = 0
  let startWidth = SIDEBAR_MAX

  const onMove = (e: MouseEvent) => {
    if (!dragging) return
    const delta = e.clientX - startX
    const next = Math.max(0, Math.min(SIDEBAR_MAX, startWidth + delta))
    syncCollapsePreview(next)
    setPanelWidth(next, { animate: false })
  }

  const onUp = () => {
    if (!dragging) return
    dragging = false
    hit?.removeAttribute('data-dragging')
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    const el = panel()
    const width = el ? parseFloat(el.style.width) || 0 : 0
    if (width < COLLAPSE_THRESHOLD) {
      syncCollapsePreview(0)
      setPanelWidth(0)
    } else {
      clearCollapsePreview()
      expandSidebar()
    }
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  handle.addEventListener('mousedown', (e) => {
    if (isMobile()) return
    e.preventDefault()
    const el = panel()
    startX = e.clientX
    startWidth = el ? parseFloat(el.style.width) || SIDEBAR_MAX : SIDEBAR_MAX
    dragging = true
    syncCollapsePreview(startWidth)
    hit?.setAttribute('data-dragging', '')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  })

  handle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      collapseSidebar()
    }
  })
}

/** Register all sidebar interactions (call once from client.ts). */
export function initSidebar(): void {
  applyViewportLayout({ animate: false })
  initResize()

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (target.closest('[data-sidebar-toggle]')) {
      if (isMobile()) openMobileSidebar()
      else expandSidebar()
      return
    }
    if (target.closest('[data-sidebar-close]') || target.closest('[data-sidebar-backdrop]')) {
      closeMobileSidebar()
      return
    }

    const clearBtn = target.closest('[data-sidebar-search-clear]')
    if (clearBtn) {
      const root = clearBtn.closest('[data-sidebar]')
      const input = root ? $<HTMLInputElement>('[data-sidebar-search]', root) : null
      if (input && root) {
        input.value = ''
        applySearchFilter(root, '')
        input.focus()
      }
      return
    }

    const link = target.closest('[data-sidebar] a[data-algo-id]')
    if (!(link instanceof HTMLAnchorElement)) return
    if (event instanceof MouseEvent) {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (event.button !== 0) return
    }
    if (link.target === '_blank') return

    const id = link.dataset.algoId
    if (!id) return

    // Only hijack the click when a SPA host (algo-page) claims the event via
    // preventDefault(). On the home page nothing listens, so the link navigates.
    const selectEvent = new CustomEvent<SelectAlgorithmDetail>(SELECT_ALGORITHM_EVENT, {
      detail: { id },
      cancelable: true,
    })
    const handled = !window.dispatchEvent(selectEvent)
    if (!handled) return

    event.preventDefault()
    closeMobileSidebar()
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileSidebar()

    if (event.key === '/') {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }
      const input = $<HTMLInputElement>('[data-sidebar] [data-sidebar-search]')
      if (!input) return
      event.preventDefault()
      if (isMobile()) openMobileSidebar()
      else if (shell()?.hasAttribute('data-collapsed')) expandSidebar()
      input.focus()
    }
  })

  document.addEventListener('input', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return
    if (!target.matches('[data-sidebar-search]')) return
    const root = target.closest('[data-sidebar]')
    if (root) applySearchFilter(root, target.value)
  })

  document.addEventListener('focusin', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement) || !target.matches('[data-sidebar-search]')) return
    const root = target.closest('[data-sidebar]')
    const kbd = root ? $('[data-sidebar-search-kbd]', root) : null
    if (kbd && !target.value) kbd.hidden = true
  })

  document.addEventListener('focusout', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement) || !target.matches('[data-sidebar-search]')) return
    const root = target.closest('[data-sidebar]')
    const kbd = root ? $('[data-sidebar-search-kbd]', root) : null
    if (kbd && !target.value) kbd.hidden = false
  })

  // Re-apply when crossing mobile / compact / wide breakpoints
  const onViewportChange = () => applyViewportLayout({ animate: true })
  window.matchMedia(MOBILE_MQ).addEventListener('change', onViewportChange)
  window.matchMedia(COMPACT_MQ).addEventListener('change', onViewportChange)
}
