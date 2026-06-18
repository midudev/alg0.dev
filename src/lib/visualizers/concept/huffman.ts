/**
 * Concept visualizer: Huffman coding.
 */
import type { HuffmanState } from '@lib/types'
import { applyStyles, svgEl } from '@lib/visualizers/concept/dom'

type HuffmanNode = HuffmanState['nodes'][number]
type NodeState = NonNullable<HuffmanState['nodeStates']>[number]

const HUFFMAN_COLORS: Record<NodeState, { fill: string; stroke: string; text: string }> = {
  normal: { fill: 'rgba(96,165,250,0.12)', stroke: 'rgba(96,165,250,0.35)', text: '#60a5fa' },
  merging: { fill: 'rgba(251,146,60,0.18)', stroke: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  new: { fill: 'rgba(74,222,128,0.18)', stroke: 'rgba(74,222,128,0.5)', text: '#4ade80' },
  path: { fill: 'rgba(250,204,21,0.15)', stroke: 'rgba(250,204,21,0.45)', text: '#facc15' },
  leafFound: {
    fill: 'rgba(250,204,21,0.24)',
    stroke: 'rgba(250,204,21,0.6)',
    text: '#fde047',
  },
}

function textElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text: string,
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag)
  element.className = className
  element.textContent = text
  return element
}

function appendCell(
  row: HTMLTableRowElement,
  className: string,
  content: string | Node,
): HTMLTableCellElement {
  const cell = document.createElement('td')
  cell.className = className
  cell.append(content)
  row.append(cell)
  return cell
}

function renderInputText(text: string, highlightChar: string | null | undefined): HTMLElement {
  const strip = document.createElement('div')
  strip.className = 'flex flex-wrap justify-center gap-1 max-w-2xl'

  for (const char of text) {
    const active = highlightChar != null && char === highlightChar
    const cell = textElement(
      'div',
      'w-7 h-9 rounded-md border flex items-center justify-center font-mono text-sm font-bold',
      char,
    )
    applyStyles(cell, {
      backgroundColor: active ? 'rgba(251,146,60,0.18)' : 'var(--subtle)',
      borderColor: active ? 'rgba(251,146,60,0.5)' : 'var(--viz-border)',
      color: active ? '#fb923c' : 'var(--viz-muted)',
      boxShadow: active ? '0 0 10px rgba(251,146,60,0.25)' : 'none',
    })
    strip.append(cell)
  }

  return strip
}

