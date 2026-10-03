# Digital Afterimage — Architecture Specification

## Overview
Digital Afterimage is an explainable data propagation reconstruction prototype designed for cybersecurity telemetry analysis. Rather than treating security events in isolation, it links audit logs across organizational applications to trace the full journey of sensitive data assets.

## System Architecture

```
                               ┌──────────────────────────┐
                               │   React + Vite Frontend  │
                               │  (React Flow Canvas &    │
                               │   Cyber Console UI)      │
                               └────────────┬─────────────┘
                                            │ HTTP / REST API
                                            ▼
                               ┌──────────────────────────┐
                               │     FastAPI Backend      │
                               └┬───────────┬────────────┬┘
                                │           │            │
       ┌────────────────────────┘           │            └────────────────────────┐
       ▼                                    ▼                                     ▼
┌───────────────┐                  ┌──────────────────┐                 ┌──────────────────┐
│ Risk Engine   │                  │ Propagation      │                 │ AI Reasoner      │
│ (Rule-Based)  │                  │ Engine           │                 │ (LLM / Fallback) │
└───────────────┘                  └──────────────────┘                 └──────────────────┘
       │                                    │                                     │
       └────────────────────────┬───────────┴─────────────────────────────────────┘
                                ▼
                       ┌──────────────────┐
                       │  SQLite Storage  │
                       │  (afterimage.db) │
                       └──────────────────┘
```

## Key Modules

1. **Propagation Engine (`propagation.py`)**
   - Ingests events grouped by `asset_id`.
   - Sorts chronologically.
   - Generates node graph entities (Drives, Users, Apps, Derived Copies, External Links, Public Endpoints).
   - Labels evidence states explicitly:
     - `OBSERVED`: Direct log entry exists.
     - `INFERRED`: Derived connection across telemetry bounds.
     - `UNKNOWN`: Unverifiable telemetry gap.

2. **Deterministic Risk Engine (`risk_engine.py`)**
   - Evaluates transparent rules without hallucination:
     - Critical sensitivity: +40 pts
     - Public access enabled: +30 pts
     - External boundary crossing: +25 pts
     - Unknown recipient: +20 pts
     - Copy / transformation: +10 pts
   - Outputs composite score capped at 100 with severity levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`).

3. **AI Reasoning Engine (`ai_reasoner.py`)**
   - Receives deterministic risk calculation & graph topology.
   - Formulates explainable analyst summary, evidence list, telemetry uncertainties, and containment actions.
   - Uses live LLM when `LLM_API_KEY` is present; falls back seamlessly to a deterministic engine when offline.

4. **Interactive Remediation & Verification (`remediation.py`)**
   - Simulates containment (e.g. revoking public access link).
   - Updates risk score dynamically (95 CRITICAL -> 40 MEDIUM).
   - Performs automated verification check.
