/**
 * Dispatch a Step to the correct plain-DOM visualizer.
 * Concept types are loaded on demand (see `concept/index.ts`).
 */
import type { Step } from '@lib/types'
import type { Locale } from '@i18n/translations'
import { renderArrayVisualizer } from '@lib/visualizers/array'
import { renderMatrixVisualizer } from '@lib/visualizers/matrix'
import { renderGraphVisualizer } from '@lib/visualizers/graph'
import { renderConceptVisualizer } from '@lib/visualizers/concept'

export type VisualizationKind = 'array' | 'graph' | 'matrix' | 'concept'

/**
 * Paint a step into `root`. Concept rendering is async (lazy chunk load).
 */
export async function renderStepVisualizer(
  root: HTMLElement,
  step: Step,
  kind: VisualizationKind,
  locale: Locale = 'en',
): Promise<void> {
  switch (kind) {
    case 'array':
      renderArrayVisualizer(root, step)
      return
    case 'matrix':
      renderMatrixVisualizer(root, step)
      return
    case 'graph':
      renderGraphVisualizer(root, step, locale)
      return
    case 'concept':
      await renderConceptVisualizer(root, step)
      return
    default:
      root.replaceChildren()
  }
}
