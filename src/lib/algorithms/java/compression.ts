import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionJava: Record<string, CodeImplementation> = {
  'run-length-encoding':
    annotated(`List<AbstractMap.SimpleEntry<Character, Integer>> runLengthEncode(String text) {
    List<AbstractMap.SimpleEntry<Character, Integer>> tokens = new ArrayList<>();  //@2
    int i = 0;  //@3

    while (i < text.length()) {  //@5
        char ch = text.charAt(i);  //@6
        int count = 1;  //@7

        while (i + count < text.length() && text.charAt(i + count) == ch) {  //@10
            count++;  //@11
        }

        tokens.add(new AbstractMap.SimpleEntry<>(ch, count));  //@14
        i += count;  //@15
    }

    return tokens;  //@18
}

runLengthEncode("AAABBBCCCCDAA");`),

  lz77: annotated(`record Lz77Token(int offset, int length, String next) {}

List<Lz77Token> lz77Compress(String text, int windowSize) {
    List<Lz77Token> tokens = new ArrayList<>();  //@2
    int i = 0;  //@3

    while (i < text.length()) {  //@5
        int windowStart = Math.max(0, i - windowSize);  //@6
        int bestOffset = 0;  //@7
        int bestLength = 0;  //@8

        for (int j = windowStart; j < i; j++) {  //@11
            int length = 0;  //@12
            while (  //@13
                i + length < text.length()
                && length < windowSize
                && text.charAt(j + length) == text.charAt(i + length)
            ) {
                length++;  //@18
            }
            if (length > bestLength) {  //@20
                bestLength = length;
                bestOffset = i - j;
            }
        }

        String next = i + bestLength < text.length()  //@26
            ? String.valueOf(text.charAt(i + bestLength))
            : "";
        tokens.add(new Lz77Token(bestOffset, bestLength, next));  //@27
        i += bestLength + (next.isEmpty() ? 0 : 1);  //@28
    }

    return tokens;  //@31
}

lz77Compress("aacaacabcaba", 6);`),

  lzw: annotated(`List<Integer> lzwCompress(String text) {
    Map<String, Integer> dict = new LinkedHashMap<>();  //@3
    int nextCode = 0;  //@4
    for (char ch : text.toCharArray()) {  //@5
        String key = String.valueOf(ch);
        if (!dict.containsKey(key)) dict.put(key, nextCode++);  //@6
    }

    List<Integer> output = new ArrayList<>();  //@9
    String w = "";  //@10

    for (char c : text.toCharArray()) {  //@12
        String wc = w + c;  //@13
        if (dict.containsKey(wc)) {  //@14
            w = wc;  //@15
        } else {
            output.add(dict.get(w));  //@17
            dict.put(wc, nextCode++);  //@18
            w = String.valueOf(c);  //@19
        }
    }

    if (!w.isEmpty()) output.add(dict.get(w));  //@23
    return output;  //@24
}

lzwCompress("TOBEORNOTTOBE");`),

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

  deflate: annotated(`// DEFLATE = LZ77 + Huffman  (engine inside gzip / ZIP / PNG)  //@1
record DeflateToken(int offset, int length, String next) {}
record DeflateResult(List<DeflateToken> tokens, List<String> symbols, Map<String, String> codes, String bits) {}

DeflateResult deflateCompress(String text, int windowSize) {
    List<DeflateToken> tokens = new ArrayList<>();  //@4
    int i = 0;  //@5
    while (i < text.length()) {  //@6
        int windowStart = Math.max(0, i - windowSize);  //@7
        int bestOffset = 0, bestLength = 0;  //@8
        for (int j = windowStart; j < i; j++) {  //@9
            int length = 0;  //@10
            while (  //@11
                i + length < text.length()
                && length < windowSize
                && text.charAt(j + length) == text.charAt(i + length)
            ) length++;
            if (length > bestLength) {  //@16
                bestLength = length;
                bestOffset = i - j;
            }
        }
        String next = i + bestLength < text.length()  //@21
            ? String.valueOf(text.charAt(i + bestLength)) : "";
        tokens.add(new DeflateToken(bestOffset, bestLength, next));  //@22
        i += bestLength + (next.isEmpty() ? 0 : 1);  //@23
    }

    List<String> symbols = new ArrayList<>();  //@28
    for (DeflateToken t : tokens) {  //@29
        if (t.length() > 0) symbols.add("M" + t.length() + "@" + t.offset());  //@30
        if (!t.next().isEmpty()) symbols.add(t.next());  //@31
    }

    Map<String, Integer> freq = new LinkedHashMap<>();  //@35
    for (String s : symbols) freq.merge(s, 1, Integer::sum);  //@36
    Map<String, String> codes = buildHuffman(freq);  //@37
    String bits = symbols.stream().map(codes::get).collect(Collectors.joining());  //@40
    return new DeflateResult(tokens, symbols, codes, bits);  //@41
}

deflateCompress("aacaacabcaba", 6);`),

  brotli: annotated(`// Pedagogical Brotli: static dict → LZ back-ref → Huffman  //@1
record BrotliCommand(String type, String value, int offset, int length) {}
record BrotliResult(List<BrotliCommand> commands, Map<String, String> codes, String bits) {}

BrotliResult brotliCompress(String text, List<String> dictionary) {
    // Prefer longer dictionary phrases  //@3
    List<String> dict = dictionary.stream()  //@4
        .sorted(Comparator.comparingInt(String::length).reversed())
        .toList();
    List<BrotliCommand> commands = new ArrayList<>();  //@5
    int i = 0;  //@6

    while (i < text.length()) {  //@8
        String hit = null;  //@10
        for (String word : dict) {  //@11
            if (text.startsWith(word, i)) { hit = word; break; }  //@12
        }
        if (hit != null) {  //@14
            commands.add(new BrotliCommand("dict", hit, 0, 0));  //@15
            i += hit.length();  //@16
            continue;  //@17
        }

        int bestOffset = 0, bestLength = 0;  //@21
        for (int j = 0; j < i; j++) {  //@22
            int length = 0;  //@23
            while (i + length < text.length()
                && text.charAt(j + length) == text.charAt(i + length)) length++;
            if (length > bestLength && length >= 3) {  //@28
                bestLength = length;
                bestOffset = i - j;
            }
        }
        if (bestLength >= 3) {  //@33
            commands.add(new BrotliCommand("match", "", bestOffset, bestLength));  //@34
            i += bestLength;  //@35
            continue;
        }

        commands.add(new BrotliCommand("lit", String.valueOf(text.charAt(i)), 0, 0));  //@40
        i++;  //@41
    }

    List<String> labels = commands.stream().map(this::cmdLabel).toList();  //@45
    Map<String, Integer> freq = new LinkedHashMap<>();  //@46
    for (String s : labels) freq.merge(s, 1, Integer::sum);  //@47
    Map<String, String> codes = buildHuffman(freq);  //@48
    String bits = labels.stream().map(codes::get).collect(Collectors.joining());  //@49
    return new BrotliResult(commands, codes, bits);  //@50
}

brotliCompress(
    "https://www.example.com/https://www.example.com/x",
    List.of("https://", "www.", "example", ".com/", "/")
);`),
}
