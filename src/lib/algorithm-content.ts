import type { Locale } from '@i18n/translations'
import { translations } from '@i18n/translations'

type AlgorithmDescriptions = Record<Locale, string>
type DescriptionModule = { default: AlgorithmDescriptions }

const descriptionModules = import.meta.glob<DescriptionModule>('../content/algorithms/*.ts')

export async function loadAlgorithmDescriptions(
  algorithmId: string,
): Promise<AlgorithmDescriptions> {
  const load = descriptionModules[`../content/algorithms/${algorithmId}.ts`]
  if (!load) throw new Error(`Unknown algorithm description: ${algorithmId}`)
  return (await load()).default
}

export async function loadAlgorithmDescription(
  locale: Locale,
  algorithmId: string,
): Promise<string> {
  const descriptions = await loadAlgorithmDescriptions(algorithmId)
  return descriptions[locale]
}

export function getAlgorithmMetaTitle(
  locale: Locale,
  fallbackName: string,
  description: string,
): string {
  const firstLine = description.split('\n')[0].trim()
  const name = firstLine || fallbackName
  const conciseName = name.split(' (')[0].trim()
  // Keyword-first titles; brand omitted so SERP focus stays on the algorithm.
  if (locale === 'es') {
    const title = `${conciseName} — Visualizador de algoritmos`
    return title.length <= 60 ? title : `${conciseName} — Visualizador`
  }
  const title = `${conciseName} — Algorithm Visualizer`
  return title.length <= 60 ? title : `${conciseName} Visualizer`
}

export function getAlgorithmMetaDescription(locale: Locale, description: string): string {
  if (!description) return translations[locale].siteDescription
  const paragraphs = description.split('\n\n')
  const content = paragraphs.length > 1 ? paragraphs[1] : paragraphs[0]
  const cleaned = content.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim()
  const suffix =
    locale === 'es'
      ? ' Visualización interactiva paso a paso.'
      : ' Free interactive step-by-step visualization.'

  const withSuffix =
    cleaned.length + suffix.length > 160 ? cleaned : `${cleaned.replace(/\.$/, '')}.${suffix}`

  if (withSuffix.length <= 160) return withSuffix
  const truncated = cleaned.slice(0, 157)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpace > 120 ? lastSpace : 157)}...`
}
