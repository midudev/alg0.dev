/**
 * Plain-JS playback engine (no React).
 * Owns play/step/speed state, autoplay timers, and the command bus side.
 */
import type { Algorithm, Step } from '@lib/types'
import type { Locale } from '@i18n/translations'
import {
  SPEED_MAP,
  onPlaybackCommand,
  publishPlaybackState,
  type PlaybackCommand,
  type PlaybackState,
} from '@lib/playback'

export type PlaybackSnapshot = {
  selectedAlgorithm: Algorithm | null
  steps: Step[]
  currentStep: number
  isPlaying: boolean
  speed: number
  currentStepData: Step | null
}

export type CreatePlaybackOptions = {
  locale: Locale
  initialAlgorithm?: Algorithm | null
  initialSteps?: Step[] | null
  /** Delay before first autoplay (ms). Default 800. */
  initialAutoplayDelay?: number
  /** Delay before autoplay after selecting an algorithm (ms). Default 600. */
  selectAutoplayDelay?: number
}

export type PlaybackController = {
  /** Subscribe to snapshot changes. Returns unsubscribe. */
  subscribe: (listener: () => void) => () => void
  /** Current immutable-ish snapshot (mutates fields in place; call getSnapshot after each emit). */
  getSnapshot: () => PlaybackSnapshot
  selectAlgorithm: (algo: Algorithm) => void
  /** Swap Algorithm object without resetting steps/playback (SSR hydrate → full module). */
  replaceAlgorithm: (algo: Algorithm) => void
  clearSelection: () => void
  stepForward: () => void
  stepBackward: () => void
  togglePlay: () => void
  setCurrentStep: (step: number) => void
  setSpeed: (speed: number) => void
  /** Tear down timers + command listener. */
  dispose: () => void
}

function resolveInitialSteps(
  locale: Locale,
  initialAlgorithm?: Algorithm | null,
  initialSteps?: Step[] | null,
): Step[] {
  if (initialSteps && initialSteps.length > 0) return initialSteps
  if (initialAlgorithm) return initialAlgorithm.generateSteps(locale)
  return []
}

export function createPlayback(options: CreatePlaybackOptions): PlaybackController {
  const {
    locale,
    initialAlgorithm = null,
    initialSteps = null,
    initialAutoplayDelay = 800,
    selectAutoplayDelay = 600,
  } = options

  let selectedAlgorithm: Algorithm | null = initialAlgorithm
  let steps: Step[] = resolveInitialSteps(locale, initialAlgorithm, initialSteps)
  let currentStep = 0
  let isPlaying = false
  let speed = 2

  let intervalId: ReturnType<typeof setInterval> | null = null
  let autoplayTimerId: ReturnType<typeof setTimeout> | null = null
  const listeners = new Set<() => void>()

  // Stable snapshot object so useSyncExternalStore can compare by reference
  // when nothing changed; we replace it on every emit.
  let snapshot: PlaybackSnapshot = buildSnapshot()

  function buildSnapshot(): PlaybackSnapshot {
    return {
      selectedAlgorithm,
      steps,
      currentStep,
      isPlaying,
      speed,
      currentStepData: steps[currentStep] ?? null,
    }
  }

  function chromeState(): PlaybackState {
    return {
      currentStep,
      totalSteps: steps.length,
      isPlaying,
      speed,
      disabled: steps.length === 0,
      hasAlgorithm: selectedAlgorithm != null,
    }
  }

  function emit(): void {
    snapshot = buildSnapshot()
    for (const listener of listeners) listener()
    if (typeof window !== 'undefined') {
      publishPlaybackState(chromeState())
    }
  }

  function clearAutoplayTimer(): void {
    if (autoplayTimerId != null) {
      clearTimeout(autoplayTimerId)
      autoplayTimerId = null
    }
  }

  function clearPlayInterval(): void {
    if (intervalId != null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function syncPlayInterval(): void {
    clearPlayInterval()
    if (!isPlaying || steps.length === 0) return
    intervalId = setInterval(() => {
      if (currentStep >= steps.length - 1) {
        isPlaying = false
        clearPlayInterval()
        emit()
        return
      }
      currentStep += 1
      emit()
    }, SPEED_MAP[speed] || 400)
  }

  function scheduleAutoplay(delay: number): void {
    clearAutoplayTimer()
    if (steps.length === 0) return
    autoplayTimerId = setTimeout(() => {
      autoplayTimerId = null
      isPlaying = true
      syncPlayInterval()
      emit()
    }, delay)
  }

  function selectAlgorithm(algo: Algorithm): void {
    clearAutoplayTimer()
    clearPlayInterval()
    isPlaying = false
    selectedAlgorithm = algo
    steps = algo.generateSteps(locale)
    currentStep = 0
    emit()
    scheduleAutoplay(selectAutoplayDelay)
  }

  function replaceAlgorithm(algo: Algorithm): void {
    selectedAlgorithm = algo
    emit()
  }

  function clearSelection(): void {
    clearAutoplayTimer()
    clearPlayInterval()
    isPlaying = false
    selectedAlgorithm = null
    steps = []
    currentStep = 0
    emit()
  }

  function stepForward(): void {
    if (steps.length === 0) return
    currentStep = Math.min(currentStep + 1, steps.length - 1)
    emit()
  }

  function stepBackward(): void {
    currentStep = Math.max(currentStep - 1, 0)
    emit()
  }

  function togglePlay(): void {
    if (steps.length === 0) return
    if (currentStep >= steps.length - 1) {
      currentStep = 0
      isPlaying = true
      syncPlayInterval()
      emit()
      return
    }
    isPlaying = !isPlaying
    syncPlayInterval()
    emit()
  }

  function setCurrentStep(step: number): void {
    if (steps.length === 0) {
      currentStep = 0
    } else {
      currentStep = Math.max(0, Math.min(step, steps.length - 1))
    }
    emit()
  }

  function setSpeed(next: number): void {
    speed = next
    // Restart interval with new timing if currently playing
    syncPlayInterval()
    emit()
  }

  function handleCommand(command: PlaybackCommand): void {
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
    }
  }

  let unbindCommands: (() => void) | null = null

  // Client-only: command bus + initial autoplay + chrome publish
  if (typeof window !== 'undefined') {
    unbindCommands = onPlaybackCommand(handleCommand)
    if (steps.length > 0) {
      scheduleAutoplay(initialAutoplayDelay)
    }
    publishPlaybackState(chromeState())
  }

  return {
    subscribe(listener) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    getSnapshot: () => snapshot,
    selectAlgorithm,
    replaceAlgorithm,
    clearSelection,
    stepForward,
    stepBackward,
    togglePlay,
    setCurrentStep,
    setSpeed,
    dispose() {
      clearAutoplayTimer()
      clearPlayInterval()
      unbindCommands?.()
      unbindCommands = null
      listeners.clear()
    },
  }
}
