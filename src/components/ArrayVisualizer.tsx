import type { Step } from '@lib/types'
import { highlightColors, DEFAULT_BAR_COLOR } from '@lib/highlight-colors'

interface ArrayVisualizerProps {
  step: Step
}

export default function ArrayVisualizer({ step }: ArrayVisualizerProps) {
  const { array = [], highlights = {}, sorted = [] } = step

  if (array.length === 0) return null

  const maxValue = Math.max(...array, 1)
  const barGap = array.length > 12 ? 2 : 4

  const activeHighlights = Object.entries(highlights)
    .filter(([, type]) => type)
    .map(([idx, type]) => `index ${idx}: ${type}`)
    .join(', ')

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-6 w-full"
      role="img"
      aria-label={`Array visualization: ${array.length} elements [${array.join(', ')}]${activeHighlights ? `. Active: ${activeHighlights}` : ''}`}
    >
      {/* Bar chart */}
      <div
        className="flex items-end w-full max-w-3xl"
        style={{ height: '300px', gap: `${barGap}px` }}
        aria-hidden="true"
      >
        {array.map((value, index) => {
          const highlight = highlights[index]
          const isSorted = sorted.includes(index)
          const color = highlight
            ? highlightColors[highlight]
            : isSorted
              ? highlightColors.sorted
              : DEFAULT_BAR_COLOR

          const heightPercent = Math.max((value / maxValue) * 100, 2)

          return (
            <div
              key={index}
              className="flex-1 flex flex-col items-center justify-end h-full relative"
            >
              {/* Value label above bar */}
              <span
                className="text-[11px] font-mono font-semibold mb-2 transition-all duration-300"
                style={{ color }}
              >
                {value}
              </span>

              {/* Bar */}
              <div
                className="w-full rounded-t-sm transition-all duration-300 ease-in-out relative"
                style={{
                  height: `${heightPercent}%`,
                  backgroundColor: color,
                  opacity: !highlight && !isSorted ? 0.6 : 1,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Index row */}
      <div className="flex w-full max-w-3xl" style={{ gap: `${barGap}px` }} aria-hidden="true">
        {array.map((_, index) => {
          const highlight = highlights[index]
          const isSorted = sorted.includes(index)
          const color = highlight
            ? highlightColors[highlight]
            : isSorted
              ? highlightColors.sorted
              : '#333'

          return (
            <div
              key={index}
              className="flex-1 text-center text-[10px] font-mono py-1 rounded-md transition-all duration-300"
              style={{
                backgroundColor: `${color}12`,
                color: color,
                borderBottom: highlight ? `2px solid ${color}40` : '2px solid transparent',
              }}
            >
              {index}
            </div>
          )
        })}
      </div>
    </div>
  )
}
