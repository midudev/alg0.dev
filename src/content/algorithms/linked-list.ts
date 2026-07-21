import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Linked List

A Linked List is a linear data structure where each element (node) contains a value and a pointer to the next node.

Unlike arrays, elements are not in contiguous memory — each node can be anywhere, connected by pointers.

Operations:
  append:  add node at the end       — O(1) with tail pointer
  prepend: add node at the beginning — O(1)
  search:  traverse to find a value  — O(n)
  delete:  remove a node by value    — O(n)
  access:  traverse from head        — O(n)

Advantages:
  - O(1) insertion/deletion at known positions
  - Dynamic size, no wasted memory

Disadvantages:
  - O(n) access by index (no random access)
  - Extra memory for pointers
  - Not cache-friendly`,
  es: `Lista Enlazada (Linked List)

Una Lista Enlazada es una estructura de datos lineal donde cada elemento (nodo) contiene un valor y un puntero al siguiente nodo.

A diferencia de los arreglos, los elementos no están en memoria contigua — cada nodo puede estar en cualquier parte, conectado por punteros.

Operaciones:
  append:  añadir al final          — O(1) con puntero tail
  prepend: añadir al inicio         — O(1)
  search:  recorrer para encontrar  — O(n)
  delete:  eliminar nodo por valor  — O(n)
  access:  recorrer desde la cabeza — O(n)

Ventajas:
  - Inserción/eliminación O(1) en posiciones conocidas
  - Tamaño dinámico, sin memoria desperdiciada

Desventajas:
  - Acceso O(n) por índice (sin acceso aleatorio)
  - Memoria extra para punteros
  - No es cache-friendly`,
}

export default descriptions
