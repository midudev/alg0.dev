import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Queue

A Queue is a linear data structure that follows the FIFO principle — First In, First Out. Like a line at a store: the first person in line is served first.

Operations:
  enqueue(item) — add to back       O(1)
  dequeue()     — remove from front  O(1)
  front()       — view front         O(1)
  isEmpty()     — check if empty     O(1)

Applications:
  - Task scheduling (CPU, printer)
  - Breadth-First Search (BFS)
  - Message buffers and event queues
  - Rate limiting
  - Order processing systems

Space Complexity: O(n) for n elements`,
  es: `Cola (Queue)

Una Cola es una estructura de datos lineal que sigue el principio FIFO — Primero en Entrar, Primero en Salir. Como una fila en una tienda: el primero en llegar es atendido primero.

Operaciones:
  enqueue(item) — añadir al final     O(1)
  dequeue()     — retirar del frente   O(1)
  front()       — ver el frente        O(1)
  isEmpty()     — verificar si está vacía O(1)

Aplicaciones:
  - Planificación de tareas (CPU, impresora)
  - Búsqueda en Anchura (BFS)
  - Buffers de mensajes y colas de eventos
  - Limitación de velocidad (rate limiting)
  - Sistemas de procesamiento de pedidos

Complejidad Espacial: O(n) para n elementos`,
}

export default descriptions
