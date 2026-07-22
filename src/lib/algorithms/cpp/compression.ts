import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionCpp: Record<string, CodeImplementation> = {
  'run-length-encoding': annotated(`vector<pair<char, int>> runLengthEncode(const string& text) {
    vector<pair<char, int>> tokens;  //@2
    size_t i = 0;  //@3

    while (i < text.size()) {  //@5
        char ch = text[i];  //@6
        int count = 1;  //@7

        while (i + count < text.size() && text[i + count] == ch) {  //@10
            ++count;  //@11
        }

        tokens.emplace_back(ch, count);  //@14
        i += count;  //@15
    }

    return tokens;  //@18
}

runLengthEncode("AAABBBCCCCDAA");`),

  lz77: annotated(`struct Lz77Token {
    int offset;
    int length;
    string next;
};

vector<Lz77Token> lz77Compress(const string& text, int windowSize = 6) {
    vector<Lz77Token> tokens;  //@2
    size_t i = 0;  //@3

    while (i < text.size()) {  //@5
        size_t windowStart = i > (size_t)windowSize ? i - windowSize : 0;  //@6
        int bestOffset = 0;  //@7
        int bestLength = 0;  //@8

        for (size_t j = windowStart; j < i; ++j) {  //@11
            int length = 0;  //@12
            while (  //@13
                i + length < text.size()
                && length < windowSize
                && text[j + length] == text[i + length]
            ) {
                ++length;  //@18
            }
            if (length > bestLength) {  //@20
                bestLength = length;
                bestOffset = (int)(i - j);
            }
        }

        string next = i + bestLength < text.size()  //@26
            ? string(1, text[i + bestLength])
            : "";
        tokens.push_back({bestOffset, bestLength, next});  //@27
        i += bestLength + (next.empty() ? 0 : 1);  //@28
    }

    return tokens;  //@31
}

lz77Compress("aacaacabcaba");`),

  lzw: annotated(`vector<int> lzwCompress(const string& text) {
    unordered_map<string, int> dict;  //@3
    int nextCode = 0;  //@4
    for (char ch : text) {  //@5
        string key(1, ch);
        if (!dict.count(key)) dict[key] = nextCode++;  //@6
    }

    vector<int> output;  //@9
    string w;  //@10

    for (char c : text) {  //@12
        string wc = w + c;  //@13
        if (dict.count(wc)) {  //@14
            w = wc;  //@15
        } else {
            output.push_back(dict[w]);  //@17
            dict[wc] = nextCode++;  //@18
            w = string(1, c);  //@19
        }
    }

    if (!w.empty()) output.push_back(dict[w]);  //@23
    return output;  //@24
}

lzwCompress("TOBEORNOTTOBE");`),

  'huffman-coding': annotated(`struct Node {
    char ch;
    int freq;
    Node* left;
    Node* right;
};

struct CompareFreq {
    bool operator()(const Node* a, const Node* b) const {
        return a->freq > b->freq;
    }
};

struct HuffmanResult {
    unordered_map<char, string> codes;
    string encoded;
};

HuffmanResult huffmanCoding(const string& text) {
    unordered_map<char, int> freq;  //@3
    for (char ch : text) {
        ++freq[ch];  //@5
    }

    priority_queue<Node*, vector<Node*>, CompareFreq> queue;  //@11
    for (auto [ch, count] : freq) {
        queue.push(new Node{ch, count, nullptr, nullptr});
    }

    while (queue.size() > 1) {
        Node* left = queue.top(); queue.pop();  //@18
        Node* right = queue.top(); queue.pop();  //@19
        queue.push(new Node{'\\0', left->freq + right->freq, left, right});  //@20
    }
    Node* root = queue.top();

    unordered_map<char, string> codes;  //@26
    assignCodes(root, "", codes);
    string encoded;  //@38
    for (char ch : text) encoded += codes[ch];
    return {codes, encoded};
}

void assignCodes(Node* node, string code, unordered_map<char, string>& codes) {
    if (node->left == nullptr && node->right == nullptr) {  //@28
        codes[node->ch] = code.empty() ? "0" : code;
        return;
    }
    assignCodes(node->left, code + "0", codes);
    assignCodes(node->right, code + "1", codes);
}

huffmanCoding("ABRACADABRA");`),

  deflate: annotated(`// DEFLATE = LZ77 + Huffman  (engine inside gzip / ZIP / PNG)  //@1
struct DeflateToken { int offset; int length; string next; };

struct DeflateResult {
    vector<DeflateToken> tokens;
    vector<string> symbols;
    unordered_map<string, string> codes;
    string bits;
};

DeflateResult deflateCompress(const string& text, int windowSize = 6) {
    vector<DeflateToken> tokens;  //@4
    size_t i = 0;  //@5
    while (i < text.size()) {  //@6
        size_t windowStart = i > (size_t)windowSize ? i - windowSize : 0;  //@7
        int bestOffset = 0, bestLength = 0;  //@8
        for (size_t j = windowStart; j < i; ++j) {  //@9
            int length = 0;  //@10
            while (  //@11
                i + length < text.size()
                && length < windowSize
                && text[j + length] == text[i + length]
            ) ++length;
            if (length > bestLength) {  //@16
                bestLength = length;
                bestOffset = (int)(i - j);
            }
        }
        string next = i + bestLength < text.size()  //@21
            ? string(1, text[i + bestLength]) : "";
        tokens.push_back({bestOffset, bestLength, next});  //@22
        i += bestLength + (next.empty() ? 0 : 1);  //@23
    }

    vector<string> symbols;  //@28
    for (const auto& t : tokens) {  //@29
        if (t.length > 0) symbols.push_back("M" + to_string(t.length) + "@" + to_string(t.offset));  //@30
        if (!t.next.empty()) symbols.push_back(t.next);  //@31
    }

    unordered_map<string, int> freq;  //@35
    for (const auto& s : symbols) ++freq[s];  //@36
    auto codes = buildHuffman(freq);  //@37
    string bits;  //@40
    for (const auto& s : symbols) bits += codes[s];
    return {tokens, symbols, codes, bits};  //@41
}

deflateCompress("aacaacabcaba");`),

  brotli: annotated(`// Pedagogical Brotli: static dict → LZ back-ref → Huffman  //@1
struct BrotliCommand {
    string type;
    string value;
    int offset = 0;
    int length = 0;
};

struct BrotliResult {
    vector<BrotliCommand> commands;
    unordered_map<string, string> codes;
    string bits;
};

BrotliResult brotliCompress(const string& text, vector<string> dictionary) {
    // Prefer longer dictionary phrases  //@3
    sort(dictionary.begin(), dictionary.end(),  //@4
        [](const string& a, const string& b) { return a.size() > b.size(); });
    vector<BrotliCommand> commands;  //@5
    size_t i = 0;  //@6

    while (i < text.size()) {  //@8
        string hit;  //@10
        for (const auto& word : dictionary) {  //@11
            if (text.compare(i, word.size(), word) == 0) { hit = word; break; }  //@12
        }
        if (!hit.empty()) {  //@14
            commands.push_back({"dict", hit});  //@15
            i += hit.size();  //@16
            continue;  //@17
        }

        int bestOffset = 0, bestLength = 0;  //@21
        for (size_t j = 0; j < i; ++j) {  //@22
            int length = 0;  //@23
            while (i + length < text.size() && text[j + length] == text[i + length]) ++length;
            if (length > bestLength && length >= 3) {  //@28
                bestLength = length;
                bestOffset = (int)(i - j);
            }
        }
        if (bestLength >= 3) {  //@33
            commands.push_back({"match", "", bestOffset, bestLength});  //@34
            i += bestLength;  //@35
            continue;
        }

        commands.push_back({"lit", string(1, text[i])});  //@40
        ++i;  //@41
    }

    vector<string> labels;  //@45
    for (const auto& c : commands) labels.push_back(cmdLabel(c));
    unordered_map<string, int> freq;  //@46
    for (const auto& s : labels) ++freq[s];  //@47
    auto codes = buildHuffman(freq);  //@48
    string bits;  //@49
    for (const auto& s : labels) bits += codes[s];
    return {commands, codes, bits};  //@50
}

brotliCompress(
    "https://www.example.com/https://www.example.com/x",
    {"https://", "www.", "example", ".com/", "/"}
);`),
}
