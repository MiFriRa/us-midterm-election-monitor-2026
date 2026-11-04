import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Layers, Download, Video, Settings, ChevronDown, Info, ExternalLink } from 'lucide-react';

interface HeaderProps {
  onOpenApiModal: () => void;
  onOpenLiveAdapter: () => void;
  onOpenTimelapseModal: () => void;
  onOpenElectionScheduleModal: () => void;
  onSyncNow: () => void;
  isSyncingLive: boolean;
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
  onSyncNow,
  isSyncingLive,
  onExportCsv
}) => {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <header className="border-b border-slate-800/80 bg-[#090d14] shrink-0 z-40">
      <div className="w-full px-3 sm:px-5 h-11 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Identity — Quiet, High-Contrast Editorial Typography */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <span className="text-xs sm:text-base font-bold tracking-tight text-white whitespace-nowrap font-mono truncate">
            US Midterm <span className="hidden sm:inline">Election </span>Monitor 2026
          </span>
          <span className="text-slate-700 hidden sm:inline">·</span>
          <a
            href="https://frimer-rasmussen.dk"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
            title="Visit Frimer-Rasmussen Consulting (frimer-rasmussen.dk)"
          >
            <span>Frimer-Rasmussen Consulting</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>
        </div>

        {/* Utility Controls — Muted Monochrome Slate so they never compete with political colors */}
        <div className="flex items-center gap-2 shrink-0">
          
          <button
            onClick={onSyncNow}
            disabled={isSyncingLive}
            className="px-3 py-1 text-xs font-mono font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50 cursor-pointer"
            title="Sync latest election returns"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${isSyncingLive ? 'animate-spin' : ''}`} />
            <span>{isSyncingLive ? 'Syncing...' : 'Sync Data'}</span>
          </button>

          <button
            onClick={onOpenTimelapseModal}
            className="px-3 py-1 text-xs font-mono font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            title="Watch timelapse replay and export WebM video"
          >
            <Video className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Timelapse</span>
          </button>

          {/* Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsToolsOpen(prev => !prev)}
              className="px-3 py-1 text-xs font-mono font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-400" />
              <span>Tools</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            {isToolsOpen && (
              <div className="absolute right-0 mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5">
                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenElectionScheduleModal();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200 cursor-pointer"
                >
                  <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Poll Closing Schedule (CET)</div>
                    <div className="text-[11px] text-slate-400">
                      State-by-state closing hours in European time.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenLiveAdapter();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Data Sources & Connection Test</div>
                    <div className="text-[11px] text-slate-400">
                      Test live JSON ingestion or configure feed.
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onOpenApiModal();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200 cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">2022 Baseline Inspector</div>
                    <div className="text-[11px] text-slate-400">
                      Inspect certified 2022 midterm returns.
                    </div>
                  </div>
                </button>

                <div className="my-1 border-t border-slate-800" />

                <button
                  onClick={() => {
                    setIsToolsOpen(false);
                    onExportCsv();
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors flex items-start gap-2.5 text-slate-200 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white">Export CSV</div>
                    <div className="text-[11px] text-slate-400">
                      Download 50-state table for analysis.
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
