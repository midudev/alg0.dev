import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Sliding Window

Sliding Window maintains a dynamic range (window) over a sequence, expanding and contracting to solve substring/subarray problems efficiently.

How it works:
1. Expand the window by moving the right pointer
2. If a condition is violated, shrink from the left
3. Track the best result seen so far

Time Complexity: O(n) — each character is visited at most twice
Space Complexity: O(min(n, alphabet))

Classic problems:
  - Longest substring without repeating chars
  - Minimum window substring
  - Maximum sum subarray of size k
  - Longest repeating character replacement`,
  es: `Ventana Deslizante (Sliding Window)

La Ventana Deslizante mantiene un rango dinámico (ventana) sobre una secuencia, expandiéndose y contrayéndose para resolver problemas de subcadenas/subarreglos eficientemente.

Cómo funciona:
1. Expandir la ventana moviendo el puntero derecho
2. Si se viola una condición, contraer desde la izquierda
3. Registrar el mejor resultado encontrado

Complejidad Temporal: O(n) — cada carácter se visita como máximo dos veces
Complejidad Espacial: O(min(n, alfabeto))

Problemas clásicos:
  - Subcadena más larga sin caracteres repetidos
  - Subcadena mínima que contiene todos los caracteres
  - Suma máxima de subarreglo de tamaño k
  - Reemplazo más largo de caracteres repetidos`,
}

export default descriptions
