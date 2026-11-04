import React, { useState, useMemo } from 'react';
import {
  calculateSenateSeatDistribution,
  calculateHouseSeatDistribution,
  VisualizedSeat,
  StateElectionResult
} from '../utils/electionMath';

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
  statesData?: Record<string, StateElectionResult>;
}

export const ChamberBalanceBar: React.FC<ChamberBalanceBarProps> = ({
  chamber,
  onChamberChange,
  senateTally,
  houseTally,
  governorTally,
  nationalReportingPct,
  currentCetLabel,
  statesData
}) => {
  const isCounting = nationalReportingPct > 0 && nationalReportingPct < 100;
  const isComplete = nationalReportingPct >= 100;

  const [hoveredSeat, setHoveredSeat] = useState<VisualizedSeat | null>(null);

  const statesList = useMemo(() => {
    return statesData ? Object.values(statesData) : [];
  }, [statesData]);

  // Compute normalized seat surprise distributions for Senate & House
  const senateDist = useMemo(() => {
    return calculateSenateSeatDistribution(statesList);
  }, [statesList]);

  const houseDist = useMemo(() => {
    return calculateHouseSeatDistribution(statesList);
  }, [statesList]);

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

            const isSurpriseChamber = item.id === 'senate' || item.id === 'house';
            const currentDist = item.id === 'senate' ? senateDist : houseDist;

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

                {/* VISUALIZATION LINE */}
                {isSurpriseChamber ? (
                  /* Option 1B + Height Seismograph Bar for Senate (100) & House (435) */
                  <div className="relative w-full h-8 bg-slate-950/90 rounded border border-slate-800/90 overflow-hidden flex items-end">
                    {item.id === 'senate' ? (
                      /* SENATE (100 SEATS, 1% per seat) */
                      <svg
                        viewBox="0 0 100 32"
                        preserveAspectRatio="none"
                        className="w-full h-full block"
                      >
                        {/* Background track */}
                        <rect x="0" y="0" width="100" height="32" fill="#090d16" />

                        {/* Undecided middle channel */}
                        <rect
                          x={currentDist.demSeats.length}
                          y="0"
                          width={Math.max(0, 100 - currentDist.demSeats.length - currentDist.gopSeats.length)}
                          height="32"
                          fill="#151d2f"
                          opacity="0.7"
                        />

                        {/* Dem Seats: sorted ASCENDING by surprise towards center */}
                        {currentDist.demSeats.map((seat, i) => {
                          const seatHeight = Math.max(6.4, seat.normalizedHeight * 32);
                          const y = 32 - seatHeight;
                          const fill = seat.isFlip
                            ? '#60a5fa' // Highlight flip in vivid sky blue
                            : seat.isHoldover
                            ? '#1e3a8a' // Muted baseline blue for holdover
                            : '#3b82f6'; // Active called Dem seat

                          return (
                            <rect
                              key={seat.id}
                              x={i}
                              y={y}
                              width={0.88}
                              height={seatHeight}
                              fill={fill}
                              className="transition-all duration-300 hover:opacity-80"
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                            >
                              <title>{`${seat.label} · Swing: ${seat.swingVs2022 > 0 ? '+' : ''}${seat.swingVs2022}% ${seat.isFlip ? '⚡ FLIP' : ''} (Height: ${Math.round(seat.normalizedHeight * 100)}%)`}</title>
                            </rect>
                          );
                        })}

                        {/* GOP Seats: sorted DESCENDING by surprise towards center */}
                        {currentDist.gopSeats.map((seat, i) => {
                          const seatHeight = Math.max(6.4, seat.normalizedHeight * 32);
                          const y = 32 - seatHeight;
                          const x = 100 - currentDist.gopSeats.length + i;
                          const fill = seat.isFlip
                            ? '#f87171' // Highlight flip in vivid coral red
                            : seat.isHoldover
                            ? '#881337' // Muted baseline red for holdover
                            : '#ef4444'; // Active called GOP seat

                          return (
                            <rect
                              key={seat.id}
                              x={x}
                              y={y}
                              width={0.88}
                              height={seatHeight}
                              fill={fill}
                              className="transition-all duration-300 hover:opacity-80"
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                            >
                              <title>{`${seat.label} · Swing: ${seat.swingVs2022 > 0 ? '+' : ''}${seat.swingVs2022}% ${seat.isFlip ? '⚡ FLIP' : ''} (Height: ${Math.round(seat.normalizedHeight * 100)}%)`}</title>
                            </rect>
                          );
                        })}

                        {/* Majority Threshold Marker (51) */}
                        <line
                          x1="51"
                          y1="0"
                          x2="51"
                          y2="32"
                          stroke="#ffffff"
                          strokeWidth="0.8"
                          strokeDasharray="1.5 1.5"
                        />
                      </svg>
                    ) : (
                      /* HOUSE (435 SEATS) */
                      <svg
                        viewBox="0 0 435 32"
                        preserveAspectRatio="none"
                        className="w-full h-full block"
                      >
                        {/* Background track */}
                        <rect x="0" y="0" width="435" height="32" fill="#090d16" />

                        {/* Undecided middle channel */}
                        <rect
                          x={currentDist.demSeats.length}
                          y="0"
                          width={Math.max(0, 435 - currentDist.demSeats.length - currentDist.gopSeats.length)}
                          height="32"
                          fill="#151d2f"
                          opacity="0.7"
                        />

                        {/* Dem Seats: sorted ASCENDING by surprise towards center */}
                        {currentDist.demSeats.map((seat, i) => {
                          const seatHeight = Math.max(6.4, seat.normalizedHeight * 32);
                          const y = 32 - seatHeight;
                          const fill = seat.isFlip ? '#60a5fa' : '#3b82f6';

                          return (
                            <rect
                              key={seat.id}
                              x={i}
                              y={y}
                              width={1.0}
                              height={seatHeight}
                              fill={fill}
                              className="transition-all duration-300 hover:opacity-80"
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                            >
                              <title>{`${seat.label} · Swing: ${seat.swingVs2022 > 0 ? '+' : ''}${seat.swingVs2022}% ${seat.isFlip ? '⚡ FLIP' : ''} (Height: ${Math.round(seat.normalizedHeight * 100)}%)`}</title>
                            </rect>
                          );
                        })}

                        {/* GOP Seats: sorted DESCENDING by surprise towards center */}
                        {currentDist.gopSeats.map((seat, i) => {
                          const seatHeight = Math.max(6.4, seat.normalizedHeight * 32);
                          const y = 32 - seatHeight;
                          const x = 435 - currentDist.gopSeats.length + i;
                          const fill = seat.isFlip ? '#f87171' : '#ef4444';

                          return (
                            <rect
                              key={seat.id}
                              x={x}
                              y={y}
                              width={1.0}
                              height={seatHeight}
                              fill={fill}
                              className="transition-all duration-300 hover:opacity-80"
                              onMouseEnter={() => setHoveredSeat(seat)}
                              onMouseLeave={() => setHoveredSeat(null)}
                            >
                              <title>{`${seat.label} · Swing: ${seat.swingVs2022 > 0 ? '+' : ''}${seat.swingVs2022}% ${seat.isFlip ? '⚡ FLIP' : ''} (Height: ${Math.round(seat.normalizedHeight * 100)}%)`}</title>
                            </rect>
                          );
                        })}

                        {/* Majority Threshold Marker (218) */}
                        <line
                          x1="218"
                          y1="0"
                          x2="218"
                          y2="32"
                          stroke="#ffffff"
                          strokeWidth="1.2"
                          strokeDasharray="2 1.5"
                        />
                      </svg>
                    )}
                  </div>
                ) : (
                  /* GOVERNORS: Exact original standard majority bar retained */
                  <div className="relative w-full h-8 flex items-center">
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
                  </div>
                )}

                {/* Subtitle / Micro-narrative legend */}
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  {isSurpriseChamber ? (
                    hoveredSeat && hoveredSeat.chamber === item.id ? (
                      <span className="truncate text-white font-semibold">
                        {hoveredSeat.label}: {hoveredSeat.isFlip ? '⚡ FLIP' : 'Held'} ({hoveredSeat.swingVs2022 > 0 ? '+' : ''}{hoveredSeat.swingVs2022}%)
                      </span>
                    ) : (
                      <span className="flex items-center justify-between w-full text-slate-400">
                        <span>Flanks: Safe Base</span>
                        <span className="text-slate-300 font-bold">▲ Bar Height: Surprise vs. 2022</span>
                        <span>Center: Flips ({item.id === 'senate' ? '51' : '218'})</span>
                      </span>
                    )
                  ) : (
                    <span className="flex items-center justify-between w-full text-slate-500">
                      <span>Baseline: 14 Holdovers</span>
                      <span>26 to Win</span>
                      <span>36 Contested in 2026</span>
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
