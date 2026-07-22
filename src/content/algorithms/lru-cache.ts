import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `LRU Cache

An LRU (Least Recently Used) Cache holds a fixed number of entries and evicts the one untouched for the longest time when it runs out of room. The challenge is doing both get and put in O(1).

Why one structure is not enough:
1. A hash map alone gives O(1) access but cannot tell which entry is oldest
2. An ordered list alone knows the oldest but takes O(n) to find a key
3. So combine them: the map answers "where", the list answers "when"

The design:
  Hash map:            key → pointer to a node, O(1)
  Doubly linked list:  head = most recent, tail = next to evict

Two details that are easy to miss:
  Each node stores its own key. Eviction reaches the node
  through the list tail, and needs the key to delete the
  map entry — otherwise the map keeps an orphan.

  The list must be doubly linked. Moving a node to the
  front means unlinking it from the middle, which needs
  its prev pointer. With a singly linked list it is O(n).

Time Complexity:
  Best:    O(1) for get and put
  Average: O(1) — hash lookup plus constant pointer rewiring
  Worst:   O(n) only if every key collides in the hash map

Space Complexity: O(capacity)

Applications: database and web caches, Redis eviction (sampled approximation), CPU cache replacement, browser back/forward stacks, memoization with bounded memory`,
  es: `Caché LRU (LRU Cache)

Una caché LRU (Least Recently Used) guarda un número fijo de entradas y desaloja la que lleva más tiempo sin usarse cuando se queda sin espacio. El reto es hacer get y put en O(1).

Por qué una sola estructura no basta:
1. Un hash map solo da acceso O(1) pero no sabe qué entrada es la más antigua
2. Una lista ordenada sola sabe cuál es la más antigua pero tarda O(n) en buscar una clave
3. Así que se combinan: el map responde "dónde", la lista responde "cuándo"

El diseño:
  Hash map:                    clave → puntero a un nodo, O(1)
  Lista doblemente enlazada:   head = más reciente, tail = próximo a desalojar

Dos detalles fáciles de pasar por alto:
  Cada nodo guarda su propia clave. El desalojo llega al nodo
  por la cola de la lista, y necesita la clave para borrar la
  entrada del map — si no, el map se queda con un huérfano.

  La lista debe ser doblemente enlazada. Mover un nodo al
  frente implica desenlazarlo del medio, y eso necesita su
  puntero prev. Con una lista simple sería O(n).

Complejidad Temporal:
  Mejor:    O(1) para get y put
  Promedio: O(1) — búsqueda hash más reenlazado constante de punteros
  Peor:     O(n) solo si todas las claves colisionan en el hash map

Complejidad Espacial: O(capacidad)

Aplicaciones: cachés de bases de datos y web, desalojo en Redis (aproximación por muestreo), reemplazo en cachés de CPU, historial atrás/adelante del navegador, memoización con memoria acotada`,
}

export default descriptions
