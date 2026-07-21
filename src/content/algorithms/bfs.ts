import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Breadth-First Search (BFS)

BFS is a graph traversal algorithm that explores all vertices at the present depth before moving to vertices at the next depth level. It uses a queue data structure.

How it works:
1. Start from a source node, mark it as visited, add to queue
2. Dequeue a node, process it
3. Enqueue all unvisited neighbors
4. Repeat until the queue is empty

Time Complexity: O(V + E)
  V = number of vertices, E = number of edges

Space Complexity: O(V) — for the queue and visited set

Applications:
  - Shortest path in unweighted graphs
  - Level-order traversal of trees
  - Finding connected components
  - Web crawling
  - Social network analysis (degrees of separation)

BFS guarantees finding the shortest path (fewest edges) between two nodes in an unweighted graph.`,
  es: `Búsqueda en Anchura (BFS)

BFS es un algoritmo de recorrido de grafos que explora todos los vértices en la profundidad actual antes de pasar a los vértices del siguiente nivel de profundidad. Utiliza una estructura de datos de cola.

Cómo funciona:
1. Comienza desde un nodo origen, márcalo como visitado, agrégalo a la cola
2. Desencola un nodo, procésalo
3. Encola todos los vecinos no visitados
4. Repite hasta que la cola esté vacía

Complejidad Temporal: O(V + E)
  V = número de vértices, E = número de aristas

Complejidad Espacial: O(V) — para la cola y el conjunto de visitados

Aplicaciones:
  - Camino más corto en grafos no ponderados
  - Recorrido por niveles de árboles
  - Encontrar componentes conexos
  - Rastreo web (web crawling)
  - Análisis de redes sociales (grados de separación)

BFS garantiza encontrar el camino más corto (menos aristas) entre dos nodos en un grafo no ponderado.`,
}

export default descriptions
