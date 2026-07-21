/**
 * Concept visualizer: StackQueue.
 */
import type { StackQueueState } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

const ITEM_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' },
  entering: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  leaving: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.4)', text: '#f87171' },
}

export function renderStackQueue(state: StackQueueState): HTMLElement {
  const { structure, items, operation, removedValue } = state
  if (structure === 'stack') {
    return renderStack(items, operation, removedValue)
  }
  return renderQueue(items, operation, removedValue)
}

function renderStack(
  items: StackQueueState['items'],
  operation?: string,
  removedValue?: number | null,
): HTMLElement {
  const MAX_SLOTS = 5
  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Stack · LIFO'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 transition-all duration-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  if (removedValue != null) {
    const removed = document.createElement('div')
    removed.className = 'font-mono text-sm text-red-400/70 animate-pulse'
    removed.textContent = `↑ ${removedValue} removed`
    wrap.append(removed)
  }

  const container = document.createElement('div')
  container.className = 'relative w-40 md:w-56'

  if (items.length > 0) {
    const topInd = document.createElement('div')
    topInd.className =
      'absolute -left-12 md:-left-14 top-0 flex items-center h-12 md:h-14 text-[10px] font-mono text-neutral-400 uppercase tracking-wider'
    topInd.textContent = 'top →'
    container.append(topInd)
  }

  const slots = document.createElement('div')
  slots.className = 'flex flex-col gap-2'

  for (let visualIdx = 0; visualIdx < MAX_SLOTS; visualIdx++) {
    const logicalIdx = items.length - 1 - visualIdx
    const item = logicalIdx >= 0 ? items[logicalIdx] : null

    if (!item) {
      const empty = document.createElement('div')
      empty.className =
        'h-12 md:h-14 rounded-lg border border-dashed border-white/5 bg-white/1 transition-all duration-300'
      slots.append(empty)
      continue
    }

    const colors = ITEM_COLORS[item.state] ?? ITEM_COLORS.normal
    const cell = document.createElement('div')
    cell.className =
      'h-12 md:h-14 rounded-lg border flex items-center justify-center font-mono text-base md:text-lg font-semibold transition-all duration-400 ease-in-out relative overflow-hidden'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: item.state === 'entering' ? `0 0 16px ${colors.border}` : 'none',
    })
    cell.textContent = String(item.value)
    slots.append(cell)
  }

  container.append(slots)

  const base = document.createElement('div')
  base.className = 'mt-2 h-1 rounded-full bg-white/10'
  container.append(base)

  wrap.append(container)
  return wrap
}

function renderQueue(
  items: StackQueueState['items'],
  operation?: string,
  removedValue?: number | null,
): HTMLElement {
  const MAX_SLOTS = 5
  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Queue · FIFO'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 transition-all duration-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  if (removedValue != null) {
    const removed = document.createElement('div')
    removed.className = 'font-mono text-sm text-red-400/70 animate-pulse'
    removed.textContent = `← ${removedValue} removed`
    wrap.append(removed)
  }

  const container = document.createElement('div')
  container.className = 'relative'

  const labels = document.createElement('div')
  labels.className = 'flex justify-between mb-1 px-1'
  if (items.length > 0) {
    const front = document.createElement('span')
    front.className = 'text-[10px] font-mono text-neutral-400 uppercase tracking-wider'
    front.textContent = 'front'
    const back = document.createElement('span')
    back.className = 'text-[10px] font-mono text-neutral-400 uppercase tracking-wider'
    back.textContent = 'back'
    labels.append(front, back)
  }
  container.append(labels)

  const slots = document.createElement('div')
  slots.className = 'flex gap-2'

  for (let i = 0; i < MAX_SLOTS; i++) {
    const item = i < items.length ? items[i] : null

    if (!item) {
      const empty = document.createElement('div')
      empty.className =
        'w-16 h-16 md:w-20 md:h-20 rounded-lg border border-dashed border-white/5 bg-white/1 transition-all duration-300'
      slots.append(empty)
      continue
    }

    const colors = ITEM_COLORS[item.state] ?? ITEM_COLORS.normal
    const cell = document.createElement('div')
    cell.className =
      'w-16 h-16 md:w-20 md:h-20 rounded-lg border flex items-center justify-center font-mono text-lg md:text-xl font-semibold transition-all duration-400 ease-in-out relative overflow-hidden'
    applyStyles(cell, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow: item.state === 'entering' ? `0 0 16px ${colors.border}` : 'none',
    })
    cell.textContent = String(item.value)
    slots.append(cell)
  }

  container.append(slots)

  const arrowWrap = document.createElement('div')
  arrowWrap.className = 'flex items-center justify-center mt-2 text-neutral-500'

  const arrowSvg = svgEl('svg', { width: '120', height: '14', viewBox: '0 0 120 14' })
  arrowSvg.classList.add('opacity-30')
  const defs = svgEl('defs')
  const marker = svgEl('marker', {
    id: 'qArrow',
    markerWidth: '6',
    markerHeight: '6',
    refX: '5',
    refY: '3',
    orient: 'auto',
  })
  marker.append(svgEl('path', { d: 'M0,0 L6,3 L0,6', fill: 'currentColor' }))
  defs.append(marker)
  arrowSvg.append(
    defs,
    svgEl('line', {
      x1: '10',
      y1: '7',
      x2: '105',
      y2: '7',
      stroke: 'currentColor',
      strokeWidth: '1.5',
      markerEnd: 'url(#qArrow)',
    }),
  )
  arrowWrap.append(arrowSvg)
  container.append(arrowWrap)

  const dirLabel = document.createElement('div')
  dirLabel.className = 'text-center text-[10px] font-mono text-neutral-500 mt-0.5'
  dirLabel.textContent = 'processing direction'
  container.append(dirLabel)

  wrap.append(container)
  return wrap
}
