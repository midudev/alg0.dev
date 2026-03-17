import type { Algorithm, Step, HighlightType } from '@lib/types'
import { d } from '@lib/algorithms/shared'

// ============================================================
// BUBBLE SORT
// ============================================================
const bubbleSort: Algorithm = {
  id: 'bubble-sort',
  name: 'Bubble Sort',
  category: 'Sorting',
  difficulty: 'easy',
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
  codeSamples: [
    {
      language: 'cpp',
      code: `#include <vector>
#include <algorithm>

std::vector<int> bubbleSort(std::vector<int> nums) {
  const int n = nums.size();
  for (int i = 0; i < n - 1; ++i) {
    for (int j = 0; j < n - i - 1; ++j) {
      if (nums[j] > nums[j + 1]) {
        std::swap(nums[j], nums[j + 1]);
      }
    }
  }
  return nums;
}`,
    },
    {
      language: 'java',
      code: `public static int[] bubbleSort(int[] arr) {
  int n = arr.length;
  for (int i = 0; i < n - 1; i++) {
    for (int j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        int temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    },
  ],
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

  generateSteps(locale = 'en') {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const sorted: number[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, 'Initial array. Bubble Sort will compare adjacent elements and swap them if needed.', 'Arreglo inicial. Bubble Sort comparará elementos adyacentes y los intercambiará si es necesario.'),
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({
          array: [...arr],
          highlights: { [j]: 'comparing', [j + 1]: 'comparing' },
          sorted: [...sorted],
          description: d(locale, `Comparing ${arr[j]} and ${arr[j + 1]}`, `Comparando ${arr[j]} y ${arr[j + 1]}`),
          codeLine: 5,
          variables: { i, j, n, 'array[j]': arr[j], 'array[j+1]': arr[j + 1] },
        })

        if (arr[j] > arr[j + 1]) {
          ;[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          steps.push({
            array: [...arr],
            highlights: { [j]: 'swapped', [j + 1]: 'swapped' },
            sorted: [...sorted],
            description: d(locale, `Swapped! ${arr[j]} and ${arr[j + 1]}`, `¡Intercambiados! ${arr[j]} y ${arr[j + 1]}`),
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
      description: d(locale, 'Array is sorted! Bubble Sort complete.', '¡Arreglo ordenado! Bubble Sort completado.'),
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
  difficulty: 'easy',
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

  generateSteps(locale = 'en') {
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
        description: d(locale, `Starting pass ${i + 1}. Current minimum: ${arr[minIndex]} at index ${minIndex}`, `Iniciando pasada ${i + 1}. Mínimo actual: ${arr[minIndex]} en índice ${minIndex}`),
        codeLine: 4,
        variables: { i, minIndex, n, 'array[minIndex]': arr[minIndex] },
      })

      for (let j = i + 1; j < n; j++) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'current', [minIndex]: 'minimum', [j]: 'comparing' },
          sorted: [...sorted],
          description: d(locale, `Comparing ${arr[j]} with current minimum ${arr[minIndex]}`, `Comparando ${arr[j]} con el mínimo actual ${arr[minIndex]}`),
          codeLine: 7,
          variables: { i, j, minIndex, 'array[j]': arr[j], 'array[minIndex]': arr[minIndex] },
        })

        if (arr[j] < arr[minIndex]) {
          minIndex = j
          steps.push({
            array: [...arr],
            highlights: { [i]: 'current', [minIndex]: 'minimum' },
            sorted: [...sorted],
            description: d(locale, `New minimum found: ${arr[minIndex]} at index ${minIndex}`, `Nuevo mínimo encontrado: ${arr[minIndex]} en índice ${minIndex}`),
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
          description: d(locale, `Swapped ${arr[i]} and ${arr[minIndex]}`, `Intercambiados ${arr[i]} y ${arr[minIndex]}`),
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
      description: d(locale, 'Array is sorted! Selection Sort complete.', '¡Arreglo ordenado! Selection Sort completado.'),
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
  difficulty: 'easy',
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

  generateSteps(locale = 'en') {
    const arr = [12, 11, 13, 5, 6, 7, 42]
    const steps: Step[] = []
    const sorted: number[] = [0]
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [0],
      description: d(locale, 'Initial array. First element is considered sorted.', 'Arreglo inicial. El primer elemento se considera ordenado.'),
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    for (let i = 1; i < n; i++) {
      const key = arr[i]

      steps.push({
        array: [...arr],
        highlights: { [i]: 'selected' },
        sorted: [...sorted],
        description: d(locale, `Picking element ${key} at index ${i} to insert into sorted portion`, `Seleccionando elemento ${key} en índice ${i} para insertar en la porción ordenada`),
        codeLine: 4,
        variables: { i, key, j: i - 1, n },
      })

      let j = i - 1
      while (j >= 0 && arr[j] > key) {
        steps.push({
          array: [...arr],
          highlights: { [j]: 'comparing', [j + 1]: 'selected' },
          sorted: [...sorted],
          description: d(locale, `${arr[j]} > ${key}, shifting ${arr[j]} to the right`, `${arr[j]} > ${key}, desplazando ${arr[j]} a la derecha`),
          codeLine: 7,
          variables: { i, j, key, 'array[j]': arr[j] },
        })

        arr[j + 1] = arr[j]
        j--

        steps.push({
          array: [...arr],
          highlights: j >= 0 ? { [j]: 'comparing', [j + 1]: 'swapped' } : { [j + 1]: 'swapped' },
          sorted: [...sorted],
          description: d(locale, `Shifted. Checking next position...`, 'Desplazado. Verificando siguiente posición...'),
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
        description: d(locale, `Inserted ${key} at index ${j + 1}`, `Insertado ${key} en índice ${j + 1}`),
        codeLine: 11,
        variables: { i, j: j + 1, key },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(locale, 'Array is sorted! Insertion Sort complete.', '¡Arreglo ordenado! Insertion Sort completado.'),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const sorted: number[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, 'Initial array. Quick Sort will pick a pivot and partition the array around it.', 'Arreglo inicial. Quick Sort elegirá un pivote y particionará el arreglo alrededor de él.'),
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
          description: d(locale, `Element ${arr[low]} is in its final position (single element)`, `El elemento ${arr[low]} está en su posición final (elemento único)`),
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
        description: d(locale, `Partitioning [${low}..${high}]. Pivot: ${arr[high]}`, `Particionando [${low}..${high}]. Pivote: ${arr[high]}`),
        codeLine: 10,
        variables: { low, high, pivot, i },
      })

      for (let j = low; j < high; j++) {
        steps.push({
          array: [...arr],
          highlights: { [j]: 'comparing', [high]: 'pivot' },
          sorted: [...sorted],
          description: d(locale, `Comparing ${arr[j]} with pivot ${pivot}`, `Comparando ${arr[j]} con pivote ${pivot}`),
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
              description: d(locale, `${arr[i]} <= pivot, swapped positions ${i} and ${j}`, `${arr[i]} <= pivote, intercambiadas posiciones ${i} y ${j}`),
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
        description: d(locale, `Pivot ${arr[pivotIdx]} placed at final position ${pivotIdx}`, `Pivote ${arr[pivotIdx]} colocado en posición final ${pivotIdx}`),
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
      description: d(locale, 'Array is sorted! Quick Sort complete.', '¡Arreglo ordenado! Quick Sort completado.'),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, 'Initial array. Merge Sort will divide and merge sorted halves.', 'Arreglo inicial. Merge Sort dividirá y mezclará mitades ordenadas.'),
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
        description: d(locale, `Dividing [${start}..${end}] into [${start}..${mid}] and [${mid + 1}..${end}]`, `Dividiendo [${start}..${end}] en [${start}..${mid}] y [${mid + 1}..${end}]`),
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
          description: d(locale, `Merging: comparing ${arr[i]} (left) and ${arr[j]} (right)`, `Mezclando: comparando ${arr[i]} (izquierda) y ${arr[j]} (derecha)`),
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
        description: d(locale, `Merged [${start}..${end}]: [${arr.slice(start, end + 1).join(', ')}]`, `Mezclado [${start}..${end}]: [${arr.slice(start, end + 1).join(', ')}]`),
        codeLine: 25,
        variables: { start, end, result: `[${arr.slice(start, end + 1).join(', ')}]` },
      })
    }

    ms(0, n - 1)

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(locale, 'Array is sorted! Merge Sort complete.', '¡Arreglo ordenado! Merge Sort completado.'),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
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
          description: d(locale, `Heapify: comparing parent ${arr[root]} (index ${root}) with left child ${arr[left]} (index ${left})`, `Heapify: comparando padre ${arr[root]} (índice ${root}) con hijo izquierdo ${arr[left]} (índice ${left})`),
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
          description: d(locale, `Heapify: comparing ${arr[root]} (index ${root}) with right child ${arr[right]} (index ${right})`, `Heapify: comparando ${arr[root]} (índice ${root}) con hijo derecho ${arr[right]} (índice ${right})`),
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
          description: d(locale, `Swapped ${arr[root]} and ${arr[largest]}`, `Intercambiados ${arr[root]} y ${arr[largest]}`),
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
      description: d(locale, 'Phase 1: Building max heap from the array.', 'Fase 1: Construyendo max-heap a partir del arreglo.'),
      codeLine: 5,
      variables: { n },
    })

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: d(locale, `Heapifying subtree rooted at index ${i} (value ${arr[i]})`, `Heapificando subárbol con raíz en índice ${i} (valor ${arr[i]})`),
        codeLine: 6,
        variables: { i },
      })
      heapify(n, i)
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, `Max heap built: [${arr.join(', ')}]. Phase 2: Extract elements.`, `Max-heap construido: [${arr.join(', ')}]. Fase 2: Extraer elementos.`),
      codeLine: 10,
      variables: { heap: `[${arr.join(', ')}]` },
    })

    // Extract elements
    for (let i = n - 1; i > 0; i--) {
      steps.push({
        array: [...arr],
        highlights: { [0]: 'selected', [i]: 'selected' },
        sorted: [...sortedIndices],
        description: d(locale, `Swap max element ${arr[0]} with element ${arr[i]} at index ${i}`, `Intercambiar elemento máximo ${arr[0]} con elemento ${arr[i]} en índice ${i}`),
        codeLine: 11,
        variables: { i, max: arr[0] },
      })

      ;[arr[0], arr[i]] = [arr[i], arr[0]]
      sortedIndices.push(i)

      steps.push({
        array: [...arr],
        highlights: { [i]: 'sorted' },
        sorted: [...sortedIndices],
        description: d(locale, `${arr[i]} placed in final position. Heapify remaining heap of size ${i}.`, `${arr[i]} colocado en posición final. Heapificar heap restante de tamaño ${i}.`),
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
      description: d(locale, 'Array is sorted! Heap Sort complete.', '¡Arreglo ordenado! Heap Sort completado.'),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
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
      description: d(locale, 'Initial array. Counting Sort will count occurrences of each value to determine sorted positions.', 'Arreglo inicial. Counting Sort contará las ocurrencias de cada valor para determinar posiciones ordenadas.'),
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
        description: d(locale, `Counting element ${arr[i]} at index ${i}. count[${arr[i]}] = ${count[arr[i]]}`, `Contando elemento ${arr[i]} en índice ${i}. count[${arr[i]}] = ${count[arr[i]]}`),
        codeLine: 8,
        variables: { i, 'array[i]': arr[i], count: `[${count.join(', ')}]` },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, `Counting complete: [${count.join(', ')}]. Computing cumulative counts.`, `Conteo completo: [${count.join(', ')}]. Calculando conteos acumulados.`),
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
      description: d(locale, `Cumulative counts: [${count.join(', ')}]. Now placing elements in sorted positions.`, `Conteos acumulados: [${count.join(', ')}]. Colocando elementos en posiciones ordenadas.`),
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
        description: d(locale, `Placing ${arr[i]} at output position ${pos}`, `Colocando ${arr[i]} en posición de salida ${pos}`),
        codeLine: 18,
        variables: { i, 'array[i]': arr[i], pos, output: `[${output.join(', ')}]` },
      })
    }

    steps.push({
      array: [...output],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(locale, 'Array is sorted! Counting Sort complete.', '¡Arreglo ordenado! Counting Sort completado.'),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
    const arr = [170, 45, 75, 90, 802, 24, 2, 66]
    const steps: Step[] = []
    const n = arr.length
    const max = Math.max(...arr)

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, 'Initial array. Radix Sort will sort digit by digit, from least significant to most significant.', 'Arreglo inicial. Radix Sort ordenará dígito a dígito, del menos significativo al más significativo.'),
      codeLine: 1,
      variables: { n, max, array: `[${arr.join(', ')}]` },
    })

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      const digitName = exp === 1 ? 'ones' : exp === 10 ? 'tens' : 'hundreds'
      const digitNameEs = exp === 1 ? 'unidades' : exp === 10 ? 'decenas' : 'centenas'
      const digits = arr.map((x) => Math.floor(x / exp) % 10)

      const allCurrentH: Record<number, HighlightType> = {}
      for (let j = 0; j < n; j++) allCurrentH[j] = 'current'

      steps.push({
        array: [...arr],
        highlights: allCurrentH,
        sorted: [],
        description: d(locale, `Sorting by ${digitName} digit. Digits: [${digits.join(', ')}]`, `Ordenando por dígito de ${digitNameEs}. Dígitos: [${digits.join(', ')}]`),
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
        description: d(locale, `After sorting by ${digitName} digit: [${arr.join(', ')}]`, `Después de ordenar por dígito de ${digitNameEs}: [${arr.join(', ')}]`),
        codeLine: 5,
        variables: { exp, array: `[${arr.join(', ')}]` },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(locale, 'Array is sorted! Radix Sort complete.', '¡Arreglo ordenado! Radix Sort completado.'),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
    const arr = [38, 27, 43, 3, 9, 82, 10]
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, 'Initial array. Shell Sort uses decreasing gap sequences to sort far-apart elements first.', 'Arreglo inicial. Shell Sort usa secuencias de brechas decrecientes para ordenar primero elementos lejanos.'),
      codeLine: 1,
      variables: { n, array: `[${arr.join(', ')}]` },
    })

    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
      steps.push({
        array: [...arr],
        highlights: {},
        sorted: [],
        description: d(locale, `Starting pass with gap = ${gap}`, `Iniciando pasada con brecha = ${gap}`),
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
          description: d(locale, `Gap ${gap}: Inserting element ${arr[i]} at index ${i}`, `Brecha ${gap}: Insertando elemento ${arr[i]} en índice ${i}`),
          codeLine: 6,
          variables: { gap, i, temp, j },
        })

        while (j >= gap && arr[j - gap] > temp) {
          steps.push({
            array: [...arr],
            highlights: { [j]: 'comparing', [j - gap]: 'comparing' },
            sorted: [],
            description: d(locale, `Comparing: ${arr[j - gap]} (index ${j - gap}) > ${temp} — shift right`, `Comparando: ${arr[j - gap]} (índice ${j - gap}) > ${temp} — desplazar a la derecha`),
            codeLine: 9,
            variables: { gap, i, j, temp, 'array[j-gap]': arr[j - gap] },
          })

          arr[j] = arr[j - gap]
          j -= gap

          steps.push({
            array: [...arr],
            highlights: { [j + gap]: 'swapped' },
            sorted: [],
            description: d(locale, `Shifted ${arr[j + gap]} to index ${j + gap}`, `Desplazado ${arr[j + gap]} al índice ${j + gap}`),
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
            description: d(locale, `Placed ${temp} at index ${j}`, `Colocado ${temp} en índice ${j}`),
            codeLine: 14,
            variables: { gap, i, j, temp },
          })
        }
      }

      steps.push({
        array: [...arr],
        highlights: {},
        sorted: [],
        description: d(locale, `Gap ${gap} pass complete: [${arr.join(', ')}]`, `Pasada con brecha ${gap} completa: [${arr.join(', ')}]`),
        codeLine: 16,
        variables: { gap, array: `[${arr.join(', ')}]` },
      })
    }

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(locale, 'Array is sorted! Shell Sort complete.', '¡Arreglo ordenado! Shell Sort completado.'),
      codeLine: 18,
      variables: { array: `[${arr.join(', ')}]` },
    })

    return steps
  },
}

export {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
  countingSort,
  radixSort,
  shellSort,
}
