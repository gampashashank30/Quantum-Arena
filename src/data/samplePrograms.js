export const LANGUAGE_DEFAULTS = {
  c: {
    language: 'c',
    filename: 'main.c',
    code: `#include <stdio.h>

int main() {
    printf("Hello World from C!\\n");
    int a = 15, b = 25;
    printf("Sum of %d + %d = %d\\n", a, b, a + b);
    return 0;
}`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'OPTIMIZATION',
      summary: 'Clean C code with standard output formatting.',
      rootCause: 'No issues found in main program.',
      howToFix: 'Code runs cleanly with gcc -O2.',
      correctedCode: `#include <stdio.h>

int main() {
    printf("Hello World from C!\\n");
    return 0;
}`
    }
  },
  python: {
    language: 'python',
    filename: 'main.py',
    code: `# Python 3 Program
def main():
    print("Hello World from Python 3!")
    num = 5
    fact = 1
    for i in range(1, num + 1):
        fact *= i
    print(f"Factorial of {num} is {fact}")

if __name__ == "__main__":
    main()`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'INFO',
      summary: 'Python 3 function utilizing range iteration.',
      rootCause: 'No issues found.',
      howToFix: 'Python 3 script executes cleanly.',
      correctedCode: `print("Hello World from Python 3!")`
    }
  },
  java: {
    language: 'java',
    filename: 'Main.java',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World from Java 17!");
        int a = 20, b = 30;
        System.out.println("Sum of " + a + " + " + b + " = " + (a + b));
    }
}`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'INFO',
      summary: 'Standard Java class Main with entry method.',
      rootCause: 'No issues found.',
      howToFix: 'Compiles with javac Main.java.',
      correctedCode: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello World from Java 17!");
    }
}`
    }
  }
};

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
    long long fact = 1;

    printf("Enter a number: ");
    scanf("%d", &n);

    for (i = 1; i <= n; i++) {
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
  }
};
