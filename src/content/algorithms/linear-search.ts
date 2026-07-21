import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Linear Search

Linear Search (or Sequential Search) is the simplest searching algorithm. It checks every element in the list sequentially until the target is found or the list is exhausted.

How it works:
1. Start from the first element
2. Compare each element with the target
3. If a match is found, return the index
4. If the end is reached without a match, return -1

Time Complexity:
  Best:    O(1) — target is the first element
  Average: O(n)
  Worst:   O(n) — target is last or not present

Space Complexity: O(1)

Properties:
  - Works on unsorted arrays
  - No preprocessing needed
  - Simple to implement

Linear Search is useful for small datasets or unsorted data where more efficient algorithms cannot be applied.`,
  es: `Linear Search (Búsqueda Lineal)

Linear Search (o Búsqueda Secuencial) es el algoritmo de búsqueda más simple. Revisa cada elemento de la lista secuencialmente hasta encontrar el objetivo o agotar la lista.

Cómo funciona:
1. Comienza desde el primer elemento
2. Compara cada elemento con el objetivo
3. Si se encuentra una coincidencia, retorna el índice
4. Si se llega al final sin coincidencia, retorna -1

Complejidad Temporal:
  Mejor:    O(1) — el objetivo es el primer elemento
  Promedio: O(n)
  Peor:     O(n) — el objetivo es el último o no está presente

Complejidad Espacial: O(1)

Propiedades:
  - Funciona con arreglos sin ordenar
  - No necesita preprocesamiento
  - Simple de implementar

Linear Search es útil para conjuntos de datos pequeños o datos sin ordenar donde algoritmos más eficientes no pueden aplicarse.`,
}

export default descriptions
