import json
from typing import List, Dict, Any, Optional
from database import get_db
from models import Event, Asset, Incident

def save_asset(asset: Asset):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO assets (id, name, classification, owner, origin_location, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (asset.id, asset.name, asset.classification, asset.owner, asset.origin_location, asset.created_at))
    conn.commit()
    conn.close()

def get_all_assets() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assets ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_asset_by_id(asset_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assets WHERE id = ?", (asset_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def save_event(event: Event):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO events (id, timestamp, asset_id, asset_name, actor, source, destination, action, classification, evidence_type, metadata)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        event.id, event.timestamp, event.asset_id, event.asset_name,
        event.actor, event.source, event.destination, event.action,
        event.classification, event.evidence_type, json.dumps(event.metadata)
    ))
    conn.commit()
    conn.close()

def get_events_for_asset(asset_id: str) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events WHERE asset_id = ? ORDER BY timestamp ASC", (asset_id,))
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        item = dict(row)
        item['metadata'] = json.loads(item['metadata']) if item['metadata'] else {}
        result.append(item)
    return result

def query_events(
    asset_id: Optional[str] = None,
    actor: Optional[str] = None,
    evidence_type: Optional[str] = None,
    action: Optional[str] = None,
    search: Optional[str] = None
) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    query = "SELECT * FROM events WHERE 1=1"
    params = []
    
    if asset_id:
        query += " AND asset_id = ?"
        params.append(asset_id)
    if actor:
        query += " AND actor LIKE ?"
        params.append(f"%{actor}%")
    if evidence_type:
        query += " AND evidence_type = ?"
        params.append(evidence_type)
    if action:
        query += " AND action = ?"
        params.append(action)
    if search:
        query += " AND (asset_name LIKE ? OR actor LIKE ? OR source LIKE ? OR destination LIKE ?)"
        params.extend([f"%{search}%", f"%{search}%", f"%{search}%", f"%{search}%"])
        
    query += " ORDER BY timestamp ASC"
    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()
    
    result = []
    for row in rows:
        item = dict(row)
        item['metadata'] = json.loads(item['metadata']) if item['metadata'] else {}
        result.append(item)
    return result

def save_incident(incident: Incident):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO incidents (id, asset_id, asset_name, title, severity, detected_at, critical_transition, status, remediated_at, verified_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        incident.id, incident.asset_id, incident.asset_name, incident.title,
        incident.severity, incident.detected_at, incident.critical_transition,
        incident.status, incident.remediated_at, incident.verified_at
    ))
    conn.commit()
    conn.close()

def get_incidents_for_asset(asset_id: str) -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents WHERE asset_id = ? ORDER BY detected_at DESC", (asset_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_all_incidents() -> List[Dict[str, Any]]:
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM incidents ORDER BY detected_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def update_incident_status(incident_id: str, status: str, remediated_at: Optional[str] = None, verified_at: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    if remediated_at and verified_at:
        cursor.execute("UPDATE incidents SET status = ?, remediated_at = ?, verified_at = ? WHERE id = ?", (status, remediated_at, verified_at, incident_id))
    elif remediated_at:
        cursor.execute("UPDATE incidents SET status = ?, remediated_at = ? WHERE id = ?", (status, remediated_at, incident_id))
    elif verified_at:
        cursor.execute("UPDATE incidents SET status = ?, verified_at = ? WHERE id = ?", (status, verified_at, incident_id))
    else:
        cursor.execute("UPDATE incidents SET status = ? WHERE id = ?", (status, incident_id))
    conn.commit()
    conn.close()
