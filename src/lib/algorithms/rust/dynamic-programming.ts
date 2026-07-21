import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const dynamicProgrammingRust: Record<string, CodeImplementation> = {
  'fibonacci-dp': annotated(`fn fibonacci(n: usize) -> Vec<u64> {  //@1
    let mut dp = vec![0; n + 1];
    dp[1] = 1;

    for i in 2..=n {  //@5
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    dp  //@8
}`),

  knapsack:
    annotated(`fn knapsack(weights: &[usize], values: &[i32], capacity: usize) -> i32 {  //@1
    let n = weights.len();
    let mut dp = vec![vec![0; capacity + 1]; n + 1];

    for i in 1..=n {
        for w in 0..=capacity {
            if weights[i - 1] <= w {
                dp[i][w] = std::cmp::max(  //@9
                    dp[i - 1][w],
                    dp[i - 1][w - weights[i - 1]] + values[i - 1],
                );
            } else {
                dp[i][w] = dp[i - 1][w];  //@14
            }
        }
    }

    dp[n][capacity]  //@20
}`),

  lcs: annotated(`fn lcs(str1: &str, str2: &str) -> usize {  //@1
    let a: Vec<char> = str1.chars().collect();
    let b: Vec<char> = str2.chars().collect();
    let m = a.len();
    let n = b.len();
    let mut dp = vec![vec![0; n + 1]; m + 1];

    for i in 1..=m {
        for j in 1..=n {
            if a[i - 1] == b[j - 1] {
                dp[i][j] = dp[i - 1][j - 1] + 1;  //@10
            } else {
                dp[i][j] = std::cmp::max(dp[i - 1][j], dp[i][j - 1]);  //@12
            }
        }
    }

    dp[m][n]  //@18
}`),
}
