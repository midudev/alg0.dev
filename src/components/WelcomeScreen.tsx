import type { ReactNode } from 'react'
import type { Locale } from '@i18n/translations'
import type { AlgorithmSummary } from '@lib/types'
import AlgorithmShowcase from '@components/AlgorithmShowcase'

interface WelcomeScreenProps {
  locale?: Locale
  onSelectAlgorithm?: (algo: AlgorithmSummary) => void
  /** SSR chrome from `WelcomeChrome.astro` — title, description, keyboard shortcuts. */
  chrome?: ReactNode
}

/**
 * Home empty state: SSR chrome wrapped around the interactive showcase.
 * `data-welcome-chrome` / `data-welcome-shortcuts` drive the CSS `order` so the
 * showcase lands between title and shortcuts without React owning any of the copy.
 */
export default function WelcomeScreen({ locale, onSelectAlgorithm, chrome }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-6 min-h-0 [&_astro-slot]:contents [&_[data-welcome-chrome]]:order-1 [&_[data-welcome-shortcuts]]:order-3">
      {chrome}
      <div className="order-2 w-full flex justify-center min-h-0">
        <AlgorithmShowcase locale={locale} onSelectAlgorithm={onSelectAlgorithm} />
      </div>
    </div>
  )
}
