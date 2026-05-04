import type { Algorithm, Category } from '@lib/types'

import {
  bigONotation,
  recursion,
  twoPointers,
  slidingWindow,
  spaceComplexity,
  memoization,
  greedyVsDp,
} from '@lib/algorithms/concepts'

import {
  stack,
  queue,
  linkedList,
  hashTable,
  binarySearchTree,
  heap,
} from '@lib/algorithms/data-structures'

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
  bucketSort,
} from '@lib/algorithms/sorting'

import {
  binarySearch,
  linearSearch,
  jumpSearch,
  interpolationSearch,
} from '@lib/algorithms/searching'

import {
  bfs,
  dfs,
  dijkstra,
  prim,
  topologicalSort,
} from '@lib/algorithms/graphs'

import {
  fibonacciDp,
  knapsack,
  lcs,
} from '@lib/algorithms/dynamic-programming'

import {
  nQueens,
  sudokuSolver,
  mazePathfinding,
} from '@lib/algorithms/backtracking'

import { towerOfHanoi } from '@lib/algorithms/divide-and-conquer'

import { sieveOfEratosthenes } from '@lib/algorithms/math'

export const algorithms: Algorithm[] = [
  // Concepts
  bigONotation,
  recursion,
  twoPointers,
  slidingWindow,
  spaceComplexity,
  memoization,
  greedyVsDp,
  // Data Structures
  stack,
  queue,
  linkedList,
  hashTable,
  binarySearchTree,
  heap,
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
  bucketSort,
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
  // Math
  sieveOfEratosthenes,
]

export const categories: Category[] = [
  { name: 'Concepts', algorithms: algorithms.filter((a) => a.category === 'Concepts') },
  { name: 'Data Structures', algorithms: algorithms.filter((a) => a.category === 'Data Structures') },
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
  { name: 'Math', algorithms: algorithms.filter((a) => a.category === 'Math') },
]
