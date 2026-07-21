/**
 * Plain-JS code panel (syntax viewer, languages, resize + mobile drawer).
 */
import { $, $$ } from '@lib/dom'
import { CODE_LANGUAGE_STORAGE_KEY, defaultCodeLanguage, isCodeLanguage } from '@lib/code-languages'
import { CODE_PANEL_STATE_EVENT, type CodePanelState } from '@lib/code-panel-state'
import type { CodeLanguage } from '@lib/types'

const CODE_PANEL_DEFAULT_WIDTH = 420
const CODE_PANEL_MAX_WIDTH = 760
const MAIN_CONTENT_MIN_WIDTH = 360
const COLLAPSE_THRESHOLD = 100
const COLLAPSE_FADE_START = 240
const MOBILE_MQ = '(max-width: 767px)'

let codePanelState: CodePanelState = { algorithm: null }
/** Resolved on init from localStorage; JS is only the fallback when unset. */
let activeLanguage: CodeLanguage = defaultCodeLanguage
let codeContentVersion = 0
let expandedWidth = CODE_PANEL_DEFAULT_WIDTH

function resolvePreferredLanguage(): CodeLanguage {
  try {
    const stored = localStorage.getItem(CODE_LANGUAGE_STORAGE_KEY)
    if (isCodeLanguage(stored)) return stored
  } catch {
    // Private mode / blocked storage — fall through to default.
  }
  return defaultCodeLanguage
}

function shell(): HTMLElement | null {
  return $('[data-code-panel-shell]')
}

function panel(): HTMLElement | null {
  return $('[data-code-panel-panel]')
}

function contentRoot(): HTMLElement | null {
  return $('[data-code-panel-content]')
}

function setLoading(loading: boolean): void {
  const loadingEl = $('[data-code-loading]')
  loadingEl?.classList.toggle('hidden', !loading)
  loadingEl?.classList.toggle('flex', loading)
  for (const viewer of $$<HTMLElement>('[data-code-viewer]')) {
    viewer.classList.toggle('is-loading', loading)
  }
}

function variableColor(value: unknown): string {
  if (typeof value === 'number') return 'text-amber-300/90'
  if (typeof value === 'boolean') return value ? 'text-emerald-400/90' : 'text-red-400/90'
  if (value === null) return 'text-neutral-600'
  return 'text-sky-300/90'
}

function renderVariables(variables: CodePanelState['variables']): void {
  const region = $('[data-code-variables]')
  const list = $('[data-code-variable-list]')
  if (!region || !list) return

  const entries = Object.entries(variables ?? {})
  region.classList.toggle('hidden', entries.length === 0)
  const fragment = document.createDocumentFragment()

  for (const [name, value] of entries) {
    const item = document.createElement('div')
    item.className = 'inline-flex items-center gap-1.5 text-[12px] font-mono'

    const key = document.createElement('span')
    key.className = 'text-neutral-300'
    key.textContent = name

    const equals = document.createElement('span')
    equals.className = 'text-neutral-600'
    equals.textContent = '='
    equals.setAttribute('aria-hidden', 'true')

    const valueEl = document.createElement('span')
    valueEl.className = `font-medium ${variableColor(value)}`
    valueEl.textContent = String(value)

    item.append(key, equals, valueEl)
    fragment.append(item)
  }

  list.replaceChildren(fragment)
}

function renderConsole(output: string[] | undefined): void {
  const region = $('[data-code-console]')
  const count = $('[data-code-console-count]')
  const lines = $('[data-code-console-lines]')
  if (!region || !count || !lines) return

  const values = output ?? []
  region.classList.toggle('hidden', values.length === 0)
  region.classList.toggle('flex', values.length > 0)
  count.textContent = `(${values.length})`

  const fragment = document.createDocumentFragment()
  values.forEach((value, index) => {
    const row = document.createElement('div')
    row.className = `flex gap-2 text-[11px] font-mono leading-[18px] ${
      index === values.length - 1 ? 'text-emerald-300/90' : 'text-neutral-500'
    }`

    const prompt = document.createElement('span')
    prompt.className = 'text-neutral-600 select-none shrink-0'
    prompt.setAttribute('aria-hidden', 'true')
    prompt.textContent = '›'

    const text = document.createElement('span')
    text.className = 'break-all'
    text.textContent = value
    row.append(prompt, text)
    fragment.append(row)
  })

  lines.replaceChildren(fragment)
}

