import { useEffect } from 'react'

interface KeyboardShortcutHandlers {
  togglePlay: () => void
  stepForward: () => void
  stepBackward: () => void
}

export function useKeyboardShortcuts({ togglePlay, stepForward, stepBackward }: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          togglePlay()
          break
        case 'ArrowRight':
          e.preventDefault()
          stepForward()
          break
        case 'ArrowLeft':
          e.preventDefault()
          stepBackward()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, stepForward, stepBackward])
}
