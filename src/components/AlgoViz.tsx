import { useState, useEffect, useRef, useCallback } from 'react'
import type { Algorithm, Step } from '../lib/types'
import { categories } from '../lib/algorithms'
import type { Locale } from '../i18n/translations'
import {
  translations,
  getAlgorithmDescription,
  getCategoryName,
  locales,
  localeNames,
} from '../i18n/translations'
import Sidebar from './Sidebar'
import Controls from './Controls'
import ArrayVisualizer from './ArrayVisualizer'
import GraphVisualizer from './GraphVisualizer'
import MatrixVisualizer from './MatrixVisualizer'
import CodePanel from './CodePanel'

const speedMap: Record<number, number> = {
  1: 1500,
  2: 800,
  3: 400,
  4: 150,
  5: 50,
}

interface AlgoVizProps {
  locale?: Locale
}

export default function AlgoViz({ locale = 'en' }: AlgoVizProps) {
  const t = translations[locale]
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(3)
  const [activeTab, setActiveTab] = useState<'code' | 'about'>('code')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(260)
  const [isDraggingSidebar, setIsDraggingSidebar] = useState(false)
  const [codePanelCollapsed, setCodePanelCollapsed] = useState(false)
  const [codePanelWidth, setCodePanelWidth] = useState(420)
  const [isDraggingCodePanel, setIsDraggingCodePanel] = useState(false)
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null)
  const codePanelDragRef = useRef<{ startX: number; startWidth: number } | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const SIDEBAR_MAX = 260
  const SIDEBAR_COLLAPSE_THRESHOLD = 100
  const CODEPANEL_MAX = 420
  const CODEPANEL_COLLAPSE_THRESHOLD = 100

  const selectAlgorithm = useCallback((algo: Algorithm) => {
    setIsPlaying(false)
    setSelectedAlgorithm(algo)
    const newSteps = algo.generateSteps()
    setSteps(newSteps)
    setCurrentStep(0)
    setActiveTab('code')
  }, [])

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const togglePlay = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev >= steps.length - 1) {
        setIsPlaying(true)
        return 0
      }
      setIsPlaying((p) => !p)
      return prev
    })
  }, [steps.length])

  // Playback timer
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, speedMap[speed] || 400)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, steps.length])

  // Sidebar drag to collapse
  const handleSidebarDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragRef.current = { startX: e.clientX, startWidth: sidebarWidth }
      setIsDraggingSidebar(true)
    },
    [sidebarWidth],
  )

  useEffect(() => {
    if (!isDraggingSidebar) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return
      const delta = e.clientX - dragRef.current.startX
      const newWidth = Math.max(0, Math.min(SIDEBAR_MAX, dragRef.current.startWidth + delta))
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDraggingSidebar(false)
      dragRef.current = null
      setSidebarWidth((prev) => {
        if (prev < SIDEBAR_COLLAPSE_THRESHOLD) {
          setSidebarCollapsed(true)
          return 0
        }
        setSidebarCollapsed(false)
        return SIDEBAR_MAX
      })
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingSidebar])

  // Code panel drag to collapse
  const handleCodePanelDragStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      codePanelDragRef.current = { startX: e.clientX, startWidth: codePanelWidth }
      setIsDraggingCodePanel(true)
    },
    [codePanelWidth],
  )

  useEffect(() => {
    if (!isDraggingCodePanel) return

    const handleMouseMove = (e: MouseEvent) => {
      if (!codePanelDragRef.current) return
      const delta = codePanelDragRef.current.startX - e.clientX
      const newWidth = Math.max(0, Math.min(CODEPANEL_MAX, codePanelDragRef.current.startWidth + delta))
      setCodePanelWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsDraggingCodePanel(false)
      codePanelDragRef.current = null
      setCodePanelWidth((prev) => {
        if (prev < CODEPANEL_COLLAPSE_THRESHOLD) {
          setCodePanelCollapsed(true)
          return 0
        }
        setCodePanelCollapsed(false)
        return CODEPANEL_MAX
      })
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDraggingCodePanel])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          e.preventDefault()
          stepForward()
          break
        case 'ArrowLeft':
          e.preventDefault()
          stepBackward()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, stepForward, stepBackward])

  const currentStepData = steps[currentStep] || null

  // Get translated description for the selected algorithm
  const getLocalizedDescription = (algo: Algorithm): string => {
    return getAlgorithmDescription(locale, algo.id) ?? algo.description
  }

  const renderVisualization = () => {
    if (!selectedAlgorithm || !currentStepData) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] flex items-center justify-center border border-white/[0.08]">
            <svg
              className="w-8 h-8 text-white/60"
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
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-white mb-3 text-balance font-heading">
              {t.welcomeTitle}
            </h2>
            <p className="text-sm text-neutral-500 leading-relaxed whitespace-pre-line text-balance">
              {t.welcomeDescription}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <kbd className="w-8 h-8 flex items-center justify-center bg-white/[0.06] rounded-lg border border-white/[0.10] text-white/80">
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
                  <kbd className="w-8 h-8 flex items-center justify-center bg-white/[0.06] rounded-lg border border-white/[0.10] text-white/80">
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
                  <kbd className="w-8 h-8 flex items-center justify-center bg-white/[0.06] rounded-lg border border-white/[0.10] text-white/80">
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
        </div>
      )
    }

    switch (selectedAlgorithm.visualization) {
      case 'array':
        return <ArrayVisualizer step={currentStepData} />
      case 'graph':
        return <GraphVisualizer step={currentStepData} locale={locale} />
      case 'matrix':
        return <MatrixVisualizer step={currentStepData} />
      default:
        return null
    }
  }

  const getLocaleUrl = (targetLocale: Locale) => {
    return targetLocale === 'en' ? '/' : `/${targetLocale}/`
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header
        className="h-12 shrink-0 flex items-center justify-between px-5 border-b border-white/[0.08] bg-black z-10"
        role="banner"
      >
        {/* Left: Logo + Breadcrumb */}
        <div className="flex items-center gap-3 min-w-[260px]">
          {sidebarCollapsed && (
            <button
              onClick={() => {
                setSidebarCollapsed(false)
                setSidebarWidth(SIDEBAR_MAX)
              }}
              className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/[0.06] transition-colors text-neutral-400 hover:text-white"
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
          )}
          <a
            href={getLocaleUrl(locale)}
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            aria-label="alg0.dev - Algorithm Visualizer — Home"
          >
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center">
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
            {!selectedAlgorithm && (
              <span className="font-semibold text-sm tracking-tight text-white font-heading">
                alg0.dev - Algorithm Visualizer
              </span>
            )}
          </a>
          {selectedAlgorithm && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 ml-2">
              <span className="text-neutral-600">/</span>
              <span className="text-xs text-neutral-500">
                {getCategoryName(locale, selectedAlgorithm.category)}
              </span>
              <span className="text-neutral-600">/</span>
              <span className="text-xs font-medium text-neutral-300" aria-current="page">
                {selectedAlgorithm.name}
              </span>
            </nav>
          )}
        </div>

        {/* Center: Controls */}
        <Controls
          currentStep={currentStep}
          totalSteps={steps.length}
          isPlaying={isPlaying}
          speed={speed}
          onTogglePlay={togglePlay}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onSpeedChange={setSpeed}
          onStepChange={setCurrentStep}
          disabled={steps.length === 0}
          locale={locale}
        />

        {/* Right: Language switcher + code panel toggle */}
        <div className="min-w-[260px] flex items-center justify-end gap-2">
          {codePanelCollapsed && (
            <button
              onClick={() => {
                setCodePanelCollapsed(false)
                setCodePanelWidth(CODEPANEL_MAX)
              }}
              className="flex items-center justify-center w-7 h-7 rounded-md hover:bg-white/[0.06] transition-colors text-neutral-400 hover:text-white"
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
          <nav aria-label={locale === 'es' ? 'Idioma' : 'Language'} className="flex items-center gap-0.5 bg-white/[0.04] rounded-lg p-0.5 border border-white/[0.08]">
            {locales.map((l) => (
              <a
                key={l}
                href={getLocaleUrl(l)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all ${
                  l === locale
                    ? 'bg-white text-black'
                    : 'text-neutral-500 hover:text-white hover:bg-white/[0.06]'
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

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="relative shrink-0 flex">
          <aside
            className={`bg-black overflow-hidden ${
              isDraggingSidebar ? '' : 'transition-all duration-300 ease-in-out'
            }`}
            style={{ width: isDraggingSidebar ? sidebarWidth : sidebarCollapsed ? 0 : SIDEBAR_MAX }}
            aria-label={locale === 'es' ? 'Categorías de algoritmos' : 'Algorithm categories'}
            aria-hidden={sidebarCollapsed}
            inert={sidebarCollapsed || undefined}
          >
            <div
              className="h-full flex flex-col"
              style={{
                width: SIDEBAR_MAX,
                opacity: isDraggingSidebar
                  ? Math.max(0, sidebarWidth / SIDEBAR_MAX)
                  : sidebarCollapsed
                    ? 0
                    : 1,
                transition: isDraggingSidebar ? 'none' : 'opacity 0.3s ease-in-out',
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
            className={`w-[1px] shrink-0 cursor-col-resize group relative select-none ${
              sidebarCollapsed && !isDraggingSidebar ? 'hidden' : ''
            }`}
            onMouseDown={handleSidebarDragStart}
            role="separator"
            aria-orientation="vertical"
            aria-label={t.resizeSidebar}
            tabIndex={sidebarCollapsed ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setSidebarCollapsed(true)
                setSidebarWidth(0)
              }
            }}
          >
            <div
              className={`absolute inset-y-0 -left-[2px] w-[5px] z-20 ${
                isDraggingSidebar ? 'bg-blue-500/50' : 'hover:bg-white/10'
              } transition-colors`}
            />
            <div className="h-full bg-white/[0.08]" />
          </div>
        </div>

        {/* Visualization Area */}
        <main
          id="main-content"
          className="flex-1 flex flex-col overflow-hidden min-w-0"
          aria-label="Algorithm visualization"
        >
          <div className="flex-1 flex flex-col p-8 overflow-auto">{renderVisualization()}</div>

          {/* Step description — aria-live for screen readers to announce step changes */}
          <div className="px-8 pb-5" aria-live="polite" aria-atomic="true">
            {currentStepData?.description && (
              <div className="text-sm text-neutral-300 bg-white/[0.05] rounded-lg px-5 py-3 border border-white/[0.12]">
                <span className="text-amber-300/90 font-medium mr-2">
                  {t.step.replace('{n}', String(currentStep + 1))}
                </span>
                {currentStepData.description}
              </div>
            )}
          </div>
        </main>

        {/* Code Panel */}
        <div className="relative shrink-0 flex">
          {/* Drag handle */}
          <div
            className={`w-[1px] shrink-0 cursor-col-resize group relative select-none ${
              codePanelCollapsed && !isDraggingCodePanel ? 'hidden' : ''
            }`}
            onMouseDown={handleCodePanelDragStart}
            role="separator"
            aria-orientation="vertical"
            aria-label={t.resizeCodePanel}
            tabIndex={codePanelCollapsed ? -1 : 0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setCodePanelCollapsed(true)
                setCodePanelWidth(0)
              }
            }}
          >
            <div
              className={`absolute inset-y-0 -right-[2px] w-[5px] z-20 ${
                isDraggingCodePanel ? 'bg-blue-500/50' : 'hover:bg-white/10'
              } transition-colors`}
            />
            <div className="h-full bg-white/[0.08]" />
          </div>
          <aside
            className={`bg-black overflow-hidden ${
              isDraggingCodePanel ? '' : 'transition-all duration-300 ease-in-out'
            }`}
            style={{ width: isDraggingCodePanel ? codePanelWidth : codePanelCollapsed ? 0 : CODEPANEL_MAX }}
            aria-label={locale === 'es' ? 'Panel de código y detalles' : 'Code and details panel'}
            aria-hidden={codePanelCollapsed}
            inert={codePanelCollapsed || undefined}
          >
            <div
              className="h-full flex flex-col"
              style={{
                width: CODEPANEL_MAX,
                opacity: isDraggingCodePanel
                  ? Math.max(0, codePanelWidth / CODEPANEL_MAX)
                  : codePanelCollapsed
                    ? 0
                    : 1,
                transition: isDraggingCodePanel ? 'none' : 'opacity 0.3s ease-in-out',
              }}
            >
              {selectedAlgorithm ? (
                <CodePanel
                  code={selectedAlgorithm.code}
                  description={getLocalizedDescription(selectedAlgorithm)}
                  currentLine={currentStepData?.codeLine}
                  variables={currentStepData?.variables}
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
      </div>
    </div>
  )
}
