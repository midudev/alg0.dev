/**
 * Graph visualizer — plain DOM (SVG), no React.
 */
import type { Step } from '@lib/types'
import type { Locale } from '@i18n/translations'
import { translations } from '@i18n/translations'

const NODE_RADIUS = 22

const colors = {
  nodeDefault: 'var(--subtle-strong)',
  nodeVisited: 'var(--viz-muted)',
  nodeCurrent: 'var(--foreground)',
  edgeDefault: 'var(--viz-border)',
  edgeVisited: 'var(--viz-muted)',
  edgeCurrent: 'var(--foreground)',
  strokeDefault: 'var(--viz-faint)',
  strokeVisited: 'var(--viz-muted)',
  strokeCurrent: 'var(--foreground)',
  weightText: 'var(--viz-label)',
  weightBg: 'var(--surface)',
}

const SVG_NS = 'http://www.w3.org/2000/svg'

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number | undefined> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue
    node.setAttribute(k, String(v))
  }
  return node
}

export function renderGraphVisualizer(root: HTMLElement, step: Step, locale: Locale = 'en'): void {
  const t = translations[locale]
  const { graph } = step

  root.replaceChildren()
  root.className = 'flex-1 flex flex-col items-center justify-center gap-5 w-full min-h-0'

  if (!graph) {
    root.removeAttribute('role')
    root.removeAttribute('aria-label')
    return
  }

  const {
    nodes,
    edges,
    visitedNodes = [],
    currentNode,
    visitedEdges = [],
    currentEdge,
    distances,
  } = graph

  const isEdgeVisited = (from: number, to: number) =>
    visitedEdges.some(([a, b]) => (a === from && b === to) || (a === to && b === from))

  const isEdgeCurrent = (from: number, to: number) =>
    currentEdge != null &&
    ((currentEdge[0] === from && currentEdge[1] === to) ||
      (currentEdge[0] === to && currentEdge[1] === from))

  const hasWeights = edges.some((e) => e.weight != null)
  const currentNodeLabel =
    currentNode != null ? nodes.find((n) => n.id === currentNode)?.label : null
  const visitedLabels = visitedNodes
    .map((id) => nodes.find((n) => n.id === id)?.label)
    .filter(Boolean)

  root.setAttribute('role', 'img')
  root.setAttribute(
    'aria-label',
    `Graph visualization: ${nodes.length} nodes, ${edges.length} edges.${currentNodeLabel ? ` Current node: ${currentNodeLabel}.` : ''}${visitedLabels.length > 0 ? ` Visited: ${visitedLabels.join(', ')}.` : ''}`,
  )

  const svg = svgEl('svg', { viewBox: '0 0 500 340', class: 'w-full max-w-3xl' })
  svg.style.maxHeight = 'min(55vh, 480px)'
  svg.style.height = 'auto'
  svg.setAttribute('aria-hidden', 'true')

  const defs = svgEl('defs')
  const filter = svgEl('filter', { id: 'glow' })
  const blur = svgEl('feGaussianBlur', { stdDeviation: '3', result: 'coloredBlur' })
  const merge = svgEl('feMerge')
  merge.append(
    svgEl('feMergeNode', { in: 'coloredBlur' }),
    svgEl('feMergeNode', { in: 'SourceGraphic' }),
  )
  filter.append(blur, merge)
  defs.append(filter)
  svg.append(defs)

  for (let i = 0; i < edges.length; i++) {
    const edge = edges[i]
    const from = nodes.find((n) => n.id === edge.from)
    const to = nodes.find((n) => n.id === edge.to)
    if (!from || !to) continue

    const isCurrent = isEdgeCurrent(edge.from, edge.to)
    const isVisited = isEdgeVisited(edge.from, edge.to)
    const color = isCurrent
      ? colors.edgeCurrent
      : isVisited
        ? colors.edgeVisited
        : colors.edgeDefault
    const midX = (from.x + to.x) / 2
    const midY = (from.y + to.y) / 2

    const g = svgEl('g')
    const line = svgEl('line', {
      x1: from.x,
      y1: from.y,
      x2: to.x,
      y2: to.y,
      stroke: color,
      'stroke-width': isCurrent ? 3 : 2,
      'stroke-linecap': 'round',
    })
    line.style.transition = 'stroke 0.3s ease, stroke-width 0.3s ease'
    if (isCurrent) line.setAttribute('filter', 'url(#glow)')
    g.append(line)

    if (hasWeights && edge.weight != null) {
      g.append(
        svgEl('circle', {
          cx: midX,
          cy: midY,
          r: 10,
          fill: colors.weightBg,
          stroke: isVisited || isCurrent ? color : colors.strokeDefault,
          'stroke-width': 1,
        }),
      )
      const text = svgEl('text', {
        x: midX,
        y: midY,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        fill: isCurrent
          ? colors.strokeCurrent
          : isVisited
            ? colors.strokeVisited
            : colors.weightText,
        'font-size': '9',
        'font-weight': '600',
        'font-family': 'Inter, system-ui, sans-serif',
      })
      text.textContent = String(edge.weight)
      g.append(text)
    }
    svg.append(g)
  }

  for (const node of nodes) {
    const isCurrent = currentNode === node.id
    const isVisited = visitedNodes.includes(node.id)
    const fill = isCurrent
      ? colors.nodeCurrent
      : isVisited
        ? colors.nodeVisited
        : colors.nodeDefault
    const stroke = isCurrent
      ? colors.strokeCurrent
      : isVisited
        ? colors.strokeVisited
        : colors.strokeDefault

    const g = svgEl('g')
    if (isCurrent) {
      const pulse = svgEl('circle', {
        cx: node.x,
        cy: node.y,
        r: NODE_RADIUS + 4,
        fill: 'none',
        stroke: colors.nodeCurrent,
        'stroke-width': 2,
        opacity: 0.25,
      })
      const animR = svgEl('animate', {
        attributeName: 'r',
        values: `${NODE_RADIUS + 3};${NODE_RADIUS + 10};${NODE_RADIUS + 3}`,
        dur: '1.5s',
        repeatCount: 'indefinite',
      })
      const animO = svgEl('animate', {
        attributeName: 'opacity',
        values: '0.3;0;0.3',
        dur: '1.5s',
        repeatCount: 'indefinite',
      })
      pulse.append(animR, animO)
      g.append(pulse)
    }

    const circle = svgEl('circle', {
      cx: node.x,
      cy: node.y,
      r: NODE_RADIUS,
      fill,
      stroke,
      'stroke-width': 2,
    })
    circle.style.transition = 'fill 0.3s ease, stroke 0.3s ease'
    if (isCurrent) circle.setAttribute('filter', 'url(#glow)')
    g.append(circle)

    const text = svgEl('text', {
      x: node.x,
      y: node.y,
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
      fill: isCurrent ? 'var(--surface)' : 'var(--foreground)',
      'font-size': '13',
      'font-weight': '600',
      'font-family': 'Inter, system-ui, sans-serif',
    })
    text.style.transition = 'fill 0.3s ease'
    text.textContent = node.label
    g.append(text)
    svg.append(g)
  }

  root.append(svg)

  if (graph.queue) {
    const row = document.createElement('div')
    row.className = 'flex items-center gap-2.5'
    row.setAttribute(
      'aria-label',
      `Queue: ${graph.queue.length > 0 ? graph.queue.join(', ') : 'empty'}`,
    )
    const label = document.createElement('span')
    label.className = 'text-[11px] text-neutral-500 font-medium uppercase tracking-wider'
    label.textContent = t.queue
    const chips = document.createElement('div')
    chips.className = 'flex gap-1'
    chips.setAttribute('aria-hidden', 'true')
    if (graph.queue.length > 0) {
      for (const nodeId of graph.queue) {
        const chip = document.createElement('span')
        chip.className =
          'text-xs font-mono bg-white/6 text-neutral-300 px-2.5 py-1 rounded-md border border-white/8'
        chip.textContent = String(nodeId)
        chips.append(chip)
      }
    } else {
      const empty = document.createElement('span')
      empty.className = 'text-xs text-neutral-600 italic'
      empty.textContent = t.empty
      chips.append(empty)
    }
    row.append(label, chips)
    root.append(row)
  }

  if (graph.stack) {
    const row = document.createElement('div')
    row.className = 'flex items-center gap-2.5'
    row.setAttribute(
      'aria-label',
      `Stack: ${graph.stack.length > 0 ? graph.stack.join(', ') : 'empty'}`,
    )
    const label = document.createElement('span')
    label.className = 'text-[11px] text-neutral-500 font-medium uppercase tracking-wider'
    label.textContent = t.stack
    const chips = document.createElement('div')
    chips.className = 'flex gap-1'
    chips.setAttribute('aria-hidden', 'true')
    if (graph.stack.length > 0) {
      for (const nodeId of graph.stack) {
        const chip = document.createElement('span')
        chip.className =
          'text-xs font-mono bg-white/6 text-neutral-300 px-2.5 py-1 rounded-md border border-white/8'
        chip.textContent = String(nodeId)
        chips.append(chip)
      }
    } else {
      const empty = document.createElement('span')
      empty.className = 'text-xs text-neutral-600 italic'
      empty.textContent = t.empty
      chips.append(empty)
    }
    row.append(label, chips)
    root.append(row)
  }

  if (distances) {
    const row = document.createElement('div')
    row.className = 'flex items-center gap-2.5 flex-wrap justify-center'
    row.setAttribute(
      'aria-label',
      `Distances: ${Object.entries(distances)
        .map(([id, d]) => `${id}:${d}`)
        .join(', ')}`,
    )
    const label = document.createElement('span')
    label.className = 'text-[11px] text-neutral-500 font-medium uppercase tracking-wider'
    label.textContent = t.distances
    const chips = document.createElement('div')
    chips.className = 'flex gap-1 flex-wrap'
    chips.setAttribute('aria-hidden', 'true')
    for (const [nodeId, dist] of Object.entries(distances)) {
      const chip = document.createElement('span')
      chip.className =
        'text-xs font-mono bg-white/6 text-neutral-300 px-2 py-1 rounded-md border border-white/8'
      const nodeLabel = nodes.find((n) => n.id === Number(nodeId))?.label ?? nodeId
      chip.textContent = `${nodeLabel}: ${dist === Infinity ? '∞' : dist}`
      chips.append(chip)
    }
    row.append(label, chips)
    root.append(row)
  }
}
