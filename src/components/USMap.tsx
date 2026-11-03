import React, { useState } from 'react';
import { HIGH_RES_US_PATHS, EQUAL_AREA_TILES } from '../data/usHighResMapPaths';
import {
  StateElectionResult,
  getPurpleGradientColor,
  getSwingMapColor,
  calculateSwing,
  getPoliticalImpactAssessment,
  PoliticalImpactAssessment,
  ElectionSurprise
} from '../utils/electionMath';
import { ChamberType, MapDisplayMode } from './ChamberBalanceBar';
import { Grid, Compass } from 'lucide-react';

export type MapViewType = 'cartogram' | 'geographic';

interface USMapProps {
  statesData: Record<string, StateElectionResult>;
  chamber: ChamberType;
  mapMode: MapDisplayMode;
  selectedStateId: string | null;
  onSelectState: (stateId: string) => void;
  surprises?: ElectionSurprise[];
}

interface TooltipData {
  state: StateElectionResult;
  x: number;
  y: number;
  demCandidateName: string;
  demVotes: number;
  demPct: number;
  gopCandidateName: string;
  gopVotes: number;
  gopPct: number;
  reportingPct: number;
  margin: number;
  swingLabel: string;
  swingColor: string;
  hasRace: boolean;
  impact: PoliticalImpactAssessment | null;
  surprise: ElectionSurprise | null;
}

const KEY_BATTLEGROUNDS = ['GA', 'MI', 'NC', 'TX', 'ME', 'WI', 'NV', 'PA'];

