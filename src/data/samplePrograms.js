export const SAMPLE_PROGRAMS = {
  factorial: {
    id: 'factorial',
    filename: 'main.c',
    language: 'c',
    title: 'Factorial & Sum Calculator',
    code: `#include <stdio.h>

int main() {
    int n, i;
    long long fact = 0;

    printf("Enter a number: ");
    scanf("%d", &n);

    for (i = 1; i < n; i++) {
        fact = fact * i;
    }

    printf("Factorial of %d is %lld\\n", n, fact);

    int sum = 0;
    for (i = 0; i < n; i++) {
        sum = sum + i;
    }

    int avg = sum / n;
    printf("Sum of first %d numbers: %d\\n", n, sum);
    printf("Average: %d\\n", avg);

    return 0;
}`,
    aiAnalysis: {
      hasBug: true,
      bugLine: 5,
      issueType: 'LOGICAL',
      summary: 'Factorial variable initialized to 0 and loop condition misses last element.',
      rootCause: '1. Line 5: `fact` is initialized to 0. Multiplying by 0 will result in 0 for all factorial calculations.\n2. Line 10: Loop condition `i < n` stops before `n`, missing the final multiplication.',
      howToFix: '1. Change `long long fact = 0;` to `long long fact = 1;`.\n2. Change loop condition `i < n` to `i <= n`.',
      correctedCode: `#include <stdio.h>

int main() {
    int n, i;
    long long fact = 1; // Fixed: initialized to 1

    printf("Enter a number: ");
    scanf("%d", &n);

    for (i = 1; i <= n; i++) { // Fixed: condition changed to i <= n
        fact = fact * i;
    }

    printf("Factorial of %d is %lld\\n", n, fact);

    int sum = 0;
    for (i = 1; i <= n; i++) {
        sum = sum + i;
    }

    int avg = sum / n;
    printf("Sum of first %d numbers: %d\\n", n, sum);
    printf("Average: %d\\n", avg);

    return 0;
}`
    }
  },
  largestNumber: {
    id: 'largestNumber',
    filename: 'main.c',
    language: 'c',
    title: 'Find Largest Number (Buggy logic)',
    code: `#include <stdio.h>

int main() {
    int a = 20, b = 30;

    if (a < b)
        printf("Largest = %d", a);
    else
        printf("Largest = %d", b);

    return 0;
}`,
    aiAnalysis: {
      hasBug: true,
      bugLine: 7,
      issueType: 'LOGICAL',
      summary: 'Check the condition and output',
      rootCause: 'Line 7: LOGICAL - Check the condition and output. When `a < b` is true (20 < 30), printing `a` outputs 20, which is smaller, not the largest number.',
      howToFix: 'Change `printf("Largest = %d", a);` to `printf("Largest = %d", b);` or swap condition `if (a > b)`.',
      correctedCode: `#include <stdio.h>

int main() {
    int a = 20, b = 30;

    if (a > b)
        printf("Largest = %d", a);
    else
        printf("Largest = %d", b);

    return 0;
}`
    }
  }
};
