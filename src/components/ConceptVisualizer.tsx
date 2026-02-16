import type { Step, ConceptState, BigOState, CallStackState, StackQueueState } from '@lib/types'

interface ConceptVisualizerProps {
  step: Step
}

export default function ConceptVisualizer({ step }: ConceptVisualizerProps) {
  const concept = step.concept
  if (!concept) return null

  switch (concept.type) {
    case 'bigO':
      return <BigOChart state={concept} />
    case 'callStack':
      return <CallStackViz state={concept} />
    case 'stackQueue':
      return <StackQueueViz state={concept} />
    default:
      return null
  }
}

// ════════════════════════════════════════════════════════════════
//  BIG O — SVG curve chart
// ════════════════════════════════════════════════════════════════

const CURVE_FNS: Record<string, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => (n <= 1 ? 0 : Math.log2(n)),
  'O(n)': (n) => n,
  'O(n log n)': (n) => (n <= 1 ? 0 : n * Math.log2(n)),
  'O(n²)': (n) => n * n,
}

function BigOChart({ state }: { state: BigOState }) {
  const { curves, maxN } = state

  const W = 520
  const H = 340
  const PAD = { top: 24, right: 24, bottom: 48, left: 56 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const visibleCurves = curves.filter((c) => c.visible)

  // Compute the max Y across all visible curves to scale properly
  let maxY = 1
  for (const c of visibleCurves) {
    const fn = CURVE_FNS[c.name]
    if (fn) {
      const val = fn(maxN)
      if (val > maxY) maxY = val
    }
  }
  // Add 10% headroom
  maxY *= 1.1

  const toX = (n: number) => PAD.left + (n / maxN) * chartW
  const toY = (v: number) => PAD.top + chartH - (v / maxY) * chartH

  const SAMPLES = 60

  const buildPath = (fn: (n: number) => number) => {
    const pts: string[] = []
    for (let i = 0; i <= SAMPLES; i++) {
      const n = (i / SAMPLES) * maxN
      const v = Math.min(fn(n), maxY)
      const cmd = i === 0 ? 'M' : 'L'
      pts.push(`${cmd}${toX(n).toFixed(1)},${toY(v).toFixed(1)}`)
    }
    return pts.join(' ')
  }

  // Grid lines
  const yTicks = 5
  const xTicks = Math.min(maxN, 10)

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-2xl"
        style={{ maxHeight: '340px' }}
        role="img"
        aria-label="Big O complexity chart"
      >
        {/* Background */}
        <rect x={PAD.left} y={PAD.top} width={chartW} height={chartH} fill="rgba(255,255,255,0.02)" rx="4" />

        {/* Horizontal grid lines */}
        {Array.from({ length: yTicks + 1 }, (_, i) => {
          const y = PAD.top + (i / yTicks) * chartH
          const val = maxY - (i / yTicks) * maxY
          return (
            <g key={`yg-${i}`}>
              <line x1={PAD.left} y1={y} x2={PAD.left + chartW} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4,4" />
              <text x={PAD.left - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="monospace">
                {val < 10 ? val.toFixed(1) : Math.round(val)}
              </text>
            </g>
          )
        })}

        {/* Vertical grid lines */}
        {Array.from({ length: xTicks + 1 }, (_, i) => {
          const n = (i / xTicks) * maxN
          const x = toX(n)
          return (
            <g key={`xg-${i}`}>
              <line x1={x} y1={PAD.top} x2={x} y2={PAD.top + chartH} stroke="rgba(255,255,255,0.06)" strokeDasharray="4,4" />
              <text x={x} y={PAD.top + chartH + 16} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="10" fontFamily="monospace">
                {Math.round(n)}
              </text>
            </g>
          )
        })}

        {/* Axes */}
        <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={PAD.top + chartH} stroke="rgba(255,255,255,0.2)" />
        <line x1={PAD.left} y1={PAD.top + chartH} x2={PAD.left + chartW} y2={PAD.top + chartH} stroke="rgba(255,255,255,0.2)" />

        {/* Axis labels */}
        <text x={PAD.left + chartW / 2} y={H - 4} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="monospace">
          n (input size)
        </text>
        <text
          x={12}
          y={PAD.top + chartH / 2}
          textAnchor="middle"
          fill="rgba(255,255,255,0.45)"
          fontSize="11"
          fontFamily="monospace"
          transform={`rotate(-90, 12, ${PAD.top + chartH / 2})`}
        >
          operations
        </text>

        {/* Curves */}
        {visibleCurves.map((curve) => {
          const fn = CURVE_FNS[curve.name]
          if (!fn) return null
          const d = buildPath(fn)
          return (
            <g key={curve.name}>
              {/* Glow for highlighted curve */}
              {curve.highlighted && (
                <path
                  d={d}
                  fill="none"
                  stroke={curve.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.2"
                  className="transition-all duration-500"
                />
              )}
              <path
                d={d}
                fill="none"
                stroke={curve.color}
                strokeWidth={curve.highlighted ? 3 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={curve.highlighted ? 1 : 0.5}
                className="transition-all duration-500"
              />
              {/* End-point dot */}
              <circle
                cx={toX(maxN)}
                cy={toY(Math.min(fn(maxN), maxY))}
                r={curve.highlighted ? 4 : 2.5}
                fill={curve.color}
                opacity={curve.highlighted ? 1 : 0.6}
                className="transition-all duration-500"
              />
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {curves.map((curve) => (
          <div
            key={curve.name}
            className="flex items-center gap-2 text-xs font-mono transition-all duration-300"
            style={{
              opacity: curve.visible ? (curve.highlighted ? 1 : 0.5) : 0.2,
              transform: curve.highlighted ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ backgroundColor: curve.color }}
            />
            <span style={{ color: curve.visible ? curve.color : '#555' }}>{curve.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  CALL STACK — Recursion visualization
// ════════════════════════════════════════════════════════════════

const FRAME_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  waiting: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: '#888' },
  active: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.35)', text: '#fb923c' },
  base: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', text: '#4ade80' },
  resolved: { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', text: '#34d399' },
}

function CallStackViz({ state }: { state: CallStackState }) {
  const { frames } = state

  if (frames.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
        <div className="text-neutral-500 font-mono text-sm">Call stack is empty</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
      {/* Stack label */}
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest mb-1">Call Stack</div>

      {/* Frames — top of stack (last frame) is rendered first */}
      <div className="flex flex-col gap-1.5 w-full max-w-sm">
        {[...frames].reverse().map((frame, visualIdx) => {
          const logicalIdx = frames.length - 1 - visualIdx
          const colors = FRAME_COLORS[frame.state] ?? FRAME_COLORS.waiting
          const isTop = logicalIdx === frames.length - 1

          return (
            <div
              key={`frame-${logicalIdx}`}
              className="relative flex items-center transition-all duration-400 ease-in-out"
              style={{
                opacity: frame.state === 'resolved' ? 0.55 : 1,
              }}
            >
              {/* Depth indicator */}
              <div
                className="w-6 text-right text-[10px] font-mono mr-2 transition-colors duration-300"
                style={{ color: colors.text }}
              >
                {logicalIdx}
              </div>

              {/* Frame box */}
              <div
                className="flex-1 rounded-lg px-4 py-2.5 font-mono text-sm border transition-all duration-400 ease-in-out relative overflow-hidden"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                  boxShadow: frame.state === 'active' || frame.state === 'base'
                    ? `0 0 20px ${colors.border}`
                    : 'none',
                }}
              >
                {/* Pulse animation for active/base frame */}
                {(frame.state === 'active' || frame.state === 'base') && (
                  <div
                    className="absolute inset-0 rounded-lg animate-pulse"
                    style={{ backgroundColor: colors.bg, opacity: 0.4 }}
                  />
                )}

                <div className="relative flex items-center justify-between gap-2">
                  <span className="font-semibold">{frame.label}</span>
                  {frame.detail && (
                    <span className="text-xs opacity-75">{frame.detail}</span>
                  )}
                </div>
              </div>

              {/* TOP indicator */}
              {isTop && (
                <div className="ml-2 text-[10px] font-mono uppercase tracking-wider transition-colors duration-300" style={{ color: colors.text }}>
                  ← top
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom base line */}
      <div className="w-full max-w-sm flex items-center gap-2 mt-1">
        <div className="w-6" />
        <div className="flex-1 h-px bg-white/10" />
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  STACK & QUEUE — Data structure visualization
// ════════════════════════════════════════════════════════════════

const ITEM_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' },
  entering: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  leaving: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.4)', text: '#f87171' },
}

function StackQueueViz({ state }: { state: StackQueueState }) {
  const { structure, items, operation, removedValue } = state

  if (structure === 'stack') {
    return <StackViz items={items} operation={operation} removedValue={removedValue} />
  }
  return <QueueViz items={items} operation={operation} removedValue={removedValue} />
}

function StackViz({
  items,
  operation,
  removedValue,
}: {
  items: StackQueueState['items']
  operation?: string
  removedValue?: number | null
}) {
  const MAX_SLOTS = 5

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
      {/* Title */}
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Stack · LIFO</div>

      {/* Operation badge */}
      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 transition-all duration-300">
          {operation}
        </div>
      )}

      {/* Removed value floating away */}
      {removedValue != null && (
        <div className="font-mono text-sm text-red-400/70 animate-pulse">
          ↑ {removedValue} removed
        </div>
      )}

      {/* Stack container */}
      <div className="relative w-48">
        {/* TOP indicator */}
        {items.length > 0 && (
          <div className="absolute -left-14 top-0 flex items-center h-11 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
            top →
          </div>
        )}

        {/* Slots — top of stack (last item) at top */}
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: MAX_SLOTS }, (_, visualIdx) => {
            const logicalIdx = items.length - 1 - visualIdx
            const item = logicalIdx >= 0 ? items[logicalIdx] : null

            if (!item) {
              return (
                <div
                  key={`empty-${visualIdx}`}
                  className="h-11 rounded-lg border border-dashed border-white/5 bg-white/1 transition-all duration-300"
                />
              )
            }

            const colors = ITEM_COLORS[item.state] ?? ITEM_COLORS.normal

            return (
              <div
                key={`item-${visualIdx}`}
                className="h-11 rounded-lg border flex items-center justify-center font-mono text-base font-semibold transition-all duration-400 ease-in-out relative overflow-hidden"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                  boxShadow: item.state === 'entering' ? `0 0 16px ${colors.border}` : 'none',
                }}
              >
                {item.value}
              </div>
            )
          })}
        </div>

        {/* Base */}
        <div className="mt-2 h-1 rounded-full bg-white/10" />
      </div>
    </div>
  )
}

function QueueViz({
  items,
  operation,
  removedValue,
}: {
  items: StackQueueState['items']
  operation?: string
  removedValue?: number | null
}) {
  const MAX_SLOTS = 5

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
      {/* Title */}
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Queue · FIFO</div>

      {/* Operation badge */}
      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 transition-all duration-300">
          {operation}
        </div>
      )}

      {/* Removed value floating away */}
      {removedValue != null && (
        <div className="font-mono text-sm text-red-400/70 animate-pulse">
          ← {removedValue} removed
        </div>
      )}

      {/* Queue container */}
      <div className="relative">
        {/* FRONT / BACK labels */}
        <div className="flex justify-between mb-1 px-1">
          {items.length > 0 && (
            <>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">front</span>
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">back</span>
            </>
          )}
        </div>

        {/* Slots — horizontal */}
        <div className="flex gap-1.5">
          {Array.from({ length: MAX_SLOTS }, (_, i) => {
            const item = i < items.length ? items[i] : null

            if (!item) {
              return (
                <div
                  key={`empty-${i}`}
                  className="w-16 h-16 rounded-lg border border-dashed border-white/5 bg-white/1 transition-all duration-300"
                />
              )
            }

            const colors = ITEM_COLORS[item.state] ?? ITEM_COLORS.normal

            return (
              <div
                key={`item-${i}`}
                className="w-16 h-16 rounded-lg border flex items-center justify-center font-mono text-lg font-semibold transition-all duration-400 ease-in-out relative overflow-hidden"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                  boxShadow: item.state === 'entering' ? `0 0 16px ${colors.border}` : 'none',
                }}
              >
                {item.value}
              </div>
            )
          })}
        </div>

        {/* Direction arrow */}
        <div className="flex items-center justify-center mt-2 text-neutral-500">
          <svg width="120" height="14" viewBox="0 0 120 14" className="opacity-30">
            <defs>
              <marker id="qArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="currentColor" />
              </marker>
            </defs>
            <line x1="10" y1="7" x2="105" y2="7" stroke="currentColor" strokeWidth="1.5" markerEnd="url(#qArrow)" />
          </svg>
        </div>
        <div className="text-center text-[10px] font-mono text-neutral-500 mt-0.5">processing direction</div>
      </div>
    </div>
  )
}
