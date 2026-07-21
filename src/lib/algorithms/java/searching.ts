import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const searchingJava: Record<string, CodeImplementation> = {
  'binary-search': annotated(`int binarySearch(int[] array, int target) {  //@1
    int low = 0;
    int high = array.length - 1;

    while (low <= high) {
        int mid = (low + high) / 2;  //@6

        if (array[mid] == target) {  //@8
            return mid; // Found!
        } else if (array[mid] < target) {  //@10
            low = mid + 1; // Search right half
        } else {  //@12
            high = mid - 1; // Search left half
        }
    }

    return -1; // Not found
}`),

  'linear-search': annotated(`int linearSearch(int[] array, int target) {  //@1
    for (int i = 0; i < array.length; i++) {  //@2
        if (array[i] == target) {  //@3
            return i; // Found!
        }
    }

    return -1; // Not found
}`),

  'jump-search': annotated(`int jumpSearch(int[] array, int target) {  //@1
    int n = array.length;
    int jump = (int) Math.sqrt(n);
    int prev = 0;
    int curr = jump;

    // Jump in blocks of size √n
    while (curr < n && array[curr] <= target) {  //@8
        prev = curr;
        curr += jump;
    }

    // Linear search in the block
    for (int i = prev; i < Math.min(curr, n); i++) {  //@12
        if (array[i] == target) {  //@13
            return i; // Found!  //@14
        }
    }

    return -1; // Not found
}`),

  'interpolation-search': annotated(`int interpolationSearch(int[] array, int target) {  //@1
    int low = 0;
    int high = array.length - 1;

    while (low <= high && target >= array[low] && target <= array[high]) {
        // Estimate position using interpolation formula
        int pos = low + (  //@7
            ((target - array[low]) * (high - low)) /
            (array[high] - array[low])
        );

        if (array[pos] == target) {  //@12
            return pos; // Found!
        } else if (array[pos] < target) {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
    }

    return -1; // Not found
}`),
}
