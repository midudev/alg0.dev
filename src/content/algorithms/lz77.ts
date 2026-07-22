import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `LZ77

LZ77 is a dictionary compressor invented by Abraham Lempel and Jacob Ziv in 1977. Instead of a fixed codebook, it uses a sliding window of recently seen data as a dynamic dictionary.

How it works:
1. Maintain a search buffer (already encoded window) and a look-ahead buffer
2. Find the longest prefix of the look-ahead that also appears in the window
3. Emit a triple (offset, length, next):
   - offset — how far back the match starts
   - length — how many characters to copy
   - next — the literal character that follows the match (or empty at EOF)
4. Slide the window forward by length + 1 and repeat

Why it works:
  Repeated phrases (words, patterns, substrings) are common in text and structured data. Pointing back into the window stores a long sequence as a short reference. No code is a prefix of another in the stream of triples, so decoding is unambiguous: copy from offset, then append the literal.

Time Complexity:
  Best:    O(n) with rolling hashes / advanced matchers
  Average: O(n · W) naive scan (W = window size)
  Worst:   O(n · W)

Space Complexity: O(W) for the window

Properties:
  - Lossless dictionary method with a sliding window
  - Foundation of DEFLATE (gzip, ZIP, PNG) which pairs LZ77 with Huffman
  - Window size trades compression ratio for memory and search cost
  - Handles repeated substrings well; pure randomness does not compress

LZ77 turned "look for repeats nearby" into the practical engine behind most everyday lossless archives.`,
  es: `LZ77

LZ77 es un compresor por diccionario inventado por Abraham Lempel y Jacob Ziv en 1977. En lugar de un libro de códigos fijo, usa una ventana deslizante de datos vistos recientemente como diccionario dinámico.

Cómo funciona:
1. Mantener un buffer de búsqueda (ventana ya codificada) y un buffer de look-ahead
2. Encontrar el prefijo más largo del look-ahead que también aparece en la ventana
3. Emitir un triple (offset, longitud, siguiente):
   - offset — cuánto atrás empieza la coincidencia
   - longitud — cuántos caracteres copiar
   - siguiente — el carácter literal que sigue a la coincidencia (o vacío al EOF)
4. Deslizar la ventana hacia adelante en longitud + 1 y repetir

Por qué funciona:
  Las frases repetidas (palabras, patrones, subcadenas) son comunes en texto y datos estructurados. Apuntar atrás en la ventana guarda una secuencia larga como una referencia corta. El flujo de triples se decodifica sin ambigüedad: copiar desde el offset y luego añadir el literal.

Complejidad Temporal:
  Mejor:    O(n) con hashes rodantes / buscadores avanzados
  Promedio: O(n · W) búsqueda ingenua (W = tamaño de ventana)
  Peor:     O(n · W)

Complejidad Espacial: O(W) para la ventana

Propiedades:
  - Método de diccionario sin pérdida con ventana deslizante
  - Base de DEFLATE (gzip, ZIP, PNG), que combina LZ77 con Huffman
  - El tamaño de ventana intercambia ratio de compresión por memoria y costo de búsqueda
  - Maneja bien subcadenas repetidas; la pure aleatoriedad no se comprime

LZ77 convirtió "buscar repeticiones cercanas" en el motor práctico detrás de la mayoría de archivos sin pérdida del día a día.`,
}

export default descriptions
