import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Bucket Sort

Bucket Sort is a distribution-based sorting algorithm that works by partitioning an array into a number of buckets. Each bucket is then sorted individually using another sorting algorithm or recursively applying the bucket sort.

How it works:
1. Find the range (min/max) to determine bucket indices
2. Create empty buckets based on a fixed size (e.g., 10 or 20)
3. Distribute elements into buckets: index = floor((value - min) / size)
4. Sort each non-empty bucket using Insertion Sort
5. Collect elements from sorted buckets back into the main array

Time Complexity:
  Best:    O(n + k) — uniform distribution
  Average: O(n + k)
  Worst:   O(n²) — all elements fall into one bucket

Space Complexity: O(n + k) — extra space for buckets

Properties:
  - Stable sort (if underlying sort is stable)
  - Not in-place
  - Data-distribution dependent`,
  es: `Bucket Sort (Ordenamiento por Cubetas)

Bucket Sort es un algoritmo de ordenamiento basado en la distribución que funciona particionando un arreglo en varias cubetas. Cada cubeta se ordena individualmente usando otro algoritmo de ordenamiento o aplicando recursivamente el mismo algoritmo.

Cómo funciona:
1. Encontrar el rango (mín/máx) para determinar los índices de las cubetas
2. Crear cubetas vacías basadas en un tamaño fijo (por ejemplo, 10 o 20)
3. Distribuir elementos en las cubetas: índice = suelo((valor - mín) / tamaño)
4. Ordenar cada cubeta no vacía usando Insertion Sort
5. Recolectar elementos de las cubetas ordenadas de vuelta al arreglo principal

Complejidad Temporal:
  Mejor:    O(n + k) — distribución uniforme
  Promedio: O(n + k)
  Peor:     O(n²) — todos los elementos caen en una sola cubeta

Complejidad Espacial: O(n + k) — espacio extra para cubetas

Propiedades:
  - Ordenamiento estable (si el ordenamiento subyacente lo es)
  - No es in-place
  - Dependiente de la distribución de los datos`,
}

export default descriptions
