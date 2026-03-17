import type {
  Algorithm,
  Step,
  LinkedListNodeData,
  HashEntry,
  TreeNodeData,
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
      return;
    }
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        return;
      }
      current = current.next;
    }
  }
}`,
  codeSamples: [
    {
      language: 'cpp',
      code: `struct Node {
  int value;
  Node* next;
  explicit Node(int v) : value(v), next(nullptr) {}
};

class LinkedList {
 public:
  void append(int value) {
    Node* node = new Node(value);
    if (!head) {
      head = tail = node;
    } else {
      tail->next = node;
      tail = node;
    }
  }

  void prepend(int value) {
    Node* node = new Node(value);
    node->next = head;
    head = node;
    if (!tail) tail = node;
  }

  Node* search(int value) const {
    Node* current = head;
    while (current) {
      if (current->value == value) return current;
      current = current->next;
    }
    return nullptr;
  }

  void remove(int value) {
    if (!head) return;
    if (head->value == value) {
      Node* next = head->next;
      delete head;
      head = next;
      if (!head) tail = nullptr;
      return;
    }
    Node* current = head;
    while (current->next) {
      if (current->next->value == value) {
        Node* victim = current->next;
        current->next = victim->next;
        if (victim == tail) tail = current;
        delete victim;
        return;
      }
      current = current->next;
    }
  }

 private:
  Node* head = nullptr;
  Node* tail = nullptr;
};`,
    },
    {
      language: 'java',
      code: `class LinkedList {
  static class Node {
    int value;
    Node next;
    Node(int value) { this.value = value; }
  }

  private Node head;
  private Node tail;

  void append(int value) {
    Node node = new Node(value);
    if (head == null) {
      head = tail = node;
    } else {
      tail.next = node;
      tail = node;
    }
  }

  void prepend(int value) {
    Node node = new Node(value);
    node.next = head;
    head = node;
    if (tail == null) tail = node;
  }

  Node search(int value) {
    Node current = head;
    while (current != null) {
      if (current.value == value) return current;
      current = current.next;
    }
    return null;
  }

  void deleteValue(int value) {
    if (head == null) return;
    if (head.value == value) {
      head = head.next;
      if (head == null) tail = null;
      return;
    }
    Node current = head;
    while (current.next != null) {
      if (current.next.value == value) {
        current.next = current.next.next;
        if (current.next == null) tail = current;
        return;
      }
      current = current.next;
    }
  }
}`,
    },
  ],
  description: `Linked List

A Linked List is a linear data structure where each element (node) contains a value and a pointer (reference) to the next node.

Unlike arrays, linked lists don't store elements in contiguous memory — each node can be anywhere in memory, connected by pointers.

Operations:
  - append: add node at the end — O(1) with tail pointer
  - prepend: add node at the beginning — O(1)
  - search: traverse to find a value — O(n)
  - delete: remove a node by value — O(n)
  - access by index: traverse from head — O(n)

Advantages:
  - O(1) insertion/deletion at known positions
  - Dynamic size, no wasted memory
  - Efficient insertion at head

Disadvantages:
  - O(n) access by index (no random access)
  - Extra memory for pointers
  - Not cache-friendly`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'linkedList', nodes: [] },
      description: d(locale,
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
      description: d(locale,
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
      description: d(locale,
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
      description: d(locale,
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
      description: d(locale,
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
      description: d(locale,
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
      description: d(locale,
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
      description: d(locale,
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
      description: d(locale,
        'delete(20): Found node 20. Set previous node\'s .next to skip it (10.next = 30).',
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
      description: d(locale,
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
  description: `Hash Table

A Hash Table (or Hash Map) maps keys to values using a hash function. It provides near-constant time O(1) for insert, lookup, and delete.

How it works:
1. A hash function converts the key into an array index
2. The value is stored at that index (bucket)
3. If two keys hash to the same index → collision

Collision handling (chaining):
  - Each bucket stores a list of entries
  - Multiple keys can share the same bucket

Time Complexity:
  - Average: O(1) for set, get, delete
  - Worst case: O(n) when all keys collide

Space Complexity: O(n)

