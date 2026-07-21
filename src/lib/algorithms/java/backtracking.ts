import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const backtrackingJava: Record<string, CodeImplementation> = {
  'n-queens': annotated(`char[][] solveNQueens(int n) {  //@1
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');

    solve(board, 0, n);
    return board;  //@29
}

boolean isSafe(char[][] board, int row, int col, int n) {
    for (int i = 0; i < row; i++) {
        if (board[i][col] == 'Q') return false;
    }

    for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 'Q') return false;
    }

    for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (board[i][j] == 'Q') return false;
    }

    return true;
}

boolean solve(char[][] board, int row, int n) {
    if (row == n) return true;

    for (int col = 0; col < n; col++) {  //@20
        if (isSafe(board, row, col, n)) {  //@21
            board[row][col] = 'Q';  //@22
            if (solve(board, row + 1, n)) return true;
            board[row][col] = '.'; // Backtrack
        }
    }

    return false;
}`),

  'sudoku-solver': annotated(`int[][] solveSudoku(int[][] board) {  //@1
    solve(board);
    return board;
}

boolean isValid(int[][] board, int row, int col, int num) {
    for (int c = 0; c < 4; c++) {
        if (board[row][c] == num) return false;
    }

    for (int r = 0; r < 4; r++) {
        if (board[r][col] == num) return false;
    }

    int boxR = (row / 2) * 2;
    int boxC = (col / 2) * 2;
    for (int r = boxR; r < boxR + 2; r++) {
        for (int c = boxC; c < boxC + 2; c++) {
            if (board[r][c] == num) return false;
        }
    }

    return true;
}

boolean solve(int[][] board) {
    for (int r = 0; r < 4; r++) {
        for (int c = 0; c < 4; c++) {
            if (board[r][c] == 0) {
                for (int num = 1; num <= 4; num++) {  //@22
                    if (isValid(board, r, c, num)) {  //@23
                        board[r][c] = num;  //@24
                        if (solve(board)) return true;
                        board[r][c] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;  //@33
}`),

  'maze-pathfinding': annotated(`List<int[]> mazeBfs(int[][] maze, int[] start, int[] end) {  //@1
    int rows = maze.length;
    int cols = maze[0].length;
    boolean[][] visited = new boolean[rows][cols];
    int[][][] parent = new int[rows][cols][];

    Queue<int[]> queue = new LinkedList<>();
    queue.add(start);
    visited[start[0]][start[1]] = true;
    int[][] dirs = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!queue.isEmpty()) {
        int[] cell = queue.poll();  //@14
        int r = cell[0], c = cell[1];

        if (r == end[0] && c == end[1]) {
            // Reconstruct path
            List<int[]> path = new ArrayList<>();
            int[] curr = end;
            while (curr != null) {
                path.add(0, curr);
                curr = parent[curr[0]][curr[1]];
            }
            return path;  //@22
        }

        for (int[] d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !visited[nr][nc] && maze[nr][nc] == 0) {
                visited[nr][nc] = true;
                parent[nr][nc] = new int[]{r, c};
                queue.add(new int[]{nr, nc});
            }
        }
    }

    return null; // No path found
}`),
}
