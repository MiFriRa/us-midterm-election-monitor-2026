import React, { useState } from 'react';
import { X, RefreshCw, CheckCircle, Database, PlayCircle } from 'lucide-react';
import { StateElectionResult, calculateSwing } from '../utils/electionMath';

interface ApiInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  statesData: Record<string, StateElectionResult>;
}

export const ApiInspectorModal: React.FC<ApiInspectorModalProps> = ({
  isOpen,
  onClose,
  statesData
}) => {
  const [selectedState, setSelectedState] = useState<string>('PA');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('PA-07');
  const [apiUrl, setApiUrl] = useState<string>('https://civicapi.org/api/v2/race/87528');
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    status: 'success' | 'error';
    latencyMs: number;
    timestamp: string;
    payload: any;
  } | null>(null);

  const [batchResults, setBatchResults] = useState<{
    totalStates: number;
    testedCount: number;
    avgSwing: number;
    flipsDetected: number;
  } | null>(null);

  if (!isOpen) return null;

  const currentState = statesData[selectedState];

  const handleTestEndpoint = async () => {
    setIsTesting(true);
    const startMs = performance.now();
    try {
      const response = await fetch(apiUrl, { headers: { Accept: 'application/json' }, cache: 'no-store' });
      const latencyMs = Math.round(performance.now() - startMs);
      const data = await response.json();
      const stateKey = selectedState.toLowerCase();
      const stateLive = data?.region_results?.[stateKey] || null;

      setTestResult({
        status: response.ok ? 'success' : 'error',
        latencyMs,
        timestamp: new Date().toLocaleTimeString('en-GB'),
        payload: stateLive
          ? {
              election_name: data.election_name,
              national_percent_reporting: data.percent_reporting,
              last_updated: data.last_updated,
              state: selectedState,
              state_result: stateLive
            }
          : data
      });
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startMs);
      setTestResult({
        status: 'error',
        latencyMs,
        timestamp: new Date().toLocaleTimeString('en-GB'),
        payload: { error: err?.message || 'Failed to fetch endpoint' }
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleRunBatchBacktest = () => {
    let totalSwing = 0;
    let count = 0;
    let flips = 0;

    Object.values(statesData).forEach(st => {
      if (st.senate) {
        const s = calculateSwing(
          st.senate.demCandidate.pct,
          st.senate.gopCandidate.pct,
          st.senate.historical2022.demPct,
          st.senate.historical2022.gopPct
        );
        totalSwing += Math.abs(s.swingValue);
        count++;
        if (st.senate.status === 'called_dem' && st.senate.historical2022.winner === 'gop') flips++;
        if (st.senate.status === 'called_gop' && st.senate.historical2022.winner === 'dem') flips++;
      }
    });

    setBatchResults({
      totalStates: Object.keys(statesData).length,
      testedCount: count,
      avgSwing: Number((totalSwing / count).toFixed(2)),
      flipsDetected: flips
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-950 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Live API Endpoint & 2022 Baseline Inspector
              </h2>
              <div className="text-xs text-slate-400 font-mono">
                Inspect live civicAPI v2 JSON payloads & 2022 swing baselines
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Section 1: Live Endpoint Config */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white uppercase tracking-wider font-mono text-[11px]">
                1. Live civicAPI v2 Endpoint Inspector
              </span>
              <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Feed Active
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="text"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                placeholder="https://civicapi.org/api/v2/race/87528"
              />
              <button
                onClick={handleTestEndpoint}
                disabled={isTesting}
                className="w-full sm:w-auto px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>Fetch Live JSON</span>
              </button>
            </div>

            {testResult && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle className="w-3.5 h-3.5" /> {testResult.status === 'success' ? '200 OK · Live Payload' : 'Request Failed'}
                  </span>
                  <span>Latency: {testResult.latencyMs}ms · Checked at {testResult.timestamp}</span>
                </div>
                <div className="max-h-36 overflow-y-auto p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
                  <pre className="text-[10px]">{JSON.stringify(testResult.payload, null, 2)}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Specific State & District Backtester */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <span className="font-semibold text-white uppercase tracking-wider font-mono text-[11px] block">
              2. State & District Backtesting Inspector
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Select State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                >
                  {Object.values(statesData).map(st => (
                    <option key={st.id} value={st.id}>
                      {st.stateName} ({st.id})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1 font-mono">Congressional District</label>
                <input
                  type="text"
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                  placeholder="e.g. PA-07 or CA-13"
                />
              </div>
            </div>

            {currentState && (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-mono text-xs">
                  <span className="font-bold text-white">{currentState.stateName} Baseline Analysis</span>
                  <span className="text-purple-400">{currentState.houseSeats} House Seats</span>
                </div>

                {currentState.senate ? (
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono pt-1 border-t border-slate-800">
                    <div>
                      <div className="text-slate-500">2022 Margin</div>
                      <div className="font-semibold text-slate-300">
                        {currentState.senate.historical2022.margin > 0 ? `D +${currentState.senate.historical2022.margin}` : `R +${Math.abs(currentState.senate.historical2022.margin)}`}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">2026 Live</div>
                      <div className="font-semibold text-slate-300">
                        {currentState.senate.demCandidate.pct}% D - {currentState.senate.gopCandidate.pct}% R
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">Calculated Swing</div>
                      <div className="font-semibold text-blue-400">
                        {calculateSwing(
                          currentState.senate.demCandidate.pct,
                          currentState.senate.gopCandidate.pct,
                          currentState.senate.historical2022.demPct,
                          currentState.senate.historical2022.gopPct
                        ).label}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500 text-[11px] italic">
                    No Senate contest in 2026. House representation active.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section 3: National 50-State Ground Truth Sanity Check */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white uppercase tracking-wider font-mono text-[11px]">
                3. Full 50-State Ground Truth Backtest
              </span>
              <button
                onClick={handleRunBatchBacktest}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PlayCircle className="w-3.5 h-3.5 text-purple-400" />
                <span>Execute Sanity Pass</span>
              </button>
            </div>

            {batchResults && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-center font-mono">
                  <div className="text-slate-500 text-[10px]">States Checked</div>
                  <div className="text-sm font-bold text-white">{batchResults.totalStates} / 50+DC</div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-center font-mono">
                  <div className="text-slate-500 text-[10px]">Races Analyzed</div>
                  <div className="text-sm font-bold text-white">{batchResults.testedCount}</div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-center font-mono">
                  <div className="text-slate-500 text-[10px]">Avg Abs Swing</div>
                  <div className="text-sm font-bold text-purple-400">±{batchResults.avgSwing} pp</div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-center font-mono">
                  <div className="text-slate-500 text-[10px]">Projected Flips</div>
                  <div className="text-sm font-bold text-emerald-400">{batchResults.flipsDetected}</div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Ground Truth: 2022 Midterm Certified Results Archive + civicAPI v2 Live
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
