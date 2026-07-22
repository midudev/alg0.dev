import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Brotli

Brotli is a modern lossless compressor from Google (2015), widely used as HTTP Content-Encoding: br for HTML, CSS, and JavaScript. It sits in the same family as DEFLATE — dictionary matches plus entropy coding — but adds a powerful extra ingredient: a large static dictionary of phrases that already appear across the web.

How it works (pedagogical model on this page):
1. Static dictionary — try to match known phrases (URL pieces, tags, common words) without discovering them from the file alone
2. LZ back-references — copy from already-seen text when the dictionary does not help
3. Literals — emit single characters when neither dictionary nor history matches
4. Entropy coding — assign short codes to frequent commands (real Brotli uses richer, context-dependent codes)

Why it often beats gzip on the web:
  gzip only learns structure inside the current stream. Brotli also starts with shared knowledge of the web: "https://", "www.", "</div>", and thousands of other fragments. That shared prior is free information at both ends of HTTP.

Time Complexity:
  Match finding similar in spirit to LZ77 / DEFLATE; quality depends on window and matcher
  Dictionary lookups are designed to be fast in production codecs

Space Complexity:
  Encoder/decoder need the static dictionary (about 120KB in full Brotli) plus a sliding window

Properties:
  - Lossless; RFC 7932
  - Excellent for text-like web assets; less magic on already-compressed binary
  - Higher compression levels trade CPU for density (CDN / build-time vs on-the-fly)
  - This visualization is a teaching pipeline, not a bit-compatible Brotli encoder

Remember: Brotli ≈ DEFLATE's idea + a web-aware static dictionary + stronger entropy coding.`,
  es: `Brotli

Brotli es un compresor sin pérdida moderno de Google (2015), muy usado como HTTP Content-Encoding: br para HTML, CSS y JavaScript. Pertenece a la misma familia que DEFLATE — coincidencias de diccionario más codificación de entropía — pero añade un ingrediente extra: un gran diccionario estático de frases que ya aparecen en la web.

Cómo funciona (modelo pedagógico de esta página):
1. Diccionario estático — intentar casar frases conocidas (trozos de URL, tags, palabras comunes) sin redescubrirlas solo desde el archivo
2. Referencias LZ — copiar del texto ya visto cuando el diccionario no ayuda
3. Literales — emitir caracteres sueltos cuando ni diccionario ni historial coinciden
4. Codificación de entropía — códigos cortos para comandos frecuentes (Brotli real usa códigos más ricos según contexto)

Por qué suele ganar a gzip en la web:
  gzip solo aprende la estructura del flujo actual. Brotli además parte de conocimiento compartido de la web: "https://", "www.", "</div>" y miles de fragmentos más. Ese prior compartido es información gratis en ambos extremos de HTTP.

Complejidad Temporal:
  La búsqueda de coincidencias es del mismo espíritu que LZ77 / DEFLATE; la calidad depende de la ventana y el matcher
  Las consultas al diccionario están diseñadas para ser rápidas en códecs de producción

Complejidad Espacial:
  Codificador/decodificador necesitan el diccionario estático (~120KB en Brotli completo) más una ventana deslizante

Propiedades:
  - Sin pérdida; RFC 7932
  - Excelente para assets web de texto; menos magia en binarios ya comprimidos
  - Niveles altos intercambian CPU por densidad (CDN / build-time vs al vuelo)
  - Esta visualización es un pipeline didáctico, no un encoder bit-compatible con Brotli

Recuerda: Brotli ≈ la idea de DEFLATE + un diccionario estático consciente de la web + mejor codificación de entropía.`,
}

export default descriptions
