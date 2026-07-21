import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const divideAndConquerCpp: Record<string, CodeImplementation> = {
  'tower-of-hanoi':
    annotated(`void hanoi(int n, string source, string target, string auxiliary) {  //@1
    if (n == 0) return;

    // Move n-1 disks from source to auxiliary
    hanoi(n - 1, source, auxiliary, target);

    // Move the largest disk to target
    cout << "Move disk " << n << " from " << source << " to " << target << endl;  //@8

    // Move n-1 disks from auxiliary to target
    hanoi(n - 1, auxiliary, target, source);
}

hanoi(3, "A", "C", "B");  //@14`),
}
