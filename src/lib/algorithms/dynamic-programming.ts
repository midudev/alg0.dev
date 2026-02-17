import type { Algorithm, Step, HighlightType } from '@lib/types'
import { d } from '@lib/algorithms/shared'

// ============================================================
// FIBONACCI DP
// ============================================================
const fibonacciDp: Algorithm = {
  id: 'fibonacci-dp',
  name: 'Fibonacci DP',
  category: 'Dynamic Programming',
  difficulty: 'intermediate',
  visualization: 'array',
  code: `function fibonacci(n) {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp;
}`,
  description: `Fibonacci DP (Bottom-Up Tabulation)

The Fibonacci sequence is one of the most classic examples of Dynamic Programming. Each number is the sum of the two preceding ones: F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2).

How it works (Bottom-Up Tabulation):
1. Create an array dp of size n+1, initialize dp[0]=0, dp[1]=1
2. For each i from 2 to n, compute dp[i] = dp[i-1] + dp[i-2]
3. Each subproblem is solved exactly once and stored

Time Complexity: O(n)
Space Complexity: O(n)

This approach avoids the exponential time of naive recursion by storing previously computed values. It demonstrates the core DP principle: solve smaller subproblems first and build up to the answer.`,

  generateSteps(locale = 'en') {
    const n = 10
    const arr = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const steps: Step[] = []
    const sorted: number[] = [0, 1]

    steps.push({
      array: [...arr],
      highlights: { 0: 'sorted', 1: 'sorted' },
      sorted: [0, 1],
      description: d(locale, 'Initial array: dp[0]=0, dp[1]=1. Fill remaining using dp[i] = dp[i-1] + dp[i-2].', 'Arreglo inicial: dp[0]=0, dp[1]=1. Rellenar usando dp[i] = dp[i-1] + dp[i-2].'),
      codeLine: 1,
      variables: { n, 'dp[0]': 0, 'dp[1]': 1 },
    })

    for (let i = 2; i <= n; i++) {
      steps.push({
        array: [...arr],
        highlights: { [i - 1]: 'comparing', [i - 2]: 'comparing', [i]: 'current' },
        sorted: [...sorted],
        description: d(locale, `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${arr[i - 1]} + ${arr[i - 2]}`, `Calculando dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${arr[i - 1]} + ${arr[i - 2]}`),
        codeLine: 5,
        variables: { i, 'dp[i-1]': arr[i - 1], 'dp[i-2]': arr[i - 2] },
      })

      arr[i] = arr[i - 1] + arr[i - 2]
      sorted.push(i)

      steps.push({
        array: [...arr],
        highlights: { [i]: 'sorted' },
        sorted: [...sorted],
        description: d(locale, `dp[${i}] = ${arr[i]}`, `dp[${i}] = ${arr[i]}`),
        codeLine: 5,
        variables: { i, 'dp[i]': arr[i] },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n + 1 }, (_, i) => i),
      description: d(locale, `Fibonacci sequence complete! F(${n}) = ${arr[n]}`, `¡Secuencia de Fibonacci completa! F(${n}) = ${arr[n]}`),
      codeLine: 8,
      variables: { n, 'F(n)': arr[n], dp: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// KNAPSACK 0/1
// ============================================================
const knapsack: Algorithm = {
  id: 'knapsack',
  name: 'Knapsack 0/1',
  category: 'Dynamic Programming',
  difficulty: 'advanced',
  visualization: 'matrix',
  code: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}`,
  description: `Knapsack 0/1

The 0/1 Knapsack problem: given items with weights and values, and a knapsack with a weight capacity, find the maximum value that can be carried. Each item can either be taken (1) or left (0).

How it works:
1. Create a DP table of (n+1) rows × (capacity+1) columns
2. dp[i][w] = maximum value using first i items with capacity w
3. For each item, either skip it (dp[i-1][w]) or take it (dp[i-1][w-weight] + value)
4. Choose the maximum of both options

Items: weights=[2, 3, 4, 5], values=[3, 4, 5, 6], capacity=8

Time Complexity: O(n × W) where n = items, W = capacity
Space Complexity: O(n × W)

Classic DP optimization problem used in resource allocation, budgeting, and cargo loading.`,

  generateSteps(locale = 'en') {
    const weights = [2, 3, 4, 5]
    const values = [3, 4, 5, 6]
    const capacity = 8
    const n = weights.length
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0))
    const steps: Step[] = []

    steps.push({
      matrix: {
        rows: n + 1,
        cols: capacity + 1,
        values: dp.map((r) => [...r]),
        highlights: {},
      },
      description: d(locale, 'DP table initialized to 0. Rows = items (0..4), Cols = capacity (0..8).', 'Tabla DP inicializada en 0. Filas = artículos (0..4), Columnas = capacidad (0..8).'),
      codeLine: 1,
      variables: { weights: '[2,3,4,5]', values: '[3,4,5,6]', capacity },
    })

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const h: Record<string, HighlightType> = {}
        h[`${i},${w}`] = 'current'

        if (weights[i - 1] <= w) {
          const skip = dp[i - 1][w]
          const take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
          h[`${i - 1},${w}`] = 'comparing'
          h[`${i - 1},${w - weights[i - 1]}`] = 'comparing'
          dp[i][w] = Math.max(skip, take)

          steps.push({
            matrix: {
              rows: n + 1,
              cols: capacity + 1,
              values: dp.map((r) => [...r]),
              highlights: h,
            },
            description: d(locale, `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}), cap=${w}: max(skip=${skip}, take=${take}) = ${dp[i][w]}`, `Artículo ${i} (p=${weights[i - 1]}, v=${values[i - 1]}), cap=${w}: max(omitir=${skip}, tomar=${take}) = ${dp[i][w]}`),
            codeLine: 9,
            variables: { i, w, skip, take, 'dp[i][w]': dp[i][w] },
          })
        } else {
          dp[i][w] = dp[i - 1][w]
          h[`${i - 1},${w}`] = 'comparing'

          steps.push({
            matrix: {
              rows: n + 1,
              cols: capacity + 1,
              values: dp.map((r) => [...r]),
              highlights: h,
            },
            description: d(locale, `Item ${i} (w=${weights[i - 1]}) too heavy for cap=${w}. dp[${i}][${w}] = ${dp[i][w]}`, `Artículo ${i} (p=${weights[i - 1]}) muy pesado para cap=${w}. dp[${i}][${w}] = ${dp[i][w]}`),
            codeLine: 14,
            variables: { i, w, weight: weights[i - 1], 'dp[i][w]': dp[i][w] },
          })
        }
      }
    }

    const finalH: Record<string, HighlightType> = {}
    finalH[`${n},${capacity}`] = 'found'
    steps.push({
      matrix: {
        rows: n + 1,
        cols: capacity + 1,
        values: dp.map((r) => [...r]),
        highlights: finalH,
      },
      description: d(locale, `Knapsack complete! Maximum value: ${dp[n][capacity]}`, `¡Mochila completada! Valor máximo: ${dp[n][capacity]}`),
      codeLine: 20,
      variables: { max_value: dp[n][capacity] },
    })

    return steps
  },
}

// ============================================================
// LCS - LONGEST COMMON SUBSEQUENCE
// ============================================================
const lcs: Algorithm = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  category: 'Dynamic Programming',
  difficulty: 'advanced',
  visualization: 'matrix',
  code: `function lcs(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
  description: `Longest Common Subsequence (LCS)

The LCS problem finds the longest subsequence common to two sequences. A subsequence appears in the same relative order but not necessarily contiguously.

How it works:
1. Create a DP table of (m+1) × (n+1) where m, n are string lengths
2. If characters match: dp[i][j] = dp[i-1][j-1] + 1
3. If they don't: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. The answer is in dp[m][n]

Strings: "ABCB" and "BDCB"

Time Complexity: O(m × n)
Space Complexity: O(m × n)

Used in diff tools, DNA sequence alignment, version control systems, and spell checking.`,

  generateSteps(locale = 'en') {
    const str1 = 'ABCB'
    const str2 = 'BDCB'
    const m = str1.length
    const n = str2.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    const steps: Step[] = []

    steps.push({
      matrix: {
        rows: m + 1,
        cols: n + 1,
        values: dp.map((r) => [...r]),
        highlights: {},
      },
      description: d(locale, `DP table initialized. Comparing "${str1}" (rows) with "${str2}" (cols).`, `Tabla DP inicializada. Comparando "${str1}" (filas) con "${str2}" (columnas).`),
      codeLine: 1,
      variables: { str1, str2, m, n },
    })

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const h: Record<string, HighlightType> = {}
        h[`${i},${j}`] = 'current'

        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
          h[`${i - 1},${j - 1}`] = 'comparing'

          steps.push({
            matrix: {
              rows: m + 1,
              cols: n + 1,
              values: dp.map((r) => [...r]),
              highlights: { ...h, [`${i},${j}`]: 'found' },
            },
            description: d(locale, `'${str1[i - 1]}' = '${str2[j - 1]}' — Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`, `'${str1[i - 1]}' = '${str2[j - 1]}' — ¡Coincidencia! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`),
            codeLine: 10,
            variables: { i, j, char1: str1[i - 1], char2: str2[j - 1], 'dp[i][j]': dp[i][j] },
          })
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          h[`${i - 1},${j}`] = 'comparing'
          h[`${i},${j - 1}`] = 'comparing'

          steps.push({
            matrix: {
              rows: m + 1,
              cols: n + 1,
              values: dp.map((r) => [...r]),
              highlights: h,
            },
            description: d(locale, `'${str1[i - 1]}' ≠ '${str2[j - 1]}' — dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`, `'${str1[i - 1]}' ≠ '${str2[j - 1]}' — dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`),
            codeLine: 12,
            variables: { i, j, char1: str1[i - 1], char2: str2[j - 1], 'dp[i][j]': dp[i][j] },
          })
        }
      }
    }

    const finalH: Record<string, HighlightType> = {}
    finalH[`${m},${n}`] = 'found'
    steps.push({
      matrix: {
        rows: m + 1,
        cols: n + 1,
        values: dp.map((r) => [...r]),
        highlights: finalH,
      },
      description: d(locale, `LCS complete! Length of longest common subsequence: ${dp[m][n]}`, `¡LCS completado! Longitud de la subsecuencia común más larga: ${dp[m][n]}`),
      codeLine: 18,
      variables: { LCS_length: dp[m][n] },
    })

    return steps
  },
}

export { fibonacciDp, knapsack, lcs }
