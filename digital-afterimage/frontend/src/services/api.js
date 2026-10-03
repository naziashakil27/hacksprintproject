import { MOCK_ASSETS, MOCK_PROPAGATION, MOCK_RISK, MOCK_EXPLANATION } from '../data/mockScenarios';

const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[API Call Failed: ${endpoint}] ${err.message}. Using local scenario fallback.`);
    throw err;
  }
}

export async function checkHealth() {
  try {
    return await fetchJson('/health');
  } catch {
    return { status: 'offline', version: '1.0.0 (fallback mode)' };
  }
}

export async function getAssets() {
  try {
    return await fetchJson('/assets');
  } catch {
    return MOCK_ASSETS;
  }
}

export async function getEvents(filters = {}) {
  try {
    const params = new URLSearchParams();
    if (filters.asset_id) params.append('asset_id', filters.asset_id);
    if (filters.actor) params.append('actor', filters.actor);
    if (filters.evidence_type) params.append('evidence_type', filters.evidence_type);
    if (filters.action) params.append('action', filters.action);
    if (filters.search) params.append('search', filters.search);
    
    const queryStr = params.toString() ? `?${params.toString()}` : '';
    return await fetchJson(`/events${queryStr}`);
  } catch {
    let events = MOCK_PROPAGATION.timeline;
    if (filters.search) {
      const s = filters.search.toLowerCase();
      events = events.filter(e => 
        e.asset_name.toLowerCase().includes(s) || 
        e.actor.toLowerCase().includes(s) || 
        e.source.toLowerCase().includes(s) || 
        e.destination.toLowerCase().includes(s)
      );
    }
    if (filters.evidence_type) {
      events = events.filter(e => e.evidence_type === filters.evidence_type);
    }
    return events;
  }
}

export async function getPropagation(assetId) {
  try {
    return await fetchJson(`/assets/${assetId}/propagation`);
  } catch {
    return MOCK_PROPAGATION;
  }
}

export async function getRisk(assetId) {
  try {
    return await fetchJson(`/assets/${assetId}/risk`);
  } catch {
    return MOCK_RISK;
  }
}

export async function getAIExplanation(assetId) {
  try {
    return await fetchJson(`/assets/${assetId}/explanation`);
  } catch {
    return MOCK_EXPLANATION;
  }
}

export async function getIncidents() {
  try {
    return await fetchJson('/incidents');
  } catch {
    return [
      {
        id: "INC-0001",
        asset_id: "asset_salary_2026",
        asset_name: "Employee_Salary_2026.xlsx",
        title: "Sensitive Salary Data Public Exposure",
        severity: "CRITICAL",
        detected_at: "10:16",
        critical_transition: "AnalyticsTool → Public Access",
        status: "OPEN"
      }
    ];
  }
}

export async function triggerRemediation(incidentId) {
  try {
    return await fetchJson(`/incidents/${incidentId}/remediate`, { method: 'POST' });
  } catch {
    return {
      incident_id: incidentId,
      status: "REMEDIATING",
      previous_score: 95,
      previous_severity: "CRITICAL",
      new_score: 40,
      new_severity: "MEDIUM",
      action_taken: "Revoked public share link & restored access control policy via n8n automation",
      remediated_at: new Date().toLocaleTimeString(),
      verified: false
    };
  }
}

export async function verifyRemediation(incidentId) {
  try {
    return await fetchJson(`/incidents/${incidentId}/verify`, { method: 'POST' });
  } catch {
    return {
      incident_id: incidentId,
      status: "VERIFIED",
      verified_at: new Date().toLocaleTimeString(),
      verification_checks: [
        { check: "Public HTTP endpoint status", status: "PASSED (403 Forbidden)" },
        { check: "SaaS permission ACL scan", status: "PASSED (Private access only)" },
        { check: "DLP active scanner check", status: "PASSED (No public leaks detected)" }
      ],
      message: "Remediation verified successfully. Exposure contained."
    };
  }
}

export async function resetScenario() {
  try {
    return await fetchJson('/scenarios/reset', { method: 'POST' });
  } catch {
    return { status: 'success', message: 'Scenario reset (fallback).' };
  }
}

export async function runScenario(assetId) {
  try {
    return await fetchJson(`/scenarios/run?asset_id=${assetId}`, { method: 'POST' });
  } catch {
    return { status: 'scenario_ready', asset_id: assetId };
  }
}
