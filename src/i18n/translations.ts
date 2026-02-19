export type Locale = 'en' | 'es'

export const defaultLocale: Locale = 'en'
export const locales: Locale[] = ['en', 'es']

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

export interface Translations {
  // Meta
  siteTitle: string
  siteDescription: string

  // Welcome screen
  welcomeTitle: string
  welcomeDescription: string
  playPauseShortcut: string
  stepShortcut: string

  // Sidebar
  searchPlaceholder: string
  algorithmsCount: string // "{count} algorithms"
  algorithmCountLabel: string // "{count} algorithms" for screen readers
  expandSidebar: string
  collapseSidebar: string

  // Code panel
  tabCode: string
  tabAbout: string
  selectAlgorithmCode: string
  expandCodePanel: string
  collapseCodePanel: string
  codeLanguageLabel: string
  codeLanguageWarning: string
  variables: string

  // Controls
  speed: string
  skipToStart: string
  stepBackward: string
  playPause: string
  stepForward: string
  skipToEnd: string
  step: string // "Step {n}:"
  controlsLabel: string
  progressStep: string // "Step {current} of {total}"
  speedLevel: string // "Speed level {n} of 5"

  // Drag handles
  resizeSidebar: string
  resizeCodePanel: string

  // Graph visualizer
  queue: string
  stack: string
  empty: string
  distances: string

  // Categories
  categories: Record<string, string>

  // Algorithm descriptions
  algorithmDescriptions: Record<string, string>
}

