# DIGITAL AFTERIMAGE

> **“When sensitive data moves, its security story should move with it.”**

A hackathon prototype for **PS31 — Web3 & Cybersecurity**, built to reconstruct the propagation path of sensitive information across simulated digital workflows.

---

## 1. Problem Statement
Sensitive enterprise data rarely stays where it was born. A file created in a secure HR Drive can move to an employee workstation, get uploaded to a cloud SaaS tool, be transformed into a summary report, shared via an external link, and ultimately published to an unauthenticated public bucket.

Traditional security tools often log these as separate, isolated events:
- Log A: Document Download
- Log B: SaaS Upload
- Log C: External Share

**Digital Afterimage** links these disparate telemetry events into a unified, explainable **security story**, visually depicting the data's journey and computing a transparent risk score.

---

## 2. Key Features

- **Propagation Engine**: Reconstructs relationships (`source → destination`), derived copies (`TRANSFORMED`), and boundary crossings.
- **Explicit Evidence States**: Clearly distinguishes between **OBSERVED** (direct audit log), **INFERRED** (derived telemetry link), and **UNKNOWN** (telemetry gap). Never presents inferences as confirmed facts.
- **Deterministic Risk Engine**: Transparent rule-based risk calculation (+40 Critical Sensitivity, +25 External Destination, +30 Public Access). Score is capped at 100 with clear factor breakdowns.
- **Explainable AI Reasoning**: Translates risk factors and graph paths into plain-language summaries, evidence checklists, telemetry uncertainties, and containment recommendations. Uses LLM when configured or a deterministic fallback engine when offline.
- **Signature "Afterimage" Slider**: Interactive playback slider ($T0 \rightarrow T7$) to watch data movement step-by-step through time.
- **Interactive SOAR Remediation**: Triggers automated n8n containment, revokes public access tokens in the database, recalculates risk down to 40 (MEDIUM), and performs automated verification.

---

## 3. Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Flow (`@xyflow/react`), Lucide React icons.
- **Backend**: Python 3.10+, FastAPI, Pydantic v2, Uvicorn.
- **Database**: SQLite (`afterimage.db`), auto-initialized and seeded on startup.
- **Automation**: n8n Webhook & JSON Workflow Integration (`n8n/digital_afterimage_workflow.json`).
- **AI Engine**: LLM API integration with clean backend abstraction + deterministic fallback engine.

---

## 4. Folder Structure

```
digital-afterimage/
├── backend/
│   ├── main.py              # FastAPI server & routes
│   ├── database.py          # SQLite database connection & schema
│   ├── models.py            # Pydantic & data models
│   ├── events.py            # Event storage & query functions
│   ├── propagation.py       # Propagation graph reconstruction engine
│   ├── risk_engine.py       # Deterministic rule-based risk calculator
│   ├── ai_reasoner.py       # AI explanation & deterministic fallback
│   ├── remediation.py       # Interactive remediation & verification
│   ├── seed_data.py         # Seeded scenarios initializer
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/      # React components (Graph, Timeline, AI Panel, etc.)
│   │   ├── data/            # Local scenario fallback data
│   │   ├── services/        # API service layer (`api.js`)
│   │   ├── App.jsx          # Main investigation console view
│   │   ├── main.jsx         # Vite React entry point
│   │   └── index.css        # Cyber dark theme & CSS utilities
│   ├── package.json         # Node dependencies
│   ├── vite.config.js       # Vite configuration with API proxy
│   └── tailwind.config.js   # Tailwind theme setup
├── n8n/
│   └── digital_afterimage_workflow.json  # n8n SOAR workflow export
├── docs/
│   ├── ARCHITECTURE.md      # Technical architecture spec
│   ├── DEMO_GUIDE.md        # 30-Second demo script
│   └── SCENARIOS.md         # Detailed scenario telemetry specs
├── .env.example             # Environment variable template
└── README.md                # Project documentation
```

---

## 5. Step-by-Step Setup Guide

### Step 1: Clone or Open Project Directory
Navigate into the root directory:
```bash
cd digital-afterimage
```

### Step 2: Set Up Backend (Python FastAPI)

1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment (optional but recommended):
   - **Windows**:
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Linux/macOS**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the backend server:
   ```bash
   python main.py
   ```
   *The server will start on `http://127.0.0.1:8000`. SQLite DB `afterimage.db` is auto-created and seeded on startup.*

### Step 3: Set Up Frontend (React + Vite)

1. Open a new terminal and navigate to `frontend`:
   ```bash
   cd digital-afterimage/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to:
   ```
   http://localhost:3000
   ```

### Step 4: (Optional) Run n8n Automation
If you have n8n installed:
```bash
n8n start
```
Import `n8n/digital_afterimage_workflow.json` into n8n and activate the workflow.

---

## 6. How to Run the Demo for Judges

1. Open `http://localhost:3000`.
2. Observe **Scenario 1** (`Employee_Salary_2026.xlsx` - CRITICAL risk score 95/100).
3. Click **RUN SCENARIO** to watch the animated event sequence build stage by stage.
4. Drag the **AFTERIMAGE** time-slider from $T0$ to $T7$ to watch data propagation unfold.
5. Review the **AI INVESTIGATION** panel for why it matters, evidence checkmarks, and telemetry uncertainties.
6. Click **REMEDIATE EXPOSURE** to execute containment. Notice how public access is revoked, risk drops to 40 (MEDIUM), and the **REMEDIATION VERIFIED** badge appears.
7. Select **CLEAN SCENARIO** to demonstrate baseline low-risk data movement (`Customer_Contact_List.csv`, Score: 25 / LOW).
8. Click **RESET** to restore initial demo state.

---

## 7. API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & system status |
| `GET` | `/api/assets` | List monitored assets |
| `GET` | `/api/events` | Query telemetry events with search & filters |
| `GET` | `/api/assets/{id}/propagation` | Reconstructed graph nodes, edges, & timeline |
| `GET` | `/api/assets/{id}/risk` | Deterministic risk score & factor breakdown |
| `GET` | `/api/assets/{id}/explanation` | Explainable AI reasoning & containment guidance |
| `POST` | `/api/incidents/{id}/remediate` | Trigger containment & update database state |
| `POST` | `/api/incidents/{id}/verify` | Run automated verification check |
| `POST` | `/api/scenarios/reset` | Reset SQLite DB to initial seed state |

---

## 8. Disclaimer & Honesty
*Digital Afterimage is a hackathon research prototype using simulated enterprise telemetry. It does not replace enterprise DLP or execute unauthorized cloud security actions.*
