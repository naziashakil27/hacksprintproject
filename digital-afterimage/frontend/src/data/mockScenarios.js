export const MOCK_ASSETS = [
  {
    id: "asset_salary_2026",
    name: "Employee_Salary_2026.xlsx",
    classification: "CRITICAL",
    owner: "HR Department",
    origin_location: "HR Drive",
    created_at: "2026-10-03 09:00:00"
  },
  {
    id: "asset_customer_contacts",
    name: "Customer_Contact_List.csv",
    classification: "INTERNAL",
    owner: "Sales Operations",
    origin_location: "CRM Database",
    created_at: "2026-10-03 08:30:00"
  }
];

export const MOCK_PROPAGATION = {
  asset_id: "asset_salary_2026",
  asset_name: "Employee_Salary_2026.xlsx",
  classification: "CRITICAL",
  critical_transition: "AnalyticsTool → Public Access",
  evidence_summary: { OBSERVED: 7, INFERRED: 1, UNKNOWN: 0 },
  step_count: 8,
  nodes: [
    { id: "node_hr_drive", label: "HR Drive", type: "storage", classification: "CRITICAL", evidence_type: "OBSERVED", timestamp: "09:02", is_critical_exposure: false },
    { id: "node_alice_—_hr", label: "Alice — HR", type: "user", classification: "CRITICAL", evidence_type: "OBSERVED", timestamp: "09:17", is_critical_exposure: false },
    { id: "node_alice-workstation", label: "Alice-Workstation", type: "user", classification: "CRITICAL", evidence_type: "OBSERVED", timestamp: "09:43", is_critical_exposure: false },
    { id: "node_analyticstool", label: "AnalyticsTool", type: "service", classification: "CRITICAL", evidence_type: "OBSERVED", timestamp: "10:06", is_critical_exposure: false },
    { id: "node_transformed_copy", label: "Transformed Copy", type: "copy", classification: "CRITICAL", evidence_type: "OBSERVED", timestamp: "10:09", is_critical_exposure: false },
    { id: "node_external_share", label: "External Share", type: "share", classification: "CRITICAL", evidence_type: "OBSERVED", timestamp: "10:14", is_critical_exposure: false },
    { id: "node_public_access", label: "Public Access", type: "public_exposure", classification: "CRITICAL", evidence_type: "INFERRED", timestamp: "10:15", is_critical_exposure: true }
  ],
  edges: [
    { id: "e1", source: "node_hr_drive", target: "node_alice_—_hr", action: "SHARED", evidence_type: "OBSERVED", timestamp: "09:17", label: "Shared", risk_weight: 0 },
    { id: "e2", source: "node_alice_—_hr", target: "node_alice-workstation", action: "DOWNLOADED", evidence_type: "OBSERVED", timestamp: "09:43", label: "Downloaded", risk_weight: 5 },
    { id: "e3", source: "node_alice-workstation", target: "node_analyticstool", action: "UPLOADED", evidence_type: "OBSERVED", timestamp: "10:06", label: "Uploaded", risk_weight: 5 },
    { id: "e4", source: "node_analyticstool", target: "node_transformed_copy", action: "TRANSFORMED", evidence_type: "OBSERVED", timestamp: "10:09", label: "Transformed", risk_weight: 10 },
    { id: "e5", source: "node_transformed_copy", target: "node_external_share", action: "SHARED", evidence_type: "OBSERVED", timestamp: "10:14", label: "External Share", risk_weight: 25 },
    { id: "e6", source: "node_external_share", target: "node_public_access", action: "PUBLIC_ACCESS_ENABLED", evidence_type: "INFERRED", timestamp: "10:15", label: "Public Access Enabled", risk_weight: 30 }
  ],
  timeline: [
    { id: "evt_001", timestamp: "09:02", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "HR-System", source: "HR Drive", destination: "HR Drive", action: "CREATED", classification: "CRITICAL", evidence_type: "OBSERVED", metadata: {} },
    { id: "evt_002", timestamp: "09:17", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "HR-System", source: "HR Drive", destination: "Alice — HR", action: "SHARED", classification: "CRITICAL", evidence_type: "OBSERVED", metadata: {} },
    { id: "evt_003", timestamp: "09:43", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "Alice — HR", source: "HR Drive", destination: "Alice-Workstation", action: "DOWNLOADED", classification: "CRITICAL", evidence_type: "OBSERVED", metadata: {} },
    { id: "evt_004", timestamp: "10:06", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "Alice — HR", source: "Alice-Workstation", destination: "AnalyticsTool", action: "UPLOADED", classification: "CRITICAL", evidence_type: "OBSERVED", metadata: {} },
    { id: "evt_005", timestamp: "10:09", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "AnalyticsTool", source: "AnalyticsTool", destination: "Transformed Copy", action: "TRANSFORMED", classification: "CRITICAL", evidence_type: "OBSERVED", metadata: { derived_file: "Salary_Summary_Export.csv" } },
    { id: "evt_006", timestamp: "10:14", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "AnalyticsTool", source: "Transformed Copy", destination: "External Share", action: "SHARED", classification: "CRITICAL", evidence_type: "OBSERVED", metadata: { recipient: "Unknown recipient" } },
    { id: "evt_007", timestamp: "10:15", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "System-Role", source: "External Share", destination: "Public Access", action: "PUBLIC_ACCESS_ENABLED", classification: "CRITICAL", evidence_type: "INFERRED", metadata: {} },
    { id: "evt_008", timestamp: "10:16", asset_id: "asset_salary_2026", asset_name: "Employee_Salary_2026.xlsx", actor: "Security Monitor", source: "Public Access", destination: "Public Access", action: "DETECTED", classification: "CRITICAL", evidence_type: "OBSERVED", metadata: { confidence: "0.99" } }
  ]
};

