/**
 * Algorithm page runtime (plain JS — no React).
 * Mounted on `[data-algo-page]` via client bootstrap.
 */
import type { Locale } from '@i18n/translations'
import { translations, getCategoryName, defaultLocale, locales } from '@i18n/translations'
import { getCatalogEntry } from '@lib/algorithms/catalog'
import { $ } from '@lib/dom'
import { syncHeaderChrome } from '@lib/header-chrome'
import {
  SELECT_ALGORITHM_EVENT,
  closeMobileSidebar,
  openMobileSidebar,
  syncSidebarSelection,
  type SelectAlgorithmDetail,
} from '@lib/sidebar'
import { createPlayback, type PlaybackController } from '@lib/create-playback'
import {
  expandCodePanel,
  openMobileCodePanel,
  syncCodePanelForAlgorithm,
} from '@lib/code-panel-shell'
import { publishCodePanelState } from '@lib/code-panel-state'
import { bindStepVisualizer } from '@lib/visualizers/bind-step-viz'
import type { Algorithm, AlgorithmSummary, Step } from '@lib/types'

const MOBILE_MQ = '(max-width: 767px)'

interface AlgoBootstrap {
  locale: Locale
  algorithm: AlgorithmSummary
  steps: Step[]
}

interface AlgorithmPageContent {
  html: string
  pageTitle: string
  metaDescription: string
}

function hydrateAlgorithm(summary: AlgorithmSummary, steps: Step[]): Algorithm {
  return {
    ...summary,
    code: '',
    generateSteps: () => steps,
  }
}

function getAlgorithmUrl(locale: string, algoId: string): string {
  return locale === defaultLocale ? `/${algoId}` : `/${locale}/${algoId}`
}

function getAlgorithmIdFromPath(pathname: string): string | null {
  const cleaned = pathname.replace(/\/$/, '')
  if (cleaned === '') return null
  for (const locale of locales) {
    if (cleaned === `/${locale}`) return null
    if (cleaned.startsWith(`/${locale}/`)) return cleaned.slice(locale.length + 2)
  }
  return cleaned.slice(1)
}

async function loadAlgorithmPageContent(
  locale: Locale,
  algorithmId: string,
): Promise<AlgorithmPageContent | null> {
  // Static builds serve `.../id/index.html` — trailing slash is the reliable URL.
  const urls = [
    `/algorithm-content/${locale}/${algorithmId}/`,
    `/algorithm-content/${locale}/${algorithmId}`,
  ]

  let html: string | null = null
  let lastStatus = 0
  for (const url of urls) {
    const response = await fetch(url)
    lastStatus = response.status
    if (response.ok) {
      html = await response.text()
      break
    }
  }
  if (html == null) {
    throw new Error(`Description request failed with ${lastStatus}`)
  }

  const parsedDocument = new DOMParser().parseFromString(html, 'text/html')
  const content =
    $<HTMLElement>('[data-algorithm-description]', parsedDocument) ??
    $<HTMLElement>('article', parsedDocument.body)

  if (!content) {
    console.error('Algorithm description markup not found in', urls[0])
    return null
  }

  return {
    html: content.outerHTML,
    pageTitle: content.dataset.pageTitle ?? '',
    metaDescription: content.dataset.metaDescription ?? '',
  }
}

async function loadAlgorithmOnDemand(id: string): Promise<Algorithm> {
  const { loadAlgorithm } = await import('@lib/algorithms/loaders')
  return loadAlgorithm(id)
}

function updateMetaDescription(description: string): void {
  const meta = $<HTMLMetaElement>('meta[name="description"]')
  if (meta) meta.setAttribute('content', description)
}

function readBootstrap(root: HTMLElement): AlgoBootstrap | null {
  const el = $<HTMLScriptElement>('[data-algo-bootstrap]', root)
  if (!el?.textContent) return null
  try {
    return JSON.parse(el.textContent) as AlgoBootstrap
  } catch {
    console.error('Failed to parse algo bootstrap JSON')
    return null
  }
}

