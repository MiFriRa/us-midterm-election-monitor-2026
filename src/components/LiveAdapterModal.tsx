import React, { useState } from 'react';
import { X, RefreshCw, Radio, CheckCircle, AlertTriangle, ShieldCheck, Play, Pause, Database, Globe, Clock, FlaskConical, RotateCcw } from 'lucide-react';
import { LiveFeedProvider } from '../utils/liveElectionFeed';

interface LiveAdapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  isLivePolling: boolean;
  onTogglePolling: (enabled: boolean) => void;
  pollingIntervalSeconds: number;
  onSetPollingInterval: (sec: number) => void;
  lastSyncTime: Date | null;
  onManualSync: () => Promise<void>;
  onTestLivePipeline: () => Promise<void>;
  onClearLiveSync: () => void;
  hasActiveLiveSync: boolean;
  recordedSnapshotsCount: number;
  selectedFeed: LiveFeedProvider;
  onSelectFeed: (feed: LiveFeedProvider) => void;
  customUrl: string;
  onCustomUrlChange: (url: string) => void;
  lastSyncStatus: { ok: boolean; message: string; latencyMs?: number } | null;
}

export const LiveAdapterModal: React.FC<LiveAdapterModalProps> = ({
  isOpen,
  onClose,
  isLivePolling,
  onTogglePolling,
  pollingIntervalSeconds,
  onSetPollingInterval,
  lastSyncTime,
  onManualSync,
  onTestLivePipeline,
  onClearLiveSync,
  hasActiveLiveSync,
  recordedSnapshotsCount,
  selectedFeed,
  onSelectFeed,
  customUrl,
  onCustomUrlChange,
  lastSyncStatus
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSyncNow = async () => {
    setIsSyncing(true);
    try {
      await onManualSync();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    try {
      await onTestLivePipeline();
    } finally {
      setIsTesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <Radio className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="font-bold text-white text-base">Data Sources & Live Election Feed (Zero API Cost)</h2>
              <p className="text-xs text-slate-400">
                100% free client-side synchronization via real-time CET poll closing schedule or public JSON feed
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs overflow-y-auto">
          
          {/* Status Box */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                {isLivePolling ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-slate-600"></span>
                )}
              </span>
              <div>
                <div className="font-bold text-slate-200 text-sm">
                  {isLivePolling ? 'Automatic Live Refresh Enabled' : 'Manual / Timeline Mode (Auto-Refresh Paused)'}
                </div>
                <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                  {lastSyncTime
                    ? `Last synced: ${lastSyncTime.toLocaleTimeString('en-GB')}${lastSyncStatus?.latencyMs !== undefined ? ` (${lastSyncStatus.latencyMs}ms)` : ''}`
                    : 'No API keys required · Zero token usage'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onTogglePolling(!isLivePolling)}
                className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isLivePolling
                    ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80 hover:bg-amber-900/60'
                    : 'bg-emerald-600 text-white hover:bg-emerald-500'
                }`}
              >
                {isLivePolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isLivePolling ? 'Pause Auto-Refresh' : 'Enable Auto-Refresh'}</span>
              </button>

              <button
                onClick={handleSyncNow}
                disabled={isSyncing}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>

          {/* 1-Click Pipeline Verification Box */}
          <div className="p-3.5 bg-blue-950/30 border border-blue-700/50 rounded-xl flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="font-bold text-blue-200 text-xs flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-blue-400" />
                <span>Test Data Connection & Live Pipeline (End-to-End Test)</span>
              </div>
              <div className="text-[11px] text-slate-300">
                Fetches a static HTTP JSON test payload (<code className="text-blue-300">/live-test-feed.json</code>) with 7 early states (GA, NC, VA, FL, OH, IN, KY) to verify the map and Biggest Surprises.
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRunTest}
                disabled={isTesting}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>{isTesting ? 'Testing...' : 'Run Connection Test'}</span>
              </button>
              {hasActiveLiveSync && (
                <button
                  onClick={onClearLiveSync}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg font-mono font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                  title="Reset to 0% (Polls Open)"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to 0%</span>
                </button>
              )}
            </div>
          </div>

          {/* Feed Provider Choice */}
          <div className="space-y-2.5">
            <label className="font-bold text-slate-200 block text-xs uppercase tracking-wider font-mono">
              1. Select Data Synchronization Mode (No API Keys Required):
            </label>
            <div className="space-y-2">
              
              {/* Option A: Real-Time CET Election Night Clock */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedFeed === 'cet_live_clock'
                    ? 'bg-purple-950/40 border-purple-500/80'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="feed"
                  checked={selectedFeed === 'cet_live_clock'}
                  onChange={() => onSelectFeed('cet_live_clock')}
                  className="accent-purple-500 mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Real-Time CET Poll-Closing Schedule (Default · 100% Free)</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    Automatically tracks the official European (CET) / Eastern (EST) poll-closing schedule hour by hour as states close from 00:00 CET to 08:00 CET. Zero API cost for you or your visitors.
                  </div>
                </div>
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              </label>

              {/* Option B: Public / Custom JSON Endpoint */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedFeed === 'public_json'
                    ? 'bg-purple-950/40 border-purple-500/80'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="feed"
                  checked={selectedFeed === 'public_json'}
                  onChange={() => onSelectFeed('public_json')}
                  className="accent-purple-500 mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-slate-100 flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Public JSON Feed / Static JSON Endpoint</span>
                  </div>
                  <div className="text-[11px] text-slate-300 leading-relaxed">
                    Polls any static JSON file or public CORS-enabled election endpoint directly via standard browser HTTP <code className="text-slate-200">fetch()</code>.
                  </div>
                </div>
              </label>

              {/* Option C: Manual Timeline Scrubbing */}
              <label
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedFeed === 'simulation'
                    ? 'bg-purple-950/40 border-purple-500/80'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="feed"
                  checked={selectedFeed === 'simulation'}
                  onChange={() => onSelectFeed('simulation')}
                  className="accent-purple-500 mt-1"
                />
                <div className="flex-1 space-y-1">
                  <div className="font-bold text-slate-100">
                    Manual Timeline Replay & 2022 Certified Archive
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Use the bottom timeline controller to manually step through pre-close (0%) and hourly election night waves.
                  </div>
                </div>
              </label>

            </div>

            {selectedFeed === 'public_json' && (
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2 mt-2">
                <label className="text-[11px] font-mono text-slate-300 font-bold block">
                  Public JSON Endpoint URL:
                </label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => onCustomUrlChange(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                  placeholder="/live-test-feed.json or https://..."
                />
              </div>
            )}
          </div>

          {/* Polling Interval Choice */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 block text-xs uppercase tracking-wider font-mono">
              2. Auto-Refresh Interval:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: '30 seconds', sec: 30, sub: 'Fast' },
                { label: '60 seconds', sec: 60, sub: 'Standard' },
                { label: '2 minutes', sec: 120, sub: 'Balanced' },
                { label: '5 minutes', sec: 300, sub: 'Relaxed' }
              ].map(opt => (
                <button
                  key={opt.sec}
                  onClick={() => onSetPollingInterval(opt.sec)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                    pollingIntervalSeconds === opt.sec
                      ? 'bg-purple-950/60 border-purple-600 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Local Snapshot Buffer Counter */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              <span>Snapshots recorded in session history:</span>
            </div>
            <span className="font-bold text-white text-xs">
              {recordedSnapshotsCount} snapshots (ready for video replay)
            </span>
          </div>

          {lastSyncStatus && (
            <div
              className={`p-3 rounded-xl font-mono flex items-start gap-2.5 border ${
                lastSyncStatus.ok
                  ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800/50 text-amber-300'
              }`}
            >
              {lastSyncStatus.ok ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
              )}
              <div className="text-[11px] leading-relaxed">{lastSyncStatus.message}</div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
