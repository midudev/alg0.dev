import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const dataStructuresRust: Record<string, CodeImplementation> = {
  stack: annotated(`struct Stack<T> {  //@1
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn new() -> Self {
        Stack { items: Vec::new() }
    }

    fn push(&mut self, item: T) {  //@4
        self.items.push(item);
    }

    fn pop(&mut self) -> Option<T> {  //@8
        self.items.pop()
    }

    fn peek(&self) -> Option<&T> {  //@11
        self.items.last()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    fn size(&self) -> usize {
        self.items.len()
    }
}`),

  queue: annotated(`struct Queue<T> {  //@1
    // VecDeque removes from the front in O(1),
    // unlike Vec::remove(0) which shifts everything.
    items: VecDeque<T>,
}

impl<T> Queue<T> {
    fn new() -> Self {
        Queue { items: VecDeque::new() }
    }

    fn enqueue(&mut self, item: T) {  //@4
        self.items.push_back(item);
    }

    fn dequeue(&mut self) -> Option<T> {  //@8
        self.items.pop_front()
    }

    fn front(&self) -> Option<&T> {  //@12
        self.items.front()
    }

    fn is_empty(&self) -> bool {
        self.items.is_empty()
    }

    fn size(&self) -> usize {
        self.items.len()
    }
}`),

  'linked-list': annotated(`struct Node {
    value: i32,
    // Each node owns the next one through the Box,
    // so None marks the end of the list.
    next: Option<Box<Node>>,
}

struct LinkedList {  //@8
    // No tail pointer: two owners of the same node would
    // require Rc<RefCell<Node>>, so we walk to the end.
    head: Option<Box<Node>>,
}

impl LinkedList {
    fn new() -> Self {
        LinkedList { head: None }
    }

    fn append(&mut self, value: i32) {
        let node = Box::new(Node { value, next: None });
        if self.head.is_none() {
            self.head = Some(node);  //@17
            return;
        }
        let mut current = self.head.as_mut().unwrap();
        while current.next.is_some() {
            current = current.next.as_mut().unwrap();
        }
        current.next = Some(node);  //@19
    }

    fn prepend(&mut self, value: i32) {  //@24
        // take() moves the old head out, leaving None behind
        let node = Box::new(Node {
            value,
            next: self.head.take(),
        });
        self.head = Some(node);
    }

    fn search(&self, value: i32) -> Option<&Node> {  //@31
        let mut current = self.head.as_deref();  //@32
        while let Some(node) = current {  //@33
            if node.value == value {
                return Some(node);
            }
            current = node.next.as_deref();
        }
        None
    }

    fn delete(&mut self, value: i32) {
        if self.head.is_none() {
            return;
        }
        if self.head.as_ref().unwrap().value == value {  //@42
            let old = self.head.take().unwrap();
            self.head = old.next;  //@43
            return;
        }
        let mut current = self.head.as_mut().unwrap();
        while current.next.is_some() {
            if current.next.as_ref().unwrap().value == value {
                // Unlink: current.next skips over the removed node
                let removed = current.next.take().unwrap();
                current.next = removed.next;
                return;
            }
            current = current.next.as_mut().unwrap();
        }
    }
}`),

  'hash-table': annotated(`struct HashTable {  //@1
    // Chaining: every bucket holds a list of (key, value)
    buckets: Vec<Vec<(String, i32)>>,
}

impl HashTable {
    fn new(size: usize) -> Self {
        HashTable { buckets: vec![Vec::new(); size] }
    }

    fn hash(&self, key: &str) -> usize {
        let mut h = 0;
        for ch in key.chars() {
            h = (h + ch as usize) % self.buckets.len();
        }
        h
    }

    fn set(&mut self, key: &str, value: i32) {
        let idx = self.hash(key);  //@15
        let bucket = &mut self.buckets[idx];
        for entry in bucket.iter_mut() {
            if entry.0 == key {
                entry.1 = value;
                return;
            }
        }
        bucket.push((key.to_string(), value));  //@20
    }

    fn get(&self, key: &str) -> Option<i32> {
        let idx = self.hash(key);  //@23
        for entry in &self.buckets[idx] {  //@25
            if entry.0 == key {
                return Some(entry.1);
            }
        }
        None
    }

    fn delete(&mut self, key: &str) {
        let idx = self.hash(key);
        // retain keeps every entry whose key does not match
        self.buckets[idx].retain(|entry| entry.0 != key);
    }
}`),

  'binary-search-tree': annotated(`struct BstNode {
    value: i32,
    left: Option<Box<BstNode>>,
    right: Option<Box<BstNode>>,
}

impl BstNode {
    fn new(value: i32) -> Self {
        BstNode { value, left: None, right: None }
    }
}

struct Bst {  //@9
    root: Option<Box<BstNode>>,
}

impl Bst {
    fn new() -> Self {
        Bst { root: None }
    }

    fn insert(&mut self, value: i32) {
        let node = Box::new(BstNode::new(value));
        if self.root.is_none() {  //@14
            self.root = Some(node);
            return;
        }
        // current walks down the tree as a mutable borrow
        let mut current = self.root.as_mut().unwrap();
        loop {
            if value < current.value {  //@17
                if current.left.is_none() {
                    current.left = Some(node);
                    return;
                }
                current = current.left.as_mut().unwrap();
            } else {  //@22
                if current.right.is_none() {
                    current.right = Some(node);
                    return;
                }
                current = current.right.as_mut().unwrap();
            }
        }
    }

    fn search(&self, value: i32) -> Option<&BstNode> {
        let mut current = self.root.as_deref();
        while let Some(node) = current {  //@33
            if value == node.value {  //@34
                return Some(node);
            }
            current = if value < node.value {  //@35
                node.left.as_deref()
            } else {
                node.right.as_deref()
            };
        }
        None
    }
}`),

  heap: annotated(`struct MinHeap {  //@1
    heap: Vec<i32>,
}

impl MinHeap {
    fn new() -> Self {
        MinHeap { heap: Vec::new() }
    }

    fn insert(&mut self, value: i32) {  //@4
        self.heap.push(value);  //@5
        self.bubble_up(self.heap.len() - 1);
    }

    fn bubble_up(&mut self, mut i: usize) {
        while i > 0 {
            let parent = (i - 1) / 2;  //@11
            if self.heap[parent] <= self.heap[i] {
                break;
            }
            self.heap.swap(parent, i);  //@13
            i = parent;
        }
    }

    fn extract_min(&mut self) -> Option<i32> {
        let minimum = *self.heap.first()?;
        let last = self.heap.pop().unwrap();
        if !self.heap.is_empty() {
            self.heap[0] = last;
            self.bubble_down(0);
        }
        Some(minimum)
    }

    fn bubble_down(&mut self, mut i: usize) {  //@29
        while 2 * i + 1 < self.heap.len() {
            let mut smallest = 2 * i + 1;
            let right = smallest + 1;
            if right < self.heap.len()
                && self.heap[right] < self.heap[smallest]
            {
                smallest = right;
            }
            if self.heap[i] <= self.heap[smallest] {
                break;
            }
            self.heap.swap(i, smallest);  //@37
            i = smallest;
        }
    }
}`),

  trie: annotated(`#[derive(Default)]
struct TrieNode {
    children: HashMap<char, TrieNode>,
    is_end: bool,
}

struct Trie {
    // A trie is a tree, never a graph: every node has exactly
    // one owner, so plain ownership works — no Rc/RefCell.
    root: TrieNode,
}

impl Trie {
    fn new() -> Self {
        Trie { root: TrieNode::default() }  //@10
    }

    fn insert(&mut self, word: &str) {
        let mut node = &mut self.root;
        for ch in word.chars() {
            // entry() is exactly "create only if missing"
            node = node.children.entry(ch).or_default();  //@17,19
        }
        node.is_end = true;  //@21
    }

    fn traverse(&self, prefix: &str) -> Option<&TrieNode> {
        let mut node = &self.root;
        for ch in prefix.chars() {
            // ? returns None the moment a character is missing
            node = node.children.get(&ch)?;  //@27,28
        }
        Some(node)
    }

    fn search(&self, word: &str) -> bool {
        self.traverse(word).is_some_and(|n| n.is_end)  //@35
    }

    fn starts_with(&self, prefix: &str) -> bool {
        self.traverse(prefix).is_some()  //@39
    }

    fn words_with_prefix(&self, prefix: &str) -> Vec<String> {
        let mut out = Vec::new();
        if let Some(node) = self.traverse(prefix) {
            collect(node, prefix.to_string(), &mut out);  //@50
        }
        out
    }
}

fn collect(node: &TrieNode, acc: String, out: &mut Vec<String>) {
    if node.is_end {
        out.push(acc.clone());
    }
    for (ch, child) in &node.children {
        collect(child, format!("{acc}{ch}"), out);
    }
}`),

  'lru-cache': annotated(`struct Node {
    key: String,  // needed to remove from the map on eviction
    value: i32,
    prev: usize,
    next: usize,
}

// Safe Rust will not let the map and the list both own a node,
// so the list lives in a Vec arena and the links are indices.
// Slots 0 and 1 are the head/tail sentinels.
const HEAD: usize = 0;
const TAIL: usize = 1;

struct LruCache {
    capacity: usize,
    map: HashMap<String, usize>,
    nodes: Vec<Node>,
    free: Vec<usize>,
}

impl LruCache {
    fn new(capacity: usize) -> Self {  //@11
        let sentinel = |prev, next| Node {
            key: String::new(),
            value: 0,
            prev,
            next,
        };
        LruCache {
            capacity,
            map: HashMap::new(),
            nodes: vec![sentinel(TAIL, TAIL), sentinel(HEAD, HEAD)],
            free: Vec::new(),
        }
    }

    fn remove(&mut self, i: usize) {
        let (prev, next) = (self.nodes[i].prev, self.nodes[i].next);
        self.nodes[prev].next = next;
        self.nodes[next].prev = prev;
    }

    fn add_to_front(&mut self, i: usize) {
        let first = self.nodes[HEAD].next;
        self.nodes[i].next = first;
        self.nodes[i].prev = HEAD;
        self.nodes[first].prev = i;
        self.nodes[HEAD].next = i;
    }

    fn get(&mut self, key: &str) -> i32 {
        let Some(&i) = self.map.get(key) else {  //@34
            return -1;  //@35
        };
        self.remove(i);
        self.add_to_front(i);  //@37
        self.nodes[i].value
    }

    fn put(&mut self, key: &str, value: i32) {
        if let Some(&i) = self.map.get(key) {
            self.nodes[i].value = value;
            self.remove(i);
            self.add_to_front(i);  //@46
            return;
        }
        let node = Node {
            key: key.to_string(),
            value,
            prev: HEAD,
            next: HEAD,
        };
        let i = match self.free.pop() {
            Some(slot) => {
                self.nodes[slot] = node;
                slot
            }
            None => {
                self.nodes.push(node);
                self.nodes.len() - 1
            }
        };
        self.map.insert(key.to_string(), i);
        self.add_to_front(i);  //@51
        if self.map.len() > self.capacity {
            let lru = self.nodes[TAIL].prev;  //@53
            self.remove(lru);
            let evicted = self.nodes[lru].key.clone();
            self.map.remove(&evicted);  //@55
            self.free.push(lru);
        }
    }
}`),
}
