import React from 'react';
import { Workflow, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AutomationActivity({ isRemediated, isRemediating }) {
  const steps = [
    { label: "Detection", status: "complete", desc: "DLP Telemetry Trigger" },
    { label: "Incident", status: "complete", desc: "INC-0001 Created" },
    { label: "Notification", status: "complete", desc: "Slack Security Alert" },
    { label: "Approval", status: "complete", desc: "Policy Authorized" },
    { label: "Remediation", status: isRemediated ? "complete" : isRemediating ? "in_progress" : "pending", desc: isRemediated ? "Public Link Revoked" : "Pending Action" },
    { label: "Verification", status: isRemediated ? "complete" : "pending", desc: isRemediated ? "ACL Checks Passed" : "Pending Containment" }
  ];

  return (
    <div className="bg-[#FFF9F4] border border-[#D8C9BC] rounded-xl p-4 font-mono text-xs shadow-panel">
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <Workflow className="w-3.5 h-3.5 text-[#B86F62]" />
          <span className="font-bold text-[#342C28] uppercase tracking-wider text-xs font-mono">
            SOAR AUTOMATION ACTIVITY (n8n Engine)
          </span>
        </div>
        <span className="text-[10px] bg-[#F1E6DC] px-2 py-0.5 rounded text-[#81746B] border border-[#D8C9BC]">
          /api/n8n/webhook
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {steps.map((st, i) => {
          let stepBg = 'bg-[#F1E6DC]/40 border-[#D8C9BC] text-[#81746B]';
          let icon = <Clock className="w-3 h-3 text-[#81746B]" />;

          if (st.status === 'complete') {
            stepBg = 'bg-[#788B72]/15 border-[#788B72]/40 text-[#788B72]';
            icon = <CheckCircle2 className="w-3 h-3 text-[#788B72]" />;
          } else if (st.status === 'in_progress') {
            stepBg = 'bg-[#C28A58]/15 border-[#C28A58]/40 text-[#C28A58] animate-pulse';
            icon = <AlertCircle className="w-3 h-3 text-[#C28A58]" />;
          }

          return (
            <div key={i} className={`p-2 rounded-lg border flex flex-col justify-between ${stepBg}`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px]">{st.label}</span>
                {icon}
              </div>
              <span className="text-[10px] opacity-80 mt-1 block truncate font-sans">
                {st.desc}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
