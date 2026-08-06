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
        printf("Largest = %d\\n", a);
    else
        printf("Largest = %d\\n", b);

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
        printf("Largest = %d\\n", a);
    else
        printf("Largest = %d\\n", b);

    return 0;
}`
    }
  },
  arraySort: {
    id: 'arraySort',
    filename: 'sort.c',
    language: 'c',
    title: 'Bubble Sort Algorithm',
    code: `#include <stdio.h>

int main() {
    int arr[5] = {64, 34, 25, 12, 22};
    int n = 5;
    
    printf("Original array: ");
    for(int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");

    for (int i = 0; i < n - 1; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    printf("Sorted array:   ");
    for(int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\\n");
    return 0;
}`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'OPTIMIZATION',
      summary: 'Bubble Sort is O(n^2). Can add swapped flag to optimize best-case O(n).',
      rootCause: 'No syntax or logic errors found. Algorithm runs in O(n^2) time complexity.',
      howToFix: 'Add a boolean flag `swapped` inside the outer loop to break early if no swaps occurred.',
      correctedCode: `#include <stdio.h>

int main() {
    int arr[5] = {64, 34, 25, 12, 22};
    int n = 5;

    for (int i = 0; i < n - 1; i++) {
        int swapped = 0;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
                swapped = 1;
            }
        }
        if (!swapped) break;
    }
    return 0;
}`
    }
  },
  mathCalc: {
    id: 'mathCalc',
    filename: 'math_demo.c',
    language: 'c',
    title: 'Math Library Functions',
    code: `#include <stdio.h>
#include <math.h>

int main() {
    double num = 25.0;
    double base = 2.0, exp = 8.0;

    printf("Square root of %.1f = %.2f\\n", num, sqrt(num));
    printf("Power %.1f^%.1f = %.2f\\n", base, exp, pow(base, exp));
    
    return 0;
}`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'INFO',
      summary: 'Code uses standard <math.h> library functions cleanly.',
      rootCause: 'No issues found.',
      howToFix: 'Code compiles and executes cleanly with gcc -lm flag.',
      correctedCode: `#include <stdio.h>
#include <math.h>

int main() {
    double num = 25.0;
    double base = 2.0, exp = 8.0;

    printf("Square root of %.1f = %.2f\\n", num, sqrt(num));
    printf("Power %.1f^%.1f = %.2f\\n", base, exp, pow(base, exp));
    
    return 0;
}`
    }
  }
};
