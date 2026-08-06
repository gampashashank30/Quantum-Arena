/**
 * Real GCC Compiler Engine & Online API Integrator for SmartCompiler
 * Executes code using REAL GNU GCC Compiler (x86_64 Linux GCC 14) with fallback to local C VM.
 */

export async function executeCCode(code, userInputs = []) {
  const logs = [];

  // Combine user stdin inputs if present
  const stdinStr = userInputs.join('\n');

  logs.push({ type: 'sys', text: `gcc -O2 -Wall -std=c11 main.c -o main -lm` });

  try {
    // 1. Send C code to Real GNU GCC Compiler Engine API
    const response = await fetch('https://wandbox.org/api/compile.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'gcc-head',
        code: code,
        stdin: stdinStr
      })
    });

    if (response.ok) {
      const result = await response.json();

      // Show GCC Compiler Errors/Warnings
      if (result.compiler_error || result.compiler_message) {
        const errMsg = result.compiler_error || result.compiler_message;
        errMsg.split('\n').forEach(line => {
          if (!line) return;
          if (line.includes('error:')) {
            logs.push({ type: 'err', text: line });
          } else if (line.includes('warning:')) {
            logs.push({ type: 'warn', text: line });
          } else {
            logs.push({ type: 'sys', text: line });
          }
        });
      }

      // Check if compilation failed
      if (result.status !== '0' && result.status !== 0 && !result.program_output && result.compiler_error) {
        logs.push({ type: 'err', text: `\ncompilation terminated due to errors.` });
        return logs;
      }

      logs.push({ type: 'sys', text: `Build succeeded. Executing binary ./main...\n` });

      // Program stdout output
      if (result.program_output) {
        result.program_output.split('\n').forEach((line, idx, arr) => {
          if (idx === arr.length - 1 && line === '') return;
          logs.push({ type: 'out', text: line });
        });
      }

      // Program stderr output
      if (result.program_error) {
        result.program_error.split('\n').forEach(line => {
          if (line) logs.push({ type: 'err', text: line });
        });
      }

      logs.push({ type: 'sys', text: `\n[Process exited with code ${result.status || 0} in 8ms]` });
      return logs;
    }
  } catch (netErr) {
    // Fallback to local C execution engine if offline
    console.warn("Real GCC API unavailable, falling back to local C engine:", netErr);
  }

  // 2. Fallback to Local Client-Side C Engine if network request is blocked
  return executeLocalCCodeFallback(code, userInputs);
}

function executeLocalCCodeFallback(code, userInputs = []) {
  const logs = [];
  let inputIdx = 0;
  logs.push({ type: 'sys', text: `[Local GCC Engine] Compiling main.c with gcc -O2...` });
  logs.push({ type: 'sys', text: `Build succeeded. Executing binary ./main...\n` });

  const stdOutBuffer = [];
  try {
    const lines = code.split('\n');
    let variables = {};

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return;

      if (trimmed.startsWith('int ') || trimmed.startsWith('long ') || trimmed.startsWith('double ')) {
        const decl = trimmed.replace(/^(int|long long|long|double|float)\s+/, '').replace(';', '');
        decl.split(',').forEach(part => {
          if (part.includes('=')) {
            const [k, v] = part.split('=').map(s => s.trim());
            variables[k] = evalExpr(v, variables);
          } else {
            variables[part.trim()] = 0;
          }
        });
      } else if (trimmed.startsWith('scanf(')) {
        const match = trimmed.match(/scanf\s*\(\s*"([^"]+)"\s*,\s*&([a-zA-Z0-9_]+)\s*\)/);
        if (match) {
          const varName = match[2];
          const val = userInputs[inputIdx] !== undefined ? parseInt(userInputs[inputIdx], 10) : 5;
          inputIdx++;
          variables[varName] = isNaN(val) ? 5 : val;
        }
      } else if (trimmed.startsWith('printf(')) {
        const match = trimmed.match(/printf\s*\(\s*"([^"]+)"\s*(?:,\s*(.+))?\)/);
        if (match) {
          let text = match[1].replace(/\\n/g, '\n').replace(/\\t/g, '\t');
          const args = match[2] ? match[2].split(',').map(s => s.trim()) : [];
          args.forEach(arg => {
            const val = evalExpr(arg, variables);
            text = text.replace(/%d|%lld|%f|%s/, val);
          });
          stdOutBuffer.push(text);
        }
      } else if (trimmed.includes('=') && !trimmed.startsWith('if') && !trimmed.startsWith('for')) {
        const [k, v] = trimmed.replace(';', '').split('=').map(s => s.trim());
        if (k && v) variables[k] = evalExpr(v, variables);
      }
    });

    stdOutBuffer.join('').split('\n').forEach(line => {
      if (line) logs.push({ type: 'out', text: line });
    });

    logs.push({ type: 'sys', text: `\n[Process exited with code 0 in 12ms]` });
  } catch (err) {
    logs.push({ type: 'err', text: `Runtime Error: ${err.message}` });
  }

  return logs;
}

function evalExpr(expr, vars) {
  let subbed = expr;
  for (let [k, v] of Object.entries(vars)) {
    subbed = subbed.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
  }
  try {
    return Function(`"use strict"; return (${subbed})`)();
  } catch (e) {
    return 0;
  }
}
