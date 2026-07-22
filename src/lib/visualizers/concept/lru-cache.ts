/**
 * Concept visualizer: LRU Cache.
 *
 * Draws both halves of the structure at once — the hash map (where a key lives)
 * on top and the doubly linked list (when it was last used) below. Keys are
 * sorted in the map and recency-ordered in the list, so the two panels
 * disagreeing is exactly the point.
 */
import type { LruCacheState, LruEntry } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

const LRU_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' },
  new: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  hit: { bg: 'rgba(250,204,21,0.15)', border: 'rgba(250,204,21,0.45)', text: '#facc15' },
  moving: { bg: 'rgba(192,132,252,0.15)', border: 'rgba(192,132,252,0.45)', text: '#c084fc' },
  evicting: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.45)', text: '#f87171' },
  updated: { bg: 'rgba(45,212,191,0.15)', border: 'rgba(45,212,191,0.4)', text: '#2dd4bf' },
}

function colorsFor(entry: LruEntry) {
  return LRU_COLORS[entry.state] ?? LRU_COLORS.normal
}

/** The ⇄ link between two nodes — two arrowheads, because prev matters as much as next. */
function doubleArrow(active: boolean): SVGElement {
  const svg = svgEl('svg', { width: '30', height: '14', viewBox: '0 0 30 14' })
  svg.classList.add('shrink-0', 'transition-all', 'duration-300')
  applyStyles(svg, { color: active ? '#c084fc' : 'var(--viz-muted)' })
  svg.append(
    svgEl('line', {
      x1: '5',
      y1: '7',
      x2: '25',
      y2: '7',
      stroke: 'currentColor',
      strokeWidth: '1.5',
    }),
    svgEl('polygon', { points: '25,3 30,7 25,11', fill: 'currentColor' }),
    svgEl('polygon', { points: '5,3 0,7 5,11', fill: 'currentColor' }),
  )
  return svg
}

function sentinel(label: string, caption: string): HTMLElement {
  const box = document.createElement('div')
  box.className = 'flex flex-col items-center gap-1 shrink-0'

  const chip = document.createElement('div')
  chip.className =
    'px-2 py-3 rounded-lg border border-dashed border-white/[0.14] bg-white/[0.02] font-mono text-[10px] text-neutral-500 uppercase tracking-wider'
  chip.textContent = label
  box.append(chip)

  const cap = document.createElement('span')
  cap.className = 'text-[9px] font-mono text-neutral-600 text-center max-w-[72px] leading-tight'
  cap.textContent = caption
  box.append(cap)

  return box
}

