import { useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { Locale } from '@i18n/translations'
import { translations, getCategoryName, defaultLocale, locales } from '@i18n/translations'
import { getCatalogEntry } from '@lib/algorithms/catalog'
import { loadAlgorithm } from '@lib/algorithms/loaders'
import { $ } from '@lib/dom'
import { syncHeaderChrome } from '@lib/header-chrome'
import {
  SELECT_ALGORITHM_EVENT,
  closeMobileSidebar,
  openMobileSidebar,
  syncSidebarSelection,
  type SelectAlgorithmDetail,
} from '@lib/sidebar'
import { onPlaybackCommand, publishPlaybackState, type PlaybackCommand } from '@lib/playback'
import {
  expandCodePanel,
  openMobileCodePanel,
  syncCodePanelForAlgorithm,
} from '@lib/code-panel-shell'
import { usePlayback } from '@hooks/usePlayback'
import WelcomeScreen from '@components/WelcomeScreen'
import DomStepViz from '@components/DomStepViz'
import GraphVisualizer from '@components/GraphVisualizer'
import ConceptVisualizer from '@components/ConceptVisualizer'
import { renderArrayVisualizer } from '@lib/visualizers/array'
import { renderMatrixVisualizer } from '@lib/visualizers/matrix'
import CodePanel from '@components/CodePanel'
import { CODE_LANGUAGE_STORAGE_KEY, defaultCodeLanguage, isCodeLanguage } from '@lib/code-languages'
import type { Algorithm, AlgorithmSummary, CodeLanguage, Step } from '@lib/types'

/** Build a serializable hydrate payload into a playable Algorithm for first paint. */
function hydrateAlgorithm(summary: AlgorithmSummary, code: string, steps: Step[]): Algorithm {
  return {
    ...summary,
    code,
    // Fixed steps from SSR keep the initial route fully functional without a client import.
    generateSteps: () => steps,
  }
}

const MOBILE_BREAKPOINT = 768

function getAlgorithmUrl(locale: string, algoId: string): string {
  return locale === defaultLocale ? `/${algoId}` : `/${locale}/${algoId}`
}

function getAlgorithmIdFromPath(pathname: string): string | null {
  const cleaned = pathname.replace(/\/$/, '')
  if (cleaned === '') return null
  for (const locale of locales) {
    if (cleaned === `/${locale}`) return null
    if (cleaned.startsWith(`/${locale}/`)) return cleaned.slice(locale.length + 2)
  }
  return cleaned.slice(1)
}

interface AlgoVizProps {
  locale?: Locale
  /** Catalog entry from SSR so the breadcrumb paints on first frame. */
  initialAlgorithm?: AlgorithmSummary
  /** Precomputed steps from SSR so the visualizer paints without a client fetch. */
  initialSteps?: Step[]
  /** JavaScript source from SSR for the code panel (language packs still load on demand). */
  initialCode?: string
  /** @deprecated Prefer `initialAlgorithm` — kept for callers that only know the id. */
  initialAlgorithmId?: string
  /** SSR welcome chrome from Astro (`WelcomeChrome.astro`), via `slot="welcome-chrome"`. */
  welcomeChrome?: ReactNode
  /** SSR algorithm description from Astro (`AlgorithmDescription.astro`) for the about tab. */
  children?: ReactNode
}

interface AlgorithmPageContent {
  html: string
  pageTitle: string
  metaDescription: string
}

async function loadAlgorithmPageContent(
  locale: Locale,
  algorithmId: string,
): Promise<AlgorithmPageContent | null> {
  const response = await fetch(`/algorithm-content/${locale}/${algorithmId}`)
  if (!response.ok) throw new Error(`Description request failed with ${response.status}`)

  const parsedDocument = new DOMParser().parseFromString(await response.text(), 'text/html')
  const content = $<HTMLElement>('[data-algorithm-description]', parsedDocument)
  if (!content) return null

  return {
    html: content.outerHTML,
    pageTitle: content.dataset.pageTitle ?? '',
    metaDescription: content.dataset.metaDescription ?? '',
  }
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isMobile
}

export default function AlgoViz({
  locale = 'en',
  initialAlgorithm,
  initialSteps,
  initialCode,
  initialAlgorithmId,
  welcomeChrome,
  children,
}: AlgoVizProps) {
  const t = translations[locale]
  const resolvedInitialId = initialAlgorithm?.id ?? initialAlgorithmId

  const hydratedInitial = useMemo(() => {
    if (!initialAlgorithm || initialCode == null || !initialSteps?.length) return null
    return hydrateAlgorithm(initialAlgorithm, initialCode, initialSteps)
  }, [initialAlgorithm, initialCode, initialSteps])

  const [activeTab, setActiveTab] = useState<'code' | 'about'>('code')
  const [aboutHtml, setAboutHtml] = useState<string | null>(null)
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage | null>(null)
  const isMobile = useIsMobile()
  const [headerAlgorithm, setHeaderAlgorithm] = useState<AlgorithmSummary | null>(
    initialAlgorithm ?? null,
  )
  const [codeMount, setCodeMount] = useState<Element | null>(null)

  const {
    selectedAlgorithm,
    steps,
    currentStep,
    setCurrentStep,
    isPlaying,
    speed,
    setSpeed,
    selectAlgorithm: selectAlgorithmBase,
    clearSelection: clearSelectionBase,
    stepForward,
    stepBackward,
    togglePlay,
    currentStepData,
  } = usePlayback(locale, hydratedInitial, initialSteps)

  const clearSelection = useCallback(() => {
    clearSelectionBase()
    setHeaderAlgorithm(null)
  }, [clearSelectionBase])

  // Mount point for CodePanel inside static CodePanelShell.astro
  useEffect(() => {
    setCodeMount($('[data-code-panel-mount]'))
  }, [])

  // Publish playback state → header controls (plain JS)
  useEffect(() => {
    publishPlaybackState({
      currentStep,
      totalSteps: steps.length,
      isPlaying,
      speed,
      disabled: steps.length === 0,
      hasAlgorithm: headerAlgorithm != null,
    })
  }, [currentStep, steps.length, isPlaying, speed, headerAlgorithm])

  // Commands from header controls / keyboard
  useEffect(() => {
    return onPlaybackCommand((command: PlaybackCommand) => {
      switch (command.type) {
        case 'togglePlay':
          togglePlay()
          break
        case 'stepForward':
          stepForward()
          break
        case 'stepBackward':
          stepBackward()
          break
        case 'setStep':
          setCurrentStep(command.step)
          break
        case 'setSpeed':
          setSpeed(command.speed)
          break
        case 'setTab':
          setActiveTab(command.tab)
          break
      }
    })
  }, [togglePlay, stepForward, stepBackward, setCurrentStep, setSpeed])

  // Keep SSR header chrome + sidebar highlight in sync
  useEffect(() => {
    syncHeaderChrome(locale, headerAlgorithm)
  }, [locale, headerAlgorithm])

  useEffect(() => {
    syncSidebarSelection(headerAlgorithm?.id ?? null)
  }, [headerAlgorithm?.id])

  useEffect(() => {
    syncCodePanelForAlgorithm(headerAlgorithm != null)
  }, [headerAlgorithm])

  // Resolve preferred language after mount
  useEffect(() => {
    const stored = localStorage.getItem(CODE_LANGUAGE_STORAGE_KEY)
    setCodeLanguage(isCodeLanguage(stored) ? stored : defaultCodeLanguage)
  }, [])

  const changeCodeLanguage = useCallback((language: CodeLanguage) => {
    setCodeLanguage(language)
    localStorage.setItem(CODE_LANGUAGE_STORAGE_KEY, language)
  }, [])

  const updateMetaDescription = useCallback((description: string) => {
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [])

  const activateAlgorithm = useCallback(
    (
      algo: Algorithm,
      { pushUrl, pageContent }: { pushUrl: boolean; pageContent: AlgorithmPageContent | null },
    ) => {
      setHeaderAlgorithm(algo)
      selectAlgorithmBase(algo)
      setAboutHtml(pageContent?.html ?? '')
      setActiveTab('code')
      closeMobileSidebar()
      expandCodePanel()
      if (pushUrl) {
        const url = getAlgorithmUrl(locale, algo.id)
        window.history.pushState({ algorithmId: algo.id }, '', url)
      }
      document.title =
        pageContent?.pageTitle ||
        (locale === 'es'
          ? `${algo.name}: Visualizador | alg0.dev`
          : `${algo.name} Visualizer | alg0.dev`)
      updateMetaDescription(pageContent?.metaDescription || t.siteDescription)
    },
    [locale, selectAlgorithmBase, t.siteDescription, updateMetaDescription],
  )

  const selectAlgorithmById = useCallback(
    async (
      id: string,
      options: {
        pushUrl: boolean
        summary?: AlgorithmSummary
      } = { pushUrl: true },
    ) => {
      if (options.summary) setHeaderAlgorithm(options.summary)
      setAboutHtml('')
      try {
        const [algo, pageContent] = await Promise.all([
          loadAlgorithm(id),
          loadAlgorithmPageContent(locale, id).catch((error) => {
            console.error(`Failed to load description for "${id}"`, error)
            return null
          }),
        ])
        activateAlgorithm(algo, { pushUrl: options.pushUrl, pageContent })
      } catch (error) {
        console.error(`Failed to load algorithm "${id}"`, error)
      }
    },
    [activateAlgorithm, locale],
  )

  const selectAlgorithm = useCallback(
    (summary: AlgorithmSummary) => {
      void selectAlgorithmById(summary.id, { pushUrl: true, summary })
    },
    [selectAlgorithmById],
  )

  useEffect(() => {
    const onSelect = (event: Event) => {
      const detail = (event as CustomEvent<SelectAlgorithmDetail>).detail
      if (!detail?.id) return
      const summary = getCatalogEntry(detail.id)
      void selectAlgorithmById(detail.id, { pushUrl: true, summary })
    }
    window.addEventListener(SELECT_ALGORITHM_EVENT, onSelect)
    return () => window.removeEventListener(SELECT_ALGORITHM_EVENT, onSelect)
  }, [selectAlgorithmById])

  useEffect(() => {
    if (!resolvedInitialId) return
    if (hydratedInitial) return
    void selectAlgorithmById(resolvedInitialId, {
      pushUrl: false,
      summary: initialAlgorithm,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedInitialId])

  useEffect(() => {
    const handlePopState = () => {
      const algoId = getAlgorithmIdFromPath(window.location.pathname)
      if (algoId) {
        void selectAlgorithmById(algoId, { pushUrl: false })
        return
      }
      clearSelection()
      setAboutHtml(null)
      document.title = t.siteTitle
      updateMetaDescription(t.siteDescription)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [selectAlgorithmById, clearSelection, t.siteTitle, t.siteDescription, updateMetaDescription])

  const aboutContent =
    aboutHtml !== null ? (
      <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
    ) : initialAlgorithm?.id === selectedAlgorithm?.id ? (
      children
    ) : null

  const renderVisualization = () => {
    if (!selectedAlgorithm || !currentStepData) {
      return (
        <WelcomeScreen locale={locale} onSelectAlgorithm={selectAlgorithm} chrome={welcomeChrome} />
      )
    }

    switch (selectedAlgorithm.visualization) {
      case 'array':
        return <DomStepViz step={currentStepData} render={renderArrayVisualizer} />
      case 'graph':
        return <GraphVisualizer step={currentStepData} locale={locale} />
      case 'matrix':
        return <DomStepViz step={currentStepData} render={renderMatrixVisualizer} />
      case 'concept':
        return <ConceptVisualizer step={currentStepData} />
      default:
        return null
    }
  }

  const codePanelContent =
    selectedAlgorithm && codeMount
      ? createPortal(
          <CodePanel
            algorithm={selectedAlgorithm}
            aboutContent={aboutContent}
            currentLine={currentStepData?.codeLine}
            variables={currentStepData?.variables}
            consoleOutput={currentStepData?.consoleOutput}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            language={codeLanguage}
            onLanguageChange={changeCodeLanguage}
            locale={locale}
          />,
          codeMount,
        )
      : null

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0">
      {codePanelContent}

      <div className="flex-1 flex overflow-hidden relative min-h-0">
        <main
          id="main-content"
          className="flex-1 flex flex-col overflow-hidden min-w-0"
          aria-label={t.visualizationLabel}
        >
          {headerAlgorithm && (
            <h1 className="sr-only">
              {headerAlgorithm.name} — {getCategoryName(locale, headerAlgorithm.category)}
            </h1>
          )}
          <div className="flex-1 flex flex-col px-3 py-3 md:px-5 md:py-4 overflow-auto min-h-0">
            {renderVisualization()}
          </div>

          <div className="px-3 pb-3 md:px-5 md:pb-4" aria-live="polite" aria-atomic="true">
            {currentStepData?.description && (
              <div className="text-xs md:text-sm text-neutral-300 bg-white/5 rounded-lg px-3 py-2 md:px-5 md:py-3 border border-white/12">
                <span className="text-amber-300/90 font-medium mr-2">
                  {t.step.replace('{n}', String(currentStep + 1))}
                </span>
                {currentStepData.description}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile bottom transport bar */}
      {isMobile && headerAlgorithm && (
        <div className="shrink-0 flex items-center justify-between px-3 py-2 border-t border-white/8 bg-black z-10 gap-2">
          <button
            type="button"
            onClick={() => openMobileSidebar()}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/6 text-neutral-400 hover:text-white transition-colors shrink-0"
            aria-label={t.openMenu}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
          <div className="flex-1 flex items-center justify-center min-w-0">
            <div className="flex items-center gap-1" role="group" aria-label={t.controlsLabel}>
              <button
                type="button"
                onClick={stepBackward}
                disabled={currentStep <= 0}
                className="p-1.5 rounded-md hover:bg-white/8 disabled:opacity-20 text-neutral-500 hover:text-white transition-all active:scale-95"
                aria-label={t.stepBackward}
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={togglePlay}
                className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 flex items-center justify-center transition-all active:scale-95"
                aria-label={t.playPause}
              >
                {isPlaying ? (
                  <svg
                    className="w-3.5 h-3.5 text-black"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <rect x="6" y="5" width="4" height="14" rx="1" />
                    <rect x="14" y="5" width="4" height="14" rx="1" />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3 text-black"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.5528 7.77638C14.737 7.86851 14.737 8.13147 14.5528 8.2236L1.3618 14.8191C1.19558 14.9022 1 14.7813 1 14.5955L1 1.4045C1 1.21865 1.19558 1.09778 1.3618 1.18089L14.5528 7.77638Z"
                      fill="currentColor"
                    />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={stepForward}
                disabled={currentStep >= steps.length - 1}
                className="p-1.5 rounded-md hover:bg-white/8 disabled:opacity-20 text-neutral-500 hover:text-white transition-all active:scale-95"
                aria-label={t.stepForward}
              >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <span className="text-[11px] text-neutral-600 font-mono tabular-nums ml-2">
              {steps.length > 0 ? `${currentStep + 1}/${steps.length}` : '\u2014'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => openMobileCodePanel()}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/6 text-neutral-400 hover:text-white transition-colors shrink-0"
            aria-label={t.viewCode}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
