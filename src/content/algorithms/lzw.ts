import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `LZW

LZW (Lempel–Ziv–Welch) is an adaptive dictionary compressor published by Terry Welch in 1984. Both encoder and decoder build the same dictionary on the fly from the data stream — no separate dictionary needs to be transmitted.

How it works:
1. Seed the dictionary with every single-character string
2. Keep a current phrase w (initially empty)
3. For each next character c:
   - If w+c is already in the dictionary, set w = w+c
   - Otherwise emit the code for w, add w+c to the dictionary, and set w = c
4. After the last character, emit the code for the remaining w

Why it works:
  As phrases repeat, they receive short integer codes. Longer and longer phrases are learned automatically. The decoder mirrors the encoder: each received code expands to a string, and the next unseen phrase is added with the same rule, so both sides stay in sync.

Time Complexity:
  Best:    O(n)
  Average: O(n)
  Worst:   O(n) with a hash dictionary

Space Complexity: O(d) where d is the number of dictionary entries

Properties:
  - Lossless adaptive dictionary coding
  - Used historically in GIF and Unix compress
  - No prior frequency analysis required
  - Dictionary growth can be capped (fixed code width) for streaming formats

LZW shows how a growing codebook turns recurring structure into shorter integer codes without a separate model of the source.`,
  es: `LZW

LZW (Lempel–Ziv–Welch) es un compresor adaptativo por diccionario publicado por Terry Welch en 1984. Codificador y decodificador construyen el mismo diccionario sobre la marcha a partir del flujo de datos — no hace falta transmitir un diccionario aparte.

Cómo funciona:
1. Sembrar el diccionario con cada cadena de un solo carácter
2. Mantener una frase actual w (inicialmente vacía)
3. Para cada siguiente carácter c:
   - Si w+c ya está en el diccionario, hacer w = w+c
   - Si no, emitir el código de w, añadir w+c al diccionario y hacer w = c
4. Tras el último carácter, emitir el código de la w restante

Por qué funciona:
  Cuando las frases se repiten, reciben códigos enteros cortos. Se aprenden frases cada vez más largas de forma automática. El decodificador refleja al codificador: cada código recibido se expande a una cadena y se añade la siguiente frase no vista con la misma regla, así ambos lados se mantienen sincronizados.

Complejidad Temporal:
  Mejor:    O(n)
  Promedio: O(n)
  Peor:     O(n) con un diccionario hash

Complejidad Espacial: O(d) donde d es el número de entradas del diccionario

Propiedades:
  - Codificación de diccionario adaptativa sin pérdida
  - Usado históricamente en GIF y en compress de Unix
  - No requiere análisis previo de frecuencias
  - El crecimiento del diccionario puede limitarse (ancho de código fijo) en formatos en streaming

LZW muestra cómo un libro de códigos que crece convierte la estructura recurrente en códigos enteros más cortos sin un modelo separado de la fuente.`,
}

export default descriptions