function syncStepDescription(
  root: HTMLElement,
  locale: Locale,
  currentStep: number,
  description: string | undefined,
): void {
  const t = translations[locale]
  const host = $('[data-step-description-host]', root)
  if (!host) return

  if (!description) {
    host.replaceChildren()
    return
  }

  let box = $('[data-step-description]', host)
  if (!box) {
    box = document.createElement('div')
    box.setAttribute('data-step-description', '')
    box.className =
      'text-xs md:text-sm text-neutral-300 bg-white/5 rounded-lg px-3 py-2 md:px-5 md:py-3 border border-white/12'
    const label = document.createElement('span')
    label.setAttribute('data-step-label', '')
    label.className = 'text-amber-300/90 font-medium mr-2'
    const text = document.createElement('span')
    text.setAttribute('data-step-text', '')
    box.append(label, text)
    host.append(box)
  }

  const label = $('[data-step-label]', box)
  const text = $('[data-step-text]', box)
  if (label) label.textContent = t.step.replace('{n}', String(currentStep + 1))
  if (text) text.textContent = description
}

function syncSrTitle(root: HTMLElement, locale: Locale, algorithm: AlgorithmSummary | null): void {
  const el = $('[data-algo-sr-title]', root)
  if (!el) return
  if (!algorithm) {
    el.textContent = ''
    return
  }
  el.textContent = `${algorithm.name} — ${getCategoryName(locale, algorithm.category)}`
}

function syncMobileTransport(
  root: HTMLElement,
  playback: PlaybackController,
  hasAlgorithm: boolean,
): void {
  const bar = $('[data-mobile-transport]', root)
  if (!bar) return

  const mobile = window.matchMedia(MOBILE_MQ).matches
  const show = mobile && hasAlgorithm
  bar.classList.toggle('hidden', !show)
  bar.classList.toggle('flex', show)

  if (!show) return

  const snap = playback.getSnapshot()
  const back = $<HTMLButtonElement>('[data-mobile-step-back]', bar)
  const forward = $<HTMLButtonElement>('[data-mobile-step-forward]', bar)
  const playIcon = $('[data-mobile-icon-play]', bar)
  const pauseIcon = $('[data-mobile-icon-pause]', bar)
  const stepLabel = $('[data-mobile-step-label]', bar)

  if (back) back.disabled = snap.currentStep <= 0
  if (forward) forward.disabled = snap.currentStep >= snap.steps.length - 1
  if (playIcon) playIcon.toggleAttribute('hidden', snap.isPlaying)
  if (pauseIcon) pauseIcon.toggleAttribute('hidden', !snap.isPlaying)
  if (stepLabel) {
    stepLabel.textContent =
      snap.steps.length > 0 ? `${snap.currentStep + 1}/${snap.steps.length}` : '—'
  }
}

