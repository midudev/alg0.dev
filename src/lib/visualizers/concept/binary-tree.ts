/**
 * Concept visualizer: BinaryTree.
 */
import type { BinaryTreeState } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

const TREE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  normal: { fill: 'rgba(96,165,250,0.12)', stroke: 'rgba(96,165,250,0.3)', text: '#60a5fa' },
  current: { fill: 'rgba(251,146,60,0.18)', stroke: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  new: { fill: 'rgba(74,222,128,0.18)', stroke: 'rgba(74,222,128,0.5)', text: '#4ade80' },
  found: { fill: 'rgba(250,204,21,0.18)', stroke: 'rgba(250,204,21,0.5)', text: '#facc15' },
  comparing: { fill: 'rgba(192,132,252,0.15)', stroke: 'rgba(192,132,252,0.4)', text: '#c084fc' },
  placed: { fill: 'rgba(52,211,153,0.12)', stroke: 'rgba(52,211,153,0.3)', text: '#34d399' },
}

export function renderBinaryTree(state: BinaryTreeState): HTMLElement {
  const { nodes, operation, treeType, heapType } = state

  const W = 480
  const H = 280
  const R = 18
  const TOP_Y = 36

  const maxDepth = nodes.length > 0 ? Math.floor(Math.log2(nodes.length)) + 1 : 0
  const levelH = maxDepth > 1 ? (H - TOP_Y - 20) / (maxDepth - 1) : 0

  const getPos = (idx: number): { x: number; y: number } | null => {
    if (idx >= nodes.length || !nodes[idx]) return null
    const level = Math.floor(Math.log2(idx + 1))
    const posInLevel = idx - (Math.pow(2, level) - 1)
    const totalInLevel = Math.pow(2, level)
    const x = ((posInLevel + 0.5) / totalInLevel) * W
    const y = TOP_Y + level * levelH
    return { x, y }
  }

  const label =
    treeType === 'heap' ? `${heapType === 'min' ? 'Min' : 'Max'} Heap` : 'Binary Search Tree'

  const nonNullNodes = nodes.reduce((acc, n) => acc + (n ? 1 : 0), 0)

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = label
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  if (nonNullNodes === 0) {
    const empty = document.createElement('div')
    empty.className = 'font-mono text-sm text-neutral-600'
    empty.textContent = 'empty tree'
    wrap.append(empty)
  } else {
    const svg = svgEl('svg', { viewBox: `0 0 ${W} ${H}` })
    svg.classList.add('w-full', 'max-w-3xl')
    applyStyles(svg, { maxHeight: 'min(52vh, 460px)', height: 'auto' })

    nodes.forEach((node, idx) => {
      if (!node) return
      const parentPos = getPos(idx)
      if (!parentPos) return

      const children = [2 * idx + 1, 2 * idx + 2]
      for (const childIdx of children) {
        if (childIdx >= nodes.length || !nodes[childIdx]) continue
        const childPos = getPos(childIdx)
        if (!childPos) continue
        const line = svgEl('line', {
          x1: parentPos.x,
          y1: parentPos.y,
          x2: childPos.x,
          y2: childPos.y,
          stroke: 'var(--viz-border)',
          strokeWidth: '1.5',
        })
        line.classList.add('transition-all', 'duration-300')
        svg.append(line)
      }
    })

    nodes.forEach((node, idx) => {
      if (!node) return
      const pos = getPos(idx)
      if (!pos) return
      const colors = TREE_COLORS[node.state] ?? TREE_COLORS.normal
      const isHighlighted = node.state !== 'normal'

      const g = svgEl('g')
      g.classList.add('transition-all', 'duration-300')

      if (isHighlighted) {
        g.append(
          svgEl('circle', {
            cx: pos.x,
            cy: pos.y,
            r: R + 4,
            fill: colors.stroke,
            opacity: '0.15',
          }),
        )
      }

      g.append(
        svgEl('circle', {
          cx: pos.x,
          cy: pos.y,
          r: R,
          fill: colors.fill,
          stroke: colors.stroke,
          strokeWidth: '1.5',
        }),
      )

      const text = svgEl('text', {
        x: pos.x,
        y: pos.y + 1,
        textAnchor: 'middle',
        dominantBaseline: 'central',
        fill: colors.text,
        fontSize: '13',
        fontFamily: 'monospace',
        fontWeight: 'bold',
      })
      text.textContent = String(node.value)
      g.append(text)
      svg.append(g)
    })

    wrap.append(svg)
  }

  if (treeType === 'heap' && nonNullNodes > 0) {
    const arrayView = document.createElement('div')
    arrayView.className = 'flex flex-col items-center gap-1 mt-1'

    const arrayLabel = document.createElement('div')
    arrayLabel.className = 'text-[10px] font-mono text-neutral-500 uppercase tracking-wider'
    arrayLabel.textContent = 'array view'
    arrayView.append(arrayLabel)

    const arrayRow = document.createElement('div')
    arrayRow.className = 'flex gap-1'

    nodes.forEach((node, idx) => {
      if (!node) return
      const colors = TREE_COLORS[node.state] ?? TREE_COLORS.normal
      const cell = document.createElement('div')
      cell.className = 'flex flex-col items-center gap-0.5'

      const box = document.createElement('div')
      box.className =
        'w-9 h-9 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300'
      applyStyles(box, {
        backgroundColor: colors.fill,
        borderColor: colors.stroke,
        color: colors.text,
      })
      box.textContent = String(node.value)

      const idxLabel = document.createElement('span')
      idxLabel.className = 'text-[9px] font-mono text-neutral-600'
      idxLabel.textContent = String(idx)

      cell.append(box, idxLabel)
      arrayRow.append(cell)
    })

    arrayView.append(arrayRow)
    wrap.append(arrayView)
  }

  return wrap
}
