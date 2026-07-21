import type { Locale } from '@i18n/translations'
import { translations } from '@i18n/translations'
import { SPEED_MAP } from '@hooks/usePlayback'

interface ControlsProps {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  onTogglePlay: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onSpeedChange: (speed: number) => void
  onStepChange: (step: number) => void
  disabled: boolean
  locale?: Locale
}

const SPEED_LABELS: Record<number, string> = {
  1: '0.5×',
  2: '0.75×',
  3: '1×',
  4: '2×',
  5: '4×',
}

/** Countdown ring around play (r = 16.5 in 40×40 viewBox) → next-step timing only */
const STEP_R = 16.5
const STEP_RING = 2 * Math.PI * STEP_R

export default function Controls({
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
  locale = 'en',
}: ControlsProps) {
  const t = translations[locale]
  const progress =
    totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : totalSteps === 1 ? 100 : 0
  const speedLabel = SPEED_LABELS[speed] ?? `${speed}×`
  const canGoBack = !disabled && currentStep > 0
  const canGoForward = !disabled && currentStep < totalSteps - 1

  return (
    <div
      className="controls flex items-center gap-5 min-w-0"
      role="toolbar"
      aria-label={t.controlsLabel}
    >
      {/* Transport */}
      <div className="flex items-center shrink-0" role="group" aria-label={t.controlsLabel}>
        <button
          type="button"
          onClick={onStepBackward}
          disabled={!canGoBack}
          className="controls-icon-btn"
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

        <div className="relative flex items-center justify-center w-8 h-8">
          {isPlaying && (
            <svg
              key={`${currentStep}-${speed}`}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              aria-hidden="true"
            >
              <circle
                cx="20"
                cy="20"
                r={STEP_R}
                fill="none"
                className="controls-ring-track"
                strokeWidth="3.5"
              />
              <circle
                cx="20"
                cy="20"
                r={STEP_R}
                fill="none"
                className="controls-ring-step"
                strokeWidth="3.5"
                strokeLinecap="round"
                style={{
                  transform: 'rotate(-90deg)',
                  transformOrigin: 'center',
                  strokeDasharray: STEP_RING,
                  strokeDashoffset: STEP_RING,
                  animation: `step-countdown ${SPEED_MAP[speed] || 400}ms linear forwards`,
                }}
              />
            </svg>
          )}
          <button
            type="button"
            onClick={onTogglePlay}
            disabled={disabled}
            className="controls-play relative z-10"
            aria-label={t.playPause}
          >
            {isPlaying ? (
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg
                className="w-3 h-3 ml-0.5"
                viewBox="0 0 16 16"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.5528 7.77638C14.737 7.86851 14.737 8.13147 14.5528 8.2236L1.3618 14.8191C1.19558 14.9022 1 14.7813 1 14.5955L1 1.4045C1 1.21865 1.19558 1.09778 1.3618 1.18089L14.5528 7.77638Z"
                />
              </svg>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={onStepForward}
          disabled={!canGoForward}
          className="controls-icon-btn"
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
      </div>

      {/* Progress: scrubber + step count as one unit */}
      <div className="flex items-center gap-1.5 min-w-0">
        <div className="relative group/scrub flex items-center w-28 sm:w-36 lg:w-40 h-7 shrink-0">
          <div className="controls-track absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full overflow-hidden pointer-events-none">
            <div
              className="controls-track-fill h-full rounded-full transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div
            className="controls-thumb absolute top-1/2 -translate-y-1/2 size-2.5 rounded-full opacity-0 scale-75 group-hover/scrub:opacity-100 group-hover/scrub:scale-100 group-focus-within/scrub:opacity-100 group-focus-within/scrub:scale-100 transition-[opacity,transform,left] duration-150 ease-out pointer-events-none"
            style={{ left: `calc(${progress}% - 5px)` }}
            aria-hidden="true"
          />
          <input
            type="range"
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            value={currentStep}
            onChange={(e) => onStepChange(Number(e.target.value))}
            disabled={disabled}
            aria-label={
              totalSteps > 0
                ? t.progressStep
                    .replace('{current}', String(currentStep + 1))
                    .replace('{total}', String(totalSteps))
                : t.progressStep.replace('{current}', '0').replace('{total}', '0')
            }
            aria-valuemin={0}
            aria-valuemax={Math.max(totalSteps - 1, 0)}
            aria-valuenow={currentStep}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
          />
        </div>

        <div
          className="tabular-nums font-mono text-[11px] select-none whitespace-nowrap"
          aria-hidden="true"
        >
          <span className="controls-step-current font-medium">
            {totalSteps > 0 ? currentStep + 1 : '—'}
          </span>
          <span className="controls-step-sep">/</span>
          <span className="controls-step-total">{totalSteps > 0 ? totalSteps : '—'}</span>
        </div>
      </div>

      {/* Speed */}
      <div className="hidden sm:flex items-center gap-1.5 shrink-0">
        <span
          className="controls-speed-label text-[11px] font-mono tabular-nums whitespace-nowrap"
          id="speed-label"
        >
          {speedLabel}
        </span>
        <div className="relative flex items-center w-16 h-7">
          <div className="controls-track absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full pointer-events-none">
            <div
              className="controls-track-fill-muted h-full rounded-full transition-[width] duration-150 ease-out"
              style={{ width: `${((speed - 1) / 4) * 100}%` }}
            />
          </div>
          <div
            className="controls-thumb absolute top-1/2 -translate-y-1/2 size-2.5 rounded-full transition-[left] duration-150 ease-out pointer-events-none"
            style={{ left: `calc(${((speed - 1) / 4) * 100}% - 5px)` }}
            aria-hidden="true"
          />
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            aria-labelledby="speed-label"
            aria-label={t.speedLevel.replace('{n}', String(speed))}
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={speed}
            aria-valuetext={speedLabel}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
