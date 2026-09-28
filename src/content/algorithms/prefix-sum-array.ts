import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Prefix Sum Array

A Prefix Sum Array preprocesses a static array so range-sum queries become O(1). Each position stores the sum of all elements up to that index.

How it works:
1. Build prefix[0] = arr[0]
2. For each next index, add the current value to the previous prefix
3. Answer sum(l, r) with prefix[r] - prefix[l - 1]
4. If l = 0, the answer is just prefix[r]

Time Complexity: O(n) preprocessing, O(1) per query
Space Complexity: O(n)

Best when:
  - The array is static
  - You need many range-sum queries
  - You want to trade one preprocessing pass for instant lookups

Limitation:
  - Point updates are not handled efficiently here; for dynamic updates use other structures such as Fenwick Tree or Segment Tree.`,
  es: `Prefix Sum Array

Un Prefix Sum Array preprocesa un arreglo estático para que las consultas de suma por rango sean O(1). Cada posición guarda la suma de todos los elementos hasta ese índice.

Cómo funciona:
1. Construir prefix[0] = arr[0]
2. Para cada índice siguiente, sumar el valor actual al prefijo anterior
3. Responder sum(l, r) con prefix[r] - prefix[l - 1]
4. Si l = 0, la respuesta es simplemente prefix[r]

Complejidad Temporal: O(n) de preprocesamiento, O(1) por consulta
Complejidad Espacial: O(n)

Conviene cuando:
  - El arreglo es estático
  - Necesitas muchas consultas de suma por rango
  - Quieres cambiar una pasada de preprocesamiento por consultas instantáneas

Limitación:
  - Las actualizaciones puntuales no se manejan eficientemente aquí; para actualizaciones dinámicas hacen falta otras estructuras como Fenwick Tree o Segment Tree.`,
}

export default descriptions
