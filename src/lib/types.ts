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

export type ConceptState = BigOState | CallStackState | StackQueueState

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
}

export interface Algorithm {
  id: string
  name: string
  category: string
  description: string
  code: string
  visualization: VisualizationType
  generateSteps: (locale?: string) => Step[]
}

export interface Category {
  name: string
  algorithms: Algorithm[]
}