function inlineAnnotation(variables: CodePanelState['variables']): string {
  const entries = Object.entries(variables ?? {})
  if (entries.length === 0) return ''
  return `  // ${entries
    .map(
      ([name, value]) => `${name} = ${typeof value === 'string' ? value : JSON.stringify(value)}`,
    )
    .join(', ')}`
}

function syncActiveLine({ scroll = true }: { scroll?: boolean } = {}): void {
  const root = contentRoot()
  if (!root) return

  for (const line of $$<HTMLElement>('[data-code-line]', root)) {
    line.classList.remove('is-active')
    $('.code-viewer__annotation', line)?.remove()
  }

  const jsLine = codePanelState.currentLine
  if (jsLine == null) return
  const viewer = $<HTMLElement>(`[data-code-language-block="${activeLanguage}"]`, root)
  if (!viewer) return
  const line = $<HTMLElement>(`[data-js-lines~="${jsLine}"]`, viewer)
  if (!line) return
  line.classList.add('is-active')

  const annotation = inlineAnnotation(codePanelState.variables)
  const source = $('.code-viewer__source', line)
  if (annotation && source) {
    const annotationEl = document.createElement('span')
    annotationEl.className = 'code-viewer__annotation'
    annotationEl.textContent = annotation
    source.append(annotationEl)
  }

  if (!scroll) return
  const lineTop = line.offsetTop
  const lineBottom = lineTop + line.offsetHeight
  if (lineTop < viewer.scrollTop || lineBottom > viewer.scrollTop + viewer.clientHeight) {
    viewer.scrollTo({ top: Math.max(0, lineTop - viewer.clientHeight / 2), behavior: 'auto' })
  }
}

function syncLanguageButtons(): void {
  const root = contentRoot()
  if (!root) return
  for (const button of $$<HTMLButtonElement>('[data-code-language]', root)) {
    const selected = button.dataset.codeLanguage === activeLanguage
    button.classList.toggle('is-active', selected)
    button.setAttribute('aria-pressed', selected ? 'true' : 'false')
  }
}

function applyLanguageVisibility(language: CodeLanguage): void {
  const root = contentRoot()
  if (!root) return
  for (const viewer of $$<HTMLElement>('[data-code-language-block]', root)) {
    viewer.hidden = viewer.dataset.codeLanguageBlock !== language
  }
  syncActiveLine({ scroll: false })
}

function selectLanguage(language: CodeLanguage): void {
  activeLanguage = language
  localStorage.setItem(CODE_LANGUAGE_STORAGE_KEY, language)
  syncLanguageButtons()
  const root = contentRoot()
  if (!root) return

  const hasBlock = Boolean($<HTMLElement>(`[data-code-language-block="${language}"]`, root))
  const algorithmId = root.dataset.initialAlgorithmId || codePanelState.algorithm?.id
  if (!hasBlock && algorithmId) {
    // Language pack not in DOM yet (SSR only includes JS) — load full set.
    void loadAlgorithmCode(algorithmId)
    return
  }

  applyLanguageVisibility(language)
}

async function loadAlgorithmCode(algorithmId: string): Promise<void> {
  const version = ++codeContentVersion
  const variants = $('[data-code-variants]')
  if (!variants) return
  setLoading(true)

  try {
    const response = await fetch(`/algorithm-code/${algorithmId}`)
    if (!response.ok) throw new Error(`Code request failed with ${response.status}`)

    const parsedDocument = new DOMParser().parseFromString(await response.text(), 'text/html')
    const content = $<HTMLElement>('[data-algorithm-code]', parsedDocument)
    if (!content) throw new Error('Code response did not include an algorithm code fragment')
    if (version !== codeContentVersion) return

    variants.innerHTML = content.outerHTML
    // Reveal preferred language without re-entering the fetch path.
    syncLanguageButtons()
    applyLanguageVisibility(activeLanguage)
  } catch (error) {
    console.error(`Failed to load highlighted code for "${algorithmId}"`, error)
  } finally {
    if (version === codeContentVersion) setLoading(false)
  }
}

