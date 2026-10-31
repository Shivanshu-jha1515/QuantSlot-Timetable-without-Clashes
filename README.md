# QuantSlot - Quantum-Inspired Timetable Optimizer

> **"From 18 clashes to zero, in seconds."**

QuantSlot is a production-quality, quantum-inspired timetable optimization platform built for colleges, high schools, and educational institutions. It transforms complex academic scheduling constraints into a **Quadratic Unconstrained Binary Optimization (QUBO)** problem and solves it in milliseconds using simulated quantum annealing.

---

## 🚀 Features

- **Quantum QUBO Formulation**:
  - **$H_1$**: Exact slot assignment penalty ($A \sum_i (\sum_s x_{i,s} - 1)^2$) ensures every course receives exactly one time slot.
  - **$H_2$**: Zero-conflict penalty ($B \sum_{i < j, s} C_{i,j} x_{i,s} x_{j,s}$) eradicates teacher double-booking, room overlap, and student cohort clashes.
  - **$H_3$**: Soft preference & schedule balance ($C \sum_{i,s} P_{i,s} x_{i,s}$) distributes workloads smoothly.
- **Dual Solver Architecture**:
  - D-Wave `dimod` + `dwave-neal` quantum simulated annealing integration.
  - Ultra-fast pure-Python / TypeScript 1-hot quantum-inspired annealing fallback (solves 30-class schedules in ~6–15ms).
- **Interactive Timetable Studio**:
  - Live editable class schedule table with instant add/remove/edit.
  - CSV file uploader with schema validation.
  - Real-time penalty weight sliders ($A, B, C$) and slot count selectors (6 to 36 slots).
  - Color-coded multi-day weekly timetable grid with conflict highlight toggle.
  - One-click CSV schedule export and sample benchmark loader.
  - **Publication-Ready PDF Export**: Generates landscape A4 academic schedule PDFs with institution header, metrics summary, color-accented grid, and complete course allocation roster via `jspdf` & `jspdf-autotable`.
- **Educational Explanations**:
  - Interactive "How It Works" page with math formulas, variable lattices, and algorithmic flowcharts.
  - Comprehensive About page detailing future quantum hardware (QPU) roadmap, exam scheduling, and team credentials.

---

## 📁 Project Structure

```
├── backend/
│   ├── main.py                # FastAPI REST API (CORS, upload, optimize, sample)
│   ├── timetable_qubo.py      # Core QUBO solver (H1, H2, H3, dimod + neal + fallback)
│   ├── requirements.txt       # Python dependencies (fastapi, uvicorn, dimod, neal, etc.)
│   └── sample_classes.csv     # 30-class college sample benchmark
├── src/
│   ├── components/            # Reusable UI cards, timetable grid, navbar, footer
│   ├── pages/
│   │   ├── LandingPage.tsx    # Hero, Problem/Solution, 3-step strip, animated clash counter
│   │   ├── DemoPage.tsx       # Live optimizer studio, upload, sliders, grid, CSV export
│   │   ├── HowItWorksPage.tsx # QUBO math, Hamiltonian breakdown, algorithm flowchart
│   │   └── AboutPage.tsx      # Project story, tech stack, future quantum scope, team
│   ├── types/                 # TypeScript interfaces
│   ├── App.tsx                # Main application router and state
│   ├── main.tsx               # Client entry point
│   └── index.css              # Tailwind CSS styling
├── public/
│   └── sample_classes.csv     # Direct downloadable sample dataset
├── server.ts                  # Full-stack Node/Express proxy & fallback solver
├── package.json
└── README.md
```

---

## 🛠️ Visual Studio Code Setup Guide

### 1. Backend Setup (FastAPI + Python)

1. Open your terminal in VS Code:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # macOS / Linux
   python3 -m venv venv
   source venv/bin/activate

   # Windows
   python -m venv venv
   venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   The backend API will be available at `http://127.0.0.1:8000`. You can test endpoints via the interactive Swagger UI at `http://127.0.0.1:8000/docs`.

---

### 2. Frontend Setup (React + Vite + Tailwind)

1. Open a second terminal tab in VS Code:
   ```bash
   # From root directory
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` to interact with QuantSlot!

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sample` | Returns 30 sample classes across 12 slots with 18 initial clashes |
| `POST` | `/api/optimize` | Solves scheduling via QUBO. Accepts `{ classes, slots, weights, reads }` |
| `POST` | `/api/upload` | Uploads and parses CSV (`id, name, teacher, group, room`) |

---

## 🔬 Mathematical QUBO Formulation

Minimizing the objective function:
$$\min_{x \in \{0,1\}^{N \times S}} H(x) = H_1(x) + H_2(x) + H_3(x)$$

Where:
- $H_1 = A \sum_{i=1}^{N} \left( \sum_{s=1}^{S} x_{i,s} - 1 \right)^2$
- $H_2 = B \sum_{s=1}^{S} \sum_{i < j} C_{i,j} \cdot x_{i,s} \cdot x_{j,s}$
- $H_3 = C \sum_{i=1}^{N} \sum_{s=1}^{S} P_{i,s} \cdot x_{i,s}$
