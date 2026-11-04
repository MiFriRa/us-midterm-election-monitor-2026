import React from 'react';

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
  currentCetLabel?: string;
}

export const ChamberBalanceBar: React.FC<ChamberBalanceBarProps> = ({
  chamber,
  onChamberChange,
  senateTally,
  houseTally,
  governorTally,
  nationalReportingPct,
  currentCetLabel
}) => {
  const isCounting = nationalReportingPct > 0 && nationalReportingPct < 100;
  const isComplete = nationalReportingPct >= 100;

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
    <section className="bg-[#090d14] border-b border-slate-800/80 px-5 py-3 shrink-0 z-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-stretch">
        
        {/* 1) SINGLE SOURCE OF TRUTH FOR COUNTING STATUS (3 cols) */}
        <div className="lg:col-span-3 bg-[#0e1420] border border-slate-800 rounded-xl px-4 py-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              1. Counting Status
            </span>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCounting ? 'bg-white animate-pulse' : isComplete ? 'bg-slate-300' : 'bg-slate-500'
                }`}
              />
              {isCounting ? 'Counting Active' : isComplete ? 'Final Projection' : 'Polls Open'}
            </span>
          </div>

          <div className="my-1 flex items-baseline justify-between">
            <span className="text-3xl font-black font-mono text-white tracking-tight">
              {nationalReportingPct}%
            </span>
            <span className="text-xs font-mono text-slate-400">
              {currentCetLabel || (isCounting ? 'Reported' : 'Closes 00:00 CET')}
            </span>
          </div>

          <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden">
            <div
              className="bg-slate-300 h-full transition-all duration-500"
              style={{ width: `${nationalReportingPct}%` }}
            />
          </div>
        </div>

        {/* 3) SEAT DISTRIBUTION IN THE THREE ELECTIONS (9 cols) */}
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
                    ? 'bg-[#141c2c] border-slate-400 ring-1 ring-slate-400/50'
                    : 'bg-[#0e1420] border-slate-800/90 hover:border-slate-700 hover:bg-[#111826]'
                }`}
              >
                {/* Header: Chamber Name & Majority Target */}
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-mono font-bold tracking-wider text-white flex items-center gap-2">
                    <span>{item.title}</span>
                    {isSelected && (
                      <span className="text-[10px] px-1.5 py-0.2 bg-slate-200 text-slate-950 rounded font-bold">
                        ACTIVE
                      </span>
                    )}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">
                    {majorityThreshold} to win
                  </span>
                </div>

                {/* Big Numbers: DEM (Blue) vs GOP (Red) */}
                <div className="flex items-baseline justify-between my-1 font-mono">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl sm:text-3xl font-black text-blue-400 leading-none">
                      {demSeats}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">DEM</span>
                  </div>

                  {uncalledSeats > 0 && (
                    <span className="text-[11px] font-mono text-slate-500">
                      {uncalledSeats} undecided
                    </span>
                  )}

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-bold text-slate-400">GOP</span>
                    <span className="text-2xl sm:text-3xl font-black text-red-400 leading-none">
                      {gopSeats}
                    </span>
                  </div>
                </div>

                {/* Majority Bar — Only Political Colors (Blue / Slate / Red) */}
                <div className="relative w-full h-2.5 bg-slate-900 rounded-sm overflow-hidden flex border border-slate-800">
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
                    className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
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
