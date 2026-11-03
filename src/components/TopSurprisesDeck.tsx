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

            return (
              <button
                key={item.stateCode}
                onClick={() => onSelectState(item.stateCode)}
                className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-[#161f30] border-white ring-1 ring-white/50 shadow-lg'
                    : 'bg-[#0e1420] border-slate-800 hover:border-slate-600 hover:bg-[#121928]'
                }`}
              >
                {/* Row 1: Rank + State Name + Flip / Reporting Badge */}
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

                  {item.isFlip ? (
                    <span
                      className={`text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded border shrink-0 ${
                        item.flippedTo === 'DEM'
                          ? 'bg-blue-950/80 text-blue-300 border-blue-700'
                          : 'bg-red-950/80 text-red-300 border-red-700'
                      }`}
                    >
                      FLIP TO {item.flippedTo}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      {item.reportingPct}% in
                    </span>
                  )}
                </div>

                {/* Row 2: Huge Readable Swing vs 2022 (Pure Blue or Pure Red) */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500">
                      Swing vs. 2022
                    </div>
                    <div
                      className={`text-2xl font-black font-mono leading-tight ${
                        isDemSwing ? 'text-blue-400' : 'text-red-400'
                      }`}
                    >
                      {item.swingLabel}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-xs text-slate-400">
                      2022:{' '}
                      <strong className={item.margin2022 >= 0 ? 'text-blue-300' : 'text-red-300'}>
                        {item.margin2022 >= 0 ? `D+${item.margin2022}` : `R+${Math.abs(item.margin2022)}`}
                      </strong>
                    </div>
                    <div className="text-sm font-bold text-white mt-0.5">
                      2026:{' '}
                      <strong className={item.margin2026 >= 0 ? 'text-blue-400' : 'text-red-400'}>
                        {item.margin2026 >= 0 ? `D+${item.margin2026}` : `R+${Math.abs(item.margin2026)}`}
                      </strong>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

    </aside>
  );
};
