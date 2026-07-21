import { codeToHtml, type ShikiTransformer } from 'shiki'
import { codeLanguages } from '@lib/code-languages'
import { loadAlgorithm, loadLanguageImplementation } from '@lib/algorithms/loaders'
import type { CodeLanguage } from '@lib/types'

interface AlgorithmSource {
  language: CodeLanguage
  label: string
  code: string
  lineMap?: Record<number, number>
}

interface RenderAlgorithmCodeOptions {
  activeJsLine?: number
  variables?: Record<string, string | number | boolean | null>
}

function jsLinesForSourceLine(source: AlgorithmSource, sourceLine: number): number[] {
  if (source.language === 'javascript') return [sourceLine]
  return Object.entries(source.lineMap ?? {})
    .filter(([, line]) => line === sourceLine)
    .map(([jsLine]) => Number(jsLine))
}

function inlineAnnotation(variables: RenderAlgorithmCodeOptions['variables']): string | undefined {
  const entries = Object.entries(variables ?? {})
  if (entries.length === 0) return undefined
  return `  // ${entries
    .map(
      ([name, value]) => `${name} = ${typeof value === 'string' ? value : JSON.stringify(value)}`,
    )
    .join(', ')}`
}

function addClasses(node: { properties: Record<string, unknown> }, classes: string[]): void {
  const current = node.properties.className ?? node.properties.class
  delete node.properties.class
  node.properties.className = [
    ...(Array.isArray(current) ? current.map(String) : current ? [String(current)] : []),
    ...classes,
  ]
}

function codeViewerTransformer(
  source: AlgorithmSource,
  options: RenderAlgorithmCodeOptions,
): ShikiTransformer {
  const annotation = inlineAnnotation(options.variables)

  return {
    name: `alg0-code-viewer-${source.language}`,
    pre(node) {
      addClasses(node, [
        'code-viewer',
        'h-full',
        'overflow-auto',
        'min-h-0',
        'font-mono',
        'text-[13px]',
        'leading-7',
      ])
      node.properties['data-code-viewer'] = ''
      node.properties['data-code-language-block'] = source.language
      node.properties.tabindex = 0
      node.properties.ariaLabel = `${source.label} source code`
      // All languages start hidden. Client reveals the preferred language after
      // reading localStorage (falls back to JavaScript when nothing is stored).
      node.properties.hidden = true
    },
    code(node) {
      addClasses(node, ['block', 'min-w-max', 'py-3'])
      node.properties['data-code-lines'] = ''
    },
    line(node, lineNumber) {
      const jsLines = jsLinesForSourceLine(source, lineNumber)
      const active = options.activeJsLine != null && jsLines.includes(options.activeJsLine)
      const sourceChildren = node.children

      addClasses(node, ['code-viewer__line'])
      if (active) addClasses(node, ['is-active'])
      node.properties['data-code-line'] = lineNumber
      node.properties['data-js-lines'] = jsLines.join(' ')
      node.children = [
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['code-viewer__gutter'], ariaHidden: 'true' },
          children: [
            {
              type: 'element',
              tagName: 'span',
              properties: { className: ['code-viewer__marker'] },
              children: [],
            },
            {
              type: 'element',
              tagName: 'span',
              properties: {},
              children: [{ type: 'text', value: String(lineNumber) }],
            },
          ],
        },
        {
          type: 'element',
          tagName: 'span',
          properties: { className: ['code-viewer__source'] },
          children: [
            ...sourceChildren,
            ...(active && annotation
              ? [
                  {
                    type: 'element' as const,
                    tagName: 'span',
                    properties: { className: ['code-viewer__annotation'] },
                    children: [{ type: 'text' as const, value: annotation }],
                  },
                ]
              : []),
          ],
        },
      ]
    },
  }
}

async function loadAlgorithmSources(algorithmId: string): Promise<AlgorithmSource[]> {
  const algorithm = await loadAlgorithm(algorithmId)
  const implementations = await Promise.all(
    codeLanguages.map(async ({ id, label }) => {
      if (id === 'javascript') {
        return { language: id, label, code: algorithm.code } satisfies AlgorithmSource
      }

      const implementation = await loadLanguageImplementation(algorithmId, id)
      return {
        language: id,
        label,
        code: implementation?.code ?? '',
        lineMap: implementation?.lineMap,
      } satisfies AlgorithmSource
    }),
  )
  return implementations
}

async function renderSource(
  source: AlgorithmSource,
  options: RenderAlgorithmCodeOptions,
): Promise<string> {
  return codeToHtml(source.code, {
    lang: source.language,
    themes: { light: 'light-plus', dark: 'dark-plus' },
    defaultColor: false,
    transformers: [codeViewerTransformer(source, options)],
  })
}

/** Build-only rendering of every supported language for one algorithm. */
export async function renderAlgorithmCodeHtml(
  algorithmId: string,
  options: RenderAlgorithmCodeOptions = {},
): Promise<string> {
  const sources = await loadAlgorithmSources(algorithmId)
  const blocks = await Promise.all(sources.map((source) => renderSource(source, options)))
  return `<div data-algorithm-code data-algorithm-id="${algorithmId}">${blocks.join('')}</div>`
}
