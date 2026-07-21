/**
 * Vite plugin that turns an algorithm category module into independently
 * tree-shakeable virtual variants.
 *
 * `?algorithm=<export>` keeps the selected Algorithm as the sole public export.
 * `?implementation=<id>` extracts a single annotated language implementation.
 * This lets authors keep the source grouped by category without shipping a
 * whole category (or language pack) to the browser.
 */
export function splitAlgorithmChunks() {
  return {
    name: 'alg0:split-algorithm-chunks',
    enforce: 'pre',
    transform(source, id) {
      const queryIndex = id.indexOf('?')
      if (queryIndex === -1) return

      const params = new URLSearchParams(id.slice(queryIndex + 1))
      const algorithmExport = params.get('algorithm')
      if (algorithmExport) {
        const declaration = new RegExp(
          `(?:export\\s+)?const\\s+${algorithmExport}\\s*:\\s*Algorithm\\s*=`,
        )
        if (!declaration.test(source)) {
          this.error(`Algorithm export "${algorithmExport}" was not found in ${id}`)
        }

        // Dynamic imports expose every named export as part of their public API.
        // Make every Algorithm private, drop re-exports / barrel lists, and
        // expose only the requested one so Rollup can discard the rest.
        //
        // Important: do not use `[\s\S]*?` for barrel stripping — a mid-file
        // `export { a, b } from '...'` would match through to the final `}` of
        // the module and delete the entire file body.
        const privateAlgorithms = source.replace(
          /export\s+const\s+(\w+)\s*:\s*Algorithm\s*=/g,
          'const $1: Algorithm =',
        )
        const withoutReexports = privateAlgorithms
          .replace(/\nexport\s*\{[^}]*\}\s*from\s*['"][^'"]+['"]\s*;?/g, '')
          .replace(/\nexport\s*\{[^}]*\}\s*;?\s*$/m, '')

        return `${withoutReexports}\n\nexport default ${algorithmExport}\n`
      }

      const implementationId = params.get('implementation')
      if (implementationId) {
        const template = findAnnotatedTemplate(source, implementationId)
        if (!template) {
          this.error(`Implementation "${implementationId}" was not found in ${id}`)
        }

        return [
          "import { annotated } from '@lib/code-languages'",
          `export default annotated(${template})`,
        ].join('\n')
      }

      if (params.has('implementation-loader')) {
        const cleanId = id.slice(0, queryIndex)
        const implementationIds = findImplementationIds(source)
        const cases = implementationIds.map(
          (implementationId) =>
            `case ${JSON.stringify(implementationId)}: return import(${JSON.stringify(`${cleanId}?implementation=${implementationId}`)}).then((module) => module.default)`,
        )

        return [
          'export function loadImplementation (id) {',
          '  switch (id) {',
          ...cases.map((entry) => `    ${entry}`),
          '    default: return Promise.resolve(undefined)',
          '  }',
          '}',
        ].join('\n')
      }
    },
  }
}

function findImplementationIds(source) {
  const ids = []
  const property = /^\s*(?:'([^']+)'|"([^"]+)"|([A-Za-z_$][\w$]*))\s*:\s*annotated\(/gm
  for (const match of source.matchAll(property)) {
    ids.push(match[1] ?? match[2] ?? match[3])
  }
  return ids
}

function findAnnotatedTemplate(source, implementationId) {
  const escapedId = escapeRegExp(implementationId)
  const identifierKey = /^[A-Za-z_$][\w$]*$/.test(implementationId) ? `|${escapedId}` : ''
  const property = new RegExp(
    `^\\s*(?:'${escapedId}'|"${escapedId}"${identifierKey})\\s*:\\s*annotated\\(\\s*`,
    'm',
  )
  const match = property.exec(source)
  if (!match) return null

  const start = match.index + match[0].length
  if (source[start] !== '`') return null

  for (let index = start + 1; index < source.length; index++) {
    if (source[index] !== '`') continue

    let backslashes = 0
    for (let cursor = index - 1; cursor >= start && source[cursor] === '\\'; cursor--) {
      backslashes++
    }
    if (backslashes % 2 === 0) return source.slice(start, index + 1)
  }

  return null
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
