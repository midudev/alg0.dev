import type { CodeImplementation } from '@lib/types'
import { annotated } from '@lib/code-languages'

export const mathCpp: Record<string, CodeImplementation> = {
  'sieve-of-eratosthenes': annotated(`vector<int> sieveOfEratosthenes(int n) {
    vector<bool> isPrime(n + 1, true);  //@2
    isPrime[0] = isPrime[1] = false;

    for (int i = 2; i * i <= n; i++) {  //@5
        if (isPrime[i]) {
            for (int j = i * i; j <= n; j += i) {  //@7
                isPrime[j] = false;
            }
        }
    }

    vector<int> primes;  //@12
    for (int i = 2; i <= n; i++) {
        if (isPrime[i]) primes.push_back(i);
    }
    return primes;
}

sieveOfEratosthenes(30);`),
}
