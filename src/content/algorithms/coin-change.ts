import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Coin Change (Minimum Coins)

The Coin Change Problem: given coin denominations and a target amount, find the fewest coins needed to make up that amount. If the amount cannot be formed, return -1. Each coin may be used unlimited times.

How it works (Bottom-Up DP):
1. Create a 1D table: dp[a] = minimum coins to make amount a
2. Base case: dp[0] = 0 (zero coins make amount 0)
3. For each amount a from 1 to amount, try every coin c ≤ a:
   - Using coin c leaves subproblem dp[a - c], so candidate = dp[a - c] + 1
   - Take the minimum: dp[a] = min over all coins of (dp[a - c] + 1)
4. dp[amount] contains the minimum number of coins

Time Complexity: O(amount × n) — pseudo-polynomial
Space Complexity: O(amount)

Applications:
  - Making change / cash registers
  - Currency systems
  - Unbounded knapsack variants
  - Resource scheduling

Coin Change is a classic unbounded (complete) knapsack and the canonical greedy-vs-DP example: the Greedy choice (taking the largest coin first) is not always optimal, so DP guarantees the minimum.`,
  es: `Cambio de Monedas (Mínimo de Monedas)

El Problema de Cambio de Monedas: dadas las denominaciones de monedas y una cantidad objetivo, encontrar el menor número de monedas necesarias para formar esa cantidad. Si la cantidad no puede formarse, devolver -1. Cada moneda puede usarse un número ilimitado de veces.

Cómo funciona (DP Bottom-Up):
1. Crear una tabla 1D: dp[a] = mínimo de monedas para formar la cantidad a
2. Caso base: dp[0] = 0 (cero monedas para la cantidad 0)
3. Para cada cantidad a de 1 a amount, probar cada moneda c ≤ a:
   - Usar la moneda c deja el subproblema dp[a - c], así que candidato = dp[a - c] + 1
   - Tomar el mínimo: dp[a] = min sobre todas las monedas de (dp[a - c] + 1)
4. dp[amount] contiene el mínimo de monedas

Complejidad Temporal: O(amount × n) — pseudo-polinomial
Complejidad Espacial: O(amount)

Aplicaciones:
  - Dar cambio / cajas registradoras
  - Sistemas de monedas
  - Variantes de mochila ilimitada
  - Programación de recursos

El Cambio de Monedas es una mochila ilimitada (completa) clásica y el ejemplo canónico de greedy-vs-DP: la elección Greedy (tomar la moneda más grande primero) no siempre es óptima, así que DP garantiza el mínimo.`,
}

export default descriptions
