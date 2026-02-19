import { useState, useEffect, useCallback } from 'react'
import type { Locale } from '@i18n/translations'
import {
  translations,
  getAlgorithmDescription,
  getAlgorithmMetaTitle,
  getAlgorithmMetaDescription,
} from '@i18n/translations'
import { algorithms, categories } from '@lib/algorithms'
import { usePlayback } from '@hooks/usePlayback'
import { useResizablePanel } from '@hooks/useResizablePanel'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import WelcomeScreen from '@components/WelcomeScreen'
import ArrayVisualizer from '@components/ArrayVisualizer'
import GraphVisualizer from '@components/GraphVisualizer'
import MatrixVisualizer from '@components/MatrixVisualizer'
import ConceptVisualizer from '@components/ConceptVisualizer'
import CodePanel from '@components/CodePanel'
import type { Algorithm } from '@lib/types'

const SIDEBAR_MAX = 260
const CODEPANEL_MAX = 420
const COLLAPSE_THRESHOLD = 100
const MOBILE_BREAKPOINT = 768

function getAlgorithmUrl(locale: string, algoId: string): string {
  return locale === 'es' ? `/es/${algoId}` : `/${algoId}`
}

function getAlgorithmIdFromPath(pathname: string): string | null {
  const cleaned = pathname.replace(/\/$/, '')
  if (cleaned === '' || cleaned === '/es') return null
  if (cleaned.startsWith('/es/')) return cleaned.slice(4)
  return cleaned.slice(1)
}

