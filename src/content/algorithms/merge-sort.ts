import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Merge Sort

Merge Sort is a stable, divide-and-conquer sorting algorithm. It divides the array into halves, recursively sorts each half, then merges the sorted halves.

How it works:
1. Divide the array into two halves
2. Recursively sort each half
3. Merge the two sorted halves into a single sorted array
4. The merge step compares elements from both halves and places them in order

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(n) — requires temporary array

Properties:
  - Stable sort
  - Not in-place (requires O(n) extra space)
  - Predictable performance (always O(n log n))
  - Parallelizable

Merge Sort guarantees O(n log n) performance regardless of input. Ideal when stability is required or for sorting linked lists.`,
  es: `Merge Sort (Ordenamiento por Mezcla)

Merge Sort es un algoritmo de ordenamiento estable basado en divide y vencerás. Divide el arreglo en mitades, ordena recursivamente cada mitad y luego mezcla las mitades ordenadas.

Cómo funciona:
1. Divide el arreglo en dos mitades
2. Ordena recursivamente cada mitad
3. Mezcla las dos mitades ordenadas en un solo arreglo ordenado
4. El paso de mezcla compara elementos de ambas mitades y los coloca en orden

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n log n)
  Peor:     O(n log n)

Complejidad Espacial: O(n) — requiere arreglo temporal

Propiedades:
  - Ordenamiento estable
  - No es in-place (requiere O(n) de espacio extra)
  - Rendimiento predecible (siempre O(n log n))
  - Paralelizable

Merge Sort garantiza un rendimiento O(n log n) independientemente de la entrada. Ideal cuando se requiere estabilidad o para ordenar listas enlazadas.`,
}

export default descriptions
