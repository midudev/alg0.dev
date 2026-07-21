import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Binary Search

Binary Search is an efficient algorithm for finding a target value in a sorted array. It works by repeatedly dividing the search interval in half.

Prerequisite: The array must be sorted.

How it works:
1. Compare the target with the middle element
2. If equal, we found the target
3. If target is smaller, search the left half
4. If target is larger, search the right half
5. Repeat until found or search space is empty

Time Complexity:
  Best:    O(1) — target is at the middle
  Average: O(log n)
  Worst:   O(log n)

Space Complexity: O(1) — iterative version

Binary Search is fundamental in computer science and is used extensively in databases, file systems, and as a building block for more complex algorithms.`,
  es: `Binary Search (Búsqueda Binaria)

Binary Search es un algoritmo eficiente para encontrar un valor objetivo en un arreglo ordenado. Funciona dividiendo repetidamente el intervalo de búsqueda a la mitad.

Prerrequisito: El arreglo debe estar ordenado.

Cómo funciona:
1. Compara el objetivo con el elemento del medio
2. Si son iguales, encontramos el objetivo
3. Si el objetivo es menor, busca en la mitad izquierda
4. Si el objetivo es mayor, busca en la mitad derecha
5. Repite hasta encontrar o agotar el espacio de búsqueda

Complejidad Temporal:
  Mejor:    O(1) — el objetivo está en el medio
  Promedio: O(log n)
  Peor:     O(log n)

Complejidad Espacial: O(1) — versión iterativa

Binary Search es fundamental en las ciencias de la computación y se usa extensamente en bases de datos, sistemas de archivos y como bloque de construcción para algoritmos más complejos.`,
}

export default descriptions
