import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "afterimage.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS assets (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        classification TEXT NOT NULL,
        owner TEXT NOT NULL,
        origin_location TEXT NOT NULL,
        created_at TEXT NOT NULL
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        asset_id TEXT NOT NULL,
        asset_name TEXT NOT NULL,
        actor TEXT NOT NULL,
        source TEXT NOT NULL,
        destination TEXT NOT NULL,
        action TEXT NOT NULL,
        classification TEXT NOT NULL,
        evidence_type TEXT NOT NULL,
        metadata TEXT NOT NULL,
        FOREIGN KEY(asset_id) REFERENCES assets(id)
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS incidents (
        id TEXT PRIMARY KEY,
        asset_id TEXT NOT NULL,
        asset_name TEXT NOT NULL,
        title TEXT NOT NULL,
        severity TEXT NOT NULL,
        detected_at TEXT NOT NULL,
        critical_transition TEXT NOT NULL,
        status TEXT NOT NULL,
        remediated_at TEXT,
        verified_at TEXT,
        FOREIGN KEY(asset_id) REFERENCES assets(id)
    )
    """)
    
    conn.commit()
    conn.close()

def clear_db():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM events")
    cursor.execute("DELETE FROM incidents")
    cursor.execute("DELETE FROM assets")
    conn.commit()
    conn.close()
