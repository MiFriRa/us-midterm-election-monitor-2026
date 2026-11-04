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

export interface ChamberBalanceBarProps {
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
  forceFullCards?: boolean;
}

export const ChamberBalanceBar: React.FC<ChamberBalanceBarProps> = ({
  chamber,
  onChamberChange,
  senateTally,
  houseTally,
  governorTally,
  nationalReportingPct,
  currentCetLabel,
  statesData,
  forceFullCards = false
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

  const activeChamberItem = chambers.find(c => c.id === chamber) || chambers[0];

  const renderVisualTrack = (
    item: (typeof chambers)[0],
    heightClass: string = "h-8"
  ) => {
    const isSurpriseChamber = item.id === 'senate' || item.id === 'house';
    const currentDist = item.id === 'senate' ? senateDist : houseDist;
    const { demSeats, gopSeats, majorityThreshold } = item.tally;
    const demWidth = (demSeats / item.totalSeats) * 100;
    const gopWidth = (gopSeats / item.totalSeats) * 100;
    const thresholdPct = (majorityThreshold / item.totalSeats) * 100;

    if (isSurpriseChamber) {
      return (
        <div className={`relative w-full ${heightClass} bg-slate-950/90 rounded border border-slate-800/90 overflow-hidden flex items-end`}>
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
      );
    }

    /* GOVERNORS: Exact original standard majority bar */
    return (
      <div className={`relative w-full ${heightClass} flex items-center`}>
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
    );
  };

  return (
    <section className="bg-[#090d14] border-b border-slate-800/80 px-3 sm:px-5 py-2 sm:py-3 shrink-0 z-20">
      
      {/* =========================================================================
          1) MOBILE COMPACT RESULTAT BAR (< md, unless forceFullCards is true)
          Takes ~68px total. Shows: Counting status, 3 chamber pills with live tally,
          and the active chamber's visual seismograph distribution with zero crowding.
          ========================================================================= */}
      <div className={`${forceFullCards ? 'hidden' : 'md:hidden'} flex flex-col gap-2`}>
        {/* Top Row: Counting Status Badge + Chamber Switcher Pills */}
        <div className="flex items-center justify-between gap-2">
          {/* Counting status mini-pill */}
          <div className="flex items-center gap-1.5 bg-[#0e1420] border border-slate-800 rounded-lg px-2.5 py-1 shrink-0 font-mono">
            <span
              className={`w-2 h-2 rounded-full ${
                isCounting ? 'bg-white animate-pulse' : isComplete ? 'bg-slate-300' : 'bg-slate-500'
              }`}
            />
            <span className="text-xs font-black text-white">{nationalReportingPct}%</span>
            <span className="text-[10px] text-slate-400 hidden xs:inline">
              {isCounting ? 'Counted' : isComplete ? 'Final' : 'Open'}
            </span>
          </div>

          {/* Chamber Switcher Pills */}
          <div className="flex items-center gap-1 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800 flex-1 justify-end overflow-x-auto scrollbar-none">
            {chambers.map((item) => {
              const isSelected = chamber === item.id;
              const shortName = item.id === 'senate' ? 'Senate' : item.id === 'house' ? 'House' : 'Gov';
              return (
                <button
                  key={item.id}
                  onClick={() => onChamberChange(item.id)}
                  className={`px-2 py-0.5 sm:py-1 rounded text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-slate-200 text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  aria-label={`Select ${item.title}`}
                >
                  <span>{shortName}</span>
                  <span className={isSelected ? 'text-blue-700 font-black' : 'text-blue-400 font-semibold'}>
                    {item.tally.demSeats}
                  </span>
                  <span className="text-slate-500 text-[9px]">:</span>
                  <span className={isSelected ? 'text-red-700 font-black' : 'text-red-400 font-semibold'}>
                    {item.tally.gopSeats}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Row: Active Chamber Mini Card with live Seismograph */}
        <div className="bg-[#0e1420] border border-slate-800/90 rounded-lg px-2.5 py-1.5 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-blue-400 leading-none">
                {activeChamberItem.tally.demSeats}
              </span>
              <span className="text-[10px] font-bold text-slate-400">DEM</span>
            </div>

            <div className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
              {activeChamberItem.tally.uncalledSeats > 0 && (
                <span className="text-slate-500">{activeChamberItem.tally.uncalledSeats} uncalled ·</span>
              )}
              <span className="text-slate-300 font-semibold">{activeChamberItem.tally.majorityThreshold} to win</span>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold text-slate-400">GOP</span>
              <span className="text-sm font-black text-red-400 leading-none">
                {activeChamberItem.tally.gopSeats}
              </span>
            </div>
          </div>

          {/* Visual Track */}
          {renderVisualTrack(activeChamberItem, "h-5")}
        </div>
      </div>

      {/* =========================================================================
          2) DESKTOP & EXPANDED VIEW (>= md, or when forceFullCards is true)
          Responsive grid. Numbers & labels scale cleanly without overlap.
          ========================================================================= */}
      <div className={`${forceFullCards ? 'grid' : 'hidden md:grid'} grid-cols-1 md:grid-cols-12 gap-2.5 lg:gap-3 items-stretch`}>
        
        {/* 1) SINGLE SOURCE OF TRUTH FOR COUNTING STATUS */}
        <div className="md:col-span-12 lg:col-span-3 bg-[#0e1420] border border-slate-800 rounded-xl px-3.5 lg:px-4 py-2.5 flex flex-col md:flex-row lg:flex-col justify-between md:items-center lg:items-stretch gap-2">
          <div className="flex items-center justify-between md:gap-3">
            <span className="text-[10px] lg:text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-400">
              1. Counting Status
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] lg:text-[11px] font-mono font-semibold text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isCounting ? 'bg-white animate-pulse' : isComplete ? 'bg-slate-300' : 'bg-slate-500'
                }`}
              />
              {isCounting ? 'Counting Active' : isComplete ? 'Final Projection' : 'Polls Open'}
            </span>
          </div>

          <div className="my-1 md:my-0 flex items-baseline justify-between md:gap-3">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white tracking-tight">
              {nationalReportingPct}%
            </span>
            <span className="text-[11px] lg:text-xs font-mono text-slate-400">
              {currentCetLabel || (isCounting ? 'Reported' : 'Closes 00:00 CET')}
            </span>
          </div>

          <div className="w-full md:w-48 lg:w-full h-2 bg-slate-800/90 rounded-full overflow-hidden">
            <div
              className="bg-slate-300 h-full transition-all duration-500"
              style={{ width: `${nationalReportingPct}%` }}
            />
          </div>
        </div>

        {/* 3) SEAT DISTRIBUTION IN THE THREE ELECTIONS */}
        <div className="md:col-span-12 lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:gap-3">
          {chambers.map((item) => {
            const isSelected = chamber === item.id;
            const { demSeats, gopSeats, uncalledSeats, majorityThreshold } = item.tally;
            const isSurpriseChamber = item.id === 'senate' || item.id === 'house';

            return (
              <button
                key={item.id}
                onClick={() => onChamberChange(item.id)}
                className={`text-left rounded-xl px-3 lg:px-4 py-2.5 border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#141c2c] border-slate-400 ring-1 ring-slate-400/50'
                    : 'bg-[#0e1420] border-slate-800/90 hover:border-slate-700 hover:bg-[#111826]'
                }`}
              >
                {/* Header: Chamber Name & Majority Target */}
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-mono font-bold tracking-wider text-white truncate">
                      {item.title}
                    </span>
                    {isSelected && (
                      <span className="text-[9px] px-1 py-0.2 bg-slate-200 text-slate-950 rounded font-bold shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 shrink-0 ml-1">
                    {majorityThreshold} to win
                  </span>
                </div>

                {/* Big Numbers: DEM (Blue) vs GOP (Red) with non-overlapping uncalled badge */}
                <div className="flex items-baseline justify-between my-1 font-mono">
                  <div className="flex items-baseline gap-1 shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-blue-400 leading-none">
                      {demSeats}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">DEM</span>
                  </div>

                  <div className="flex items-center justify-center min-w-0 px-1">
                    {uncalledSeats > 0 ? (
                      <span className="text-[9px] sm:text-[10px] font-mono text-slate-400 bg-slate-900/80 px-1.5 py-0.5 rounded border border-slate-800 truncate">
                        {uncalledSeats} uncalled
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 truncate">
                        Final
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-1 shrink-0">
                    <span className="text-[10px] sm:text-[11px] font-bold text-slate-400">GOP</span>
                    <span className="text-xl sm:text-2xl font-black text-red-400 leading-none">
                      {gopSeats}
                    </span>
                  </div>
                </div>

                {/* VISUALIZATION LINE */}
                {renderVisualTrack(item, "h-7 lg:h-8")}

                {/* Subtitle / Micro-narrative legend (cleanly spaced & non-overlapping) */}
                <div className="mt-1 flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-slate-400 min-h-[16px] w-full">
                  {isSurpriseChamber ? (
                    hoveredSeat && hoveredSeat.chamber === item.id ? (
                      <span className="truncate text-white font-semibold w-full">
                        {hoveredSeat.label}: {hoveredSeat.isFlip ? '⚡ FLIP' : 'Held'} ({hoveredSeat.swingVs2022 > 0 ? '+' : ''}{hoveredSeat.swingVs2022}%)
                      </span>
                    ) : (
                      <div className="flex items-center justify-between w-full text-slate-400">
                        <span className="truncate">Safe base</span>
                        <span className="text-slate-300 font-bold px-1 truncate">▲ Surprises</span>
                        <span className="truncate">Flips ({item.id === 'senate' ? '51' : '218'})</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-between w-full text-slate-500">
                      <span className="truncate">14 Holdovers</span>
                      <span>26 to win</span>
                      <span className="truncate">36 Contested</span>
                    </div>
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
