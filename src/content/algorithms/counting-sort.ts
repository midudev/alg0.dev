import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Counting Sort

Counting Sort is a non-comparison-based sorting algorithm. It counts the occurrences of each value and uses arithmetic to determine positions.

How it works:
1. Find the range of input values (min to max)
2. Create a count array to store frequency of each value
3. Modify count array to store cumulative counts
4. Build the output array by placing elements at their correct positions

Time Complexity:
  Best:    O(n + k)
  Average: O(n + k)
  Worst:   O(n + k)
  where k is the range of input values

Space Complexity: O(n + k)

Properties:
  - Stable sort
  - Not in-place
  - Not comparison-based
  - Very efficient when k is small relative to n

Counting Sort is ideal for sorting integers within a known, small range. It's used as a subroutine in Radix Sort.`,
  es: `Counting Sort (Ordenamiento por Conteo)

Counting Sort es un algoritmo de ordenamiento no basado en comparaciones. Cuenta las ocurrencias de cada valor y usa aritmética para determinar posiciones.

Cómo funciona:
1. Encontrar el rango de valores de entrada (mín a máx)
2. Crear un arreglo de conteo para almacenar la frecuencia de cada valor
3. Modificar el arreglo de conteo para almacenar conteos acumulados
4. Construir el arreglo de salida colocando elementos en sus posiciones correctas

Complejidad Temporal:
  Mejor:    O(n + k)
  Promedio: O(n + k)
  Peor:     O(n + k)
  donde k es el rango de valores de entrada

Complejidad Espacial: O(n + k)

Propiedades:
  - Ordenamiento estable
  - No es in-place
  - No basado en comparaciones
  - Muy eficiente cuando k es pequeño respecto a n

Counting Sort es ideal para ordenar enteros dentro de un rango conocido y pequeño. Se usa como subrutina en Radix Sort.`,
}

export default descriptions
