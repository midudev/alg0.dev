import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const backtrackingRust: Record<string, CodeImplementation> = {
  'n-queens': annotated(`fn solve_n_queens(n: usize) -> Vec<Vec<char>> {  //@1
    let mut board = vec![vec!['.'; n]; n];

    solve(&mut board, 0, n);
    board  //@29
}

fn is_safe(board: &[Vec<char>], row: usize, col: usize, n: usize) -> bool {
    for i in 0..row {
        if board[i][col] == 'Q' {
            return false;
        }
    }

    let (mut i, mut j) = (row as i32 - 1, col as i32 - 1);
    while i >= 0 && j >= 0 {
        if board[i as usize][j as usize] == 'Q' {
            return false;
        }
        i -= 1;
        j -= 1;
    }

    let (mut i, mut j) = (row as i32 - 1, col as i32 + 1);
    while i >= 0 && j < n as i32 {
        if board[i as usize][j as usize] == 'Q' {
            return false;
        }
        i -= 1;
        j += 1;
    }

    true
}

fn solve(board: &mut Vec<Vec<char>>, row: usize, n: usize) -> bool {
    if row == n {
        return true;
    }

    for col in 0..n {  //@20
        if is_safe(board, row, col, n) {  //@21
            board[row][col] = 'Q';  //@22
            if solve(board, row + 1, n) {
                return true;
            }
            board[row][col] = '.'; // Backtrack
        }
    }

    false
}`),

  'sudoku-solver': annotated(`fn solve_sudoku(mut board: Vec<Vec<i32>>) -> Vec<Vec<i32>> {  //@1
    solve(&mut board);
    board
}

fn is_valid(board: &[Vec<i32>], row: usize, col: usize, num: i32) -> bool {
    for c in 0..4 {
        if board[row][c] == num {
            return false;
        }
    }

    for r in 0..4 {
        if board[r][col] == num {
            return false;
        }
    }

    let box_r = (row / 2) * 2;
    let box_c = (col / 2) * 2;
    for r in box_r..box_r + 2 {
        for c in box_c..box_c + 2 {
            if board[r][c] == num {
                return false;
            }
        }
    }

    true
}

fn solve(board: &mut Vec<Vec<i32>>) -> bool {
    for r in 0..4 {
        for c in 0..4 {
            if board[r][c] == 0 {
                for num in 1..=4 {  //@22
                    if is_valid(board, r, c, num) {  //@23
                        board[r][c] = num;  //@24
                        if solve(board) {
                            return true;
                        }
                        board[r][c] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    true  //@33
}`),

  'maze-pathfinding': annotated(`use std::collections::VecDeque;

fn maze_bfs(
    maze: &[Vec<i32>],
    start: (usize, usize),
    end: (usize, usize),
) -> Option<Vec<(usize, usize)>> {  //@1
    let rows = maze.len();
    let cols = maze[0].len();
    let mut visited = vec![vec![false; cols]; rows];
    let mut parent: Vec<Vec<Option<(usize, usize)>>> = vec![vec![None; cols]; rows];

    let mut queue: VecDeque<(usize, usize)> = VecDeque::new();
    queue.push_back(start);
    visited[start.0][start.1] = true;
    let dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)];

    while let Some((r, c)) = queue.pop_front() {  //@14
        if (r, c) == end {
            // Reconstruct path
            let mut path = Vec::new();
            let mut curr = Some(end);
            while let Some(cell) = curr {
                path.insert(0, cell);
                curr = parent[cell.0][cell.1];
            }
            return Some(path);  //@22
        }

        for (dr, dc) in dirs {
            let nr = r as i32 + dr;
            let nc = c as i32 + dc;
            if nr >= 0 && nr < rows as i32 && nc >= 0 && nc < cols as i32 {
                let (nr, nc) = (nr as usize, nc as usize);
                if !visited[nr][nc] && maze[nr][nc] == 0 {
                    visited[nr][nc] = true;
                    parent[nr][nc] = Some((r, c));
                    queue.push_back((nr, nc));
                }
            }
        }
    }

    None // No path found
}`),
}
