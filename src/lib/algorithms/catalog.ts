import type { AlgorithmSummary, CategorySummary } from '@lib/types'

/**
 * Lightweight algorithm list for the sidebar and routing.
 * Intentionally free of code strings, step generators, and language packs so
 * the client shell can load without pulling the full algorithm library.
 */
export const algorithmCatalog: AlgorithmSummary[] = [
  // Concepts
  {
    id: 'big-o-notation',
    name: 'Big O Notation',
    category: 'Concepts',
    difficulty: 'easy',
    visualization: 'concept',
  },
  {
    id: 'recursion',
    name: 'Recursion',
    category: 'Concepts',
    difficulty: 'easy',
    visualization: 'concept',
  },
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    category: 'Concepts',
    difficulty: 'intermediate',
    visualization: 'concept',
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    category: 'Concepts',
    difficulty: 'intermediate',
    visualization: 'concept',
  },
  {
    id: 'space-complexity',
    name: 'Space Complexity',
    category: 'Concepts',
    difficulty: 'easy',
    visualization: 'concept',
  },
  {
    id: 'memoization',
    name: 'Memoization',
    category: 'Concepts',
    difficulty: 'intermediate',
    visualization: 'concept',
  },
  {
    id: 'greedy-vs-dp',
    name: 'Greedy vs DP',
    category: 'Concepts',
    difficulty: 'advanced',
    visualization: 'concept',
  },
  // Data Structures
  {
    id: 'stack',
    name: 'Stack',
    category: 'Data Structures',
    difficulty: 'easy',
    visualization: 'concept',
  },
  {
    id: 'queue',
    name: 'Queue',
    category: 'Data Structures',
    difficulty: 'easy',
    visualization: 'concept',
  },
  {
    id: 'linked-list',
    name: 'Linked List',
    category: 'Data Structures',
    difficulty: 'easy',
    visualization: 'concept',
  },
  {
    id: 'hash-table',
    name: 'Hash Table',
    category: 'Data Structures',
    difficulty: 'intermediate',
    visualization: 'concept',
  },
  {
    id: 'binary-search-tree',
    name: 'Binary Search Tree',
    category: 'Data Structures',
    difficulty: 'intermediate',
    visualization: 'concept',
  },
  {
    id: 'heap',
    name: 'Heap',
    category: 'Data Structures',
    difficulty: 'intermediate',
    visualization: 'concept',
  },
  // Sorting
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Sorting',
    difficulty: 'easy',
    visualization: 'array',
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    category: 'Sorting',
    difficulty: 'easy',
    visualization: 'array',
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    category: 'Sorting',
    difficulty: 'easy',
    visualization: 'array',
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'shell-sort',
    name: 'Shell Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'bucket-sort',
    name: 'Bucket Sort',
    category: 'Sorting',
    difficulty: 'intermediate',
    visualization: 'concept',
  },
  // Searching
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Searching',
    difficulty: 'easy',
    visualization: 'array',
  },
  {
    id: 'linear-search',
    name: 'Linear Search',
    category: 'Searching',
    difficulty: 'easy',
    visualization: 'array',
  },
  {
    id: 'jump-search',
    name: 'Jump Search',
    category: 'Searching',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'interpolation-search',
    name: 'Interpolation Search',
    category: 'Searching',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  // Graphs
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    category: 'Graphs',
    difficulty: 'intermediate',
    visualization: 'graph',
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    category: 'Graphs',
    difficulty: 'intermediate',
    visualization: 'graph',
  },
  {
    id: 'dijkstra',
    name: "Dijkstra's Algorithm",
    category: 'Graphs',
    difficulty: 'advanced',
    visualization: 'graph',
  },
  {
    id: 'prim',
    name: "Prim's Algorithm",
    category: 'Graphs',
    difficulty: 'advanced',
    visualization: 'graph',
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    category: 'Graphs',
    difficulty: 'advanced',
    visualization: 'graph',
  },
  // Dynamic Programming
  {
    id: 'fibonacci-dp',
    name: 'Fibonacci DP',
    category: 'Dynamic Programming',
    difficulty: 'intermediate',
    visualization: 'array',
  },
  {
    id: 'knapsack',
    name: 'Knapsack 0/1',
    category: 'Dynamic Programming',
    difficulty: 'advanced',
    visualization: 'matrix',
  },
  {
    id: 'lcs',
    name: 'Longest Common Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'advanced',
    visualization: 'matrix',
  },
  // Backtracking
  {
    id: 'n-queens',
    name: 'N-Queens Problem',
    category: 'Backtracking',
    difficulty: 'advanced',
    visualization: 'matrix',
  },
  {
    id: 'sudoku-solver',
    name: 'Sudoku Solver',
    category: 'Backtracking',
    difficulty: 'advanced',
    visualization: 'matrix',
  },
  {
    id: 'maze-pathfinding',
    name: 'Maze Pathfinding',
    category: 'Backtracking',
    difficulty: 'intermediate',
    visualization: 'matrix',
  },
  // Divide and Conquer
  {
    id: 'tower-of-hanoi',
    name: 'Tower of Hanoi',
    category: 'Divide and Conquer',
    difficulty: 'intermediate',
    visualization: 'matrix',
  },
  // Math
  {
    id: 'sieve-of-eratosthenes',
    name: 'Sieve of Eratosthenes',
    category: 'Math',
    difficulty: 'intermediate',
    visualization: 'matrix',
  },
  // Compression
  {
    id: 'huffman-coding',
    name: 'Huffman Coding',
    category: 'Compression',
    difficulty: 'advanced',
    visualization: 'concept',
  },
]

const CATEGORY_ORDER = [
  'Concepts',
  'Data Structures',
  'Sorting',
  'Searching',
  'Graphs',
  'Dynamic Programming',
  'Backtracking',
  'Divide and Conquer',
  'Math',
  'Compression',
] as const

export const catalogCategories: CategorySummary[] = CATEGORY_ORDER.map((name) => ({
  name,
  algorithms: algorithmCatalog.filter((a) => a.category === name),
}))

export function getCatalogEntry(id: string): AlgorithmSummary | undefined {
  return algorithmCatalog.find((a) => a.id === id)
}

export function isKnownAlgorithmId(id: string): boolean {
  return algorithmCatalog.some((a) => a.id === id)
}
