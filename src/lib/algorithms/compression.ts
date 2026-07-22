import type {
  Algorithm,
  Step,
  HuffmanState,
  RleState,
  Lz77State,
  LzwState,
  DeflateState,
  BrotliState,
} from '@lib/types'
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
        codeLine: 20,
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

// ============================================================
// RUN-LENGTH ENCODING
// ============================================================

const runLengthEncoding: Algorithm = {
  id: 'run-length-encoding',
  name: 'Run-Length Encoding',
  category: 'Compression',
  difficulty: 'easy',
  visualization: 'concept',
  code: `function runLengthEncode(text) {
  const tokens = [];
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    let count = 1;

    // Extend the run while the next char matches
    while (i + count < text.length && text[i + count] === char) {
      count++;
    }

    tokens.push([char, count]);
    i += count;
  }

  return tokens;
}

runLengthEncode('AAABBBCCCCDAA');`,

  generateSteps(locale = 'en') {
    const TEXT = 'AAABBBCCCCDAA'
    const steps: Step[] = []
    const tokens: RleState['tokens'] = []

    const snap = (extra: {
      phase: RleState['phase']
      charStates: RleState['charStates']
      runStart?: number
      runEnd?: number
      tokens: RleState['tokens']
      encoded?: string
      summary?: RleState['summary']
      operation?: string
    }): RleState => ({
      type: 'rle',
      text: TEXT,
      ...extra,
    })

    const defaultStates = (): RleState['charStates'] => {
      const s: RleState['charStates'] = {}
      for (let i = 0; i < TEXT.length; i++) s[i] = 'default'
      return s
    }

    steps.push({
      concept: snap({
        phase: 'scan',
        charStates: defaultStates(),
        tokens: [],
        operation: d(locale, 'Input', 'Entrada'),
      }),
      description: d(
        locale,
        `Compress "${TEXT}" with Run-Length Encoding. Replace each consecutive run of identical characters with (character, count).`,
        `Comprimir "${TEXT}" con Codificación por Longitud de Racha. Reemplazar cada racha de caracteres idénticos por (carácter, conteo).`,
      ),
      codeLine: 1,
      variables: { text: TEXT, length: TEXT.length },
    })

    let i = 0
    while (i < TEXT.length) {
      const char = TEXT[i]
      let count = 1

      // Open the run
      {
        const charStates = defaultStates()
        for (let k = 0; k < i; k++) charStates[k] = 'emitted'
        charStates[i] = 'current'
        steps.push({
          concept: snap({
            phase: 'scan',
            charStates,
            runStart: i,
            runEnd: i,
            tokens: tokens.map((t) => ({ ...t })),
            operation: d(locale, 'Start a new run', 'Iniciar una racha'),
          }),
          description: d(
            locale,
            `At index ${i}, character '${char}' starts a new run.`,
            `En el índice ${i}, el carácter '${char}' inicia una nueva racha.`,
          ),
          codeLine: 6,
          variables: { i, char, count: 1 },
        })
      }

      while (i + count < TEXT.length && TEXT[i + count] === char) {
        count++
        const charStates = defaultStates()
        for (let k = 0; k < i; k++) charStates[k] = 'emitted'
        for (let k = i; k < i + count - 1; k++) charStates[k] = 'inRun'
        charStates[i + count - 1] = 'current'
        steps.push({
          concept: snap({
            phase: 'scan',
            charStates,
            runStart: i,
            runEnd: i + count - 1,
            tokens: tokens.map((t) => ({ ...t })),
            operation: d(locale, 'Extend the run', 'Extender la racha'),
          }),
          description: d(
            locale,
            `Index ${i + count - 1} is also '${char}'. Run length is now ${count}.`,
            `El índice ${i + count - 1} también es '${char}'. La racha ahora mide ${count}.`,
          ),
          codeLine: 10,
          variables: { i, char, count },
        })
      }

      tokens.push({ char, count })
      const encoded = tokens.map((t) => `${t.char}${t.count}`).join('')
      const charStates = defaultStates()
      for (let k = 0; k < i + count; k++) charStates[k] = 'emitted'
      steps.push({
        concept: snap({
          phase: 'emit',
          charStates,
          runStart: i,
          runEnd: i + count - 1,
          tokens: tokens.map((t, idx) => ({ ...t, active: idx === tokens.length - 1 })),
          encoded,
          operation: d(locale, 'Emit token', 'Emitir token'),
        }),
        description: d(
          locale,
          `Run ends. Emit token ('${char}', ${count}). Encoded so far: ${encoded}.`,
          `La racha termina. Emitir token ('${char}', ${count}). Codificado hasta ahora: ${encoded}.`,
        ),
        codeLine: 14,
        variables: { char, count, tokens: tokens.length },
      })

      i += count
    }

    const encoded = tokens.map((t) => `${t.char}${t.count}`).join('')
    const originalLen = TEXT.length
    // Each token as char + decimal count string (naive printable form)
    const encodedLen = encoded.length
    const savingPct = Math.round((1 - encodedLen / originalLen) * 100)

    steps.push({
      concept: snap({
        phase: 'done',
        charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'emitted' as const])),
        tokens: tokens.map((t) => ({ ...t })),
        encoded,
        summary: {
          originalLen,
          encodedLen,
          tokenCount: tokens.length,
          savingPct,
        },
        operation: d(locale, 'Done', 'Listo'),
      }),
      description: d(
        locale,
        `RLE finished: ${originalLen} characters → ${tokens.length} tokens (${encoded}). Best when long runs of identical symbols exist (bitmaps, simple graphics).`,
        `RLE terminado: ${originalLen} caracteres → ${tokens.length} tokens (${encoded}). Brilla con rachas largas de símbolos idénticos (bitmaps, gráficos simples).`,
      ),
      codeLine: 18,
      variables: {
        originalLen,
        encodedLen,
        tokens: tokens.length,
        saving: `${savingPct}%`,
      },
      consoleOutput: [
        `tokens: ${JSON.stringify(tokens.map((t) => [t.char, t.count]))}`,
        `${originalLen} chars → "${encoded}" (${encodedLen} chars)`,
      ],
    })

    return steps
  },
}

// ============================================================
// LZ77
// ============================================================

