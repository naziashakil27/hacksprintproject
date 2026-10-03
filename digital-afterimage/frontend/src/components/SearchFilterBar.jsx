import React from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  evidenceFilter,
  onEvidenceFilterChange,
  actorFilter,
  onActorFilterChange,
  onResetFilters
}) {
  return (
    <div className="bg-[#F1E6DC]/60 border-b border-[#D8C9BC] px-6 py-2 flex flex-wrap items-center justify-between gap-3 text-xs font-sans">
      <div className="flex items-center gap-3 flex-1 min-w-[280px]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#81746B]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search telemetry (e.g. 'salary', 'Alice', 'AnalyticsTool')..."
            className="w-full bg-[#FFF9F4] border border-[#D8C9BC] rounded-md pl-9 pr-3 py-1.5 text-[#342C28] placeholder-[#81746B]/70 font-mono text-xs focus:outline-none focus:border-[#B86F62] shadow-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap font-sans text-xs">
        <div className="flex items-center gap-1.5 text-[#81746B]">
          <Filter className="w-3.5 h-3.5 text-[#B86F62]" />
          <span>Evidence State:</span>
          <select
            value={evidenceFilter}
            onChange={(e) => onEvidenceFilterChange(e.target.value)}
            className="bg-[#FFF9F4] border border-[#D8C9BC] text-[#342C28] rounded px-2.5 py-1 font-mono text-xs focus:outline-none focus:border-[#B86F62] cursor-pointer"
          >
            <option value="">All Telemetry States</option>
            <option value="OBSERVED">OBSERVED (Audit Log)</option>
            <option value="INFERRED">INFERRED (Derived Link)</option>
            <option value="UNKNOWN">UNKNOWN (Telemetry Gap)</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 text-[#81746B]">
          <span>Actor:</span>
          <select
            value={actorFilter}
            onChange={(e) => onActorFilterChange(e.target.value)}
            className="bg-[#FFF9F4] border border-[#D8C9BC] text-[#342C28] rounded px-2.5 py-1 font-mono text-xs focus:outline-none focus:border-[#B86F62] cursor-pointer"
          >
            <option value="">All Actors</option>
            <option value="Alice">Alice (HR User)</option>
            <option value="AnalyticsTool">AnalyticsTool Service</option>
            <option value="HR-System">HR-System Agent</option>
            <option value="Security Monitor">Security Monitor</option>
          </select>
        </div>

        {(searchQuery || evidenceFilter || actorFilter) && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-[#B86F62] hover:text-[#A9564F] font-mono underline ml-1"
          >
            <RefreshCw className="w-3 h-3" /> Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
