import { useState, useCallback } from 'react'
import type { Locale } from '@i18n/translations'
import { translations, getAlgorithmDescription } from '@i18n/translations'
import { usePlayback, SPEED_MAP } from '@hooks/usePlayback'
import type { Algorithm } from '@lib/types'
import CompareSelector from '@components/CompareSelector'
import ArrayVisualizer from '@components/ArrayVisualizer'
import GraphVisualizer from '@components/GraphVisualizer'
import MatrixVisualizer from '@components/MatrixVisualizer'
import ConceptVisualizer from '@components/ConceptVisualizer'

interface CompareViewProps {
    locale: Locale
    onExit: () => void
}

function MiniControls({
    currentStep,
    totalSteps,
    isPlaying,
    speed,
    onTogglePlay,
    onStepForward,
    onStepBackward,
    onSpeedChange,
    onStepChange,
    disabled,
    locale,
}: {
    currentStep: number
    totalSteps: number
    isPlaying: boolean
    speed: number
    onTogglePlay: () => void
    onStepForward: () => void
    onStepBackward: () => void
    onSpeedChange: (s: number) => void
    onStepChange: (s: number) => void
    disabled: boolean
    locale: Locale
}) {
    const t = translations[locale]

    return (
        <div className="flex items-center gap-1.5 justify-center py-2 px-3 border-t border-white/8 bg-black/40">
            {/* Step backward */}
            <button
                onClick={onStepBackward}
                disabled={disabled || currentStep <= 0}
                className="p-1 rounded hover:bg-white/8 disabled:opacity-20 text-neutral-500 hover:text-white transition-all active:scale-95"
                aria-label={t.stepBackward}
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
                    />
                </svg>
            </button>

            {/* Play/Pause */}
            <div className="relative flex items-center justify-center">
                {isPlaying && (
                    <svg
                        key={`${currentStep}-${speed}`}
                        className="absolute top-1/2 left-1/2 pointer-events-none"
                        style={{
                            width: '32px',
                            height: '32px',
                            transform: 'translate(-50%, -50%) rotate(-90deg)',
                        }}
                        viewBox="0 0 32 32"
                        aria-hidden="true"
                    >
                        <circle
                            cx="16"
                            cy="16"
                            r="14"
                            fill="none"
                            stroke="#eab308"
                            strokeWidth="2"
                            strokeLinecap="round"
                            style={{
                                strokeDasharray: '87.96',
                                strokeDashoffset: '87.96',
                                animation: `step-countdown ${SPEED_MAP[speed] || 400}ms linear forwards`,
                            }}
                        />
                    </svg>
                )}
                <button
                    onClick={onTogglePlay}
                    disabled={disabled}
                    className="w-7 h-7 rounded-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 flex items-center justify-center transition-all active:scale-95 relative z-10"
                    aria-label={t.playPause}
                >
                    {isPlaying ? (
                        <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <rect x="6" y="5" width="4" height="14" rx="1" />
                            <rect x="14" y="5" width="4" height="14" rx="1" />
                        </svg>
                    ) : (
                        <svg className="w-2.5 h-2.5 text-black" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M14.5528 7.77638C14.737 7.86851 14.737 8.13147 14.5528 8.2236L1.3618 14.8191C1.19558 14.9022 1 14.7813 1 14.5955L1 1.4045C1 1.21865 1.19558 1.09778 1.3618 1.18089L14.5528 7.77638Z"
                            />
                        </svg>
                    )}
                </button>
            </div>

            {/* Step forward */}
            <button
                onClick={onStepForward}
                disabled={disabled || currentStep >= totalSteps - 1}
                className="p-1 rounded hover:bg-white/8 disabled:opacity-20 text-neutral-500 hover:text-white transition-all active:scale-95"
                aria-label={t.stepForward}
            >
                <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
                    />
                </svg>
            </button>

            {/* Progress */}
            <div className="flex items-center gap-2 ml-1">
                <div className="relative w-16 group cursor-pointer">
                    <div className="h-0.5 bg-white/8 rounded-full overflow-hidden" aria-hidden="true">
                        <div
                            className="h-full bg-white rounded-full transition-all duration-200"
                            style={{
                                width: totalSteps > 1 ? `${(currentStep / (totalSteps - 1)) * 100}%` : '0%',
                            }}
                        />
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={Math.max(totalSteps - 1, 0)}
                        value={currentStep}
                        onChange={(e) => onStepChange(Number(e.target.value))}
                        disabled={disabled}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
                    />
                </div>
                <span className="text-[10px] text-neutral-600 font-mono tabular-nums min-w-[40px] text-right">
                    {totalSteps > 0 ? `${currentStep + 1}/${totalSteps}` : '\u2014'}
                </span>
            </div>

            {/* Speed */}
            <div className="flex items-center gap-1 ml-1">
                <input
                    type="range"
                    min={1}
                    max={5}
                    value={speed}
                    onChange={(e) => onSpeedChange(Number(e.target.value))}
                    className="w-10"
                    aria-label={t.speed}
                />
                <span className="text-[9px] text-neutral-600 font-mono w-4">{speed}x</span>
            </div>
        </div>
    )
}

