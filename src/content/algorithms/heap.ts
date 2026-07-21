import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Heap (Min Heap)

A Heap is a complete binary tree where every parent is smaller (min-heap) or larger (max-heap) than its children. It's stored as an array.

Array-to-tree mapping (0-indexed):
  Parent of i:      Math.floor((i - 1) / 2)
  Left child of i:  2 * i + 1
  Right child of i: 2 * i + 2

Operations:
  insert:     add at end, bubble up   — O(log n)
  extractMin: remove root, bubble down — O(log n)
  peek:       return root             — O(1)

Applications:
  - Priority queues
  - Heap Sort
  - Dijkstra's algorithm
  - Finding k-th smallest/largest`,
  es: `Montículo (Heap)

Un Heap es un árbol binario completo donde cada padre es menor (min-heap) o mayor (max-heap) que sus hijos. Se almacena como un arreglo.

Mapeo arreglo-árbol (índice base 0):
  Padre de i:       Math.floor((i - 1) / 2)
  Hijo izquierdo:   2 * i + 1
  Hijo derecho:     2 * i + 2

Operaciones:
  insert:     añadir al final, subir (bubble up)    — O(log n)
  extractMin: eliminar raíz, bajar (bubble down)    — O(log n)
  peek:       retornar la raíz                      — O(1)

Aplicaciones:
  - Colas de prioridad
  - Heap Sort
  - Algoritmo de Dijkstra
  - Encontrar el k-ésimo menor/mayor`,
}

export default descriptions
