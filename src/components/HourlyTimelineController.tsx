import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, History, FastForward, ExternalLink, Radio } from 'lucide-react';
import { HOURLY_TIMELINE } from '../data/electionData2026';

interface HourlyTimelineControllerProps {
  currentHourIndex: number;
  onHourChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isBacktestMode: boolean;
  onToggleBacktestMode: () => void;
  isLiveFeedActive?: boolean;
  liveLabel?: string;
  onReturnToLive?: () => void;
}

export const HourlyTimelineController: React.FC<HourlyTimelineControllerProps> = ({
  currentHourIndex,
  onHourChange,
  isPlaying,
  onTogglePlay,
  isBacktestMode,
  onToggleBacktestMode,
  isLiveFeedActive = false,
  liveLabel,
  onReturnToLive
}) => {
  const currentSnapshot = HOURLY_TIMELINE[currentHourIndex];

  return (
    <footer className="border-t border-slate-800/80 bg-[#070a10]/95 backdrop-blur-md shrink-0 z-30 px-3 sm:px-6 h-10 sm:h-12 flex items-center">
      <div className="w-full flex items-center justify-between gap-2 sm:gap-4 overflow-x-auto scrollbar-none">
        
        {/* Playback Controls & Current Time Badge */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => onHourChange(Math.max(0, currentHourIndex - 1))}
              disabled={!isLiveFeedActive && currentHourIndex === 0}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous hour"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`px-2 sm:px-2.5 py-1 rounded text-[11px] sm:text-xs font-semibold font-mono flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-slate-200 text-slate-950'
                  : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
              }`}
              aria-label={isPlaying ? 'Pause hourly stream' : 'Play hourly stream'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden xs:inline">{isPlaying ? 'Pause' : 'Replay'}</span>
            </button>

            <button
              onClick={() => onHourChange(Math.min(HOURLY_TIMELINE.length - 1, currentHourIndex + 1))}
              disabled={!isLiveFeedActive && currentHourIndex === HOURLY_TIMELINE.length - 1}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next hour"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            {isLiveFeedActive ? (
              <>
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-emerald-300 leading-none truncate max-w-[140px] sm:max-w-none">
                    {liveLabel || 'Live Returns'}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-white leading-none">
                    {currentSnapshot.hourLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate hidden lg:inline">
                    ({currentSnapshot.timeString})
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Timeline Scrubbing Bar (Hidden on extra-small mobile to prevent overcrowding) */}
        <div className="hidden sm:flex flex-1 w-full max-w-xl items-center gap-1.5 sm:gap-2">
          {HOURLY_TIMELINE.map((snap, idx) => {
            const isSelected = !isLiveFeedActive && idx === currentHourIndex;
            const isPassed = isLiveFeedActive || idx <= currentHourIndex;

            return (
              <button
                key={snap.hourLabel}
                onClick={() => onHourChange(idx)}
                className="flex-1 flex flex-col items-center group focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'bg-white ring-2 ring-slate-400/50'
                      : isPassed
                      ? 'bg-slate-500'
                      : 'bg-slate-800 hover:bg-slate-700'
                  }`}
                />
                <span
                  className={`mt-1 text-[10px] font-mono transition-colors whitespace-nowrap ${
                    isSelected ? 'text-white font-bold' : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {snap.hourLabel.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mode Quick Jumps */}
        <div className="flex items-center gap-1.5 sm:gap-2 justify-end shrink-0">
          {!isLiveFeedActive && onReturnToLive && (
            <button
              onClick={onReturnToLive}
              className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-mono font-bold text-emerald-300 hover:text-white bg-emerald-950/60 border border-emerald-700/80 hover:border-emerald-500 rounded transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Live API</span>
            </button>
          )}

          <button
            onClick={() => onHourChange(HOURLY_TIMELINE.length - 1)}
            className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FastForward className="w-3 h-3 text-slate-400" />
            <span className="hidden xs:inline">Final Call</span>
          </button>

          <button
            onClick={onToggleBacktestMode}
            className={`px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-mono rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              isBacktestMode
                ? 'bg-slate-200 border-white text-slate-950 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3 h-3" />
            <span className="hidden xs:inline">{isBacktestMode ? '2022 Active' : '2022 Backtest'}</span>
          </button>

          <a
            href="https://frimer-rasmussen.dk"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex px-2.5 py-1 text-[11px] font-mono font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded transition-all items-center gap-1.5 whitespace-nowrap"
            title="Frimer-Rasmussen Consulting — https://frimer-rasmussen.dk"
          >
            <span>Frimer-Rasmussen Consulting</span>
            <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
          </a>
        </div>

      </div>
    </footer>
  );
};
