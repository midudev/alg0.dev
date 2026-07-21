import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const divideAndConquerJava: Record<string, CodeImplementation> = {
  'tower-of-hanoi':
    annotated(`void hanoi(int n, String source, String target, String auxiliary) {  //@1
    if (n == 0) return;

    // Move n-1 disks from source to auxiliary
    hanoi(n - 1, source, auxiliary, target);

    // Move the largest disk to target
    System.out.println("Move disk " + n + " from " + source + " to " + target);  //@8

    // Move n-1 disks from auxiliary to target
    hanoi(n - 1, auxiliary, target, source);
}

hanoi(3, "A", "C", "B");  //@14`),
}
