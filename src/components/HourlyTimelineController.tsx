import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Clock, History, FastForward, ExternalLink } from 'lucide-react';
import { HOURLY_TIMELINE } from '../data/electionData2026';

interface HourlyTimelineControllerProps {
  currentHourIndex: number;
  onHourChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  isBacktestMode: boolean;
  onToggleBacktestMode: () => void;
}

export const HourlyTimelineController: React.FC<HourlyTimelineControllerProps> = ({
  currentHourIndex,
  onHourChange,
  isPlaying,
  onTogglePlay,
  isBacktestMode,
  onToggleBacktestMode
}) => {
  const currentSnapshot = HOURLY_TIMELINE[currentHourIndex];

  return (
    <footer className="border-t border-slate-800/80 bg-[#070a10]/95 backdrop-blur-md shrink-0 z-30 px-4 sm:px-6 h-12 flex items-center">
      <div className="w-full flex items-center justify-between gap-4">
        
        {/* Playback Controls & Current Time Badge */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => onHourChange(Math.max(0, currentHourIndex - 1))}
              disabled={currentHourIndex === 0}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous hour"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onTogglePlay}
              className={`px-2.5 py-1 rounded text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                isPlaying
                  ? 'bg-slate-200 text-slate-950'
                  : 'bg-slate-800 text-white hover:bg-slate-700 border border-slate-700'
              }`}
              aria-label={isPlaying ? 'Pause hourly stream' : 'Play hourly stream'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>

            <button
              onClick={() => onHourChange(Math.min(HOURLY_TIMELINE.length - 1, currentHourIndex + 1))}
              disabled={currentHourIndex === HOURLY_TIMELINE.length - 1}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Next hour"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-white leading-none">
                {currentSnapshot.hourLabel}
              </span>
              <span className="text-[10px] text-slate-400 truncate hidden lg:inline">
                ({currentSnapshot.timeString})
              </span>
            </div>
          </div>
        </div>

        {/* Timeline Scrubbing Bar */}
        <div className="flex-1 w-full max-w-xl flex items-center gap-2">
          {HOURLY_TIMELINE.map((snap, idx) => {
            const isSelected = idx === currentHourIndex;
            const isPassed = idx <= currentHourIndex;

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

        {/* Mode Quick Jumps & Company Credit */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end shrink-0">
          <button
            onClick={() => onHourChange(HOURLY_TIMELINE.length - 1)}
            className="px-2.5 py-1 text-[11px] font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FastForward className="w-3 h-3 text-slate-400" />
            <span>Final Call</span>
          </button>

          <button
            onClick={onToggleBacktestMode}
            className={`px-2.5 py-1 text-[11px] font-mono rounded border transition-colors flex items-center gap-1 cursor-pointer ${
              isBacktestMode
                ? 'bg-slate-200 border-white text-slate-950 font-bold'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <History className="w-3 h-3" />
            <span>{isBacktestMode ? '2022 Active' : '2022 Backtest'}</span>
          </button>

          <a
            href="https://frimer-rasmussen.dk"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 text-[11px] font-mono font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded transition-all flex items-center gap-1.5 whitespace-nowrap"
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
