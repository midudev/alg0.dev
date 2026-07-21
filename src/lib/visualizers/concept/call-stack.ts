/**
 * Concept visualizer: CallStack.
 */
import type { CallStackState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const FRAME_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  waiting: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-label)' },
  active: { bg: 'rgba(251,146,60,0.12)', border: 'rgba(251,146,60,0.35)', text: '#fb923c' },
  base: { bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.35)', text: '#4ade80' },
  resolved: { bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)', text: '#34d399' },
}

export function renderCallStack(state: CallStackState): HTMLElement {
  const { frames } = state
  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  if (frames.length === 0) {
    const empty = document.createElement('div')
    empty.className = 'text-neutral-500 font-mono text-sm'
    empty.textContent = 'Call stack is empty'
    wrap.append(empty)
    return wrap
  }

  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-3 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest mb-1'
  title.textContent = 'Call Stack'
  wrap.append(title)

  const list = document.createElement('div')
  list.className = 'flex flex-col gap-1.5 w-full max-w-md'

  const reversed = [...frames].reverse()
  reversed.forEach((frame, visualIdx) => {
    const logicalIdx = frames.length - 1 - visualIdx
    const colors = FRAME_COLORS[frame.state] ?? FRAME_COLORS.waiting
    const isTop = logicalIdx === frames.length - 1

    const row = document.createElement('div')
    row.className = 'relative flex items-center transition-all duration-400 ease-in-out'
    applyStyles(row, { opacity: frame.state === 'resolved' ? 0.55 : 1 })

    const depth = document.createElement('div')
    depth.className = 'w-6 text-right text-[10px] font-mono mr-2 transition-colors duration-300'
    applyStyles(depth, { color: colors.text })
    depth.textContent = String(logicalIdx)

    const box = document.createElement('div')
    box.className =
      'flex-1 rounded-lg px-4 py-2.5 font-mono text-sm border transition-all duration-400 ease-in-out relative overflow-hidden'
    applyStyles(box, {
      backgroundColor: colors.bg,
      borderColor: colors.border,
      color: colors.text,
      boxShadow:
        frame.state === 'active' || frame.state === 'base' ? `0 0 20px ${colors.border}` : 'none',
    })

    if (frame.state === 'active' || frame.state === 'base') {
      const pulse = document.createElement('div')
      pulse.className = 'absolute inset-0 rounded-lg animate-pulse'
      applyStyles(pulse, { backgroundColor: colors.bg, opacity: 0.4 })
      box.append(pulse)
    }

    const content = document.createElement('div')
    content.className = 'relative flex items-center justify-between gap-2'

    const label = document.createElement('span')
    label.className = 'font-semibold'
    label.textContent = frame.label
    content.append(label)

    if (frame.detail) {
      const detail = document.createElement('span')
      detail.className = 'text-xs opacity-75'
      detail.textContent = frame.detail
      content.append(detail)
    }

    box.append(content)
    row.append(depth, box)

    if (isTop) {
      const top = document.createElement('div')
      top.className =
        'ml-2 text-[10px] font-mono uppercase tracking-wider transition-colors duration-300'
      applyStyles(top, { color: colors.text })
      top.textContent = '← top'
      row.append(top)
    }

    list.append(row)
  })

  wrap.append(list)

  const baseLine = document.createElement('div')
  baseLine.className = 'w-full max-w-md flex items-center gap-2 mt-1'
  const spacer = document.createElement('div')
  spacer.className = 'w-6'
  const line = document.createElement('div')
  line.className = 'flex-1 h-px bg-white/10'
  baseLine.append(spacer, line)
  wrap.append(baseLine)

  return wrap
}
