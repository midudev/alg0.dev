import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `N-Queens Problem

The N-Queens problem asks: how can N chess queens be placed on an N×N chessboard so that no two queens threaten each other?

A queen can attack any piece in the same row, column, or diagonal. Therefore, a solution requires that no two queens share the same row, column, or diagonal.

How it works (Backtracking):
1. Place queens one row at a time
2. For each row, try each column
3. Check if the position is safe (no conflicts)
4. If safe, place the queen and move to the next row
5. If no safe column exists, backtrack to the previous row

This visualization shows the 4-Queens problem on a 4×4 board.

Time Complexity: O(N!) — in the worst case
Space Complexity: O(N²) — for the board

The N-Queens problem is a classic example of backtracking algorithms and constraint satisfaction problems.`,
  es: `Problema de las N Reinas

El problema de las N Reinas pregunta: ¿cómo se pueden colocar N reinas de ajedrez en un tablero N×N de modo que ninguna reina amenace a otra?

Una reina puede atacar cualquier pieza en la misma fila, columna o diagonal. Por lo tanto, una solución requiere que ningún par de reinas comparta la misma fila, columna o diagonal.

Cómo funciona (Backtracking):
1. Coloca reinas una fila a la vez
2. Para cada fila, prueba cada columna
3. Verifica si la posición es segura (sin conflictos)
4. Si es segura, coloca la reina y pasa a la siguiente fila
5. Si no existe columna segura, retrocede a la fila anterior

Esta visualización muestra el problema de las 4 reinas en un tablero 4×4.

Complejidad Temporal: O(N!) — en el peor caso
Complejidad Espacial: O(N²) — para el tablero

El problema de las N Reinas es un ejemplo clásico de algoritmos de backtracking y problemas de satisfacción de restricciones.`,
}

export default descriptions
