/**
 * Concept visualizer entry — lazy-loads only the renderer for the active concept type.
 */
import type { Step } from '@lib/types'

export type ConceptType =
  | 'bigO'
  | 'callStack'
  | 'stackQueue'
  | 'linkedList'
  | 'hashTable'
  | 'binaryTree'
  | 'twoPointers'
  | 'slidingWindow'
  | 'memoTable'
  | 'coinChange'
  | 'buckets'
  | 'huffman'

type ConceptRenderer = (state: never) => HTMLElement

const loaders: Record<ConceptType, () => Promise<ConceptRenderer>> = {
  bigO: () => import('@lib/visualizers/concept/big-o').then((m) => m.renderBigO as ConceptRenderer),
  callStack: () =>
    import('@lib/visualizers/concept/call-stack').then((m) => m.renderCallStack as ConceptRenderer),
  stackQueue: () =>
    import('@lib/visualizers/concept/stack-queue').then(
      (m) => m.renderStackQueue as ConceptRenderer,
    ),
  linkedList: () =>
    import('@lib/visualizers/concept/linked-list').then(
      (m) => m.renderLinkedList as ConceptRenderer,
    ),
  hashTable: () =>
    import('@lib/visualizers/concept/hash-table').then((m) => m.renderHashTable as ConceptRenderer),
  binaryTree: () =>
    import('@lib/visualizers/concept/binary-tree').then(
      (m) => m.renderBinaryTree as ConceptRenderer,
    ),
  twoPointers: () =>
    import('@lib/visualizers/concept/two-pointers').then(
      (m) => m.renderTwoPointers as ConceptRenderer,
    ),
  slidingWindow: () =>
    import('@lib/visualizers/concept/sliding-window').then(
      (m) => m.renderSlidingWindow as ConceptRenderer,
    ),
  memoTable: () =>
    import('@lib/visualizers/concept/memo-table').then((m) => m.renderMemoTable as ConceptRenderer),
  coinChange: () =>
    import('@lib/visualizers/concept/coin-change').then(
      (m) => m.renderCoinChange as ConceptRenderer,
    ),
  buckets: () =>
    import('@lib/visualizers/concept/buckets').then((m) => m.renderBuckets as ConceptRenderer),
  huffman: () =>
    import('@lib/visualizers/concept/huffman').then((m) => m.renderHuffman as ConceptRenderer),
}

const cache = new Map<ConceptType, ConceptRenderer>()
let paintGeneration = 0

async function loadRenderer(type: ConceptType): Promise<ConceptRenderer> {
  const cached = cache.get(type)
  if (cached) return cached
  const render = await loaders[type]()
  cache.set(type, render)
  return render
}

/**
 * Paint a concept step. Only downloads the chunk for `step.concept.type`.
 * Safe under rapid step changes (stale loads are discarded).
 */
export async function renderConceptVisualizer(root: HTMLElement, step: Step): Promise<void> {
  const generation = ++paintGeneration
  const concept = step.concept

  if (!concept) {
    root.replaceChildren()
    return
  }

  const type = concept.type as ConceptType
  if (!loaders[type]) {
    root.replaceChildren()
    return
  }

  try {
    const render = await loadRenderer(type)
    if (generation !== paintGeneration) return
    root.replaceChildren()
    root.append(render(concept as never))
  } catch (error) {
    if (generation !== paintGeneration) return
    console.error(`Failed to load concept visualizer "${type}"`, error)
    root.replaceChildren()
  }
}
