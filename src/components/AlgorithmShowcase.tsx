import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { algorithms } from '@lib/algorithms'
import type { Algorithm, Step } from '@lib/types'
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
  onSelectAlgorithm?: (algo: Algorithm) => void
}

export default function AlgorithmShowcase({
  locale = 'en',
  onSelectAlgorithm,
}: AlgorithmShowcaseProps) {
  const items = useMemo<ShowcaseItem[]>(
    () =>
      SHOWCASE_IDS.map((id) => algorithms.find((a) => a.id === id))
        .filter((a): a is Algorithm => a != null)
        .map((algo) => ({
          algorithm: algo,
          steps: sampleSteps(algo.generateSteps(locale), MAX_STEPS),
        })),
    [locale],
  )

  const [algoIdx, setAlgoIdx] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const pausingRef = useRef(false)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const current = items[algoIdx]

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
  }, [])

  useEffect(() => {
    pausingRef.current = false

    const interval = setInterval(() => {
      if (pausingRef.current) return

      setStepIdx((prev) => {
        if (prev + 1 >= current.steps.length) {
          pausingRef.current = true
          const t1 = setTimeout(() => {
            setFading(true)
            const t2 = setTimeout(() => {
              setAlgoIdx((i) => (i + 1) % items.length)
              setStepIdx(0)
              setFading(false)
            }, FADE_MS)
            timersRef.current.push(t2)
          }, END_PAUSE_MS)
          timersRef.current.push(t1)
          return prev
        }
        return prev + 1
      })
    }, STEP_MS)

    return () => {
      clearInterval(interval)
      clearTimers()
    }
  }, [algoIdx, current.steps.length, items.length, clearTimers])

  const goToAlgo = useCallback(
    (idx: number) => {
      if (idx === algoIdx || fading) return
      clearTimers()
      pausingRef.current = true
      setFading(true)
      const t = setTimeout(() => {
        setAlgoIdx(idx)
        setStepIdx(0)
        setFading(false)
      }, FADE_MS)
      timersRef.current.push(t)
    },
    [algoIdx, fading, clearTimers],
  )

  const step = current?.steps[stepIdx]
  if (!step || !current) return null

  const progress = current.steps.length > 1 ? stepIdx / (current.steps.length - 1) : 0

  const renderVisualization = () => {
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
    <div className="flex flex-col items-center gap-3 md:gap-4 w-full px-4 md:px-0">
      {/* Visualization card */}
      <div
        className="relative w-full max-w-2xl rounded-xl md:rounded-2xl border border-white/6 bg-white/2 overflow-hidden group hover:border-white/12 hover:bg-white/4 transition-colors duration-300"
        style={{ height: 'clamp(240px, 45vw, 360px)' }}
      >
        {/* Visualization content */}
        <div
          className="absolute inset-0 flex flex-col p-3 md:p-6 transition-opacity ease-in-out"
          style={{
            opacity: fading ? 0 : 1,
            transitionDuration: `${FADE_MS}ms`,
          }}
        >
          {renderVisualization()}
        </div>

        {/* Click target overlay */}
        <div
          onClick={() => onSelectAlgorithm?.(current.algorithm)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onSelectAlgorithm?.(current.algorithm)
            }
          }}
          role="button"
          tabIndex={0}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:ring-inset"
          aria-label={`${current.algorithm.name} — click to explore`}
        />

        {/* Hover CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 h-14 z-20 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3 pointer-events-none">
          <span className="text-[11px] text-white/50 font-mono tracking-wide">
            {locale === 'es' ? 'Click para explorar →' : 'Click to explore →'}
          </span>
        </div>
      </div>

      {/* Algorithm info + indicators */}
      <div className="flex flex-col items-center gap-3">
        {/* Progress bar — fades too */}
        <div
          className="w-32 h-0.5 bg-white/6 rounded-full overflow-hidden transition-opacity ease-in-out"
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
    </div>
  )
}
