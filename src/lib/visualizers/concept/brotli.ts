/**
 * Concept visualizer: pedagogical Brotli (static dict + LZ + entropy).
 */
import type { BrotliState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const CHAR_COLORS: Record<
  NonNullable<BrotliState['charStates'][number]>,
  { bg: string; border: string; text: string }
> = {
  default: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
  current: { bg: 'rgba(251,146,60,0.18)', border: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  dict: { bg: 'rgba(56,189,248,0.15)', border: 'rgba(56,189,248,0.45)', text: '#38bdf8' },
  match: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.45)', text: '#4ade80' },
  literal: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.35)', text: '#fb923c' },
  done: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', text: '#525252' },
}

const CMD_COLORS: Record<
  BrotliState['commands'][number]['kind'],
  { bg: string; border: string; text: string }
> = {
  dict: { bg: 'rgba(56,189,248,0.12)', border: 'rgba(56,189,248,0.35)', text: '#38bdf8' },
  match: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', text: '#4ade80' },
  literal: { bg: 'rgba(251,146,60,0.1)', border: 'rgba(251,146,60,0.3)', text: '#fb923c' },
}

function textEl(tag: string, className: string, text: string): HTMLElement {
  const el = document.createElement(tag)
  el.className = className
  el.textContent = text
  return el
}

function renderStageBar(stages: BrotliState['stages']): HTMLElement {
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

export function renderBrotli(state: BrotliState): HTMLElement {
  const { stages, text, charStates, dictionary, commands, codes, encodedBits, summary, operation } =
    state
  const chars = [...text]

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3.5 w-full'

  wrap.append(
    textEl(
      'div',
      'text-neutral-500 font-mono text-[11px] uppercase tracking-widest',
      'Brotli · Content-Encoding: br',
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

  // Legend
  const legend = document.createElement('div')
  legend.className = 'flex flex-wrap justify-center gap-3 text-[10px] font-mono'
  for (const [label, color] of [
    ['dict', '#38bdf8'],
    ['match', '#4ade80'],
    ['literal', '#fb923c'],
  ] as const) {
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
  cells.className = 'flex flex-wrap justify-center gap-0.5 max-w-3xl'
  chars.forEach((ch, i) => {
    const st = charStates[i] ?? 'default'
    const colors = CHAR_COLORS[st]
    const cell = document.createElement('div')
    cell.className =
      'min-w-[1.1rem] h-8 px-0.5 rounded border flex items-center justify-center font-mono text-[11px] font-bold transition-all duration-300'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow:
        st === 'dict' || st === 'match' || st === 'literal' || st === 'current'
          ? `0 0 8px ${colors.border}`
          : 'none',
    })
    cell.textContent = ch
    cells.append(cell)
  })
  section.append(cells)
  wrap.append(section)

  // Two panels: dictionary + commands
  const panels = document.createElement('div')
  panels.className = 'flex flex-wrap justify-center gap-4 w-full max-w-2xl'

  const dictPanel = document.createElement('div')
  dictPanel.className = 'flex flex-col gap-1.5 min-w-[150px] max-w-[240px] flex-1'
  dictPanel.append(
    textEl(
      'div',
      'text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-center',
      'Static dictionary',
    ),
  )
  const dictList = document.createElement('div')
  dictList.className =
    'flex flex-col gap-0.5 rounded-lg border border-white/8 bg-white/[0.02] p-1.5'
  for (const row of dictionary) {
    const item = document.createElement('div')
    item.className =
      'font-mono text-[11px] px-2 py-0.5 rounded truncate transition-all duration-300'
    applyStyles(item, {
      backgroundColor: row.active
        ? 'rgba(56,189,248,0.15)'
        : row.used
          ? 'rgba(56,189,248,0.06)'
          : 'transparent',
      color: row.active ? '#38bdf8' : row.used ? '#7dd3fc' : 'var(--viz-muted)',
      boxShadow: row.active ? '0 0 10px rgba(56,189,248,0.2)' : 'none',
    })
    item.textContent = `"${row.entry}"`
    dictList.append(item)
  }
  dictPanel.append(dictList)
  panels.append(dictPanel)

  const cmdPanel = document.createElement('div')
  cmdPanel.className = 'flex flex-col gap-1.5 min-w-[150px] max-w-[280px] flex-1'
  cmdPanel.append(
    textEl(
      'div',
      'text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-center',
      `Commands · ${commands.length}`,
    ),
  )
  const cmdList = document.createElement('div')
  cmdList.className =
    'flex flex-wrap content-start gap-1 rounded-lg border border-white/8 bg-white/[0.02] p-1.5 min-h-[3rem] max-h-36 overflow-y-auto'
  if (commands.length === 0) {
    cmdList.append(textEl('span', 'text-neutral-600 text-[11px] font-mono px-1', '—'))
  }
  for (const cmd of commands) {
    const colors = CMD_COLORS[cmd.kind]
    const chip = document.createElement('div')
    chip.className = 'font-mono text-[10px] px-1.5 py-0.5 rounded border max-w-full truncate'
    applyStyles(chip, {
      backgroundColor: cmd.active ? colors.bg : 'rgba(255,255,255,0.03)',
      borderColor: cmd.active ? colors.border : 'rgba(255,255,255,0.08)',
      color: cmd.active ? colors.text : 'var(--viz-muted)',
      boxShadow: cmd.active ? `0 0 8px ${colors.border}` : 'none',
    })
    chip.title = cmd.label
    chip.textContent = cmd.label
    cmdList.append(chip)
  }
  cmdPanel.append(cmdList)
  panels.append(cmdPanel)
  wrap.append(panels)

  // Codes table
  if (codes && codes.length > 0) {
    const tableWrap = document.createElement('div')
    tableWrap.className = 'w-full max-w-md overflow-x-auto'
    tableWrap.append(
      textEl(
        'div',
        'text-[10px] font-mono text-neutral-500 uppercase tracking-wider text-center mb-1',
        'Entropy codes',
      ),
    )
    const table = document.createElement('table')
    table.className = 'w-full font-mono text-[11px] border-collapse'
    const head = document.createElement('tr')
    head.className = 'text-neutral-600 text-[10px]'
    for (const h of ['Command', 'Freq', 'Code']) {
      const th = document.createElement('th')
      th.className = 'px-2 py-0.5 text-left font-medium'
      th.textContent = h
      head.append(th)
    }
    table.append(head)
    for (const row of codes) {
      const tr = document.createElement('tr')
      tr.className = 'border-t border-white/6'
      applyStyles(tr, {
        backgroundColor: row.active ? 'rgba(163,230,53,0.08)' : 'transparent',
        color: row.active ? '#a3e635' : 'var(--viz-muted)',
      })
      for (const [val, cls] of [
        [row.symbol, ''],
        [String(row.freq), ''],
        [row.code, ' text-amber-300 tracking-wider'],
      ] as const) {
        const td = document.createElement('td')
        td.className = `px-2 py-0.5${cls}`
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
      textEl('span', 'text-lime-400 font-bold', `${summary.brotliBits} Brotli`),
      textEl('span', 'text-sky-400', `D×${summary.dictHits}`),
      textEl('span', 'text-green-400', `M×${summary.lzHits}`),
      textEl('span', 'text-orange-400', `L×${summary.literals}`),
      textEl('span', 'text-green-400 font-bold', `${summary.savingPct}%`),
    )
    wrap.append(box)
  }

  return wrap
}