export function renderLruCache(state: LruCacheState): HTMLElement {
  const { capacity, entries, lookupKey, miss, evictedKey, operation } = state

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'LRU Cache'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  const meta = document.createElement('div')
  meta.className = 'flex items-center gap-3 font-mono text-[10px]'

  const fill = document.createElement('span')
  const isFull = entries.length >= capacity
  fill.className = isFull ? 'text-amber-400/80' : 'text-neutral-500'
  fill.textContent = `size ${entries.length} / ${capacity}${isFull ? ' — full' : ''}`
  meta.append(fill)

  if (evictedKey) {
    const evicted = document.createElement('span')
    evicted.className = 'text-red-400/80'
    evicted.textContent = `evicted "${evictedKey}"`
    meta.append(evicted)
  }

  if (miss && lookupKey) {
    const missed = document.createElement('span')
    missed.className = 'text-red-400/80'
    missed.textContent = `miss on "${lookupKey}" → -1`
    missed.setAttribute('data-lru-miss', '')
    meta.append(missed)
  }

  wrap.append(meta)

  // ── Hash map panel: unordered, keyed access ──
  const mapPanel = document.createElement('div')
  mapPanel.className = 'flex flex-col items-center gap-1.5 w-full'

  const mapLabel = document.createElement('div')
  mapLabel.className = 'text-[9px] font-mono text-neutral-500 uppercase tracking-wider'
  mapLabel.textContent = 'hash map — key → node (O(1) access, no order)'
  mapPanel.append(mapLabel)

  const mapRow = document.createElement('div')
  mapRow.className = 'flex items-center gap-1.5 flex-wrap justify-center'

  if (entries.length === 0) {
    const empty = document.createElement('span')
    empty.className = 'font-mono text-[11px] text-neutral-700'
    empty.textContent = 'empty'
    mapRow.append(empty)
  } else {
    // Sorted by key: the map has no idea which entry was used last.
    const sorted = [...entries].sort((a, b) => a.key.localeCompare(b.key))
    for (const entry of sorted) {
      const colors = colorsFor(entry)
      const isLookup = lookupKey === entry.key

      const chip = document.createElement('div')
      chip.className =
        'px-2 py-1 rounded border font-mono text-[11px] transition-all duration-300 flex items-center gap-1'
      applyStyles(chip, {
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        boxShadow: isLookup ? `0 0 12px ${colors.border}` : 'none',
      })
      chip.append(document.createTextNode(`"${entry.key}"`))

      const arrow = document.createElement('span')
      arrow.className = 'text-white/40'
      arrow.textContent = '→'
      chip.append(arrow)

      const dot = document.createElement('span')
      dot.className = 'text-white/50'
      dot.textContent = 'node'
      chip.append(dot)

      mapRow.append(chip)
    }
  }

  mapPanel.append(mapRow)
  wrap.append(mapPanel)

  // ── Doubly linked list: ordered by recency ──
  const listPanel = document.createElement('div')
  listPanel.className = 'flex flex-col items-center gap-1.5 w-full mt-1'

  const listLabel = document.createElement('div')
  listLabel.className = 'text-[9px] font-mono text-neutral-500 uppercase tracking-wider'
  listLabel.textContent = 'doubly linked list — recency order'
  listPanel.append(listLabel)

  const listRow = document.createElement('div')
  listRow.className = 'flex items-center gap-1 overflow-x-auto max-w-full px-2 pb-1'

  listRow.append(sentinel('head', 'most recent'))
  listRow.append(doubleArrow(entries.length > 0 && entries[0].state !== 'normal'))

  if (entries.length === 0) {
    const empty = document.createElement('span')
    empty.className = 'font-mono text-[11px] text-neutral-700 shrink-0 px-2'
    empty.textContent = 'no nodes'
    listRow.append(empty)
  } else {
    entries.forEach((entry, i) => {
      const colors = colorsFor(entry)

      const cell = document.createElement('div')
      cell.className = 'flex flex-col items-center gap-1 shrink-0'

      const box = document.createElement('div')
      box.className =
        'w-16 h-14 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-300'
      applyStyles(box, {
        backgroundColor: colors.bg,
        borderColor: colors.border,
        color: colors.text,
        boxShadow: entry.state !== 'normal' ? `0 0 16px ${colors.border}` : 'none',
        opacity: entry.state === 'evicting' ? '0.55' : '1',
      })

      const key = document.createElement('span')
      key.className = 'text-sm font-bold'
      key.textContent = entry.key
      box.append(key)

      const value = document.createElement('span')
      value.className = 'text-[10px] text-white/50'
      value.textContent = String(entry.value)
      box.append(value)

      cell.append(box)

      // Only the extremes get a caption — labelling every node is noise.
      const caption = document.createElement('span')
      caption.className = 'text-[9px] font-mono text-neutral-600 h-3'
      if (i === 0) caption.textContent = 'MRU'
      else if (i === entries.length - 1) caption.textContent = 'LRU'
      cell.append(caption)

      listRow.append(cell)
      listRow.append(doubleArrow(entry.state === 'moving' || entry.state === 'evicting'))
    })
  }

  listRow.append(sentinel('tail', 'next to evict'))
  listPanel.append(listRow)
  wrap.append(listPanel)

  const legend = document.createElement('div')
  legend.className = 'text-[10px] font-mono text-neutral-600 text-center px-4'
  legend.textContent = 'map answers "where", list answers "when" — both O(1)'
  wrap.append(legend)

  return wrap
}
