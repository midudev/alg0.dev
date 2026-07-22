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

  trie: annotated(`struct TrieNode {
    unordered_map<char, TrieNode*> children;
    bool isEnd = false;
};

class Trie {
    TrieNode* root = new TrieNode();  //@10

    void walk(TrieNode* node, string acc, vector<string>& out) {
        if (!node) return;
        if (node->isEnd) out.push_back(acc);
        for (auto& [c, child] : node->children) {
            walk(child, acc + c, out);
        }
    }

public:
    void insert(const string& word) {
        TrieNode* node = root;
        for (char c : word) {
            if (!node->children.count(c)) {
                node->children[c] = new TrieNode();  //@17
            }
            node = node->children[c];  //@19
        }
        node->isEnd = true;  //@21
    }

    TrieNode* traverse(const string& prefix) {
        TrieNode* node = root;
        for (char c : prefix) {
            auto it = node->children.find(c);  //@27
            if (it == node->children.end()) return nullptr;  //@28
            node = it->second;
        }
        return node;
    }

    bool search(const string& word) {
        TrieNode* node = traverse(word);
        return node != nullptr && node->isEnd;  //@35
    }

    bool startsWith(const string& prefix) {
        return traverse(prefix) != nullptr;  //@39
    }

    vector<string> wordsWithPrefix(const string& prefix) {
        vector<string> out;
        walk(traverse(prefix), prefix, out);  //@50
        return out;
    }
};`),

  'lru-cache': annotated(`struct Node {
    string key;  // needed to erase from the map on eviction
    int value;
    Node* prev = nullptr;
    Node* next = nullptr;
    Node(string k, int v) : key(move(k)), value(v) {}
};

class LRUCache {
    int capacity;
    unordered_map<string, Node*> map;
    // sentinels: head side = MRU, tail side = LRU
    Node* head = new Node("", 0);
    Node* tail = new Node("", 0);

    void remove(Node* node) {
        node->prev->next = node->next;
        node->next->prev = node->prev;
    }

    void addToFront(Node* node) {
        node->next = head->next;
        node->prev = head;
        head->next->prev = node;
        head->next = node;
    }

public:
    explicit LRUCache(int capacity) : capacity(capacity) {  //@11
        head->next = tail;
        tail->prev = head;
    }

    int get(const string& key) {
        auto it = map.find(key);  //@34
        if (it == map.end()) return -1;  //@35
        remove(it->second);
        addToFront(it->second);  //@37
        return it->second->value;
    }

    void put(const string& key, int value) {
        auto it = map.find(key);
        if (it != map.end()) {
            it->second->value = value;
            remove(it->second);
            addToFront(it->second);  //@46
            return;
        }
        Node* node = new Node(key, value);
        map[key] = node;
        addToFront(node);  //@51
        if ((int)map.size() > capacity) {
            Node* lru = tail->prev;  //@53
            remove(lru);
            map.erase(lru->key);  //@55
            delete lru;
        }
    }
};`),
}