export const USMap: React.FC<USMapProps> = ({
  statesData,
  chamber,
  mapMode,
  selectedStateId,
  onSelectState,
  surprises
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [viewType, setViewType] = useState<MapViewType>('cartogram');
  // Bauhaus default: FALSE for pure, clean, uncluttered geometric blocks
  const [showSwingBadges, setShowSwingBadges] = useState<boolean>(false);

  const surpriseMap = React.useMemo(() => {
    return new Map((surprises || []).map(s => [s.stateCode, s]));
  }, [surprises]);

  const getStateRenderProps = (stateId: string) => {
    const data = statesData[stateId];
    const impact = data ? getPoliticalImpactAssessment(data, chamber) : null;
    const surpriseItem = surpriseMap.get(stateId) || null;
    let fill = '#111827'; // clean dark slate
    let hasRace = true;
    let demPct = 50;
    let gopPct = 50;
    let reportingPct = 100;
    let swingValue = 0;
    let swingLabel = '0.0 pp';
    let opacity = 1;
    let stroke = '#1e293b';
    let strokeWidth = 1.0;

    if (!data) {
      return { fill, stroke, strokeWidth, opacity, hasRace: false, demPct: 50, gopPct: 50, reportingPct: 0, swingValue: 0, swingLabel: '', impact: null, isTossup: false };
    }

    if (chamber === 'senate') {
      if (!data.hasSenateRace || !data.senate) {
        hasRace = false;
        fill = '#0a0e17'; // quiet dark slate for non-contested seats
        opacity = 0.35;
      } else {
        const s = data.senate;
        demPct = s.demCandidate.pct;
        gopPct = s.gopCandidate.pct;
        reportingPct = s.reportingPct;

        const swing = calculateSwing(
          demPct,
          gopPct,
          s.historical2022.demPct,
          s.historical2022.gopPct
        );
        swingValue = swing.swingValue;
        swingLabel = swing.label;

        if (mapMode === 'swing_shift') {
          fill = getSwingMapColor(swingValue);
        } else if (mapMode === 'historical_2022') {
          fill = getPurpleGradientColor(s.historical2022.demPct, s.historical2022.gopPct, 100);
        } else {
          // Default: Purple two-party gradient where purple IS impact
          fill = getPurpleGradientColor(demPct, gopPct, reportingPct);
        }
      }
    } else if (chamber === 'governor') {
      if (!data.hasGovernorRace || !data.governor) {
        hasRace = false;
        fill = '#0a0e17';
        opacity = 0.35;
      } else {
        const g = data.governor;
        demPct = g.demCandidate.pct;
        gopPct = g.gopCandidate.pct;
        reportingPct = g.reportingPct;

        const swing = calculateSwing(
          demPct,
          gopPct,
          g.historical2022.demPct,
          g.historical2022.gopPct
        );
        swingValue = swing.swingValue;
        swingLabel = swing.label;

        if (mapMode === 'swing_shift') {
          fill = getSwingMapColor(swingValue);
        } else if (mapMode === 'historical_2022') {
          fill = getPurpleGradientColor(g.historical2022.demPct, g.historical2022.gopPct, 100);
        } else {
          fill = getPurpleGradientColor(demPct, gopPct, reportingPct);
        }
      }
    } else {
      // House
      if (data.house) {
        const h = data.house;
        const totalVotes = h.popularDemVotes + h.popularGopVotes;
        demPct = totalVotes > 0 ? Number(((h.popularDemVotes / totalVotes) * 100).toFixed(1)) : 50;
        gopPct = totalVotes > 0 ? Number(((h.popularGopVotes / totalVotes) * 100).toFixed(1)) : 50;
        reportingPct = h.reportingPct;

        const swing = calculateSwing(
          demPct,
          gopPct,
          h.historical2022.demPopularPct,
          h.historical2022.gopPopularPct
        );
        swingValue = swing.swingValue;
        swingLabel = swing.label;

        if (mapMode === 'swing_shift') {
          fill = getSwingMapColor(swingValue);
        } else if (mapMode === 'historical_2022') {
          fill = getPurpleGradientColor(h.historical2022.demPopularPct, h.historical2022.gopPopularPct, 100);
        } else {
          fill = getPurpleGradientColor(demPct, gopPct, reportingPct);
        }
      }
    }

    // Bauhaus aesthetic:
    // Purple = Maximum Impact & Closeness (within 4 pp margin)
    const margin = Math.abs(demPct - gopPct);
    const isTossup = hasRace && margin <= 4.0;

    if (hasRace && isTossup) {
      // High-impact purple states get a subtle, elegant hairline border that draws the eye gently
      stroke = '#c084fc'; // soft violet accent
      strokeWidth = 1.6;
      opacity = 1;
    }

    // Top Surprise highlights: High-visibility shock borders
    if (surpriseItem && selectedStateId !== stateId) {
      stroke = surpriseItem.isFlip ? '#10b981' : '#f59e0b'; // Emerald for flip, amber for major shift
      strokeWidth = 2.8;
      opacity = 1;
    }

    // Selected state has crisp focus frame
    if (selectedStateId === stateId) {
      stroke = '#38bdf8'; // crisp sky-blue border
      strokeWidth = 3.2;
      opacity = 1;
    }

    return { fill, stroke, strokeWidth, opacity, hasRace, demPct, gopPct, reportingPct, swingValue, swingLabel, impact, isTossup, surpriseItem };
  };

  const handleMouseEnter = (e: React.MouseEvent, stateId: string) => {
    const data = statesData[stateId];
    if (!data) return;

    let demName = 'Democrat';
    let gopName = 'Republican';
    let demVotes = 0;
    let gopVotes = 0;
    let demPct = 50;
    let gopPct = 50;
    let reportingPct = 100;
    let hasRace = true;
    let baseDem = 50;
    let baseGop = 50;

    if (chamber === 'senate') {
      if (data.hasSenateRace && data.senate) {
        demName = data.senate.demCandidate.name;
        gopName = data.senate.gopCandidate.name;
        demVotes = data.senate.demCandidate.votes;
        gopVotes = data.senate.gopCandidate.votes;
        demPct = data.senate.demCandidate.pct;
        gopPct = data.senate.gopCandidate.pct;
        reportingPct = data.senate.reportingPct;
        baseDem = data.senate.historical2022.demPct;
        baseGop = data.senate.historical2022.gopPct;
      } else {
        hasRace = false;
      }
    } else if (chamber === 'governor') {
      if (data.hasGovernorRace && data.governor) {
        demName = data.governor.demCandidate.name;
        gopName = data.governor.gopCandidate.name;
        demVotes = data.governor.demCandidate.votes;
        gopVotes = data.governor.gopCandidate.votes;
        demPct = data.governor.demCandidate.pct;
        gopPct = data.governor.gopCandidate.pct;
        reportingPct = data.governor.reportingPct;
        baseDem = data.governor.historical2022.demPct;
        baseGop = data.governor.historical2022.gopPct;
      } else {
        hasRace = false;
      }
    } else {
      if (data.house) {
        demName = `${data.house.demSeats} Dem Seats`;
        gopName = `${data.house.gopSeats} GOP Seats`;
        demVotes = data.house.popularDemVotes;
        gopVotes = data.house.popularGopVotes;
        const total = demVotes + gopVotes;
        demPct = total > 0 ? Number(((demVotes / total) * 100).toFixed(1)) : 50;
        gopPct = total > 0 ? Number(((gopVotes / total) * 100).toFixed(1)) : 50;
        reportingPct = data.house.reportingPct;
        baseDem = data.house.historical2022.demPopularPct;
        baseGop = data.house.historical2022.gopPopularPct;
      }
    }

    const swing = calculateSwing(demPct, gopPct, baseDem, baseGop);
    const margin = Number((demPct - gopPct).toFixed(1));
    const surprise = surpriseMap.get(stateId) || null;
    const impact = getPoliticalImpactAssessment(data, chamber);

    setTooltip({
      state: data,
      x: e.clientX,
      y: e.clientY,
      demCandidateName: demName,
      demVotes,
      demPct,
      gopCandidateName: gopName,
      gopVotes,
      gopPct,
      reportingPct,
      margin,
      swingLabel: swing.label,
      swingColor: swing.color,
      hasRace,
      impact,
      surprise
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative w-full h-full flex-1 min-h-0 flex flex-col bg-[#070a10] overflow-hidden">
      
      {/* Bauhaus Clean Top Toolbar: Full-width, Minimalist */}
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-800/80 text-xs shrink-0 z-10 bg-[#080c14]">
        
        {/* Left: Projection Tabs (Clean Minimalist Segmented Control) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-900/90 rounded-md border border-slate-800">
            <button
              onClick={() => setViewType('cartogram')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                viewType === 'cartogram'
                  ? 'bg-slate-800 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Equal-Area Cartogram</span>
            </button>
            <button
              onClick={() => setViewType('geographic')}
              className={`px-3 py-1 text-xs font-mono rounded transition-all flex items-center gap-1.5 ${
                viewType === 'geographic'
                  ? 'bg-slate-800 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Geographic (Albers)</span>
            </button>
          </div>

          {/* Minimalist Switch: Map Labels (Default Off for Bauhaus clarity) */}
          <button
            onClick={() => setShowSwingBadges(prev => !prev)}
            className={`px-2.5 py-1 text-[11px] font-mono rounded-md border transition-all ${
              showSwingBadges
                ? 'bg-purple-950/50 border-purple-600 text-purple-200 font-bold'
                : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Labels: {showSwingBadges ? 'On' : 'Off'}</span>
          </button>
        </div>

        {/* Right: Key Battlegrounds as Minimalist Links */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 hidden sm:inline">
            Battlegrounds:
          </span>
          <div className="flex items-center gap-1">
            {KEY_BATTLEGROUNDS.map(stId => {
              const isSelected = selectedStateId === stId;
              return (
                <button
                  key={stId}
                  onClick={() => onSelectState(stId)}
                  className={`px-2 py-0.5 text-xs font-mono font-bold rounded transition-colors ${
                    isSelected
                      ? 'bg-purple-600 text-white ring-1 ring-purple-300'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {stId}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Map Render Area — Flex-1 auto scales to 100% viewport */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-2 overflow-hidden">
        
        {viewType === 'geographic' ? (
          /* High-Resolution Albers USA Vector Map */
          <svg
            viewBox="0 0 960 590"
            className="w-full h-full max-h-full max-w-full select-none"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleMouseMove}
          >
            {HIGH_RES_US_PATHS.map((path) => {
              const { fill, stroke, strokeWidth, opacity, hasRace, swingValue, isTossup } = getStateRenderProps(path.id);

              return (
                <g
                  key={path.id}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => onSelectState(path.id)}
                  onMouseEnter={(e) => handleMouseEnter(e, path.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <path
                    d={path.path}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    opacity={opacity}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="transition-colors duration-200 hover:brightness-110 focus:outline-none"
                    tabIndex={0}
                    aria-label={`${path.name} (${path.id})`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelectState(path.id);
                      }
                    }}
                  />

                  {/* Clean State Monogram */}
                  <text
                    x={path.cx}
                    y={path.cy + (showSwingBadges && hasRace ? -2 : 4)}
                    textAnchor="middle"
                    fill={hasRace ? (isTossup ? '#f5f3ff' : '#ffffff') : '#64748b'}
                    fontSize={path.id === 'DC' ? 8 : path.id === 'RI' || path.id === 'DE' ? 9 : 12}
                    fontWeight={isTossup ? '800' : '700'}
                    fontFamily="'JetBrains Mono', monospace"
                    className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                  >
                    {path.id}
                  </text>

                  {/* Optional Delta (Only when explicitly enabled) */}
                  {showSwingBadges && hasRace && Math.abs(swingValue) >= 0.5 && (
                    <text
                      x={path.cx}
                      y={path.cy + 9}
                      textAnchor="middle"
                      fill={swingValue > 0 ? '#93c5fd' : '#fca5a5'}
                      fontSize="8"
                      fontWeight="600"
                      fontFamily="'JetBrains Mono', monospace"
                      className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {swingValue > 0 ? `+${swingValue.toFixed(0)}D` : `+${Math.abs(swingValue).toFixed(0)}R`}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        ) : (
          /* Pure Bauhaus Equal-Area Cartogram Grid (Clean, Quiet, Spaced) */
          <svg
            viewBox="0 0 960 590"
            className="w-full h-full max-h-full max-w-full select-none"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleMouseMove}
          >
            {EQUAL_AREA_TILES.map((tile) => {
              const { fill, stroke, strokeWidth, opacity, hasRace, swingValue, isTossup, surpriseItem } = getStateRenderProps(tile.id);
              
              // 12 columns x 8 rows grid with generous spacing
              const tileSize = 64;
              const gap = 8;
              const startX = 40;
              const startY = 14;
              const x = startX + tile.col * (tileSize + gap);
              const y = startY + tile.row * (tileSize + gap);
              const isSelected = selectedStateId === tile.id;

              return (
                <g
                  key={tile.id}
                  className="cursor-pointer transition-transform duration-150"
                  onClick={() => onSelectState(tile.id)}
                  onMouseEnter={(e) => handleMouseEnter(e, tile.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <rect
                    x={x}
                    y={y}
                    width={tileSize}
                    height={tileSize}
                    rx="8"
                    fill={fill}
                    stroke={isSelected ? '#ffffff' : stroke}
                    strokeWidth={isSelected ? 2.5 : strokeWidth}
                    opacity={opacity}
                    className="transition-all duration-200 hover:brightness-110 focus:outline-none"
                    tabIndex={0}
                    aria-label={`${tile.name} (${tile.id})`}
                  />

                  {/* Top Surprise Rank Badge directly on Cartogram Tile */}
                  {surpriseItem && (
                    <g className="pointer-events-none">
                      <rect
                        x={x + 4}
                        y={y + 4}
                        width={22}
                        height={14}
                        rx="3"
                        fill={surpriseItem.isFlip ? '#059669' : '#d97706'}
                      />
                      <text
                        x={x + 15}
                        y={y + 14}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="900"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        #{surpriseItem.rank}
                      </text>
                    </g>
                  )}

                  {/* Clean, Bold State Code */}
                  <text
                    x={x + tileSize / 2}
                    y={y + ((showSwingBadges || surpriseItem) && hasRace ? 33 : 39)}
                    textAnchor="middle"
                    fill={hasRace ? (isTossup || isSelected ? '#ffffff' : '#f1f5f9') : '#64748b'}
                    fontSize={(showSwingBadges || surpriseItem) && hasRace ? "14" : "16"}
                    fontWeight="800"
                    fontFamily="'JetBrains Mono', monospace"
                    letterSpacing="0.04em"
                    className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {tile.id}
                  </text>

                  {/* Swing Delta (Shown for Top Surprises automatically or when Labels On) */}
                  {(showSwingBadges || surpriseItem) && hasRace && (
                    <text
                      x={x + tileSize / 2}
                      y={y + 52}
                      textAnchor="middle"
                      fill={surpriseItem ? '#fde68a' : swingValue > 0 ? '#93c5fd' : swingValue < 0 ? '#fca5a5' : '#94a3b8'}
                      fontSize="9.5"
                      fontWeight="800"
                      fontFamily="'JetBrains Mono', monospace"
                      className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {surpriseItem && surpriseItem.reportingPct === 0
                        ? `${surpriseItem.houseSeats} Seats`
                        : swingValue > 0
                        ? `+${swingValue.toFixed(1)} D`
                        : swingValue < 0
                        ? `+${Math.abs(swingValue).toFixed(1)} R`
                        : '0.0'}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Dynamic Hover Tooltip: Clean, Informative, Bauhaus Editorial Typography */}
        {tooltip && (
          <div
            className="fixed pointer-events-none z-50 bg-[#0f1422]/95 border border-slate-700/80 rounded-xl p-4 shadow-2xl backdrop-blur-md w-72 text-xs space-y-2.5 -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 12}px`
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-sm">
                {tooltip.state.stateName} ({tooltip.state.stateCode})
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                {tooltip.hasRace ? `${tooltip.reportingPct}% in` : 'No election in 2026'}
              </span>
            </div>

            {tooltip.hasRace ? (
              <>
                {/* Two-party Vote Share Breakdown */}
                <div className="space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-blue-400">
                    <span className="truncate max-w-[150px]">{tooltip.demCandidateName}</span>
                    <span className="font-bold">{tooltip.demPct}%</span>
                  </div>
                  <div className="flex items-center justify-between text-red-400">
                    <span className="truncate max-w-[150px]">{tooltip.gopCandidateName}</span>
                    <span className="font-bold">{tooltip.gopPct}%</span>
                  </div>
                </div>

                {/* Clean Margin Bar */}
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div className="bg-blue-600 h-full" style={{ width: `${tooltip.demPct}%` }} />
                  <div className="bg-red-600 h-full" style={{ width: `${tooltip.gopPct}%` }} />
                </div>

                {/* Margin & Swing */}
                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">
                    Margin:{' '}
                    <strong className={tooltip.margin > 0 ? 'text-blue-400' : tooltip.margin < 0 ? 'text-red-400' : 'text-purple-400'}>
                      {tooltip.margin > 0 ? `D +${tooltip.margin}` : tooltip.margin < 0 ? `R +${Math.abs(tooltip.margin)}` : 'Tied (Purple)'}
                    </strong>
                  </span>
                  <span className="font-mono font-semibold" style={{ color: tooltip.swingColor }}>
                    {tooltip.swingLabel}
                  </span>
                </div>

                {/* Quiet Impact Note */}
                {tooltip.impact && tooltip.impact.level !== 'low' && (
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <div className="flex items-center justify-between text-purple-300 font-mono text-[10px] uppercase font-bold">
                      <span>Majority Impact</span>
                      <span>Weight: {tooltip.impact.score}/100</span>
                    </div>
                    <p className="text-[10.5px] leading-relaxed text-slate-400">
                      {tooltip.impact.whyItMatters}
                    </p>
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400 text-[11px] italic">
                Seat not scheduled for contest in this cycle.
              </p>
            )}
          </div>
        )}

      </div>

      {/* Bauhaus Color Theory Legend (Single-line Compact Bar) */}
      <div className="px-4 py-1.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-[#080c14] shrink-0">
        
        {/* Spectrum Bar: Explaining Purple = Maximum Impact */}
        {mapMode === 'swing_shift' ? (
          <div className="flex items-center gap-2">
            <span className="font-mono text-red-400 font-bold whitespace-nowrap">Red Shift (GOP)</span>
            <div className="h-2 w-32 sm:w-48 rounded-full bg-gradient-to-r from-red-600 via-slate-700 to-blue-600 border border-slate-700" />
            <span className="font-mono text-blue-400 font-bold whitespace-nowrap">Blue Shift (DEM)</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">R+15</span>
            <div className="h-2 w-32 sm:w-48 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 border border-slate-700" />
            <span className="text-blue-400 font-bold">D+15</span>
            <span className="text-slate-400 ml-2 hidden md:inline">
              <strong className="text-purple-300">Purple = Max Impact</strong> (Closer margin = greater majority leverage)
            </span>
          </div>
        )}

        <div className="flex items-center gap-3 shrink-0">
          <span className="flex items-center gap-1 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border-2 border-emerald-500" />
            Top Flip
          </span>
          <span className="flex items-center gap-1 text-amber-300">
            <span className="w-2.5 h-2.5 rounded-sm bg-slate-900 border-2 border-amber-500" />
            Top Surprise
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-purple-600 ring-1 ring-purple-400/50" />
            Tossup
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-slate-900 border border-slate-800 opacity-40" />
            No Contest
          </span>
        </div>

      </div>

    </div>
  );
};
