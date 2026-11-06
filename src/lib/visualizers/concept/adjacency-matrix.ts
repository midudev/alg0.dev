/**
 * Concept visualizer: directed graph alongside its labeled adjacency matrix.
 */
import type { AdjacencyMatrixState, GraphNode } from '@lib/types'
import { highlightStyles } from '@lib/highlight-colors'
import { applyStyles, svgEl } from '@lib/visualizers/concept/dom'

const NODE_RADIUS = 18
const GRAPH_WIDTH = 360
const GRAPH_HEIGHT = 220

const COLORS = {
  nodeFill: 'var(--subtle)',
  nodeStroke: 'var(--viz-label)',
  nodeText: 'var(--viz-text)',
  nodeCurrentFill: 'rgba(251,146,60,0.16)',
  nodeCurrentStroke: 'var(--foreground)',
  nodeCurrentText: 'var(--foreground)',
  edge: 'var(--viz-label)',
  edgeCurrent: 'var(--foreground)',
}

let instanceCount = 0

function makeLabel(text: string): HTMLDivElement {
  const label = document.createElement('div')
  label.className = 'text-[9px] md:text-[10px] font-mono uppercase tracking-wider'
  label.style.color = 'var(--viz-text)'
  label.textContent = text
  return label
}

function renderGraph(
  state: AdjacencyMatrixState,
  byId: (id: number) => GraphNode | undefined,
  markerPrefix: string,
): HTMLElement {
  const { nodes, edges, directed, currentEdge } = state
  const section = document.createElement('div')
  section.className = 'flex-1 flex flex-col items-center justify-center gap-1 min-w-0 max-w-sm'
  section.setAttribute('aria-hidden', 'true')
  section.append(makeLabel(directed ? 'Directed graph' : 'Undirected graph'))

  const svg = svgEl('svg', {
    viewBox: `0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`,
    class: 'w-full',
  })
  applyStyles(svg, { maxHeight: 'min(180px, 20vh)', height: 'auto', display: 'block' })

  const defs = svgEl('defs')
  for (const [suffix, color] of [
    ['', COLORS.edge],
    ['-current', COLORS.edgeCurrent],
  ] as const) {
    const marker = svgEl('marker', {
      id: `${markerPrefix}${suffix}`,
      viewBox: '0 0 10 10',
      refX: 9,
      refY: 5,
      markerWidth: 7,
      markerHeight: 7,
      orient: 'auto-start-reverse',
    })
    marker.append(svgEl('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: color }))
    defs.append(marker)
  }
  svg.append(defs)

  for (const edge of edges) {
    const from = byId(edge.from)
    const to = byId(edge.to)
    if (!from || !to) continue

    const dx = to.x - from.x
    const dy = to.y - from.y
    const length = Math.hypot(dx, dy) || 1
    const ux = dx / length
    const uy = dy / length
    const active = currentEdge != null && currentEdge[0] === edge.from && currentEdge[1] === edge.to

    const line = svgEl('line', {
      x1: from.x + ux * NODE_RADIUS,
      y1: from.y + uy * NODE_RADIUS,
      x2: to.x - ux * (NODE_RADIUS + 4),
      y2: to.y - uy * (NODE_RADIUS + 4),
      stroke: active ? COLORS.edgeCurrent : COLORS.edge,
      strokeWidth: active ? 2.5 : 1.5,
      strokeLinecap: 'round',
      markerEnd: directed ? `url(#${markerPrefix}${active ? '-current' : ''})` : undefined,
    })
    line.style.transition = 'stroke 200ms ease, stroke-width 200ms ease'
    svg.append(line)
  }

  for (const node of nodes) {
    const active = currentEdge != null && (currentEdge[0] === node.id || currentEdge[1] === node.id)
    const group = svgEl('g')
    const circle = svgEl('circle', {
      cx: node.x,
      cy: node.y,
      r: NODE_RADIUS,
      fill: active ? COLORS.nodeCurrentFill : COLORS.nodeFill,
      stroke: active ? COLORS.nodeCurrentStroke : COLORS.nodeStroke,
      strokeWidth: active ? 2 : 1.5,
    })
    circle.style.transition = 'fill 200ms ease, stroke 200ms ease'

    const text = svgEl('text', {
      x: node.x,
      y: node.y + 1,
      textAnchor: 'middle',
      dominantBaseline: 'central',
      fill: active ? COLORS.nodeCurrentText : COLORS.nodeText,
      fontSize: 13,
      fontFamily: 'monospace',
      fontWeight: 'bold',
    })
    text.textContent = node.label
    group.append(circle, text)
    svg.append(group)
  }

  section.append(svg)
  return section
}

function renderMatrix(state: AdjacencyMatrixState): HTMLElement {
  const { nodes, matrix, highlightCells = [] } = state
  const section = document.createElement('div')
  section.className = 'flex flex-col items-center justify-center gap-1 shrink-0'
  section.setAttribute('aria-hidden', 'true')
  section.append(makeLabel('Adjacency matrix'))

  const grid = document.createElement('div')
  grid.className = 'grid gap-0.5'
  grid.style.gridTemplateColumns = `repeat(${nodes.length + 1}, minmax(0, 1fr))`

  const cellClass =
    'w-5 h-5 md:w-7 md:h-7 [@media(max-height:700px)]:w-4 [@media(max-height:700px)]:h-4 flex items-center justify-center font-mono text-[10px] md:text-xs'
  const corner = document.createElement('div')
  corner.className = cellClass
  grid.append(corner)

  for (const node of nodes) {
    const header = document.createElement('div')
    header.className = `${cellClass} font-semibold`
    header.style.color = 'var(--viz-text)'
    header.textContent = node.label
    grid.append(header)
  }

  nodes.forEach((rowNode, row) => {
    const header = document.createElement('div')
    header.className = `${cellClass} font-semibold`
    header.style.color = 'var(--viz-text)'
    header.textContent = rowNode.label
    grid.append(header)

    for (let column = 0; column < nodes.length; column++) {
      const value = matrix[row]?.[column] ?? 0
      const current = highlightCells.some(([r, c]) => r === row && c === column)
      const styles = current ? highlightStyles.current : value ? highlightStyles.placed : null
      const cell = document.createElement('div')
      cell.className = `${cellClass} rounded border font-semibold transition-colors duration-200`
      applyStyles(cell, {
        backgroundColor: styles?.bg || 'var(--viz-cell)',
        borderColor: current ? 'var(--foreground)' : 'var(--viz-label)',
        color: current ? highlightStyles.current.text : 'var(--viz-text)',
      })
      cell.textContent = String(value)
      grid.append(cell)
    }
  })

  section.append(grid)
  return section
}

export function renderAdjacencyMatrix(state: AdjacencyMatrixState): HTMLElement {
  const { nodes, matrix, directed } = state
  const byId = (id: number) => nodes.find((node) => node.id === id) ?? nodes[id]
  const labelOf = (id: number) => byId(id)?.label ?? String(id)
  const markerPrefix = `adjacency-matrix-arrow-${++instanceCount}`

  const setEdges: string[] = []
  for (let row = 0; row < matrix.length; row++) {
    for (let column = 0; column < (matrix[row]?.length ?? 0); column++) {
      if (matrix[row][column]) {
        setEdges.push(`${labelOf(row)}${directed ? '→' : '—'}${labelOf(column)}`)
      }
    }
  }

  const wrap = document.createElement('div')
  wrap.className =
    'flex-1 flex items-center justify-center gap-2 md:gap-6 w-full min-h-0 [@media(max-height:700px)]:items-start'
  wrap.setAttribute('role', 'img')
  wrap.setAttribute(
    'aria-label',
    `${directed ? 'Directed' : 'Undirected'} graph with ${nodes.length} nodes and its ${nodes.length}×${nodes.length} adjacency matrix.${setEdges.length > 0 ? ` Edges set: ${setEdges.join(', ')}.` : ' No edges set yet.'}`,
  )
  wrap.append(renderGraph(state, byId, markerPrefix), renderMatrix(state))
  return wrap
}
