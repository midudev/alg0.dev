import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Tower of Hanoi

The Tower of Hanoi is a classic recursive puzzle. Move all disks from the source peg to the target peg, one at a time, never placing a larger disk on top of a smaller one.

How it works (Recursive):
1. Move the top n-1 disks from source to auxiliary peg
2. Move the largest disk from source to target peg
3. Move the n-1 disks from auxiliary to target peg

Time Complexity: O(2^n - 1) — exactly 2^n - 1 moves
Space Complexity: O(n) — recursive call stack

Properties:
  - Minimum moves required: 2^n - 1
  - Classic example of divide and conquer
  - Demonstrates the power of recursion

The puzzle was invented by mathematician Édouard Lucas in 1883. Legend says monks in a temple are moving 64 golden disks — completing the puzzle would mark the end of the world (requiring 18,446,744,073,709,551,615 moves).`,
  es: `Torre de Hanoi

La Torre de Hanoi es un clásico rompecabezas recursivo. Mueve todos los discos de la torre origen a la torre destino, uno a la vez, sin colocar nunca un disco más grande sobre uno más pequeño.

Cómo funciona (Recursivo):
1. Mover los n-1 discos superiores de la torre origen a la auxiliar
2. Mover el disco más grande de la torre origen a la destino
3. Mover los n-1 discos de la torre auxiliar a la destino

Complejidad Temporal: O(2^n - 1) — exactamente 2^n - 1 movimientos
Complejidad Espacial: O(n) — pila de llamadas recursivas

Propiedades:
  - Movimientos mínimos requeridos: 2^n - 1
  - Ejemplo clásico de divide y vencerás
  - Demuestra el poder de la recursión

El rompecabezas fue inventado por el matemático Édouard Lucas en 1883. La leyenda dice que monjes en un templo están moviendo 64 discos dorados — completar el rompecabezas marcaría el fin del mundo (requiriendo 18.446.744.073.709.551.615 movimientos).`,
}

export default descriptions
