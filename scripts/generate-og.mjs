/**
 * Generate Open Graph images (1200×630) matching the site look:
 * Geist fonts, category colour, and category icon.
 *
 * Local only — assets are committed under public/og/.
 *   pnpm og:generate
 *
 * Requires: ImageMagick (`magick`) for JPEG encode.
 * Fonts: fonts-src/og/*.ttf (converted from site Geist woff2 sources).
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'og')
const fontDir = join(root, 'fonts-src', 'og')
mkdirSync(outDir, { recursive: true })
mkdirSync(fontDir, { recursive: true })

const FONT_PIXEL = join(fontDir, 'GeistPixel-Square.ttf')
const FONT_MONO = join(fontDir, 'GeistMono.ttf')

/** Tailwind-400 palette matching sidebar category colours */
const CATEGORY_META = {
  Concepts: {
    color: '#38bdf8',
    icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18',
  },
  'Data Structures': {
    color: '#a78bfa',
    icon: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  },
  Sorting: {
    color: '#34d399',
    icon: 'M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5',
  },
  Searching: {
    color: '#fbbf24',
    icon: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
  },
  Graphs: {
    color: '#22d3ee',
    icon: 'M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5',
  },
  'Dynamic Programming': {
    color: '#fb923c',
    icon: 'M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v.375',
  },
  Backtracking: {
    color: '#fb7185',
    icon: 'M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3',
  },
  'Divide and Conquer': {
    color: '#818cf8',
    icon: 'M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  Math: {
    color: '#e879f9',
    icon: 'M5 5h14M9 5c0 4-1.5 10-3 14M15 5c0 4 1.5 10 3 14',
  },
  Compression: {
    color: '#a3e635',
    // Tabler file-zip (multi-subpath)
    icon: 'M6 20.735a2 2 0 0 1 -1 -1.735v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1M11 17a2 2 0 0 1 2 2v2a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-2a2 2 0 0 1 2 -2M11 5l-1 0M13 7l-1 0M11 9l-1 0M13 11l-1 0M11 13l-1 0M13 15l-1 0',
  },
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
  ['trie', 'Trie', 'Data Structures'],
  ['lru-cache', 'LRU Cache', 'Data Structures'],
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
  ['run-length-encoding', 'Run-Length Encoding', 'Compression'],
  ['lz77', 'LZ77', 'Compression'],
  ['lzw', 'LZW', 'Compression'],
  ['huffman-coding', 'Huffman Coding', 'Compression'],
  ['deflate', 'DEFLATE', 'Compression'],
  ['brotli', 'Brotli', 'Compression'],
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
  ['compression', 'Compression'],
]

function ensureFonts() {
  if (existsSync(FONT_PIXEL) && existsSync(FONT_MONO)) return

  // Convert site woff2 sources → TTF for resvg (one-time local helper)
  try {
    execFileSync(
      'python3',
      [
        '-c',
        `
from fontTools.ttLib import TTFont
from pathlib import Path
pairs = [
  ('fonts-src/GeistPixel-Square.woff2', 'fonts-src/og/GeistPixel-Square.ttf'),
  ('fonts-src/GeistMono-Variable.woff2', 'fonts-src/og/GeistMono.ttf'),
]
for src, dst in pairs:
  font = TTFont(src)
  font.flavor = None
  Path(dst).parent.mkdir(parents=True, exist_ok=True)
  font.save(dst)
  print('wrote', dst)
`,
      ],
      {
        cwd: root,
        stdio: 'pipe',
      },
    )
  } catch (error) {
    console.error(
      'Missing Geist TTF fonts and could not convert from woff2.\n' +
        'Run once with fonttools: python3 -m pip install fonttools brotli\n' +
        `Expected: ${FONT_PIXEL}`,
    )
    process.exit(1)
  }

  if (!existsSync(FONT_PIXEL) || !existsSync(FONT_MONO)) {
    console.error('Font conversion failed.')
    process.exit(1)
  }
}

function hasMagick() {
  try {
    execFileSync('magick', ['-version'], { stdio: 'pipe' })
    return true
  } catch {
    return false
  }
}

function escapeXml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function titleFontSize(title) {
  if (title.length > 30) return 42
  if (title.length > 24) return 48
  if (title.length > 18) return 56
  return 64
}

/**
 * @param {{ title: string, categoryLabel: string, categoryKey: string, kicker?: string }} opts
 */
