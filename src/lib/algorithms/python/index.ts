import type { CodeImplementation } from '@lib/types'

import { conceptsPython } from '@lib/algorithms/python/concepts'
import { dataStructuresPython } from '@lib/algorithms/python/data-structures'
import { sortingPython } from '@lib/algorithms/python/sorting'
import { searchingPython } from '@lib/algorithms/python/searching'
import { graphsPython } from '@lib/algorithms/python/graphs'
import { dynamicProgrammingPython } from '@lib/algorithms/python/dynamic-programming'
import { backtrackingPython } from '@lib/algorithms/python/backtracking'
import { divideAndConquerPython } from '@lib/algorithms/python/divide-and-conquer'
import { mathPython } from '@lib/algorithms/python/math'
import { compressionPython } from '@lib/algorithms/python/compression'

/** Python translations keyed by algorithm id. */
export const pythonImplementations: Record<string, CodeImplementation> = {
  ...conceptsPython,
  ...dataStructuresPython,
  ...sortingPython,
  ...searchingPython,
  ...graphsPython,
  ...dynamicProgrammingPython,
  ...backtrackingPython,
  ...divideAndConquerPython,
  ...mathPython,
  ...compressionPython,
}
