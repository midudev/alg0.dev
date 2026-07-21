/**
 * Home algorithm showcase — plain JS (no React).
 * Markup shell: WelcomeScreen structure from Astro; this drives the cycling demo.
 */
import { $ } from '@lib/dom'
import { loadAlgorithm } from '@lib/algorithms/loaders'
import { getLocaleUrl } from '@lib/locale-url'
import type { Algorithm, Step } from '@lib/types'
import type { Locale } from '@i18n/translations'
import { renderStepVisualizer, type VisualizationKind } from '@lib/visualizers/render-step'

const SHOWCASE_IDS = [
  'bubble-sort',
  'dijkstra',
  'n-queens',
  'binary-search-tree',
  'linked-list',
  'sliding-window',
]

const MAX_STEPS = 14
const STEP_MS = 600
const END_PAUSE_MS = 1200
const FADE_MS = 400

interface ShowcaseItem {
  algorithm: Algorithm
  steps: Step[]
}

function sampleSteps(allSteps: Step[], max: number): Step[] {
  if (allSteps.length <= max) return allSteps
  const result: Step[] = []
  for (let i = 0; i < max; i++) {
    result.push(allSteps[Math.round((i / (max - 1)) * (allSteps.length - 1))])
  }
  return result
}

export function initShowcase(root: HTMLElement, locale: Locale): void {
  const stage = $('[data-showcase-stage]', root)
  const categoryEl = $('[data-showcase-category]', root)
  const nameEl = $('[data-showcase-name]', root)
  const vizHost = $('[data-showcase-viz]', root)
  const openBtn = $<HTMLAnchorElement>('[data-showcase-open]', root)
  const progressFill = $<HTMLElement>('[data-showcase-progress]', root)
  const fadeLayer = $('[data-showcase-fade]', root)

  if (!stage || !vizHost) return

  let items: ShowcaseItem[] = []
  let algoIdx = 0
  let stepIdx = 0
  let pausing = false
  let intervalId: ReturnType<typeof setInterval> | null = null
  const timers: ReturnType<typeof setTimeout>[] = []

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const schedule = (fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timers.push(id)
    return id
  }

  const clearTimers = () => {
    for (const id of timers) clearTimeout(id)
    timers.length = 0
  }

  const paint = () => {
    const item = items[algoIdx]
    if (!item) return
    const step = item.steps[stepIdx] ?? item.steps[0]
    const kind = item.algorithm.visualization as VisualizationKind

    if (categoryEl) categoryEl.textContent = item.algorithm.category
    if (nameEl) nameEl.textContent = item.algorithm.name
    if (openBtn) openBtn.href = getLocaleUrl(locale, item.algorithm.id)

    void renderStepVisualizer(vizHost, step, kind, locale)

    const progress = item.steps.length > 1 ? stepIdx / (item.steps.length - 1) : 1
    if (progressFill) {
      progressFill.style.width = `${progress * 100}%`
      progressFill.style.transitionDuration = `${STEP_MS}ms`
    }
  }

  const setFading = (fading: boolean) => {
    if (!fadeLayer) return
    fadeLayer.style.opacity = fading ? '0' : '1'
    fadeLayer.style.transitionDuration = `${FADE_MS}ms`
    if (progressFill?.parentElement) {
      progressFill.parentElement.style.opacity = fading ? '0' : '1'
      progressFill.parentElement.style.transitionDuration = `${FADE_MS}ms`
    }
  }

  const advance = () => {
    if (pausing || items.length === 0) return
    const item = items[algoIdx]
    if (!item) return

    if (stepIdx < item.steps.length - 1) {
      stepIdx += 1
      paint()
      return
    }

    pausing = true
    schedule(() => {
      setFading(true)
      schedule(() => {
        algoIdx = (algoIdx + 1) % items.length
        stepIdx = 0
        paint()
        setFading(false)
        pausing = false
      }, FADE_MS)
    }, END_PAUSE_MS)
  }

  void Promise.all(SHOWCASE_IDS.map((id) => loadAlgorithm(id)))
    .then((algos) => {
      items = algos.map((algo) => ({
        algorithm: algo,
        steps: sampleSteps(algo.generateSteps(locale), MAX_STEPS),
      }))
      stage.classList.remove('is-loading')
      paint()
      if (!reducedMotion && items.length > 0) {
        intervalId = setInterval(advance, STEP_MS)
      }
    })
    .catch((error) => {
      console.error('Failed to load showcase algorithms', error)
    })

  // Cleanup if root is removed (navigating away)
  const observer = new MutationObserver(() => {
    if (!document.contains(root)) {
      if (intervalId) clearInterval(intervalId)
      clearTimers()
      observer.disconnect()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
