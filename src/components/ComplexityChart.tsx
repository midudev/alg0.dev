import { useMemo } from 'react'

type ComplexityKey =
  | 'O(1)'
  | 'O(log n)'
  | 'O(√n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n²)'
  | 'O(2^n)'
  | 'O(n!)'

const COMPLEXITY_FNS: Record<ComplexityKey, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => Math.log2(Math.max(1, n)),
  'O(√n)': (n) => Math.sqrt(n),
  'O(n)': (n) => n,
  'O(n log n)': (n) => n * Math.log2(Math.max(1, n)),
  'O(n²)': (n) => n * n,
  'O(2^n)': (n) => Math.pow(2, n),
  'O(n!)': (n) => {
    let r = 1
    for (let i = 2; i <= n; i++) r *= i
    return r
  },
}

const REFERENCE_KEYS: ComplexityKey[] = ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)']

/* ── Regex that handles one level of nested parens, e.g. O((V+E) log V) ── */
const O_RE = /O\((?:[^()]+|\([^)]*\))*\)/

function normalizeToKey(raw: string): ComplexityKey | null {
  const s = raw.replace(/\s+/g, '').toLowerCase()
  if (/^o\(1\)/.test(s)) return 'O(1)'
  if (/n!/.test(s)) return 'O(n!)'
  if (/2\^|k\^/.test(s)) return 'O(2^n)'
  if (/√n|sqrt/.test(s)) return 'O(√n)'
  if (/n²|n\^2|v²/.test(s)) return 'O(n²)'
  if (/nlogn|n\*logn|\(v\+e\)log|elog|n\^1\.25/.test(s)) return 'O(n log n)'
  if (/loglog/.test(s)) return 'O(log n)'
  if (/log/.test(s)) return 'O(log n)'
  if (/n\+k|d[×x*]/.test(s)) return 'O(n)'
  if (/[nm][×x*][nwm]|rows[×x*]cols/.test(s)) return 'O(n²)'
  if (/v\+e/.test(s)) return 'O(n)'
  if (/n/.test(s)) return 'O(n)'
  return null
}

interface Entry {
  label: string
  raw: string
  key: ComplexityKey
  color: string
}

function parseTimeComplexity(description: string): Entry[] {
  const entries: Entry[] = []

  const idxEn = description.indexOf('Time Complexity')
  const idxEs = description.indexOf('Complejidad Temporal')
  const idx = idxEn !== -1 ? idxEn : idxEs
  if (idx === -1) return entries

  const isSpanish = idxEs !== -1 && (idxEn === -1 || idxEs < idxEn)

  const rest = description.slice(idx)
  const blockRe = isSpanish
    ? /Complejidad Temporal[:\s]*([\s\S]*?)(?=\n\s*\nComplejidad Espacial|\n\s*\nPropiedades|\n\s*\n[A-ZÁÉÍÓÚÑ]|$)/
    : /Time Complexity[:\s]*([\s\S]*?)(?=\n\s*\nSpace|\n\s*\nProperties|\n\s*\n[A-Z]|$)/
  const blockMatch = rest.match(blockRe)
  if (!blockMatch) return entries
  const block = blockMatch[0]

  const oRe = (prefix: string) =>
    new RegExp(`${prefix}:\\s*(O\\((?:[^()]+|\\([^)]*\\))*\\))`, 'i')

  const best = block.match(oRe(isSpanish ? 'Mejor' : 'Best'))
  const avg = block.match(oRe(isSpanish ? 'Promedio' : 'Average'))
  const worst = block.match(oRe(isSpanish ? 'Peor' : 'Worst'))

  if (best || avg || worst) {
    if (best) {
      const k = normalizeToKey(best[1])
      if (k) entries.push({ label: isSpanish ? 'Mejor' : 'Best', raw: best[1], key: k, color: '#34d399' })
    }
    if (avg) {
      const k = normalizeToKey(avg[1])
      if (k) entries.push({ label: isSpanish ? 'Prom' : 'Avg', raw: avg[1], key: k, color: '#fbbf24' })
    }
    if (worst) {
      const k = normalizeToKey(worst[1])
      if (k) entries.push({ label: isSpanish ? 'Peor' : 'Worst', raw: worst[1], key: k, color: '#f87171' })
    }
  } else {
    const single = block.match(O_RE)
    if (single) {
      const k = normalizeToKey(single[0])
      if (k) entries.push({ label: '', raw: single[0], key: k, color: '#60a5fa' })
    }
  }

  return entries
}

/* ── SVG layout constants ── */
const W = 300
const H = 130
const PAD = { top: 14, right: 68, bottom: 18, left: 6 }
const plotW = W - PAD.left - PAD.right
const plotH = H - PAD.top - PAD.bottom
const N_MAX = 20
const STEPS = 60
const Y_CAP = N_MAX * N_MAX

function toScreenY(value: number): number {
  const normalized = Math.sqrt(Math.min(value, Y_CAP) / Y_CAP)
  return PAD.top + plotH * (1 - normalized)
}

