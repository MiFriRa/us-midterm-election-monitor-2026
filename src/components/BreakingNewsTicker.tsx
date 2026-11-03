import React, { useState, useEffect } from 'react';
import { Newspaper, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Bell, Clock } from 'lucide-react';

export interface NewsBulletin {
  id: string;
  cetTime: string; // e.g. "02:15 CET"
  estTime: string; // e.g. "20:15 EST"
  unlockHourIndex: number; // 0 to 7 corresponding to timeline snapshots
  category: 'CONFIRMED' | 'PROJECTED' | 'FLIP' | 'POLLS CLOSED' | 'MAJORITY' | 'ANALYSIS';
  headline: string;
  body: string;
  stateCode?: string;
  chamber?: 'senate' | 'house' | 'governor';
}

export const EUROPEAN_BULLETINS: NewsBulletin[] = [
  {
    id: 'b-0',
    cetTime: '00:00 CET',
    estTime: '18:00 EST',
    unlockHourIndex: 0,
    category: 'POLLS CLOSED',
    headline: 'Polls close in Indiana and Kentucky — early returns begin reporting',
    body: 'Initial tabulation begins in first precincts. Rapid-reporting rural counties post the earliest tallies.',
    stateCode: 'IN'
  },
  {
    id: 'b-1',
    cetTime: '01:00 CET',
    estTime: '19:00 EST',
    unlockHourIndex: 1,
    category: 'PROJECTED',
    headline: 'Georgia: Tight contest in gubernatorial race between parties',
    body: 'Early suburban Atlanta batches (Gwinnett and Cobb) show narrower margins than the 2022 baseline.',
    stateCode: 'GA',
    chamber: 'governor'
  },
  {
    id: 'b-2',
    cetTime: '01:30 CET',
    estTime: '19:30 EST',
    unlockHourIndex: 2,
    category: 'POLLS CLOSED',
    headline: 'North Carolina and Ohio conclude in-person voting',
    body: 'Tabulation of both mail-in ballots and early voting underway across the Research Triangle and Cuyahoga County.',
    stateCode: 'NC'
  },
  {
    id: 'b-3',
    cetTime: '02:00 CET',
    estTime: '20:00 EST',
    unlockHourIndex: 3,
    category: 'CONFIRMED',
    headline: 'Senate: Doug Jones maintains strong resistance in Alabama against Tuberville',
    body: 'Republicans retain the seat as projected, with modest suburban Democratic shifts in college metro areas.',
    stateCode: 'AL',
    chamber: 'senate'
  },
  {
    id: 'b-4',
    cetTime: '02:30 CET',
    estTime: '20:30 EST',
    unlockHourIndex: 4,
    category: 'FLIP',
    headline: 'Pennsylvania: Key bellwether district PA-07 registers notable Democratic swing',
    body: 'In the Lehigh Valley, Democratic returns lead by +3.2 percentage points relative to the 2022 baseline.',
    stateCode: 'PA',
    chamber: 'house'
  },
  {
    id: 'b-5',
    cetTime: '03:00 CET',
    estTime: '21:00 EST',
    unlockHourIndex: 5,
    category: 'PROJECTED',
    headline: 'Wisconsin and Michigan: Gubernatorial contests fueled by record turnout',
    body: 'In Dane County (Madison) and Wayne County (Detroit), counting pace exceeds projections with over 70% reported.',
    stateCode: 'WI',
    chamber: 'governor'
  },
  {
    id: 'b-6',
    cetTime: '04:00 CET',
    estTime: '22:00 EST',
    unlockHourIndex: 6,
    category: 'ANALYSIS',
    headline: 'House of Representatives: 218-seat threshold hinges on Rust Belt and Sunbelt',
    body: 'Tabulation in Arizona (Maricopa) and Nevada (Clark) expected to span several days due to election-day postmarked drop-offs.',
    stateCode: 'AZ',
    chamber: 'house'
  },
  {
    id: 'b-7',
    cetTime: '05:00 CET',
    estTime: '23:00 EST',
    unlockHourIndex: 7,
    category: 'MAJORITY',
    headline: 'Senate: Projections indicate 50-50 deadlock or narrow 51-seat majority',
    body: 'Key swing battleground states point to an evenly divided upper chamber with decisive implications for the legislative agenda.',
    chamber: 'senate'
  }
];

interface BreakingNewsTickerProps {
  currentHourIndex: number;
  onSelectState?: (stateCode: string) => void;
}

