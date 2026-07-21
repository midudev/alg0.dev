import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Quick Sort

Quick Sort is a highly efficient, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the array around it.

How it works:
1. Choose a pivot element (here, the last element)
2. Partition: rearrange so elements smaller than pivot are on the left, larger on the right
3. The pivot is now in its final sorted position
4. Recursively apply to the left and right sub-arrays

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n²) — when pivot is always the smallest/largest

Space Complexity: O(log n) average, O(n) worst — recursive call stack

Properties:
  - Not stable
  - In-place (with Lomuto partition)
  - Cache-friendly

Quick Sort is one of the fastest general-purpose sorting algorithms in practice. Used in many standard library implementations.`,
  es: `Quick Sort (Ordenamiento Rápido)

Quick Sort es un algoritmo de ordenamiento altamente eficiente basado en divide y vencerás. Funciona seleccionando un elemento "pivote" y particionando el arreglo alrededor de él.

Cómo funciona:
1. Elige un elemento pivote (aquí, el último elemento)
2. Particiona: reorganiza para que los elementos menores al pivote queden a la izquierda y los mayores a la derecha
3. El pivote queda en su posición final ordenada
4. Aplica recursivamente a los sub-arreglos izquierdo y derecho

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n log n)
  Peor:     O(n²) — cuando el pivote siempre es el menor/mayor

Complejidad Espacial: O(log n) promedio, O(n) peor caso — pila de llamadas recursivas

Propiedades:
  - No es estable
  - In-place (con partición de Lomuto)
  - Amigable con la caché

Quick Sort es uno de los algoritmos de ordenamiento de propósito general más rápidos en la práctica. Usado en muchas implementaciones de bibliotecas estándar.`,
}

export default descriptions
