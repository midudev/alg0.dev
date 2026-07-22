/**
 * Concept visualizer: Run-Length Encoding.
 */
import type { RleState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const CHAR_COLORS: Record<
  NonNullable<RleState['charStates'][number]>,
  { bg: string; border: string; text: string }
> = {
  default: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
  inRun: { bg: 'rgba(163,230,53,0.12)', border: 'rgba(163,230,53,0.35)', text: '#a3e635' },
  current: { bg: 'rgba(251,146,60,0.18)', border: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  emitted: { bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.3)', text: '#4ade80' },
}

function textEl(tag: string, className: string, text: string): HTMLElement {
  const el = document.createElement(tag)
  el.className = className
  el.textContent = text
  return el
}

export function renderRle(state: RleState): HTMLElement {
  const { text, charStates, runStart, runEnd, tokens, encoded, summary, operation } = state
  const chars = [...text]

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  wrap.append(
    textEl(
      'div',
      'text-neutral-500 font-mono text-[11px] uppercase tracking-widest',
      'Run-Length Encoding',
    ),
  )

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  // Character strip
  const section = document.createElement('div')
  section.className = 'flex flex-col items-center gap-1'

  const cells = document.createElement('div')
  cells.className = 'flex flex-wrap justify-center gap-0.5 max-w-2xl'

  chars.forEach((ch, i) => {
    const st = charStates[i] ?? 'default'
    const colors = CHAR_COLORS[st]
    const inActiveRun =
      runStart != null && runEnd != null && i >= runStart && i <= runEnd && st !== 'emitted'
    const cell = document.createElement('div')
    cell.className =
      'w-8 h-10 rounded-md border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: st === 'current' || inActiveRun ? `0 0 10px ${colors.border}` : 'none',
      borderWidth: st === 'current' ? '2px' : '1px',
    })
    cell.textContent = ch
    cells.append(cell)
  })
  section.append(cells)

  const indexRow = document.createElement('div')
  indexRow.className = 'flex flex-wrap justify-center gap-0.5 max-w-2xl'
  chars.forEach((_, i) => {
    const idx = document.createElement('div')
    idx.className = 'w-8 text-center text-[9px] font-mono text-neutral-600'
    idx.textContent = String(i)
    indexRow.append(idx)
  })
  section.append(indexRow)

  if (runStart != null && runEnd != null && state.phase !== 'done') {
    const runInfo = document.createElement('div')
    runInfo.className = 'font-mono text-[11px] text-lime-400/90 mt-1'
    runInfo.textContent = `run [${runStart}..${runEnd}] · length ${runEnd - runStart + 1}`
    section.append(runInfo)
  }

  wrap.append(section)

  // Tokens
  if (tokens.length > 0) {
    const tokenSection = document.createElement('div')
    tokenSection.className = 'flex flex-col items-center gap-2 w-full max-w-md'

    tokenSection.append(
      textEl(
        'div',
        'text-[10px] font-mono text-neutral-500 uppercase tracking-wider',
        'Tokens · (char, count)',
      ),
    )

    const row = document.createElement('div')
    row.className = 'flex flex-wrap justify-center gap-1.5'

    for (const token of tokens) {
      const chip = document.createElement('div')
      chip.className =
        'font-mono text-xs px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all duration-300'
      applyStyles(chip, {
        backgroundColor: token.active ? 'rgba(163,230,53,0.12)' : 'rgba(255,255,255,0.03)',
        borderColor: token.active ? 'rgba(163,230,53,0.4)' : 'rgba(255,255,255,0.08)',
        color: token.active ? '#a3e635' : 'var(--viz-muted)',
        boxShadow: token.active ? '0 0 12px rgba(163,230,53,0.2)' : 'none',
      })
      chip.append(
        textEl('span', 'font-bold text-neutral-200', `'${token.char}'`),
        textEl('span', 'text-neutral-600', '×'),
        textEl('span', 'tabular-nums font-bold', String(token.count)),
      )
      row.append(chip)
    }
    tokenSection.append(row)

    if (encoded) {
      tokenSection.append(textEl('div', 'font-mono text-sm text-amber-300/90 mt-1', encoded))
    }

    wrap.append(tokenSection)
  }

  if (summary) {
    const summaryBox = document.createElement('div')
    summaryBox.className =
      'flex items-center gap-4 px-4 py-2.5 rounded-lg border border-white/10 bg-white/3 font-mono text-xs'
    summaryBox.append(
      textEl('span', 'text-neutral-500', `${summary.originalLen} chars`),
      textEl('span', 'text-neutral-600', '→'),
      textEl('span', 'text-lime-400 font-bold', `${summary.tokenCount} tokens`),
      textEl(
        'span',
        'text-green-400 font-bold',
        summary.savingPct >= 0 ? `${summary.savingPct}% smaller` : 'expanded',
      ),
    )
    wrap.append(summaryBox)
  }

  return wrap
}
