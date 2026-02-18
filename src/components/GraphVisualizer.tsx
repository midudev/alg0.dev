import type { Step } from '@lib/types'
import type { Locale } from '@i18n/translations'
import { translations } from '@i18n/translations'

const NODE_RADIUS = 22

const colors = {
  nodeDefault: '#1a1a1a',
  nodeVisited: '#555',
  nodeCurrent: '#fff',
  edgeDefault: '#222',
  edgeVisited: '#555',
  edgeCurrent: '#fff',
  strokeDefault: '#333',
  strokeVisited: '#666',
  strokeCurrent: '#fff',
  weightText: '#888',
  weightBg: '#000',
}

interface GraphVisualizerProps {
  step: Step
  locale?: Locale
}

export default function GraphVisualizer({ step, locale = 'en' }: GraphVisualizerProps) {
  const t = translations[locale]
  const { graph } = step
  if (!graph) return null

  const {
    nodes,
    edges,
    visitedNodes = [],
    currentNode,
    visitedEdges = [],
    currentEdge,
    distances,
  } = graph

  const isEdgeVisited = (from: number, to: number) =>
    visitedEdges.some(([a, b]) => (a === from && b === to) || (a === to && b === from))

  const isEdgeCurrent = (from: number, to: number) =>
    currentEdge != null &&
    ((currentEdge[0] === from && currentEdge[1] === to) ||
      (currentEdge[0] === to && currentEdge[1] === from))

  const hasWeights = edges.some((e) => e.weight != null)

  const currentNodeLabel =
    currentNode != null ? nodes.find((n) => n.id === currentNode)?.label : null
  const visitedLabels = visitedNodes
    .map((id) => nodes.find((n) => n.id === id)?.label)
    .filter(Boolean)

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center gap-5"
      role="img"
      aria-label={`Graph visualization: ${nodes.length} nodes, ${edges.length} edges.${currentNodeLabel ? ` Current node: ${currentNodeLabel}.` : ''}${visitedLabels.length > 0 ? ` Visited: ${visitedLabels.join(', ')}.` : ''}`}
    >
      <svg viewBox="0 0 500 340" className="w-full max-w-lg" aria-hidden="true">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Edges */}
        {edges.map((edge, i) => {
          const from = nodes.find((n) => n.id === edge.from)
          const to = nodes.find((n) => n.id === edge.to)
          if (!from || !to) return null

          const isCurrent = isEdgeCurrent(edge.from, edge.to)
          const isVisited = isEdgeVisited(edge.from, edge.to)
          const color = isCurrent
            ? colors.edgeCurrent
            : isVisited
              ? colors.edgeVisited
              : colors.edgeDefault

          const midX = (from.x + to.x) / 2
          const midY = (from.y + to.y) / 2

          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth={isCurrent ? 3 : 2}
                strokeLinecap="round"
                style={{ transition: 'stroke 0.3s ease, stroke-width 0.3s ease' }}
                filter={isCurrent ? 'url(#glow)' : undefined}
              />
              {/* Weight label */}
              {hasWeights && edge.weight != null && (
                <>
                  <circle
                    cx={midX}
                    cy={midY}
                    r={10}
                    fill={colors.weightBg}
                    stroke={isVisited || isCurrent ? color : colors.strokeDefault}
                    strokeWidth={1}
                  />
                  <text
                    x={midX}
                    y={midY}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill={
                      isCurrent
                        ? colors.strokeCurrent
                        : isVisited
                          ? colors.strokeVisited
                          : colors.weightText
                    }
                    fontSize="9"
                    fontWeight="600"
                    fontFamily="Inter, system-ui, sans-serif"
                  >
                    {edge.weight}
                  </text>
                </>
              )}
            </g>
          )
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          const isCurrent = currentNode === node.id
          const isVisited = visitedNodes.includes(node.id)
          const fill = isCurrent
            ? colors.nodeCurrent
            : isVisited
              ? colors.nodeVisited
              : colors.nodeDefault
          const stroke = isCurrent
            ? colors.strokeCurrent
            : isVisited
              ? colors.strokeVisited
              : colors.strokeDefault

          return (
            <g key={node.id}>
              {/* Pulse ring for current node */}
              {isCurrent && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={NODE_RADIUS + 4}
                  fill="none"
                  stroke={colors.nodeCurrent}
                  strokeWidth={2}
                  opacity={0.25}
                >
                  <animate
                    attributeName="r"
                    values={`${NODE_RADIUS + 3};${NODE_RADIUS + 10};${NODE_RADIUS + 3}`}
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0.3;0;0.3"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}

              <circle
                cx={node.x}
                cy={node.y}
                r={NODE_RADIUS}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
                style={{ transition: 'fill 0.3s ease, stroke 0.3s ease' }}
                filter={isCurrent ? 'url(#glow)' : undefined}
              />

              <text
                x={node.x}
                y={node.y}
                textAnchor="middle"
                dominantBaseline="central"
                fill={isCurrent ? '#000' : '#fff'}
                fontSize="13"
                fontWeight="600"
                fontFamily="Inter, system-ui, sans-serif"
                style={{ transition: 'fill 0.3s ease' }}
              >
                {node.label}
              </text>
            </g>
          )
        })}
      </svg>

      {/* Queue / Stack / Distances display */}
      {graph.queue && (
        <div
          className="flex items-center gap-2.5"
          aria-label={`Queue: ${graph.queue.length > 0 ? graph.queue.join(', ') : 'empty'}`}
        >
          <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">
            {t.queue}
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {graph.queue.length > 0 ? (
              graph.queue.map((nodeId, i) => (
                <span
                  key={i}
                  className="text-xs font-mono bg-white/6 text-neutral-300 px-2.5 py-1 rounded-md border border-white/8"
                >
                  {nodeId}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-600 italic">{t.empty}</span>
            )}
          </div>
        </div>
      )}
      {graph.stack && (
        <div
          className="flex items-center gap-2.5"
          aria-label={`Stack: ${graph.stack.length > 0 ? graph.stack.join(', ') : 'empty'}`}
        >
          <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">
            {t.stack}
          </span>
          <div className="flex gap-1" aria-hidden="true">
            {graph.stack.length > 0 ? (
              graph.stack.map((nodeId, i) => (
                <span
                  key={i}
                  className="text-xs font-mono bg-white/6 text-neutral-300 px-2.5 py-1 rounded-md border border-white/8"
                >
                  {nodeId}
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-600 italic">{t.empty}</span>
            )}
          </div>
        </div>
      )}
      {distances && (
        <div
          className="flex items-center gap-2.5 flex-wrap justify-center"
          aria-label={`Distances: ${Object.entries(distances)
            .map(([id, d]) => `${id}:${d}`)
            .join(', ')}`}
        >
          <span className="text-[11px] text-neutral-500 font-medium uppercase tracking-wider">
            {t.distances}
          </span>
          <div className="flex gap-1 flex-wrap" aria-hidden="true">
            {Object.entries(distances).map(([nodeId, dist]) => (
              <span
                key={nodeId}
                className="text-xs font-mono bg-white/6 text-neutral-300 px-2 py-1 rounded-md border border-white/8"
              >
                {nodes.find((n) => n.id === Number(nodeId))?.label ?? nodeId}:{' '}
                {dist === Infinity ? '∞' : dist}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
