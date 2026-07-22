/**
 * Concept visualizer: DEFLATE pipeline (LZ77 → Huffman).
 */
import type { DeflateState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const CHAR_COLORS: Record<
  NonNullable<DeflateState['charStates'][number]>,
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

function renderStageBar(stages: DeflateState['stages']): HTMLElement {
  const bar = document.createElement('div')
  bar.className = 'flex flex-wrap items-center justify-center gap-1.5'

  stages.forEach((stage, index) => {
    if (index > 0) {
      bar.append(textEl('span', 'text-neutral-700 font-mono text-[10px]', '→'))
    }
    const chip = document.createElement('span')
    chip.className =
      'font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border transition-all duration-300'
    const styles =
      stage.state === 'active'
        ? {
            backgroundColor: 'rgba(163,230,53,0.12)',
            borderColor: 'rgba(163,230,53,0.45)',
            color: '#a3e635',
          }
        : stage.state === 'done'
          ? {
              backgroundColor: 'rgba(74,222,128,0.08)',
              borderColor: 'rgba(74,222,128,0.25)',
              color: '#4ade80',
            }
          : {
              backgroundColor: 'transparent',
              borderColor: 'rgba(255,255,255,0.08)',
              color: '#525252',
            }
    applyStyles(chip, styles)
    chip.textContent = stage.label
    bar.append(chip)
  })

  return bar
}

export function renderDeflate(state: DeflateState): HTMLElement {
  const {
    stages,
    text,
    charStates,
    match,
    tokens,
    symbols,
    freqTable,
    encodedBits,
    summary,
    operation,
    phase,
  } = state
  const chars = [...text]

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3.5 w-full'

  wrap.append(
    textEl(
      'div',
      'text-neutral-500 font-mono text-[11px] uppercase tracking-widest',
      'DEFLATE · gzip engine',
    ),
  )
  wrap.append(renderStageBar(stages))

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  // Character strip (useful in LZ77 phase)
  if (phase === 'intro' || phase === 'lz77') {
    const section = document.createElement('div')
    section.className = 'flex flex-col items-center gap-1'

    const cells = document.createElement('div')
    cells.className = 'flex flex-wrap justify-center gap-0.5 max-w-2xl'
    chars.forEach((ch, i) => {
      const st = charStates[i] ?? 'outside'
      const colors = CHAR_COLORS[st]
      const cell = document.createElement('div')
      cell.className =
        'w-7 h-9 rounded-md border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300'
      applyStyles(cell, {
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        boxShadow: st === 'current' || st === 'match' ? `0 0 10px ${colors.border}` : 'none',
      })
      cell.textContent = ch
      cells.append(cell)
    })
    section.append(cells)
    wrap.append(section)

    if (match && (match.length > 0 || match.next)) {
      const card = document.createElement('div')
      card.className =
        'font-mono text-sm px-3 py-1.5 rounded-lg border border-green-400/25 bg-green-400/8 text-green-400'
      card.textContent = `(${match.offset}, ${match.length}, '${match.next || '∅'}')`
      wrap.append(card)
    }
  }

  // Tokens
  if (tokens.length > 0 && (phase === 'lz77' || phase === 'symbols' || phase === 'intro')) {
    const tokenRow = document.createElement('div')
    tokenRow.className = 'flex flex-wrap justify-center gap-1 max-w-xl'
    for (const token of tokens) {
      const chip = document.createElement('div')
      chip.className = 'font-mono text-[10px] px-1.5 py-0.5 rounded border tabular-nums'
      applyStyles(chip, {
        backgroundColor: token.active ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.03)',
        borderColor: token.active ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)',
        color: token.active ? '#c4b5fd' : 'var(--viz-muted)',
      })
      chip.textContent = `(${token.offset},${token.length},'${token.next || '∅'}')`
      tokenRow.append(chip)
    }
    wrap.append(tokenRow)
  }

  // Symbols
  if (symbols.length > 0 && phase !== 'lz77' && phase !== 'intro') {
    const symSection = document.createElement('div')
    symSection.className = 'flex flex-col items-center gap-1.5 w-full max-w-lg'
    symSection.append(
      textEl(
        'div',
        'text-[10px] font-mono text-neutral-500 uppercase tracking-wider',
        'Symbol stream',
      ),
    )
    const row = document.createElement('div')
    row.className = 'flex flex-wrap justify-center gap-1'
    for (const sym of symbols) {
      const chip = document.createElement('div')
      chip.className = 'font-mono text-[11px] px-2 py-0.5 rounded-md border'
      const isMatch = sym.kind === 'match'
      applyStyles(chip, {
        backgroundColor: sym.active
          ? isMatch
            ? 'rgba(74,222,128,0.15)'
            : 'rgba(251,146,60,0.15)'
          : 'rgba(255,255,255,0.03)',
        borderColor: sym.active
          ? isMatch
            ? 'rgba(74,222,128,0.4)'
            : 'rgba(251,146,60,0.4)'
          : 'rgba(255,255,255,0.08)',
        color: sym.active ? (isMatch ? '#4ade80' : '#fb923c') : 'var(--viz-muted)',
      })
      chip.textContent = sym.label
      row.append(chip)
    }
    symSection.append(row)
    wrap.append(symSection)
  }

  // Freq / code table
  if (freqTable && freqTable.length > 0) {
    const tableWrap = document.createElement('div')
    tableWrap.className = 'w-full max-w-md overflow-x-auto'
    tableWrap.append(
      textEl(
        'div',
        'text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-center mb-1',
        'Huffman on symbols',
      ),
    )
    const table = document.createElement('table')
    table.className = 'w-full font-mono text-[11px] border-collapse'
    const head = document.createElement('tr')
    head.className = 'text-neutral-600 text-[10px]'
    for (const h of ['Symbol', 'Freq', 'Code']) {
      const th = document.createElement('th')
      th.className = 'px-2 py-0.5 text-left font-medium'
      th.textContent = h
      head.append(th)
    }
    table.append(head)
    for (const row of freqTable) {
      const tr = document.createElement('tr')
      tr.className = 'border-t border-white/6'
      applyStyles(tr, {
        backgroundColor: row.active ? 'rgba(163,230,53,0.08)' : 'transparent',
        color: row.active ? '#a3e635' : 'var(--viz-muted)',
      })
      for (const val of [row.symbol, String(row.freq), row.code ?? '—']) {
        const td = document.createElement('td')
        td.className = 'px-2 py-0.5'
        if (val === row.code && row.code) td.className += ' text-amber-300 tracking-wider'
        td.textContent = val
        tr.append(td)
      }
      table.append(tr)
    }
    tableWrap.append(table)
    wrap.append(tableWrap)
  }

  if (encodedBits) {
    const bits = document.createElement('div')
    bits.className = 'w-full max-w-md text-center'
    bits.append(
      textEl('div', 'text-[10px] font-mono text-neutral-500 uppercase tracking-wider', 'bitstream'),
      textEl(
        'div',
        'font-mono text-[11px] text-amber-300/90 break-all leading-relaxed mt-0.5',
        encodedBits.length > 120 ? `${encodedBits.slice(0, 120)}…` : encodedBits,
      ),
    )
    wrap.append(bits)
  }

  if (summary) {
    const box = document.createElement('div')
    box.className =
      'flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-white/10 bg-white/3 font-mono text-xs'
    box.append(
      textEl('span', 'text-neutral-500', `${summary.originalBits} ASCII`),
      textEl('span', 'text-neutral-600', '→'),
      textEl('span', 'text-violet-400', `${summary.fixedBits} fixed`),
      textEl('span', 'text-neutral-600', '→'),
      textEl('span', 'text-lime-400 font-bold', `${summary.deflateBits} DEFLATE`),
      textEl('span', 'text-green-400 font-bold', `${summary.savingPct}%`),
    )
    wrap.append(box)
  }

  return wrap
}
