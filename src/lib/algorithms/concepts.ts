import type { Algorithm, Step, BigOCurve, MemoTableState } from '@lib/types'
import { d } from '@lib/algorithms/shared'

// ============================================================
// BIG O NOTATION
// ============================================================

const BIG_O_CURVES: Omit<BigOCurve, 'visible' | 'highlighted'>[] = [
  { name: 'O(1)', color: '#34d399' },
  { name: 'O(log n)', color: '#22d3ee' },
  { name: 'O(n)', color: '#fb923c' },
  { name: 'O(n log n)', color: '#c084fc' },
  { name: 'O(n²)', color: '#f87171' },
]

function makeCurves(
  visibleNames: string[],
  highlightedName?: string,
): BigOCurve[] {
  return BIG_O_CURVES.map((c) => ({
    ...c,
    visible: visibleNames.includes(c.name),
    highlighted: c.name === highlightedName,
  }))
}

export const bigONotation: Algorithm = {
  id: 'big-o-notation',
  name: 'Big O Notation',
  category: 'Concepts',
  difficulty: 'easy',
  visualization: 'concept',
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

The chart shows how each complexity's curve grows as the input size increases.`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const all = BIG_O_CURVES.map((c) => c.name)

    // Helper: visible curves up to a certain name
    const upTo = (name: string) => all.slice(0, all.indexOf(name) + 1)

    // Code line references (1-indexed within the code string):
    //  1: // O(1) — Constant time          15: // O(n²) — Quadratic time
    //  2: function getFirst(arr) {         16: function hasDuplicate(arr) {
    //  3:   return arr[0];                 17:   for (let i = 0; ...) {        ← outer loop
    //  6: // O(n) — Linear time            18:     for (let j = i+1; ...) {    ← inner loop
    //  7: function findMax(arr) {          25: // O(log n) — Logarithmic time
    //  9:   for (let i = 1; ...) {         26: function binarySearch(arr, target) {
    //                                      28:   while (lo <= hi) {

    // Step 1: Introduction — no curves yet
    steps.push({
      concept: { type: 'bigO', curves: makeCurves([]), maxN: 10 },
      description: d(
        locale,
        'Big O measures how an algorithm scales. Watch each curve grow as the input size (n) increases.',
        'Big O mide cómo escala un algoritmo. Observa cómo crece cada curva conforme aumenta el tamaño de entrada (n).',
      ),
      codeLine: 1,
      variables: { complexity: '—' },
    })

    // ── O(1) — one step is enough (it's flat) ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(['O(1)'], 'O(1)'), maxN: 10 },
      description: d(
        locale,
        'O(1) — Constant time. No matter how big n gets, operations stay at 1. A perfectly flat line.',
        'O(1) — Tiempo constante. Sin importar cuánto crezca n, las operaciones se mantienen en 1. Una línea perfectamente plana.',
      ),
      codeLine: 3,
      variables: { complexity: 'O(1)', 'ops(1)': 1, 'ops(5)': 1, 'ops(10)': 1 },
    })

    // ── O(log n) — grow from small n to large ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(log n)'), 'O(log n)'), maxN: 4 },
      description: d(
        locale,
        'O(log n) — Logarithmic time. At small inputs (n≤4) it barely grows. Let\'s see what happens as n increases...',
        'O(log n) — Tiempo logarítmico. Con entradas pequeñas (n≤4) apenas crece. Veamos qué pasa cuando n aumenta...',
      ),
      codeLine: 26,
      variables: { complexity: 'O(log n)', 'ops(2)': 1, 'ops(4)': 2 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(log n)'), 'O(log n)'), maxN: 10 },
      description: d(
        locale,
        'O(log n) at n=10: only ~3.3 operations. Halving the problem each step keeps growth very slow — great for binary search.',
        'O(log n) con n=10: solo ~3.3 operaciones. Dividir el problema a la mitad en cada paso mantiene un crecimiento muy lento — ideal para búsqueda binaria.',
      ),
      codeLine: 28,
      variables: { complexity: 'O(log n)', 'ops(4)': 2, 'ops(10)': '3.3' },
    })

    // ── O(n) — grow from small to large ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n)'), 'O(n)'), maxN: 4 },
      description: d(
        locale,
        'O(n) — Linear time. At n=4, 4 operations. It grows proportionally. Watch the diagonal extend...',
        'O(n) — Tiempo lineal. Con n=4, 4 operaciones. Crece proporcionalmente. Observa cómo se extiende la diagonal...',
      ),
      codeLine: 7,
      variables: { complexity: 'O(n)', 'ops(2)': 2, 'ops(4)': 4 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n)'), 'O(n)'), maxN: 10 },
      description: d(
        locale,
        'O(n) at n=10: exactly 10 operations. One operation per element — notice how it pulls away from O(log n).',
        'O(n) con n=10: exactamente 10 operaciones. Una operación por elemento — observa cómo se aleja de O(log n).',
      ),
      codeLine: 9,
      variables: { complexity: 'O(n)', 'ops(4)': 4, 'ops(10)': 10 },
    })

    // ── O(n log n) — grow from small to large ──
    // No dedicated code example; highlight the O(n) section as the closest reference
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n log n)'), 'O(n log n)'), maxN: 4 },
      description: d(
        locale,
        'O(n log n) — Linearithmic. At small n it looks close to O(n). Let\'s see it diverge...',
        'O(n log n) — Linearítmico. Con n pequeño se parece a O(n). Veamos cómo diverge...',
      ),
      codeLine: 9,
      variables: { complexity: 'O(n log n)', 'ops(2)': 2, 'ops(4)': 8 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(upTo('O(n log n)'), 'O(n log n)'), maxN: 10 },
      description: d(
        locale,
        'O(n log n) at n=10: ~33 operations. Typical of Merge Sort and Quick Sort. It bends away from O(n) as n grows.',
        'O(n log n) con n=10: ~33 operaciones. Típico de Merge Sort y Quick Sort. Se curva alejándose de O(n) conforme n crece.',
      ),
      codeLine: 9,
      variables: { complexity: 'O(n log n)', 'ops(5)': '11.6', 'ops(10)': '33.2' },
    })

    // ── O(n²) — grow from small to large (most dramatic) ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all, 'O(n²)'), maxN: 4 },
      description: d(
        locale,
        'O(n²) — Quadratic time. At n=4 it\'s already 16 operations. Nested loops. Watch it explode...',
        'O(n²) — Tiempo cuadrático. Con n=4 ya son 16 operaciones. Bucles anidados. Observa cómo explota...',
      ),
      codeLine: 16,
      variables: { complexity: 'O(n²)', 'ops(2)': 4, 'ops(4)': 16 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all, 'O(n²)'), maxN: 7 },
      description: d(
        locale,
        'O(n²) at n=7: 49 operations — already double O(n log n). The curve is pulling away fast...',
        'O(n²) con n=7: 49 operaciones — ya el doble de O(n log n). La curva se aleja rápidamente...',
      ),
      codeLine: 17,
      variables: { complexity: 'O(n²)', 'ops(5)': 25, 'ops(7)': 49 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all, 'O(n²)'), maxN: 10 },
      description: d(
        locale,
        'O(n²) at n=10: 100 operations! Three times more than O(n log n). Bubble Sort lives here.',
        'O(n²) con n=10: ¡100 operaciones! Tres veces más que O(n log n). Bubble Sort vive aquí.',
      ),
      codeLine: 18,
      variables: { complexity: 'O(n²)', 'ops(10)': 100, 'vs O(n log n)': '33 → 100' },
    })

    // ── Compare all — zoom out progressively ──
    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all), maxN: 25 },
      description: d(
        locale,
        'Zooming out to n=25. The gap becomes dramatic: O(n²)=625 while O(n)=25. Quadratic is 25× worse!',
        'Ampliando a n=25. La brecha se vuelve dramática: O(n²)=625 mientras O(n)=25. ¡Cuadrático es 25× peor!',
      ),
      codeLine: 1,
      variables: { n: 25, 'O(1)': 1, 'O(n)': 25, 'O(n²)': 625 },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeCurves(all), maxN: 50 },
      description: d(
        locale,
        'At n=50: O(1)=1, O(n)=50, O(n²)=2500. Choosing the right algorithm matters enormously as data grows!',
        'Con n=50: O(1)=1, O(n)=50, O(n²)=2500. ¡Elegir el algoritmo correcto importa enormemente conforme crecen los datos!',
      ),
      codeLine: 1,
      variables: { n: 50, 'O(1)': 1, 'O(n)': 50, 'O(n²)': 2500 },
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
  difficulty: 'easy',
  visualization: 'concept',
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

    // Code line references (1-indexed within the code string):
    //  1: function factorial(n) {
    //  2:   // Base case: factorial of 0 or 1 is 1
    //  3:   if (n <= 1) return 1;
    //  4:   (empty)
    //  5:   // Recursive case: n * factorial(n - 1)
    //  6:   return n * factorial(n - 1);
    //  7: }

    // Step 1: Introduction
    steps.push({
      concept: {
        type: 'callStack',
        frames: [],
      },
      description: d(
        locale,
        'Let\'s compute factorial(5). Recursion breaks the problem into smaller calls stacked on the call stack.',
        'Calculemos factorial(5). La recursión divide el problema en llamadas más pequeñas apiladas en la pila de llamadas.',
      ),
      codeLine: 1,
      variables: { n: 5 },
    })

    // Going down the call stack
    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(5): n=5, not a base case. It needs factorial(4), so it pushes a new call onto the stack.',
        'factorial(5): n=5, no es caso base. Necesita factorial(4), así que agrega una nueva llamada a la pila.',
      ),
      codeLine: 6,
      variables: { n: 5, returns: '5 × factorial(4)' },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(4): n=4, not a base case. Call factorial(3). The stack grows deeper.',
        'factorial(4): n=4, no es caso base. Llamar factorial(3). La pila crece.',
      ),
      codeLine: 6,
      variables: { n: 4, returns: '4 × factorial(3)', stackDepth: 2 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(3): n=3, not a base case. Call factorial(2). Stack keeps growing.',
        'factorial(3): n=3, no es caso base. Llamar factorial(2). La pila sigue creciendo.',
      ),
      codeLine: 6,
      variables: { n: 3, returns: '3 × factorial(2)', stackDepth: 3 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'waiting' },
          { label: 'factorial(2)', detail: '2 × factorial(1)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'factorial(2): n=2, not a base case. Call factorial(1). Almost at the base!',
        'factorial(2): n=2, no es caso base. Llamar factorial(1). ¡Casi en el caso base!',
      ),
      codeLine: 6,
      variables: { n: 2, returns: '2 × factorial(1)', stackDepth: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'waiting' },
          { label: 'factorial(2)', detail: '2 × factorial(1)', state: 'waiting' },
          { label: 'factorial(1)', detail: 'return 1', state: 'base' },
        ],
      },
      description: d(
        locale,
        'factorial(1): BASE CASE reached! n ≤ 1, return 1. Now results will propagate back up the stack.',
        'factorial(1): ¡CASO BASE alcanzado! n ≤ 1, retorna 1. Ahora los resultados se propagan hacia arriba.',
      ),
      codeLine: 3,
      variables: { n: 1, returns: 1, stackDepth: 5 },
    })

    // Going back up the call stack
    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × factorial(2)', state: 'waiting' },
          { label: 'factorial(2)', detail: '2 × 1 = 2', state: 'active' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(2): receives 1 from factorial(1). Returns 2 × 1 = 2. Frame popped from stack.',
        'Volviendo a factorial(2): recibe 1 de factorial(1). Retorna 2 × 1 = 2. Frame eliminado de la pila.',
      ),
      codeLine: 6,
      variables: { n: 2, 'factorial(1)': 1, returns: '2 × 1 = 2', stackDepth: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × factorial(3)', state: 'waiting' },
          { label: 'factorial(3)', detail: '3 × 2 = 6', state: 'active' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(3): receives 2 from factorial(2). Returns 3 × 2 = 6. Stack unwinding.',
        'Volviendo a factorial(3): recibe 2 de factorial(2). Retorna 3 × 2 = 6. La pila se desenrolla.',
      ),
      codeLine: 6,
      variables: { n: 3, 'factorial(2)': 2, returns: '3 × 2 = 6', stackDepth: 3 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × factorial(4)', state: 'waiting' },
          { label: 'factorial(4)', detail: '4 × 6 = 24', state: 'active' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(4): receives 6 from factorial(3). Returns 4 × 6 = 24. Almost done!',
        'Volviendo a factorial(4): recibe 6 de factorial(3). Retorna 4 × 6 = 24. ¡Casi listo!',
      ),
      codeLine: 6,
      variables: { n: 4, 'factorial(3)': 6, returns: '4 × 6 = 24', stackDepth: 2 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'factorial(5)', detail: '5 × 24 = 120', state: 'resolved' },
        ],
      },
      description: d(
        locale,
        'Back to factorial(5): receives 24 from factorial(4). Returns 5 × 24 = 120. Done! The call stack is empty.',
        'Volviendo a factorial(5): recibe 24 de factorial(4). Retorna 5 × 24 = 120. ¡Listo! La pila está vacía.',
      ),
      codeLine: 6,
      variables: { n: 5, 'factorial(4)': 24, result: 120, stackDepth: 0 },
    })

    return steps
  },
}

