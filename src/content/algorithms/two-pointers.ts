import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Two Pointers

Two Pointers is a technique where two indices move through a data structure (usually an array) to solve problems efficiently.

Common patterns:
  - Left & Right: start from both ends, move inward
  - Slow & Fast: both start from beginning at different speeds

Time Complexity: O(n) — each pointer moves at most n times
Space Complexity: O(1) — only two variables

Classic problems:
  - Two Sum (sorted array)
  - Container with most water
  - Remove duplicates in-place
  - Palindrome checking
  - Linked list cycle detection (slow/fast)`,
  es: `Dos Punteros (Two Pointers)

Dos Punteros es una técnica donde dos índices se mueven a través de una estructura de datos (generalmente un arreglo) para resolver problemas eficientemente.

Patrones comunes:
  - Izquierda y derecha: comienzan desde ambos extremos, avanzan hacia el centro
  - Lento y rápido: ambos empiezan desde el inicio a diferentes velocidades

Complejidad Temporal: O(n) — cada puntero se mueve como máximo n veces
Complejidad Espacial: O(1) — solo dos variables

Problemas clásicos:
  - Two Sum (arreglo ordenado)
  - Contenedor con más agua
  - Eliminar duplicados in-place
  - Verificación de palíndromos
  - Detección de ciclos en listas enlazadas (lento/rápido)`,
}

export default descriptions