function applyCodePanelState(nextState: CodePanelState): void {
  const previousId = codePanelState.algorithm?.id
  const root = contentRoot()
  const initialId = root?.dataset.initialAlgorithmId
  const nextAlgorithm = nextState.algorithm
  const isHydratingInitial = previousId == null && nextAlgorithm?.id === initialId

  codePanelState = nextState
  renderVariables(nextState.variables)
  renderConsole(nextState.consoleOutput)

  const nextId = nextState.algorithm?.id
  if (!nextState.algorithm) return

  if (nextId !== previousId) {
    if (isHydratingInitial) {
      const rootEl = contentRoot()
      const hasPreferred = Boolean(
        rootEl && $<HTMLElement>(`[data-code-language-block="${activeLanguage}"]`, rootEl),
      )
      if (hasPreferred) {
        selectLanguage(activeLanguage)
        syncActiveLine({ scroll: false })
      } else {
        void loadAlgorithmCode(nextId)
      }
    } else {
      void loadAlgorithmCode(nextId)
    }
  } else {
    syncActiveLine()
  }
}

function isMobile(): boolean {
  return window.matchMedia(MOBILE_MQ).matches
}

function syncCodePanelToggle(collapsed: boolean): void {
  const btn = $<HTMLButtonElement>('[data-code-panel-toggle]')
  if (!btn) return
  const hasAlgo = document.documentElement.hasAttribute('data-has-algorithm')
  const mobile = isMobile()
  // No algorithm → hide. Mobile: show when has algo. Desktop: show when collapsed + has algo.
  btn.hidden = !hasAlgo || (!mobile && !collapsed)
  const label = mobile
    ? (btn.dataset.labelOpen ?? btn.getAttribute('aria-label') ?? '')
    : (btn.dataset.labelExpand ?? btn.getAttribute('aria-label') ?? '')
  if (label) btn.setAttribute('aria-label', label)
}

function maxPanelWidth(): number {
  return Math.max(
    CODE_PANEL_DEFAULT_WIDTH,
    Math.min(CODE_PANEL_MAX_WIDTH, window.innerWidth - MAIN_CONTENT_MIN_WIDTH),
  )
}

function syncCollapsePreview(width: number): void {
  const sh = shell()
  if (!sh) return
  const opacity = Math.max(0, Math.min(1, width / COLLAPSE_FADE_START))
  sh.style.setProperty('--code-panel-content-opacity', opacity.toFixed(3))
  sh.toggleAttribute('data-will-collapse', width < COLLAPSE_THRESHOLD)
}

function clearCollapsePreview(): void {
  const sh = shell()
  if (!sh) return
  sh.style.removeProperty('--code-panel-content-opacity')
  sh.removeAttribute('data-will-collapse')
}

function setPanelWidth(
  width: number,
  { animate = true, remember = true }: { animate?: boolean; remember?: boolean } = {},
): void {
  const el = panel()
  const sh = shell()
  if (!el || !sh) return

  const nextWidth = isMobile()
    ? CODE_PANEL_DEFAULT_WIDTH
    : Math.max(0, Math.min(width, maxPanelWidth()))

  if (!animate) el.style.transition = 'none'
  else el.style.transition = ''

  el.style.width = `${nextWidth}px`
  sh.style.setProperty('--code-panel-width', `${nextWidth}px`)

  const collapsed = nextWidth === 0
  if (remember && nextWidth >= COLLAPSE_THRESHOLD) expandedWidth = nextWidth
  sh.toggleAttribute('data-collapsed', collapsed)
  el.setAttribute('aria-hidden', collapsed ? 'true' : 'false')
  if (collapsed) el.setAttribute('inert', '')
  else el.removeAttribute('inert')

  syncCodePanelToggle(collapsed)

  const resize = $('[data-code-panel-resize]')
  if (resize) {
    resize.classList.toggle('hidden', collapsed)
    resize.setAttribute('tabindex', collapsed ? '-1' : '0')
    resize.setAttribute('aria-valuemin', '0')
    resize.setAttribute('aria-valuemax', String(maxPanelWidth()))
    resize.setAttribute('aria-valuenow', String(Math.round(nextWidth)))
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
  clearCollapsePreview()
  setPanelWidth(expandedWidth)
}

export function collapseCodePanel(): void {
  if (isMobile()) {
    closeMobileCodePanel()
    return
  }
  clearCollapsePreview()
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
    if (!isMobile()) {
      clearCollapsePreview()
      setPanelWidth(0, { animate: true })
    }
    syncCodePanelToggle(true)
    return
  }
  // Selecting an algorithm expands the code panel (desktop)
  if (!isMobile()) expandCodePanel()
  else syncCodePanelToggle(false)
}

