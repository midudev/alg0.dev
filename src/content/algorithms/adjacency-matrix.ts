import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Adjacency Matrix

An adjacency matrix represents a graph as a two-dimensional grid. For a graph with V vertices, it is a V×V matrix where the cell at row u, column v records the edge from u to v. In this unweighted demonstration, 1 means that the edge exists and 0 means that it does not.

How it works:
1. Create a V×V matrix filled with 0
2. For every directed edge u→v, set matrix[u][v] = 1
3. For an undirected graph, also set matrix[v][u] = 1, making the matrix symmetric
4. For a weighted graph, store the edge weight instead of 1, using a separate sentinel for absent edges when necessary

Time Complexity:
  Complete construction: O(V² + E), usually summarized as O(V²) for a simple graph
  Edge lookup: O(1) — read matrix[u][v] directly
  Iterate a node's neighbors: O(V)
  Initialize the matrix: O(V²)
  Process the edges: O(E)

Space Complexity: O(V²) — independent of the number of edges

Adjacency matrix vs adjacency list:
  - Matrix: O(1) edge lookup and O(V²) space, often useful for dense graphs
  - List: O(V + E) space and efficient neighbor iteration, often useful for sparse graphs

Applications:
  - Dense graphs where many pairs of vertices are connected
  - Algorithms that need frequent constant-time edge checks, such as Floyd–Warshall
  - Weighted graphs whose cells store edge weights

In a directed graph the matrix is generally asymmetric: matrix[u][v] need not equal matrix[v][u]. In an undirected graph those two cells represent the same edge, so the matrix is symmetric.`,
  es: `Matriz de Adyacencia

Una matriz de adyacencia representa un grafo como una cuadrícula bidimensional. Para un grafo con V vértices, es una matriz de V×V en la que la celda de la fila u y la columna v registra la arista de u a v. En esta demostración no ponderada, 1 significa que la arista existe y 0 que no existe.

Cómo funciona:
1. Crea una matriz de V×V llena de 0
2. Para cada arista dirigida u→v, asigna matrix[u][v] = 1
3. Para un grafo no dirigido, asigna también matrix[v][u] = 1, lo que hace que la matriz sea simétrica
4. Para un grafo ponderado, guarda el peso de la arista en lugar de 1, usando un valor centinela distinto para las aristas ausentes cuando sea necesario

Complejidad Temporal:
  Construcción completa: O(V² + E), normalmente resumida como O(V²) para un grafo simple
  Consulta de una arista: O(1) — lee matrix[u][v] directamente
  Recorrer los vecinos de un nodo: O(V)
  Inicializar la matriz: O(V²)
  Procesar las aristas: O(E)

Complejidad Espacial: O(V²) — independiente del número de aristas

Matriz de adyacencia frente a lista de adyacencia:
  - Matriz: consulta de aristas en O(1) y espacio O(V²), útil a menudo para grafos densos
  - Lista: espacio O(V + E) y recorrido eficiente de vecinos, útil a menudo para grafos dispersos

Aplicaciones:
  - Grafos densos en los que muchos pares de vértices están conectados
  - Algoritmos que necesitan consultas frecuentes de aristas en tiempo constante, como Floyd–Warshall
  - Grafos ponderados cuyas celdas almacenan los pesos de las aristas

En un grafo dirigido, la matriz generalmente es asimétrica: matrix[u][v] no tiene por qué ser igual a matrix[v][u]. En un grafo no dirigido, esas dos celdas representan la misma arista, por lo que la matriz es simétrica.`,
}

export default descriptions
