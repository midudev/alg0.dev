/**
 * Concept visualizer: Trie (prefix tree).
 *
 * Nodes are laid out with a tidy pass: leaves take the next free column, and a
 * parent centres over its children. That keeps shared prefixes visually stacked,
 * which is the whole point of the structure.
 */
import type { TrieState, TrieNodeData } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

const TRIE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  normal: { fill: 'rgba(96,165,250,0.12)', stroke: 'rgba(96,165,250,0.3)', text: '#60a5fa' },
  current: { fill: 'rgba(251,146,60,0.18)', stroke: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  new: { fill: 'rgba(74,222,128,0.18)', stroke: 'rgba(74,222,128,0.5)', text: '#4ade80' },
  found: { fill: 'rgba(250,204,21,0.18)', stroke: 'rgba(250,204,21,0.5)', text: '#facc15' },
  path: { fill: 'rgba(192,132,252,0.15)', stroke: 'rgba(192,132,252,0.4)', text: '#c084fc' },
  subtree: { fill: 'rgba(45,212,191,0.15)', stroke: 'rgba(45,212,191,0.4)', text: '#2dd4bf' },
  missing: { fill: 'rgba(248,113,113,0.15)', stroke: 'rgba(248,113,113,0.45)', text: '#f87171' },
}

const ROOT_COLORS = { fill: 'var(--subtle)', stroke: 'var(--viz-border)', text: 'var(--viz-label)' }

interface Layout {
  x: number
  depth: number
}

/** Tidy layout: leaves consume columns left to right, parents centre over them. */
function layoutTrie(nodes: Record<number, TrieNodeData>): {
  positions: Record<number, Layout>
  columns: number
  depth: number
} {
  const positions: Record<number, Layout> = {}
  let nextColumn = 0
  let maxDepth = 0

  const walk = (id: number, depth: number): number => {
    const node = nodes[id]
    if (!node) return 0
    if (depth > maxDepth) maxDepth = depth

    const childIds = Object.keys(node.children)
      .sort()
      .map((char) => node.children[char])
      .filter((childId) => nodes[childId])

    if (childIds.length === 0) {
      const x = nextColumn++
      positions[id] = { x, depth }
      return x
    }

    const childXs = childIds.map((childId) => walk(childId, depth + 1))
    const x = (childXs[0] + childXs[childXs.length - 1]) / 2
    positions[id] = { x, depth }
    return x
  }

  walk(0, 0)
  return { positions, columns: Math.max(1, nextColumn), depth: maxDepth }
}

function chipRow(
  label: string,
  values: string[],
  colorClass: string,
  highlight?: (value: string) => boolean,
): HTMLElement {
  const row = document.createElement('div')
  row.className = 'flex items-center gap-1.5 flex-wrap justify-center'

  const tag = document.createElement('span')
  tag.className = 'text-[9px] font-mono text-neutral-500 uppercase tracking-wider'
  tag.textContent = label
  row.append(tag)

  for (const value of values) {
    const chip = document.createElement('span')
    const active = highlight?.(value) ?? false
    chip.className = `px-2 py-0.5 rounded font-mono text-[11px] border transition-all duration-300 ${
      active ? colorClass : 'border-white/[0.08] bg-white/[0.03] text-neutral-500'
    }`
    chip.textContent = value
    row.append(chip)
  }

  return row
}

