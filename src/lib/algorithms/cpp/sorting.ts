import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const sortingCpp: Record<string, CodeImplementation> = {
  'bubble-sort': annotated(`void bubbleSort(vector<int>& array) {  //@1
    int n = array.size();

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {  //@5
                // Swap adjacent elements
                swap(array[j], array[j + 1]);  //@7
            }
        }
    }
}  //@12`),

  'selection-sort': annotated(`void selectionSort(vector<int>& array) {  //@1
    int n = array.size();

    for (int i = 0; i < n - 1; i++) {
        int minIndex = i;  //@4

        for (int j = i + 1; j < n; j++) {
            if (array[j] < array[minIndex]) {  //@7
                minIndex = j;  //@8
            }
        }

        if (minIndex != i) {
            swap(array[i], array[minIndex]);  //@13
        }
    }
}  //@17`),

  'insertion-sort': annotated(`void insertionSort(vector<int>& array) {  //@1
    int n = array.size();

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

  'quick-sort': annotated(`void quickSort(vector<int>& arr, int low, int high) {  //@1
    if (low < high) {  //@2
        int pivotIdx = partition(arr, low, high);
        quickSort(arr, low, pivotIdx - 1);
        quickSort(arr, pivotIdx + 1, high);
    }
}  //@6

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];  //@10
    int i = low - 1;

    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {  //@14
            i++;
            swap(arr[i], arr[j]);  //@16
        }
    }

    swap(arr[i + 1], arr[high]);  //@20
    return i + 1;
}`),

  'merge-sort': annotated(`void mergeSort(vector<int>& arr, int start, int end) {  //@1
    if (start >= end) return;

    int mid = (start + end) / 2;
    mergeSort(arr, start, mid);  //@4
    mergeSort(arr, mid + 1, end);
    merge(arr, start, mid, end);
}

void merge(vector<int>& arr, int start, int mid, int end) {
    vector<int> temp;
    int i = start, j = mid + 1;

    while (i <= mid && j <= end) {
        if (arr[i] <= arr[j]) {  //@14
            temp.push_back(arr[i++]);
        } else {
            temp.push_back(arr[j++]);
        }
    }

    while (i <= mid) temp.push_back(arr[i++]);
    while (j <= end) temp.push_back(arr[j++]);

    for (int k = 0; k < (int)temp.size(); k++) {
        arr[start + k] = temp[k];  //@25
    }
}`),

  'heap-sort': annotated(`void heapSort(vector<int>& array) {  //@1
    int n = array.size();

    // Build max heap
    for (int i = n / 2 - 1; i >= 0; i--) {  //@5
        heapify(array, n, i);  //@6
    }

    // Extract elements from heap
    for (int i = n - 1; i > 0; i--) {  //@10
        swap(array[0], array[i]);  //@11
        heapify(array, i, 0);  //@12
    }
}  //@15

void heapify(vector<int>& array, int size, int root) {
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
        swap(array[root], array[largest]);  //@33
        heapify(array, size, largest);
    }
}`),

  'counting-sort': annotated(`vector<int> countingSort(vector<int>& array) {  //@1
    int maxValue = *max_element(array.begin(), array.end());
    vector<int> count(maxValue + 1, 0);
    vector<int> output(array.size());

    // Count occurrences
    for (int i = 0; i < (int)array.size(); i++) {
        count[array[i]]++;  //@8
    }

    // Cumulative count
    for (int i = 1; i <= maxValue; i++) {  //@12
        count[i] += count[i - 1];
    }

    // Build output (reverse for stability)
    for (int i = (int)array.size() - 1; i >= 0; i--) {  //@14
        output[count[array[i]] - 1] = array[i];  //@18
        count[array[i]]--;
    }

    return output;  //@22
}`),

  'radix-sort': annotated(`void radixSort(vector<int>& array) {  //@1
    int maxValue = *max_element(array.begin(), array.end());

    for (int exp = 1; maxValue / exp > 0; exp *= 10) {  //@4
        countingSortByDigit(array, exp);  //@5
    }
}  //@8

void countingSortByDigit(vector<int>& array, int exp) {
    int n = array.size();
    vector<int> output(n);
    vector<int> count(10, 0);

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

  'shell-sort': annotated(`void shellSort(vector<int>& array) {  //@1
    int n = array.size();

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

  'bucket-sort': annotated(`void bucketSort(vector<int>& array, int bucketSize = 5) {  //@1
    if (array.empty()) return;

    // 1. Find min and max values
    int minValue = array[0];  //@5
    int maxValue = array[0];
    for (int i = 1; i < (int)array.size(); i++) {
        if (array[i] < minValue) minValue = array[i];
        else if (array[i] > maxValue) maxValue = array[i];
    }

    // 2. Initialize buckets
    int bucketCount = (maxValue - minValue) / bucketSize + 1;  //@13
    vector<vector<int>> buckets(bucketCount);

    // 3. Distribute elements into buckets
    for (int i = 0; i < (int)array.size(); i++) {
        int bucketIndex = (array[i] - minValue) / bucketSize;  //@20
        buckets[bucketIndex].push_back(array[i]);
    }

    // 4. Sort buckets and concatenate
    array.clear();
    for (int i = 0; i < (int)buckets.size(); i++) {
        sort(buckets[i].begin(), buckets[i].end());  //@27
        for (int j = 0; j < (int)buckets[i].size(); j++) {
            array.push_back(buckets[i][j]);  //@29
        }
    }
}`),
}
