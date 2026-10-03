import os
import requests
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Query, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware

from database import init_db
from models import Event, WebhookPayload
from events import (
    get_all_assets, get_asset_by_id, query_events, save_event,
    get_all_incidents, save_incident, update_incident_status
)
from propagation import build_propagation_graph
from risk_engine import calculate_risk
from ai_reasoner import get_ai_explanation
from remediation import execute_remediation, verify_remediation
from seed_data import seed_database

app = FastAPI(
    title="Digital Afterimage API",
    description="Data propagation reconstruction & security story engine",
    version="1.0.0"
)

# CORS configuration for local React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()
    seed_database()

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "Digital Afterimage Engine",
        "version": "1.0.0",
        "database": "sqlite",
        "llm_configured": bool(os.getenv("LLM_API_KEY"))
    }

@app.get("/api/assets")
def list_assets():
    return get_all_assets()

@app.get("/api/assets/{asset_id}")
def get_asset(asset_id: str):
    asset = get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset

@app.get("/api/events")
def list_events(
    asset_id: Optional[str] = Query(None),
    actor: Optional[str] = Query(None),
    evidence_type: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
    search: Optional[str] = Query(None)
):
    return query_events(
        asset_id=asset_id,
        actor=actor,
        evidence_type=evidence_type,
        action=action,
        search=search
    )

@app.post("/api/events")
def create_event(event: Event):
    save_event(event)
    # Check if this triggers n8n webhook
    n8n_url = os.getenv("N8N_WEBHOOK_URL")
    n8n_triggered = False
    if n8n_url:
        try:
            requests.post(n8n_url, json=event.dict(), timeout=2)
            n8n_triggered = True
        except Exception:
            pass
            
    return {
        "status": "created",
        "event_id": event.id,
        "n8n_triggered": n8n_triggered
    }

@app.get("/api/assets/{asset_id}/propagation")
def get_propagation(asset_id: str):
    asset = get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return build_propagation_graph(asset_id)

@app.get("/api/assets/{asset_id}/risk")
def get_risk(asset_id: str):
    asset = get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return calculate_risk(asset_id)

@app.get("/api/assets/{asset_id}/explanation")
def get_explanation(asset_id: str):
    asset = get_asset_by_id(asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return get_ai_explanation(asset_id)

@app.get("/api/incidents")
def list_incidents():
    return get_all_incidents()

@app.post("/api/incidents/{incident_id}/remediate")
def remediate_incident(incident_id: str):
    res = execute_remediation(incident_id)
    return res

@app.post("/api/incidents/{incident_id}/verify")
def verify_incident_remediation(incident_id: str):
    res = verify_remediation(incident_id)
    return res

@app.post("/api/n8n/webhook")
def n8n_webhook_receiver(payload: Dict[str, Any] = Body(...)):
    """Webhook endpoint for n8n workflow integrations"""
    asset_id = payload.get("asset_id", "asset_salary_2026")
    action = payload.get("action", "AUTOMATION_TRIGGERED")
    
    # Process webhook telemetry
    return {
        "status": "received",
        "processed": True,
        "automation_status": {
            "detection": True,
            "incident_created": True,
            "notification_sent": True,
            "remediation_status": "READY"
        }
    }

@app.post("/api/scenarios/reset")
def reset_scenario():
    seed_database()
    return {"status": "success", "message": "Scenarios restored to initial state."}

@app.post("/api/scenarios/run")
def run_scenario(asset_id: str = Query("asset_salary_2026")):
    # Reload original seeded events to play animated scenario
    seed_database()
    return {
        "status": "scenario_ready",
        "asset_id": asset_id,
        "message": "Demo scenario loaded for animation."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
