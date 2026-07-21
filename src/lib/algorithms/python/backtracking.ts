import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const backtrackingPython: Record<string, CodeImplementation> = {
  'n-queens': annotated(`def solve_n_queens(n):  #@1
    board = [['.'] * n for _ in range(n)]

    def is_safe(row, col):
        for i in range(row):
            if board[i][col] == 'Q':
                return False

        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i, j = i - 1, j - 1

        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q':
                return False
            i, j = i - 1, j + 1

        return True

    def solve(row):
        if row == n:
            return True

        for col in range(n):  #@20
            if is_safe(row, col):  #@21
                board[row][col] = 'Q'  #@22
                if solve(row + 1):
                    return True
                board[row][col] = '.'  # Backtrack

        return False

    solve(0)
    return board  #@29`),

  'sudoku-solver': annotated(`def solve_sudoku(board):  #@1
    def is_valid(row, col, num):
        for c in range(4):
            if board[row][c] == num:
                return False

        for r in range(4):
            if board[r][col] == num:
                return False

        box_r = (row // 2) * 2
        box_c = (col // 2) * 2
        for r in range(box_r, box_r + 2):
            for c in range(box_c, box_c + 2):
                if board[r][c] == num:
                    return False

        return True

    def solve():
        for r in range(4):
            for c in range(4):
                if board[r][c] == 0:
                    for num in range(1, 5):  #@22
                        if is_valid(r, c, num):  #@23
                            board[r][c] = num  #@24
                            if solve():
                                return True
                            board[r][c] = 0  # Backtrack
                    return False
        return True  #@33

    solve()
    return board`),

  'maze-pathfinding': annotated(`def maze_bfs(maze, start, end):  #@1
    rows = len(maze)
    cols = len(maze[0])
    visited = [[False] * cols for _ in range(rows)]
    parent = [[None] * cols for _ in range(rows)]

    queue = [start]
    visited[start[0]][start[1]] = True
    dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]

    while len(queue) > 0:
        r, c = queue.pop(0)  #@14

        if r == end[0] and c == end[1]:
            # Reconstruct path
            path = []
            curr = end
            while curr:
                path.insert(0, curr)
                curr = parent[curr[0]][curr[1]]
            return path  #@22

        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if (nr >= 0 and nr < rows and nc >= 0 and
                    nc < cols and not visited[nr][nc] and
                    maze[nr][nc] == 0):
                visited[nr][nc] = True
                parent[nr][nc] = [r, c]
                queue.append([nr, nc])

    return None  # No path found`),
}
