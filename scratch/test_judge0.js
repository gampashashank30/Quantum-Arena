async function testJudge0() {
  try {
    const res = await fetch('https://ce.judge0.com/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: 50, // C (GCC 9.2.0)
        source_code: '#include <stdio.h>\nint main() { printf("Judge0 Real GCC Output: %d\\n", 100 + 200); return 0; }',
        stdin: ''
      })
    });
    const data = await res.json();
    console.log("Judge0 API Response:", data);
  } catch (err) {
    console.error("Judge0 API Error:", err);
  }
}
testJudge0();
