/**
 * Plain-JS shell for the code panel (desktop resize + mobile drawer).
 * Mirrors sidebar.ts. Content (Monaco / CodePanel) is portaled by AlgoViz into
 * `[data-code-panel-mount]`.
 */
import { $ } from '@lib/dom'

const CODEPANEL_MAX = 420
const COLLAPSE_THRESHOLD = 100
const MOBILE_MQ = '(max-width: 767px)'

function shell(): HTMLElement | null {
  return $('[data-code-panel-shell]')
}

function panel(): HTMLElement | null {
  return $('[data-code-panel-panel]')
}

function isMobile(): boolean {
  return window.matchMedia(MOBILE_MQ).matches
}

function syncExpandButton(collapsed: boolean): void {
  const expandBtn = $<HTMLElement>('[data-code-panel-expand]')
  if (!expandBtn) return
  const hasAlgo = document.documentElement.hasAttribute('data-has-algorithm')
  // Desktop only, when collapsed and an algorithm is selected
  expandBtn.hidden = isMobile() || !collapsed || !hasAlgo
}

function setPanelWidth(width: number, { animate = true }: { animate?: boolean } = {}): void {
  const el = panel()
  const sh = shell()
  if (!el || !sh) return

  if (!animate) el.style.transition = 'none'
  else el.style.transition = ''

  el.style.width = `${width}px`
  sh.style.setProperty('--code-panel-width', `${width}px`)

  const collapsed = width === 0
  sh.toggleAttribute('data-collapsed', collapsed)
  el.setAttribute('aria-hidden', collapsed ? 'true' : 'false')
  if (collapsed) el.setAttribute('inert', '')
  else el.removeAttribute('inert')

  syncExpandButton(collapsed)

  const resize = $('[data-code-panel-resize]')
  if (resize) {
    resize.classList.toggle('hidden', collapsed)
    resize.setAttribute('tabindex', collapsed ? '-1' : '0')
  }

  if (!animate) {
    void el.offsetWidth
    el.style.transition = ''
  }
}

export function expandCodePanel(): void {
  if (isMobile()) {
    openMobileCodePanel()
    return
  }
  setPanelWidth(CODEPANEL_MAX)
}

export function collapseCodePanel(): void {
  if (isMobile()) {
    closeMobileCodePanel()
    return
  }
  setPanelWidth(0)
}

export function openMobileCodePanel(): void {
  document.documentElement.setAttribute('data-code-panel-mobile-open', '')
  document.body.style.overflow = 'hidden'
  const el = panel()
  if (el) {
    el.removeAttribute('inert')
    el.setAttribute('aria-hidden', 'false')
  }
}

export function closeMobileCodePanel(): void {
  document.documentElement.removeAttribute('data-code-panel-mobile-open')
  if (!document.documentElement.hasAttribute('data-sidebar-mobile-open')) {
    document.body.style.overflow = ''
  }
  const el = panel()
  if (el && isMobile()) {
    el.setAttribute('inert', '')
    el.setAttribute('aria-hidden', 'true')
  }
}

/** Called when algorithm selection changes (show/hide expand affordances). */
export function syncCodePanelForAlgorithm(hasAlgorithm: boolean): void {
  document.documentElement.toggleAttribute('data-has-algorithm', hasAlgorithm)
  if (!hasAlgorithm) {
    closeMobileCodePanel()
    if (!isMobile()) setPanelWidth(0, { animate: true })
    syncExpandButton(true)
    return
  }
  // Selecting an algorithm expands the code panel (desktop)
  if (!isMobile()) expandCodePanel()
  else syncExpandButton(false)
}

function initResize(): void {
  const handle = $('[data-code-panel-resize]')
  const hit = $('[data-code-panel-resize-hit]')
  if (!handle) return

  let dragging = false
  let startX = 0
  let startWidth = CODEPANEL_MAX

  const onMove = (e: MouseEvent) => {
    if (!dragging) return
    // Right panel: drag left to expand
    const delta = startX - e.clientX
    const next = Math.max(0, Math.min(CODEPANEL_MAX, startWidth + delta))
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
    if (width < COLLAPSE_THRESHOLD) collapseCodePanel()
    else expandCodePanel()
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  handle.addEventListener('mousedown', (e) => {
    if (isMobile()) return
    e.preventDefault()
    const el = panel()
    startX = e.clientX
    startWidth = el ? parseFloat(el.style.width) || CODEPANEL_MAX : CODEPANEL_MAX
    dragging = true
    hit?.setAttribute('data-dragging', '')
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  })

  handle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      collapseCodePanel()
    }
  })
}

export function initCodePanelShell(): void {
  const sh = shell()
  const initialCollapsed = sh?.hasAttribute('data-initial-collapsed') ?? true

  // Algorithm routes SSR with panel open — mark algorithm present before React hydrates
  if (!initialCollapsed) {
    document.documentElement.setAttribute('data-has-algorithm', '')
  }

  if (isMobile()) {
    const el = panel()
    if (el) {
      el.style.width = `${CODEPANEL_MAX}px`
      el.setAttribute('inert', '')
      el.setAttribute('aria-hidden', 'true')
    }
    syncExpandButton(false)
  } else if (initialCollapsed) {
    setPanelWidth(0, { animate: false })
  } else {
    setPanelWidth(CODEPANEL_MAX, { animate: false })
  }

  initResize()

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (target.closest('[data-code-panel-expand]')) {
      expandCodePanel()
      return
    }
    if (target.closest('[data-code-panel-open]')) {
      openMobileCodePanel()
      return
    }
    if (target.closest('[data-code-panel-close]') || target.closest('[data-code-panel-backdrop]')) {
      closeMobileCodePanel()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileCodePanel()
  })

  window.matchMedia(MOBILE_MQ).addEventListener('change', (e) => {
    closeMobileCodePanel()
    if (e.matches) {
      const el = panel()
      if (el) {
        el.style.width = `${CODEPANEL_MAX}px`
        el.setAttribute('inert', '')
        el.setAttribute('aria-hidden', 'true')
      }
      syncExpandButton(false)
    } else {
      const hasAlgo = document.documentElement.hasAttribute('data-has-algorithm')
      if (hasAlgo) expandCodePanel()
      else setPanelWidth(0, { animate: false })
    }
  })
}
