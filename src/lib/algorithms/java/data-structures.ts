import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const dataStructuresJava: Record<string, CodeImplementation> = {
  stack: annotated(`class Stack<T> {  //@1
    private List<T> items = new ArrayList<>();

    void push(T item) {  //@4
        items.add(item);
    }

    T pop() {  //@8
        return items.remove(items.size() - 1);
    }

    T peek() {  //@11
        return items.get(items.size() - 1);
    }

    boolean isEmpty() {
        return items.isEmpty();
    }

    int size() {
        return items.size();
    }
}`),

  queue: annotated(`class Queue<T> {  //@1
    private List<T> items = new ArrayList<>();

    void enqueue(T item) {  //@4
        items.add(item);
    }

    T dequeue() {  //@8
        return items.remove(0);
    }

    T front() {  //@12
        return items.get(0);
    }

    boolean isEmpty() {
        return items.isEmpty();
    }

    int size() {
        return items.size();
    }
}`),

  'linked-list': annotated(`class Node {
    int value;
    Node next;

    Node(int value) {
        this.value = value;
    }
}

class LinkedList {  //@8
    Node head;
    Node tail;

    void append(int value) {
        Node node = new Node(value);
        if (head == null) {
            head = tail = node;  //@17
        } else {
            tail.next = node;  //@19
            tail = node;
        }
    }

    void prepend(int value) {  //@24
        Node node = new Node(value);
        node.next = head;
        head = node;
        if (tail == null) {
            tail = node;
        }
    }

    Node search(int value) {  //@31
        Node current = head;  //@32
        while (current != null) {  //@33
            if (current.value == value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    void delete(int value) {
        if (head == null) return;
        if (head.value == value) {  //@42
            head = head.next;  //@43
            if (head == null) tail = null;
            return;
        }
        Node current = head;
        while (current.next != null) {
            if (current.next.value == value) {
                if (current.next == tail) {
                    tail = current;
                }
                current.next = current.next.next;
                return;
            }
            current = current.next;
        }
    }
}`),

  'hash-table': annotated(`class HashTable {  //@1
    private List<Entry>[] buckets;

    @SuppressWarnings("unchecked")
    HashTable(int size) {
        buckets = new List[size];
        for (int i = 0; i < size; i++) {
            buckets[i] = new ArrayList<>();
        }
    }

    int hash(String key) {
        int h = 0;
        for (char ch : key.toCharArray()) {
            h = (h + ch) % buckets.length;
        }
        return h;
    }

    void set(String key, int value) {
        int idx = hash(key);  //@15
        List<Entry> bucket = buckets[idx];
        for (Entry entry : bucket) {
            if (entry.key.equals(key)) {
                entry.value = value;
                return;
            }
        }
        bucket.add(new Entry(key, value));  //@20
    }

    Integer get(String key) {
        int idx = hash(key);  //@23
        for (Entry entry : buckets[idx]) {  //@25
            if (entry.key.equals(key)) {
                return entry.value;
            }
        }
        return null;
    }

    void delete(String key) {
        int idx = hash(key);
        List<Entry> bucket = buckets[idx];
        bucket.removeIf(entry -> entry.key.equals(key));
    }

    static class Entry {
        String key;
        int value;
        Entry(String key, int value) {
            this.key = key;
            this.value = value;
        }
    }
}`),

  'binary-search-tree': annotated(`class BSTNode {
    int value;
    BSTNode left, right;

    BSTNode(int value) {
        this.value = value;
    }
}

class BST {  //@9
    BSTNode root;

    void insert(int value) {
        BSTNode node = new BSTNode(value);
        if (root == null) {  //@14
            root = node;
            return;
        }
        BSTNode current = root;
        while (true) {
            if (value < current.value) {  //@17
                if (current.left == null) {
                    current.left = node;
                    return;
                }
                current = current.left;
            } else {  //@22
                if (current.right == null) {
                    current.right = node;
                    return;
                }
                current = current.right;
            }
        }
    }

    BSTNode search(int value) {
        BSTNode current = root;
        while (current != null) {  //@33
            if (value == current.value) {  //@34
                return current;
            }
            current = value < current.value  //@35
                ? current.left
                : current.right;
        }
        return null;
    }
}`),

  heap: annotated(`class MinHeap {  //@1
    private List<Integer> heap = new ArrayList<>();

    void insert(int value) {  //@4
        heap.add(value);  //@5
        bubbleUp(heap.size() - 1);
    }

    void bubbleUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;  //@11
            if (heap.get(parent) <= heap.get(i)) break;
            Collections.swap(heap, parent, i);  //@13
            i = parent;
        }
    }

    int extractMin() {
        int minimum = heap.get(0);
        int last = heap.remove(heap.size() - 1);
        if (!heap.isEmpty()) {
            heap.set(0, last);
            bubbleDown(0);
        }
        return minimum;
    }

    void bubbleDown(int i) {  //@29
        while (2 * i + 1 < heap.size()) {
            int smallest = 2 * i + 1;
            int right = smallest + 1;
            if (right < heap.size() &&
                    heap.get(right) < heap.get(smallest)) {
                smallest = right;
            }
            if (heap.get(i) <= heap.get(smallest)) break;
            Collections.swap(heap, i, smallest);  //@37
            i = smallest;
        }
    }
}`),
}
