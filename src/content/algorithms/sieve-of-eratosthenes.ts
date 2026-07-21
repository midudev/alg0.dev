import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Sieve of Eratosthenes

The Sieve of Eratosthenes is a classic algorithm for finding all prime numbers up to a limit n. It works by iteratively marking the multiples of each prime, starting from 2.

How it works:
1. Create a boolean array marking 2..n as potentially prime
2. For each i from 2 up to √n, if i is still marked prime, mark every multiple of i (starting from i²) as composite
3. Numbers that remain marked after the loop are the primes ≤ n

Why start crossing from i²?
  All smaller multiples of i (2i, 3i, …, (i−1)i) have already been crossed by a smaller prime.

Time Complexity:
  Best:    O(n log log n)
  Average: O(n log log n)
  Worst:   O(n log log n)

Space Complexity: O(n)

Properties:
  - Deterministic, no randomness
  - Cache-friendly when n fits in memory
  - Foundational for number theory and cryptography preprocessing

Named after the Greek mathematician Eratosthenes of Cyrene (~276–194 BCE), this sieve remains one of the most efficient ways to find all small primes and is the basis for many factorization preprocessing steps.`,
  es: `Criba de Eratóstenes

La Criba de Eratóstenes es un algoritmo clásico para encontrar todos los números primos hasta un límite n. Funciona marcando iterativamente los múltiplos de cada primo, empezando por 2.

Cómo funciona:
1. Crea un arreglo booleano marcando 2..n como potencialmente primos
2. Para cada i desde 2 hasta √n, si i sigue marcado como primo, marca todos sus múltiplos (empezando desde i²) como compuestos
3. Los números que permanezcan marcados al terminar el bucle son los primos ≤ n

¿Por qué empezar a tachar desde i²?
  Todos los múltiplos menores de i (2i, 3i, …, (i−1)i) ya fueron tachados por un primo más pequeño.

Complejidad Temporal:
  Mejor:    O(n log log n)
  Promedio: O(n log log n)
  Peor:     O(n log log n)

Complejidad Espacial: O(n)

Propiedades:
  - Determinista, sin aleatoriedad
  - Eficiente en caché cuando n cabe en memoria
  - Fundamento para teoría de números y preprocesamiento criptográfico

Lleva el nombre del matemático griego Eratóstenes de Cirene (~276–194 a.C.). Esta criba sigue siendo una de las formas más eficientes de encontrar todos los primos pequeños y es la base de muchos pasos de preprocesamiento para factorización.`,
}

export default descriptions
