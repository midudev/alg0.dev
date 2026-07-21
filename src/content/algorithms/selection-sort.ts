import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Selection Sort

Selection Sort divides the array into a sorted and unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region.

How it works:
1. Find the minimum element in the unsorted portion
2. Swap it with the first unsorted element
3. Move the boundary between sorted and unsorted one element to the right
4. Repeat until the entire array is sorted

Time Complexity:
  Best:    O(n²)
  Average: O(n²)
  Worst:   O(n²)

Space Complexity: O(1) — in-place

Properties:
  - Not stable (can change relative order of equal elements)
  - Not adaptive
  - In-place
  - Minimizes the number of swaps: O(n)

Useful when memory writes are expensive, as it performs at most O(n) swaps.`,
  es: `Selection Sort (Ordenamiento por Selección)

Selection Sort divide el arreglo en una región ordenada y otra sin ordenar. Selecciona repetidamente el elemento más pequeño de la región sin ordenar y lo mueve al final de la región ordenada.

Cómo funciona:
1. Encuentra el elemento mínimo en la porción sin ordenar
2. Intercámbialo con el primer elemento sin ordenar
3. Mueve el límite entre ordenado y sin ordenar un elemento a la derecha
4. Repite hasta que todo el arreglo esté ordenado

Complejidad Temporal:
  Mejor:    O(n²)
  Promedio: O(n²)
  Peor:     O(n²)

Complejidad Espacial: O(1) — in-place

Propiedades:
  - No es estable (puede cambiar el orden relativo de elementos iguales)
  - No es adaptativo
  - In-place
  - Minimiza el número de intercambios: O(n)

Útil cuando las escrituras en memoria son costosas, ya que realiza como máximo O(n) intercambios.`,
}

export default descriptions
