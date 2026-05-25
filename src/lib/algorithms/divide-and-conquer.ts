import type { Algorithm, Step, HighlightType } from '@lib/types'
import { d } from '@lib/algorithms/shared'

// ============================================================
// TOWER OF HANOI
// ============================================================
const towerOfHanoi: Algorithm = {
  id: 'tower-of-hanoi',
  name: 'Tower of Hanoi',
  category: 'Divide and Conquer',
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
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
      description: d(locale, `Tower of Hanoi: Move ${numDisks} disks from peg 0 to peg 2. Disks: 3 (large), 2 (medium), 1 (small).`, `Torre de Hanoi: Mover ${numDisks} discos de la torre 0 a la torre 2. Discos: 3 (grande), 2 (mediano), 1 (pequeño).`),
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
        description: d(locale, `Move ${moveCount}: disk ${disk} from peg ${source} → peg ${target}`, `Movimiento ${moveCount}: disco ${disk} de torre ${source} → torre ${target}`),
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
      description: d(locale, `Tower of Hanoi complete! All ${numDisks} disks moved to peg 2 in ${moveCount} moves.`, `¡Torre de Hanoi completada! Los ${numDisks} discos movidos a la torre 2 en ${moveCount} movimientos.`),
      codeLine: 14,
      variables: { totalMoves: moveCount, n: numDisks },
    })

    return steps
  },
}

