from typing import List, Dict, Any, Optional
from events import get_events_for_asset, get_asset_by_id

def determine_node_type(name: str, action: str) -> str:
    name_lower = name.lower()
    if "public" in name_lower or "internet" in name_lower:
        return "public_exposure"
    elif "external" in name_lower or "share" in name_lower:
        return "share"
    elif "copy" in name_lower or "export" in name_lower or "csv" in name_lower or "transformed" in name_lower:
        return "copy"
    elif "drive" in name_lower or "storage" in name_lower or "crm" in name_lower or "s3" in name_lower:
        return "storage"
    elif "tool" in name_lower or "analytics" in name_lower or "app" in name_lower or "system" in name_lower:
        return "service"
    elif "alice" in name_lower or "bob" in name_lower or "analyst" in name_lower or "employee" in name_lower or "user" in name_lower:
        return "user"
    return "service"

def build_propagation_graph(asset_id: str) -> Dict[str, Any]:
    raw_events = get_events_for_asset(asset_id)
    asset = get_asset_by_id(asset_id)
    
    asset_name = asset['name'] if asset else "Unknown Asset"
    classification = asset['classification'] if asset else "INTERNAL"
    
    nodes_map: Dict[str, Dict[str, Any]] = {}
    edges: List[Dict[str, Any]] = []
    
    evidence_counts = {"OBSERVED": 0, "INFERRED": 0, "UNKNOWN": 0}
    critical_transition = None
    
    # Process events chronologically
    for idx, evt in enumerate(raw_events):
        source = evt['source']
        dest = evt['destination']
        actor = evt['actor']
        action = evt['action']
        ev_type = evt['evidence_type']
        ts = evt['timestamp']
        
        evidence_counts[ev_type] = evidence_counts.get(ev_type, 0) + 1
        
        # Ensure source node exists
        if source not in nodes_map:
            nodes_map[source] = {
                "id": f"node_{source.lower().replace(' ', '_')}",
                "label": source,
                "type": determine_node_type(source, action),
                "classification": classification,
                "evidence_type": ev_type,
                "timestamp": ts,
                "is_critical_exposure": "public" in source.lower(),
                "details": {"first_seen": ts, "actor": actor}
            }
            
        # Ensure destination node exists
        if dest not in nodes_map:
            is_pub = "public" in dest.lower() or action == "PUBLIC_ACCESS_ENABLED"
            nodes_map[dest] = {
                "id": f"node_{dest.lower().replace(' ', '_')}",
                "label": dest,
                "type": determine_node_type(dest, action),
                "classification": classification,
                "evidence_type": ev_type,
                "timestamp": ts,
                "is_critical_exposure": is_pub,
                "details": {"first_seen": ts, "actor": actor}
            }
        else:
            if "public" in dest.lower() or action == "PUBLIC_ACCESS_ENABLED":
                nodes_map[dest]["is_critical_exposure"] = True
                
        # Detect critical transition (e.g. internal app -> external or public access)
        if action in ["PUBLIC_ACCESS_ENABLED", "DETECTED"] or "public" in dest.lower():
            if not critical_transition:
                critical_transition = f"{source} → {dest}"
        elif action in ["SHARED", "TRANSFORMED"] and "external" in dest.lower():
            if not critical_transition:
                critical_transition = f"{source} → {dest}"

        # Create edge
        edge_id = f"edge_{idx+1}_{source.lower().replace(' ', '_')}_to_{dest.lower().replace(' ', '_')}"
        edge_label = action.replace('_', ' ').title()
        
        # Calculate risk weight per edge
        weight = 0
        if action == "PUBLIC_ACCESS_ENABLED":
            weight = 30
        elif action in ["SHARED", "COPIED"] and "external" in dest.lower():
            weight = 25
        elif action == "TRANSFORMED":
            weight = 10
        elif action in ["DOWNLOADED", "UPLOADED"]:
            weight = 5
            
        edges.append({
            "id": edge_id,
            "source": f"node_{source.lower().replace(' ', '_')}",
            "target": f"node_{dest.lower().replace(' ', '_')}",
            "action": action,
            "evidence_type": ev_type,
            "timestamp": ts,
            "risk_weight": weight,
            "label": edge_label,
            "actor": actor
        })

    nodes_list = list(nodes_map.values())
    
    return {
        "asset_id": asset_id,
        "asset_name": asset_name,
        "classification": classification,
        "nodes": nodes_list,
        "edges": edges,
        "timeline": raw_events,
        "critical_transition": critical_transition or "Internal propagation",
        "evidence_summary": evidence_counts,
        "step_count": len(raw_events)
    }
