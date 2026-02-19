import type { Algorithm, Step, HighlightType } from '@lib/types'
import { d } from '@lib/algorithms/shared'

const nQueens: Algorithm = {
  id: 'n-queens',
  name: 'N-Queens Problem',
  category: 'Backtracking',
  difficulty: 'advanced',
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
  codeSamples: [
    {
      language: 'cpp',
      code: `#include <vector>
#include <string>

bool solve(int row, int n, std::vector<std::string>& board,
           std::vector<bool>& cols,
           std::vector<bool>& diag1,
           std::vector<bool>& diag2) {
  if (row == n) return true;
  for (int col = 0; col < n; ++col) {
    if (cols[col] || diag1[row + col] || diag2[row - col + n - 1]) continue;
    board[row][col] = 'Q';
    cols[col] = diag1[row + col] = diag2[row - col + n - 1] = true;
    if (solve(row + 1, n, board, cols, diag1, diag2)) return true;
    cols[col] = diag1[row + col] = diag2[row - col + n - 1] = false;
    board[row][col] = '.';
  }
  return false;
}

std::vector<std::string> solveNQueens(int n) {
  std::vector<std::string> board(n, std::string(n, '.'));
  std::vector<bool> cols(n, false);
  std::vector<bool> diag1(2 * n - 1, false);
  std::vector<bool> diag2(2 * n - 1, false);
  solve(0, n, board, cols, diag1, diag2);
  return board;
}`,
    },
    {
      language: 'java',
      code: `import java.util.Arrays;

class NQueensSolver {
  static char[][] solveNQueens(int n) {
    char[][] board = new char[n][n];
    for (char[] row : board) {
      Arrays.fill(row, '.');
    }
    boolean[] cols = new boolean[n];
    boolean[] diag1 = new boolean[2 * n - 1];
    boolean[] diag2 = new boolean[2 * n - 1];
    backtrack(0, n, board, cols, diag1, diag2);
    return board;
  }

  private static boolean backtrack(int row, int n, char[][] board,
                                   boolean[] cols,
                                   boolean[] diag1,
                                   boolean[] diag2) {
    if (row == n) return true;
    for (int col = 0; col < n; col++) {
      if (cols[col] || diag1[row + col] || diag2[row - col + n - 1]) continue;
      board[row][col] = 'Q';
      cols[col] = diag1[row + col] = diag2[row - col + n - 1] = true;
      if (backtrack(row + 1, n, board, cols, diag1, diag2)) return true;
      board[row][col] = '.';
      cols[col] = diag1[row + col] = diag2[row - col + n - 1] = false;
    }
    return false;
  }
}`,
    },
  ],
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

  generateSteps(locale = 'en') {
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

    makeStep({}, d(locale, `Empty ${N}x${N} board. Place ${N} queens with no conflicts.`, `Tablero ${N}x${N} vacío. Colocar ${N} reinas sin conflictos.`), 1, { n: N })

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
          makeStep(ph, d(locale, `Placed queen at (${row}, ${col})`, `Reina colocada en (${row}, ${col})`), 22, { row, col, isSafe: true })

          if (solve(row + 1)) return true

          board[row][col] = 0
          const rh = getQueenHighlights()
          rh[`${row},${col}`] = 'conflict'
          makeStep(rh, d(locale, `Backtracking: removed queen from (${row}, ${col})`, `Backtracking: reina removida de (${row}, ${col})`), 24, {
            row,
            col,
            action: 'backtrack',
          })
        } else {
          const ch = getQueenHighlights()
          ch[`${row},${col}`] = 'conflict'
          makeStep(ch, d(locale, `(${row}, ${col}) not safe — conflicts with existing queen`, `(${row}, ${col}) no es seguro — conflicto con reina existente`), 21, {
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
    makeStep(fh, d(locale, `Solution found! All ${N} queens placed without conflicts.`, `¡Solución encontrada! Las ${N} reinas colocadas sin conflictos.`), 29, {
      n: N,
      solved: true,
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
  difficulty: 'advanced',
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

  generateSteps(locale = 'en') {
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
      description: d(locale, '4×4 Sudoku puzzle. Fill with numbers 1-4, no repeats in rows, columns, or 2×2 boxes.', 'Sudoku 4×4. Rellenar con números 1-4, sin repetir en filas, columnas o cajas 2×2.'),
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
                description: d(locale, `Trying ${num} at (${r}, ${c})`, `Probando ${num} en (${r}, ${c})`),
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
                  description: d(locale, `Placed ${num} at (${r}, ${c}) — valid!`, `${num} colocado en (${r}, ${c}) — ¡válido!`),
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
                  description: d(locale, `Backtrack: removed ${num} from (${r}, ${c})`, `Backtrack: ${num} removido de (${r}, ${c})`),
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
                  description: d(locale, `${num} at (${r}, ${c}) — conflict!`, `${num} en (${r}, ${c}) — ¡conflicto!`),
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
      description: d(locale, 'Sudoku solved! All cells filled with valid numbers.', '¡Sudoku resuelto! Todas las celdas llenas con números válidos.'),
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
  difficulty: 'intermediate',
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

  generateSteps(locale = 'en') {
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
      description: d(locale, 'Maze initialized. Finding shortest path from S(0,0) to E(5,5) using BFS.', 'Laberinto inicializado. Buscando el camino más corto de S(0,0) a E(5,5) usando BFS.'),
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
        description: d(locale, `Exploring cell (${cr}, ${cc})`, `Explorando celda (${cr}, ${cc})`),
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
        description: d(locale, `Path found! Length: ${path.length}. Route: ${path.map(([r, c]) => `(${r},${c})`).join(' → ')}`, `¡Camino encontrado! Longitud: ${path.length}. Ruta: ${path.map(([r, c]) => `(${r},${c})`).join(' → ')}`),
        codeLine: 22,
        variables: { pathLength: path.length },
      })
    }

    return steps
  },
}

export { nQueens, sudokuSolver, mazePathfinding }
