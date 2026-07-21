import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const sortingJava: Record<string, CodeImplementation> = {
  'bubble-sort': annotated(`void bubbleSort(int[] array) {  //@1
    int n = array.length;

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {  //@5
                // Swap adjacent elements
                int temp = array[j];  //@7
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }
}  //@12`),

  'selection-sort': annotated(`void selectionSort(int[] array) {  //@1
    int n = array.length;

    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;  //@4

        for (int j = i + 1; j < n; j++) {
            if (array[j] < array[minIndex]) {  //@7
                minIndex = j;  //@8
            }
        }

        if (minIndex != i) {
            int temp = array[i];  //@13
            array[i] = array[minIndex];
            array[minIndex] = temp;
        }
    }
}  //@17`),

  'insertion-sort': annotated(`void insertionSort(int[] array) {  //@1
    int n = array.length;

    for (int i = 1; i < n; i++) {
        int key = array[i];  //@4
        int j = i - 1;

        while (j >= 0 && array[j] > key) {  //@7
            array[j + 1] = array[j];  //@8
            j--;
        }

        array[j + 1] = key;  //@11
    }
}  //@15`),

  'quick-sort': annotated(`void quickSort(int[] arr, int low, int high) {  //@1
    if (low < high) {  //@2
        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
}  //@6

int partition(int[] arr, int low, int high) {
    int pivot = arr[high];  //@10
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {  //@14
            i++;
            int temp = arr[i];  //@16
            arr[i] = arr[j];
            arr[j] = temp;
        }
    }

    int temp = arr[i + 1];  //@20
    arr[i + 1] = arr[high];
    arr[high] = temp;
    return i + 1;
}`),

  'merge-sort': annotated(`void mergeSort(int[] arr, int start, int end) {  //@1
    if (start >= end) return;

    int mid = (start + end) / 2;
    mergeSort(arr, start, mid);  //@4
    mergeSort(arr, mid + 1, end);
    merge(arr, start, mid, end);
}

void merge(int[] arr, int start, int mid, int end) {
    int[] temp = new int[end - start + 1];
    int i = start, j = mid + 1, k = 0;

    while (i <= mid && j <= end) {
        if (arr[i] <= arr[j]) {  //@14
            temp[k++] = arr[i++];
        } else {
            temp[k++] = arr[j++];
        }
    }

    while (i <= mid) temp[k++] = arr[i++];
    while (j <= end) temp[k++] = arr[j++];

    for (int t = 0; t < temp.length; t++) {
        arr[start + t] = temp[t];  //@25
    }
}`),

  'heap-sort': annotated(`void heapSort(int[] array) {  //@1
    int n = array.length;

    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {  //@5
        heapify(array, n, i);  //@6
    }

    // Extract elements from heap
    for (int i = n - 1; i > 0; i--) {  //@10
        int temp = array[0];  //@11
        array[0] = array[i];
        array[i] = temp;
        heapify(array, i, 0);  //@12
    }
}  //@15

void heapify(int[] array, int size, int root) {
    int largest = root;
    int left = 2 * root + 1;
    int right = 2 * root + 2;

    if (left < size && array[left] > array[largest]) {  //@23
        largest = left;
    }

    if (right < size && array[right] > array[largest]) {  //@27
        largest = right;
    }

    if (largest != root) {
        int temp = array[root];  //@33
        array[root] = array[largest];
        array[largest] = temp;
        heapify(array, size, largest);
    }
}`),

  'counting-sort': annotated(`int[] countingSort(int[] array) {  //@1
    int maxValue = array[0];
    for (int v : array) if (v > maxValue) maxValue = v;
    int[] count = new int[maxValue + 1];
    int[] output = new int[array.length];

    // Count occurrences
    for (int i = 0; i < array.length; i++) {
        count[array[i]]++;  //@8
    }

    // Cumulative count
    for (int i = 1; i <= maxValue; i++) {  //@12
        count[i] += count[i - 1];
    }

    // Build output (reverse for stability)
    for (int i = array.length - 1; i >= 0; i--) {  //@14
        output[count[array[i]] - 1] = array[i];  //@18
        count[array[i]]--;
    }

    return output;  //@22
}`),

  'radix-sort': annotated(`void radixSort(int[] array) {  //@1
    int maxValue = array[0];
    for (int v : array) if (v > maxValue) maxValue = v;

    for (int exp = 1; maxValue / exp > 0; exp *= 10) {  //@4
        countingSortByDigit(array, exp);  //@5
    }
}  //@8

void countingSortByDigit(int[] array, int exp) {
    int n = array.length;
    int[] output = new int[n];
    int[] count = new int[10];

    for (int i = 0; i < n; i++) {
        int digit = (array[i] / exp) % 10;
        count[digit]++;
    }

    for (int i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    for (int i = n - 1; i >= 0; i--) {
        int digit = (array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
    }

    for (int i = 0; i < n; i++) {
        array[i] = output[i];
    }
}`),

  'shell-sort': annotated(`void shellSort(int[] array) {  //@1
    int n = array.length;

    for (int gap = n / 2; gap > 0; gap /= 2) {  //@4
        for (int i = gap; i < n; i++) {
            int temp = array[i];  //@6
            int j = i;

            while (j >= gap && array[j - gap] > temp) {  //@9
                array[j] = array[j - gap];  //@10
                j -= gap;
            }

            array[j] = temp;  //@14
        }
        // gap shrinks each pass  //@16
    }
}  //@18`),

  'bucket-sort': annotated(`void bucketSort(int[] array, int bucketSize) {  //@1
    if (array.length == 0) return;

    // 1. Find min and max values
    int minValue = array[0];  //@5
    int maxValue = array[0];
    for (int i = 1; i < array.length; i++) {
        if (array[i] < minValue) minValue = array[i];
        else if (array[i] > maxValue) maxValue = array[i];
    }

    // 2. Initialize buckets
    int bucketCount = (maxValue - minValue) / bucketSize + 1;  //@13
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i < bucketCount; i++) {
        buckets.add(new ArrayList<>());
    }

    // 3. Distribute elements into buckets
    for (int i = 0; i < array.length; i++) {
        int bucketIndex = (array[i] - minValue) / bucketSize;  //@20
        buckets.get(bucketIndex).add(array[i]);
    }

    // 4. Sort buckets and concatenate
    int idx = 0;
    for (int i = 0; i < buckets.size(); i++) {
        Collections.sort(buckets.get(i));  //@27
        for (int j = 0; j < buckets.get(i).size(); j++) {
            array[idx++] = buckets.get(i).get(j);  //@29
        }
    }
}`),
}
