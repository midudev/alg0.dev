/**
 * Thin React host for plain-DOM step visualizers.
 * The renderers themselves live in `src/lib/visualizers/*` (no React).
 */
import { useLayoutEffect, useRef } from 'react'
import type { Step } from '@lib/types'

export type StepDomRenderer = (root: HTMLElement, step: Step) => void

interface DomStepVizProps {
  step: Step
  render: StepDomRenderer
  className?: string
}

export default function DomStepViz({
  step,
  render,
  className = 'flex-1 flex min-h-0 w-full',
}: DomStepVizProps) {
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    render(el, step)
  }, [step, render])

  return <div ref={ref} className={className} />
}
