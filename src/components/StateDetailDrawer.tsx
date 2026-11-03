import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Map as MapIcon, Layers } from 'lucide-react';
import {
  StateElectionResult,
  calculateSwing,
  formatVoteCount,
  getPoliticalImpactAssessment
} from '../utils/electionMath';
import { ChamberType } from './ChamberBalanceBar';
import { getCountiesForState } from '../data/countyData2026';
import { CountyBreakdownView } from './CountyBreakdownView';

interface StateDetailDrawerProps {
  state: StateElectionResult | null;
  chamber: ChamberType;
  onClose: () => void;
}

type DrawerTab = 'overview' | 'counties' | 'districts';

export const StateDetailDrawer: React.FC<StateDetailDrawerProps> = ({
  state,
  chamber,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<DrawerTab>('overview');

  if (!state) return null;

  let demName = 'Democrat';
  let gopName = 'Republican';
  let demVotes = 0;
  let gopVotes = 0;
  let demPct = 50;
  let gopPct = 50;
  let reportingPct = 100;
  let status = 'uncalled';
  let hasRace = true;
  let hist2022Dem = 50;
  let hist2022Gop = 50;

  if (chamber === 'senate') {
    if (state.hasSenateRace && state.senate) {
      demName = state.senate.demCandidate.name;
      gopName = state.senate.gopCandidate.name;
      demVotes = state.senate.demCandidate.votes;
      gopVotes = state.senate.gopCandidate.votes;
      demPct = state.senate.demCandidate.pct;
      gopPct = state.senate.gopCandidate.pct;
      reportingPct = state.senate.reportingPct;
      status = state.senate.status;
      hist2022Dem = state.senate.historical2022.demPct;
      hist2022Gop = state.senate.historical2022.gopPct;
    } else {
      hasRace = false;
    }
  } else if (chamber === 'governor') {
    if (state.hasGovernorRace && state.governor) {
      demName = state.governor.demCandidate.name;
      gopName = state.governor.gopCandidate.name;
      demVotes = state.governor.demCandidate.votes;
      gopVotes = state.governor.gopCandidate.votes;
      demPct = state.governor.demCandidate.pct;
      gopPct = state.governor.gopCandidate.pct;
      reportingPct = state.governor.reportingPct;
      status = state.governor.status;
      hist2022Dem = state.governor.historical2022.demPct;
      hist2022Gop = state.governor.historical2022.gopPct;
    } else {
      hasRace = false;
    }
  } else {
    // House
    if (state.house) {
      demName = `Dem delegation (${state.house.demSeats} mandater)`;
      gopName = `GOP delegation (${state.house.gopSeats} mandater)`;
      demVotes = state.house.popularDemVotes;
      gopVotes = state.house.popularGopVotes;
      const total = demVotes + gopVotes;
      demPct = total > 0 ? Number(((demVotes / total) * 100).toFixed(1)) : 50;
      gopPct = total > 0 ? Number(((gopVotes / total) * 100).toFixed(1)) : 50;
      reportingPct = state.house.reportingPct;
      hist2022Dem = state.house.historical2022.demPopularPct;
      hist2022Gop = state.house.historical2022.gopPopularPct;
    }
  }

  const swing = calculateSwing(demPct, gopPct, hist2022Dem, hist2022Gop);
  const currentMargin = Number((demPct - gopPct).toFixed(1));
  const baseMargin = Number((hist2022Dem - hist2022Gop).toFixed(1));

  const counties = getCountiesForState(state.stateCode, demPct, gopPct, reportingPct);
  const hasKeyDistricts = chamber === 'house' && !!state.house?.keyBattlegroundDistricts && state.house.keyBattlegroundDistricts.length > 0;
  const impact = getPoliticalImpactAssessment(state, chamber);

  return (
    <aside
      className="absolute top-3 right-3 sm:right-6 w-80 sm:w-96 max-h-[calc(100%-24px)] bg-[#0c101a]/95 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-30 backdrop-blur-md animate-in fade-in slide-in-from-right-4 duration-200"
      aria-label={`Details for ${state.stateName}`}
    >
      {/* Bauhaus Clean Header */}
      <div className="p-4 border-b border-slate-800/80 bg-[#090d16] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-black text-xl text-purple-400">
            {state.stateCode}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight leading-tight">
              {state.stateName}
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              {chamber === 'senate' ? 'U.S. Senate (Class 2)' : chamber === 'house' ? `${state.houseSeats} Congressional Districts` : 'Gubernatorial Contest 2026'}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close panel"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs navigation: Overview · Counties · Districts (Clean text tabs) */}
      <div className="flex items-center border-b border-slate-800/80 bg-[#0a0d16] px-5 pt-3 gap-6 text-xs font-mono">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-2.5 font-bold transition-colors border-b-2 ${
            activeTab === 'overview'
              ? 'text-white border-purple-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          Overview
        </button>

        <button
          onClick={() => setActiveTab('counties')}
          className={`pb-2.5 font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
            activeTab === 'counties'
              ? 'text-white border-purple-500'
              : 'text-slate-400 hover:text-slate-200 border-transparent'
          }`}
        >
          <MapIcon className="w-3.5 h-3.5" />
          <span>Counties ({counties.length})</span>
        </button>

        {hasKeyDistricts && (
          <button
            onClick={() => setActiveTab('districts')}
            className={`pb-2.5 font-bold transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'districts'
                ? 'text-white border-purple-500'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Districts ({state.house?.keyBattlegroundDistricts?.length})</span>
          </button>
        )}
      </div>

      {/* Drawer Body: Generous Luft, High Typographic Contrast */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
        
        {activeTab === 'counties' ? (
          <CountyBreakdownView
            stateCode={state.stateCode}
            stateName={state.stateName}
            counties={counties}
          />
        ) : activeTab === 'districts' && hasKeyDistricts ? (
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Key Battleground Districts
            </h3>
            <div className="space-y-2.5">
              {state.house?.keyBattlegroundDistricts?.map(d => (
                <div key={d.district} className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white font-mono text-sm">{d.district}</span>
                    <span className={`font-mono text-xs font-bold ${d.demPct > d.gopPct ? 'text-blue-400' : 'text-red-400'}`}>
                      {d.demPct > d.gopPct ? `D +${(d.demPct - d.gopPct).toFixed(1)}` : `R +${(d.gopPct - d.demPct).toFixed(1)}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300 text-xs">
                    <span className="truncate max-w-[160px]">{d.demName} (D)</span>
                    <span className="truncate max-w-[160px]">{d.gopName} (R)</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1.5 border-t border-slate-800/80">
                    <span>{d.reportingPct}% reported</span>
                    <span className={d.swingVs2022 >= 0 ? 'text-blue-400' : 'text-red-400'}>
                      Swing: {d.swingVs2022 >= 0 ? `+${d.swingVs2022} pp D` : `+${Math.abs(d.swingVs2022)} pp R`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : hasRace ? (
          <>
            {/* Live Reporting & Call Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-slate-300 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Reporting Status
                </span>
                <span className="text-white font-bold">
                  {reportingPct}% in
                </span>
              </div>

              {/* Bauhaus Thin Progress bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${reportingPct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono pt-1">
                <span>Projection:</span>
                <span className="font-semibold text-slate-200">
                  {status === 'called_dem' ? (
                    <span className="text-blue-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Called for Democrats
                    </span>
                  ) : status === 'called_gop' ? (
                    <span className="text-red-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Called for Republicans
                    </span>
                  ) : status === 'too_close_to_call' ? (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Too Close to Call
                    </span>
                  ) : (
                    <span className="text-slate-400">Counting in progress</span>
                  )}
                </span>
              </div>
            </div>

            {/* Political Majority Significance (Bauhaus Editorial Briefing) */}
            <div className="py-4 border-y border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono uppercase tracking-wider text-[11px] text-purple-400 font-bold">
                  Chamber Impact & Majority Weight
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  Weight: {impact.score}/100
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                {impact.whyItMatters}
              </p>
              <div className="text-[11px] text-slate-400 pt-1">
                <span className="text-slate-400">Decisive counties:</span> {impact.decisiveCountiesText}
              </div>
            </div>

            {/* Candidate Breakdown Bars */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                2026 Vote Breakdown
              </h3>

              {/* Democratic Candidate */}
              <div className="space-y-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-blue-400">{demName}</span>
                    <span className="text-[11px] text-slate-400 ml-2 font-mono">DEM</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-extrabold text-blue-400 mr-2">{demPct}%</span>
                    <span className="text-[11px] text-slate-400">{formatVoteCount(demVotes)}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${demPct}%` }} />
                </div>
              </div>

              {/* Republican Candidate */}
              <div className="space-y-1 pt-1">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-sm font-bold text-red-400">{gopName}</span>
                    <span className="text-[11px] text-slate-400 ml-2 font-mono">GOP</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-base font-extrabold text-red-400 mr-2">{gopPct}%</span>
                    <span className="text-[11px] text-slate-400">{formatVoteCount(gopVotes)}</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full" style={{ width: `${gopPct}%` }} />
                </div>
              </div>

              {/* Margen */}
              <div className="pt-3 flex items-center justify-between text-xs font-mono text-slate-300">
                <span>Current Margin:</span>
                <span className="font-bold text-white">
                  {currentMargin > 0 ? `D +${currentMargin} pp` : currentMargin < 0 ? `R +${Math.abs(currentMargin)} pp` : '0.0 pp (Tied)'}
                </span>
              </div>
            </div>

            {/* Comparison with 2022 (Historical Reference) */}
            <div className="p-4 bg-slate-900/50 border border-slate-800/80 rounded-xl space-y-2 text-xs font-mono">
              <div className="text-[11px] uppercase tracking-wider text-slate-400">
                Comparison vs. 2022 Midterm Baseline
              </div>
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="text-[11px] text-slate-400">2022 Margin</div>
                  <div className="text-sm font-bold text-slate-200 mt-0.5">
                    {baseMargin > 0 ? `D +${baseMargin} pp` : `R +${Math.abs(baseMargin)} pp`}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Electoral Swing</div>
                  <div className={`text-sm font-bold mt-0.5 ${swing.swingValue > 0 ? 'text-blue-400' : swing.swingValue < 0 ? 'text-red-400' : 'text-slate-300'}`}>
                    {swing.label}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="py-12 text-center space-y-2">
            <h4 className="text-sm font-bold text-slate-300">No Contest in 2026</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              {state.stateName} has no scheduled election for this chamber in the 2026 cycle. Seat carries over based on historical baseline.
            </p>
          </div>
        )}

      </div>
    </aside>
  );
};
