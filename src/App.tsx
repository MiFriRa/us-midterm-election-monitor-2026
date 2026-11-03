import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ChamberBalanceBar, ChamberType, MapDisplayMode } from './components/ChamberBalanceBar';
import { TopSurprisesDeck } from './components/TopSurprisesDeck';
import { USMap } from './components/USMap';
import { StateDetailDrawer } from './components/StateDetailDrawer';
import { HourlyTimelineController } from './components/HourlyTimelineController';
import { ApiInspectorModal } from './components/ApiInspectorModal';
import { TimelapseVideoModal } from './components/TimelapseVideoModal';
import { LiveAdapterModal } from './components/LiveAdapterModal';
import { ElectionScheduleModal } from './components/ElectionScheduleModal';
import { BASE_STATES, HOURLY_TIMELINE } from './data/electionData2026';
import {
  StateElectionResult,
  calculateNationalChamberTally,
  getTopElectionSurprises
} from './utils/electionMath';
import {
  LiveFeedProvider,
  LiveSyncResponse,
  fetchLiveViaGeminiSearch,
  fetchFromCustomJsonEndpoint,
  applyLivePatchesToStates
} from './utils/liveElectionFeed';

export default function App() {
  const [chamber, setChamber] = useState<ChamberType>('senate');
  const [mapMode, setMapMode] = useState<MapDisplayMode>('purple_margin');
  const [selectedStateId, setSelectedStateId] = useState<string | null>(null);
  // Default to index 0 (Pre-Close / Polls Open) so it never falsely claims LIVE counting before polls close
  const [currentHourIndex, setCurrentHourIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBacktestMode, setIsBacktestMode] = useState<boolean>(false);

  // Modals state
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);
  const [isTimelapseModalOpen, setIsTimelapseModalOpen] = useState<boolean>(false);
  const [isLiveAdapterOpen, setIsLiveAdapterOpen] = useState<boolean>(false);
  const [isElectionScheduleOpen, setIsElectionScheduleOpen] = useState<boolean>(false);

  // Live adapter engine state (default false until counting starts or user enables live polling)
  const [isLivePolling, setIsLivePolling] = useState<boolean>(false);
  const [pollingIntervalSeconds, setPollingIntervalSeconds] = useState<number>(60);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [recordedSnapshotsCount, setRecordedSnapshotsCount] = useState<number>(HOURLY_TIMELINE.length);
  const [selectedFeed, setSelectedFeed] = useState<LiveFeedProvider>('gemini_live_search');
  const [customUrl, setCustomUrl] = useState<string>('/live-test-feed.json');
  const [geminiApiKey, setGeminiApiKey] = useState<string>(() => {
    try {
      return localStorage.getItem('GEMINI_API_KEY') || '';
    } catch {
      return '';
    }
  });
  const [liveSyncData, setLiveSyncData] = useState<LiveSyncResponse | null>(null);
  const [isSyncingLive, setIsSyncingLive] = useState<boolean>(false);
  const [lastSyncStatus, setLastSyncStatus] = useState<{ ok: boolean; message: string; latencyMs?: number } | null>(null);

  const handleGeminiApiKeyChange = (key: string) => {
    setGeminiApiKey(key);
    try {
      if (key) {
        localStorage.setItem('GEMINI_API_KEY', key);
      } else {
        localStorage.removeItem('GEMINI_API_KEY');
      }
    } catch {
      // Ignore storage error
    }
  };

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

  const handleManualSync = useCallback(async () => {
    if (selectedFeed === 'simulation') {
      setLastSyncTime(new Date());
      setLastSyncStatus({
        ok: true,
        message: 'Simulation mode active. Use the bottom timeline bar to step through election night snapshots.',
        latencyMs: 12
      });
      return;
    }

    setIsSyncingLive(true);
    const startMs = performance.now();
    try {
      let response: LiveSyncResponse;
      if (selectedFeed === 'gemini_live_search') {
        response = await fetchLiveViaGeminiSearch(geminiApiKey);
      } else {
        response = await fetchFromCustomJsonEndpoint(customUrl);
      }

      const latencyMs = Math.round(performance.now() - startMs);
      setLiveSyncData(response);
      setIsBacktestMode(false);
      setLastSyncTime(new Date());
      setRecordedSnapshotsCount(prev => prev + 1);
      setLastSyncStatus({
        ok: true,
        message: `Live sync complete (${response.statesUpdated} states processed · National reporting: ${response.nationalReportingPct}%). Source: ${response.sourceSummary}`,
        latencyMs
      });
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startMs);
      setLastSyncStatus({
        ok: false,
        message: err?.message || 'Failed to fetch live election feed. Check API key or endpoint URL.',
        latencyMs
      });
      setIsLiveAdapterOpen(true);
    } finally {
      setIsSyncingLive(false);
    }
  }, [selectedFeed, geminiApiKey, customUrl]);

  const handleTestLivePipeline = useCallback(async () => {
    setIsSyncingLive(true);
    const startMs = performance.now();
    try {
      const response = await fetchFromCustomJsonEndpoint('/live-test-feed.json');
      const latencyMs = Math.round(performance.now() - startMs);
      setLiveSyncData(response);
      setIsBacktestMode(false);
      setLastSyncTime(new Date());
      setRecordedSnapshotsCount(prev => prev + 1);
      setLastSyncStatus({
        ok: true,
        message: `END-TO-END TEST OK (${latencyMs}ms): Modtog ${response.statesUpdated} stater (IN, KY, GA, NC, VA, FL, OH) via JSON-feed. National optælling sat til ${response.nationalReportingPct}%, og Top Surprises + Equal-Area kort er opdateret!`,
        latencyMs
      });
    } catch (err: any) {
      const latencyMs = Math.round(performance.now() - startMs);
      setLastSyncStatus({
        ok: false,
        message: `Test fejlede: ${err?.message || 'Ukendt fejl'}`,
        latencyMs
      });
    } finally {
      setIsSyncingLive(false);
    }
  }, []);

  const handleClearLiveSync = useCallback(() => {
    setLiveSyncData(null);
    setLastSyncStatus({
      ok: true,
      message: 'Nulstillet til 0% (Polls Open) — klar til rigtig optælling kl. 00:00 CET.'
    });
  }, []);
  useEffect(() => {
    if (!isLivePolling) return;
    const interval = setInterval(() => {
      handleManualSync();
    }, pollingIntervalSeconds * 1000);
    return () => clearInterval(interval);
  }, [isLivePolling, pollingIntervalSeconds, handleManualSync]);

  // Derived state data factoring in live sync data, hourly simulation progress, or backtest mode
  const currentStatesData = useMemo<Record<string, StateElectionResult>>(() => {
    // If real live data has been fetched and we are not in backtest or simulation mode
    if (!isBacktestMode && liveSyncData && selectedFeed !== 'simulation') {
      return applyLivePatchesToStates(BASE_STATES, liveSyncData.patches);
    }

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
          copy.house.uncalledSeats = 0;
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

      // Intermediate hourly progress (or index 0 pre-close)
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
          copy.house.popularDemVotes = prog.demVotes;
          copy.house.popularGopVotes = prog.gopVotes;
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
          copy.house.popularDemVotes = 0;
          copy.house.popularGopVotes = 0;
        }
      }

      dataMap[baseState.id] = copy;
    });

    return dataMap;
  }, [currentHourIndex, isBacktestMode, liveSyncData, selectedFeed]);

  // Compute National tally for all three chambers simultaneously
  const senateTally = useMemo(() => {
    return calculateNationalChamberTally(Object.values(currentStatesData), 'senate');
  }, [currentStatesData]);

  const houseTally = useMemo(() => {
    return calculateNationalChamberTally(Object.values(currentStatesData), 'house');
  }, [currentStatesData]);

  const governorTally = useMemo(() => {
    return calculateNationalChamberTally(Object.values(currentStatesData), 'governor');
  }, [currentStatesData]);

  // Compute Top Surprises (ONLY when counting has started — empty when 0% counted)
  const topSurprises = useMemo(() => {
    return getTopElectionSurprises(Object.values(currentStatesData), chamber, 6);
  }, [currentStatesData, chamber]);

  const selectedState = selectedStateId ? currentStatesData[selectedStateId] || null : null;
  const currentSnapshot = HOURLY_TIMELINE[currentHourIndex];
  const isLiveFeedActive = !isBacktestMode && liveSyncData !== null && selectedFeed !== 'simulation';
  const nationalReportingPct = isBacktestMode
    ? 100
    : isLiveFeedActive
    ? liveSyncData.nationalReportingPct
    : currentSnapshot.nationalReportingPct;
  const isCountingActive = !isBacktestMode && nationalReportingPct > 0;

  // Compute CET time representation accurately for each snapshot
  const cetHourMap = ['21:00 CET (Tue)', '01:00 CET', '02:00 CET', '03:00 CET', '04:00 CET', '05:00 CET', '08:00 CET'];
  const currentCetLabel = isLiveFeedActive
    ? `LIVE SYNC (${new Date(liveSyncData.timestamp).toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })} CET)`
    : cetHourMap[currentHourIndex] || '00:00 CET';
  const currentHourLabel = isBacktestMode
    ? '2022 Certified Archive'
    : isLiveFeedActive
    ? liveSyncData.sourceSummary
    : currentSnapshot.hourLabel;

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
    link.setAttribute('download', `election2026_${chamber}_${currentSnapshot.hourLabel.replace(/[\s:()]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#07090e] text-slate-100 flex flex-col selection:bg-purple-500 selection:text-white">
      
      {/* Top Header with European Clock and Honest Status */}
      <Header
        onOpenApiModal={() => setIsApiModalOpen(true)}
        onOpenLiveAdapter={() => setIsLiveAdapterOpen(true)}
        onOpenTimelapseModal={() => setIsTimelapseModalOpen(true)}
        onOpenElectionScheduleModal={() => setIsElectionScheduleOpen(true)}
        onSyncNow={handleManualSync}
        isSyncingLive={isSyncingLive}
        isLivePolling={isLivePolling}
        isCountingActive={isCountingActive}
        isBacktestMode={isBacktestMode}
        currentHourLabel={currentHourLabel}
        currentCetLabel={currentCetLabel}
        onExportCsv={handleExportCsv}
      />

      {/* 1) Status på optælling + 3) Fordeling af pladser i Senate, House & Governors */}
      <ChamberBalanceBar
        chamber={chamber}
        onChamberChange={(c) => setChamber(c)}
        mapMode={mapMode}
        onMapModeChange={(m) => setMapMode(m)}
        senateTally={senateTally}
        houseTally={houseTally}
        governorTally={governorTally}
        nationalReportingPct={nationalReportingPct}
      />

      {/* Main Split Workspace: Big USA Map (Left) + 2) Biggest Surprises vs. 2022 (Right Sidebar) */}
      <main className="relative flex-1 min-h-0 w-full flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Full-Height USA Map Canvas */}
        <div className="relative flex-1 min-h-0 h-full flex flex-col overflow-hidden">
          {isBacktestMode && (
            <div className="absolute top-14 left-4 right-4 z-20 bg-emerald-950/90 border border-emerald-800/80 rounded-xl p-2 px-3 flex items-center justify-between text-xs text-emerald-200 backdrop-blur-md">
              <span className="font-bold font-mono">
                2022 Certified Baseline Active (GOP 222 - DEM 213 House)
              </span>
              <button
                onClick={() => setIsBacktestMode(false)}
                className="text-xs font-semibold text-emerald-300 hover:text-white underline font-mono cursor-pointer"
              >
                Return to 2026 Monitor
              </button>
            </div>
          )}

          <USMap
            statesData={currentStatesData}
            chamber={chamber}
            mapMode={mapMode}
            onMapModeChange={(m) => setMapMode(m)}
            selectedStateId={selectedStateId}
            onSelectState={(id: string) => setSelectedStateId(selectedStateId === id ? null : id)}
            surprises={topSurprises}
          />

          {/* Floating State Inspector Card */}
          {selectedState && (
            <StateDetailDrawer
              state={selectedState}
              chamber={chamber}
              onClose={() => setSelectedStateId(null)}
            />
          )}
        </div>

        {/* Right: 2) Biggest Surprises Relative to 2022 */}
        <TopSurprisesDeck
          surprises={topSurprises}
          selectedStateId={selectedStateId}
          onSelectState={(id: string) => setSelectedStateId(selectedStateId === id ? null : id)}
          nationalReportingPct={nationalReportingPct}
        />

      </main>

      {/* Hourly Timeline Controller */}
      <HourlyTimelineController
        currentHourIndex={currentHourIndex}
        onHourChange={(idx) => {
          setCurrentHourIndex(idx);
          setIsBacktestMode(false);
          setLiveSyncData(null);
        }}
        isPlaying={isPlaying}
        onTogglePlay={() => {
          setLiveSyncData(null);
          setIsPlaying(prev => !prev);
        }}
        isBacktestMode={isBacktestMode}
        onToggleBacktestMode={() => setIsBacktestMode(prev => !prev)}
      />

      {/* Timelapse Video & Replay Studio Modal */}
      <TimelapseVideoModal
        isOpen={isTimelapseModalOpen}
        onClose={() => setIsTimelapseModalOpen(false)}
        snapshots={HOURLY_TIMELINE}
        currentHourIndex={currentHourIndex}
        onSetHourIndex={(idx) => {
          setLiveSyncData(null);
          setCurrentHourIndex(idx);
        }}
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
        onTestLivePipeline={handleTestLivePipeline}
        onClearLiveSync={handleClearLiveSync}
        hasActiveLiveSync={liveSyncData !== null}
        recordedSnapshotsCount={recordedSnapshotsCount}
        selectedFeed={selectedFeed}
        onSelectFeed={(feed) => setSelectedFeed(feed)}
        customUrl={customUrl}
        onCustomUrlChange={(url) => setCustomUrl(url)}
        geminiApiKey={geminiApiKey}
        onGeminiApiKeyChange={handleGeminiApiKeyChange}
        lastSyncStatus={lastSyncStatus}
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
