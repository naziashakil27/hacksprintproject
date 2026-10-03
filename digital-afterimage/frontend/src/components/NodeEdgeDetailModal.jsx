import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

export default function NodeEdgeDetailModal({ item, onClose }) {
  if (!item) return null;

  const isEdge = !!item.source && !!item.target;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#342C28]/40 backdrop-blur-xs p-4 font-mono">
      <div className="bg-[#FFF9F4] border border-[#D8C9BC] rounded-xl max-w-lg w-full p-5 shadow-modal space-y-4 text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#D8C9BC] pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#B86F62]" />
            <h3 className="font-bold text-sm text-[#342C28] uppercase tracking-wider font-mono">
              {isEdge ? 'Telemetry Relationship Detail' : 'Telemetry Entity Node Detail'}
            </h3>
          </div>
          <button onClick={onClose} className="text-[#81746B] hover:text-[#342C28] p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {!isEdge ? (
          <div className="space-y-3 font-sans">
            <div className="bg-[#F1E6DC] p-3 rounded-lg border border-[#D8C9BC] space-y-1">
              <div className="text-[10px] text-[#81746B] font-mono uppercase">Node Entity Label</div>
              <div className="text-sm font-bold text-[#342C28] font-mono">{item.label}</div>
              <div className="text-xs text-[#B86F62] font-mono">Type: {item.type}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="bg-[#FFF9F4] p-2.5 rounded border border-[#D8C9BC]">
                <span className="text-[#81746B] block text-[10px]">Evidence State</span>
                <span className="font-bold text-[#788B72] mt-0.5 block">{item.evidence_type}</span>
              </div>
              <div className="bg-[#FFF9F4] p-2.5 rounded border border-[#D8C9BC]">
                <span className="text-[#81746B] block text-[10px]">Classification</span>
                <span className="font-bold text-[#A9564F] mt-0.5 block">{item.classification}</span>
              </div>
            </div>

            {item.timestamp && (
              <div className="bg-[#F1E6DC] p-2.5 rounded border border-[#D8C9BC] font-mono text-xs text-[#342C28]">
                First Recorded Timestamp: {item.timestamp}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3 font-sans">
            <div className="bg-[#F1E6DC] p-3 rounded-lg border border-[#D8C9BC] space-y-1">
              <div className="text-[10px] text-[#81746B] font-mono uppercase">Event Relationship Action</div>
              <div className="text-sm font-bold text-[#342C28] font-mono">{item.label}</div>
              <div className="text-xs text-[#81746B] font-mono">
                {item.source} <span className="text-[#B86F62]">→</span> {item.target}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              <div className="bg-[#FFF9F4] p-2.5 rounded border border-[#D8C9BC]">
                <span className="text-[#81746B] block text-[10px]">Evidence Type</span>
                <span className="font-bold text-[#C28A58] mt-0.5 block">{item.evidence_type}</span>
              </div>
              <div className="bg-[#FFF9F4] p-2.5 rounded border border-[#D8C9BC]">
                <span className="text-[#81746B] block text-[10px]">Risk Weight</span>
                <span className="font-bold text-[#A9564F] mt-0.5 block">+{item.risk_weight} PTS</span>
              </div>
            </div>

            <div className="bg-[#F1E6DC] p-2.5 rounded border border-[#D8C9BC] font-mono text-xs text-[#342C28]">
              Recorded Timestamp: {item.timestamp}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-[#D8C9BC] text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded bg-[#F1E6DC] hover:bg-[#E8C8BE]/50 text-[#342C28] font-mono text-xs border border-[#D8C9BC]"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
