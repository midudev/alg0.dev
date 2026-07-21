import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Fibonacci (Dynamic Programming)

The Fibonacci sequence is a classic example of dynamic programming. Each number is the sum of the two preceding ones: F(n) = F(n-1) + F(n-2).

How it works (Bottom-Up Tabulation):
1. Create a table to store computed values
2. Set base cases: F(0) = 0, F(1) = 1
3. Fill the table iteratively: F(i) = F(i-1) + F(i-2)
4. Return F(n)

Time Complexity: O(n)
Space Complexity: O(n) — can be optimized to O(1)

Comparison:
  - Naive recursion: O(2^n) — exponential
  - Memoization (top-down): O(n)
  - Tabulation (bottom-up): O(n)

Dynamic Programming avoids redundant computation by storing previously computed results. Fibonacci is the simplest illustration of this technique.`,
  es: `Fibonacci (Programación Dinámica)

La secuencia de Fibonacci es un ejemplo clásico de programación dinámica. Cada número es la suma de los dos anteriores: F(n) = F(n-1) + F(n-2).

Cómo funciona (Tabulación Bottom-Up):
1. Crear una tabla para almacenar valores calculados
2. Establecer casos base: F(0) = 0, F(1) = 1
3. Llenar la tabla iterativamente: F(i) = F(i-1) + F(i-2)
4. Retornar F(n)

Complejidad Temporal: O(n)
Complejidad Espacial: O(n) — optimizable a O(1)

Comparación:
  - Recursión ingenua: O(2^n) — exponencial
  - Memoización (top-down): O(n)
  - Tabulación (bottom-up): O(n)

La Programación Dinámica evita cálculos redundantes almacenando resultados previamente computados. Fibonacci es la ilustración más simple de esta técnica.`,
}

export default descriptions
