import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Shell Sort

Shell Sort is a generalization of Insertion Sort that allows the exchange of items that are far apart. It uses a decreasing gap sequence to progressively sort the array.

How it works:
1. Start with a large gap (typically n/2)
2. Perform a gapped insertion sort for the current gap
3. Reduce the gap (typically by half)
4. Repeat until gap is 1 (final pass is a standard insertion sort)

Time Complexity:
  Best:    O(n log n)
  Average: O(n^(3/2)) — depends on gap sequence
  Worst:   O(n²) — with n/2 gap sequence

Space Complexity: O(1) — in-place

Properties:
  - Not stable
  - In-place
  - Adaptive

Shell Sort is faster than Insertion Sort for larger arrays because it moves elements closer to their final position earlier. Performance depends heavily on the gap sequence chosen.`,
  es: `Shell Sort (Ordenamiento Shell)

Shell Sort es una generalización de Insertion Sort que permite el intercambio de elementos que están lejos entre sí. Usa una secuencia de brechas decrecientes para ordenar progresivamente el arreglo.

Cómo funciona:
1. Comenzar con una brecha grande (típicamente n/2)
2. Realizar un insertion sort con brecha para la brecha actual
3. Reducir la brecha (típicamente a la mitad)
4. Repetir hasta que la brecha sea 1 (la pasada final es un insertion sort estándar)

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n^(3/2)) — depende de la secuencia de brechas
  Peor:     O(n²) — con secuencia de brechas n/2

Complejidad Espacial: O(1) — in-place

Propiedades:
  - No es estable
  - In-place
  - Adaptativo

Shell Sort es más rápido que Insertion Sort para arreglos grandes porque mueve elementos más cerca de su posición final antes. El rendimiento depende mucho de la secuencia de brechas elegida.`,
}

export default descriptions
