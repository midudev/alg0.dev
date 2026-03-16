import { useState, useRef, useEffect } from 'react'
import type { Algorithm } from '@lib/types'
import type { Locale } from '@i18n/translations'
import { translations, getCategoryName } from '@i18n/translations'
import { algorithms, categories } from '@lib/algorithms'

interface CompareSelectorProps {
    selected: Algorithm | null
    onSelect: (algo: Algorithm) => void
    locale: Locale
    label: string
}

export default function CompareSelector({ selected, onSelect, locale, label }: CompareSelectorProps) {
    const t = translations[locale]
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState('')
    const containerRef = useRef<HTMLDivElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen && searchRef.current) {
            searchRef.current.focus()
        }
    }, [isOpen])

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setSearch('')
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false)
                setSearch('')
            }
        }
        if (isOpen) {
            window.addEventListener('keydown', handler)
            return () => window.removeEventListener('keydown', handler)
        }
    }, [isOpen])

    const filteredCategories = categories
        .map((cat) => ({
            ...cat,
            algorithms: cat.algorithms.filter((a) =>
                a.name.toLowerCase().includes(search.toLowerCase()),
            ),
        }))
        .filter((cat) => cat.algorithms.length > 0)

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/16 transition-all text-left group"
                aria-label={label}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
            >
                {selected ? (
                    <>
                        <span className="flex-1 text-sm text-white truncate">{selected.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 text-neutral-400 shrink-0">
                            {getCategoryName(locale, selected.category)}
                        </span>
                    </>
                ) : (
                    <span className="flex-1 text-sm text-neutral-500">{t.chooseAlgorithm}</span>
                )}
                <svg
                    className={`w-3.5 h-3.5 text-neutral-500 transition-transform shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M3.46966 5.46966L3.99999 4.93933L4.53032 5.46966L7.99999 8.93933L11.4697 5.46966L12 4.93933L12.5303 5.46966L13.0607 5.99999L7.99999 11.0607L2.93933 5.99999L3.46966 5.46966Z"
                    />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-950 border border-white/12 rounded-xl shadow-2xl z-50 max-h-80 overflow-hidden flex flex-col animate-in">
                    {/* Search */}
                    <div className="p-2 border-b border-white/8">
                        <input
                            ref={searchRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t.searchAlgorithms}
                            className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-white/20 transition-colors"
                        />
                    </div>

                    {/* Algorithm list */}
                    <div className="overflow-y-auto flex-1" role="listbox" aria-label={label}>
                        {filteredCategories.map((cat) => (
                            <div key={cat.name}>
                                <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-neutral-600 font-semibold sticky top-0 bg-neutral-950">
                                    {getCategoryName(locale, cat.name)}
                                </div>
                                {cat.algorithms.map((algo) => {
                                    const isSelected = selected?.id === algo.id
                                    return (
                                        <button
                                            key={algo.id}
                                            onClick={() => {
                                                onSelect(algo)
                                                setIsOpen(false)
                                                setSearch('')
                                            }}
                                            className={`w-full text-left px-3 py-2 text-sm transition-colors flex items-center gap-2 ${isSelected
                                                    ? 'bg-white/8 text-white'
                                                    : 'text-neutral-400 hover:bg-white/[0.04] hover:text-white'
                                                }`}
                                            role="option"
                                            aria-selected={isSelected}
                                        >
                                            <span className="flex-1 truncate">{algo.name}</span>
                                            <span
                                                className={`text-[9px] px-1 py-0.5 rounded ${algo.difficulty === 'easy'
                                                        ? 'bg-emerald-500/10 text-emerald-400'
                                                        : algo.difficulty === 'intermediate'
                                                            ? 'bg-amber-500/10 text-amber-400'
                                                            : 'bg-red-500/10 text-red-400'
                                                    }`}
                                            >
                                                {algo.difficulty}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        ))}
                        {filteredCategories.length === 0 && (
                            <div className="px-3 py-6 text-sm text-neutral-600 text-center">
                                No results
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
