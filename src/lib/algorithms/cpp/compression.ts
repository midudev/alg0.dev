import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const compressionCpp: Record<string, CodeImplementation> = {
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
}
