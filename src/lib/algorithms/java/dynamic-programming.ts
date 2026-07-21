import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const dynamicProgrammingJava: Record<string, CodeImplementation> = {
  'fibonacci-dp': annotated(`int[] fibonacci(int n) {  //@1
    int[] dp = new int[n + 1];
    dp[1] = 1;

    for (int i = 2; i <= n; i++) {  //@5
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp;  //@8
}`),

  knapsack: annotated(`int knapsack(int[] weights, int[] values, int capacity) {  //@1
    int n = weights.length;
    int[][] dp = new int[n + 1][capacity + 1];

    for (int i = 1; i <= n; i++) {
        for (int w = 0; w <= capacity; w++) {
            if (weights[i - 1] <= w) {
                dp[i][w] = Math.max(  //@9
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1]
                );
            } else {
                dp[i][w] = dp[i - 1][w];  //@14
            }
        }
    }

    return dp[n][capacity];  //@20
}`),

  lcs: annotated(`int lcs(String str1, String str2) {  //@1
    int m = str1.length();
    int n = str2.length();
    int[][] dp = new int[m + 1][n + 1];

    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (str1.charAt(i - 1) == str2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;  //@10
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);  //@12
            }
        }
    }

    return dp[m][n];  //@18
}`),
}
