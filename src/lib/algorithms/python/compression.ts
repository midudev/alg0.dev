import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionPython: Record<string, CodeImplementation> = {
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
}
