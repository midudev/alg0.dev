export type VisualizationType = 'array' | 'graph' | 'matrix' | 'concept'

export type HighlightType =
  | 'comparing'
  | 'swapped'
  | 'selected'
  | 'sorted'
  | 'pivot'
  | 'found'
  | 'current'
  | 'searching'
  | 'left'
  | 'right'
  | 'merged'
  | 'minimum'
  | 'placed'
  | 'conflict'
  | 'checking'
  | 'wall'
  | 'path'
  | 'start'
  | 'end'
  | 'given'
  | 'active'
  | 'visited'

export interface GraphNode {
  id: number
  label: string
  x: number
  y: number
}

export interface GraphEdge {
  from: number
  to: number
  weight?: number
}

export interface GraphState {
  nodes: GraphNode[]
  edges: GraphEdge[]
  visitedNodes: number[]
  currentNode: number | null
  visitedEdges: [number, number][]
  currentEdge: [number, number] | null
  queue?: number[]
  stack?: number[]
  distances?: Record<number, number | string>
}

export interface MatrixState {
  rows: number
  cols: number
  values: (number | string)[][]
  highlights: Record<string, HighlightType>
}

// ── Concept visualization types ──

export interface BigOCurve {
  name: string
  color: string
  visible: boolean
  highlighted: boolean
}

export interface BigOState {
  type: 'bigO'
  curves: BigOCurve[]
  maxN: number
  yLabel?: string
}

export interface CallStackFrame {
  label: string
  detail?: string
  state: 'waiting' | 'active' | 'base' | 'resolved'
}

export interface CallStackState {
  type: 'callStack'
  frames: CallStackFrame[]
}

export interface StackQueueItem {
  value: number
  state: 'normal' | 'entering' | 'leaving'
}

export interface StackQueueState {
  type: 'stackQueue'
  structure: 'stack' | 'queue'
  items: StackQueueItem[]
  operation?: string
  removedValue?: number | null
}

// ── Data structure visualization types ──

export interface LinkedListNodeData {
  value: number
  state: 'normal' | 'current' | 'new' | 'removing' | 'found'
}

export interface LinkedListState {
  type: 'linkedList'
  nodes: LinkedListNodeData[]
  operation?: string
}

export interface HashEntry {
  key: string
  value: number
  state: 'normal' | 'new' | 'found' | 'collision'
}

export interface HashTableState {
  type: 'hashTable'
  buckets: HashEntry[][]
  size: number
  hashingKey?: string
  hashResult?: number
  operation?: string
}

export interface TreeNodeData {
  value: number
  state: 'normal' | 'current' | 'new' | 'found' | 'comparing' | 'placed'
}

export interface BinaryTreeState {
  type: 'binaryTree'
  nodes: (TreeNodeData | null)[]
  operation?: string
  treeType: 'bst' | 'heap'
  heapType?: 'min' | 'max'
}

export interface TrieNodeData {
  id: number
  /** Single character this node consumes. Empty string for the root. */
  char: string
  /** True when a stored word ends here. */
  isEnd: boolean
  /** Child ids keyed by character. */
  children: Record<string, number>
  state: 'normal' | 'current' | 'new' | 'found' | 'path' | 'subtree' | 'missing'
}

export interface TrieState {
  type: 'trie'
  /** Flat node map. Id 0 is always the root. */
  nodes: Record<number, TrieNodeData>
  /** Words stored so far, for the side panel. */
  words: string[]
  /** Word or prefix being walked, rendered above the tree. */
  probe?: string | null
  /** How many characters of `probe` have matched so far. */
  matched?: number
  /** Result chips for startsWith / autocomplete steps. */
  suggestions?: string[]
  operation?: string
}

export interface LruEntry {
  key: string
  value: number
  state: 'normal' | 'new' | 'hit' | 'moving' | 'evicting' | 'updated'
}

export interface LruCacheState {
  type: 'lruCache'
  capacity: number
  /** Nodes in recency order: index 0 is the most recently used. */
  entries: LruEntry[]
  /** Key currently being looked up in the map. */
  lookupKey?: string | null
  /** True when `lookupKey` is not in the cache. */
  miss?: boolean
  /** Key that was just evicted, shown leaving the structure. */
  evictedKey?: string | null
  operation?: string
}