// ============================================================
// BINARY EXPONENTIATION
// ============================================================
const binaryExponentiation: Algorithm = {
  id: 'binary-exponentiation',
  name: 'Binary Exponentiation',
  category: 'Divide and Conquer',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `function binPow(base, exp) {
  if (exp === 0) return 1
  const half = binPow(base, exp >> 1)
  if (exp % 2 === 0) {
    return half * half
  }
  return half * half * base
}`,
  description: `Binary Exponentiation

Binary Exponentiation computes aⁿ in O(log n) time by halving the exponent at each recursive step, rather than multiplying a by itself n times.

How it works:
1. Base case: a⁰ = 1
2. Divide: recursively compute half = binPow(base, exp >> 1)
3. Conquer (even exp): return half × half
4. Conquer (odd exp):  return half × half × a

Example: 2¹⁰ uses only 4 recursive calls (10 → 5 → 2 → 1 → 0) instead of 9 naive multiplications.

Time Complexity:  O(log n) — exponent halves each call
Space Complexity: O(log n) — recursive call stack depth`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    // Code line references (1-indexed):
    //  1: function binPow(base, exp) {
    //  2:   if (exp === 0) return 1
    //  3:   const half = binPow(base, exp >> 1)
    //  4:   if (exp % 2 === 0) {
    //  5:     return half * half
    //  6:   }
    //  7:   return half * half * base
    //  8: }

    // Example: binPow(2, 10) = 1024
    // Descent: 10 → 5 → 2 → 1 → 0  (4 recursive calls, shows both even and odd cases)

    steps.push({
      concept: { type: 'callStack', frames: [] },
      description: d(
        locale,
        "Let's compute 2¹⁰ = 1024 using binary exponentiation. Instead of 9 multiplications, we need only 4 recursive calls — one per bit in the exponent.",
        'Calculemos 2¹⁰ = 1024 con exponenciación binaria. En lugar de 9 multiplicaciones, solo necesitamos 4 llamadas recursivas — una por bit del exponente.',
      ),
      codeLine: 1,
      variables: { base: 2, exp: 10 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [{ label: 'binPow(2, 10)', detail: 'exp=10 is even → call binPow(2, 5)', state: 'active' }],
      },
      description: d(
        locale,
        'binPow(2, 10): exp=10, not the base case. Divide: call binPow(2, 10 >> 1) = binPow(2, 5).',
        'binPow(2, 10): exp=10, no es caso base. Dividir: llamar binPow(2, 10 >> 1) = binPow(2, 5).',
      ),
      codeLine: 3,
      variables: { base: 2, exp: 10 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'exp=5 is odd → call binPow(2, 2)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 5): exp=5, not the base case. Divide: call binPow(2, 5 >> 1) = binPow(2, 2). Stack grows.',
        'binPow(2, 5): exp=5, no es caso base. Dividir: llamar binPow(2, 5 >> 1) = binPow(2, 2). La pila crece.',
      ),
      codeLine: 3,
      variables: { base: 2, exp: 5, stackDepth: 2 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'waiting for binPow(2, 2)…', state: 'waiting' },
          { label: 'binPow(2, 2)', detail: 'exp=2 is even → call binPow(2, 1)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 2): exp=2, not the base case. Divide: call binPow(2, 2 >> 1) = binPow(2, 1). Stack depth = 3.',
        'binPow(2, 2): exp=2, no es caso base. Dividir: llamar binPow(2, 2 >> 1) = binPow(2, 1). Profundidad = 3.',
      ),
      codeLine: 3,
      variables: { base: 2, exp: 2, stackDepth: 3 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'waiting for binPow(2, 2)…', state: 'waiting' },
          { label: 'binPow(2, 2)', detail: 'waiting for binPow(2, 1)…', state: 'waiting' },
          { label: 'binPow(2, 1)', detail: 'exp=1 is odd → call binPow(2, 0)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 1): exp=1, not the base case. Divide: call binPow(2, 1 >> 1) = binPow(2, 0). Stack depth = 4.',
        'binPow(2, 1): exp=1, no es caso base. Dividir: llamar binPow(2, 1 >> 1) = binPow(2, 0). Profundidad = 4.',
      ),
      codeLine: 3,
      variables: { base: 2, exp: 1, stackDepth: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'waiting for binPow(2, 2)…', state: 'waiting' },
          { label: 'binPow(2, 2)', detail: 'waiting for binPow(2, 1)…', state: 'waiting' },
          { label: 'binPow(2, 1)', detail: 'waiting for binPow(2, 0)…', state: 'waiting' },
          { label: 'binPow(2, 0)', detail: 'BASE CASE: exp=0, return 1', state: 'base' },
        ],
      },
      description: d(
        locale,
        "BASE CASE reached! exp=0, return 1. Stack depth = ⌈log₂ 10⌉ = 4 calls — that's O(log n). Now results propagate back up.",
        '¡CASO BASE alcanzado! exp=0, retorna 1. Profundidad = ⌈log₂ 10⌉ = 4 llamadas — eso es O(log n). Ahora los resultados se propagan hacia arriba.',
      ),
      codeLine: 2,
      variables: { base: 2, exp: 0, returns: 1, stackDepth: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'waiting for binPow(2, 2)…', state: 'waiting' },
          { label: 'binPow(2, 2)', detail: 'waiting for binPow(2, 1)…', state: 'waiting' },
          { label: 'binPow(2, 1)', detail: 'half=1, 1 is odd → 1×1×2 = 2', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 1): half=1, exp=1 is odd → return half × half × base = 1×1×2 = 2. Frame popped.',
        'binPow(2, 1): half=1, exp=1 es impar → retorna half × half × base = 1×1×2 = 2. Frame eliminado.',
      ),
      codeLine: 7,
      variables: { base: 2, exp: 1, half: 1, returns: 2 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'waiting for binPow(2, 2)…', state: 'waiting' },
          { label: 'binPow(2, 2)', detail: 'half=2, 2 is even → 2×2 = 4', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 2): half=2, exp=2 is even → return half × half = 2×2 = 4. Stack unwinding.',
        'binPow(2, 2): half=2, exp=2 es par → retorna half × half = 2×2 = 4. La pila se desenrolla.',
      ),
      codeLine: 5,
      variables: { base: 2, exp: 2, half: 2, returns: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'half=4, 5 is odd → 4×4×2 = 32', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 5): half=4, exp=5 is odd → return half × half × base = 4×4×2 = 32. Almost done!',
        'binPow(2, 5): half=4, exp=5 es impar → retorna half × half × base = 4×4×2 = 32. ¡Casi listo!',
      ),
      codeLine: 7,
      variables: { base: 2, exp: 5, half: 4, returns: 32 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [{ label: 'binPow(2, 10)', detail: 'half=32, 10 is even → 32×32 = 1024', state: 'resolved' }],
      },
      description: d(
        locale,
        'binPow(2, 10): half=32, exp=10 is even → return half × half = 32×32 = 1024. Final result!',
        'binPow(2, 10): half=32, exp=10 es par → retorna half × half = 32×32 = 1024. ¡Resultado final!',
      ),
      codeLine: 5,
      variables: { base: 2, exp: 10, half: 32, returns: 1024 },
    })

    steps.push({
      concept: { type: 'callStack', frames: [] },
      description: d(
        locale,
        "2¹⁰ = 1024, computed in just 4 calls instead of 9 multiplications. That's the power of O(log n).",
        '2¹⁰ = 1024, calculado en solo 4 llamadas en lugar de 9 multiplicaciones. Ese es el poder de O(log n).',
      ),
      codeLine: 5,
      variables: { result: 1024 },
    })

    return steps
  },
}

export { towerOfHanoi, binaryExponentiation }
