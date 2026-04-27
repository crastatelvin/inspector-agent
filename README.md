# 🔍 INSPECTOR — AI Code Review Agent

![INSPECTOR Header](https://raw.githubusercontent.com/crastatelvin/inspector-agent/main/frontend/public/preview.png)

**INSPECTOR** is a production-grade AI Code Review Agent built for the modern developer. Paste your code, and watch as a multi-dimensional AI engine performs a deep-surgical audit for security, performance, and best practices.

## 🚀 One-Line Pitch
> "Paste any code. INSPECTOR finds every vulnerability, performance issue, and code smell — then shows you exactly how to fix each one."

## ✨ Key Features
- **Parallel AI Scanning:** Powered by **NVIDIA NIM (Llama-3.1-405B)**. 5 simultaneous scan dimensions: Security, Performance, Code Quality, Best Practices, and Suggestions.
- **Dark Hacker Aesthetic:** A premium VSCode-dark interface with interactive Matrix rain backgrounds and animated scan beams.
- **Monaco Editor:** Professional-grade code editing experience with full syntax highlighting.
- **Scoped Progress Logs:** Real-time feedback via WebSockets, isolated per session.
- **Actionable Fixes:** Every detected issue comes with an explanation and a "Copy Fix" action.

## 🛠️ Tech Stack
- **Backend:** FastAPI (Python), NVIDIA NIM API, WebSockets.
- **Frontend:** React (Vite), Framer Motion, Monaco Editor, Axios.
- **Styling:** CSS3 Custom Properties (Vanilla).

## 📦 Setup & Installation

### Backend
1. Navigate to `backend/`.
2. Create a virtual environment: `python -m venv venv`.
3. Install dependencies: `pip install -r requirements.txt`.
4. Add your `NVIDIA_API_KEY` to a `.env` file.
5. Start the server: `python main.py`.

### Frontend
1. Navigate to `frontend/`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## 📄 License
Created by **Telvin Crasta**. Licensed under **MIT**.

---
*Every vulnerability found. Every fix provided. Every line reviewed.*
