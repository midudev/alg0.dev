import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Jump Search

Jump Search works on sorted arrays by jumping ahead by fixed steps and then performing a linear search within the identified block.

How it works:
1. Calculate the optimal jump size: √n
2. Jump through the array in blocks until finding a block where the target could be
3. Perform a linear search within that block
4. Return the index if found, -1 otherwise

Time Complexity:
  Best:    O(1)
  Average: O(√n)
  Worst:   O(√n)

Space Complexity: O(1)

Properties:
  - Requires sorted array
  - Better than Linear Search, simpler than Binary Search
  - Optimal jump size is √n

Jump Search is useful when jumping back is costly (e.g., in linked lists) compared to Binary Search which requires random access.`,
  es: `Jump Search (Búsqueda por Saltos)

Jump Search funciona en arreglos ordenados saltando hacia adelante en pasos fijos y luego realizando una búsqueda lineal dentro del bloque identificado.

Cómo funciona:
1. Calcular el tamaño óptimo de salto: √n
2. Saltar a través del arreglo en bloques hasta encontrar uno donde podría estar el objetivo
3. Realizar una búsqueda lineal dentro de ese bloque
4. Retornar el índice si se encuentra, -1 en caso contrario

Complejidad Temporal:
  Mejor:    O(1)
  Promedio: O(√n)
  Peor:     O(√n)

Complejidad Espacial: O(1)

Propiedades:
  - Requiere arreglo ordenado
  - Mejor que búsqueda lineal, más simple que búsqueda binaria
  - Tamaño de salto óptimo: √n

Jump Search es útil cuando retroceder es costoso (por ejemplo, en listas enlazadas) comparado con Binary Search que requiere acceso aleatorio.`,
}

export default descriptions