const lz77: Algorithm = {
  id: 'lz77',
  name: 'LZ77',
  category: 'Compression',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `function lz77Compress(text, windowSize = 6) {
  const tokens = [];
  let i = 0;

  while (i < text.length) {
    const windowStart = Math.max(0, i - windowSize);
    let bestOffset = 0;
    let bestLength = 0;

    // Search the sliding window for the longest match
    for (let j = windowStart; j < i; j++) {
      let length = 0;
      while (
        i + length < text.length &&
        length < windowSize &&
        text[j + length] === text[i + length]
      ) {
        length++;
      }
      if (length > bestLength) {
        bestLength = length;
        bestOffset = i - j; // distance back into the window
      }
    }

    const next = text[i + bestLength] ?? '';
    tokens.push({ offset: bestOffset, length: bestLength, next });
    i += bestLength + (next ? 1 : 0);
  }

  return tokens;
}

lz77Compress('aacaacabcaba');`,

  generateSteps(locale = 'en') {
    const TEXT = 'aacaacabcaba'
    const WINDOW = 6
    const steps: Step[] = []
    const tokens: Lz77State['tokens'] = []

    const snap = (extra: {
      phase: Lz77State['phase']
      position: number
      windowStart: number
      charStates: Lz77State['charStates']
      match?: Lz77State['match']
      tokens: Lz77State['tokens']
      summary?: Lz77State['summary']
      operation?: string
    }): Lz77State => ({
      type: 'lz77',
      text: TEXT,
      windowSize: WINDOW,
      ...extra,
    })

    const buildStates = (
      position: number,
      windowStart: number,
      opts: {
        matchStart?: number
        matchLen?: number
        lookLen?: number
      } = {},
    ): Lz77State['charStates'] => {
      const s: Lz77State['charStates'] = {}
      const lookEnd = Math.min(
        TEXT.length - 1,
        position + (opts.lookLen ?? Math.min(WINDOW, TEXT.length - position)) - 1,
      )
      for (let k = 0; k < TEXT.length; k++) {
        if (k < position && k < windowStart) s[k] = 'encoded'
        else if (k >= windowStart && k < position) s[k] = 'window'
        else if (k >= position && k <= lookEnd) s[k] = 'lookAhead'
        else if (k < position) s[k] = 'encoded'
        else s[k] = 'outside'
      }
      if (opts.matchStart != null && opts.matchLen != null && opts.matchLen > 0) {
        for (let k = 0; k < opts.matchLen; k++) {
          if (opts.matchStart + k < position) s[opts.matchStart + k] = 'match'
          if (position + k < TEXT.length) s[position + k] = 'match'
        }
      }
      if (position < TEXT.length) s[position] = s[position] === 'match' ? 'match' : 'current'
      return s
    }

    steps.push({
      concept: snap({
        phase: 'search',
        position: 0,
        windowStart: 0,
        charStates: buildStates(0, 0),
        tokens: [],
        match: null,
        operation: d(locale, 'Input', 'Entrada'),
      }),
      description: d(
        locale,
        `Compress "${TEXT}" with LZ77 (window size ${WINDOW}). Emit (offset, length, next) triples: copy from the sliding window, then a literal.`,
        `Comprimir "${TEXT}" con LZ77 (ventana ${WINDOW}). Emitir triples (offset, longitud, siguiente): copiar desde la ventana deslizante y luego un literal.`,
      ),
      codeLine: 1,
      variables: { text: TEXT, windowSize: WINDOW },
    })

    let i = 0
    while (i < TEXT.length) {
      const windowStart = Math.max(0, i - WINDOW)

      steps.push({
        concept: snap({
          phase: 'search',
          position: i,
          windowStart,
          charStates: buildStates(i, windowStart),
          tokens: tokens.map((t) => ({ ...t })),
          match: null,
          operation: d(locale, 'Search the window', 'Buscar en la ventana'),
        }),
        description: d(
          locale,
          `Cursor at index ${i} ('${TEXT[i]}'). Search buffer [${windowStart}..${i - 1}] for the longest prefix of the look-ahead.`,
          `Cursor en el índice ${i} ('${TEXT[i]}'). Buscar en el buffer [${windowStart}..${i - 1}] el prefijo más largo del look-ahead.`,
        ),
        codeLine: 6,
        variables: { i, windowStart, char: TEXT[i] },
      })

      let bestOffset = 0
      let bestLength = 0
      let bestJ = -1

      for (let j = windowStart; j < i; j++) {
        let length = 0
        while (
          i + length < TEXT.length &&
          length < WINDOW &&
          TEXT[j + length] === TEXT[i + length]
        ) {
          length++
        }
        if (length > bestLength) {
          bestLength = length
          bestOffset = i - j
          bestJ = j
        }
      }

      if (bestLength > 0) {
        steps.push({
          concept: snap({
            phase: 'match',
            position: i,
            windowStart,
            charStates: buildStates(i, windowStart, {
              matchStart: bestJ,
              matchLen: bestLength,
              lookLen: bestLength + 1,
            }),
            tokens: tokens.map((t) => ({ ...t })),
            match: {
              offset: bestOffset,
              length: bestLength,
              next: TEXT[i + bestLength] ?? '',
            },
            operation: d(locale, 'Longest match', 'Coincidencia más larga'),
          }),
          description: d(
            locale,
            `Best match: ${bestLength} char${bestLength === 1 ? '' : 's'} at offset ${bestOffset} (starts at index ${bestJ}: "${TEXT.slice(bestJ, bestJ + bestLength)}").`,
            `Mejor coincidencia: ${bestLength} carácter${bestLength === 1 ? '' : 'es'} a offset ${bestOffset} (empieza en ${bestJ}: "${TEXT.slice(bestJ, bestJ + bestLength)}").`,
          ),
          codeLine: 20,
          variables: { offset: bestOffset, length: bestLength, matchAt: bestJ },
        })
      } else {
        steps.push({
          concept: snap({
            phase: 'match',
            position: i,
            windowStart,
            charStates: buildStates(i, windowStart, { lookLen: 1 }),
            tokens: tokens.map((t) => ({ ...t })),
            match: { offset: 0, length: 0, next: TEXT[i] ?? '' },
            operation: d(locale, 'No match', 'Sin coincidencia'),
          }),
          description: d(
            locale,
            `No match in the window. Emit a pure literal for '${TEXT[i]}' as (0, 0, '${TEXT[i]}').`,
            `Sin coincidencia en la ventana. Emitir un literal puro para '${TEXT[i]}' como (0, 0, '${TEXT[i]}').`,
          ),
          codeLine: 20,
          variables: { offset: 0, length: 0, next: TEXT[i] },
        })
      }

      const next = TEXT[i + bestLength] ?? ''
      tokens.push({ offset: bestOffset, length: bestLength, next })
      const advance = bestLength + (next ? 1 : 0)
      const newPos = i + advance
      const newWindowStart = Math.max(0, newPos - WINDOW)

      steps.push({
        concept: snap({
          phase: 'emit',
          position: newPos,
          windowStart: newWindowStart,
          charStates: buildStates(newPos, newWindowStart),
          tokens: tokens.map((t, idx) => ({ ...t, active: idx === tokens.length - 1 })),
          match: { offset: bestOffset, length: bestLength, next },
          operation: d(locale, 'Emit triple', 'Emitir triple'),
        }),
        description: d(
          locale,
          `Emit (${bestOffset}, ${bestLength}, '${next || '∅'}'). Advance cursor by ${advance} to index ${newPos}.`,
          `Emitir (${bestOffset}, ${bestLength}, '${next || '∅'}'). Avanzar el cursor ${advance} hasta el índice ${newPos}.`,
        ),
        codeLine: 26,
        variables: {
          offset: bestOffset,
          length: bestLength,
          next: next || 'EOF',
          i: newPos,
        },
      })

      i = newPos
    }

    const matches = tokens.filter((t) => t.length > 0).length
    const literals = tokens.length

    steps.push({
      concept: snap({
        phase: 'done',
        position: TEXT.length,
        windowStart: Math.max(0, TEXT.length - WINDOW),
        charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'encoded' as const])),
        tokens: tokens.map((t) => ({ ...t })),
        match: null,
        summary: {
          originalLen: TEXT.length,
          tokenCount: tokens.length,
          literals,
          matches,
        },
        operation: d(locale, 'Done', 'Listo'),
      }),
      description: d(
        locale,
        `LZ77 finished: ${TEXT.length} characters → ${tokens.length} triples (${matches} with a back-reference). Foundation of DEFLATE (gzip, ZIP, PNG).`,
        `LZ77 terminado: ${TEXT.length} caracteres → ${tokens.length} triples (${matches} con referencia). Base de DEFLATE (gzip, ZIP, PNG).`,
      ),
      codeLine: 31,
      variables: {
        originalLen: TEXT.length,
        tokens: tokens.length,
        matches,
      },
      consoleOutput: [
        `tokens: ${tokens.map((t) => `(${t.offset},${t.length},'${t.next}')`).join(' ')}`,
        `${TEXT.length} chars → ${tokens.length} triples`,
      ],
    })

    return steps
  },
}

