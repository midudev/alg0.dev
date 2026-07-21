import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const mathJava: Record<string, CodeImplementation> = {
  'sieve-of-eratosthenes': annotated(`List<Integer> sieveOfEratosthenes(int n) {
    boolean[] isPrime = new boolean[n + 1];  //@2
    Arrays.fill(isPrime, true);
    isPrime[0] = isPrime[1] = false;

    for (int i = 2; i * i <= n; i++) {  //@5
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {  //@7
                isPrime[j] = false;
            }
        }
    }

    List<Integer> primes = new ArrayList<>();  //@12
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.add(i);
    }
    return primes;
}

sieveOfEratosthenes(30);`),
}
