import { useState } from 'react'
import type { Locale } from '@i18n/translations'
import { translations, getAlgorithmDescription } from '@i18n/translations'
import { categories } from '@lib/algorithms'
import { usePlayback } from '@hooks/usePlayback'
import { useResizablePanel } from '@hooks/useResizablePanel'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import WelcomeScreen from '@components/WelcomeScreen'
import ArrayVisualizer from '@components/ArrayVisualizer'
import GraphVisualizer from '@components/GraphVisualizer'
import MatrixVisualizer from '@components/MatrixVisualizer'
import CodePanel from '@components/CodePanel'
import type { Algorithm } from '@lib/types'

const SIDEBAR_MAX = 260
const CODEPANEL_MAX = 420
const COLLAPSE_THRESHOLD = 100

interface AlgoVizProps {
  locale?: Locale
}

export default function AlgoViz({ locale = 'en' }: AlgoVizProps) {
  const t = translations[locale]
  const [activeTab, setActiveTab] = useState<'code' | 'about'>('code')

  const {
    selectedAlgorithm,
    steps,
    currentStep,
    setCurrentStep,
    isPlaying,
    speed,
    setSpeed,
    selectAlgorithm: selectAlgorithmBase,
    stepForward,
    stepBackward,
    togglePlay,
    currentStepData,
  } = usePlayback(locale)

  const sidebar = useResizablePanel({
    maxWidth: SIDEBAR_MAX,
    collapseThreshold: COLLAPSE_THRESHOLD,
    side: 'left',
  })

  const codePanel = useResizablePanel({
    maxWidth: CODEPANEL_MAX,
    collapseThreshold: COLLAPSE_THRESHOLD,
    side: 'right',
  })

  useKeyboardShortcuts({ togglePlay, stepForward, stepBackward })

  const selectAlgorithm = (algo: Algorithm) => {
    selectAlgorithmBase(algo)
    setActiveTab('code')
  }

  const getLocalizedDescription = (algo: Algorithm): string => {
    return getAlgorithmDescription(locale, algo.id) ?? algo.description
  }

  const renderVisualization = () => {
    if (!selectedAlgorithm || !currentStepData) {
      return <WelcomeScreen t={t} />
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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header
        locale={locale}
        t={t}
        selectedAlgorithm={selectedAlgorithm}
        sidebarCollapsed={sidebar.collapsed}
        codePanelCollapsed={codePanel.collapsed}
        onExpandSidebar={sidebar.expand}
        onExpandCodePanel={codePanel.expand}
        currentStep={currentStep}
        totalSteps={steps.length}
        isPlaying={isPlaying}
        speed={speed}
        onTogglePlay={togglePlay}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onSpeedChange={setSpeed}
        onStepChange={setCurrentStep}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="relative shrink-0 flex">
          <aside
            className={`bg-black overflow-hidden ${
              sidebar.isDragging ? '' : 'transition-all duration-300 ease-in-out'
            }`}
            style={{ width: sidebar.isDragging ? sidebar.width : sidebar.collapsed ? 0 : SIDEBAR_MAX }}
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
            className={`w-[1px] shrink-0 cursor-col-resize group relative select-none ${
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
              className={`absolute inset-y-0 -left-[2px] w-[5px] z-20 ${
                sidebar.isDragging ? 'bg-blue-500/50' : 'hover:bg-white/10'
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

          {/* Step description */}
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
              className={`absolute inset-y-0 -right-[2px] w-[5px] z-20 ${
                codePanel.isDragging ? 'bg-blue-500/50' : 'hover:bg-white/10'
              } transition-colors`}
            />
            <div className="h-full bg-white/[0.08]" />
          </div>
          <aside
            className={`bg-black overflow-hidden ${
              codePanel.isDragging ? '' : 'transition-all duration-300 ease-in-out'
            }`}
            style={{ width: codePanel.isDragging ? codePanel.width : codePanel.collapsed ? 0 : CODEPANEL_MAX }}
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
