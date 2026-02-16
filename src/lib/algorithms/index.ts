import type { Algorithm, Category } from '../types'

import {
  bigONotation,
  recursion,
  stacksAndQueues,
} from './concepts'

import {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
  countingSort,
  radixSort,
  shellSort,
} from './sorting'

import {
  binarySearch,
  linearSearch,
  jumpSearch,
  interpolationSearch,
} from './searching'

import {
  bfs,
  dfs,
  dijkstra,
  prim,
  topologicalSort,
} from './graphs'

import {
  fibonacciDp,
  knapsack,
  lcs,
} from './dynamic-programming'

import {
  nQueens,
  sudokuSolver,
  mazePathfinding,
} from './backtracking'

import { towerOfHanoi } from './divide-and-conquer'

export const algorithms: Algorithm[] = [
  // Concepts
  bigONotation,
  recursion,
  stacksAndQueues,
  // Sorting
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
  mergeSort,
  heapSort,
  countingSort,
  radixSort,
  shellSort,
  // Searching
  binarySearch,
  linearSearch,
  jumpSearch,
  interpolationSearch,
  // Graphs
  bfs,
  dfs,
  dijkstra,
  prim,
  topologicalSort,
  // Dynamic Programming
  fibonacciDp,
  knapsack,
  lcs,
  // Backtracking
  nQueens,
  sudokuSolver,
  mazePathfinding,
  // Divide and Conquer
  towerOfHanoi,
]

export const categories: Category[] = [
  { name: 'Concepts', algorithms: algorithms.filter((a) => a.category === 'Concepts') },
  { name: 'Sorting', algorithms: algorithms.filter((a) => a.category === 'Sorting') },
  { name: 'Searching', algorithms: algorithms.filter((a) => a.category === 'Searching') },
  { name: 'Graphs', algorithms: algorithms.filter((a) => a.category === 'Graphs') },
  {
    name: 'Dynamic Programming',
    algorithms: algorithms.filter((a) => a.category === 'Dynamic Programming'),
  },
  { name: 'Backtracking', algorithms: algorithms.filter((a) => a.category === 'Backtracking') },
  {
    name: 'Divide and Conquer',
    algorithms: algorithms.filter((a) => a.category === 'Divide and Conquer'),
  },
]
