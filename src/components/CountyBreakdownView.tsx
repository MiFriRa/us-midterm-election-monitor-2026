import React, { useState, useMemo } from 'react';
import { CountyElectionResult } from '../utils/electionMath';
import { Search, Star } from 'lucide-react';

interface CountyBreakdownViewProps {
  stateCode: string;
  stateName: string;
  counties: CountyElectionResult[];
}

type SortField = 'totalVotes' | 'margin' | 'swing' | 'reportingPct' | 'name';

export const CountyBreakdownView: React.FC<CountyBreakdownViewProps> = ({
  stateCode,
  stateName,
  counties
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('totalVotes');
  const [sortAsc, setSortAsc] = useState(false);

  const filteredAndSortedCounties = useMemo(() => {
    let list = counties.filter(c =>
      c.countyName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    list.sort((a, b) => {
      let diff = 0;
      switch (sortField) {
        case 'totalVotes':
          diff = a.totalVotes - b.totalVotes;
          break;
        case 'margin':
          diff = a.margin - b.margin;
          break;
        case 'swing':
          diff = a.swingVs2022 - b.swingVs2022;
          break;
        case 'reportingPct':
          diff = a.reportingPct - b.reportingPct;
          break;
        case 'name':
          diff = a.countyName.localeCompare(b.countyName);
          break;
      }
      return sortAsc ? diff : -diff;
    });

    return list;
  }, [counties, searchTerm, sortField, sortAsc]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(prev => !prev);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for numbers
    }
  };

  return (
    <div className="space-y-4 text-xs font-mono">
      
      {/* Search and Sort Strip */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search counties in ${stateName}...`}
            className="w-full bg-[#0a0d16] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500 font-sans"
          />
        </div>

        {/* Minimalist Sort Options */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 overflow-x-auto pb-1">
          <span className="text-slate-400 uppercase tracking-wider text-[10px]">Sort:</span>
          <button
            onClick={() => toggleSort('totalVotes')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortField === 'totalVotes'
                ? 'bg-purple-900/60 text-purple-200 font-bold border border-purple-700/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Votes {sortField === 'totalVotes' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => toggleSort('swing')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortField === 'swing'
                ? 'bg-purple-900/60 text-purple-200 font-bold border border-purple-700/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Swing {sortField === 'swing' && (sortAsc ? '↑' : '↓')}
          </button>
          <button
            onClick={() => toggleSort('margin')}
            className={`px-2.5 py-1 rounded-lg transition-colors ${
              sortField === 'margin'
                ? 'bg-purple-900/60 text-purple-200 font-bold border border-purple-700/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            Margin {sortField === 'margin' && (sortAsc ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {/* County List */}
      <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
        {filteredAndSortedCounties.map((county) => {
          const isDemLeading = county.margin > 0;
          const isGopLeading = county.margin < 0;
          const absMargin = Math.abs(county.margin).toFixed(1);
          const demWidth = `${Math.min(100, Math.max(0, county.demPct))}%`;
          const gopWidth = `${Math.min(100, Math.max(0, county.gopPct))}%`;

          return (
            <div
              key={county.countyName}
              className="bg-[#090d16] border border-slate-800/80 rounded-xl p-3.5 hover:border-slate-700 transition-colors space-y-2.5"
            >
              {/* County Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  {county.isKeyCounty && (
                    <span className="text-amber-400 text-xs font-bold shrink-0" title="Key Bellwether County">
                      ★
                    </span>
                  )}
                  <span className="font-bold text-slate-100 truncate text-xs font-sans">
                    {county.countyName}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    {county.reportingPct}% in
                  </span>
                  <span
                    className={`font-bold ${
                      isDemLeading ? 'text-blue-400' : isGopLeading ? 'text-red-400' : 'text-purple-400'
                    }`}
                  >
                    {isDemLeading ? `D +${absMargin}` : isGopLeading ? `R +${absMargin}` : 'TIED'}
                  </span>
                </div>
              </div>

              {/* Vote share bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span className="text-blue-400">
                    {county.demPct}% <span className="text-slate-400">({county.demVotes.toLocaleString('en-US')})</span>
                  </span>
                  <span className="text-red-400">
                    {county.gopPct}% <span className="text-slate-400">({county.gopVotes.toLocaleString('en-US')})</span>
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden flex">
                  <div className="bg-blue-500 h-full" style={{ width: demWidth }} />
                  <div className="bg-red-500 h-full" style={{ width: gopWidth }} />
                </div>
              </div>

              {/* 2022 Comparison & Swing Shift */}
              <div className="flex items-center justify-between text-[10.5px] border-t border-slate-800/80 pt-2 text-slate-400">
                <span>
                  2022: {county.historical2022Margin > 0 ? `D +${county.historical2022Margin.toFixed(1)}` : `R +${Math.abs(county.historical2022Margin).toFixed(1)}`}
                </span>
                <span className={county.swingVs2022 > 0 ? 'text-blue-400' : county.swingVs2022 < 0 ? 'text-red-400' : 'text-slate-400'}>
                  Swing: {county.swingVs2022 > 0 ? `+${county.swingVs2022.toFixed(1)} D` : county.swingVs2022 < 0 ? `+${Math.abs(county.swingVs2022).toFixed(1)} R` : '0.0'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
