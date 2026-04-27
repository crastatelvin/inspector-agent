<div align="center">

# 🔍 INSPECTOR

### AI Code Review Agent — Multi-Dimensional Audit With Live Scan UI

[![Python](https://img.shields.io/badge/Python-3.11%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115%2B-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![NVIDIA](https://img.shields.io/badge/Provider-NVIDIA_NIM-76B900?style=for-the-badge&logo=nvidia&logoColor=white)](https://build.nvidia.com/)
[![CI](https://img.shields.io/github/actions/workflow/status/crastatelvin/inspector-agent/deploy.yml?branch=main&style=for-the-badge&label=CI&logo=github)](https://github.com/crastatelvin/inspector-agent/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

> **INSPECTOR** is a production-grade AI Code Review Agent. Paste any code snippet, run one intelligent scan, and get structured extraction for security vulnerabilities, performance bottlenecks, code quality issues, best practice violations, and improvement suggestions — all rendered in a premium "Dark Hacker" dashboard with real-time progress and actionable fixes.

<br/>

![Audit](https://img.shields.io/badge/Audit-Multi--Dimensional_Intelligence-ff2d55?style=for-the-badge) ![Realtime](https://img.shields.io/badge/Realtime-WebSocket_Progress-0af?style=for-the-badge) ![Hardened](https://img.shields.io/badge/Editor-Monaco_Integrated-39ff14?style=for-the-badge) ![Performance](https://img.shields.io/badge/Engine-Llama_3.1_405B-76B900?style=for-the-badge)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Application Preview](#-application-preview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Configuration](#-configuration)
- [Testing \& CI](#-testing--ci)
- [Security Notes](#-security-notes)
- [Design Decisions](#-design-decisions)
- [License](#-license)

---

## 🧠 Overview

INSPECTOR focuses on a critical engineering workflow: high-fidelity code reviews. The backend leverages **NVIDIA NIM (Llama-3.1-405B)** to run five simultaneous analysis passes, identifying risks and suggesting modern refactors with surgical precision.

Users can:

- Paste code into a professional **Monaco Editor** and watch live scan stages
- Extract structured findings (`security`, `performance`, `quality`, `best_practices`, `suggestions`)
- Review a dynamic **Quality Score Gauge** and grading system (A-F)
- Copy exact code fixes directly for downstream implementation
- Experience a "Dark Hacker" aesthetic with Matrix rain and scan beam animations

---

## 🖼️ Application Preview

<div align="center">

### 0) Demo Reel (Live Flow)
![Demo](https://raw.githubusercontent.com/crastatelvin/inspector-agent/main/docs/screenshots/demo.webp)

<br/>

### 1) Editor & Landing Page
![Dashboard](https://raw.githubusercontent.com/crastatelvin/inspector-agent/main/docs/screenshots/dashboard.png)

<br/>

### 2) Live Scan Progress
![Scanning](https://raw.githubusercontent.com/crastatelvin/inspector-agent/main/docs/screenshots/scanning.png)

<br/>

### 3) Multi-Dimensional Findings
![Issues](https://raw.githubusercontent.com/crastatelvin/inspector-agent/main/docs/screenshots/issues.png)

<br/>

### 4) Actionable Fixes
![Fixes](https://raw.githubusercontent.com/crastatelvin/inspector-agent/main/docs/screenshots/fixes.png)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Multi-Dimensional Audit** | Simultaneous scans for Security, Performance, Quality, and Best Practices |
| 🚀 **NVIDIA NIM Powered** | Leverages Llama-3.1-405B for senior-engineer level reasoning and fixes |
| 🔴 **Live Progress Stream** | WebSocket-driven progress events showing exactly what the AI is analyzing |
| 🛠️ **Monaco Editor Integration** | Full VSCode-grade editing experience with syntax highlighting and line numbers |
| 📊 **Dynamic Score Gauge** | Real-time quality scoring and grading based on cumulative issue severity |
| 💡 **Actionable Code Fixes** | Every issue includes a detailed explanation and a ready-to-copy fixed code snippet |
| 🎨 **Premium Hacker UI** | High-end dark theme with Matrix rain and animated scan beam overlays |
| ⏱️ **Parallel Execution** | All review dimensions are scanned in parallel via `asyncio.gather` for max speed |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────────┐
│                        React Inspector UI                         │
│                                                                   │
│  Monaco Editor ──► Scan Controls ──► Issue Dashboard (Cards)      │
│      │              │                    │                        │
│      └────── POST /review + WS /ws ◄─────┘                        │
│                                                                   │
└──────────────────────────────┬────────────────────────────────────┘
                               │
                               ▼
┌───────────────────────────────────────────────────────────────────┐
│                          FastAPI Backend                          │
│                                                                   │
│  Middleware: CORS + Request-ID Logging + Scoped WS Management     │
│                                                                   │
│  /review ─► review_agent.py  ─► asyncio.gather()                  │
│                                  ├► security_scan                 │
│                                  ├► performance_scan              │
│                                  ├► quality_scan                  │
│                                  └► nvidia_service.py             │
│                                                                   │
│  /ws     ─► client-scoped progress events (UUID routed)           │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | FastAPI, Pydantic, Uvicorn, Python 3.11+ |
| **AI Provider** | NVIDIA NIM (Llama-3.1-405B) |
| **Editor Engine** | Monaco Editor (@monaco-editor/react) |
| **Frontend** | React 18, Vite, Framer Motion, Axios |
| **Transport** | REST + WebSocket |
| **Styling** | Vanilla CSS (JetBrains Mono) |

---

## 📁 Project Structure

```
inspector-agent/
│
├── backend/
│   ├── main.py                    # FastAPI routes + scoped WS + middleware
│   ├── review_agent.py            # Parallelized AI scan orchestration
│   ├── nvidia_service.py          # NVIDIA NIM (OpenAI-compatible) integration
│   ├── code_analyzer.py           # Language detection + metrics logic
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Monaco Editor, Gauge, Cards, Matrix Rain
│   │   ├── pages/
│   │   │   └── ReviewPage.jsx     # Main Split Dashboard Layout
│   │   ├── hooks/
│   │   │   └── useReview.js       # UUID-scoped WS + API state management
│   │   ├── styles/
│   │   │   └── globals.css        # Premium Hacker styling tokens
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── .github/workflows/deploy.yml   # GitHub Pages deployment automation
├── LICENSE
└── README.md
```

---

## 🚀 Installation

### 1) Clone

```bash
git clone https://github.com/crastatelvin/inspector-agent.git
cd inspector-agent
```

### 2) Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# Configure NVIDIA_API_KEY in .env
python main.py
```

### 3) Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 💻 Usage

1. Open the dashboard and paste your target code into the Monaco Editor
2. Watch the scan progress in real time via the status console
3. Review extracted findings across tabs:
   - `SUMMARY`
   - `CRITICAL` / `HIGH` / `MEDIUM`
   - `SECURITY` / `PERF` / `QUALITY`
4. Expand any issue card to view the **PROPOSED FIX**
5. Click the copy icon to apply the fix to your source code

Quick health check:

```bash
curl -X GET http://localhost:8000/
```

---

## 📡 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Service health and version info |
| `POST` | `/review/{client_id}` | Initiate parallelized code audit |
| `WS` | `/ws/{client_id}` | Client-scoped progress event stream |

---

## ⚙️ Configuration

`backend/.env`:

```bash
NVIDIA_API_KEY=nvapi-...
```

`frontend/src/hooks/useReview.js`:

```javascript
const BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000/ws';
```

---

## 🧪 Testing & CI

Backend:
```bash
cd backend
# Run functional tests for the parser and AI logic
python -m pytest
```

Frontend:
```bash
cd frontend
# Verify build integrity
npm run build
```

---

## 🔒 Security Notes

- **Scoped WebSockets:** Progress updates are isolated per UUID `client_id` to prevent cross-session log leaking.
- **Environment Isolation:** API keys are restricted to the backend and never exposed to the client.
- **Input Validation:** Backend enforces code size limits and validates language patterns before AI submission.

---

## 🧭 Design Decisions

- **Parallelised Scans:** Using `asyncio.gather` for five simultaneous passes ensures deep-surgical detail without the latency of sequential calls.
- **Monaco Engine:** Professional syntax highlighting and line numbers are essential for the "Senior Engineer" UX.
- **UUID Routing:** Ensures real-time logs are accurately delivered to the initiating user in a multi-user environment.

---

## License

This project is licensed under the MIT License.

<div align="center">
Built by Telvin Crasta · Powered by NVIDIA NIM · Production Ready

⭐ If INSPECTOR helped you ship cleaner code, star the repo.
</div>
