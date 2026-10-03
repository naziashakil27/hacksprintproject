from enum import Enum
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class EvidenceType(str, Enum):
    OBSERVED = "OBSERVED"
    INFERRED = "INFERRED"
    UNKNOWN = "UNKNOWN"

class EventAction(str, Enum):
    CREATED = "CREATED"
    ACCESSED = "ACCESSED"
    DOWNLOADED = "DOWNLOADED"
    UPLOADED = "UPLOADED"
    COPIED = "COPIED"
    TRANSFORMED = "TRANSFORMED"
    SHARED = "SHARED"
    PERMISSION_CHANGED = "PERMISSION_CHANGED"
    PUBLIC_ACCESS_ENABLED = "PUBLIC_ACCESS_ENABLED"
    DETECTED = "DETECTED"

class AssetClassification(str, Enum):
    PUBLIC = "PUBLIC"
    INTERNAL = "INTERNAL"
    CONFIDENTIAL = "CONFIDENTIAL"
    CRITICAL = "CRITICAL"

class IncidentStatus(str, Enum):
    OPEN = "OPEN"
    REMEDIATING = "REMEDIATING"
    VERIFIED = "VERIFIED"

class Asset(BaseModel):
    id: str
    name: str
    classification: AssetClassification
    owner: str
    origin_location: str
    created_at: str

class Event(BaseModel):
    id: str
    timestamp: str
    asset_id: str
    asset_name: str
    actor: str
    source: str
    destination: str
    action: EventAction
    classification: AssetClassification
    evidence_type: EvidenceType
    metadata: Dict[str, Any] = Field(default_factory=dict)

class GraphNode(BaseModel):
    id: str
    label: str
    type: str  # storage, user, app, copy, share, public_exposure
    classification: AssetClassification
    evidence_type: EvidenceType
    timestamp: Optional[str] = None
    is_critical_exposure: bool = False
    details: Dict[str, Any] = Field(default_factory=dict)

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    action: str
    evidence_type: EvidenceType
    timestamp: str
    risk_weight: int = 0
    label: str

class PropagationResult(BaseModel):
    asset_id: str
    asset_name: str
    classification: AssetClassification
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    timeline: List[Event]
    critical_transition: Optional[str] = None
    evidence_summary: Dict[str, int]
    step_count: int

class RiskFactor(BaseModel):
    code: str
    title: str
    points: int
    description: str
    evidence_ref: str

class RiskResult(BaseModel):
    score: int
    severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    factors: List[RiskFactor]
    critical_transition: str
    reason_codes: List[str]

class AIReasoningResult(BaseModel):
    summary: str
    critical_transition: str
    why_it_matters: str
    evidence: List[str]
    uncertainties: List[str]
    recommended_action: str
    is_fallback: bool = True

class Incident(BaseModel):
    id: str
    asset_id: str
    asset_name: str
    title: str
    severity: str
    detected_at: str
    critical_transition: str
    status: IncidentStatus
    remediated_at: Optional[str] = None
    verified_at: Optional[str] = None

class RemediationResult(BaseModel):
    incident_id: str
    status: IncidentStatus
    previous_score: int
    new_score: int
    previous_severity: str
    new_severity: str
    action_taken: str
    remediated_at: str
    verified: bool

class WebhookPayload(BaseModel):
    event_type: str
    asset_id: str
    payload: Dict[str, Any] = Field(default_factory=dict)
