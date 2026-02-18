import type { Algorithm } from '@lib/types'
import type { Locale, Translations } from '@i18n/translations'
import { getCategoryName, locales, localeNames } from '@i18n/translations'
import Controls from '@components/Controls'

interface HeaderProps {
  locale: Locale
  t: Translations
  selectedAlgorithm: Algorithm | null
  sidebarCollapsed: boolean
  codePanelCollapsed: boolean
  onExpandSidebar: () => void
  onExpandCodePanel: () => void
  // Controls props
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  onTogglePlay: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onSpeedChange: (speed: number) => void
  onStepChange: (step: number) => void
  // Mobile props
  isMobile?: boolean
  onToggleMobileSidebar?: () => void
  onToggleMobileCodePanel?: () => void
}

function getLocaleUrl(targetLocale: Locale, algorithmId?: string) {
  if (targetLocale === 'en') {
    return algorithmId ? `/${algorithmId}` : '/'
  }

  return algorithmId ? `/${targetLocale}/${algorithmId}` : `/${targetLocale}/`
}

export default function Header({
  locale,
  t,
  selectedAlgorithm,
  sidebarCollapsed,
  codePanelCollapsed,
  onExpandSidebar,
  onExpandCodePanel,
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onTogglePlay,
  onStepForward,
  onStepBackward,
  onSpeedChange,
  onStepChange,
  isMobile = false,
  onToggleMobileSidebar,
  onToggleMobileCodePanel,
}: HeaderProps) {
  return (
    <header
      className="h-12 shrink-0 flex items-center justify-between px-3 md:px-5 border-b border-white/8 bg-black z-10"
      role="banner"
    >
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-2 md:gap-3 min-w-0 shrink-0">
        {isMobile ? (
          <button
            onClick={onToggleMobileSidebar}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/6 transition-colors text-neutral-400 hover:text-white shrink-0"
            aria-label={locale === 'es' ? 'Abrir menú' : 'Open menu'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        ) : sidebarCollapsed ? (
          <button
            onClick={onExpandSidebar}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/6 transition-colors text-neutral-400 hover:text-white"
            aria-label={t.expandSidebar}
          >
            <svg
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.245 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H6.245V2.5ZM4.995 2.5H1.5V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H4.995V2.5ZM0 1H1.5H14.5H16V2.5V12.5C16 13.8807 14.8807 15 13.5 15H2.5C1.11929 15 0 13.8807 0 12.5V2.5V1Z"
                fill="currentColor"
              />
            </svg>
          </button>
        ) : null}
        <a
          href={getLocaleUrl(locale)}
          className="flex items-center gap-2 md:gap-2.5 hover:opacity-80 transition-opacity min-w-0"
          aria-label="alg0.dev - Algorithm Visualizer — Home"
        >
          <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shrink-0">
            <svg
              className="w-4 h-4 text-black"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <g stroke="currentColor" strokeLinejoin="round" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  d="M10.5 2v2m3-2v2M8 6.5H6m2 3H6m12-3h-2m2 3h-2M13.333 4h-2.666C9.41 4 8.78 4 8.39 4.39C8 4.782 8 5.41 8 6.668v2.666c0 1.257 0 1.886.39 2.277c.391.39 1.02.39 2.277.39h2.666c1.257 0 1.886 0 2.277-.39c.39-.391.39-1.02.39-2.277V6.667c0-1.257 0-1.886-.39-2.276C15.219 4 14.59 4 13.333 4"
                />
                <path d="M3.617 21.924c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541C6 21.199 6 20.966 6 20.5s0-.699-.076-.883a1 1 0 0 0-.541-.54C5.199 19 4.966 19 4.5 19s-.699 0-.883.076a1 1 0 0 0-.54.541C3 19.801 3 20.034 3 20.5s0 .699.076.883a1 1 0 0 0 .541.54Zm7.5 0c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883s0-.699-.076-.883a1 1 0 0 0-.541-.54C12.699 19 12.466 19 12 19s-.699 0-.883.076a1 1 0 0 0-.54.541c-.077.184-.077.417-.077.883s0 .699.076.883a1 1 0 0 0 .541.54Z" />
                <path
                  strokeLinecap="round"
                  d="M12 19v-7m-7.5 7c0-1.404 0-2.107.337-2.611a2 2 0 0 1 .552-.552C5.893 15.5 6.596 15.5 8 15.5h8c1.404 0 2.107 0 2.611.337c.218.146.406.334.552.552c.337.504.337 1.207.337 2.611"
                />
                <path d="M18.617 21.924c.184.076.417.076.883.076s.699 0 .883-.076a1 1 0 0 0 .54-.541c.077-.184.077-.417.077-.883s0-.699-.076-.883a1 1 0 0 0-.541-.54C20.199 19 19.966 19 19.5 19s-.699 0-.883.076a1 1 0 0 0-.54.541c-.077.184-.077.417-.077.883s0 .699.076.883a1 1 0 0 0 .541.54Z" />
              </g>
            </svg>
          </div>
          {!selectedAlgorithm && !isMobile && (
            <span className="font-semibold text-sm tracking-tight text-white font-heading">
              alg0.dev - Algorithm Visualizer
            </span>
          )}
        </a>
        {selectedAlgorithm && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <span className="text-neutral-600 shrink-0">/</span>
            <span className="text-xs text-neutral-500 hidden md:inline shrink-0">
              {getCategoryName(locale, selectedAlgorithm.category)}
            </span>
            <span className="text-neutral-600 hidden md:inline shrink-0">/</span>
            <span className="text-xs font-medium text-neutral-300 truncate" aria-current="page">
              {selectedAlgorithm.name}
            </span>
          </nav>
        )}
      </div>

      {/* Center: Controls (hidden on mobile, shown in bottom bar instead) */}
      {!isMobile && (
        <div className="flex-1 flex justify-center min-w-0 mx-2">
          <Controls
            currentStep={currentStep}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            speed={speed}
            onTogglePlay={onTogglePlay}
            onStepForward={onStepForward}
            onStepBackward={onStepBackward}
            onSpeedChange={onSpeedChange}
            onStepChange={onStepChange}
            disabled={totalSteps === 0}
            locale={locale}
          />
        </div>
      )}

      {/* Right: Language switcher + code panel toggle */}
      <div className="flex items-center justify-end gap-2 min-w-0 shrink-0">
        {isMobile && selectedAlgorithm && (
          <button
            onClick={onToggleMobileCodePanel}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/6 transition-colors text-neutral-400 hover:text-white"
            aria-label={locale === 'es' ? 'Ver código' : 'View code'}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </button>
        )}
        {!isMobile && codePanelCollapsed && (
          <button
            onClick={onExpandCodePanel}
            className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/6 transition-colors text-neutral-400 hover:text-white"
            aria-label={t.expandCodePanel}
          >
            <svg
              height="16"
              strokeLinejoin="round"
              viewBox="0 0 16 16"
              width="16"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.755 2.5H1.5V12.5C1.5 13.0523 1.94772 13.5 2.5 13.5H9.755V2.5ZM11.005 2.5H14.5V12.5C14.5 13.0523 14.0523 13.5 13.5 13.5H11.005V2.5ZM16 1H14.5H1.5H0V2.5V12.5C0 13.8807 1.11929 15 2.5 15H13.5C14.8807 15 16 13.8807 16 12.5V2.5V1Z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        <nav aria-label={locale === 'es' ? 'Idioma' : 'Language'} className="flex items-center gap-0.5 bg-white/6 rounded-lg p-0.5 border border-white/8">
          {locales.map((l) => (
            <a
              key={l}
              href={getLocaleUrl(l, selectedAlgorithm?.id)}
              className={`px-2 md:px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                l === locale
                  ? 'bg-white text-black'
                  : 'text-neutral-500 hover:text-white hover:bg-white/6'
              }`}
              aria-label={localeNames[l]}
              aria-current={l === locale ? 'page' : undefined}
              lang={l}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
