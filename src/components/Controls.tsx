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
  const btnClass =
    'p-1.5 rounded-md hover:bg-white/[0.08] disabled:opacity-20 disabled:hover:bg-transparent transition-all text-neutral-500 hover:text-white active:scale-95'

  return (
    <div className="flex items-center gap-3 lg:gap-5 min-w-0" role="toolbar" aria-label={t.controlsLabel}>
      {/* Playback buttons */}
      <div className="flex items-center gap-0.5" role="group" aria-label={t.controlsLabel}>
        {/* Step backward */}
        <button
          onClick={onStepBackward}
          disabled={disabled || currentStep <= 0}
          className={btnClass}
          aria-label={t.stepBackward}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M10.5 14.0607L9.96966 13.5303L5.14644 8.7071C4.75592 8.31658 4.75592 7.68341 5.14644 7.29289L9.96966 2.46966L10.5 1.93933L11.5607 2.99999L11.0303 3.53032L6.56065 7.99999L11.0303 12.4697L11.5607 13L10.5 14.0607Z"
              fill="currentColor"
            />
          </svg>
        </button>

        {/* Play/Pause with countdown ring */}
        <div className="relative flex items-center justify-center mx-1">
          {isPlaying && (
            <svg
              key={`${currentStep}-${speed}`}
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                width: '38px',
                height: '38px',
                transform: 'translate(-50%, -50%) rotate(-90deg)',
              }}
              viewBox="0 0 38 38"
              aria-hidden="true"
            >
              <circle
                cx="19"
                cy="19"
                r="17"
                fill="none"
                stroke="#eab308"
                strokeWidth="2"
                strokeLinecap="round"
                style={{
                  strokeDasharray: '106.81',
                  strokeDashoffset: '106.81',
                  animation: `step-countdown ${SPEED_MAP[speed] || 400}ms linear forwards`,
                }}
              />
            </svg>
          )}
          <button
            onClick={onTogglePlay}
            disabled={disabled}
            className="w-8 h-8 rounded-full bg-white hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-600 flex items-center justify-center transition-all active:scale-95 relative z-10"
            aria-label={isPlaying ? t.playPause : t.playPause}
          >
            {isPlaying ? (
              <svg className="w-3.5 h-3.5 text-black" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" />
                <rect x="14" y="5" width="4" height="14" rx="1" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-black" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.5528 7.77638C14.737 7.86851 14.737 8.13147 14.5528 8.2236L1.3618 14.8191C1.19558 14.9022 1 14.7813 1 14.5955L1 1.4045C1 1.21865 1.19558 1.09778 1.3618 1.18089L14.5528 7.77638Z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Step forward */}
        <button
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps - 1}
          className={btnClass}
          aria-label={t.stepForward}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.50001 1.93933L6.03034 2.46966L10.8536 7.29288C11.2441 7.68341 11.2441 8.31657 10.8536 8.7071L6.03034 13.5303L5.50001 14.0607L4.43935 13L4.96968 12.4697L9.43935 7.99999L4.96968 3.53032L4.43935 2.99999L5.50001 1.93933Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>

      {/* Progress bar + counter */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-20 lg:w-36 group cursor-pointer shrink-0">
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
            aria-label={
              totalSteps > 0
                ? t.progressStep.replace('{current}', String(currentStep + 1)).replace('{total}', String(totalSteps))
                : t.progressStep.replace('{current}', '0').replace('{total}', '0')
            }
            aria-valuemin={0}
            aria-valuemax={Math.max(totalSteps - 1, 0)}
            aria-valuenow={currentStep}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
          />
        </div>
        <span className="text-[11px] text-neutral-600 font-mono tabular-nums min-w-[55px] text-right" aria-hidden="true">
          {totalSteps > 0 ? `${currentStep + 1} / ${totalSteps}` : '\u2014 / \u2014'}
        </span>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-neutral-600 uppercase tracking-wider font-medium hidden sm:inline" id="speed-label">
          {t.speed}
        </span>
        <input
          type="range"
          min={1}
          max={5}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          aria-labelledby="speed-label"
          aria-label={t.speedLevel.replace('{n}', String(speed))}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={speed}
          aria-valuetext={t.speedLevel.replace('{n}', String(speed))}
          className="w-14 lg:w-16"
        />
      </div>
    </div>
  )
}
