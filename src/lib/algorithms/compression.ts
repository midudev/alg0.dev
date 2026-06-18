import type { Algorithm, Step, HuffmanState } from '@lib/types'
import { d } from '@lib/algorithms/shared'

type HNode = HuffmanState['nodes'][number]
type HNodeState = NonNullable<HuffmanState['nodeStates']>[number]

const huffmanCoding: Algorithm = {
  id: 'huffman-coding',
  name: 'Huffman Coding',
  category: 'Compression',
  difficulty: 'advanced',
  visualization: 'concept',
  code: `function huffmanCoding(text) {
  // 1. Count character frequencies
  const freq = {};
  for (const ch of text) {
    freq[ch] = (freq[ch] || 0) + 1;
  }

  // 2. Create a leaf node per character and push
  //    them all into a min-priority queue
  let pq = Object.entries(freq).map(
    ([char, f]) => ({ char, freq: f, left: null, right: null })
  );

  // 3. Build the tree: repeatedly merge the two
  //    lowest-frequency nodes into a new parent
  while (pq.length > 1) {
    pq.sort((a, b) => a.freq - b.freq);
    const left = pq.shift();
    const right = pq.shift();
    pq.push({ char: null, freq: left.freq + right.freq, left, right });
  }
  const root = pq[0];

  // 4. Walk the tree to assign a binary code to
  //    each character (left = 0, right = 1)
  const codes = {};
  function assign(node, code) {
    if (!node.left && !node.right) {
      codes[node.char] = code || '0';
      return;
    }
    assign(node.left, code + '0');
    assign(node.right, code + '1');
  }
  assign(root, '');

  // 5. Encode the text using the generated codes
  const encoded = [...text].map((ch) => codes[ch]).join('');
  return { codes, encoded };
}

huffmanCoding('ABRACADABRA');`,
  description: `Huffman Coding

Huffman Coding is a greedy algorithm for lossless data compression. It assigns shorter binary codes to frequent characters and longer codes to rare ones, so the total number of bits needed to store the data shrinks.

How it works:
1. Count how often each character appears
2. Create a leaf node per character and put them in a min-priority queue
3. Repeatedly remove the two lowest-frequency nodes and merge them under a new parent whose frequency is their sum; push the parent back
4. When one node remains it becomes the tree root
5. Assign codes by walking the tree: left = 0, right = 1

Why it works:
  No code is a prefix of another (it's a prefix-free code), so the encoded bitstream decodes unambiguously. The greedy merge guarantees an optimal prefix code for the given frequencies.

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(n)

Properties:
  - Lossless: the original data is recovered exactly
  - Optimal among prefix codes for a known frequency distribution
  - Used in DEFLATE (ZIP, gzip, PNG), JPEG and MP3

Invented by David A. Huffman in 1952 while he was a student at MIT, it remains a cornerstone of modern compression.`,

  generateSteps(locale = 'en') {
    const TEXT = 'ABRACADABRA'
    const steps: Step[] = []

    // ── Model state, mutated as the algorithm runs ──
    const nodes: Record<number, HNode> = {}
    let nextId = 0
    const newNode = (
      char: string | null,
      freq: number,
      left: number | null,
      right: number | null,
    ): number => {
      const id = nextId++
      nodes[id] = { id, char, freq, left, right }
      return id
    }

    // Snapshot helper — clones nodes so each step is immutable
    const snap = (extra: {
      phase: 'frequency' | 'build' | 'encode' | 'done'
      queue: number[]
      nodeStates?: Record<number, HNodeState>
      highlightChar?: string | null
      freqTable?: { char: string; freq: number; active?: boolean }[]
      codes?: { char: string; code: string; freq: number; active?: boolean }[]
      activeCode?: string | null
      summary?: {
        uniqueChars: number
        originalBits: number
        compressedBits: number
        avgBits: number
        savingPct: number
        encoded: string
      }
      operation?: string
    }) => ({
      type: 'huffman' as const,
      text: TEXT,
      nodes: Object.fromEntries(Object.entries(nodes).map(([k, v]) => [k, { ...v }])),
      ...extra,
    })

    // ════════════════════════════════════════════
    //  Phase 1 — Frequency counting
    // ════════════════════════════════════════════

    // Count frequencies in order of first appearance
    const freqMap = new Map<string, number>()
    for (const ch of TEXT) freqMap.set(ch, (freqMap.get(ch) ?? 0) + 1)
    const orderedChars = [...freqMap.keys()]

    steps.push({
      concept: snap({
        phase: 'frequency',
        queue: [],
        freqTable: [],
        operation: d(locale, 'Input', 'Entrada'),
      }),
      description: d(
        locale,
        `Compress the text "${TEXT}" (${TEXT.length} characters). First, count how often each character appears.`,
        `Comprimir el texto "${TEXT}" (${TEXT.length} caracteres). Primero, contar cuántas veces aparece cada carácter.`,
      ),
      codeLine: 3,
      variables: { text: TEXT, length: TEXT.length },
    })

    // Build a leaf node + freq table row per character, one step each
    const queue: number[] = []
    const freqTable: { char: string; freq: number; active?: boolean }[] = []

    for (const ch of orderedChars) {
      const f = freqMap.get(ch)!
      const id = newNode(ch, f, null, null)
      queue.push(id)
      freqTable.push({ char: ch, freq: f })

      steps.push({
        concept: snap({
          phase: 'frequency',
          queue: [...queue],
          highlightChar: ch,
          freqTable: freqTable.map((r) => ({ ...r, active: r.char === ch })),
          nodeStates: { [id]: 'new' },
          operation: d(locale, 'Counting frequencies', 'Contando frecuencias'),
        }),
        description: d(
          locale,
          `'${ch}' appears ${f} time${f === 1 ? '' : 's'}. Create a leaf node for it and add it to the priority queue.`,
          `'${ch}' aparece ${f} ${f === 1 ? 'vez' : 'veces'}. Crear un nodo hoja y agregarlo a la cola de prioridad.`,
        ),
        codeLine: 5,
        variables: { char: ch, freq: f },
      })
    }

    // Sort the queue by (freq, id) — this is the min-priority ordering used throughout
    const sortQueue = (q: number[]) => [...q].sort((a, b) => nodes[a].freq - nodes[b].freq || a - b)

    let pq = sortQueue(queue)

    steps.push({
      concept: snap({
        phase: 'build',
        queue: [...pq],
        freqTable: freqTable.map((r) => ({ ...r })),
        operation: d(locale, 'Priority queue ready', 'Cola de prioridad lista'),
      }),
      description: d(
        locale,
        `${pq.length} leaf nodes are now in the priority queue, sorted by frequency (lowest first). Time to build the tree.`,
        `Ahora hay ${pq.length} nodos hoja en la cola de prioridad, ordenados por frecuencia (menor primero). Hora de construir el árbol.`,
      ),
      codeLine: 11,
      variables: { queueSize: pq.length },
    })

    // ════════════════════════════════════════════
    //  Phase 2 — Build the tree
    // ════════════════════════════════════════════

    while (pq.length > 1) {
      const leftId = pq[0]
      const rightId = pq[1]

      // Step A — highlight the two lowest-frequency nodes
      steps.push({
        concept: snap({
          phase: 'build',
          queue: [...pq],
          freqTable: freqTable.map((r) => ({ ...r })),
          nodeStates: { [leftId]: 'merging', [rightId]: 'merging' },
          operation: d(locale, 'Pick the two smallest', 'Tomar los dos menores'),
        }),
        description: d(
          locale,
          `Remove the two lowest-frequency nodes: ${nodeLabel(nodes, leftId)} and ${nodeLabel(nodes, rightId)} (${nodes[leftId].freq} + ${nodes[rightId].freq} = ${nodes[leftId].freq + nodes[rightId].freq}).`,
          `Quitar los dos nodos de menor frecuencia: ${nodeLabel(nodes, leftId)} y ${nodeLabel(nodes, rightId)} (${nodes[leftId].freq} + ${nodes[rightId].freq} = ${nodes[leftId].freq + nodes[rightId].freq}).`,
        ),
        codeLine: 18,
        variables: {
          left: nodes[leftId].freq,
          right: nodes[rightId].freq,
          sum: nodes[leftId].freq + nodes[rightId].freq,
        },
      })

      // Merge into a new parent
      const parentFreq = nodes[leftId].freq + nodes[rightId].freq
      const parentId = newNode(null, parentFreq, leftId, rightId)
      pq = sortQueue([...pq.slice(2), parentId])

      // Step B — show the new parent in the queue
      steps.push({
        concept: snap({
          phase: 'build',
          queue: [...pq],
          freqTable: freqTable.map((r) => ({ ...r })),
          nodeStates: { [parentId]: 'new', [leftId]: 'path', [rightId]: 'path' },
          operation: d(locale, 'Merge into a parent', 'Fusionar en un padre'),
        }),
        description: d(
          locale,
          `Create a parent node of frequency ${parentFreq} linking both, then push it back. ${pq.length} node${pq.length === 1 ? '' : 's'} left in the queue.`,
          `Crear un nodo padre de frecuencia ${parentFreq} que enlaza a ambos y devolverlo a la cola. Quedan ${pq.length} nodo${pq.length === 1 ? '' : 's'} en la cola.`,
        ),
        codeLine: 19,
        variables: { parentFreq, queueSize: pq.length },
      })
    }

    const rootId = pq[0]

    // ════════════════════════════════════════════
    //  Phase 3 — Assign codes (DFS, left = 0, right = 1)
    // ════════════════════════════════════════════

    const codeByChar = new Map<string, string>()
    const orderForCodes: { char: string; code: string; path: number[] }[] = []

    const assign = (id: number, code: string, path: number[]) => {
      const node = nodes[id]
      const here = [...path, id]
      if (node.left === null && node.right === null) {
        const finalCode = code || '0'
        codeByChar.set(node.char!, finalCode)
        orderForCodes.push({ char: node.char!, code: finalCode, path: here })
        return
      }
      if (node.left !== null) assign(node.left, code + '0', here)
      if (node.right !== null) assign(node.right, code + '1', here)
    }
    assign(rootId, '', [])

    steps.push({
      concept: snap({
        phase: 'encode',
        queue: [rootId],
        freqTable: freqTable.map((r) => ({ ...r })),
        codes: [],
        operation: d(locale, 'Assign codes', 'Asignar códigos'),
      }),
      description: d(
        locale,
        'The tree is complete. Walk it from the root: every left branch adds a 0, every right branch adds a 1. The code for a character is the path to its leaf.',
        'El árbol está completo. Recorrerlo desde la raíz: cada rama izquierda agrega un 0, cada rama derecha un 1. El código de un carácter es el camino hasta su hoja.',
      ),
      codeLine: 26,
      variables: { root: nodes[rootId].freq },
    })

    const codesAcc: { char: string; code: string; freq: number; active?: boolean }[] = []
    for (const entry of orderForCodes) {
      const nodeStates: Record<number, HNodeState> = {}
      for (const pid of entry.path) nodeStates[pid] = 'path'
      nodeStates[entry.path[entry.path.length - 1]] = 'leafFound'

      codesAcc.push({ char: entry.char, code: entry.code, freq: freqMap.get(entry.char)! })

      steps.push({
        concept: snap({
          phase: 'encode',
          queue: [rootId],
          freqTable: freqTable.map((r) => ({ ...r, active: r.char === entry.char })),
          codes: codesAcc.map((c) => ({ ...c, active: c.char === entry.char })),
          nodeStates,
          activeCode: entry.code,
          operation: d(locale, 'Tracing path', 'Trazando camino'),
        }),
        description: d(
          locale,
          `'${entry.char}' is reached by the path "${entry.code}", so its Huffman code is ${entry.code} (${entry.code.length} bit${entry.code.length === 1 ? '' : 's'}).`,
          `Se llega a '${entry.char}' por el camino "${entry.code}", así que su código de Huffman es ${entry.code} (${entry.code.length} bit${entry.code.length === 1 ? '' : 's'}).`,
        ),
        codeLine: 28,
        variables: { char: entry.char, code: entry.code, bits: entry.code.length },
      })
    }

    // ════════════════════════════════════════════
    //  Phase 4 — Encode & summary
    // ════════════════════════════════════════════

    const encoded = [...TEXT].map((ch) => codeByChar.get(ch)!).join('')
    const uniqueChars = orderedChars.length
    const fixedWidth = Math.max(1, Math.ceil(Math.log2(uniqueChars)))
    const originalBits = TEXT.length * 8 // ASCII baseline
    const compressedBits = encoded.length
    const avgBits = compressedBits / TEXT.length
    const savingPct = Math.round((1 - compressedBits / originalBits) * 100)

    steps.push({
      concept: snap({
        phase: 'done',
        queue: [rootId],
        freqTable: freqTable.map((r) => ({ ...r })),
        codes: codesAcc.map((c) => ({ ...c })),
        summary: {
          uniqueChars,
          originalBits,
          compressedBits,
          avgBits,
          savingPct,
          encoded,
        },
        operation: d(locale, 'Done', 'Listo'),
      }),
      description: d(
        locale,
        `Encoding "${TEXT}" takes ${compressedBits} bits with Huffman vs ${originalBits} bits as 8-bit ASCII — about ${savingPct}% smaller (~${avgBits.toFixed(2)} bits/char instead of a fixed ${fixedWidth}).`,
        `Codificar "${TEXT}" usa ${compressedBits} bits con Huffman frente a ${originalBits} bits en ASCII de 8 bits — alrededor de ${savingPct}% más chico (~${avgBits.toFixed(2)} bits/carácter en vez de ${fixedWidth} fijos).`,
      ),
      codeLine: 38,
      variables: {
        originalBits,
        compressedBits,
        saving: `${savingPct}%`,
      },
      consoleOutput: [
        `encoded: ${encoded}`,
        `${originalBits} bits → ${compressedBits} bits (${savingPct}% smaller)`,
      ],
    })

    return steps
  },
}

/** Short label for a node: its char (leaf) or its frequency sum (internal) */
function nodeLabel(nodes: Record<number, HNode>, id: number): string {
  const n = nodes[id]
  return n.char !== null ? `'${n.char}'` : `(${n.freq})`
}

export { huffmanCoding }
