import type {
  Algorithm,
  Step,
  HighlightType,
  GraphNode,
  GraphEdge,
  GraphState,
  Category,
} from './types'

// ============================================================
// Shared graph data for BFS/DFS
// ============================================================
const graphNodes: GraphNode[] = [
  { id: 0, label: '0', x: 250, y: 40 },
  { id: 1, label: '1', x: 130, y: 130 },
  { id: 2, label: '2', x: 370, y: 130 },
  { id: 3, label: '3', x: 50, y: 230 },
  { id: 4, label: '4', x: 200, y: 230 },
  { id: 5, label: '5', x: 440, y: 230 },
  { id: 6, label: '6', x: 200, y: 310 },
]

const graphEdges: GraphEdge[] = [
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 1, to: 4 },
  { from: 2, to: 5 },
  { from: 4, to: 6 },
]

const graphAdj: Record<number, number[]> = {
  0: [1, 2],
  1: [0, 3, 4],
  2: [0, 5],
  3: [1],
  4: [1, 6],
  5: [2],
  6: [4],
}

// ============================================================
// BUBBLE SORT
// ============================================================
const bubbleSort: Algorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function bubbleSort(array) {
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (array[j] > array[j + 1]) {
        // Swap adjacent elements
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
      }
    }
  }

  return array;
}`,
  description: `Bubble Sort

Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

The algorithm gets its name because smaller elements "bubble" to the top of the list with each pass.

How it works:
1. Compare each pair of adjacent elements
2. Swap them if the left element is greater
3. After each pass, the largest unsorted element settles in its final position
4. Repeat until no swaps are needed

Time Complexity:
  Best:    O(n) — already sorted
  Average: O(n²)
  Worst:   O(n²)

Space Complexity: O(1) — in-place

Properties:
  - Stable sort
  - Adaptive
  - In-place

Mainly used for educational purposes. For production, prefer Quick Sort or Merge Sort.`,

  generateSteps() {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const sorted: number[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description:
        'Initial array. Bubble Sort will compare adjacent elements and swap them if needed.',
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...arr],
          highlights: { [j]: 'comparing', [j + 1]: 'comparing' },
          sorted: [...sorted],
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`,
          codeLine: 5,
          variables: { i, j, n, 'array[j]': arr[j], 'array[j+1]': arr[j + 1] },
        })

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          steps.push({
            array: [...arr],
            highlights: { [j]: 'swapped', [j + 1]: 'swapped' },
            sorted: [...sorted],
            description: `Swapped! ${arr[j]} and ${arr[j + 1]}`,
            codeLine: 7,
            variables: { i, j, n, 'array[j]': arr[j], 'array[j+1]': arr[j + 1] },
          })
        }
      }
      sorted.push(n - i - 1)
    }

    sorted.push(0)
    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Bubble Sort complete.',
      codeLine: 12,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// SELECTION SORT
// ============================================================
const selectionSort: Algorithm = {
  id: 'selection-sort',
  name: 'Selection Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function selectionSort(array) {
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    for (let j = i + 1; j < n; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [array[i], array[minIndex]] = [array[minIndex], array[i]];
    }
  }

  return array;
}`,
  description: `Selection Sort

Selection Sort divides the array into a sorted and unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region.

How it works:
1. Find the minimum element in the unsorted portion
2. Swap it with the first unsorted element
3. Move the boundary between sorted and unsorted one element to the right
4. Repeat until the entire array is sorted

Time Complexity:
  Best:    O(n²)
  Average: O(n²)
  Worst:   O(n²)

Space Complexity: O(1) — in-place

Properties:
  - Not stable (can change relative order of equal elements)
  - Not adaptive
  - In-place
  - Minimizes the number of swaps: O(n)

Useful when memory writes are expensive, as it performs at most O(n) swaps.`,

  generateSteps() {
    const arr = [64, 25, 12, 22, 11, 90, 45]
    const steps: Step[] = []
    const sorted: number[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description:
        'Initial array. Selection Sort finds the minimum and places it at the beginning.',
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i

      steps.push({
        array: [...arr],
        highlights: { [i]: 'current', [minIndex]: 'minimum' },
        sorted: [...sorted],
        description: `Starting pass ${i + 1}. Current minimum: ${arr[minIndex]} at index ${minIndex}`,
        codeLine: 4,
        variables: { i, minIndex, n, 'array[minIndex]': arr[minIndex] },
      })

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'current', [minIndex]: 'minimum', [j]: 'comparing' },
          sorted: [...sorted],
          description: `Comparing ${arr[j]} with current minimum ${arr[minIndex]}`,
          codeLine: 7,
          variables: { i, j, minIndex, 'array[j]': arr[j], 'array[minIndex]': arr[minIndex] },
        })

        if (arr[j] < arr[minIndex]) {
          minIndex = j
          steps.push({
            array: [...arr],
            highlights: { [i]: 'current', [minIndex]: 'minimum' },
            sorted: [...sorted],
            description: `New minimum found: ${arr[minIndex]} at index ${minIndex}`,
            codeLine: 8,
            variables: { i, j, minIndex, 'array[j]': arr[j], 'array[minIndex]': arr[minIndex] },
          })
        }
      }

      if (minIndex !== i) {
        ;[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        steps.push({
          array: [...arr],
          highlights: { [i]: 'swapped', [minIndex]: 'swapped' },
          sorted: [...sorted],
          description: `Swapped ${arr[i]} and ${arr[minIndex]}`,
          codeLine: 13,
          variables: { i, minIndex, 'array[i]': arr[i], 'array[minIndex]': arr[minIndex] },
        })
      }

      sorted.push(i)
    }

    sorted.push(n - 1)
    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Selection Sort complete.',
      codeLine: 17,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// INSERTION SORT
// ============================================================
const insertionSort: Algorithm = {
  id: 'insertion-sort',
  name: 'Insertion Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function insertionSort(array) {
  const n = array.length;

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      j--;
    }

    array[j + 1] = key;
  }

  return array;
}`,
  description: `Insertion Sort

Insertion Sort builds the sorted array one element at a time. It picks each element and inserts it into its correct position in the already-sorted portion of the array.

How it works:
1. Start from the second element (first element is trivially sorted)
2. Pick the current element as the "key"
3. Compare the key with elements in the sorted portion
4. Shift larger elements to the right
5. Insert the key into its correct position

Time Complexity:
  Best:    O(n) — already sorted
  Average: O(n²)
  Worst:   O(n²) — reverse sorted

Space Complexity: O(1) — in-place

Properties:
  - Stable sort
  - Adaptive (efficient for nearly sorted data)
  - In-place
  - Online (can sort as data is received)

Excellent for small datasets or nearly sorted data. Often used as the base case in hybrid sorting algorithms like Timsort.`,

  generateSteps() {
    const arr = [12, 11, 13, 5, 6, 7, 42]
    const steps: Step[] = []
    const sorted: number[] = [0]
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [0],
      description: 'Initial array. First element is considered sorted.',
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    for (let i = 1; i < n; i++) {
      const key = arr[i]

      steps.push({
        array: [...arr],
        highlights: { [i]: 'selected' },
        sorted: [...sorted],
        description: `Picking element ${key} at index ${i} to insert into sorted portion`,
        codeLine: 4,
        variables: { i, key, j: i - 1, n },
      })

      let j = i - 1
      while (j >= 0 && arr[j] > key) {
        steps.push({
          array: [...arr],
          highlights: { [j]: 'comparing', [j + 1]: 'selected' },
          sorted: [...sorted],
          description: `${arr[j]} > ${key}, shifting ${arr[j]} to the right`,
          codeLine: 7,
          variables: { i, j, key, 'array[j]': arr[j] },
        })

        arr[j + 1] = arr[j]
        j--

        steps.push({
          array: [...arr],
          highlights: j >= 0 ? { [j]: 'comparing', [j + 1]: 'swapped' } : { [j + 1]: 'swapped' },
          sorted: [...sorted],
          description: `Shifted. Checking next position...`,
          codeLine: 8,
          variables: { i, j, key, 'array[j+1]': arr[j + 1] },
        })
      }

      arr[j + 1] = key
      sorted.push(i)

      steps.push({
        array: [...arr],
        highlights: { [j + 1]: 'found' },
        sorted: [...sorted],
        description: `Inserted ${key} at index ${j + 1}`,
        codeLine: 11,
        variables: { i, j: j + 1, key },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Insertion Sort complete.',
      codeLine: 15,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// QUICK SORT
// ============================================================
const quickSort: Algorithm = {
  id: 'quick-sort',
  name: 'Quick Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIdx = partition(arr, low, high);
    quickSort(arr, low, pivotIdx - 1);
    quickSort(arr, pivotIdx + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`,
  description: `Quick Sort

Quick Sort is a highly efficient, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the array around it.

How it works:
1. Choose a pivot element (here, the last element)
2. Partition: rearrange so elements smaller than pivot are on the left, larger on the right
3. The pivot is now in its final sorted position
4. Recursively apply to the left and right sub-arrays

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n²) — when pivot is always the smallest/largest

Space Complexity: O(log n) average, O(n) worst — recursive call stack

Properties:
  - Not stable
  - In-place (with Lomuto partition)
  - Cache-friendly

Quick Sort is one of the fastest general-purpose sorting algorithms in practice. Used in many standard library implementations.`,

  generateSteps() {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const sorted: number[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: 'Initial array. Quick Sort will pick a pivot and partition the array around it.',
      codeLine: 1,
      variables: { low: 0, high: n - 1, array: `[${arr.join(', ')}]` },
    })

    function qs(low: number, high: number) {
      if (low > high) return
      if (low === high) {
        sorted.push(low)
        steps.push({
          array: [...arr],
          highlights: { [low]: 'sorted' },
          sorted: [...sorted],
          description: `Element ${arr[low]} is in its final position (single element)`,
          codeLine: 2,
          variables: { low, high, 'arr[low]': arr[low] },
        })
        return
      }

      const pivot = arr[high]
      let i = low - 1

      // Show pivot selection
      steps.push({
        array: [...arr],
        highlights: { [high]: 'pivot' },
        sorted: [...sorted],
        description: `Partitioning [${low}..${high}]. Pivot: ${arr[high]}`,
        codeLine: 10,
        variables: { low, high, pivot, i },
      })

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...arr],
          highlights: { [j]: 'comparing', [high]: 'pivot' },
          sorted: [...sorted],
          description: `Comparing ${arr[j]} with pivot ${pivot}`,
          codeLine: 14,
          variables: { j, i, pivot, 'arr[j]': arr[j] },
        })

        if (arr[j] <= pivot) {
          i++
          if (i !== j) {
            ;[arr[i], arr[j]] = [arr[j], arr[i]]
            steps.push({
              array: [...arr],
              highlights: { [i]: 'swapped', [j]: 'swapped', [high]: 'pivot' },
              sorted: [...sorted],
              description: `${arr[i]} <= pivot, swapped positions ${i} and ${j}`,
              codeLine: 16,
              variables: { j, i, pivot, 'arr[i]': arr[i], 'arr[j]': arr[j] },
            })
          }
        }
      }

      ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
      const pivotIdx = i + 1
      sorted.push(pivotIdx)

      steps.push({
        array: [...arr],
        highlights: { [pivotIdx]: 'found' },
        sorted: [...sorted],
        description: `Pivot ${arr[pivotIdx]} placed at final position ${pivotIdx}`,
        codeLine: 20,
        variables: { pivotIdx, 'arr[pivotIdx]': arr[pivotIdx] },
      })

      qs(low, pivotIdx - 1)
      qs(pivotIdx + 1, high)
    }

    qs(0, n - 1)

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Quick Sort complete.',
      codeLine: 6,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// MERGE SORT
// ============================================================
const mergeSort: Algorithm = {
  id: 'merge-sort',
  name: 'Merge Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function mergeSort(arr, start = 0, end = arr.length - 1) {
  if (start >= end) return;

  const mid = Math.floor((start + end) / 2);
  mergeSort(arr, start, mid);
  mergeSort(arr, mid + 1, end);
  merge(arr, start, mid, end);
}

function merge(arr, start, mid, end) {
  const temp = [];
  let i = start, j = mid + 1;

  while (i <= mid && j <= end) {
    if (arr[i] <= arr[j]) {
      temp.push(arr[i++]);
    } else {
      temp.push(arr[j++]);
    }
  }

  while (i <= mid) temp.push(arr[i++]);
  while (j <= end) temp.push(arr[j++]);

  for (let k = 0; k < temp.length; k++) {
    arr[start + k] = temp[k];
  }
}`,
  description: `Merge Sort

Merge Sort is a stable, divide-and-conquer sorting algorithm. It divides the array into halves, recursively sorts each half, then merges the sorted halves.

How it works:
1. Divide the array into two halves
2. Recursively sort each half
3. Merge the two sorted halves into a single sorted array
4. The merge step compares elements from both halves and places them in order

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(n) — requires temporary array

Properties:
  - Stable sort
  - Not in-place (requires O(n) extra space)
  - Predictable performance (always O(n log n))
  - Parallelizable

Merge Sort guarantees O(n log n) performance regardless of input. Ideal when stability is required or for sorting linked lists.`,

  generateSteps() {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: 'Initial array. Merge Sort will divide and merge sorted halves.',
      codeLine: 1,
      variables: { array: `[${arr.join(', ')}]` },
    })

    function ms(start: number, end: number) {
      if (start >= end) return

      const mid = Math.floor((start + end) / 2)

      const leftH: Record<number, HighlightType> = {}
      const rightH: Record<number, HighlightType> = {}
      for (let i = start; i <= mid; i++) leftH[i] = 'left'
      for (let i = mid + 1; i <= end; i++) rightH[i] = 'right'

      steps.push({
        array: [...arr],
        highlights: { ...leftH, ...rightH },
        sorted: [],
        description: `Dividing [${start}..${end}] into [${start}..${mid}] and [${mid + 1}..${end}]`,
        codeLine: 4,
        variables: { start, end, mid },
      })

      ms(start, mid)
      ms(mid + 1, end)

      // Merge
      const temp: number[] = []
      let i = start,
        j = mid + 1

      while (i <= mid && j <= end) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'left', [j]: 'right' },
          sorted: [],
          description: `Merging: comparing ${arr[i]} (left) and ${arr[j]} (right)`,
          codeLine: 14,
          variables: {
            i,
            j,
            start,
            mid,
            end,
            'arr[i]': arr[i],
            'arr[j]': arr[j],
            temp: `[${temp.join(', ')}]`,
          },
        })

        if (arr[i] <= arr[j]) {
          temp.push(arr[i++])
        } else {
          temp.push(arr[j++])
        }
      }

      while (i <= mid) temp.push(arr[i++])
      while (j <= end) temp.push(arr[j++])

      for (let k = 0; k < temp.length; k++) {
        arr[start + k] = temp[k]
      }

      const mergedH: Record<number, HighlightType> = {}
      for (let k = start; k <= end; k++) mergedH[k] = 'merged'

      steps.push({
        array: [...arr],
        highlights: mergedH,
        sorted: [],
        description: `Merged [${start}..${end}]: [${arr.slice(start, end + 1).join(', ')}]`,
        codeLine: 25,
        variables: { start, end, result: `[${arr.slice(start, end + 1).join(', ')}]` },
      })
    }

    ms(0, n - 1)

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Merge Sort complete.',
      codeLine: 1,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// HEAP SORT
