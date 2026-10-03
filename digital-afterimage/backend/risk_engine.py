from typing import List, Dict, Any
from propagation import build_propagation_graph

def calculate_risk(asset_id: str) -> Dict[str, Any]:
    graph_data = build_propagation_graph(asset_id)
    classification = graph_data.get("classification", "INTERNAL")
    timeline = graph_data.get("timeline", [])
    nodes = graph_data.get("nodes", [])
    edges = graph_data.get("edges", [])
    
    factors: List[Dict[str, Any]] = []
    reason_codes: List[str] = []
    total_score = 0
    
    # 1. Classification Sensitivity Factor
    if classification == "CRITICAL":
        pts = 40
        factors.append({
            "code": "SENSITIVITY_CRITICAL",
            "title": "Critical Data Sensitivity",
            "points": pts,
            "description": "Asset is classified as CRITICAL (high impact if disclosed, e.g. executive salaries or secret keys).",
            "evidence_ref": f"Asset Classification: {classification}"
        })
        reason_codes.append("CRITICAL_CLASSIFICATION")
        total_score += pts
    elif classification == "HIGH" or classification == "CONFIDENTIAL":
        pts = 25
        factors.append({
            "code": "SENSITIVITY_HIGH",
            "title": "High Data Sensitivity",
            "points": pts,
            "description": "Asset contains sensitive confidential enterprise data.",
            "evidence_ref": f"Asset Classification: {classification}"
        })
        reason_codes.append("HIGH_CLASSIFICATION")
        total_score += pts
    elif classification == "MEDIUM" or classification == "INTERNAL":
        pts = 15
        factors.append({
            "code": "SENSITIVITY_MEDIUM",
            "title": "Internal Data Sensitivity",
            "points": pts,
            "description": "Asset contains restricted internal business data.",
            "evidence_ref": f"Asset Classification: {classification}"
        })
        total_score += pts

    # Check event actions and transitions
    has_public_access = False
    has_external_dest = False
    has_unknown_recipient = False
    has_transformation = False
    has_permission_change = False
    
    for evt in timeline:
        act = evt['action']
        dest = evt['destination'].lower()
        actor = evt['actor'].lower()
        meta = evt.get('metadata', {})
        
        if act == "PUBLIC_ACCESS_ENABLED" or "public" in dest:
            has_public_access = True
        if "external" in dest or act == "SHARED" and "external" in dest:
            has_external_dest = True
        if "unknown" in actor or "anonymous" in dest or "unknown" in dest or meta.get("recipient") == "UNKNOWN":
            has_unknown_recipient = True
        if act in ["TRANSFORMED", "COPIED"]:
            has_transformation = True
        if act == "PERMISSION_CHANGED" or act == "SHARED":
            has_permission_change = True

    # 2. Public Access Factor (+30)
    if has_public_access:
        pts = 30
        factors.append({
            "code": "PUBLIC_ACCESS_ENABLED",
            "title": "Public Internet Exposure",
            "points": pts,
            "description": "Asset or a copy thereof is publicly accessible without authentication.",
            "evidence_ref": "Event action: PUBLIC_ACCESS_ENABLED"
        })
        reason_codes.append("PUBLIC_ACCESS")
        total_score += pts

    # 3. External Destination Factor (+25)
    if has_external_dest:
        pts = 25
        factors.append({
            "code": "EXTERNAL_DESTINATION",
            "title": "External Destination Boundary Crossing",
            "points": pts,
            "description": "Asset crossed internal network boundary to an external recipient/share.",
            "evidence_ref": "Destination: External Share Link"
        })
        reason_codes.append("EXTERNAL_DESTINATION")
        total_score += pts

    # 4. Unknown Recipient Factor (+20)
    if has_unknown_recipient:
        pts = 20
        factors.append({
            "code": "UNKNOWN_RECIPIENT",
            "title": "Unverified Recipient Identity",
            "points": pts,
            "description": "The external share recipient identity cannot be authenticated from audit logs.",
            "evidence_ref": "Recipient: Unknown recipient"
        })
        reason_codes.append("UNVERIFIED_RECIPIENT")
        total_score += pts

    # 5. Permission Escalation / Shared (+20)
    if has_permission_change and not has_external_dest:
        pts = 20
        factors.append({
            "code": "PERMISSION_ESCALATION",
            "title": "Permission Scope Expansion",
            "points": pts,
            "description": "Sharing permissions expanded beyond initial asset owner domain.",
            "evidence_ref": "Event action: PERMISSION_CHANGED / SHARED"
        })
        reason_codes.append("PERMISSION_CHANGE")
        total_score += pts

    # 6. Copy / Transformation Factor (+10)
    if has_transformation:
        pts = 10
        factors.append({
            "code": "TRANSFORMED_COPY",
            "title": "Derived Copy Creation",
            "points": pts,
            "description": "Asset was exported/transformed into a secondary format (e.g. XLSX -> CSV summary).",
            "evidence_ref": "Event action: TRANSFORMED"
        })
        reason_codes.append("DATA_TRANSFORMATION")
        total_score += pts

    # Cap score at 100
    final_score = min(total_score, 100)
    
    # Calculate Severity
    if final_score >= 81:
        severity = "CRITICAL"
    elif final_score >= 61:
        severity = "HIGH"
    elif final_score >= 31:
        severity = "MEDIUM"
    else:
        severity = "LOW"

    return {
        "score": final_score,
        "severity": severity,
        "factors": factors,
        "critical_transition": graph_data.get("critical_transition", "None"),
        "reason_codes": reason_codes
    }
