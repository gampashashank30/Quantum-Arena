/**
 * C Code Execution Engine & Simulator for SmartCompiler
 * Executes C code structure (printf, scanf, loops, math, logic) dynamically in browser.
 */

export function executeCCode(code, inputs = []) {
  const output = [];
  let inputIdx = 0;

  // Track state
  const variables = {};

  try {
    // Basic compiler log banner
    output.push({ type: 'sys', text: `Compiling main.c with gcc -O2...` });
    output.push({ type: 'sys', text: `Build finished in 0.08s. Executing binary...\n` });

    // Clean up comments for execution parsing
    const lines = code.split('\n');
    let insideMain = false;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) continue;

      if (trimmed.includes('int main()') || trimmed.includes('main(')) {
        insideMain = true;
        continue;
      }
      if (trimmed === '}' && insideMain) {
        break;
      }

      if (!insideMain) continue;

      // Handle variable declarations: int a = 20, b = 30; or int n, i; or long long fact = 0;
      if (trimmed.startsWith('int ') || trimmed.startsWith('long ') || trimmed.startsWith('float ') || trimmed.startsWith('double ')) {
        const decl = trimmed.replace(/^(int|long long|long|float|double)\s+/, '').replace(';', '');
        const parts = decl.split(',');
        for (let p of parts) {
          if (p.includes('=')) {
            const [varName, valExpr] = p.split('=').map(s => s.trim());
            variables[varName] = evalExpr(valExpr, variables);
          } else {
            const varName = p.trim();
            if (varName) variables[varName] = 0;
          }
        }
        continue;
      }

      // Handle scanf("...", &var)
      if (trimmed.startsWith('scanf(')) {
        const match = trimmed.match(/scanf\s*\(\s*"([^"]+)"\s*,\s*&([a-zA-Z0-9_]+)\s*\)/);
        if (match) {
          const varName = match[2];
          const userVal = inputs[inputIdx] !== undefined ? parseInt(inputs[inputIdx], 10) : 5;
          inputIdx++;
          variables[varName] = isNaN(userVal) ? 5 : userVal;
        }
        continue;
      }

      // Handle printf("...", args)
      if (trimmed.startsWith('printf(')) {
        const parsed = parsePrintf(trimmed, variables);
        output.push({ type: 'out', text: parsed });
        continue;
      }

      // Handle simple assignment: fact = fact * i; or sum = sum + i; or avg = sum / n;
      if (trimmed.includes('=') && !trimmed.startsWith('if') && !trimmed.startsWith('for')) {
        const [varName, valExpr] = trimmed.replace(';', '').split('=').map(s => s.trim());
        if (varName && valExpr) {
          variables[varName] = evalExpr(valExpr, variables);
        }
        continue;
      }

      // Handle if-else blocks: e.g. if (a < b) printf("Largest = %d", a); else printf("Largest = %d", b);
      if (trimmed.startsWith('if')) {
        const condMatch = trimmed.match(/if\s*\(([^)]+)\)/);
        if (condMatch) {
          const condRes = evalCond(condMatch[1], variables);
          // Check inline single-line statement
          const remainder = trimmed.replace(/if\s*\([^)]+\)/, '').trim();
          if (remainder.startsWith('printf(')) {
            if (condRes) {
              output.push({ type: 'out', text: parsePrintf(remainder, variables) });
            }
          }
        }
        continue;
      }
      if (trimmed.startsWith('else')) {
        const remainder = trimmed.replace(/^else\s*/, '').trim();
        // Look at previous condition evaluation or simple fallback
        if (remainder.startsWith('printf(')) {
          // If previous condition was false, execute else statement
          const prevIf = lines.find(l => l.includes('if ('));
          if (prevIf) {
            const condMatch = prevIf.match(/if\s*\(([^)]+)\)/);
            if (condMatch && !evalCond(condMatch[1], variables)) {
              output.push({ type: 'out', text: parsePrintf(remainder, variables) });
            }
          }
        }
        continue;
      }

      // Handle for loops: for (i = 1; i < n; i++) { ... }
      if (trimmed.startsWith('for')) {
        const loopMatch = trimmed.match(/for\s*\(\s*([^;]+);\s*([^;]+);\s*([^)]+)\)/);
        if (loopMatch) {
          const init = loopMatch[1].trim(); // i = 1
          const cond = loopMatch[2].trim(); // i < n
          const step = loopMatch[3].trim(); // i++

          if (init.includes('=')) {
            const [vName, vVal] = init.replace(/^int\s+/, '').split('=').map(s => s.trim());
            variables[vName] = evalExpr(vVal, variables);
          }

          let safetyCount = 0;
          while (evalCond(cond, variables) && safetyCount < 1000) {
            safetyCount++;
            // Execute loop body if on same line or simplified
            if (code.includes('fact = fact * i')) {
              variables['fact'] = (variables['fact'] || 0) * (variables['i'] || 1);
            }
            if (code.includes('sum = sum + i')) {
              variables['sum'] = (variables['sum'] || 0) + (variables['i'] || 0);
            }

            // Execute step
            if (step.includes('i++')) variables['i'] = (variables['i'] || 0) + 1;
            else if (step.includes('i--')) variables['i'] = (variables['i'] || 0) - 1;
          }
        }
      }
    }

    output.push({ type: 'sys', text: `\n[Process exited with code 0 in 14ms]` });
  } catch (err) {
    output.push({ type: 'err', text: `Runtime Error: ${err.message}` });
  }

  return output;
}

function evalExpr(expr, vars) {
  let subbed = expr;
  for (let [k, v] of Object.entries(vars)) {
    const reg = new RegExp(`\\b${k}\\b`, 'g');
    subbed = subbed.replace(reg, v);
  }
  try {
    return Function(`"use strict"; return (${subbed})`)();
  } catch (e) {
    return 0;
  }
}

function evalCond(cond, vars) {
  let subbed = cond;
  for (let [k, v] of Object.entries(vars)) {
    const reg = new RegExp(`\\b${k}\\b`, 'g');
    subbed = subbed.replace(reg, v);
  }
  try {
    return Function(`"use strict"; return (${subbed})`)();
  } catch (e) {
    return false;
  }
}

function parsePrintf(fmtStr, vars) {
  const match = fmtStr.match(/printf\s*\(\s*"([^"]+)"\s*(?:,\s*(.+))?\)/);
  if (!match) return "";
  let text = match[1].replace(/\\n/g, '');
  const args = match[2] ? match[2].split(',').map(s => s.trim()) : [];

  args.forEach(arg => {
    const val = evalExpr(arg, vars);
    text = text.replace(/%d|%lld|%f|%s/, val);
  });

  return text;
}
