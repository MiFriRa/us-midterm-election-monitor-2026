import React from 'react';
import { Clock, CheckCircle2 } from 'lucide-react';

export type ChamberType = 'senate' | 'house' | 'governor';
export type MapDisplayMode = 'purple_margin' | 'swing_shift' | 'historical_2022' | 'political_impact';

export interface ChamberTallySummary {
  demSeats: number;
  gopSeats: number;
  uncalledSeats: number;
  majorityThreshold: number;
  flipsToDem: number;
  flipsToGop: number;
  statusText: string;
}

interface ChamberBalanceBarProps {
  chamber: ChamberType;
  onChamberChange: (c: ChamberType) => void;
  mapMode: MapDisplayMode;
  onMapModeChange: (m: MapDisplayMode) => void;
  senateTally: ChamberTallySummary;
  houseTally: ChamberTallySummary;
  governorTally: ChamberTallySummary;
  nationalReportingPct: number;
}

export const ChamberBalanceBar: React.FC<ChamberBalanceBarProps> = ({
  chamber,
  onChamberChange,
  senateTally,
  houseTally,
  governorTally,
  nationalReportingPct
}) => {
  const isCounting = nationalReportingPct > 0;

  const chambers: Array<{
    id: ChamberType;
    title: string;
    totalSeats: number;
    tally: ChamberTallySummary;
  }> = [
    { id: 'senate', title: 'U.S. SENATE', totalSeats: 100, tally: senateTally },
    { id: 'house', title: 'U.S. HOUSE', totalSeats: 435, tally: houseTally },
    { id: 'governor', title: 'GOVERNORS', totalSeats: 50, tally: governorTally }
  ];

  return (
    <section className="bg-[#090d16] border-b border-slate-800 px-4 sm:px-6 py-3 shrink-0 z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* 1) STATUS PÅ OPTÆLLING (3 cols on desktop) */}
        <div className="lg:col-span-3 bg-[#0f1626] border border-slate-800 rounded-xl px-4 py-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              1. Counting Status
            </span>
            {isCounting ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                LIVE COUNT
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400">
                <Clock className="w-4 h-4" />
                POLLS OPEN
              </span>
            )}
          </div>

          <div className="my-1 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {nationalReportingPct}%
            </span>
            <span className="text-xs font-mono text-slate-300 font-semibold">
              {isCounting ? 'Votes Counted' : 'Closes 00:00 CET'}
            </span>
          </div>

          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500"
              style={{ width: `${nationalReportingPct}%` }}
            />
          </div>
        </div>

        {/* 3) FORDELING AF PLADSER I DE TRE VALG: SENATE, HOUSE, GOVERNORS (9 cols on desktop) */}
        <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {chambers.map((item) => {
            const isSelected = chamber === item.id;
            const { demSeats, gopSeats, uncalledSeats, majorityThreshold } = item.tally;
            const demWidth = (demSeats / item.totalSeats) * 100;
            const gopWidth = (gopSeats / item.totalSeats) * 100;
            const thresholdPct = (majorityThreshold / item.totalSeats) * 100;

            return (
              <button
                key={item.id}
                onClick={() => onChamberChange(item.id)}
                className={`text-left rounded-xl px-4 py-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#131c31] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/60'
                    : 'bg-[#0f1626] border-slate-800/90 hover:border-slate-700 hover:bg-[#121a2d]'
                }`}
              >
                {/* Header: Chamber Name & Majority Target */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono font-extrabold tracking-wider text-white flex items-center gap-1.5">
                    <span>{item.title}</span>
                    {isSelected && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-purple-600 text-white rounded font-bold">
                        MAP
                      </span>
                    )}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    <strong className="text-slate-200">{majorityThreshold}</strong> to win
                  </span>
                </div>

                {/* Big Numbers: DEM vs GOP */}
                <div className="flex items-baseline justify-between my-1 font-mono">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-blue-400 leading-none">
                      {demSeats}
                    </span>
                    <span className="text-xs font-bold text-blue-300/80">DEM</span>
                  </div>

                  {uncalledSeats > 0 && (
                    <span className="text-xs font-mono text-slate-400">
                      {uncalledSeats} left
                    </span>
                  )}

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs font-bold text-red-300/80">GOP</span>
                    <span className="text-2xl sm:text-3xl font-black text-red-400 leading-none">
                      {gopSeats}
                    </span>
                  </div>
                </div>

                {/* Majority Bar */}
                <div className="relative w-full h-3 bg-slate-900 rounded-md overflow-hidden flex border border-slate-800">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${demWidth}%` }}
                  />
                  <div
                    className="h-full bg-slate-800/80 transition-all duration-500"
                    style={{ width: `${Math.max(0, 100 - demWidth - gopWidth)}%` }}
                  />
                  <div
                    className="h-full bg-red-500 transition-all duration-500"
                    style={{ width: `${gopWidth}%` }}
                  />
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10 shadow-[0_0_6px_#fff]"
                    style={{ left: `${thresholdPct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
