import type { Algorithm, CodeImplementation, CodeLanguage } from '@lib/types'

type LangPack = Exclude<CodeLanguage, 'javascript'>

/** Cache so revisiting an algorithm does not re-download its chunk. */
const algorithmCache = new Map<string, Promise<Algorithm>>()
const languagePackCache = new Map<LangPack, Promise<Record<string, CodeImplementation>>>()

/**
 * Dynamic importers keyed by algorithm id.
 * Vite splits each `import()` target into its own chunk (or shares category
 * chunks when several algorithms live in the same module).
 */
const ALGORITHM_LOADERS: Record<string, () => Promise<Algorithm>> = {
  // Concepts (+ stack/queue which also live in concepts.ts)
  'big-o-notation': () => import('./concepts').then((m) => m.bigONotation),
  recursion: () => import('./concepts').then((m) => m.recursion),
  'two-pointers': () => import('./concepts').then((m) => m.twoPointers),
  'sliding-window': () => import('./concepts').then((m) => m.slidingWindow),
  'space-complexity': () => import('./concepts').then((m) => m.spaceComplexity),
  memoization: () => import('./concepts').then((m) => m.memoization),
  'greedy-vs-dp': () => import('./concepts').then((m) => m.greedyVsDp),
  stack: () => import('./concepts').then((m) => m.stack),
  queue: () => import('./concepts').then((m) => m.queue),

  // Data structures
  'linked-list': () => import('./data-structures').then((m) => m.linkedList),
  'hash-table': () => import('./data-structures').then((m) => m.hashTable),
  'binary-search-tree': () => import('./data-structures').then((m) => m.binarySearchTree),
  heap: () => import('./data-structures').then((m) => m.heap),

  // Sorting
  'bubble-sort': () => import('./sorting').then((m) => m.bubbleSort),
  'selection-sort': () => import('./sorting').then((m) => m.selectionSort),
  'insertion-sort': () => import('./sorting').then((m) => m.insertionSort),
  'quick-sort': () => import('./sorting').then((m) => m.quickSort),
  'merge-sort': () => import('./sorting').then((m) => m.mergeSort),
  'heap-sort': () => import('./sorting').then((m) => m.heapSort),
  'counting-sort': () => import('./sorting').then((m) => m.countingSort),
  'radix-sort': () => import('./sorting').then((m) => m.radixSort),
  'shell-sort': () => import('./sorting').then((m) => m.shellSort),
  'bucket-sort': () => import('./sorting').then((m) => m.bucketSort),

  // Searching
  'binary-search': () => import('./searching').then((m) => m.binarySearch),
  'linear-search': () => import('./searching').then((m) => m.linearSearch),
  'jump-search': () => import('./searching').then((m) => m.jumpSearch),
  'interpolation-search': () => import('./searching').then((m) => m.interpolationSearch),

  // Graphs
  bfs: () => import('./graphs').then((m) => m.bfs),
  dfs: () => import('./graphs').then((m) => m.dfs),
  dijkstra: () => import('./graphs').then((m) => m.dijkstra),
  prim: () => import('./graphs').then((m) => m.prim),
  'topological-sort': () => import('./graphs').then((m) => m.topologicalSort),

  // Dynamic programming
  'fibonacci-dp': () => import('./dynamic-programming').then((m) => m.fibonacciDp),
  knapsack: () => import('./dynamic-programming').then((m) => m.knapsack),
  lcs: () => import('./dynamic-programming').then((m) => m.lcs),

  // Backtracking
  'n-queens': () => import('./backtracking').then((m) => m.nQueens),
  'sudoku-solver': () => import('./backtracking').then((m) => m.sudokuSolver),
  'maze-pathfinding': () => import('./backtracking').then((m) => m.mazePathfinding),

  // Divide and conquer
  'tower-of-hanoi': () => import('./divide-and-conquer').then((m) => m.towerOfHanoi),

  // Math
  'sieve-of-eratosthenes': () => import('./math').then((m) => m.sieveOfEratosthenes),
}

const LANGUAGE_LOADERS: Record<LangPack, () => Promise<Record<string, CodeImplementation>>> = {
  python: () => import('./python').then((m) => m.pythonImplementations),
  java: () => import('./java').then((m) => m.javaImplementations),
  cpp: () => import('./cpp').then((m) => m.cppImplementations),
  rust: () => import('./rust').then((m) => m.rustImplementations),
}

/** Load a single algorithm (JS code + step generator). Language packs stay separate. */
export function loadAlgorithm(id: string): Promise<Algorithm> {
  const cached = algorithmCache.get(id)
  if (cached) return cached

  const loader = ALGORITHM_LOADERS[id]
  if (!loader) {
    return Promise.reject(new Error(`Unknown algorithm: ${id}`))
  }

  const promise = loader().then((algo) => {
    // Strip any pre-attached implementations so language packs stay lazy
    if (algo.implementations) {
      const { implementations: _drop, ...rest } = algo
      return rest as Algorithm
    }
    return algo
  })

  algorithmCache.set(id, promise)
  return promise
}

function loadLanguagePack(language: LangPack): Promise<Record<string, CodeImplementation>> {
  const cached = languagePackCache.get(language)
  if (cached) return cached

  const promise = LANGUAGE_LOADERS[language]()
  languagePackCache.set(language, promise)
  return promise
}

/** Load one language translation for an algorithm (python / java / cpp). */
export async function loadLanguageImplementation(
  algorithmId: string,
  language: LangPack,
): Promise<CodeImplementation | undefined> {
  const pack = await loadLanguagePack(language)
  return pack[algorithmId]
}

export function isLoadableAlgorithm(id: string): boolean {
  return id in ALGORITHM_LOADERS
}
