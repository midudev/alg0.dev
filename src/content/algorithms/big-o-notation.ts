import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Big O Notation

Big O Notation describes how an algorithm's running time or space requirements grow relative to the input size. It focuses on the worst-case scenario and ignores constants and lower-order terms.

Common complexities (fastest to slowest):
  O(1)       — Constant: same time regardless of input size
  O(log n)   — Logarithmic: halves the problem each step (binary search)
  O(n)       — Linear: processes each element once
  O(n log n) — Linearithmic: efficient sorting (Merge Sort, Quick Sort)
  O(n²)      — Quadratic: nested loops (Bubble Sort, brute force)
  O(2^n)     — Exponential: doubles with each new element
  O(n!)      — Factorial: all permutations

Why it matters:
  For n = 1,000: O(n) = 1,000 operations, O(n²) = 1,000,000 operations
  Choosing the right algorithm can mean seconds vs. hours of computation.

Rules of Big O:
  1. Drop constants: O(2n) → O(n)
  2. Drop lower-order terms: O(n² + n) → O(n²)
  3. Focus on the dominant term as n grows large`,
  es: `Notación Big O

La Notación Big O describe cómo el tiempo de ejecución o los requisitos de espacio de un algoritmo crecen en relación al tamaño de la entrada. Se enfoca en el peor caso e ignora constantes y términos de menor orden.

Complejidades comunes (de más rápida a más lenta):
  O(1)       — Constante: mismo tiempo sin importar el tamaño de entrada
  O(log n)   — Logarítmica: divide el problema a la mitad en cada paso (búsqueda binaria)
  O(n)       — Lineal: procesa cada elemento una vez
  O(n log n) — Linearítmica: ordenamiento eficiente (Merge Sort, Quick Sort)
  O(n²)      — Cuadrática: bucles anidados (Bubble Sort, fuerza bruta)
  O(2^n)     — Exponencial: se duplica con cada nuevo elemento
  O(n!)      — Factorial: todas las permutaciones

Por qué importa:
  Para n = 1.000: O(n) = 1.000 operaciones, O(n²) = 1.000.000 operaciones
  Elegir el algoritmo correcto puede significar segundos vs. horas de cómputo.

Reglas de Big O:
  1. Eliminar constantes: O(2n) → O(n)
  2. Eliminar términos de menor orden: O(n² + n) → O(n²)
  3. Enfocarse en el término dominante cuando n crece`,
}

export default descriptions
