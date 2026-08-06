async function testGCC() {
  try {
    const res = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'gcc-head',
        code: '#include <stdio.h>\nint main() { printf("Hello from Real GCC Compiler!\\n"); return 0; }'
      })
    });
    const data = await res.json();
    console.log("GCC API Response:", data);
  } catch (err) {
    console.error("GCC API Error:", err);
  }
}
testGCC();
