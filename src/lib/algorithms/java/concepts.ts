import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const conceptsJava: Record<string, CodeImplementation> = {
  'big-o-notation': annotated(`// O(1) — Constant time  //@1
int getFirst(int[] arr) {
    return arr[0];  //@3
}

// O(n) — Linear time
int findMax(int[] arr) {  //@7
    int maximum = arr[0];
    for (int i = 1; i < arr.length; i++) {  //@9
        if (arr[i] > maximum) {
            maximum = arr[i];
        }
    }
    return maximum;
}

// O(n²) — Quadratic time
boolean hasDuplicate(int[] arr) {  //@16
    for (int i = 0; i < arr.length; i++) {  //@17
        for (int j = i + 1; j < arr.length; j++) {  //@18
            if (arr[i] == arr[j]) {
                return true;
            }
        }
    }
    return false;
}

// O(log n) — Logarithmic time
int binarySearch(int[] arr, int target) {  //@26
    int lo = 0, hi = arr.length - 1;
    while (lo <= hi) {  //@28
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// O(n log n) — Linearithmic time
int[] mergeSort(int[] arr) {
    if (arr.length <= 1) return arr;
    int mid = arr.length / 2;  //@41
    int[] left = mergeSort(Arrays.copyOfRange(arr, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(arr, mid, arr.length));  //@43
    return merge(left, right);
}`),

  recursion: annotated(`int factorial(int n) {  //@1
    // Base case: factorial of 0 or 1 is 1
    if (n <= 1) {  //@3
        return 1;
    }

    // Recursive case: n * factorial(n - 1)
    return n * factorial(n - 1);  //@6
}

// factorial(5) unfolds as:
// 5 * factorial(4)
//   4 * factorial(3)
//     3 * factorial(2)
//       2 * factorial(1)
//         → 1 (base case)`),

  'two-pointers': annotated(`int[] twoSumSorted(int[] arr, int target) {
    int left = 0;  //@2
    int right = arr.length - 1;

    while (left < right) {
        int total = arr[left] + arr[right];
        if (total == target) {  //@7
            return new int[]{left, right};
        } else if (total < target) {  //@9
            left++;   // need bigger sum
        } else {  //@11
            right--;  // need smaller sum
        }
    }
    return null; // no pair found
}`),

  'sliding-window': annotated(`String longestUniqueSubstring(String s) {  //@1
    Set<Character> seen = new HashSet<>();
    int start = 0, best = 0, bestStart = 0;

    for (int end = 0; end < s.length(); end++) {  //@5
        while (seen.contains(s.charAt(end))) {  //@6
            seen.remove(s.charAt(start));
            start++;  //@8
        }
        seen.add(s.charAt(end));  //@9
        if (end - start + 1 > best) {  //@10
            best = end - start + 1;
            bestStart = start;
        }
    }
    return s.substring(bestStart, bestStart + best);
}`),

  'space-complexity': annotated(`// O(1) space — fixed variables  //@1
void swap(int[] arr, int i, int j) {  //@2
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// O(log n) space — recursive call stack
int binarySearch(int[] arr, int target, int lo, int hi) {  //@9
    if (lo > hi) return -1;
    int mid = (lo + hi) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) {
        return binarySearch(arr, target, mid + 1, hi);
    }
    return binarySearch(arr, target, lo, mid - 1);
}

// O(n) space — copy of input
int[] reverseCopy(int[] arr) {  //@19
    int[] copy = Arrays.copyOf(arr, arr.length); // allocates n elements
    // reverse in place on the copy
    for (int i = 0, j = copy.length - 1; i < j; i++, j--) {
        int t = copy[i]; copy[i] = copy[j]; copy[j] = t;
    }
    return copy;
}

// O(n²) space — 2D matrix
int[][] createMatrix(int n) {
    return new int[n][n];  //@26
}`),

  memoization: annotated(`// Without memoization — O(2^n) time!
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// With memoization — O(n) time!
int fibMemo(int n, Map<Integer, Integer> memo) {  //@8
    if (memo.containsKey(n)) {
        return memo.get(n); // cache hit!
    }
    if (n <= 1) {  //@10
        return n;
    }
    int value = fibMemo(n - 1, memo)  //@11
              + fibMemo(n - 2, memo);  //@12
    memo.put(n, value);
    return value;
}

// fibMemo(7):
// Only computes each value ONCE
// Then reuses cached results`),

  'greedy-vs-dp': annotated(`// GREEDY: always pick the largest coin first  //@1
List<Integer> greedyCoinChange(int[] coins, int amount) {  //@2
    Arrays.sort(coins); // sort ascending, then reverse walk
    List<Integer> result = new ArrayList<>();
    for (int i = coins.length - 1; i >= 0; i--) {
        while (amount >= coins[i]) {
            result.add(coins[i]);  //@7
            amount -= coins[i];
        }
    }
    return amount == 0 ? result : null;  //@10
}

// DP: find the optimal solution
List<Integer> dpCoinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];  //@16
    int[] used = new int[amount + 1];
    Arrays.fill(dp, Integer.MAX_VALUE / 2);
    Arrays.fill(used, -1);
    dp[0] = 0;
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i && dp[i - coin] + 1 < dp[i]) {  //@21
                dp[i] = dp[i - coin] + 1;  //@22
                used[i] = coin;
            }
        }
    }
    // Reconstruct solution
    List<Integer> result = new ArrayList<>();
    int rem = amount;
    while (rem > 0) {
        result.add(used[rem]);
        rem -= used[rem];
    }
    return result;
}`),
}
