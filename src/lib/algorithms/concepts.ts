import type { Algorithm, Step, HighlightType } from '@lib/types'
import { d } from '@lib/algorithms/shared'

// ============================================================
// BIG O NOTATION
// ============================================================
export const bigONotation: Algorithm = {
  id: 'big-o-notation',
  name: 'Big O Notation',
  category: 'Concepts',
  visualization: 'array',
  code: `// O(1) — Constant time
function getFirst(arr) {
  return arr[0];
}

// O(n) — Linear time
function findMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n²) — Quadratic time
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(log n) — Logarithmic time
function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
  description: `Big O Notation

Big O Notation describes how an algorithm's running time or space grows relative to the input size. It focuses on the worst-case scenario and ignores constants.

Common complexities (from fastest to slowest):
  O(1)      — Constant: independent of input size
  O(log n)  — Logarithmic: halves the problem each step
  O(n)      — Linear: visits each element once
  O(n log n)— Linearithmic: typical of efficient sorting
  O(n²)     — Quadratic: nested loops over input
  O(2^n)    — Exponential: doubles with each element
  O(n!)     — Factorial: all permutations

This visualization shows how many operations each complexity requires as the input size grows from 1 to 8.`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    // Show the number of operations for n=1..8 for O(1)
    const sizes = [1, 2, 3, 4, 5, 6, 7, 8]

    // Step 1: Introduction
    steps.push({
      array: [1, 1, 1, 1, 1, 1, 1, 1],
      highlights: {},
      sorted: [],
      description: d(
        locale,
        'Big O measures how an algorithm scales. Each bar represents the number of operations for input sizes 1 through 8.',
        'Big O mide cómo escala un algoritmo. Cada barra representa el número de operaciones para tamaños de entrada del 1 al 8.',
      ),
      codeLine: 1,
      variables: { complexity: 'O(1)', n: '1..8' },
    })

    // Step 2: O(1) — Constant
    steps.push({
      array: [1, 1, 1, 1, 1, 1, 1, 1],
      highlights: { 0: 'sorted', 1: 'sorted', 2: 'sorted', 3: 'sorted', 4: 'sorted', 5: 'sorted', 6: 'sorted', 7: 'sorted' },
      sorted: [],
      description: d(
        locale,
        'O(1) — Constant time. Always 1 operation regardless of input size. Example: accessing an array element by index.',
        'O(1) — Tiempo constante. Siempre 1 operación sin importar el tamaño de entrada. Ejemplo: acceder a un elemento del arreglo por índice.',
      ),
      codeLine: 2,
      variables: { complexity: 'O(1)', 'ops(1)': 1, 'ops(4)': 1, 'ops(8)': 1 },
    })

    // Step 3: O(log n) — Logarithmic
    const logOps = sizes.map((n) => Math.max(1, Math.ceil(Math.log2(n))))
    steps.push({
      array: logOps,
      highlights: Object.fromEntries(logOps.map((_, i) => [i, 'searching' as HighlightType])),
      sorted: [],
      description: d(
        locale,
        'O(log n) — Logarithmic time. The problem is halved at each step. Example: binary search in a sorted array.',
        'O(log n) — Tiempo logarítmico. El problema se divide a la mitad en cada paso. Ejemplo: búsqueda binaria en un arreglo ordenado.',
      ),
      codeLine: 19,
      variables: { complexity: 'O(log n)', 'ops(1)': logOps[0], 'ops(4)': logOps[3], 'ops(8)': logOps[7] },
    })

    // Step 4: O(n) — Linear
    const linearOps = sizes.map((n) => n)
    steps.push({
      array: linearOps,
      highlights: Object.fromEntries(linearOps.map((_, i) => [i, 'current' as HighlightType])),
      sorted: [],
      description: d(
        locale,
        'O(n) — Linear time. Visits each element once. Example: finding the maximum value in an unsorted array.',
        'O(n) — Tiempo lineal. Visita cada elemento una vez. Ejemplo: encontrar el valor máximo en un arreglo sin ordenar.',
      ),
      codeLine: 7,
      variables: { complexity: 'O(n)', 'ops(1)': 1, 'ops(4)': 4, 'ops(8)': 8 },
    })

    // Step 5: O(n log n) — Linearithmic
    const nLogNOps = sizes.map((n) => Math.max(1, Math.ceil(n * Math.log2(n))))
    steps.push({
      array: nLogNOps,
      highlights: Object.fromEntries(nLogNOps.map((_, i) => [i, 'pivot' as HighlightType])),
      sorted: [],
      description: d(
        locale,
        'O(n log n) — Linearithmic time. Typical of efficient sorting algorithms. Example: Merge Sort, Quick Sort (average).',
        'O(n log n) — Tiempo linearítmico. Típico de algoritmos de ordenamiento eficientes. Ejemplo: Merge Sort, Quick Sort (promedio).',
      ),
      codeLine: 7,
      variables: { complexity: 'O(n log n)', 'ops(1)': nLogNOps[0], 'ops(4)': nLogNOps[3], 'ops(8)': nLogNOps[7] },
    })

    // Step 6: O(n²) — Quadratic
    const quadOps = sizes.map((n) => n * n)
    steps.push({
      array: quadOps,
      highlights: Object.fromEntries(quadOps.map((_, i) => [i, 'comparing' as HighlightType])),
      sorted: [],
      description: d(
        locale,
        'O(n²) — Quadratic time. Nested loops over the input. Example: checking all pairs for duplicates, Bubble Sort.',
        'O(n²) — Tiempo cuadrático. Bucles anidados sobre la entrada. Ejemplo: verificar todos los pares por duplicados, Bubble Sort.',
      ),
      codeLine: 14,
      variables: { complexity: 'O(n²)', 'ops(1)': 1, 'ops(4)': 16, 'ops(8)': 64 },
    })

    // Step 7: Compare all together — show n=8 operations side by side
    steps.push({
      array: [1, 3, 8, 24, 64],
      highlights: { 0: 'sorted', 1: 'searching', 2: 'current', 3: 'pivot', 4: 'comparing' },
      sorted: [],
      description: d(
        locale,
        'Comparison for n=8: O(1)=1, O(log n)=3, O(n)=8, O(n log n)=24, O(n²)=64. Notice how quadratic grows much faster!',
        'Comparación para n=8: O(1)=1, O(log n)=3, O(n)=8, O(n log n)=24, O(n²)=64. ¡Observa cómo el cuadrático crece mucho más rápido!',
      ),
      codeLine: 1,
      variables: { n: 8, 'O(1)': 1, 'O(log n)': 3, 'O(n)': 8, 'O(n log n)': 24, 'O(n²)': 64 },
    })

    // Step 8: Why it matters
    steps.push({
      array: [1, 10, 100, 1000, 10000],
      highlights: { 0: 'sorted', 1: 'searching', 2: 'current', 3: 'pivot', 4: 'comparing' },
      sorted: [],
      description: d(
        locale,
        'For n=100: O(1)=1, O(log n)=10, O(n)=100, O(n log n)=1000, O(n²)=10000. Choosing the right algorithm matters!',
        'Para n=100: O(1)=1, O(log n)=10, O(n)=100, O(n log n)=1000, O(n²)=10000. ¡Elegir el algoritmo correcto importa!',
      ),
      codeLine: 1,
      variables: { n: 100, 'O(1)': 1, 'O(log n)': 10, 'O(n)': 100, 'O(n log n)': 1000, 'O(n²)': 10000 },
    })

    return steps
  },
}

// ============================================================
// RECURSION
// ============================================================
export const recursion: Algorithm = {
  id: 'recursion',
  name: 'Recursion',
  category: 'Concepts',
  visualization: 'array',
  code: `function factorial(n) {
  // Base case: factorial of 0 or 1 is 1
  if (n <= 1) return 1;

  // Recursive case: n * factorial(n - 1)
  return n * factorial(n - 1);
}

// factorial(5) unfolds as:
// 5 * factorial(4)
//   4 * factorial(3)
//     3 * factorial(2)
//       2 * factorial(1)
//         → 1 (base case)
//       → 2 * 1 = 2
//     → 3 * 2 = 6
//   → 4 * 6 = 24
// → 5 * 24 = 120`,
  description: `Recursion

Recursion is a technique where a function calls itself to solve smaller instances of the same problem. Every recursive function needs:

1. Base case: A condition that stops the recursion
2. Recursive case: The function calls itself with a smaller input

How it works (factorial example):
1. factorial(5) calls factorial(4)
2. factorial(4) calls factorial(3)
3. ... down to factorial(1) which returns 1 (base case)
4. Results propagate back up: 1 → 2 → 6 → 24 → 120

Key concepts:
  - Call stack: each recursive call is pushed onto the stack
  - Stack overflow: too many recursive calls can exhaust memory
  - Tail recursion: optimization where the recursive call is the last operation

Common recursive algorithms:
  - Factorial, Fibonacci
  - Tree traversals
  - Merge Sort, Quick Sort
  - Backtracking (N-Queens, Sudoku)`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    // Show factorial(5) computation step by step
    // Array represents the call stack depth / accumulated values

    steps.push({
      array: [5, 4, 3, 2, 1],
      highlights: {},
      sorted: [],
      description: d(
        locale,
        'Let\'s compute factorial(5). We need to multiply: 5 × 4 × 3 × 2 × 1. Recursion breaks this into smaller calls.',
        'Calculemos factorial(5). Necesitamos multiplicar: 5 × 4 × 3 × 2 × 1. La recursión divide esto en llamadas más pequeñas.',
      ),
      codeLine: 1,
      variables: { n: 5 },
    })

    // Going down the call stack
    steps.push({
      array: [5, 0, 0, 0, 0],
      highlights: { 0: 'current' },
      sorted: [],
      description: d(
        locale,
        'factorial(5): n=5, not a base case. Call factorial(4). Push to call stack.',
        'factorial(5): n=5, no es caso base. Llamar factorial(4). Agregar a la pila de llamadas.',
      ),
      codeLine: 5,
      variables: { n: 5, 'returns': '5 × factorial(4)' },
    })

    steps.push({
      array: [5, 4, 0, 0, 0],
      highlights: { 0: 'active', 1: 'current' },
      sorted: [],
      description: d(
        locale,
        'factorial(4): n=4, not a base case. Call factorial(3). Stack grows.',
        'factorial(4): n=4, no es caso base. Llamar factorial(3). La pila crece.',
      ),
      codeLine: 5,
      variables: { n: 4, 'returns': '4 × factorial(3)', stackDepth: 2 },
    })

    steps.push({
      array: [5, 4, 3, 0, 0],
      highlights: { 0: 'active', 1: 'active', 2: 'current' },
      sorted: [],
      description: d(
        locale,
        'factorial(3): n=3, not a base case. Call factorial(2). Stack keeps growing.',
        'factorial(3): n=3, no es caso base. Llamar factorial(2). La pila sigue creciendo.',
      ),
      codeLine: 5,
      variables: { n: 3, 'returns': '3 × factorial(2)', stackDepth: 3 },
    })

    steps.push({
      array: [5, 4, 3, 2, 0],
      highlights: { 0: 'active', 1: 'active', 2: 'active', 3: 'current' },
      sorted: [],
      description: d(
        locale,
        'factorial(2): n=2, not a base case. Call factorial(1). Almost at the base.',
        'factorial(2): n=2, no es caso base. Llamar factorial(1). Casi en el caso base.',
      ),
      codeLine: 5,
      variables: { n: 2, 'returns': '2 × factorial(1)', stackDepth: 4 },
    })

    steps.push({
      array: [5, 4, 3, 2, 1],
      highlights: { 0: 'active', 1: 'active', 2: 'active', 3: 'active', 4: 'found' },
      sorted: [],
      description: d(
        locale,
        'factorial(1): BASE CASE reached! n ≤ 1, return 1. Now results propagate back up.',
        'factorial(1): ¡CASO BASE alcanzado! n ≤ 1, retorna 1. Ahora los resultados se propagan hacia arriba.',
      ),
      codeLine: 2,
      variables: { n: 1, 'returns': 1, stackDepth: 5 },
    })

    // Going back up the call stack
    steps.push({
      array: [5, 4, 3, 2, 1],
      highlights: { 0: 'active', 1: 'active', 2: 'active', 3: 'current', 4: 'sorted' },
      sorted: [4],
      description: d(
        locale,
        'Back to factorial(2): returns 2 × 1 = 2. Pop from call stack.',
        'Volviendo a factorial(2): retorna 2 × 1 = 2. Desapilar de la pila de llamadas.',
      ),
      codeLine: 5,
      variables: { n: 2, 'factorial(1)': 1, 'returns': '2 × 1 = 2', stackDepth: 4 },
    })

    steps.push({
      array: [5, 4, 6, 2, 1],
      highlights: { 0: 'active', 1: 'active', 2: 'current', 3: 'sorted', 4: 'sorted' },
      sorted: [3, 4],
      description: d(
        locale,
        'Back to factorial(3): returns 3 × 2 = 6. Stack unwinding.',
        'Volviendo a factorial(3): retorna 3 × 2 = 6. Desenrollando la pila.',
      ),
      codeLine: 5,
      variables: { n: 3, 'factorial(2)': 2, 'returns': '3 × 2 = 6', stackDepth: 3 },
    })

    steps.push({
      array: [5, 24, 6, 2, 1],
      highlights: { 0: 'active', 1: 'current', 2: 'sorted', 3: 'sorted', 4: 'sorted' },
      sorted: [2, 3, 4],
      description: d(
        locale,
        'Back to factorial(4): returns 4 × 6 = 24. Almost done!',
        'Volviendo a factorial(4): retorna 4 × 6 = 24. ¡Casi listo!',
      ),
      codeLine: 5,
      variables: { n: 4, 'factorial(3)': 6, 'returns': '4 × 6 = 24', stackDepth: 2 },
    })

    steps.push({
      array: [120, 24, 6, 2, 1],
      highlights: { 0: 'found', 1: 'sorted', 2: 'sorted', 3: 'sorted', 4: 'sorted' },
      sorted: [1, 2, 3, 4],
      description: d(
        locale,
        'Back to factorial(5): returns 5 × 24 = 120. Done! The call stack is empty. factorial(5) = 120.',
        'Volviendo a factorial(5): retorna 5 × 24 = 120. ¡Listo! La pila de llamadas está vacía. factorial(5) = 120.',
      ),
      codeLine: 5,
      variables: { n: 5, 'factorial(4)': 24, result: 120, stackDepth: 0 },
    })

    return steps
  },
}

