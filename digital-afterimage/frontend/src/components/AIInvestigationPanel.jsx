import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, HelpCircle, ArrowRight, Wrench, Sparkles, Compass } from 'lucide-react';

export default function AIInvestigationPanel({
  riskData,
  explanationData,
  onRemediate,
  isRemediating,
  isRemediated,
  verificationData
}) {
  const score = riskData?.score || 0;
  const severity = riskData?.severity || 'LOW';

  let severityBadge = 'text-[#788B72] bg-[#788B72]/15 border-[#788B72]/30';
  if (severity === 'CRITICAL') {
    severityBadge = 'text-[#A9564F] bg-[#A9564F]/15 border-[#A9564F]/30';
  } else if (severity === 'HIGH' || severity === 'MEDIUM') {
    severityBadge = 'text-[#C28A58] bg-[#C28A58]/15 border-[#C28A58]/30';
  }

  return (
    <div className="bg-[#FFF9F4] border border-[#D8C9BC] rounded-xl overflow-hidden flex flex-col h-full font-sans shadow-panel">
      
      {/* Header */}
      <div className="bg-[#F1E6DC] px-4 py-2.5 border-b border-[#D8C9BC] flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#342C28] uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#B86F62]" />
          <span>INVESTIGATION REASONING</span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFF9F4] text-[#B86F62] border border-[#D8C9BC]">
          <Sparkles className="w-2.5 h-2.5 text-[#B86F62]" />
          STRUCTURED INTELLIGENCE
        </span>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        
        {/* Risk Score & Critical Transition Banner */}
        <div className="p-3.5 rounded-lg bg-[#F1E6DC]/70 border border-[#D8C9BC] flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-[#81746B] font-mono block uppercase">Risk Assessment</span>
            <div className="flex items-baseline gap-2 mt-0.5 font-mono">
              <span className={`text-2xl font-bold ${score >= 80 ? 'text-[#A9564F]' : score >= 60 ? 'text-[#C28A58]' : 'text-[#788B72]'}`}>
                {score}
              </span>
              <span className="text-xs text-[#81746B]">/ 100</span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${severityBadge}`}>
                {severity}
              </span>
            </div>
          </div>

          {riskData?.critical_transition && (
            <div className="text-right">
              <span className="text-[10px] text-[#81746B] font-mono block uppercase">Critical Transition</span>
              <span className="text-xs font-mono font-bold text-[#B86F62] block mt-0.5">
                {riskData.critical_transition}
              </span>
            </div>
          )}
        </div>

        {/* Why It Matters */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-bold font-mono text-[#81746B] uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-[#A9564F]" />
            Why It Matters
          </h4>
          <p className="text-xs text-[#342C28] leading-relaxed bg-[#FFF9F4] p-3 rounded-lg border border-[#D8C9BC] font-sans">
            {explanationData?.why_it_matters || explanationData?.summary || "Analyzing propagation sequence data..."}
          </p>
        </div>

        {/* Evidence Checklist */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-bold font-mono text-[#81746B] uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#788B72]" />
            Corroborated Evidence
          </h4>
          <ul className="space-y-1 text-xs text-[#342C28] font-mono">
            {explanationData?.evidence ? (
              explanationData.evidence.map((item, i) => (
                <li key={i} className="bg-[#F1E6DC]/40 px-2.5 py-1.5 rounded border border-[#D8C9BC]/60 flex items-start gap-2">
                  <span className="text-[#788B72] shrink-0 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="text-[#81746B] italic">No direct evidence parsed.</li>
            )}
          </ul>
        </div>

        {/* Telemetry Uncertainty Callout */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-bold font-mono text-[#81746B] uppercase tracking-wider flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#C28A58]" />
            Identified Telemetry Blindspots
          </h4>
          <div className="p-2.5 rounded-lg bg-[#C28A58]/10 border border-[#C28A58]/30 text-xs text-[#342C28] font-mono">
            {explanationData?.uncertainties && explanationData.uncertainties.length > 0 ? (
              explanationData.uncertainties.map((u, idx) => <p key={idx}>⚠️ {u}</p>)
            ) : (
              <p>No telemetry gaps flagged.</p>
            )}
          </div>
        </div>

        {/* Recommended Action */}
        <div className="space-y-1.5">
          <h4 className="text-[11px] font-bold font-mono text-[#81746B] uppercase tracking-wider flex items-center gap-1.5">
            <ArrowRight className="w-3.5 h-3.5 text-[#B86F62]" />
            Recommended Containment
          </h4>
          <div className="p-3 rounded-lg bg-[#F1E6DC] border border-[#D8C9BC] text-xs text-[#342C28] font-mono">
            {explanationData?.recommended_action || "Revoke public access permissions immediately."}
          </div>
        </div>

        {/* Remediation Complete State */}
        {isRemediated && (
          <div className="p-3 rounded-lg bg-[#788B72]/15 border border-[#788B72]/40 text-xs text-[#342C28] font-mono space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#788B72]">
              <CheckCircle2 className="w-4 h-4" />
              REMEDIATION COMPLETE
            </div>
            <div className="text-[11px] text-[#81746B] space-y-0.5 mt-1 font-sans">
              <p>✓ Public access revoked</p>
              <p>✓ Security state verified</p>
              <p className="font-mono text-[#342C28] font-bold mt-1">Risk reduced from 95 → 40 (MEDIUM)</p>
            </div>
          </div>
        )}

      </div>

      {/* Interactive Action Footer */}
      <div className="p-3 bg-[#F1E6DC] border-t border-[#D8C9BC]">
        {!isRemediated ? (
          <button
            onClick={onRemediate}
            disabled={isRemediating}
            className="w-full py-2.5 px-4 rounded-lg bg-[#B86F62] hover:bg-[#A9564F] text-[#FFF9F4] font-sans text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Wrench className={`w-4 h-4 ${isRemediating ? 'animate-spin' : ''}`} />
            {isRemediating ? 'EXECUTING AUTOMATED CONTAINMENT...' : 'REMEDIATE EXPOSURE'}
          </button>
        ) : (
          <div className="w-full py-2 px-3 rounded-lg bg-[#788B72]/20 border border-[#788B72]/40 text-[#788B72] font-mono text-xs text-center font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            CONTAINMENT ACTIVE & VERIFIED
          </div>
        )}
      </div>

    </div>
  );
}