export const translations: Record<Locale, Translations> = {
  en: {
    siteTitle: 'alg0.dev - Algorithm Visualizer',
    siteDescription:
      'A modern, interactive algorithm visualizer. Learn algorithms through beautiful step-by-step visualizations.',

    welcomeTitle: 'Welcome to alg0.dev',
    welcomeDescription:
      'Select an algorithm from the sidebar to start visualizing.\nWatch algorithms come to life with step-by-step animations.',
    playPauseShortcut: 'Play / Pause',
    stepShortcut: 'Step',

    searchPlaceholder: 'Search algorithms...',
    algorithmsCount: '{count} algorithms',
    algorithmCountLabel: '{count} algorithms',
    expandSidebar: 'Expand sidebar',
    collapseSidebar: 'Collapse sidebar',

    tabCode: 'Code',
    tabAbout: 'Explanation',
    selectAlgorithmCode: 'Select an algorithm to view its code',
    expandCodePanel: 'Expand code panel',
    collapseCodePanel: 'Collapse code panel',
    codeLanguageLabel: 'Language',
    codeLanguageWarning: 'Step-by-step highlighting is only synced with JavaScript right now.',
    variables: 'Variables',

    speed: 'Speed',
    skipToStart: 'Skip to start',
    stepBackward: 'Step backward (←)',
    playPause: 'Play/Pause (Space)',
    stepForward: 'Step forward (→)',
    skipToEnd: 'Skip to end',
    step: 'Step {n}:',
    controlsLabel: 'Playback controls',
    progressStep: 'Step {current} of {total}',
    speedLevel: 'Speed level {n} of 5',

    resizeSidebar: 'Resize sidebar',
    resizeCodePanel: 'Resize code panel',

    queue: 'Queue',
    stack: 'Stack',
    empty: 'empty',
    distances: 'Distances',

    categories: {
      Concepts: 'Concepts',
      'Data Structures': 'Data Structures',
      Sorting: 'Sorting',
      Searching: 'Searching',
      Graphs: 'Graphs',
      'Dynamic Programming': 'Dynamic Programming',
      Backtracking: 'Backtracking',
      'Divide and Conquer': 'Divide and Conquer',
    },

    algorithmDescriptions: {
      'big-o-notation': `Big O Notation

Big O Notation describes how an algorithm's running time or space requirements grow relative to the input size. It focuses on the worst-case scenario and ignores constants and lower-order terms.

Common complexities (fastest to slowest):
  O(1)       — Constant: same time regardless of input size
  O(log n)   — Logarithmic: halves the problem each step (binary search)
  O(n)       — Linear: processes each element once
  O(n log n) — Linearithmic: efficient sorting (Merge Sort, Quick Sort)
  O(n²)      — Quadratic: nested loops (Bubble Sort, brute force)
  O(2^n)     — Exponential: doubles with each new element
  O(n!)      — Factorial: all permutations

Why it matters:
  For n = 1,000: O(n) = 1,000 operations, O(n²) = 1,000,000 operations
  Choosing the right algorithm can mean seconds vs. hours of computation.

Rules of Big O:
  1. Drop constants: O(2n) → O(n)
  2. Drop lower-order terms: O(n² + n) → O(n²)
  3. Focus on the dominant term as n grows large`,

      'recursion': `Recursion

Recursion is a programming technique where a function calls itself to solve smaller instances of the same problem. It's one of the most powerful concepts in computer science.

Every recursive function needs two parts:
  1. Base case — the condition that stops the recursion
  2. Recursive case — the function calls itself with a smaller input

How the call stack works:
  - Each function call is pushed onto the call stack
  - When a base case is reached, results propagate back up
  - The stack unwinds as each call returns its result

Common patterns:
  - Factorial: n! = n × (n-1)!
  - Fibonacci: F(n) = F(n-1) + F(n-2)
  - Tree traversals: process node, then recurse on children
  - Divide and conquer: split problem, solve halves, combine

Pitfalls:
  - Stack overflow: too many recursive calls exhaust memory
  - Redundant computation: naive recursion can be exponential
  - Solution: use memoization or convert to iteration

Recursive algorithms in this visualizer:
  Quick Sort, Merge Sort, DFS, N-Queens, Sudoku Solver, Tower of Hanoi`,

      'stack': `Stack

A Stack is a linear data structure that follows the LIFO principle — Last In, First Out. Like a stack of plates: you add and remove from the top only.

Operations:
  push(item) — add to top       O(1)
  pop()      — remove from top   O(1)
  peek()     — view top          O(1)
  isEmpty()  — check if empty    O(1)

Applications:
  - Undo/redo functionality
  - Browser history (back/forward)
  - Function call stack
  - Depth-First Search (DFS)
  - Expression evaluation and parsing
  - Balanced parentheses checking

Space Complexity: O(n) for n elements`,

      'queue': `Queue

A Queue is a linear data structure that follows the FIFO principle — First In, First Out. Like a line at a store: the first person in line is served first.

Operations:
  enqueue(item) — add to back       O(1)
  dequeue()     — remove from front  O(1)
  front()       — view front         O(1)
  isEmpty()     — check if empty     O(1)

Applications:
  - Task scheduling (CPU, printer)
  - Breadth-First Search (BFS)
  - Message buffers and event queues
  - Rate limiting
  - Order processing systems

Space Complexity: O(n) for n elements`,

      'two-pointers': `Two Pointers

Two Pointers is a technique where two indices move through a data structure (usually an array) to solve problems efficiently.

Common patterns:
  - Left & Right: start from both ends, move inward
  - Slow & Fast: both start from beginning at different speeds

Time Complexity: O(n) — each pointer moves at most n times
Space Complexity: O(1) — only two variables

Classic problems:
  - Two Sum (sorted array)
  - Container with most water
  - Remove duplicates in-place
  - Palindrome checking
  - Linked list cycle detection (slow/fast)`,

      'sliding-window': `Sliding Window

Sliding Window maintains a dynamic range (window) over a sequence, expanding and contracting to solve substring/subarray problems efficiently.

How it works:
1. Expand the window by moving the right pointer
2. If a condition is violated, shrink from the left
3. Track the best result seen so far

Time Complexity: O(n) — each character is visited at most twice
Space Complexity: O(min(n, alphabet))

Classic problems:
  - Longest substring without repeating chars
  - Minimum window substring
  - Maximum sum subarray of size k
  - Longest repeating character replacement`,

      'space-complexity': `Space Complexity

Space Complexity measures the amount of memory an algorithm uses relative to the input size. Like time complexity, we use Big O notation.

Common space complexities:
  O(1)     — Constant: fixed number of variables
  O(log n) — Logarithmic: recursive call stack depth
  O(n)     — Linear: one copy of the input
  O(n²)    — Quadratic: 2D matrix of input size

Important distinction:
  - Auxiliary space: extra memory beyond the input
  - Total space: input + auxiliary

Examples:
  O(1): in-place sorting (Bubble Sort), variable swaps
  O(log n): recursive binary search (call stack)
  O(n): Merge Sort (temporary arrays), hash tables
  O(n²): DP tables, adjacency matrices`,

      'memoization': `Memoization

Memoization is an optimization technique that stores the results of expensive function calls and returns the cached result when the same inputs occur again.

Without memoization (Fibonacci):
  fib(5) calls fib(4) + fib(3)
  fib(4) calls fib(3) + fib(2) — fib(3) computed AGAIN!
  Exponential: O(2^n) time

With memoization:
  Each value is computed ONCE and cached
  Subsequent calls with the same input return instantly
  Linear: O(n) time, O(n) space

Key insight: trade space for time
  - Store results in a dictionary/array
  - Before computing, check if result exists
  - Dramatic speedup for overlapping subproblems`,

      'greedy-vs-dp': `Greedy vs Dynamic Programming

Both Greedy and DP solve optimization problems, but they differ fundamentally:

Greedy:
  - Makes the locally optimal choice at each step
  - Fast: usually O(n log n) or O(n)
  - Does NOT always find the global optimum
  - Works when the "greedy choice property" holds

Dynamic Programming:
  - Considers ALL possible choices
  - Finds the globally optimal solution — always
  - Slower: usually O(n × m) time and space
  - Works for problems with overlapping subproblems

Example — Coin Change with coins [1, 4, 6], amount 8:
  Greedy picks 6+1+1 = 3 coins (suboptimal!)
  DP finds 4+4 = 2 coins (optimal!)`,

      'linked-list': `Linked List

A Linked List is a linear data structure where each element (node) contains a value and a pointer to the next node.

Unlike arrays, elements are not in contiguous memory — each node can be anywhere, connected by pointers.

Operations:
  append:  add node at the end       — O(1) with tail pointer
  prepend: add node at the beginning — O(1)
  search:  traverse to find a value  — O(n)
  delete:  remove a node by value    — O(n)
  access:  traverse from head        — O(n)

Advantages:
  - O(1) insertion/deletion at known positions
  - Dynamic size, no wasted memory

Disadvantages:
  - O(n) access by index (no random access)
  - Extra memory for pointers
  - Not cache-friendly`,

      'hash-table': `Hash Table

A Hash Table maps keys to values using a hash function. It provides near-constant time O(1) for insert, lookup, and delete operations.

How it works:
1. A hash function converts the key into an array index
2. The value is stored at that index (bucket)
3. If two keys hash to the same index → collision

Collision handling (chaining):
  Each bucket stores a list of entries.
  Multiple keys can share the same bucket.

Time Complexity:
  Average: O(1) for set, get, delete
  Worst:   O(n) when all keys collide

Space Complexity: O(n)

Applications: caches, databases, symbol tables, counting frequencies, deduplication`,

      'binary-search-tree': `Binary Search Tree (BST)

A BST is a tree where each node has at most two children, and for every node:
  - Left subtree contains only values less than the node
  - Right subtree contains only values greater than the node

This ordering enables efficient search by halving the search space at each step.

Operations:
  insert: compare and go left/right — O(h)
  search: compare and go left/right — O(h)
  delete: find and restructure      — O(h)

Where h = height of the tree:
  Balanced tree: h = O(log n) — efficient!
  Degenerate:    h = O(n) — like a linked list

Applications: ordered data storage, range queries, priority queues (with balancing)`,

      'heap': `Heap (Min Heap)

A Heap is a complete binary tree where every parent is smaller (min-heap) or larger (max-heap) than its children. It's stored as an array.

Array-to-tree mapping (0-indexed):
  Parent of i:      Math.floor((i - 1) / 2)
  Left child of i:  2 * i + 1
  Right child of i: 2 * i + 2

Operations:
  insert:     add at end, bubble up   — O(log n)
  extractMin: remove root, bubble down — O(log n)
  peek:       return root             — O(1)

Applications:
  - Priority queues
  - Heap Sort
  - Dijkstra's algorithm
  - Finding k-th smallest/largest`,

      'bubble-sort': `Bubble Sort

Bubble Sort is a simple comparison-based sorting algorithm. It repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

The algorithm gets its name because smaller elements "bubble" to the top of the list with each pass.

How it works:
1. Compare each pair of adjacent elements
2. Swap them if the left element is greater
3. After each pass, the largest unsorted element settles in its final position
4. Repeat until no swaps are needed

Time Complexity:
  Best:    O(n) — already sorted
  Average: O(n²)
  Worst:   O(n²)

Space Complexity: O(1) — in-place

Properties:
  - Stable sort
  - Adaptive
  - In-place

Mainly used for educational purposes. For production, prefer Quick Sort or Merge Sort.`,

      'selection-sort': `Selection Sort

Selection Sort divides the array into a sorted and unsorted region. It repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region.

How it works:
1. Find the minimum element in the unsorted portion
2. Swap it with the first unsorted element
3. Move the boundary between sorted and unsorted one element to the right
4. Repeat until the entire array is sorted

Time Complexity:
  Best:    O(n²)
  Average: O(n²)
  Worst:   O(n²)

Space Complexity: O(1) — in-place

Properties:
  - Not stable (can change relative order of equal elements)
  - Not adaptive
  - In-place
  - Minimizes the number of swaps: O(n)

Useful when memory writes are expensive, as it performs at most O(n) swaps.`,

      'insertion-sort': `Insertion Sort

Insertion Sort builds the sorted array one element at a time. It picks each element and inserts it into its correct position in the already-sorted portion of the array.

How it works:
1. Start from the second element (first element is trivially sorted)
2. Pick the current element as the "key"
3. Compare the key with elements in the sorted portion
4. Shift larger elements to the right
5. Insert the key into its correct position

Time Complexity:
  Best:    O(n) — already sorted
  Average: O(n²)
  Worst:   O(n²) — reverse sorted

Space Complexity: O(1) — in-place

Properties:
  - Stable sort
  - Adaptive (efficient for nearly sorted data)
  - In-place
  - Online (can sort as data is received)

Excellent for small datasets or nearly sorted data. Often used as the base case in hybrid sorting algorithms like Timsort.`,

      'quick-sort': `Quick Sort

Quick Sort is a highly efficient, divide-and-conquer sorting algorithm. It works by selecting a "pivot" element and partitioning the array around it.

How it works:
1. Choose a pivot element (here, the last element)
2. Partition: rearrange so elements smaller than pivot are on the left, larger on the right
3. The pivot is now in its final sorted position
4. Recursively apply to the left and right sub-arrays

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n²) — when pivot is always the smallest/largest

Space Complexity: O(log n) average, O(n) worst — recursive call stack

Properties:
  - Not stable
  - In-place (with Lomuto partition)
  - Cache-friendly

Quick Sort is one of the fastest general-purpose sorting algorithms in practice. Used in many standard library implementations.`,

      'merge-sort': `Merge Sort

Merge Sort is a stable, divide-and-conquer sorting algorithm. It divides the array into halves, recursively sorts each half, then merges the sorted halves.

How it works:
1. Divide the array into two halves
2. Recursively sort each half
3. Merge the two sorted halves into a single sorted array
4. The merge step compares elements from both halves and places them in order

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(n) — requires temporary array

Properties:
  - Stable sort
  - Not in-place (requires O(n) extra space)
  - Predictable performance (always O(n log n))
  - Parallelizable

Merge Sort guarantees O(n log n) performance regardless of input. Ideal when stability is required or for sorting linked lists.`,

      'binary-search': `Binary Search

Binary Search is an efficient algorithm for finding a target value in a sorted array. It works by repeatedly dividing the search interval in half.

Prerequisite: The array must be sorted.

How it works:
1. Compare the target with the middle element
2. If equal, we found the target
3. If target is smaller, search the left half
4. If target is larger, search the right half
5. Repeat until found or search space is empty

Time Complexity:
  Best:    O(1) — target is at the middle
  Average: O(log n)
  Worst:   O(log n)

Space Complexity: O(1) — iterative version

Binary Search is fundamental in computer science and is used extensively in databases, file systems, and as a building block for more complex algorithms.`,

      'linear-search': `Linear Search

Linear Search (or Sequential Search) is the simplest searching algorithm. It checks every element in the list sequentially until the target is found or the list is exhausted.

How it works:
1. Start from the first element
2. Compare each element with the target
3. If a match is found, return the index
4. If the end is reached without a match, return -1

Time Complexity:
  Best:    O(1) — target is the first element
  Average: O(n)
  Worst:   O(n) — target is last or not present

Space Complexity: O(1)

Properties:
  - Works on unsorted arrays
  - No preprocessing needed
  - Simple to implement

Linear Search is useful for small datasets or unsorted data where more efficient algorithms cannot be applied.`,

      bfs: `Breadth-First Search (BFS)

BFS is a graph traversal algorithm that explores all vertices at the present depth before moving to vertices at the next depth level. It uses a queue data structure.

How it works:
1. Start from a source node, mark it as visited, add to queue
2. Dequeue a node, process it
3. Enqueue all unvisited neighbors
4. Repeat until the queue is empty

Time Complexity: O(V + E)
  V = number of vertices, E = number of edges

Space Complexity: O(V) — for the queue and visited set

Applications:
  - Shortest path in unweighted graphs
  - Level-order traversal of trees
  - Finding connected components
  - Web crawling
  - Social network analysis (degrees of separation)

BFS guarantees finding the shortest path (fewest edges) between two nodes in an unweighted graph.`,

      dfs: `Depth-First Search (DFS)

DFS is a graph traversal algorithm that explores as far as possible along each branch before backtracking. It uses a stack (or recursion).

How it works:
1. Start from a source node, mark it as visited
2. Recursively visit each unvisited neighbor
3. Backtrack when no unvisited neighbors remain
4. Continue until all reachable nodes are visited

Time Complexity: O(V + E)
  V = number of vertices, E = number of edges

Space Complexity: O(V) — for the recursion stack and visited set

Applications:
  - Detecting cycles in graphs
  - Topological sorting
  - Finding connected components
  - Solving mazes and puzzles
  - Path finding

DFS explores deep paths first, which makes it useful for topological sorting and cycle detection, but it doesn't guarantee shortest paths.`,

      'n-queens': `N-Queens Problem

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

      'heap-sort': `Heap Sort

Heap Sort uses a binary heap data structure to sort elements. It first builds a max-heap from the array, then repeatedly extracts the maximum element.

How it works:
1. Build a max-heap from the input array
2. The largest element is now at the root (index 0)
3. Swap it with the last element, reduce heap size
4. Heapify the root to restore the max-heap property
5. Repeat until the heap is empty

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(1) — in-place

Properties:
  - Not stable
  - In-place
  - Guaranteed O(n log n) performance

Heap Sort combines the best of Merge Sort (guaranteed O(n log n)) and Quick Sort (in-place). Useful when worst-case performance matters.`,

      'counting-sort': `Counting Sort

Counting Sort is a non-comparison-based sorting algorithm. It counts the occurrences of each value and uses arithmetic to determine positions.

How it works:
1. Find the range of input values (min to max)
2. Create a count array to store frequency of each value
3. Modify count array to store cumulative counts
4. Build the output array by placing elements at their correct positions

Time Complexity:
  Best:    O(n + k)
  Average: O(n + k)
  Worst:   O(n + k)
  where k is the range of input values

Space Complexity: O(n + k)

Properties:
  - Stable sort
  - Not in-place
  - Not comparison-based
  - Very efficient when k is small relative to n

Counting Sort is ideal for sorting integers within a known, small range. It's used as a subroutine in Radix Sort.`,

      'radix-sort': `Radix Sort

Radix Sort sorts numbers digit by digit, from the least significant digit to the most significant (LSD Radix Sort). It uses a stable sort (like Counting Sort) as a subroutine.

How it works:
1. Find the maximum number to determine the number of digits
2. For each digit position (ones, tens, hundreds, ...):
   a. Sort the array based on the current digit using a stable sort
3. After processing all digits, the array is sorted

Time Complexity:
  Best:    O(d × (n + k))
  Average: O(d × (n + k))
  Worst:   O(d × (n + k))
  where d = number of digits, k = base (10 for decimal)

Space Complexity: O(n + k)

Properties:
  - Stable sort
  - Not in-place
  - Not comparison-based
  - Efficient for integers and strings

Radix Sort can outperform comparison-based sorts when the number of digits is small relative to log(n).`,

      'shell-sort': `Shell Sort

Shell Sort is a generalization of Insertion Sort that allows the exchange of items that are far apart. It uses a decreasing gap sequence to progressively sort the array.

How it works:
1. Start with a large gap (typically n/2)
2. Perform a gapped insertion sort for the current gap
3. Reduce the gap (typically by half)
4. Repeat until gap is 1 (final pass is a standard insertion sort)

Time Complexity:
  Best:    O(n log n)
  Average: O(n^(3/2)) — depends on gap sequence
  Worst:   O(n²) — with n/2 gap sequence

Space Complexity: O(1) — in-place

Properties:
  - Not stable
  - In-place
  - Adaptive

Shell Sort is faster than Insertion Sort for larger arrays because it moves elements closer to their final position earlier. Performance depends heavily on the gap sequence chosen.`,

      'jump-search': `Jump Search

Jump Search works on sorted arrays by jumping ahead by fixed steps and then performing a linear search within the identified block.

How it works:
1. Calculate the optimal jump size: √n
2. Jump through the array in blocks until finding a block where the target could be
3. Perform a linear search within that block
4. Return the index if found, -1 otherwise

Time Complexity:
  Best:    O(1)
  Average: O(√n)
  Worst:   O(√n)

Space Complexity: O(1)

Properties:
  - Requires sorted array
  - Better than Linear Search, simpler than Binary Search
  - Optimal jump size is √n

Jump Search is useful when jumping back is costly (e.g., in linked lists) compared to Binary Search which requires random access.`,

      'interpolation-search': `Interpolation Search

Interpolation Search is an improved variant of Binary Search for uniformly distributed sorted data. Instead of always going to the middle, it estimates the position of the target based on its value.

How it works:
1. Estimate position: pos = low + ((target - arr[low]) × (high - low)) / (arr[high] - arr[low])
2. If arr[pos] equals target, return pos
3. If arr[pos] < target, search right portion
4. If arr[pos] > target, search left portion

Time Complexity:
  Best:    O(1)
  Average: O(log log n) — for uniform distribution
  Worst:   O(n) — for non-uniform distribution

Space Complexity: O(1)

Properties:
  - Requires sorted array
  - Best for uniformly distributed data
  - Can degrade to O(n) for skewed distributions

Interpolation Search can be significantly faster than Binary Search when data is uniformly distributed, as it makes better guesses about where the target might be.`,

      dijkstra: `Dijkstra's Algorithm

Dijkstra's Algorithm finds the shortest path from a source node to all other nodes in a weighted graph with non-negative edge weights.

How it works:
1. Initialize distances: source = 0, all others = ∞
2. Mark all nodes as unvisited
3. Pick the unvisited node with the smallest distance
4. For each unvisited neighbor, calculate the tentative distance
5. If the new distance is smaller, update it
6. Mark the current node as visited
7. Repeat until all nodes are visited

Time Complexity:
  O(V²) with simple array
  O((V + E) log V) with min-heap

Space Complexity: O(V)

Applications:
  - GPS navigation and route planning
  - Network routing protocols (OSPF)
  - Finding shortest paths in maps
  - Social network analysis

Dijkstra's Algorithm is one of the most important graph algorithms. It guarantees optimal solutions for graphs with non-negative weights.`,

      prim: `Prim's Algorithm

Prim's Algorithm finds a Minimum Spanning Tree (MST) for a weighted, connected, undirected graph. The MST connects all vertices with the minimum total edge weight.

How it works:
1. Start with any node as the initial tree
2. Find the minimum weight edge connecting the tree to a non-tree vertex
3. Add that edge and vertex to the tree
4. Repeat until all vertices are in the tree

Time Complexity:
  O(V²) with adjacency matrix
  O(E log V) with binary heap

Space Complexity: O(V)

Applications:
  - Network design (minimum cost wiring)
  - Approximation algorithms for NP-hard problems
  - Cluster analysis
  - Image segmentation

Prim's Algorithm is a greedy algorithm that always picks the cheapest edge to expand the tree. Compare with Kruskal's Algorithm, which sorts all edges globally.`,

      'topological-sort': `Topological Sort (Kahn's Algorithm)

Topological Sort produces a linear ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u → v, vertex u comes before v in the ordering.

How it works (Kahn's Algorithm - BFS-based):
1. Compute the in-degree of each vertex
2. Add all vertices with in-degree 0 to a queue
3. While the queue is not empty:
   a. Dequeue a vertex, add it to the result
   b. For each outgoing edge, decrement the neighbor's in-degree
   c. If a neighbor's in-degree becomes 0, enqueue it
4. If all vertices are processed, the result is a valid topological order

Time Complexity: O(V + E)
Space Complexity: O(V)

Applications:
  - Task scheduling with dependencies
  - Build systems (Make, Gradle)
  - Course prerequisite planning
  - Package dependency resolution

Topological Sort is only possible for DAGs (Directed Acyclic Graphs). If the graph has a cycle, no valid ordering exists.`,

      'fibonacci-dp': `Fibonacci (Dynamic Programming)

The Fibonacci sequence is a classic example of dynamic programming. Each number is the sum of the two preceding ones: F(n) = F(n-1) + F(n-2).

How it works (Bottom-Up Tabulation):
1. Create a table to store computed values
2. Set base cases: F(0) = 0, F(1) = 1
3. Fill the table iteratively: F(i) = F(i-1) + F(i-2)
4. Return F(n)

Time Complexity: O(n)
Space Complexity: O(n) — can be optimized to O(1)

Comparison:
  - Naive recursion: O(2^n) — exponential
  - Memoization (top-down): O(n)
  - Tabulation (bottom-up): O(n)

Dynamic Programming avoids redundant computation by storing previously computed results. Fibonacci is the simplest illustration of this technique.`,

      knapsack: `0/1 Knapsack Problem

The 0/1 Knapsack Problem: given items with weights and values, and a maximum capacity, find the maximum value that can be carried without exceeding the capacity. Each item can be taken at most once.

How it works (Bottom-Up DP):
1. Create a 2D table: dp[i][w] = max value using first i items with capacity w
2. For each item i and capacity w:
   - If item doesn't fit: dp[i][w] = dp[i-1][w]
   - If item fits: dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
3. dp[n][W] contains the optimal value

Time Complexity: O(n × W) — pseudo-polynomial
Space Complexity: O(n × W) — can be optimized to O(W)

Applications:
  - Resource allocation
  - Budget planning
  - Cargo loading
  - Cryptography

The Knapsack Problem is one of the fundamental problems in combinatorial optimization and is NP-hard in general.`,

      lcs: `Longest Common Subsequence (LCS)

LCS finds the longest subsequence common to two sequences. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.

How it works (Bottom-Up DP):
1. Create a 2D table: dp[i][j] = length of LCS of first i chars of X and first j chars of Y
2. If characters match: dp[i][j] = dp[i-1][j-1] + 1
3. If they don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. dp[m][n] contains the LCS length

Time Complexity: O(m × n)
Space Complexity: O(m × n) — can be optimized to O(min(m, n))

Applications:
  - Diff tools (file comparison)
  - DNA sequence alignment
  - Version control systems
  - Spell checking

LCS is a fundamental problem in bioinformatics and text processing. It generalizes to the edit distance problem.`,

      'sudoku-solver': `Sudoku Solver

This solver uses backtracking to fill a Sudoku grid so that each row, column, and box contains all digits exactly once. This visualization uses a 4×4 variant with digits 1-4.

How it works (Backtracking):
1. Find an empty cell
2. Try each valid number (1 to N)
3. Check if the number is safe (not in same row, column, or box)
4. If safe, place it and recursively try to fill the next empty cell
5. If no valid number works, backtrack (remove the number and try the next)

Time Complexity: O(N^(N×N)) — worst case
Space Complexity: O(N×N) — for the board

Properties:
  - Always finds a solution if one exists
  - Backtracking prunes invalid branches early
  - Can be optimized with constraint propagation

Sudoku is a classic constraint satisfaction problem solved efficiently with backtracking.`,

      'maze-pathfinding': `Maze Pathfinding (BFS)

This algorithm uses Breadth-First Search to find the shortest path through a maze from start to finish, navigating around walls.

How it works:
1. Start BFS from the starting cell
2. Explore all 4 neighbors (up, down, left, right)
3. Skip walls and already-visited cells
4. Mark each explored cell and record its parent
5. When the end is reached, trace back through parents to find the path

Time Complexity: O(rows × cols)
Space Complexity: O(rows × cols)

Properties:
  - Guarantees the shortest path
  - Explores level by level (nearest cells first)
  - Works on unweighted grids

BFS-based pathfinding is fundamental in game development, robotics, and navigation systems. For weighted grids, Dijkstra's or A* would be used instead.`,

      'tower-of-hanoi': `Tower of Hanoi

The Tower of Hanoi is a classic recursive puzzle. Move all disks from the source peg to the target peg, one at a time, never placing a larger disk on top of a smaller one.

How it works (Recursive):
1. Move the top n-1 disks from source to auxiliary peg
2. Move the largest disk from source to target peg
3. Move the n-1 disks from auxiliary to target peg

Time Complexity: O(2^n - 1) — exactly 2^n - 1 moves
Space Complexity: O(n) — recursive call stack

Properties:
  - Minimum moves required: 2^n - 1
  - Classic example of divide and conquer
  - Demonstrates the power of recursion

The puzzle was invented by mathematician Édouard Lucas in 1883. Legend says monks in a temple are moving 64 golden disks — completing the puzzle would mark the end of the world (requiring 18,446,744,073,709,551,615 moves).`,
    },
  },

  es: {
    siteTitle: 'alg0.dev - Visualizador de Algoritmos',
    siteDescription:
      'Un visualizador de algoritmos moderno e interactivo. Aprende algoritmos con hermosas visualizaciones paso a paso.',

    welcomeTitle: 'Bienvenido a alg0.dev',
    welcomeDescription:
      'Selecciona un algoritmo de la barra lateral para comenzar a visualizar.\nObserva cómo los algoritmos cobran vida con animaciones paso a paso.',
    playPauseShortcut: 'Reproducir / Pausar',
    stepShortcut: 'Paso',

    searchPlaceholder: 'Buscar algoritmos...',
    algorithmsCount: '{count} algoritmos',
    algorithmCountLabel: '{count} algoritmos',
    expandSidebar: 'Expandir barra lateral',
    collapseSidebar: 'Contraer barra lateral',

    tabCode: 'Código',
    tabAbout: 'Explicación',
    selectAlgorithmCode: 'Selecciona un algoritmo para ver su código',
    expandCodePanel: 'Expandir panel de código',
    collapseCodePanel: 'Contraer panel de código',
    codeLanguageLabel: 'Lenguaje',
    codeLanguageWarning: 'El paso a paso solo se sincroniza con JavaScript por ahora.',
    variables: 'Variables',

    speed: 'Velocidad',
    skipToStart: 'Ir al inicio',
    stepBackward: 'Paso anterior (←)',
    playPause: 'Reproducir/Pausar (Espacio)',
    stepForward: 'Paso siguiente (→)',
    skipToEnd: 'Ir al final',
    step: 'Paso {n}:',
    controlsLabel: 'Controles de reproducción',
    progressStep: 'Paso {current} de {total}',
    speedLevel: 'Nivel de velocidad {n} de 5',

    resizeSidebar: 'Redimensionar barra lateral',
    resizeCodePanel: 'Redimensionar panel de código',

    queue: 'Cola',
    stack: 'Pila',
    empty: 'vacía',
    distances: 'Distancias',

    categories: {
      Concepts: 'Conceptos',
      'Data Structures': 'Estructuras de Datos',
      Sorting: 'Ordenamiento',
      Searching: 'Búsqueda',
      Graphs: 'Grafos',
      'Dynamic Programming': 'Programación Dinámica',
      Backtracking: 'Backtracking',
      'Divide and Conquer': 'Divide y Vencerás',
    },

    algorithmDescriptions: {
      'big-o-notation': `Notación Big O

La Notación Big O describe cómo el tiempo de ejecución o los requisitos de espacio de un algoritmo crecen en relación al tamaño de la entrada. Se enfoca en el peor caso e ignora constantes y términos de menor orden.

Complejidades comunes (de más rápida a más lenta):
  O(1)       — Constante: mismo tiempo sin importar el tamaño de entrada
  O(log n)   — Logarítmica: divide el problema a la mitad en cada paso (búsqueda binaria)
  O(n)       — Lineal: procesa cada elemento una vez
  O(n log n) — Linearítmica: ordenamiento eficiente (Merge Sort, Quick Sort)
  O(n²)      — Cuadrática: bucles anidados (Bubble Sort, fuerza bruta)
  O(2^n)     — Exponencial: se duplica con cada nuevo elemento
  O(n!)      — Factorial: todas las permutaciones

Por qué importa:
  Para n = 1.000: O(n) = 1.000 operaciones, O(n²) = 1.000.000 operaciones
  Elegir el algoritmo correcto puede significar segundos vs. horas de cómputo.

Reglas de Big O:
  1. Eliminar constantes: O(2n) → O(n)
  2. Eliminar términos de menor orden: O(n² + n) → O(n²)
  3. Enfocarse en el término dominante cuando n crece`,

      'recursion': `Recursión

La recursión es una técnica de programación donde una función se llama a sí misma para resolver instancias más pequeñas del mismo problema. Es uno de los conceptos más poderosos en las ciencias de la computación.

Toda función recursiva necesita dos partes:
  1. Caso base — la condición que detiene la recursión
  2. Caso recursivo — la función se llama con una entrada más pequeña

Cómo funciona la pila de llamadas:
  - Cada llamada a función se apila en la pila de llamadas
  - Cuando se alcanza un caso base, los resultados se propagan hacia arriba
  - La pila se desenrolla a medida que cada llamada retorna su resultado

Patrones comunes:
  - Factorial: n! = n × (n-1)!
  - Fibonacci: F(n) = F(n-1) + F(n-2)
  - Recorridos de árboles: procesar nodo, luego recurrir en hijos
  - Divide y vencerás: dividir problema, resolver mitades, combinar

Errores comunes:
  - Desbordamiento de pila: demasiadas llamadas recursivas agotan la memoria
  - Cálculos redundantes: la recursión ingenua puede ser exponencial
  - Solución: usar memoización o convertir a iteración

Algoritmos recursivos en este visualizador:
  Quick Sort, Merge Sort, DFS, N-Queens, Sudoku Solver, Torre de Hanoi`,

      'stack': `Pila (Stack)

Una Pila es una estructura de datos lineal que sigue el principio LIFO — Último en Entrar, Primero en Salir. Como una pila de platos: solo puedes añadir y quitar del tope.

Operaciones:
  push(item) — añadir arriba        O(1)
  pop()      — retirar de arriba     O(1)
  peek()     — ver el de arriba      O(1)
  isEmpty()  — verificar si está vacía O(1)

Aplicaciones:
  - Deshacer/rehacer
  - Historial del navegador (atrás/adelante)
  - Pila de llamadas de funciones
  - Búsqueda en Profundidad (DFS)
  - Evaluación de expresiones y análisis sintáctico
  - Verificación de paréntesis balanceados

Complejidad Espacial: O(n) para n elementos`,

      'queue': `Cola (Queue)

Una Cola es una estructura de datos lineal que sigue el principio FIFO — Primero en Entrar, Primero en Salir. Como una fila en una tienda: el primero en llegar es atendido primero.

Operaciones:
  enqueue(item) — añadir al final     O(1)
  dequeue()     — retirar del frente   O(1)
  front()       — ver el frente        O(1)
  isEmpty()     — verificar si está vacía O(1)

Aplicaciones:
  - Planificación de tareas (CPU, impresora)
  - Búsqueda en Anchura (BFS)
  - Buffers de mensajes y colas de eventos
  - Limitación de velocidad (rate limiting)
  - Sistemas de procesamiento de pedidos

Complejidad Espacial: O(n) para n elementos`,

      'two-pointers': `Dos Punteros (Two Pointers)

Dos Punteros es una técnica donde dos índices se mueven a través de una estructura de datos (generalmente un arreglo) para resolver problemas eficientemente.

Patrones comunes:
  - Izquierda y derecha: comienzan desde ambos extremos, avanzan hacia el centro
  - Lento y rápido: ambos empiezan desde el inicio a diferentes velocidades

Complejidad Temporal: O(n) — cada puntero se mueve como máximo n veces
Complejidad Espacial: O(1) — solo dos variables

Problemas clásicos:
  - Two Sum (arreglo ordenado)
  - Contenedor con más agua
  - Eliminar duplicados in-place
  - Verificación de palíndromos
  - Detección de ciclos en listas enlazadas (lento/rápido)`,

      'sliding-window': `Ventana Deslizante (Sliding Window)

La Ventana Deslizante mantiene un rango dinámico (ventana) sobre una secuencia, expandiéndose y contrayéndose para resolver problemas de subcadenas/subarreglos eficientemente.

Cómo funciona:
1. Expandir la ventana moviendo el puntero derecho
2. Si se viola una condición, contraer desde la izquierda
3. Registrar el mejor resultado encontrado

Complejidad Temporal: O(n) — cada carácter se visita como máximo dos veces
Complejidad Espacial: O(min(n, alfabeto))

Problemas clásicos:
  - Subcadena más larga sin caracteres repetidos
  - Subcadena mínima que contiene todos los caracteres
  - Suma máxima de subarreglo de tamaño k
  - Reemplazo más largo de caracteres repetidos`,

      'space-complexity': `Complejidad Espacial

La Complejidad Espacial mide la cantidad de memoria que usa un algoritmo en relación al tamaño de la entrada. Al igual que la complejidad temporal, se usa la notación Big O.

Complejidades espaciales comunes:
  O(1)     — Constante: número fijo de variables
  O(log n) — Logarítmica: profundidad de la pila de llamadas recursivas
  O(n)     — Lineal: una copia de la entrada
  O(n²)    — Cuadrática: matriz 2D del tamaño de la entrada

Distinción importante:
  - Espacio auxiliar: memoria extra más allá de la entrada
  - Espacio total: entrada + auxiliar

Ejemplos:
  O(1): ordenamiento in-place (Bubble Sort), intercambio de variables
  O(log n): búsqueda binaria recursiva (pila de llamadas)
  O(n): Merge Sort (arreglos temporales), tablas hash
  O(n²): tablas de DP, matrices de adyacencia`,

      'memoization': `Memoización

La memoización es una técnica de optimización que almacena los resultados de llamadas a funciones costosas y devuelve el resultado cacheado cuando se repiten las mismas entradas.

Sin memoización (Fibonacci):
  fib(5) llama a fib(4) + fib(3)
  fib(4) llama a fib(3) + fib(2) — ¡fib(3) se calcula OTRA VEZ!
  Exponencial: O(2^n) tiempo

Con memoización:
  Cada valor se calcula UNA SOLA VEZ y se cachea
  Llamadas posteriores con la misma entrada retornan al instante
  Lineal: O(n) tiempo, O(n) espacio

Idea clave: intercambiar espacio por tiempo
  - Almacenar resultados en un diccionario/arreglo
  - Antes de calcular, verificar si el resultado ya existe
  - Aceleración drástica para subproblemas superpuestos`,

      'greedy-vs-dp': `Greedy vs Programación Dinámica

Tanto Greedy como DP resuelven problemas de optimización, pero difieren fundamentalmente:

Greedy (Voraz):
  - Elige la opción localmente óptima en cada paso
  - Rápido: generalmente O(n log n) u O(n)
  - NO siempre encuentra el óptimo global
  - Funciona cuando se cumple la "propiedad de elección voraz"

Programación Dinámica:
  - Considera TODAS las opciones posibles
  - Encuentra la solución globalmente óptima — siempre
  - Más lento: generalmente O(n × m) en tiempo y espacio
  - Funciona para problemas con subproblemas superpuestos

Ejemplo — Cambio de monedas con [1, 4, 6], cantidad 8:
  Greedy elige 6+1+1 = 3 monedas (¡subóptimo!)
  DP encuentra 4+4 = 2 monedas (¡óptimo!)`,

      'linked-list': `Lista Enlazada (Linked List)

Una Lista Enlazada es una estructura de datos lineal donde cada elemento (nodo) contiene un valor y un puntero al siguiente nodo.

A diferencia de los arreglos, los elementos no están en memoria contigua — cada nodo puede estar en cualquier parte, conectado por punteros.

Operaciones:
  append:  añadir al final          — O(1) con puntero tail
  prepend: añadir al inicio         — O(1)
  search:  recorrer para encontrar  — O(n)
  delete:  eliminar nodo por valor  — O(n)
  access:  recorrer desde la cabeza — O(n)

Ventajas:
  - Inserción/eliminación O(1) en posiciones conocidas
  - Tamaño dinámico, sin memoria desperdiciada

Desventajas:
  - Acceso O(n) por índice (sin acceso aleatorio)
  - Memoria extra para punteros
  - No es cache-friendly`,

      'hash-table': `Tabla Hash (Hash Table)

Una Tabla Hash mapea claves a valores usando una función hash. Proporciona tiempo casi constante O(1) para insertar, buscar y eliminar.

Cómo funciona:
1. Una función hash convierte la clave en un índice del arreglo
2. El valor se almacena en ese índice (bucket)
3. Si dos claves producen el mismo índice → colisión

Manejo de colisiones (encadenamiento):
  Cada bucket almacena una lista de entradas.
  Múltiples claves pueden compartir el mismo bucket.

Complejidad Temporal:
  Promedio: O(1) para set, get, delete
  Peor:     O(n) cuando todas las claves colisionan

Complejidad Espacial: O(n)

Aplicaciones: cachés, bases de datos, tablas de símbolos, conteo de frecuencias, deduplicación`,

      'binary-search-tree': `Árbol Binario de Búsqueda (BST)

Un BST es un árbol donde cada nodo tiene como máximo dos hijos, y para cada nodo:
  - El subárbol izquierdo contiene solo valores menores
  - El subárbol derecho contiene solo valores mayores

Este ordenamiento permite una búsqueda eficiente al dividir el espacio de búsqueda a la mitad en cada paso.

Operaciones:
  insert: comparar e ir a izquierda/derecha — O(h)
  search: comparar e ir a izquierda/derecha — O(h)
  delete: encontrar y reestructurar         — O(h)

Donde h = altura del árbol:
  Árbol balanceado: h = O(log n) — ¡eficiente!
  Degenerado:       h = O(n) — como una lista enlazada

Aplicaciones: almacenamiento de datos ordenados, consultas por rango, colas de prioridad (con balanceo)`,

      'heap': `Montículo (Heap)

Un Heap es un árbol binario completo donde cada padre es menor (min-heap) o mayor (max-heap) que sus hijos. Se almacena como un arreglo.

Mapeo arreglo-árbol (índice base 0):
  Padre de i:       Math.floor((i - 1) / 2)
  Hijo izquierdo:   2 * i + 1
  Hijo derecho:     2 * i + 2

Operaciones:
  insert:     añadir al final, subir (bubble up)    — O(log n)
  extractMin: eliminar raíz, bajar (bubble down)    — O(log n)
  peek:       retornar la raíz                      — O(1)

Aplicaciones:
  - Colas de prioridad
  - Heap Sort
  - Algoritmo de Dijkstra
  - Encontrar el k-ésimo menor/mayor`,

      'bubble-sort': `Bubble Sort (Ordenamiento Burbuja)

Bubble Sort es un algoritmo de ordenamiento simple basado en comparaciones. Recorre repetidamente la lista, compara elementos adyacentes y los intercambia si están en el orden incorrecto.

El algoritmo recibe su nombre porque los elementos más pequeños "burbujean" hacia la parte superior de la lista con cada pasada.

Cómo funciona:
1. Compara cada par de elementos adyacentes
2. Intercámbialos si el elemento izquierdo es mayor
3. Después de cada pasada, el elemento más grande no ordenado queda en su posición final
4. Repite hasta que no se necesiten más intercambios

Complejidad Temporal:
  Mejor:    O(n) — ya ordenado
  Promedio: O(n²)
  Peor:     O(n²)

Complejidad Espacial: O(1) — in-place

Propiedades:
  - Ordenamiento estable
  - Adaptativo
  - In-place

Se usa principalmente con fines educativos. En producción, es preferible Quick Sort o Merge Sort.`,

      'selection-sort': `Selection Sort (Ordenamiento por Selección)

Selection Sort divide el arreglo en una región ordenada y otra sin ordenar. Selecciona repetidamente el elemento más pequeño de la región sin ordenar y lo mueve al final de la región ordenada.

Cómo funciona:
1. Encuentra el elemento mínimo en la porción sin ordenar
2. Intercámbialo con el primer elemento sin ordenar
3. Mueve el límite entre ordenado y sin ordenar un elemento a la derecha
4. Repite hasta que todo el arreglo esté ordenado

Complejidad Temporal:
  Mejor:    O(n²)
  Promedio: O(n²)
  Peor:     O(n²)

Complejidad Espacial: O(1) — in-place

Propiedades:
  - No es estable (puede cambiar el orden relativo de elementos iguales)
  - No es adaptativo
  - In-place
  - Minimiza el número de intercambios: O(n)

Útil cuando las escrituras en memoria son costosas, ya que realiza como máximo O(n) intercambios.`,

      'insertion-sort': `Insertion Sort (Ordenamiento por Inserción)

Insertion Sort construye el arreglo ordenado un elemento a la vez. Toma cada elemento y lo inserta en su posición correcta dentro de la porción ya ordenada del arreglo.

Cómo funciona:
1. Comienza desde el segundo elemento (el primero se considera trivialmente ordenado)
2. Toma el elemento actual como "clave"
3. Compara la clave con los elementos de la porción ordenada
4. Desplaza los elementos mayores hacia la derecha
5. Inserta la clave en su posición correcta

Complejidad Temporal:
  Mejor:    O(n) — ya ordenado
  Promedio: O(n²)
  Peor:     O(n²) — ordenado inversamente

Complejidad Espacial: O(1) — in-place

Propiedades:
  - Ordenamiento estable
  - Adaptativo (eficiente para datos casi ordenados)
  - In-place
  - Online (puede ordenar datos a medida que se reciben)

Excelente para conjuntos pequeños o datos casi ordenados. Frecuentemente usado como caso base en algoritmos de ordenamiento híbridos como Timsort.`,

      'quick-sort': `Quick Sort (Ordenamiento Rápido)

Quick Sort es un algoritmo de ordenamiento altamente eficiente basado en divide y vencerás. Funciona seleccionando un elemento "pivote" y particionando el arreglo alrededor de él.

Cómo funciona:
1. Elige un elemento pivote (aquí, el último elemento)
2. Particiona: reorganiza para que los elementos menores al pivote queden a la izquierda y los mayores a la derecha
3. El pivote queda en su posición final ordenada
4. Aplica recursivamente a los sub-arreglos izquierdo y derecho

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n log n)
  Peor:     O(n²) — cuando el pivote siempre es el menor/mayor

Complejidad Espacial: O(log n) promedio, O(n) peor caso — pila de llamadas recursivas

Propiedades:
  - No es estable
  - In-place (con partición de Lomuto)
  - Amigable con la caché

Quick Sort es uno de los algoritmos de ordenamiento de propósito general más rápidos en la práctica. Usado en muchas implementaciones de bibliotecas estándar.`,

      'merge-sort': `Merge Sort (Ordenamiento por Mezcla)

Merge Sort es un algoritmo de ordenamiento estable basado en divide y vencerás. Divide el arreglo en mitades, ordena recursivamente cada mitad y luego mezcla las mitades ordenadas.

Cómo funciona:
1. Divide el arreglo en dos mitades
2. Ordena recursivamente cada mitad
3. Mezcla las dos mitades ordenadas en un solo arreglo ordenado
4. El paso de mezcla compara elementos de ambas mitades y los coloca en orden

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n log n)
  Peor:     O(n log n)

Complejidad Espacial: O(n) — requiere arreglo temporal

Propiedades:
  - Ordenamiento estable
  - No es in-place (requiere O(n) de espacio extra)
  - Rendimiento predecible (siempre O(n log n))
  - Paralelizable

Merge Sort garantiza un rendimiento O(n log n) independientemente de la entrada. Ideal cuando se requiere estabilidad o para ordenar listas enlazadas.`,

      'binary-search': `Binary Search (Búsqueda Binaria)

Binary Search es un algoritmo eficiente para encontrar un valor objetivo en un arreglo ordenado. Funciona dividiendo repetidamente el intervalo de búsqueda a la mitad.

Prerrequisito: El arreglo debe estar ordenado.

Cómo funciona:
1. Compara el objetivo con el elemento del medio
2. Si son iguales, encontramos el objetivo
3. Si el objetivo es menor, busca en la mitad izquierda
4. Si el objetivo es mayor, busca en la mitad derecha
5. Repite hasta encontrar o agotar el espacio de búsqueda

Complejidad Temporal:
  Mejor:    O(1) — el objetivo está en el medio
  Promedio: O(log n)
  Peor:     O(log n)

Complejidad Espacial: O(1) — versión iterativa

Binary Search es fundamental en las ciencias de la computación y se usa extensamente en bases de datos, sistemas de archivos y como bloque de construcción para algoritmos más complejos.`,

      'linear-search': `Linear Search (Búsqueda Lineal)

Linear Search (o Búsqueda Secuencial) es el algoritmo de búsqueda más simple. Revisa cada elemento de la lista secuencialmente hasta encontrar el objetivo o agotar la lista.

Cómo funciona:
1. Comienza desde el primer elemento
2. Compara cada elemento con el objetivo
3. Si se encuentra una coincidencia, retorna el índice
4. Si se llega al final sin coincidencia, retorna -1

Complejidad Temporal:
  Mejor:    O(1) — el objetivo es el primer elemento
  Promedio: O(n)
  Peor:     O(n) — el objetivo es el último o no está presente

Complejidad Espacial: O(1)

Propiedades:
  - Funciona con arreglos sin ordenar
  - No necesita preprocesamiento
  - Simple de implementar

Linear Search es útil para conjuntos de datos pequeños o datos sin ordenar donde algoritmos más eficientes no pueden aplicarse.`,

      bfs: `Búsqueda en Anchura (BFS)

BFS es un algoritmo de recorrido de grafos que explora todos los vértices en la profundidad actual antes de pasar a los vértices del siguiente nivel de profundidad. Utiliza una estructura de datos de cola.

Cómo funciona:
1. Comienza desde un nodo origen, márcalo como visitado, agrégalo a la cola
2. Desencola un nodo, procésalo
3. Encola todos los vecinos no visitados
4. Repite hasta que la cola esté vacía

Complejidad Temporal: O(V + E)
  V = número de vértices, E = número de aristas

Complejidad Espacial: O(V) — para la cola y el conjunto de visitados

Aplicaciones:
  - Camino más corto en grafos no ponderados
  - Recorrido por niveles de árboles
  - Encontrar componentes conexos
  - Rastreo web (web crawling)
  - Análisis de redes sociales (grados de separación)

BFS garantiza encontrar el camino más corto (menos aristas) entre dos nodos en un grafo no ponderado.`,

      dfs: `Búsqueda en Profundidad (DFS)

DFS es un algoritmo de recorrido de grafos que explora lo más profundo posible a lo largo de cada rama antes de retroceder. Utiliza una pila (o recursión).

Cómo funciona:
1. Comienza desde un nodo origen, márcalo como visitado
2. Visita recursivamente cada vecino no visitado
3. Retrocede cuando no quedan vecinos sin visitar
4. Continúa hasta que todos los nodos alcanzables sean visitados

Complejidad Temporal: O(V + E)
  V = número de vértices, E = número de aristas

Complejidad Espacial: O(V) — para la pila de recursión y el conjunto de visitados

Aplicaciones:
  - Detección de ciclos en grafos
  - Ordenamiento topológico
  - Encontrar componentes conexos
  - Resolver laberintos y puzzles
  - Búsqueda de caminos

DFS explora caminos profundos primero, lo que lo hace útil para ordenamiento topológico y detección de ciclos, pero no garantiza caminos más cortos.`,

      'n-queens': `Problema de las N Reinas

El problema de las N Reinas pregunta: ¿cómo se pueden colocar N reinas de ajedrez en un tablero N×N de modo que ninguna reina amenace a otra?

Una reina puede atacar cualquier pieza en la misma fila, columna o diagonal. Por lo tanto, una solución requiere que ningún par de reinas comparta la misma fila, columna o diagonal.

Cómo funciona (Backtracking):
1. Coloca reinas una fila a la vez
2. Para cada fila, prueba cada columna
3. Verifica si la posición es segura (sin conflictos)
4. Si es segura, coloca la reina y pasa a la siguiente fila
5. Si no existe columna segura, retrocede a la fila anterior

Esta visualización muestra el problema de las 4 reinas en un tablero 4×4.

Complejidad Temporal: O(N!) — en el peor caso
Complejidad Espacial: O(N²) — para el tablero

El problema de las N Reinas es un ejemplo clásico de algoritmos de backtracking y problemas de satisfacción de restricciones.`,

      'heap-sort': `Heap Sort (Ordenamiento por Montículo)

Heap Sort utiliza una estructura de datos de montículo binario (heap) para ordenar elementos. Primero construye un max-heap del arreglo y luego extrae repetidamente el elemento máximo.

Cómo funciona:
1. Construir un max-heap a partir del arreglo
2. El elemento más grande está ahora en la raíz (índice 0)
3. Intercambiarlo con el último elemento, reducir el tamaño del heap
4. Aplicar heapify a la raíz para restaurar la propiedad del max-heap
5. Repetir hasta que el heap esté vacío

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n log n)
  Peor:     O(n log n)

Complejidad Espacial: O(1) — in-place

Propiedades:
  - No es estable
  - In-place
  - Rendimiento garantizado O(n log n)

Heap Sort combina lo mejor de Merge Sort (O(n log n) garantizado) y Quick Sort (in-place). Útil cuando el rendimiento en el peor caso importa.`,

      'counting-sort': `Counting Sort (Ordenamiento por Conteo)

Counting Sort es un algoritmo de ordenamiento no basado en comparaciones. Cuenta las ocurrencias de cada valor y usa aritmética para determinar posiciones.

Cómo funciona:
1. Encontrar el rango de valores de entrada (mín a máx)
2. Crear un arreglo de conteo para almacenar la frecuencia de cada valor
3. Modificar el arreglo de conteo para almacenar conteos acumulados
4. Construir el arreglo de salida colocando elementos en sus posiciones correctas

Complejidad Temporal:
  Mejor:    O(n + k)
  Promedio: O(n + k)
  Peor:     O(n + k)
  donde k es el rango de valores de entrada

Complejidad Espacial: O(n + k)

Propiedades:
  - Ordenamiento estable
  - No es in-place
  - No basado en comparaciones
  - Muy eficiente cuando k es pequeño respecto a n

Counting Sort es ideal para ordenar enteros dentro de un rango conocido y pequeño. Se usa como subrutina en Radix Sort.`,

      'radix-sort': `Radix Sort (Ordenamiento por Base)

Radix Sort ordena números dígito a dígito, desde el dígito menos significativo al más significativo (LSD Radix Sort). Usa un ordenamiento estable (como Counting Sort) como subrutina.

Cómo funciona:
1. Encontrar el número máximo para determinar la cantidad de dígitos
2. Para cada posición de dígito (unidades, decenas, centenas, ...):
   a. Ordenar el arreglo basándose en el dígito actual usando un ordenamiento estable
3. Después de procesar todos los dígitos, el arreglo está ordenado

Complejidad Temporal:
  Mejor:    O(d × (n + k))
  Promedio: O(d × (n + k))
  Peor:     O(d × (n + k))
  donde d = número de dígitos, k = base (10 para decimal)

Complejidad Espacial: O(n + k)

Propiedades:
  - Ordenamiento estable
  - No es in-place
  - No basado en comparaciones
  - Eficiente para enteros y cadenas

Radix Sort puede superar a los ordenamientos basados en comparaciones cuando el número de dígitos es pequeño respecto a log(n).`,

      'shell-sort': `Shell Sort (Ordenamiento Shell)

Shell Sort es una generalización de Insertion Sort que permite el intercambio de elementos que están lejos entre sí. Usa una secuencia de brechas decrecientes para ordenar progresivamente el arreglo.

Cómo funciona:
1. Comenzar con una brecha grande (típicamente n/2)
2. Realizar un insertion sort con brecha para la brecha actual
3. Reducir la brecha (típicamente a la mitad)
4. Repetir hasta que la brecha sea 1 (la pasada final es un insertion sort estándar)

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n^(3/2)) — depende de la secuencia de brechas
  Peor:     O(n²) — con secuencia de brechas n/2

Complejidad Espacial: O(1) — in-place

Propiedades:
  - No es estable
  - In-place
  - Adaptativo

Shell Sort es más rápido que Insertion Sort para arreglos grandes porque mueve elementos más cerca de su posición final antes. El rendimiento depende mucho de la secuencia de brechas elegida.`,

      'jump-search': `Jump Search (Búsqueda por Saltos)

Jump Search funciona en arreglos ordenados saltando hacia adelante en pasos fijos y luego realizando una búsqueda lineal dentro del bloque identificado.

Cómo funciona:
1. Calcular el tamaño óptimo de salto: √n
2. Saltar a través del arreglo en bloques hasta encontrar uno donde podría estar el objetivo
3. Realizar una búsqueda lineal dentro de ese bloque
4. Retornar el índice si se encuentra, -1 en caso contrario

Complejidad Temporal:
  Mejor:    O(1)
  Promedio: O(√n)
  Peor:     O(√n)

Complejidad Espacial: O(1)

Propiedades:
  - Requiere arreglo ordenado
  - Mejor que búsqueda lineal, más simple que búsqueda binaria
  - Tamaño de salto óptimo: √n

Jump Search es útil cuando retroceder es costoso (por ejemplo, en listas enlazadas) comparado con Binary Search que requiere acceso aleatorio.`,

      'interpolation-search': `Interpolation Search (Búsqueda por Interpolación)

Interpolation Search es una variante mejorada de Binary Search para datos ordenados uniformemente distribuidos. En lugar de ir siempre al medio, estima la posición del objetivo basándose en su valor.

Cómo funciona:
1. Estimar posición: pos = low + ((objetivo - arr[low]) × (high - low)) / (arr[high] - arr[low])
2. Si arr[pos] es igual al objetivo, retornar pos
3. Si arr[pos] < objetivo, buscar en la porción derecha
4. Si arr[pos] > objetivo, buscar en la porción izquierda

Complejidad Temporal:
  Mejor:    O(1)
  Promedio: O(log log n) — para distribución uniforme
  Peor:     O(n) — para distribución no uniforme

Complejidad Espacial: O(1)

Propiedades:
  - Requiere arreglo ordenado
  - Mejor para datos uniformemente distribuidos
  - Puede degradarse a O(n) para distribuciones sesgadas

Interpolation Search puede ser significativamente más rápida que Binary Search cuando los datos están uniformemente distribuidos, ya que hace mejores estimaciones sobre dónde podría estar el objetivo.`,

      dijkstra: `Algoritmo de Dijkstra

El algoritmo de Dijkstra encuentra el camino más corto desde un nodo origen a todos los demás nodos en un grafo ponderado con pesos no negativos.

Cómo funciona:
1. Inicializar distancias: origen = 0, todos los demás = ∞
2. Marcar todos los nodos como no visitados
3. Seleccionar el nodo no visitado con la menor distancia
4. Para cada vecino no visitado, calcular la distancia tentativa
5. Si la nueva distancia es menor, actualizarla
6. Marcar el nodo actual como visitado
7. Repetir hasta que todos los nodos estén visitados

Complejidad Temporal:
  O(V²) con arreglo simple
  O((V + E) log V) con min-heap binario

Complejidad Espacial: O(V)

Aplicaciones:
  - Navegación GPS y planificación de rutas
  - Protocolos de enrutamiento de red (OSPF)
  - Encontrar caminos más cortos en mapas
  - Análisis de redes sociales

El algoritmo de Dijkstra es uno de los algoritmos de grafos más importantes. Garantiza soluciones óptimas para grafos con pesos no negativos.`,

      prim: `Algoritmo de Prim

El algoritmo de Prim encuentra un Árbol de Expansión Mínima (MST) para un grafo ponderado, conexo y no dirigido. El MST conecta todos los vértices con el peso total mínimo de aristas.

Cómo funciona:
1. Comenzar con cualquier nodo como árbol inicial
2. Encontrar la arista de peso mínimo que conecte el árbol con un vértice externo
3. Agregar esa arista y vértice al árbol
4. Repetir hasta que todos los vértices estén en el árbol

Complejidad Temporal:
  O(V²) con matriz de adyacencia
  O(E log V) con min-heap

Complejidad Espacial: O(V)

Aplicaciones:
  - Diseño de redes (cableado de costo mínimo)
  - Algoritmos de aproximación para problemas NP-duros
  - Análisis de clusters
  - Segmentación de imágenes

El algoritmo de Prim es un algoritmo voraz que siempre elige la arista más barata para expandir el árbol. Compárese con el algoritmo de Kruskal, que ordena todas las aristas globalmente.`,

      'topological-sort': `Ordenamiento Topológico (Algoritmo de Kahn)

El Ordenamiento Topológico produce un ordenamiento lineal de vértices en un Grafo Acíclico Dirigido (DAG) tal que para cada arista dirigida u → v, el vértice u aparece antes que v en el ordenamiento.

Cómo funciona (Algoritmo de Kahn - basado en BFS):
1. Calcular el grado de entrada de cada vértice
2. Agregar todos los vértices con grado de entrada 0 a una cola
3. Mientras la cola no esté vacía:
   a. Desencolar un vértice, agregarlo al resultado
   b. Para cada arista saliente, decrementar el grado de entrada del vecino
   c. Si el grado de entrada de un vecino llega a 0, encolarlo
4. Si todos los vértices fueron procesados, el resultado es un orden topológico válido

Complejidad Temporal: O(V + E)
Complejidad Espacial: O(V)

Aplicaciones:
  - Planificación de tareas con dependencias
  - Sistemas de compilación (Make, Gradle)
  - Planificación de prerrequisitos de cursos
  - Resolución de dependencias de paquetes

El Ordenamiento Topológico solo es posible para DAGs (Grafos Acíclicos Dirigidos). Si el grafo tiene un ciclo, no existe un ordenamiento válido.`,

      'fibonacci-dp': `Fibonacci (Programación Dinámica)

La secuencia de Fibonacci es un ejemplo clásico de programación dinámica. Cada número es la suma de los dos anteriores: F(n) = F(n-1) + F(n-2).

Cómo funciona (Tabulación Bottom-Up):
1. Crear una tabla para almacenar valores calculados
2. Establecer casos base: F(0) = 0, F(1) = 1
3. Llenar la tabla iterativamente: F(i) = F(i-1) + F(i-2)
4. Retornar F(n)

Complejidad Temporal: O(n)
Complejidad Espacial: O(n) — optimizable a O(1)

Comparación:
  - Recursión ingenua: O(2^n) — exponencial
  - Memoización (top-down): O(n)
  - Tabulación (bottom-up): O(n)

La Programación Dinámica evita cálculos redundantes almacenando resultados previamente computados. Fibonacci es la ilustración más simple de esta técnica.`,

      knapsack: `Problema de la Mochila 0/1

El Problema de la Mochila 0/1: dados artículos con pesos y valores, y una capacidad máxima, encontrar el valor máximo que se puede transportar sin exceder la capacidad. Cada artículo puede tomarse como máximo una vez.

Cómo funciona (DP Bottom-Up):
1. Crear una tabla 2D: dp[i][w] = valor máximo usando los primeros i artículos con capacidad w
2. Para cada artículo i y capacidad w:
   - Si el artículo no cabe: dp[i][w] = dp[i-1][w]
   - Si cabe: dp[i][w] = max(dp[i-1][w], dp[i-1][w-peso[i]] + valor[i])
3. dp[n][W] contiene el valor óptimo

Complejidad Temporal: O(n × W) — pseudo-polinomial
Complejidad Espacial: O(n × W) — optimizable a O(W)

Aplicaciones:
  - Asignación de recursos
  - Planificación de presupuestos
  - Carga de mercancías
  - Criptografía

El Problema de la Mochila es uno de los problemas fundamentales en optimización combinatoria y es NP-duro en general.`,

      lcs: `Subsecuencia Común más Larga (LCS)

LCS encuentra la subsecuencia más larga común a dos secuencias. Una subsecuencia es una secuencia que aparece en el mismo orden relativo, pero no necesariamente contigua.

Cómo funciona (DP Bottom-Up):
1. Crear una tabla 2D: dp[i][j] = longitud del LCS de los primeros i caracteres de X y los primeros j caracteres de Y
2. Si los caracteres coinciden: dp[i][j] = dp[i-1][j-1] + 1
3. Si no coinciden: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. dp[m][n] contiene la longitud del LCS

Complejidad Temporal: O(m × n)
Complejidad Espacial: O(m × n) — optimizable a O(min(m, n))

Aplicaciones:
  - Herramientas diff (comparación de archivos)
  - Alineamiento de secuencias de ADN
  - Sistemas de control de versiones
  - Corrección ortográfica

LCS es un problema fundamental en bioinformática y procesamiento de texto. Se generaliza al problema de distancia de edición.`,

      'sudoku-solver': `Solucionador de Sudoku

Este solucionador usa backtracking para llenar una cuadrícula de Sudoku de modo que cada fila, columna y caja contenga todos los dígitos exactamente una vez. Esta visualización usa una variante 4×4 con dígitos 1-4.

Cómo funciona (Backtracking):
1. Encontrar una celda vacía
2. Probar cada número válido (1 a N)
3. Verificar si el número es seguro (no está en la misma fila, columna o caja)
4. Si es seguro, colocarlo e intentar recursivamente llenar la siguiente celda vacía
5. Si ningún número válido funciona, retroceder (quitar el número e intentar el siguiente)

Complejidad Temporal: O(N^(N×N)) — peor caso
Complejidad Espacial: O(N×N) — para el tablero

Propiedades:
  - Siempre encuentra una solución si existe
  - El backtracking poda ramas inválidas tempranamente
  - Puede optimizarse con propagación de restricciones

Sudoku es un problema clásico de satisfacción de restricciones resuelto eficientemente con backtracking.`,

      'maze-pathfinding': `Búsqueda de Camino en Laberinto (BFS)

Este algoritmo usa Búsqueda en Anchura para encontrar el camino más corto a través de un laberinto desde el inicio hasta el final, navegando alrededor de muros.

Cómo funciona:
1. Iniciar BFS desde la celda de inicio
2. Explorar los 4 vecinos (arriba, abajo, izquierda, derecha)
3. Omitir muros y celdas ya visitadas
4. Marcar cada celda explorada y registrar su padre
5. Cuando se alcanza el final, rastrear hacia atrás a través de los padres para encontrar el camino

Complejidad Temporal: O(filas × columnas)
Complejidad Espacial: O(filas × columnas)

Propiedades:
  - Garantiza el camino más corto
  - Explora nivel por nivel (celdas más cercanas primero)
  - Funciona en cuadrículas sin pesos

La búsqueda de caminos basada en BFS es fundamental en desarrollo de videojuegos, robótica y sistemas de navegación. Para cuadrículas ponderadas, se usaría Dijkstra o A* en su lugar.`,

      'tower-of-hanoi': `Torre de Hanoi

La Torre de Hanoi es un clásico rompecabezas recursivo. Mueve todos los discos de la torre origen a la torre destino, uno a la vez, sin colocar nunca un disco más grande sobre uno más pequeño.

Cómo funciona (Recursivo):
1. Mover los n-1 discos superiores de la torre origen a la auxiliar
2. Mover el disco más grande de la torre origen a la destino
3. Mover los n-1 discos de la torre auxiliar a la destino

Complejidad Temporal: O(2^n - 1) — exactamente 2^n - 1 movimientos
Complejidad Espacial: O(n) — pila de llamadas recursivas

Propiedades:
  - Movimientos mínimos requeridos: 2^n - 1
  - Ejemplo clásico de divide y vencerás
  - Demuestra el poder de la recursión

El rompecabezas fue inventado por el matemático Édouard Lucas en 1883. La leyenda dice que monjes en un templo están moviendo 64 discos dorados — completar el rompecabezas marcaría el fin del mundo (requiriendo 18.446.744.073.709.551.615 movimientos).`,
    },
  },
}

export function t(locale: Locale, key: keyof Translations): string {
  return translations[locale][key] as string
}

export function getAlgorithmDescription(locale: Locale, algorithmId: string): string | undefined {
  return translations[locale].algorithmDescriptions[algorithmId]
}

export function getCategoryName(locale: Locale, categoryKey: string): string {
  return translations[locale].categories[categoryKey] || categoryKey
}

export function getAlgorithmMetaTitle(locale: Locale, algorithmId: string, fallbackName: string): string {
  const desc = translations[locale].algorithmDescriptions[algorithmId]
  if (!desc) return `${fallbackName} | alg0.dev`
  const firstLine = desc.split('\n')[0].trim()
  return `${firstLine || fallbackName} | alg0.dev`
}

export function getAlgorithmMetaDescription(locale: Locale, algorithmId: string): string {
  const desc = translations[locale].algorithmDescriptions[algorithmId]
  if (!desc) return translations[locale].siteDescription
  const paragraphs = desc.split('\n\n')
  const content = paragraphs.length > 1 ? paragraphs[1] : paragraphs[0]
  const cleaned = content.replace(/\n/g, ' ').trim()
  if (cleaned.length <= 160) return cleaned
  return cleaned.slice(0, 157) + '...'
}
