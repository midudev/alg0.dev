import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const dataStructuresCpp: Record<string, CodeImplementation> = {
  stack: annotated(`template<typename T>
class Stack {  //@1
    vector<T> items;

public:
    void push(T item) {  //@4
        items.push_back(item);
    }

    T pop() {  //@8
        T value = items.back();
        items.pop_back();
        return value;
    }

    T peek() {  //@11
        return items.back();
    }

    bool isEmpty() {
        return items.empty();
    }

    int size() {
        return items.size();
    }
};`),

  queue: annotated(`template<typename T>
class Queue {  //@1
    vector<T> items;

public:
    void enqueue(T item) {  //@4
        items.push_back(item);
    }

    T dequeue() {  //@8
        T value = items.front();
        items.erase(items.begin());
        return value;
    }

    T front() {  //@12
        return items.front();
    }

    bool isEmpty() {
        return items.empty();
    }

    int size() {
        return items.size();
    }
};`),

  'linked-list': annotated(`struct Node {
    int value;
    Node* next;
    Node(int value) : value(value), next(nullptr) {}
};

class LinkedList {  //@8
    Node* head = nullptr;
    Node* tail = nullptr;

public:
    void append(int value) {
        Node* node = new Node(value);
        if (!head) {
            head = tail = node;  //@17
        } else {
            tail->next = node;  //@19
            tail = node;
        }
    }

    void prepend(int value) {  //@24
        Node* node = new Node(value);
        node->next = head;
        head = node;
        if (!tail) {
            tail = node;
        }
    }

    Node* search(int value) {  //@31
        Node* current = head;  //@32
        while (current) {  //@33
            if (current->value == value) {
                return current;
            }
            current = current->next;
        }
        return nullptr;
    }

    void deleteValue(int value) {
        if (!head) return;
        if (head->value == value) {  //@42
            Node* old = head;
            head = head->next;  //@43
            delete old;
            if (!head) tail = nullptr;
            return;
        }
        Node* current = head;
        while (current->next) {
            if (current->next->value == value) {
                Node* old = current->next;
                if (old == tail) {
                    tail = current;
                }
                current->next = old->next;
                delete old;
                return;
            }
            current = current->next;
        }
    }
};`),

  'hash-table': annotated(`class HashTable {  //@1
    vector<vector<pair<string, int>>> buckets;

public:
    HashTable(int size = 7) : buckets(size) {}

    int hash(const string& key) {
        int h = 0;
        for (char ch : key) {
            h = (h + ch) % buckets.size();
        }
        return h;
    }

    void set(const string& key, int value) {
        int idx = hash(key);  //@15
        auto& bucket = buckets[idx];
        for (auto& entry : bucket) {
            if (entry.first == key) {
                entry.second = value;
                return;
            }
        }
        bucket.push_back({key, value});  //@20
    }

    optional<int> get(const string& key) {
        int idx = hash(key);  //@23
        for (auto& entry : buckets[idx]) {  //@25
            if (entry.first == key) {
                return entry.second;
            }
        }
        return nullopt;
    }

    void remove(const string& key) {
        int idx = hash(key);
        auto& bucket = buckets[idx];
        bucket.erase(
            remove_if(bucket.begin(), bucket.end(),
                [&](auto& e) { return e.first == key; }),
            bucket.end()
        );
    }
};`),

  'binary-search-tree': annotated(`struct BSTNode {
    int value;
    BSTNode* left = nullptr;
    BSTNode* right = nullptr;
    BSTNode(int value) : value(value) {}
};

class BST {  //@9
    BSTNode* root = nullptr;

public:
    void insert(int value) {
        BSTNode* node = new BSTNode(value);
        if (!root) {  //@14
            root = node;
            return;
        }
        BSTNode* current = root;
        while (true) {
            if (value < current->value) {  //@17
                if (!current->left) {
                    current->left = node;
                    return;
                }
                current = current->left;
            } else {  //@22
                if (!current->right) {
                    current->right = node;
                    return;
                }
                current = current->right;
            }
        }
    }

    BSTNode* search(int value) {
        BSTNode* current = root;
        while (current) {  //@33
            if (value == current->value) {  //@34
                return current;
            }
            current = value < current->value  //@35
                ? current->left
                : current->right;
        }
        return nullptr;
    }
};`),

  heap: annotated(`class MinHeap {  //@1
    vector<int> heap;

public:
    void insert(int value) {  //@4
        heap.push_back(value);  //@5
        bubbleUp(heap.size() - 1);
    }

    void bubbleUp(int i) {
        while (i > 0) {
            int parent = (i - 1) / 2;  //@11
            if (heap[parent] <= heap[i]) break;
            swap(heap[parent], heap[i]);  //@13
            i = parent;
        }
    }

    int extractMin() {
        int minimum = heap[0];
        int last = heap.back();
        heap.pop_back();
        if (!heap.empty()) {
            heap[0] = last;
            bubbleDown(0);
        }
        return minimum;
    }

    void bubbleDown(int i) {  //@29
        while (2 * i + 1 < (int)heap.size()) {
            int smallest = 2 * i + 1;
            int right = smallest + 1;
            if (right < (int)heap.size() &&
                    heap[right] < heap[smallest]) {
                smallest = right;
            }
            if (heap[i] <= heap[smallest]) break;
            swap(heap[i], heap[smallest]);  //@37
            i = smallest;
        }
    }
};`),
}
