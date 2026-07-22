import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionRust: Record<string, CodeImplementation> = {
  'huffman-coding': annotated(`use std::cmp::Reverse;
use std::collections::{BinaryHeap, HashMap};

#[derive(Eq, Ord, PartialEq, PartialOrd)]
struct Node {
    freq: usize,
    ch: Option<char>,
    left: Option<Box<Node>>,
    right: Option<Box<Node>>,
}

impl Node {
    fn leaf(ch: char, freq: usize) -> Self {
        Self { freq, ch: Some(ch), left: None, right: None }
    }

    fn parent(left: Node, right: Node) -> Self {
        Self {
            freq: left.freq + right.freq,
            ch: None,
            left: Some(Box::new(left)),
            right: Some(Box::new(right)),
        }
    }
}

fn huffman_coding(text: &str) -> (HashMap<char, String>, String) {
    let mut freq = HashMap::new();  //@3
    for ch in text.chars() {
        *freq.entry(ch).or_insert(0) += 1;  //@5
    }

    let mut queue: BinaryHeap<Reverse<Node>> = freq  //@11
        .iter()
        .map(|(&ch, &count)| Reverse(Node::leaf(ch, count)))
        .collect();

    while queue.len() > 1 {
        let left = queue.pop().unwrap().0;  //@18
        let right = queue.pop().unwrap().0;  //@19
        queue.push(Reverse(Node::parent(left, right)));  //@20
    }
    let root = queue.pop().unwrap().0;

    let mut codes = HashMap::new();  //@26
    assign_codes(&root, String::new(), &mut codes);
    let mut encoded = String::new();  //@38
    for ch in text.chars() {
        encoded.push_str(&codes[&ch]);
    }
    (codes, encoded)
}

fn assign_codes(node: &Node, code: String, codes: &mut HashMap<char, String>) {
    if node.left.is_none() && node.right.is_none() {  //@28
        codes.insert(node.ch.unwrap(), if code.is_empty() { "0".into() } else { code });
        return;
    }
    assign_codes(node.left.as_ref().unwrap(), format!("{code}0"), codes);
    assign_codes(node.right.as_ref().unwrap(), format!("{code}1"), codes);
}

huffman_coding("ABRACADABRA");`),
}
