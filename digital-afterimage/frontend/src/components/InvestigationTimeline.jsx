import React from 'react';
import { Clock, Eye, AlertTriangle, HelpCircle, FileCode2, UserCheck } from 'lucide-react';

export default function InvestigationTimeline({ events, onSelectEvent, selectedEventId }) {
  if (!events || events.length === 0) {
    return (
      <div className="p-6 text-center text-[#81746B] font-mono text-xs">
        No telemetry events recorded for this asset.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#FFF9F4] border border-[#D8C9BC] rounded-xl overflow-hidden shadow-panel">
      
      {/* Header */}
      <div className="bg-[#F1E6DC] px-4 py-2.5 border-b border-[#D8C9BC] flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#342C28] uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5 text-[#B86F62]" />
          <span>Forensic Event Log</span>
        </div>
        <span className="text-[10px] font-mono bg-[#FFF9F4] px-2 py-0.5 rounded text-[#B86F62] border border-[#D8C9BC]">
          {events.length} LOGS
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {events.map((evt, idx) => {
          const isSelected = selectedEventId === evt.id;
          const isCritical = evt.action === 'PUBLIC_ACCESS_ENABLED' || evt.action === 'DETECTED';
          
          let cardBorder = 'border-[#D8C9BC] bg-[#FFF9F4] hover:border-[#B86F62]';
          if (isCritical) {
            cardBorder = 'border-[#A9564F] bg-[#F4E3D7] hover:border-[#A9564F] shadow-sm';
          } else if (isSelected) {
            cardBorder = 'border-[#B86F62] bg-[#E8C8BE]/30';
          }

          return (
            <div
              key={evt.id || idx}
              onClick={() => onSelectEvent && onSelectEvent(evt)}
              className={`p-3 rounded-lg border transition-all cursor-pointer font-sans relative ${cardBorder}`}
            >
              {/* Timeline Connector Line */}
              {idx < events.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-[-16px] w-0.5 bg-[#D8C9BC] z-0"></div>
              )}

              <div className="flex items-start justify-between gap-2.5 relative z-10">
                <div className="flex items-start gap-2.5">
                  <div className={`mt-0.5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold shrink-0 ${
                    isCritical ? 'bg-[#A9564F] text-[#FFF9F4]' : 'bg-[#F1E6DC] text-[#342C28] border border-[#D8C9BC]'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#342C28]">
                      <span className={isCritical ? 'text-[#A9564F]' : 'text-[#342C28]'}>
                        {evt.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[10px] text-[#81746B] font-normal">@ {evt.timestamp}</span>
                    </div>
                    
                    <div className="text-xs text-[#342C28] mt-1 font-mono">
                      <span className="text-[#81746B]">{evt.source}</span>
                      <span className="text-[#B86F62] px-1.5">→</span>
                      <span className={isCritical ? 'text-[#A9564F] font-bold' : 'text-[#342C28]'}>{evt.destination}</span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#81746B] mt-2 font-mono">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3 h-3 text-[#81746B]" />
                        {evt.actor}
                      </span>
                      {evt.metadata?.derived_file && (
                        <span className="flex items-center gap-1 text-[#B86F62]">
                          <FileCode2 className="w-3 h-3" />
                          {evt.metadata.derived_file}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Evidence Badge */}
                <div className="shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                    evt.evidence_type === 'OBSERVED' ? 'bg-[#788B72]/15 text-[#788B72] border-[#788B72]/30' :
                    evt.evidence_type === 'INFERRED' ? 'bg-[#C28A58]/15 text-[#C28A58] border-[#C28A58]/30' :
                    'bg-[#81746B]/15 text-[#81746B] border-[#81746B]/30'
                  }`}>
                    {evt.evidence_type === 'OBSERVED' ? <Eye className="w-2.5 h-2.5" /> : <AlertTriangle className="w-2.5 h-2.5" />}
                    {evt.evidence_type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
