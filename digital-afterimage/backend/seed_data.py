from database import init_db, clear_db
from models import Asset, Event, Incident, AssetClassification, EventAction, EvidenceType, IncidentStatus
from events import save_asset, save_event, save_incident

def seed_database():
    init_db()
    clear_db()
    
    # ----------------------------------------------------
    # SCENARIO 1: CRITICAL EXPOSURE (Employee_Salary_2026.xlsx)
    # ----------------------------------------------------
    asset_salary = Asset(
        id="asset_salary_2026",
        name="Employee_Salary_2026.xlsx",
        classification=AssetClassification.CRITICAL,
        owner="HR Department",
        origin_location="HR Drive",
        created_at="2026-10-03 09:00:00"
    )
    save_asset(asset_salary)
    
    events_salary = [
        Event(
            id="evt_001",
            timestamp="09:02",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="HR-System",
            source="HR Drive",
            destination="HR Drive",
            action=EventAction.CREATED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"file_size": "4.2 MB", "hash": "sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}
        ),
        Event(
            id="evt_002",
            timestamp="09:17",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="HR-System",
            source="HR Drive",
            destination="Alice — HR",
            action=EventAction.SHARED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"permission": "READ_WRITE", "granted_by": "HR-Admin"}
        ),
        Event(
            id="evt_003",
            timestamp="09:43",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="Alice — HR",
            source="HR Drive",
            destination="Alice-Workstation",
            action=EventAction.DOWNLOADED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"ip": "10.0.4.112", "user_agent": "OneDrive/23.1"}
        ),
        Event(
            id="evt_004",
            timestamp="10:06",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="Alice — HR",
            source="Alice-Workstation",
            destination="AnalyticsTool",
            action=EventAction.UPLOADED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"tool_name": "AnalyticsTool Cloud", "session_id": "sess_9941"}
        ),
        Event(
            id="evt_005",
            timestamp="10:09",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="AnalyticsTool",
            source="AnalyticsTool",
            destination="Transformed Copy",
            action=EventAction.TRANSFORMED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"derived_file": "Salary_Summary_Export.csv", "transformation_type": "CSV Aggregation"}
        ),
        Event(
            id="evt_006",
            timestamp="10:14",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="AnalyticsTool",
            source="Transformed Copy",
            destination="External Share",
            action=EventAction.SHARED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"recipient": "Unknown recipient", "share_type": "PUBLIC_LINK"}
        ),
        Event(
            id="evt_007",
            timestamp="10:15",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="System-Role",
            source="External Share",
            destination="Public Access",
            action=EventAction.PUBLIC_ACCESS_ENABLED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.INFERRED,
            metadata={"exposure_type": "ANONYMOUS_READ_ALL"}
        ),
        Event(
            id="evt_008",
            timestamp="10:16",
            asset_id="asset_salary_2026",
            asset_name="Employee_Salary_2026.xlsx",
            actor="Security Monitor",
            source="Public Access",
            destination="Public Access",
            action=EventAction.DETECTED,
            classification=AssetClassification.CRITICAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"detector": "DLP-Scanner-04", "confidence": "0.99"}
        )
    ]
    for e in events_salary:
        save_event(e)
        
    incident_salary = Incident(
        id="INC-0001",
        asset_id="asset_salary_2026",
        asset_name="Employee_Salary_2026.xlsx",
        title="Sensitive Salary Data Public Exposure",
        severity="CRITICAL",
        detected_at="10:16",
        critical_transition="AnalyticsTool → Public Access",
        status=IncidentStatus.OPEN
    )
    save_incident(incident_salary)

    # ----------------------------------------------------
    # SCENARIO 2: CLEAN / LOW RISK (Customer_Contact_List.csv)
    # ----------------------------------------------------
    asset_contacts = Asset(
        id="asset_customer_contacts",
        name="Customer_Contact_List.csv",
        classification=AssetClassification.INTERNAL,
        owner="Sales Operations",
        origin_location="CRM Database",
        created_at="2026-10-03 08:30:00"
    )
    save_asset(asset_contacts)

    events_contacts = [
        Event(
            id="evt_c01",
            timestamp="08:30",
            asset_id="asset_customer_contacts",
            asset_name="Customer_Contact_List.csv",
            actor="Salesforce-CRM",
            source="CRM Database",
            destination="CRM Database",
            action=EventAction.CREATED,
            classification=AssetClassification.INTERNAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"record_count": 1420}
        ),
        Event(
            id="evt_c02",
            timestamp="08:45",
            asset_id="asset_customer_contacts",
            asset_name="Customer_Contact_List.csv",
            actor="Sales Analyst",
            source="CRM Database",
            destination="Sales-Workstation",
            action=EventAction.ACCESSED,
            classification=AssetClassification.INTERNAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"session": "sales_auth_88"}
        ),
        Event(
            id="evt_c03",
            timestamp="09:10",
            asset_id="asset_customer_contacts",
            asset_name="Customer_Contact_List.csv",
            actor="Sales Analyst",
            source="Sales-Workstation",
            destination="Internal Analytics Hub",
            action=EventAction.UPLOADED,
            classification=AssetClassification.INTERNAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"cluster": "internal-us-east"}
        ),
        Event(
            id="evt_c04",
            timestamp="09:30",
            asset_id="asset_customer_contacts",
            asset_name="Customer_Contact_List.csv",
            actor="Internal Analytics Hub",
            source="Internal Analytics Hub",
            destination="Regional_Summary.pdf",
            action=EventAction.TRANSFORMED,
            classification=AssetClassification.INTERNAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"output": "Regional_Summary.pdf"}
        ),
        Event(
            id="evt_c05",
            timestamp="10:00",
            asset_id="asset_customer_contacts",
            asset_name="Customer_Contact_List.csv",
            actor="Executive Team",
            source="Regional_Summary.pdf",
            destination="Internal Dashboard",
            action=EventAction.ACCESSED,
            classification=AssetClassification.INTERNAL,
            evidence_type=EvidenceType.OBSERVED,
            metadata={"access_type": "INTERNAL_READ_ONLY"}
        )
    ]
    for e in events_contacts:
        save_event(e)

    print("[Seed] Database successfully populated with 2 realistic scenarios.")