export const BreakingNewsTicker: React.FC<BreakingNewsTickerProps> = ({
  currentHourIndex,
  onSelectState
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Filter bulletins unlocked at or before currentHourIndex
  const activeBulletins = EUROPEAN_BULLETINS.filter(b => b.unlockHourIndex <= currentHourIndex);
  const effectiveBulletins = activeBulletins.length > 0 ? activeBulletins : [EUROPEAN_BULLETINS[0]];

  useEffect(() => {
    // Keep currentIndex within bounds
    if (currentIndex >= effectiveBulletins.length) {
      setCurrentIndex(effectiveBulletins.length - 1);
    }
  }, [effectiveBulletins.length, currentIndex]);

  useEffect(() => {
    if (!isAutoPlaying || isExpanded || effectiveBulletins.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % effectiveBulletins.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlaying, isExpanded, effectiveBulletins.length]);

  const currentItem = effectiveBulletins[currentIndex] || effectiveBulletins[0];

  const getCategoryBadgeClass = (cat: NewsBulletin['category']) => {
    switch (cat) {
      case 'CONFIRMED':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60';
      case 'FLIP':
        return 'bg-purple-950/80 text-purple-300 border-purple-700/60';
      case 'MAJORITY':
        return 'bg-blue-950/80 text-blue-300 border-blue-800/60';
      case 'PROJECTED':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/60';
      case 'POLLS CLOSED':
        return 'bg-slate-800 text-slate-300 border-slate-700';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="w-full bg-slate-950/90 border-y border-slate-800/80 text-xs backdrop-blur-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Compact Ticker Row */}
        <div className="h-10 flex items-center justify-between gap-3">
          
          {/* European News Desk Label (Sober, Authoritative) */}
          <div className="flex items-center gap-2 shrink-0 border-r border-slate-800/90 pr-3">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            <span className="font-mono text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5 text-slate-400" />
              <span>Election Desk</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
              CET / Wire Feed
            </span>
          </div>

          {/* Active Bulletin Headline */}
          <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
            <span
              className={`px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded border shrink-0 ${getCategoryBadgeClass(
                currentItem.category
              )}`}
            >
              {currentItem.category}
            </span>

            <span className="text-[11px] font-mono text-slate-400 shrink-0 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>{currentItem.cetTime}</span>
              <span className="text-[10px] text-slate-400 hidden md:inline">({currentItem.estTime})</span>
            </span>

            <div className="truncate text-slate-200 font-medium text-xs">
              {currentItem.headline}
            </div>

            {currentItem.stateCode && onSelectState && (
              <button
                onClick={() => onSelectState(currentItem.stateCode!)}
                className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 hover:border-purple-500 text-[10px] font-mono text-purple-300 transition-colors shrink-0"
              >
                View {currentItem.stateCode}
              </button>
            )}
          </div>

          {/* Navigation & Expand Controls */}
          <div className="flex items-center gap-1 shrink-0 pl-2">
            <span className="text-[10px] font-mono text-slate-400 mr-1 hidden sm:inline">
              {currentIndex + 1}/{effectiveBulletins.length}
            </span>

            <button
              onClick={() => setCurrentIndex(prev => (prev - 1 + effectiveBulletins.length) % effectiveBulletins.length)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Previous bulletin"
              aria-label="Previous bulletin"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setCurrentIndex(prev => (prev + 1) % effectiveBulletins.length)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              title="Next bulletin"
              aria-label="Next bulletin"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="ml-1 px-2 py-0.5 text-[10px] font-mono text-slate-300 hover:text-white bg-slate-900 border border-slate-800 rounded flex items-center gap-1 transition-colors"
              title={isExpanded ? 'Collapse bulletin feed' : 'View all bulletins'}
            >
              <span>{isExpanded ? 'Close' : 'All (CET)'}</span>
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>

        </div>

        {/* Expandable Bulletin Feed (European Wire Style) */}
        {isExpanded && (
          <div className="py-3 border-t border-slate-800/90 grid grid-cols-1 md:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {effectiveBulletins.map((b, idx) => {
              const isSelected = idx === currentIndex;
              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    if (b.stateCode && onSelectState) {
                      onSelectState(b.stateCode);
                    }
                  }}
                  className={`p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-900/90 border-purple-600/70'
                      : 'bg-slate-950 border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1 py-0.2 text-[9px] font-mono font-bold rounded border ${getCategoryBadgeClass(b.category)}`}>
                        {b.category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {b.cetTime} <span className="text-slate-400">({b.estTime})</span>
                      </span>
                    </div>
                    {b.stateCode && (
                      <span className="font-mono text-[10px] text-purple-400 font-bold bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        {b.stateCode}
                      </span>
                    )}
                  </div>
                  <h4 className="font-medium text-slate-200 text-xs leading-snug">{b.headline}</h4>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal">{b.body}</p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
