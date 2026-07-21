/**
 * Global keyboard shortcuts (plain JS).
 * Space / ← / → for playback.
 */
import { dispatchPlaybackCommand } from '@lib/playback'

function isTypingTarget(target: EventTarget | null): boolean {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true
  if (target instanceof HTMLElement && target.isContentEditable) return true
  return false
}

export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', (event) => {
    if (isTypingTarget(event.target)) return

    // Playback keys: don't steal when focus is inside the code viewer
    // (arrows/space scroll that region).
    if (
      event.target instanceof Element &&
      event.target.closest(
        '[data-code-viewer], [data-code-variants], [data-algorithm-explanation-scroll]',
      )
    ) {
      return
    }

    switch (event.key) {
      case ' ':
        event.preventDefault()
        dispatchPlaybackCommand({ type: 'togglePlay' })
        break
      case 'ArrowRight':
        event.preventDefault()
        dispatchPlaybackCommand({ type: 'stepForward' })
        break
      case 'ArrowLeft':
        event.preventDefault()
        dispatchPlaybackCommand({ type: 'stepBackward' })
        break
    }
  })
}
