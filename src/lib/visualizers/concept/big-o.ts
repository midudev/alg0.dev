/**
 * Concept visualizer: BigO.
 */
import type { BigOState } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

const CURVE_FNS: Record<string, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => (n <= 1 ? 0 : Math.log2(n)),
  'O(n)': (n) => n,
  'O(n log n)': (n) => (n <= 1 ? 0 : n * Math.log2(n)),
  'O(n²)': (n) => n * n,
}

export function renderBigO(state: BigOState): HTMLElement {
  const { curves, maxN } = state

  const W = 520
  const H = 340
  const PAD = { top: 24, right: 24, bottom: 48, left: 56 }
  const chartW = W - PAD.left - PAD.right
  const chartH = H - PAD.top - PAD.bottom

  const visibleCurves = curves.filter((c) => c.visible)

  let maxY = 1
  for (const c of visibleCurves) {
    const fn = CURVE_FNS[c.name]
    if (fn) {
      const val = fn(maxN)
      if (val > maxY) maxY = val
    }
  }
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

  const yTicks = 5
  const xTicks = Math.min(maxN, 10)

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-5 w-full min-h-0'

  const svg = svgEl('svg', {
    viewBox: `0 0 ${W} ${H}`,
    role: 'img',
    'aria-label': `Big O complexity chart${
      visibleCurves.length > 0 ? `: ${visibleCurves.map((c) => c.name).join(', ')}` : ''
    }`,
  })
  svg.classList.add('w-full', 'max-w-4xl')
  applyStyles(svg, { maxHeight: 'min(58vh, 520px)', height: 'auto' })

  svg.append(
    svgEl('rect', {
      x: PAD.left,
      y: PAD.top,
      width: chartW,
      height: chartH,
      fill: 'var(--subtle)',
      rx: '4',
    }),
  )

  for (let i = 0; i <= yTicks; i++) {
    const y = PAD.top + (i / yTicks) * chartH
    const val = maxY - (i / yTicks) * maxY
    const g = svgEl('g')
    g.append(
      svgEl('line', {
        x1: PAD.left,
        y1: y,
        x2: PAD.left + chartW,
        y2: y,
        stroke: 'var(--viz-grid)',
        strokeDasharray: '4,4',
      }),
    )
    const text = svgEl('text', {
      x: PAD.left - 8,
      y: y + 4,
      textAnchor: 'end',
      fill: 'var(--viz-label)',
      fontSize: '10',
      fontFamily: 'monospace',
    })
    text.textContent = val > 0 && val < 10 ? val.toFixed(1) : String(Math.round(val))
    g.append(text)
    svg.append(g)
  }

  for (let i = 0; i <= xTicks; i++) {
    const n = (i / xTicks) * maxN
    const x = toX(n)
    const g = svgEl('g')
    g.append(
      svgEl('line', {
        x1: x,
        y1: PAD.top,
        x2: x,
        y2: PAD.top + chartH,
        stroke: 'var(--viz-grid)',
        strokeDasharray: '4,4',
      }),
    )
    const text = svgEl('text', {
      x,
      y: PAD.top + chartH + 16,
      textAnchor: 'middle',
      fill: 'var(--viz-label)',
      fontSize: '10',
      fontFamily: 'monospace',
    })
    text.textContent = String(Math.round(n))
    g.append(text)
    svg.append(g)
  }

  svg.append(
    svgEl('line', {
      x1: PAD.left,
      y1: PAD.top,
      x2: PAD.left,
      y2: PAD.top + chartH,
      stroke: 'var(--viz-axis)',
    }),
    svgEl('line', {
      x1: PAD.left,
      y1: PAD.top + chartH,
      x2: PAD.left + chartW,
      y2: PAD.top + chartH,
      stroke: 'var(--viz-axis)',
    }),
  )

  const xLabel = svgEl('text', {
    x: PAD.left + chartW / 2,
    y: H - 4,
    textAnchor: 'middle',
    fill: 'var(--viz-label)',
    fontSize: '11',
    fontFamily: 'monospace',
  })
  xLabel.textContent = 'n (input size)'
  svg.append(xLabel)

  const yLabel = svgEl('text', {
    x: 12,
    y: PAD.top + chartH / 2,
    textAnchor: 'middle',
    fill: 'var(--viz-label)',
    fontSize: '11',
    fontFamily: 'monospace',
    transform: `rotate(-90, 12, ${PAD.top + chartH / 2})`,
  })
  yLabel.textContent = state.yLabel ?? 'operations'
  svg.append(yLabel)

  for (const curve of visibleCurves) {
    const fn = CURVE_FNS[curve.name]
    if (!fn) continue
    const d = buildPath(fn)
    const g = svgEl('g')

    if (curve.highlighted) {
      const glow = svgEl('path', {
        d,
        fill: 'none',
        stroke: curve.color,
        strokeWidth: '6',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        opacity: '0.2',
      })
      glow.classList.add('transition-all', 'duration-500')
      g.append(glow)
    }

    const path = svgEl('path', {
      d,
      fill: 'none',
      stroke: curve.color,
      strokeWidth: curve.highlighted ? '3' : '1.5',
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      opacity: curve.highlighted ? '1' : '0.5',
    })
    path.classList.add('transition-all', 'duration-500')
    g.append(path)

    const dot = svgEl('circle', {
      cx: toX(maxN),
      cy: toY(Math.min(fn(maxN), maxY)),
      r: curve.highlighted ? '4' : '2.5',
      fill: curve.color,
      opacity: curve.highlighted ? '1' : '0.6',
    })
    dot.classList.add('transition-all', 'duration-500')
    g.append(dot)

    svg.append(g)
  }

  const legend = document.createElement('div')
  legend.className = 'flex flex-wrap justify-center gap-x-5 gap-y-2'

  for (const curve of curves) {
    const item = document.createElement('div')
    item.className = 'flex items-center gap-2 text-xs font-mono transition-all duration-300'
    applyStyles(item, {
      opacity: curve.visible ? (curve.highlighted ? 1 : 0.5) : 0.2,
      transform: curve.highlighted ? 'scale(1.1)' : 'scale(1)',
    })

    const swatch = document.createElement('span')
    swatch.className = 'inline-block w-3 h-3 rounded-full'
    applyStyles(swatch, { backgroundColor: curve.color })

    const name = document.createElement('span')
    applyStyles(name, { color: curve.visible ? curve.color : 'var(--viz-muted)' })
    name.textContent = curve.name

    item.append(swatch, name)
    legend.append(item)
  }

  wrap.append(svg, legend)
  return wrap
}
