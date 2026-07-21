/**
 * Generate per-algorithm Open Graph images (1200×630 JPEG).
 * Requires ImageMagick (`magick`) and a system sans font.
 *
 * Usage: node scripts/generate-og.mjs
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'og')
mkdirSync(outDir, { recursive: true })

const FONT_CANDIDATES = [
  '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
  '/System/Library/Fonts/Supplemental/Arial.ttf',
  '/System/Library/Fonts/Helvetica.ttc',
  '/Library/Fonts/Arial.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
  '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',
]

const font = FONT_CANDIDATES.find((path) => existsSync(path))
if (!font) {
  console.error(
    'No usable font found for OG generation. Install Arial/DejaVu or edit FONT_CANDIDATES.',
  )
  process.exit(1)
}

const algorithms = [
  ['big-o-notation', 'Big O Notation', 'Concepts'],
  ['recursion', 'Recursion', 'Concepts'],
  ['two-pointers', 'Two Pointers', 'Concepts'],
  ['sliding-window', 'Sliding Window', 'Concepts'],
  ['space-complexity', 'Space Complexity', 'Concepts'],
  ['memoization', 'Memoization', 'Concepts'],
  ['greedy-vs-dp', 'Greedy vs DP', 'Concepts'],
  ['stack', 'Stack', 'Data Structures'],
  ['queue', 'Queue', 'Data Structures'],
  ['linked-list', 'Linked List', 'Data Structures'],
  ['hash-table', 'Hash Table', 'Data Structures'],
  ['binary-search-tree', 'Binary Search Tree', 'Data Structures'],
  ['heap', 'Heap', 'Data Structures'],
  ['bubble-sort', 'Bubble Sort', 'Sorting'],
  ['selection-sort', 'Selection Sort', 'Sorting'],
  ['insertion-sort', 'Insertion Sort', 'Sorting'],
  ['quick-sort', 'Quick Sort', 'Sorting'],
  ['merge-sort', 'Merge Sort', 'Sorting'],
  ['heap-sort', 'Heap Sort', 'Sorting'],
  ['counting-sort', 'Counting Sort', 'Sorting'],
  ['radix-sort', 'Radix Sort', 'Sorting'],
  ['shell-sort', 'Shell Sort', 'Sorting'],
  ['bucket-sort', 'Bucket Sort', 'Sorting'],
  ['binary-search', 'Binary Search', 'Searching'],
  ['linear-search', 'Linear Search', 'Searching'],
  ['jump-search', 'Jump Search', 'Searching'],
  ['interpolation-search', 'Interpolation Search', 'Searching'],
  ['bfs', 'Breadth-First Search', 'Graphs'],
  ['dfs', 'Depth-First Search', 'Graphs'],
  ['dijkstra', "Dijkstra's Algorithm", 'Graphs'],
  ['prim', "Prim's Algorithm", 'Graphs'],
  ['topological-sort', 'Topological Sort', 'Graphs'],
  ['fibonacci-dp', 'Fibonacci DP', 'Dynamic Programming'],
  ['knapsack', 'Knapsack 0/1', 'Dynamic Programming'],
  ['lcs', 'Longest Common Subsequence', 'Dynamic Programming'],
  ['n-queens', 'N-Queens Problem', 'Backtracking'],
  ['sudoku-solver', 'Sudoku Solver', 'Backtracking'],
  ['maze-pathfinding', 'Maze Pathfinding', 'Backtracking'],
  ['tower-of-hanoi', 'Tower of Hanoi', 'Divide and Conquer'],
  ['sieve-of-eratosthenes', 'Sieve of Eratosthenes', 'Math'],
]

const categories = [
  ['concepts', 'Concepts'],
  ['data-structures', 'Data Structures'],
  ['sorting', 'Sorting'],
  ['searching', 'Searching'],
  ['graphs', 'Graphs'],
  ['dynamic-programming', 'Dynamic Programming'],
  ['backtracking', 'Backtracking'],
  ['divide-and-conquer', 'Divide and Conquer'],
  ['math', 'Math'],
]

function renderOg(outPath, title, subtitle) {
  // ImageMagick caption/annotate pipeline — dark card matching site chrome
  execFileSync(
    'magick',
    [
      '-size',
      '1200x630',
      'xc:#0a0a0a',
      '-fill',
      '#1a1a1a',
      '-draw',
      'roundrectangle 48,48 1152,582 28,28',
      '-stroke',
      '#333333',
      '-strokewidth',
      '2',
      '-fill',
      'none',
      '-draw',
      'roundrectangle 48,48 1152,582 28,28',
      '-stroke',
      'none',
      '-font',
      font,
      '-fill',
      '#a3a3a3',
      '-pointsize',
      '28',
      '-gravity',
      'NorthWest',
      '-annotate',
      '+96+120',
      subtitle.toUpperCase(),
      '-fill',
      '#fafafa',
      '-pointsize',
      title.length > 28 ? '48' : '60',
      '-annotate',
      '+96+200',
      title,
      '-fill',
      '#737373',
      '-pointsize',
      '28',
      '-annotate',
      '+96+320',
      'Interactive step-by-step visualization',
      '-fill',
      '#e5e5e5',
      '-pointsize',
      '32',
      '-annotate',
      '+96+480',
      'alg0.dev',
      '-quality',
      '85',
      '-strip',
      outPath,
    ],
    { stdio: 'pipe' },
  )
}

renderOg(join(outDir, 'default.jpg'), 'Algorithm Visualizer', 'alg0.dev')
renderOg(join(root, 'public', 'og-image.jpg'), 'Algorithm Visualizer', 'alg0.dev')

for (const [id, name, category] of algorithms) {
  renderOg(join(outDir, `${id}.jpg`), name, category)
}

for (const [slug, name] of categories) {
  renderOg(join(outDir, `category-${slug}.jpg`), name, 'Category')
}

console.log(
  `Generated OG images → public/og/ (${algorithms.length} algorithms + ${categories.length} categories)`,
)
console.log(`Font: ${font}`)
console.log(`Sample size: ${Math.round(statSync(join(outDir, 'bubble-sort.jpg')).size / 1024)} KB`)