// ============================================================
// STACK
// ============================================================

type SQItem = { value: number; state: 'normal' | 'entering' | 'leaving' }

function sq(items: SQItem[]): SQItem[] {
  return items
}

export const stack: Algorithm = {
  id: 'stack',
  name: 'Stack',
  category: 'Data Structures',
  difficulty: 'easy',
  visualization: 'concept',
  code: `class Stack {
  constructor() { this.items = []; }

  push(item) {
    this.items.push(item);
  }

  pop() {
    return this.items.pop();
  }

  peek() {
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  get size() {
    return this.items.length;
  }
}`,
  description: `Stack

A Stack is a linear data structure that follows the LIFO principle — Last In, First Out. Like a stack of plates: you add and remove from the top only.

Operations:
  - push: add element to the top — O(1)
  - pop: remove element from the top — O(1)
  - peek: view top element without removing — O(1)
  - isEmpty: check if stack is empty — O(1)

Applications:
  - Undo/redo functionality
  - Browser history (back/forward)
  - Function call stack
  - Depth-First Search (DFS)
  - Expression evaluation and parsing
  - Balanced parentheses checking

Space Complexity: O(n) for n elements`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: [] },
      description: d(locale,
        'An empty Stack. LIFO: Last In, First Out — like a stack of plates.',
        'Una Pila vacía. LIFO: Último en Entrar, Primero en Salir — como una pila de platos.',
      ),
      codeLine: 1,
      variables: { size: 0 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'entering' }]), operation: 'push(10)' },
      description: d(locale,
        'push(10): 10 is placed on top. It\'s the only element.',
        'push(10): 10 se coloca arriba. Es el único elemento.',
      ),
      codeLine: 4,
      variables: { operation: 'push(10)', top: 10, size: 1 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'entering' }]), operation: 'push(20)' },
      description: d(locale,
        'push(20): 20 goes on top of 10.',
        'push(20): 20 va encima del 10.',
      ),
      codeLine: 4,
      variables: { operation: 'push(20)', top: 20, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'entering' }]), operation: 'push(30)' },
      description: d(locale,
        'push(30): Stack is now [10, 20, 30] with 30 on top.',
        'push(30): La pila ahora es [10, 20, 30] con 30 arriba.',
      ),
      codeLine: 4,
      variables: { operation: 'push(30)', top: 30, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'normal' }, { value: 42, state: 'entering' }]), operation: 'push(42)' },
      description: d(locale,
        'push(42): The most recent element is always on top.',
        'push(42): El elemento más reciente siempre está arriba.',
      ),
      codeLine: 4,
      variables: { operation: 'push(42)', top: 42, size: 4 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'normal' }]), operation: 'pop() → 42', removedValue: 42 },
      description: d(locale,
        'pop() → 42. LIFO: the last pushed element is removed first!',
        'pop() → 42. LIFO: ¡el último elemento apilado se retira primero!',
      ),
      codeLine: 8,
      variables: { operation: 'pop()', removed: 42, top: 30, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }]), operation: 'pop() → 30', removedValue: 30 },
      description: d(locale,
        'pop() → 30. Now 20 is the top. Elements come out in reverse insertion order.',
        'pop() → 30. Ahora 20 está arriba. Los elementos salen en orden inverso al de inserción.',
      ),
      codeLine: 8,
      variables: { operation: 'pop()', removed: 30, top: 20, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'stack', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }]), operation: 'peek() → 20' },
      description: d(locale,
        'peek() → 20. View the top without removing it. All operations are O(1)!',
        'peek() → 20. Ver el tope sin eliminarlo. ¡Todas las operaciones son O(1)!',
      ),
      codeLine: 11,
      variables: { operation: 'peek()', top: 20, size: 2, complexity: 'O(1)' },
    })

    return steps
  },
}

