import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Binary Search Tree (BST)

A BST is a tree where each node has at most two children, and for every node:
  - Left subtree contains only values less than the node
  - Right subtree contains only values greater than the node

This ordering enables efficient search by halving the search space at each step.

Operations:
  insert: compare and go left/right — O(h)
  search: compare and go left/right — O(h)
  delete: find and restructure      — O(h)

Where h = height of the tree:
  Balanced tree: h = O(log n) — efficient!
  Degenerate:    h = O(n) — like a linked list

Applications: ordered data storage, range queries, priority queues (with balancing)`,
  es: `Árbol Binario de Búsqueda (BST)

Un BST es un árbol donde cada nodo tiene como máximo dos hijos, y para cada nodo:
  - El subárbol izquierdo contiene solo valores menores
  - El subárbol derecho contiene solo valores mayores

Este ordenamiento permite una búsqueda eficiente al dividir el espacio de búsqueda a la mitad en cada paso.

Operaciones:
  insert: comparar e ir a izquierda/derecha — O(h)
  search: comparar e ir a izquierda/derecha — O(h)
  delete: encontrar y reestructurar         — O(h)

Donde h = altura del árbol:
  Árbol balanceado: h = O(log n) — ¡eficiente!
  Degenerado:       h = O(n) — como una lista enlazada

Aplicaciones: almacenamiento de datos ordenados, consultas por rango, colas de prioridad (con balanceo)`,
}

export default descriptions