// ── Algorithm technique visualization types ──

export interface TwoPointersState {
  type: 'twoPointers'
  array: number[]
  left: number
  right: number
  highlights: Record<number, 'default' | 'left' | 'right' | 'found' | 'checked'>
  sum?: number
  target?: number
  operation?: string
}

export interface SlidingWindowState {
  type: 'slidingWindow'
  chars: string[]
  windowStart: number
  windowEnd: number
  charStates: Record<number, 'outside' | 'inWindow' | 'current' | 'duplicate'>
  best?: { start: number; end: number }
  operation?: string
}

export interface MemoTableState {
  type: 'memoTable'
  entries: { key: number; value: number | null; state: 'empty' | 'computing' | 'cached' | 'hit' }[]
  currentCall?: string
  operation?: string
}

export interface CoinChangeState {
  type: 'coinChange'
  coins: number[]
  target: number
  selected: number[]
  remaining: number
  approach: 'greedy' | 'dp' | 'compare'
  greedyResult?: number[]
  dpResult?: number[]
  operation?: string
}

export interface BucketsState {
  type: 'buckets'
  array: number[]
  buckets: number[][]
  range?: { min: number; max: number }
  min?: number
  max?: number
  bucketSize?: number
  currentElementIndex?: number
  activeBucketIndex?: number
  innerHighlights?: Record<number, HighlightType>
  phase: 'initializing' | 'distributing' | 'sorting' | 'collecting'
  operation?: string
}

// ── Compression visualization types ──

export interface HuffmanState {
  type: 'huffman'
  phase: 'frequency' | 'build' | 'encode' | 'done'
  text: string
  highlightChar?: string | null
  nodes: Record<
    number,
    { id: number; char: string | null; freq: number; left: number | null; right: number | null }
  >
  queue: number[]
  nodeStates?: Record<number, 'normal' | 'merging' | 'new' | 'path' | 'leafFound'>
  freqTable?: { char: string; freq: number; active?: boolean }[]
  codes?: { char: string; code: string; freq: number; active?: boolean }[]
  activeCode?: string | null
  summary?: {
    uniqueChars: number
    originalBits: number
    compressedBits: number
    avgBits: number
    savingPct: number
    encoded: string
  }
  operation?: string
}

export interface RleState {
  type: 'rle'
  phase: 'scan' | 'emit' | 'done'
  text: string
  charStates: Record<number, 'default' | 'inRun' | 'current' | 'emitted'>
  runStart?: number
  runEnd?: number
  tokens: { char: string; count: number; active?: boolean }[]
  encoded?: string
  summary?: {
    originalLen: number
    encodedLen: number
    tokenCount: number
    savingPct: number
  }
  operation?: string
}

export interface Lz77State {
  type: 'lz77'
  phase: 'search' | 'match' | 'emit' | 'done'
  text: string
  position: number
  windowStart: number
  windowSize: number
  charStates: Record<number, 'outside' | 'window' | 'lookAhead' | 'current' | 'match' | 'encoded'>
  /** Best match found so far: offset (distance back), length, next literal */
  match?: { offset: number; length: number; next: string } | null
  tokens: { offset: number; length: number; next: string; active?: boolean }[]
  summary?: {
    originalLen: number
    tokenCount: number
    literals: number
    matches: number
  }
  operation?: string
}

export interface LzwState {
  type: 'lzw'
  phase: 'init' | 'scan' | 'output' | 'add' | 'done'
  text: string
  position: number
  /** Current matched phrase `w` */
  current: string
  /** Candidate `w + c` under consideration */
  candidate?: string | null
  charStates: Record<number, 'default' | 'inPhrase' | 'current' | 'done'>
  dictionary: { code: number; entry: string; active?: boolean; isNew?: boolean }[]
  output: { code: number; entry: string; active?: boolean }[]
  summary?: {
    originalLen: number
    codeCount: number
    dictSize: number
  }
  operation?: string
}

