/**
 * Concept visualizer: CoinChangeDp.
 */
import type { CoinChangeDpState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

const DP_COLORS = {
  empty: { bg: 'var(--viz-cell)', border: 'var(--viz-border)', text: 'var(--viz-muted)' },
  filled: { bg: 'var(--subtle)', border: 'var(--viz-border)', text: 'var(--viz-label)' },
  active: { bg: 'rgba(96,165,250,0.15)', border: 'rgba(96,165,250,0.38)', text: '#60a5fa' },
  source: { bg: 'rgba(251,146,60,0.14)', border: 'rgba(251,146,60,0.4)', text: '#fb923c' },
  result: { bg: 'rgba(250,204,21,0.14)', border: 'rgba(250,204,21,0.4)', text: '#eab308' },
}

const COIN_COLORS = {
  idle: { bg: 'rgba(255,255,255,0.05)', border: 'var(--viz-border)', text: 'var(--viz-label)' },
  active: { bg: 'rgba(96,165,250,0.18)', border: 'rgba(96,165,250,0.5)', text: '#60a5fa' },
  used: { bg: 'rgba(250,204,21,0.18)', border: 'rgba(250,204,21,0.5)', text: '#eab308' },
}

const CANDIDATE_COLORS = {
  idle: {
    bg: 'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.12)',
    text: 'var(--viz-label)',
  },
  best: { bg: 'rgba(250,204,21,0.14)', border: 'rgba(250,204,21,0.42)', text: '#eab308' },
}

function makeCell(
  value: string,
  colors: { bg: string; border: string; text: string },
  wide = false,
) {
  const cell = document.createElement('div')
  cell.className = `${wide ? 'w-16 md:w-18' : 'w-14 md:w-16'} h-12 rounded-lg border flex items-center justify-center font-mono text-sm md:text-base font-bold transition-all duration-300`
  applyStyles(cell, {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    color: colors.text,
    boxShadow: colors.border !== 'var(--viz-border)' ? `0 0 12px ${colors.border}` : 'none',
  })
  cell.textContent = value
  return cell
}

function makeIndexRow(length: number, wide = false) {
  const row = document.createElement('div')
  row.className = 'flex gap-1'
  for (let i = 0; i < length; i++) {
    const idx = document.createElement('div')
    idx.className = `${wide ? 'w-16 md:w-18' : 'w-14 md:w-16'} text-center text-[9px] font-mono text-neutral-600`
    idx.textContent = String(i)
    row.append(idx)
  }
  return row
}

function makeCoin(value: number, colors: { bg: string; border: string; text: string }) {
  const coin = document.createElement('div')
  coin.className =
    'w-10 h-10 rounded-full border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300'
  applyStyles(coin, {
    backgroundColor: colors.bg,
    borderColor: colors.border,
    color: colors.text,
    boxShadow: colors.border !== 'var(--viz-border)' ? `0 0 12px ${colors.border}` : 'none',
  })
  coin.textContent = String(value)
  return coin
}

function candidateValue(dp: (number | null)[], index: number) {
  const base = dp[index]
  return base == null ? null : base + 1
}

export function renderCoinChangeDp(state: CoinChangeDpState): HTMLElement {
  const {
    coins,
    target,
    dp,
    activeAmount,
    candidateCoins = [],
    bestCoin,
    phase,
    result,
    selected,
    operation,
  } = state

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Coin Change · Min Coins'
  wrap.append(title)

  const goal = document.createElement('div')
  goal.className = 'font-mono text-sm text-neutral-400'
  goal.append(document.createTextNode('target = '))
  const goalVal = document.createElement('span')
  goalVal.className = 'text-white font-bold text-lg'
  goalVal.textContent = String(target)
  goal.append(goalVal)
  wrap.append(goal)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  const coinsRow = document.createElement('div')
  coinsRow.className = 'flex items-center gap-2'
  const coinsLabel = document.createElement('span')
  coinsLabel.className = 'text-[10px] font-mono text-neutral-500 uppercase'
  coinsLabel.textContent = 'coins:'
  const coinsList = document.createElement('div')
  coinsList.className = 'flex gap-1.5'
  coins.forEach((c) => {
    const used = phase === 'result' && (selected ?? []).includes(c)
    const active = phase !== 'result' && c === bestCoin
    const colors = used ? COIN_COLORS.used : active ? COIN_COLORS.active : COIN_COLORS.idle
    coinsList.append(makeCoin(c, colors))
  })
  coinsRow.append(coinsLabel, coinsList)
  wrap.append(coinsRow)

  const table = document.createElement('div')
  table.className = 'flex flex-col gap-1 items-center'
  const dpLabel = document.createElement('div')
  dpLabel.className =
    'text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-500 self-start'
  dpLabel.textContent = 'dp[a] = min coins'
  table.append(dpLabel)

  const sourceIndices = new Set(candidateCoins.map((c) => (activeAmount ?? 0) - c))
  const cells = document.createElement('div')
  cells.className = 'flex gap-1'
  dp.forEach((value, index) => {
    const isResult = phase === 'result' && index === target
    const isActive = phase === 'fill' && index === activeAmount
    const isSource = phase === 'fill' && sourceIndices.has(index)
    const colors = isResult
      ? DP_COLORS.result
      : isActive
        ? DP_COLORS.active
        : isSource
          ? DP_COLORS.source
          : value == null
            ? DP_COLORS.empty
            : DP_COLORS.filled
    cells.append(makeCell(value == null ? '∞' : String(value), colors))
  })
  table.append(cells, makeIndexRow(dp.length))
  wrap.append(table)

  if (phase === 'fill' && activeAmount != null && candidateCoins.length > 0) {
    const bracket = document.createElement('div')
    bracket.className = 'flex flex-col items-center gap-2'

    const eq = document.createElement('div')
    eq.className = 'font-mono text-sm text-neutral-300'
    eq.textContent = `dp[${activeAmount}] = min(`
    bracket.append(eq)

    const candRow = document.createElement('div')
    candRow.className = 'flex flex-wrap items-center justify-center gap-1.5'
    candidateCoins.forEach((c) => {
      const src = activeAmount - c
      const val = candidateValue(dp, src)
      const isBest = val != null && val === dp[activeAmount]
      const card = document.createElement('div')
      card.className = 'flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border'
      applyStyles(card, {
        backgroundColor: isBest ? CANDIDATE_COLORS.best.bg : CANDIDATE_COLORS.idle.bg,
        borderColor: isBest ? CANDIDATE_COLORS.best.border : CANDIDATE_COLORS.idle.border,
      })
      const top = document.createElement('div')
      top.className = 'font-mono text-[10px] text-neutral-500'
      top.textContent = `coin ${c} · dp[${src}]+1`
      const value = document.createElement('div')
      value.className = 'font-mono text-sm font-bold'
      applyStyles(value, {
        color: isBest ? CANDIDATE_COLORS.best.text : CANDIDATE_COLORS.idle.text,
      })
      value.textContent = val == null ? '∞' : String(val)
      card.append(top, value)
      if (isBest) {
        const check = document.createElement('div')
        check.className = 'font-mono text-[9px] text-amber-300'
        check.textContent = '✓ min'
        card.append(check)
      }
      candRow.append(card)
    })
    bracket.append(candRow)

    const close = document.createElement('div')
    close.className = 'font-mono text-sm text-neutral-300'
    close.textContent = `) = ${dp[activeAmount] == null ? '∞' : dp[activeAmount]}`
    bracket.append(close)
    wrap.append(bracket)
  }

  if (phase === 'result' && result != null) {
    const summary = document.createElement('div')
    summary.className = 'flex flex-col items-center gap-2'

    const answer = document.createElement('div')
    answer.className = 'font-mono text-sm text-neutral-300'
    answer.append(document.createTextNode('minimum coins = '))
    const answerVal = document.createElement('span')
    answerVal.className = 'text-amber-300 font-bold text-2xl'
    answerVal.textContent = String(result)
    answer.append(answerVal)
    summary.append(answer)

    if (selected && selected.length > 0) {
      const pickedRow = document.createElement('div')
      pickedRow.className = 'flex items-center gap-1.5'
      const pickedLabel = document.createElement('span')
      pickedLabel.className = 'text-[10px] font-mono text-neutral-500 uppercase'
      pickedLabel.textContent = 'picked:'
      pickedRow.append(pickedLabel)
      selected.forEach((c) => pickedRow.append(makeCoin(c, COIN_COLORS.used)))
      const sum = document.createElement('span')
      sum.className = 'text-[10px] font-mono text-neutral-500'
      sum.textContent = `= ${selected.reduce((a, b) => a + b, 0)}`
      pickedRow.append(sum)
      summary.append(pickedRow)
    }

    wrap.append(summary)
  }

  return wrap
}
