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

export interface USMapProps {
  statesData: Record<string, StateElectionResult>;
  chamber: ChamberType;
  mapMode: MapDisplayMode;
  onMapModeChange?: (mode: MapDisplayMode) => void;
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

export const USMap: React.FC<USMapProps> = ({
  statesData,
  chamber,
  mapMode,
  onMapModeChange,
  selectedStateId,
  onSelectState,
  surprises
}) => {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [viewType, setViewType] = useState<MapViewType>('cartogram');

  const surpriseMap = React.useMemo(() => {
    return new Map((surprises || []).map(s => [s.stateCode, s]));
  }, [surprises]);

  const getStateRenderProps = (stateId: string) => {
    const data = statesData[stateId];
    const impact = data ? getPoliticalImpactAssessment(data, chamber) : null;
    const surpriseItem = surpriseMap.get(stateId) || null;
    let fill = '#151e30';
    let hasRace = true;
    let demPct = 50;
    let gopPct = 50;
    let reportingPct = 100;
    let swingValue = 0;
    let swingLabel = '0.0 pp';
    let opacity = 1;
    let stroke = '#25324d';
    let strokeWidth = 1.2;

    if (!data) {
      return { fill, stroke, strokeWidth, opacity, hasRace: false, demPct: 50, gopPct: 50, reportingPct: 0, swingValue: 0, swingLabel: '', impact: null, isTossup: false, surpriseItem: null };
    }

    if (chamber === 'senate') {
      if (!data.hasSenateRace || !data.senate) {
        hasRace = false;
        fill = '#0c111d';
        opacity = 0.5;
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
          fill = reportingPct > 0 ? getSwingMapColor(swingValue) : '#192236';
        } else if (mapMode === 'historical_2022') {
          fill = getPurpleGradientColor(s.historical2022.demPct, s.historical2022.gopPct, 100);
        } else {
          fill = getPurpleGradientColor(demPct, gopPct, reportingPct);
        }
      }
    } else if (chamber === 'governor') {
      if (!data.hasGovernorRace || !data.governor) {
        hasRace = false;
        fill = '#0c111d';
        opacity = 0.5;
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
          fill = reportingPct > 0 ? getSwingMapColor(swingValue) : '#192236';
        } else if (mapMode === 'historical_2022') {
          fill = getPurpleGradientColor(g.historical2022.demPct, g.historical2022.gopPct, 100);
        } else {
          fill = getPurpleGradientColor(demPct, gopPct, reportingPct);
        }
      }
    } else {
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
          fill = reportingPct > 0 ? getSwingMapColor(swingValue) : '#192236';
        } else if (mapMode === 'historical_2022') {
          fill = getPurpleGradientColor(h.historical2022.demPopularPct, h.historical2022.gopPopularPct, 100);
        } else {
          fill = getPurpleGradientColor(demPct, gopPct, reportingPct);
        }
      }
    }

    const margin = Math.abs(demPct - gopPct);
    const isTossup = hasRace && reportingPct > 0 && margin <= 4.0;

    if (hasRace && isTossup) {
      stroke = '#c084fc';
      strokeWidth = 1.6;
      opacity = 1;
    }

    // Top Surprise highlights (only when counting is active and surprises exist)
    if (surpriseItem && selectedStateId !== stateId) {
      stroke = surpriseItem.isFlip ? '#10b981' : '#f59e0b';
      strokeWidth = 2.8;
      opacity = 1;
    }

    if (selectedStateId === stateId) {
      stroke = '#38bdf8';
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
      swingLabel: reportingPct > 0 ? swing.label : 'Awaiting Count',
      swingColor: reportingPct > 0 ? swing.color : '#94a3b8',
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
      
      {/* Simple, Clean Map Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 border-b border-slate-800/80 text-xs shrink-0 z-10 bg-[#080c14]">
        
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewType('cartogram')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewType === 'cartogram'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Equal-Area Cartogram</span>
            </button>
            <button
              onClick={() => setViewType('geographic')}
              className={`px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewType === 'geographic'
                  ? 'bg-purple-600 text-white shadow-sm font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Geographic</span>
            </button>
          </div>

          {onMapModeChange && (
            <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => onMapModeChange('purple_margin')}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                  mapMode === 'purple_margin' || mapMode === 'political_impact'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2026 Live Margin
              </button>
              <button
                onClick={() => onMapModeChange('swing_shift')}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                  mapMode === 'swing_shift'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Swing vs. 2022
              </button>
              <button
                onClick={() => onMapModeChange('historical_2022')}
                className={`px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                  mapMode === 'historical_2022'
                    ? 'bg-slate-800 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2022 Result
              </button>
            </div>
          )}
        </div>

        {/* Simple Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-red-400 font-bold">GOP</span>
            <div className="h-2.5 w-24 sm:w-32 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 border border-slate-700" />
            <span className="text-blue-400 font-bold">DEM</span>
          </div>
          <span className="hidden md:flex items-center gap-1.5 text-emerald-300">
            <span className="w-3 h-3 rounded-sm bg-slate-900 border-2 border-emerald-500" />
            Flip
          </span>
          <span className="hidden md:flex items-center gap-1.5 text-amber-300">
            <span className="w-3 h-3 rounded-sm bg-slate-900 border-2 border-amber-500" />
            Top Surprise
          </span>
        </div>

      </div>

      {/* Main Map Render Area — Maximized so the map fills the entire viewport */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
        
        {viewType === 'geographic' ? (
          <svg
            viewBox="35 15 895 560"
            className="w-full h-full max-h-full max-w-full select-none"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleMouseMove}
          >
            {HIGH_RES_US_PATHS.map((path) => {
              const { fill, stroke, strokeWidth, opacity, hasRace, isTossup, surpriseItem } = getStateRenderProps(path.id);

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
                    className="transition-colors duration-200 hover:brightness-125 focus:outline-none"
                    tabIndex={0}
                    aria-label={`${path.name} (${path.id})`}
                  />

                  <text
                    x={path.cx}
                    y={path.cy + 4}
                    textAnchor="middle"
                    fill={hasRace ? (surpriseItem ? '#fef08a' : isTossup ? '#f5f3ff' : '#ffffff') : '#64748b'}
                    fontSize={path.id === 'DC' ? 9 : path.id === 'RI' || path.id === 'DE' ? 10 : 13}
                    fontWeight="800"
                    fontFamily="'JetBrains Mono', monospace"
                    className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)]"
                  >
                    {surpriseItem ? `#${surpriseItem.rank} ${path.id}` : path.id}
                  </text>
                </g>
              );
            })}
          </svg>
        ) : (
          <svg
            viewBox="36 10 864 494"
            className="w-full h-full max-h-full max-w-full select-none"
            preserveAspectRatio="xMidYMid meet"
            onMouseMove={handleMouseMove}
          >
            {EQUAL_AREA_TILES.map((tile) => {
              const { fill, stroke, strokeWidth, opacity, hasRace, swingValue, isTossup, surpriseItem } = getStateRenderProps(tile.id);
              
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
                    rx="10"
                    fill={fill}
                    stroke={isSelected ? '#ffffff' : stroke}
                    strokeWidth={isSelected ? 3 : strokeWidth}
                    opacity={opacity}
                    className="transition-all duration-200 hover:brightness-125 focus:outline-none"
                    tabIndex={0}
                    aria-label={`${tile.name} (${tile.id})`}
                  />

                  {surpriseItem && (
                    <g className="pointer-events-none">
                      <rect
                        x={x + 4}
                        y={y + 4}
                        width={26}
                        height={16}
                        rx="4"
                        fill={surpriseItem.isFlip ? '#059669' : '#d97706'}
                      />
                      <text
                        x={x + 17}
                        y={y + 15}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="10.5"
                        fontWeight="900"
                        fontFamily="'JetBrains Mono', monospace"
                      >
                        #{surpriseItem.rank}
                      </text>
                    </g>
                  )}

                  <text
                    x={x + tileSize / 2}
                    y={y + (surpriseItem && hasRace ? 36 : 38)}
                    textAnchor="middle"
                    fill={hasRace ? (isTossup || isSelected ? '#ffffff' : '#f8fafc') : '#64748b'}
                    fontSize="19"
                    fontWeight="900"
                    fontFamily="'JetBrains Mono', monospace"
                    className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  >
                    {tile.id}
                  </text>

                  {surpriseItem && hasRace && (
                    <text
                      x={x + tileSize / 2}
                      y={y + 54}
                      textAnchor="middle"
                      fill="#fde68a"
                      fontSize="11"
                      fontWeight="800"
                      fontFamily="'JetBrains Mono', monospace"
                      className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {swingValue > 0 ? `+${swingValue.toFixed(1)}D` : `+${Math.abs(swingValue).toFixed(1)}R`}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {/* Clean Hover Tooltip */}
        {tooltip && (
          <div
            className="fixed pointer-events-none z-50 bg-[#0f1422]/95 border border-slate-700 rounded-xl p-4 shadow-2xl backdrop-blur-md w-72 text-xs space-y-2.5 -translate-x-1/2 -translate-y-full mb-3"
            style={{
              left: `${tooltip.x}px`,
              top: `${tooltip.y - 12}px`
            }}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white text-base">
                {tooltip.state.stateName} ({tooltip.state.stateCode})
              </span>
              <span className="font-mono text-xs font-bold text-emerald-400">
                {tooltip.hasRace ? `${tooltip.reportingPct}% counted` : 'No contest'}
              </span>
            </div>

            {tooltip.hasRace ? (
              <>
                <div className="space-y-1.5 font-mono text-sm">
                  <div className="flex items-center justify-between text-blue-400">
                    <span className="truncate max-w-[160px]">{tooltip.demCandidateName}</span>
                    <span className="font-black">{tooltip.reportingPct > 0 ? `${tooltip.demPct}%` : '—'}</span>
                  </div>
                  <div className="flex items-center justify-between text-red-400">
                    <span className="truncate max-w-[160px]">{tooltip.gopCandidateName}</span>
                    <span className="font-black">{tooltip.reportingPct > 0 ? `${tooltip.gopPct}%` : '—'}</span>
                  </div>
                </div>

                {tooltip.reportingPct > 0 && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Swing vs. 2022:</span>
                    <span className="font-bold" style={{ color: tooltip.swingColor }}>
                      {tooltip.swingLabel}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-400 text-xs">
                No contest in this chamber in 2026.
              </p>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
