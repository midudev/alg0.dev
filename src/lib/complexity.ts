/**
 * Time-complexity chart model.
 *
 * Parses the "Time Complexity" block out of an algorithm description and turns it
 * into ready-to-render SVG geometry. Server-only: `ComplexityChart.astro` is the
 * single consumer, so none of this reaches the browser — keep it that way and do
 * not import this module from a React component.
 */
import type { Locale } from '@i18n/translations'

export type ComplexityKey =
  | 'O(1)'
  | 'O(log n)'
  | 'O(√n)'
  | 'O(n)'
  | 'O(n log log n)'
  | 'O(n log n)'
  | 'O(n²)'
  | 'O(2^n)'
  | 'O(n!)'

const COMPLEXITY_FNS: Record<ComplexityKey, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => Math.log2(Math.max(1, n)),
  'O(√n)': (n) => Math.sqrt(n),
  'O(n)': (n) => n,
  'O(n log log n)': (n) => n * Math.log2(Math.max(2, Math.log2(Math.max(2, n)))),
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
  if (/nloglogn|n\*loglogn/.test(s)) return 'O(n log log n)'
  if (/nlogn|n\*logn|\(v\+e\)log|elog|n\^1\.25/.test(s)) return 'O(n log n)'
  if (/loglog/.test(s)) return 'O(log n)'
  if (/log/.test(s)) return 'O(log n)'
  if (/n\+k|d[×x*]/.test(s)) return 'O(n)'
  if (/[nm][×x*][nwm]|rows[×x*]cols/.test(s)) return 'O(n²)'
  if (/v\+e/.test(s)) return 'O(n)'
  if (/n/.test(s)) return 'O(n)'
  return null
}

export interface ComplexityEntry {
  label: string
  raw: string
  key: ComplexityKey
  color: string
}

function parseTimeComplexity(description: string): ComplexityEntry[] {
  const entries: ComplexityEntry[] = []

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

  const oRe = (prefix: string) => new RegExp(`${prefix}:\\s*(O\\((?:[^()]+|\\([^)]*\\))*\\))`, 'i')

  const best = block.match(oRe(isSpanish ? 'Mejor' : 'Best'))
  const avg = block.match(oRe(isSpanish ? 'Promedio' : 'Average'))
  const worst = block.match(oRe(isSpanish ? 'Peor' : 'Worst'))

  if (best || avg || worst) {
    if (best) {
      const k = normalizeToKey(best[1])
      if (k) {
        entries.push({
          label: isSpanish ? 'Mejor' : 'Best',
          raw: best[1],
          key: k,
          color: '#34d399',
        })
      }
    }
    if (avg) {
      const k = normalizeToKey(avg[1])
      if (k) {
        entries.push({ label: isSpanish ? 'Prom' : 'Avg', raw: avg[1], key: k, color: '#fbbf24' })
      }
    }
    if (worst) {
      const k = normalizeToKey(worst[1])
      if (k) {
        entries.push({
          label: isSpanish ? 'Peor' : 'Worst',
          raw: worst[1],
          key: k,
          color: '#f87171',
        })
      }
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
export const W = 300
export const H = 130
export const PAD = { top: 14, right: 68, bottom: 18, left: 6 }
export const plotW = W - PAD.left - PAD.right
export const plotH = H - PAD.top - PAD.bottom
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

interface ChartLabel {
  y: number
  text: string
  color: string
  opacity: number
}

function resolveOverlaps(labels: ChartLabel[], minGap: number): ChartLabel[] {
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

/** Stable, collision-free gradient id per curve (`O(n log n)` → `cg-onlogn`). */
function slugify(key: ComplexityKey): string {
  return `cg-${key.toLowerCase().replace(/[^a-z0-9]/g, '')}`
}

export interface ComplexitySeries {
  key: ComplexityKey
  gradientId: string
  color: string
  linePath: string
  areaPath: string
}

export interface ComplexityChartModel {
  entries: ComplexityEntry[]
  /** Faint context curves for the keys this algorithm does not hit. */
  referencePaths: string[]
  series: ComplexitySeries[]
  labels: ChartLabel[]
  heading: string
  ariaLabel: string
}

/** Returns `null` when the description has no parseable time complexity. */
export function buildComplexityChart(
  description: string,
  locale: Locale,
): ComplexityChartModel | null {
  const entries = parseTimeComplexity(description)
  if (entries.length === 0) return null

  const highlightedKeys = new Set(entries.map((e) => e.key))

  const grouped = new Map<ComplexityKey, ComplexityEntry[]>()
  for (const entry of entries) {
    const group = grouped.get(entry.key) ?? []
    group.push(entry)
    grouped.set(entry.key, group)
  }

  const labels: ChartLabel[] = []
  for (const key of REFERENCE_KEYS) {
    if (!highlightedKeys.has(key)) {
      labels.push({
        y: endY(COMPLEXITY_FNS[key]),
        text: key,
        color: 'var(--foreground)',
        opacity: 0.18,
      })
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

  const isSpanish = locale === 'es'
  const chartTitle = isSpanish ? 'Complejidad temporal' : 'Time complexity'

  return {
    entries,
    referencePaths: REFERENCE_KEYS.filter((key) => !highlightedKeys.has(key)).map((key) =>
      buildPath(COMPLEXITY_FNS[key]),
    ),
    series: [...grouped].map(([key, group]) => ({
      key,
      gradientId: slugify(key),
      color: group[group.length - 1].color,
      linePath: buildPath(COMPLEXITY_FNS[key]),
      areaPath: buildAreaPath(COMPLEXITY_FNS[key]),
    })),
    labels: resolveOverlaps(labels, 11),
    heading: isSpanish ? 'Complejidad Temporal' : 'Time Complexity',
    ariaLabel: `${chartTitle}: ${entries
      .map((e) => (e.label ? `${e.label} ${e.raw}` : e.raw))
      .join(', ')}`,
  }
}