Applications:
  - Caches, databases, symbol tables
  - Counting frequencies
  - Deduplication`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []
    const SIZE = 7

    steps.push({
      concept: { type: 'hashTable', buckets: makeBuckets(SIZE, []), size: SIZE },
      description: d(locale,
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
      description: d(locale,
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
        buckets: makeBuckets(SIZE, [['cat', 3, 'normal'], ['dog', 5, 'new']]),
        size: SIZE,
        hashingKey: 'dog',
        hashResult: dogH,
        operation: 'set("dog", 5)',
      },
      description: d(locale,
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
        buckets: makeBuckets(SIZE, [['cat', 3, 'normal'], ['dog', 5, 'normal'], ['ant', 1, 'new']]),
        size: SIZE,
        hashingKey: 'ant',
        hashResult: antH,
        operation: 'set("ant", 1)',
      },
      description: d(locale,
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
          ['cat', 3, 'normal'], ['dog', 5, 'collision'], ['ant', 1, 'normal'], ['fish', 8, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'fish',
        hashResult: fishH,
        operation: 'set("fish", 8) — COLLISION!',
      },
      description: d(locale,
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
          ['cat', 3, 'normal'], ['dog', 5, 'normal'], ['ant', 1, 'normal'],
          ['fish', 8, 'collision'], ['bee', 2, 'new'],
        ]),
        size: SIZE,
        hashingKey: 'bee',
        hashResult: beeH,
        operation: 'set("bee", 2) — COLLISION!',
      },
      description: d(locale,
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
          ['cat', 3, 'found'], ['dog', 5, 'normal'], ['ant', 1, 'normal'],
          ['fish', 8, 'normal'], ['bee', 2, 'normal'],
        ]),
        size: SIZE,
        hashingKey: 'cat',
        hashResult: catH,
        operation: 'get("cat") → 3',
      },
      description: d(locale,
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
          ['cat', 3, 'normal'], ['dog', 5, 'normal'], ['ant', 1, 'normal'],
          ['fish', 8, 'found'], ['bee', 2, 'normal'],
        ]),
        size: SIZE,
        hashingKey: 'fish',
        hashResult: fishH,
        operation: 'get("fish") → 8',
      },
      description: d(locale,
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
  codeSamples: [
    {
      language: 'cpp',
      code: `struct Node {
  int value;
  Node* left;
  Node* right;
  explicit Node(int v) : value(v), left(nullptr), right(nullptr) {}
};

class BST {
 public:
  void insert(int value) {
    if (!root) {
      root = new Node(value);
      return;
    }
    Node* current = root;
    while (true) {
      if (value < current->value) {
        if (!current->left) {
          current->left = new Node(value);
          return;
        }
        current = current->left;
      } else {
        if (!current->right) {
          current->right = new Node(value);
          return;
        }
        current = current->right;
      }
    }
  }

  Node* search(int value) const {
    Node* current = root;
    while (current) {
      if (value == current->value) return current;
      current = value < current->value ? current->left : current->right;
    }
    return nullptr;
  }

 private:
  Node* root = nullptr;
};`,
    },
    {
      language: 'java',
      code: `class BinarySearchTree {
  static class Node {
    int value;
    Node left, right;
    Node(int value) { this.value = value; }
  }

  private Node root;

  void insert(int value) {
    if (root == null) {
      root = new Node(value);
      return;
    }
    Node current = root;
    while (true) {
      if (value < current.value) {
        if (current.left == null) {
          current.left = new Node(value);
          return;
        }
        current = current.left;
      } else {
        if (current.right == null) {
          current.right = new Node(value);
          return;
        }
        current = current.right;
      }
    }
  }

  Node search(int value) {
    Node current = root;
    while (current != null) {
      if (value == current.value) return current;
      current = value < current.value ? current.left : current.right;
    }
    return null;
  }
}`,
    },
  ],
  description: `Binary Search Tree (BST)

A BST is a tree where each node has at most two children, and for every node:
  - Left subtree contains only values less than the node
  - Right subtree contains only values greater than the node

This ordering property enables efficient search by halving the search space at each step.

Operations:
  - insert: compare and go left/right — O(h)
  - search: compare and go left/right — O(h)
  - delete: find and restructure — O(h)

