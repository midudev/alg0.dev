import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `0/1 Knapsack Problem

The 0/1 Knapsack Problem: given items with weights and values, and a maximum capacity, find the maximum value that can be carried without exceeding the capacity. Each item can be taken at most once.

How it works (Bottom-Up DP):
1. Create a 2D table: dp[i][w] = max value using first i items with capacity w
2. For each item i and capacity w:
   - If item doesn't fit: dp[i][w] = dp[i-1][w]
   - If item fits: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
3. dp[n][W] contains the optimal value

Time Complexity: O(n × W) — pseudo-polynomial
Space Complexity: O(n × W) — can be optimized to O(W)

Applications:
  - Resource allocation
  - Budget planning
  - Cargo loading
  - Cryptography

The Knapsack Problem is one of the fundamental problems in combinatorial optimization and is NP-hard in general.`,
  es: `Problema de la Mochila 0/1

El Problema de la Mochila 0/1: dados artículos con pesos y valores, y una capacidad máxima, encontrar el valor máximo que se puede transportar sin exceder la capacidad. Cada artículo puede tomarse como máximo una vez.

Cómo funciona (DP Bottom-Up):
1. Crear una tabla 2D: dp[i][w] = valor máximo usando los primeros i artículos con capacidad w
2. Para cada artículo i y capacidad w:
   - Si el artículo no cabe: dp[i][w] = dp[i-1][w]
   - Si cabe: dp[i][w] = max(dp[i-1][w], dp[i-1][w-peso[i]] + valor[i])
3. dp[n][W] contiene el valor óptimo

Complejidad Temporal: O(n × W) — pseudo-polinomial
Complejidad Espacial: O(n × W) — optimizable a O(W)

Aplicaciones:
  - Asignación de recursos
  - Planificación de presupuestos
  - Carga de mercancías
  - Criptografía

El Problema de la Mochila es uno de los problemas fundamentales en optimización combinatoria y es NP-duro en general.`,
}

export default descriptions
