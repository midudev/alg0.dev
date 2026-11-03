// @ts-check
/**
 * Production deploy: `wrangler deploy` + IndexNow ping for pages whose content changed.
 *
 * 1. Before deploying, compare every sitemap URL in `dist/` with the live page.
 * 2. Run `wrangler deploy`.
 * 3. Submit the changed URLs to IndexNow (Bing, Yandex, Seznam, Naver…), so they
 *    recrawl them soon instead of guessing. Failures here never fail the deploy.
 *
 * Expects a fresh `astro build`. Used by `pnpm run deploy` and the Workers Builds
 * production trigger; preview branches use `wrangler versions upload` instead.
 * `--dry-run` only prints the changed URLs.
 */
import { spawnSync } from 'node:child_process'
import { readFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const dist = join(root, 'dist')
const SITE = 'https://alg0.dev'
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'
const dryRun = process.argv.includes('--dry-run')

/** Hashed asset names change on every style/JS tweak; they are not page content. */
const normalize = (html) =>
  html
    .replace(/\/_astro\/[^"'\s)]+/g, '/_astro/')
    .replace(/\?v=[0-9a-f]+/g, '')
    .trim()

async function readSitemapUrls() {
  const files = (await readdir(dist)).filter((f) => /^sitemap-\d+\.xml$/.test(f))
  const xml = (await Promise.all(files.map((f) => readFile(join(dist, f), 'utf8')))).join('')
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url)
}

/** @param {string} url */
async function hasChanged(url) {
  const path = new URL(url).pathname
  const built = await readFile(join(dist, path, 'index.html'), 'utf8')
  try {
    const response = await fetch(url, {
      redirect: 'manual',
      headers: { 'User-Agent': 'alg0-deploy' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) return true
    return normalize(await response.text()) !== normalize(built)
  } catch {
    return true
  }
}

/** @param {string[]} urls */
async function findChanged(urls) {
  const changed = []
  for (let i = 0; i < urls.length; i += 8) {
    const batch = urls.slice(i, i + 8)
    const results = await Promise.all(batch.map(hasChanged))
    batch.forEach((url, j) => results[j] && changed.push(url))
  }
  return changed
}

async function findIndexNowKey() {
  const files = await readdir(join(root, 'public'))
  const keyFile = files.find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  if (!keyFile) return null
  const key = (await readFile(join(root, 'public', keyFile), 'utf8')).trim()
  return keyFile === `${key}.txt` ? key : null
}

/** @param {string[]} urlList */
async function submitIndexNow(urlList) {
  const key = await findIndexNowKey()
  if (!key) {
    console.warn('[indexnow] no key file in public/, skipping')
    return
  }
  const response = await fetch(INDEXNOW_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: new URL(SITE).host,
      key,
      keyLocation: `${SITE}/${key}.txt`,
      urlList,
    }),
    signal: AbortSignal.timeout(15_000),
  })
  console.log(`[indexnow] submitted ${urlList.length} URL(s): HTTP ${response.status}`)
}

let changed = []
try {
  const urls = await readSitemapUrls()
  changed = await findChanged(urls)
  console.log(`[indexnow] ${changed.length}/${urls.length} page(s) changed since the live version`)
} catch (error) {
  console.warn('[indexnow] could not compare with the live site, skipping ping:', error)
}

if (dryRun) {
  console.log(changed.join('\n'))
  process.exit(0)
}

const wrangler = join(root, 'node_modules', '.bin', 'wrangler')
const deploy = spawnSync(wrangler, ['deploy'], { cwd: root, stdio: 'inherit' })
if (deploy.status !== 0) process.exit(deploy.status ?? 1)

if (changed.length > 0) {
  try {
    await submitIndexNow(changed)
  } catch (error) {
    console.warn('[indexnow] submission failed (deploy is fine):', error)
  }
}