// ============================================================
const heapSort: Algorithm = {
  id: 'heap-sort',
  name: 'Heap Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function heapSort(array) {
  const n = array.length;

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(array, n, i);
  }

  // Extract elements from heap
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    heapify(array, i, 0);
  }

  return array;
}

function heapify(array, size, root) {
  let largest = root;
  const left = 2 * root + 1;
  const right = 2 * root + 2;

  if (left < size && array[left] > array[largest]) {
    largest = left;
  }

  if (right < size && array[right] > array[largest]) {
    largest = right;
  }

  if (largest !== root) {
    [array[root], array[largest]] = [array[largest], array[root]];
    heapify(array, size, largest);
  }
}`,
  description: `Heap Sort

Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It first builds a max heap from the array, then repeatedly extracts the maximum element and places it at the end.

How it works:
1. Build a max heap from the input array
2. Swap the root (maximum) with the last element
3. Reduce heap size by one and heapify the root
4. Repeat until the heap is empty

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(1) — in-place

Properties:
  - Not stable
  - Not adaptive
  - In-place
  - Guaranteed O(n log n) regardless of input

Useful when worst-case performance matters and stability is not required.`,

  generateSteps() {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const n = arr.length
    const sortedIndices: number[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description:
        'Initial array. Heap Sort will build a max heap, then extract the maximum repeatedly.',
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    function heapify(size: number, root: number) {
      let largest = root
      const left = 2 * root + 1
      const right = 2 * root + 2

      if (left < size) {
        steps.push({
          array: [...arr],
          highlights: { [root]: 'comparing', [left]: 'comparing' },
          sorted: [...sortedIndices],
          description: `Heapify: comparing parent ${arr[root]} (index ${root}) with left child ${arr[left]} (index ${left})`,
          codeLine: 23,
          variables: { root, left, right, largest, size },
        })
        if (arr[left] > arr[largest]) {
          largest = left
        }
      }

      if (right < size) {
        steps.push({
          array: [...arr],
          highlights: { [root]: 'comparing', [right]: 'comparing' },
          sorted: [...sortedIndices],
          description: `Heapify: comparing ${arr[root]} (index ${root}) with right child ${arr[right]} (index ${right})`,
          codeLine: 27,
          variables: { root, left, right, largest, size },
        })
        if (arr[right] > arr[largest]) {
          largest = right
        }
      }

      if (largest !== root) {
        ;[arr[root], arr[largest]] = [arr[largest], arr[root]]
        steps.push({
          array: [...arr],
          highlights: { [root]: 'swapped', [largest]: 'swapped' },
          sorted: [...sortedIndices],
          description: `Swapped ${arr[root]} and ${arr[largest]}`,
          codeLine: 33,
          variables: { root, largest },
        })
        heapify(size, largest)
      }
    }

    // Build max heap
    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: 'Phase 1: Building max heap from the array.',
      codeLine: 5,
      variables: { n },
    })

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: `Heapifying subtree rooted at index ${i} (value ${arr[i]})`,
        codeLine: 6,
        variables: { i },
      })
      heapify(n, i)
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Max heap built: [${arr.join(', ')}]. Phase 2: Extract elements.`,
      codeLine: 10,
      variables: { heap: `[${arr.join(', ')}]` },
    })

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        array: [...arr],
        highlights: { [0]: 'selected', [i]: 'selected' },
        sorted: [...sortedIndices],
        description: `Swap max element ${arr[0]} with element ${arr[i]} at index ${i}`,
        codeLine: 11,
        variables: { i, max: arr[0] },
      })

      ;[arr[0], arr[i]] = [arr[i], arr[0]]
      sortedIndices.push(i)

      steps.push({
        array: [...arr],
        highlights: { [i]: 'sorted' },
        sorted: [...sortedIndices],
        description: `${arr[i]} placed in final position. Heapify remaining heap of size ${i}.`,
        codeLine: 12,
        variables: { i, sorted: arr[i] },
      })

      heapify(i, 0)
    }

    sortedIndices.push(0)
    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Heap Sort complete.',
      codeLine: 15,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// COUNTING SORT
// ============================================================
const countingSort: Algorithm = {
  id: 'counting-sort',
  name: 'Counting Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function countingSort(array) {
  const max = Math.max(...array);
  const count = new Array(max + 1).fill(0);
  const output = new Array(array.length);

  // Count occurrences
  for (let i = 0; i < array.length; i++) {
    count[array[i]]++;
  }

  // Cumulative count
  for (let i = 1; i <= max; i++) {
    count[i] += count[i - 1];
  }

  // Build output (reverse for stability)
  for (let i = array.length - 1; i >= 0; i--) {
    output[count[array[i]] - 1] = array[i];
    count[array[i]]--;
  }

  return output;
}`,
  description: `Counting Sort

Counting Sort is a non-comparison-based integer sorting algorithm. It counts the occurrences of each value and uses arithmetic to determine the correct position of each element in the output.

How it works:
1. Find the maximum value in the array
2. Create a count array and count each element's occurrences
3. Compute cumulative counts to determine positions
4. Build the output array by placing elements at their correct positions

Time Complexity:
  Best:    O(n + k)
  Average: O(n + k)
  Worst:   O(n + k)
  where k is the range of input values

Space Complexity: O(n + k) — requires extra arrays

Properties:
  - Stable sort
  - Not comparison-based
  - Not in-place
  - Very efficient when k = O(n)

Ideal for sorting integers within a known, limited range.`,

  generateSteps() {
    const arr = [4, 2, 2, 8, 3, 3, 1]
    const steps: Step[] = []
    const n = arr.length
    const max = Math.max(...arr)
    const count = new Array(max + 1).fill(0)
    const output: number[] = new Array(n).fill(0)

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description:
        'Initial array. Counting Sort will count occurrences of each value to determine sorted positions.',
      codeLine: 1,
      variables: { n, max, array: `[${arr.join(', ')}]` },
    })

    // Count phase
    for (let i = 0; i < n; i++) {
      count[arr[i]]++
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: `Counting element ${arr[i]} at index ${i}. count[${arr[i]}] = ${count[arr[i]]}`,
        codeLine: 8,
        variables: { i, 'array[i]': arr[i], count: `[${count.join(', ')}]` },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Counting complete: [${count.join(', ')}]. Computing cumulative counts.`,
      codeLine: 12,
      variables: { count: `[${count.join(', ')}]` },
    })

    // Cumulative count
    for (let i = 1; i <= max; i++) {
      count[i] += count[i - 1]
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Cumulative counts: [${count.join(', ')}]. Now placing elements in sorted positions.`,
      codeLine: 14,
      variables: { count: `[${count.join(', ')}]` },
    })

    // Build output
    const placed: boolean[] = new Array(n).fill(false)
    for (let i = n - 1; i >= 0; i--) {
      const pos = count[arr[i]] - 1
      output[pos] = arr[i]
      count[arr[i]]--
      placed[pos] = true

      const h: Record<number, HighlightType> = {}
      for (let k = 0; k < n; k++) {
        if (placed[k]) h[k] = 'sorted'
      }
      h[pos] = 'active'

      steps.push({
        array: [...output],
        highlights: h,
        sorted: [],
        description: `Placing ${arr[i]} at output position ${pos}`,
        codeLine: 18,
        variables: { i, 'array[i]': arr[i], pos, output: `[${output.join(', ')}]` },
      })
    }

    steps.push({
      array: [...output],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Counting Sort complete.',
      codeLine: 22,
      variables: { output: `[${output.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// RADIX SORT
// ============================================================
const radixSort: Algorithm = {
  id: 'radix-sort',
  name: 'Radix Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function radixSort(array) {
  const max = Math.max(...array);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    countingSortByDigit(array, exp);
  }

  return array;
}

function countingSortByDigit(array, exp) {
  const n = array.length;
  const output = new Array(n);
  const count = new Array(10).fill(0);

  for (let i = 0; i < n; i++) {
    const digit = Math.floor(array[i] / exp) % 10;
    count[digit]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = n - 1; i >= 0; i--) {
    const digit = Math.floor(array[i] / exp) % 10;
    output[count[digit] - 1] = array[i];
    count[digit]--;
  }

  for (let i = 0; i < n; i++) {
    array[i] = output[i];
  }
}`,
  description: `Radix Sort

Radix Sort is a non-comparison-based sorting algorithm that sorts integers by processing individual digits. It uses Counting Sort as a subroutine to sort by each digit position, from least significant to most significant (LSD).

How it works:
1. Find the maximum value to determine the number of digits
2. For each digit position (ones, tens, hundreds, ...):
   a. Use Counting Sort to sort elements by that digit
   b. Preserve relative order from the previous pass (stability)
3. After processing all digit positions, the array is sorted

Time Complexity:
  Best:    O(d × (n + k))
  Average: O(d × (n + k))
  Worst:   O(d × (n + k))
  where d is the number of digits and k is the radix (10 for decimal)

Space Complexity: O(n + k) — requires extra arrays

Properties:
  - Stable sort
  - Not comparison-based
  - Not in-place
  - Very efficient for integers with a fixed number of digits

Ideal for sorting large sets of integers or strings with bounded length.`,

  generateSteps() {
    const arr = [170, 45, 75, 90, 802, 24, 2, 66]
    const steps: Step[] = []
    const n = arr.length
    const max = Math.max(...arr)

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description:
        'Initial array. Radix Sort will sort digit by digit, from least significant to most significant.',
      codeLine: 1,
      variables: { n, max, array: `[${arr.join(', ')}]` },
    })

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const digitName = exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds'
      const digits = arr.map((x) => Math.floor(x / exp) % 10)

      const allCurrentH: Record<number, HighlightType> = {}
      for (let j = 0; j < n; j++) allCurrentH[j] = 'current'

      steps.push({
        array: [...arr],
        highlights: allCurrentH,
        sorted: [],
        description: `Sorting by ${digitName} digit. Digits: [${digits.join(', ')}]`,
        codeLine: 4,
        variables: { exp, digits: `[${digits.join(', ')}]` },
      })

      // Counting sort by digit
      const output = new Array(n)
      const count = new Array(10).fill(0)

      for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10
        count[digit]++
      }

      for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1]
      }

      for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10
        output[count[digit] - 1] = arr[i]
        count[digit]--
      }

      for (let i = 0; i < n; i++) {
        arr[i] = output[i]
      }

      const allActiveH: Record<number, HighlightType> = {}
      for (let j = 0; j < n; j++) allActiveH[j] = 'active'

      steps.push({
        array: [...arr],
        highlights: allActiveH,
        sorted: [],
        description: `After sorting by ${digitName} digit: [${arr.join(', ')}]`,
        codeLine: 5,
        variables: { exp, array: `[${arr.join(', ')}]` },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Radix Sort complete.',
      codeLine: 8,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// SHELL SORT
// ============================================================
const shellSort: Algorithm = {
  id: 'shell-sort',
  name: 'Shell Sort',
  category: 'Sorting',
  visualization: 'array',
  code: `function shellSort(array) {
  const n = array.length;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j = i;

      while (j >= gap && array[j - gap] > temp) {
        array[j] = array[j - gap];
        j -= gap;
      }

      array[j] = temp;
    }
  }

  return array;
}`,
  description: `Shell Sort

