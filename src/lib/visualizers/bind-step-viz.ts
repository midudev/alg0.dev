/**
 * Subscribe a DOM host to a playback snapshot stream and paint each step.
 */
import type { Locale } from '@i18n/translations'
import type { Algorithm, Step } from '@lib/types'
import { renderStepVisualizer, type VisualizationKind } from '@lib/visualizers/render-step'

export type StepVizSnapshot = {
  selectedAlgorithm: Algorithm | null
  currentStepData: Step | null
}

const HOST_CLASS = 'flex-1 flex min-h-0 w-full'

function isVizKind(value: string): value is VisualizationKind {
  return value === 'array' || value === 'graph' || value === 'matrix' || value === 'concept'
}

/**
 * Paint `root` whenever `subscribe` fires. Returns an unsubscribe that also clears the host.
 * Concept chunks load lazily; rapid step changes discard stale paints.
 */
export function bindStepVisualizer(
  root: HTMLElement,
  getSnapshot: () => StepVizSnapshot,
  subscribe: (listener: () => void) => () => void,
  locale: Locale = 'en',
): () => void {
  root.className = HOST_CLASS
  let generation = 0

  const paint = () => {
    const myGeneration = ++generation
    const { selectedAlgorithm, currentStepData } = getSnapshot()

    if (!selectedAlgorithm || !currentStepData) {
      root.replaceChildren()
      root.className = HOST_CLASS
      return
    }

    const kind = selectedAlgorithm.visualization
    if (!isVizKind(kind)) {
      root.replaceChildren()
      root.className = HOST_CLASS
      return
    }

    void renderStepVisualizer(root, currentStepData, kind, locale).then(() => {
      // If a newer paint started, leave its result alone.
      void myGeneration
    })
  }

  paint()
  const unsub = subscribe(paint)

  return () => {
    generation += 1
    unsub()
    root.replaceChildren()
  }
}
