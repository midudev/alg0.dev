/**
 * Global keyboard shortcuts (plain JS).
 * Space / ← / → for playback; C / E for code-panel tabs.
 */
import { dispatchPlaybackCommand } from '@lib/playback'
import { setCodePanelTab } from '@lib/code-panel-state'

function isTypingTarget(target: EventTarget | null): boolean {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) return true
  if (target instanceof HTMLElement && target.isContentEditable) return true
  return false
}

export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', (event) => {
    if (isTypingTarget(event.target)) return

    // C / E always switch code-panel tabs (even when focus is on a tab button
    // inside the panel after clicking "Code" / "Explanation").
    if (event.key === 'c' || event.key === 'C') {
      event.preventDefault()
      setCodePanelTab('code')
      return
    }
    if (event.key === 'e' || event.key === 'E') {
      event.preventDefault()
      setCodePanelTab('about')
      return
    }

    // Playback keys: don't steal when focus is inside the code viewer
    // (arrows/space scroll that region).
    if (
      event.target instanceof Element &&
      event.target.closest('[data-code-viewer], [data-code-variants], [data-code-panel-about]')
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