// ============================================================
// STACKS & QUEUES
// ============================================================
export const stacksAndQueues: Algorithm = {
  id: 'stacks-queues',
  name: 'Stacks & Queues',
  category: 'Concepts',
  visualization: 'array',
  code: `// === STACK (LIFO: Last In, First Out) ===
class Stack {
  constructor() { this.items = []; }

  push(item) {          // Add to top
    this.items.push(item);
  }

  pop() {               // Remove from top
    return this.items.pop();
  }

  peek() {              // View top element
    return this.items[this.items.length - 1];
  }
}

// === QUEUE (FIFO: First In, First Out) ===
class Queue {
  constructor() { this.items = []; }

  enqueue(item) {       // Add to back
    this.items.push(item);
  }

  dequeue() {           // Remove from front
    return this.items.shift();
  }

  front() {             // View front element
    return this.items[0];
  }
}`,
  description: `Stacks & Queues

Stacks and Queues are fundamental linear data structures that differ in how elements are added and removed.

Stack (LIFO — Last In, First Out):
  Like a stack of plates: you add and remove from the top.
  - push: add element to top
  - pop: remove element from top
  - peek: view top element without removing

Queue (FIFO — First In, First Out):
  Like a line at a store: first person in line is served first.
  - enqueue: add element to back
  - dequeue: remove element from front
  - front: view front element without removing

Applications:
  Stack: undo/redo, browser history, function call stack, DFS
  Queue: task scheduling, BFS, print queue, message buffers

Time Complexity: O(1) for all operations (push, pop, enqueue, dequeue)
Space Complexity: O(n) for n elements`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const EMPTY = 0

    // --- STACK DEMONSTRATION ---
    steps.push({
      array: [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      highlights: {},
      sorted: [],
      description: d(
        locale,
        'STACK (LIFO): Last In, First Out. Like a stack of plates — add and remove from the top only.',
        'PILA (LIFO): Último en Entrar, Primero en Salir. Como una pila de platos — se añade y retira solo desde arriba.',
      ),
      codeLine: 1,
      variables: { structure: 'Stack', size: 0 },
    })

    // Push operations
    steps.push({
      array: [10, EMPTY, EMPTY, EMPTY, EMPTY],
      highlights: { 0: 'placed' },
      sorted: [],
      description: d(
        locale,
        'stack.push(10) — Push 10 onto the stack. It becomes the top element.',
        'stack.push(10) — Apilar 10. Se convierte en el elemento superior.',
      ),
      codeLine: 5,
      variables: { structure: 'Stack', operation: 'push(10)', top: 10, size: 1 },
    })

    steps.push({
      array: [10, 20, EMPTY, EMPTY, EMPTY],
      highlights: { 0: 'active', 1: 'placed' },
      sorted: [],
      description: d(
        locale,
        'stack.push(20) — Push 20. It goes on top of 10.',
        'stack.push(20) — Apilar 20. Va encima del 10.',
      ),
      codeLine: 5,
      variables: { structure: 'Stack', operation: 'push(20)', top: 20, size: 2 },
    })

    steps.push({
      array: [10, 20, 30, EMPTY, EMPTY],
      highlights: { 0: 'active', 1: 'active', 2: 'placed' },
      sorted: [],
      description: d(
        locale,
        'stack.push(30) — Push 30. Now the stack has [10, 20, 30] with 30 on top.',
        'stack.push(30) — Apilar 30. Ahora la pila tiene [10, 20, 30] con 30 arriba.',
      ),
      codeLine: 5,
      variables: { structure: 'Stack', operation: 'push(30)', top: 30, size: 3 },
    })

    steps.push({
      array: [10, 20, 42, EMPTY, EMPTY],
      highlights: { 0: 'active', 1: 'active', 2: 'placed' },
      sorted: [],
      description: d(
        locale,
        'stack.push(42) — Push 42. The most recent element is always on top.',
        'stack.push(42) — Apilar 42. El elemento más reciente siempre está arriba.',
      ),
      codeLine: 5,
      variables: { structure: 'Stack', operation: 'push(42)', top: 42, size: 4 },
    })

    // Pop operations
    steps.push({
      array: [10, 20, 30, EMPTY, EMPTY],
      highlights: { 2: 'swapped' },
      sorted: [],
      description: d(
        locale,
        'stack.pop() → 42. LIFO: the last pushed element (42) is removed first.',
        'stack.pop() → 42. LIFO: el último elemento apilado (42) se retira primero.',
      ),
      codeLine: 9,
      variables: { structure: 'Stack', operation: 'pop()', removed: 42, top: 30, size: 3 },
    })

    steps.push({
      array: [10, 20, EMPTY, EMPTY, EMPTY],
      highlights: { 1: 'swapped' },
      sorted: [],
      description: d(
        locale,
        'stack.pop() → 30. Now 20 is the top element.',
        'stack.pop() → 30. Ahora 20 es el elemento superior.',
      ),
      codeLine: 9,
      variables: { structure: 'Stack', operation: 'pop()', removed: 30, top: 20, size: 2 },
    })

    // --- QUEUE DEMONSTRATION ---
    steps.push({
      array: [EMPTY, EMPTY, EMPTY, EMPTY, EMPTY],
      highlights: {},
      sorted: [],
      description: d(
        locale,
        'QUEUE (FIFO): First In, First Out. Like a line at a store — first person in line is served first.',
        'COLA (FIFO): Primero en Entrar, Primero en Salir. Como una fila en una tienda — el primero en la fila es atendido primero.',
      ),
      codeLine: 18,
      variables: { structure: 'Queue', size: 0 },
    })

    // Enqueue operations
    steps.push({
      array: [10, EMPTY, EMPTY, EMPTY, EMPTY],
      highlights: { 0: 'placed' },
      sorted: [],
      description: d(
        locale,
        'queue.enqueue(10) — Add 10 to the back of the queue.',
        'queue.enqueue(10) — Añadir 10 al final de la cola.',
      ),
      codeLine: 22,
      variables: { structure: 'Queue', operation: 'enqueue(10)', front: 10, size: 1 },
    })

    steps.push({
      array: [10, 20, EMPTY, EMPTY, EMPTY],
      highlights: { 0: 'active', 1: 'placed' },
      sorted: [],
      description: d(
        locale,
        'queue.enqueue(20) — Add 20 to the back. 10 is still at the front.',
        'queue.enqueue(20) — Añadir 20 al final. 10 sigue al frente.',
      ),
      codeLine: 22,
      variables: { structure: 'Queue', operation: 'enqueue(20)', front: 10, size: 2 },
    })

    steps.push({
      array: [10, 20, 30, EMPTY, EMPTY],
      highlights: { 0: 'active', 1: 'active', 2: 'placed' },
      sorted: [],
      description: d(
        locale,
        'queue.enqueue(30) — Add 30 to the back. Queue: [10, 20, 30].',
        'queue.enqueue(30) — Añadir 30 al final. Cola: [10, 20, 30].',
      ),
      codeLine: 22,
      variables: { structure: 'Queue', operation: 'enqueue(30)', front: 10, size: 3 },
    })

    steps.push({
      array: [10, 20, 30, 42, EMPTY],
      highlights: { 0: 'active', 1: 'active', 2: 'active', 3: 'placed' },
      sorted: [],
      description: d(
        locale,
        'queue.enqueue(42) — Add 42 to the back. 10 is still first in line.',
        'queue.enqueue(42) — Añadir 42 al final. 10 sigue siendo el primero en la fila.',
      ),
      codeLine: 22,
      variables: { structure: 'Queue', operation: 'enqueue(42)', front: 10, size: 4 },
    })

    // Dequeue operations
    steps.push({
      array: [20, 30, 42, EMPTY, EMPTY],
      highlights: { 0: 'swapped' },
      sorted: [],
      description: d(
        locale,
        'queue.dequeue() → 10. FIFO: the first element added (10) is removed first! Unlike a stack.',
        'queue.dequeue() → 10. FIFO: ¡el primer elemento añadido (10) se retira primero! A diferencia de una pila.',
      ),
      codeLine: 26,
      variables: { structure: 'Queue', operation: 'dequeue()', removed: 10, front: 20, size: 3 },
    })

    steps.push({
      array: [30, 42, EMPTY, EMPTY, EMPTY],
      highlights: { 0: 'swapped' },
      sorted: [],
      description: d(
        locale,
        'queue.dequeue() → 20. Now 30 is at the front. Elements are processed in arrival order.',
        'queue.dequeue() → 20. Ahora 30 está al frente. Los elementos se procesan en orden de llegada.',
      ),
      codeLine: 26,
      variables: { structure: 'Queue', operation: 'dequeue()', removed: 20, front: 30, size: 2 },
    })

    // Summary
    steps.push({
      array: [30, 42, EMPTY, EMPTY, EMPTY],
      highlights: { 0: 'found', 1: 'found' },
      sorted: [],
      description: d(
        locale,
        'Key difference: Stack removes the NEWEST element (LIFO), Queue removes the OLDEST element (FIFO). Both have O(1) operations.',
        'Diferencia clave: La Pila retira el elemento MÁS NUEVO (LIFO), la Cola retira el MÁS ANTIGUO (FIFO). Ambas tienen operaciones O(1).',
      ),
      codeLine: 1,
      variables: { 'Stack': 'LIFO', 'Queue': 'FIFO', complexity: 'O(1)' },
    })

    return steps
  },
}
