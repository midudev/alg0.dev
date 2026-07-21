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

export { towerOfHanoi }
