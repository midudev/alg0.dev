import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Space Complexity

Space Complexity measures the amount of memory an algorithm uses relative to the input size. Like time complexity, we use Big O notation.

Common space complexities:
  O(1)     — Constant: fixed number of variables
  O(log n) — Logarithmic: recursive call stack depth
  O(n)     — Linear: one copy of the input
  O(n²)    — Quadratic: 2D matrix of input size

Important distinction:
  - Auxiliary space: extra memory beyond the input
  - Total space: input + auxiliary

Examples:
  O(1): in-place sorting (Bubble Sort), variable swaps
  O(log n): recursive binary search (call stack)
  O(n): Merge Sort (temporary arrays), hash tables
  O(n²): DP tables, adjacency matrices`,
  es: `Complejidad Espacial

La Complejidad Espacial mide la cantidad de memoria que usa un algoritmo en relación al tamaño de la entrada. Al igual que la complejidad temporal, se usa la notación Big O.

Complejidades espaciales comunes:
  O(1)     — Constante: número fijo de variables
  O(log n) — Logarítmica: profundidad de la pila de llamadas recursivas
  O(n)     — Lineal: una copia de la entrada
  O(n²)    — Cuadrática: matriz 2D del tamaño de la entrada

Distinción importante:
  - Espacio auxiliar: memoria extra más allá de la entrada
  - Espacio total: entrada + auxiliar

Ejemplos:
  O(1): ordenamiento in-place (Bubble Sort), intercambio de variables
  O(log n): búsqueda binaria recursiva (pila de llamadas)
  O(n): Merge Sort (arreglos temporales), tablas hash
  O(n²): tablas de DP, matrices de adyacencia`,
}

export default descriptions
