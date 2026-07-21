import type { Algorithm, Step, HighlightType } from '@lib/types'
import { d } from '@lib/algorithms/shared'

const binarySearch: Algorithm = {
  id: 'binary-search',
  name: 'Binary Search',
  category: 'Searching',
  difficulty: 'easy',
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

  generateSteps(locale = 'en') {
    const arr = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91]
    const target = 23
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: arr.length }, (_, i) => i),
      description: d(
        locale,
        `Sorted array. Searching for target: ${target}`,
        `Arreglo ordenado. Buscando objetivo: ${target}`,
      ),
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
        description: d(
          locale,
          `Search range [${low}..${high}], checking middle index ${mid}: value ${arr[mid]}`,
          `Rango de búsqueda [${low}..${high}], verificando índice medio ${mid}: valor ${arr[mid]}`,
        ),
        codeLine: 6,
        variables: { low, high, mid, target, 'array[mid]': arr[mid] },
      })

      if (arr[mid] === target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${mid}!`,
            `¡${target} encontrado en índice ${mid}!`,
          ),
          codeLine: 8,
          variables: { low, high, mid, target, 'array[mid]': arr[mid], result: mid },
        })
        return steps
      } else if (arr[mid] < target) {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[mid]} < ${target}, searching right half`,
            `${arr[mid]} < ${target}, buscando en mitad derecha`,
          ),
          codeLine: 10,
          variables: { low: mid + 1, high, mid, target, 'array[mid]': arr[mid] },
        })
        low = mid + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [mid]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[mid]} > ${target}, searching left half`,
            `${arr[mid]} > ${target}, buscando en mitad izquierda`,
          ),
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
      description: d(
        locale,
        `Target ${target} not found in the array.`,
        `Objetivo ${target} no encontrado en el arreglo.`,
      ),
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
  difficulty: 'easy',
  visualization: 'array',
  code: `function linearSearch(array, target) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === target) {
      return i; // Found!
    }
  }

  return -1; // Not found
}`,

  generateSteps(locale = 'en') {
    const arr = [14, 33, 27, 10, 35, 19, 42, 44]
    const target = 35
    const steps: Step[] = []

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: [],
      description: d(
        locale,
        `Unsorted array. Searching for target: ${target}`,
        `Arreglo sin ordenar. Buscando objetivo: ${target}`,
      ),
      codeLine: 1,
      variables: { target, 'array.length': arr.length },
    })

    for (let i = 0; i < arr.length; i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: d(
          locale,
          `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
          `Verificando índice ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
        ),
        codeLine: 2,
        variables: { i, target, 'array[i]': arr[i] },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${i}!`,
            `¡${target} encontrado en índice ${i}!`,
          ),
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
  difficulty: 'intermediate',
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
      description: d(
        locale,
        `Sorted array. Searching for target: ${target}. Jump size: √${n} = ${jump}`,
        `Arreglo ordenado. Buscando objetivo: ${target}. Tamaño de salto: √${n} = ${jump}`,
      ),
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
        description: d(
          locale,
          `Jumping: arr[${curr}] = ${arr[curr]} ≤ ${target}. Jump to next block.`,
          `Saltando: arr[${curr}] = ${arr[curr]} ≤ ${target}. Saltar al siguiente bloque.`,
        ),
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
      description: d(
        locale,
        `Target must be in block [${prev}..${endIdx}]. Starting linear search.`,
        `El objetivo debe estar en el bloque [${prev}..${endIdx}]. Iniciando búsqueda lineal.`,
      ),
      codeLine: 12,
      variables: { prev, end: Math.min(curr, n), target },
    })

    // Linear search phase
    for (let i = prev; i < Math.min(curr, n); i++) {
      steps.push({
        array: [...arr],
        highlights: { [i]: 'current' },
        sorted: [],
        description: d(
          locale,
          `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
          `Verificando índice ${i}: ${arr[i]} ${arr[i] === target ? '=' : '≠'} ${target}`,
        ),
        codeLine: 13,
        variables: { i, 'arr[i]': arr[i], target },
      })

      if (arr[i] === target) {
        steps.push({
          array: [...arr],
          highlights: { [i]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${i}!`,
            `¡${target} encontrado en índice ${i}!`,
          ),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
    const arr = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const target = 70
    const steps: Step[] = []
    const n = arr.length

    steps.push({
      array: [...arr],
      highlights: {},
      sorted: Array.from({ length: n }, (_, i) => i),
      description: d(
        locale,
        `Uniformly distributed sorted array. Searching for target: ${target}`,
        `Arreglo ordenado uniformemente distribuido. Buscando objetivo: ${target}`,
      ),
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
        description: d(
          locale,
          `Range [${low}..${high}]. Estimated position: ${pos} (value ${arr[pos]})`,
          `Rango [${low}..${high}]. Posición estimada: ${pos} (valor ${arr[pos]})`,
        ),
        codeLine: 7,
        variables: { low, high, pos, target, 'arr[pos]': arr[pos] },
      })

      if (arr[pos] === target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'found' },
          sorted: [],
          description: d(
            locale,
            `Found ${target} at index ${pos}!`,
            `¡${target} encontrado en índice ${pos}!`,
          ),
          codeLine: 12,
          variables: { low, high, pos, target, result: pos },
        })
        return steps
      } else if (arr[pos] < target) {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[pos]} < ${target}, narrowing to right portion`,
            `${arr[pos]} < ${target}, acotando a la porción derecha`,
          ),
          codeLine: 14,
          variables: { low: pos + 1, high, pos, target },
        })
        low = pos + 1
      } else {
        steps.push({
          array: [...arr],
          highlights: { [pos]: 'comparing' },
          sorted: [],
          description: d(
            locale,
            `${arr[pos]} > ${target}, narrowing to left portion`,
            `${arr[pos]} > ${target}, acotando a la porción izquierda`,
          ),
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

export { binarySearch, linearSearch, jumpSearch, interpolationSearch }
