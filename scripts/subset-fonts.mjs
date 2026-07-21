/**
 * Subsets the original fonts in `fonts-src/` into `public/fonts/`.
 *
 * The site only ships English and Spanish copy plus code samples, so the full
 * fonts (Cyrillic, Greek, Vietnamese, thousands of symbols) are mostly dead
 * weight. Run `pnpm fonts:subset` after replacing a font or after adding
 * characters that are not covered by CHARSET below.
 */
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import subsetFont from 'subset-font'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC_DIR = join(root, 'fonts-src')
const OUT_DIR = join(root, 'public/fonts')

/** Inclusive code point ranges kept in every subset. */
const RANGES = [
  [0x0020, 0x007e], // Basic Latin
  [0x00a0, 0x00ff], // Latin-1: accents, ¡ ¿ ñ, ² ³, ×, ·
  [0x0131, 0x0131], // ı
  [0x0152, 0x0153], // Œ œ
  [0x0160, 0x0161], // Š š
  [0x0178, 0x0178], // Ÿ
  [0x017d, 0x017e], // Ž ž
  [0x2013, 0x2014], // – —
  [0x2018, 0x201a], // ‘ ’ ‚
  [0x201c, 0x201e], // “ ” „
  [0x2020, 0x2022], // † ‡ •
  [0x2026, 0x2026], // …
  [0x2030, 0x2030], // ‰
  [0x2039, 0x203a], // ‹ ›
  [0x20ac, 0x20ac], // €
  [0x2122, 0x2122], // ™
  [0x2190, 0x2193], // ← ↑ → ↓
  [0x2212, 0x2212], // −
  [0x221a, 0x221a], // √
  [0x221e, 0x221e], // ∞
  [0x2248, 0x2248], // ≈
  [0x2260, 0x2260], // ≠
  [0x2264, 0x2265], // ≤ ≥
  [0x230a, 0x230b], // ⌊ ⌋
  [0x2500, 0x2500], // ─
  [0x2550, 0x2550], // ═
  [0x25a0, 0x25a0], // ■
  [0x25b2, 0x25b2], // ▲
  [0x25b6, 0x25b6], // ▶
  [0x25c6, 0x25c6], // ◆
  [0x25ca, 0x25ca], // ◊
  [0x25cf, 0x25cf], // ●
]

const CHARSET = RANGES.flatMap(([from, to]) => {
  const chars = []
  for (let cp = from; cp <= to; cp++) chars.push(String.fromCodePoint(cp))
  return chars
}).join('')

/** The UI only uses weights 400–700, so the variable axis is clipped to that. */
const FONTS = [
  {
    file: 'GeistMono-Variable.woff2',
    variationAxes: {
      wght: {
        min: 400,
        max: 700,
      },
    },
  },
  { file: 'GeistPixel-Square.woff2' },
]

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`

await mkdir(OUT_DIR, { recursive: true })

for (const { file, variationAxes } of FONTS) {
  const original = await readFile(join(SRC_DIR, file))
  const subset = await subsetFont(original, CHARSET, {
    targetFormat: 'woff2',
    variationAxes,
  })
  await writeFile(join(OUT_DIR, file), subset)

  const { size } = await stat(join(SRC_DIR, file))
  const saved = Math.round((1 - subset.length / size) * 100)
  console.log(`${file}: ${kb(size)} → ${kb(subset.length)} (-${saved}%)`)
}
