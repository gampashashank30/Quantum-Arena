/**
 * QuantumArenaDB - Browser IndexedDB Engine
 * Persistent local database for code snippets, execution history, user profile, bug reports, and settings.
 */

const DB_NAME = 'QuantumArenaDB';
const DB_VERSION = 1;

let dbPromise = null;

export function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. Snippets Store
      if (!db.objectStoreNames.contains('snippets')) {
        const snippetStore = db.createObjectStore('snippets', { keyPath: 'id', autoIncrement: true });
        snippetStore.createIndex('title', 'title', { unique: false });
        snippetStore.createIndex('language', 'language', { unique: false });
        snippetStore.createIndex('updated_at', 'updated_at', { unique: false });
      }

      // 2. Execution History Store
      if (!db.objectStoreNames.contains('history')) {
        const historyStore = db.createObjectStore('history', { keyPath: 'id', autoIncrement: true });
        historyStore.createIndex('timestamp', 'timestamp', { unique: false });
        historyStore.createIndex('language', 'language', { unique: false });
        historyStore.createIndex('status', 'status', { unique: false });
      }

      // 3. User Profile Store
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile', { keyPath: 'id' });
      }

      // 4. Bug Reports Store
      if (!db.objectStoreNames.contains('bug_reports')) {
        const bugStore = db.createObjectStore('bug_reports', { keyPath: 'id', autoIncrement: true });
        bugStore.createIndex('severity', 'severity', { unique: false });
        bugStore.createIndex('created_at', 'created_at', { unique: false });
      }

      // 5. Settings Store
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      seedInitialData(db).then(() => resolve(db));
    };

    request.onerror = (event) => {
      console.error("IndexedDB error:", event.target.error);
      reject(event.target.error);
    };
  });

  return dbPromise;
}