export function renderTrie(state: TrieState): HTMLElement {
  const { nodes, words, probe, matched, suggestions, operation } = state

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Trie'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  // The probe word, one box per character, filled up to `matched`.
  if (probe) {
    const probeRow = document.createElement('div')
    probeRow.className = 'flex items-center gap-1'
    const matchedCount = matched ?? 0

    Array.from(probe).forEach((char, i) => {
      const cell = document.createElement('div')
      cell.className =
        'w-6 h-6 rounded border flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-300'
      const isMatched = i < matchedCount
      applyStyles(cell, {
        backgroundColor: isMatched ? 'rgba(192,132,252,0.18)' : 'var(--subtle)',
        borderColor: isMatched ? 'rgba(192,132,252,0.45)' : 'var(--viz-border)',
        color: isMatched ? '#c084fc' : 'var(--viz-muted)',
      })
      cell.textContent = char
      probeRow.append(cell)
    })

    wrap.append(probeRow)
  }

  const nodeIds = Object.keys(nodes).map(Number)
  const hasChildren = nodeIds.length > 1

  if (!hasChildren) {
    const empty = document.createElement('div')
    empty.className = 'font-mono text-sm text-neutral-600'
    empty.textContent = 'empty trie (root only)'
    wrap.append(empty)
  } else {
    const { positions, columns, depth } = layoutTrie(nodes)

    const COL_W = 64
    const ROW_H = 54
    const R = 17
    const PAD_X = 40
    const PAD_Y = 26

    // A trie with few leaves is naturally tall and narrow, which would leave the
    // drawing height-capped and tiny. Pad the viewBox out to the same landscape
    // ratio the binary-tree visualizer uses, then centre the tree inside it.
    const contentW = (columns - 1) * COL_W
    const H = depth * ROW_H + PAD_Y * 2
    const W = Math.max(contentW + PAD_X * 2, Math.round(H * 1.7))
    const offsetX = (W - contentW) / 2

    const px = (layout: Layout) => offsetX + layout.x * COL_W
    const py = (layout: Layout) => PAD_Y + layout.depth * ROW_H

    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}` })
    svg.classList.add('w-full', 'max-w-3xl')
    applyStyles(svg, { maxHeight: 'min(46vh, 400px)', height: 'auto' })

    // Edges first so nodes paint on top. The character rides the edge label.
    for (const id of nodeIds) {
      const node = nodes[id]
      const from = positions[id]
      if (!from) continue

      for (const char of Object.keys(node.children).sort()) {
        const childId = node.children[char]
        const to = positions[childId]
        const child = nodes[childId]
        if (!to || !child) continue

        const highlighted = child.state === 'path' || child.state === 'current'
        const line = svgEl('line', {
          x1: px(from),
          y1: py(from) + R,
          x2: px(to),
          y2: py(to) - R,
          stroke: highlighted ? 'rgba(192,132,252,0.5)' : 'var(--viz-border)',
          strokeWidth: highlighted ? '2' : '1.5',
        })
        line.classList.add('transition-all', 'duration-300')
        svg.append(line)
      }
    }

    for (const id of nodeIds) {
      const node = nodes[id]
      const pos = positions[id]
      if (!pos) continue

      const isRoot = id === 0
      const colors = isRoot ? ROOT_COLORS : (TRIE_COLORS[node.state] ?? TRIE_COLORS.normal)
      const isHighlighted = !isRoot && node.state !== 'normal'

      const g = svgEl('g')
      g.classList.add('transition-all', 'duration-300')

      if (isHighlighted) {
        g.append(
          svgEl('circle', {
            cx: px(pos),
            cy: py(pos),
            r: R + 5,
            fill: colors.stroke,
            opacity: '0.18',
          }),
        )
      }

      // Words ending here get a second ring — the isEnd flag made visible.
      if (node.isEnd) {
        g.append(
          svgEl('circle', {
            cx: px(pos),
            cy: py(pos),
            r: R + 3,
            fill: 'none',
            stroke: colors.stroke,
            strokeWidth: '1.5',
          }),
        )
      }

      g.append(
        svgEl('circle', {
          cx: px(pos),
          cy: py(pos),
          r: R,
          fill: colors.fill,
          stroke: colors.stroke,
          strokeWidth: '1.5',
        }),
      )

      const text = svgEl('text', {
        x: px(pos),
        y: py(pos) + 1,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fill: colors.text,
        fontSize: isRoot ? '10' : '14',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      })
      text.textContent = isRoot ? 'root' : node.char
      g.append(text)
      svg.append(g)
    }

    wrap.append(svg)
  }

  if (words.length > 0) {
    wrap.append(
      chipRow('words', words, 'border-amber-400/40 bg-amber-400/10 text-amber-300', (word) =>
        (suggestions ?? []).includes(word),
      ),
    )
  }

  if (suggestions && suggestions.length > 0) {
    const hint = document.createElement('div')
    hint.className = 'text-[10px] font-mono text-teal-400/80'
    hint.textContent = `${suggestions.length} match${suggestions.length === 1 ? '' : 'es'} → ${suggestions.join(', ')}`
    wrap.append(hint)
  }

  const legend = document.createElement('div')
  legend.className = 'text-[10px] font-mono text-neutral-600'
  legend.textContent = 'double ring = end of a stored word'
  wrap.append(legend)

  return wrap
}
