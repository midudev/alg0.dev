import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Greedy vs Dynamic Programming

Both Greedy and DP solve optimization problems, but they differ fundamentally:

Greedy:
  - Makes the locally optimal choice at each step
  - Fast: usually O(n log n) or O(n)
  - Does NOT always find the global optimum
  - Works when the "greedy choice property" holds

Dynamic Programming:
  - Considers ALL possible choices
  - Finds the globally optimal solution — always
  - Slower: usually O(n × m) time and space
  - Works for problems with overlapping subproblems

Example — Coin Change with coins [1, 4, 6], amount 8:
  Greedy picks 6+1+1 = 3 coins (suboptimal!)
  DP finds 4+4 = 2 coins (optimal!)`,
  es: `Greedy vs Programación Dinámica

Tanto Greedy como DP resuelven problemas de optimización, pero difieren fundamentalmente:

Greedy (Voraz):
  - Elige la opción localmente óptima en cada paso
  - Rápido: generalmente O(n log n) u O(n)
  - NO siempre encuentra el óptimo global
  - Funciona cuando se cumple la "propiedad de elección voraz"

Programación Dinámica:
  - Considera TODAS las opciones posibles
  - Encuentra la solución globalmente óptima — siempre
  - Más lento: generalmente O(n × m) en tiempo y espacio
  - Funciona para problemas con subproblemas superpuestos

Ejemplo — Cambio de monedas con [1, 4, 6], cantidad 8:
  Greedy elige 6+1+1 = 3 monedas (¡subóptimo!)
  DP encuentra 4+4 = 2 monedas (¡óptimo!)`,
}

export default descriptions
