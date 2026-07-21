/**
 * Concept visualizer: Buckets.
 */
import type { BucketsState } from '@lib/types'
import { svgEl, applyStyles } from '@lib/visualizers/concept/dom'

function getBucketHighlightStyles(highlight: string | undefined): {
  bg: string
  border: string
  text: string
} {
  switch (highlight) {
    case 'comparing':
      return { bg: 'rgba(59,130,246,0.3)', border: '#3b82f6', text: '#fff' }
    case 'active':
      return { bg: 'rgba(234,179,8,0.3)', border: '#eab308', text: '#fff' }
    case 'current':
      return { bg: 'rgba(168,85,247,0.3)', border: '#a855f7', text: '#fff' }
    case 'found':
      return { bg: 'rgba(74,222,128,0.2)', border: '#4ade80', text: '#4ade80' }
    default:
      return {
        bg: 'var(--subtle-strong)',
        border: 'var(--viz-border)',
        text: '#60a5fa',
      }
  }
}

export function renderBuckets(state: BucketsState): HTMLElement {
  const {
    array,
    buckets,
    range,
    min,
    max,
    bucketSize,
    currentElementIndex,
    activeBucketIndex,
    innerHighlights,
    phase,
    operation,
  } = state

  const wrap = document.createElement('div')
  wrap.className =
    'flex-1 flex flex-col items-center justify-center gap-6 w-full py-4 scale-90 md:scale-100'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Bucket Sort Visualization'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  if (phase === 'initializing' && (min !== undefined || max !== undefined)) {
    const initSection = document.createElement('div')
    initSection.className =
      'flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500'

    const minMaxRow = document.createElement('div')
    minMaxRow.className = 'flex gap-4'

    const minBox = document.createElement('div')
    minBox.className =
      'flex flex-col items-center px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-lg'
    const minLabel = document.createElement('span')
    minLabel.className = 'text-[9px] font-mono text-rose-400 uppercase font-bold'
    minLabel.textContent = 'Current Min'
    const minVal = document.createElement('span')
    minVal.className = 'text-xl font-mono font-bold text-rose-500'
    minVal.textContent = min !== undefined ? String(min) : '—'
    minBox.append(minLabel, minVal)

    const maxBox = document.createElement('div')
    maxBox.className =
      'flex flex-col items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg'
    const maxLabel = document.createElement('span')
    maxLabel.className = 'text-[9px] font-mono text-blue-400 uppercase font-bold'
    maxLabel.textContent = 'Current Max'
    const maxVal = document.createElement('span')
    maxVal.className = 'text-xl font-mono font-bold text-blue-500'
    maxVal.textContent = max !== undefined ? String(max) : '—'
    maxBox.append(maxLabel, maxVal)

    minMaxRow.append(minBox, maxBox)
    initSection.append(minMaxRow)

    if (buckets.length > 0) {
      const formulaBox = document.createElement('div')
      formulaBox.className =
        'bg-neutral-900/50 border border-white/10 rounded-xl px-6 py-4 flex flex-col items-center gap-2 shadow-2xl'

      const formulaTitle = document.createElement('div')
      formulaTitle.className = 'text-[10px] font-mono text-neutral-500 uppercase tracking-widest'
      formulaTitle.textContent = 'Bucket Count Calculation'
      formulaBox.append(formulaTitle)

      const formulaRow = document.createElement('div')
      formulaRow.className = 'flex items-center gap-3 font-mono'

      const formulaInner = document.createElement('div')
      formulaInner.className = 'flex flex-col items-center'

      const formulaHint = document.createElement('div')
      formulaHint.className = 'text-xs text-neutral-400 mb-1'
      formulaHint.textContent = 'floor((max - min) / size) + 1'

      const formulaExpr = document.createElement('div')
      formulaExpr.className = 'flex items-center text-lg'

      const floorL = document.createElement('span')
      floorL.className = 'text-neutral-500'
      floorL.textContent = '⌊'

      const frac = document.createElement('div')
      frac.className = 'flex flex-col items-center px-2'

      const num = document.createElement('div')
      num.className = 'border-b border-white/20 px-2 pb-0.5 mb-0.5'
      const maxSpan = document.createElement('span')
      maxSpan.className = 'text-blue-400'
      maxSpan.textContent = String(max)
      num.append(maxSpan)
      num.append(document.createTextNode(' - '))
      const minSpan = document.createElement('span')
      minSpan.className = 'text-rose-400'
      minSpan.textContent = String(min)
      num.append(minSpan)

      const den = document.createElement('div')
      den.className = 'pt-0.5 text-amber-400 text-sm'
      den.textContent = String(bucketSize)

      frac.append(num, den)

      const floorR = document.createElement('span')
      floorR.className = 'text-neutral-500'
      floorR.textContent = '⌋'

      const plus = document.createElement('span')
      plus.className = 'mx-2 text-white'
      plus.textContent = '+ 1'

      const eq = document.createElement('span')
      eq.className = 'mx-2 text-neutral-400'
      eq.textContent = '='

      const result = document.createElement('span')
      result.className = 'text-2xl font-bold text-green-400'
      result.textContent = String(buckets.length)

      formulaExpr.append(floorL, frac, floorR, plus, eq, result)
      formulaInner.append(formulaHint, formulaExpr)
      formulaRow.append(formulaInner)
      formulaBox.append(formulaRow)

      const hint = document.createElement('div')
      hint.className = 'text-[10px] text-neutral-500 italic mt-1'
      hint.textContent = `Each bucket covers a range of ${bucketSize} values`
      formulaBox.append(hint)

      initSection.append(formulaBox)
    }

    wrap.append(initSection)
  }

  // Main Array Section
  const arraySection = document.createElement('div')
  arraySection.className =
    'flex flex-col items-center gap-3 w-full max-w-4xl px-4 py-3 bg-white/2 rounded-xl border border-white/5'

  const arrayHeader = document.createElement('div')
  arrayHeader.className = 'flex items-center justify-between w-full mb-1'

  const arrayTitle = document.createElement('span')
  arrayTitle.className = 'text-[10px] font-mono text-neutral-500 uppercase tracking-wider'
  arrayTitle.textContent = phase === 'collecting' ? 'Result Array' : 'Input Array'
  arrayHeader.append(arrayTitle)

  if (phase === 'distributing' && currentElementIndex !== undefined) {
    const processing = document.createElement('span')
    processing.className = 'text-[10px] font-mono text-blue-400'
    processing.append(document.createTextNode('Processing: '))
    const val = document.createElement('span')
    val.className = 'font-bold'
    val.textContent = String(array[currentElementIndex])
    processing.append(val)
    arrayHeader.append(processing)
  }

  if (phase === 'initializing') {
    const status = document.createElement('span')
    status.className = 'text-[10px] font-mono text-amber-400'
    status.textContent = buckets.length > 0 ? 'Creating Buckets...' : 'Scanning Range...'
    arrayHeader.append(status)
  }

  arraySection.append(arrayHeader)

  const arrayCells = document.createElement('div')
  arrayCells.className = 'flex flex-wrap justify-center gap-1.5'

  array.forEach((val, i) => {
    const isProcessing = i === currentElementIndex
    const isCollected =
      phase === 'collecting' && currentElementIndex != null && i < currentElementIndex

    const cellWrap = document.createElement('div')
    cellWrap.className = 'relative group h-10 w-10'

    const cell = document.createElement('div')
    cell.className =
      'absolute inset-0 rounded border flex items-center justify-center font-mono text-sm transition-all duration-500'
    applyStyles(cell, {
      backgroundColor: isProcessing
        ? 'rgba(59,130,246,0.25)'
        : isCollected
          ? 'rgba(74,222,128,0.1)'
          : 'var(--subtle)',
      borderColor: isProcessing ? '#3b82f6' : isCollected ? '#4ade8050' : 'var(--viz-border)',
      color: isProcessing ? '#fff' : isCollected ? '#4ade80' : 'var(--viz-label)',
      transform: isProcessing ? 'translateY(-4px)' : 'none',
      boxShadow: isProcessing ? '0 4px 12px rgba(59,130,246,0.3)' : 'none',
      opacity: isCollected ? 0.6 : 1,
    })
    cell.textContent = String(val)
    cellWrap.append(cell)

    if (isProcessing) {
      const arrow = document.createElement('div')
      arrow.className = 'absolute -top-6 left-1/2 -translate-x-1/2 text-blue-400 animate-bounce'
      const arrowSvg = svgEl('svg', {
        width: '10',
        height: '10',
        viewBox: '0 0 10 10',
        fill: 'currentColor',
      })
      arrowSvg.append(svgEl('path', { d: 'M5 10L0 0H10L5 10Z' }))
      arrow.append(arrowSvg)
      cellWrap.append(arrow)
    }

    arrayCells.append(cellWrap)
  })

  arraySection.append(arrayCells)
  wrap.append(arraySection)

  // Buckets Section
  const bucketsSection = document.createElement('div')
  bucketsSection.className = 'flex flex-wrap justify-center gap-x-4 gap-y-8 mt-4 w-full px-4'

  buckets.forEach((bucket, bIdx) => {
    const isActive = bIdx === activeBucketIndex
    const rangeStart = range ? range.min + bIdx * (bucketSize ?? 1) : 0
    const rangeEnd = range ? rangeStart + (bucketSize ?? 1) - 1 : 0

    const col = document.createElement('div')
    col.className = 'flex flex-col items-center min-w-[80px]'

    const rangeLabel = document.createElement('div')
    rangeLabel.className =
      'mb-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono transition-colors duration-300'
    applyStyles(rangeLabel, {
      backgroundColor: isActive ? 'rgba(59,130,246,0.15)' : 'var(--subtle)',
      color: isActive ? '#60a5fa' : 'var(--viz-muted)',
    })
    rangeLabel.textContent = `${rangeStart}–${rangeEnd}`
    col.append(rangeLabel)

    const bucketGroup = document.createElement('div')
    bucketGroup.className = 'relative group'

    const bucketBody = document.createElement('div')
    bucketBody.className =
      'w-20 min-h-[120px] rounded-t-xl border-x-2 border-t-2 flex flex-col items-center p-2 gap-1.5 transition-all duration-500'
    applyStyles(bucketBody, {
      backgroundColor: isActive ? 'rgba(59,130,246,0.08)' : 'var(--subtle)',
      borderColor: isActive ? 'rgba(59,130,246,0.5)' : 'var(--viz-border)',
      boxShadow: isActive ? '0 -8px 20px rgba(59,130,246,0.15)' : 'none',
    })

    bucket.forEach((val, vIdx) => {
      const highlight = isActive ? innerHighlights?.[vIdx] : undefined
      const styles = getBucketHighlightStyles(highlight)

      const item = document.createElement('div')
      item.className =
        'w-full h-8 flex items-center justify-center font-mono text-xs font-bold rounded shadow-sm transition-all duration-300 hover:scale-105'
      applyStyles(item, {
        backgroundColor: styles.bg,
        borderColor: styles.border,
        borderWidth: '1px',
        color: styles.text,
        animation:
          phase === 'distributing' && isActive && vIdx === bucket.length - 1
            ? 'pop 0.3s ease-out'
            : 'none',
        transform: highlight ? 'scale(1.05)' : 'none',
        zIndex: highlight ? 10 : 1,
      })
      item.textContent = String(val)
      bucketBody.append(item)
    })

    if (bucket.length === 0) {
      const empty = document.createElement('div')
      empty.className = 'flex-1 flex flex-col items-center justify-center gap-2 opacity-20'
      for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div')
        dot.className = 'w-1 h-1 rounded-full bg-white'
        empty.append(dot)
      }
      bucketBody.append(empty)
    }

    bucketGroup.append(bucketBody)

    const bucketBottom = document.createElement('div')
    bucketBottom.className =
      'w-20 h-3 rounded-b-xl border-x-2 border-b-2 transition-all duration-500'
    applyStyles(bucketBottom, {
      backgroundColor: isActive ? 'rgba(59,130,246,0.2)' : 'var(--subtle)',
      borderColor: isActive ? 'rgba(59,130,246,0.5)' : 'var(--viz-border)',
    })
    bucketGroup.append(bucketBottom)

    if (isActive) {
      const activeInd = document.createElement('div')
      activeInd.className = 'absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap'
      const activeSpan = document.createElement('span')
      activeSpan.className =
        'text-[10px] font-bold text-blue-400 uppercase tracking-tighter animate-pulse'
      activeSpan.textContent = 'Active'
      activeInd.append(activeSpan)
      bucketGroup.append(activeInd)
    }

    col.append(bucketGroup)

    const bucketIndex = document.createElement('div')
    bucketIndex.className = 'mt-7 text-[10px] font-mono text-neutral-500 font-bold'
    bucketIndex.textContent = `Bucket ${bIdx}`
    col.append(bucketIndex)

    bucketsSection.append(col)
  })

  wrap.append(bucketsSection)

  const style = document.createElement('style')
  style.textContent = `
        @keyframes pop {
          0% { transform: scale(0.8); opacity: 0; }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
      `
  wrap.append(style)

  return wrap
}
