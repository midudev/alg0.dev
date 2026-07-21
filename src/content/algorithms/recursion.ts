import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Recursion

Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. It's one of the most powerful concepts in computer science.

Every recursive function needs two parts:
  1. Base case — the condition that stops the recursion
  2. Recursive case — the function calls itself with a smaller input

How the call stack works:
  - Each function call is pushed onto the call stack
  - When a base case is reached, results propagate back up
  - The stack unwinds as each call returns its result

Common patterns:
  - Factorial: n! = n × (n-1)!
  - Fibonacci: F(n) = F(n-1) + F(n-2)
  - Tree traversals: process node, then recurse on children
  - Divide and conquer: split problem, solve halves, combine

Pitfalls:
  - Stack overflow: too many recursive calls exhaust memory
  - Redundant computation: naive recursion can be exponential
  - Solution: use memoization or convert to iteration

Recursive algorithms in this visualizer:
  Quick Sort, Merge Sort, DFS, N-Queens, Sudoku Solver, Tower of Hanoi`,
  es: `Recursión

La recursión es una técnica de programación donde una función se llama a sí misma para resolver instancias más pequeñas del mismo problema. Es uno de los conceptos más poderosos en las ciencias de la computación.

Toda función recursiva necesita dos partes:
  1. Caso base — la condición que detiene la recursión
  2. Caso recursivo — la función se llama con una entrada más pequeña

Cómo funciona la pila de llamadas:
  - Cada llamada a función se apila en la pila de llamadas
  - Cuando se alcanza un caso base, los resultados se propagan hacia arriba
  - La pila se desenrolla a medida que cada llamada retorna su resultado

Patrones comunes:
  - Factorial: n! = n × (n-1)!
  - Fibonacci: F(n) = F(n-1) + F(n-2)
  - Recorridos de árboles: procesar nodo, luego recurrir en hijos
  - Divide y vencerás: dividir problema, resolver mitades, combinar

Errores comunes:
  - Desbordamiento de pila: demasiadas llamadas recursivas agotan la memoria
  - Cálculos redundantes: la recursión ingenua puede ser exponencial
  - Solución: usar memoización o convertir a iteración

Algoritmos recursivos en este visualizador:
  Quick Sort, Merge Sort, DFS, N-Queens, Sudoku Solver, Torre de Hanoi`,
}

export default descriptions
