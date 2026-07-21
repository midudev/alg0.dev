import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const searchingPython: Record<string, CodeImplementation> = {
  'binary-search': annotated(`def binary_search(array, target):  #@1
    low = 0
    high = len(array) - 1

    while low <= high:
        mid = (low + high) // 2  #@6

        if array[mid] == target:  #@8
            return mid  # Found!
        elif array[mid] < target:  #@10
            low = mid + 1  # Search right half
        else:  #@12
            high = mid - 1  # Search left half

    return -1  # Not found`),

  'linear-search': annotated(`def linear_search(array, target):  #@1
    for i in range(len(array)):  #@2
        if array[i] == target:  #@3
            return i  # Found!

    return -1  # Not found`),

  'jump-search': annotated(`def jump_search(array, target):  #@1
    n = len(array)
    jump = int(n ** 0.5)
    prev = 0
    curr = jump

    # Jump in blocks of size √n
    while curr < n and array[curr] <= target:  #@8
        prev = curr
        curr += jump

    # Linear search in the block
    for i in range(prev, min(curr, n)):  #@12
        if array[i] == target:  #@13
            return i  # Found!  #@14

    return -1  # Not found`),

  'interpolation-search': annotated(`def interpolation_search(array, target):  #@1
    low = 0
    high = len(array) - 1

    while low <= high and array[low] <= target <= array[high]:
        # Estimate position using interpolation formula
        pos = low + (  #@7
            ((target - array[low]) * (high - low)) //
            (array[high] - array[low])
        )

        if array[pos] == target:  #@12
            return pos  # Found!
        elif array[pos] < target:
            low = pos + 1
        else:
            high = pos - 1

    return -1  # Not found`),
}
