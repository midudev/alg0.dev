import type { Locale } from '@i18n/translations'
import {
  getAlgorithmDescription,
  getAlgorithmMetaDescription,
  getAlgorithmMetaTitle,
  getCategoryName,
  translations,
} from '@i18n/translations'
import { algorithms } from '@lib/algorithms'
import type { Algorithm } from '@lib/types'

const AUTHOR = {
  '@type': 'Person',
  name: 'Miguel Ángel Durán',
  url: 'https://midu.dev',
}

export function getHomeStructuredData(locale: Locale, canonicalURL: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${canonicalURL}#website`,
        name: 'alg0.dev',
        url: canonicalURL,
        description: translations[locale].siteDescription,
        inLanguage: locale,
        author: AUTHOR,
      },
      {
        '@type': 'WebApplication',
        '@id': `${canonicalURL}#application`,
        name: translations[locale].siteTitle,
        url: canonicalURL,
        description: translations[locale].siteDescription,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        inLanguage: locale,
        isAccessibleForFree: true,
        author: AUTHOR,
      },
      {
        '@type': 'ItemList',
        name: locale === 'es' ? 'Visualizaciones de algoritmos' : 'Algorithm visualizations',
        numberOfItems: algorithms.length,
        itemListElement: algorithms.map((algorithm, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: algorithm.name,
          url: new URL(locale === 'es' ? `/es/${algorithm.id}/` : `/${algorithm.id}/`, canonicalURL)
            .href,
        })),
      },
    ],
  }
}

export function getAlgorithmStructuredData(
  locale: Locale,
  algorithm: Algorithm,
  canonicalURL: string,
) {
  const name = (
    getAlgorithmDescription(locale, algorithm.id)?.split('\n')[0] || algorithm.name
  ).trim()
  const homeURL = new URL(locale === 'es' ? '/es/' : '/', canonicalURL).href

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${canonicalURL}#learning-resource`,
        name,
        headline: getAlgorithmMetaTitle(locale, algorithm.id, algorithm.name),
        description: getAlgorithmMetaDescription(locale, algorithm.id),
        url: canonicalURL,
        inLanguage: locale,
        learningResourceType:
          locale === 'es' ? 'Visualización interactiva' : 'Interactive visualization',
        educationalLevel: algorithm.difficulty,
        isAccessibleForFree: true,
        about: {
          '@type': 'Thing',
          name: getCategoryName(locale, algorithm.category),
        },
        author: AUTHOR,
        isPartOf: {
          '@type': 'WebSite',
          name: 'alg0.dev',
          url: homeURL,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'es' ? 'Visualizador de algoritmos' : 'Algorithm Visualizer',
            item: homeURL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name,
            item: canonicalURL,
          },
        ],
      },
    ],
  }
}
