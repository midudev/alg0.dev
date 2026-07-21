import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Prim's Algorithm

Prim's Algorithm finds a Minimum Spanning Tree (MST) for a weighted, connected, undirected graph. The MST connects all vertices with the minimum total edge weight.

How it works:
1. Start with any node as the initial tree
2. Find the minimum weight edge connecting the tree to a non-tree vertex
3. Add that edge and vertex to the tree
4. Repeat until all vertices are in the tree

Time Complexity:
  O(V²) with adjacency matrix
  O(E log V) with binary heap

Space Complexity: O(V)

Applications:
  - Network design (minimum cost wiring)
  - Approximation algorithms for NP-hard problems
  - Cluster analysis
  - Image segmentation

Prim's Algorithm is a greedy algorithm that always picks the cheapest edge to expand the tree. Compare with Kruskal's Algorithm, which sorts all edges globally.`,
  es: `Algoritmo de Prim

El algoritmo de Prim encuentra un Árbol de Expansión Mínima (MST) para un grafo ponderado, conexo y no dirigido. El MST conecta todos los vértices con el peso total mínimo de aristas.

Cómo funciona:
1. Comenzar con cualquier nodo como árbol inicial
2. Encontrar la arista de peso mínimo que conecte el árbol con un vértice externo
3. Agregar esa arista y vértice al árbol
4. Repetir hasta que todos los vértices estén en el árbol

Complejidad Temporal:
  O(V²) con matriz de adyacencia
  O(E log V) con min-heap

Complejidad Espacial: O(V)

Aplicaciones:
  - Diseño de redes (cableado de costo mínimo)
  - Algoritmos de aproximación para problemas NP-duros
  - Análisis de clusters
  - Segmentación de imágenes

El algoritmo de Prim es un algoritmo voraz que siempre elige la arista más barata para expandir el árbol. Compárese con el algoritmo de Kruskal, que ordena todas las aristas globalmente.`,
}

export default descriptions
