import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const divideAndConquerPython: Record<string, CodeImplementation> = {
  'tower-of-hanoi': annotated(`def hanoi(n, source, target, auxiliary):  #@1
    if n == 0:
        return

    # Move n-1 disks from source to auxiliary
    hanoi(n - 1, source, auxiliary, target)

    # Move the largest disk to target
    print(f"Move disk {n} from {source} to {target}")  #@8

    # Move n-1 disks from auxiliary to target
    hanoi(n - 1, auxiliary, target, source)


hanoi(3, "A", "C", "B")  #@14`),
  'binary-exponentiation': annotated(`def bin_pow(base, exp):  #@1
    if exp == 0:
        return 1  #@2

    half = bin_pow(base, exp // 2)  #@3
    if exp % 2 == 0:  #@4
        return half * half  #@5
    return half * half * base  #@7


bin_pow(2, 10)`),
}
