import React, { useState, useRef, useEffect } from 'react';
import { Radio, RefreshCw, Layers, Download, Video, Settings, ChevronDown, Info, Clock } from 'lucide-react';

interface HeaderProps {
  onOpenApiModal: () => void;
  onOpenLiveAdapter: () => void;
  onOpenTimelapseModal: () => void;
  onOpenElectionScheduleModal: () => void;
  isLivePolling: boolean;
  isCountingActive: boolean;
  isBacktestMode: boolean;
  currentHourLabel: string;
  currentCetLabel: string;
  onExportCsv: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenApiModal,
  onOpenLiveAdapter,
  onOpenTimelapseModal,
  onOpenElectionScheduleModal,
  isLivePolling,
  isCountingActive,
  isBacktestMode,
  currentHourLabel,
  currentCetLabel,
  onExportCsv
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="border-b border-slate-800/80 bg-[#070a10]/95 backdrop-blur-md shrink-0 z-40">
      <div className="w-full px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        
        {/* Brand & Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 via-purple-600 to-red-600 flex items-center justify-center shadow-md shadow-purple-950/50">
            <Radio className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-extrabold tracking-tight text-white whitespace-nowrap font-mono">
              US Midterm Election Monitor <span className="text-purple-400">2026</span>
            </span>
          </div>
        </div>

        {/* Honest Status & Clock (CET & EST) */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900/90 px-3 py-1 rounded-md border border-slate-800">
          {isBacktestMode ? (
            <>
              <span className="inline-flex rounded-full h-2 w-2 bg-blue-400"></span>
              <span className="font-bold text-blue-300">2022 CERTIFIED BASELINE</span>
            </>
          ) : isCountingActive ? (
            <>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-bold text-emerald-300">LIVE COUNTING</span>
            </>
          ) : (
            <>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-amber-300">POLLS OPEN · AWAITING COUNT</span>
            </>
          )}
          <span className="text-slate-600">·</span>
          <span className="text-purple-300 font-semibold">{currentCetLabel}</span>
          <span className="text-slate-400 text-[11px] hidden sm:inline">({currentHourLabel})</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Timelapse Video Studio Button */}
          <button
            onClick={onOpenTimelapseModal}
            className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap"
            title="Watch timelapse replay and export WebM video"
          >
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Timelapse Video</span>
            <span className="sm:hidden">Video</span>
          </button>

          {/* Tools & Data Sources Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsToolsOpen(prev => !prev)}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Data & Tools</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1 backdrop-blur-md">
                
                {/* Election Timetable & CET Hours */}
                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenElectionScheduleModal();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200"
                >
                  <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-100">Election Schedule & CET Times</div>
                    <div className="text-[11px] text-slate-400">
                      State poll opening & closing hours in European time (CET) and counting phases.
                    </div>
                  </div>
                </button>

                {/* Live Data Adapter */}
                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenLiveAdapter();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200"
                >
                  <RefreshCw className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-100 flex items-center gap-1.5">
                      <span>Data Sources & Live Ingestion</span>
                      {isLivePolling && isCountingActive && (
                        <span className="px-1 py-0.2 bg-emerald-950 text-emerald-400 text-[9px] font-mono rounded border border-emerald-800">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Connect real JSON endpoint or inspect 2022 FEC/MIT Lab baseline & 2026 forecast.
                    </div>
                  </div>
                </button>

                {/* Public API & Backtesting Studio */}
                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenApiModal();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200"
                >
                  <Layers className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-100">API & Backtesting Studio</div>
                    <div className="text-[11px] text-slate-400">
                      Inspect raw JSON payloads, ping test endpoints and 50-state ground truth sanity.
                    </div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-800/80" />

                {/* Export CSV */}
                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onExportCsv();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200"
                >
                  <Download className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-slate-100">Export Returns (CSV)</div>
                    <div className="text-[11px] text-slate-400">
                      Download 50-state vote tallies, percentages and swing delta for spreadsheet analysis.
                    </div>
                  </div>
                </button>

              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
