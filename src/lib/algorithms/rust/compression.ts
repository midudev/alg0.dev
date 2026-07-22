import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionRust: Record<string, CodeImplementation> = {
  'run-length-encoding': annotated(`fn run_length_encode(text: &str) -> Vec<(char, usize)> {
    let chars: Vec<char> = text.chars().collect();
    let mut tokens = Vec::new();  //@2
    let mut i = 0;  //@3

    while i < chars.len() {  //@5
        let ch = chars[i];  //@6
        let mut count = 1;  //@7

        while i + count < chars.len() && chars[i + count] == ch {  //@10
            count += 1;  //@11
        }

        tokens.push((ch, count));  //@14
        i += count;  //@15
    }

    tokens  //@18
}

run_length_encode("AAABBBCCCCDAA");`),

  lz77: annotated(`struct Lz77Token {
    offset: usize,
    length: usize,
    next: String,
}

fn lz77_compress(text: &str, window_size: usize) -> Vec<Lz77Token> {
    let chars: Vec<char> = text.chars().collect();
    let mut tokens = Vec::new();  //@2
    let mut i = 0;  //@3

    while i < chars.len() {  //@5
        let window_start = i.saturating_sub(window_size);  //@6
        let mut best_offset = 0;  //@7
        let mut best_length = 0;  //@8

        for j in window_start..i {  //@11
            let mut length = 0;  //@12
            while (  //@13
                i + length < chars.len()
                && length < window_size
                && chars[j + length] == chars[i + length]
            ) {
                length += 1;  //@18
            }
            if length > best_length {  //@20
                best_length = length;
                best_offset = i - j;
            }
        }

        let next = if i + best_length < chars.len() {  //@26
            chars[i + best_length].to_string()
        } else {
            String::new()
        };
        tokens.push(Lz77Token { offset: best_offset, length: best_length, next: next.clone() });  //@27
        i += best_length + if next.is_empty() { 0 } else { 1 };  //@28
    }

    tokens  //@31
}

lz77_compress("aacaacabcaba", 6);`),

  lzw: annotated(`fn lzw_compress(text: &str) -> Vec<usize> {
    let mut dict: HashMap<String, usize> = HashMap::new();  //@3
    let mut next_code = 0;  //@4
    for ch in text.chars() {  //@5
        let key = ch.to_string();
        if !dict.contains_key(&key) {
            dict.insert(key, next_code);  //@6
            next_code += 1;
        }
    }

    let mut output = Vec::new();  //@9
    let mut w = String::new();  //@10

    for c in text.chars() {  //@12
        let mut wc = w.clone();
        wc.push(c);  //@13
        if dict.contains_key(&wc) {  //@14
            w = wc;  //@15
        } else {
            output.push(dict[&w]);  //@17
            dict.insert(wc, next_code);  //@18
            next_code += 1;
            w = c.to_string();  //@19
        }
    }

    if !w.is_empty() {
        output.push(dict[&w]);  //@23
    }
    output  //@24
}

lzw_compress("TOBEORNOTTOBE");`),

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

  deflate: annotated(`// DEFLATE = LZ77 + Huffman  (engine inside gzip / ZIP / PNG)  //@1
struct DeflateToken { offset: usize, length: usize, next: String }

struct DeflateResult {
    tokens: Vec<DeflateToken>,
    symbols: Vec<String>,
    codes: HashMap<String, String>,
    bits: String,
}

fn deflate_compress(text: &str, window_size: usize) -> DeflateResult {
    let chars: Vec<char> = text.chars().collect();
    let mut tokens = Vec::new();  //@4
    let mut i = 0;  //@5
    while i < chars.len() {  //@6
        let window_start = i.saturating_sub(window_size);  //@7
        let mut best_offset = 0;  //@8
        let mut best_length = 0;
        for j in window_start..i {  //@9
            let mut length = 0;  //@10
            while (  //@11
                i + length < chars.len()
                && length < window_size
                && chars[j + length] == chars[i + length]
            ) {
                length += 1;
            }
            if length > best_length {  //@16
                best_length = length;
                best_offset = i - j;
            }
        }
        let next = if i + best_length < chars.len() {  //@21
            chars[i + best_length].to_string()
        } else {
            String::new()
        };
        tokens.push(DeflateToken { offset: best_offset, length: best_length, next: next.clone() });  //@22
        i += best_length + if next.is_empty() { 0 } else { 1 };  //@23
    }

    let mut symbols = Vec::new();  //@28
    for t in &tokens {  //@29
        if t.length > 0 {
            symbols.push(format!("M{}@{}", t.length, t.offset));  //@30
        }
        if !t.next.is_empty() {
            symbols.push(t.next.clone());  //@31
        }
    }

    let mut freq = HashMap::new();  //@35
    for s in &symbols {
        *freq.entry(s.clone()).or_insert(0) += 1;  //@36
    }
    let codes = build_huffman(&freq);  //@37
    let bits = symbols.iter().map(|s| codes[s].clone()).collect::<String>();  //@40
    DeflateResult { tokens, symbols, codes, bits }  //@41
}

deflate_compress("aacaacabcaba", 6);`),

  brotli: annotated(`// Pedagogical Brotli: static dict → LZ back-ref → Huffman  //@1
struct BrotliCommand {
    kind: String,
    value: String,
    offset: usize,
    length: usize,
}

struct BrotliResult {
    commands: Vec<BrotliCommand>,
    codes: HashMap<String, String>,
    bits: String,
}

fn brotli_compress(text: &str, dictionary: &[&str]) -> BrotliResult {
    // Prefer longer dictionary phrases  //@3
    let mut dict: Vec<&str> = dictionary.to_vec();  //@4
    dict.sort_by_key(|w| std::cmp::Reverse(w.len()));
    let chars: Vec<char> = text.chars().collect();
    let mut commands = Vec::new();  //@5
    let mut i = 0;  //@6

    while i < chars.len() {  //@8
        let mut hit: Option<&str> = None;  //@10
        for word in &dict {  //@11
            let w: Vec<char> = word.chars().collect();
            if i + w.len() <= chars.len() && chars[i..i + w.len()] == w[..] {  //@12
                hit = Some(*word);
                break;
            }
        }
        if let Some(word) = hit {  //@14
            commands.push(BrotliCommand {  //@15
                kind: "dict".into(), value: word.into(), offset: 0, length: 0,
            });
            i += word.chars().count();  //@16
            continue;  //@17
        }

        let mut best_offset = 0;  //@21
        let mut best_length = 0;
        for j in 0..i {  //@22
            let mut length = 0;  //@23
            while i + length < chars.len() && chars[j + length] == chars[i + length] {
                length += 1;
            }
            if length > best_length && length >= 3 {  //@28
                best_length = length;
                best_offset = i - j;
            }
        }
        if best_length >= 3 {  //@33
            commands.push(BrotliCommand {  //@34
                kind: "match".into(), value: String::new(), offset: best_offset, length: best_length,
            });
            i += best_length;  //@35
            continue;
        }

        commands.push(BrotliCommand {  //@40
            kind: "lit".into(), value: chars[i].to_string(), offset: 0, length: 0,
        });
        i += 1;  //@41
    }

    let labels: Vec<String> = commands.iter().map(cmd_label).collect();  //@45
    let mut freq = HashMap::new();  //@46
    for s in &labels {
        *freq.entry(s.clone()).or_insert(0) += 1;  //@47
    }
    let codes = build_huffman(&freq);  //@48
    let bits = labels.iter().map(|s| codes[s].clone()).collect::<String>();  //@49
    BrotliResult { commands, codes, bits }  //@50
}

brotli_compress(
    "https://www.example.com/https://www.example.com/x",
    &["https://", "www.", "example", ".com/", "/"],
);`),
}
