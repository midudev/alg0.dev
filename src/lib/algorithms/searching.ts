import type { Algorithm, Step, HighlightType } from '@lib/types'
import { d } from '@lib/algorithms/shared'

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

  generateSteps(locale = 'en') {
    const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    const target = 23
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: d(locale, `Sorted array. Searching for target: ${target}`, `Arreglo ordenado. Buscando objetivo: ${target}`),
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
        description: d(locale, `Search range [${low}..${high}], checking middle index ${mid}: value ${arr[mid]}`, `Rango de búsqueda [${low}..${high}], verificando índice medio ${mid}: valor ${arr[mid]}`),
        codeLine: 6,
        variables: { low, high, mid, target, 'array[mid]': arr[mid] },
      })

      if (arr[mid] === target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'found' },
          sorted: [],
          description: d(locale, `Found ${target} at index ${mid}!`, `¡${target} encontrado en índice ${mid}!`),
          codeLine: 8,
          variables: { low, high, mid, target, 'array[mid]': arr[mid], result: mid },
        })
        return steps
      } else if (arr[mid] < target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: d(locale, `${arr[mid]} < ${target}, searching right half`, `${arr[mid]} < ${target}, buscando en mitad derecha`),
          codeLine: 10,
          variables: { low: mid + 1, high, mid, target, 'array[mid]': arr[mid] },
        })
        low = mid + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: d(locale, `${arr[mid]} > ${target}, searching left half`, `${arr[mid]} > ${target}, buscando en mitad izquierda`),
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
      description: d(locale, `Target ${target} not found in the array.`, `Objetivo ${target} no encontrado en el arreglo.`),
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

  generateSteps(locale = 'en') {
    const arr = [14, 33, 27, 10, 35, 19, 42, 44]
    const target = 35
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(locale, `Unsorted array. Searching for target: ${target}`, `Arreglo sin ordenar. Buscando objetivo: ${target}`),
      codeLine: 1,
      variables: { target, 'array.length': arr.length },
    })

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: d(locale, `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`, `Verificando índice ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`),
        codeLine: 2,
        variables: { i, target, 'array[i]': arr[i] },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: d(locale, `Found ${target} at index ${i}!`, `¡${target} encontrado en índice ${i}!`),
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
      description: d(locale, `Target ${target} not found.`, `Objetivo ${target} no encontrado.`),
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

  generateSteps(locale = 'en') {
    const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    const target = 38
    const steps: Step[] = []
    const n = arr.length
    const jump = Math.floor(Math.sqrt(n))

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(locale, `Sorted array. Searching for target: ${target}. Jump size: √${n} = ${jump}`, `Arreglo ordenado. Buscando objetivo: ${target}. Tamaño de salto: √${n} = ${jump}`),
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
        description: d(locale, `Jumping: arr[${curr}] = ${arr[curr]} ≤ ${target}. Jump to next block.`, `Saltando: arr[${curr}] = ${arr[curr]} ≤ ${target}. Saltar al siguiente bloque.`),
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
      description: d(locale, `Target must be in block [${prev}..${endIdx}]. Starting linear search.`, `El objetivo debe estar en el bloque [${prev}..${endIdx}]. Iniciando búsqueda lineal.`),
      codeLine: 12,
      variables: { prev, end: Math.min(curr, n), target },
    })

    // Linear search phase
    for (let i = prev; i < Math.min(curr, n); i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: d(locale, `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`, `Verificando índice ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`),
        codeLine: 13,
        variables: { i, 'arr[i]': arr[i], target },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: d(locale, `Found ${target} at index ${i}!`, `¡${target} encontrado en índice ${i}!`),
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
      description: d(locale, `Target ${target} not found.`, `Objetivo ${target} no encontrado.`),
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

  generateSteps(locale = 'en') {
    const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const target = 70
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(locale, `Uniformly distributed sorted array. Searching for target: ${target}`, `Arreglo ordenado uniformemente distribuido. Buscando objetivo: ${target}`),
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
        description: d(locale, `Range [${low}..${high}]. Estimated position: ${pos} (value ${arr[pos]})`, `Rango [${low}..${high}]. Posición estimada: ${pos} (valor ${arr[pos]})`),
        codeLine: 7,
        variables: { low, high, pos, target, 'arr[pos]': arr[pos] },
      })

      if (arr[pos] === target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'found' },
          sorted: [],
          description: d(locale, `Found ${target} at index ${pos}!`, `¡${target} encontrado en índice ${pos}!`),
          codeLine: 12,
          variables: { low, high, pos, target, result: pos },
        })
        return steps
      } else if (arr[pos] < target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: d(locale, `${arr[pos]} < ${target}, narrowing to right portion`, `${arr[pos]} < ${target}, acotando a la porción derecha`),
          codeLine: 14,
          variables: { low: pos + 1, high, pos, target },
        })
        low = pos + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: d(locale, `${arr[pos]} > ${target}, narrowing to left portion`, `${arr[pos]} > ${target}, acotando a la porción izquierda`),
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
      description: d(locale, `Target ${target} not found.`, `Objetivo ${target} no encontrado.`),
      codeLine: 21,
      variables: { target, result: -1 },
    })

    return steps
  },
}

export {
  binarySearch,
  linearSearch,
  jumpSearch,
  interpolationSearch,
}
