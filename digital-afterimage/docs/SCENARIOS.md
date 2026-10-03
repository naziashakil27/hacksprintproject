# Digital Afterimage — Telemetry Scenarios

## Scenario 1: CRITICAL Public Exposure Flow
- **Asset**: `Employee_Salary_2026.xlsx`
- **Classification**: CRITICAL
- **Timeline**:
  - `09:02` CREATED in HR Drive
  - `09:17` SHARED with Alice (HR)
  - `09:43` DOWNLOADED by Alice
  - `10:06` UPLOADED to AnalyticsTool
  - `10:09` TRANSFORMED into `Salary_Summary_Export.csv`
  - `10:14` SHARED via external link
  - `10:15` PUBLIC_ACCESS_ENABLED (INFERRED)
  - `10:16` DETECTED by Security Monitor
- **Risk Score**: 95 / 100 (CRITICAL)
- **Primary Remediation**: Revoke public access link & restrict bucket scope.

## Scenario 2: Internal Low-Risk Flow
- **Asset**: `Customer_Contact_List.csv`
- **Classification**: INTERNAL
- **Timeline**:
  - `08:30` CREATED in CRM Database
  - `08:45` ACCESSED by Sales Analyst
  - `09:10` UPLOADED to Internal Analytics Hub
  - `09:30` TRANSFORMED into `Regional_Summary.pdf`
  - `10:00` ACCESSED by Executive Team
- **Risk Score**: 25 / 100 (LOW)
- **Primary Remediation**: None required. Normal operation.
