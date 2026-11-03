import React from 'react';
import { ElectionSurprise } from '../utils/electionMath';
import { Sparkles, Flame, Clock } from 'lucide-react';

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
    <aside className="w-full lg:w-80 xl:w-96 bg-[#090d16] border-l border-slate-800 flex flex-col h-full shrink-0 overflow-hidden z-20">
      
      {/* Sidebar Header */}
      <div className="px-4 py-3 border-b border-slate-800 bg-[#0c1220] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-black font-mono uppercase tracking-wider text-white">
            2. Biggest Surprises vs. 2022
          </h2>
        </div>
        {isCounting && (
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            Top {surprises.length}
          </span>
        )}
      </div>

      {/* Body: Either Honest "No Surprises Yet" (when 0%) or Clean Large Cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {!isCounting || surprises.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-[#0d1322] border border-slate-800/80 rounded-xl space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Clock className="w-6 h-6" />
            </div>
            <div className="text-base font-bold text-white font-mono">
              Ingen overraskelser endnu
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
              Optællingen er ikke startet endnu (0% optalt). De største udsving og overraskelser i forhold til 2022 dukker automatisk op her, så snart de første valgsteder lukker kl. <strong>00:00 CET</strong>.
            </p>
            <div className="pt-2 text-[11px] font-mono text-purple-300 bg-purple-950/40 border border-purple-800/50 rounded-lg px-3 py-2">
              Tip: Klik på <strong>Play</strong> eller vælg et klokkeslæt nederst for at teste optællingen.
            </div>
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
                    ? 'bg-[#1a2238] border-amber-400 ring-1 ring-amber-400 shadow-lg'
                    : item.isFlip
                    ? 'bg-[#0f1d24] border-emerald-500/60 hover:border-emerald-400'
                    : 'bg-[#0f1626] border-slate-800 hover:border-amber-500/60'
                }`}
              >
                {/* Row 1: Rank + State Name + Flip / Seats Badge */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-md flex items-center justify-center font-mono font-black text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                      #{item.rank}
                    </span>
                    <span className="font-bold text-base text-white truncate">
                      {item.stateName}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400">
                      ({item.stateCode})
                    </span>
                  </div>

                  {item.isFlip ? (
                    <span className="text-xs font-mono font-black uppercase px-2 py-0.5 rounded bg-emerald-500/25 text-emerald-300 border border-emerald-500/60 flex items-center gap-1 shrink-0">
                      <Flame className="w-3.5 h-3.5 text-emerald-400" />
                      FLIP
                    </span>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded shrink-0">
                      {item.reportingPct}% in
                    </span>
                  )}
                </div>

                {/* Row 2: Huge Readable Swing vs 2022 */}
                <div className="flex items-baseline justify-between pt-0.5">
                  <div>
                    <div className="text-[11px] font-mono uppercase text-slate-400">
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