// ============================================================
// QUEUE
// ============================================================

export const queue: Algorithm = {
  id: 'queue',
  name: 'Queue',
  category: 'Data Structures',
  difficulty: 'easy',
  visualization: 'concept',
  code: `class Queue {
  constructor() { this.items = []; }

  enqueue(item) {
    this.items.push(item);
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  get size() {
    return this.items.length;
  }
}`,
  description: `Queue

A Queue is a linear data structure that follows the FIFO principle — First In, First Out. Like a line at a store: the first person in line is served first.

Operations:
  - enqueue: add element to the back — O(1)
  - dequeue: remove element from the front — O(1)*
  - front: view front element without removing — O(1)
  - isEmpty: check if queue is empty — O(1)

*Note: shift() is O(n) with arrays; use a linked list or circular buffer for true O(1).

Applications:
  - Task scheduling (CPU, printer)
  - Breadth-First Search (BFS)
  - Message buffers and event queues
  - Rate limiting
  - Order processing systems

Space Complexity: O(n) for n elements`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: [] },
      description: d(locale,
        'An empty Queue. FIFO: First In, First Out — like a line at a store.',
        'Una Cola vacía. FIFO: Primero en Entrar, Primero en Salir — como una fila en una tienda.',
      ),
      codeLine: 1,
      variables: { size: 0 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'entering' }]), operation: 'enqueue(10)' },
      description: d(locale,
        'enqueue(10): 10 enters at the back of the queue.',
        'enqueue(10): 10 entra por el final de la cola.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(10)', front: 10, size: 1 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'entering' }]), operation: 'enqueue(20)' },
      description: d(locale,
        'enqueue(20): 20 joins at the back. 10 is still at the front.',
        'enqueue(20): 20 se une al final. 10 sigue al frente.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(20)', front: 10, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'entering' }]), operation: 'enqueue(30)' },
      description: d(locale,
        'enqueue(30): Queue is [10, 20, 30]. 10 arrived first, so it\'s served first.',
        'enqueue(30): La cola es [10, 20, 30]. 10 llegó primero, así que se atiende primero.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(30)', front: 10, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 10, state: 'normal' }, { value: 20, state: 'normal' }, { value: 30, state: 'normal' }, { value: 42, state: 'entering' }]), operation: 'enqueue(42)' },
      description: d(locale,
        'enqueue(42): 42 goes to the back. Processing order: 10 → 20 → 30 → 42.',
        'enqueue(42): 42 va al final. Orden de procesamiento: 10 → 20 → 30 → 42.',
      ),
      codeLine: 4,
      variables: { operation: 'enqueue(42)', front: 10, size: 4 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 20, state: 'normal' }, { value: 30, state: 'normal' }, { value: 42, state: 'normal' }]), operation: 'dequeue() → 10', removedValue: 10 },
      description: d(locale,
        'dequeue() → 10. FIFO: the first element added is removed first! Unlike a stack.',
        'dequeue() → 10. FIFO: ¡el primer elemento añadido se retira primero! A diferencia de una pila.',
      ),
      codeLine: 8,
      variables: { operation: 'dequeue()', removed: 10, front: 20, size: 3 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 30, state: 'normal' }, { value: 42, state: 'normal' }]), operation: 'dequeue() → 20', removedValue: 20 },
      description: d(locale,
        'dequeue() → 20. Now 30 is at the front. Elements are always processed in arrival order.',
        'dequeue() → 20. Ahora 30 está al frente. Los elementos se procesan siempre en orden de llegada.',
      ),
      codeLine: 8,
      variables: { operation: 'dequeue()', removed: 20, front: 30, size: 2 },
    })

    steps.push({
      concept: { type: 'stackQueue', structure: 'queue', items: sq([{ value: 30, state: 'normal' }, { value: 42, state: 'normal' }]), operation: 'front() → 30' },
      description: d(locale,
        'front() → 30. View the front without removing it. All operations are O(1)!',
        'front() → 30. Ver el frente sin eliminarlo. ¡Todas las operaciones son O(1)!',
      ),
      codeLine: 12,
      variables: { operation: 'front()', front: 30, size: 2, complexity: 'O(1)' },
    })

    return steps
  },
}

