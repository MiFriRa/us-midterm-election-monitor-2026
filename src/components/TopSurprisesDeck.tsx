import React, { useState } from 'react';
import { ElectionSurprise } from '../utils/electionMath';
import { Sparkles, Flame, Users, TrendingUp, ArrowUpRight, ArrowDownRight, Award, ChevronRight } from 'lucide-react';

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

  const filteredSurprises = surprises.filter(s => {
    if (filter === 'flips') return s.isFlip;
    if (filter === 'populous') return s.houseSeats >= 8 || s.votesCounted >= 1_000_000;
    return true;
  });

  return (
    <section className="bg-[#070b14] border-b border-slate-800/90 px-4 sm:px-6 py-2.5 shrink-0 z-20">
      
      {/* Header Line: Big Clear Title + Mode Filter + Live Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        
        {/* Title with Live Pulse */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <h2 className="text-xs sm:text-sm font-black font-mono uppercase tracking-wider text-white flex items-center gap-1.5">
              <span>Top Surprises vs. 2022</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                LIVE RADAR
              </span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Biggest shifts & flips as votes report from key citizen centers
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
            All Shifts ({surprises.length})
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
            <span>High Population</span>
          </button>
        </div>

      </div>

      {/* Surprises Cards Grid: Prominent, High-Contrast Bauhaus Visual Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {filteredSurprises.length === 0 ? (
          <div className="col-span-full py-4 text-center text-xs text-slate-500 font-mono bg-slate-900/50 rounded-xl border border-slate-800">
            No states currently matching this surprise filter.
          </div>
        ) : (
          filteredSurprises.map((item) => {
            const isSelected = selectedStateId === item.stateCode;
            const isDemSwing = item.swingValue > 0;
            const isGopSwing = item.swingValue < 0;

            return (
              <button
                key={item.stateCode}
                onClick={() => onSelectState(item.stateCode)}
                className={`group relative text-left p-2.5 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer ${
                  isSelected
                    ? 'bg-[#181b2a] border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                    : 'bg-[#0b101c] border-slate-800 hover:border-slate-700 hover:bg-[#0f1526]'
                }`}
                title={`Click to inspect ${item.stateName} details`}
              >
                {/* Top Badge: Rank + State Code + Flip Flag */}
                <div className="flex items-center justify-between gap-1 w-full mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded flex items-center justify-center font-mono font-black text-xs bg-slate-800 text-amber-300 border border-slate-700 group-hover:bg-amber-400 group-hover:text-black transition-colors">
                      #{item.rank}
                    </span>
                    <span className="font-mono font-black text-sm text-white tracking-wider">
                      {item.stateCode}
                    </span>
                  </div>

                  {item.isFlip ? (
                    <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 text-emerald-400" />
                      FLIP
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold text-slate-400">
                      {item.houseSeats} Seats
                    </span>
                  )}
                </div>

                {/* Middle: Big Bold Swing Metric */}
                <div className="my-1">
                  <div className="flex items-baseline justify-between gap-1">
                    <span
                      className={`text-base sm:text-lg font-black font-mono tracking-tight ${
                        isDemSwing
                          ? 'text-blue-400 group-hover:text-blue-300'
                          : isGopSwing
                          ? 'text-red-400 group-hover:text-red-300'
                          : 'text-slate-300'
                      }`}
                    >
                      {item.swingLabel}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                      {item.stateName}
                    </span>
                  </div>

                  {/* 2022 vs 2026 Comparison Track */}
                  <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-0.5">
                    <span className="truncate">
                      '22: {item.margin2022 >= 0 ? `D+${item.margin2022}` : `R+${Math.abs(item.margin2022)}`}
                    </span>
                    <span className="text-slate-600 font-bold">➔</span>
                    <span className="font-bold text-slate-200">
                      '26: {item.margin2026 >= 0 ? `D+${item.margin2026}` : `R+${Math.abs(item.margin2026)}`}
                    </span>
                  </div>
                </div>

                {/* Bottom: Progress Bar + Citizen Votes Counted */}
                <div className="mt-1 pt-1 border-t border-slate-800/80 w-full space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="text-slate-300 font-semibold">{item.reportingPct}% in</span>
                    <span>{item.votesCounted > 0 ? item.votesCountedLabel : 'Pre-close'}</span>
                  </div>
                  
                  {/* Mini reporting progress line */}
                  <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${item.reportingPct}%` }}
                    />
                  </div>
                </div>

                {/* Active Indicator Line on top of card */}
                {isSelected && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-amber-400" />
                )}
              </button>
            );
          })
        )}
      </div>

    </section>
  );
};
