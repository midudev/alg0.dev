import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Maze Pathfinding (BFS)

This algorithm uses Breadth-First Search to find the shortest path through a maze from start to finish, navigating around walls.

How it works:
1. Start BFS from the starting cell
2. Explore all 4 neighbors (up, down, left, right)
3. Skip walls and already-visited cells
4. Mark each explored cell and record its parent
5. When the end is reached, trace back through parents to find the path

Time Complexity: O(rows × cols)
Space Complexity: O(rows × cols)

Properties:
  - Guarantees the shortest path
  - Explores level by level (nearest cells first)
  - Works on unweighted grids

BFS-based pathfinding is fundamental in game development, robotics, and navigation systems. For weighted grids, Dijkstra's or A* would be used instead.`,
  es: `Búsqueda de Camino en Laberinto (BFS)

Este algoritmo usa Búsqueda en Anchura para encontrar el camino más corto a través de un laberinto desde el inicio hasta el final, navegando alrededor de muros.

Cómo funciona:
1. Iniciar BFS desde la celda de inicio
2. Explorar los 4 vecinos (arriba, abajo, izquierda, derecha)
3. Omitir muros y celdas ya visitadas
4. Marcar cada celda explorada y registrar su padre
5. Cuando se alcanza el final, rastrear hacia atrás a través de los padres para encontrar el camino

Complejidad Temporal: O(filas × columnas)
Complejidad Espacial: O(filas × columnas)

Propiedades:
  - Garantiza el camino más corto
  - Explora nivel por nivel (celdas más cercanas primero)
  - Funciona en cuadrículas sin pesos

La búsqueda de caminos basada en BFS es fundamental en desarrollo de videojuegos, robótica y sistemas de navegación. Para cuadrículas ponderadas, se usaría Dijkstra o A* en su lugar.`,
}

export default descriptions
