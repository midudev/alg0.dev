/**
 * Concept visualizer: PrefixSum.
 */
import type { PrefixSumState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const ARRAY_COLORS = {
  default: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-label)' },
  current: { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.38)', text: '#60a5fa' },
  inRange: { bg: 'rgba(74,222,128,0.16)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
}

const PREFIX_COLORS = {
  empty: { bg: 'var(--viz-cell)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
  ready: { bg: 'rgba(250,204,21,0.12)', border: 'rgba(250,204,21,0.32)', text: '#eab308' },
  active: { bg: 'rgba(251,146,60,0.14)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
}

function makeCell(
  value: string,
  colors: { bg: string; border: string; text: string },
  wide = false,
) {
  const cell = document.createElement('div')
  cell.className = `${wide ? 'w-16 md:w-18' : 'w-14 md:w-16'} h-12 rounded-lg border flex items-center justify-center font-mono text-sm md:text-base font-bold transition-all duration-300`
  applyStyles(cell, {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    color: colors.text,
    boxShadow: colors.border !== 'var(--viz-border)' ? `0 0 12px ${colors.border}` : 'none',
  })
  cell.textContent = value
  return cell
}

function makeIndexRow(length: number, wide = false) {
  const row = document.createElement('div')
  row.className = 'flex gap-1'
  for (let i = 0; i < length; i++) {
    const idx = document.createElement('div')
    idx.className = `${wide ? 'w-16 md:w-18' : 'w-14 md:w-16'} text-center text-[9px] font-mono text-neutral-600`
    idx.textContent = String(i)
    row.append(idx)
  }
  return row
}

export function renderPrefixSum(state: PrefixSumState): HTMLElement {
  const {
    array,
    prefix,
    phase,
    currentIndex,
    range,
    activePrefixIndices = [],
    query,
    operation,
  } = state

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Prefix Sum Array'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  const table = document.createElement('div')
  table.className = 'flex flex-col gap-3 items-center'

  const arraySection = document.createElement('div')
  arraySection.className = 'flex flex-col items-center gap-1'
  const arrayLabel = document.createElement('div')
  arrayLabel.className = 'text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500'
  arrayLabel.textContent = 'Original Array'
  arraySection.append(arrayLabel)

  const arrayCells = document.createElement('div')
  arrayCells.className = 'flex gap-1'
  array.forEach((value, index) => {
    const inRange = range && index >= range.start && index <= range.end
    const colors =
      index === currentIndex
        ? ARRAY_COLORS.current
        : inRange
          ? ARRAY_COLORS.inRange
          : ARRAY_COLORS.default
    arrayCells.append(makeCell(String(value), colors))
  })
  arraySection.append(arrayCells, makeIndexRow(array.length))
  table.append(arraySection)

  const prefixSection = document.createElement('div')
  prefixSection.className = 'flex flex-col items-center gap-1'
  const prefixLabel = document.createElement('div')
  prefixLabel.className = 'text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500'
  prefixLabel.textContent = 'Prefix Array'
  prefixSection.append(prefixLabel)

  const prefixCells = document.createElement('div')
  prefixCells.className = 'flex gap-1'
  prefix.forEach((value, index) => {
    const isActive = activePrefixIndices.includes(index)
    const colors =
      value == null ? PREFIX_COLORS.empty : isActive ? PREFIX_COLORS.active : PREFIX_COLORS.ready
    prefixCells.append(makeCell(value == null ? '·' : String(value), colors, true))
  })
  prefixSection.append(prefixCells, makeIndexRow(prefix.length, true))
  table.append(prefixSection)

  wrap.append(table)

  if (
    phase === 'build' &&
    currentIndex != null &&
    currentIndex > 0 &&
    prefix[currentIndex] != null
  ) {
    const formula = document.createElement('div')
    formula.className = 'font-mono text-xs text-neutral-400 text-center'
    formula.innerHTML = `prefix[${currentIndex}] = prefix[${currentIndex - 1}] + arr[${currentIndex}] = <span class="text-amber-300">${prefix[currentIndex - 1]}</span> + <span class="text-blue-300">${array[currentIndex]}</span> = <span class="text-orange-300 font-bold">${prefix[currentIndex]}</span>`
    wrap.append(formula)
  }

  if (query && range) {
    const line = document.createElement('div')
    line.className = 'font-mono text-xs md:text-sm text-neutral-300 text-center'
    if (query.usesBaseCase) {
      line.innerHTML = `sum(${query.left}, ${query.right}) = prefix[${query.right}] = <span class="text-orange-300 font-bold">${query.sum}</span>`
    } else {
      const leftPrefix = prefix[query.left - 1]
      const rightPrefix = prefix[query.right]
      line.innerHTML = `sum(${query.left}, ${query.right}) = prefix[${query.right}] - prefix[${query.left - 1}] = <span class="text-orange-300">${rightPrefix}</span> - <span class="text-amber-300">${leftPrefix}</span> = <span class="text-green-300 font-bold">${query.sum}</span>`
    }
    wrap.append(line)
  }

  return wrap
}
