import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Interpolation Search

Interpolation Search is an improved variant of Binary Search for uniformly distributed sorted data. Instead of always going to the middle, it estimates the position of the target based on its value.

How it works:
1. Estimate position: pos = low + ((target - arr[low]) × (high - low)) / (arr[high] - arr[low])
2. If arr[pos] equals target, return pos
3. If arr[pos] < target, search right portion
4. If arr[pos] > target, search left portion

Time Complexity:
  Best:    O(1)
  Average: O(log log n) — for uniform distribution
  Worst:   O(n) — for non-uniform distribution

Space Complexity: O(1)

Properties:
  - Requires sorted array
  - Best for uniformly distributed data
  - Can degrade to O(n) for skewed distributions

Interpolation Search can be significantly faster than Binary Search when data is uniformly distributed, as it makes better guesses about where the target might be.`,
  es: `Interpolation Search (Búsqueda por Interpolación)

Interpolation Search es una variante mejorada de Binary Search para datos ordenados uniformemente distribuidos. En lugar de ir siempre al medio, estima la posición del objetivo basándose en su valor.

Cómo funciona:
1. Estimar posición: pos = low + ((objetivo - arr[low]) × (high - low)) / (arr[high] - arr[low])
2. Si arr[pos] es igual al objetivo, retornar pos
3. Si arr[pos] < objetivo, buscar en la porción derecha
4. Si arr[pos] > objetivo, buscar en la porción izquierda

Complejidad Temporal:
  Mejor:    O(1)
  Promedio: O(log log n) — para distribución uniforme
  Peor:     O(n) — para distribución no uniforme

Complejidad Espacial: O(1)

Propiedades:
  - Requiere arreglo ordenado
  - Mejor para datos uniformemente distribuidos
  - Puede degradarse a O(n) para distribuciones sesgadas

Interpolation Search puede ser significativamente más rápida que Binary Search cuando los datos están uniformemente distribuidos, ya que hace mejores estimaciones sobre dónde podría estar el objetivo.`,
}

export default descriptions
