/**
 * Concept visualizer: TwoPointers.
 */
import type { TwoPointersState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const TP_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-label)' },
  left: { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.4)', text: '#60a5fa' },
  right: { bg: 'rgba(192,132,252,0.15)', border: 'rgba(192,132,252,0.4)', text: '#c084fc' },
  found: { bg: 'rgba(74,222,128,0.18)', border: 'rgba(74,222,128,0.5)', text: '#4ade80' },
  checked: { bg: 'var(--viz-grid)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
}

export function renderTwoPointers(state: TwoPointersState): HTMLElement {
  const { array, left, right, highlights, sum, target, operation } = state
  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Two Pointers'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  const section = document.createElement('div')
  section.className = 'flex flex-col items-center gap-1'

  const pointerLabels = document.createElement('div')
  pointerLabels.className = 'flex gap-0'
  array.forEach((_, i) => {
    const cell = document.createElement('div')
    cell.className = 'w-14 md:w-16 flex justify-center'
    const isLeft = i === left
    const isRight = i === right
    if (isLeft) {
      const span = document.createElement('span')
      span.className = 'text-[10px] font-mono font-bold text-blue-400'
      span.textContent = 'L ↓'
      cell.append(span)
    } else if (isRight) {
      const span = document.createElement('span')
      span.className = 'text-[10px] font-mono font-bold text-purple-400'
      span.textContent = 'R ↓'
      cell.append(span)
    }
    pointerLabels.append(cell)
  })
  section.append(pointerLabels)

  const cells = document.createElement('div')
  cells.className = 'flex gap-1.5'
  array.forEach((val, i) => {
    const hl = highlights[i] ?? 'default'
    const colors = TP_COLORS[hl] ?? TP_COLORS.default
    const cell = document.createElement('div')
    cell.className =
      'w-14 h-14 md:w-16 md:h-16 rounded-lg border flex items-center justify-center font-mono text-base md:text-lg font-bold transition-all duration-300'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: hl !== 'default' && hl !== 'checked' ? `0 0 12px ${colors.border}` : 'none',
    })
    cell.textContent = String(val)
    cells.append(cell)
  })
  section.append(cells)

  const indexRow = document.createElement('div')
  indexRow.className = 'flex gap-1'
  array.forEach((_, i) => {
    const idx = document.createElement('div')
    idx.className = 'w-13 text-center text-[9px] font-mono text-neutral-600'
    idx.textContent = String(i)
    indexRow.append(idx)
  })
  section.append(indexRow)

  wrap.append(section)

  if (sum != null && target != null) {
    const sumLine = document.createElement('div')
    sumLine.className = 'font-mono text-sm text-neutral-400'

    sumLine.append(document.createTextNode(`arr[${left}] + arr[${right}] = `))

    const leftVal = document.createElement('span')
    leftVal.className = 'text-white'
    leftVal.textContent = String(array[left])
    sumLine.append(leftVal)

    sumLine.append(document.createTextNode(' + '))

    const rightVal = document.createElement('span')
    rightVal.className = 'text-white'
    rightVal.textContent = String(array[right])
    sumLine.append(rightVal)

    sumLine.append(document.createTextNode(' = '))

    const sumSpan = document.createElement('span')
    sumSpan.className = sum === target ? 'text-green-400 font-bold' : 'text-amber-300'
    sumSpan.textContent = String(sum)
    sumLine.append(sumSpan)

    if (sum === target) {
      sumLine.append(document.createTextNode(' ✓'))
    } else if (sum < target) {
      sumLine.append(document.createTextNode(` < ${target} → move L →`))
    } else {
      sumLine.append(document.createTextNode(` > ${target} → ← move R`))
    }

    wrap.append(sumLine)
  }

  return wrap
}
