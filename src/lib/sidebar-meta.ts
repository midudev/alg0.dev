/**
 * SSR-only presentation tokens for SiteSidebar.astro.
 * Do not import this from client bundles — icons/colors ship as static HTML/CSS.
 */

export interface CategoryColor {
  /** Tailwind classes for the category icon */
  icon: string
  /** Tailwind classes for the count badge */
  badge: string
  /** Tailwind border class for the list rail */
  line: string
  /** CSS color for the selected algorithm link (used as --sidebar-selected) */
  selectedCss: string
  /** Tailwind classes for the selected indicator dot */
  dot: string
}

export const defaultCategoryColor: CategoryColor = {
  icon: 'text-neutral-400',
  badge: 'bg-white/[0.04] text-neutral-600',
  line: 'border-white/[0.08]',
  selectedCss: 'rgb(212 212 212)', // neutral-300
  dot: 'bg-neutral-400 shadow-[0_0_6px_rgba(163,163,163,0.45)]',
}

export const categoryColors: Record<string, CategoryColor> = {
  Concepts: {
    icon: 'text-sky-400',
    badge: 'bg-sky-500/10 text-sky-400/70',
    line: 'border-sky-500/20',
    selectedCss: 'rgb(125 211 252)', // sky-300
    dot: 'bg-sky-400 shadow-[0_0_6px_rgba(56,189,248,0.45)]',
  },
  'Data Structures': {
    icon: 'text-violet-400',
    badge: 'bg-violet-500/10 text-violet-400/70',
    line: 'border-violet-500/20',
    selectedCss: 'rgb(196 181 253)', // violet-300
    dot: 'bg-violet-400 shadow-[0_0_6px_rgba(167,139,250,0.45)]',
  },
  Sorting: {
    icon: 'text-emerald-400',
    badge: 'bg-emerald-500/10 text-emerald-400/70',
    line: 'border-emerald-500/20',
    selectedCss: 'rgb(110 231 183)', // emerald-300
    dot: 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.45)]',
  },
  Searching: {
    icon: 'text-amber-400',
    badge: 'bg-amber-500/10 text-amber-400/70',
    line: 'border-amber-500/20',
    selectedCss: 'rgb(252 211 77)', // amber-300
    dot: 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.45)]',
  },
  Graphs: {
    icon: 'text-cyan-400',
    badge: 'bg-cyan-500/10 text-cyan-400/70',
    line: 'border-cyan-500/20',
    selectedCss: 'rgb(103 232 249)', // cyan-300
    dot: 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.45)]',
  },
  Backtracking: {
    icon: 'text-rose-400',
    badge: 'bg-rose-500/10 text-rose-400/70',
    line: 'border-rose-500/20',
    selectedCss: 'rgb(253 164 175)', // rose-300
    dot: 'bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.45)]',
  },
  'Dynamic Programming': {
    icon: 'text-orange-400',
    badge: 'bg-orange-500/10 text-orange-400/70',
    line: 'border-orange-500/20',
    selectedCss: 'rgb(253 186 116)', // orange-300
    dot: 'bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.45)]',
  },
  'Divide and Conquer': {
    icon: 'text-indigo-400',
    badge: 'bg-indigo-500/10 text-indigo-400/70',
    line: 'border-indigo-500/20',
    selectedCss: 'rgb(165 180 252)', // indigo-300
    dot: 'bg-indigo-400 shadow-[0_0_6px_rgba(129,140,248,0.45)]',
  },
  Math: {
    icon: 'text-fuchsia-400',
    badge: 'bg-fuchsia-500/10 text-fuchsia-400/70',
    line: 'border-fuchsia-500/20',
    selectedCss: 'rgb(240 171 252)', // fuchsia-300
    dot: 'bg-fuchsia-400 shadow-[0_0_6px_rgba(232,121,249,0.45)]',
  },
}

/** SVG path `d` for each category icon (24×24 stroke icons) — inlined by Astro at build time. */
export const categoryIconPaths: Record<string, string> = {
  Concepts:
    'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  'Data Structures':
    'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  Sorting: 'M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5',
  Searching: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  Graphs: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  Backtracking: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
  'Dynamic Programming':
    'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v.375',
  'Divide and Conquer':
    'M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  Math: 'M5 5h14M9 5c0 4-1.5 10-3 14M15 5c0 4 1.5 10 3 14',
}

export function getCategoryColor(name: string): CategoryColor {
  return categoryColors[name] ?? defaultCategoryColor
}

export function categoryDomId(name: string): string {
  return `category-${name.toLowerCase().replace(/\s+/g, '-')}`
}

export const SIDEBAR_MAX_WIDTH = 260
export const SIDEBAR_COLLAPSE_THRESHOLD = 100
