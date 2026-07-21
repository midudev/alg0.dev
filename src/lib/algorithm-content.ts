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
  const suffix = locale === 'es' ? ': Visualizador | alg0.dev' : ' Visualizer | alg0.dev'
  const maxNameLength = 60 - suffix.length
  const conciseName = name.length > maxNameLength ? name.split(' (')[0] : name
  return `${conciseName.slice(0, maxNameLength).trim()}${suffix}`
}

export function getAlgorithmMetaDescription(locale: Locale, description: string): string {
  if (!description) return translations[locale].siteDescription
  const paragraphs = description.split('\n\n')
  const content = paragraphs.length > 1 ? paragraphs[1] : paragraphs[0]
  const cleaned = content.replace(/\n/g, ' ').trim()
  if (cleaned.length <= 160) return cleaned
  const truncated = cleaned.slice(0, 157)
  const lastSpace = truncated.lastIndexOf(' ')
  return `${truncated.slice(0, lastSpace > 120 ? lastSpace : 157)}...`
}