// ============================================================
// LZW
// ============================================================

const lzw: Algorithm = {
  id: 'lzw',
  name: 'LZW',
  category: 'Compression',
  difficulty: 'intermediate',
  visualization: 'concept',
  code: `function lzwCompress(text) {
  // Seed the dictionary with every unique character
  const dict = {};
  let nextCode = 0;
  for (const ch of text) {
    if (dict[ch] === undefined) dict[ch] = nextCode++;
  }

  const output = [];
  let w = '';

  for (const c of text) {
    const wc = w + c;
    if (dict[wc] !== undefined) {
      w = wc;                 // phrase still in the dictionary
    } else {
      output.push(dict[w]);   // emit code for w
      dict[wc] = nextCode++;  // learn the new phrase
      w = c;
    }
  }

  if (w) output.push(dict[w]);
  return output;
}

lzwCompress('TOBEORNOTTOBE');`,

  generateSteps(locale = 'en') {
    const TEXT = 'TOBEORNOTTOBE'
    const steps: Step[] = []
    const dict = new Map<string, number>()
    let nextCode = 0
    const output: LzwState['output'] = []
    let phraseStart = 0 // start index of current `w` in TEXT

    const dictRows = (): LzwState['dictionary'] =>
      [...dict.entries()].sort((a, b) => a[1] - b[1]).map(([entry, code]) => ({ code, entry }))

    const snap = (extra: {
      phase: LzwState['phase']
      position: number
      current: string
      candidate?: string | null
      charStates: LzwState['charStates']
      dictionary: LzwState['dictionary']
      output: LzwState['output']
      summary?: LzwState['summary']
      operation?: string
    }): LzwState => ({
      type: 'lzw',
      text: TEXT,
      ...extra,
    })

    const buildStates = (
      doneUntil: number,
      phraseFrom: number,
      phraseTo: number,
      currentIdx: number | null,
    ): LzwState['charStates'] => {
      const s: LzwState['charStates'] = {}
      for (let k = 0; k < TEXT.length; k++) {
        if (k < doneUntil) s[k] = 'done'
        else if (k >= phraseFrom && k < phraseTo) s[k] = 'inPhrase'
        else if (currentIdx != null && k === currentIdx) s[k] = 'current'
        else s[k] = 'default'
      }
      return s
    }

    // Seed dictionary
    for (const ch of TEXT) {
      if (!dict.has(ch)) dict.set(ch, nextCode++)
    }

    steps.push({
      concept: snap({
        phase: 'init',
        position: 0,
        current: '',
        candidate: null,
        charStates: buildStates(0, 0, 0, null),
        dictionary: dictRows(),
        output: [],
        operation: d(locale, 'Seed dictionary', 'Sembrar diccionario'),
      }),
      description: d(
        locale,
        `Compress "${TEXT}" with LZW. Seed the dictionary with every unique character (${dict.size} symbols), then grow it with longer phrases as we scan.`,
        `Comprimir "${TEXT}" con LZW. Sembrar el diccionario con cada carácter único (${dict.size} símbolos) y crecerlo con frases más largas al escanear.`,
      ),
      codeLine: 3,
      variables: { text: TEXT, dictSize: dict.size },
    })

    let w = ''
    for (let i = 0; i < TEXT.length; i++) {
      const c = TEXT[i]
      const wc = w + c

      steps.push({
        concept: snap({
          phase: 'scan',
          position: i,
          current: w,
          candidate: wc,
          charStates: buildStates(phraseStart, phraseStart, phraseStart + w.length, i),
          dictionary: dictRows().map((row) => ({
            ...row,
            active: row.entry === w || row.entry === wc || row.entry === c,
          })),
          output: output.map((o) => ({ ...o })),
          operation: d(locale, 'Read next char', 'Leer siguiente carácter'),
        }),
        description: d(
          locale,
          w
            ? `Current phrase w = "${w}". Append '${c}' → candidate "${wc}".`
            : `Start with empty w. Append '${c}' → candidate "${wc}".`,
          w
            ? `Frase actual w = "${w}". Añadir '${c}' → candidato "${wc}".`
            : `Empezar con w vacío. Añadir '${c}' → candidato "${wc}".`,
        ),
        codeLine: 13,
        variables: { i, w: w || '∅', c, wc },
      })

      if (dict.has(wc)) {
        w = wc
        steps.push({
          concept: snap({
            phase: 'scan',
            position: i,
            current: w,
            candidate: wc,
            charStates: buildStates(phraseStart, phraseStart, phraseStart + w.length, null),
            dictionary: dictRows().map((row) => ({
              ...row,
              active: row.entry === w,
            })),
            output: output.map((o) => ({ ...o })),
            operation: d(locale, 'Phrase known', 'Frase conocida'),
          }),
          description: d(
            locale,
            `"${wc}" is already in the dictionary (code ${dict.get(wc)}). Keep extending w.`,
            `"${wc}" ya está en el diccionario (código ${dict.get(wc)}). Seguir extendiendo w.`,
          ),
          codeLine: 15,
          variables: { w, code: dict.get(wc)! },
        })
      } else {
        const code = dict.get(w)!
        output.push({ code, entry: w })
        const newCode = nextCode
        dict.set(wc, nextCode++)

        steps.push({
          concept: snap({
            phase: 'output',
            position: i,
            current: w,
            candidate: wc,
            charStates: buildStates(phraseStart, phraseStart, phraseStart + w.length, i),
            dictionary: dictRows().map((row) => ({
              ...row,
              active: row.entry === w,
            })),
            output: output.map((o, idx) => ({ ...o, active: idx === output.length - 1 })),
            operation: d(locale, 'Emit code', 'Emitir código'),
          }),
          description: d(
            locale,
            `"${wc}" is new. Emit code ${code} for w = "${w}".`,
            `"${wc}" es nueva. Emitir código ${code} para w = "${w}".`,
          ),
          codeLine: 17,
          variables: { emit: code, w },
        })

        steps.push({
          concept: snap({
            phase: 'add',
            position: i,
            current: c,
            candidate: wc,
            charStates: buildStates(i, i, i, i),
            dictionary: dictRows().map((row) => ({
              ...row,
              active: row.entry === wc,
              isNew: row.entry === wc,
            })),
            output: output.map((o) => ({ ...o })),
            operation: d(locale, 'Learn phrase', 'Aprender frase'),
          }),
          description: d(
            locale,
            `Add "${wc}" to the dictionary as code ${newCode}. Reset w to '${c}'.`,
            `Añadir "${wc}" al diccionario como código ${newCode}. Reiniciar w a '${c}'.`,
          ),
          codeLine: 18,
          variables: { newEntry: wc, newCode, w: c },
        })

        phraseStart = i
        w = c
      }
    }

    if (w) {
      const code = dict.get(w)!
      output.push({ code, entry: w })
      steps.push({
        concept: snap({
          phase: 'output',
          position: TEXT.length - 1,
          current: w,
          candidate: null,
          charStates: buildStates(phraseStart, phraseStart, TEXT.length, null),
          dictionary: dictRows().map((row) => ({
            ...row,
            active: row.entry === w,
          })),
          output: output.map((o, idx) => ({ ...o, active: idx === output.length - 1 })),
          operation: d(locale, 'Flush last phrase', 'Vaciar última frase'),
        }),
        description: d(
          locale,
          `End of input. Emit remaining code ${code} for w = "${w}".`,
          `Fin de la entrada. Emitir el código restante ${code} para w = "${w}".`,
        ),
        codeLine: 23,
        variables: { emit: code, w },
      })
    }

    steps.push({
      concept: snap({
        phase: 'done',
        position: TEXT.length,
        current: '',
        candidate: null,
        charStates: buildStates(TEXT.length, 0, 0, null),
        dictionary: dictRows(),
        output: output.map((o) => ({ ...o })),
        summary: {
          originalLen: TEXT.length,
          codeCount: output.length,
          dictSize: dict.size,
        },
        operation: d(locale, 'Done', 'Listo'),
      }),
      description: d(
        locale,
        `LZW finished: ${TEXT.length} characters → ${output.length} codes, dictionary grew to ${dict.size} entries. Used in GIF and classic Unix compress.`,
        `LZW terminado: ${TEXT.length} caracteres → ${output.length} códigos; el diccionario creció a ${dict.size} entradas. Usado en GIF y el compress clásico de Unix.`,
      ),
      codeLine: 24,
      variables: {
        originalLen: TEXT.length,
        codes: output.length,
        dictSize: dict.size,
      },
      consoleOutput: [
        `codes: [${output.map((o) => o.code).join(', ')}]`,
        `dict size: ${dict.size}`,
      ],
    })

    return steps
  },
}

