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
      description: d(
        locale,
        `Tower of Hanoi: Move ${numDisks} disks from peg 0 to peg 2. Disks: 3 (large), 2 (medium), 1 (small).`,
        `Torre de Hanoi: Mover ${numDisks} discos de la torre 0 a la torre 2. Discos: 3 (grande), 2 (mediano), 1 (pequeño).`,
      ),
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
        description: d(
          locale,
          `Move ${moveCount}: disk ${disk} from peg ${source} → peg ${target}`,
          `Movimiento ${moveCount}: disco ${disk} de torre ${source} → torre ${target}`,
        ),
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
      description: d(
        locale,
        `Tower of Hanoi complete! All ${numDisks} disks moved to peg 2 in ${moveCount} moves.`,
        `¡Torre de Hanoi completada! Los ${numDisks} discos movidos a la torre 2 en ${moveCount} movimientos.`,
      ),
      codeLine: 14,
      variables: { totalMoves: moveCount, n: numDisks },
    })

    return steps
  },
}

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
}

binPow(2, 10);`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'callStack', frames: [] },
      description: d(
        locale,
        "Let's compute 2¹⁰ = 1024 using binary exponentiation. Instead of 9 multiplications, we need only 4 recursive calls.",
        'Calculemos 2¹⁰ = 1024 con exponenciación binaria. En lugar de 9 multiplicaciones, solo necesitamos 4 llamadas recursivas.',
      ),
      codeLine: 1,
      variables: { base: 2, exp: 10 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'exp=10 is even → call binPow(2, 5)', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 10): divide the exponent by 2 and recurse on 5.',
        'binPow(2, 10): dividir el exponente entre 2 y recursar sobre 5.',
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
        'binPow(2, 5): recurse on 2. Odd exponents will multiply by the base on the way back.',
        'binPow(2, 5): recursar sobre 2. Los exponentes impares multiplicarán por la base al regresar.',
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
        'binPow(2, 2): recurse on 1. The stack depth is growing logarithmically.',
        'binPow(2, 2): recursar sobre 1. La profundidad de la pila crece logarítmicamente.',
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
        'binPow(2, 1): recurse on 0, which will trigger the base case.',
        'binPow(2, 1): recursar sobre 0, lo que activará el caso base.',
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
          { label: 'binPow(2, 0)', detail: 'BASE CASE: return 1', state: 'base' },
        ],
      },
      description: d(
        locale,
        'Base case: any number to the power of 0 is 1. Now unwind the stack.',
        'Caso base: cualquier número elevado a 0 es 1. Ahora desenrollamos la pila.',
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
          { label: 'binPow(2, 1)', detail: 'half=1, odd → 1×1×2 = 2', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 1): odd exponent, so multiply by the base after squaring the half result.',
        'binPow(2, 1): exponente impar, así que se multiplica por la base después de elevar half al cuadrado.',
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
          { label: 'binPow(2, 2)', detail: 'half=2, even → 2×2 = 4', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 2): even exponent, so just square the half result.',
        'binPow(2, 2): exponente par, así que solo se eleva al cuadrado el resultado half.',
      ),
      codeLine: 5,
      variables: { base: 2, exp: 2, half: 2, returns: 4 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'waiting for binPow(2, 5)…', state: 'waiting' },
          { label: 'binPow(2, 5)', detail: 'half=4, odd → 4×4×2 = 32', state: 'active' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 5): odd exponent again, so square 4 and multiply by 2.',
        'binPow(2, 5): exponente impar otra vez, así que se eleva 4 al cuadrado y se multiplica por 2.',
      ),
      codeLine: 7,
      variables: { base: 2, exp: 5, half: 4, returns: 32 },
    })

    steps.push({
      concept: {
        type: 'callStack',
        frames: [
          { label: 'binPow(2, 10)', detail: 'half=32, even → 32×32 = 1024', state: 'resolved' },
        ],
      },
      description: d(
        locale,
        'binPow(2, 10): final step. Square 32 to get 1024.',
        'binPow(2, 10): paso final. Elevar 32 al cuadrado para obtener 1024.',
      ),
      codeLine: 5,
      variables: { base: 2, exp: 10, half: 32, returns: 1024 },
      consoleOutput: ['1024'],
    })

    steps.push({
      concept: { type: 'callStack', frames: [] },
      description: d(
        locale,
        '2¹⁰ = 1024, computed with logarithmic recursion depth instead of linear repeated multiplication.',
        '2¹⁰ = 1024, calculado con profundidad recursiva logarítmica en lugar de multiplicación repetida lineal.',
      ),
      codeLine: 5,
      variables: { result: 1024 },
    })

    return steps
  },
}

export { towerOfHanoi, binaryExponentiation }