// ============================================================
// TWO POINTERS
// ============================================================

export const twoPointers: Algorithm = {
  id: 'two-pointers',
  name: 'Two Pointers',
  category: 'Concepts',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `function twoSumSorted(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    const sum = arr[left] + arr[right];
    if (sum === target) {
      return [left, right];
    } else if (sum < target) {
      left++;   // need bigger sum
    } else {
      right--;  // need smaller sum
    }
  }
  return null; // no pair found
}`,
  description: `Two Pointers

Two Pointers is a technique where two indices move through a data structure (usually an array) to solve problems efficiently.

Common patterns:
  - Left & Right: start from both ends, move inward
  - Slow & Fast: both start from beginning at different speeds

This example finds two numbers in a sorted array that add up to a target.

Time Complexity: O(n) — each pointer moves at most n times
Space Complexity: O(1) — only two variables

Classic problems:
  - Two Sum (sorted array)
  - Container with most water
  - Remove duplicates in-place
  - Palindrome checking
  - Linked list cycle detection (slow/fast)`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const arr = [1, 3, 5, 7, 9, 12, 15]
    const target = 14

    const hl = (l: number, r: number, extra: Record<number, string> = {}) => {
      const h: Record<number, string> = {}
      for (let i = 0; i < arr.length; i++) h[i] = 'default'
      h[l] = 'left'
      h[r] = 'right'
      Object.assign(h, extra)
      return h as any
    }

    steps.push({
      concept: { type: 'twoPointers', array: arr, left: 0, right: 6, highlights: hl(0, 6), target },
      description: d(locale,
        `Find two numbers that sum to ${target} in a sorted array. Left starts at index 0, right at the end.`,
        `Encontrar dos números que sumen ${target} en un arreglo ordenado. Left empieza en índice 0, right al final.`,
      ),
      codeLine: 2,
      variables: { target, left: 0, right: 6 },
    })

    steps.push({
      concept: { type: 'twoPointers', array: arr, left: 0, right: 6, highlights: hl(0, 6), sum: 16, target },
      description: d(locale,
        '1 + 15 = 16 > 14. Sum is too big → move right pointer left to try a smaller value.',
        '1 + 15 = 16 > 14. La suma es muy grande → mover right a la izquierda para un valor menor.',
      ),
      codeLine: 11,
      variables: { 'arr[L]': 1, 'arr[R]': 15, sum: 16, vs: '> 14' },
    })

    steps.push({
      concept: { type: 'twoPointers', array: arr, left: 0, right: 5, highlights: hl(0, 5, { 6: 'checked' }), sum: 13, target },
      description: d(locale,
        '1 + 12 = 13 < 14. Sum is too small → move left pointer right to try a bigger value.',
        '1 + 12 = 13 < 14. La suma es muy pequeña → mover left a la derecha para un valor mayor.',
      ),
      codeLine: 9,
      variables: { 'arr[L]': 1, 'arr[R]': 12, sum: 13, vs: '< 14' },
    })

    steps.push({
      concept: { type: 'twoPointers', array: arr, left: 1, right: 5, highlights: hl(1, 5, { 0: 'checked', 6: 'checked' }), sum: 15, target },
      description: d(locale,
        '3 + 12 = 15 > 14. Still too big → move right pointer left.',
        '3 + 12 = 15 > 14. Aún muy grande → mover right a la izquierda.',
      ),
      codeLine: 11,
      variables: { 'arr[L]': 3, 'arr[R]': 12, sum: 15, vs: '> 14' },
    })

    steps.push({
      concept: { type: 'twoPointers', array: arr, left: 1, right: 4, highlights: hl(1, 4, { 0: 'checked', 5: 'checked', 6: 'checked' }), sum: 12, target },
      description: d(locale,
        '3 + 9 = 12 < 14. Too small → move left pointer right.',
        '3 + 9 = 12 < 14. Muy pequeña → mover left a la derecha.',
      ),
      codeLine: 9,
      variables: { 'arr[L]': 3, 'arr[R]': 9, sum: 12, vs: '< 14' },
    })

    steps.push({
      concept: { type: 'twoPointers', array: arr, left: 2, right: 4, highlights: { ...hl(2, 4, { 0: 'checked', 1: 'checked', 5: 'checked', 6: 'checked' }), 2: 'found', 4: 'found' } as any, sum: 14, target },
      description: d(locale,
        '5 + 9 = 14 ✓ Found! Only 5 checks instead of 21 brute-force pairs. O(n) vs O(n²).',
        '5 + 9 = 14 ✓ ¡Encontrado! Solo 5 comprobaciones en lugar de 21 pares por fuerza bruta. O(n) vs O(n²).',
      ),
      codeLine: 7,
      variables: { 'arr[L]': 5, 'arr[R]': 9, sum: 14, result: '[2, 4]' },
    })

    return steps
  },
}

