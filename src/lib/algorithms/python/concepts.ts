import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const conceptsPython: Record<string, CodeImplementation> = {
  'big-o-notation': annotated(`# O(1) — Constant time  #@1
def get_first(arr):
    return arr[0]  #@3

# O(n) — Linear time
def find_max(arr):  #@7
    maximum = arr[0]
    for i in range(1, len(arr)):  #@9
        if arr[i] > maximum:
            maximum = arr[i]
    return maximum

# O(n²) — Quadratic time
def has_duplicate(arr):  #@16
    for i in range(len(arr)):  #@17
        for j in range(i + 1, len(arr)):  #@18
            if arr[i] == arr[j]:
                return True
    return False

# O(log n) — Logarithmic time
def binary_search(arr, target):  #@26
    lo, hi = 0, len(arr) - 1
    while lo <= hi:  #@28
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1

# O(n log n) — Linearithmic time
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2  #@41
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])  #@43
    return merge(left, right)

def merge(left, right):
    result = []
    while left and right:
        if left[0] < right[0]:
            result.append(left.pop(0))
        else:
            result.append(right.pop(0))
    return result + left + right`),

  recursion: annotated(`def factorial(n):  #@1
    # Base case: factorial of 0 or 1 is 1
    if n <= 1:  #@3
        return 1

    # Recursive case: n * factorial(n - 1)
    return n * factorial(n - 1)  #@6

# factorial(5) unfolds as:
# 5 * factorial(4)
#   4 * factorial(3)
#     3 * factorial(2)
#       2 * factorial(1)
#         → 1 (base case)`),

  'two-pointers': annotated(`def two_sum_sorted(arr, target):
    left = 0  #@2
    right = len(arr) - 1

    while left < right:
        total = arr[left] + arr[right]
        if total == target:  #@7
            return [left, right]
        elif total < target:  #@9
            left += 1   # need bigger sum
        else:  #@11
            right -= 1  # need smaller sum
    return None  # no pair found`),

  'sliding-window': annotated(`def longest_unique_substring(s):  #@1
    seen = set()
    start, best, best_start = 0, 0, 0

    for end in range(len(s)):  #@5
        while s[end] in seen:  #@6
            seen.remove(s[start])
            start += 1  #@8
        seen.add(s[end])  #@9
        if end - start + 1 > best:  #@10
            best = end - start + 1
            best_start = start
    return s[best_start:best_start + best]`),

  'space-complexity': annotated(`# O(1) space — fixed variables  #@1
def swap(arr, i, j):  #@2
    temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp

# O(log n) space — recursive call stack
def binary_search(arr, target, lo, hi):  #@9
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if arr[mid] == target:
        return mid
    if arr[mid] < target:
        return binary_search(arr, target, mid + 1, hi)
    return binary_search(arr, target, lo, mid - 1)

# O(n) space — copy of input
def reverse_copy(arr):  #@19
    copy = list(arr)  # allocates n elements
    copy.reverse()
    return copy

# O(n²) space — 2D matrix
def create_matrix(n):
    return [[0] * n for _ in range(n)]  #@26`),

  memoization: annotated(`# Without memoization — O(2^n) time!
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

# With memoization — O(n) time!
def fib_memo(n, memo=None):  #@8
    if memo is None:
        memo = {}
    if n in memo:
        return memo[n]  # cache hit!
    if n <= 1:  #@10
        return n
    memo[n] = (fib_memo(n - 1, memo)  #@11
               + fib_memo(n - 2, memo))  #@12
    return memo[n]

# fib_memo(7):
# Only computes each value ONCE
# Then reuses cached results`),

  'greedy-vs-dp': annotated(`# GREEDY: always pick the largest coin first  #@1
def greedy_coin_change(coins, amount):  #@2
    coins.sort(reverse=True)  # largest first
    result = []
    for coin in coins:
        while amount >= coin:
            result.append(coin)  #@7
            amount -= coin
    return result if amount == 0 else None  #@10

# DP: find the optimal solution
def dp_coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)  #@16
    used = [-1] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] + 1 < dp[i]:  #@21
                dp[i] = dp[i - coin] + 1  #@22
                used[i] = coin
    # Reconstruct solution
    result = []
    rem = amount
    while rem > 0:
        result.append(used[rem])
        rem -= used[rem]
    return result`),
}
