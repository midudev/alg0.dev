import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const searchingRust: Record<string, CodeImplementation> = {
  'binary-search': annotated(`fn binary_search(array: &[i32], target: i32) -> Option<usize> {  //@1
    let mut low: isize = 0;
    let mut high: isize = array.len() as isize - 1;

    while low <= high {
        let mid = (low + high) / 2;  //@6

        if array[mid as usize] == target {  //@8
            return Some(mid as usize); // Found!
        } else if array[mid as usize] < target {  //@10
            low = mid + 1; // Search right half
        } else {  //@12
            high = mid - 1; // Search left half
        }
    }

    None // Not found
}`),

  'linear-search': annotated(`fn linear_search(array: &[i32], target: i32) -> Option<usize> {  //@1
    for i in 0..array.len() {  //@2
        if array[i] == target {  //@3
            return Some(i); // Found!
        }
    }

    None // Not found
}`),

  'jump-search': annotated(`fn jump_search(array: &[i32], target: i32) -> Option<usize> {  //@1
    let n = array.len();
    let jump = (n as f64).sqrt() as usize;
    let mut prev = 0;
    let mut curr = jump;

    // Jump in blocks of size √n
    while curr < n && array[curr] <= target {  //@8
        prev = curr;
        curr += jump;
    }

    // Linear search in the block
    for i in prev..curr.min(n) {  //@12
        if array[i] == target {  //@13
            return Some(i); // Found!  //@14
        }
    }

    None // Not found
}`),

  'interpolation-search':
    annotated(`fn interpolation_search(array: &[i32], target: i32) -> Option<usize> {  //@1
    let mut low: isize = 0;
    let mut high: isize = array.len() as isize - 1;

    while low <= high && target >= array[low as usize] && target <= array[high as usize] {
        // Estimate position using interpolation formula
        let pos = low + (  //@7
            ((target - array[low as usize]) as isize * (high - low)) /
            ((array[high as usize] - array[low as usize]) as isize)
        );

        if array[pos as usize] == target {  //@12
            return Some(pos as usize); // Found!
        } else if array[pos as usize] < target {
            low = pos + 1;
        } else {
            high = pos - 1;
        }
    }

    None // Not found
}`),
}
