import type { Algorithm, CodeImplementation, CodeLanguage } from '@lib/types'
import { getCatalogEntry } from '@lib/algorithms/catalog'

type LangPack = Exclude<CodeLanguage, 'javascript'>
type ImplementationLoader = (id: string) => Promise<CodeImplementation | undefined>
type ImplementationGroup =
  | 'concepts'
  | 'data-structures'
  | 'sorting'
  | 'searching'
  | 'graphs'
  | 'dynamic-programming'
  | 'backtracking'
  | 'divide-and-conquer'
  | 'math'
  | 'compression'

/** Cache so revisiting an algorithm does not re-download its chunk. */
const algorithmCache = new Map<string, Promise<Algorithm>>()
const implementationCache = new Map<string, Promise<CodeImplementation | undefined>>()

function readDefaultAlgorithm(module: unknown): Algorithm {
  return (module as { default: Algorithm }).default
}

function readImplementationLoader(module: unknown): ImplementationLoader {
  return (module as { loadImplementation: ImplementationLoader }).loadImplementation
}

/**
 * Dynamic importers keyed by algorithm id.
 * Vite splits each `import()` target into its own chunk (or shares category
 * chunks when several algorithms live in the same module).
 */
const ALGORITHM_LOADERS: Record<string, () => Promise<Algorithm>> = {
  // Concepts (+ stack/queue which also live in concepts.ts)
  'big-o-notation': () => import('./concepts?algorithm=bigONotation').then(readDefaultAlgorithm),
  recursion: () => import('./concepts?algorithm=recursion').then(readDefaultAlgorithm),
  'two-pointers': () => import('./concepts?algorithm=twoPointers').then(readDefaultAlgorithm),
  'sliding-window': () => import('./concepts?algorithm=slidingWindow').then(readDefaultAlgorithm),
  'space-complexity': () =>
    import('./concepts?algorithm=spaceComplexity').then(readDefaultAlgorithm),
  memoization: () => import('./concepts?algorithm=memoization').then(readDefaultAlgorithm),
  'greedy-vs-dp': () => import('./concepts?algorithm=greedyVsDp').then(readDefaultAlgorithm),
  stack: () => import('./concepts?algorithm=stack').then(readDefaultAlgorithm),
  queue: () => import('./concepts?algorithm=queue').then(readDefaultAlgorithm),

  // Data structures
  'linked-list': () => import('./data-structures?algorithm=linkedList').then(readDefaultAlgorithm),
  'hash-table': () => import('./data-structures?algorithm=hashTable').then(readDefaultAlgorithm),
  'binary-search-tree': () =>
    import('./data-structures?algorithm=binarySearchTree').then(readDefaultAlgorithm),
  heap: () => import('./data-structures?algorithm=heap').then(readDefaultAlgorithm),
  trie: () => import('./data-structures?algorithm=trie').then(readDefaultAlgorithm),
  'lru-cache': () => import('./data-structures?algorithm=lruCache').then(readDefaultAlgorithm),

  // Sorting
  'bubble-sort': () => import('./sorting?algorithm=bubbleSort').then(readDefaultAlgorithm),
  'selection-sort': () => import('./sorting?algorithm=selectionSort').then(readDefaultAlgorithm),
  'insertion-sort': () => import('./sorting?algorithm=insertionSort').then(readDefaultAlgorithm),
  'quick-sort': () => import('./sorting?algorithm=quickSort').then(readDefaultAlgorithm),
  'merge-sort': () => import('./sorting?algorithm=mergeSort').then(readDefaultAlgorithm),
  'heap-sort': () => import('./sorting?algorithm=heapSort').then(readDefaultAlgorithm),
  'counting-sort': () => import('./sorting?algorithm=countingSort').then(readDefaultAlgorithm),
  'radix-sort': () => import('./sorting?algorithm=radixSort').then(readDefaultAlgorithm),
  'shell-sort': () => import('./sorting?algorithm=shellSort').then(readDefaultAlgorithm),
  'bucket-sort': () => import('./sorting?algorithm=bucketSort').then(readDefaultAlgorithm),

  // Searching
  'binary-search': () => import('./searching?algorithm=binarySearch').then(readDefaultAlgorithm),
  'linear-search': () => import('./searching?algorithm=linearSearch').then(readDefaultAlgorithm),
  'jump-search': () => import('./searching?algorithm=jumpSearch').then(readDefaultAlgorithm),
  'interpolation-search': () =>
    import('./searching?algorithm=interpolationSearch').then(readDefaultAlgorithm),

  // Graphs
  bfs: () => import('./graphs?algorithm=bfs').then(readDefaultAlgorithm),
  dfs: () => import('./graphs?algorithm=dfs').then(readDefaultAlgorithm),
  dijkstra: () => import('./graphs?algorithm=dijkstra').then(readDefaultAlgorithm),
  prim: () => import('./graphs?algorithm=prim').then(readDefaultAlgorithm),
  'topological-sort': () => import('./graphs?algorithm=topologicalSort').then(readDefaultAlgorithm),

  // Dynamic programming
  'fibonacci-dp': () =>
    import('./dynamic-programming?algorithm=fibonacciDp').then(readDefaultAlgorithm),
  knapsack: () => import('./dynamic-programming?algorithm=knapsack').then(readDefaultAlgorithm),
  lcs: () => import('./dynamic-programming?algorithm=lcs').then(readDefaultAlgorithm),

  // Backtracking
  'n-queens': () => import('./backtracking?algorithm=nQueens').then(readDefaultAlgorithm),
  'sudoku-solver': () => import('./backtracking?algorithm=sudokuSolver').then(readDefaultAlgorithm),
  'maze-pathfinding': () =>
    import('./backtracking?algorithm=mazePathfinding').then(readDefaultAlgorithm),

  // Divide and conquer
  'tower-of-hanoi': () =>
    import('./divide-and-conquer?algorithm=towerOfHanoi').then(readDefaultAlgorithm),

  // Math
  'sieve-of-eratosthenes': () =>
    import('./math?algorithm=sieveOfEratosthenes').then(readDefaultAlgorithm),

  // Compression
  'run-length-encoding': () =>
    import('./compression?algorithm=runLengthEncoding').then(readDefaultAlgorithm),
  lz77: () => import('./compression?algorithm=lz77').then(readDefaultAlgorithm),
  lzw: () => import('./compression?algorithm=lzw').then(readDefaultAlgorithm),
  'huffman-coding': () =>
    import('./compression?algorithm=huffmanCoding').then(readDefaultAlgorithm),
  deflate: () => import('./compression?algorithm=deflate').then(readDefaultAlgorithm),
  brotli: () => import('./compression?algorithm=brotli').then(readDefaultAlgorithm),
}

