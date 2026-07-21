import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Heap Sort

Heap Sort uses a binary heap data structure to sort elements. It first builds a max-heap from the array, then repeatedly extracts the maximum element.

How it works:
1. Build a max-heap from the input array
2. The largest element is now at the root (index 0)
3. Swap it with the last element, reduce heap size
4. Heapify the root to restore the max-heap property
5. Repeat until the heap is empty

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(1) — in-place

Properties:
  - Not stable
  - In-place
  - Guaranteed O(n log n) performance

Heap Sort combines the best of Merge Sort (guaranteed O(n log n)) and Quick Sort (in-place). Useful when worst-case performance matters.`,
  es: `Heap Sort (Ordenamiento por Montículo)

Heap Sort utiliza una estructura de datos de montículo binario (heap) para ordenar elementos. Primero construye un max-heap del arreglo y luego extrae repetidamente el elemento máximo.

Cómo funciona:
1. Construir un max-heap a partir del arreglo
2. El elemento más grande está ahora en la raíz (índice 0)
3. Intercambiarlo con el último elemento, reducir el tamaño del heap
4. Aplicar heapify a la raíz para restaurar la propiedad del max-heap
5. Repetir hasta que el heap esté vacío

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n log n)
  Peor:     O(n log n)

Complejidad Espacial: O(1) — in-place

Propiedades:
  - No es estable
  - In-place
  - Rendimiento garantizado O(n log n)

Heap Sort combina lo mejor de Merge Sort (O(n log n) garantizado) y Quick Sort (in-place). Útil cuando el rendimiento en el peor caso importa.`,
}

export default descriptions
