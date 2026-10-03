import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Info } from 'lucide-react';

export default function RiskBreakdown({ riskData }) {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedFactor, setSelectedFactor] = useState(null);

  if (!riskData || !riskData.factors) return null;

  return (
    <div className="bg-[#FFF9F4] border border-[#D8C9BC] rounded-xl overflow-hidden font-sans shadow-panel">
      
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-[#F1E6DC] border-b border-[#D8C9BC] flex items-center justify-between text-xs font-mono font-bold text-[#342C28] uppercase tracking-wider"
      >
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5 text-[#B86F62]" />
          <span>Transparent Risk Rule Breakdown</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#B86F62] font-mono text-xs">
            SCORE: {riskData.score} / 100 ({riskData.severity})
          </span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#81746B]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#81746B]" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 space-y-2.5">
          <div className="space-y-1.5">
            {riskData.factors.map((factor, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedFactor(selectedFactor === factor.code ? null : factor.code)}
                className="p-2.5 rounded-lg bg-[#F1E6DC]/40 border border-[#D8C9BC]/70 hover:border-[#B86F62]/60 transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#342C28]">{factor.title}</span>
                    <Info className="w-3 h-3 text-[#81746B]" />
                  </div>
                  <span className="font-bold text-[#A9564F] bg-[#A9564F]/10 px-2 py-0.5 rounded border border-[#A9564F]/20 text-[11px]">
                    +{factor.points} PTS
                  </span>
                </div>

                {selectedFactor === factor.code && (
                  <div className="mt-2 pt-2 border-t border-[#D8C9BC]/60 text-xs text-[#342C28] font-mono space-y-1">
                    <p className="text-[#81746B] leading-relaxed font-sans">{factor.description}</p>
                    <div className="text-[10px] text-[#B86F62] bg-[#FFF9F4] px-2 py-1 rounded border border-[#D8C9BC] mt-1 font-mono">
                      Evidence: {factor.evidence_ref}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#D8C9BC]/60 flex items-center justify-between text-[11px] font-mono text-[#81746B]">
            <span>Formula: min(Sum(Rule Penalties), 100)</span>
            <span>Deterministic Engine</span>
          </div>
        </div>
      )}
    </div>
  );
}
