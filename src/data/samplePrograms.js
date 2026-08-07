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
      correctedCode: `#include <stdio.h>\n\nint main() {\n    printf("Hello World from C!\\n");\n    return 0;\n}`
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
      correctedCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello World from Java 17!");\n    }\n}`
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
  },
  pointersMemory: {
    id: 'pointersMemory',
    filename: 'pointers.c',
    language: 'c',
    title: 'Pointers & Dynamic Memory Allocation (malloc)',
    code: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int*) malloc(n * sizeof(int));

    if (arr == NULL) {
        printf("Memory allocation failed!\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) {
        arr[i] = (i + 1) * 10;
    }

    printf("Dynamically allocated array values:\\n");
    for (int i = 0; i < n; i++) {
        printf("arr[%d] = %d (Address: %p)\\n", i, arr[i], (void*)&arr[i]);
    }

    free(arr);
    printf("Memory successfully freed!\\n");
    return 0;
}`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'OPTIMIZATION',
      summary: 'Demonstrates pointer arithmetic and dynamic memory allocation with malloc and free.',
      rootCause: 'No memory leaks found; free(arr) correctly invoked.',
      howToFix: 'Standard heap memory allocation practice.',
      correctedCode: `// Memory clean`
    }
  },
  linkedList: {
    id: 'linkedList',
    filename: 'linked_list.c',
    language: 'c',
    title: 'Singly Linked List Node Insertion & Traversal',
    code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

void printList(struct Node* n) {
    while (n != NULL) {
        printf(" [%d] ->", n->data);
        n = n->next;
    }
    printf(" NULL\\n");
}

int main() {
    struct Node* head = (struct Node*)malloc(sizeof(struct Node));
    struct Node* second = (struct Node*)malloc(sizeof(struct Node));
    struct Node* third = (struct Node*)malloc(sizeof(struct Node));

    head->data = 100;
    head->next = second;

    second->data = 200;
    second->next = third;

    third->data = 300;
    third->next = NULL;

    printf("Linked List traversal:\\n");
    printList(head);

    free(head);
    free(second);
    free(third);
    return 0;
}`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'INFO',
      summary: 'Singly Linked List with struct Node pointer linking.',
      rootCause: 'No issues found.',
      howToFix: 'Standard dynamic node creation.',
      correctedCode: `// Clean implementation`
    }
  },
  binarySearch: {
    id: 'binarySearch',
    filename: 'binary_search.c',
    language: 'c',
    title: 'Recursive Binary Search Algorithm',
    code: `#include <stdio.h>

int binarySearch(int arr[], int l, int r, int x) {
    if (r >= l) {
        int mid = l + (r - l) / 2;
        if (arr[mid] == x) return mid;
        if (arr[mid] > x) return binarySearch(arr, l, mid - 1, x);
        return binarySearch(arr, mid + 1, r, x);
    }
    return -1;
}

int main() {
    int arr[] = {2, 3, 4, 10, 40, 50, 70, 90};
    int n = sizeof(arr) / sizeof(arr[0]);
    int x = 40;
    int result = binarySearch(arr, 0, n - 1, x);

    if (result == -1)
        printf("Element %d is not present in array\\n", x);
    else
        printf("Element %d is present at index %d\\n", x, result);
    return 0;
}`,
    aiAnalysis: {
      hasBug: false,
      bugLine: 0,
      issueType: 'OPTIMIZATION',
      summary: 'O(log N) divide-and-conquer binary search algorithm.',
      rootCause: 'No issues found.',
      howToFix: 'Executes cleanly.',
      correctedCode: `// Clean O(log N)`
    }
  }
};
