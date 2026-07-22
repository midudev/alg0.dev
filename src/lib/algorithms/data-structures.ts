import type {
  Algorithm,
  Step,
  LinkedListNodeData,
  HashEntry,
  TreeNodeData,
  TrieNodeData,
  LruEntry,
} from '@lib/types'
import { d } from '@lib/algorithms/shared'

// Re-export stack and queue (moved from concepts)
export { stack, queue } from '@lib/algorithms/concepts'

// ════════════════════════════════════════════════════════════════
//  LINKED LIST
// ════════════════════════════════════════════════════════════════

type LLNode = LinkedListNodeData

function ll(nodes: LLNode[]): LLNode[] {
  return nodes
}

export const linkedList: Algorithm = {
  id: 'linked-list',
  name: 'Linked List',
  category: 'Data Structures',
  difficulty: 'easy',
  visualization: 'concept',
  code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
  }

  prepend(value) {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  search(value) {
    let current = this.head;
    while (current) {
      if (current.value === value) return current;
      current = current.next;
    }
    return null;
  }

  delete(value) {
    if (!this.head) return;
    if (this.head.value === value) {
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      return;
    }
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        if (current.next === this.tail) {
          this.tail = current;
        }
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }
}`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'linkedList', nodes: [] },
      description: d(
        locale,
        'An empty linked list. Head and tail are both null.',
        'Una lista enlazada vacía. Head y tail son null.',
      ),
      codeLine: 8,
      variables: { head: null, tail: null, size: 0 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([{ value: 10, state: 'new' }]),
        operation: 'append(10)',
      },
      description: d(
        locale,
        'append(10): First node. Both head and tail point to it.',
        'append(10): Primer nodo. Tanto head como tail apuntan a él.',
      ),
      codeLine: 17,
      variables: { operation: 'append(10)', head: 10, tail: 10, size: 1 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 10, state: 'normal' },
          { value: 20, state: 'new' },
        ]),
        operation: 'append(20)',
      },
      description: d(
        locale,
        'append(20): New node added after tail. Tail now points to 20.',
        'append(20): Nuevo nodo añadido después de tail. Tail ahora apunta a 20.',
      ),
      codeLine: 19,
      variables: { operation: 'append(20)', head: 10, tail: 20, size: 2 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 10, state: 'normal' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'new' },
        ]),
        operation: 'append(30)',
      },
      description: d(
        locale,
        'append(30): Chain grows. Each node points to the next via .next pointer.',
        'append(30): La cadena crece. Cada nodo apunta al siguiente via el puntero .next.',
      ),
      codeLine: 19,
      variables: { operation: 'append(30)', head: 10, tail: 30, size: 3 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'new' },
          { value: 10, state: 'normal' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'prepend(5)',
      },
      description: d(
        locale,
        'prepend(5): New node becomes the head. O(1) — no shifting needed!',
        'prepend(5): El nuevo nodo se convierte en head. ¡O(1) — no se necesita desplazar!',
      ),
      codeLine: 24,
      variables: { operation: 'prepend(5)', head: 5, tail: 30, size: 4 },
    })

    // Search for 20
    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'current' },
          { value: 10, state: 'normal' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'search(20)',
      },
      description: d(
        locale,
        'search(20): Start at head (5). Not 20, follow .next pointer...',
        'search(20): Empezar en head (5). No es 20, seguir el puntero .next...',
      ),
      codeLine: 31,
      variables: { operation: 'search(20)', current: 5, target: 20 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'current' },
          { value: 20, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'search(20)',
      },
      description: d(
        locale,
        'search(20): At node 10. Not 20, keep traversing...',
        'search(20): En nodo 10. No es 20, seguir recorriendo...',
      ),
      codeLine: 33,
      variables: { operation: 'search(20)', current: 10, target: 20 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'normal' },
          { value: 20, state: 'found' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'search(20) → found!',
      },
      description: d(
        locale,
        'search(20): Found it! O(n) worst case — must traverse from head.',
        'search(20): ¡Encontrado! O(n) en el peor caso — se debe recorrer desde head.',
      ),
      codeLine: 32,
      variables: { operation: 'search(20)', found: true, steps: 3 },
    })

    // Delete 20
    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'current' },
          { value: 20, state: 'removing' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'delete(20)',
      },
      description: d(
        locale,
        "delete(20): Found node 20. Set previous node's .next to skip it (10.next = 30).",
        'delete(20): Nodo 20 encontrado. Actualizar .next del anterior para saltarlo (10.next = 30).',
      ),
      codeLine: 42,
      variables: { operation: 'delete(20)', removing: 20 },
    })

    steps.push({
      concept: {
        type: 'linkedList',
        nodes: ll([
          { value: 5, state: 'normal' },
          { value: 10, state: 'normal' },
          { value: 30, state: 'normal' },
        ]),
        operation: 'delete(20) → done',
      },
      description: d(
        locale,
        'Node 20 removed. The list is now [5 → 10 → 30]. O(n) to find the node.',
        'Nodo 20 eliminado. La lista ahora es [5 → 10 → 30]. O(n) para encontrar el nodo.',
      ),
      codeLine: 43,
      variables: { head: 5, tail: 30, size: 3 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  HASH TABLE
// ════════════════════════════════════════════════════════════════

function hashCode(key: string, size: number): number {
  let h = 0
  for (const ch of key) h = (h + ch.charCodeAt(0)) % size
  return h
}

function makeBuckets(size: number, entries: [string, number, string][]): HashEntry[][] {
  const buckets: HashEntry[][] = Array.from({ length: size }, () => [])
  for (const [key, value, state] of entries) {
    const idx = hashCode(key, size)
    buckets[idx].push({ key, value, state: state as HashEntry['state'] })
  }
  return buckets
}

export const hashTable: Algorithm = {
  id: 'hash-table',
  name: 'Hash Table',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class HashTable {
  constructor(size = 7) {
    this.buckets = new Array(size)
      .fill(null).map(() => []);
  }

  hash(key) {
    let h = 0;
    for (const ch of key)
      h = (h + ch.charCodeAt(0)) % this.buckets.length;
    return h;
  }

  set(key, value) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const existing = bucket.find(e => e.key === key);
    if (existing) existing.value = value;
    else bucket.push({ key, value });
  }

  get(key) {
    const idx = this.hash(key);
    const entry = this.buckets[idx]
      .find(e => e.key === key);
    return entry?.value;
  }

  delete(key) {
    const idx = this.hash(key);
    const bucket = this.buckets[idx];
    const i = bucket.findIndex(e => e.key === key);
    if (i !== -1) bucket.splice(i, 1);
  }
}`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const SIZE = 7

    steps.push({
      concept: { type: 'hashTable', buckets: makeBuckets(SIZE, []), size: SIZE },
      description: d(
        locale,
        'An empty hash table with 7 buckets. The hash function maps keys to bucket indices.',
        'Una tabla hash vacía con 7 buckets. La función hash mapea claves a índices de bucket.',
      ),
      codeLine: 1,
      variables: { size: SIZE, entries: 0 },
    })

    // Insert "cat"
    const catH = hashCode('cat', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [['cat', 3, 'new']]),
        size: SIZE,
        hashingKey: 'cat',
        hashResult: catH,
        operation: 'set("cat", 3)',
      },
      description: d(
        locale,
        `set("cat", 3): hash("cat") = ${catH}. Store in bucket ${catH}.`,
        `set("cat", 3): hash("cat") = ${catH}. Almacenar en bucket ${catH}.`,
      ),
      codeLine: 15,
      variables: { key: 'cat', hash: catH, bucket: catH },
    })

    // Insert "dog"
    const dogH = hashCode('dog', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'dog',
        hashResult: dogH,
        operation: 'set("dog", 5)',
      },
      description: d(
        locale,
        `set("dog", 5): hash("dog") = ${dogH}. Different bucket, no collision.`,
        `set("dog", 5): hash("dog") = ${dogH}. Diferente bucket, sin colisión.`,
      ),
      codeLine: 15,
      variables: { key: 'dog', hash: dogH, bucket: dogH },
    })

    // Insert "ant"
    const antH = hashCode('ant', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'ant',
        hashResult: antH,
        operation: 'set("ant", 1)',
      },
      description: d(
        locale,
        `set("ant", 1): hash("ant") = ${antH}. Placed in bucket ${antH}.`,
        `set("ant", 1): hash("ant") = ${antH}. Colocado en bucket ${antH}.`,
      ),
      codeLine: 15,
      variables: { key: 'ant', hash: antH, bucket: antH },
    })

    // Insert "fish" — collision with "dog"!
    const fishH = hashCode('fish', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'collision'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'fish',
        hashResult: fishH,
        operation: 'set("fish", 8) — COLLISION!',
      },
      description: d(
        locale,
        `set("fish", 8): hash("fish") = ${fishH}. Collision with "dog"! Both go in the same bucket using chaining.`,
        `set("fish", 8): hash("fish") = ${fishH}. ¡Colisión con "dog"! Ambos van al mismo bucket usando encadenamiento.`,
      ),
      codeLine: 20,
      variables: { key: 'fish', hash: fishH, collision: true },
    })

    // Insert "bee" — another collision
    const beeH = hashCode('bee', SIZE)
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'collision'],
          ['bee', 2, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'bee',
        hashResult: beeH,
        operation: 'set("bee", 2) — COLLISION!',
      },
      description: d(
        locale,
        `set("bee", 2): hash("bee") = ${beeH}. Another collision! Bucket ${beeH} now has a chain of 3 entries.`,
        `set("bee", 2): hash("bee") = ${beeH}. ¡Otra colisión! Bucket ${beeH} ahora tiene una cadena de 3 entradas.`,
      ),
      codeLine: 20,
      variables: { key: 'bee', hash: beeH, chainLength: 3 },
    })

    // Get "cat"
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'found'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'normal'],
          ['bee', 2, 'normal'],
        ]),
        size: SIZE,
        hashingKey: 'cat',
        hashResult: catH,
        operation: 'get("cat") → 3',
      },
      description: d(
        locale,
        `get("cat"): hash → bucket ${catH}. Only one entry, found immediately. O(1)!`,
        `get("cat"): hash → bucket ${catH}. Solo una entrada, encontrada de inmediato. ¡O(1)!`,
      ),
      codeLine: 23,
      variables: { key: 'cat', hash: catH, result: 3 },
    })

    // Get "fish" — requires chain traversal
    steps.push({
      concept: {
        type: 'hashTable',
        buckets: makeBuckets(SIZE, [
          ['cat', 3, 'normal'],
          ['dog', 5, 'normal'],
          ['ant', 1, 'normal'],
          ['fish', 8, 'found'],
          ['bee', 2, 'normal'],
        ]),
        size: SIZE,
        hashingKey: 'fish',
        hashResult: fishH,
        operation: 'get("fish") → 8',
      },
      description: d(
        locale,
        `get("fish"): hash → bucket ${fishH}. Must traverse the chain: "dog" → "fish". Found! Still fast with short chains.`,
        `get("fish"): hash → bucket ${fishH}. Recorrer la cadena: "dog" → "fish". ¡Encontrado! Sigue siendo rápido con cadenas cortas.`,
      ),
      codeLine: 25,
      variables: { key: 'fish', hash: fishH, result: 8, chainSteps: 2 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  BINARY SEARCH TREE
// ════════════════════════════════════════════════════════════════

function makeTree(values: [number, string][]): (TreeNodeData | null)[] {
  const arr: (TreeNodeData | null)[] = []
  for (const [val, state] of values) {
    insertIntoTreeArray(arr, val, state as TreeNodeData['state'])
  }
  return arr
}

function insertIntoTreeArray(
  arr: (TreeNodeData | null)[],
  value: number,
  state: TreeNodeData['state'],
) {
  let idx = 0
  while (idx < arr.length && arr[idx]) {
    if (value < arr[idx]!.value) idx = 2 * idx + 1
    else idx = 2 * idx + 2
  }
  while (arr.length <= idx) arr.push(null)
  arr[idx] = { value, state }
}

export const binarySearchTree: Algorithm = {
  id: 'binary-search-tree',
  name: 'Binary Search Tree',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class BSTNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BST {
  constructor() { this.root = null; }

  insert(value) {
    const node = new BSTNode(value);
    if (!this.root) { this.root = node; return; }
    let current = this.root;
    while (true) {
      if (value < current.value) {
        if (!current.left) {
          current.left = node; return;
        }
        current = current.left;
      } else {
        if (!current.right) {
          current.right = node; return;
        }
        current = current.right;
      }
    }
  }

  search(value) {
    let current = this.root;
    while (current) {
      if (value === current.value) return current;
      current = value < current.value
        ? current.left : current.right;
    }
    return null;
  }
}`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'binaryTree', nodes: [], treeType: 'bst' },
      description: d(
        locale,
        'An empty BST. The first inserted value becomes the root.',
        'Un BST vacío. El primer valor insertado se convierte en la raíz.',
      ),
      codeLine: 9,
      variables: { root: null },
    })

    // Insert 8 (root)
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([[8, 'new']]),
        treeType: 'bst',
        operation: 'insert(8)',
      },
      description: d(
        locale,
        'insert(8): Tree is empty, 8 becomes the root.',
        'insert(8): El árbol está vacío, 8 se convierte en la raíz.',
      ),
      codeLine: 14,
      variables: { operation: 'insert(8)', root: 8 },
    })

    // Insert 3
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'comparing'],
          [3, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(3)',
      },
      description: d(
        locale,
        'insert(3): 3 < 8, go left. Left is empty → place here.',
        'insert(3): 3 < 8, ir a la izquierda. Izquierda vacía → colocar aquí.',
      ),
      codeLine: 17,
      variables: { operation: 'insert(3)', compare: '3 < 8', direction: 'left' },
    })

    // Insert 10
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'comparing'],
          [3, 'normal'],
          [10, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(10)',
      },
      description: d(
        locale,
        'insert(10): 10 ≥ 8, go right. Right is empty → place here.',
        'insert(10): 10 ≥ 8, ir a la derecha. Derecha vacía → colocar aquí.',
      ),
      codeLine: 22,
      variables: { operation: 'insert(10)', compare: '10 ≥ 8', direction: 'right' },
    })

    // Insert 1
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'comparing'],
          [10, 'normal'],
          [1, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(1)',
      },
      description: d(
        locale,
        'insert(1): 1 < 8 → left to 3. 1 < 3 → left again. Empty → place here.',
        'insert(1): 1 < 8 → izquierda a 3. 1 < 3 → izquierda de nuevo. Vacío → colocar aquí.',
      ),
      codeLine: 17,
      variables: { operation: 'insert(1)', path: '8 → 3 → left' },
    })

    // Insert 6
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'comparing'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(6)',
      },
      description: d(
        locale,
        'insert(6): 6 < 8 → left to 3. 6 ≥ 3 → right. Empty → place here.',
        'insert(6): 6 < 8 → izquierda a 3. 6 ≥ 3 → derecha. Vacío → colocar aquí.',
      ),
      codeLine: 22,
      variables: { operation: 'insert(6)', path: '8 → 3 → right' },
    })

    // Insert 14
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'normal'],
          [10, 'comparing'],
          [1, 'normal'],
          [6, 'normal'],
          [14, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(14)',
      },
      description: d(
        locale,
        'insert(14): 14 ≥ 8 → right to 10. 14 ≥ 10 → right. Empty → place here.',
        'insert(14): 14 ≥ 8 → derecha a 10. 14 ≥ 10 → derecha. Vacío → colocar aquí.',
      ),
      codeLine: 22,
      variables: { operation: 'insert(14)', path: '8 → 10 → right' },
    })

    // Search for 6
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'current'],
          [3, 'normal'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'normal'],
          [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6): at root 8',
      },
      description: d(
        locale,
        'search(6): Start at root (8). 6 < 8, go left...',
        'search(6): Empezar en la raíz (8). 6 < 8, ir a la izquierda...',
      ),
      codeLine: 33,
      variables: { operation: 'search(6)', current: 8, compare: '6 < 8' },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'current'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'normal'],
          [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6): at node 3',
      },
      description: d(
        locale,
        'search(6): At node 3. 6 ≥ 3, go right...',
        'search(6): En nodo 3. 6 ≥ 3, ir a la derecha...',
      ),
      codeLine: 35,
      variables: { operation: 'search(6)', current: 3, compare: '6 ≥ 3' },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: makeTree([
          [8, 'normal'],
          [3, 'normal'],
          [10, 'normal'],
          [1, 'normal'],
          [6, 'found'],
          [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6) → found!',
      },
      description: d(
        locale,
        'search(6): Found! Only 3 comparisons (root → 3 → 6). O(log n) on a balanced tree.',
        'search(6): ¡Encontrado! Solo 3 comparaciones (raíz → 3 → 6). O(log n) en un árbol balanceado.',
      ),
      codeLine: 34,
      variables: { operation: 'search(6)', found: true, comparisons: 3 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  HEAP (MIN HEAP)
// ════════════════════════════════════════════════════════════════

function heapNodes(
  values: number[],
  highlights: Record<number, TreeNodeData['state']> = {},
): (TreeNodeData | null)[] {
  return values.map((v, i) => ({
    value: v,
    state: highlights[i] ?? 'normal',
  }))
}

export const heap: Algorithm = {
  id: 'heap',
  name: 'Heap',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class MinHeap {
  constructor() { this.heap = []; }

  insert(value) {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  bubbleUp(i) {
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.heap[parent] <= this.heap[i]) break;
      [this.heap[parent], this.heap[i]] =
        [this.heap[i], this.heap[parent]];
      i = parent;
    }
  }

  extractMin() {
    const min = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }
    return min;
  }

  bubbleDown(i) {
    while (2 * i + 1 < this.heap.length) {
      let smallest = 2 * i + 1;
      const right = smallest + 1;
      if (right < this.heap.length &&
          this.heap[right] < this.heap[smallest])
        smallest = right;
      if (this.heap[i] <= this.heap[smallest]) break;
      [this.heap[i], this.heap[smallest]] =
        [this.heap[smallest], this.heap[i]];
      i = smallest;
    }
  }
}`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'binaryTree', nodes: [], treeType: 'heap', heapType: 'min' },
      description: d(
        locale,
        'An empty min-heap. The smallest element is always at the root.',
        'Un min-heap vacío. El elemento más pequeño siempre está en la raíz.',
      ),
      codeLine: 1,
      variables: { heapType: 'min', size: 0 },
    })

    // Insert 8
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([8], { 0: 'new' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(8)',
      },
      description: d(
        locale,
        'insert(8): First element, becomes the root.',
        'insert(8): Primer elemento, se convierte en la raíz.',
      ),
      codeLine: 4,
      variables: { operation: 'insert(8)', heap: '[8]' },
    })

    // Insert 5
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([8, 5], { 1: 'new', 0: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(5): bubble up?',
      },
      description: d(
        locale,
        'insert(5): Added at end. 5 < 8 (parent) → must bubble up!',
        'insert(5): Añadido al final. 5 < 8 (padre) → ¡debe subir!',
      ),
      codeLine: 11,
      variables: { operation: 'insert(5)', child: 5, parent: 8, swap: true },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 8], { 0: 'placed', 1: 'normal' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(5): swapped!',
      },
      description: d(
        locale,
        'Swapped! 5 is now the root. Heap property restored.',
        '¡Intercambiado! 5 es ahora la raíz. Propiedad del heap restaurada.',
      ),
      codeLine: 13,
      variables: { heap: '[5, 8]' },
    })

    // Insert 10
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 8, 10], { 2: 'new' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(10)',
      },
      description: d(
        locale,
        'insert(10): Added at end. 10 ≥ 5 (parent) → no bubble up needed.',
        'insert(10): Añadido al final. 10 ≥ 5 (padre) → no necesita subir.',
      ),
      codeLine: 5,
      variables: { operation: 'insert(10)', heap: '[5, 8, 10]' },
    })

    // Insert 1 — bubbles all the way to root
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 8, 10, 1], { 3: 'new', 1: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(1): bubble up...',
      },
      description: d(
        locale,
        'insert(1): Added at end. 1 < 8 (parent) → bubble up!',
        'insert(1): Añadido al final. 1 < 8 (padre) → ¡subir!',
      ),
      codeLine: 11,
      variables: { operation: 'insert(1)', child: 1, parent: 8, swap: true },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 1, 10, 8], { 1: 'current', 0: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(1): keep bubbling...',
      },
      description: d(
        locale,
        'Swapped 1 and 8. Now 1 < 5 (parent) → keep bubbling up!',
        'Intercambiados 1 y 8. Ahora 1 < 5 (padre) → ¡seguir subiendo!',
      ),
      codeLine: 13,
      variables: { child: 1, parent: 5, swap: true },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([1, 5, 10, 8], { 0: 'placed' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(1): done!',
      },
      description: d(
        locale,
        'Swapped 1 and 5. Now 1 is the root — the minimum! Heap property restored.',
        'Intercambiados 1 y 5. Ahora 1 es la raíz — ¡el mínimo! Propiedad del heap restaurada.',
      ),
      codeLine: 13,
      variables: { heap: '[1, 5, 10, 8]' },
    })

    // Insert 7
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([1, 5, 10, 8, 7], { 4: 'new' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'insert(7)',
      },
      description: d(
        locale,
        'insert(7): Added at end. 7 ≥ 5 (parent) → stays in place.',
        'insert(7): Añadido al final. 7 ≥ 5 (padre) → se queda en su sitio.',
      ),
      codeLine: 5,
      variables: { heap: '[1, 5, 10, 8, 7]' },
    })

    // Extract min
    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([7, 5, 10, 8], { 0: 'current', 1: 'comparing', 2: 'comparing' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'extractMin(): removed 1, bubble down...',
      },
      description: d(
        locale,
        'extractMin(): Remove root (1), move last element (7) to root. Now bubble down — compare with children.',
        'extractMin(): Eliminar raíz (1), mover último (7) a la raíz. Ahora descender — comparar con hijos.',
      ),
      codeLine: 29,
      variables: { extracted: 1, 'root now': 7, leftChild: 5, rightChild: 10 },
    })

    steps.push({
      concept: {
        type: 'binaryTree',
        nodes: heapNodes([5, 7, 10, 8], { 0: 'placed', 1: 'placed' }),
        treeType: 'heap',
        heapType: 'min',
        operation: 'extractMin(): done!',
      },
      description: d(
        locale,
        'Swapped 7 and 5 (smallest child). Heap property restored! New min is 5.',
        'Intercambiados 7 y 5 (hijo más pequeño). ¡Propiedad del heap restaurada! Nuevo mínimo es 5.',
      ),
      codeLine: 37,
      variables: { heap: '[5, 7, 10, 8]', min: 5 },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  TRIE (PREFIX TREE)
// ════════════════════════════════════════════════════════════════

type TrieNodes = Record<number, TrieNodeData>

/** Build a trie from scratch. Ids are assigned in insertion order, root is 0. */
function buildTrie(words: string[]): TrieNodes {
  const nodes: TrieNodes = {
    0: { id: 0, char: '', isEnd: false, children: {}, state: 'normal' },
  }
  let nextId = 1

  for (const word of words) {
    let current = 0
    for (const char of word) {
      if (nodes[current].children[char] == null) {
        nodes[nextId] = { id: nextId, char, isEnd: false, children: {}, state: 'normal' }
        nodes[current].children[char] = nextId
        nextId++
      }
      current = nodes[current].children[char]
    }
    nodes[current].isEnd = true
  }

  return nodes
}

/** Ids along `prefix`, stopping early if the path breaks. */
function pathIds(nodes: TrieNodes, prefix: string): number[] {
  const ids: number[] = []
  let current = 0
  for (const char of prefix) {
    const next = nodes[current].children[char]
    if (next == null) return ids
    ids.push(next)
    current = next
  }
  return ids
}

/** Paint the path for `prefix`; the last node can take a different state. */
function markPath(
  nodes: TrieNodes,
  prefix: string,
  state: TrieNodeData['state'],
  lastState?: TrieNodeData['state'],
): number | null {
  const ids = pathIds(nodes, prefix)
  ids.forEach((id, i) => {
    nodes[id].state = i === ids.length - 1 ? (lastState ?? state) : state
  })
  return ids.length === prefix.length ? (ids[ids.length - 1] ?? 0) : null
}

/** Paint every node below `rootId` (inclusive) — the autocomplete answer set. */
function markSubtree(nodes: TrieNodes, rootId: number, state: TrieNodeData['state']) {
  const stack = [rootId]
  while (stack.length > 0) {
    const id = stack.pop()!
    nodes[id].state = state
    for (const childId of Object.values(nodes[id].children)) stack.push(childId)
  }
}

export const trie: Algorithm = {
  id: 'trie',
  name: 'Trie',
  category: 'Data Structures',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `class TrieNode {
  constructor() {
    this.children = new Map();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char);
    }
    node.isEnd = true;
  }

  traverse(prefix) {
    let node = this.root;
    for (const char of prefix) {
      node = node.children.get(char);
      if (!node) return null;
    }
    return node;
  }

  search(word) {
    const node = this.traverse(word);
    return node != null && node.isEnd;
  }

  startsWith(prefix) {
    return this.traverse(prefix) != null;
  }

  wordsWithPrefix(prefix) {
    const out = [];
    const walk = (node, acc) => {
      if (!node) return;
      if (node.isEnd) out.push(acc);
      for (const [c, child] of node.children)
        walk(child, acc + c);
    };
    walk(this.traverse(prefix), prefix);
    return out;
  }
}`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'trie', nodes: buildTrie([]), words: [] },
      description: d(
        locale,
        'An empty trie: just a root node that holds no character. Every word is a path down from here.',
        'Un trie vacío: solo un nodo raíz que no guarda ningún carácter. Cada palabra es un camino que baja desde aquí.',
      ),
      codeLine: 10,
      variables: { root: 'TrieNode', words: 0 },
    })

    // insert("car") — all three nodes are brand new
    const afterCar = buildTrie(['car'])
    markPath(afterCar, 'car', 'new')
    steps.push({
      concept: {
        type: 'trie',
        nodes: afterCar,
        words: ['car'],
        probe: 'car',
        matched: 3,
        operation: 'insert("car")',
      },
      description: d(
        locale,
        'insert("car"): No branch exists yet, so one node per character is created. The double ring marks the end of a word.',
        'insert("car"): Todavía no existe ninguna rama, así que se crea un nodo por carácter. El doble anillo marca el fin de palabra.',
      ),
      codeLine: 17,
      variables: { word: 'car', created: 3, reused: 0 },
    })

    // insert("cat") — reuses "ca"
    const afterCat = buildTrie(['car', 'cat'])
    markPath(afterCat, 'ca', 'path')
    markPath(afterCat, 'cat', 'path', 'new')
    steps.push({
      concept: {
        type: 'trie',
        nodes: afterCat,
        words: ['car', 'cat'],
        probe: 'cat',
        matched: 3,
        operation: 'insert("cat")',
      },
      description: d(
        locale,
        'insert("cat"): "ca" already exists, so it is reused — only "t" is new. This sharing of prefixes is the whole idea.',
        'insert("cat"): "ca" ya existe, así que se reutiliza — solo "t" es nuevo. Compartir prefijos es toda la idea.',
      ),
      codeLine: 19,
      variables: { word: 'cat', created: 1, reused: 2 },
    })

    // insert("card") — extends an existing word
    const afterCard = buildTrie(['car', 'cat', 'card'])
    markPath(afterCard, 'car', 'path')
    markPath(afterCard, 'card', 'path', 'new')
    steps.push({
      concept: {
        type: 'trie',
        nodes: afterCard,
        words: ['car', 'cat', 'card'],
        probe: 'card',
        matched: 4,
        operation: 'insert("card")',
      },
      description: d(
        locale,
        'insert("card"): Extends "car" with one node. "car" keeps its end-of-word ring — a word can sit in the middle of another.',
        'insert("card"): Extiende "car" con un nodo. "car" conserva su anillo de fin de palabra — una palabra puede estar en medio de otra.',
      ),
      codeLine: 17,
      variables: { word: 'card', created: 1, reused: 3 },
    })

    // insert("do") — new branch off the root
    const afterDo = buildTrie(['car', 'cat', 'card', 'do'])
    markPath(afterDo, 'do', 'new')
    steps.push({
      concept: {
        type: 'trie',
        nodes: afterDo,
        words: ['car', 'cat', 'card', 'do'],
        probe: 'do',
        matched: 2,
        operation: 'insert("do")',
      },
      description: d(
        locale,
        'insert("do"): Nothing in common with the "c" branch, so a second branch grows from the root.',
        'insert("do"): No comparte nada con la rama "c", así que crece una segunda rama desde la raíz.',
      ),
      codeLine: 17,
      variables: { word: 'do', created: 2, reused: 0 },
    })

    // insert("dog")
    const allWords = ['car', 'cat', 'card', 'do', 'dog']
    const afterDog = buildTrie(allWords)
    markPath(afterDog, 'do', 'path')
    markPath(afterDog, 'dog', 'path', 'new')
    steps.push({
      concept: {
        type: 'trie',
        nodes: afterDog,
        words: allWords,
        probe: 'dog',
        matched: 3,
        operation: 'insert("dog")',
      },
      description: d(
        locale,
        'insert("dog"): Reuses "do" and adds "g". Five words, but only 8 nodes — prefixes are stored once.',
        'insert("dog"): Reutiliza "do" y añade "g". Cinco palabras, pero solo 8 nodos — los prefijos se guardan una vez.',
      ),
      codeLine: 21,
      variables: { word: 'dog', words: 5, nodes: 8 },
    })

    // search("cat") — walking
    const walking = buildTrie(allWords)
    markPath(walking, 'ca', 'path', 'current')
    steps.push({
      concept: {
        type: 'trie',
        nodes: walking,
        words: allWords,
        probe: 'cat',
        matched: 2,
        operation: 'search("cat")',
      },
      description: d(
        locale,
        'search("cat"): Walk one character at a time — "c", then "a". No comparison against other words is ever needed.',
        'search("cat"): Recorrer un carácter cada vez — "c", luego "a". Nunca hace falta comparar con las demás palabras.',
      ),
      codeLine: 27,
      variables: { prefix: 'ca', depth: 2, remaining: 't' },
    })

    // search("cat") — found
    const foundCat = buildTrie(allWords)
    markPath(foundCat, 'cat', 'path', 'found')
    steps.push({
      concept: {
        type: 'trie',
        nodes: foundCat,
        words: allWords,
        probe: 'cat',
        matched: 3,
        operation: 'search("cat") → true',
      },
      description: d(
        locale,
        'search("cat"): Reached the node AND isEnd is true → the word exists. O(L), independent of how many words are stored.',
        'search("cat"): Se llega al nodo Y isEnd es true → la palabra existe. O(L), independiente de cuántas palabras haya guardadas.',
      ),
      codeLine: 35,
      variables: { word: 'cat', isEnd: true, result: true },
    })

    // search("ca") — node exists but isn't a word
    const notAWord = buildTrie(allWords)
    markPath(notAWord, 'ca', 'path', 'missing')
    steps.push({
      concept: {
        type: 'trie',
        nodes: notAWord,
        words: allWords,
        probe: 'ca',
        matched: 2,
        operation: 'search("ca") → false',
      },
      description: d(
        locale,
        'search("ca"): The node exists, but isEnd is false — "ca" is only a path, never inserted as a word. That flag is what separates the two.',
        'search("ca"): El nodo existe, pero isEnd es false — "ca" es solo un camino, nunca se insertó como palabra. Ese flag es lo que distingue ambos casos.',
      ),
      codeLine: 35,
      variables: { word: 'ca', nodeExists: true, isEnd: false, result: false },
    })

    // startsWith("ca") — the autocomplete payoff
    const prefixMatch = buildTrie(allWords)
    const caId = markPath(prefixMatch, 'ca', 'path')
    if (caId != null) markSubtree(prefixMatch, caId, 'subtree')
    markPath(prefixMatch, 'c', 'path')
    steps.push({
      concept: {
        type: 'trie',
        nodes: prefixMatch,
        words: allWords,
        probe: 'ca',
        matched: 2,
        suggestions: ['car', 'card', 'cat'],
        operation: 'wordsWithPrefix("ca")',
      },
      description: d(
        locale,
        'This is what a hash table cannot do: walk 2 nodes down and the whole subtree below is every word starting with "ca". Autocomplete in O(L + results).',
        'Esto es lo que una tabla hash no puede hacer: bajar 2 nodos y todo el subárbol de debajo son las palabras que empiezan por "ca". Autocompletado en O(L + resultados).',
      ),
      codeLine: 50,
      variables: { prefix: 'ca', matches: 3, results: 'car, card, cat' },
    })

    // search("cow") — early exit
    const missing = buildTrie(allWords)
    markPath(missing, 'c', 'path', 'missing')
    steps.push({
      concept: {
        type: 'trie',
        nodes: missing,
        words: allWords,
        probe: 'cow',
        matched: 1,
        operation: 'search("cow") → false',
      },
      description: d(
        locale,
        'search("cow"): "c" matches, but there is no "o" child → return null immediately. Misses cost only as much as the shared prefix.',
        'search("cow"): "c" coincide, pero no hay hijo "o" → devolver null de inmediato. Los fallos cuestan solo lo que dure el prefijo común.',
      ),
      codeLine: 28,
      variables: { word: 'cow', matchedChars: 1, result: false },
    })

    return steps
  },
}

