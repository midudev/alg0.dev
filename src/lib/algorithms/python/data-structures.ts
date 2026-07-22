import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const dataStructuresPython: Record<string, CodeImplementation> = {
  stack: annotated(`class Stack:  #@1
    def __init__(self):
        self.items = []

    def push(self, item):  #@4
        self.items.append(item)

    def pop(self):  #@8
        return self.items.pop()

    def peek(self):  #@11
        return self.items[-1]

    def is_empty(self):
        return len(self.items) == 0

    @property
    def size(self):
        return len(self.items)`),

  queue: annotated(`class Queue:  #@1
    def __init__(self):
        self.items = []

    def enqueue(self, item):  #@4
        self.items.append(item)

    def dequeue(self):  #@8
        return self.items.pop(0)

    def front(self):  #@12
        return self.items[0]

    def is_empty(self):
        return len(self.items) == 0

    @property
    def size(self):
        return len(self.items)`),

  'linked-list': annotated(`class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

class LinkedList:  #@8
    def __init__(self):
        self.head = None
        self.tail = None

    def append(self, value):
        node = Node(value)
        if not self.head:
            self.head = self.tail = node  #@17
        else:
            self.tail.next = node  #@19
            self.tail = node

    def prepend(self, value):  #@24
        node = Node(value)
        node.next = self.head
        self.head = node
        if not self.tail:
            self.tail = node

    def search(self, value):  #@31
        current = self.head  #@32
        while current:  #@33
            if current.value == value:
                return current
            current = current.next
        return None

    def delete(self, value):
        if not self.head:
            return
        if self.head.value == value:  #@42
            self.head = self.head.next  #@43
            if not self.head:
                self.tail = None
            return
        current = self.head
        while current.next:
            if current.next.value == value:
                if current.next is self.tail:
                    self.tail = current
                current.next = current.next.next
                return
            current = current.next`),

  'hash-table': annotated(`class HashTable:  #@1
    def __init__(self, size=7):
        self.buckets = [[] for _ in range(size)]

    def hash(self, key):
        h = 0
        for ch in key:
            h = (h + ord(ch)) % len(self.buckets)
        return h

    def set(self, key, value):
        idx = self.hash(key)  #@15
        bucket = self.buckets[idx]
        for entry in bucket:
            if entry['key'] == key:
                entry['value'] = value
                return
        bucket.append({'key': key, 'value': value})  #@20

    def get(self, key):
        idx = self.hash(key)  #@23
        for entry in self.buckets[idx]:  #@25
            if entry['key'] == key:
                return entry['value']
        return None

    def delete(self, key):
        idx = self.hash(key)
        bucket = self.buckets[idx]
        for i, entry in enumerate(bucket):
            if entry['key'] == key:
                del bucket[i]
                return`),

  'binary-search-tree': annotated(`class BSTNode:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

class BST:  #@9
    def __init__(self):
        self.root = None

    def insert(self, value):
        node = BSTNode(value)
        if not self.root:  #@14
            self.root = node
            return
        current = self.root
        while True:
            if value < current.value:  #@17
                if not current.left:
                    current.left = node
                    return
                current = current.left
            else:  #@22
                if not current.right:
                    current.right = node
                    return
                current = current.right

    def search(self, value):
        current = self.root
        while current:  #@33
            if value == current.value:  #@34
                return current
            current = (current.left if value < current.value  #@35
                       else current.right)
        return None`),

  heap: annotated(`class MinHeap:  #@1
    def __init__(self):
        self.heap = []

    def insert(self, value):  #@4
        self.heap.append(value)  #@5
        self.bubble_up(len(self.heap) - 1)

    def bubble_up(self, i):
        while i > 0:
            parent = (i - 1) // 2  #@11
            if self.heap[parent] <= self.heap[i]:
                break
            self.heap[parent], self.heap[i] = (  #@13
                self.heap[i], self.heap[parent])
            i = parent

    def extract_min(self):
        minimum = self.heap[0]
        last = self.heap.pop()
        if len(self.heap) > 0:
            self.heap[0] = last
            self.bubble_down(0)
        return minimum

    def bubble_down(self, i):  #@29
        while 2 * i + 1 < len(self.heap):
            smallest = 2 * i + 1
            right = smallest + 1
            if (right < len(self.heap) and
                    self.heap[right] < self.heap[smallest]):
                smallest = right
            if self.heap[i] <= self.heap[smallest]:
                break
            self.heap[i], self.heap[smallest] = (  #@37
                self.heap[smallest], self.heap[i])
            i = smallest`),

  trie: annotated(`class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()  #@10

    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()  #@17
            node = node.children[char]  #@19
        node.is_end = True  #@21

    def traverse(self, prefix):
        node = self.root
        for char in prefix:
            node = node.children.get(char)  #@27
            if node is None:
                return None  #@28
        return node

    def search(self, word):
        node = self.traverse(word)
        return node is not None and node.is_end  #@35

    def starts_with(self, prefix):
        return self.traverse(prefix) is not None  #@39

    def words_with_prefix(self, prefix):
        out = []

        def walk(node, acc):
            if node is None:
                return
            if node.is_end:
                out.append(acc)
            for char, child in node.children.items():
                walk(child, acc + char)

        walk(self.traverse(prefix), prefix)  #@50
        return out`),

  'lru-cache': annotated(`class Node:
    def __init__(self, key, value):
        self.key = key  # needed to delete from the map on eviction
        self.value = value
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity):  #@11
        self.capacity = capacity
        self.map = {}
        # sentinels: head side = MRU, tail side = LRU
        self.head = Node(None, None)
        self.tail = Node(None, None)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_front(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        node = self.map.get(key)  #@34
        if node is None:
            return -1  #@35
        self._remove(node)
        self._add_to_front(node)  #@37
        return node.value

    def put(self, key, value):
        existing = self.map.get(key)
        if existing is not None:
            existing.value = value
            self._remove(existing)
            self._add_to_front(existing)  #@46
            return
        node = Node(key, value)
        self.map[key] = node
        self._add_to_front(node)  #@51
        if len(self.map) > self.capacity:
            lru = self.tail.prev  #@53
            self._remove(lru)
            del self.map[lru.key]  #@55`),
}
