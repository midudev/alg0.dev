import type { Step } from '@lib/types'
import { highlightStyles } from '@lib/highlight-colors'

const VALUE_SYMBOLS: Record<string, string> = {
  Q: '♛',
  S: '▶',
  E: '◆',
  W: '■',
}

interface MatrixVisualizerProps {
  step: Step
}

export default function MatrixVisualizer({ step }: MatrixVisualizerProps) {
  const { matrix } = step
  if (!matrix) return null

  const { rows, cols, values, highlights = {} } = matrix

  // Adaptive cell sizing
  const maxDim = Math.max(rows, cols)
  const cellSize =
    maxDim <= 5
      ? 'w-14 h-14 text-2xl'
      : maxDim <= 6
        ? 'w-12 h-12 text-xl'
        : maxDim <= 8
          ? 'w-10 h-10 text-lg'
          : 'w-8 h-8 text-sm'
  const gapSize = maxDim <= 6 ? 'gap-1.5' : 'gap-1'
  const fontSize = maxDim <= 5 ? 'text-xs' : maxDim <= 8 ? 'text-[10px]' : 'text-[9px]'

  // Build text description for screen readers
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

  return (
    <div
      className="flex-1 flex items-center justify-center"
      role="img"
      aria-label={`${rows}×${cols} board.${specialCells.length > 0 ? ` ${specialCells.join('; ')}.` : ''}${highlightedCells.length > 0 ? ` Highlights: ${highlightedCells.join(', ')}.` : ''}`}
    >
      <div
        className={`grid ${gapSize}`}
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        aria-hidden="true"
      >
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => {
            const key = `${row},${col}`
            const highlight = highlights[key]
            const value = values[row]?.[col]
            const isDark = (row + col) % 2 === 1
            const styles = highlight ? highlightStyles[highlight] : null
            const symbol = typeof value === 'string' ? VALUE_SYMBOLS[value] : undefined

            return (
              <div
                key={key}
                className={`${cellSize} flex items-center justify-center rounded-lg transition-all duration-300 border`}
                style={{
                  backgroundColor:
                    styles?.bg || (isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.01)'),
                  borderColor:
                    styles?.border ||
                    (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)'),
                }}
              >
                {symbol ? (
                  <span
                    className="leading-none transition-all duration-300"
                    style={{
                      color: styles?.text || '#e2e8f0',
                      filter:
                        highlight === 'found'
                          ? 'drop-shadow(0 0 6px rgba(74,222,128,0.5))'
                          : 'none',
                    }}
                  >
                    {symbol}
                  </span>
                ) : value !== 0 && value !== '' && value != null ? (
                  <span
                    className={`font-mono font-semibold leading-none transition-all duration-300 ${fontSize}`}
                    style={{
                      color: styles?.text || '#e2e8f0',
                    }}
                  >
                    {value}
                  </span>
                ) : null}
              </div>
            )
          }),
        )}
      </div>
    </div>
  )
}