Shell Sort is an optimization of Insertion Sort that allows swapping of elements that are far apart. It uses a decreasing gap sequence to progressively sort elements, finishing with a standard insertion sort (gap = 1) on a nearly-sorted array.

How it works:
1. Start with a large gap (typically n/2)
2. Perform a gapped insertion sort for each gap value
3. Reduce the gap (typically by half)
4. When gap = 1, perform a final insertion sort on the nearly-sorted array

Time Complexity:
  Best:    O(n log n)
  Average: O(n^1.25) — depends on gap sequence
  Worst:   O(n²) — with n/2 gap sequence

Space Complexity: O(1) — in-place

Properties:
  - Not stable
  - Adaptive
  - In-place
  - Performance depends heavily on gap sequence choice

A good general-purpose algorithm; much faster than Insertion Sort for medium-sized arrays.`,

  generateSteps() {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description:
        'Initial array. Shell Sort uses decreasing gap sequences to sort far-apart elements first.',
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      steps.push({
        array: [...arr],
        highlights: {},
        sorted: [],
        description: `Starting pass with gap = ${gap}`,
        codeLine: 4,
        variables: { gap },
      })

      for (let i = gap; i < n; i++) {
        const temp = arr[i]
        let j = i

        steps.push({
          array: [...arr],
          highlights: { [i]: 'current' },
          sorted: [],
          description: `Gap ${gap}: Inserting element ${arr[i]} at index ${i}`,
          codeLine: 6,
          variables: { gap, i, temp, j },
        })

        while (j >= gap && arr[j - gap] > temp) {
          steps.push({
            array: [...arr],
            highlights: { [j]: 'comparing', [j - gap]: 'comparing' },
            sorted: [],
            description: `Comparing: ${arr[j - gap]} (index ${j - gap}) > ${temp} — shift right`,
            codeLine: 9,
            variables: { gap, i, j, temp, 'array[j-gap]': arr[j - gap] },
          })

          arr[j] = arr[j - gap]
          j -= gap

          steps.push({
            array: [...arr],
            highlights: { [j + gap]: 'swapped' },
            sorted: [],
            description: `Shifted ${arr[j + gap]} to index ${j + gap}`,
            codeLine: 10,
            variables: { gap, i, j, temp },
          })
        }

        if (j !== i) {
          arr[j] = temp
          steps.push({
            array: [...arr],
            highlights: { [j]: 'selected' },
            sorted: [],
            description: `Placed ${temp} at index ${j}`,
            codeLine: 14,
            variables: { gap, i, j, temp },
          })
        }
      }

      steps.push({
        array: [...arr],
        highlights: {},
        sorted: [],
        description: `Gap ${gap} pass complete: [${arr.join(', ')}]`,
        codeLine: 16,
        variables: { gap, array: `[${arr.join(', ')}]` },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: 'Array is sorted! Shell Sort complete.',
      codeLine: 18,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// BINARY SEARCH
// ============================================================
const binarySearch: Algorithm = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Searching',
  visualization: 'array',
  code: `function binarySearch(array, target) {
  let low = 0;
  let high = array.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    if (array[mid] === target) {
      return mid; // Found!
    } else if (array[mid] < target) {
      low = mid + 1; // Search right half
    } else {
      high = mid - 1; // Search left half
    }
  }

  return -1; // Not found
}`,
  description: `Binary Search

Binary Search is an efficient algorithm for finding a target value in a sorted array. It works by repeatedly dividing the search interval in half.

Prerequisite: The array must be sorted.

How it works:
1. Compare the target with the middle element
2. If equal, we found the target
3. If target is smaller, search the left half
4. If target is larger, search the right half
5. Repeat until found or search space is empty

Time Complexity:
  Best:    O(1) — target is at the middle
  Average: O(log n)
  Worst:   O(log n)

Space Complexity: O(1) — iterative version

