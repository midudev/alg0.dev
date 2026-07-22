import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionPython: Record<string, CodeImplementation> = {
  'run-length-encoding': annotated(`def run_length_encode(text):
    tokens = []  #@2
    i = 0  #@3

    while i < len(text):  #@5
        char = text[i]  #@6
        count = 1  #@7

        while i + count < len(text) and text[i + count] == char:  #@10
            count += 1  #@11

        tokens.append((char, count))  #@14
        i += count  #@15

    return tokens  #@18


run_length_encode("AAABBBCCCCDAA")`),

  lz77: annotated(`def lz77_compress(text, window_size=6):
    tokens = []  #@2
    i = 0  #@3

    while i < len(text):  #@5
        window_start = max(0, i - window_size)  #@6
        best_offset = 0  #@7
        best_length = 0  #@8

        for j in range(window_start, i):  #@11
            length = 0  #@12
            while (  #@13
                i + length < len(text)
                and length < window_size
                and text[j + length] == text[i + length]
            ):
                length += 1  #@18
            if length > best_length:  #@20
                best_length = length
                best_offset = i - j

        next_char = text[i + best_length] if i + best_length < len(text) else ""  #@26
        tokens.append({"offset": best_offset, "length": best_length, "next": next_char})  #@27
        i += best_length + (1 if next_char else 0)  #@28

    return tokens  #@31


lz77_compress("aacaacabcaba")`),

  lzw: annotated(`def lzw_compress(text):
    dict_ = {}  #@3
    next_code = 0  #@4
    for ch in text:  #@5
        if ch not in dict_:
            dict_[ch] = next_code  #@6
            next_code += 1

    output = []  #@9
    w = ""  #@10

    for c in text:  #@12
        wc = w + c  #@13
        if wc in dict_:  #@14
            w = wc  #@15
        else:
            output.append(dict_[w])  #@17
            dict_[wc] = next_code  #@18
            next_code += 1
            w = c  #@19

    if w:
        output.append(dict_[w])  #@23
    return output  #@24


lzw_compress("TOBEORNOTTOBE")`),

  'huffman-coding': annotated(`from dataclasses import dataclass


@dataclass
class Node:
    char: str | None
    freq: int
    left: "Node | None" = None
    right: "Node | None" = None


def huffman_coding(text):
    freq = {}  #@3
    for char in text:
        freq[char] = freq.get(char, 0) + 1  #@5

    queue = [Node(char, count) for char, count in freq.items()]  #@11
    while len(queue) > 1:
        queue.sort(key=lambda node: node.freq)
        left = queue.pop(0)  #@18
        right = queue.pop(0)  #@19
        queue.append(Node(None, left.freq + right.freq, left, right))  #@20
    root = queue[0]

    codes = {}  #@26

    def assign(node, code):
        if node.left is None and node.right is None:  #@28
            codes[node.char] = code or "0"
            return
        assign(node.left, code + "0")
        assign(node.right, code + "1")

    assign(root, "")
    encoded = "".join(codes[char] for char in text)  #@38
    return codes, encoded


huffman_coding("ABRACADABRA")`),

  deflate: annotated(`# DEFLATE = LZ77 + Huffman  (engine inside gzip / ZIP / PNG)  #@1
def deflate_compress(text, window_size=6):
    tokens = []  #@4
    i = 0  #@5
    while i < len(text):  #@6
        window_start = max(0, i - window_size)  #@7
        best_offset = best_length = 0  #@8
        for j in range(window_start, i):  #@9
            length = 0  #@10
            while (  #@11
                i + length < len(text)
                and length < window_size
                and text[j + length] == text[i + length]
            ):
                length += 1
            if length > best_length:  #@16
                best_length = length
                best_offset = i - j
        next_char = text[i + best_length] if i + best_length < len(text) else ""  #@21
        tokens.append({"offset": best_offset, "length": best_length, "next": next_char})  #@22
        i += best_length + (1 if next_char else 0)  #@23

    symbols = []  #@28
    for t in tokens:  #@29
        if t["length"] > 0:
            symbols.append(f"M{t['length']}@{t['offset']}")  #@30
        if t["next"]:
            symbols.append(t["next"])  #@31

    freq = {}  #@35
    for s in symbols:
        freq[s] = freq.get(s, 0) + 1  #@36
    codes = build_huffman(freq)  #@37
    bits = "".join(codes[s] for s in symbols)  #@40
    return {"tokens": tokens, "symbols": symbols, "codes": codes, "bits": bits}  #@41


deflate_compress("aacaacabcaba")`),

  brotli: annotated(`# Pedagogical Brotli: static dict → LZ back-ref → Huffman  #@1
def brotli_compress(text, dictionary):
    # Prefer longer dictionary phrases  #@3
    dict_ = sorted(dictionary, key=len, reverse=True)  #@4
    commands = []  #@5
    i = 0  #@6

    while i < len(text):  #@8
        hit = None  #@10
        for word in dict_:  #@11
            if text.startswith(word, i):  #@12
                hit = word
                break
        if hit:  #@14
            commands.append({"type": "dict", "value": hit})  #@15
            i += len(hit)  #@16
            continue  #@17

        best_offset = best_length = 0  #@21
        for j in range(i):  #@22
            length = 0  #@23
            while i + length < len(text) and text[j + length] == text[i + length]:
                length += 1
            if length > best_length and length >= 3:  #@28
                best_length = length
                best_offset = i - j
        if best_length >= 3:  #@33
            commands.append({"type": "match", "offset": best_offset, "length": best_length})  #@34
            i += best_length  #@35
            continue

        commands.append({"type": "lit", "value": text[i]})  #@40
        i += 1  #@41

    labels = [cmd_label(c) for c in commands]  #@45
    freq = {}  #@46
    for s in labels:
        freq[s] = freq.get(s, 0) + 1  #@47
    codes = build_huffman(freq)  #@48
    bits = "".join(codes[s] for s in labels)  #@49
    return {"commands": commands, "codes": codes, "bits": bits}  #@50


brotli_compress(
    "https://www.example.com/https://www.example.com/x",
    ["https://", "www.", "example", ".com/", "/"],
)`),
}
