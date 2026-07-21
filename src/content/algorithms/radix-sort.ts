import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Radix Sort

Radix Sort sorts numbers digit by digit, from the least significant digit to the most significant (LSD Radix Sort). It uses a stable sort (like Counting Sort) as a subroutine.

How it works:
1. Find the maximum number to determine the number of digits
2. For each digit position (ones, tens, hundreds, ...):
   a. Sort the array based on the current digit using a stable sort
3. After processing all digits, the array is sorted

Time Complexity:
  Best:    O(d × (n + k))
  Average: O(d × (n + k))
  Worst:   O(d × (n + k))
  where d = number of digits, k = base (10 for decimal)

Space Complexity: O(n + k)

Properties:
  - Stable sort
  - Not in-place
  - Not comparison-based
  - Efficient for integers and strings

Radix Sort can outperform comparison-based sorts when the number of digits is small relative to log(n).`,
  es: `Radix Sort (Ordenamiento por Base)

Radix Sort ordena números dígito a dígito, desde el dígito menos significativo al más significativo (LSD Radix Sort). Usa un ordenamiento estable (como Counting Sort) como subrutina.

Cómo funciona:
1. Encontrar el número máximo para determinar la cantidad de dígitos
2. Para cada posición de dígito (unidades, decenas, centenas, ...):
   a. Ordenar el arreglo basándose en el dígito actual usando un ordenamiento estable
3. Después de procesar todos los dígitos, el arreglo está ordenado

Complejidad Temporal:
  Mejor:    O(d × (n + k))
  Promedio: O(d × (n + k))
  Peor:     O(d × (n + k))
  donde d = número de dígitos, k = base (10 para decimal)

Complejidad Espacial: O(n + k)

Propiedades:
  - Ordenamiento estable
  - No es in-place
  - No basado en comparaciones
  - Eficiente para enteros y cadenas

Radix Sort puede superar a los ordenamientos basados en comparaciones cuando el número de dígitos es pequeño respecto a log(n).`,
}

export default descriptions
