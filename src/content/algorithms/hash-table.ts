import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Hash Table

A Hash Table maps keys to values using a hash function. It provides near-constant time O(1) for insert, lookup, and delete operations.

How it works:
1. A hash function converts the key into an array index
2. The value is stored at that index (bucket)
3. If two keys hash to the same index → collision

Collision handling (chaining):
  Each bucket stores a list of entries.
  Multiple keys can share the same bucket.

Time Complexity:
  Average: O(1) for set, get, delete
  Worst:   O(n) when all keys collide

Space Complexity: O(n)

Applications: caches, databases, symbol tables, counting frequencies, deduplication`,
  es: `Tabla Hash (Hash Table)

Una Tabla Hash mapea claves a valores usando una función hash. Proporciona tiempo casi constante O(1) para insertar, buscar y eliminar.

Cómo funciona:
1. Una función hash convierte la clave en un índice del arreglo
2. El valor se almacena en ese índice (bucket)
3. Si dos claves producen el mismo índice → colisión

Manejo de colisiones (encadenamiento):
  Cada bucket almacena una lista de entradas.
  Múltiples claves pueden compartir el mismo bucket.

Complejidad Temporal:
  Promedio: O(1) para set, get, delete
  Peor:     O(n) cuando todas las claves colisionan

Complejidad Espacial: O(n)

Aplicaciones: cachés, bases de datos, tablas de símbolos, conteo de frecuencias, deduplicación`,
}

export default descriptions
