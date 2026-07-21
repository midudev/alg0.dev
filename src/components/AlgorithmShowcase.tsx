import { useState, useEffect, useRef, useCallback } from 'react'
import { loadAlgorithm } from '@lib/algorithms/loaders'
import type { Algorithm, AlgorithmSummary, Step } from '@lib/types'
import type { Locale } from '@i18n/translations'
import ArrayVisualizer from '@components/ArrayVisualizer'
import GraphVisualizer from '@components/GraphVisualizer'
import MatrixVisualizer from '@components/MatrixVisualizer'
import ConceptVisualizer from '@components/ConceptVisualizer'

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

interface AlgorithmShowcaseProps {
  locale?: Locale
  onSelectAlgorithm?: (algo: AlgorithmSummary) => void
}

export default function AlgorithmShowcase({
  locale = 'en',
  onSelectAlgorithm,
}: AlgorithmShowcaseProps) {
  const [items, setItems] = useState<ShowcaseItem[]>([])
  const [algoIdx, setAlgoIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const pausingRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Respect the user's reduced-motion preference: pause the auto-cycling demo
  // (WCAG 2.2.2 — give users control over moving / auto-updating content).
  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    setReducedMotion(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Load only the showcase algorithms (not the whole library)
  useEffect(() => {
    let cancelled = false
    Promise.all(SHOWCASE_IDS.map((id) => loadAlgorithm(id)))
      .then((algos) => {
        if (cancelled) return
        setItems(
          algos.map((algo) => ({
            algorithm: algo,
            steps: sampleSteps(algo.generateSteps(locale), MAX_STEPS),
          })),
        )
      })
      .catch((error) => {
        console.error('Failed to load showcase algorithms', error)
      })
    return () => {
      cancelled = true
    }
  }, [locale])

  const current = items[algoIdx]

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = setTimeout(fn, ms)
    timersRef.current.push(id)
    return id
  }, [])

  const advance = useCallback(() => {
    if (pausingRef.current || items.length === 0) return
    setStepIdx((prev) => {
      const item = items[algoIdx]
      if (!item) return prev
      if (prev < item.steps.length - 1) return prev + 1

      // End of algorithm — pause, fade, switch
      pausingRef.current = true
      schedule(() => {
        setFading(true)
        schedule(() => {
          setAlgoIdx((i) => (i + 1) % items.length)
          setStepIdx(0)
          setFading(false)
          pausingRef.current = false
        }, FADE_MS)
      }, END_PAUSE_MS)
      return prev
    })
  }, [algoIdx, items, schedule])

  useEffect(() => {
    if (reducedMotion || items.length === 0) return
    clearTimers()
    const id = setInterval(advance, STEP_MS)
    return () => {
      clearInterval(id)
      clearTimers()
    }
  }, [advance, clearTimers, reducedMotion, items.length])

  if (!current) {
    return (
      <div className="relative w-full max-w-2xl rounded-xl md:rounded-2xl border border-white/6 bg-white/2 h-[clamp(240px,45vw,360px)]" />
    )
  }

  const step = current.steps[stepIdx] ?? current.steps[0]
  const progress = current.steps.length > 1 ? stepIdx / (current.steps.length - 1) : 1

  const renderVisualizer = () => {
    switch (current.algorithm.visualization) {
      case 'array':
        return <ArrayVisualizer step={step} />
      case 'graph':
        return <GraphVisualizer step={step} locale={locale} />
      case 'matrix':
        return <MatrixVisualizer step={step} />
      case 'concept':
        return <ConceptVisualizer step={step} />
      default:
        return null
    }
  }

  return (
    <div
      className="relative w-full max-w-2xl rounded-xl md:rounded-2xl border border-white/6 bg-white/2 overflow-hidden group hover:border-white/12 hover:bg-white/4 transition-colors duration-300"
      style={{ height: 'clamp(240px, 45vw, 360px)' }}
    >
      <div
        className="absolute inset-0 flex flex-col p-3 md:p-6 transition-opacity ease-in-out"
        style={{
          opacity: fading ? 0 : 1,
          transitionDuration: `${FADE_MS}ms`,
        }}
      >
        <div className="text-center mb-2 shrink-0">
          <span className="text-[11px] font-medium text-neutral-500 uppercase tracking-wider">
            {current.algorithm.category}
          </span>
          <h3 className="text-sm font-semibold text-white font-heading mt-0.5">
            {current.algorithm.name}
          </h3>
        </div>
        <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
          {renderVisualizer()}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-14 z-20 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 pointer-events-none">
        <button
          type="button"
          onClick={() => onSelectAlgorithm?.(current.algorithm)}
          className="pointer-events-auto px-3 py-1.5 text-[11px] font-medium rounded-md bg-white text-black hover:bg-neutral-200 transition-colors"
        >
          Open
        </button>
      </div>

      <div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-white/6 rounded-full overflow-hidden transition-opacity ease-in-out"
        style={{ opacity: fading ? 0 : 1, transitionDuration: `${FADE_MS}ms` }}
      >
        <div
          className="h-full bg-white/20 rounded-full transition-all ease-linear"
          style={{
            width: `${progress * 100}%`,
            transitionDuration: `${STEP_MS}ms`,
          }}
        />
      </div>
    </div>
  )
}
