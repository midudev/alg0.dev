import type { APIRoute } from 'astro'
import { translations } from '@i18n/translations'
import { catalogCategories } from '@lib/algorithms/catalog'
import { getAlgorithmMetaDescription, loadAlgorithmDescription } from '@lib/algorithm-content'
import { getCategoryIntro, getCategorySlug } from '@lib/categories'

/**
 * `/llms.txt` (https://llmstxt.org): a Markdown index of every visualization so
 * AI search engines and assistants can find and cite the right page.
 */
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href
  const t = translations.en
  const sections = await Promise.all(
    catalogCategories.map(async (category) => {
      const slug = getCategorySlug(category.name)
      const heading = slug ? `## [${category.name}](${url(`/${slug}/`)})` : `## ${category.name}`
      const items = await Promise.all(
        category.algorithms.map(async (algorithm) => {
          const description = getAlgorithmMetaDescription(
            'en',
            await loadAlgorithmDescription('en', algorithm.id),
          )
          return `- [${algorithm.name}](${url(`/${algorithm.id}/`)}): ${description}`
        }),
      )
      return [heading, '', getCategoryIntro('en', category.name), '', ...items].join('\n')
    }),
  )

  const body = [
    `# ${t.siteTitle}`,
    '',
    `> ${t.siteDescription}`,
    '',
    'Each page has an animated step-by-step visualization, an explanation with time and space complexity, and source code in JavaScript, Python, Java, C++ and Rust. Every page is also available in Spanish under `/es/` (for example ' +
      `${url('/es/bubble-sort/')}).`,
    '',
    ...sections.flatMap((section) => [section, '']),
  ].join('\n')

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
