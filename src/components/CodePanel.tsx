import { useState, useRef, useEffect, useCallback, useMemo, lazy, Suspense } from 'react'
import type { Monaco } from '@monaco-editor/react'
import type { Locale } from '@i18n/translations'
import { translations } from '@i18n/translations'
import type { CodeLanguage, CodeSample, Difficulty } from '@lib/types'
import ComplexityChart from '@components/ComplexityChart'

const LazyEditor = lazy(() => import('@monaco-editor/react'))

const DIFFICULTY_CONFIG: Record<Difficulty, { en: string; es: string; color: string; bg: string }> =
  {
    easy: {
      en: 'Easy',
      es: 'Fácil',
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10 border-emerald-400/20',
    },
    intermediate: {
      en: 'Intermediate',
      es: 'Intermedio',
      color: 'text-amber-400',
      bg: 'bg-amber-400/10 border-amber-400/20',
    },
    advanced: {
      en: 'Advanced',
      es: 'Avanzado',
      color: 'text-red-400',
      bg: 'bg-red-400/10 border-red-400/20',
    },
  }

const LANGUAGE_PRESETS: Record<CodeLanguage, { label: string; short: string; monaco: string }> = {
  javascript: { label: 'JavaScript', short: 'JS', monaco: 'javascript' },
  typescript: { label: 'TypeScript', short: 'TS', monaco: 'typescript' },
  python: { label: 'Python', short: 'Py', monaco: 'python' },
  cpp: { label: 'C++', short: 'C++', monaco: 'cpp' },
  java: { label: 'Java', short: 'Java', monaco: 'java' },
}

interface EnrichedSample {
  language: CodeLanguage
  label: string
  shortLabel: string
  monacoLanguage: string
  code: string
}

interface CodePanelProps {
  code: string
  codeSamples?: CodeSample[]
  description: string
  difficulty?: Difficulty
  currentLine?: number
  variables?: Record<string, string | number | boolean | null>
  consoleOutput?: string[]
  activeTab: 'code' | 'about'
  onTabChange: (tab: 'code' | 'about') => void
  locale?: Locale
}

/** Custom dark theme that matches the app background */
function defineTheme(monaco: Monaco) {
  monaco.editor.defineTheme('algoviz-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [],
    colors: {
      'editor.background': '#000000',
      'editor.lineHighlightBackground': '#ffffff06',
      'editorLineNumber.foreground': '#333',
      'editorLineNumber.activeForeground': '#facc15',
      'editor.selectionBackground': '#ffffff15',
      'editorCursor.foreground': '#fff',
    },
  })
}

