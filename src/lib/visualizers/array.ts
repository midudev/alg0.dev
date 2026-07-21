/**
 * Array (bar chart) visualizer — plain DOM, no React.
 * Call `renderArrayVisualizer(root, step)` whenever the step changes.
 */
import type { Step } from '@lib/types'
import { highlightColors, DEFAULT_BAR_COLOR } from '@lib/highlight-colors'

export function renderArrayVisualizer(root: HTMLElement, step: Step): void {
  const { array = [], highlights = {}, sorted = [] } = step

  root.replaceChildren()
  root.className = 'flex-1 flex flex-col items-center justify-center gap-5 w-full min-h-0'

  if (array.length === 0) {
    root.removeAttribute('role')
    root.removeAttribute('aria-label')
    return
  }

  const maxValue = Math.max(...array, 1)
  const barGap = array.length > 12 ? 2 : 4

  const activeHighlights = Object.entries(highlights)
    .filter(([, type]) => type)
    .map(([idx, type]) => `index ${idx}: ${type}`)
    .join(', ')

  root.setAttribute('role', 'img')
  root.setAttribute(
    'aria-label',
    `Array visualization: ${array.length} elements [${array.join(', ')}]${activeHighlights ? `. Active: ${activeHighlights}` : ''}`,
  )

  const bars = document.createElement('div')
  bars.className = 'flex items-end w-full max-w-5xl'
  bars.style.height = 'clamp(200px, 46vh, 420px)'
  bars.style.gap = `${barGap}px`
  bars.setAttribute('aria-hidden', 'true')

  for (let index = 0; index < array.length; index++) {
    const value = array[index]
    const highlight = highlights[index]
    const isSorted = sorted.includes(index)
    const color = highlight
      ? highlightColors[highlight]
      : isSorted
        ? highlightColors.sorted
        : DEFAULT_BAR_COLOR
    const heightPercent = Math.max((value / maxValue) * 100, 2)

    const col = document.createElement('div')
    col.className = 'flex-1 flex flex-col items-center justify-end h-full relative'

    const label = document.createElement('span')
    label.className = 'text-[11px] font-mono font-semibold mb-2 transition-all duration-300'
    label.style.color = color
    label.textContent = String(value)

    const bar = document.createElement('div')
    bar.className = 'w-full rounded-t-sm transition-all duration-300 ease-in-out relative'
    bar.style.height = `${heightPercent}%`
    bar.style.backgroundColor = color
    bar.style.opacity = !highlight && !isSorted ? '0.6' : '1'

    col.append(label, bar)
    bars.append(col)
  }

  const indices = document.createElement('div')
  indices.className = 'flex w-full max-w-5xl'
  indices.style.gap = `${barGap}px`
  indices.setAttribute('aria-hidden', 'true')

  for (let index = 0; index < array.length; index++) {
    const highlight = highlights[index]
    const isSorted = sorted.includes(index)
    const color = highlight
      ? highlightColors[highlight]
      : isSorted
        ? highlightColors.sorted
        : 'var(--viz-faint)'

    const cell = document.createElement('div')
    cell.className =
      'flex-1 text-center text-[10px] font-mono py-1 rounded-md transition-all duration-300'
    cell.style.backgroundColor = `${color}12`
    cell.style.color = color
    cell.style.borderBottom = highlight ? `2px solid ${color}40` : '2px solid transparent'
    cell.textContent = String(index)
    indices.append(cell)
  }

  root.append(bars, indices)
}
