import type { Locale } from '@i18n/translations'
import type { Difficulty } from '@lib/types'

interface DifficultyPresentation {
  label: Record<Locale, string>
  color: string
  background: string
  dot: string
}

export const difficultyPresentation = {
  easy: {
    label: { en: 'Easy', es: 'Fácil' },
    color: 'text-emerald-400',
    background: 'bg-emerald-400/10 border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  intermediate: {
    label: { en: 'Intermediate', es: 'Intermedio' },
    color: 'text-amber-400',
    background: 'bg-amber-400/10 border-amber-400/20',
    dot: 'bg-amber-400',
  },
  advanced: {
    label: { en: 'Advanced', es: 'Avanzado' },
    color: 'text-red-400',
    background: 'bg-red-400/10 border-red-400/20',
    dot: 'bg-red-400',
  },
} satisfies Record<Difficulty, DifficultyPresentation>
