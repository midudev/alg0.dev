/**
 * Concept visualizer: SlidingWindow.
 */
import type { SlidingWindowState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const SW_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  outside: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
  inWindow: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', text: '#60a5fa' },
  current: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  duplicate: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.4)', text: '#f87171' },
}

export function renderSlidingWindow(state: SlidingWindowState): HTMLElement {
  const { chars, windowStart, windowEnd, charStates, best, operation } = state

  const windowStr = windowEnd >= windowStart ? chars.slice(windowStart, windowEnd + 1).join('') : ''
  const bestStr = best ? chars.slice(best.start, best.end + 1).join('') : ''

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Sliding Window'
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

  const cells = document.createElement('div')
  cells.className = 'flex gap-0.5'
  chars.forEach((ch, i) => {
    const st = charStates[i] ?? 'outside'
    const colors = SW_COLORS[st] ?? SW_COLORS.outside
    const isWindowEdge = i === windowStart || i === windowEnd
    const cell = document.createElement('div')
    cell.className =
      'w-10 h-12 rounded-md border flex items-center justify-center font-mono text-lg font-bold transition-all duration-300'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: st !== 'outside' ? `0 0 10px ${colors.border}` : 'none',
      borderWidth: isWindowEdge && st !== 'outside' ? '2px' : '1px',
    })
    cell.textContent = ch
    cells.append(cell)
  })
  section.append(cells)

  const indexRow = document.createElement('div')
  indexRow.className = 'flex gap-0.5'
  chars.forEach((_, i) => {
    const idx = document.createElement('div')
    idx.className = 'w-10 text-center text-[9px] font-mono text-neutral-600'
    idx.textContent = String(i)
    indexRow.append(idx)
  })
  section.append(indexRow)

  if (windowEnd >= windowStart && windowEnd >= 0) {
    const windowInfo = document.createElement('div')
    windowInfo.className = 'flex items-center gap-2 mt-1'

    const range = document.createElement('span')
    range.className = 'text-[10px] font-mono text-blue-400'
    range.textContent = `window [${windowStart}..${windowEnd}]`

    const str = document.createElement('span')
    str.className = 'font-mono text-sm text-blue-300 font-bold'
    str.textContent = `"${windowStr}"`

    const len = document.createElement('span')
    len.className = 'text-[10px] font-mono text-neutral-500'
    len.textContent = `len=${windowStr.length}`

    windowInfo.append(range, str, len)
    section.append(windowInfo)
  }

  wrap.append(section)

  if (bestStr) {
    const bestLine = document.createElement('div')
    bestLine.className = 'font-mono text-xs text-neutral-400'
    bestLine.append(document.createTextNode('best = "'))
    const bestSpan = document.createElement('span')
    bestSpan.className = 'text-amber-300 font-bold'
    bestSpan.textContent = bestStr
    bestLine.append(bestSpan)
    bestLine.append(document.createTextNode(`" (length ${bestStr.length})`))
    wrap.append(bestLine)
  }

  return wrap
}
