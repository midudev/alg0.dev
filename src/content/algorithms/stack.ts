import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Stack

A Stack is a linear data structure that follows the LIFO principle — Last In, First Out. Like a stack of plates: you add and remove from the top only.

Operations:
  push(item) — add to top       O(1)
  pop()      — remove from top   O(1)
  peek()     — view top          O(1)
  isEmpty()  — check if empty    O(1)

Applications:
  - Undo/redo functionality
  - Browser history (back/forward)
  - Function call stack
  - Depth-First Search (DFS)
  - Expression evaluation and parsing
  - Balanced parentheses checking

Space Complexity: O(n) for n elements`,
  es: `Pila (Stack)

Una Pila es una estructura de datos lineal que sigue el principio LIFO — Último en Entrar, Primero en Salir. Como una pila de platos: solo puedes añadir y quitar del tope.

Operaciones:
  push(item) — añadir arriba        O(1)
  pop()      — retirar de arriba     O(1)
  peek()     — ver el de arriba      O(1)
  isEmpty()  — verificar si está vacía O(1)

Aplicaciones:
  - Deshacer/rehacer
  - Historial del navegador (atrás/adelante)
  - Pila de llamadas de funciones
  - Búsqueda en Profundidad (DFS)
  - Evaluación de expresiones y análisis sintáctico
  - Verificación de paréntesis balanceados

Complejidad Espacial: O(n) para n elementos`,
}

export default descriptions