export const MOCK_RISK = {
  score: 95,
  severity: "CRITICAL",
  critical_transition: "AnalyticsTool → Public Access",
  factors: [
    { code: "SENSITIVITY_CRITICAL", title: "Critical Data Sensitivity", points: 40, description: "Asset is classified as CRITICAL (high impact if disclosed, e.g. executive salaries).", evidence_ref: "Asset Classification: CRITICAL" },
    { code: "PUBLIC_ACCESS_ENABLED", title: "Public Internet Exposure", points: 30, description: "Asset or derived copy is publicly accessible without authentication.", evidence_ref: "Event action: PUBLIC_ACCESS_ENABLED" },
    { code: "EXTERNAL_DESTINATION", title: "External Destination Boundary Crossing", points: 25, description: "Asset crossed internal network boundary to an external share link.", evidence_ref: "Destination: External Share Link" }
  ],
  reason_codes: ["CRITICAL_CLASSIFICATION", "PUBLIC_ACCESS", "EXTERNAL_DESTINATION"]
};

export const MOCK_EXPLANATION = {
  summary: "Asset 'Employee_Salary_2026.xlsx' originated in secure HR Drive, moved through internal processing, was transformed into a derivative CSV summary, and subsequently published to an unauthenticated public destination.",
  critical_transition: "AnalyticsTool → Public Access",
  why_it_matters: "The asset carries a CRITICAL classification. The propagation sequence demonstrates an unmitigated data lifecycle movement from trusted internal infrastructure into a publicly accessible destination (AnalyticsTool → Public Access). This creates an immediate risk of unauthorized data exposure.",
  evidence: [
    "✓ Critical Data Sensitivity (+40 pts): Executive salary spreadsheet",
    "✓ External Boundary Crossing (+25 pts): Exported via external share link",
    "✓ Public Internet Exposure (+30 pts): Unauthenticated public read access",
    "✓ Sensitive Data Detected (+0.99 confidence): Security telemetry confirmation"
  ],
  uncertainties: [
    "Exact identity of external downloader recipient could not be verified from available SaaS audit telemetry."
  ],
  recommended_action: "Revoke public access permissions immediately, restrict sharing link scope, and initiate automated containment.",
  is_fallback: true
};
