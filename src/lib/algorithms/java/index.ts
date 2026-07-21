import type { CodeImplementation } from '@lib/types'

import { conceptsJava } from '@lib/algorithms/java/concepts'
import { dataStructuresJava } from '@lib/algorithms/java/data-structures'
import { sortingJava } from '@lib/algorithms/java/sorting'
import { searchingJava } from '@lib/algorithms/java/searching'
import { graphsJava } from '@lib/algorithms/java/graphs'
import { dynamicProgrammingJava } from '@lib/algorithms/java/dynamic-programming'
import { backtrackingJava } from '@lib/algorithms/java/backtracking'
import { divideAndConquerJava } from '@lib/algorithms/java/divide-and-conquer'
import { mathJava } from '@lib/algorithms/java/math'

/** Java translations keyed by algorithm id. */
export const javaImplementations: Record<string, CodeImplementation> = {
  ...conceptsJava,
  ...dataStructuresJava,
  ...sortingJava,
  ...searchingJava,
  ...graphsJava,
  ...dynamicProgrammingJava,
  ...backtrackingJava,
  ...divideAndConquerJava,
  ...mathJava,
}