// ============================================================
// DEFLATE (gzip engine) — LZ77 + Huffman pipeline
// ============================================================

type HuffTree = { freq: number; sym?: string; left?: HuffTree; right?: HuffTree }

/** Canonical-style codes for a symbol frequency map (left=0, right=1). */
function huffmanCodesFor(freq: Map<string, number>): Map<string, string> {
  const entries = [...freq.entries()]
  if (entries.length === 0) return new Map()
  if (entries.length === 1) return new Map([[entries[0][0], '0']])

  let forest: HuffTree[] = entries.map(([sym, f]) => ({ freq: f, sym }))
  while (forest.length > 1) {
    forest.sort((a, b) => a.freq - b.freq)
    const left = forest.shift()!
    const right = forest.shift()!
    forest.push({ freq: left.freq + right.freq, left, right })
  }
  const root = forest[0]
  const codes = new Map<string, string>()
  const walk = (node: HuffTree, code: string) => {
    if (node.sym !== undefined) {
      codes.set(node.sym, code || '0')
      return
    }
    if (node.left) walk(node.left, code + '0')
    if (node.right) walk(node.right, code + '1')
  }
  walk(root, '')
  return codes
}

const deflate: Algorithm = {
  id: 'deflate',
  name: 'DEFLATE',
  category: 'Compression',
  difficulty: 'advanced',
  visualization: 'concept',
  code: `// DEFLATE = LZ77 + Huffman  (engine inside gzip / ZIP / PNG)
function deflateCompress(text, windowSize = 6) {
  // ── Stage 1: LZ77 dictionary matches ──
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const windowStart = Math.max(0, i - windowSize);
    let bestOffset = 0, bestLength = 0;
    for (let j = windowStart; j < i; j++) {
      let length = 0;
      while (
        i + length < text.length &&
        length < windowSize &&
        text[j + length] === text[i + length]
      ) length++;
      if (length > bestLength) {
        bestLength = length;
        bestOffset = i - j;
      }
    }
    const next = text[i + bestLength] ?? '';
    tokens.push({ offset: bestOffset, length: bestLength, next });
    i += bestLength + (next ? 1 : 0);
  }

  // ── Stage 2: Flatten to a symbol stream ──
  // Match → "M{len}@{offset}", literal → the character
  const symbols = [];
  for (const t of tokens) {
    if (t.length > 0) symbols.push(\`M\${t.length}@\${t.offset}\`);
    if (t.next) symbols.push(t.next);
  }

  // ── Stage 3: Huffman codes for those symbols ──
  const freq = {};
  for (const s of symbols) freq[s] = (freq[s] || 0) + 1;
  const codes = buildHuffman(freq); // shorter codes for frequent symbols

  // ── Stage 4: Bitstream ──
  const bits = symbols.map((s) => codes[s]).join('');
  return { tokens, symbols, codes, bits };
}

deflateCompress('aacaacabcaba');`,

  generateSteps(locale = 'en') {
    const TEXT = 'aacaacabcaba'
    const WINDOW = 6
    const steps: Step[] = []

    const stageBar = (
      active: DeflateState['stages'][number]['id'] | null,
      doneUpTo?: DeflateState['stages'][number]['id'],
    ): DeflateState['stages'] => {
      const order: DeflateState['stages'][number]['id'][] = ['lz77', 'symbols', 'huffman', 'bits']
      const labels = {
        lz77: 'LZ77',
        symbols: d(locale, 'Symbols', 'Símbolos'),
        huffman: 'Huffman',
        bits: d(locale, 'Bits', 'Bits'),
      }
      const doneIdx = doneUpTo ? order.indexOf(doneUpTo) : -1
      return order.map((id, idx) => ({
        id,
        label: labels[id],
        state: id === active ? 'active' : idx <= doneIdx ? 'done' : 'pending',
      }))
    }

    const snap = (extra: Omit<DeflateState, 'type' | 'text' | 'windowSize'>): DeflateState => ({
      type: 'deflate',
      text: TEXT,
      windowSize: WINDOW,
      ...extra,
    })

    const buildCharStates = (
      position: number,
      windowStart: number,
      match?: { j: number; length: number } | null,
    ): DeflateState['charStates'] => {
      const s: DeflateState['charStates'] = {}
      for (let k = 0; k < TEXT.length; k++) {
        if (k < position && k < windowStart) s[k] = 'encoded'
        else if (k >= windowStart && k < position) s[k] = 'window'
        else if (k >= position && k < position + WINDOW) s[k] = 'lookAhead'
        else if (k < position) s[k] = 'encoded'
        else s[k] = 'outside'
      }
      if (match && match.length > 0) {
        for (let k = 0; k < match.length; k++) {
          if (match.j + k < position) s[match.j + k] = 'match'
          if (position + k < TEXT.length) s[position + k] = 'match'
        }
      }
      if (position < TEXT.length && s[position] !== 'match') s[position] = 'current'
      return s
    }

    // Intro
    steps.push({
      concept: snap({
        phase: 'intro',
        stages: stageBar(null),
        position: 0,
        windowStart: 0,
        charStates: buildCharStates(0, 0),
        match: null,
        tokens: [],
        symbols: [],
        operation: d(locale, 'Pipeline', 'Pipeline'),
      }),
      description: d(
        locale,
        `DEFLATE is the engine inside gzip, ZIP, and PNG: first find repeats with LZ77, then squeeze the result with Huffman. Compress "${TEXT}".`,
        `DEFLATE es el motor de gzip, ZIP y PNG: primero encuentra repeticiones con LZ77 y luego comprime el resultado con Huffman. Comprimir "${TEXT}".`,
      ),
      codeLine: 1,
      variables: { text: TEXT, windowSize: WINDOW },
    })

    // Stage 1: LZ77 (one step per token — coarser than the dedicated LZ77 page)
    const tokens: DeflateState['tokens'] = []
    let i = 0
    while (i < TEXT.length) {
      const windowStart = Math.max(0, i - WINDOW)
      let bestOffset = 0
      let bestLength = 0
      let bestJ = -1
      for (let j = windowStart; j < i; j++) {
        let length = 0
        while (
          i + length < TEXT.length &&
          length < WINDOW &&
          TEXT[j + length] === TEXT[i + length]
        ) {
          length++
        }
        if (length > bestLength) {
          bestLength = length
          bestOffset = i - j
          bestJ = j
        }
      }
      const next = TEXT[i + bestLength] ?? ''
      tokens.push({ offset: bestOffset, length: bestLength, next })
      const advance = bestLength + (next ? 1 : 0)
      const newPos = i + advance

      steps.push({
        concept: snap({
          phase: 'lz77',
          stages: stageBar('lz77'),
          position: newPos,
          windowStart: Math.max(0, newPos - WINDOW),
          charStates: buildCharStates(
            i,
            windowStart,
            bestLength > 0 ? { j: bestJ, length: bestLength } : null,
          ),
          match: { offset: bestOffset, length: bestLength, next },
          tokens: tokens.map((t, idx) => ({ ...t, active: idx === tokens.length - 1 })),
          symbols: [],
          operation: d(locale, 'LZ77 match', 'Coincidencia LZ77'),
        }),
        description: d(
          locale,
          bestLength > 0
            ? `LZ77: match length ${bestLength} at offset ${bestOffset}, then literal '${next || '∅'}'. Token (${bestOffset}, ${bestLength}, '${next || '∅'}').`
            : `LZ77: no window match — pure literal '${next}' as (0, 0, '${next}').`,
          bestLength > 0
            ? `LZ77: coincidencia de longitud ${bestLength} a offset ${bestOffset}, luego literal '${next || '∅'}'. Token (${bestOffset}, ${bestLength}, '${next || '∅'}').`
            : `LZ77: sin coincidencia — literal puro '${next}' como (0, 0, '${next}').`,
        ),
        codeLine: 22,
        variables: { offset: bestOffset, length: bestLength, next: next || 'EOF' },
      })

      i = newPos
    }

    // Stage 2: Flatten to symbols
    const symbols: DeflateState['symbols'] = []
    for (const t of tokens) {
      if (t.length > 0) {
        symbols.push({ label: `M${t.length}@${t.offset}`, kind: 'match' })
      }
      if (t.next) {
        symbols.push({ label: t.next, kind: 'literal' })
      }
    }

    steps.push({
      concept: snap({
        phase: 'symbols',
        stages: stageBar('symbols', 'lz77'),
        position: TEXT.length,
        windowStart: Math.max(0, TEXT.length - WINDOW),
        charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'encoded' as const])),
        match: null,
        tokens: tokens.map((t) => ({ ...t })),
        symbols: symbols.map((s) => ({ ...s })),
        operation: d(locale, 'Symbol stream', 'Flujo de símbolos'),
      }),
      description: d(
        locale,
        `Flatten ${tokens.length} LZ77 tokens into ${symbols.length} symbols: matches become M{len}@{offset}, literals stay as characters. This stream is what Huffman will code.`,
        `Aplanar ${tokens.length} tokens LZ77 en ${symbols.length} símbolos: las coincidencias pasan a M{len}@{offset}, los literales quedan como caracteres. Este flujo es lo que Huffman codificará.`,
      ),
      codeLine: 28,
      variables: { tokens: tokens.length, symbols: symbols.length },
    })

    // Highlight symbols one by one while building freq
    const freq = new Map<string, number>()
    const revealed: DeflateState['symbols'] = []
    for (const sym of symbols) {
      revealed.push(sym)
      freq.set(sym.label, (freq.get(sym.label) ?? 0) + 1)
      steps.push({
        concept: snap({
          phase: 'symbols',
          stages: stageBar('symbols', 'lz77'),
          position: TEXT.length,
          windowStart: Math.max(0, TEXT.length - WINDOW),
          charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'encoded' as const])),
          match: null,
          tokens: tokens.map((t) => ({ ...t })),
          symbols: revealed.map((s, idx) => ({
            ...s,
            active: idx === revealed.length - 1,
          })),
          freqTable: [...freq.entries()]
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
            .map(([symbol, f]) => ({
              symbol,
              freq: f,
              active: symbol === sym.label,
            })),
          operation: d(locale, 'Count frequencies', 'Contar frecuencias'),
        }),
        description: d(
          locale,
          `Symbol "${sym.label}" (${sym.kind}). Frequency of "${sym.label}" is now ${freq.get(sym.label)}.`,
          `Símbolo "${sym.label}" (${sym.kind === 'match' ? 'coincidencia' : 'literal'}). La frecuencia de "${sym.label}" es ahora ${freq.get(sym.label)}.`,
        ),
        codeLine: 36,
        variables: { symbol: sym.label, freq: freq.get(sym.label)! },
      })
    }

    // Stage 3: Huffman codes
    const codes = huffmanCodesFor(freq)
    const freqTable = [...freq.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([symbol, f]) => ({
        symbol,
        freq: f,
        code: codes.get(symbol) ?? '',
      }))

    steps.push({
      concept: snap({
        phase: 'huffman',
        stages: stageBar('huffman', 'symbols'),
        position: TEXT.length,
        windowStart: Math.max(0, TEXT.length - WINDOW),
        charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'encoded' as const])),
        match: null,
        tokens: tokens.map((t) => ({ ...t })),
        symbols: symbols.map((s) => ({ ...s })),
        freqTable: freqTable.map((r) => ({ ...r })),
        operation: d(locale, 'Huffman codes', 'Códigos Huffman'),
      }),
      description: d(
        locale,
        `Build a Huffman tree over the ${freq.size} distinct symbols. Frequent symbols get short bit codes — same idea as the Huffman page, but on the LZ77 stream, not raw characters.`,
        `Construir un árbol de Huffman sobre los ${freq.size} símbolos distintos. Los frecuentes reciben códigos cortos — la misma idea que en Huffman, pero sobre el flujo LZ77, no sobre caracteres crudos.`,
      ),
      codeLine: 37,
      variables: { uniqueSymbols: freq.size },
    })

    for (const row of freqTable) {
      steps.push({
        concept: snap({
          phase: 'huffman',
          stages: stageBar('huffman', 'symbols'),
          position: TEXT.length,
          windowStart: Math.max(0, TEXT.length - WINDOW),
          charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'encoded' as const])),
          match: null,
          tokens: tokens.map((t) => ({ ...t })),
          symbols: symbols.map((s) => ({ ...s, active: s.label === row.symbol })),
          freqTable: freqTable.map((r) => ({ ...r, active: r.symbol === row.symbol })),
          operation: d(locale, 'Assign code', 'Asignar código'),
        }),
        description: d(
          locale,
          `"${row.symbol}" (×${row.freq}) → code ${row.code} (${row.code.length} bit${row.code.length === 1 ? '' : 's'}).`,
          `"${row.symbol}" (×${row.freq}) → código ${row.code} (${row.code.length} bit${row.code.length === 1 ? '' : 's'}).`,
        ),
        codeLine: 37,
        variables: { symbol: row.symbol, code: row.code, bits: row.code.length },
      })
    }

    // Stage 4: Encode
    const bitParts = symbols.map((s) => codes.get(s.label)!)
    const encodedBits = bitParts.join('')
    const originalBits = TEXT.length * 8
    // Fixed-width encoding of symbols (ceil log2 of alphabet) as a mid baseline
    const fixedWidth = Math.max(1, Math.ceil(Math.log2(Math.max(2, freq.size))))
    const fixedBits = symbols.length * fixedWidth
    const deflateBits = encodedBits.length
    const savingPct = Math.round((1 - deflateBits / originalBits) * 100)

    steps.push({
      concept: snap({
        phase: 'encode',
        stages: stageBar('bits', 'huffman'),
        position: TEXT.length,
        windowStart: Math.max(0, TEXT.length - WINDOW),
        charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'encoded' as const])),
        match: null,
        tokens: tokens.map((t) => ({ ...t })),
        symbols: symbols.map((s) => ({ ...s })),
        freqTable: freqTable.map((r) => ({ ...r })),
        encodedBits,
        operation: d(locale, 'Emit bitstream', 'Emitir bits'),
      }),
      description: d(
        locale,
        `Replace every symbol with its Huffman code. Stream length: ${deflateBits} bits (vs ${originalBits} as 8-bit ASCII, vs ~${fixedBits} with fixed-width symbol codes).`,
        `Sustituir cada símbolo por su código Huffman. Longitud del flujo: ${deflateBits} bits (frente a ${originalBits} en ASCII de 8 bits, o ~${fixedBits} con códigos de ancho fijo).`,
      ),
      codeLine: 40,
      variables: { bits: deflateBits, symbols: symbols.length },
    })

    steps.push({
      concept: snap({
        phase: 'done',
        stages: stageBar(null, 'bits'),
        position: TEXT.length,
        windowStart: Math.max(0, TEXT.length - WINDOW),
        charStates: Object.fromEntries([...TEXT].map((_, idx) => [idx, 'encoded' as const])),
        match: null,
        tokens: tokens.map((t) => ({ ...t })),
        symbols: symbols.map((s) => ({ ...s })),
        freqTable: freqTable.map((r) => ({ ...r })),
        encodedBits,
        summary: {
          originalBits,
          lz77Symbols: symbols.length,
          fixedBits,
          deflateBits,
          savingPct,
        },
        operation: d(locale, 'Done · gzip engine', 'Listo · motor gzip'),
      }),
      description: d(
        locale,
        `DEFLATE done: ${originalBits} → ${deflateBits} bits (~${savingPct}% smaller). Real gzip wraps this stream with a header and CRC; ZIP and PNG use the same idea. See also the dedicated LZ77 and Huffman pages.`,
        `DEFLATE listo: ${originalBits} → ${deflateBits} bits (~${savingPct}% más chico). gzip real envuelve este flujo con cabecera y CRC; ZIP y PNG usan la misma idea. Ver también las páginas de LZ77 y Huffman.`,
      ),
      codeLine: 41,
      variables: {
        originalBits,
        deflateBits,
        saving: `${savingPct}%`,
      },
      consoleOutput: [
        `symbols: ${symbols.map((s) => s.label).join(' ')}`,
        `${originalBits} bits ASCII → ${deflateBits} bits DEFLATE (${savingPct}% smaller)`,
      ],
    })

    return steps
  },
}

