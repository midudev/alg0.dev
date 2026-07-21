/**
 * Concept visualizer: HashTable.
 */
import type { HashTableState } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

const HT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' },
  new: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  found: { bg: 'rgba(250,204,21,0.15)', border: 'rgba(250,204,21,0.4)', text: '#facc15' },
  collision: { bg: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
}

export function renderHashTable(state: HashTableState): HTMLElement {
  const { buckets, size, hashingKey, hashResult, operation } = state
  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Hash Table'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  if (hashingKey != null) {
    const hashLine = document.createElement('div')
    hashLine.className = 'font-mono text-xs text-neutral-400'
    hashLine.append(document.createTextNode('hash('))
    const keySpan = document.createElement('span')
    keySpan.className = 'text-sky-300'
    keySpan.textContent = `"${hashingKey}"`
    hashLine.append(keySpan)
    hashLine.append(document.createTextNode(')'))
    if (hashResult != null) {
      hashLine.append(document.createTextNode(' = '))
      const resSpan = document.createElement('span')
      resSpan.className = 'text-amber-300'
      resSpan.textContent = String(hashResult)
      hashLine.append(resSpan)
    }
    wrap.append(hashLine)
  }

  const list = document.createElement('div')
  list.className = 'flex flex-col gap-1 w-full max-w-2xl'

  for (let idx = 0; idx < size; idx++) {
    const entries = buckets[idx] ?? []
    const isTarget = hashResult === idx

    const row = document.createElement('div')
    row.className = 'flex items-center gap-2 h-9'

    const indexBox = document.createElement('div')
    indexBox.className =
      'w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 border transition-all duration-300'
    applyStyles(indexBox, {
      backgroundColor: isTarget ? 'rgba(251,146,60,0.12)' : 'var(--subtle)',
      borderColor: isTarget ? 'rgba(251,146,60,0.4)' : 'var(--viz-border)',
      color: isTarget ? '#fb923c' : 'var(--viz-label)',
    })
    indexBox.textContent = String(idx)
    row.append(indexBox)

    const arrow = svgEl('svg', { width: '16', height: '8', viewBox: '0 0 16 8' })
    arrow.classList.add('shrink-0', 'text-neutral-600')
    arrow.append(
      svgEl('line', {
        x1: '0',
        y1: '4',
        x2: '12',
        y2: '4',
        stroke: 'currentColor',
        strokeWidth: '1',
      }),
      svgEl('polygon', { points: '10,1.5 15,4 10,6.5', fill: 'currentColor' }),
    )
    row.append(arrow)

    if (entries.length === 0) {
      const empty = document.createElement('span')
      empty.className = 'text-[11px] font-mono text-neutral-700'
      empty.textContent = 'empty'
      row.append(empty)
    } else {
      const chain = document.createElement('div')
      chain.className = 'flex items-center gap-1 overflow-x-auto'

      entries.forEach((entry, ei) => {
        const colors = HT_COLORS[entry.state] ?? HT_COLORS.normal
        const entryWrap = document.createElement('div')
        entryWrap.className = 'flex items-center shrink-0'

        const chip = document.createElement('div')
        chip.className =
          'px-2.5 py-1 rounded border font-mono text-[11px] transition-all duration-300'
        applyStyles(chip, {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          color: colors.text,
          boxShadow: entry.state !== 'normal' ? `0 0 12px ${colors.border}` : 'none',
        })
        chip.append(document.createTextNode(`${entry.key}:`))
        const valSpan = document.createElement('span')
        valSpan.className = 'text-white/60'
        valSpan.textContent = String(entry.value)
        chip.append(valSpan)
        entryWrap.append(chip)

        if (ei < entries.length - 1) {
          const link = svgEl('svg', { width: '14', height: '8', viewBox: '0 0 14 8' })
          link.classList.add('shrink-0', 'text-neutral-600', 'mx-0.5')
          link.append(
            svgEl('line', {
              x1: '0',
              y1: '4',
              x2: '10',
              y2: '4',
              stroke: 'currentColor',
              strokeWidth: '1',
            }),
            svgEl('polygon', { points: '8,1.5 13,4 8,6.5', fill: 'currentColor' }),
          )
          entryWrap.append(link)
        }

        chain.append(entryWrap)
      })

      row.append(chain)
    }

    list.append(row)
  }

  wrap.append(list)

  const formula = document.createElement('div')
  formula.className = 'text-[10px] font-mono text-neutral-600 mt-1'
  formula.textContent = `hash(key) = sum of char codes % ${size}`
  wrap.append(formula)

  return wrap
}
