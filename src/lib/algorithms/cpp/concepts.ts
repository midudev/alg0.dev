import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const conceptsCpp: Record<string, CodeImplementation> = {
  'big-o-notation': annotated(`// O(1) — Constant time  //@1
int getFirst(const vector<int>& arr) {
    return arr[0];  //@3
}

// O(n) — Linear time
int findMax(const vector<int>& arr) {  //@7
    int maximum = arr[0];
    for (int i = 1; i < (int)arr.size(); i++) {  //@9
        if (arr[i] > maximum) {
            maximum = arr[i];
        }
    }
    return maximum;
}

// O(n²) — Quadratic time
bool hasDuplicate(const vector<int>& arr) {  //@16
    for (int i = 0; i < (int)arr.size(); i++) {  //@17
        for (int j = i + 1; j < (int)arr.size(); j++) {  //@18
            if (arr[i] == arr[j]) {
                return true;
            }
        }
    }
    return false;
}

// O(log n) — Logarithmic time
int binarySearch(const vector<int>& arr, int target) {  //@26
    int lo = 0, hi = (int)arr.size() - 1;
    while (lo <= hi) {  //@28
        int mid = (lo + hi) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) lo = mid + 1;
        else hi = mid - 1;
    }
    return -1;
}

// O(n log n) — Linearithmic time
vector<int> mergeSort(vector<int> arr) {
    if (arr.size() <= 1) return arr;
    int mid = arr.size() / 2;  //@41
    vector<int> left(arr.begin(), arr.begin() + mid);
    vector<int> right(arr.begin() + mid, arr.end());  //@43
    left = mergeSort(left);
    right = mergeSort(right);
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

  'two-pointers':
    annotated(`optional<pair<int, int>> twoSumSorted(const vector<int>& arr, int target) {
    int left = 0;  //@2
    int right = (int)arr.size() - 1;

    while (left < right) {
        int total = arr[left] + arr[right];
        if (total == target) {  //@7
            return make_pair(left, right);
        } else if (total < target) {  //@9
            left++;   // need bigger sum
        } else {  //@11
            right--;  // need smaller sum
        }
    }
    return nullopt; // no pair found
}`),

  'sliding-window': annotated(`string longestUniqueSubstring(const string& s) {  //@1
    unordered_set<char> seen;
    int start = 0, best = 0, bestStart = 0;

    for (int end = 0; end < (int)s.size(); end++) {  //@5
        while (seen.count(s[end])) {  //@6
            seen.erase(s[start]);
            start++;  //@8
        }
        seen.insert(s[end]);  //@9
        if (end - start + 1 > best) {  //@10
            best = end - start + 1;
            bestStart = start;
        }
    }
    return s.substr(bestStart, best);
}`),

  'space-complexity': annotated(`// O(1) space — fixed variables  //@1
void swap(vector<int>& arr, int i, int j) {  //@2
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// O(log n) space — recursive call stack
int binarySearch(const vector<int>& arr, int target, int lo, int hi) {  //@9
    if (lo > hi) return -1;
    int mid = (lo + hi) / 2;
    if (arr[mid] == target) return mid;
    if (arr[mid] < target) {
        return binarySearch(arr, target, mid + 1, hi);
    }
    return binarySearch(arr, target, lo, mid - 1);
}

// O(n) space — copy of input
vector<int> reverseCopy(const vector<int>& arr) {  //@19
    vector<int> copy = arr; // allocates n elements
    reverse(copy.begin(), copy.end());
    return copy;
}

// O(n²) space — 2D matrix
vector<vector<int>> createMatrix(int n) {
    return vector<vector<int>>(n, vector<int>(n, 0));  //@26
}`),

  memoization: annotated(`// Without memoization — O(2^n) time!
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}

// With memoization — O(n) time!
int fibMemo(int n, unordered_map<int, int>& memo) {  //@8
    if (memo.count(n)) {
        return memo[n]; // cache hit!
    }
    if (n <= 1) {  //@10
        return n;
    }
    memo[n] = fibMemo(n - 1, memo)  //@11
            + fibMemo(n - 2, memo);  //@12
    return memo[n];
}

// fibMemo(7):
// Only computes each value ONCE
// Then reuses cached results`),

  'greedy-vs-dp': annotated(`// GREEDY: always pick the largest coin first  //@1
optional<vector<int>> greedyCoinChange(vector<int> coins, int amount) {  //@2
    sort(coins.rbegin(), coins.rend()); // largest first
    vector<int> result;
    for (int coin : coins) {
        while (amount >= coin) {
            result.push_back(coin);  //@7
            amount -= coin;
        }
    }
    return amount == 0 ? optional(result) : nullopt;  //@10
}

// DP: find the optimal solution
vector<int> dpCoinChange(const vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, INT_MAX / 2);  //@16
    vector<int> used(amount + 1, -1);
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
    vector<int> result;
    int rem = amount;
    while (rem > 0) {
        result.push_back(used[rem]);
        rem -= used[rem];
    }
    return result;
}`),
}