// Seed default initial records if empty
async function seedInitialData(db) {
  // Check Profile
  const profileTx = db.transaction('profile', 'readwrite');
  const profileStore = profileTx.objectStore('profile');
  const profileCountReq = profileStore.count();

  profileCountReq.onsuccess = () => {
    if (profileCountReq.result === 0) {
      profileStore.add({
        id: 'default_user',
        name: 'Shashank Gam...',
        avatar: 'S',
        avatarColor: '#16a34a',
        role: 'Pro Developer',
        xp: 1450,
        favLanguage: 'C / C++',
        totalRuns: 50,
        successRate: '94%',
        createdAt: new Date().toISOString()
      });
    }
  };

  // Check Snippets
  const snippetTx = db.transaction('snippets', 'readwrite');
  const snippetStore = snippetTx.objectStore('snippets');
  const snippetCountReq = snippetStore.count();

  snippetCountReq.onsuccess = () => {
    if (snippetCountReq.result === 0) {
      const initialSnippets = [
        {
          title: 'Factorial & Sum Calculator',
          language: 'c',
          filename: 'factorial.c',
          code: `#include <stdio.h>\n\nint main() {\n    int n = 5;\n    long long fact = 1;\n    for (int i = 1; i <= n; i++) {\n        fact *= i;\n    }\n    printf("Factorial of %d = %lld\\n", n, fact);\n    return 0;\n}`,
          tags: ['math', 'loops'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          title: 'Bubble Sort Algorithm',
          language: 'c',
          filename: 'bubble_sort.c',
          code: `#include <stdio.h>\n\nvoid bubbleSort(int arr[], int n) {\n    for (int i = 0; i < n-1; i++) {\n        for (int j = 0; j < n-i-1; j++) {\n            if (arr[j] > arr[j+1]) {\n                int temp = arr[j];\n                arr[j] = arr[j+1];\n                arr[j+1] = temp;\n            }\n        }\n    }\n}\n\nint main() {\n    int arr[] = {64, 34, 25, 12, 22, 11, 90};\n    int n = sizeof(arr)/sizeof(arr[0]);\n    bubbleSort(arr, n);\n    printf("Sorted array: ");\n    for (int i=0; i < n; i++)\n        printf("%d ", arr[i]);\n    printf("\\n");\n    return 0;\n}`,
          tags: ['algorithms', 'sorting'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          title: 'Python Async Fibonacci',
          language: 'python',
          filename: 'fibonacci.py',
          code: `def fibonacci(n):\n    a, b = 0, 1\n    result = []\n    for _ in range(n):\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint("Fibonacci series:", fibonacci(10))`,
          tags: ['python', 'sequence'],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      initialSnippets.forEach(s => snippetStore.add(s));
    }
  };

  // Check Bugs
  const bugTx = db.transaction('bug_reports', 'readwrite');
  const bugStore = bugTx.objectStore('bug_reports');
  const bugCountReq = bugStore.count();

  bugCountReq.onsuccess = () => {
    if (bugCountReq.result === 0) {
      const initialBugs = [
        {
          title: 'Variable `fact` initialized to 0 in factorial loop',
          description: 'Line 5: Multiplication by zero causes output to remain 0.',
          severity: 'CRITICAL',
          line_num: 5,
          status: 'Open',
          created_at: new Date().toISOString()
        },
        {
          title: 'Strict inequality `i < n` omits bound element',
          description: 'Line 10: Loop boundary excludes index n.',
          severity: 'LOGICAL',
          line_num: 10,
          status: 'In Review',
          created_at: new Date().toISOString()
        },
        {
          title: 'Unchecked division by variable `n` without zero-check',
          description: 'Line 21: Risk of Floating Point Exception if n is zero.',
          severity: 'WARNING',
          line_num: 21,
          status: 'Resolved',
          created_at: new Date().toISOString()
        }
      ];
      initialBugs.forEach(b => bugStore.add(b));
    }
  };
}

/* ==================== HELPER API METHODS ==================== */

async function getStore(storeName, mode = 'readonly') {
  const db = await openDatabase();
  const tx = db.transaction(storeName, mode);
  return tx.objectStore(storeName);
}

// History Methods
export async function addHistoryEntry(entry) {
  try {
    const store = await getStore('history', 'readwrite');
    const record = {
      timestamp: new Date().toISOString(),
      displayTime: 'Just now',
      filename: entry.filename || 'main.c',
      language: entry.language || 'c',
      code: entry.code || '',
      status: entry.status || 'Success',
      dur: entry.dur || '14ms',
      memKB: entry.memKB || '1168 KB',
      exitCode: entry.exitCode !== undefined ? entry.exitCode : 0,
      logs: entry.logs || []
    };
    return new Promise((resolve, reject) => {
      const req = store.add(record);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to save run history to DB:", err);
  }
}

export async function getAllHistory() {
  try {
    const store = await getStore('history', 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result.reverse()); // most recent first
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error("Failed to load history from DB:", err);
    return [];
  }
}

export async function clearHistory() {
  const store = await getStore('history', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.clear();
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Snippet Methods
export async function saveSnippet(snippet) {
  const store = await getStore('snippets', 'readwrite');
  const record = {
    title: snippet.title || 'Untitled Snippet',
    language: snippet.language || 'c',
    filename: snippet.filename || 'main.c',
    code: snippet.code || '',
    tags: snippet.tags || ['custom'],
    created_at: snippet.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  return new Promise((resolve, reject) => {
    const req = snippet.id ? store.put({ ...record, id: snippet.id }) : store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function getAllSnippets() {
  const store = await getStore('snippets', 'readonly');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteSnippet(id) {
  const store = await getStore('snippets', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// User Profile Methods
export async function getUserProfile() {
  try {
    const store = await getStore('profile', 'readonly');
    return new Promise((resolve, reject) => {
      const req = store.get('default_user');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    return null;
  }
}

export async function updateUserProfile(profileData) {
  const store = await getStore('profile', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.put({ id: 'default_user', ...profileData });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// Bug Report Methods
export async function getAllBugs() {
  const store = await getStore('bug_reports', 'readonly');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addBugReport(bug) {
  const store = await getStore('bug_reports', 'readwrite');
  const record = {
    title: bug.title,
    description: bug.description,
    severity: bug.severity || 'WARNING',
    line_num: bug.line_num || 1,
    status: bug.status || 'Open',
    created_at: new Date().toISOString()
  };
  return new Promise((resolve, reject) => {
    const req = store.add(record);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteBugReport(id) {
  const store = await getStore('bug_reports', 'readwrite');
  return new Promise((resolve, reject) => {
    const req = store.delete(id);
    req.onsuccess = () => resolve(true);
    req.onerror = () => reject(req.error);
  });
}

// Database Diagnostics & Export / Import
export async function getDatabaseStats() {
  const db = await openDatabase();
  const stores = ['snippets', 'history', 'profile', 'bug_reports', 'settings'];
  const stats = {};
  let totalRecords = 0;

  for (const storeName of stores) {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const count = await new Promise(res => {
      const r = store.count();
      r.onsuccess = () => res(r.result);
    });
    stats[storeName] = count;
    totalRecords += count;
  }

  return {
    dbName: DB_NAME,
    version: DB_VERSION,
    totalRecords,
    storeCounts: stats
  };
}

export async function exportDatabaseJSON() {
  const db = await openDatabase();
  const stores = ['snippets', 'history', 'profile', 'bug_reports', 'settings'];
  const exportData = {
    exportDate: new Date().toISOString(),
    dbName: DB_NAME,
    version: DB_VERSION,
    data: {}
  };

  for (const storeName of stores) {
    const store = await getStore(storeName, 'readonly');
    exportData.data[storeName] = await new Promise(res => {
      const r = store.getAll();
      r.onsuccess = () => res(r.result);
    });
  }

  return JSON.stringify(exportData, null, 2);
}

export async function importDatabaseJSON(jsonStr) {
  const parsed = JSON.parse(jsonStr);
  if (!parsed.data) throw new Error("Invalid database export format");

  const db = await openDatabase();
  const stores = ['snippets', 'history', 'profile', 'bug_reports', 'settings'];

  for (const storeName of stores) {
    if (parsed.data[storeName] && Array.isArray(parsed.data[storeName])) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.clear();
      for (const item of parsed.data[storeName]) {
        store.add(item);
      }
    }
  }

  return true;
}
