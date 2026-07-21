import type { Locale } from '@i18n/translations'
import { getCategoryName, translations } from '@i18n/translations'
import { getAlgorithmMetaDescription, getAlgorithmMetaTitle } from '@lib/algorithm-content'
import {
  buildAlgorithmFaqs,
  parseAlgorithmDescription,
  schemaEducationalLevel,
} from '@lib/algorithm-seo'
import { algorithmCatalog } from '@lib/algorithms/catalog'
import {
  getCategoryIntro,
  getCategoryMetaDescription,
  getCategoryMetaTitle,
  getCategorySlug,
} from '@lib/categories'
import type { AlgorithmSummary, CategorySummary } from '@lib/types'

const AUTHOR = {
  '@type': 'Person',
  name: 'Miguel Ángel Durán',
  url: 'https://midu.dev',
  sameAs: ['https://x.com/midudev', 'https://github.com/midudev'],
}

const SITE = {
  '@type': 'WebSite',
  name: 'Algorithm Visualizer',
}

/** Approximate content freshness for LearningResource (update when copy changes meaningfully). */
const CONTENT_DATE_MODIFIED = '2026-07-21'

export function getHomeStructuredData(locale: Locale, canonicalURL: string) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        ...SITE,
        '@id': `${canonicalURL}#website`,
        url: canonicalURL,
        description: translations[locale].siteDescription,
        inLanguage: locale,
        author: AUTHOR,
        publisher: AUTHOR,
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
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'ItemList',
        name: locale === 'es' ? 'Visualizaciones de algoritmos' : 'Algorithm visualizations',
        numberOfItems: algorithmCatalog.length,
        itemListElement: algorithmCatalog.map((algorithm, index) => ({
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

export function getCategoryStructuredData(
  locale: Locale,
  category: CategorySummary,
  categorySlug: string,
  canonicalURL: string,
) {
  const homeURL = new URL(locale === 'es' ? '/es/' : '/', canonicalURL).href
  const label = getCategoryName(locale, category.name)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${canonicalURL}#collection`,
        name: getCategoryMetaTitle(locale, category.name),
        description: getCategoryMetaDescription(locale, category.name),
        url: canonicalURL,
        inLanguage: locale,
        isPartOf: { ...SITE, url: homeURL },
        about: {
          '@type': 'Thing',
          name: label,
        },
        mainEntity: {
          '@type': 'ItemList',
          name: label,
          numberOfItems: category.algorithms.length,
          itemListElement: category.algorithms.map((algorithm, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: algorithm.name,
            url: new URL(
              locale === 'es' ? `/es/${algorithm.id}/` : `/${algorithm.id}/`,
              canonicalURL,
            ).href,
          })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'es' ? 'Inicio' : 'Home',
            item: homeURL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: label,
            item: canonicalURL,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name:
              locale === 'es'
                ? `¿Qué algoritmos de ${label} puedo visualizar?`
                : `Which ${label} algorithms can I visualize?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: getCategoryIntro(locale, category.name),
            },
          },
          {
            '@type': 'Question',
            name:
              locale === 'es'
                ? `¿Cuántos algoritmos hay en ${label}?`
                : `How many algorithms are in ${label}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text:
                locale === 'es'
                  ? `Hay ${category.algorithms.length} visualizaciones en la categoría ${label}.`
                  : `There are ${category.algorithms.length} visualizations in the ${label} category.`,
            },
          },
        ],
      },
    ],
  }
}

export function getAlgorithmStructuredData(
  locale: Locale,
  algorithm: AlgorithmSummary,
  canonicalURL: string,
  description: string,
) {
  const { title } = parseAlgorithmDescription(description)
  const name = title || algorithm.name
  const homeURL = new URL(locale === 'es' ? '/es/' : '/', canonicalURL).href
  const categorySlug = getCategorySlug(algorithm.category)
  const categoryURL = categorySlug
    ? new URL(locale === 'es' ? `/es/${categorySlug}/` : `/${categorySlug}/`, canonicalURL).href
    : homeURL
  const categoryLabel = getCategoryName(locale, algorithm.category)
  const faqs = buildAlgorithmFaqs(locale, algorithm, description)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${canonicalURL}#learning-resource`,
        name,
        headline: getAlgorithmMetaTitle(locale, algorithm.name, description),
        description: getAlgorithmMetaDescription(locale, description),
        url: canonicalURL,
        inLanguage: locale,
        learningResourceType:
          locale === 'es' ? 'Visualización interactiva' : 'Interactive visualization',
        educationalLevel: schemaEducationalLevel(algorithm.difficulty),
        isAccessibleForFree: true,
        dateModified: CONTENT_DATE_MODIFIED,
        about: {
          '@type': 'Thing',
          name: categoryLabel,
        },
        author: AUTHOR,
        isPartOf: {
          ...SITE,
          url: homeURL,
        },
        teaches: name,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'es' ? 'Inicio' : 'Home',
            item: homeURL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: categoryLabel,
            item: categoryURL,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name,
            item: canonicalURL,
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  }
}
