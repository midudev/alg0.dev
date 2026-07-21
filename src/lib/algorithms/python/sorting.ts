import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const sortingPython: Record<string, CodeImplementation> = {
  'bubble-sort': annotated(`def bubble_sort(array):  #@1
    n = len(array)

    for i in range(n - 1):
        for j in range(n - i - 1):
            if array[j] > array[j + 1]:  #@5
                # Swap adjacent elements
                array[j], array[j + 1] = array[j + 1], array[j]  #@7

    return array  #@12`),

  'selection-sort': annotated(`def selection_sort(array):  #@1
    n = len(array)

    for i in range(n - 1):
        min_index = i  #@4

        for j in range(i + 1, n):
            if array[j] < array[min_index]:  #@7
                min_index = j  #@8

        if min_index != i:
            array[i], array[min_index] = array[min_index], array[i]  #@13

    return array  #@17`),

  'insertion-sort': annotated(`def insertion_sort(array):  #@1
    n = len(array)

    for i in range(1, n):
        key = array[i]  #@4
        j = i - 1

        while j >= 0 and array[j] > key:  #@7
            array[j + 1] = array[j]  #@8
            j -= 1

        array[j + 1] = key  #@11

    return array  #@15`),

  'quick-sort': annotated(`def quick_sort(arr, low=0, high=None):  #@1
    if high is None:
        high = len(arr) - 1

    if low < high:  #@2
        pivot_idx = partition(arr, low, high)
        quick_sort(arr, low, pivot_idx - 1)
        quick_sort(arr, pivot_idx + 1, high)

    return arr  #@6


def partition(arr, low, high):
    pivot = arr[high]  #@10
    i = low - 1

    for j in range(low, high):
        if arr[j] <= pivot:  #@14
            i += 1
            arr[i], arr[j] = arr[j], arr[i]  #@16

    arr[i + 1], arr[high] = arr[high], arr[i + 1]  #@20
    return i + 1`),

  'merge-sort': annotated(`def merge_sort(arr, start=0, end=None):  #@1
    if end is None:
        end = len(arr) - 1
    if start >= end:
        return

    mid = (start + end) // 2
    merge_sort(arr, start, mid)  #@4
    merge_sort(arr, mid + 1, end)
    merge(arr, start, mid, end)


def merge(arr, start, mid, end):
    temp = []
    i = start
    j = mid + 1

    while i <= mid and j <= end:
        if arr[i] <= arr[j]:  #@14
            temp.append(arr[i])
            i += 1
        else:
            temp.append(arr[j])
            j += 1

    while i <= mid:
        temp.append(arr[i])
        i += 1
    while j <= end:
        temp.append(arr[j])
        j += 1

    for k in range(len(temp)):
        arr[start + k] = temp[k]  #@25`),

  'heap-sort': annotated(`def heap_sort(array):  #@1
    n = len(array)

    # Build max heap
    for i in range(n // 2 - 1, -1, -1):  #@5
        heapify(array, n, i)  #@6

    # Extract elements from heap
    for i in range(n - 1, 0, -1):  #@10
        array[0], array[i] = array[i], array[0]  #@11
        heapify(array, i, 0)  #@12

    return array  #@15


def heapify(array, size, root):
    largest = root
    left = 2 * root + 1
    right = 2 * root + 2

    if left < size and array[left] > array[largest]:  #@23
        largest = left

    if right < size and array[right] > array[largest]:  #@27
        largest = right

    if largest != root:
        array[root], array[largest] = array[largest], array[root]  #@33
        heapify(array, size, largest)`),

  'counting-sort': annotated(`def counting_sort(array):  #@1
    max_value = max(array)
    count = [0] * (max_value + 1)
    output = [0] * len(array)

    # Count occurrences
    for i in range(len(array)):
        count[array[i]] += 1  #@8

    # Cumulative count
    for i in range(1, max_value + 1):  #@12
        count[i] += count[i - 1]

    # Build output (reverse for stability)
    for i in range(len(array) - 1, -1, -1):  #@14
        output[count[array[i]] - 1] = array[i]  #@18
        count[array[i]] -= 1

    return output  #@22`),

  'radix-sort': annotated(`def radix_sort(array):  #@1
    max_value = max(array)

    exp = 1
    while max_value // exp > 0:  #@4
        counting_sort_by_digit(array, exp)  #@5
        exp *= 10

    return array  #@8


def counting_sort_by_digit(array, exp):
    n = len(array)
    output = [0] * n
    count = [0] * 10

    for i in range(n):
        digit = (array[i] // exp) % 10
        count[digit] += 1

    for i in range(1, 10):
        count[i] += count[i - 1]

    for i in range(n - 1, -1, -1):
        digit = (array[i] // exp) % 10
        output[count[digit] - 1] = array[i]
        count[digit] -= 1

    for i in range(n):
        array[i] = output[i]`),

  'shell-sort': annotated(`def shell_sort(array):  #@1
    n = len(array)

    gap = n // 2
    while gap > 0:  #@4
        for i in range(gap, n):
            temp = array[i]  #@6
            j = i

            while j >= gap and array[j - gap] > temp:  #@9
                array[j] = array[j - gap]  #@10
                j -= gap

            array[j] = temp  #@14

        gap //= 2  #@16

    return array  #@18`),

  'bucket-sort': annotated(`def bucket_sort(array, bucket_size=5):  #@1
    if len(array) == 0:
        return array

    # 1. Find min and max values
    min_value = array[0]  #@5
    max_value = array[0]
    for i in range(1, len(array)):
        if array[i] < min_value:
            min_value = array[i]
        elif array[i] > max_value:
            max_value = array[i]

    # 2. Initialize buckets
    bucket_count = (max_value - min_value) // bucket_size + 1  #@13
    buckets = []
    for i in range(bucket_count):
        buckets.append([])

    # 3. Distribute elements into buckets
    for i in range(len(array)):
        bucket_index = (array[i] - min_value) // bucket_size  #@20
        buckets[bucket_index].append(array[i])

    # 4. Sort buckets and concatenate
    array.clear()
    for i in range(len(buckets)):
        insertion_sort(buckets[i])  #@27
        for j in range(len(buckets[i])):
            array.append(buckets[i][j])  #@29

    return array`),
}
