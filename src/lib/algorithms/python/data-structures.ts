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
}
