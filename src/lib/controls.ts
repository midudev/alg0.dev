/**
 * Plain-JS header playback controls (markup from SiteHeader / HeaderControls).
 * Listens to `alg0:playback-state` and dispatches `alg0:playback-command`.
 */
import { $ } from '@lib/dom'
import {
  SPEED_LABELS,
  SPEED_MAP,
  dispatchPlaybackCommand,
  onPlaybackState,
  type PlaybackState,
} from '@lib/playback'

const STEP_R = 16.5
const STEP_RING = 2 * Math.PI * STEP_R

function root(): HTMLElement | null {
  return $('[data-controls]')
}

function syncControls(state: PlaybackState): void {
  const el = root()
  if (!el) return

  const { currentStep, totalSteps, isPlaying, speed, disabled } = state
  const progress =
    totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : totalSteps === 1 ? 100 : 0
  const canGoBack = !disabled && currentStep > 0
  const canGoForward = !disabled && currentStep < totalSteps - 1
  const speedLabel = SPEED_LABELS[speed] ?? `${speed}×`

  el.toggleAttribute('data-disabled', disabled)
  el.toggleAttribute('data-playing', isPlaying)

  const back = $<HTMLButtonElement>('[data-controls-back]', el)
  const forward = $<HTMLButtonElement>('[data-controls-forward]', el)
  const play = $<HTMLButtonElement>('[data-controls-play]', el)
  if (back) back.disabled = !canGoBack
  if (forward) forward.disabled = !canGoForward
  if (play) play.disabled = disabled

  // Play / pause icons
  const iconPlay = $('[data-controls-icon-play]', el)
  const iconPause = $('[data-controls-icon-pause]', el)
  if (iconPlay) iconPlay.toggleAttribute('hidden', isPlaying)
  if (iconPause) iconPause.toggleAttribute('hidden', !isPlaying)

  // Countdown ring (rebuild on step/speed while playing so CSS animation restarts)
  const ringHost = $('[data-controls-ring]', el)
  if (ringHost) {
    ringHost.replaceChildren()
    if (isPlaying && !disabled) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.setAttribute(
        'class',
        'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none',
      )
      svg.setAttribute('width', '40')
      svg.setAttribute('height', '40')
      svg.setAttribute('viewBox', '0 0 40 40')
      svg.setAttribute('aria-hidden', 'true')

      const track = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      track.setAttribute('cx', '20')
      track.setAttribute('cy', '20')
      track.setAttribute('r', String(STEP_R))
      track.setAttribute('fill', 'none')
      track.setAttribute('class', 'controls-ring-track')
      track.setAttribute('stroke-width', '3.5')

      const step = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      step.setAttribute('cx', '20')
      step.setAttribute('cy', '20')
      step.setAttribute('r', String(STEP_R))
      step.setAttribute('fill', 'none')
      step.setAttribute('class', 'controls-ring-step')
      step.setAttribute('stroke-width', '3.5')
      step.setAttribute('stroke-linecap', 'round')
      step.style.transform = 'rotate(-90deg)'
      step.style.transformOrigin = 'center'
      step.style.strokeDasharray = String(STEP_RING)
      step.style.strokeDashoffset = String(STEP_RING)
      step.style.animation = `step-countdown ${SPEED_MAP[speed] || 400}ms linear forwards`

      svg.append(track, step)
      ringHost.append(svg)
    }
  }

  // Progress scrubber
  const fill = $<HTMLElement>('[data-controls-progress-fill]', el)
  const thumb = $<HTMLElement>('[data-controls-progress-thumb]', el)
  const input = $<HTMLInputElement>('[data-controls-progress-input]', el)
  if (fill) fill.style.width = `${progress}%`
  if (thumb) thumb.style.left = `calc(${progress}% - 5px)`
  if (input) {
    input.max = String(Math.max(totalSteps - 1, 0))
    input.value = String(currentStep)
    input.disabled = disabled
    input.setAttribute('aria-valuemin', '0')
    input.setAttribute('aria-valuemax', String(Math.max(totalSteps - 1, 0)))
    input.setAttribute('aria-valuenow', String(currentStep))
  }

  const stepCurrent = $('[data-controls-step-current]', el)
  const stepTotal = $('[data-controls-step-total]', el)
  if (stepCurrent) stepCurrent.textContent = totalSteps > 0 ? String(currentStep + 1) : '—'
  if (stepTotal) stepTotal.textContent = totalSteps > 0 ? String(totalSteps) : '—'

  // Speed
  const speedPct = ((speed - 1) / 4) * 100
  const speedLabelEl = $('[data-controls-speed-label]', el)
  const speedFill = $<HTMLElement>('[data-controls-speed-fill]', el)
  const speedThumb = $<HTMLElement>('[data-controls-speed-thumb]', el)
  const speedInput = $<HTMLInputElement>('[data-controls-speed-input]', el)
  if (speedLabelEl) speedLabelEl.textContent = speedLabel
  if (speedFill) speedFill.style.width = `${speedPct}%`
  if (speedThumb) speedThumb.style.left = `calc(${speedPct}% - 5px)`
  if (speedInput) {
    speedInput.value = String(speed)
    speedInput.setAttribute('aria-valuenow', String(speed))
    speedInput.setAttribute('aria-valuetext', speedLabel)
    speedInput.setAttribute(
      'aria-label',
      speedInput.dataset.speedLabelTemplate?.replace('{n}', String(speed)) ?? '',
    )
  }

  // Code panel toggle visibility is managed by code-panel-shell (collapsed + has-algorithm).
  document.documentElement.toggleAttribute('data-has-algorithm', state.hasAlgorithm)
  // Ensure toggle reflects algorithm presence immediately (shell also re-syncs on collapse).
  const codeToggle = $<HTMLButtonElement>('[data-code-panel-toggle]')
  if (codeToggle && !state.hasAlgorithm) codeToggle.hidden = true
}

export function initControls(): void {
  onPlaybackState(syncControls)

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Element)) return

    if (target.closest('[data-controls-back]')) {
      dispatchPlaybackCommand({ type: 'stepBackward' })
      return
    }
    if (target.closest('[data-controls-forward]')) {
      dispatchPlaybackCommand({ type: 'stepForward' })
      return
    }
    if (target.closest('[data-controls-play]')) {
      dispatchPlaybackCommand({ type: 'togglePlay' })
      return
    }
  })

  document.addEventListener('input', (event) => {
    const target = event.target
    if (!(target instanceof HTMLInputElement)) return

    if (target.matches('[data-controls-progress-input]')) {
      dispatchPlaybackCommand({ type: 'setStep', step: Number(target.value) })
      return
    }
    if (target.matches('[data-controls-speed-input]')) {
      dispatchPlaybackCommand({ type: 'setSpeed', speed: Number(target.value) })
    }
  })
}