// ============================================================
// BROTLI — static dictionary + LZ + entropy (pedagogical)
// ============================================================

const brotli: Algorithm = {
  id: 'brotli',
  name: 'Brotli',
  category: 'Compression',
  difficulty: 'advanced',
  visualization: 'concept',
  code: `// Pedagogical Brotli: static dict → LZ back-ref → Huffman
function brotliCompress(text, dictionary) {
  // Prefer longer dictionary phrases (real Brotli ships ~120KB of web words)
  const dict = [...dictionary].sort((a, b) => b.length - a.length);
  const commands = [];
  let i = 0;

  while (i < text.length) {
    // 1) Static dictionary hit?
    let hit = null;
    for (const word of dict) {
      if (text.startsWith(word, i)) { hit = word; break; }
    }
    if (hit) {
      commands.push({ type: 'dict', value: hit });
      i += hit.length;
      continue;
    }

    // 2) LZ-style back-reference into already-seen text
    let bestOffset = 0, bestLength = 0;
    for (let j = 0; j < i; j++) {
      let length = 0;
      while (
        i + length < text.length &&
        text[j + length] === text[i + length]
      ) length++;
      if (length > bestLength && length >= 3) {
        bestLength = length;
        bestOffset = i - j;
      }
    }
    if (bestLength >= 3) {
      commands.push({ type: 'match', offset: bestOffset, length: bestLength });
      i += bestLength;
      continue;
    }

    // 3) Literal byte
    commands.push({ type: 'lit', value: text[i] });
    i++;
  }

  // Entropy stage: Huffman over command labels
  const labels = commands.map(cmdLabel);
  const freq = {};
  for (const s of labels) freq[s] = (freq[s] || 0) + 1;
  const codes = buildHuffman(freq);
  const bits = labels.map((s) => codes[s]).join('');
  return { commands, codes, bits };
}

brotliCompress(
  'https://www.example.com/https://www.example.com/x',
  ['https://', 'www.', 'example', '.com/', '/']
);`,

  generateSteps(locale = 'en') {
    const TEXT = 'https://www.example.com/https://www.example.com/x'
    const DICT_RAW = ['https://', 'www.', 'example', '.com/', '/']
    const DICT = [...DICT_RAW].sort((a, b) => b.length - a.length)
    const steps: Step[] = []

    const stageBar = (
      active: BrotliState['stages'][number]['id'] | null,
      doneUpTo?: BrotliState['stages'][number]['id'],
    ): BrotliState['stages'] => {
      const order: BrotliState['stages'][number]['id'][] = ['dict', 'scan', 'entropy', 'bits']
      const labels = {
        dict: d(locale, 'Dictionary', 'Diccionario'),
        scan: d(locale, 'Scan', 'Escaneo'),
        entropy: d(locale, 'Entropy', 'Entropía'),
        bits: d(locale, 'Bits', 'Bits'),
      }
      const doneIdx = doneUpTo ? order.indexOf(doneUpTo) : -1
      return order.map((id, idx) => ({
        id,
        label: labels[id],
        state: id === active ? 'active' : idx <= doneIdx ? 'done' : 'pending',
      }))
    }

    const dictRows = (active?: string, used = new Set<string>()): BrotliState['dictionary'] =>
      DICT.map((entry) => ({
        entry,
        active: entry === active,
        used: used.has(entry),
      }))

    const snap = (extra: Omit<BrotliState, 'type' | 'text'>): BrotliState => ({
      type: 'brotli',
      text: TEXT,
      ...extra,
    })

    const defaultStates = (): BrotliState['charStates'] => {
      const s: BrotliState['charStates'] = {}
      for (let k = 0; k < TEXT.length; k++) s[k] = 'default'
      return s
    }

    const paintDone = (
      until: number,
      consume?: { start: number; end: number; kind: 'dict' | 'match' | 'literal' },
      matchRange?: { start: number; end: number } | null,
    ): BrotliState['charStates'] => {
      const s = defaultStates()
      for (let k = 0; k < until; k++) s[k] = 'done'
      if (consume) {
        for (let k = consume.start; k < consume.end; k++) {
          s[k] = consume.kind === 'dict' ? 'dict' : consume.kind === 'match' ? 'match' : 'literal'
        }
      }
      if (matchRange) {
        for (let k = matchRange.start; k < matchRange.end; k++) {
          if (s[k] === 'done' || s[k] === 'default') s[k] = 'match'
        }
      }
      if (until < TEXT.length && !consume) s[until] = 'current'
      return s
    }

    const cmdLabel = (c: { kind: 'dict' | 'match' | 'literal'; label: string }) => c.label

    // Intro
    steps.push({
      concept: snap({
        phase: 'intro',
        stages: stageBar(null),
        position: 0,
        charStates: defaultStates(),
        dictionary: dictRows(),
        commands: [],
        matchRange: null,
        consumeRange: null,
        operation: d(locale, 'Why Brotli?', '¿Por qué Brotli?'),
      }),
      description: d(
        locale,
        `Brotli (Google, 2015) is what many HTTPS sites use today. Like DEFLATE it combines dictionary matches + entropy coding — but it also ships a static dictionary of common web phrases. Compress a URL-like string.`,
        `Brotli (Google, 2015) es lo que usan muchas webs HTTPS hoy. Como DEFLATE combina coincidencias de diccionario + codificación de entropía — pero además trae un diccionario estático de frases web comunes. Comprimir una cadena tipo URL.`,
      ),
      codeLine: 1,
      variables: { text: TEXT, dictSize: DICT.length },
    })

    // Show dictionary
    steps.push({
      concept: snap({
        phase: 'dict',
        stages: stageBar('dict'),
        position: 0,
        charStates: defaultStates(),
        dictionary: dictRows(),
        commands: [],
        matchRange: null,
        consumeRange: null,
        operation: d(locale, 'Static dictionary', 'Diccionario estático'),
      }),
      description: d(
        locale,
        `Seed a tiny static dictionary (real Brotli uses ~120KB of words, HTML tags, and URL pieces). Longer phrases win when several match. Ours: ${DICT.map((w) => `"${w}"`).join(', ')}.`,
        `Sembrar un diccionario estático pequeño (Brotli real usa ~120KB de palabras, tags HTML y trozos de URL). Ganan las frases más largas. El nuestro: ${DICT.map((w) => `"${w}"`).join(', ')}.`,
      ),
      codeLine: 3,
      variables: { entries: DICT.length },
    })

    const commands: BrotliState['commands'] = []
    const usedDict = new Set<string>()
    let pos = 0
    let dictHits = 0
    let lzHits = 0
    let literals = 0

    while (pos < TEXT.length) {
      // Dictionary
      let hit: string | null = null
      for (const word of DICT) {
        if (TEXT.startsWith(word, pos)) {
          hit = word
          break
        }
      }

      if (hit) {
        const end = pos + hit.length
        usedDict.add(hit)
        dictHits++
        const label = `D:${hit}`
        commands.push({ kind: 'dict', label })

        steps.push({
          concept: snap({
            phase: 'scan',
            stages: stageBar('scan', 'dict'),
            position: end,
            charStates: paintDone(pos, { start: pos, end, kind: 'dict' }),
            dictionary: dictRows(hit, usedDict),
            commands: commands.map((c, idx) => ({
              ...c,
              active: idx === commands.length - 1,
            })),
            matchRange: null,
            consumeRange: { start: pos, end },
            operation: d(locale, 'Dictionary hit', 'Acierto de diccionario'),
          }),
          description: d(
            locale,
            `At index ${pos}, dictionary phrase "${hit}" matches. Emit dict command — no need to rediscover this pattern with LZ.`,
            `En el índice ${pos}, la frase del diccionario "${hit}" coincide. Emitir comando dict — no hace falta redescubrir el patrón con LZ.`,
          ),
          codeLine: 15,
          variables: { i: pos, phrase: hit, len: hit.length },
        })

        pos = end
        continue
      }

      // LZ back-ref (min length 3)
      let bestOffset = 0
      let bestLength = 0
      let bestJ = -1
      for (let j = 0; j < pos; j++) {
        let length = 0
        while (pos + length < TEXT.length && TEXT[j + length] === TEXT[pos + length]) {
          length++
        }
        if (length > bestLength && length >= 3) {
          bestLength = length
          bestOffset = pos - j
          bestJ = j
        }
      }

      if (bestLength >= 3) {
        const end = pos + bestLength
        lzHits++
        const label = `M${bestLength}@${bestOffset}`
        commands.push({ kind: 'match', label })

        steps.push({
          concept: snap({
            phase: 'scan',
            stages: stageBar('scan', 'dict'),
            position: end,
            charStates: paintDone(
              pos,
              { start: pos, end, kind: 'match' },
              { start: bestJ, end: bestJ + bestLength },
            ),
            dictionary: dictRows(undefined, usedDict),
            commands: commands.map((c, idx) => ({
              ...c,
              active: idx === commands.length - 1,
            })),
            matchRange: { start: bestJ, end: bestJ + bestLength },
            consumeRange: { start: pos, end },
            operation: d(locale, 'LZ back-reference', 'Referencia LZ'),
          }),
          description: d(
            locale,
            `No dictionary word fits, but "${TEXT.slice(pos, end)}" already appeared ${bestOffset} chars back. Emit match (${bestLength} @ ${bestOffset}) — same idea as LZ77.`,
            `Ninguna palabra del diccionario encaja, pero "${TEXT.slice(pos, end)}" ya apareció ${bestOffset} caracteres atrás. Emitir match (${bestLength} @ ${bestOffset}) — la misma idea que LZ77.`,
          ),
          codeLine: 34,
          variables: { offset: bestOffset, length: bestLength },
        })

        pos = end
        continue
      }

      // Literal
      const ch = TEXT[pos]
      literals++
      const label = `L:${ch}`
      commands.push({ kind: 'literal', label })

      steps.push({
        concept: snap({
          phase: 'scan',
          stages: stageBar('scan', 'dict'),
          position: pos + 1,
          charStates: paintDone(pos, { start: pos, end: pos + 1, kind: 'literal' }),
          dictionary: dictRows(undefined, usedDict),
          commands: commands.map((c, idx) => ({
            ...c,
            active: idx === commands.length - 1,
          })),
          matchRange: null,
          consumeRange: { start: pos, end: pos + 1 },
          operation: d(locale, 'Literal', 'Literal'),
        }),
        description: d(
          locale,
          `Emit literal '${ch}' — nothing in the dictionary or recent text helps here.`,
          `Emitir literal '${ch}' — ni el diccionario ni el texto reciente ayudan aquí.`,
        ),
        codeLine: 40,
        variables: { i: pos, char: ch },
      })

      pos++
    }

    // Entropy coding
    const labels = commands.map(cmdLabel)
    const freq = new Map<string, number>()
    for (const s of labels) freq.set(s, (freq.get(s) ?? 0) + 1)
    const codes = huffmanCodesFor(freq)
    const codeRows = [...freq.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([symbol, f]) => ({
        symbol,
        freq: f,
        code: codes.get(symbol) ?? '',
      }))

    steps.push({
      concept: snap({
        phase: 'encode',
        stages: stageBar('entropy', 'scan'),
        position: TEXT.length,
        charStates: paintDone(TEXT.length),
        dictionary: dictRows(undefined, usedDict),
        commands: commands.map((c) => ({ ...c })),
        matchRange: null,
        consumeRange: null,
        codes: codeRows,
        operation: d(locale, 'Entropy coding', 'Codificación de entropía'),
      }),
      description: d(
        locale,
        `Scan finished: ${dictHits} dictionary hits, ${lzHits} back-references, ${literals} literals → ${commands.length} commands. Assign Huffman codes so frequent commands use fewer bits (real Brotli uses context-dependent codes).`,
        `Escaneo listo: ${dictHits} aciertos de diccionario, ${lzHits} referencias, ${literals} literales → ${commands.length} comandos. Asignar códigos Huffman para que los frecuentes usen menos bits (Brotli real usa códigos según contexto).`,
      ),
      codeLine: 48,
      variables: {
        commands: commands.length,
        dictHits,
        lzHits,
        literals,
      },
    })

    const encodedBits = labels.map((s) => codes.get(s)!).join('')
    const originalBits = TEXT.length * 8
    const brotliBits = encodedBits.length
    const savingPct = Math.round((1 - brotliBits / originalBits) * 100)

    steps.push({
      concept: snap({
        phase: 'done',
        stages: stageBar(null, 'bits'),
        position: TEXT.length,
        charStates: paintDone(TEXT.length),
        dictionary: dictRows(undefined, usedDict),
        commands: commands.map((c) => ({ ...c })),
        matchRange: null,
        consumeRange: null,
        codes: codeRows,
        encodedBits,
        summary: {
          originalBits,
          commandCount: commands.length,
          dictHits,
          lzHits,
          literals,
          brotliBits,
          savingPct,
        },
        operation: d(locale, 'Done', 'Listo'),
      }),
      description: d(
        locale,
        `Brotli-style pipeline: ${originalBits} → ${brotliBits} bits (~${savingPct}% smaller). Dictionary hits (${dictHits}) are why Brotli often beats gzip on HTML/CSS/JS — shared knowledge of the web, not just of this file. Used in HTTP Content-Encoding: br.`,
        `Pipeline estilo Brotli: ${originalBits} → ${brotliBits} bits (~${savingPct}% más chico). Los aciertos de diccionario (${dictHits}) explican por qué Brotli suele ganar a gzip en HTML/CSS/JS: conocimiento compartido de la web, no solo de este archivo. Usado en HTTP Content-Encoding: br.`,
      ),
      codeLine: 50,
      variables: {
        originalBits,
        brotliBits,
        saving: `${savingPct}%`,
        dictHits,
      },
      consoleOutput: [
        `commands: ${labels.join(' ')}`,
        `${originalBits} bits → ${brotliBits} bits (${savingPct}% smaller)`,
        `dict=${dictHits} lz=${lzHits} lit=${literals}`,
      ],
    })

    return steps
  },
}

export { huffmanCoding, runLengthEncoding, lz77, lzw, deflate, brotli }
