export type VisualizationType = 'array' | 'graph' | 'matrix' | 'concept'

export type CodeLanguage = 'javascript' | 'typescript' | 'python' | 'cpp' | 'java'

export interface CodeSample {
  language: CodeLanguage
  label?: string
  code: string
}

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

export type ConceptState =
  | BigOState
  | CallStackState
  | StackQueueState
  | LinkedListState
  | HashTableState
  | BinaryTreeState
  | TwoPointersState
  | SlidingWindowState
  | MemoTableState
  | CoinChangeState

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

export interface Algorithm {
  id: string
  name: string
  category: string
  difficulty: Difficulty
  description: string
  code: string
  codeSamples?: CodeSample[]
  visualization: VisualizationType
  generateSteps: (locale?: string) => Step[]
}

export interface Category {
  name: string
  algorithms: Algorithm[]
}
