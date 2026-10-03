import React, { useState, useEffect, useCallback } from 'react';
import TopBar from './components/TopBar';
import SearchFilterBar from './components/SearchFilterBar';
import PropagationGraph from './components/PropagationGraph';
import InvestigationTimeline from './components/InvestigationTimeline';
import AIInvestigationPanel from './components/AIInvestigationPanel';
import RiskBreakdown from './components/RiskBreakdown';
import AfterimageSlider from './components/AfterimageSlider';
import AutomationActivity from './components/AutomationActivity';
import NodeEdgeDetailModal from './components/NodeEdgeDetailModal';

import {
  getAssets,
  getEvents,
  getPropagation,
  getRisk,
  getAIExplanation,
  triggerRemediation,
  verifyRemediation,
  resetScenario,
  runScenario
} from './services/api';

export default function App() {
  const [selectedAsset, setSelectedAsset] = useState("asset_salary_2026");
  const [propagationData, setPropagationData] = useState(null);
  const [riskData, setRiskData] = useState(null);
  const [explanationData, setExplanationData] = useState(null);
  const [eventsData, setEventsData] = useState([]);
  
  const [sliderStep, setSliderStep] = useState(7);
  const [searchQuery, setSearchQuery] = useState("");
  const [evidenceFilter, setEvidenceFilter] = useState("");
  const [actorFilter, setActorFilter] = useState("");
  
  const [isRemediating, setIsRemediating] = useState(false);
  const [isRemediated, setIsRemediated] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [scenarioNotification, setScenarioNotification] = useState(null);

  // Load telemetry data from FastAPI backend for selected asset
  const loadData = useCallback(async (assetId) => {
    setLoading(true);
    try {
      const [prop, rsk, exp, evts] = await Promise.all([
        getPropagation(assetId),
        getRisk(assetId),
        getAIExplanation(assetId),
        getEvents({ asset_id: assetId })
      ]);
      
      setPropagationData(prop);
      setRiskData(rsk);
      setExplanationData(exp);
      setEventsData(evts);
      setSliderStep(prop?.nodes ? prop.nodes.length - 1 : 7);
    } catch (err) {
      console.error("Failed to load scenario data from backend:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(selectedAsset);
    setIsRemediated(false);
    setIsRemediating(false);
  }, [selectedAsset, loadData]);

  // Refilter timeline events dynamically when search/filter changes
  const filteredEvents = React.useMemo(() => {
    let result = [...eventsData];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => 
        e.asset_name.toLowerCase().includes(q) ||
        e.actor.toLowerCase().includes(q) ||
        e.source.toLowerCase().includes(q) ||
        e.destination.toLowerCase().includes(q)
      );
    }
    if (evidenceFilter) {
      result = result.filter(e => e.evidence_type === evidenceFilter);
    }
    if (actorFilter) {
      result = result.filter(e => e.actor.includes(actorFilter));
    }
    return result;
  }, [eventsData, searchQuery, evidenceFilter, actorFilter]);

  // Handle RUN SCENARIO playback demo
  const handleRunScenario = async () => {
    await runScenario(selectedAsset);
    await loadData(selectedAsset);
    setIsRemediated(false);
    setSliderStep(0);
    setScenarioNotification("Starting animated scenario playback...");
    
    let step = 0;
    const maxSteps = propagationData?.nodes ? propagationData.nodes.length - 1 : 7;
    const interval = setInterval(() => {
      step++;
      setSliderStep(step);
      if (step >= maxSteps) {
        clearInterval(interval);
        setScenarioNotification("⚠ CRITICAL EXPOSURE DETECTED: Data propagation story reconstructed.");
        setTimeout(() => setScenarioNotification(null), 5000);
      }
    }, 1200);
  };

  // Handle LOAD CLEAN SCENARIO
  const handleLoadCleanScenario = async () => {
    setSelectedAsset("asset_customer_contacts");
    setScenarioNotification("Loaded Low-Risk Scenario: Customer_Contact_List.csv");
    setTimeout(() => setScenarioNotification(null), 4000);
  };

  // Handle RESET SCENARIO
  const handleResetScenario = async () => {
    await resetScenario();
    setIsRemediated(false);
    setIsRemediating(false);
    setSelectedAsset("asset_salary_2026");
    await loadData("asset_salary_2026");
    setScenarioNotification("Scenarios reset to initial baseline state.");
    setTimeout(() => setScenarioNotification(null), 3000);
  };

  // Handle Interactive REMEDIATION
  const handleRemediate = async () => {
    setIsRemediating(true);
    setScenarioNotification("Initiating n8n automated containment...");
    
    try {
      const remRes = await triggerRemediation("INC-0001");
      const verRes = await verifyRemediation("INC-0001");
      
      setVerificationData(verRes);
      setIsRemediated(true);
      setIsRemediating(false);

      // Refetch live backend state to update graph, timeline, and risk score
      await loadData(selectedAsset);

      setScenarioNotification("✓ REMEDIATION VERIFIED: Public access revoked. Risk score reduced.");
      setTimeout(() => setScenarioNotification(null), 5000);
    } catch (err) {
      console.error("Remediation execution error:", err);
      setIsRemediating(false);
    }
  };

  const isCriticalAsset = selectedAsset === "asset_salary_2026";

  return (
    <div className="min-h-screen bg-[#F7F1EA] text-[#342C28] flex flex-col font-sans">
      
      {/* Top Navigation Header */}
      <TopBar
        selectedAsset={selectedAsset}
        onSelectAsset={setSelectedAsset}
        onRunScenario={handleRunScenario}
        onResetScenario={handleResetScenario}
        onLoadCleanScenario={handleLoadCleanScenario}
        isRemediated={isRemediated}
      />

      {/* Global Telemetry Filter Bar */}
      <SearchFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        evidenceFilter={evidenceFilter}
        onEvidenceFilterChange={setEvidenceFilter}
        actorFilter={actorFilter}
        onActorFilterChange={setActorFilter}
        onResetFilters={() => {
          setSearchQuery("");
          setEvidenceFilter("");
          setActorFilter("");
        }}
      />

      {/* Scenario Notification Banner */}
      {scenarioNotification && (
        <div className="bg-[#E8C8BE] border-b border-[#D8C9BC] px-6 py-1.5 text-xs font-mono text-[#342C28] text-center flex items-center justify-center gap-2">
          <span>{scenarioNotification}</span>
        </div>
      )}

      {/* Editorial Workspace Header */}
      <section className="max-w-[1700px] w-full mx-auto px-6 pt-5 pb-2">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#D8C9BC] pb-4">
          
          {/* Editorial Title & Supporting Text */}
          <div className="max-w-3xl space-y-1">
            <h2 className="text-2xl lg:text-3xl font-serif text-[#342C28] tracking-tight">
              DIGITAL <span className="text-[#B86F62] italic">AFTERIMAGE</span>
            </h2>
            <blockquote className="text-sm lg:text-base font-serif italic text-[#B86F62] font-normal">
              “When sensitive data moves, its security story should move with it.”
            </blockquote>
            <p className="text-xs text-[#81746B] font-sans leading-relaxed pt-1">
              Reconstruct the observed and inferred propagation path of sensitive information across a digital workflow.
            </p>
          </div>

          {/* Horizontal Intelligence Indicators */}
          <div className="flex items-center gap-4 bg-[#FFF9F4] px-5 py-2.5 rounded-xl border border-[#D8C9BC] shadow-subtle font-mono">
            <div className="text-center px-1">
              <span className="text-[10px] text-[#81746B] block uppercase tracking-wider">Critical</span>
              <span className={`text-xl font-bold ${isCriticalAsset && !isRemediated ? 'text-[#A9564F]' : 'text-[#81746B]'}`}>
                {isCriticalAsset && !isRemediated ? '01' : '00'}
              </span>
            </div>
            <div className="h-8 w-px bg-[#D8C9BC]"></div>
            <div className="text-center px-1">
              <span className="text-[10px] text-[#81746B] block uppercase tracking-wider">High</span>
              <span className="text-xl font-bold text-[#C28A58]">00</span>
            </div>
            <div className="h-8 w-px bg-[#D8C9BC]"></div>
            <div className="text-center px-1">
              <span className="text-[10px] text-[#81746B] block uppercase tracking-wider">Active Incidents</span>
              <span className={`text-xl font-bold ${isCriticalAsset && !isRemediated ? 'text-[#A9564F]' : 'text-[#81746B]'}`}>
                {isCriticalAsset && !isRemediated ? '01' : '00'}
              </span>
            </div>
            <div className="h-8 w-px bg-[#D8C9BC]"></div>
            <div className="text-center px-1">
              <span className="text-[10px] text-[#81746B] block uppercase tracking-wider">Remediated</span>
              <span className={`text-xl font-bold ${isRemediated ? 'text-[#788B72]' : 'text-[#81746B]'}`}>
                {isRemediated ? '01' : '00'}
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto p-4 space-y-4">
        
        {loading ? (
          <div className="h-[500px] flex items-center justify-center text-[#81746B] font-mono text-sm">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#B86F62] border-t-transparent rounded-full animate-spin"></div>
              <span>Reconstructing telemetry propagation map...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Top Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch min-h-[580px]">
              
              {/* Left Column (3 cols): Incident & Asset Context Block */}
              <div className="lg:col-span-3 flex flex-col gap-4">
                
                <div className="bg-[#FFF9F4] border border-[#D8C9BC] rounded-xl p-4 shadow-panel font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#D8C9BC] pb-2">
                    <span className="text-[10px] text-[#81746B] uppercase font-mono">Incident ID</span>
                    <span className="font-bold text-[#342C28]">INC-0001</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#81746B] uppercase font-mono block">Incident Title</span>
                    <span className="font-bold text-[#342C28] font-sans text-sm block mt-0.5">
                      {isCriticalAsset ? "SENSITIVE DATA EXPOSURE" : "INTERNAL DATA MOVEMENT"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-[#81746B] uppercase font-mono block">Asset Monitored</span>
                    <span className="font-bold text-[#B86F62] font-mono text-xs block mt-0.5">
                      {propagationData?.asset_name || "Employee_Salary_2026.xlsx"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D8C9BC]/60">
                    <div>
                      <span className="text-[10px] text-[#81746B] uppercase font-mono block">Sensitivity</span>
                      <span className={`font-bold font-mono text-xs mt-0.5 block ${
                        propagationData?.classification === 'CRITICAL' ? 'text-[#A9564F]' : 'text-[#788B72]'
                      }`}>
                        {propagationData?.classification || "CRITICAL"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-[#81746B] uppercase font-mono block">Detected</span>
                      <span className="font-bold text-[#342C28] font-mono text-xs mt-0.5 block">10:16:42</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#D8C9BC]/60 flex items-center justify-between">
                    <span className="text-[10px] text-[#81746B] uppercase font-mono">Status</span>
                    <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                      isRemediated 
                        ? 'bg-[#788B72]/15 text-[#788B72] border-[#788B72]/30' 
                        : isCriticalAsset 
                        ? 'bg-[#A9564F]/15 text-[#A9564F] border-[#A9564F]/30' 
                        : 'bg-[#788B72]/15 text-[#788B72] border-[#788B72]/30'
                    }`}>
                      {isRemediated ? 'REMEDIATED' : isCriticalAsset ? 'OPEN' : 'NORMAL'}
                    </span>
                  </div>
                </div>

                {/* Timeline in Left Stack */}
                <div className="flex-1 min-h-[300px]">
                  <InvestigationTimeline
                    events={filteredEvents}
                    onSelectEvent={(evt) => setSelectedDetailItem(evt)}
                    selectedEventId={selectedDetailItem?.id}
                  />
                </div>

              </div>

              {/* Center Column (5 cols): Reconstructed Propagation Graph */}
              <div className="lg:col-span-5 flex flex-col h-[580px] lg:h-auto">
                <PropagationGraph
                  graphData={propagationData}
                  sliderStep={sliderStep}
                  onNodeClick={(node) => setSelectedDetailItem(node)}
                  onEdgeClick={(edge) => setSelectedDetailItem(edge)}
                />
              </div>

              {/* Right Column (4 cols): AI Reasoning & Risk Breakdown */}
              <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto max-h-[580px]">
                <AIInvestigationPanel
                  riskData={riskData}
                  explanationData={explanationData}
                  onRemediate={handleRemediate}
                  isRemediating={isRemediating}
                  isRemediated={isRemediated}
                  verificationData={verificationData}
                />

                <RiskBreakdown riskData={riskData} />
              </div>

            </div>

            {/* Bottom Row: Afterimage Time Slider & SOAR Automation */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-6">
                <AfterimageSlider
                  totalSteps={propagationData?.nodes?.length || 8}
                  currentStep={sliderStep}
                  onStepChange={setSliderStep}
                />
              </div>

              <div className="lg:col-span-6">
                <AutomationActivity
                  isRemediated={isRemediated}
                  isRemediating={isRemediating}
                />
              </div>
            </div>
          </>
        )}

      </main>

      {/* Node/Edge Detail Modal */}
      {selectedDetailItem && (
        <NodeEdgeDetailModal
          item={selectedDetailItem}
          onClose={() => setSelectedDetailItem(null)}
        />
      )}

      {/* Editorial Footer */}
      <footer className="border-t border-[#D8C9BC] px-6 py-3 text-[11px] font-mono text-[#81746B] flex items-center justify-between">
        <div>DIGITAL AFTERIMAGE v1.0.0 — PS31 Web3 & Cybersecurity Hackathon Prototype</div>
        <div>Editorial Warm Nude Palette • Data Propagation Intelligence</div>
      </footer>

    </div>
  );
}
