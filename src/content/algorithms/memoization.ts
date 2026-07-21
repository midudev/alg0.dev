import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Memoization

Memoization is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

Without memoization (Fibonacci):
  fib(5) calls fib(4) + fib(3)
  fib(4) calls fib(3) + fib(2) — fib(3) computed AGAIN!
  Exponential: O(2^n) time

With memoization:
  Each value is computed ONCE and cached
  Subsequent calls with the same input return instantly
  Linear: O(n) time, O(n) space

Key insight: trade space for time
  - Store results in a dictionary/array
  - Before computing, check if result exists
  - Dramatic speedup for overlapping subproblems`,
  es: `Memoización

La memoización es una técnica de optimización que almacena los resultados de llamadas a funciones costosas y devuelve el resultado cacheado cuando se repiten las mismas entradas.

Sin memoización (Fibonacci):
  fib(5) llama a fib(4) + fib(3)
  fib(4) llama a fib(3) + fib(2) — ¡fib(3) se calcula OTRA VEZ!
  Exponencial: O(2^n) tiempo

Con memoización:
  Cada valor se calcula UNA SOLA VEZ y se cachea
  Llamadas posteriores con la misma entrada retornan al instante
  Lineal: O(n) tiempo, O(n) espacio

Idea clave: intercambiar espacio por tiempo
  - Almacenar resultados en un diccionario/arreglo
  - Antes de calcular, verificar si el resultado ya existe
  - Aceleración drástica para subproblemas superpuestos`,
}

export default descriptions
