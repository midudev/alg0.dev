import type { CodeImplementation } from '@lib/types'

import { conceptsCpp } from '@lib/algorithms/cpp/concepts'
import { dataStructuresCpp } from '@lib/algorithms/cpp/data-structures'
import { sortingCpp } from '@lib/algorithms/cpp/sorting'
import { searchingCpp } from '@lib/algorithms/cpp/searching'
import { graphsCpp } from '@lib/algorithms/cpp/graphs'
import { dynamicProgrammingCpp } from '@lib/algorithms/cpp/dynamic-programming'
import { backtrackingCpp } from '@lib/algorithms/cpp/backtracking'
import { divideAndConquerCpp } from '@lib/algorithms/cpp/divide-and-conquer'
import { mathCpp } from '@lib/algorithms/cpp/math'
import { compressionCpp } from '@lib/algorithms/cpp/compression'

/** C++ translations keyed by algorithm id. */
export const cppImplementations: Record<string, CodeImplementation> = {
  ...conceptsCpp,
  ...dataStructuresCpp,
  ...sortingCpp,
  ...searchingCpp,
  ...graphsCpp,
  ...dynamicProgrammingCpp,
  ...backtrackingCpp,
  ...divideAndConquerCpp,
  ...mathCpp,
  ...compressionCpp,
}