Where h = height of the tree:
  - Balanced tree: h = O(log n) → efficient!
  - Degenerate (all one side): h = O(n) → like a linked list

Applications:
  - Ordered data storage
  - Range queries
  - Priority queues (with balancing)`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'binaryTree', nodes: [], treeType: 'bst' },
      description: d(locale,
        'An empty BST. The first inserted value becomes the root.',
        'Un BST vacío. El primer valor insertado se convierte en la raíz.',
      ),
      codeLine: 9,
      variables: { root: null },
    })

    // Insert 8 (root)
    steps.push({
      concept: { type: 'binaryTree', nodes: makeTree([[8, 'new']]), treeType: 'bst', operation: 'insert(8)' },
      description: d(locale,
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
        nodes: makeTree([[8, 'comparing'], [3, 'new']]),
        treeType: 'bst',
        operation: 'insert(3)',
      },
      description: d(locale,
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
        nodes: makeTree([[8, 'comparing'], [3, 'normal'], [10, 'new']]),
        treeType: 'bst',
        operation: 'insert(10)',
      },
      description: d(locale,
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
        nodes: makeTree([[8, 'normal'], [3, 'comparing'], [10, 'normal'], [1, 'new']]),
        treeType: 'bst',
        operation: 'insert(1)',
      },
      description: d(locale,
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
        nodes: makeTree([[8, 'normal'], [3, 'comparing'], [10, 'normal'], [1, 'normal'], [6, 'new']]),
        treeType: 'bst',
        operation: 'insert(6)',
      },
      description: d(locale,
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
          [8, 'normal'], [3, 'normal'], [10, 'comparing'],
          [1, 'normal'], [6, 'normal'], [14, 'new'],
        ]),
        treeType: 'bst',
        operation: 'insert(14)',
      },
      description: d(locale,
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
          [8, 'current'], [3, 'normal'], [10, 'normal'],
          [1, 'normal'], [6, 'normal'], [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6): at root 8',
      },
      description: d(locale,
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
          [8, 'normal'], [3, 'current'], [10, 'normal'],
          [1, 'normal'], [6, 'normal'], [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6): at node 3',
      },
      description: d(locale,
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
          [8, 'normal'], [3, 'normal'], [10, 'normal'],
          [1, 'normal'], [6, 'found'], [14, 'normal'],
        ]),
        treeType: 'bst',
        operation: 'search(6) → found!',
      },
      description: d(locale,
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

function heapNodes(values: number[], highlights: Record<number, TreeNodeData['state']> = {}): (TreeNodeData | null)[] {
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
  description: `Heap (Min Heap)

A Heap is a complete binary tree where every parent is smaller (min-heap) or larger (max-heap) than its children. It's stored as an array.

Array-to-tree mapping (0-indexed):
  - Parent of i: Math.floor((i - 1) / 2)
  - Left child of i: 2 * i + 1
  - Right child of i: 2 * i + 2

Operations:
  - insert: add at end, bubble up — O(log n)
  - extractMin: remove root, bubble down — O(log n)
  - peek: return root — O(1)

The heap property is maintained by:
  - bubbleUp: swap with parent while smaller
  - bubbleDown: swap with smallest child while larger

Applications:
  - Priority queues
  - Heap Sort
  - Dijkstra's algorithm
  - Finding k-th smallest/largest`,

  generateSteps(locale = 'en') {
    const steps: Step[] = []

    steps.push({
      concept: { type: 'binaryTree', nodes: [], treeType: 'heap', heapType: 'min' },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(8)',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(5): bubble up?',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(5): swapped!',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(10)',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(1): bubble up...',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(1): keep bubbling...',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(1): done!',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'insert(7)',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'extractMin(): removed 1, bubble down...',
      },
      description: d(locale,
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
        treeType: 'heap', heapType: 'min',
        operation: 'extractMin(): done!',
      },
      description: d(locale,
        'Swapped 7 and 5 (smallest child). Heap property restored! New min is 5.',
        'Intercambiados 7 y 5 (hijo más pequeño). ¡Propiedad del heap restaurada! Nuevo mínimo es 5.',
      ),
      codeLine: 37,
      variables: { heap: '[5, 7, 10, 8]', min: 5 },
    })

    return steps
  },
}
