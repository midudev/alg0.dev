import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `DEFLATE

DEFLATE is the lossless compression engine inside gzip, ZIP, and PNG. It is not a single trick — it is a pipeline that combines two ideas you can study separately on this site: LZ77 dictionary matching and Huffman coding.

How it works:
1. LZ77 scan — find repeated substrings in a sliding window and emit (offset, length, next) tokens
2. Symbol stream — turn those tokens into a sequence of symbols (match markers + literals)
3. Huffman coding — build shorter bit codes for symbols that appear more often
4. Bitstream — replace each symbol with its code; gzip then wraps the stream with a header and checksum

Why it works:
  LZ77 removes redundancy that looks like "I already said this phrase." Huffman removes redundancy that looks like "some symbols are rare." Together they compress both structure and skew — far better than either alone on typical text and web assets.

Time Complexity:
  Dominated by match finding: O(n · W) naive, much faster with hash chains / lazy matching in real gzip
  Huffman stage: O(k log k) for k distinct symbols in the block

Space Complexity: O(W + k) for the window and code tables

Properties:
  - Lossless block compressor (RFC 1951)
  - Used by gzip (RFC 1952), zlib, ZIP, and PNG IDAT
  - Real implementations use dynamic or fixed Huffman trees and separate distance codes — this page teaches the pipeline, not every RFC detail
  - Great mental model: dictionary first, entropy second

If you only remember one sentence: gzip is mostly DEFLATE, and DEFLATE is LZ77 feeding Huffman.`,
  es: `DEFLATE

DEFLATE es el motor de compresión sin pérdida dentro de gzip, ZIP y PNG. No es un solo truco: es un pipeline que combina dos ideas que puedes estudiar por separado en este sitio: coincidencias de diccionario LZ77 y codificación de Huffman.

Cómo funciona:
1. Escaneo LZ77 — encontrar subcadenas repetidas en una ventana deslizante y emitir tokens (offset, longitud, siguiente)
2. Flujo de símbolos — convertir esos tokens en una secuencia de símbolos (marcadores de match + literales)
3. Codificación Huffman — asignar códigos de bits más cortos a los símbolos más frecuentes
4. Flujo de bits — sustituir cada símbolo por su código; gzip envuelve el flujo con cabecera y checksum

Por qué funciona:
  LZ77 elimina la redundancia del tipo "ya dije esta frase". Huffman elimina la del tipo "algunos símbolos son raros". Juntos comprimen estructura y sesgo — mucho mejor que cada uno solo en texto y assets web típicos.

Complejidad Temporal:
  Dominada por la búsqueda de coincidencias: O(n · W) ingenua; mucho más rápida con hash chains en gzip real
  Etapa Huffman: O(k log k) para k símbolos distintos del bloque

Complejidad Espacial: O(W + k) para la ventana y las tablas de códigos

Propiedades:
  - Compresor por bloques sin pérdida (RFC 1951)
  - Usado por gzip (RFC 1952), zlib, ZIP y PNG IDAT
  - Las implementaciones reales usan árboles Huffman fijos o dinámicos y códigos de distancia separados — esta página enseña el pipeline, no cada detalle del RFC
  - Modelo mental: primero diccionario, después entropía

Si solo recuerdas una frase: gzip es sobre todo DEFLATE, y DEFLATE es LZ77 alimentando a Huffman.`,
}

export default descriptions
