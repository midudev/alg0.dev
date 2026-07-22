import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Huffman Coding

Huffman Coding is a greedy algorithm for lossless data compression. It assigns shorter binary codes to frequent characters and longer codes to rare ones, reducing the total number of bits needed to represent the data.

How it works:
1. Count how often each character appears
2. Create a leaf node per character and put them in a min-priority queue
3. Repeatedly remove the two lowest-frequency nodes and merge them under a new parent whose frequency is their sum
4. When one node remains, use it as the tree root
5. Assign codes by walking the tree: left = 0, right = 1

Why it works:
  No code is a prefix of another, so the encoded bitstream decodes unambiguously. The greedy merge guarantees an optimal prefix code for the given frequencies.

Time Complexity:
  Best:    O(n log n)
  Average: O(n log n)
  Worst:   O(n log n)

Space Complexity: O(n)

Properties:
  - Lossless: the original data is recovered exactly
  - Optimal among prefix codes for a known frequency distribution
  - Used in DEFLATE (ZIP, gzip, PNG), JPEG, and MP3

Invented by David A. Huffman in 1952 while he was a student at MIT, it remains a cornerstone of modern compression.`,
  es: `Codificación de Huffman

La Codificación de Huffman es un algoritmo voraz para compresión de datos sin pérdida. Asigna códigos binarios más cortos a los caracteres frecuentes y más largos a los raros, reduciendo la cantidad total de bits necesarios para representar los datos.

Cómo funciona:
1. Contar cuántas veces aparece cada carácter
2. Crear un nodo hoja por carácter y ponerlos en una cola de prioridad mínima
3. Quitar repetidamente los dos nodos de menor frecuencia y fusionarlos bajo un nuevo padre cuya frecuencia sea la suma
4. Cuando quede un solo nodo, usarlo como raíz del árbol
5. Asignar códigos recorriendo el árbol: izquierda = 0, derecha = 1

Por qué funciona:
  Ningún código es prefijo de otro, así que el flujo de bits codificado se decodifica sin ambigüedad. La fusión voraz garantiza un código de prefijo óptimo para las frecuencias dadas.

Complejidad Temporal:
  Mejor:    O(n log n)
  Promedio: O(n log n)
  Peor:     O(n log n)

Complejidad Espacial: O(n)

Propiedades:
  - Sin pérdida: los datos originales se recuperan exactamente
  - Óptimo entre los códigos de prefijo para una distribución de frecuencias conocida
  - Usado en DEFLATE (ZIP, gzip, PNG), JPEG y MP3

Inventado por David A. Huffman en 1952 cuando era estudiante en el MIT, sigue siendo un pilar de la compresión moderna.`,
}

export default descriptions
