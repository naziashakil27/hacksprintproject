import React from 'react';
import { Shield, Play, RotateCcw, Database, Activity, Sparkles } from 'lucide-react';

export default function TopBar({ 
  selectedAsset, 
  onSelectAsset, 
  onRunScenario, 
  onResetScenario, 
  onLoadCleanScenario,
  isRemediated 
}) {
  return (
    <header className="bg-[#FFF9F4] border-b border-[#D8C9BC] px-6 py-3 sticky top-0 z-40 shadow-subtle">
      <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Brand Title & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="h-9 w-9 rounded-lg bg-[#F1E6DC] border border-[#D8C9BC] flex items-center justify-center text-[#B86F62] shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold tracking-tight text-[#342C28] font-serif">
                DIGITAL <span className="text-[#B86F62] italic font-normal">AFTERIMAGE</span>
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#788B72]/15 text-[#788B72] border border-[#788B72]/30">
                <span className="h-1.5 w-1.5 rounded-full bg-[#788B72] animate-pulse"></span>
                LIVE TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-[#81746B] tracking-wider uppercase font-mono mt-0.5">
              SENSITIVE DATA PROPAGATION INTELLIGENCE
            </p>
          </div>
        </div>

        {/* Right System Indicators & Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-md bg-[#F1E6DC]/70 border border-[#D8C9BC] text-xs font-mono text-[#81746B]">
            <span>INVESTIGATION:</span>
            <span className="font-bold text-[#342C28]">INV-2026-001</span>
          </div>

          <select 
            value={selectedAsset}
            onChange={(e) => onSelectAsset(e.target.value)}
            className="bg-[#FFF9F4] text-[#342C28] border border-[#D8C9BC] rounded-md px-3 py-1.5 text-xs font-sans font-medium focus:outline-none focus:border-[#B86F62] shadow-sm cursor-pointer"
          >
            <option value="asset_salary_2026">Scenario 1: HR Salary Data (CRITICAL)</option>
            <option value="asset_customer_contacts">Scenario 2: CRM Contacts (LOW / INTERNAL)</option>
          </select>

          <button
            onClick={onRunScenario}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium bg-[#B86F62] hover:bg-[#A9564F] text-[#FFF9F4] font-sans transition-all shadow-sm"
            title="Run animated event playback demo"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            RUN SCENARIO
          </button>

          <button
            onClick={onLoadCleanScenario}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#F1E6DC] hover:bg-[#E8C8BE]/50 text-[#342C28] border border-[#D8C9BC] font-sans transition-all"
            title="Load low-risk baseline scenario"
          >
            <Database className="w-3.5 h-3.5 text-[#81746B]" />
            CLEAN SCENARIO
          </button>

          <button
            onClick={onResetScenario}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#FFF9F4] hover:bg-[#F1E6DC] text-[#81746B] border border-[#D8C9BC] font-sans transition-all"
            title="Reset telemetry database"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            RESET
          </button>
        </div>

      </div>
    </header>
  );
}