// ============================================================
// SLIDING WINDOW
// ============================================================

export const slidingWindow: Algorithm = {
  id: 'sliding-window',
  name: 'Sliding Window',
  category: 'Concepts',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `function longestUniqueSubstring(s) {
  const seen = new Set();
  let start = 0, best = 0, bestStart = 0;

  for (let end = 0; end < s.length; end++) {
    while (seen.has(s[end])) {
      seen.delete(s[start]);
      start++;
    }
    seen.add(s[end]);
    if (end - start + 1 > best) {
      best = end - start + 1;
      bestStart = start;
    }
  }
  return s.slice(bestStart, bestStart + best);
}`,
  codeSamples: [
    {
      language: 'cpp',
      code: `#include <string>
#include <unordered_set>

std::string longestUniqueSubstring(const std::string& s) {
  std::unordered_set<char> window;
  std::size_t start = 0, bestStart = 0, bestLen = 0;

  for (std::size_t end = 0; end < s.size(); ++end) {
    while (window.count(s[end])) {
      window.erase(s[start]);
      ++start;
    }
    window.insert(s[end]);
    if (end - start + 1 > bestLen) {
      bestLen = end - start + 1;
      bestStart = start;
    }
  }

  return s.substr(bestStart, bestLen);
}`,
    },
    {
      language: 'java',
      code: `import java.util.HashSet;
import java.util.Set;

class SlidingWindow {
  static String longestUniqueSubstring(String s) {
    Set<Character> window = new HashSet<>();
    int start = 0, bestStart = 0, bestLen = 0;

    for (int end = 0; end < s.length(); end++) {
      while (window.contains(s.charAt(end))) {
        window.remove(s.charAt(start));
        start++;
      }
      window.add(s.charAt(end));
      if (end - start + 1 > bestLen) {
        bestLen = end - start + 1;
        bestStart = start;
      }
    }

    return s.substring(bestStart, bestStart + bestLen);
  }
}`,
    },
  ],
  description: `Sliding Window

Sliding Window maintains a dynamic range (window) over a sequence, expanding and contracting to solve substring/subarray problems efficiently.

How it works:
1. Expand the window by moving the right pointer
2. If a condition is violated, shrink from the left
3. Track the best result seen so far

This example finds the longest substring without repeating characters.

Time Complexity: O(n) — each character is visited at most twice
Space Complexity: O(min(n, alphabet))

Classic problems:
  - Longest substring without repeating chars
  - Minimum window substring
  - Maximum sum subarray of size k
  - Longest repeating character replacement`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const str = 'abcbad'
    const chars = str.split('')

    type CS = Record<number, 'outside' | 'inWindow' | 'current' | 'duplicate'>

    const mkStates = (start: number, end: number, extra: Record<number, string> = {}): CS => {
      const s: CS = {}
      for (let i = 0; i < chars.length; i++) {
        if (i >= start && i <= end) s[i] = 'inWindow'
        else s[i] = 'outside'
      }
      if (end >= 0 && end < chars.length) s[end] = 'current'
      Object.assign(s, extra)
      return s
    }

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 0, windowEnd: -1, charStates: mkStates(0, -1) },
      description: d(locale,
        `Find the longest substring without repeating characters in "${str}".`,
        `Encontrar la subcadena más larga sin caracteres repetidos en "${str}".`,
      ),
      codeLine: 1,
      variables: { string: str, best: 0 },
    })

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 0, windowEnd: 0, charStates: mkStates(0, 0), best: { start: 0, end: 0 }, operation: 'expand → "a"' },
      description: d(locale, '"a" — unique. Window = "a", best = 1.', '"a" — único. Ventana = "a", mejor = 1.'),
      codeLine: 5,
      variables: { window: 'a', best: 1 },
    })

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 0, windowEnd: 1, charStates: mkStates(0, 1), best: { start: 0, end: 1 }, operation: 'expand → "ab"' },
      description: d(locale, '"b" is new. Window = "ab", best = 2.', '"b" es nuevo. Ventana = "ab", mejor = 2.'),
      codeLine: 9,
      variables: { window: 'ab', best: 2 },
    })

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 0, windowEnd: 2, charStates: mkStates(0, 2), best: { start: 0, end: 2 }, operation: 'expand → "abc"' },
      description: d(locale, '"c" is new. Window = "abc", best = 3!', '"c" es nuevo. Ventana = "abc", ¡mejor = 3!'),
      codeLine: 10,
      variables: { window: 'abc', best: 3 },
    })

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 0, windowEnd: 3, charStates: { ...mkStates(0, 3), 1: 'duplicate', 3: 'duplicate' } as CS, best: { start: 0, end: 2 }, operation: '"b" repeated!' },
      description: d(locale,
        '"b" at index 3 is already in window (index 1)! Must shrink from the left until "b" is removed.',
        '"b" en índice 3 ya está en la ventana (índice 1)! Debemos encoger desde la izquierda hasta eliminar "b".',
      ),
      codeLine: 6,
      variables: { duplicate: 'b', 'first at': 1, 'new at': 3 },
    })

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 2, windowEnd: 3, charStates: mkStates(2, 3), best: { start: 0, end: 2 }, operation: 'shrink → "cb"' },
      description: d(locale,
        'Shrink: removed "a" and "b" from left. Window = "cb". best still 3.',
        'Encoger: eliminados "a" y "b" por la izquierda. Ventana = "cb". mejor sigue siendo 3.',
      ),
      codeLine: 8,
      variables: { window: 'cb', best: 3 },
    })

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 2, windowEnd: 4, charStates: mkStates(2, 4), best: { start: 0, end: 2 }, operation: 'expand → "cba"' },
      description: d(locale, '"a" is new. Window = "cba", length 3 = best.', '"a" es nuevo. Ventana = "cba", longitud 3 = mejor.'),
      codeLine: 9,
      variables: { window: 'cba', best: 3 },
    })

    steps.push({
      concept: { type: 'slidingWindow', chars, windowStart: 2, windowEnd: 5, charStates: mkStates(2, 5), best: { start: 2, end: 5 }, operation: 'expand → "cbad" ★ new best!' },
      description: d(locale,
        '"d" is new. Window = "cbad", length 4 — new best! Done. O(n) time, just one pass.',
        '"d" es nuevo. Ventana = "cbad", longitud 4 — ¡nuevo mejor! Fin. Tiempo O(n), una sola pasada.',
      ),
      codeLine: 10,
      variables: { window: 'cbad', best: 4, complexity: 'O(n)' },
    })

    return steps
  },
}

