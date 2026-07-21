import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Depth-First Search (DFS)

DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (or recursion).

How it works:
1. Start from a source node, mark it as visited
2. Recursively visit each unvisited neighbor
3. Backtrack when no unvisited neighbors remain
4. Continue until all reachable nodes are visited

Time Complexity: O(V + E)
  V = number of vertices, E = number of edges

Space Complexity: O(V) — for the recursion stack and visited set

Applications:
  - Detecting cycles in graphs
  - Topological sorting
  - Finding connected components
  - Solving mazes and puzzles
  - Path finding

DFS explores deep paths first, which makes it useful for topological sorting and cycle detection, but it doesn't guarantee shortest paths.`,
  es: `Búsqueda en Profundidad (DFS)

DFS es un algoritmo de recorrido de grafos que explora lo más profundo posible a lo largo de cada rama antes de retroceder. Utiliza una pila (o recursión).

Cómo funciona:
1. Comienza desde un nodo origen, márcalo como visitado
2. Visita recursivamente cada vecino no visitado
3. Retrocede cuando no quedan vecinos sin visitar
4. Continúa hasta que todos los nodos alcanzables sean visitados

Complejidad Temporal: O(V + E)
  V = número de vértices, E = número de aristas

Complejidad Espacial: O(V) — para la pila de recursión y el conjunto de visitados

Aplicaciones:
  - Detección de ciclos en grafos
  - Ordenamiento topológico
  - Encontrar componentes conexos
  - Resolver laberintos y puzzles
  - Búsqueda de caminos

DFS explora caminos profundos primero, lo que lo hace útil para ordenamiento topológico y detección de ciclos, pero no garantiza caminos más cortos.`,
}

export default descriptions
