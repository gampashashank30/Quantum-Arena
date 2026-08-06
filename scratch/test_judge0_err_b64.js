async function testJudge0ErrB64() {
  const code = '#include <stdio.h>\nint main() { printf("Hello" \n return 0; }';
  const b64Code = btoa(code);

  try {
    const res = await fetch('https://ce.judge0.com/submissions?wait=true&base64_encoded=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: 50, // C (GCC)
        source_code: b64Code
      })
    });
    const data = await res.json();
    console.log("Decoded compile_output:\n", data.compile_output ? atob(data.compile_output) : 'None');
    console.log("Decoded stderr:\n", data.stderr ? atob(data.stderr) : 'None');
    console.log("Status:", data.status);
  } catch (err) {
    console.error(err);
  }
}
testJudge0ErrB64();