// ============================================================
// SPACE COMPLEXITY (reuses BigO chart)
// ============================================================

const SPACE_CURVES: Omit<BigOCurve, 'visible' | 'highlighted'>[] = [
  { name: 'O(1)', color: '#34d399' },
  { name: 'O(log n)', color: '#22d3ee' },
  { name: 'O(n)', color: '#fb923c' },
  { name: 'O(n²)', color: '#f87171' },
]

function makeSpaceCurves(visible: string[], highlighted?: string): BigOCurve[] {
  return SPACE_CURVES.map((c) => ({
    ...c,
    visible: visible.includes(c.name),
    highlighted: c.name === highlighted,
  }))
}

export const spaceComplexity: Algorithm = {
  id: 'space-complexity',
  name: 'Space Complexity',
  category: 'Concepts',
  difficulty: 'easy',
  visualization: 'concept',
  code: `// O(1) space — fixed variables
function swap(arr, i, j) {
  const temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

// O(log n) space — recursive call stack
function binarySearch(arr, target, lo, hi) {
  if (lo > hi) return -1;
  const mid = Math.floor((lo + hi) / 2);
  if (arr[mid] === target) return mid;
  if (arr[mid] < target)
    return binarySearch(arr, target, mid + 1, hi);
  return binarySearch(arr, target, lo, mid - 1);
}

// O(n) space — copy of input
function reversed(arr) {
  const copy = [...arr]; // allocates n elements
  return copy.reverse();
}

// O(n²) space — 2D matrix
function createMatrix(n) {
  return Array.from({ length: n },
    () => new Array(n).fill(0));
}`,
  description: `Space Complexity

Space Complexity measures the amount of memory an algorithm uses relative to the input size. Like time complexity, we use Big O notation.

Common space complexities:
  O(1)     — Constant: fixed number of variables
  O(log n) — Logarithmic: recursive call stack depth
  O(n)     — Linear: one copy of the input
  O(n²)    — Quadratic: 2D matrix of input size

Important distinction:
  - Auxiliary space: extra memory beyond the input
  - Total space: input + auxiliary

Examples:
  O(1): in-place sorting (Bubble Sort), variable swaps
  O(log n): recursive binary search (call stack)
  O(n): Merge Sort (temporary arrays), hash tables
  O(n²): DP tables, adjacency matrices`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const all = SPACE_CURVES.map((c) => c.name)

    steps.push({
      concept: { type: 'bigO', curves: makeSpaceCurves([]), maxN: 10, yLabel: 'memory' },
      description: d(locale,
        'Space complexity measures memory usage as input grows. The chart shows how each complexity scales.',
        'La complejidad espacial mide el uso de memoria conforme crece la entrada. El gráfico muestra cómo escala cada complejidad.',
      ),
      codeLine: 1,
      variables: { metric: 'memory' },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeSpaceCurves(['O(1)'], 'O(1)'), maxN: 10, yLabel: 'memory' },
      description: d(locale,
        'O(1) space: constant memory. Just a few variables regardless of input size. Example: swapping two elements.',
        'O(1) espacio: memoria constante. Solo unas variables sin importar el tamaño. Ejemplo: intercambiar dos elementos.',
      ),
      codeLine: 2,
      variables: { complexity: 'O(1)', example: 'swap, in-place sort' },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeSpaceCurves(['O(1)', 'O(log n)'], 'O(log n)'), maxN: 10, yLabel: 'memory' },
      description: d(locale,
        'O(log n) space: recursive call stack. Each level adds a frame; binary search halves → log n depth.',
        'O(log n) espacio: pila de llamadas recursivas. Cada nivel añade un frame; búsqueda binaria divide → profundidad log n.',
      ),
      codeLine: 9,
      variables: { complexity: 'O(log n)', example: 'recursive binary search' },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeSpaceCurves(['O(1)', 'O(log n)', 'O(n)'], 'O(n)'), maxN: 10, yLabel: 'memory' },
      description: d(locale,
        'O(n) space: a copy of the input. Arrays, hash maps, or Merge Sort\'s temp arrays all use linear space.',
        'O(n) espacio: una copia de la entrada. Arrays, hash maps, o los arrays temporales de Merge Sort usan espacio lineal.',
      ),
      codeLine: 19,
      variables: { complexity: 'O(n)', example: 'array copy, hash map' },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeSpaceCurves(all, 'O(n²)'), maxN: 10, yLabel: 'memory' },
      description: d(locale,
        'O(n²) space: a 2D matrix. DP tables and adjacency matrices use quadratic memory.',
        'O(n²) espacio: una matriz 2D. Tablas de DP y matrices de adyacencia usan memoria cuadrática.',
      ),
      codeLine: 26,
      variables: { complexity: 'O(n²)', example: 'DP table, adjacency matrix' },
    })

    steps.push({
      concept: { type: 'bigO', curves: makeSpaceCurves(all), maxN: 50, yLabel: 'memory' },
      description: d(locale,
        'At n=50: O(1)=1, O(n)=50, O(n²)=2500 memory units. Choosing space-efficient algorithms matters!',
        'Con n=50: O(1)=1, O(n)=50, O(n²)=2500 unidades de memoria. ¡Elegir algoritmos eficientes en espacio importa!',
      ),
      codeLine: 1,
      variables: { n: 50, 'O(1)': 1, 'O(n)': 50, 'O(n²)': 2500 },
    })

    return steps
  },
}