export function initAlgoPage(root: HTMLElement): () => void {
  const bootstrap = readBootstrap(root)
  if (!bootstrap) {
    console.error('[algo-page] missing bootstrap JSON')
    return () => {}
  }

  const { locale, algorithm: initialSummary, steps: initialSteps } = bootstrap
  const t = translations[locale]
  const hydrated = hydrateAlgorithm(initialSummary, initialSteps)

  let headerAlgorithm: AlgorithmSummary | null = initialSummary
  let aboutHtml: string | null = null

  const playback = createPlayback({
    locale,
    initialAlgorithm: hydrated,
    initialSteps,
  })

  const stepHost = $<HTMLElement>('[data-step-viz]', root)
  const unbindViz = stepHost
    ? bindStepVisualizer(stepHost, playback.getSnapshot, playback.subscribe, locale)
    : () => {}

  const publishChrome = () => {
    const snap = playback.getSnapshot()
    syncHeaderChrome(locale, headerAlgorithm)
    syncSidebarSelection(headerAlgorithm?.id ?? null)
    syncCodePanelForAlgorithm(headerAlgorithm != null)
    syncSrTitle(root, locale, headerAlgorithm)
    syncStepDescription(root, locale, snap.currentStep, snap.currentStepData?.description)
    syncMobileTransport(root, playback, headerAlgorithm != null)
    publishCodePanelState({
      algorithm: snap.selectedAlgorithm,
      currentLine: snap.currentStepData?.codeLine,
      variables: snap.currentStepData?.variables,
      consoleOutput: snap.currentStepData?.consoleOutput,
      ...(aboutHtml !== null ? { aboutHtml } : {}),
    })
  }

  const unsubPlayback = playback.subscribe(publishChrome)
  // Initial sync (SSR description already painted; still need code panel + mobile)
  publishChrome()

  const activateAlgorithm = (
    algo: Algorithm,
    { pushUrl, pageContent }: { pushUrl: boolean; pageContent: AlgorithmPageContent | null },
  ) => {
    headerAlgorithm = algo
    playback.selectAlgorithm(algo)
    aboutHtml = pageContent?.html ?? ''
    closeMobileSidebar()
    expandCodePanel()
    if (pushUrl) {
      window.history.pushState({ algorithmId: algo.id }, '', getAlgorithmUrl(locale, algo.id))
    }
    document.title =
      pageContent?.pageTitle ||
      (locale === 'es'
        ? `${algo.name}: Visualizador | alg0.dev`
        : `${algo.name} Visualizer | alg0.dev`)
    updateMetaDescription(pageContent?.metaDescription || t.siteDescription)
    publishChrome()
  }

  const selectAlgorithmById = async (
    id: string,
    options: { pushUrl: boolean; summary?: AlgorithmSummary } = { pushUrl: true },
  ) => {
    if (options.summary) headerAlgorithm = options.summary
    // Keep previous about HTML until the new page content arrives (avoids empty Explanation tab).
    // Mark as "pending" only for code/title sync; aboutHtml is replaced in activateAlgorithm.
    publishChrome()
    try {
      const [algo, pageContent] = await Promise.all([
        loadAlgorithmOnDemand(id),
        loadAlgorithmPageContent(locale, id).catch((error) => {
          console.error(`Failed to load description for "${id}"`, error)
          return null
        }),
      ])
      activateAlgorithm(algo, { pushUrl: options.pushUrl, pageContent })
    } catch (error) {
      console.error(`Failed to load algorithm "${id}"`, error)
    }
  }

  const onSelect = (event: Event) => {
    const detail = (event as CustomEvent<SelectAlgorithmDetail>).detail
    if (!detail?.id) return
    // Claim SPA handling so sidebar cancels full navigation
    event.preventDefault()
    const summary = getCatalogEntry(detail.id)
    void selectAlgorithmById(detail.id, { pushUrl: true, summary })
  }
  window.addEventListener(SELECT_ALGORITHM_EVENT, onSelect)

  const onPopState = () => {
    const algoId = getAlgorithmIdFromPath(window.location.pathname)
    if (algoId) {
      void selectAlgorithmById(algoId, { pushUrl: false })
      return
    }
    // Navigated to home via history — full page usually; clear if still mounted
    playback.clearSelection()
    headerAlgorithm = null
    aboutHtml = null
    document.title = t.siteTitle
    updateMetaDescription(t.siteDescription)
    publishChrome()
  }
  window.addEventListener('popstate', onPopState)

  const onMobileClick = (event: Event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    if (!root.contains(target)) return

    if (target.closest('[data-mobile-sidebar-open]')) {
      openMobileSidebar()
      return
    }
    if (target.closest('[data-mobile-code-open]')) {
      openMobileCodePanel()
      return
    }
    if (target.closest('[data-mobile-step-back]')) {
      playback.stepBackward()
      return
    }
    if (target.closest('[data-mobile-step-forward]')) {
      playback.stepForward()
      return
    }
    if (target.closest('[data-mobile-play]')) {
      playback.togglePlay()
    }
  }
  document.addEventListener('click', onMobileClick)

  const onMq = () => syncMobileTransport(root, playback, headerAlgorithm != null)
  const mq = window.matchMedia(MOBILE_MQ)
  mq.addEventListener('change', onMq)

  return () => {
    unsubPlayback()
    unbindViz()
    playback.dispose()
    window.removeEventListener(SELECT_ALGORITHM_EVENT, onSelect)
    window.removeEventListener('popstate', onPopState)
    document.removeEventListener('click', onMobileClick)
    mq.removeEventListener('change', onMq)
  }
}

/** Auto-init every `[data-algo-page]` on the document. */
export function initAllAlgoPages(): void {
  for (const root of document.querySelectorAll<HTMLElement>('[data-algo-page]')) {
    initAlgoPage(root)
  }
}
