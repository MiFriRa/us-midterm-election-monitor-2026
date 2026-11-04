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
      stroke = '#94a3b8';
      strokeWidth = 1.6;
      opacity = 1;
    }

    // Top Surprise highlights — crisp white frame instead of competing neon yellow/green
    if (surpriseItem && selectedStateId !== stateId) {
      stroke = '#e2e8f0';
      strokeWidth = 2.4;
      opacity = 1;
    }

    if (selectedStateId === stateId) {
      stroke = '#ffffff';
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
      
      {/* Simple, Clean Map Toolbar — Monochrome Slate UI */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-3 sm:px-5 py-1.5 sm:py-2 border-b border-slate-800/80 text-xs shrink-0 z-10 bg-[#090d14]">
        
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setViewType('cartogram')}
              className={`px-2 sm:px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewType === 'cartogram'
                  ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-600/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid className="w-3.5 h-3.5 shrink-0" />
              <span><span className="hidden sm:inline">Equal-Area </span>Cartogram</span>
            </button>
            <button
              onClick={() => setViewType('geographic')}
              className={`px-2 sm:px-3 py-1 text-xs font-mono rounded-md transition-all flex items-center gap-1.5 cursor-pointer ${
                viewType === 'geographic'
                  ? 'bg-slate-800 text-white shadow-sm font-bold border border-slate-600/80'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5 shrink-0" />
              <span><span className="hidden sm:inline">Geo</span><span className="sm:hidden">Geo</span><span className="hidden sm:inline">graphic</span></span>
            </button>
          </div>

          {onMapModeChange && (
            <div className="flex items-center p-0.5 bg-slate-900 rounded-lg border border-slate-800">
              <button
                onClick={() => onMapModeChange('purple_margin')}
                className={`px-2 sm:px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                  mapMode === 'purple_margin' || mapMode === 'political_impact'
                    ? 'bg-slate-800 text-white font-bold border border-slate-600/80'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">2026 </span>Margin
              </button>
              <button
                onClick={() => onMapModeChange('swing_shift')}
                className={`px-2 sm:px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                  mapMode === 'swing_shift'
                    ? 'bg-slate-800 text-white font-bold border border-slate-600/80'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">Swing vs. 2022</span><span className="sm:hidden">Swing</span>
              </button>
              <button
                onClick={() => onMapModeChange('historical_2022')}
                className={`px-2 sm:px-3 py-1 text-xs font-mono rounded-md transition-all cursor-pointer ${
                  mapMode === 'historical_2022'
                    ? 'bg-slate-800 text-white font-bold border border-slate-600/80'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="hidden sm:inline">2022 </span>Baseline
              </button>
            </div>
          )}
        </div>

        {/* Clean Political Color Scale Only (Red - Purple - Blue) */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-red-400 font-bold text-[11px] sm:text-xs">GOP</span>
            <div className="h-2 w-16 sm:w-28 lg:w-32 rounded-full bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 border border-slate-700" />
            <span className="text-blue-400 font-bold text-[11px] sm:text-xs">DEM</span>
          </div>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            (Purple = Tossup)
          </span>
        </div>

      </div>

      {/* Main Map Render Area — Maximized so the map fills the entire viewport */}
      <div className="relative flex-1 min-h-0 w-full flex items-center justify-center p-1 sm:p-4 overflow-hidden">
        
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
              const { fill, stroke, strokeWidth, opacity, hasRace, reportingPct, swingValue, isTossup, surpriseItem } = getStateRenderProps(tile.id);
              
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
                        fill="#0f172a"
                        stroke="#cbd5e1"
                        strokeWidth="1"
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
                    y={y + (surpriseItem && hasRace ? 36 : hasRace && reportingPct > 0 && reportingPct < 100 ? 34 : !hasRace ? 33 : 38)}
                    textAnchor="middle"
                    fill={hasRace ? (isTossup || isSelected ? '#ffffff' : '#f8fafc') : '#64748b'}
                    fontSize="19"
                    fontWeight="900"
                    fontFamily="'JetBrains Mono', monospace"
                    className="pointer-events-none drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
                  >
                    {tile.id}
                  </text>

                  {surpriseItem && hasRace ? (
                    <text
                      x={x + tileSize / 2}
                      y={y + 54}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="800"
                      fontFamily="'JetBrains Mono', monospace"
                      className="pointer-events-none drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {swingValue > 0 ? `+${swingValue.toFixed(1)}D` : `+${Math.abs(swingValue).toFixed(1)}R`}
                    </text>
                  ) : hasRace && reportingPct > 0 && reportingPct < 100 ? (
                    <text
                      x={x + tileSize / 2}
                      y={y + 52}
                      textAnchor="middle"
                      fill="#cbd5e1"
                      fontSize="10"
                      fontWeight="700"
                      fontFamily="'JetBrains Mono', monospace"
                      className="pointer-events-none opacity-85 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
                    >
                      {reportingPct}%
                    </text>
                  ) : !hasRace ? (
                    <text
                      x={x + tileSize / 2}
                      y={y + 51}
                      textAnchor="middle"
                      fill="#475569"
                      fontSize="8.5"
                      fontWeight="700"
                      fontFamily="'JetBrains Mono', monospace"
                      className="pointer-events-none"
                    >
                      NO RACE
                    </text>
                  ) : null}
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
