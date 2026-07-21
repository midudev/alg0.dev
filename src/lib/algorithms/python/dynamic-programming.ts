import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const dynamicProgrammingPython: Record<string, CodeImplementation> = {
  'fibonacci-dp': annotated(`def fibonacci(n):  #@1
    dp = [0] * (n + 1)
    dp[1] = 1

    for i in range(2, n + 1):  #@5
        dp[i] = dp[i - 1] + dp[i - 2]

    return dp  #@8`),

  knapsack: annotated(`def knapsack(weights, values, capacity):  #@1
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i - 1] <= w:
                dp[i][w] = max(  #@9
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                )
            else:
                dp[i][w] = dp[i - 1][w]  #@14

    return dp[n][capacity]  #@20`),

  lcs: annotated(`def lcs(str1, str2):  #@1
    m = len(str1)
    n = len(str2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if str1[i - 1] == str2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1  #@10
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])  #@12

    return dp[m][n]  #@18`),
}
