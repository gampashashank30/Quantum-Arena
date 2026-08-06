async function testPolyglot() {
  // Test Python 3 (ID 71)
  const pyCode = 'print("Hello from Real Python 3!")\nprint(f"Sum = {50 + 50}")';
  const pyRes = await fetch('https://ce.judge0.com/submissions?wait=true&base64_encoded=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language_id: 71, source_code: btoa(pyCode) })
  });
  const pyData = await pyRes.json();
  console.log("Python Output:", atob(pyData.stdout));

  // Test Java (ID 62)
  const javaCode = 'public class Main { public static void main(String[] args) { System.out.println("Hello from Real Java 17!"); } }';
  const javaRes = await fetch('https://ce.judge0.com/submissions?wait=true&base64_encoded=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ language_id: 62, source_code: btoa(javaCode) })
  });
  const javaData = await javaRes.json();
  console.log("Java Output:", atob(javaData.stdout));
}
testPolyglot();