Binary Search is fundamental in computer science and is used extensively in databases, file systems, and as a building block for more complex algorithms.`,

  generateSteps() {
    const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    const target = 23
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: `Sorted array. Searching for target: ${target}`,
      codeLine: 1,
      variables: { target, low: 0, high: arr.length - 1 },
    })

    let low = 0
    let high = arr.length - 1

    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      const rangeH: Record<number, HighlightType> = {}

      for (let i = low; i <= high; i++) rangeH[i] = 'searching'
      rangeH[mid] = 'current'

      steps.push({
        array: [...arr],
        highlights: rangeH,
        sorted: [],
        description: `Search range [${low}..${high}], checking middle index ${mid}: value ${arr[mid]}`,
        codeLine: 6,
        variables: { low, high, mid, target, 'array[mid]': arr[mid] },
      })

      if (arr[mid] === target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'found' },
          sorted: [],
          description: `Found ${target} at index ${mid}!`,
          codeLine: 8,
          variables: { low, high, mid, target, 'array[mid]': arr[mid], result: mid },
        })
        return steps
      } else if (arr[mid] < target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: `${arr[mid]} < ${target}, searching right half`,
          codeLine: 10,
          variables: { low: mid + 1, high, mid, target, 'array[mid]': arr[mid] },
        })
        low = mid + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: `${arr[mid]} > ${target}, searching left half`,
          codeLine: 12,
          variables: { low, high: mid - 1, mid, target, 'array[mid]': arr[mid] },
        })
        high = mid - 1
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Target ${target} not found in the array.`,
      codeLine: 16,
      variables: { low, high, target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// LINEAR SEARCH
// ============================================================
const linearSearch: Algorithm = {
  id: 'linear-search',
  name: 'Linear Search',
  category: 'Searching',
  visualization: 'array',
  code: `function linearSearch(array, target) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return i; // Found!
    }
  }

  return -1; // Not found
}`,
  description: `Linear Search

Linear Search (or Sequential Search) is the simplest searching algorithm. It checks every element in the list sequentially until the target is found or the list is exhausted.

How it works:
1. Start from the first element
2. Compare each element with the target
3. If a match is found, return the index
4. If the end is reached without a match, return -1

Time Complexity:
  Best:    O(1) — target is the first element
  Average: O(n)
  Worst:   O(n) — target is last or not present

Space Complexity: O(1)

Properties:
  - Works on unsorted arrays
  - No preprocessing needed
  - Simple to implement

Linear Search is useful for small datasets or unsorted data where more efficient algorithms cannot be applied.`,

  generateSteps() {
    const arr = [14, 33, 27, 10, 35, 19, 42, 44]
    const target = 35
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Unsorted array. Searching for target: ${target}`,
      codeLine: 1,
      variables: { target, 'array.length': arr.length },
    })

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
        codeLine: 2,
        variables: { i, target, 'array[i]': arr[i] },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: `Found ${target} at index ${i}!`,
          codeLine: 3,
          variables: { i, target, 'array[i]': arr[i], result: i },
        })
        return steps
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Target ${target} not found.`,
      codeLine: 7,
      variables: { target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// JUMP SEARCH
// ============================================================
const jumpSearch: Algorithm = {
  id: 'jump-search',
  name: 'Jump Search',
  category: 'Searching',
  visualization: 'array',
  code: `function jumpSearch(array, target) {
  const n = array.length;
  const jump = Math.floor(Math.sqrt(n));
  let prev = 0;
  let curr = jump;

  // Jump in blocks of size √n
  while (curr < n && array[curr] <= target) {
    prev = curr;
    curr += jump;
  }

  // Linear search in the block
  for (let i = prev; i < Math.min(curr, n); i++) {
    if (array[i] === target) {
      return i; // Found!
    }
  }

  return -1; // Not found
}`,
  description: `Jump Search

Jump Search is a searching algorithm for sorted arrays. It works by jumping ahead in fixed-size blocks (√n) and then performing a linear search within the identified block.

Prerequisite: The array must be sorted.

How it works:
1. Calculate the block size as √n
2. Jump through the array in blocks until we find a block where the target could be
3. Once the right block is found, perform a linear search within it
4. Return the index if found, -1 otherwise

Time Complexity:
  Best:    O(1) — target is at the first position
  Average: O(√n)
  Worst:   O(√n)

Space Complexity: O(1)

Properties:
  - Works only on sorted arrays
  - Better than Linear Search, worse than Binary Search
  - Optimal block size is √n

Jump Search is useful when jumping back is costly (e.g., on tape drives). It provides a good middle ground between Linear and Binary Search.`,

  generateSteps() {
    const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    const target = 38
    const steps: Step[] = []
    const n = arr.length
    const jump = Math.floor(Math.sqrt(n))

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: `Sorted array. Searching for target: ${target}. Jump size: √${n} = ${jump}`,
      codeLine: 1,
      variables: { target, n, jump },
    })

    let prev = 0
    let curr = jump

    // Jump phase
    while (curr < n && arr[curr] <= target) {
      const blockH: Record<number, HighlightType> = {}
      for (let i = prev; i <= curr; i++) blockH[i] = 'searching'
      blockH[curr] = 'current'

      steps.push({
        array: [...arr],
        highlights: blockH,
        sorted: [],
        description: `Jumping: arr[${curr}] = ${arr[curr]} ≤ ${target}. Jump to next block.`,
        codeLine: 8,
        variables: { prev, curr, jump, 'arr[curr]': arr[curr], target },
      })

      prev = curr
      curr += jump
    }

    // Show the block we'll search
    const endIdx = Math.min(curr, n) - 1
    const searchBlockH: Record<number, HighlightType> = {}
    for (let i = prev; i <= endIdx; i++) searchBlockH[i] = 'searching'

    steps.push({
      array: [...arr],
      highlights: searchBlockH,
      sorted: [],
      description: `Target must be in block [${prev}..${endIdx}]. Starting linear search.`,
      codeLine: 12,
      variables: { prev, end: Math.min(curr, n), target },
    })

    // Linear search phase
    for (let i = prev; i < Math.min(curr, n); i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
        codeLine: 13,
        variables: { i, 'arr[i]': arr[i], target },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: `Found ${target} at index ${i}!`,
          codeLine: 14,
          variables: { i, target, result: i },
        })
        return steps
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Target ${target} not found.`,
      codeLine: 19,
      variables: { target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// INTERPOLATION SEARCH
// ============================================================
const interpolationSearch: Algorithm = {
  id: 'interpolation-search',
  name: 'Interpolation Search',
  category: 'Searching',
  visualization: 'array',
  code: `function interpolationSearch(array, target) {
  let low = 0;
  let high = array.length - 1;

  while (low <= high && target >= array[low] && target <= array[high]) {
    // Estimate position using interpolation formula
    const pos = low + Math.floor(
      ((target - array[low]) * (high - low)) /
      (array[high] - array[low])
    );

    if (array[pos] === target) {
      return pos; // Found!
    } else if (array[pos] < target) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }

  return -1; // Not found
}`,
  description: `Interpolation Search

Interpolation Search is an improved variant of Binary Search for uniformly distributed sorted arrays. Instead of always checking the middle, it estimates the position of the target based on its value relative to the range.

Prerequisite: The array must be sorted. Best performance on uniformly distributed data.

How it works:
1. Estimate the position using the interpolation formula:
   pos = low + ((target - arr[low]) × (high - low)) / (arr[high] - arr[low])
2. If the element at pos matches the target, return it
3. If the element is less than the target, search the right portion
4. If greater, search the left portion
5. Repeat until found or search space is exhausted

Time Complexity:
  Best:    O(1)
  Average: O(log log n) — for uniformly distributed data
  Worst:   O(n) — for non-uniform distribution

Space Complexity: O(1)

Interpolation Search excels on large, uniformly distributed datasets. For non-uniform data, Binary Search may be more reliable.`,

  generateSteps() {
    const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const target = 70
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: `Uniformly distributed sorted array. Searching for target: ${target}`,
      codeLine: 1,
      variables: { target, low: 0, high: n - 1 },
    })

    let low = 0
    let high = n - 1

    while (low <= high && target >= arr[low] && target <= arr[high]) {
      const pos = low + Math.floor(((target - arr[low]) * (high - low)) / (arr[high] - arr[low]))

      const rangeH: Record<number, HighlightType> = {}
      for (let i = low; i <= high; i++) rangeH[i] = 'searching'
      rangeH[pos] = 'current'

      steps.push({
        array: [...arr],
        highlights: rangeH,
        sorted: [],
        description: `Range [${low}..${high}]. Estimated position: ${pos} (value ${arr[pos]})`,
        codeLine: 7,
        variables: { low, high, pos, target, 'arr[pos]': arr[pos] },
      })

      if (arr[pos] === target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'found' },
          sorted: [],
          description: `Found ${target} at index ${pos}!`,
          codeLine: 12,
          variables: { low, high, pos, target, result: pos },
        })
        return steps
      } else if (arr[pos] < target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: `${arr[pos]} < ${target}, narrowing to right portion`,
          codeLine: 14,
          variables: { low: pos + 1, high, pos, target },
        })
        low = pos + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: `${arr[pos]} > ${target}, narrowing to left portion`,
          codeLine: 16,
          variables: { low, high: pos - 1, pos, target },
        })
        high = pos - 1
      }
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: `Target ${target} not found.`,
      codeLine: 21,
      variables: { target, result: -1 },
    })

    return steps
  },
}

// ============================================================
// BFS (Breadth-First Search)
// ============================================================
const bfs: Algorithm = {
  id: 'bfs',
  name: 'Breadth-First Search',
  category: 'Graphs',
  visualization: 'graph',
  code: `function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  const result = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift();
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}`,
  description: `Breadth-First Search (BFS)

BFS is a graph traversal algorithm that explores all vertices at the present depth before moving to vertices at the next depth level. It uses a queue data structure.

How it works:
1. Start from a source node, mark it as visited, add to queue
2. Dequeue a node, process it
3. Enqueue all unvisited neighbors
4. Repeat until the queue is empty

Time Complexity: O(V + E)
  V = number of vertices, E = number of edges

Space Complexity: O(V) — for the queue and visited set

Applications:
  - Shortest path in unweighted graphs
  - Level-order traversal of trees
  - Finding connected components
  - Web crawling
  - Social network analysis (degrees of separation)

BFS guarantees finding the shortest path (fewest edges) between two nodes in an unweighted graph.`,

  generateSteps() {
    const steps: Step[] = []
    const visited = new Set<number>()
    const visitedNodes: number[] = []
    const visitedEdges: [number, number][] = []
    const queue: number[] = [0]
    visited.add(0)

    steps.push({
      graph: {
        nodes: graphNodes,
        edges: graphEdges,
        visitedNodes: [],
        currentNode: 0,
        visitedEdges: [],
        currentEdge: null,
        queue: [0],
      },
      description: 'Starting BFS from node 0. Added to queue.',
      codeLine: 3,
      variables: { start: 0, queue: '[0]', visited: '{0}', result: '[]' },
    })

    while (queue.length > 0) {
      const node = queue.shift()!
      visitedNodes.push(node)

      steps.push({
        graph: {
          nodes: graphNodes,
          edges: graphEdges,
          visitedNodes: [...visitedNodes],
          currentNode: node,
          visitedEdges: [...visitedEdges],
          currentEdge: null,
          queue: [...queue],
        },
        description: `Dequeued node ${node}. Processing neighbors...`,
        codeLine: 8,
        variables: { node, queue: `[${queue.join(', ')}]`, result: `[${visitedNodes.join(', ')}]` },
      })

      for (const neighbor of graphAdj[node]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
          visitedEdges.push([node, neighbor])

          steps.push({
            graph: {
              nodes: graphNodes,
              edges: graphEdges,
              visitedNodes: [...visitedNodes],
              currentNode: node,
              visitedEdges: [...visitedEdges],
              currentEdge: [node, neighbor],
              queue: [...queue],
            },
            description: `Discovered node ${neighbor} via edge ${node}→${neighbor}. Added to queue.`,
            codeLine: 13,
            variables: {
              node,
              neighbor,
              queue: `[${queue.join(', ')}]`,
              visited: `{${[...visited].join(', ')}}`,
            },
          })
        }
      }
    }

    steps.push({
      graph: {
        nodes: graphNodes,
        edges: graphEdges,
        visitedNodes: [...visitedNodes],
        currentNode: null,
        visitedEdges: [...visitedEdges],
        currentEdge: null,
        queue: [],
      },
      description: `BFS complete! Visit order: ${visitedNodes.join(' → ')}`,
      codeLine: 19,
      variables: { result: `[${visitedNodes.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// DFS (Depth-First Search)
// ============================================================
const dfs: Algorithm = {
  id: 'dfs',
  name: 'Depth-First Search',
  category: 'Graphs',
  visualization: 'graph',
  code: `function dfs(graph, start) {
  const visited = new Set();
  const result = [];

  function explore(node) {
    visited.add(node);
    result.push(node);

    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        explore(neighbor);
      }
    }
  }

  explore(start);
  return result;
}`,
  description: `Depth-First Search (DFS)

DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (or recursion).

How it works:
1. Start from a source node, mark it as visited
2. Recursively visit each unvisited neighbor
3. Backtrack when no unvisited neighbors remain
4. Continue until all reachable nodes are visited

Time Complexity: O(V + E)
  V = number of vertices, E = number of edges

Space Complexity: O(V) — for the recursion stack and visited set

Applications:
  - Detecting cycles in graphs
  - Topological sorting
  - Finding connected components
  - Solving mazes and puzzles
  - Path finding

DFS explores deep paths first, which makes it useful for topological sorting and cycle detection, but it doesn't guarantee shortest paths.`,

  generateSteps() {
    const steps: Step[] = []
    const visited = new Set<number>()
    const visitedNodes: number[] = []
    const visitedEdges: [number, number][] = []
    const stack: number[] = []

    steps.push({
      graph: {
        nodes: graphNodes,
        edges: graphEdges,
        visitedNodes: [],
        currentNode: 0,
        visitedEdges: [],
        currentEdge: null,
        stack: [],
      },
      description: 'Starting DFS from node 0.',
      codeLine: 16,
      variables: { start: 0, visited: '{}', result: '[]' },
    })

    function dfsHelper(node: number) {
      visited.add(node)
      visitedNodes.push(node)
      stack.push(node)

      steps.push({
        graph: {
          nodes: graphNodes,
          edges: graphEdges,
          visitedNodes: [...visitedNodes],
          currentNode: node,
          visitedEdges: [...visitedEdges],
          currentEdge: null,
          stack: [...stack],
        },
        description: `Visiting node ${node}. Exploring its neighbors...`,
        codeLine: 6,
        variables: {
          node,
          stack: `[${stack.join(', ')}]`,
          visited: `{${[...visited].join(', ')}}`,
          result: `[${visitedNodes.join(', ')}]`,
        },
      })

      for (const neighbor of graphAdj[node]) {
        if (!visited.has(neighbor)) {
          visitedEdges.push([node, neighbor])

          steps.push({
            graph: {
              nodes: graphNodes,
              edges: graphEdges,
              visitedNodes: [...visitedNodes],
              currentNode: node,
              visitedEdges: [...visitedEdges],
              currentEdge: [node, neighbor],
              stack: [...stack],
            },
            description: `Exploring edge ${node} → ${neighbor}`,
            codeLine: 9,
            variables: {
              node,
              neighbor,
              stack: `[${stack.join(', ')}]`,
              visited: `{${[...visited].join(', ')}}`,
            },
          })

          dfsHelper(neighbor)
        }
      }

      stack.pop()

      if (stack.length > 0) {
        steps.push({
          graph: {
            nodes: graphNodes,
            edges: graphEdges,
            visitedNodes: [...visitedNodes],
            currentNode: stack[stack.length - 1],
            visitedEdges: [...visitedEdges],
            currentEdge: null,
            stack: [...stack],
          },
          description: `Backtracking from node ${node} to node ${stack[stack.length - 1]}`,
          codeLine: 12,
          variables: {
            node,
            stack: `[${stack.join(', ')}]`,
            result: `[${visitedNodes.join(', ')}]`,
          },
        })
      }
    }

    dfsHelper(0)

    steps.push({
      graph: {
        nodes: graphNodes,
        edges: graphEdges,
        visitedNodes: [...visitedNodes],
        currentNode: null,
        visitedEdges: [...visitedEdges],
        currentEdge: null,
        stack: [],
      },
      description: `DFS complete! Visit order: ${visitedNodes.join(' → ')}`,
      codeLine: 17,
      variables: { result: `[${visitedNodes.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// DIJKSTRA'S ALGORITHM
// ============================================================
const dijkstra: Algorithm = {
  id: 'dijkstra',
  name: "Dijkstra's Algorithm",
  category: 'Graphs',
  visualization: 'graph',
  code: `function dijkstra(graph, start) {
  const n = graph.length;
  const dist = new Array(n).fill(Infinity);
  const visited = new Array(n).fill(false);
  dist[start] = 0;

  for (let i = 0; i < n; i++) {
    // Pick unvisited node with minimum distance
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!visited[v] && (u === -1 || dist[v] < dist[u])) {
        u = v;
      }
    }

    visited[u] = true;

    // Relax neighbors
    for (const { node: v, weight: w } of graph[u]) {
      if (!visited[v] && dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }
  }

  return dist;
}`,
  description: `Dijkstra's Algorithm

Dijkstra's Algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.

How it works:
1. Initialize distances: source = 0, all others = ∞
2. Pick the unvisited node with the smallest distance
3. For each unvisited neighbor, calculate the distance through the current node
4. If this new distance is shorter, update it
5. Mark the current node as visited
6. Repeat until all nodes are visited

Time Complexity:
  O(V²) — with simple array
  O((V + E) log V) — with min-heap / priority queue

Space Complexity: O(V)

Applications:
  - GPS navigation systems
  - Network routing protocols
  - Finding shortest paths in maps
  - Robotics path planning

Dijkstra's is one of the most important graph algorithms and guarantees optimal shortest paths for non-negative weights.`,

  generateSteps() {
    const djNodes: GraphNode[] = [
      { id: 0, label: 'A', x: 100, y: 50 },
      { id: 1, label: 'B', x: 300, y: 50 },
      { id: 2, label: 'C', x: 50, y: 170 },
      { id: 3, label: 'D', x: 200, y: 170 },
      { id: 4, label: 'E', x: 350, y: 170 },
      { id: 5, label: 'F', x: 200, y: 290 },
    ]
    const djEdges: GraphEdge[] = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 5 },
      { from: 1, to: 4, weight: 10 },
      { from: 2, to: 3, weight: 3 },
      { from: 2, to: 5, weight: 8 },
      { from: 3, to: 4, weight: 2 },
      { from: 3, to: 5, weight: 4 },
      { from: 4, to: 5, weight: 1 },
    ]

    // Build adjacency list (bidirectional)
    const adj: Record<number, { node: number; weight: number }[]> = {}
    for (const { id } of djNodes) adj[id] = []
    for (const e of djEdges) {
      adj[e.from].push({ node: e.to, weight: e.weight! })
      adj[e.to].push({ node: e.from, weight: e.weight! })
    }

    const steps: Step[] = []
    const dist: Record<number, number | string> = {}
    const visited = new Set<number>()
    const visitedNodes: number[] = []
    const visitedEdges: [number, number][] = []

    // Initialize distances
    for (const { id } of djNodes) dist[id] = id === 0 ? 0 : '∞'

    function distStr() {
      return djNodes.map((nd) => `${nd.label}=${dist[nd.id]}`).join(', ')
    }

    steps.push({
      graph: {
        nodes: djNodes,
        edges: djEdges,
        visitedNodes: [],
        currentNode: 0,
        visitedEdges: [],
        currentEdge: null,
        distances: { ...dist },
      },
      description: 'Starting Dijkstra from node A. All distances set to ∞ except source (0).',
      codeLine: 1,
      variables: { start: 'A', distances: distStr() },
    })

    for (let step = 0; step < djNodes.length; step++) {
      // Pick unvisited node with minimum distance
      let minNode = -1
      let minDist = Infinity
      for (const { id } of djNodes) {
        if (!visited.has(id) && typeof dist[id] === 'number' && (dist[id] as number) < minDist) {
          minDist = dist[id] as number
          minNode = id
        }
      }
      if (minNode === -1) break

      visited.add(minNode)
      visitedNodes.push(minNode)

      steps.push({
        graph: {
          nodes: djNodes,
          edges: djEdges,
          visitedNodes: [...visitedNodes],
          currentNode: minNode,
          visitedEdges: [...visitedEdges],
          currentEdge: null,
          distances: { ...dist },
        },
        description: `Pick node ${djNodes[minNode].label} (distance ${dist[minNode]}). Relaxing its neighbors...`,
        codeLine: 8,
        variables: {
          node: djNodes[minNode].label,
          dist: dist[minNode] as number,
          distances: distStr(),
        },
      })

      // Relax neighbors
      for (const { node: neighbor, weight } of adj[minNode]) {
        if (visited.has(neighbor)) continue
        const newDist = (dist[minNode] as number) + weight
        const oldDist = dist[neighbor]
        const improved = oldDist === '∞' || newDist < (oldDist as number)

        if (improved) {
          dist[neighbor] = newDist
          visitedEdges.push([minNode, neighbor])

          steps.push({
            graph: {
              nodes: djNodes,
              edges: djEdges,
              visitedNodes: [...visitedNodes],
              currentNode: minNode,
              visitedEdges: [...visitedEdges],
              currentEdge: [minNode, neighbor],
              distances: { ...dist },
            },
            description: `Relaxed ${djNodes[minNode].label}→${djNodes[neighbor].label} (weight ${weight}). Distance to ${djNodes[neighbor].label}: ${oldDist} → ${newDist}`,
            codeLine: 20,
            variables: {
              from: djNodes[minNode].label,
              to: djNodes[neighbor].label,
              weight,
              newDist,
              oldDist: String(oldDist),
            },
          })
        } else {
          steps.push({
            graph: {
              nodes: djNodes,
              edges: djEdges,
              visitedNodes: [...visitedNodes],
              currentNode: minNode,
              visitedEdges: [...visitedEdges],
              currentEdge: [minNode, neighbor],
              distances: { ...dist },
            },
            description: `Edge ${djNodes[minNode].label}→${djNodes[neighbor].label} (weight ${weight}): ${newDist} ≥ ${oldDist}. No improvement.`,
            codeLine: 20,
            variables: {
              from: djNodes[minNode].label,
              to: djNodes[neighbor].label,
              weight,
              newDist,
              currentDist: String(oldDist),
            },
          })
        }
      }
    }

    steps.push({
      graph: {
        nodes: djNodes,
        edges: djEdges,
        visitedNodes: [...visitedNodes],
        currentNode: null,
        visitedEdges: [...visitedEdges],
        currentEdge: null,
        distances: { ...dist },
      },
      description: `Dijkstra complete! Shortest distances from A: ${distStr()}`,
      codeLine: 26,
      variables: { distances: distStr() },
    })

    return steps
  },
}

// ============================================================
// PRIM'S ALGORITHM
// ============================================================
const prim: Algorithm = {
  id: 'prim',
  name: "Prim's Algorithm",
  category: 'Graphs',
  visualization: 'graph',
  code: `function prim(graph, start) {
  const n = graph.length;
  const key = new Array(n).fill(Infinity);
  const inMST = new Array(n).fill(false);
  const parent = new Array(n).fill(-1);
  key[start] = 0;

  for (let i = 0; i < n; i++) {
    // Pick node with minimum key not in MST
    let u = -1;
    for (let v = 0; v < n; v++) {
      if (!inMST[v] && (u === -1 || key[v] < key[u])) {
        u = v;
      }
    }

    inMST[u] = true;

    // Update neighbor keys
    for (const { node: v, weight: w } of graph[u]) {
      if (!inMST[v] && w < key[v]) {
        key[v] = w;
        parent[v] = u;
      }
    }
  }

  return parent;
}`,
  description: `Prim's Algorithm

Prim's Algorithm finds the Minimum Spanning Tree (MST) of a connected, weighted, undirected graph. The MST connects all nodes with the minimum total edge weight.

How it works:
1. Start with an arbitrary node and add it to the MST set
2. Among all edges connecting MST nodes to non-MST nodes, pick the one with minimum weight
3. Add the selected edge and its new node to the MST
4. Repeat until all nodes are in the MST

Time Complexity:
  O(V²) — with simple array
  O(E log V) — with min-heap / priority queue

Space Complexity: O(V)

Applications:
  - Network design (minimum cost wiring)
  - Cluster analysis
  - Approximation algorithms for NP-hard problems
  - Image segmentation

Prim's Algorithm is a greedy algorithm that always picks the locally optimal edge, which leads to the globally optimal MST.`,

  generateSteps() {
    const prNodes: GraphNode[] = [
      { id: 0, label: 'A', x: 100, y: 50 },
      { id: 1, label: 'B', x: 300, y: 50 },
      { id: 2, label: 'C', x: 50, y: 170 },
      { id: 3, label: 'D', x: 200, y: 170 },
      { id: 4, label: 'E', x: 350, y: 170 },
      { id: 5, label: 'F', x: 200, y: 290 },
    ]
    const prEdges: GraphEdge[] = [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 5 },
      { from: 1, to: 4, weight: 10 },
      { from: 2, to: 3, weight: 3 },
      { from: 2, to: 5, weight: 8 },
      { from: 3, to: 4, weight: 2 },
      { from: 3, to: 5, weight: 4 },
      { from: 4, to: 5, weight: 1 },
    ]

    // Build adjacency list (bidirectional)
    const adj: Record<number, { node: number; weight: number }[]> = {}
    for (const { id } of prNodes) adj[id] = []
    for (const e of prEdges) {
      adj[e.from].push({ node: e.to, weight: e.weight! })
      adj[e.to].push({ node: e.from, weight: e.weight! })
    }

    const steps: Step[] = []
    const key: Record<number, number | string> = {}
    const parent: Record<number, number | null> = {}
    const inMST = new Set<number>()
    const visitedNodes: number[] = []
    const visitedEdges: [number, number][] = []

    // Initialize keys
    for (const { id } of prNodes) {
      key[id] = id === 0 ? 0 : '∞'
      parent[id] = null
    }

    function keyStr() {
      return prNodes.map((nd) => `${nd.label}=${key[nd.id]}`).join(', ')
    }

    steps.push({
      graph: {
        nodes: prNodes,
        edges: prEdges,
        visitedNodes: [],
        currentNode: 0,
        visitedEdges: [],
        currentEdge: null,
        distances: { ...key },
      },
      description: "Starting Prim's MST from node A. All key values set to ∞ except source (0).",
      codeLine: 1,
      variables: { start: 'A', keys: keyStr() },
    })

    for (let step = 0; step < prNodes.length; step++) {
      // Pick node with minimum key not in MST
      let minNode = -1
      let minKey = Infinity
      for (const { id } of prNodes) {
        if (!inMST.has(id) && typeof key[id] === 'number' && (key[id] as number) < minKey) {
          minKey = key[id] as number
          minNode = id
        }
      }
      if (minNode === -1) break

      inMST.add(minNode)
      visitedNodes.push(minNode)

      // Add MST edge (except for the starting node)
      if (parent[minNode] !== null) {
        visitedEdges.push([parent[minNode]!, minNode])
      }

      steps.push({
        graph: {
          nodes: prNodes,
          edges: prEdges,
          visitedNodes: [...visitedNodes],
          currentNode: minNode,
          visitedEdges: [...visitedEdges],
          currentEdge: parent[minNode] !== null ? [parent[minNode]!, minNode] : null,
          distances: { ...key },
        },
        description:
          parent[minNode] !== null
            ? `Added ${prNodes[minNode].label} to MST via edge ${prNodes[parent[minNode]!].label}→${prNodes[minNode].label} (weight ${key[minNode]})`
            : `Starting MST from node ${prNodes[minNode].label}`,
        codeLine: 8,
        variables: { node: prNodes[minNode].label, key: key[minNode] as number, keys: keyStr() },
      })

      // Update neighbor keys
      for (const { node: neighbor, weight } of adj[minNode]) {
        if (inMST.has(neighbor)) continue

        if (key[neighbor] === '∞' || weight < (key[neighbor] as number)) {
          const oldKey = key[neighbor]
          key[neighbor] = weight
          parent[neighbor] = minNode

          steps.push({
            graph: {
              nodes: prNodes,
              edges: prEdges,
              visitedNodes: [...visitedNodes],
              currentNode: minNode,
              visitedEdges: [...visitedEdges],
              currentEdge: [minNode, neighbor],
              distances: { ...key },
            },
            description: `Updated key of ${prNodes[neighbor].label}: ${oldKey} → ${weight} (via ${prNodes[minNode].label})`,
            codeLine: 21,
            variables: {
              from: prNodes[minNode].label,
              to: prNodes[neighbor].label,
              weight,
              oldKey: String(oldKey),
              keys: keyStr(),
            },
          })
        }
      }
    }

    const totalWeight = visitedEdges.reduce((sum, [from, to]) => {
      const edge = prEdges.find(
        (e) => (e.from === from && e.to === to) || (e.from === to && e.to === from),
      )
      return sum + (edge?.weight || 0)
    }, 0)

    steps.push({
      graph: {
        nodes: prNodes,
        edges: prEdges,
        visitedNodes: [...visitedNodes],
        currentNode: null,
        visitedEdges: [...visitedEdges],
        currentEdge: null,
        distances: { ...key },
      },
      description: `Prim's complete! MST total weight: ${totalWeight}. Edges: ${visitedEdges.map(([f, t]) => `${prNodes[f].label}-${prNodes[t].label}`).join(', ')}`,
      codeLine: 28,
      variables: { totalWeight, mstEdges: visitedEdges.length },
    })

    return steps
  },
}

// ============================================================
// TOPOLOGICAL SORT
// ============================================================
const topologicalSort: Algorithm = {
  id: 'topological-sort',
  name: 'Topological Sort',
  category: 'Graphs',
  visualization: 'graph',
  code: `function topologicalSort(graph, numNodes) {
  const inDegree = new Array(numNodes).fill(0);

  // Compute in-degrees
  for (let u = 0; u < numNodes; u++) {
    for (const v of graph[u]) {
      inDegree[v]++;
    }
  }

  // Start with nodes of in-degree 0
  const queue = [];
  for (let i = 0; i < numNodes; i++) {
    if (inDegree[i] === 0) queue.push(i);
  }

  const order = [];
  while (queue.length > 0) {
    const node = queue.shift();
    order.push(node);

    for (const neighbor of graph[node]) {
      inDegree[neighbor]--;
      if (inDegree[neighbor] === 0) {
        queue.push(neighbor);
      }
    }
  }

  return order;
}`,
  description: `Topological Sort (Kahn's Algorithm)

Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u→v, vertex u comes before vertex v in the ordering.

This implementation uses Kahn's algorithm (BFS-based approach).

How it works:
1. Compute the in-degree of every node
2. Add all nodes with in-degree 0 to a queue
3. Dequeue a node, add it to the ordering
4. Reduce the in-degree of all its neighbors
5. If any neighbor's in-degree becomes 0, add it to the queue
6. Repeat until the queue is empty

Time Complexity: O(V + E)
  V = number of vertices, E = number of edges

Space Complexity: O(V)

Applications:
  - Task scheduling with dependencies
  - Build systems (determining compilation order)
  - Course prerequisite planning
  - Package dependency resolution

If the graph has a cycle, a topological ordering is not possible (not all nodes will be included in the result).`,

  generateSteps() {
    const tsNodes: GraphNode[] = [
      { id: 0, label: 'A', x: 50, y: 50 },
      { id: 1, label: 'B', x: 200, y: 50 },
      { id: 2, label: 'C', x: 350, y: 50 },
      { id: 3, label: 'D', x: 125, y: 170 },
      { id: 4, label: 'E', x: 275, y: 170 },
      { id: 5, label: 'F', x: 200, y: 290 },
    ]
    const tsEdges: GraphEdge[] = [
      { from: 0, to: 3 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 4 },
      { from: 3, to: 5 },
      { from: 4, to: 5 },
    ]

    // Build adjacency list (directed)
    const adj: Record<number, number[]> = {}
    const inDegree: Record<number, number> = {}
    for (const { id } of tsNodes) {
      adj[id] = []
      inDegree[id] = 0
    }
    for (const e of tsEdges) {
      adj[e.from].push(e.to)
      inDegree[e.to]++
    }

    const steps: Step[] = []
    const visitedNodes: number[] = []
    const visitedEdges: [number, number][] = []
    const order: number[] = []
    const queue: number[] = []

    function inDegStr() {
      return tsNodes.map((nd) => `${nd.label}=${inDegree[nd.id]}`).join(', ')
    }

    steps.push({
      graph: {
        nodes: tsNodes,
        edges: tsEdges,
        visitedNodes: [],
        currentNode: null,
        visitedEdges: [],
        currentEdge: null,
        queue: [],
      },
      description: `DAG with ${tsNodes.length} nodes. Computing in-degrees for Kahn's algorithm.`,
      codeLine: 1,
      variables: { inDegrees: inDegStr() },
    })

    // Find nodes with in-degree 0
    for (const { id } of tsNodes) {
      if (inDegree[id] === 0) queue.push(id)
    }

    steps.push({
      graph: {
        nodes: tsNodes,
        edges: tsEdges,
        visitedNodes: [],
        currentNode: null,
        visitedEdges: [],
        currentEdge: null,
        queue: [...queue],
      },
      description: `Nodes with in-degree 0: [${queue.map((id) => tsNodes[id].label).join(', ')}]. Added to queue.`,
      codeLine: 12,
      variables: {
        queue: `[${queue.map((id) => tsNodes[id].label).join(', ')}]`,
        inDegrees: inDegStr(),
      },
    })

    while (queue.length > 0) {
      const node = queue.shift()!
      order.push(node)
      visitedNodes.push(node)

      steps.push({
        graph: {
          nodes: tsNodes,
          edges: tsEdges,
          visitedNodes: [...visitedNodes],
          currentNode: node,
          visitedEdges: [...visitedEdges],
          currentEdge: null,
          queue: [...queue],
        },
        description: `Dequeued ${tsNodes[node].label}. Order: [${order.map((id) => tsNodes[id].label).join(', ')}]`,
        codeLine: 18,
        variables: {
          node: tsNodes[node].label,
          order: `[${order.map((id) => tsNodes[id].label).join(', ')}]`,
          queue: `[${queue.map((id) => tsNodes[id].label).join(', ')}]`,
        },
      })

      for (const neighbor of adj[node]) {
        inDegree[neighbor]--
        visitedEdges.push([node, neighbor])

        if (inDegree[neighbor] === 0) {
          queue.push(neighbor)
        }

        steps.push({
          graph: {
            nodes: tsNodes,
            edges: tsEdges,
            visitedNodes: [...visitedNodes],
            currentNode: node,
            visitedEdges: [...visitedEdges],
            currentEdge: [node, neighbor],
            queue: [...queue],
          },
          description: `Reduced in-degree of ${tsNodes[neighbor].label} to ${inDegree[neighbor]}${inDegree[neighbor] === 0 ? ' → added to queue' : ''}`,
          codeLine: 22,
          variables: {
            from: tsNodes[node].label,
            to: tsNodes[neighbor].label,
            inDeg: inDegree[neighbor],
            inDegrees: inDegStr(),
          },
        })
      }
    }

    steps.push({
      graph: {
        nodes: tsNodes,
        edges: tsEdges,
        visitedNodes: [...visitedNodes],
        currentNode: null,
        visitedEdges: [...visitedEdges],
        currentEdge: null,
        queue: [],
      },
      description: `Topological sort complete! Order: ${order.map((id) => tsNodes[id].label).join(' → ')}`,
      codeLine: 30,
      variables: { order: `[${order.map((id) => tsNodes[id].label).join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// N-QUEENS
// ============================================================
const nQueens: Algorithm = {
  id: 'n-queens',
  name: 'N-Queens Problem',
  category: 'Backtracking',
  visualization: 'matrix',
  code: `function solveNQueens(n) {
  const board = Array(n).fill(null)
    .map(() => Array(n).fill('.'));

  function isSafe(row, col) {
    for (let i = 0; i < row; i++)
      if (board[i][col] === 'Q') return false;

    for (let i = row-1, j = col-1; i >= 0 && j >= 0; i--, j--)
      if (board[i][j] === 'Q') return false;

    for (let i = row-1, j = col+1; i >= 0 && j < n; i--, j++)
      if (board[i][j] === 'Q') return false;

    return true;
  }

  function solve(row) {
    if (row === n) return true;

    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        board[row][col] = 'Q';
        if (solve(row + 1)) return true;
        board[row][col] = '.'; // Backtrack
      }
    }

    return false;
  }

  solve(0);
  return board;
}`,
  description: `N-Queens Problem

The N-Queens problem asks: how can N chess queens be placed on an N×N chessboard so that no two queens threaten each other?

A queen can attack any piece in the same row, column, or diagonal. Therefore, a solution requires that no two queens share the same row, column, or diagonal.

How it works (Backtracking):
1. Place queens one row at a time
2. For each row, try each column
3. Check if the position is safe (no conflicts)
4. If safe, place the queen and move to the next row
5. If no safe column exists, backtrack to the previous row

This visualization shows the 4-Queens problem on a 4×4 board.

Time Complexity: O(N!) — in the worst case
Space Complexity: O(N²) — for the board

The N-Queens problem is a classic example of backtracking algorithms and constraint satisfaction problems.`,

  generateSteps() {
    const N = 5
    const board: (number | string)[][] = Array.from({ length: N }, () =>
      Array.from({ length: N }, () => 0),
    )
    const steps: Step[] = []

    let currentVars: Record<string, string | number | boolean | null> = {}

    function makeStep(
      highlights: Record<string, HighlightType>,
      desc: string,
      line: number,
      vars?: Record<string, string | number | boolean | null>,
    ) {
      if (vars) currentVars = vars
      steps.push({
        matrix: {
          rows: N,
          cols: N,
          values: board.map((r) => [...r]),
          highlights: { ...highlights },
        },
        description: desc,
        codeLine: line,
        variables: { ...currentVars },
      })
    }

    function getQueenHighlights(): Record<string, HighlightType> {
      const h: Record<string, HighlightType> = {}
      for (let r = 0; r < N; r++) {
        for (let c = 0; c < N; c++) {
          if (board[r][c] === 'Q') h[`${r},${c}`] = 'placed'
        }
      }
      return h
    }

    makeStep({}, `Empty ${N}x${N} board. Place ${N} queens with no conflicts.`, 1, { n: N })

    function isSafe(row: number, col: number): boolean {
      for (let i = 0; i < row; i++) {
        if (board[i][col] === 'Q') return false
      }
      for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 'Q') return false
      }
      for (let i = row - 1, j = col + 1; i >= 0 && j < N; i--, j++) {
        if (board[i][j] === 'Q') return false
      }
      return true
    }

    function solve(row: number): boolean {
      if (row === N) return true

      for (let col = 0; col < N; col++) {
        const qh = getQueenHighlights()
        qh[`${row},${col}`] = 'checking'
        makeStep(qh, `Row ${row}: trying column ${col}`, 20, { row, col, isSafe: '?' })

        if (isSafe(row, col)) {
          board[row][col] = 'Q'
          const ph = getQueenHighlights()
          makeStep(ph, `Placed queen at (${row}, ${col})`, 22, { row, col, isSafe: true })

          if (solve(row + 1)) return true

          board[row][col] = 0
          const rh = getQueenHighlights()
          rh[`${row},${col}`] = 'conflict'
          makeStep(rh, `Backtracking: removed queen from (${row}, ${col})`, 24, {
            row,
            col,
            action: 'backtrack',
          })
        } else {
          const ch = getQueenHighlights()
          ch[`${row},${col}`] = 'conflict'
          makeStep(ch, `(${row}, ${col}) not safe — conflicts with existing queen`, 21, {
            row,
            col,
            isSafe: false,
          })
        }
      }

      return false
    }

    solve(0)

    const fh: Record<string, HighlightType> = {}
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        if (board[r][c] === 'Q') fh[`${r},${c}`] = 'found'
      }
    }
    makeStep(fh, `Solution found! All ${N} queens placed without conflicts.`, 29, {
      n: N,
      solved: true,
    })

    return steps
  },
}

// ============================================================
// FIBONACCI DP
// ============================================================
const fibonacciDp: Algorithm = {
  id: 'fibonacci-dp',
  name: 'Fibonacci DP',
  category: 'Dynamic Programming',
  visualization: 'array',
  code: `function fibonacci(n) {
  const dp = new Array(n + 1).fill(0);
  dp[1] = 1;

  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }

  return dp;
}`,
  description: `Fibonacci DP (Bottom-Up Tabulation)

The Fibonacci sequence is one of the most classic examples of Dynamic Programming. Each number is the sum of the two preceding ones: F(0)=0, F(1)=1, F(n) = F(n-1) + F(n-2).

How it works (Bottom-Up Tabulation):
1. Create an array dp of size n+1, initialize dp[0]=0, dp[1]=1
2. For each i from 2 to n, compute dp[i] = dp[i-1] + dp[i-2]
3. Each subproblem is solved exactly once and stored

Time Complexity: O(n)
Space Complexity: O(n)

This approach avoids the exponential time of naive recursion by storing previously computed values. It demonstrates the core DP principle: solve smaller subproblems first and build up to the answer.`,

  generateSteps() {
    const n = 10
    const arr = [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    const steps: Step[] = []
    const sorted: number[] = [0, 1]

    steps.push({
      array: [...arr],
      highlights: { 0: 'sorted', 1: 'sorted' },
      sorted: [0, 1],
      description:
        'Initial array: dp[0]=0, dp[1]=1. Fill remaining using dp[i] = dp[i-1] + dp[i-2].',
      codeLine: 1,
      variables: { n, 'dp[0]': 0, 'dp[1]': 1 },
    })

    for (let i = 2; i <= n; i++) {
      steps.push({
        array: [...arr],
        highlights: { [i - 1]: 'comparing', [i - 2]: 'comparing', [i]: 'current' },
        sorted: [...sorted],
        description: `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${arr[i - 1]} + ${arr[i - 2]}`,
        codeLine: 5,
        variables: { i, 'dp[i-1]': arr[i - 1], 'dp[i-2]': arr[i - 2] },
      })

      arr[i] = arr[i - 1] + arr[i - 2]
      sorted.push(i)

      steps.push({
        array: [...arr],
        highlights: { [i]: 'sorted' },
        sorted: [...sorted],
        description: `dp[${i}] = ${arr[i]}`,
        codeLine: 5,
        variables: { i, 'dp[i]': arr[i] },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n + 1 }, (_, i) => i),
      description: `Fibonacci sequence complete! F(${n}) = ${arr[n]}`,
      codeLine: 8,
      variables: { n, 'F(n)': arr[n], dp: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

// ============================================================
// KNAPSACK 0/1
// ============================================================
const knapsack: Algorithm = {
  id: 'knapsack',
  name: 'Knapsack 0/1',
  category: 'Dynamic Programming',
  visualization: 'matrix',
  code: `function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array(n + 1).fill(null)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      if (weights[i - 1] <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          dp[i - 1][w - weights[i - 1]] + values[i - 1]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  return dp[n][capacity];
}`,
  description: `Knapsack 0/1

The 0/1 Knapsack problem: given items with weights and values, and a knapsack with a weight capacity, find the maximum value that can be carried. Each item can either be taken (1) or left (0).

How it works:
1. Create a DP table of (n+1) rows × (capacity+1) columns
2. dp[i][w] = maximum value using first i items with capacity w
3. For each item, either skip it (dp[i-1][w]) or take it (dp[i-1][w-weight] + value)
4. Choose the maximum of both options

Items: weights=[2, 3, 4, 5], values=[3, 4, 5, 6], capacity=8

Time Complexity: O(n × W) where n = items, W = capacity
Space Complexity: O(n × W)

Classic DP optimization problem used in resource allocation, budgeting, and cargo loading.`,

  generateSteps() {
    const weights = [2, 3, 4, 5]
    const values = [3, 4, 5, 6]
    const capacity = 8
    const n = weights.length
    const dp: number[][] = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0))
    const steps: Step[] = []

    steps.push({
      matrix: {
        rows: n + 1,
        cols: capacity + 1,
        values: dp.map((r) => [...r]),
        highlights: {},
      },
      description: 'DP table initialized to 0. Rows = items (0..4), Cols = capacity (0..8).',
      codeLine: 1,
      variables: { weights: '[2,3,4,5]', values: '[3,4,5,6]', capacity },
    })

    for (let i = 1; i <= n; i++) {
      for (let w = 0; w <= capacity; w++) {
        const h: Record<string, HighlightType> = {}
        h[`${i},${w}`] = 'current'

        if (weights[i - 1] <= w) {
          const skip = dp[i - 1][w]
          const take = dp[i - 1][w - weights[i - 1]] + values[i - 1]
          h[`${i - 1},${w}`] = 'comparing'
          h[`${i - 1},${w - weights[i - 1]}`] = 'comparing'
          dp[i][w] = Math.max(skip, take)

          steps.push({
            matrix: {
              rows: n + 1,
              cols: capacity + 1,
              values: dp.map((r) => [...r]),
              highlights: h,
            },
            description: `Item ${i} (w=${weights[i - 1]}, v=${values[i - 1]}), cap=${w}: max(skip=${skip}, take=${take}) = ${dp[i][w]}`,
            codeLine: 9,
            variables: { i, w, skip, take, 'dp[i][w]': dp[i][w] },
          })
        } else {
          dp[i][w] = dp[i - 1][w]
          h[`${i - 1},${w}`] = 'comparing'

          steps.push({
            matrix: {
              rows: n + 1,
              cols: capacity + 1,
              values: dp.map((r) => [...r]),
              highlights: h,
            },
            description: `Item ${i} (w=${weights[i - 1]}) too heavy for cap=${w}. dp[${i}][${w}] = ${dp[i][w]}`,
            codeLine: 14,
            variables: { i, w, weight: weights[i - 1], 'dp[i][w]': dp[i][w] },
          })
        }
      }
    }

    const finalH: Record<string, HighlightType> = {}
    finalH[`${n},${capacity}`] = 'found'
    steps.push({
      matrix: {
        rows: n + 1,
        cols: capacity + 1,
        values: dp.map((r) => [...r]),
        highlights: finalH,
      },
      description: `Knapsack complete! Maximum value: ${dp[n][capacity]}`,
      codeLine: 20,
      variables: { max_value: dp[n][capacity] },
    })

    return steps
  },
}

// ============================================================
// LCS - LONGEST COMMON SUBSEQUENCE
// ============================================================
const lcs: Algorithm = {
  id: 'lcs',
  name: 'Longest Common Subsequence',
  category: 'Dynamic Programming',
  visualization: 'matrix',
  code: `function lcs(str1, str2) {
  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null)
    .map(() => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  return dp[m][n];
}`,
  description: `Longest Common Subsequence (LCS)

The LCS problem finds the longest subsequence common to two sequences. A subsequence appears in the same relative order but not necessarily contiguously.

How it works:
1. Create a DP table of (m+1) × (n+1) where m, n are string lengths
2. If characters match: dp[i][j] = dp[i-1][j-1] + 1
3. If they don't: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. The answer is in dp[m][n]

Strings: "ABCB" and "BDCB"

Time Complexity: O(m × n)
Space Complexity: O(m × n)

Used in diff tools, DNA sequence alignment, version control systems, and spell checking.`,

  generateSteps() {
    const str1 = 'ABCB'
    const str2 = 'BDCB'
    const m = str1.length
    const n = str2.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))
    const steps: Step[] = []

    steps.push({
      matrix: {
        rows: m + 1,
        cols: n + 1,
        values: dp.map((r) => [...r]),
        highlights: {},
      },
      description: `DP table initialized. Comparing "${str1}" (rows) with "${str2}" (cols).`,
      codeLine: 1,
      variables: { str1, str2, m, n },
    })

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const h: Record<string, HighlightType> = {}
        h[`${i},${j}`] = 'current'

        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1
          h[`${i - 1},${j - 1}`] = 'comparing'

          steps.push({
            matrix: {
              rows: m + 1,
              cols: n + 1,
              values: dp.map((r) => [...r]),
              highlights: { ...h, [`${i},${j}`]: 'found' },
            },
            description: `'${str1[i - 1]}' = '${str2[j - 1]}' — Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i][j]}`,
            codeLine: 10,
            variables: { i, j, char1: str1[i - 1], char2: str2[j - 1], 'dp[i][j]': dp[i][j] },
          })
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
          h[`${i - 1},${j}`] = 'comparing'
          h[`${i},${j - 1}`] = 'comparing'

          steps.push({
            matrix: {
              rows: m + 1,
              cols: n + 1,
              values: dp.map((r) => [...r]),
              highlights: h,
            },
            description: `'${str1[i - 1]}' ≠ '${str2[j - 1]}' — dp[${i}][${j}] = max(${dp[i - 1][j]}, ${dp[i][j - 1]}) = ${dp[i][j]}`,
            codeLine: 12,
            variables: { i, j, char1: str1[i - 1], char2: str2[j - 1], 'dp[i][j]': dp[i][j] },
          })
        }
      }
    }

    const finalH: Record<string, HighlightType> = {}
    finalH[`${m},${n}`] = 'found'
    steps.push({
      matrix: {
        rows: m + 1,
        cols: n + 1,
        values: dp.map((r) => [...r]),
        highlights: finalH,
      },
      description: `LCS complete! Length of longest common subsequence: ${dp[m][n]}`,
      codeLine: 18,
      variables: { LCS_length: dp[m][n] },
    })

    return steps
  },
}

// ============================================================
// SUDOKU SOLVER (4x4)
// ============================================================
const sudokuSolver: Algorithm = {
  id: 'sudoku-solver',
  name: 'Sudoku Solver',
  category: 'Backtracking',
  visualization: 'matrix',
  code: `function solveSudoku(board) {
  function isValid(row, col, num) {
    for (let c = 0; c < 4; c++)
      if (board[row][c] === num) return false;

    for (let r = 0; r < 4; r++)
      if (board[r][col] === num) return false;

    const boxR = Math.floor(row / 2) * 2;
    const boxC = Math.floor(col / 2) * 2;
    for (let r = boxR; r < boxR + 2; r++)
      for (let c = boxC; c < boxC + 2; c++)
        if (board[r][c] === num) return false;

    return true;
  }

  function solve() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (board[r][c] === 0) {
          for (let num = 1; num <= 4; num++) {
            if (isValid(r, c, num)) {
              board[r][c] = num;
              if (solve()) return true;
              board[r][c] = 0; // Backtrack
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  solve();
  return board;
}`,
  description: `Sudoku Solver (4×4)

Solves a 4×4 Sudoku puzzle using backtracking. The board is divided into four 2×2 boxes, and each row, column, and box must contain the numbers 1 through 4 exactly once.

How it works (Backtracking):
1. Find the next empty cell
2. Try placing numbers 1 through 4
3. Check constraints: no duplicate in row, column, or 2×2 box
4. If valid, place the number and recurse
5. If no valid number exists, backtrack (undo) and try the next option

Time Complexity: O(k^(n×n)) worst case, where k=4 and n=4
Space Complexity: O(n×n) for the board

Sudoku solving is a classic example of constraint satisfaction via backtracking. The 4×4 variant provides a clear, compact visualization of the algorithm.`,

  generateSteps() {
    const board: (number | string)[][] = [
      [0, 0, 3, 0],
      [3, 0, 0, 2],
      [0, 3, 0, 0],
      [0, 0, 2, 0],
    ]
    const initial = board.map((r) => [...r])
    const steps: Step[] = []

    function getHighlights(): Record<string, HighlightType> {
      const h: Record<string, HighlightType> = {}
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (initial[r][c] !== 0) {
            h[`${r},${c}`] = 'given'
          } else if (board[r][c] !== 0) {
            h[`${r},${c}`] = 'placed'
          }
        }
      }
      return h
    }

    function displayBoard(): (number | string)[][] {
      return board.map((r) => r.map((v) => (v === 0 ? '' : v)))
    }

    steps.push({
      matrix: {
        rows: 4,
        cols: 4,
        values: displayBoard(),
        highlights: getHighlights(),
      },
      description:
        '4×4 Sudoku puzzle. Fill with numbers 1-4, no repeats in rows, columns, or 2×2 boxes.',
      codeLine: 1,
      variables: { size: 4, boxSize: 2 },
    })

    function isValid(row: number, col: number, num: number): boolean {
      for (let c = 0; c < 4; c++) {
        if (board[row][c] === num) return false
      }
      for (let r = 0; r < 4; r++) {
        if (board[r][col] === num) return false
      }
      const boxR = Math.floor(row / 2) * 2
      const boxC = Math.floor(col / 2) * 2
      for (let r = boxR; r < boxR + 2; r++) {
        for (let c = boxC; c < boxC + 2; c++) {
          if (board[r][c] === num) return false
        }
      }
      return true
    }

    function solve(): boolean {
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          if (board[r][c] === 0) {
            for (let num = 1; num <= 4; num++) {
              const tryH = getHighlights()
              tryH[`${r},${c}`] = 'checking'
              const tryValues = displayBoard()
              ;(tryValues[r] as (number | string)[])[c] = num

              steps.push({
                matrix: {
                  rows: 4,
                  cols: 4,
                  values: tryValues,
                  highlights: tryH,
                },
                description: `Trying ${num} at (${r}, ${c})`,
                codeLine: 22,
                variables: { row: r, col: c, num },
              })

              if (isValid(r, c, num)) {
                board[r][c] = num
                const ph = getHighlights()

                steps.push({
                  matrix: {
                    rows: 4,
                    cols: 4,
                    values: displayBoard(),
                    highlights: ph,
                  },
                  description: `Placed ${num} at (${r}, ${c}) — valid!`,
                  codeLine: 24,
                  variables: { row: r, col: c, num, valid: true },
                })

                if (solve()) return true

                board[r][c] = 0
                const bh = getHighlights()
                bh[`${r},${c}`] = 'conflict'

                steps.push({
                  matrix: {
                    rows: 4,
                    cols: 4,
                    values: displayBoard(),
                    highlights: bh,
                  },
                  description: `Backtrack: removed ${num} from (${r}, ${c})`,
                  codeLine: 26,
                  variables: { row: r, col: c, num, action: 'backtrack' },
                })
              } else {
                const ch = getHighlights()
                ch[`${r},${c}`] = 'conflict'

                steps.push({
                  matrix: {
                    rows: 4,
                    cols: 4,
                    values: displayBoard(),
                    highlights: ch,
                  },
                  description: `${num} at (${r}, ${c}) — conflict!`,
                  codeLine: 23,
                  variables: { row: r, col: c, num, valid: false },
                })
              }
            }
            return false
          }
        }
      }
      return true
    }

    solve()

    const finalH: Record<string, HighlightType> = {}
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        finalH[`${r},${c}`] = 'found'
      }
    }
    steps.push({
      matrix: {
        rows: 4,
        cols: 4,
        values: displayBoard(),
        highlights: finalH,
      },
      description: 'Sudoku solved! All cells filled with valid numbers.',
      codeLine: 33,
      variables: { solved: true },
    })

    return steps
  },
}

// ============================================================
// MAZE PATHFINDING (BFS)
// ============================================================
const mazePathfinding: Algorithm = {
  id: 'maze-pathfinding',
  name: 'Maze Pathfinding',
  category: 'Backtracking',
  visualization: 'matrix',
  code: `function mazeBFS(maze, start, end) {
  const rows = maze.length;
  const cols = maze[0].length;
  const visited = Array(rows).fill(null)
    .map(() => Array(cols).fill(false));
  const parent = Array(rows).fill(null)
    .map(() => Array(cols).fill(null));

  const queue = [start];
  visited[start[0]][start[1]] = true;
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];

  while (queue.length > 0) {
    const [r, c] = queue.shift();

    if (r === end[0] && c === end[1]) {
      // Reconstruct path
      const path = [];
      let curr = end;
      while (curr) {
        path.unshift(curr);
        curr = parent[curr[0]][curr[1]];
      }
      return path;
    }

    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < rows && nc >= 0 &&
          nc < cols && !visited[nr][nc] &&
          maze[nr][nc] === 0) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }

  return null; // No path found
}`,
  description: `Maze Pathfinding (BFS)

Finds the shortest path through a maze using Breadth-First Search. The maze is a grid where 0 = open cell and 1 = wall. The algorithm explores cells level by level, guaranteeing the shortest path.

How it works:
1. Start BFS from the start cell
2. Explore all 4 neighbors (up, down, left, right)
3. Skip walls and already-visited cells
4. Track parent of each cell to reconstruct the path
5. When the end cell is reached, trace back the shortest path

Maze: 6×6 grid, Start: (0,0), End: (5,5)

Time Complexity: O(rows × cols)
Space Complexity: O(rows × cols)

BFS guarantees the shortest path in an unweighted grid. Used in robotics, game AI, and navigation systems.`,

  generateSteps() {
    const maze = [
      [0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0],
      [1, 1, 0, 0, 0, 1],
      [0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 1, 0],
    ]
    const rows = 6,
      cols = 6
    const startR = 0,
      startC = 0
    const endR = 5,
      endC = 5
    const steps: Step[] = []

    function toDisplayValues(): (number | string)[][] {
      return maze.map((row, r) =>
        row.map((cell, c) => {
          if (r === startR && c === startC) return 'S'
          if (r === endR && c === endC) return 'E'
          if (cell === 1) return 'W'
          return ''
        }),
      )
    }

    // Initial state
    const initH: Record<string, HighlightType> = {}
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (maze[r][c] === 1) initH[`${r},${c}`] = 'wall'
      }
    }
    initH[`${startR},${startC}`] = 'start'
    initH[`${endR},${endC}`] = 'end'

    steps.push({
      matrix: {
        rows,
        cols,
        values: toDisplayValues(),
        highlights: initH,
      },
      description: 'Maze initialized. Finding shortest path from S(0,0) to E(5,5) using BFS.',
      codeLine: 1,
      variables: { start: '(0,0)', end: '(5,5)', rows, cols },
    })

    // BFS
    const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false))
    const parent: ([number, number] | null)[][] = Array.from({ length: rows }, () =>
      Array(cols).fill(null),
    )
    const queue: [number, number][] = [[startR, startC]]
    visited[startR][startC] = true
    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]
    let found = false

    while (queue.length > 0) {
      const [cr, cc] = queue.shift()!

      const h: Record<string, HighlightType> = {}
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (maze[r][c] === 1) h[`${r},${c}`] = 'wall'
          else if (visited[r][c] && !(r === cr && c === cc)) h[`${r},${c}`] = 'visited'
        }
      }
      h[`${startR},${startC}`] = 'start'
      h[`${endR},${endC}`] = 'end'
      h[`${cr},${cc}`] = 'current'

      steps.push({
        matrix: {
          rows,
          cols,
          values: toDisplayValues(),
          highlights: h,
        },
        description: `Exploring cell (${cr}, ${cc})`,
        codeLine: 14,
        variables: { row: cr, col: cc, queueSize: queue.length },
      })

      if (cr === endR && cc === endC) {
        found = true
        break
      }

      for (const [dr, dc] of directions) {
        const nr = cr + dr
        const nc = cc + dc
        if (
          nr >= 0 &&
          nr < rows &&
          nc >= 0 &&
          nc < cols &&
          !visited[nr][nc] &&
          maze[nr][nc] === 0
        ) {
          visited[nr][nc] = true
          parent[nr][nc] = [cr, cc]
          queue.push([nr, nc])
        }
      }
    }

    if (found) {
      const path: [number, number][] = []
      let curr: [number, number] | null = [endR, endC]
      while (curr) {
        path.unshift(curr)
        curr = parent[curr[0]][curr[1]]
      }

      const pathH: Record<string, HighlightType> = {}
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (maze[r][c] === 1) pathH[`${r},${c}`] = 'wall'
          else if (visited[r][c]) pathH[`${r},${c}`] = 'visited'
        }
      }
      for (const [pr, pc] of path) {
        pathH[`${pr},${pc}`] = 'path'
      }
      pathH[`${startR},${startC}`] = 'start'
      pathH[`${endR},${endC}`] = 'end'

      steps.push({
        matrix: {
          rows,
          cols,
          values: toDisplayValues(),
          highlights: pathH,
        },
        description: `Path found! Length: ${path.length}. Route: ${path.map(([r, c]) => `(${r},${c})`).join(' → ')}`,
        codeLine: 22,
        variables: { pathLength: path.length },
      })
    }

    return steps
  },
}

// ============================================================
// TOWER OF HANOI
// ============================================================
const towerOfHanoi: Algorithm = {
  id: 'tower-of-hanoi',
  name: 'Tower of Hanoi',
  category: 'Divide and Conquer',
  visualization: 'matrix',
  code: `function hanoi(n, source, target, auxiliary) {
  if (n === 0) return;

  // Move n-1 disks from source to auxiliary
  hanoi(n - 1, source, auxiliary, target);

  // Move the largest disk to target
  console.log(\`Move disk \${n} from \${source} to \${target}\`);

  // Move n-1 disks from auxiliary to target
  hanoi(n - 1, auxiliary, target, source);
}

hanoi(3, 'A', 'C', 'B');`,
  description: `Tower of Hanoi

The Tower of Hanoi is a classic divide and conquer problem. Move a stack of disks from the source peg to the target peg, using an auxiliary peg, following these rules:
1. Only one disk can be moved at a time
2. Only the top disk of a stack can be moved
3. A larger disk cannot be placed on a smaller disk

How it works (Recursive):
1. Move n-1 disks from source to auxiliary (using target as helper)
2. Move the largest disk from source to target
3. Move n-1 disks from auxiliary to target (using source as helper)

This visualization uses 3 disks on 3 pegs.

Time Complexity: O(2^n) — requires 2^n - 1 moves
Space Complexity: O(n) — recursive call stack

The minimum number of moves for n disks is 2^n - 1. For 3 disks, that's 7 moves.`,

  generateSteps() {
    const numDisks = 3
    const pegs: number[][] = [[3, 2, 1], [], []]
    const steps: Step[] = []

    function pegsToMatrix(): (number | string)[][] {
      const matrix: (number | string)[][] = Array.from({ length: numDisks }, () => Array(3).fill(0))
      for (let p = 0; p < 3; p++) {
        for (let d = 0; d < pegs[p].length; d++) {
          matrix[numDisks - 1 - d][p] = pegs[p][d]
        }
      }
      return matrix
    }

    function getAllHighlights(): Record<string, HighlightType> {
      const h: Record<string, HighlightType> = {}
      for (let p = 0; p < 3; p++) {
        for (let d = 0; d < pegs[p].length; d++) {
          h[`${numDisks - 1 - d},${p}`] = 'sorted'
        }
      }
      return h
    }

    steps.push({
      matrix: {
        rows: numDisks,
        cols: 3,
        values: pegsToMatrix(),
        highlights: getAllHighlights(),
      },
      description: `Tower of Hanoi: Move ${numDisks} disks from peg 0 to peg 2. Disks: 3 (large), 2 (medium), 1 (small).`,
      codeLine: 1,
      variables: { n: numDisks, source: 0, target: 2, auxiliary: 1 },
    })

    let moveCount = 0

    function hanoi(n: number, source: number, target: number, auxiliary: number) {
      if (n === 0) return

      hanoi(n - 1, source, auxiliary, target)

      const disk = pegs[source].pop()!
      pegs[target].push(disk)
      moveCount++

      const h: Record<string, HighlightType> = {}
      for (let p = 0; p < 3; p++) {
        for (let d = 0; d < pegs[p].length; d++) {
          const row = numDisks - 1 - d
          if (p === source) {
            h[`${row},${p}`] = 'current'
          } else if (p === target) {
            h[`${row},${p}`] = 'found'
          } else {
            h[`${row},${p}`] = 'sorted'
          }
        }
      }

      steps.push({
        matrix: {
          rows: numDisks,
          cols: 3,
          values: pegsToMatrix(),
          highlights: h,
        },
        description: `Move ${moveCount}: disk ${disk} from peg ${source} → peg ${target}`,
        codeLine: 8,
        variables: { move: moveCount, disk, from: source, to: target },
      })

      hanoi(n - 1, auxiliary, target, source)
    }

    hanoi(numDisks, 0, 2, 1)

    const finalH: Record<string, HighlightType> = {}
    for (let d = 0; d < pegs[2].length; d++) {
      finalH[`${numDisks - 1 - d},2`] = 'found'
    }
    steps.push({
      matrix: {
        rows: numDisks,
        cols: 3,
        values: pegsToMatrix(),
        highlights: finalH,
      },
      description: `Tower of Hanoi complete! All ${numDisks} disks moved to peg 2 in ${moveCount} moves.`,
      codeLine: 14,
      variables: { totalMoves: moveCount, n: numDisks },
    })

    return steps
  },
}

// ============================================================
// EXPORTS
// ============================================================
export const algorithms: Algorithm[] = [
  // Sorting
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
  countingSort,
  radixSort,
  shellSort,
  // Searching
  binarySearch,
  linearSearch,
  jumpSearch,
  interpolationSearch,
  // Graphs
  bfs,
  dfs,
  dijkstra,
  prim,
  topologicalSort,
  // Dynamic Programming
  fibonacciDp,
  knapsack,
  lcs,
  // Backtracking
  nQueens,
  sudokuSolver,
  mazePathfinding,
  // Divide and Conquer
  towerOfHanoi,
]

export const categories: Category[] = [
  { name: 'Sorting', algorithms: algorithms.filter((a) => a.category === 'Sorting') },
  { name: 'Searching', algorithms: algorithms.filter((a) => a.category === 'Searching') },
  { name: 'Graphs', algorithms: algorithms.filter((a) => a.category === 'Graphs') },
  {
    name: 'Dynamic Programming',
    algorithms: algorithms.filter((a) => a.category === 'Dynamic Programming'),
  },
  { name: 'Backtracking', algorithms: algorithms.filter((a) => a.category === 'Backtracking') },
  {
    name: 'Divide and Conquer',
    algorithms: algorithms.filter((a) => a.category === 'Divide and Conquer'),
  },
]
