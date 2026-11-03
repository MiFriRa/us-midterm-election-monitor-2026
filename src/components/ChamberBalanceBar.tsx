import React from 'react';
import { Clock } from 'lucide-react';

export type ChamberType = 'senate' | 'house' | 'governor';
export type MapDisplayMode = 'purple_margin' | 'swing_shift' | 'historical_2022' | 'political_impact';

interface ChamberBalanceBarProps {
  chamber: ChamberType;
  onChamberChange: (c: ChamberType) => void;
  mapMode: MapDisplayMode;
  onMapModeChange: (m: MapDisplayMode) => void;
  tally: {
    demSeats: number;
    gopSeats: number;
    uncalledSeats: number;
    majorityThreshold: number;
    flipsToDem: number;
    flipsToGop: number;
    statusText: string;
  };
  nationalReportingPct: number;
}

export const ChamberBalanceBar: React.FC<ChamberBalanceBarProps> = ({
  chamber,
  onChamberChange,
  mapMode,
  onMapModeChange,
  tally,
  nationalReportingPct
}) => {
  const total = tally.demSeats + tally.gopSeats + tally.uncalledSeats;
  const demWidth = (tally.demSeats / total) * 100;
  const gopWidth = (tally.gopSeats / total) * 100;
  const thresholdPct = (tally.majorityThreshold / total) * 100;

  const calledSeats = tally.demSeats + tally.gopSeats;

  return (
    <section className="bg-[#080b12] border-b border-slate-800/80 px-4 sm:px-6 py-2 shrink-0 z-20 space-y-2">
      
      {/* Row 1: Chamber Switcher | Counting Progress | Map Layer */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left: Chamber Segmented Control */}
        <div className="flex items-center p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
          <button
            onClick={() => onChamberChange('senate')}
            className={`px-3 py-1 font-mono text-xs rounded transition-all whitespace-nowrap ${
              chamber === 'senate'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            U.S. Senate (100)
          </button>
          <button
            onClick={() => onChamberChange('house')}
            className={`px-3 py-1 font-mono text-xs rounded transition-all whitespace-nowrap ${
              chamber === 'house'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            House (435)
          </button>
          <button
            onClick={() => onChamberChange('governor')}
            className={`px-3 py-1 font-mono text-xs rounded transition-all whitespace-nowrap ${
              chamber === 'governor'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Governors (50)
          </button>
        </div>

        {/* Center: COUNTING PROGRESS */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-3.5 py-1 rounded-lg border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400 uppercase tracking-wider text-[11px] font-bold">
              {nationalReportingPct > 0 ? 'Counting Progress:' : 'Polls Status:'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-24 sm:w-36 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
                style={{ width: `${nationalReportingPct}%` }}
              />
            </div>
            <span className="font-extrabold text-white text-xs">
              {nationalReportingPct}%
            </span>
          </div>

          <span className="text-slate-600">·</span>
          <span className="text-slate-300 text-[11px] hidden sm:inline">
            {nationalReportingPct > 0
              ? `${calledSeats}/${total} called (${tally.uncalledSeats} pending)`
              : `Awaiting first poll closures (00:00 CET / 18:00 EST)`}
          </span>
        </div>

        {/* Right: Map Layer Switcher */}
        <div className="flex items-center gap-1.5 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => onMapModeChange('purple_margin')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all whitespace-nowrap ${
              mapMode === 'purple_margin' || mapMode === 'political_impact'
                ? 'bg-purple-900/60 text-purple-200 border border-purple-600/80 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Purple color gradient reflects margin closeness and tipping weight"
          >
            Purple Spectrum
          </button>
          <button
            onClick={() => onMapModeChange('swing_shift')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all whitespace-nowrap ${
              mapMode === 'swing_shift'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Color reflects shift compared to 2022 midterm certified baseline"
          >
            Swing vs. 2022
          </button>
          <button
            onClick={() => onMapModeChange('historical_2022')}
            className={`px-2.5 py-1 text-[11px] font-mono rounded transition-all whitespace-nowrap ${
              mapMode === 'historical_2022'
                ? 'bg-slate-800 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Certified historical 2022 results baseline"
          >
            2022 Baseline
          </button>
        </div>

      </div>

      {/* Row 2: Majority Balance Gauge */}
      <div className="flex items-center gap-3">
        
        {/* Dem Tally */}
        <div className="flex items-baseline gap-1.5 shrink-0 font-mono">
          <span className="text-lg sm:text-xl font-black text-blue-400">{tally.demSeats}</span>
          <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">DEM</span>
          {tally.flipsToDem > 0 && (
            <span className="text-[10px] text-emerald-400 font-mono font-bold">+{tally.flipsToDem} flip</span>
          )}
        </div>

        {/* Majority Bar */}
        <div className="relative flex-1 h-3.5 bg-slate-900 rounded-sm overflow-hidden flex border border-slate-800">
          {/* Democratic segment */}
          <div
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${demWidth}%` }}
          />
          {/* Contested / Uncalled middle */}
          <div
            className="h-full bg-gradient-to-r from-blue-900/60 via-purple-800/60 to-red-900/60 transition-all duration-500"
            style={{ width: `${Math.max(0, 100 - demWidth - gopWidth)}%` }}
          />
          {/* Republican segment */}
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${gopWidth}%` }}
          />

          {/* Threshold Marker */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_8px_rgba(255,255,255,1)]"
            style={{ left: `${thresholdPct}%` }}
            title={`Threshold: ${tally.majorityThreshold}`}
          />
        </div>

        {/* GOP Tally */}
        <div className="flex items-baseline gap-1.5 shrink-0 font-mono text-right">
          {tally.flipsToGop > 0 && (
            <span className="text-[10px] text-red-400 font-mono font-bold">+{tally.flipsToGop} flip</span>
          )}
          <span className="text-[10px] text-slate-400 font-bold uppercase hidden sm:inline">GOP</span>
          <span className="text-lg sm:text-xl font-black text-red-400">{tally.gopSeats}</span>
        </div>

        {/* Majority Target & Status Label */}
        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-slate-300 bg-slate-900 px-2.5 py-0.5 rounded border border-slate-800 shrink-0">
          <span className="font-bold text-white">{tally.majorityThreshold}</span>
          <span className="text-slate-400">TO WIN</span>
          <span className="text-slate-600">·</span>
          <span className={tally.gopSeats >= tally.majorityThreshold ? 'text-red-400 font-bold' : tally.demSeats >= tally.majorityThreshold ? 'text-blue-400 font-bold' : 'text-purple-300 font-semibold'}>
            {tally.statusText}
          </span>
        </div>

      </div>

    </section>
  );
};
