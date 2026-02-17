import type {
  Step,
  BigOState,
  CallStackState,
  StackQueueState,
  LinkedListState,
  HashTableState,
  BinaryTreeState,
  TwoPointersState,
  SlidingWindowState,
  MemoTableState,
  CoinChangeState,
} from '@lib/types'

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
    case 'linkedList':
      return <LinkedListViz state={concept} />
    case 'hashTable':
      return <HashTableViz state={concept} />
    case 'binaryTree':
      return <BinaryTreeViz state={concept} />
    case 'twoPointers':
      return <TwoPointersViz state={concept} />
    case 'slidingWindow':
      return <SlidingWindowViz state={concept} />
    case 'memoTable':
      return <MemoTableViz state={concept} />
    case 'coinChange':
      return <CoinChangeViz state={concept} />
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
          {state.yLabel ?? 'operations'}
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
      <div className="relative w-36 md:w-48">
        {/* TOP indicator */}
        {items.length > 0 && (
          <div className="absolute -left-12 md:-left-14 top-0 flex items-center h-11 text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
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

// ════════════════════════════════════════════════════════════════
//  LINKED LIST — Horizontal nodes with arrows
// ════════════════════════════════════════════════════════════════

const LL_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' },
  current: { bg: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
  new: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  removing: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.4)', text: '#f87171' },
  found: { bg: 'rgba(250,204,21,0.15)', border: 'rgba(250,204,21,0.4)', text: '#facc15' },
}

function LinkedListViz({ state }: { state: LinkedListState }) {
  const { nodes, operation } = state

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Linked List</div>

      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
          {operation}
        </div>
      )}

      {nodes.length === 0 ? (
        <div className="font-mono text-sm text-neutral-600">null (empty list)</div>
      ) : (
        <div className="flex items-center gap-0 overflow-x-auto max-w-full px-4">
          {/* HEAD label */}
          <div className="flex flex-col items-center mr-1 shrink-0">
            <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider mb-1">head</span>
            <svg width="16" height="12" viewBox="0 0 16 12" className="text-neutral-400">
              <path d="M0,6 L12,6 M8,2 L12,6 L8,10" stroke="currentColor" fill="none" strokeWidth="1.5" />
            </svg>
          </div>

          {nodes.map((node, i) => {
            const colors = LL_COLORS[node.state] ?? LL_COLORS.normal
            const isLast = i === nodes.length - 1
            return (
              <div key={i} className="flex items-center shrink-0">
                {/* Node box */}
                <div
                  className="w-14 h-14 rounded-lg border flex flex-col items-center justify-center font-mono transition-all duration-300 relative"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                    boxShadow: node.state !== 'normal' ? `0 0 16px ${colors.border}` : 'none',
                  }}
                >
                  <span className="text-base font-bold">{node.value}</span>
                </div>
                {/* Arrow to next */}
                <svg width="28" height="12" viewBox="0 0 28 12" className="shrink-0" style={{ color: isLast ? '#555' : colors.text }}>
                  <line x1="2" y1="6" x2="22" y2="6" stroke="currentColor" strokeWidth="1.5" />
                  <polygon points="20,2 26,6 20,10" fill="currentColor" />
                </svg>
              </div>
            )
          })}

          {/* null terminator */}
          <div className="font-mono text-xs text-neutral-600 shrink-0">null</div>
        </div>
      )}

      {/* TAIL label below last node */}
      {nodes.length > 0 && (
        <div className="flex items-center gap-2 -mt-2">
          <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider">
            tail = {nodes[nodes.length - 1].value}
          </span>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  HASH TABLE — Buckets with chained entries
// ════════════════════════════════════════════════════════════════

const HT_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  normal: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', text: '#60a5fa' },
  new: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  found: { bg: 'rgba(250,204,21,0.15)', border: 'rgba(250,204,21,0.4)', text: '#facc15' },
  collision: { bg: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
}

function HashTableViz({ state }: { state: HashTableState }) {
  const { buckets, size, hashingKey, hashResult, operation } = state

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Hash Table</div>

      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
          {operation}
        </div>
      )}

      {hashingKey != null && (
        <div className="font-mono text-xs text-neutral-400">
          hash(<span className="text-sky-300">"{hashingKey}"</span>)
          {hashResult != null && <span> = <span className="text-amber-300">{hashResult}</span></span>}
        </div>
      )}

      <div className="flex flex-col gap-1 w-full max-w-lg">
        {Array.from({ length: size }, (_, idx) => {
          const entries = buckets[idx] ?? []
          const isTarget = hashResult === idx
          return (
            <div key={idx} className="flex items-center gap-2 h-9">
              {/* Bucket index */}
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-mono text-xs font-bold shrink-0 border transition-all duration-300"
                style={{
                  backgroundColor: isTarget ? 'rgba(251,146,60,0.12)' : 'rgba(255,255,255,0.03)',
                  borderColor: isTarget ? 'rgba(251,146,60,0.4)' : 'rgba(255,255,255,0.08)',
                  color: isTarget ? '#fb923c' : '#666',
                }}
              >
                {idx}
              </div>

              {/* Arrow */}
              <svg width="16" height="8" viewBox="0 0 16 8" className="shrink-0 text-neutral-600">
                <line x1="0" y1="4" x2="12" y2="4" stroke="currentColor" strokeWidth="1" />
                <polygon points="10,1.5 15,4 10,6.5" fill="currentColor" />
              </svg>

              {/* Entries chain */}
              {entries.length === 0 ? (
                <span className="text-[11px] font-mono text-neutral-700">empty</span>
              ) : (
                <div className="flex items-center gap-1 overflow-x-auto">
                  {entries.map((entry, ei) => {
                    const colors = HT_COLORS[entry.state] ?? HT_COLORS.normal
                    return (
                      <div key={ei} className="flex items-center shrink-0">
                        <div
                          className="px-2.5 py-1 rounded border font-mono text-[11px] transition-all duration-300"
                          style={{
                            backgroundColor: colors.bg,
                            borderColor: colors.border,
                            color: colors.text,
                            boxShadow: entry.state !== 'normal' ? `0 0 12px ${colors.border}` : 'none',
                          }}
                        >
                          {entry.key}:<span className="text-white/60">{entry.value}</span>
                        </div>
                        {ei < entries.length - 1 && (
                          <svg width="14" height="8" viewBox="0 0 14 8" className="shrink-0 text-neutral-600 mx-0.5">
                            <line x1="0" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="1" />
                            <polygon points="8,1.5 13,4 8,6.5" fill="currentColor" />
                          </svg>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="text-[10px] font-mono text-neutral-600 mt-1">
        hash(key) = sum of char codes % {size}
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  BINARY TREE — SVG tree for BST & Heap
// ════════════════════════════════════════════════════════════════

const TREE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
  normal: { fill: 'rgba(96,165,250,0.12)', stroke: 'rgba(96,165,250,0.3)', text: '#60a5fa' },
  current: { fill: 'rgba(251,146,60,0.18)', stroke: 'rgba(251,146,60,0.5)', text: '#fb923c' },
  new: { fill: 'rgba(74,222,128,0.18)', stroke: 'rgba(74,222,128,0.5)', text: '#4ade80' },
  found: { fill: 'rgba(250,204,21,0.18)', stroke: 'rgba(250,204,21,0.5)', text: '#facc15' },
  comparing: { fill: 'rgba(192,132,252,0.15)', stroke: 'rgba(192,132,252,0.4)', text: '#c084fc' },
  placed: { fill: 'rgba(52,211,153,0.12)', stroke: 'rgba(52,211,153,0.3)', text: '#34d399' },
}

function BinaryTreeViz({ state }: { state: BinaryTreeState }) {
  const { nodes, operation, treeType, heapType } = state

  const W = 480
  const H = 280
  const R = 18
  const TOP_Y = 36

  const maxDepth = nodes.length > 0 ? Math.floor(Math.log2(nodes.length)) + 1 : 0
  const levelH = maxDepth > 1 ? (H - TOP_Y - 20) / (maxDepth - 1) : 0

  const getPos = (idx: number): { x: number; y: number } | null => {
    if (idx >= nodes.length || !nodes[idx]) return null
    const level = Math.floor(Math.log2(idx + 1))
    const posInLevel = idx - (Math.pow(2, level) - 1)
    const totalInLevel = Math.pow(2, level)
    const x = ((posInLevel + 0.5) / totalInLevel) * W
    const y = TOP_Y + level * levelH
    return { x, y }
  }

  const label = treeType === 'heap'
    ? `${heapType === 'min' ? 'Min' : 'Max'} Heap`
    : 'Binary Search Tree'

  const nonNullNodes = nodes.reduce((acc, n) => acc + (n ? 1 : 0), 0)

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 w-full">
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">{label}</div>

      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
          {operation}
        </div>
      )}

      {nonNullNodes === 0 ? (
        <div className="font-mono text-sm text-neutral-600">empty tree</div>
      ) : (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-lg" style={{ maxHeight: `${H}px` }}>
          {/* Edges */}
          {nodes.map((node, idx) => {
            if (!node) return null
            const parentPos = getPos(idx)
            if (!parentPos) return null

            const children = [2 * idx + 1, 2 * idx + 2]
            return children.map((childIdx) => {
              if (childIdx >= nodes.length || !nodes[childIdx]) return null
              const childPos = getPos(childIdx)
              if (!childPos) return null
              return (
                <line
                  key={`e-${idx}-${childIdx}`}
                  x1={parentPos.x}
                  y1={parentPos.y}
                  x2={childPos.x}
                  y2={childPos.y}
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
              )
            })
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            if (!node) return null
            const pos = getPos(idx)
            if (!pos) return null
            const colors = TREE_COLORS[node.state] ?? TREE_COLORS.normal
            const isHighlighted = node.state !== 'normal'

            return (
              <g key={`n-${idx}`} className="transition-all duration-300">
                {isHighlighted && (
                  <circle cx={pos.x} cy={pos.y} r={R + 4} fill={colors.stroke} opacity="0.15" />
                )}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={R}
                  fill={colors.fill}
                  stroke={colors.stroke}
                  strokeWidth="1.5"
                />
                <text
                  x={pos.x}
                  y={pos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={colors.text}
                  fontSize="13"
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {node.value}
                </text>
              </g>
            )
          })}
        </svg>
      )}

      {/* Heap array view */}
      {treeType === 'heap' && nonNullNodes > 0 && (
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">array view</div>
          <div className="flex gap-1">
            {nodes.map((node, idx) => {
              if (!node) return null
              const colors = TREE_COLORS[node.state] ?? TREE_COLORS.normal
              return (
                <div key={idx} className="flex flex-col items-center gap-0.5">
                  <div
                    className="w-9 h-9 rounded border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300"
                    style={{
                      backgroundColor: colors.fill,
                      borderColor: colors.stroke,
                      color: colors.text,
                    }}
                  >
                    {node.value}
                  </div>
                  <span className="text-[9px] font-mono text-neutral-600">{idx}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  TWO POINTERS — Array with left/right pointer arrows
// ════════════════════════════════════════════════════════════════

const TP_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  default: { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.1)', text: '#888' },
  left: { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.4)', text: '#60a5fa' },
  right: { bg: 'rgba(192,132,252,0.15)', border: 'rgba(192,132,252,0.4)', text: '#c084fc' },
  found: { bg: 'rgba(74,222,128,0.18)', border: 'rgba(74,222,128,0.5)', text: '#4ade80' },
  checked: { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', text: '#555' },
}

function TwoPointersViz({ state }: { state: TwoPointersState }) {
  const { array, left, right, highlights, sum, target, operation } = state

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Two Pointers</div>

      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
          {operation}
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        {/* Pointer labels above */}
        <div className="flex gap-0">
          {array.map((_, i) => {
            const isLeft = i === left
            const isRight = i === right
            return (
              <div key={`lbl-${i}`} className="w-14 flex justify-center">
                {isLeft && <span className="text-[10px] font-mono font-bold text-blue-400">L ↓</span>}
                {isRight && !isLeft && <span className="text-[10px] font-mono font-bold text-purple-400">R ↓</span>}
              </div>
            )
          })}
        </div>

        {/* Array cells */}
        <div className="flex gap-1">
          {array.map((val, i) => {
            const hl = highlights[i] ?? 'default'
            const colors = TP_COLORS[hl] ?? TP_COLORS.default
            return (
              <div
                key={i}
                className="w-13 h-13 rounded-lg border flex items-center justify-center font-mono text-base font-bold transition-all duration-300"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                  boxShadow: hl !== 'default' && hl !== 'checked' ? `0 0 12px ${colors.border}` : 'none',
                }}
              >
                {val}
              </div>
            )
          })}
        </div>

        {/* Index row */}
        <div className="flex gap-1">
          {array.map((_, i) => (
            <div key={`idx-${i}`} className="w-13 text-center text-[9px] font-mono text-neutral-600">{i}</div>
          ))}
        </div>
      </div>

      {/* Sum display */}
      {sum != null && target != null && (
        <div className="font-mono text-sm text-neutral-400">
          arr[{left}] + arr[{right}] = <span className="text-white">{array[left]}</span> + <span className="text-white">{array[right]}</span> = <span className={sum === target ? 'text-green-400 font-bold' : 'text-amber-300'}>{sum}</span>
          {sum === target ? ' ✓' : sum < target ? ` < ${target} → move L →` : ` > ${target} → ← move R`}
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  SLIDING WINDOW — String with window bracket
// ════════════════════════════════════════════════════════════════

const SW_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  outside: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#555' },
  inWindow: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', text: '#60a5fa' },
  current: { bg: 'rgba(74,222,128,0.15)', border: 'rgba(74,222,128,0.4)', text: '#4ade80' },
  duplicate: { bg: 'rgba(248,113,113,0.15)', border: 'rgba(248,113,113,0.4)', text: '#f87171' },
}

function SlidingWindowViz({ state }: { state: SlidingWindowState }) {
  const { chars, windowStart, windowEnd, charStates, best, operation } = state

  const windowStr = windowEnd >= windowStart ? chars.slice(windowStart, windowEnd + 1).join('') : ''
  const bestStr = best ? chars.slice(best.start, best.end + 1).join('') : ''

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Sliding Window</div>

      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
          {operation}
        </div>
      )}

      <div className="flex flex-col items-center gap-1">
        {/* Character cells */}
        <div className="flex gap-0.5">
          {chars.map((ch, i) => {
            const st = charStates[i] ?? 'outside'
            const colors = SW_COLORS[st] ?? SW_COLORS.outside
            const isWindowEdge = i === windowStart || i === windowEnd
            return (
              <div
                key={i}
                className="w-10 h-12 rounded-md border flex items-center justify-center font-mono text-lg font-bold transition-all duration-300"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                  boxShadow: st !== 'outside' ? `0 0 10px ${colors.border}` : 'none',
                  borderWidth: isWindowEdge && st !== 'outside' ? '2px' : '1px',
                }}
              >
                {ch}
              </div>
            )
          })}
        </div>

        {/* Index row */}
        <div className="flex gap-0.5">
          {chars.map((_, i) => (
            <div key={`idx-${i}`} className="w-10 text-center text-[9px] font-mono text-neutral-600">{i}</div>
          ))}
        </div>

        {/* Window bracket */}
        {windowEnd >= windowStart && windowEnd >= 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-mono text-blue-400">window [{windowStart}..{windowEnd}]</span>
            <span className="font-mono text-sm text-blue-300 font-bold">"{windowStr}"</span>
            <span className="text-[10px] font-mono text-neutral-500">len={windowStr.length}</span>
          </div>
        )}
      </div>

      {/* Best so far */}
      {bestStr && (
        <div className="font-mono text-xs text-neutral-400">
          best = "<span className="text-amber-300 font-bold">{bestStr}</span>" (length {bestStr.length})
        </div>
      )}
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  MEMO TABLE — Fibonacci memoization grid
// ════════════════════════════════════════════════════════════════

const MEMO_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  empty: { bg: 'rgba(255,255,255,0.02)', border: 'rgba(255,255,255,0.06)', text: '#444' },
  computing: { bg: 'rgba(251,146,60,0.15)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
  cached: { bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.25)', text: '#60a5fa' },
  hit: { bg: 'rgba(74,222,128,0.18)', border: 'rgba(74,222,128,0.5)', text: '#4ade80' },
}

function MemoTableViz({ state }: { state: MemoTableState }) {
  const { entries, currentCall, operation } = state

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Memoization</div>

      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
          {operation}
        </div>
      )}

      {currentCall && (
        <div className="font-mono text-sm text-neutral-300">{currentCall}</div>
      )}

      {/* Memo table grid */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex gap-1">
          {entries.map((entry, i) => {
            const colors = MEMO_COLORS[entry.state] ?? MEMO_COLORS.empty
            return (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div className="text-[9px] font-mono text-neutral-500">f({entry.key})</div>
                <div
                  className="w-11 h-11 rounded-lg border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                    color: colors.text,
                    boxShadow: entry.state !== 'empty' ? `0 0 10px ${colors.border}` : 'none',
                  }}
                >
                  {entry.value != null ? entry.value : '—'}
                </div>
                <div className="text-[8px] font-mono transition-colors duration-300" style={{ color: colors.text }}>
                  {entry.state === 'hit' ? '↑ HIT' : entry.state === 'computing' ? '...' : entry.state === 'cached' ? '✓' : ''}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-[10px] font-mono">
        <span className="text-orange-400">● computing</span>
        <span className="text-blue-400">● cached</span>
        <span className="text-green-400">● cache hit</span>
      </div>
    </div>
  )
}

// ════════════════════════════════════════════════════════════════
//  COIN CHANGE — Greedy vs DP comparison
// ════════════════════════════════════════════════════════════════

function CoinChangeViz({ state }: { state: CoinChangeState }) {
  const { coins, target, selected, remaining, approach, greedyResult, dpResult, operation } = state

  const approachLabel = approach === 'greedy' ? 'Greedy' : approach === 'dp' ? 'Dynamic Programming' : 'Comparison'
  const approachColor = approach === 'greedy' ? '#fb923c' : approach === 'dp' ? '#60a5fa' : '#c084fc'

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full">
      <div className="text-neutral-500 font-mono text-[11px] uppercase tracking-widest">Greedy vs DP</div>

      {operation && (
        <div className="font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300">
          {operation}
        </div>
      )}

      {/* Approach label */}
      <div className="font-mono text-xs font-bold px-3 py-1 rounded" style={{ color: approachColor, backgroundColor: `${approachColor}15`, border: `1px solid ${approachColor}30` }}>
        {approachLabel}
      </div>

      {/* Target */}
      <div className="font-mono text-sm text-neutral-400">
        target = <span className="text-white font-bold text-lg">{target}</span>
        {remaining > 0 && remaining < target && <span className="text-neutral-500 ml-2">remaining: <span className="text-amber-300">{remaining}</span></span>}
      </div>

      {/* Available coins */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono text-neutral-500 uppercase">coins:</span>
        <div className="flex gap-1.5">
          {coins.map((c, i) => (
            <div key={i} className="w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center font-mono text-sm font-bold text-neutral-400">
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* Selected coins */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-neutral-500 uppercase">picked:</span>
          <div className="flex gap-1.5">
            {selected.map((c, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300"
                style={{
                  backgroundColor: `${approachColor}18`,
                  borderColor: `${approachColor}50`,
                  color: approachColor,
                  boxShadow: `0 0 12px ${approachColor}30`,
                }}
              >
                {c}
              </div>
            ))}
          </div>
          <span className="text-[10px] font-mono text-neutral-500">= {selected.reduce((a, b) => a + b, 0)} ({selected.length} coins)</span>
        </div>
      )}

      {/* Comparison */}
      {approach === 'compare' && greedyResult && dpResult && (
        <div className="flex gap-6 mt-2">
          <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-orange-400/20 bg-orange-400/5">
            <span className="text-[10px] font-mono text-orange-400 uppercase font-bold">Greedy</span>
            <div className="flex gap-1">
              {greedyResult.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-orange-400/15 border border-orange-400/30 flex items-center justify-center font-mono text-xs font-bold text-orange-400">{c}</div>
              ))}
            </div>
            <span className="font-mono text-xs text-orange-300">{greedyResult.length} coins</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-blue-400/20 bg-blue-400/5">
            <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">DP (optimal)</span>
            <div className="flex gap-1">
              {dpResult.map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-blue-400/15 border border-blue-400/30 flex items-center justify-center font-mono text-xs font-bold text-blue-400">{c}</div>
              ))}
            </div>
            <span className="font-mono text-xs text-blue-300">{dpResult.length} coins ✓</span>
          </div>
        </div>
      )}
    </div>
  )
}
