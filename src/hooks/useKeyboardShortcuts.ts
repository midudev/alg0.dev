import { useEffect } from 'react'

interface KeyboardShortcutHandlers {
  togglePlay: () => void
  stepForward: () => void
  stepBackward: () => void
  onTabChange?: (tab: 'code' | 'about') => void
}

export function useKeyboardShortcuts({ togglePlay, stepForward, stepBackward, onTabChange }: KeyboardShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case ' ':
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
        case 'c':
          if (onTabChange) onTabChange('code')
          break
        case 'e':
          if (onTabChange) onTabChange('about')
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, stepForward, stepBackward, onTabChange])
}
