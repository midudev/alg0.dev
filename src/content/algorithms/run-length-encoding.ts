import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Run-Length Encoding

Run-Length Encoding (RLE) is a simple lossless compression algorithm. It replaces consecutive repeats of the same symbol with a single (symbol, count) pair.

How it works:
1. Scan the input from left to right
2. When a new character appears, start a run
3. Keep counting while the next character matches
4. Emit (character, count) and continue after the run

Why it works:
  Long runs of identical values waste space if stored naively. Encoding the length once captures that redundancy. Decoding is the inverse: expand each pair into count copies of the character.

Time Complexity:
  Best:    O(n)
  Average: O(n)
  Worst:    O(n)

Space Complexity: O(k) where k is the number of runs

Properties:
  - Lossless when counts and symbols are stored losslessly
  - Excellent for sparse bitmaps, icons, and simple graphics (BMP RLE, PCX, fax)
  - Can expand data with no long runs (e.g. alternating ABABAB)
  - Often used as a first stage before Huffman or arithmetic coding

RLE is one of the oldest compression ideas still taught — easy to implement, easy to visualize, and a building block inside larger formats.`,
  es: `Codificación por Longitud de Racha

La Codificación por Longitud de Racha (RLE) es un algoritmo simple de compresión sin pérdida. Reemplaza repeticiones consecutivas del mismo símbolo por un par (símbolo, conteo).

Cómo funciona:
1. Escanear la entrada de izquierda a derecha
2. Cuando aparece un carácter nuevo, iniciar una racha
3. Seguir contando mientras el siguiente carácter coincida
4. Emitir (carácter, conteo) y continuar tras la racha

Por qué funciona:
  Las rachas largas de valores idénticos desperdician espacio si se almacenan de forma ingenua. Codificar la longitud una sola vez captura esa redundancia. La decodificación es la inversa: expandir cada par en count copias del carácter.

Complejidad Temporal:
  Mejor:    O(n)
  Promedio: O(n)
  Peor:     O(n)

Complejidad Espacial: O(k) donde k es el número de rachas

Propiedades:
  - Sin pérdida cuando conteos y símbolos se guardan sin pérdida
  - Excelente para bitmaps dispersos, iconos y gráficos simples (BMP RLE, PCX, fax)
  - Puede expandir datos sin rachas largas (p. ej. ABABAB alternado)
  - A menudo se usa como primera etapa antes de Huffman o codificación aritmética

RLE es una de las ideas de compresión más antiguas que aún se enseñan: fácil de implementar, fácil de visualizar y un bloque dentro de formatos más grandes.`,
}

export default descriptions
