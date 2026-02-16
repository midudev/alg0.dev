import type { HighlightType } from './types'

/** Hex colors used by the ArrayVisualizer bar chart */
export const highlightColors: Record<HighlightType, string> = {
  comparing: '#60a5fa',
  swapped: '#f87171',
  selected: '#fbbf24',
  sorted: '#34d399',
  pivot: '#c084fc',
  found: '#4ade80',
  current: '#fb923c',
  searching: '#38bdf8',
  left: '#60a5fa',
  right: '#f472b6',
  merged: '#818cf8',
  minimum: '#fbbf24',
  placed: '#4ade80',
  conflict: '#f87171',
  checking: '#fbbf24',
  wall: '#475569',
  path: '#22d3ee',
  start: '#60a5fa',
  end: '#f87171',
  given: '#94a3b8',
  active: '#fb923c',
  visited: '#a78bfa',
}

/** RGBA styles used by the MatrixVisualizer cells */
export const highlightStyles: Record<string, { bg: string; text: string; border: string }> = {
  placed: { bg: 'rgba(34,197,94,0.12)', text: '#4ade80', border: 'rgba(34,197,94,0.25)' },
  conflict: { bg: 'rgba(239,68,68,0.12)', text: '#f87171', border: 'rgba(239,68,68,0.25)' },
  checking: { bg: 'rgba(234,179,8,0.10)', text: '#fbbf24', border: 'rgba(234,179,8,0.25)' },
  found: { bg: 'rgba(34,197,94,0.18)', text: '#4ade80', border: 'rgba(34,197,94,0.35)' },
  current: { bg: 'rgba(255,255,255,0.08)', text: '#fff', border: 'rgba(255,255,255,0.2)' },
  comparing: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  selected: { bg: 'rgba(251,191,36,0.10)', text: '#fbbf24', border: 'rgba(251,191,36,0.25)' },
  sorted: { bg: 'rgba(52,211,153,0.10)', text: '#34d399', border: 'rgba(52,211,153,0.25)' },
  searching: { bg: 'rgba(56,189,248,0.10)', text: '#38bdf8', border: 'rgba(56,189,248,0.25)' },
  wall: { bg: 'rgba(255,255,255,0.06)', text: '#888', border: 'rgba(255,255,255,0.1)' },
  path: { bg: 'rgba(34,211,238,0.12)', text: '#22d3ee', border: 'rgba(34,211,238,0.25)' },
  start: { bg: 'rgba(96,165,250,0.12)', text: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  end: { bg: 'rgba(248,113,113,0.12)', text: '#f87171', border: 'rgba(248,113,113,0.25)' },
  given: { bg: 'rgba(148,163,184,0.08)', text: '#cbd5e1', border: 'rgba(148,163,184,0.15)' },
  active: { bg: 'rgba(255,255,255,0.08)', text: '#fff', border: 'rgba(255,255,255,0.2)' },
  visited: { bg: 'rgba(167,139,250,0.10)', text: '#a78bfa', border: 'rgba(167,139,250,0.25)' },
  left: { bg: 'rgba(96,165,250,0.10)', text: '#60a5fa', border: 'rgba(96,165,250,0.2)' },
  right: { bg: 'rgba(244,114,182,0.10)', text: '#f472b6', border: 'rgba(244,114,182,0.2)' },
  merged: { bg: 'rgba(129,140,248,0.10)', text: '#818cf8', border: 'rgba(129,140,248,0.25)' },
  pivot: { bg: 'rgba(192,132,252,0.10)', text: '#c084fc', border: 'rgba(192,132,252,0.25)' },
}

export const DEFAULT_BAR_COLOR = '#555'
