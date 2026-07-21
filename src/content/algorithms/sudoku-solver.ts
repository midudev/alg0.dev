import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Sudoku Solver

This solver uses backtracking to fill a Sudoku grid so that each row, column, and box contains all digits exactly once. This visualization uses a 4×4 variant with digits 1-4.

How it works (Backtracking):
1. Find an empty cell
2. Try each valid number (1 to N)
3. Check if the number is safe (not in same row, column, or box)
4. If safe, place it and recursively try to fill the next empty cell
5. If no valid number works, backtrack (remove the number and try the next)

Time Complexity: O(N^(N×N)) — worst case
Space Complexity: O(N×N) — for the board

Properties:
  - Always finds a solution if one exists
  - Backtracking prunes invalid branches early
  - Can be optimized with constraint propagation

Sudoku is a classic constraint satisfaction problem solved efficiently with backtracking.`,
  es: `Solucionador de Sudoku

Este solucionador usa backtracking para llenar una cuadrícula de Sudoku de modo que cada fila, columna y caja contenga todos los dígitos exactamente una vez. Esta visualización usa una variante 4×4 con dígitos 1-4.

Cómo funciona (Backtracking):
1. Encontrar una celda vacía
2. Probar cada número válido (1 a N)
3. Verificar si el número es seguro (no está en la misma fila, columna o caja)
4. Si es seguro, colocarlo e intentar recursivamente llenar la siguiente celda vacía
5. Si ningún número válido funciona, retroceder (quitar el número e intentar el siguiente)

Complejidad Temporal: O(N^(N×N)) — peor caso
Complejidad Espacial: O(N×N) — para el tablero

Propiedades:
  - Siempre encuentra una solución si existe
  - El backtracking poda ramas inválidas tempranamente
  - Puede optimizarse con propagación de restricciones

Sudoku es un problema clásico de satisfacción de restricciones resuelto eficientemente con backtracking.`,
}

export default descriptions