function renderTree(
  nodes: HuffmanState['nodes'],
  roots: number[],
  nodeStates: Record<number, NodeState>,
): SVGSVGElement {
  const positions: Record<number, { column: number; depth: number }> = {}
  let column = 0
  let maxDepth = 0

  const place = (id: number, depth: number): number => {
    const node = nodes[id]
    if (!node) return column
    maxDepth = Math.max(maxDepth, depth)

    const childColumns: number[] = []
    if (node.left != null) childColumns.push(place(node.left, depth + 1))
    if (node.right != null) childColumns.push(place(node.right, depth + 1))

    const currentColumn =
      childColumns.length > 0
        ? childColumns.reduce((sum, childColumn) => sum + childColumn, 0) / childColumns.length
        : column++
    positions[id] = { column: currentColumn, depth }
    return currentColumn
  }

  for (const root of roots) {
    place(root, 0)
    column += 0.7
  }

  const width = 620
  const horizontalPadding = 36
  const radius = 17
  const top = 26
  const levelHeight = 62
  const maxColumn = Math.max(0, ...Object.values(positions).map((position) => position.column))
  const height = top + maxDepth * levelHeight + radius + 22
  const xOf = (value: number) =>
    maxColumn === 0
      ? width / 2
      : horizontalPadding + (value / maxColumn) * (width - 2 * horizontalPadding)
  const yOf = (depth: number) => top + depth * levelHeight
  const stateOf = (id: number): NodeState => nodeStates[id] ?? 'normal'
  const isOnPath = (id: number) => {
    const state = stateOf(id)
    return state === 'path' || state === 'leafFound'
  }

  const svg = svgEl('svg', {
    viewBox: `0 0 ${width} ${height}`,
    role: 'img',
    ariaLabel: 'Huffman tree',
  })
  svg.classList.add('w-full', 'max-w-2xl')
  applyStyles(svg, { maxHeight: `${Math.max(height, 90)}px` })

  for (const [key, node] of Object.entries(nodes)) {
    const id = Number(key)
    const parentPosition = positions[id]
    if (!parentPosition) continue

    const children: [number | null, string][] = [
      [node.left, '0'],
      [node.right, '1'],
    ]
    for (const [childId, bit] of children) {
      if (childId == null) continue
      const childPosition = positions[childId]
      if (!childPosition) continue

      const x1 = xOf(parentPosition.column)
      const y1 = yOf(parentPosition.depth)
      const x2 = xOf(childPosition.column)
      const y2 = yOf(childPosition.depth)
      const highlighted = isOnPath(id) && isOnPath(childId)
      const group = svgEl('g')
      const line = svgEl('line', {
        x1,
        y1,
        x2,
        y2,
        stroke: highlighted ? 'rgba(250,204,21,0.6)' : 'var(--viz-border)',
        strokeWidth: highlighted ? 2 : 1.5,
      })

      const label = svgEl('text', {
        x: x1 + (x2 - x1) * 0.42,
        y: y1 + (y2 - y1) * 0.42 - 3,
        textAnchor: 'middle',
        fontSize: 11,
        fontFamily: 'monospace',
        fontWeight: 'bold',
        fill: highlighted ? '#facc15' : 'var(--viz-muted)',
      })
      label.textContent = bit
      group.append(line, label)
      svg.append(group)
    }
  }

  for (const [key, node] of Object.entries(nodes)) {
    const id = Number(key)
    const position = positions[id]
    if (!position) continue

    const x = xOf(position.column)
    const y = yOf(position.depth)
    const state = stateOf(id)
    const colors = HUFFMAN_COLORS[state]
    const isLeaf = node.left == null && node.right == null
    const group = svgEl('g')

    if (state !== 'normal') {
      group.append(
        svgEl('circle', {
          cx: x,
          cy: y,
          r: radius + 4,
          fill: colors.stroke,
          opacity: 0.18,
        }),
      )
    }

    group.append(
      svgEl('circle', {
        cx: x,
        cy: y,
        r: radius,
        fill: colors.fill,
        stroke: colors.stroke,
        strokeWidth: 1.5,
      }),
    )

    const frequency = svgEl('text', {
      x,
      y: y + 1,
      textAnchor: 'middle',
      dominantBaseline: 'central',
      fill: colors.text,
      fontSize: 13,
      fontFamily: 'monospace',
      fontWeight: 'bold',
    })
    frequency.textContent = String(node.freq)
    group.append(frequency)

    if (isLeaf && node.char != null) {
      const character = svgEl('text', {
        x,
        y: y + radius + 13,
        textAnchor: 'middle',
        fill: 'var(--viz-label)',
        fontSize: 12,
        fontFamily: 'monospace',
        fontWeight: 'bold',
      })
      character.textContent = `'${node.char}'`
      group.append(character)
    }

    svg.append(group)
  }

  return svg
}

