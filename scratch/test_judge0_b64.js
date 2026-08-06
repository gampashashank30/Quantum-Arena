async function testJudge0B64() {
  const code = '#include <stdio.h>\nint main() { printf("Hello GCC\\n"); return 0; }';
  const b64Code = btoa(code);

  try {
    const res = await fetch('https://ce.judge0.com/submissions?wait=true&base64_encoded=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language_id: 50, // C (GCC 9.2.0)
        source_code: b64Code,
        stdin: ''
      })
    });
    const data = await res.json();
    console.log("Decoded stdout:", data.stdout ? atob(data.stdout) : null);
    console.log("Decoded compile_output:", data.compile_output ? atob(data.compile_output) : null);
    console.log("Status:", data.status);
  } catch (err) {
    console.error(err);
  }
}
testJudge0B64();