function ComparePanel({
    locale,
    side,
    syncSpeed,
    onSyncSpeedChange,
    isSynced,
}: {
    locale: Locale
    side: 'left' | 'right'
    syncSpeed: number
    onSyncSpeedChange: (s: number) => void
    isSynced: boolean
}) {
    const t = translations[locale]
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

    const selectAlgorithm = useCallback(
        (algo: Algorithm) => {
            selectAlgorithmBase(algo)
        },
        [selectAlgorithmBase],
    )

    const handleSpeedChange = useCallback(
        (s: number) => {
            if (isSynced) {
                onSyncSpeedChange(s)
            } else {
                setSpeed(s)
            }
        },
        [isSynced, onSyncSpeedChange, setSpeed],
    )

    const effectiveSpeed = isSynced ? syncSpeed : speed

    const renderVisualization = () => {
        if (!selectedAlgorithm || !currentStepData) {
            return (
                <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center px-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center border border-white/8">
                        <svg
                            className="w-5 h-5 text-neutral-600"
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
                    <p className="text-sm text-neutral-500">{t.chooseAlgorithm}</p>
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
            case 'concept':
                return <ConceptVisualizer step={currentStepData} />
            default:
                return null
        }
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
            {/* Selector */}
            <div className="p-3 border-b border-white/8">
                <CompareSelector
                    selected={selectedAlgorithm}
                    onSelect={selectAlgorithm}
                    locale={locale}
                    label={side === 'left' ? t.selectLeftAlgorithm : t.selectRightAlgorithm}
                />
            </div>

            {/* Visualization */}
            <div className="flex-1 flex flex-col p-4 overflow-auto min-h-0">
                {renderVisualization()}
            </div>

            {/* Step description */}
            {currentStepData?.description && (
                <div className="px-3 pb-2" aria-live="polite">
                    <div className="text-xs text-neutral-300 bg-white/[0.03] rounded-lg px-3 py-2 border border-white/8">
                        <span className="text-amber-300/90 font-medium mr-1.5">
                            {t.step.replace('{n}', String(currentStep + 1))}
                        </span>
                        {currentStepData.description}
                    </div>
                </div>
            )}

            {/* Controls */}
            <MiniControls
                currentStep={currentStep}
                totalSteps={steps.length}
                isPlaying={isPlaying}
                speed={effectiveSpeed}
                onTogglePlay={togglePlay}
                onStepForward={stepForward}
                onStepBackward={stepBackward}
                onSpeedChange={handleSpeedChange}
                onStepChange={setCurrentStep}
                disabled={!selectedAlgorithm}
                locale={locale}
            />

            {/* Algorithm info */}
            {selectedAlgorithm && (
                <div className="px-3 py-2 border-t border-white/8">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-white truncate">{selectedAlgorithm.name}</span>
                        <span
                            className={`text-[9px] px-1.5 py-0.5 rounded shrink-0 ${selectedAlgorithm.difficulty === 'easy'
                                    ? 'bg-emerald-500/10 text-emerald-400'
                                    : selectedAlgorithm.difficulty === 'intermediate'
                                        ? 'bg-amber-500/10 text-amber-400'
                                        : 'bg-red-500/10 text-red-400'
                                }`}
                        >
                            {selectedAlgorithm.difficulty}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function CompareView({ locale, onExit }: CompareViewProps) {
    const t = translations[locale]
    const [isSynced, setIsSynced] = useState(false)
    const [syncSpeed, setSyncSpeed] = useState(2)

    return (
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Compare header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/8 bg-black shrink-0">
                <div className="flex items-center gap-3">
                    <h2 className="text-sm font-semibold text-white font-heading">
                        {t.compareModeTitle}
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    {/* Sync button */}
                    <button
                        onClick={() => setIsSynced(!isSynced)}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${isSynced
                                ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                                : 'bg-white/[0.04] text-neutral-500 border border-white/8 hover:bg-white/[0.06] hover:text-neutral-400'
                            }`}
                        aria-label={t.syncPlayback}
                        aria-pressed={isSynced}
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            {isSynced ? (
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.07-9.07a4.5 4.5 0 00-6.364 0l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                                </>
                            ) : (
                                <>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.181 8.68a4.503 4.503 0 011.903 1.415M7.5 21.5l3-3m0 0l-4.5-4.5a4.5 4.5 0 010-6.364m4.5 10.864l1.757-1.757M16.5 2.5l-3 3m0 0l4.5 4.5a4.5 4.5 0 010 6.364M13.5 5.5L11.743 7.257" />
                                </>
                            )}
                        </svg>
                        <span className="hidden sm:inline">{t.syncPlayback}</span>
                    </button>

                    {/* Exit button */}
                    <button
                        onClick={onExit}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-neutral-400 border border-white/8 hover:bg-white/[0.06] hover:text-white transition-all text-xs"
                        aria-label={t.exitCompare}
                    >
                        <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="hidden sm:inline">{t.exitCompare}</span>
                    </button>
                </div>
            </div>

            {/* Panels */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
                {/* Left panel */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0 border-b md:border-b-0 md:border-r border-white/8">
                    <ComparePanel
                        locale={locale}
                        side="left"
                        syncSpeed={syncSpeed}
                        onSyncSpeedChange={setSyncSpeed}
                        isSynced={isSynced}
                    />
                </div>

                {/* VS divider */}
                <div className="hidden md:flex items-center justify-center w-0 relative">
                    <div className="absolute z-10 w-8 h-8 rounded-full bg-neutral-900 border border-white/12 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase">{t.vs}</span>
                    </div>
                </div>

                {/* Mobile VS divider */}
                <div className="flex md:hidden items-center justify-center py-0 relative">
                    <div className="absolute z-10 w-7 h-7 rounded-full bg-neutral-900 border border-white/12 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-neutral-500 uppercase">{t.vs}</span>
                    </div>
                </div>

                {/* Right panel */}
                <div className="flex-1 flex flex-col min-h-0 min-w-0">
                    <ComparePanel
                        locale={locale}
                        side="right"
                        syncSpeed={syncSpeed}
                        onSyncSpeedChange={setSyncSpeed}
                        isSynced={isSynced}
                    />
                </div>
            </div>
        </div>
    )
}