// ============================================================
// MEMOIZATION
// ============================================================

export const memoization: Algorithm = {
  id: 'memoization',
  name: 'Memoization',
  category: 'Concepts',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `// Without memoization — O(2^n) time!
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// With memoization — O(n) time!
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n]; // cache hit!
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo)
           + fibMemo(n - 2, memo);
  return memo[n];
}

// fibMemo(7):
// Only computes each value ONCE
// Then reuses cached results`,
  description: `Memoization

Memoization is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

Without memoization (Fibonacci):
  fib(5) calls fib(4) + fib(3)
  fib(4) calls fib(3) + fib(2)  ← fib(3) computed AGAIN!
  Exponential: O(2^n) time

With memoization:
  Each value is computed ONCE and cached
  Subsequent calls with the same input return instantly
  Linear: O(n) time, O(n) space

Key insight: trade space for time
  - Store results in a dictionary/array
  - Before computing, check if result exists
  - Dramatic speedup for overlapping subproblems

This is the foundation of Dynamic Programming (bottom-up).`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    const mkEntries = (upTo: number, computing?: number, hits?: number[]): MemoTableState['entries'] => {
      const fibs = [0, 1, 1, 2, 3, 5, 8, 13]
      return Array.from({ length: 8 }, (_, i) => ({
        key: i,
        value: i <= upTo ? fibs[i] : null,
        state: (computing === i ? 'computing' : hits?.includes(i) ? 'hit' : i <= upTo ? 'cached' : 'empty') as any,
      }))
    }

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(-1), operation: 'fibonacci with memoization' },
      description: d(locale,
        'Computing fib(7) with memoization. The table stores results. Without memo: 41 calls. With memo: just 8!',
        'Calculando fib(7) con memoización. La tabla almacena resultados. Sin memo: 41 llamadas. ¡Con memo: solo 8!',
      ),
      codeLine: 8,
      variables: { 'without memo': '41 calls (2^n)', 'with memo': '8 calls (n)' },
    })

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(0, 0), currentCall: 'fib(0) = 0 (base case)', operation: 'base cases' },
      description: d(locale, 'fib(0) = 0. Base case, store in cache.', 'fib(0) = 0. Caso base, guardar en caché.'),
      codeLine: 10,
      variables: { n: 0, result: 0 },
    })

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(1, 1), currentCall: 'fib(1) = 1 (base case)', operation: 'base cases' },
      description: d(locale, 'fib(1) = 1. Base case, store in cache.', 'fib(1) = 1. Caso base, guardar en caché.'),
      codeLine: 10,
      variables: { n: 1, result: 1 },
    })

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(2, 2, [0, 1]), currentCall: 'fib(2) = fib(1) + fib(0) = 1 + 0 = 1' },
      description: d(locale,
        'fib(2): needs fib(1) and fib(0). Both cached → HIT! No recomputation.',
        'fib(2): necesita fib(1) y fib(0). ¡Ambos en caché → HIT! Sin recalcular.',
      ),
      codeLine: 11,
      variables: { n: 2, 'fib(1)': '1 ✓ hit', 'fib(0)': '0 ✓ hit', result: 1 },
    })

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(3, 3, [2, 1]), currentCall: 'fib(3) = fib(2) + fib(1) = 1 + 1 = 2' },
      description: d(locale,
        'fib(3): fib(2)=1 ✓ cached, fib(1)=1 ✓ cached. Result: 2.',
        'fib(3): fib(2)=1 ✓ en caché, fib(1)=1 ✓ en caché. Resultado: 2.',
      ),
      codeLine: 11,
      variables: { n: 3, result: 2 },
    })

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(5, 5, [4, 3]), currentCall: 'fib(5) = fib(4) + fib(3) = 3 + 2 = 5' },
      description: d(locale,
        'fib(4)=3 and fib(5)=5. Each value computed exactly ONCE then cached forever.',
        'fib(4)=3 y fib(5)=5. Cada valor se computa exactamente UNA VEZ y se cachea para siempre.',
      ),
      codeLine: 12,
      variables: { n: 5, result: 5 },
    })

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(6, 6, [5, 4]), currentCall: 'fib(6) = fib(5) + fib(4) = 5 + 3 = 8' },
      description: d(locale, 'fib(6) = 8. Both sub-results are instant cache hits.', 'fib(6) = 8. Ambos sub-resultados son hits de caché instantáneos.'),
      codeLine: 11,
      variables: { n: 6, result: 8 },
    })

    steps.push({
      concept: { type: 'memoTable', entries: mkEntries(7, 7, [6, 5]), currentCall: 'fib(7) = fib(6) + fib(5) = 8 + 5 = 13' },
      description: d(locale,
        'fib(7) = 13. Done! O(n) with memo vs O(2^n) without. 8 calls vs 41!',
        'fib(7) = 13. ¡Listo! O(n) con memo vs O(2^n) sin ella. ¡8 llamadas vs 41!',
      ),
      codeLine: 11,
      variables: { result: 13, 'with memo': 'O(n)', 'without': 'O(2^n)' },
    })

    return steps
  },
}

