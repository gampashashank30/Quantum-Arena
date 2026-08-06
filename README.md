# 🚀 SmartCompiler — Write, Analyze, Learn

**SmartCompiler** is an online C code compiler, interactive terminal execution workspace, and AI analysis platform designed with dark UI styling.

![SmartCompiler UI Banner](https://img.shields.io/badge/SmartCompiler-v1.0.0-06b6d4?style=for-the-badge&logo=c)

---

## ✨ Features

- **⚡ Full C Execution Engine**: Simulates C code compilation and real-time execution in browser (`printf`, `scanf`, variables, arithmetic, loops, conditions).
- **🎨 High-Replica Dark UI Theme**: Recreates the exact layout from the SmartCompiler interface (Header, Navigation Pills, Code Editor, Interactive Terminal, AI Explanation).
- **🧠 Interactive AI Analysis Panel**:
  - `★ Run Analysis` Cyan Action button.
  - **AI Analysis**: Clear summary of code behavior and potential flaws.
  - **Root Cause**: Displays issue line numbers with badges (e.g. `Line 7` `LOGICAL`).
  - **How to Fix**: Step-by-step resolution guide.
  - **Show Corrected Code**: Preview fixed code and apply directly to the editor in 1 click!
- **📁 Pre-loaded Sample Selector**:
  1. **Factorial & Sum Program** (`main.c` from Screenshot 1).
  2. **Find Largest Number** (`main.c` from Screenshot 2).
- **🛠️ Interactive Modals**:
  - `⚙️ Admin`: Server node status, timeout quotas, memory allocation.
  - `🎓 AI Tutor`: Learning hub for pointers, memory management, and data structures.
  - `📊 Analytics`: Cyclomatic complexity, LOC count, memory footprint, runtime benchmarks.
  - `🕒 History (50)`: Execution log history of past 50 runs.
  - `🪲 Bug Tracker (+12)`: Static analysis bug detection with quick fixes.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/gampashashank30/Quantum-Arena.git
cd Quantum-Arena
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Modern CSS Design System (Flexbox/Grid, Dark Mode Tokens)
- **Icons**: Lucide React Icons
- **Execution Engine**: Browser C Runtime Simulator (`cRunner.js`)
