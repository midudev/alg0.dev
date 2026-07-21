/**
 * Concept visualizer: MemoTable.
 */
import type { MemoTableState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const MEMO_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  empty: { bg: 'var(--subtle)', border: 'var(--viz-grid)', text: 'var(--viz-muted)' },
  computing: { bg: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
  cached: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' },
  hit: { bg: 'rgba(74,222,128,0.18)', border: 'rgba(74,222,128,0.5)', text: '#4ade80' },
}

export function renderMemoTable(state: MemoTableState): HTMLElement {
  const { entries, currentCall, operation } = state
  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Memoization'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  if (currentCall) {
    const call = document.createElement('div')
    call.className = 'font-mono text-sm text-neutral-300'
    call.textContent = currentCall
    wrap.append(call)
  }

  const table = document.createElement('div')
  table.className = 'flex flex-col items-center gap-1'

  const row = document.createElement('div')
  row.className = 'flex gap-1'

  entries.forEach((entry) => {
    const colors = MEMO_COLORS[entry.state] ?? MEMO_COLORS.empty
    const col = document.createElement('div')
    col.className = 'flex flex-col items-center gap-0.5'

    const keyLabel = document.createElement('div')
    keyLabel.className = 'text-[9px] font-mono text-neutral-500'
    keyLabel.textContent = `f(${entry.key})`

    const cell = document.createElement('div')
    cell.className =
      'w-12 h-12 md:w-14 md:h-14 rounded-lg border flex items-center justify-center font-mono text-sm md:text-base font-bold transition-all duration-300'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: entry.state !== 'empty' ? `0 0 10px ${colors.border}` : 'none',
    })
    cell.textContent = entry.value != null ? String(entry.value) : '—'

    const status = document.createElement('div')
    status.className = 'text-[8px] font-mono transition-colors duration-300'
    applyStyles(status, { color: colors.text })
    status.textContent =
      entry.state === 'hit'
        ? '↑ HIT'
        : entry.state === 'computing'
          ? '...'
          : entry.state === 'cached'
            ? '✓'
            : ''

    col.append(keyLabel, cell, status)
    row.append(col)
  })

  table.append(row)
  wrap.append(table)

  const legend = document.createElement('div')
  legend.className = 'flex gap-4 text-[10px] font-mono'
  const computing = document.createElement('span')
  computing.className = 'text-orange-400'
  computing.textContent = '● computing'
  const cached = document.createElement('span')
  cached.className = 'text-blue-400'
  cached.textContent = '● cached'
  const hit = document.createElement('span')
  hit.className = 'text-green-400'
  hit.textContent = '● cache hit'
  legend.append(computing, cached, hit)
  wrap.append(legend)

  return wrap
}
