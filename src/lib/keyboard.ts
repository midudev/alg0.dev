/**
 * Global keyboard shortcuts for playback (plain JS).
 * Space / ← / → / c / e — same as the former useKeyboardShortcuts hook.
 */
import { dispatchPlaybackCommand } from '@lib/playback'

export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', (event) => {
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return
    }
    // Don't steal keys from Monaco / contenteditable
    if (event.target instanceof HTMLElement && event.target.isContentEditable) return
    if (event.target instanceof Element && event.target.closest('.monaco-editor')) return

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
      case 'c':
      case 'C':
        dispatchPlaybackCommand({ type: 'setTab', tab: 'code' })
        break
      case 'e':
      case 'E':
        dispatchPlaybackCommand({ type: 'setTab', tab: 'about' })
        break
    }
  })
}
