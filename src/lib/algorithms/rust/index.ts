import type { CodeImplementation } from '@lib/types'

import { conceptsRust } from '@lib/algorithms/rust/concepts'
import { dataStructuresRust } from '@lib/algorithms/rust/data-structures'
import { sortingRust } from '@lib/algorithms/rust/sorting'
import { searchingRust } from '@lib/algorithms/rust/searching'
import { graphsRust } from '@lib/algorithms/rust/graphs'
import { dynamicProgrammingRust } from '@lib/algorithms/rust/dynamic-programming'
import { backtrackingRust } from '@lib/algorithms/rust/backtracking'
import { divideAndConquerRust } from '@lib/algorithms/rust/divide-and-conquer'
import { mathRust } from '@lib/algorithms/rust/math'

/** Rust translations keyed by algorithm id. */
export const rustImplementations: Record<string, CodeImplementation> = {
  ...conceptsRust,
  ...dataStructuresRust,
  ...sortingRust,
  ...searchingRust,
  ...graphsRust,
  ...dynamicProgrammingRust,
  ...backtrackingRust,
  ...divideAndConquerRust,
  ...mathRust,
}
