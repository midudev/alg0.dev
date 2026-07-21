import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Insertion Sort

Insertion Sort builds the sorted array one element at a time. It picks each element and inserts it into its correct position in the already-sorted portion of the array.

How it works:
1. Start from the second element (first element is trivially sorted)
2. Pick the current element as the "key"
3. Compare the key with elements in the sorted portion
4. Shift larger elements to the right
5. Insert the key into its correct position

Time Complexity:
  Best:    O(n) — already sorted
  Average: O(n²)
  Worst:   O(n²) — reverse sorted

Space Complexity: O(1) — in-place

Properties:
  - Stable sort
  - Adaptive (efficient for nearly sorted data)
  - In-place
  - Online (can sort as data is received)

Excellent for small datasets or nearly sorted data. Often used as the base case in hybrid sorting algorithms like Timsort.`,
  es: `Insertion Sort (Ordenamiento por Inserción)

Insertion Sort construye el arreglo ordenado un elemento a la vez. Toma cada elemento y lo inserta en su posición correcta dentro de la porción ya ordenada del arreglo.

Cómo funciona:
1. Comienza desde el segundo elemento (el primero se considera trivialmente ordenado)
2. Toma el elemento actual como "clave"
3. Compara la clave con los elementos de la porción ordenada
4. Desplaza los elementos mayores hacia la derecha
5. Inserta la clave en su posición correcta

Complejidad Temporal:
  Mejor:    O(n) — ya ordenado
  Promedio: O(n²)
  Peor:     O(n²) — ordenado inversamente

Complejidad Espacial: O(1) — in-place

Propiedades:
  - Ordenamiento estable
  - Adaptativo (eficiente para datos casi ordenados)
  - In-place
  - Online (puede ordenar datos a medida que se reciben)

Excelente para conjuntos pequeños o datos casi ordenados. Frecuentemente usado como caso base en algoritmos de ordenamiento híbridos como Timsort.`,
}

export default descriptions
