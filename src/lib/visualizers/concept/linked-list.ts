/**
 * Concept visualizer: LinkedList.
 */
import type { LinkedListState } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

const LL_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' },
  current: { bg: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
  new: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  removing: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.4)', text: '#f87171' },
  found: { bg: 'rgba(250,204,21,0.15)', border: 'rgba(250,204,21,0.4)', text: '#facc15' },
}

export function renderLinkedList(state: LinkedListState): HTMLElement {
  const { nodes, operation } = state
  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Linked List'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  if (nodes.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'font-mono text-sm text-neutral-600'
    empty.textContent = 'null (empty list)'
    wrap.append(empty)
  } else {
    const row = document.createElement('div')
    row.className = 'flex items-center gap-0 overflow-x-auto max-w-full px-4'

    const headLabel = document.createElement('div')
    headLabel.className = 'flex flex-col items-center mr-1 shrink-0'
    const headText = document.createElement('span')
    headText.className = 'text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1'
    headText.textContent = 'head'
    const headSvg = svgEl('svg', { width: '16', height: '12', viewBox: '0 0 16 12' })
    headSvg.classList.add('text-neutral-400')
    headSvg.append(
      svgEl('path', {
        d: 'M0,6 L12,6 M8,2 L12,6 L8,10',
        stroke: 'currentColor',
        fill: 'none',
        strokeWidth: '1.5',
      }),
    )
    headLabel.append(headText, headSvg)
    row.append(headLabel)

    nodes.forEach((node, i) => {
      const colors = LL_COLORS[node.state] ?? LL_COLORS.normal
      const isLast = i === nodes.length - 1

      const group = document.createElement('div')
      group.className = 'flex items-center shrink-0'

      const box = document.createElement('div')
      box.className =
        'w-14 h-14 md:w-16 md:h-16 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-300 relative'
      applyStyles(box, {
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        boxShadow: node.state !== 'normal' ? `0 0 16px ${colors.border}` : 'none',
      })
      const val = document.createElement('span')
      val.className = 'text-base md:text-lg font-bold'
      val.textContent = String(node.value)
      box.append(val)

      const arrow = svgEl('svg', { width: '28', height: '12', viewBox: '0 0 28 12' })
      arrow.classList.add('shrink-0')
      applyStyles(arrow, { color: isLast ? 'var(--viz-muted)' : colors.text })
      arrow.append(
        svgEl('line', {
          x1: '2',
          y1: '6',
          x2: '22',
          y2: '6',
          stroke: 'currentColor',
          strokeWidth: '1.5',
        }),
        svgEl('polygon', { points: '20,2 26,6 20,10', fill: 'currentColor' }),
      )

      group.append(box, arrow)
      row.append(group)
    })

    const nullTerm = document.createElement('div')
    nullTerm.className = 'font-mono text-xs text-neutral-600 shrink-0'
    nullTerm.textContent = 'null'
    row.append(nullTerm)

    wrap.append(row)

    const tail = document.createElement('div')
    tail.className = 'flex items-center gap-2 -mt-2'
    const tailSpan = document.createElement('span')
    tailSpan.className = 'text-[9px] font-mono text-neutral-500 uppercase tracking-wider'
    tailSpan.textContent = `tail = ${nodes[nodes.length - 1].value}`
    tail.append(tailSpan)
    wrap.append(tail)
  }

  return wrap
}
