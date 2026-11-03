import React, { useState } from 'react';
import { ElectionSurprise } from '../utils/electionMath';
import { Sparkles, Flame, Users, Clock } from 'lucide-react';

interface TopSurprisesDeckProps {
  surprises: ElectionSurprise[];
  selectedStateId: string | null;
  onSelectState: (stateId: string) => void;
  nationalReportingPct: number;
}

export type SurpriseFilter = 'all' | 'flips' | 'populous';

export const TopSurprisesDeck: React.FC<TopSurprisesDeckProps> = ({
  surprises,
  selectedStateId,
  onSelectState,
  nationalReportingPct
}) => {
  const [filter, setFilter] = useState<SurpriseFilter>('all');
  const isCounting = nationalReportingPct > 0;

  const filteredSurprises = surprises.filter(s => {
    if (filter === 'flips') return s.isFlip;
    if (filter === 'populous') return s.houseSeats >= 8 || s.votesCounted >= 1_000_000;
    return true;
  });

  return (
    <section className="bg-gradient-to-b from-[#0b101d] to-[#070b14] border-b border-amber-500/25 px-4 sm:px-6 py-2.5 shrink-0 z-20 shadow-lg">
      
      {/* Header Line: Prominent Title + Mode Filter + Honest Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        
        {/* Title with Status Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-400">
            {isCounting ? (
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
          </div>
          <div className="flex items-baseline gap-2.5">
            <h2 className="text-xs sm:text-sm font-black font-mono uppercase tracking-wider text-white flex items-center gap-2">
              <span>Top Surprises vs. 2022</span>
              {isCounting ? (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  COUNTING ACTIVE ({nationalReportingPct}% IN)
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  PRE-CLOSE WATCHLIST · POLLS OPEN
                </span>
              )}
            </h2>
            <span className="text-[11px] text-slate-300 font-mono hidden lg:inline">
              {isCounting
                ? 'Largest swings & flips weighted by citizen volume — click any state to inspect'
                : 'Key populous battlegrounds to watch as polls close from 00:00 CET (18:00 EST)'}
            </span>
          </div>
        </div>

        {/* Filter Pills: All / Flips / Populous */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilter('all')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all ${
              filter === 'all'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Top {surprises.length}
          </button>
          <button
            onClick={() => setFilter('flips')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
              filter === 'flips'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3 h-3 text-emerald-400" />
            <span>Flips Only</span>
          </button>
          <button
            onClick={() => setFilter('populous')}
            className={`px-2.5 py-0.5 rounded text-[11px] font-semibold transition-all flex items-center gap-1 ${
              filter === 'populous'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3 h-3 text-purple-400" />
            <span>High Population (8+ Seats)</span>
          </button>
        </div>

      </div>

      {/* Surprises Cards Grid: Prominent, High-Contrast Visual Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {filteredSurprises.length === 0 ? (
          <div className="col-span-full py-3 text-center text-xs text-slate-400 font-mono bg-slate-900/50 rounded-xl border border-slate-800">
            {isCounting
              ? 'No states currently matching this filter at this hour.'
              : 'No flips yet — polls are still open. Switch to "Top 6" or "High Population" or advance timeline to see incoming returns.'}
          </div>
        ) : (
          filteredSurprises.map((item) => {
            const isSelected = selectedStateId === item.stateCode;
            const isDemSwing = item.reportingPct > 0 && item.swingValue > 0;
            const isGopSwing = item.reportingPct > 0 && item.swingValue < 0;

            return (
              <button
                key={item.stateCode}
                onClick={() => onSelectState(item.stateCode)}
                className={`group relative text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a1f35] border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                    : item.isFlip
                    ? 'bg-[#0d1922] border-emerald-500/50 hover:border-emerald-400 hover:bg-[#11222e]'
                    : 'bg-[#0e1424] border-slate-700/80 hover:border-amber-500/60 hover:bg-[#131b30]'
                }`}
                title={`Click to inspect ${item.stateName} details`}
              >
                {/* Top Badge: Rank + State Name + Flip/Population Flag */}
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-black text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                      #{item.rank}
                    </span>
                    <span className="font-mono font-black text-sm text-white tracking-wider shrink-0">
                      {item.stateCode}
                    </span>
                    <span className="text-[11px] font-sans font-semibold text-slate-300 truncate">
                      {item.stateName}
                    </span>
                  </div>

                  {item.isFlip ? (
                    <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 flex items-center gap-0.5 shrink-0">
                      <Flame className="w-2.5 h-2.5 text-emerald-400" />
                      FLIP
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold text-purple-300 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-800/60 shrink-0">
                      {item.houseSeats} Seats
                    </span>
                  )}
                </div>

                {/* Middle: Big Bold Swing Metric */}
                <div className="my-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <span
                      className={`text-lg sm:text-xl font-black font-mono tracking-tight leading-none ${
                        isDemSwing
                          ? 'text-blue-400 group-hover:text-blue-300'
                          : isGopSwing
                          ? 'text-red-400 group-hover:text-red-300'
                          : 'text-amber-300'
                      }`}
                    >
                      {item.swingLabel}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-300 truncate">
                      {item.significance}
                    </span>
                  </div>

                  {/* 2022 vs 2026 Comparison Track */}
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1">
                    <span className="truncate">
                      2022: <strong className={item.margin2022 >= 0 ? 'text-blue-300' : 'text-red-300'}>
                        {item.margin2022 >= 0 ? `D+${item.margin2022}` : `R+${Math.abs(item.margin2022)}`}
                      </strong>
                    </span>
                    <span className="text-slate-500 font-bold">➔</span>
                    <span className="font-bold text-slate-200">
                      {item.reportingPct > 0 ? (
                        <>
                          2026: <strong className={item.margin2026 >= 0 ? 'text-blue-400' : 'text-red-400'}>
                            {item.margin2026 >= 0 ? `D+${item.margin2026}` : `R+${Math.abs(item.margin2026)}`}
                          </strong>
                        </>
                      ) : (
                        <span className="text-slate-400">2026: Awaiting</span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Bottom: Progress Bar + Citizen Votes Counted */}
                <div className="mt-1 pt-1 border-t border-slate-800/90 w-full space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className={item.reportingPct > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                      {item.reportingPct}% counted
                    </span>
                    <span className="text-slate-300 font-semibold">
                      {item.votesCounted > 0 ? `${item.votesCountedLabel} votes` : `${item.houseSeats} House districts`}
                    </span>
                  </div>
                  
                  {/* Mini reporting progress line */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.isFlip
                          ? 'bg-gradient-to-r from-emerald-500 to-amber-400'
                          : 'bg-gradient-to-r from-purple-500 to-amber-400'
                      }`}
                      style={{ width: `${item.reportingPct}%` }}
                    />
                  </div>
                </div>

                {/* Active Indicator Line on top of card */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
                )}
              </button>
            );
          })
        )}
      </div>

    </section>
  );
};