function buildPath(fn: (n: number) => number): string {
  const pts: string[] = []
  for (let i = 0; i <= STEPS; i++) {
    const n = 0.5 + (i / STEPS) * (N_MAX - 0.5)
    const x = PAD.left + (i / STEPS) * plotW
    const y = toScreenY(fn(n))
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return pts.join('')
}

function buildAreaPath(fn: (n: number) => number): string {
  return (
    buildPath(fn) +
    `L${(PAD.left + plotW).toFixed(1)},${(PAD.top + plotH).toFixed(1)}` +
    `L${PAD.left.toFixed(1)},${(PAD.top + plotH).toFixed(1)}Z`
  )
}

function endY(fn: (n: number) => number): number {
  return toScreenY(fn(N_MAX))
}

function resolveOverlaps(
  labels: { y: number; text: string; color: string; opacity: number }[],
  minGap: number,
) {
  const sorted = [...labels].sort((a, b) => a.y - b.y)
  for (let pass = 0; pass < 4; pass++) {
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i].y - sorted[i - 1].y
      if (gap < minGap) {
        const shift = (minGap - gap) / 2
        sorted[i - 1].y -= shift
        sorted[i].y += shift
      }
    }
  }
  return sorted
}

export default function ComplexityChart({ description, locale = 'en' }: { description: string; locale?: string }) {
  const entries = useMemo(() => parseTimeComplexity(description), [description])

  if (entries.length === 0) return null

  const highlightedKeys = new Set(entries.map((e) => e.key))

  const grouped = new Map<ComplexityKey, Entry[]>()
  for (const e of entries) {
    const arr = grouped.get(e.key) || []
    arr.push(e)
    grouped.set(e.key, arr)
  }

  const labels: { y: number; text: string; color: string; opacity: number }[] = []
  for (const key of REFERENCE_KEYS) {
    if (!highlightedKeys.has(key)) {
      labels.push({ y: endY(COMPLEXITY_FNS[key]), text: key, color: '#fff', opacity: 0.18 })
    }
  }
  for (const [key, group] of grouped) {
    labels.push({
      y: endY(COMPLEXITY_FNS[key]),
      text: key,
      color: group[group.length - 1].color,
      opacity: 1,
    })
  }
  const resolvedLabels = resolveOverlaps(labels, 11)

  return (
    <div className="mt-5 mb-3">
      <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold mb-2">
        {locale === 'es' ? 'Complejidad Temporal' : 'Time Complexity'}
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ maxHeight: 150 }}
        role="img"
        aria-label="Time complexity growth chart"
      >
        {/* Gradient definitions for area fills */}
        <defs>
          {[...grouped].map(([key, group], i) => {
            const color = group.length === 1 ? group[0].color : group[group.length - 1].color
            return (
              <linearGradient key={key} id={`cg-${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.1} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            )
          })}
        </defs>

        {/* Plot area background */}
        <rect
          x={PAD.left}
          y={PAD.top}
          width={plotW}
          height={plotH}
          rx={4}
          fill="white"
          fillOpacity={0.02}
        />

        {/* Reference curves (faint) */}
        {REFERENCE_KEYS.filter((k) => !highlightedKeys.has(k)).map((key) => (
          <path
            key={key}
            d={buildPath(COMPLEXITY_FNS[key])}
            fill="none"
            stroke="white"
            strokeOpacity={0.06}
            strokeWidth={1}
          />
        ))}

        {/* Highlighted area fills */}
        {[...grouped].map(([key], i) => (
          <path key={`area-${key}`} d={buildAreaPath(COMPLEXITY_FNS[key])} fill={`url(#cg-${i})`} />
        ))}

        {/* Highlighted curves */}
        {[...grouped].map(([key, group]) => {
          const color = group.length === 1 ? group[0].color : group[group.length - 1].color
          return (
            <path
              key={`line-${key}`}
              d={buildPath(COMPLEXITY_FNS[key])}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          )
        })}

        {/* Right-side labels */}
        {resolvedLabels.map((l, i) => (
          <text
            key={i}
            x={PAD.left + plotW + 6}
            y={l.y}
            fill={l.color}
            fillOpacity={l.opacity}
            fontSize={8}
            fontFamily="ui-monospace, monospace"
            dominantBaseline="middle"
          >
            {l.text}
          </text>
        ))}

        {/* Axis hint */}
        <text
          x={PAD.left + plotW}
          y={H - 2}
          fill="white"
          fillOpacity={0.12}
          fontSize={7.5}
          textAnchor="end"
          fontStyle="italic"
        >
          n →
        </text>
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
        {entries.map((e, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className="w-3 h-[2px] rounded-full shrink-0"
              style={{ backgroundColor: e.color }}
            />
            <span className="text-[10px] text-neutral-500">
              {e.label ? `${e.label}: ` : ''}
              <span className="font-mono text-neutral-400">{e.raw}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
