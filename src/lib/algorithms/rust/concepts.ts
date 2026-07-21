import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const conceptsRust: Record<string, CodeImplementation> = {
  'big-o-notation': annotated(`// O(1) — Constant time  //@1
fn get_first(arr: &[i32]) -> i32 {
    arr[0]  //@3
}

// O(n) — Linear time
fn find_max(arr: &[i32]) -> i32 {  //@7
    let mut maximum = arr[0];
    for i in 1..arr.len() {  //@9
        if arr[i] > maximum {
            maximum = arr[i];
        }
    }
    maximum
}

// O(n²) — Quadratic time
fn has_duplicate(arr: &[i32]) -> bool {  //@16
    for i in 0..arr.len() {  //@17
        for j in (i + 1)..arr.len() {  //@18
            if arr[i] == arr[j] {
                return true;
            }
        }
    }
    false
}

// O(log n) — Logarithmic time
fn binary_search(arr: &[i32], target: i32) -> Option<usize> {  //@26
    let mut lo = 0;
    let mut hi = arr.len();
    while lo < hi {  //@28
        let mid = lo + (hi - lo) / 2;
        if arr[mid] == target {
            return Some(mid);
        }
        if arr[mid] < target {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
    None
}

// O(n log n) — Linearithmic time
fn merge_sort(arr: &[i32]) -> Vec<i32> {
    if arr.len() <= 1 {
        return arr.to_vec();
    }
    let mid = arr.len() / 2;  //@41
    let left = merge_sort(&arr[..mid]);
    let right = merge_sort(&arr[mid..]);  //@43
    merge(left, right)
}`),

  recursion: annotated(`fn factorial(n: u64) -> u64 {  //@1
    // Base case: factorial of 0 or 1 is 1
    if n <= 1 {  //@3
        return 1;
    }

    // Recursive case: n * factorial(n - 1)
    n * factorial(n - 1)  //@6
}

// factorial(5) unfolds as:
// 5 * factorial(4)
//   4 * factorial(3)
//     3 * factorial(2)
//       2 * factorial(1)
//         → 1 (base case)`),

  'two-pointers': annotated(`fn two_sum_sorted(arr: &[i32], target: i32) -> Option<(usize, usize)> {
    let mut left = 0;  //@2
    let mut right = arr.len() - 1;

    while left < right {
        let total = arr[left] + arr[right];
        if total == target {  //@7
            return Some((left, right));
        } else if total < target {  //@9
            left += 1;  // need bigger sum
        } else {  //@11
            right -= 1; // need smaller sum
        }
    }
    None // no pair found
}`),

  'sliding-window': annotated(`fn longest_unique_substring(s: &str) -> String {  //@1
    let chars: Vec<char> = s.chars().collect();
    let mut seen: HashSet<char> = HashSet::new();
    let (mut start, mut best, mut best_start) = (0, 0, 0);

    for end in 0..chars.len() {  //@5
        while seen.contains(&chars[end]) {  //@6
            seen.remove(&chars[start]);
            start += 1;  //@8
        }
        seen.insert(chars[end]);  //@9
        if end - start + 1 > best {  //@10
            best = end - start + 1;
            best_start = start;
        }
    }
    chars[best_start..best_start + best].iter().collect()
}`),

  'space-complexity': annotated(`// O(1) space — fixed variables  //@1
fn swap(arr: &mut [i32], i: usize, j: usize) {  //@2
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// O(log n) space — recursive call stack
fn binary_search(arr: &[i32], target: i32, lo: usize, hi: usize) -> Option<usize> {  //@9
    if lo >= hi {
        return None;
    }
    let mid = lo + (hi - lo) / 2;
    if arr[mid] == target {
        return Some(mid);
    }
    if arr[mid] < target {
        return binary_search(arr, target, mid + 1, hi);
    }
    binary_search(arr, target, lo, mid)
}

// O(n) space — copy of input
fn reverse_copy(arr: &[i32]) -> Vec<i32> {  //@19
    let mut copy = arr.to_vec(); // allocates n elements
    copy.reverse();
    copy
}

// O(n²) space — 2D matrix
fn create_matrix(n: usize) -> Vec<Vec<i32>> {
    vec![vec![0; n]; n]  //@26
}`),

  memoization: annotated(`// Without memoization — O(2^n) time!
fn fib(n: u64) -> u64 {
    if n <= 1 {
        return n;
    }
    fib(n - 1) + fib(n - 2)
}

// With memoization — O(n) time!
fn fib_memo(n: u64, memo: &mut HashMap<u64, u64>) -> u64 {  //@8
    if let Some(&cached) = memo.get(&n) {
        return cached; // cache hit!
    }
    if n <= 1 {  //@10
        return n;
    }
    let value = fib_memo(n - 1, memo)  //@11
              + fib_memo(n - 2, memo);  //@12
    memo.insert(n, value);
    value
}

// fib_memo(7):
// Only computes each value ONCE
// Then reuses cached results`),

  'greedy-vs-dp': annotated(`// GREEDY: always pick the largest coin first  //@1
fn greedy_coin_change(coins: &[usize], mut amount: usize) -> Option<Vec<usize>> {  //@2
    let mut sorted = coins.to_vec();
    sorted.sort_by(|a, b| b.cmp(a)); // largest first
    let mut result = Vec::new();
    for coin in sorted {
        while amount >= coin {
            result.push(coin);  //@7
            amount -= coin;
        }
    }
    if amount == 0 { Some(result) } else { None }  //@10
}

// DP: find the optimal solution
fn dp_coin_change(coins: &[usize], amount: usize) -> Vec<usize> {
    let mut dp = vec![usize::MAX / 2; amount + 1];  //@16
    let mut used: Vec<Option<usize>> = vec![None; amount + 1];
    dp[0] = 0;
    for i in 1..=amount {
        for &coin in coins {
            if coin <= i && dp[i - coin] + 1 < dp[i] {  //@21
                dp[i] = dp[i - coin] + 1;  //@22
                used[i] = Some(coin);
            }
        }
    }
    // Reconstruct solution
    let mut result = Vec::new();
    let mut rem = amount;
    while let Some(coin) = used[rem] {
        result.push(coin);
        rem -= coin;
    }
    result
}`),
}
