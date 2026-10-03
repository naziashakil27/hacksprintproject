import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

export default function AfterimageSlider({
  totalSteps,
  currentStep,
  onStepChange
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setInterval(() => {
        onStepChange((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1400);
    }
    return () => clearInterval(timer);
  }, [isPlaying, totalSteps, onStepChange]);

  const stepLabels = [
    "T0: Asset Origin (HR Drive)",
    "T1: Shared with Employee (Alice)",
    "T2: Workstation Download",
    "T3: SaaS Upload (AnalyticsTool)",
    "T4: Transformed Copy Created",
    "T5: External Share Link",
    "T6: Public Access Enabled",
    "T7: Security Detection"
  ];

  return (
    <div className="bg-[#FFF9F4] border border-[#D8C9BC] rounded-xl p-4 shadow-panel font-mono text-xs">
      <div className="flex items-center justify-between gap-4 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-[#F1E6DC] text-[#B86F62] border border-[#D8C9BC]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-bold text-[#342C28] tracking-wider text-xs font-mono uppercase">
              PROPAGATION AFTERIMAGE
            </h3>
            <p className="text-[11px] text-[#81746B] font-sans">
              Reconstruct the data's journey through observed and inferred events.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#B86F62] hover:bg-[#A9564F] text-[#FFF9F4] font-sans text-xs font-medium transition-all shadow-sm"
          >
            {isPlaying ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
            {isPlaying ? 'PAUSE PLAYBACK' : 'PLAY AFTERIMAGE'}
          </button>

          <button
            onClick={() => {
              setIsPlaying(false);
              onStepChange(0);
            }}
            className="p-1.5 rounded-md bg-[#F1E6DC] hover:bg-[#E8C8BE]/50 text-[#81746B] border border-[#D8C9BC]"
            title="Rewind to T0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Range Slider */}
      <div className="space-y-2 pt-1">
        <input
          type="range"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => {
            setIsPlaying(false);
            onStepChange(parseInt(e.target.value, 10));
          }}
          className="w-full accent-[#B86F62] bg-[#F1E6DC] h-2 rounded-lg cursor-pointer border border-[#D8C9BC]"
        />

        <div className="flex items-center justify-between text-[11px] text-[#81746B] font-mono">
          <span className="text-[#B86F62] font-bold">
            {stepLabels[currentStep] || `Stage T${currentStep}`}
          </span>
          <span>
            Stage T{currentStep} ({currentStep + 1} of {totalSteps})
          </span>
        </div>
      </div>
    </div>
  );
}