function buildSvg({ title, categoryLabel, categoryKey, kicker = 'Algorithm Visualizer' }) {
  const meta = CATEGORY_META[categoryKey] ?? {
    color: '#a3a3a3',
    icon: 'M12 6v12m6-6H6',
  }
  const { color, icon } = meta
  const size = titleFontSize(title)
  const titleY = 348 + (64 - size) * 0.35

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="82%" cy="68%" r="58%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.32"/>
      <stop offset="40%" stop-color="${color}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0c0c0c"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- Canvas -->
  <rect width="1200" height="630" fill="#000000"/>
  <rect width="1200" height="630" fill="url(#glow)"/>

  <!-- Card -->
  <rect x="72" y="72" width="1056" height="486" rx="28" fill="url(#card)" stroke="rgba(255,255,255,0.09)" stroke-width="1.5"/>
  <rect x="72" y="72" width="1056" height="486" rx="28" fill="url(#sheen)"/>

  <!-- Icon badge -->
  <rect x="120" y="156" width="120" height="120" rx="30" fill="${color}" fill-opacity="0.12" stroke="${color}" stroke-opacity="0.4" stroke-width="1.5"/>
  <g transform="translate(150 186) scale(2.5)" fill="none" stroke="${color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
    <path d="${icon}"/>
  </g>

  <!-- Category -->
  <text x="276" y="208" fill="${color}" font-family="Geist Pixel Square, GeistPixel, sans-serif" font-size="22" letter-spacing="0.22em">${escapeXml(categoryLabel.toUpperCase())}</text>

  <!-- Title -->
  <text x="120" y="${titleY}" fill="#fafafa" font-family="Geist Pixel Square, GeistPixel, sans-serif" font-size="${size}">${escapeXml(title)}</text>

  <!-- Product line -->
  <text x="120" y="430" fill="#a3a3a3" font-family="Geist Mono, ui-monospace, monospace" font-size="28">${escapeXml(kicker)}</text>

  <!-- Meta -->
  <text x="120" y="498" fill="#525252" font-family="Geist Mono, ui-monospace, monospace" font-size="22">Step-by-step · Interactive</text>

  <!-- Accent bar -->
  <rect x="120" y="520" width="64" height="3" rx="1.5" fill="${color}" fill-opacity="0.85"/>
</svg>`
}

function renderJpg(svg, outPath) {
  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
    font: {
      fontFiles: [FONT_PIXEL, FONT_MONO],
      loadSystemFonts: false,
      defaultFontFamily: 'Geist Pixel Square',
    },
    background: '#000000',
  })
  const png = resvg.render().asPng()
  const tmpPng = outPath.replace(/\.jpe?g$/i, '.tmp.png')
  writeFileSync(tmpPng, png)
  execFileSync(
    'magick',
    [tmpPng, '-quality', '90', '-strip', '-sampling-factor', '4:2:0', outPath],
    { stdio: 'pipe' },
  )
  try {
    unlinkSync(tmpPng)
  } catch {
    /* ignore */
  }
}

function main() {
  ensureFonts()
  if (!hasMagick()) {
    console.error('ImageMagick (`magick`) is required to write JPEG OG images.')
    process.exit(1)
  }

  // Default / home
  renderJpg(
    buildSvg({
      title: 'Algorithm Visualizer',
      categoryLabel: 'Interactive',
      categoryKey: 'Concepts',
      kicker: 'Sorting · Graphs · DP · More',
    }),
    join(outDir, 'default.jpg'),
  )
  // Root social fallback
  copyFileSync(join(outDir, 'default.jpg'), join(root, 'public', 'og-image.jpg'))

  for (const [id, name, category] of algorithms) {
    renderJpg(
      buildSvg({
        title: name,
        categoryLabel: category,
        categoryKey: category,
      }),
      join(outDir, `${id}.jpg`),
    )
  }

  for (const [slug, name] of categories) {
    renderJpg(
      buildSvg({
        title: name,
        categoryLabel: 'Category',
        categoryKey: name,
        kicker: 'Algorithm Visualizer',
      }),
      join(outDir, `category-${slug}.jpg`),
    )
  }

  // Cleanup accidental preview junk
  for (const junk of ['_preview-test.jpg', '_icon-preview.png']) {
    const p = join(outDir, junk)
    if (existsSync(p)) {
      try {
        unlinkSync(p)
      } catch {
        /* ignore */
      }
    }
  }

  console.log(
    `Generated OG images → public/og/ (${algorithms.length} algorithms + ${categories.length} categories)`,
  )
  console.log('Fonts: Geist Pixel Square + Geist Mono')
  console.log(`Sample: ${Math.round(statSync(join(outDir, 'bubble-sort.jpg')).size / 1024)} KB`)
}

main()
