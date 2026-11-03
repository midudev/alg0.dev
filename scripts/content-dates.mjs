// @ts-check
import { execFileSync } from 'node:child_process'
import { basename } from 'node:path'

// Not derived from import.meta.url: Astro bundles this module into its build output.
// Builds always run from the project root.
const root = process.cwd()
const CONTENT_DIR = 'src/content/algorithms'

/** @type {Map<string, string> | undefined} */
let cache

/** @param {string[]} args */
const git = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' })

/**
 * Last commit date (YYYY-MM-DD) of each algorithm's editorial content
 * (`src/content/algorithms/<id>.ts`), keyed by algorithm id. Feeds the sitemap
 * `lastmod` and the JSON-LD `dateModified`.
 *
 * A shallow clone would date every file to the latest commit, so it is unshallowed
 * first; if history is still unavailable the map is empty and callers omit dates
 * rather than publish wrong ones.
 */
export function getContentDates() {
  if (cache) return cache
  cache = new Map()
  try {
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') {
      git(['fetch', '--unshallow', '--quiet'])
    }
    if (git(['rev-parse', '--is-shallow-repository']).trim() === 'true') return cache

    let date = ''
    for (const line of git(['log', '--format=%cs', '--name-only', '--', CONTENT_DIR]).split('\n')) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(line)) date = line
      else if (line.startsWith(`${CONTENT_DIR}/`) && line.endsWith('.ts')) {
        const id = basename(line, '.ts')
        if (!cache.has(id)) cache.set(id, date)
      }
    }
  } catch {
    cache.clear()
  }
  return cache
}
