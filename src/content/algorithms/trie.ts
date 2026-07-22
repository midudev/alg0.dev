import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Trie (Prefix Tree)

A Trie stores strings by sharing their common prefixes. Each edge is a character, and the path from the root to a node spells out a prefix. Lookups cost O(L) where L is the length of the word — independent of how many words are stored.

How it works:
1. Each node holds a map of children (character → node) and an isEnd flag
2. Inserting walks the word character by character, creating nodes only when missing
3. isEnd marks where a real word ends, so "ca" can be a path without being a word

Why not a hash table:
  A hash table also looks up an exact key in O(L),
  but it cannot answer "which words start with ca?"
  without scanning every key. A trie walks 2 nodes
  down and the whole subtree is the answer.

Time Complexity:
  Best:    O(1) when the first character does not match
  Average: O(L) for insert, search and startsWith
  Worst:   O(L) — never depends on the number of words

Space Complexity: O(n × L) — its main weakness. Radix trees compress single-child chains to reduce it.

Applications: autocomplete, spell checkers, IP routing tables (longest prefix match), T9 keyboards, word games, editor symbol completion`,
  es: `Trie (Árbol de Prefijos)

Un Trie almacena cadenas compartiendo sus prefijos comunes. Cada arista es un carácter, y el camino desde la raíz hasta un nodo deletrea un prefijo. Las búsquedas cuestan O(L) donde L es la longitud de la palabra — independiente de cuántas palabras haya guardadas.

Cómo funciona:
1. Cada nodo guarda un mapa de hijos (carácter → nodo) y un flag isEnd
2. Insertar recorre la palabra carácter a carácter, creando nodos solo cuando faltan
3. isEnd marca dónde termina una palabra real, así "ca" puede ser un camino sin ser palabra

Por qué no una tabla hash:
  Una tabla hash también busca una clave exacta en O(L),
  pero no puede responder "¿qué palabras empiezan por ca?"
  sin recorrer todas las claves. Un trie baja 2 nodos
  y todo el subárbol es la respuesta.

Complejidad Temporal:
  Mejor:    O(1) cuando el primer carácter no coincide
  Promedio: O(L) para insertar, buscar y startsWith
  Peor:     O(L) — nunca depende del número de palabras

Complejidad Espacial: O(n × L) — su principal debilidad. Los radix trees comprimen cadenas de un solo hijo para reducirla.

Aplicaciones: autocompletado, correctores ortográficos, tablas de enrutamiento IP (longest prefix match), teclados T9, juegos de palabras, autocompletado de símbolos en editores`,
}

export default descriptions