// ════════════════════════════════════════════════════════════════
//  LRU CACHE
// ════════════════════════════════════════════════════════════════

function lru(entries: [string, number, LruEntry['state']][]): LruEntry[] {
  return entries.map(([key, value, state]) => ({ key, value, state }))
}

export const lruCache: Algorithm = {
  id: 'lru-cache',
  name: 'LRU Cache',
  category: 'Data Structures',
  difficulty: 'advanced',
  visualization: 'concept',
  code: `class Node {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    // sentinels: head side = MRU, tail = LRU
    this.head = new Node(null, null);
    this.tail = new Node(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  addToFront(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  get(key) {
    const node = this.map.get(key);
    if (!node) return -1;
    this.remove(node);
    this.addToFront(node);
    return node.value;
  }

  put(key, value) {
    const existing = this.map.get(key);
    if (existing) {
      existing.value = value;
      this.remove(existing);
      this.addToFront(existing);
      return;
    }
    const node = new Node(key, value);
    this.map.set(key, node);
    this.addToFront(node);
    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this.remove(lru);
      this.map.delete(lru.key);
    }
  }
}`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const CAPACITY = 3

    steps.push({
      concept: { type: 'lruCache', capacity: CAPACITY, entries: [] },
      description: d(
        locale,
        'An empty LRU cache with capacity 3. Two structures work together: a hash map for O(1) access and a doubly linked list for recency order.',
        'Una caché LRU vacía con capacidad 3. Dos estructuras trabajan juntas: un hash map para acceso O(1) y una lista doblemente enlazada para el orden de uso.',
      ),
      codeLine: 11,
      variables: { capacity: CAPACITY, size: 0 },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([['A', 1, 'new']]),
        operation: 'put("A", 1)',
      },
      description: d(
        locale,
        'put("A", 1): A new node goes at the front of the list, and the map stores a pointer to it. Both structures are updated together.',
        'put("A", 1): Un nodo nuevo va al frente de la lista, y el map guarda un puntero a él. Ambas estructuras se actualizan a la vez.',
      ),
      codeLine: 51,
      variables: { key: 'A', value: 1, size: 1 },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['B', 2, 'new'],
          ['A', 1, 'normal'],
        ]),
        operation: 'put("B", 2)',
      },
      description: d(
        locale,
        'put("B", 2): Also inserted at the front. "A" slides toward the tail — it is now the older of the two.',
        'put("B", 2): También se inserta al frente. "A" se desplaza hacia la cola — ahora es el más antiguo de los dos.',
      ),
      codeLine: 51,
      variables: { key: 'B', value: 2, size: 2 },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['C', 3, 'new'],
          ['B', 2, 'normal'],
          ['A', 1, 'normal'],
        ]),
        operation: 'put("C", 3)',
      },
      description: d(
        locale,
        'put("C", 3): The cache is now full (3/3). "A" sits at the tail, so it is the next candidate for eviction.',
        'put("C", 3): La caché está llena (3/3). "A" está en la cola, así que es el siguiente candidato a ser desalojado.',
      ),
      codeLine: 51,
      variables: { key: 'C', value: 3, size: 3, full: true },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['C', 3, 'normal'],
          ['B', 2, 'normal'],
          ['A', 1, 'hit'],
        ]),
        lookupKey: 'A',
        operation: 'get("A")',
      },
      description: d(
        locale,
        'get("A"): The map jumps straight to the node in O(1) — no walking the list. But the node is still sitting at the tail.',
        'get("A"): El map salta directamente al nodo en O(1) — sin recorrer la lista. Pero el nodo sigue estando en la cola.',
      ),
      codeLine: 34,
      variables: { key: 'A', hit: true, value: 1 },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['A', 1, 'moving'],
          ['C', 3, 'normal'],
          ['B', 2, 'normal'],
        ]),
        lookupKey: 'A',
        operation: 'get("A") → 1',
      },
      description: d(
        locale,
        'Unlink "A" and re-insert it at the front. This is why the list is doubly linked: with a prev pointer, removing a middle node is O(1).',
        'Desenlazar "A" y reinsertarlo al frente. Por esto la lista es doblemente enlazada: con el puntero prev, sacar un nodo del medio es O(1).',
      ),
      codeLine: 37,
      variables: { key: 'A', movedTo: 'front', lru: 'B' },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['A', 1, 'normal'],
          ['C', 3, 'normal'],
          ['B', 2, 'evicting'],
        ]),
        operation: 'put("D", 4) — full!',
      },
      description: d(
        locale,
        'put("D", 4): The cache is full, so someone must go. The victim is always tail.prev — "B", the least recently used.',
        'put("D", 4): La caché está llena, así que alguien tiene que salir. La víctima siempre es tail.prev — "B", el menos usado recientemente.',
      ),
      codeLine: 53,
      variables: { key: 'D', size: 3, victim: 'B' },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['D', 4, 'new'],
          ['A', 1, 'normal'],
          ['C', 3, 'normal'],
        ]),
        evictedKey: 'B',
        operation: 'put("D", 4) → evicted "B"',
      },
      description: d(
        locale,
        '"B" is removed from the list AND from the map. Deleting the map entry needs its key — which is exactly why every node stores its own key.',
        '"B" se elimina de la lista Y del map. Borrar la entrada del map requiere su clave — justo por eso cada nodo guarda su propia key.',
      ),
      codeLine: 55,
      variables: { evicted: 'B', size: 3 },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['D', 4, 'normal'],
          ['A', 1, 'normal'],
          ['C', 3, 'normal'],
        ]),
        lookupKey: 'B',
        miss: true,
        operation: 'get("B") → -1',
      },
      description: d(
        locale,
        'get("B"): Not in the map any more — a miss. The list is untouched, since nothing was used.',
        'get("B"): Ya no está en el map — un fallo. La lista no se toca, porque no se usó nada.',
      ),
      codeLine: 35,
      variables: { key: 'B', hit: false, result: -1 },
    })

    steps.push({
      concept: {
        type: 'lruCache',
        capacity: CAPACITY,
        entries: lru([
          ['C', 30, 'updated'],
          ['D', 4, 'normal'],
          ['A', 1, 'normal'],
        ]),
        lookupKey: 'C',
        operation: 'put("C", 30)',
      },
      description: d(
        locale,
        'put("C", 30): The key already exists, so nothing is evicted — just update the value and move the node to the front. "A" is now the LRU.',
        'put("C", 30): La clave ya existe, así que no se desaloja nada — solo actualizar el valor y mover el nodo al frente. Ahora "A" es el LRU.',
      ),
      codeLine: 46,
      variables: { key: 'C', value: 30, size: 3, lru: 'A' },
    })

    return steps
  },
}
