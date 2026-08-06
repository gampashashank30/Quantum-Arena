async function testJudge0Error() {
  try {
    const res = await fetch('https://ce.judge0.com/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: 50, // C (GCC)
        source_code: '#include <stdio.h>\nint main() { printf("Hello" \n return 0; }', // Missing closing bracket & semicolon
        stdin: ''
      })
    });
    const data = await res.json();
    console.log("Judge0 Error Response:", data);
  } catch (err) {
    console.error("Judge0 Error API Error:", err);
  }
}
testJudge0Error();
