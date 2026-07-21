/**
 * Matrix / board visualizer — plain DOM, no React.
 * Call `renderMatrixVisualizer(root, step)` whenever the step changes.
 */
import type { Step } from '@lib/types'
import { highlightStyles } from '@lib/highlight-colors'

const VALUE_SYMBOLS: Record<string, string> = {
  Q: '♛',
  S: '▶',
  E: '◆',
  W: '■',
}

function cellSizeClass(maxDim: number): string {
  if (maxDim <= 5) return 'w-12 h-12 md:w-16 md:h-16 text-xl md:text-2xl'
  if (maxDim <= 6) return 'w-10 h-10 md:w-14 md:h-14 text-lg md:text-xl'
  if (maxDim <= 8) return 'w-8 h-8 md:w-12 md:h-12 text-base md:text-lg'
  return 'w-7 h-7 md:w-9 md:h-9 text-xs md:text-sm'
}

function gapClass(maxDim: number): string {
  return maxDim <= 6 ? 'gap-1.5 md:gap-2' : 'gap-1 md:gap-1.5'
}

function valueFontClass(maxDim: number): string {
  if (maxDim <= 5) return 'text-[11px] md:text-sm'
  if (maxDim <= 8) return 'text-[10px] md:text-xs'
  return 'text-[9px] md:text-[10px]'
}

export function renderMatrixVisualizer(root: HTMLElement, step: Step): void {
  const { matrix } = step

  root.replaceChildren()
  root.className = 'flex-1 flex items-center justify-center min-h-0 w-full'

  if (!matrix) {
    root.removeAttribute('role')
    root.removeAttribute('aria-label')
    return
  }

  const { rows, cols, values, highlights = {} } = matrix
  const maxDim = Math.max(rows, cols)
  const cellSize = cellSizeClass(maxDim)
  const gapSize = gapClass(maxDim)
  const fontSize = valueFontClass(maxDim)

  const specialCells: string[] = []
  const highlightedCells: string[] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const val = values[r]?.[c]
      if (val === 'Q') specialCells.push(`Queen at row ${r + 1} column ${c + 1}`)
      const h = highlights[`${r},${c}`]
      if (h) highlightedCells.push(`(${r + 1},${c + 1}): ${h}`)
    }
  }

  root.setAttribute('role', 'img')
  root.setAttribute(
    'aria-label',
    `${rows}×${cols} board.${specialCells.length > 0 ? ` ${specialCells.join('; ')}.` : ''}${highlightedCells.length > 0 ? ` Highlights: ${highlightedCells.join(', ')}.` : ''}`,
  )

  const grid = document.createElement('div')
  grid.className = `grid ${gapSize}`
  grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`
  grid.setAttribute('aria-hidden', 'true')

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const key = `${row},${col}`
      const highlight = highlights[key]
      const value = values[row]?.[col]
      const isDark = (row + col) % 2 === 1
      const styles = highlight ? highlightStyles[highlight] : null
      const symbol = typeof value === 'string' ? VALUE_SYMBOLS[value] : undefined

      const cell = document.createElement('div')
      cell.className = `${cellSize} flex items-center justify-center rounded-lg transition-all duration-300 border`
      cell.style.backgroundColor =
        styles?.bg || (isDark ? 'var(--viz-cell)' : 'var(--viz-cell-alt)')
      cell.style.borderColor = styles?.border || (isDark ? 'var(--viz-border)' : 'var(--subtle)')

      if (symbol) {
        const span = document.createElement('span')
        span.className = 'leading-none transition-all duration-300'
        span.style.color = styles?.text || 'var(--viz-text)'
        span.style.filter =
          highlight === 'found' ? 'drop-shadow(0 0 6px rgba(74,222,128,0.5))' : 'none'
        span.textContent = symbol
        cell.append(span)
      } else if (value !== 0 && value !== '' && value != null) {
        const span = document.createElement('span')
        span.className = `font-mono font-semibold leading-none transition-all duration-300 ${fontSize}`
        span.style.color = styles?.text || 'var(--viz-text)'
        span.textContent = String(value)
        cell.append(span)
      }

      grid.append(cell)
    }
  }

  root.append(grid)
}
