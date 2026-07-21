/**
 * Shared DOM helpers for concept visualizers.
 */
const SVG_NS = 'http://www.w3.org/2000/svg'

/**
 * The few SVG attributes that really are camelCase. Everything else is
 * kebab-case, so JSX-style names (`fontSize`, `strokeWidth`…) are translated
 * instead of silently ignored by setAttribute.
 */
const CAMEL_SVG_ATTRS = new Set([
  'attributeName',
  'baseFrequency',
  'calcMode',
  'clipPathUnits',
  'filterUnits',
  'gradientTransform',
  'gradientUnits',
  'keyPoints',
  'keySplines',
  'keyTimes',
  'lengthAdjust',
  'markerHeight',
  'markerUnits',
  'markerWidth',
  'maskContentUnits',
  'maskUnits',
  'numOctaves',
  'pathLength',
  'patternContentUnits',
  'patternTransform',
  'patternUnits',
  'preserveAspectRatio',
  'primitiveUnits',
  'refX',
  'refY',
  'repeatCount',
  'spreadMethod',
  'startOffset',
  'stdDeviation',
  'textLength',
  'viewBox',
])

function svgAttrName(name: string): string {
  if (CAMEL_SVG_ATTRS.has(name)) return name
  return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`)
}

function svgEl<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number | undefined> = {},
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(SVG_NS, tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null) continue
    node.setAttribute(svgAttrName(k), String(v))
  }
  return node
}

function applyStyles(
  el: HTMLElement | SVGElement,
  styles: Record<string, string | number | undefined>,
) {
  for (const [k, v] of Object.entries(styles)) {
    if (v == null) continue
    ;(el.style as unknown as Record<string, string>)[k] = String(v)
  }
}

export { svgEl, applyStyles, SVG_NS }
