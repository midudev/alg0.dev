/**
 * SEO helpers derived from algorithm descriptions + catalog metadata.
 * Used for crawlable summaries, FAQ schema, and related links.
 */
import type { Locale } from '@i18n/translations'
import { getCategoryName, translations } from '@i18n/translations'
import type { AlgorithmSummary, Difficulty } from '@lib/types'
import { getRelatedAlgorithms } from '@lib/categories'

export interface ParsedAlgorithmDescription {
  title: string
  /** First prose paragraphs (excluding title). */
  introParagraphs: string[]
  /** Full body without the title line. */
  body: string
}

export interface AlgorithmFaqItem {
  question: string
  answer: string
}

export function parseAlgorithmDescription(description: string): ParsedAlgorithmDescription {
  const lines = description.split('\n')
  const title = (lines[0] ?? '').trim()
  const body = lines.slice(1).join('\n').trim()
  const introParagraphs = body
    .split(/\n\n+/)
    .map((p) => p.replace(/\n/g, ' ').trim())
    .filter(
      (p) =>
        p.length > 0 &&
        !/^(How it works|Cómo funciona|Time Complexity|Complejidad Temporal|Space Complexity|Complejidad Espacial|Properties|Propiedades|Mainly used|Se usa)/i.test(
          p,
        ),
    )
    .slice(0, 3)

  return { title, introParagraphs, body }
}

/** Extract a short complexity blurb if present in the description. */
export function extractComplexityBlurb(description: string, locale: Locale): string | null {
  const isEs = locale === 'es'
  const timeLabel = isEs ? 'Complejidad Temporal' : 'Time Complexity'
  const spaceLabel = isEs ? 'Complejidad Espacial' : 'Space Complexity'

  const timeIdx = description.indexOf(timeLabel)
  const spaceIdx = description.indexOf(spaceLabel)

  let timePart = ''
  if (timeIdx >= 0) {
    const after = description.slice(timeIdx + timeLabel.length)
    const end = after.search(
      /\n\n|Properties|Propiedades|Mainly|Se usa|Complejidad Espacial|Space Complexity/,
    )
    const block = (end >= 0 ? after.slice(0, end) : after).trim()
    const avg =
      block.match(/Average:\s*([^\n]+)/i)?.[1]?.trim() ||
      block.match(/Promedio:\s*([^\n]+)/i)?.[1]?.trim() ||
      block.match(/O\([^)]+\)/)?.[0]
    if (avg) timePart = isEs ? `Tiempo (promedio): ${avg}` : `Time (average): ${avg}`
  }

  let spacePart = ''
  if (spaceIdx >= 0) {
    const line = description.slice(spaceIdx).split('\n')[0] ?? ''
    const match = line.match(/O\([^)]+\)/)
    if (match) spacePart = isEs ? `Espacio: ${match[0]}` : `Space: ${match[0]}`
  }

  if (!timePart && !spacePart) return null
  return [timePart, spacePart].filter(Boolean).join(' · ')
}

function difficultyLabel(locale: Locale, difficulty: Difficulty): string {
  const map = {
    easy: { en: 'beginner', es: 'principiante' },
    intermediate: { en: 'intermediate', es: 'intermedio' },
    advanced: { en: 'advanced', es: 'avanzado' },
  } as const
  return map[difficulty][locale]
}

export function buildAlgorithmFaqs(
  locale: Locale,
  algorithm: AlgorithmSummary,
  description: string,
): AlgorithmFaqItem[] {
  const { title, introParagraphs } = parseAlgorithmDescription(description)
  const name = title || algorithm.name
  const category = getCategoryName(locale, algorithm.category)
  const level = difficultyLabel(locale, algorithm.difficulty)
  const intro = introParagraphs[0] ?? translations[locale].siteDescription
  const complexity = extractComplexityBlurb(description, locale)
  const related = getRelatedAlgorithms(algorithm, 3)
  const relatedNames = related.map((r) => r.name).join(', ')

  if (locale === 'es') {
    return [
      {
        question: `¿Qué es ${name}?`,
        answer: intro,
      },
      {
        question: `¿Cuál es la complejidad de ${name}?`,
        answer:
          complexity ??
          `${name} se explica con visualización paso a paso, incluyendo su complejidad temporal y espacial cuando aplica.`,
      },
      {
        question: `¿Para quién es este visualizador de ${name}?`,
        answer: `La visualización de ${name} está pensada para nivel ${level}, dentro de la categoría ${category}. Ideal para estudiantes, entrevistas técnicas y repaso práctico.`,
      },
      ...(related.length > 0
        ? [
            {
              question: `¿Qué algoritmos relacionados hay con ${name}?`,
              answer: `En la misma categoría (${category}) puedes explorar: ${relatedNames}. Todos tienen visualización interactiva.`,
            },
          ]
        : []),
    ]
  }

  return [
    {
      question: `What is ${name}?`,
      answer: intro,
    },
    {
      question: `What is the complexity of ${name}?`,
      answer:
        complexity ??
        `${name} is explained with a step-by-step visualization, including time and space complexity where applicable.`,
    },
    {
      question: `Who is this ${name} visualizer for?`,
      answer: `The ${name} visualization targets ${level}-level learners in the ${category} category. Useful for students, interview prep, and hands-on review.`,
    },
    ...(related.length > 0
      ? [
          {
            question: `What algorithms are related to ${name}?`,
            answer: `In the same category (${category}) you can explore: ${relatedNames}. Each has an interactive visualization.`,
          },
        ]
      : []),
  ]
}

export function schemaEducationalLevel(difficulty: Difficulty): string {
  if (difficulty === 'easy') return 'Beginner'
  if (difficulty === 'intermediate') return 'Intermediate'
  return 'Advanced'
}
