import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Dijkstra's Algorithm

Dijkstra's Algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.

How it works:
1. Initialize distances: source = 0, all others = ∞
2. Mark all nodes as unvisited
3. Pick the unvisited node with the smallest distance
4. For each unvisited neighbor, calculate the tentative distance
5. If the new distance is smaller, update it
6. Mark the current node as visited
7. Repeat until all nodes are visited

Time Complexity:
  O(V²) with simple array
  O((V + E) log V) with min-heap

Space Complexity: O(V)

Applications:
  - GPS navigation and route planning
  - Network routing protocols (OSPF)
  - Finding shortest paths in maps
  - Social network analysis

Dijkstra's Algorithm is one of the most important graph algorithms. It guarantees optimal solutions for graphs with non-negative weights.`,
  es: `Algoritmo de Dijkstra

El algoritmo de Dijkstra encuentra el camino más corto desde un nodo origen a todos los demás nodos en un grafo ponderado con pesos no negativos.

Cómo funciona:
1. Inicializar distancias: origen = 0, todos los demás = ∞
2. Marcar todos los nodos como no visitados
3. Seleccionar el nodo no visitado con la menor distancia
4. Para cada vecino no visitado, calcular la distancia tentativa
5. Si la nueva distancia es menor, actualizarla
6. Marcar el nodo actual como visitado
7. Repetir hasta que todos los nodos estén visitados

Complejidad Temporal:
  O(V²) con arreglo simple
  O((V + E) log V) con min-heap binario

Complejidad Espacial: O(V)

Aplicaciones:
  - Navegación GPS y planificación de rutas
  - Protocolos de enrutamiento de red (OSPF)
  - Encontrar caminos más cortos en mapas
  - Análisis de redes sociales

El algoritmo de Dijkstra es uno de los algoritmos de grafos más importantes. Garantiza soluciones óptimas para grafos con pesos no negativos.`,
}

export default descriptions