interface AlgoVizProps {
  locale?: Locale
  initialAlgorithmId?: string
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

export default function AlgoViz({ locale = 'en', initialAlgorithmId }: AlgoVizProps) {
  const t = translations[locale]
  const [activeTab, setActiveTab] = useState<'code' | 'about'>('code')
  const isMobile = useIsMobile()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [mobileCodePanelOpen, setMobileCodePanelOpen] = useState(false)

  const initialAlgorithm = initialAlgorithmId
    ? (algorithms.find((a) => a.id === initialAlgorithmId) ?? null)
    : null

  console.log('initialAlgorithm', initialAlgorithm)

  const {
    selectedAlgorithm,
    steps,
    currentStep,
    setCurrentStep,
    isPlaying,
    speed,
    setSpeed,
    selectAlgorithm: selectAlgorithmBase,
    clearSelection,
    stepForward,
    stepBackward,
    togglePlay,
    currentStepData,
  } = usePlayback(locale, initialAlgorithm)

  console.log({
    selectedAlgorithm,
    steps,
    currentStep,
    setCurrentStep,
    isPlaying,
    speed,
    setSpeed,
    selectAlgorithm: selectAlgorithmBase,
    clearSelection,
    stepForward,
    stepBackward,
    togglePlay,
    currentStepData,
  })

  const sidebar = useResizablePanel({
    maxWidth: SIDEBAR_MAX,
    collapseThreshold: COLLAPSE_THRESHOLD,
    side: 'left',
  })

  const codePanel = useResizablePanel({
    maxWidth: CODEPANEL_MAX,
    collapseThreshold: COLLAPSE_THRESHOLD,
    side: 'right',
    initialCollapsed: !initialAlgorithmId,
  })

  useKeyboardShortcuts({ togglePlay, stepForward, stepBackward, onTabChange: setActiveTab })

  // Close mobile drawers on escape
  useEffect(() => {
    if (!isMobile) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSidebarOpen(false)
        setMobileCodePanelOpen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isMobile])

  // Prevent body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileSidebarOpen || mobileCodePanelOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileSidebarOpen, mobileCodePanelOpen])

  const updateMetaDescription = useCallback((description: string) => {
    const meta = document.querySelector('meta[name="description"]')
    if (meta) meta.setAttribute('content', description)
  }, [])

  const selectAlgorithm = useCallback(
    (algo: Algorithm) => {
      selectAlgorithmBase(algo)
      setActiveTab('code')
      setMobileSidebarOpen(false)
      codePanel.expand()
      const url = getAlgorithmUrl(locale, algo.id)
      window.history.pushState({ algorithmId: algo.id }, '', url)
      document.title = getAlgorithmMetaTitle(locale, algo.id, algo.name)
      updateMetaDescription(getAlgorithmMetaDescription(locale, algo.id))
    },
    [locale, selectAlgorithmBase, codePanel.expand, updateMetaDescription],
  )

  useEffect(() => {
    const handlePopState = () => {
      const algoId = getAlgorithmIdFromPath(window.location.pathname)
      if (algoId) {
        const algo = algorithms.find((a) => a.id === algoId)
        if (algo) {
          selectAlgorithmBase(algo)
          setActiveTab('code')
          document.title = getAlgorithmMetaTitle(locale, algo.id, algo.name)
          updateMetaDescription(getAlgorithmMetaDescription(locale, algo.id))
          return
        }
      }
      clearSelection()
      document.title = t.siteTitle
      updateMetaDescription(t.siteDescription)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [
    locale,
    selectAlgorithmBase,
    clearSelection,
    t.siteTitle,
    t.siteDescription,
    updateMetaDescription,
  ])

  const getLocalizedDescription = (algo: Algorithm): string => {
    return getAlgorithmDescription(locale, algo.id) ?? algo.description
  }

  const renderVisualization = () => {
    if (!selectedAlgorithm || !currentStepData) {
      return <WelcomeScreen t={t} locale={locale} onSelectAlgorithm={selectAlgorithm} />
    }

    switch (selectedAlgorithm.visualization) {
      case 'array':
        return <ArrayVisualizer step={currentStepData} />
      case 'graph':
        return <GraphVisualizer step={currentStepData} locale={locale} />
      case 'matrix':
        return <MatrixVisualizer step={currentStepData} />
      case 'concept':
        return <ConceptVisualizer step={currentStepData} />
      default:
        return null
    }
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        locale={locale}
        t={t}
        selectedAlgorithm={selectedAlgorithm}
        sidebarCollapsed={isMobile ? true : sidebar.collapsed}
        codePanelCollapsed={isMobile ? true : codePanel.collapsed}
        onExpandSidebar={isMobile ? () => setMobileSidebarOpen(true) : sidebar.expand}
        onExpandCodePanel={isMobile ? () => setMobileCodePanelOpen(true) : codePanel.expand}
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={togglePlay}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onSpeedChange={setSpeed}
        onStepChange={setCurrentStep}
        isMobile={isMobile}
        onToggleMobileSidebar={() => setMobileSidebarOpen((v) => !v)}
        onToggleMobileCodePanel={() => setMobileCodePanelOpen((v) => !v)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <div className="relative shrink-0 flex">
            <aside
              className={`bg-black overflow-hidden ${
                sidebar.isDragging ? '' : 'transition-all duration-300 ease-in-out'
              }`}
              style={{
                width: sidebar.isDragging ? sidebar.width : sidebar.collapsed ? 0 : SIDEBAR_MAX,
              }}
              aria-label={locale === 'es' ? 'Categorías de algoritmos' : 'Algorithm categories'}
              aria-hidden={sidebar.collapsed}
              inert={sidebar.collapsed || undefined}
            >
              <div
                className="h-full flex flex-col"
                style={{
                  width: SIDEBAR_MAX,
                  opacity: sidebar.isDragging
                    ? Math.max(0, sidebar.width / SIDEBAR_MAX)
                    : sidebar.collapsed
                      ? 0
                      : 1,
                  transition: sidebar.isDragging ? 'none' : 'opacity 0.3s ease-in-out',
                }}
              >
                <Sidebar
                  categories={categories}
                  selectedId={selectedAlgorithm?.id ?? null}
                  onSelect={selectAlgorithm}
                  locale={locale}
                />
              </div>
            </aside>
            {/* Drag handle */}
            <div
              className={`w-px shrink-0 cursor-col-resize group relative select-none ${
                sidebar.collapsed && !sidebar.isDragging ? 'hidden' : ''
              }`}
              onMouseDown={sidebar.handleDragStart}
              role="separator"
              aria-orientation="vertical"
              aria-label={t.resizeSidebar}
              tabIndex={sidebar.collapsed ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  sidebar.collapse()
                }
              }}
            >
              <div
                className={`absolute inset-y-0 -left-0.5 w-[5px] z-20 ${
                  sidebar.isDragging ? 'bg-blue-500/50' : 'hover:bg-white/10'
                } transition-colors`}
              />
              <div className="h-full bg-white/8" />
            </div>
          </div>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobile && (
          <>
            <div
              className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                mobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setMobileSidebarOpen(false)}
              aria-hidden="true"
            />
            <aside
              className={`fixed top-0 left-0 bottom-0 w-[280px] bg-black z-50 border-r border-white/8 transition-transform duration-300 ease-in-out ${
                mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
              aria-label={locale === 'es' ? 'Categorías de algoritmos' : 'Algorithm categories'}
              aria-hidden={!mobileSidebarOpen}
              inert={!mobileSidebarOpen || undefined}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                  <span className="text-sm font-semibold text-white font-heading">
                    {locale === 'es' ? 'Algoritmos' : 'Algorithms'}
                  </span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/6 text-neutral-400 hover:text-white transition-colors"
                    aria-label={locale === 'es' ? 'Cerrar menú' : 'Close menu'}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <Sidebar
                  categories={categories}
                  selectedId={selectedAlgorithm?.id ?? null}
                  onSelect={selectAlgorithm}
                  locale={locale}
                />
              </div>
            </aside>
          </>
        )}

        {/* Visualization Area */}
        <main
          id="main-content"
          className="flex-1 flex flex-col overflow-hidden min-w-0"
          aria-label="Algorithm visualization"
        >
          <div className="flex-1 flex flex-col p-4 md:p-8 overflow-auto">
            {renderVisualization()}
          </div>

          {/* Step description */}
          <div className="px-4 pb-3 md:px-8 md:pb-5" aria-live="polite" aria-atomic="true">
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

        {/* Desktop Code Panel */}
        {!isMobile && (
          <div className="relative shrink-0 flex">
            {/* Drag handle */}
            <div
              className={`w-px shrink-0 cursor-col-resize group relative select-none ${
                codePanel.collapsed && !codePanel.isDragging ? 'hidden' : ''
              }`}
              onMouseDown={codePanel.handleDragStart}
              role="separator"
              aria-orientation="vertical"
              aria-label={t.resizeCodePanel}
              tabIndex={codePanel.collapsed ? -1 : 0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  codePanel.collapse()
                }
              }}
            >
              <div
                className={`absolute inset-y-0 -right-0.5 w-[5px] z-20 ${
                  codePanel.isDragging ? 'bg-blue-500/50' : 'hover:bg-white/10'
                } transition-colors`}
              />
              <div className="h-full bg-white/8" />
            </div>
            <aside
              className={`bg-black overflow-hidden ${
                codePanel.isDragging ? '' : 'transition-all duration-300 ease-in-out'
              }`}
              style={{
                width: codePanel.isDragging
                  ? codePanel.width
                  : codePanel.collapsed
                    ? 0
                    : CODEPANEL_MAX,
              }}
              aria-label={locale === 'es' ? 'Panel de código y detalles' : 'Code and details panel'}
              aria-hidden={codePanel.collapsed}
              inert={codePanel.collapsed || undefined}
            >
              <div
                className="h-full flex flex-col"
                style={{
                  width: CODEPANEL_MAX,
                  opacity: codePanel.isDragging
                    ? Math.max(0, codePanel.width / CODEPANEL_MAX)
                    : codePanel.collapsed
                      ? 0
                      : 1,
                  transition: codePanel.isDragging ? 'none' : 'opacity 0.3s ease-in-out',
                }}
              >
                {selectedAlgorithm ? (
                  <CodePanel
                    code={selectedAlgorithm.code}
                    codeSamples={selectedAlgorithm.codeSamples}
                    description={getLocalizedDescription(selectedAlgorithm)}
                    difficulty={selectedAlgorithm.difficulty}
                    currentLine={currentStepData?.codeLine}
                    variables={currentStepData?.variables}
                    consoleOutput={currentStepData?.consoleOutput}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    locale={locale}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral-600 text-sm">
                    {t.selectAlgorithmCode}
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}

        {/* Mobile Code Panel Overlay */}
        {isMobile && (
          <>
            <div
              className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
                mobileCodePanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              onClick={() => setMobileCodePanelOpen(false)}
              aria-hidden="true"
            />
            <aside
              className={`fixed top-0 right-0 bottom-0 w-[min(360px,90vw)] bg-black z-50 border-l border-white/8 transition-transform duration-300 ease-in-out ${
                mobileCodePanelOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              aria-label={locale === 'es' ? 'Panel de código y detalles' : 'Code and details panel'}
              aria-hidden={!mobileCodePanelOpen}
              inert={!mobileCodePanelOpen || undefined}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8">
                  <span className="text-sm font-semibold text-white font-heading">
                    {locale === 'es' ? 'Código' : 'Code'}
                  </span>
                  <button
                    onClick={() => setMobileCodePanelOpen(false)}
                    className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/6 text-neutral-400 hover:text-white transition-colors"
                    aria-label={locale === 'es' ? 'Cerrar panel' : 'Close panel'}
                  >
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {selectedAlgorithm ? (
                  <CodePanel
                    code={selectedAlgorithm.code}
                    codeSamples={selectedAlgorithm.codeSamples}
                    description={getLocalizedDescription(selectedAlgorithm)}
                    difficulty={selectedAlgorithm.difficulty}
                    currentLine={currentStepData?.codeLine}
                    variables={currentStepData?.variables}
                    consoleOutput={currentStepData?.consoleOutput}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    locale={locale}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-neutral-600 text-sm">
                    {t.selectAlgorithmCode}
                  </div>
                )}
              </div>
            </aside>
          </>
        )}
      </div>

      {/* Mobile bottom controls bar */}
      {isMobile && selectedAlgorithm && (
        <div className="shrink-0 flex items-center justify-between px-3 py-2 border-t border-white/8 bg-black z-10 gap-2">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/6 text-neutral-400 hover:text-white transition-colors shrink-0"
            aria-label={locale === 'es' ? 'Abrir menú' : 'Open menu'}
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
            onClick={() => setMobileCodePanelOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/6 text-neutral-400 hover:text-white transition-colors shrink-0"
            aria-label={locale === 'es' ? 'Ver código' : 'View code'}
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
