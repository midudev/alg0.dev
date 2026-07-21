/**
 * Concept visualizer: CoinChange.
 */
import type { CoinChangeState } from '@lib/types'
import { applyStyles } from '@lib/visualizers/concept/dom'

export function renderCoinChange(state: CoinChangeState): HTMLElement {
  const { coins, target, selected, remaining, approach, greedyResult, dpResult, operation } = state

  const approachLabel =
    approach === 'greedy' ? 'Greedy' : approach === 'dp' ? 'Dynamic Programming' : 'Comparison'
  const approachColor =
    approach === 'greedy' ? '#fb923c' : approach === 'dp' ? '#60a5fa' : '#c084fc'

  const wrap = document.createElement('div')
  wrap.className = 'flex-1 flex flex-col items-center justify-center gap-4 w-full'

  const title = document.createElement('div')
  title.className = 'text-neutral-500 font-mono text-[11px] uppercase tracking-widest'
  title.textContent = 'Greedy vs DP'
  wrap.append(title)

  if (operation) {
    const badge = document.createElement('div')
    badge.className =
      'font-mono text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300'
    badge.textContent = operation
    wrap.append(badge)
  }

  const approachBadge = document.createElement('div')
  approachBadge.className = 'font-mono text-xs font-bold px-3 py-1 rounded'
  applyStyles(approachBadge, {
    color: approachColor,
    backgroundColor: `${approachColor}15`,
    border: `1px solid ${approachColor}30`,
  })
  approachBadge.textContent = approachLabel
  wrap.append(approachBadge)

  const targetLine = document.createElement('div')
  targetLine.className = 'font-mono text-sm text-neutral-400'
  targetLine.append(document.createTextNode('target = '))
  const targetVal = document.createElement('span')
  targetVal.className = 'text-white font-bold text-lg'
  targetVal.textContent = String(target)
  targetLine.append(targetVal)
  if (remaining > 0 && remaining < target) {
    const rem = document.createElement('span')
    rem.className = 'text-neutral-500 ml-2'
    rem.append(document.createTextNode('remaining: '))
    const remVal = document.createElement('span')
    remVal.className = 'text-amber-300'
    remVal.textContent = String(remaining)
    rem.append(remVal)
    targetLine.append(rem)
  }
  wrap.append(targetLine)

  const coinsRow = document.createElement('div')
  coinsRow.className = 'flex items-center gap-2'
  const coinsLabel = document.createElement('span')
  coinsLabel.className = 'text-[10px] font-mono text-neutral-500 uppercase'
  coinsLabel.textContent = 'coins:'
  const coinsList = document.createElement('div')
  coinsList.className = 'flex gap-1.5'
  coins.forEach((c) => {
    const coin = document.createElement('div')
    coin.className =
      'w-10 h-10 rounded-full border border-white/15 bg-white/5 flex items-center justify-center font-mono text-sm font-bold text-neutral-400'
    coin.textContent = String(c)
    coinsList.append(coin)
  })
  coinsRow.append(coinsLabel, coinsList)
  wrap.append(coinsRow)

  if (selected.length > 0) {
    const pickedRow = document.createElement('div')
    pickedRow.className = 'flex items-center gap-2'
    const pickedLabel = document.createElement('span')
    pickedLabel.className = 'text-[10px] font-mono text-neutral-500 uppercase'
    pickedLabel.textContent = 'picked:'
    const pickedList = document.createElement('div')
    pickedList.className = 'flex gap-1.5'
    selected.forEach((c) => {
      const coin = document.createElement('div')
      coin.className =
        'w-10 h-10 rounded-full border flex items-center justify-center font-mono text-sm font-bold transition-all duration-300'
      applyStyles(coin, {
        backgroundColor: `${approachColor}18`,
        borderColor: `${approachColor}50`,
        color: approachColor,
        boxShadow: `0 0 12px ${approachColor}30`,
      })
      coin.textContent = String(c)
      pickedList.append(coin)
    })
    const sum = document.createElement('span')
    sum.className = 'text-[10px] font-mono text-neutral-500'
    sum.textContent = `= ${selected.reduce((a, b) => a + b, 0)} (${selected.length} coins)`
    pickedRow.append(pickedLabel, pickedList, sum)
    wrap.append(pickedRow)
  }

  if (approach === 'compare' && greedyResult && dpResult) {
    const compare = document.createElement('div')
    compare.className = 'flex gap-6 mt-2'

    const greedyBox = document.createElement('div')
    greedyBox.className =
      'flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-orange-400/20 bg-orange-400/5'
    const greedyTitle = document.createElement('span')
    greedyTitle.className = 'text-[10px] font-mono text-orange-400 uppercase font-bold'
    greedyTitle.textContent = 'Greedy'
    const greedyCoins = document.createElement('div')
    greedyCoins.className = 'flex gap-1'
    greedyResult.forEach((c) => {
      const coin = document.createElement('div')
      coin.className =
        'w-8 h-8 rounded-full bg-orange-400/15 border border-orange-400/30 flex items-center justify-center font-mono text-xs font-bold text-orange-400'
      coin.textContent = String(c)
      greedyCoins.append(coin)
    })
    const greedyCount = document.createElement('span')
    greedyCount.className = 'font-mono text-xs text-orange-300'
    greedyCount.textContent = `${greedyResult.length} coins`
    greedyBox.append(greedyTitle, greedyCoins, greedyCount)

    const dpBox = document.createElement('div')
    dpBox.className =
      'flex flex-col items-center gap-1 px-4 py-3 rounded-lg border border-blue-400/20 bg-blue-400/5'
    const dpTitle = document.createElement('span')
    dpTitle.className = 'text-[10px] font-mono text-blue-400 uppercase font-bold'
    dpTitle.textContent = 'DP (optimal)'
    const dpCoins = document.createElement('div')
    dpCoins.className = 'flex gap-1'
    dpResult.forEach((c) => {
      const coin = document.createElement('div')
      coin.className =
        'w-8 h-8 rounded-full bg-blue-400/15 border border-blue-400/30 flex items-center justify-center font-mono text-xs font-bold text-blue-400'
      coin.textContent = String(c)
      dpCoins.append(coin)
    })
    const dpCount = document.createElement('span')
    dpCount.className = 'font-mono text-xs text-blue-300'
    dpCount.textContent = `${dpResult.length} coins ✓`
    dpBox.append(dpTitle, dpCoins, dpCount)

    compare.append(greedyBox, dpBox)
    wrap.append(compare)
  }

  return wrap
}
