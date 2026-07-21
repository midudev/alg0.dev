import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Bubble Sort

Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

The algorithm gets its name because smaller elements "bubble" to the top of the list with each pass.

How it works:
1. Compare each pair of adjacent elements
2. Swap them if the left element is greater
3. After each pass, the largest unsorted element settles in its final position
4. Repeat until no swaps are needed

Time Complexity:
  Best:    O(n) — already sorted
  Average: O(n²)
  Worst:   O(n²)

Space Complexity: O(1) — in-place

Properties:
  - Stable sort
  - Adaptive
  - In-place

Mainly used for educational purposes. For production, prefer Quick Sort or Merge Sort.`,
  es: `Bubble Sort (Ordenamiento Burbuja)

Bubble Sort es un algoritmo de ordenamiento simple basado en comparaciones. Recorre repetidamente la lista, compara elementos adyacentes y los intercambia si están en el orden incorrecto.

El algoritmo recibe su nombre porque los elementos más pequeños "burbujean" hacia la parte superior de la lista con cada pasada.

Cómo funciona:
1. Compara cada par de elementos adyacentes
2. Intercámbialos si el elemento izquierdo es mayor
3. Después de cada pasada, el elemento más grande no ordenado queda en su posición final
4. Repite hasta que no se necesiten más intercambios

Complejidad Temporal:
  Mejor:    O(n) — ya ordenado
  Promedio: O(n²)
  Peor:     O(n²)

Complejidad Espacial: O(1) — in-place

Propiedades:
  - Ordenamiento estable
  - Adaptativo
  - In-place

Se usa principalmente con fines educativos. En producción, es preferible Quick Sort o Merge Sort.`,
}

export default descriptions
