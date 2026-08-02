import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Binary Exponentiation

Binary Exponentiation computes aⁿ in O(log n) time by halving the exponent at each step instead of multiplying a by itself n times.

How it works:
1. Base case: a⁰ = 1
2. Recursively compute half = binPow(base, floor(exp / 2))
3. If exp is even, return half × half
4. If exp is odd, return half × half × base

Why it is fast:
  Each recursive call cuts the exponent in half, so the recursion depth is proportional to log₂ n instead of n.

Time Complexity:
  Best:    O(1)
  Average: O(log n)
  Worst:   O(log n)

Space Complexity: O(log n) for the recursive call stack

Applications:
  - Modular exponentiation in cryptography
  - Fast matrix exponentiation
  - Competitive programming and number theory

The key insight is that powers can be reused: once you know a^(n/2), you can square it to recover most of the work immediately.`,
  es: `Exponenciación Binaria

La Exponenciación Binaria calcula aⁿ en O(log n) dividiendo el exponente a la mitad en cada paso, en lugar de multiplicar a por sí mismo n veces.

Cómo funciona:
1. Caso base: a⁰ = 1
2. Calcular recursivamente half = binPow(base, floor(exp / 2))
3. Si exp es par, retornar half × half
4. Si exp es impar, retornar half × half × base

Por qué es rápida:
  Cada llamada recursiva corta el exponente a la mitad, así que la profundidad de la recursión es proporcional a log₂ n en vez de n.

Complejidad Temporal:
  Mejor:    O(1)
  Promedio: O(log n)
  Peor:     O(log n)

Complejidad Espacial: O(log n) por la pila de llamadas recursivas

Aplicaciones:
  - Exponenciación modular en criptografía
  - Exponenciación rápida de matrices
  - Programación competitiva y teoría de números

La idea clave es reutilizar potencias: una vez que conoces a^(n/2), puedes elevarlo al cuadrado y recuperar la mayor parte del trabajo inmediatamente.`,
}

export default descriptions
