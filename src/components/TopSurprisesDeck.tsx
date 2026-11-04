import React from 'react';
import { ElectionSurprise } from '../utils/electionMath';
import { Clock } from 'lucide-react';

interface TopSurprisesDeckProps {
  surprises: ElectionSurprise[];
  selectedStateId: string | null;
  onSelectState: (stateId: string) => void;
  nationalReportingPct: number;
}

export const TopSurprisesDeck: React.FC<TopSurprisesDeckProps> = ({
  surprises,
  selectedStateId,
  onSelectState,
  nationalReportingPct
}) => {
  const isCounting = nationalReportingPct > 0;

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-[#090d14] border-l border-slate-800/80 flex flex-col h-full shrink-0 overflow-hidden z-20">
      
      {/* Sidebar Header — Quiet, Monochrome Editorial */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-[#0b1019] flex items-center justify-between shrink-0">
        <h2 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-300">
          2. Biggest Surprises vs. 2022
        </h2>
        {isCounting && surprises.length > 0 && (
          <span className="text-[11px] font-mono font-semibold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
            Top {surprises.length}
          </span>
        )}
      </div>

      {/* Body: Minimal Empty State (no duplicate 0% text!) or Clean Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {!isCounting || surprises.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#0c111b] border border-slate-800/60 rounded-xl space-y-2.5">
            <div className="w-10 h-10 rounded-full bg-slate-800/60 border border-slate-700/60 flex items-center justify-center text-slate-400">
              <Clock className="w-5 h-5" />
            </div>
            <div className="text-sm font-bold text-slate-200 font-mono">
              Awaiting First Returns
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[230px]">
              Major swings and flips relative to 2022 will rank here automatically as states report.
            </p>
          </div>
        ) : (
          surprises.map((item) => {
            const isSelected = selectedStateId === item.stateCode;
            const isDemSwing = item.swingValue > 0;
            const isPreliminary = item.reportingPct < 100;

            // Convert margins (Dem% - GOP%) into two-party 0–100% balance shares for direct visual comparison
            const demShare2022 = Math.max(8, Math.min(92, Number((50 + item.margin2022 / 2).toFixed(1))));
            const gopShare2022 = Number((100 - demShare2022).toFixed(1));

            const demShare2026 = Math.max(8, Math.min(92, Number((50 + item.margin2026 / 2).toFixed(1))));
            const gopShare2026 = Number((100 - demShare2026).toFixed(1));

            return (
              <button
                key={item.stateCode}
                onClick={() => onSelectState(item.stateCode)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2.5 ${
                  isSelected
                    ? 'bg-[#161f30] border-white ring-1 ring-white/50 shadow-lg'
                    : 'bg-[#0e1420] border-slate-800 hover:border-slate-600 hover:bg-[#121928]'
                }`}
              >
                {/* Row 1: Rank + State Name + Preliminary / Flip Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-xs bg-slate-800 text-slate-200 border border-slate-700 shrink-0">
                      #{item.rank}
                    </span>
                    <span className="font-bold text-base text-white truncate">
                      {item.stateName}
                    </span>
                    <span className="font-mono text-xs font-semibold text-slate-400">
                      ({item.stateCode})
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                    {isPreliminary ? `Prelim · ${item.reportingPct}%` : 'Final · 100%'}
                  </span>
                </div>

                {/* Row 2: Direct Visual Balance Comparison (2022 Desaturated vs 2026 Vivid, Same Size) */}
                <div className="space-y-1.5 pt-0.5">
                  {/* 2022 Baseline Balance (Less Saturated, Identical Dimensions) */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 text-[11px] font-mono font-semibold text-slate-400 shrink-0">
                      2022
                    </span>
                    <div className="relative flex-1 h-3.5 rounded-sm overflow-hidden flex bg-slate-900 border border-slate-800/90">
                      <div
                        className="h-full bg-blue-500/40 transition-all duration-500"
                        style={{ width: `${demShare2022}%` }}
                      />
                      <div
                        className="h-full bg-red-500/40 transition-all duration-500"
                        style={{ width: `${gopShare2022}%` }}
                      />
                      {/* 50/50 Center Line */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-slate-300/60 z-10" />
                    </div>
                  </div>

                  {/* 2026 Current Balance (Full Saturation, Identical Dimensions) */}
                  <div className="flex items-center gap-2.5">
                    <span className="w-10 text-[11px] font-mono font-bold text-white shrink-0">
                      {isPreliminary ? '2026*' : '2026'}
                    </span>
                    <div
                      className={`relative flex-1 h-3.5 rounded-sm overflow-hidden flex bg-slate-900 ${
                        isPreliminary ? 'border border-dashed border-slate-500/80' : 'border border-slate-700'
                      }`}
                    >
                      <div
                        className="h-full bg-blue-500 transition-all duration-500"
                        style={{ width: `${demShare2026}%` }}
                      />
                      <div
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${gopShare2026}%` }}
                      />
                      {/* 2022 Reference Tick on 2026 Bar */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-slate-950/80 z-10"
                        style={{ left: `${demShare2022}%` }}
                      />
                      {/* 50/50 Center Line */}
                      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-white z-20" />
                    </div>
                  </div>
                </div>

                {/* Row 3: Minimal Party Anchors & Single Swing / Flip Indicator */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
                  <span className="text-blue-400 font-semibold pl-12">DEM</span>

                  <div className="flex items-center gap-1.5">
                    <span className={isDemSwing ? 'text-blue-400 font-bold' : 'text-red-400 font-bold'}>
                      Swing {item.swingLabel}
                    </span>
                    {item.isFlip && (
                      <span
                        className={`text-[10px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                          item.flippedTo === 'DEM'
                            ? 'bg-blue-950/80 text-blue-300 border-blue-700'
                            : 'bg-red-950/80 text-red-300 border-red-700'
                        }`}
                      >
                        FLIP
                      </span>
                    )}
                  </div>

                  <span className="text-red-400 font-semibold">GOP</span>
                </div>
              </button>
            );
          })
        )}
      </div>

      {isCounting && surprises.length > 0 && nationalReportingPct < 100 && (
        <div className="px-4 py-2 border-t border-slate-800/80 bg-[#0b1019] text-[10px] font-mono text-slate-400 shrink-0">
          * 2026 balance is preliminary while precincts report
        </div>
      )}

    </aside>
  );
};
