import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const backtrackingCpp: Record<string, CodeImplementation> = {
  'n-queens': annotated(`vector<vector<char>> solveNQueens(int n) {  //@1
    vector<vector<char>> board(n, vector<char>(n, '.'));

    solve(board, 0, n);
    return board;  //@29
}

bool isSafe(vector<vector<char>>& board, int row, int col, int n) {
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

bool solve(vector<vector<char>>& board, int row, int n) {
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

  'sudoku-solver': annotated(`vector<vector<int>> solveSudoku(vector<vector<int>>& board) {  //@1
    solve(board);
    return board;
}

bool isValid(vector<vector<int>>& board, int row, int col, int num) {
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

bool solve(vector<vector<int>>& board) {
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

  'maze-pathfinding': annotated(`vector<pair<int, int>> mazeBfs(
    vector<vector<int>>& maze,
    pair<int, int> start,
    pair<int, int> end
) {  //@1
    int rows = maze.size();
    int cols = maze[0].size();
    vector<vector<bool>> visited(rows, vector<bool>(cols, false));
    vector<vector<pair<int, int>>> parent(rows, vector<pair<int, int>>(cols, {-1, -1}));

    queue<pair<int, int>> q;
    q.push(start);
    visited[start.first][start.second] = true;
    int dirs[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};

    while (!q.empty()) {
        auto [r, c] = q.front();  //@14
        q.pop();

        if (r == end.first && c == end.second) {
            // Reconstruct path
            vector<pair<int, int>> path;
            pair<int, int> curr = end;
            while (curr.first != -1) {
                path.insert(path.begin(), curr);
                curr = parent[curr.first][curr.second];
            }
            return path;  //@22
        }

        for (auto& d : dirs) {
            int nr = r + d[0], nc = c + d[1];
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols
                    && !visited[nr][nc] && maze[nr][nc] == 0) {
                visited[nr][nc] = true;
                parent[nr][nc] = {r, c};
                q.push({nr, nc});
            }
        }
    }

    return {}; // No path found
}`),
}
