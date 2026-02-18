import type { Translations, Locale } from '@i18n/translations'
import type { Algorithm } from '@lib/types'
import AlgorithmShowcase from '@components/AlgorithmShowcase'

interface WelcomeScreenProps {
  t: Translations
  locale?: Locale
  onSelectAlgorithm?: (algo: Algorithm) => void
}

export default function WelcomeScreen({ t, locale, onSelectAlgorithm }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 md:gap-6 min-h-0">
      {/* Welcome header */}
      <div className="text-center max-w-md shrink-0 px-4 md:px-0">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/4 flex items-center justify-center border border-white/8 mx-auto mb-3 md:mb-4">
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
            />
          </svg>
        </div>
        <h1 className="text-lg md:text-xl font-semibold text-white mb-2 text-balance font-heading">
          {t.welcomeTitle}
        </h1>
        <p className="text-xs md:text-sm text-neutral-500 leading-relaxed  max-w-lg text-balance inline-block">
          {t.welcomeDescription}
        </p>
      </div>

      {/* Algorithm Showcase */}
      <AlgorithmShowcase locale={locale} onSelectAlgorithm={onSelectAlgorithm} />

      {/* Keyboard shortcuts — hidden on mobile (touch devices don't use keyboards) */}
      <div className="hidden md:flex items-center justify-center gap-3 text-xs text-neutral-600 shrink-0">
        <div className="flex items-center gap-2">
          <kbd className="w-8 h-8 flex items-center justify-center bg-white/6 rounded-lg border border-white/10 text-white/80">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1 -1v-3" />
            </svg>
          </kbd>
          <span>{t.playPauseShortcut}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <kbd className="w-8 h-8 flex items-center justify-center bg-white/6 rounded-lg border border-white/10 text-white/80">
              <svg
                width="16"
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                style={{ color: 'currentcolor' }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.46966 13.7803L6.99999 14.3107L8.06065 13.25L7.53032 12.7197L3.56065 8.75001H14.25H15V7.25001H14.25H3.56065L7.53032 3.28034L8.06065 2.75001L6.99999 1.68935L6.46966 2.21968L1.39644 7.2929C1.00592 7.68342 1.00592 8.31659 1.39644 8.70711L6.46966 13.7803Z"
                  fill="currentColor"
                />
              </svg>
            </kbd>
            <kbd className="w-8 h-8 flex items-center justify-center bg-white/6 rounded-lg border border-white/10 text-white/80">
              <svg
                width="16"
                height="16"
                strokeLinejoin="round"
                viewBox="0 0 16 16"
                style={{ color: 'currentcolor' }}
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                  fill="currentColor"
                />
              </svg>
            </kbd>
          </div>
          <span>{t.stepShortcut}</span>
        </div>
      </div>
    </div>
  )
}
