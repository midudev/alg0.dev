import { useState } from 'react'
import type { Algorithm, Category } from '@lib/types'
import type { Locale } from '@i18n/translations'
import { translations, getCategoryName } from '@i18n/translations'

interface SidebarProps {
  categories: Category[]
  selectedId: string | null
  onSelect: (algo: Algorithm) => void
  locale?: Locale
}

const categoryIcons: Record<string, JSX.Element> = {
  Concepts: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
      />
    </svg>
  ),
  Sorting: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
      />
    </svg>
  ),
  Searching: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  ),
  Graphs: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
      />
    </svg>
  ),
  Backtracking: (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
      />
    </svg>
  ),
  'Dynamic Programming': (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v.375"
      />
    </svg>
  ),
  'Divide and Conquer': (
    <svg
      className="w-3.5 h-3.5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
}

export default function Sidebar({ categories, selectedId, onSelect, locale = 'en' }: SidebarProps) {
  const t = translations[locale]
  const [expanded, setExpanded] = useState<Set<string>>(new Set(categories.map((c) => c.name)))
  const [search, setSearch] = useState('')

  const toggle = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const filtered = categories
    .map((cat) => ({
      ...cat,
      algorithms: cat.algorithms.filter(
        (a) =>
          a.name.toLowerCase().includes(search.toLowerCase()) ||
          getCategoryName(locale, cat.name).toLowerCase().includes(search.toLowerCase()),
      ),
    }))
    .filter((cat) => cat.algorithms.length > 0)

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 pb-2">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <input
            type="search"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label={t.searchPlaceholder}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg pl-9 pr-3 py-2 text-xs text-neutral-300 placeholder-neutral-600 outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
          />
        </div>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4" aria-label="Algorithm list">
        {filtered.map((category) => {
          const isExpanded = expanded.has(category.name)
          const categoryId = `category-${category.name.toLowerCase().replace(/\s+/g, '-')}`

          return (
            <div key={category.name} className="mb-1">
              <button
                onClick={() => toggle(category.name)}
                aria-expanded={isExpanded}
                aria-controls={categoryId}
                className="w-full flex items-center justify-between px-2.5 py-2 text-[11px] font-semibold text-neutral-500 hover:text-neutral-400 transition-colors rounded-md hover:bg-white/[0.03] uppercase tracking-widest"
              >
                <div className="flex items-center gap-2">
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 text-neutral-600 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="flex items-center gap-1.5">
                    {categoryIcons[category.name]}
                    {getCategoryName(locale, category.name)}
                  </span>
                </div>
                <span
                  className="text-[10px] font-normal text-neutral-600 bg-white/[0.04] px-1.5 py-0.5 rounded-full tabular-nums"
                  aria-label={t.algorithmCountLabel.replace('{count}', String(category.algorithms.length))}
                >
                  {category.algorithms.length}
                </span>
              </button>

              <div
                id={categoryId}
                role="group"
                aria-label={`${getCategoryName(locale, category.name)} algorithms`}
                className="overflow-hidden transition-all duration-200"
                style={{
                  maxHeight: isExpanded ? `${category.algorithms.length * 36}px` : '0px',
                  opacity: isExpanded ? 1 : 0,
                }}
              >
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-white/[0.06] pl-2">
                  {category.algorithms.map((algo) => (
                    <button
                      key={algo.id}
                      onClick={() => onSelect(algo)}
                      aria-current={selectedId === algo.id ? 'true' : undefined}
                      className={`w-full text-left px-3 py-1.5 text-[13px] rounded-md transition-all duration-150 ${
                        selectedId === algo.id
                          ? 'bg-white/[0.08] text-white font-medium'
                          : 'text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      {algo.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="text-[10px] text-neutral-700 text-center">
          {t.algorithmsCount.replace(
            '{count}',
            String(categories.reduce((sum, c) => sum + c.algorithms.length, 0)),
          )}
        </div>
      </div>
    </div>
  )
}