function renderNodeTable(
  nodes: HuffmanState['nodes'],
  roots: number[],
  nodeStates: Record<number, NodeState>,
  codes: NonNullable<HuffmanState['codes']>,
): HTMLElement {
  const tableIds = Object.keys(nodes)
    .map(Number)
    .sort((a, b) => a - b)
  const codeByChar = Object.fromEntries(codes.map(({ char, code }) => [char, code]))
  const isFinalRoot = (id: number) =>
    roots.length === 1 && roots[0] === id && (nodes[id].left != null || nodes[id].right != null)

  const statusInfo = (id: number) => {
    const state = nodeStates[id] ?? 'normal'
    const node = nodes[id]
    const isLeaf = node.left == null && node.right == null
    if (state === 'merging') {
      return {
        label: 'merging',
        color: HUFFMAN_COLORS.merging.text,
        background: 'rgba(251,146,60,0.09)',
      }
    }
    if (state === 'new') {
      return { label: 'new', color: HUFFMAN_COLORS.new.text, background: 'rgba(74,222,128,0.09)' }
    }
    if (state === 'leafFound') {
      return {
        label: 'coded',
        color: HUFFMAN_COLORS.leafFound.text,
        background: 'rgba(250,204,21,0.12)',
      }
    }
    if (state === 'path') {
      return {
        label: 'on path',
        color: HUFFMAN_COLORS.path.text,
        background: 'rgba(250,204,21,0.06)',
      }
    }
    if (isFinalRoot(id)) return { label: 'root', color: '#a5b4fc', background: 'transparent' }
    if (isLeaf) return { label: 'leaf', color: '#60a5fa', background: 'transparent' }
    return { label: 'node', color: 'var(--viz-muted)', background: 'transparent' }
  }

  const wrapper = document.createElement('div')
  wrapper.className = 'flex flex-col items-center gap-1.5 w-full max-w-xl overflow-x-auto'
  wrapper.append(
    textElement(
      'div',
      'text-[10px] font-mono text-neutral-500 uppercase tracking-wider',
      'Node table · left = 0, right = 1',
    ),
  )

  const table = document.createElement('table')
  table.className = 'font-mono text-xs border-collapse'
  const head = document.createElement('thead')
  const headRow = document.createElement('tr')
  headRow.className = 'text-neutral-500 text-[10px] uppercase tracking-wider'
  const headers: [string, string][] = [
    ['#', 'text-right'],
    ['Status', 'text-left'],
    ['Char', 'text-center'],
    ['Freq', 'text-right'],
    ['Code', 'text-center'],
    ['Pointer', 'text-center'],
  ]
  for (const [label, alignment] of headers) {
    const header = document.createElement('th')
    header.className = `px-2.5 py-1 ${alignment} font-medium`
    header.textContent = label
    headRow.append(header)
  }
  head.append(headRow)
  table.append(head)

  const body = document.createElement('tbody')
  for (const id of tableIds) {
    const node: HuffmanNode = nodes[id]
    const status = statusInfo(id)
    const isLeaf = node.left == null && node.right == null
    const row = document.createElement('tr')
    row.className = 'border-t border-white/6'
    applyStyles(row, { backgroundColor: status.background })

    appendCell(row, 'px-2.5 py-1 text-right text-neutral-500', String(id))

    const statusContent = document.createElement('span')
    statusContent.className = 'inline-flex items-center gap-1.5'
    applyStyles(statusContent, { color: status.color })
    const dot = document.createElement('span')
    dot.className = 'w-1.5 h-1.5 rounded-full shrink-0'
    applyStyles(dot, { backgroundColor: status.color })
    statusContent.append(dot, status.label)
    appendCell(row, 'px-2.5 py-1', statusContent)

    appendCell(
      row,
      'px-2.5 py-1 text-center font-bold text-neutral-200',
      node.char != null ? `'${node.char}'` : '—',
    )
    appendCell(row, 'px-2.5 py-1 text-right text-neutral-300', String(node.freq))
    appendCell(
      row,
      'px-2.5 py-1 text-center tracking-wider text-amber-300',
      node.char != null ? (codeByChar[node.char] ?? '—') : '—',
    )

    const pointer = document.createElement('span')
    if (isLeaf) {
      pointer.className = 'text-neutral-600'
      pointer.textContent = '—'
    } else {
      pointer.className = 'inline-flex gap-2'
      const left = textElement('span', 'text-neutral-500', '0→')
      left.append(textElement('span', 'text-neutral-300', String(node.left)))
      const right = textElement('span', 'text-neutral-500', '1→')
      right.append(textElement('span', 'text-neutral-300', String(node.right)))
      pointer.append(left, right)
    }
    appendCell(row, 'px-2.5 py-1 text-center text-neutral-400 whitespace-nowrap', pointer)
    body.append(row)
  }
  table.append(body)
  wrapper.append(table)
  return wrapper
}