const IMPLEMENTATION_GROUP_BY_CATEGORY: Record<string, ImplementationGroup> = {
  Concepts: 'concepts',
  'Data Structures': 'data-structures',
  Sorting: 'sorting',
  Searching: 'searching',
  Graphs: 'graphs',
  'Dynamic Programming': 'dynamic-programming',
  Backtracking: 'backtracking',
  'Divide and Conquer': 'divide-and-conquer',
  Math: 'math',
  Compression: 'compression',
}

const IMPLEMENTATION_LOADERS: Record<
  LangPack,
  Record<ImplementationGroup, () => Promise<ImplementationLoader>>
> = {
  python: {
    concepts: () =>
      import('./python/concepts?implementation-loader').then(readImplementationLoader),
    'data-structures': () =>
      import('./python/data-structures?implementation-loader').then(readImplementationLoader),
    sorting: () => import('./python/sorting?implementation-loader').then(readImplementationLoader),
    searching: () =>
      import('./python/searching?implementation-loader').then(readImplementationLoader),
    graphs: () => import('./python/graphs?implementation-loader').then(readImplementationLoader),
    'dynamic-programming': () =>
      import('./python/dynamic-programming?implementation-loader').then(readImplementationLoader),
    backtracking: () =>
      import('./python/backtracking?implementation-loader').then(readImplementationLoader),
    'divide-and-conquer': () =>
      import('./python/divide-and-conquer?implementation-loader').then(readImplementationLoader),
    math: () => import('./python/math?implementation-loader').then(readImplementationLoader),
    compression: () =>
      import('./python/compression?implementation-loader').then(readImplementationLoader),
  },
  java: {
    concepts: () => import('./java/concepts?implementation-loader').then(readImplementationLoader),
    'data-structures': () =>
      import('./java/data-structures?implementation-loader').then(readImplementationLoader),
    sorting: () => import('./java/sorting?implementation-loader').then(readImplementationLoader),
    searching: () =>
      import('./java/searching?implementation-loader').then(readImplementationLoader),
    graphs: () => import('./java/graphs?implementation-loader').then(readImplementationLoader),
    'dynamic-programming': () =>
      import('./java/dynamic-programming?implementation-loader').then(readImplementationLoader),
    backtracking: () =>
      import('./java/backtracking?implementation-loader').then(readImplementationLoader),
    'divide-and-conquer': () =>
      import('./java/divide-and-conquer?implementation-loader').then(readImplementationLoader),
    math: () => import('./java/math?implementation-loader').then(readImplementationLoader),
    compression: () =>
      import('./java/compression?implementation-loader').then(readImplementationLoader),
  },
  cpp: {
    concepts: () => import('./cpp/concepts?implementation-loader').then(readImplementationLoader),
    'data-structures': () =>
      import('./cpp/data-structures?implementation-loader').then(readImplementationLoader),
    sorting: () => import('./cpp/sorting?implementation-loader').then(readImplementationLoader),
    searching: () => import('./cpp/searching?implementation-loader').then(readImplementationLoader),
    graphs: () => import('./cpp/graphs?implementation-loader').then(readImplementationLoader),
    'dynamic-programming': () =>
      import('./cpp/dynamic-programming?implementation-loader').then(readImplementationLoader),
    backtracking: () =>
      import('./cpp/backtracking?implementation-loader').then(readImplementationLoader),
    'divide-and-conquer': () =>
      import('./cpp/divide-and-conquer?implementation-loader').then(readImplementationLoader),
    math: () => import('./cpp/math?implementation-loader').then(readImplementationLoader),
    compression: () =>
      import('./cpp/compression?implementation-loader').then(readImplementationLoader),
  },
  rust: {
    concepts: () => import('./rust/concepts?implementation-loader').then(readImplementationLoader),
    'data-structures': () =>
      import('./rust/data-structures?implementation-loader').then(readImplementationLoader),
    sorting: () => import('./rust/sorting?implementation-loader').then(readImplementationLoader),
    searching: () =>
      import('./rust/searching?implementation-loader').then(readImplementationLoader),
    graphs: () => import('./rust/graphs?implementation-loader').then(readImplementationLoader),
    'dynamic-programming': () =>
      import('./rust/dynamic-programming?implementation-loader').then(readImplementationLoader),
    backtracking: () =>
      import('./rust/backtracking?implementation-loader').then(readImplementationLoader),
    'divide-and-conquer': () =>
      import('./rust/divide-and-conquer?implementation-loader').then(readImplementationLoader),
    math: () => import('./rust/math?implementation-loader').then(readImplementationLoader),
    compression: () =>
      import('./rust/compression?implementation-loader').then(readImplementationLoader),
  },
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

/** Load one language implementation without downloading the rest of its pack. */
export function loadLanguageImplementation(
  algorithmId: string,
  language: LangPack,
): Promise<CodeImplementation | undefined> {
  const cacheKey = `${language}:${algorithmId}`
  const cached = implementationCache.get(cacheKey)
  if (cached) return cached

  const category = getCatalogEntry(algorithmId)?.category
  const group = category ? IMPLEMENTATION_GROUP_BY_CATEGORY[category] : undefined
  if (!group) return Promise.resolve(undefined)

  const promise = IMPLEMENTATION_LOADERS[language][group]().then((load) => load(algorithmId))
  implementationCache.set(cacheKey, promise)
  return promise
}

export function isLoadableAlgorithm(id: string): boolean {
  return id in ALGORITHM_LOADERS
}
