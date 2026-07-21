/**
 * Playback constants + event bus.
 * Engine: `createPlayback` in `create-playback.ts`.
 * Chrome (header controls, keyboard) publish commands / subscribe to state here.
 */

export const SPEED_MAP: Record<number, number> = {
  1: 1500,
  2: 800,
  3: 400,
  4: 150,
  5: 50,
}

export const SPEED_LABELS: Record<number, string> = {
  1: '0.5×',
  2: '0.75×',
  3: '1×',
  4: '2×',
  5: '4×',
}

export const PLAYBACK_STATE_EVENT = 'alg0:playback-state'
export const PLAYBACK_COMMAND_EVENT = 'alg0:playback-command'

export type PlaybackState = {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  speed: number
  /** No steps available (home / empty). */
  disabled: boolean
  /** An algorithm is selected (show code expand / mobile view-code). */
  hasAlgorithm: boolean
}

export type PlaybackCommand =
  | { type: 'togglePlay' }
  | { type: 'stepForward' }
  | { type: 'stepBackward' }
  | { type: 'setStep'; step: number }
  | { type: 'setSpeed'; speed: number }

export function publishPlaybackState(state: PlaybackState): void {
  window.dispatchEvent(new CustomEvent<PlaybackState>(PLAYBACK_STATE_EVENT, { detail: state }))
}

export function dispatchPlaybackCommand(command: PlaybackCommand): void {
  window.dispatchEvent(
    new CustomEvent<PlaybackCommand>(PLAYBACK_COMMAND_EVENT, { detail: command }),
  )
}

export function onPlaybackState(handler: (state: PlaybackState) => void): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<PlaybackState>).detail)
  }
  window.addEventListener(PLAYBACK_STATE_EVENT, listener)
  return () => window.removeEventListener(PLAYBACK_STATE_EVENT, listener)
}

export function onPlaybackCommand(handler: (command: PlaybackCommand) => void): () => void {
  const listener = (event: Event) => {
    handler((event as CustomEvent<PlaybackCommand>).detail)
  }
  window.addEventListener(PLAYBACK_COMMAND_EVENT, listener)
  return () => window.removeEventListener(PLAYBACK_COMMAND_EVENT, listener)
}
