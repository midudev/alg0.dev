import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionJava: Record<string, CodeImplementation> = {
  'huffman-coding': annotated(`static final class Node {
    final Character ch;
    final int freq;
    final Node left;
    final Node right;

    Node(Character ch, int freq) {
        this(ch, freq, null, null);
    }

    Node(Character ch, int freq, Node left, Node right) {
        this.ch = ch;
        this.freq = freq;
        this.left = left;
        this.right = right;
    }
}

record HuffmanResult(Map<Character, String> codes, String encoded) {}

HuffmanResult huffmanCoding(String text) {
    Map<Character, Integer> freq = new LinkedHashMap<>();  //@3
    for (char ch : text.toCharArray()) {
        freq.merge(ch, 1, Integer::sum);  //@5
    }

    PriorityQueue<Node> queue = new PriorityQueue<>(  //@11
        Comparator.comparingInt(node -> node.freq)
    );
    freq.forEach((ch, count) -> queue.add(new Node(ch, count)));

    while (queue.size() > 1) {
        Node left = queue.remove();  //@18
        Node right = queue.remove();  //@19
        queue.add(new Node(null, left.freq + right.freq, left, right));  //@20
    }
    Node root = queue.remove();

    Map<Character, String> codes = new HashMap<>();  //@26
    assignCodes(root, "", codes);
    String encoded = text.chars()  //@38
        .mapToObj(ch -> codes.get((char) ch))
        .collect(Collectors.joining());
    return new HuffmanResult(codes, encoded);
}

void assignCodes(Node node, String code, Map<Character, String> codes) {
    if (node.left == null && node.right == null) {  //@28
        codes.put(node.ch, code.isEmpty() ? "0" : code);
        return;
    }
    assignCodes(node.left, code + "0", codes);
    assignCodes(node.right, code + "1", codes);
}

huffmanCoding("ABRACADABRA");`),
}
