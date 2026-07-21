import type { Locale } from '@i18n/translations'

const descriptions: Record<Locale, string> = {
  en: `Longest Common Subsequence (LCS)

LCS finds the longest subsequence common to two sequences. A subsequence is a sequence that appears in the same relative order, but not necessarily contiguous.

How it works (Bottom-Up DP):
1. Create a 2D table: dp[i][j] = length of LCS of first i chars of X and first j chars of Y
2. If characters match: dp[i][j] = dp[i-1][j-1] + 1
3. If they don't match: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. dp[m][n] contains the LCS length

Time Complexity: O(m × n)
Space Complexity: O(m × n) — can be optimized to O(min(m, n))

Applications:
  - Diff tools (file comparison)
  - DNA sequence alignment
  - Version control systems
  - Spell checking

LCS is a fundamental problem in bioinformatics and text processing. It generalizes to the edit distance problem.`,
  es: `Subsecuencia Común más Larga (LCS)

LCS encuentra la subsecuencia más larga común a dos secuencias. Una subsecuencia es una secuencia que aparece en el mismo orden relativo, pero no necesariamente contigua.

Cómo funciona (DP Bottom-Up):
1. Crear una tabla 2D: dp[i][j] = longitud del LCS de los primeros i caracteres de X y los primeros j caracteres de Y
2. Si los caracteres coinciden: dp[i][j] = dp[i-1][j-1] + 1
3. Si no coinciden: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. dp[m][n] contiene la longitud del LCS

Complejidad Temporal: O(m × n)
Complejidad Espacial: O(m × n) — optimizable a O(min(m, n))

Aplicaciones:
  - Herramientas diff (comparación de archivos)
  - Alineamiento de secuencias de ADN
  - Sistemas de control de versiones
  - Corrección ortográfica

LCS es un problema fundamental en bioinformática y procesamiento de texto. Se generaliza al problema de distancia de edición.`,
}

export default descriptions
