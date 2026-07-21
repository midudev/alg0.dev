import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const sortingRust: Record<string, CodeImplementation> = {
  'bubble-sort': annotated(`fn bubble_sort(array: &mut [i32]) {  //@1
    let n = array.len();

    for i in 1..n {
        for j in 0..n - i {
            if array[j] > array[j + 1] {  //@5
                // Swap adjacent elements
                array.swap(j, j + 1);  //@7
            }
        }
    }
}  //@12`),

  'selection-sort': annotated(`fn selection_sort(array: &mut [i32]) {  //@1
    let n = array.len();

    for i in 0..n {
        let mut min_index = i;  //@4

        for j in i + 1..n {
            if array[j] < array[min_index] {  //@7
                min_index = j;  //@8
            }
        }

        if min_index != i {
            array.swap(i, min_index);  //@13
        }
    }
}  //@17`),

  'insertion-sort': annotated(`fn insertion_sort(array: &mut [i32]) {  //@1
    let n = array.len();

    for i in 1..n {
        let key = array[i];  //@4
        let mut j = i;

        while j > 0 && array[j - 1] > key {  //@7
            array[j] = array[j - 1];  //@8
            j -= 1;
        }

        array[j] = key;  //@11
    }
}  //@15`),

  'quick-sort': annotated(`fn quick_sort(arr: &mut [i32], low: isize, high: isize) {  //@1
    if low < high {  //@2
        let pivot_idx = partition(arr, low, high);
        quick_sort(arr, low, pivot_idx - 1);
        quick_sort(arr, pivot_idx + 1, high);
    }
}  //@6

fn partition(arr: &mut [i32], low: isize, high: isize) -> isize {
    let pivot = arr[high as usize];  //@10
    let mut i = low - 1;

    for j in low..high {
        if arr[j as usize] <= pivot {  //@14
            i += 1;
            arr.swap(i as usize, j as usize);  //@16
        }
    }

    arr.swap((i + 1) as usize, high as usize);  //@20
    i + 1
}`),

  'merge-sort': annotated(`fn merge_sort(arr: &mut [i32], start: usize, end: usize) {  //@1
    if start >= end {
        return;
    }

    let mid = (start + end) / 2;
    merge_sort(arr, start, mid);  //@4
    merge_sort(arr, mid + 1, end);
    merge(arr, start, mid, end);
}

fn merge(arr: &mut [i32], start: usize, mid: usize, end: usize) {
    let mut temp: Vec<i32> = Vec::new();
    let mut i = start;
    let mut j = mid + 1;

    while i <= mid && j <= end {
        if arr[i] <= arr[j] {  //@14
            temp.push(arr[i]);
            i += 1;
        } else {
            temp.push(arr[j]);
            j += 1;
        }
    }

    while i <= mid {
        temp.push(arr[i]);
        i += 1;
    }
    while j <= end {
        temp.push(arr[j]);
        j += 1;
    }

    for (k, value) in temp.iter().enumerate() {
        arr[start + k] = *value;  //@25
    }
}`),

  'heap-sort': annotated(`fn heap_sort(array: &mut [i32]) {  //@1
    let n = array.len();

    // Build max heap
    for i in (0..n / 2).rev() {  //@5
        heapify(array, n, i);  //@6
    }

    // Extract elements from heap
    for i in (1..n).rev() {  //@10
        array.swap(0, i);  //@11
        heapify(array, i, 0);  //@12
    }
}  //@15

fn heapify(array: &mut [i32], size: usize, root: usize) {
    let mut largest = root;
    let left = 2 * root + 1;
    let right = 2 * root + 2;

    if left < size && array[left] > array[largest] {  //@23
        largest = left;
    }

    if right < size && array[right] > array[largest] {  //@27
        largest = right;
    }

    if largest != root {
        array.swap(root, largest);  //@33
        heapify(array, size, largest);
    }
}`),

  'counting-sort': annotated(`fn counting_sort(array: &[i32]) -> Vec<i32> {  //@1
    let max_value = *array.iter().max().unwrap() as usize;
    let mut count = vec![0usize; max_value + 1];
    let mut output = vec![0i32; array.len()];

    // Count occurrences
    for &value in array {
        count[value as usize] += 1;  //@8
    }

    // Cumulative count
    for i in 1..=max_value {  //@12
        count[i] += count[i - 1];
    }

    // Build output (reverse for stability)
    for i in (0..array.len()).rev() {  //@14
        let value = array[i] as usize;
        output[count[value] - 1] = array[i];  //@18
        count[value] -= 1;
    }

    output  //@22
}`),

  'radix-sort': annotated(`fn radix_sort(array: &mut [i32]) {  //@1
    let max_value = *array.iter().max().unwrap();

    let mut exp = 1;
    while max_value / exp > 0 {  //@4
        counting_sort_by_digit(array, exp);  //@5
        exp *= 10;
    }
}  //@8

fn counting_sort_by_digit(array: &mut [i32], exp: i32) {
    let n = array.len();
    let mut output = vec![0i32; n];
    let mut count = [0usize; 10];

    for &value in array.iter() {
        let digit = ((value / exp) % 10) as usize;
        count[digit] += 1;
    }

    for i in 1..10 {
        count[i] += count[i - 1];
    }

    for i in (0..n).rev() {
        let digit = ((array[i] / exp) % 10) as usize;
        output[count[digit] - 1] = array[i];
        count[digit] -= 1;
    }

    array.copy_from_slice(&output);
}`),

  'shell-sort': annotated(`fn shell_sort(array: &mut [i32]) {  //@1
    let n = array.len();

    let mut gap = n / 2;
    while gap > 0 {  //@4
        for i in gap..n {
            let temp = array[i];  //@6
            let mut j = i;

            while j >= gap && array[j - gap] > temp {  //@9
                array[j] = array[j - gap];  //@10
                j -= gap;
            }

            array[j] = temp;  //@14
        }

        gap /= 2;  //@16
    }
}  //@18`),

  'bucket-sort': annotated(`fn bucket_sort(array: &mut Vec<i32>, bucket_size: i32) {  //@1
    if array.is_empty() {
        return;
    }

    // 1. Find min and max values
    let mut min_value = array[0];  //@5
    let mut max_value = array[0];
    for &value in array.iter().skip(1) {
        if value < min_value {
            min_value = value;
        } else if value > max_value {
            max_value = value;
        }
    }

    // 2. Initialize buckets
    let bucket_count = ((max_value - min_value) / bucket_size + 1) as usize;  //@13
    let mut buckets: Vec<Vec<i32>> = vec![Vec::new(); bucket_count];

    // 3. Distribute elements into buckets
    for &value in array.iter() {
        let bucket_index = ((value - min_value) / bucket_size) as usize;  //@20
        buckets[bucket_index].push(value);
    }

    // 4. Sort buckets and concatenate
    array.clear();
    for bucket in buckets.iter_mut() {
        bucket.sort();  //@27
        for value in bucket.iter() {
            array.push(*value);  //@29
        }
    }
}`),
}
