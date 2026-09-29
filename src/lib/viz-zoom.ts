/**
 * Zoom + pan for the algorithm stage visualization (plain JS).
 * Markup: `[data-viz-zoom]` in `AlgoStage.astro`.
 *
 * - Zoom in (> 1): the step renders at the viewport size and is magnified;
 *   the viewport scrolls to pan (drag with the mouse, swipe on touch).
 * - Zoom out (< 1): the step renders on a larger canvas (viewport / zoom) and
 *   is scaled down to fit, giving cramped visualizations more room.
 *
 * Sizes live in inline styles because visualizers reset the host `className`
 * on every paint.
 */
import { $ } from '@lib/dom'

const MIN_ZOOM = 0.5
const MAX_ZOOM = 3
const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3]
const MIN_HOST_HEIGHT = 200
const WHEEL_SENSITIVITY = 0.004
/** Caps one mouse-wheel notch (~100px) while leaving trackpad pinch deltas untouched. */
const MAX_WHEEL_DELTA = 50

type Point = { x: number; y: number }

/** Safari-only pinch events (trackpad on macOS). */
type GestureEvent = UIEvent & { scale: number; clientX: number; clientY: number }

function clampZoom(value: number): number {
  const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value))
  // Snap back to 1 so pinching around it lands on the crisp, untransformed layout.
  return Math.abs(clamped - 1) < 0.04 ? 1 : clamped
}

function touchDistance(a: Touch, b: Touch): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
}

