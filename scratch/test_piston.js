async function testPiston() {
  try {
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: 'c',
        version: '10.2.0',
        files: [
          {
            name: 'main.c',
            content: '#include <stdio.h>\nint main() { printf("Piston Real GCC Output: %d\\n", 42 * 2); return 0; }'
          }
        ]
      })
    });
    const data = await res.json();
    console.log("Piston API Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Piston API Error:", err);
  }
}
testPiston();