function renderSummary(summary: NonNullable<HuffmanState['summary']>): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.className = 'flex flex-col items-center gap-3 mt-1 w-full max-w-md'

  const comparison = document.createElement('div')
  comparison.className = 'flex items-stretch gap-3 w-full'
  const ascii = document.createElement('div')
  ascii.className =
    'flex-1 flex flex-col items-center px-3 py-2 rounded-lg border border-white/10 bg-white/3'
  ascii.append(
    textElement(
      'span',
      'text-[9px] font-mono text-neutral-500 uppercase tracking-wider',
      'ASCII · 8-bit',
    ),
    textElement(
      'span',
      'font-mono text-lg font-bold text-neutral-400',
      String(summary.originalBits),
    ),
    textElement('span', 'text-[9px] font-mono text-neutral-600', 'bits'),
  )

  const arrow = textElement('div', 'flex items-center text-neutral-600 font-mono text-sm', '→')
  const huffman = document.createElement('div')
  huffman.className =
    'flex-1 flex flex-col items-center px-3 py-2 rounded-lg border border-green-400/30 bg-green-400/8'
  huffman.append(
    textElement(
      'span',
      'text-[9px] font-mono text-green-500/80 uppercase tracking-wider',
      'Huffman',
    ),
    textElement(
      'span',
      'font-mono text-lg font-bold text-green-400',
      String(summary.compressedBits),
    ),
    textElement('span', 'text-[9px] font-mono text-green-600/70', 'bits'),
  )
  comparison.append(ascii, arrow, huffman)

  const ratio = document.createElement('div')
  ratio.className = 'w-full'
  const track = document.createElement('div')
  track.className = 'h-2.5 w-full rounded-full bg-white/5 overflow-hidden border border-white/8'
  const bar = document.createElement('div')
  bar.className = 'h-full rounded-full bg-green-400/60'
  applyStyles(bar, {
    width: `${Math.max(4, (summary.compressedBits / summary.originalBits) * 100)}%`,
  })
  track.append(bar)
  const ratioLabels = document.createElement('div')
  ratioLabels.className = 'flex justify-between mt-1 text-[10px] font-mono text-neutral-500'
  ratioLabels.append(
    textElement('span', '', `~${summary.avgBits.toFixed(2)} bits/char`),
    textElement('span', 'text-green-400 font-bold', `${summary.savingPct}% smaller`),
  )
  ratio.append(track, ratioLabels)

  const encoded = document.createElement('div')
  encoded.className = 'w-full text-center'
  encoded.append(
    textElement(
      'span',
      'text-[10px] font-mono text-neutral-500 uppercase tracking-wider',
      'encoded',
    ),
    textElement(
      'div',
      'font-mono text-[11px] text-amber-300/90 break-all leading-relaxed mt-0.5',
      summary.encoded,
    ),
  )

  wrapper.append(comparison, ratio, encoded)
  return wrapper
}

export function renderHuffman(state: HuffmanState): HTMLElement {
  const {
    nodes,
    queue,
    nodeStates = {},
    codes = [],
    text,
    highlightChar,
    summary,
    operation,
    phase,
  } = state
  const roots = queue.filter((id) => nodes[id] != null)

  const wrapper = document.createElement('div')
  wrapper.className =
    'flex-1 flex flex-col items-center justify-center gap-4 w-full py-2 scale-90 md:scale-100'
  wrapper.append(
    textElement(
      'div',
      'text-neutral-500 font-mono text-[11px] uppercase tracking-widest',
      'Huffman Coding',
    ),
  )

  if (operation) {
    wrapper.append(
      textElement(
        'div',
        'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300',
        operation,
      ),
    )
  }
  if (phase === 'frequency') wrapper.append(renderInputText(text, highlightChar))
  if (roots.length > 0) wrapper.append(renderTree(nodes, roots, nodeStates))
  if (Object.keys(nodes).length > 0) {
    wrapper.append(renderNodeTable(nodes, roots, nodeStates, codes))
  }
  if (summary) wrapper.append(renderSummary(summary))

  return wrapper
}