function initResize(): void {
  const handle = $('[data-code-panel-resize]')
  const hit = $('[data-code-panel-resize-hit]')
  if (!handle) return

  let dragging = false
  let startX = 0
  let startWidth = CODE_PANEL_DEFAULT_WIDTH

  const onMove = (e: MouseEvent) => {
    if (!dragging) return
    // Right panel: drag left to expand
    const delta = startX - e.clientX
    const next = Math.max(0, Math.min(maxPanelWidth(), startWidth + delta))
    syncCollapsePreview(next)
    setPanelWidth(next, { animate: false, remember: false })
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
      setPanelWidth(width, { animate: false })
    }
    window.removeEventListener('mousemove', onMove)
    window.removeEventListener('mouseup', onUp)
  }

  handle.addEventListener('mousedown', (e) => {
    if (isMobile()) return
    e.preventDefault()
    const el = panel()
    startX = e.clientX
    startWidth = el
      ? parseFloat(el.style.width) || CODE_PANEL_DEFAULT_WIDTH
      : CODE_PANEL_DEFAULT_WIDTH
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
      collapseCodePanel()
      return
    }

    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    const width = parseFloat(panel()?.style.width ?? '') || expandedWidth
    const nextWidth = width + (e.key === 'ArrowLeft' ? 32 : -32)
    if (nextWidth < COLLAPSE_THRESHOLD) collapseCodePanel()
    else setPanelWidth(nextWidth, { animate: false })
  })
}

export function initCodePanelShell(): void {
  const sh = shell()
  const initialCollapsed = sh?.hasAttribute('data-initial-collapsed') ?? true
  const root = contentRoot()

  if (root) {
    // Prefer stored language; only fall back to JavaScript when nothing is saved.
    // SSR leaves no language selected and typically only ships JS HTML (light SSR).
    activeLanguage = resolvePreferredLanguage()
    const hasPreferredBlock = Boolean(
      $<HTMLElement>(`[data-code-language-block="${activeLanguage}"]`, root),
    )
    const initialId = root.dataset.initialAlgorithmId
    if (hasPreferredBlock) {
      selectLanguage(activeLanguage)
      if ($('[data-code-language-block]', root)) setLoading(false)
    } else if (initialId) {
      // Preferred language not in SSR HTML — fetch full multi-language pack.
      void loadAlgorithmCode(initialId)
    } else {
      selectLanguage(activeLanguage)
    }

    root.addEventListener('click', (event) => {
      const target = event.target
      if (!(target instanceof Element)) return

      const language = target.closest<HTMLElement>('[data-code-language]')?.dataset.codeLanguage
      if (isCodeLanguage(language)) selectLanguage(language)
    })
  }

  window.addEventListener(CODE_PANEL_STATE_EVENT, (event) => {
    applyCodePanelState((event as CustomEvent<CodePanelState>).detail)
  })
  // Algorithm routes SSR with panel open — mark algorithm present on first paint
  if (!initialCollapsed) {
    document.documentElement.setAttribute('data-has-algorithm', '')
  }

  if (isMobile()) {
    const el = panel()
    if (el) {
      el.style.width = `${CODE_PANEL_DEFAULT_WIDTH}px`
      el.setAttribute('inert', '')
      el.setAttribute('aria-hidden', 'true')
    }
    syncCodePanelToggle(false)
  } else if (initialCollapsed) {
    setPanelWidth(0, { animate: false })
  } else {
    setPanelWidth(expandedWidth, { animate: false })
  }

  initResize()

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (target.closest('[data-code-panel-toggle]')) {
      if (isMobile()) openMobileCodePanel()
      else expandCodePanel()
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
        el.style.width = `${CODE_PANEL_DEFAULT_WIDTH}px`
        el.setAttribute('inert', '')
        el.setAttribute('aria-hidden', 'true')
      }
      syncCodePanelToggle(false)
    } else {
      const hasAlgo = document.documentElement.hasAttribute('data-has-algorithm')
      if (hasAlgo) expandCodePanel()
      else setPanelWidth(0, { animate: false })
    }
  })

  window.addEventListener('resize', () => {
    if (isMobile()) return
    const el = panel()
    const width = parseFloat(el?.style.width ?? '') || 0
    if (width > maxPanelWidth()) setPanelWidth(maxPanelWidth(), { animate: false })
  })
}
