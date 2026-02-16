import type { GraphNode, GraphEdge } from '../types'

/** Locale-aware description helper */
export const d = (locale: string, en: string, es: string) => (locale === 'es' ? es : en)

/** Shared graph data for BFS/DFS */
export const graphNodes: GraphNode[] = [
  { id: 0, label: '0', x: 250, y: 40 },
  { id: 1, label: '1', x: 130, y: 130 },
  { id: 2, label: '2', x: 370, y: 130 },
  { id: 3, label: '3', x: 50, y: 230 },
  { id: 4, label: '4', x: 200, y: 230 },
  { id: 5, label: '5', x: 440, y: 230 },
  { id: 6, label: '6', x: 200, y: 310 },
]

export const graphEdges: GraphEdge[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 4, to: 6 },
]

export const graphAdj: Record<number, number[]> = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 6],
  5: [2],
  6: [4],
}
