import { catalogCategories, algorithmCatalog } from '@lib/algorithms/catalog'
import type { Locale } from '@i18n/translations'
import { getCategoryName } from '@i18n/translations'
import type { AlgorithmSummary, CategorySummary } from '@lib/types'

/** URL slug for each catalog category (English IDs, shared by en/es routes). */
export const categorySlugs: Record<string, string> = {
  Concepts: 'concepts',
  'Data Structures': 'data-structures',
  Sorting: 'sorting',
  Searching: 'searching',
  Graphs: 'graphs',
  'Dynamic Programming': 'dynamic-programming',
  Backtracking: 'backtracking',
  'Divide and Conquer': 'divide-and-conquer',
  Math: 'math',
  Compression: 'compression',
}

const slugToCategory = Object.fromEntries(
  Object.entries(categorySlugs).map(([name, slug]) => [slug, name]),
) as Record<string, string>

export function getCategorySlug(categoryName: string): string | undefined {
  return categorySlugs[categoryName]
}

export function getCategoryNameFromSlug(slug: string): string | undefined {
  return slugToCategory[slug]
}

export function isCategorySlug(slug: string): boolean {
  return slug in slugToCategory
}

export function getCategoryBySlug(slug: string): CategorySummary | undefined {
  const name = slugToCategory[slug]
  if (!name) return undefined
  return catalogCategories.find((c) => c.name === name)
}

export function getAllCategorySlugs(): string[] {
  return Object.values(categorySlugs)
}

/** Hub intro copy for category landing pages. */
export function getCategoryIntro(locale: Locale, categoryName: string): string {
  const label = getCategoryName(locale, categoryName)
  if (locale === 'es') {
    const intros: Record<string, string> = {
      Concepts:
        'Conceptos fundamentales de algoritmos y estructuras de datos: complejidad, patrones y técnicas que se reutilizan en casi todos los problemas.',
      'Data Structures':
        'Estructuras de datos clásicas visualizadas paso a paso: pilas, colas, listas, tablas hash, árboles y heaps.',
      Sorting:
        'Algoritmos de ordenamiento comparativos y no comparativos. Compara complejidad, estabilidad y cuándo usar cada uno.',
      Searching:
        'Búsqueda lineal, binaria y variantes sobre datos ordenados. Aprende el trade-off entre preparación y consultas.',
      Graphs:
        'Recorridos y algoritmos sobre grafos: BFS, DFS, caminos más cortos, MST y orden topológico.',
      'Dynamic Programming':
        'Programación dinámica con ejemplos clásicos: subproblemas, memoización y tablas de DP.',
      Backtracking:
        'Exploración con retroceso: N-Reinas, Sudoku y pathfinding. Ve cómo se poda el espacio de búsqueda.',
      'Divide and Conquer':
        'Divide el problema, resuelve subproblemas y combina resultados. Torre de Hanoi y más.',
      Math: 'Algoritmos matemáticos clásicos con visualización clara del proceso.',
      Compression:
        'Compresión sin pérdida desde RLE hasta DEFLATE (gzip) y Brotli: diccionarios, entropía y los pipelines reales de la web.',
    }
    return intros[categoryName] ?? `Explora visualizaciones interactivas de ${label.toLowerCase()}.`
  }

  const intros: Record<string, string> = {
    Concepts:
      'Core algorithm and data-structure concepts: complexity, patterns, and techniques reused across most problems.',
    'Data Structures':
      'Classic data structures visualized step by step: stacks, queues, lists, hash tables, trees, and heaps.',
    Sorting:
      'Comparison and non-comparison sorting algorithms. Compare complexity, stability, and when to use each.',
    Searching:
      'Linear, binary, and ordered-data search variants. Learn the trade-off between preprocessing and queries.',
    Graphs: 'Graph traversals and algorithms: BFS, DFS, shortest paths, MST, and topological sort.',
    'Dynamic Programming':
      'Dynamic programming classics: subproblems, memoization, and DP tables made visual.',
    Backtracking:
      'Backtracking exploration: N-Queens, Sudoku, and pathfinding. See how the search space is pruned.',
    'Divide and Conquer':
      'Split the problem, solve subproblems, combine results. Tower of Hanoi and more.',
    Math: 'Classic mathematical algorithms with a clear step-by-step visualization.',
    Compression:
      'Lossless compression from RLE to DEFLATE (gzip) and Brotli: dictionaries, entropy coding, and real web pipelines.',
  }
  return intros[categoryName] ?? `Explore interactive ${label.toLowerCase()} visualizations.`
}

export function getCategoryMetaTitle(locale: Locale, categoryName: string): string {
  const label = getCategoryName(locale, categoryName)
  return locale === 'es'
    ? `${label} — Visualizador de algoritmos`
    : `${label} — Algorithm Visualizer`
}

export function getCategoryMetaDescription(locale: Locale, categoryName: string): string {
  const intro = getCategoryIntro(locale, categoryName)
  if (intro.length <= 160) return intro
  const cut = intro.slice(0, 157)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 120 ? lastSpace : 157)}...`
}

export function getRelatedAlgorithms(algorithm: AlgorithmSummary, limit = 6): AlgorithmSummary[] {
  return algorithmCatalog
    .filter((a) => a.category === algorithm.category && a.id !== algorithm.id)
    .slice(0, limit)
}