// ============================================================
// GREEDY VS DYNAMIC PROGRAMMING
// ============================================================

export const greedyVsDp: Algorithm = {
  id: 'greedy-vs-dp',
  name: 'Greedy vs DP',
  category: 'Concepts',
  difficulty: 'advanced',
  visualization: 'concept',
  code: `// GREEDY: always pick the largest coin first
function greedyCoinChange(coins, amount) {
  coins.sort((a, b) => b - a); // largest first
  const result = [];
  for (const coin of coins) {
    while (amount >= coin) {
      result.push(coin);
      amount -= coin;
    }
  }
  return amount === 0 ? result : null;
}

// DP: find the optimal solution
function dpCoinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  const used = Array(amount + 1).fill(-1);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
        used[i] = coin;
      }
    }
  }
  // Reconstruct solution
  const result = [];
  let rem = amount;
  while (rem > 0) { result.push(used[rem]); rem -= used[rem]; }
  return result;
}`,
  description: `Greedy vs Dynamic Programming

Both Greedy and DP solve optimization problems, but they differ fundamentally:

Greedy:
  - Makes the locally optimal choice at each step
  - Fast: usually O(n log n) or O(n)
  - Does NOT always find the global optimum
  - Works when the "greedy choice property" holds

Dynamic Programming:
  - Considers ALL possible choices
  - Finds the globally optimal solution — always
  - Slower: usually O(n × m) time and space
  - Works for problems with overlapping subproblems

This example uses the Coin Change problem:
  Given coins [1, 4, 6], make amount 8.
  Greedy picks 6+1+1 = 3 coins (suboptimal!)
  DP finds 4+4 = 2 coins (optimal!)

Greedy fails here because picking the largest coin first doesn't guarantee the minimum number of coins.`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const coins = [1, 4, 6]
    const target = 8

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [], remaining: target, approach: 'greedy' },
      description: d(locale,
        `Coin Change: make ${target} using coins [${coins.join(', ')}] with fewest coins. Let's try Greedy first.`,
        `Cambio de monedas: formar ${target} con monedas [${coins.join(', ')}] con el mínimo. Probemos Greedy primero.`,
      ),
      codeLine: 2,
      variables: { target, coins: '[1, 4, 6]', approach: 'Greedy' },
    })

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [6], remaining: 2, approach: 'greedy', operation: 'Greedy: pick largest (6)' },
      description: d(locale,
        'Greedy picks the largest coin that fits: 6. Remaining: 8 - 6 = 2.',
        'Greedy elige la moneda más grande que cabe: 6. Restante: 8 - 6 = 2.',
      ),
      codeLine: 7,
      variables: { picked: 6, remaining: 2 },
    })

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [6, 1], remaining: 1, approach: 'greedy', operation: 'Greedy: 6,4 too big → pick 1' },
      description: d(locale,
        'Remaining 2: 6 too big, 4 too big. Pick 1. Remaining: 1.',
        'Restante 2: 6 muy grande, 4 muy grande. Elegir 1. Restante: 1.',
      ),
      codeLine: 7,
      variables: { picked: 1, remaining: 1 },
    })

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [6, 1, 1], remaining: 0, approach: 'greedy', operation: 'Greedy done: 6+1+1 = 3 coins' },
      description: d(locale,
        'Greedy result: [6, 1, 1] = 3 coins. But is this optimal? Let\'s try DP...',
        'Resultado Greedy: [6, 1, 1] = 3 monedas. ¿Pero es óptimo? Probemos DP...',
      ),
      codeLine: 10,
      variables: { result: '[6, 1, 1]', totalCoins: 3 },
    })

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [], remaining: target, approach: 'dp', operation: 'DP: explore ALL combinations' },
      description: d(locale,
        'DP explores all possibilities. For amount 8, it checks every combination to find the minimum.',
        'DP explora todas las posibilidades. Para monto 8, verifica cada combinación para encontrar el mínimo.',
      ),
      codeLine: 16,
      variables: { approach: 'DP', target: 8 },
    })

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [4], remaining: 4, approach: 'dp', operation: 'DP: try coin 4' },
      description: d(locale,
        'DP considers coin 4: remaining 4. Can use coin 4 again!',
        'DP considera moneda 4: restante 4. ¡Puede usar moneda 4 de nuevo!',
      ),
      codeLine: 21,
      variables: { picked: 4, remaining: 4 },
    })

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [4, 4], remaining: 0, approach: 'dp', operation: 'DP optimal: 4+4 = 2 coins ✓' },
      description: d(locale,
        'DP finds [4, 4] = 2 coins. Optimal! Greedy missed this because it greedily picked 6 first.',
        'DP encuentra [4, 4] = 2 monedas. ¡Óptimo! Greedy no lo encontró porque eligió 6 primero.',
      ),
      codeLine: 22,
      variables: { result: '[4, 4]', totalCoins: 2, optimal: true },
    })

    steps.push({
      concept: { type: 'coinChange', coins, target, selected: [], remaining: 0, approach: 'compare', greedyResult: [6, 1, 1], dpResult: [4, 4], operation: 'Greedy: 3 coins vs DP: 2 coins' },
      description: d(locale,
        'Greedy (3 coins) vs DP (2 coins). Greedy is fast but not always optimal. DP guarantees the best answer.',
        'Greedy (3 monedas) vs DP (2 monedas). Greedy es rápido pero no siempre óptimo. DP garantiza la mejor respuesta.',
      ),
      codeLine: 1,
      variables: { greedy: '3 coins', dp: '2 coins ✓', lesson: 'Greedy ≠ optimal' },
    })

    return steps
  },
}