export default function CodePanel({
  code,
  codeSamples,
  description,
  difficulty,
  currentLine,
  variables,
  consoleOutput,
  activeTab,
  onTabChange,
  locale = 'en',
}: CodePanelProps) {
  const t = translations[locale]
  const [isMounted, setIsMounted] = useState(false)
  const [editorReady, setEditorReady] = useState(false)
  const editorRef = useRef<any>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const decorationsRef = useRef<string[]>([])
  const samples = useMemo<EnrichedSample[]>(() => {
    const seen = new Set<CodeLanguage>()
    const enriched: EnrichedSample[] = []

    const pushSample = (sample: { language: CodeLanguage; code: string; label?: string }) => {
      if (seen.has(sample.language)) return
      const preset = LANGUAGE_PRESETS[sample.language]
      if (!preset) return
      seen.add(sample.language)
      enriched.push({
        language: sample.language,
        label: sample.label ?? preset.label,
        shortLabel: preset.short,
        monacoLanguage: preset.monaco,
        code: sample.code,
      })
    }

    pushSample({ language: 'javascript', code, label: LANGUAGE_PRESETS.javascript.label })
    ;(codeSamples ?? []).forEach((sample) => pushSample(sample))

    return enriched
  }, [code, codeSamples])
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('javascript')

  useEffect(() => {
    if (samples.length === 0) return
    if (!samples.some((s) => s.language === selectedLanguage)) {
      setSelectedLanguage(samples[0].language)
    }
  }, [samples, selectedLanguage])

  const activeSample = useMemo(() => {
    if (samples.length === 0) {
      const preset = LANGUAGE_PRESETS.javascript
      return {
        language: 'javascript' as CodeLanguage,
        label: preset.label,
        shortLabel: preset.short,
        monacoLanguage: preset.monaco,
        code,
      }
    }
    return samples.find((s) => s.language === selectedLanguage) ?? samples[0]
  }, [samples, selectedLanguage, code])

  const editorLanguage = activeSample.monacoLanguage
  const editorCode = activeSample.code
  const hasMultipleLanguages = samples.length > 1
  const showLanguageWarning = hasMultipleLanguages && activeSample.language !== 'javascript'

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleEditorDidMount = useCallback(
    (editor: any, monacoInstance: Monaco) => {
      defineTheme(monacoInstance)
      monacoInstance.editor.setTheme('algoviz-dark')
      editorRef.current = editor
      monacoRef.current = monacoInstance

      // Apply initial line highlight
      if (currentLine != null && currentLine > 0) {
        decorationsRef.current = editor.deltaDecorations(
          [],
          [
            {
              range: new monacoInstance.Range(currentLine, 1, currentLine, 1),
              options: {
                isWholeLine: true,
                className: 'algoviz-active-line',
                linesDecorationsClassName: 'algoviz-active-line-gutter',
              },
            },
          ],
        )
      }

      setEditorReady(true)
    },
    [currentLine],
  )

  // Build inline variable annotation for the active line
  const inlineVarText = useMemo(() => {
    if (!variables || Object.keys(variables).length === 0) return ''
    const parts = Object.entries(variables).map(
      ([k, v]) => `${k} = ${typeof v === 'string' ? v : JSON.stringify(v)}`,
    )
    return '  // ' + parts.join(', ')
  }, [variables])

  // Update line highlight + inline variable annotation when currentLine/variables change
  useEffect(() => {
    const editor = editorRef.current
    const monaco = monacoRef.current
    if (!editor || !monaco) return

    if (currentLine != null && currentLine > 0) {
      const decorations: any[] = [
        {
          range: new monaco.Range(currentLine, 1, currentLine, 1),
          options: {
            isWholeLine: true,
            className: 'algoviz-active-line',
            linesDecorationsClassName: 'algoviz-active-line-gutter',
          },
        },
      ]

      // Add inline variable annotation after the active line content
      if (inlineVarText) {
        decorations.push({
          range: new monaco.Range(
            currentLine,
            Number.MAX_SAFE_INTEGER,
            currentLine,
            Number.MAX_SAFE_INTEGER,
          ),
          options: {
            after: {
              content: inlineVarText,
              inlineClassName: 'algoviz-inline-vars',
            },
          },
        })
      }

      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, decorations)

      // Scroll to the active line
      editor.revealLineInCenterIfOutsideViewport(currentLine)
    } else {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, [])
    }
  }, [currentLine, editorReady, inlineVarText])

  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div
        className="flex border-b border-white/8 shrink-0"
        role="tablist"
        aria-label={locale === 'es' ? 'Pestañas de código y detalles' : 'Code and details tabs'}
        onKeyDown={(e) => {
          const tabs = ['code', 'about'] as const
          const currentIndex = tabs.indexOf(activeTab)
          if (e.key === 'ArrowRight') {
            e.preventDefault()
            onTabChange(tabs[(currentIndex + 1) % tabs.length])
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault()
            onTabChange(tabs[(currentIndex - 1 + tabs.length) % tabs.length])
          }
        }}
      >
        {(['code', 'about'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            id={`tab-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            className={`px-3 py-2.5 md:px-5 md:py-3 text-xs font-medium transition-all relative capitalize ${
              activeTab === tab ? 'text-white' : 'text-neutral-600 hover:text-neutral-400'
            }`}
          >
            <span className="flex items-center gap-2">
              {tab === 'code' ? t.tabCode : t.tabAbout}
              <kbd
                className={`inline-flex items-center justify-center w-[18px] h-[18px] text-[10px] font-mono rounded border ${
                  activeTab === tab
                    ? 'border-white/20 text-white/60 bg-white/6'
                    : 'border-white/10 text-neutral-600 bg-white/3'
                }`}
                aria-hidden="true"
              >
                {tab === 'code' ? 'C' : 'E'}
              </kbd>
            </span>
            {activeTab === tab && (
              <div className="absolute bottom-0 left-2 right-2 h-px bg-white" aria-hidden="true" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'code' ? (
        <div
          className="flex-1 flex flex-col overflow-hidden"
          role="tabpanel"
          id="tabpanel-code"
          aria-labelledby="tab-code"
        >
          {hasMultipleLanguages && (
            <div className="border-b border-white/8 px-4 py-2">
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  {t.codeLanguageLabel}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {activeSample.label}
                </span>
              </div>
              <div
                className="flex flex-wrap gap-1.5"
                role="radiogroup"
                aria-label={t.codeLanguageLabel}
              >
                {samples.map((sample) => {
                  const isActive = sample.language === selectedLanguage
                  return (
                    <button
                      key={sample.language}
                      type="button"
                      role="radio"
                      aria-checked={isActive}
                      tabIndex={isActive ? 0 : -1}
                      onClick={() => setSelectedLanguage(sample.language)}
                      className={`px-3 py-1.5 rounded-md border text-[11px] font-semibold tracking-wide transition-colors ${
                        isActive
                          ? 'bg-white/10 border-white/30 text-white'
                          : 'border-white/10 text-neutral-500 hover:text-white/80 hover:border-white/20'
                      }`}
                    >
                      <span className="font-mono mr-1 text-[10px] uppercase tracking-[0.3em]">
                        {sample.shortLabel}
                      </span>
                      <span>{sample.label}</span>
                    </button>
                  )
                })}
              </div>
              {showLanguageWarning && (
                <div className="mt-3 flex items-start gap-2 text-[11px] text-amber-300/80">
                  <svg
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v4m0 4h.01M10.29 3.86L2.82 17.25A1.5 1.5 0 004.12 19.5h15.76a1.5 1.5 0 001.3-2.25L13.71 3.86a1.5 1.5 0 00-2.42 0z"
                    />
                  </svg>
                  <span className="leading-tight">{t.codeLanguageWarning}</span>
                </div>
              )}
            </div>
          )}
          <div
            className="flex-1 overflow-hidden transition-opacity duration-500 ease-in-out"
            style={{ opacity: editorReady ? 1 : 0 }}
          >
            {isMounted && (
              <Suspense fallback={null}>
                <LazyEditor
                  language={editorLanguage}
                  value={editorCode}
                  path={`algorithm-${activeSample.language}`}
                  theme="vs-dark"
                  onMount={handleEditorDidMount}
                  loading={null}
                  options={{
                    readOnly: true,
                    domReadOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 13,
                    lineHeight: 28,
                    fontFamily: "'Geist Mono', ui-monospace, monospace",
                    fontLigatures: true,
                    renderLineHighlight: 'none',
                    overviewRulerLanes: 0,
                    hideCursorInOverviewRuler: true,
                    overviewRulerBorder: false,
                    scrollbar: {
                      vertical: 'hidden',
                      horizontal: 'hidden',
                      handleMouseWheel: true,
                    },
                    lineNumbers: 'on',
                    lineDecorationsWidth: 12,
                    lineNumbersMinChars: 3,
                    glyphMargin: false,
                    folding: false,
                    contextmenu: false,
                    selectionHighlight: false,
                    occurrencesHighlight: 'off',
                    renderLineHighlightOnlyWhenFocus: false,
                    matchBrackets: 'never',
                    padding: { top: 12, bottom: 12 },
                    guides: { indentation: false },
                    wordWrap: 'off',
                    cursorStyle: 'line-thin',
                    cursorBlinking: 'solid',
                  }}
                />
              </Suspense>
            )}
          </div>

          {/* Console output panel asd */}
          {consoleOutput && consoleOutput.length > 0 && (
            <div
              className="shrink-0 border-t border-white/[0.08] max-h-[140px] flex flex-col"
              role="region"
              aria-label={locale === 'es' ? 'Salida de consola' : 'Console output'}
            >
              <div className="px-4 py-2 flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-neutral-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Console
                  </span>
                  <span className="text-[10px] text-neutral-600 tabular-nums">
                    ({consoleOutput.length})
                  </span>
                </div>
              </div>
              <div className="px-4 pb-3 overflow-auto flex-1 min-h-0" aria-live="polite">
                {consoleOutput.map((line, i) => (
                  <div
                    key={i}
                    className={`flex gap-2 text-[11px] font-mono leading-[18px] ${
                      i === consoleOutput.length - 1 ? 'text-emerald-300/90' : 'text-neutral-500'
                    }`}
                  >
                    <span className="text-neutral-600 select-none shrink-0" aria-hidden="true">
                      {'›'}
                    </span>
                    <span className="break-all">{line}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Variables panel */}
          {variables && Object.keys(variables).length > 0 && (
            <div
              className="shrink-0 border-t border-white/8"
              role="region"
              aria-label={t.variables}
            >
              <div className="px-4 py-2 flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <svg
                    className="w-3.5 h-3.5 text-neutral-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.745 3A23.933 23.933 0 003 12c0 3.183.62 6.22 1.745 9M19.5 3c.967 2.78 1.5 5.817 1.5 9s-.533 6.22-1.5 9M8.25 8.885l1.444-.89a.75.75 0 011.105.402l2.402 7.206a.75.75 0 001.104.401l1.445-.889"
                    />
                  </svg>
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">
                    {t.variables}
                  </span>
                </div>
              </div>
              <div className="px-4 pb-3 flex flex-wrap gap-x-3 gap-y-1.5" aria-live="polite">
                {Object.entries(variables).map(([name, value]) => (
                  <div
                    key={name}
                    className="inline-flex items-center gap-1.5 text-[12px] font-mono"
                  >
                    <span className="text-neutral-300">{name}</span>
                    <span className="text-neutral-600" aria-hidden="true">
                      =
                    </span>
                    <span className="sr-only">=</span>
                    <span
                      className={`font-medium ${
                        typeof value === 'number'
                          ? 'text-amber-300/90'
                          : typeof value === 'boolean'
                            ? value
                              ? 'text-emerald-400/90'
                              : 'text-red-400/90'
                            : value === null
                              ? 'text-neutral-600'
                              : 'text-sky-300/90'
                      }`}
                    >
                      {value === null
                        ? 'null'
                        : typeof value === 'boolean'
                          ? String(value)
                          : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className="flex-1 overflow-auto p-4 md:p-6"
          role="tabpanel"
          id="tabpanel-about"
          aria-labelledby="tab-about"
        >
          <article className="text-[13px] text-neutral-400 leading-relaxed whitespace-pre-wrap font-[inherit]">
            {(() => {
              const lines = description.split('\n')
              const elements: React.ReactElement[] = []
              let listItems: React.ReactElement[] = []

              const flushList = () => {
                if (listItems.length > 0) {
                  elements.push(
                    <ul key={`list-${elements.length}`} className="list-none m-0 p-0" role="list">
                      {listItems}
                    </ul>,
                  )
                  listItems = []
                }
              }

              lines.forEach((line, i) => {
                const isBullet = line.trim().startsWith('-') || line.trim().startsWith('\u2022')

                if (!isBullet) flushList()

                if (i === 0 && line.trim()) {
                  elements.push(
                    <div key={i} className="mb-4">
                      <h3 className="text-lg font-semibold text-white font-heading">{line}</h3>
                      {difficulty &&
                        (() => {
                          const cfg = DIFFICULTY_CONFIG[difficulty]
                          const label = locale === 'es' ? cfg.es : cfg.en
                          return (
                            <span
                              className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 text-[11px] font-semibold rounded-full border ${cfg.bg} ${cfg.color}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${difficulty === 'easy' ? 'bg-emerald-400' : difficulty === 'intermediate' ? 'bg-amber-400' : 'bg-red-400'}`}
                              />
                              {label}
                            </span>
                          )
                        })()}
                    </div>,
                  )
                } else if (
                  line.match(
                    /^[A-Z\u00C1-\u00DA][a-zA-Z\u00e1\u00e9\u00ed\u00f3\u00fa\u00c1\u00c9\u00cd\u00d3\u00da\u00f1\u00d1\s]+:$/,
                  )
                ) {
                  elements.push(
                    <h4
                      key={i}
                      className="text-sm font-semibold text-neutral-200 mt-5 mb-2 font-heading"
                    >
                      {line}
                    </h4>,
                  )
                } else if (isBullet) {
                  listItems.push(
                    <li key={i} className="flex gap-2 ml-2 my-0.5">
                      <span className="text-neutral-600 shrink-0" aria-hidden="true">
                        {'\u2022'}
                      </span>
                      <span>{line.trim().replace(/^[-\u2022]\s*/, '')}</span>
                    </li>,
                  )
                } else if (line.match(/^\s{2,}/)) {
                  elements.push(
                    <div key={i} className="font-mono text-xs text-neutral-500 ml-4 my-0.5">
                      {line.trim()}
                    </div>,
                  )
                } else if (line.trim().match(/^\d+\./)) {
                  elements.push(
                    <div key={i} className="flex gap-2 ml-2 my-0.5">
                      <span>{line.trim()}</span>
                    </div>,
                  )
                } else if (!line.trim()) {
                  elements.push(<div key={i} className="h-2" />)
                } else {
                  elements.push(
                    <p key={i} className="my-1">
                      {line}
                    </p>,
                  )
                }
              })

              flushList()

              // Insert complexity chart right after the title
              if (elements.length > 0) {
                elements.splice(
                  1,
                  0,
                  <ComplexityChart
                    key="complexity-chart"
                    description={description}
                    locale={locale}
                  />,
                )
              }

              return elements
            })()}
          </article>
        </div>
      )}
    </div>
  )
}
