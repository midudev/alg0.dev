/**
 * Concept visualizer: LZW dictionary compression.
 */
import type { LzwState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const CHAR_COLORS: Record<
  NonNullable<LzwState['charStates'][number]>,
  { bg: string; border: string; text: string }
> = {
  default: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
  inPhrase: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)', text: '#60a5fa' },
  current: { bg: 'rgba(251,146,60,0.18)', border: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  done: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.25)', text: '#4ade80' },
}

function textEl(tag: string, className: string, text: string): HTMLElement {
  const el = document.createElement(tag)
  el.className = className
  el.textContent = text
  return el
}

export function renderLzw(state: LzwState): HTMLElement {
  const { text, position, current, candidate, charStates, dictionary, output, summary, operation } =
    state
  const chars = [...text]

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  wrap.append(
    textEl('div', 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest', 'LZW'),
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
    const cell = document.createElement('div')
    cell.className =
      'w-8 h-10 rounded-md border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: st === 'current' || st === 'inPhrase' ? `0 0 10px ${colors.border}` : 'none',
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
  wrap.append(section)

  // Phrase state
  const phraseRow = document.createElement('div')
  phraseRow.className =
    'flex flex-wrap items-center justify-center gap-4 font-mono text-xs px-3 py-2 rounded-lg border border-white/8 bg-white/[0.02]'

  const wBox = document.createElement('div')
  wBox.className = 'flex items-center gap-2'
  wBox.append(
    textEl('span', 'text-neutral-500 uppercase tracking-wider text-[10px]', 'w'),
    textEl('span', 'text-blue-300 font-bold text-sm', current ? `"${current}"` : '∅'),
  )
  phraseRow.append(wBox)

  if (candidate) {
    phraseRow.append(textEl('span', 'text-neutral-600', '→'))
    const cBox = document.createElement('div')
    cBox.className = 'flex items-center gap-2'
    cBox.append(
      textEl('span', 'text-neutral-500 uppercase tracking-wider text-[10px]', 'w+c'),
      textEl('span', 'text-amber-300 font-bold text-sm', `"${candidate}"`),
    )
    phraseRow.append(cBox)
  }

  phraseRow.append(textEl('span', 'text-neutral-600 tabular-nums', `i=${position}`))
  wrap.append(phraseRow)

  // Two columns: dictionary + output
  const panels = document.createElement('div')
  panels.className = 'flex flex-wrap justify-center gap-4 w-full max-w-2xl'

  // Dictionary
  const dictPanel = document.createElement('div')
  dictPanel.className = 'flex flex-col gap-1.5 min-w-[140px] max-w-[220px] flex-1'
  dictPanel.append(
    textEl(
      'div',
      'text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-center',
      `Dictionary · ${dictionary.length}`,
    ),
  )

  const dictList = document.createElement('div')
  dictList.className =
    'flex flex-col gap-0.5 max-h-40 overflow-y-auto rounded-lg border border-white/8 bg-white/[0.02] p-1.5'

  // Show last entries more prominently — full list scrolled
  for (const row of dictionary) {
    const item = document.createElement('div')
    item.className =
      'flex items-center justify-between gap-2 px-2 py-0.5 rounded font-mono text-[11px] transition-all duration-300'
    applyStyles(item, {
      backgroundColor: row.isNew
        ? 'rgba(74,222,128,0.12)'
        : row.active
          ? 'rgba(96,165,250,0.1)'
          : 'transparent',
      color: row.isNew ? '#4ade80' : row.active ? '#93c5fd' : 'var(--viz-muted)',
      boxShadow: row.isNew ? '0 0 8px rgba(74,222,128,0.15)' : 'none',
    })
    item.append(
      textEl('span', 'tabular-nums text-neutral-500', String(row.code)),
      textEl('span', 'font-bold truncate', row.entry),
    )
    dictList.append(item)
  }
  dictPanel.append(dictList)
  panels.append(dictPanel)

  // Output codes
  const outPanel = document.createElement('div')
  outPanel.className = 'flex flex-col gap-1.5 min-w-[140px] max-w-[220px] flex-1'
  outPanel.append(
    textEl(
      'div',
      'text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-center',
      `Output · ${output.length}`,
    ),
  )

  const outList = document.createElement('div')
  outList.className =
    'flex flex-wrap content-start gap-1 max-h-40 overflow-y-auto rounded-lg border border-white/8 bg-white/[0.02] p-1.5 min-h-[3rem]'

  if (output.length === 0) {
    outList.append(textEl('span', 'text-neutral-600 text-[11px] font-mono px-1', '—'))
  }

  for (const item of output) {
    const chip = document.createElement('div')
    chip.className =
      'font-mono text-[11px] px-1.5 py-0.5 rounded border tabular-nums transition-all duration-300'
    applyStyles(chip, {
      backgroundColor: item.active ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)',
      borderColor: item.active ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)',
      color: item.active ? '#c4b5fd' : 'var(--viz-muted)',
      boxShadow: item.active ? '0 0 10px rgba(167,139,250,0.2)' : 'none',
    })
    chip.title = item.entry
    chip.textContent = String(item.code)
    outList.append(chip)
  }
  outPanel.append(outList)
  panels.append(outPanel)

  wrap.append(panels)

  if (summary) {
    const summaryBox = document.createElement('div')
    summaryBox.className =
      'flex items-center gap-4 px-4 py-2.5 rounded-lg border border-white/10 bg-white/3 font-mono text-xs'
    summaryBox.append(
      textEl('span', 'text-neutral-500', `${summary.originalLen} chars`),
      textEl('span', 'text-neutral-600', '→'),
      textEl('span', 'text-violet-400 font-bold', `${summary.codeCount} codes`),
      textEl('span', 'text-green-400', `dict ${summary.dictSize}`),
    )
    wrap.append(summaryBox)
  }

  return wrap
}
