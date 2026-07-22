/**
 * Concept visualizer: LZ77 sliding-window compression.
 */
import type { Lz77State } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const CHAR_COLORS: Record<
  NonNullable<Lz77State['charStates'][number]>,
  { bg: string; border: string; text: string }
> = {
  outside: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
  window: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)', text: '#60a5fa' },
  lookAhead: { bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.35)', text: '#a78bfa' },
  current: { bg: 'rgba(251,146,60,0.18)', border: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  match: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.45)', text: '#4ade80' },
  encoded: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', text: '#525252' },
}

function textEl(tag: string, className: string, text: string): HTMLElement {
  const el = document.createElement(tag)
  el.className = className
  el.textContent = text
  return el
}

export function renderLz77(state: Lz77State): HTMLElement {
  const { text, position, windowStart, windowSize, charStates, match, tokens, summary, operation } =
    state
  const chars = [...text]

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  wrap.append(
    textEl('div', 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest', 'LZ77'),
  )

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  // Legend
  const legend = document.createElement('div')
  legend.className = 'flex flex-wrap justify-center gap-3 text-[10px] font-mono'
  const legendItems: [string, string][] = [
    ['window', '#60a5fa'],
    ['look-ahead', '#a78bfa'],
    ['match', '#4ade80'],
    ['cursor', '#fb923c'],
  ]
  for (const [label, color] of legendItems) {
    const item = document.createElement('span')
    item.className = 'inline-flex items-center gap-1.5'
    const dot = document.createElement('span')
    dot.className = 'w-1.5 h-1.5 rounded-full'
    applyStyles(dot, { backgroundColor: color })
    item.append(dot, textEl('span', 'text-neutral-500', label))
    legend.append(item)
  }
  wrap.append(legend)

  // Character strip
  const section = document.createElement('div')
  section.className = 'flex flex-col items-center gap-1'

  const cells = document.createElement('div')
  cells.className = 'flex flex-wrap justify-center gap-0.5 max-w-2xl'

  chars.forEach((ch, i) => {
    const st = charStates[i] ?? 'outside'
    const colors = CHAR_COLORS[st]
    const cell = document.createElement('div')
    cell.className =
      'w-8 h-10 rounded-md border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: st === 'current' || st === 'match' ? `0 0 10px ${colors.border}` : 'none',
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

  const meta = document.createElement('div')
  meta.className = 'flex flex-wrap justify-center gap-3 mt-1 font-mono text-[10px] text-neutral-500'
  meta.append(
    textEl('span', '', `pos=${position}`),
    textEl(
      'span',
      'text-blue-400/80',
      `window [${windowStart}..${Math.max(windowStart, position - 1)}] · size ${windowSize}`,
    ),
  )
  section.append(meta)
  wrap.append(section)

  // Current match card
  if (match && (match.length > 0 || match.next)) {
    const card = document.createElement('div')
    card.className =
      'flex items-center gap-3 px-4 py-2 rounded-lg border border-green-400/25 bg-green-400/8 font-mono text-sm'
    card.append(
      textEl('span', 'text-[10px] text-neutral-500 uppercase tracking-wider', 'match'),
      textEl(
        'span',
        'text-green-400 font-bold',
        `(${match.offset}, ${match.length}, '${match.next || '∅'}')`,
      ),
    )
    wrap.append(card)
  }

  // Token stream
  if (tokens.length > 0) {
    const tokenSection = document.createElement('div')
    tokenSection.className = 'flex flex-col items-center gap-2 w-full max-w-lg'

    tokenSection.append(
      textEl(
        'div',
        'text-[10px] font-mono text-neutral-500 uppercase tracking-wider',
        'Output · (offset, length, next)',
      ),
    )

    const row = document.createElement('div')
    row.className = 'flex flex-wrap justify-center gap-1.5'

    for (const token of tokens) {
      const chip = document.createElement('div')
      chip.className =
        'font-mono text-[11px] px-2 py-1 rounded-md border transition-all duration-300 tabular-nums'
      applyStyles(chip, {
        backgroundColor: token.active ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.03)',
        borderColor: token.active ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)',
        color: token.active ? '#c4b5fd' : 'var(--viz-muted)',
        boxShadow: token.active ? '0 0 12px rgba(167,139,250,0.2)' : 'none',
      })
      chip.textContent = `(${token.offset},${token.length},'${token.next || '∅'}')`
      row.append(chip)
    }
    tokenSection.append(row)
    wrap.append(tokenSection)
  }

  if (summary) {
    const summaryBox = document.createElement('div')
    summaryBox.className =
      'flex items-center gap-4 px-4 py-2.5 rounded-lg border border-white/10 bg-white/3 font-mono text-xs'
    summaryBox.append(
      textEl('span', 'text-neutral-500', `${summary.originalLen} chars`),
      textEl('span', 'text-neutral-600', '→'),
      textEl('span', 'text-violet-400 font-bold', `${summary.tokenCount} triples`),
      textEl('span', 'text-green-400', `${summary.matches} matches`),
    )
    wrap.append(summaryBox)
  }

  return wrap
}
