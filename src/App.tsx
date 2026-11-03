import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ChamberBalanceBar, ChamberType, MapDisplayMode } from './components/ChamberBalanceBar';
import { USMap } from './components/USMap';
import { StateDetailDrawer } from './components/StateDetailDrawer';
import { HourlyTimelineController } from './components/HourlyTimelineController';
import { ApiInspectorModal } from './components/ApiInspectorModal';
import { BreakingNewsTicker } from './components/BreakingNewsTicker';
import { TimelapseVideoModal } from './components/TimelapseVideoModal';
import { LiveAdapterModal } from './components/LiveAdapterModal';
import { ElectionScheduleModal } from './components/ElectionScheduleModal';
import { BASE_STATES, HOURLY_TIMELINE } from './data/electionData2026';
import {
  StateElectionResult,
  calculateNationalChamberTally,
  getTopElectionSurprises
} from './utils/electionMath';

export default function App() {
  const [chamber, setChamber] = useState<ChamberType>('senate');
  const [mapMode, setMapMode] = useState<MapDisplayMode>('purple_margin');
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  const [currentHourIndex, setCurrentHourIndex] = useState<number>(3); // 22:00 EST / 04:00 CET
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBacktestMode, setIsBacktestMode] = useState<boolean>(false);

  // Modals state
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isTimelapseModalOpen, setIsTimelapseModalOpen] = useState<boolean>(false);
  const [isLiveAdapterOpen, setIsLiveAdapterOpen] = useState<boolean>(false);
  const [isElectionScheduleOpen, setIsElectionScheduleOpen] = useState<boolean>(false);

  // Live adapter engine state
  const [isLivePolling, setIsLivePolling] = useState<boolean>(true);
  const [pollingIntervalSeconds, setPollingIntervalSeconds] = useState<number>(30);
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [recordedSnapshotsCount, setRecordedSnapshotsCount] = useState<number>(HOURLY_TIMELINE.length);

  // Auto-advance timeline when isPlaying is active
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentHourIndex(prev => {
        if (prev >= HOURLY_TIMELINE.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Live adapter polling interval timer
  useEffect(() => {
    if (!isLivePolling) return;
    const interval = setInterval(() => {
      setLastSyncTime(new Date());
      // Slight periodic simulation heartbeat
      setRecordedSnapshotsCount(prev => prev + 1);
    }, pollingIntervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [isLivePolling, pollingIntervalSeconds]);

  const handleManualSync = useCallback(async () => {
    // Simulate real feed roundtrip
    await new Promise(r => setTimeout(r, 600));
    setLastSyncTime(new Date());
    setRecordedSnapshotsCount(prev => prev + 1);
  }, []);

  // Derived state data factoring in hourly simulation progress or backtest mode
  const currentStatesData = useMemo<Record<string, StateElectionResult>>(() => {
    const dataMap: Record<string, StateElectionResult> = {};
    const snapshot = HOURLY_TIMELINE[currentHourIndex];

    BASE_STATES.forEach(baseState => {
      // If pure 2022 backtest mode is requested
      if (isBacktestMode) {
        const copy: StateElectionResult = JSON.parse(JSON.stringify(baseState));
        if (copy.senate) {
          copy.senate.demCandidate.pct = copy.senate.historical2022.demPct;
          copy.senate.gopCandidate.pct = copy.senate.historical2022.gopPct;
          copy.senate.reportingPct = 100;
          copy.senate.status = copy.senate.historical2022.winner === 'dem' ? 'called_dem' : 'called_gop';
        }
        if (copy.governor) {
          copy.governor.demCandidate.pct = copy.governor.historical2022.demPct;
          copy.governor.gopCandidate.pct = copy.governor.historical2022.gopPct;
          copy.governor.reportingPct = 100;
          copy.governor.status = copy.governor.historical2022.winner === 'dem' ? 'called_dem' : 'called_gop';
        }
        if (copy.house) {
          copy.house.demSeats = copy.house.historical2022.demSeats;
          copy.house.gopSeats = copy.house.historical2022.gopSeats;
          copy.house.reportingPct = 100;
        }
        dataMap[baseState.id] = copy;
        return;
      }

      // If at final call (last index), use complete 2026 data
      if (currentHourIndex === HOURLY_TIMELINE.length - 1) {
        dataMap[baseState.id] = baseState;
        return;
      }

      // Intermediate hourly progress
      const copy: StateElectionResult = JSON.parse(JSON.stringify(baseState));
      const prog = snapshot.stateProgress[baseState.id];

      if (prog) {
        // State has poll closure and reporting in this snapshot
        if (copy.senate) {
          copy.senate.reportingPct = prog.reportingPct;
          copy.senate.status = prog.status;
          copy.senate.demCandidate.votes = prog.demVotes;
          copy.senate.gopCandidate.votes = prog.gopVotes;
          const total = prog.demVotes + prog.gopVotes;
          if (total > 0) {
            copy.senate.demCandidate.pct = Number(((prog.demVotes / total) * 100).toFixed(1));
            copy.senate.gopCandidate.pct = Number(((prog.gopVotes / total) * 100).toFixed(1));
          }
        }
        if (copy.governor) {
          copy.governor.reportingPct = prog.reportingPct;
          copy.governor.status = prog.status;
          copy.governor.demCandidate.votes = prog.demVotes;
          copy.governor.gopCandidate.votes = prog.gopVotes;
          const total = prog.demVotes + prog.gopVotes;
          if (total > 0) {
            copy.governor.demCandidate.pct = Number(((prog.demVotes / total) * 100).toFixed(1));
            copy.governor.gopCandidate.pct = Number(((prog.gopVotes / total) * 100).toFixed(1));
          }
        }
        if (copy.house && prog.houseDemSeats !== undefined && prog.houseGopSeats !== undefined) {
          copy.house.demSeats = prog.houseDemSeats;
          copy.house.gopSeats = prog.houseGopSeats;
          copy.house.uncalledSeats = copy.house.totalSeats - prog.houseDemSeats - prog.houseGopSeats;
          copy.house.reportingPct = prog.reportingPct;
        }
      } else {
        // Polls not closed yet in this hour
        if (copy.senate) {
          copy.senate.reportingPct = 0;
          copy.senate.status = 'uncalled';
          copy.senate.demCandidate.votes = 0;
          copy.senate.gopCandidate.votes = 0;
        }
        if (copy.governor) {
          copy.governor.reportingPct = 0;
          copy.governor.status = 'uncalled';
          copy.governor.demCandidate.votes = 0;
          copy.governor.gopCandidate.votes = 0;
        }
        if (copy.house) {
          copy.house.demSeats = 0;
          copy.house.gopSeats = 0;
          copy.house.uncalledSeats = copy.house.totalSeats;
          copy.house.reportingPct = 0;
        }
      }

      dataMap[baseState.id] = copy;
    });

    return dataMap;
  }, [currentHourIndex, isBacktestMode]);

  // Compute National tally for selected chamber
  const chamberTally = useMemo(() => {
    return calculateNationalChamberTally(Object.values(currentStatesData), chamber);
  }, [currentStatesData, chamber]);

  // Compute Signal 2: Top Surprises (Largest swings / Flips vs 2022)
  const topSurprises = useMemo(() => {
    return getTopElectionSurprises(Object.values(currentStatesData), chamber, 5);
  }, [currentStatesData, chamber]);

  const selectedState = selectedStateId ? currentStatesData[selectedStateId] || null : null;
  const currentSnapshot = HOURLY_TIMELINE[currentHourIndex];

  // Compute CET time representation
  const cetHour = (19 + currentHourIndex + 6) % 24;
  const currentCetLabel = `${String(cetHour).padStart(2, '0')}:00 CET`;

  const handleExportCsv = () => {
    const rows = [
      ['StateCode', 'StateName', 'Chamber', 'DemCandidate', 'DemVotes', 'DemPct', 'GOPCandidate', 'GOPVotes', 'GOPPct', 'ReportingPct', 'Margin2026', 'Margin2022', 'SwingDelta', 'Status']
    ];

    Object.values(currentStatesData).forEach(st => {
      let demCand = '';
      let demVotes = 0;
      let demPct = 0;
      let gopCand = '';
      let gopVotes = 0;
      let gopPct = 0;
      let repPct = 0;
      let status = 'uncalled';
      let margin2022 = 0;

      if (chamber === 'senate' && st.senate) {
        demCand = st.senate.demCandidate.name;
        demVotes = st.senate.demCandidate.votes;
        demPct = st.senate.demCandidate.pct;
        gopCand = st.senate.gopCandidate.name;
        gopVotes = st.senate.gopCandidate.votes;
        gopPct = st.senate.gopCandidate.pct;
        repPct = st.senate.reportingPct;
        status = st.senate.status;
        margin2022 = st.senate.historical2022.margin;
      } else if (chamber === 'governor' && st.governor) {
        demCand = st.governor.demCandidate.name;
        demVotes = st.governor.demCandidate.votes;
        demPct = st.governor.demCandidate.pct;
        gopCand = st.governor.gopCandidate.name;
        gopVotes = st.governor.gopCandidate.votes;
        gopPct = st.governor.gopCandidate.pct;
        repPct = st.governor.reportingPct;
        status = st.governor.status;
        margin2022 = st.governor.historical2022.margin;
      } else if (chamber === 'house' && st.house) {
        demCand = `${st.house.demSeats} Dem seats`;
        demVotes = st.house.popularDemVotes;
        demPct = Number(((st.house.popularDemVotes / (st.house.popularDemVotes + st.house.popularGopVotes || 1)) * 100).toFixed(1));
        gopCand = `${st.house.gopSeats} GOP seats`;
        gopVotes = st.house.popularGopVotes;
        gopPct = Number(((st.house.popularGopVotes / (st.house.popularDemVotes + st.house.popularGopVotes || 1)) * 100).toFixed(1));
        repPct = st.house.reportingPct;
        status = `${st.house.demSeats}D-${st.house.gopSeats}R`;
        margin2022 = st.house.historical2022.margin;
      } else {
        return;
      }

      const margin2026 = Number((demPct - gopPct).toFixed(1));
      const swing = Number((margin2026 - margin2022).toFixed(1));

      rows.push([
        st.stateCode,
        `"${st.stateName}"`,
        chamber,
        `"${demCand}"`,
        demVotes.toString(),
        `${demPct}%`,
        `"${gopCand}"`,
        gopVotes.toString(),
        `${gopPct}%`,
        `${repPct}%`,
        margin2026.toString(),
        margin2022.toString(),
        swing.toString(),
        status
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `election2026_${chamber}_${currentSnapshot.hourLabel.replace(/[\s:]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#07090e] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      
      {/* Top Header with European Clock and UX Dropdown */}
      <Header
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenLiveAdapter={() => setIsLiveAdapterOpen(true)}
        onOpenTimelapseModal={() => setIsTimelapseModalOpen(true)}
        onOpenElectionScheduleModal={() => setIsElectionScheduleOpen(true)}
        isLivePolling={isLivePolling}
        currentHourLabel={isBacktestMode ? '2022 Backtest Replay' : currentSnapshot.hourLabel}
        currentCetLabel={isBacktestMode ? '2022 Reference' : currentCetLabel}
        onExportCsv={handleExportCsv}
      />

      {/* Chamber Balance & Mode Strip + Signal 1 (Progress) + Signal 2 (Top Surprises) */}
      <ChamberBalanceBar
        chamber={chamber}
        onChamberChange={(c) => setChamber(c)}
        mapMode={mapMode}
        onMapModeChange={(m) => setMapMode(m)}
        tally={chamberTally}
        nationalReportingPct={isBacktestMode ? 100 : currentSnapshot.nationalReportingPct}
        surprises={topSurprises}
        selectedStateId={selectedStateId}
        onSelectState={(id) => setSelectedStateId(selectedStateId === id ? null : id)}
      />

      {/* Main Full-Width Map Canvas Area — 100% Screen Width, Zero Cutoff */}
      <main className="relative flex-1 min-h-0 w-full flex flex-col overflow-hidden">
        
        {/* Backtest Notification Banner when active */}
        {isBacktestMode && (
          <div className="absolute top-2 left-4 right-4 z-20 bg-emerald-950/90 border border-emerald-800/80 rounded-xl p-2 px-3 flex items-center justify-between text-xs text-emerald-200 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider font-mono bg-emerald-900 px-2 py-0.5 rounded text-[10px]">
                2022 Historical Baseline Active
              </span>
              <span className="text-[11px]">Displaying certified official results from the 2022 midterms across all 50 states as ground truth.</span>
            </div>
            <button
              onClick={() => setIsBacktestMode(false)}
              className="text-xs font-semibold text-emerald-300 hover:text-white underline font-mono"
            >
              Return to 2026 Live Desk
            </button>
          </div>
        )}

        {/* Full-Width Map Canvas with auto-scaling to viewport */}
        <USMap
          statesData={currentStatesData}
          chamber={chamber}
          mapMode={mapMode}
          selectedStateId={selectedStateId}
          onSelectState={(id) => setSelectedStateId(selectedStateId === id ? null : id)}
        />

        {/* Floating Bauhaus State Inspector Card (Does NOT displace or compress map) */}
        {selectedState && (
          <StateDetailDrawer
            state={selectedState}
            chamber={chamber}
            onClose={() => setSelectedStateId(null)}
          />
        )}
      </main>

      {/* Hourly Timeline Controller */}
      <HourlyTimelineController
        currentHourIndex={currentHourIndex}
        onHourChange={(idx) => {
          setCurrentHourIndex(idx);
          setIsBacktestMode(false);
        }}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(prev => !prev)}
        isBacktestMode={isBacktestMode}
        onToggleBacktestMode={() => setIsBacktestMode(prev => !prev)}
      />

      {/* Timelapse Video & Replay Studio Modal */}
      <TimelapseVideoModal
        isOpen={isTimelapseModalOpen}
        onClose={() => setIsTimelapseModalOpen(false)}
        snapshots={HOURLY_TIMELINE}
        currentHourIndex={currentHourIndex}
        onSetHourIndex={(idx) => setCurrentHourIndex(idx)}
      />

      {/* Live Data Adapter Modal */}
      <LiveAdapterModal
        isOpen={isLiveAdapterOpen}
        onClose={() => setIsLiveAdapterOpen(false)}
        isLivePolling={isLivePolling}
        onTogglePolling={(enabled) => setIsLivePolling(enabled)}
        pollingIntervalSeconds={pollingIntervalSeconds}
        onSetPollingInterval={(sec) => setPollingIntervalSeconds(sec)}
        lastSyncTime={lastSyncTime}
        onManualSync={handleManualSync}
        recordedSnapshotsCount={recordedSnapshotsCount}
      />

      {/* Election Schedule & CET Times Modal */}
      <ElectionScheduleModal
        isOpen={isElectionScheduleOpen}
        onClose={() => setIsElectionScheduleOpen(false)}
      />

      {/* API Configuration & Backtesting Modal */}
      <ApiInspectorModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        statesData={currentStatesData}
      />

    </div>
  );
}
