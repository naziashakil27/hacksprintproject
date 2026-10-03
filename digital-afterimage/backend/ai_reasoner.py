import os
import json
import requests
from typing import Dict, Any
from propagation import build_propagation_graph
from risk_engine import calculate_risk

def generate_deterministic_explanation(asset_id: str, graph: Dict[str, Any], risk: Dict[str, Any]) -> Dict[str, Any]:
    asset_name = graph.get("asset_name", "Asset")
    score = risk.get("score", 0)
    severity = risk.get("severity", "LOW")
    crit_transition = risk.get("critical_transition", "Unknown")
    factors = risk.get("factors", [])
    
    evidence_list = []
    for f in factors:
        evidence_list.append(f"{f['title']} (+{f['points']} pts): {f['description']}")
        
    uncertainties = []
    # Identify uncertainties in telemetry
    for node in graph.get("nodes", []):
        if node.get("evidence_type") == "INFERRED":
            uncertainties.append(f"State of {node['label']} was inferred based on sequential timing rather than direct agent audit payload.")
    if not uncertainties:
        uncertainties.append("Exact identity of external downloader recipient could not be verified from available SaaS audit telemetry.")

    if severity == "CRITICAL":
        summary = (
            f"Asset '{asset_name}' originated in secure storage, moved through internal processing by authorized personnel, "
            f"was transformed into a derivative dataset, and subsequently published to an unauthenticated public destination."
        )
        why_it_matters = (
            f"The asset carries a {graph.get('classification')} classification. The propagation sequence demonstrates "
            f"an unmitigated data lifecycle movement from trusted internal infrastructure into a publicly accessible destination ({crit_transition}). "
            f"This represents an immediate risk of unauthorized data exposure."
        )
        rec_action = "Revoke public access permissions immediately, restrict sharing link scope, and initiate data loss response protocol."
    elif severity == "HIGH":
        summary = (
            f"Asset '{asset_name}' was exported and shared with an external party without automated domain restriction policy."
        )
        why_it_matters = (
            f"While public access has not been detected yet, cross-boundary external sharing of {graph.get('classification')} "
            f"data significantly increases exposure likelihood."
        )
        rec_action = "Require external recipient re-authentication and audit external download permissions."
    else:
        summary = (
            f"Asset '{asset_name}' propagated strictly within authorized internal systems and verified personnel boundaries."
        )
        why_it_matters = (
            "No boundary crossings or public access configurations were detected. Exposure risk remains within normal operational threshold."
        )
        rec_action = "No immediate containment required. Continue standard telemetry monitoring."

    return {
        "summary": summary,
        "critical_transition": crit_transition,
        "why_it_matters": why_it_matters,
        "evidence": evidence_list,
        "uncertainties": uncertainties,
        "recommended_action": rec_action,
        "is_fallback": True
    }

def get_ai_explanation(asset_id: str) -> Dict[str, Any]:
    graph = build_propagation_graph(asset_id)
    risk = calculate_risk(asset_id)
    
    api_key = os.getenv("LLM_API_KEY", "").strip()
    
    if not api_key:
        return generate_deterministic_explanation(asset_id, graph, risk)
        
    # Optional LLM call if API key provided
    try:
        model = os.getenv("LLM_MODEL", "gemini-1.5-pro")
        api_base = os.getenv("LLM_API_BASE", "https://generativelanguage.googleapis.com/v1beta")
        
        prompt = f"""
You are a senior cybersecurity analyst. Analyze this data propagation security event and return a JSON explanation.

Asset: {graph.get('asset_name')}
Classification: {graph.get('classification')}
Risk Score: {risk.get('score')} ({risk.get('severity')})
Critical Transition: {risk.get('critical_transition')}
Factors: {json.dumps(risk.get('factors'))}
Nodes: {json.dumps(graph.get('nodes'))}

Respond ONLY with valid JSON in this exact structure:
{{
  "summary": "...",
  "critical_transition": "...",
  "why_it_matters": "...",
  "evidence": ["...", "..."],
  "uncertainties": ["..."],
  "recommended_action": "..."
}}
"""
        # Attempt LLM call
        response = requests.post(
            f"{api_base}/models/{model}:generateContent?key={api_key}",
            headers={"Content-Type": "application/json"},
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=5
        )
        if response.status_code == 200:
            res_json = response.json()
            text = res_json['candidates'][0]['content']['parts'][0]['text']
            # Clean json fences if present
            if "```json" in text:
                text = text.split("```json")[1].split("```")[0].strip()
            elif "```" in text:
                text = text.split("```")[1].split("```")[0].strip()
            parsed = json.loads(text)
            parsed["is_fallback"] = False
            return parsed
    except Exception as e:
        print(f"[AI Reasoner] LLM call failed or timed out: {e}. Falling back to deterministic engine.")
        
    return generate_deterministic_explanation(asset_id, graph, risk)