export function initVizZoom(root: HTMLElement): () => void {
  const viewport = $<HTMLElement>('[data-viz-viewport]', root)
  const canvas = $<HTMLElement>('[data-viz-canvas]', root)
  const host = $<HTMLElement>('[data-step-viz]', root)
  const zoomIn = $<HTMLButtonElement>('[data-viz-zoom-in]', root)
  const zoomOut = $<HTMLButtonElement>('[data-viz-zoom-out]', root)
  const reset = $<HTMLButtonElement>('[data-viz-zoom-reset]', root)
  if (!viewport || !canvas || !host) return () => {}

  let zoom = 1

  const layout = () => {
    // Toggles scrolling (CSS), so set it before measuring the viewport.
    root.toggleAttribute('data-zoomed-in', zoom > 1)
    if (zoom === 1) {
      for (const el of [canvas, host]) {
        el.style.removeProperty('width')
        el.style.removeProperty('height')
      }
      host.style.removeProperty('flex')
      host.style.removeProperty('transform')
      host.style.removeProperty('transform-origin')
      return
    }

    const fit = zoom < 1 ? 1 / zoom : 1
    const width = viewport.clientWidth * fit
    const height = Math.max(MIN_HOST_HEIGHT, viewport.clientHeight * fit)
    host.style.width = `${width}px`
    host.style.height = `${height}px`
    host.style.flex = 'none'
    host.style.transformOrigin = '0 0'
    host.style.transform = `scale(${zoom})`
    canvas.style.width = `${width * zoom}px`
    canvas.style.height = `${height * zoom}px`
  }

  const syncControls = () => {
    const percent = `${Math.round(zoom * 100)}%`
    if (zoomIn) zoomIn.disabled = zoom >= MAX_ZOOM
    if (zoomOut) zoomOut.disabled = zoom <= MIN_ZOOM
    if (reset) {
      reset.textContent = percent
      reset.setAttribute('aria-label', `${reset.dataset.label ?? ''} (${percent})`)
    }
  }

  /** Change zoom keeping the content under `focus` (viewport coords) in place. */
  const setZoom = (value: number, focus?: Point) => {
    const next = clampZoom(value)
    if (next === zoom) return

    const x = focus?.x ?? viewport.clientWidth / 2
    const y = focus?.y ?? viewport.clientHeight / 2
    const ratioX = (viewport.scrollLeft + x) / viewport.scrollWidth
    const ratioY = (viewport.scrollTop + y) / viewport.scrollHeight

    zoom = next
    layout()
    viewport.scrollLeft = ratioX * viewport.scrollWidth - x
    viewport.scrollTop = ratioY * viewport.scrollHeight - y
    syncControls()
  }

  const stepZoom = (direction: 1 | -1) => {
    const next =
      direction > 0
        ? ZOOM_STEPS.find((step) => step > zoom + 0.01)
        : ZOOM_STEPS.findLast((step) => step < zoom - 0.01)
    setZoom(next ?? (direction > 0 ? MAX_ZOOM : MIN_ZOOM))
  }

  const toViewportPoint = (clientX: number, clientY: number): Point => {
    const rect = viewport.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  const onClick = (event: Event) => {
    const target = event.target
    if (!(target instanceof Element)) return
    if (target.closest('[data-viz-zoom-in]')) stepZoom(1)
    else if (target.closest('[data-viz-zoom-out]')) stepZoom(-1)
    else if (target.closest('[data-viz-zoom-reset]')) setZoom(1)
  }

  // Ctrl/⌘ + wheel — also what trackpad pinch sends in Chromium and Firefox.
  const onWheel = (event: WheelEvent) => {
    if (!event.ctrlKey && !event.metaKey) return
    event.preventDefault()
    const lines = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1
    const delta = Math.max(-MAX_WHEEL_DELTA, Math.min(MAX_WHEEL_DELTA, event.deltaY * lines))
    setZoom(
      zoom * Math.exp(-delta * WHEEL_SENSITIVITY),
      toViewportPoint(event.clientX, event.clientY),
    )
  }

  // Two-finger pinch on touch screens; one finger keeps native scrolling.
  let pinch: { distance: number; zoom: number } | null = null

  const onTouchStart = (event: TouchEvent) => {
    if (event.touches.length !== 2) return
    pinch = { distance: touchDistance(event.touches[0], event.touches[1]), zoom }
  }

  const onTouchMove = (event: TouchEvent) => {
    if (!pinch || event.touches.length !== 2) return
    if (event.cancelable) event.preventDefault()
    const [a, b] = [event.touches[0], event.touches[1]]
    setZoom(
      (pinch.zoom * touchDistance(a, b)) / pinch.distance,
      toViewportPoint((a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2),
    )
  }

  const onTouchEnd = (event: TouchEvent) => {
    if (event.touches.length < 2) pinch = null
  }

  // Safari trackpad pinch. On iOS the touch handlers already zoom, so only
  // block the page zoom there.
  let gestureStartZoom = 1

  const onGestureStart = (event: Event) => {
    event.preventDefault()
    gestureStartZoom = zoom
  }

  const onGestureChange = (event: Event) => {
    event.preventDefault()
    if (pinch) return
    const gesture = event as GestureEvent
    setZoom(gestureStartZoom * gesture.scale, toViewportPoint(gesture.clientX, gesture.clientY))
  }

  // Drag to pan with the mouse while zoomed in.
  let drag: { x: number; y: number; left: number; top: number } | null = null

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || zoom <= 1) return
    drag = {
      x: event.clientX,
      y: event.clientY,
      left: viewport.scrollLeft,
      top: viewport.scrollTop,
    }
    viewport.setPointerCapture(event.pointerId)
    root.setAttribute('data-panning', '')
  }

  const onPointerMove = (event: PointerEvent) => {
    if (!drag) return
    viewport.scrollLeft = drag.left - (event.clientX - drag.x)
    viewport.scrollTop = drag.top - (event.clientY - drag.y)
  }

  const onPointerUp = () => {
    drag = null
    root.removeAttribute('data-panning')
  }

  const resizeObserver = new ResizeObserver(() => {
    if (zoom !== 1) layout()
  })
  resizeObserver.observe(viewport)

  root.addEventListener('click', onClick)
  viewport.addEventListener('wheel', onWheel, { passive: false })
  viewport.addEventListener('touchstart', onTouchStart, { passive: true })
  viewport.addEventListener('touchmove', onTouchMove, { passive: false })
  viewport.addEventListener('touchend', onTouchEnd)
  viewport.addEventListener('touchcancel', onTouchEnd)
  viewport.addEventListener('gesturestart', onGestureStart)
  viewport.addEventListener('gesturechange', onGestureChange)
  viewport.addEventListener('pointerdown', onPointerDown)
  viewport.addEventListener('pointermove', onPointerMove)
  viewport.addEventListener('pointerup', onPointerUp)
  viewport.addEventListener('pointercancel', onPointerUp)
  syncControls()

  return () => {
    resizeObserver.disconnect()
    root.removeEventListener('click', onClick)
    viewport.removeEventListener('wheel', onWheel)
    viewport.removeEventListener('touchstart', onTouchStart)
    viewport.removeEventListener('touchmove', onTouchMove)
    viewport.removeEventListener('touchend', onTouchEnd)
    viewport.removeEventListener('touchcancel', onTouchEnd)
    viewport.removeEventListener('gesturestart', onGestureStart)
    viewport.removeEventListener('gesturechange', onGestureChange)
    viewport.removeEventListener('pointerdown', onPointerDown)
    viewport.removeEventListener('pointermove', onPointerMove)
    viewport.removeEventListener('pointerup', onPointerUp)
    viewport.removeEventListener('pointercancel', onPointerUp)
  }
}