/** Pedagogical DEFLATE = LZ77 stage + Huffman stage (gzip engine). */
export interface DeflateState {
  type: 'deflate'
  phase: 'intro' | 'lz77' | 'symbols' | 'huffman' | 'encode' | 'done'
  /** Which pipeline stages are complete / active for the stage bar */
  stages: {
    id: 'lz77' | 'symbols' | 'huffman' | 'bits'
    label: string
    state: 'pending' | 'active' | 'done'
  }[]
  text: string
  position: number
  windowStart: number
  windowSize: number
  charStates: Record<number, 'outside' | 'window' | 'lookAhead' | 'current' | 'match' | 'encoded'>
  match?: { offset: number; length: number; next: string } | null
  tokens: { offset: number; length: number; next: string; active?: boolean }[]
  symbols: { label: string; kind: 'literal' | 'match'; active?: boolean }[]
  freqTable?: { symbol: string; freq: number; code?: string; active?: boolean }[]
  encodedBits?: string
  summary?: {
    originalBits: number
    lz77Symbols: number
    fixedBits: number
    deflateBits: number
    savingPct: number
  }
  operation?: string
}

/** Pedagogical Brotli: static dictionary → LZ back-ref → entropy coding. */
export interface BrotliState {
  type: 'brotli'
  phase: 'intro' | 'dict' | 'scan' | 'encode' | 'done'
  stages: {
    id: 'dict' | 'scan' | 'entropy' | 'bits'
    label: string
    state: 'pending' | 'active' | 'done'
  }[]
  text: string
  position: number
  charStates: Record<number, 'default' | 'current' | 'dict' | 'match' | 'literal' | 'done'>
  /** Static dictionary entries (common phrases) */
  dictionary: { entry: string; active?: boolean; used?: boolean }[]
  /** Emitted commands */
  commands: {
    kind: 'dict' | 'match' | 'literal'
    label: string
    active?: boolean
  }[]
  /** Current match highlight range in already-seen text */
  matchRange?: { start: number; end: number } | null
  /** Current span being consumed */
  consumeRange?: { start: number; end: number } | null
  codes?: { symbol: string; code: string; freq: number; active?: boolean }[]
  encodedBits?: string
  summary?: {
    originalBits: number
    commandCount: number
    dictHits: number
    lzHits: number
    literals: number
    brotliBits: number
    savingPct: number
  }
  operation?: string
}

export type ConceptState =
  | BigOState
  | CallStackState
  | StackQueueState
  | LinkedListState
  | HashTableState
  | BinaryTreeState
  | TrieState
  | LruCacheState
  | TwoPointersState
  | SlidingWindowState
  | MemoTableState
  | CoinChangeState
  | BucketsState
  | HuffmanState
  | RleState
  | Lz77State
  | LzwState
  | DeflateState
  | BrotliState

export interface Step {
  array?: number[]
  highlights?: Record<number, HighlightType>
  sorted?: number[]
  graph?: GraphState
  matrix?: MatrixState
  concept?: ConceptState
  codeLine?: number
  description?: string
  variables?: Record<string, string | number | boolean | null>
  consoleOutput?: string[]
}

export type Difficulty = 'easy' | 'intermediate' | 'advanced'

export type CodeLanguage = 'javascript' | 'python' | 'java' | 'cpp' | 'rust'

/** A translation of an algorithm's source into another language. */
export interface CodeImplementation {
  code: string
  /**
   * Maps a JavaScript line number — the one `Step.codeLine` points at — to the
   * equivalent line in `code`. Built from `#@` / `//@` markers, see `annotated()`.
   */
  lineMap: Record<number, number>
}

export interface Algorithm {
  id: string
  name: string
  category: string
  difficulty: Difficulty
  /** JavaScript source. `Step.codeLine` numbers always refer to this one. */
  code: string
  /** Same algorithm written in other languages, keyed by language id. */
  implementations?: Partial<Record<Exclude<CodeLanguage, 'javascript'>, CodeImplementation>>
  visualization: VisualizationType
  generateSteps: (locale?: string) => Step[]
}

/** Lightweight listing data for the sidebar / routing (no code or step generators). */
export interface AlgorithmSummary {
  id: string
  name: string
  category: string
  difficulty: Difficulty
  visualization: VisualizationType
}

export interface Category {
  name: string
  algorithms: Algorithm[]
}

export interface CategorySummary {
  name: string
  algorithms: AlgorithmSummary[]
}
