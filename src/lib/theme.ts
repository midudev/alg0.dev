import { $ } from '@lib/dom'

export type Theme = 'light' | 'dark'

export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

export function setTheme(theme: Theme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme
  document.cookie = `theme=${theme}; Path=/; Max-Age=31536000; SameSite=Lax`
  $<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'light' ? '#ffffff' : '#000000',
  )
  window.dispatchEvent(new CustomEvent('themechange', { detail: theme }))
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'light' ? 'dark' : 'light'
  setTheme(next)
  return next
}

/** Resolve theme from cookie or system preference (used by the FOUC inline script). */
export function resolveInitialTheme(cookie = document.cookie): Theme {
  const saved = cookie
    .split('; ')
    .find((part) => part.startsWith('theme='))
    ?.split('=')[1]
  if (saved === 'light' || saved === 'dark') return saved
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light'
  }
  return 'dark'
}
