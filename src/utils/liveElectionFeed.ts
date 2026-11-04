/**
 * Real-Time Election Data Ingestion Service (2026 Midterms)
 *
 * 100% Free & Zero-API-Key Architecture:
 * 1. Public Election JSON Feed (`/live-election-2026.json` or any custom public JSON URL)
 * 2. Automatic CET Real-Time Election Night Schedule Engine (with continuous intra-hour interpolation)
 * 3. Manual / Replay Timeline Mode
 *
 * No paid LLM or Gemini API keys are used or required.
 */

import { StateElectionResult } from './electionMath';
import { HOURLY_TIMELINE, computeCallStatus } from '../data/electionData2026';

export type LiveFeedProvider = 'public_json' | 'cet_live_clock' | 'simulation';

export interface LiveStatePatch {
  stateCode: string;
  reportingPct: number;
  senate?: {
    demVotes: number;
    gopVotes: number;
    demPct: number;
    gopPct: number;
    status: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
  };
  governor?: {
    demVotes: number;
    gopVotes: number;
    demPct: number;
    gopPct: number;
    status: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
  };
  house?: {
    demSeats: number;
    gopSeats: number;
    popularDemVotes: number;
    popularGopVotes: number;
  };
}

export interface LiveSyncResponse {
  timestamp: string;
  provider: LiveFeedProvider;
  sourceSummary: string;
  nationalReportingPct: number;
  statesUpdated: number;
  patches: Record<string, LiveStatePatch>;
  rawPayload?: unknown;
}

/**
 * Normalizes an external JSON payload into our internal `LiveStatePatch` map.
 * Supports:
 * - Standard `{ states: [ { stateCode: 'PA', ... } ] }` or `{ races: [...] }`
 * - Direct key-value `{ PA: { reportingPct: 45, demVotes: 120000, gopVotes: 118000 } }`
 */
export function parseExternalElectionJson(raw: any): {
  nationalReportingPct: number;
  patches: Record<string, LiveStatePatch>;
} {
  const patches: Record<string, LiveStatePatch> = {};
  let totalReporting = 0;
  let stateCount = 0;

  if (!raw || typeof raw !== 'object') {
    return { nationalReportingPct: 0, patches };
  }

  const list = Array.isArray(raw)
    ? raw
    : Array.isArray(raw.states)
    ? raw.states
    : Array.isArray(raw.results)
    ? raw.results
    : Array.isArray(raw.races)
    ? raw.races
    : null;

  if (list) {
    for (const item of list) {
      const code = (item.stateCode || item.state || item.id || item.state_postal || '').toUpperCase();
      if (!code || code.length !== 2) continue;

      const repPct = Number(item.reportingPct ?? item.reporting_pct ?? item.pct_reporting ?? item.precinctsReportingPct ?? 0);
      totalReporting += repPct;
      stateCount++;

      const patch: LiveStatePatch = {
        stateCode: code,
        reportingPct: Math.min(100, Math.max(0, repPct))
      };

      const sen = item.senate || (item.chamber === 'senate' ? item : null);
      if (sen || (item.demVotes !== undefined && item.gopVotes !== undefined)) {
        const src = sen || item;
        const dVotes = Number(src.demVotes ?? src.dem_votes ?? 0);
        const gVotes = Number(src.gopVotes ?? src.gop_votes ?? 0);
        const tot = dVotes + gVotes;
        const dPct = Number(src.demPct ?? src.dem_pct ?? (tot > 0 ? ((dVotes / tot) * 100).toFixed(1) : 50));
        const gPct = Number(src.gopPct ?? src.gop_pct ?? (tot > 0 ? ((gVotes / tot) * 100).toFixed(1) : 50));
        patch.senate = {
          demVotes: dVotes,
          gopVotes: gVotes,
          demPct: dPct,
          gopPct: gPct,
          status: normalizeCallStatus(src.status || src.called)
        };
      }

      const gov = item.governor || (item.chamber === 'governor' ? item : null);
      if (gov || (item.demVotes !== undefined && item.gopVotes !== undefined)) {
        const src = gov || item;
        const dVotes = Number(src.demVotes ?? src.dem_votes ?? 0);
        const gVotes = Number(src.gopVotes ?? src.gop_votes ?? 0);
        const tot = dVotes + gVotes;
        const dPct = Number(src.demPct ?? src.dem_pct ?? (tot > 0 ? ((dVotes / tot) * 100).toFixed(1) : 50));
        const gPct = Number(src.gopPct ?? src.gop_pct ?? (tot > 0 ? ((gVotes / tot) * 100).toFixed(1) : 50));
        patch.governor = {
          demVotes: dVotes,
          gopVotes: gVotes,
          demPct: dPct,
          gopPct: gPct,
          status: normalizeCallStatus(src.status || src.called)
        };
      }

      const hse = item.house || (item.houseDemSeats !== undefined ? item : null);
      if (hse) {
        patch.house = {
          demSeats: Number(hse.demSeats ?? hse.houseDemSeats ?? hse.dem_seats ?? 0),
          gopSeats: Number(hse.gopSeats ?? hse.houseGopSeats ?? hse.gop_seats ?? 0),
          popularDemVotes: Number(hse.popularDemVotes ?? hse.demVotes ?? 0),
          popularGopVotes: Number(hse.popularGopVotes ?? hse.gopVotes ?? 0)
        };
      }

      patches[code] = patch;
    }
  } else {
    const mapObj = raw.patches || raw.stateProgress || raw;
    for (const [key, val] of Object.entries(mapObj)) {
      const code = key.toUpperCase();
      if (code.length !== 2 || typeof val !== 'object' || !val) continue;
      const v = val as any;
      const repPct = Number(v.reportingPct ?? v.reporting_pct ?? 0);
      totalReporting += repPct;
      stateCount++;

      const dVotes = Number(v.demVotes ?? v.senate?.demVotes ?? 0);
      const gVotes = Number(v.gopVotes ?? v.senate?.gopVotes ?? 0);
      const tot = dVotes + gVotes;
      const dPct = Number(v.demPct ?? v.senate?.demPct ?? (tot > 0 ? ((dVotes / tot) * 100).toFixed(1) : 50));
      const gPct = Number(v.gopPct ?? v.senate?.gopPct ?? (tot > 0 ? ((gVotes / tot) * 100).toFixed(1) : 50));
      const status = normalizeCallStatus(v.status ?? v.senate?.status);

      patches[code] = {
        stateCode: code,
        reportingPct: repPct,
        senate: {
          demVotes: dVotes,
          gopVotes: gVotes,
          demPct: dPct,
          gopPct: gPct,
          status
        },
        governor: v.governor
          ? {
              demVotes: Number(v.governor.demVotes ?? dVotes),
              gopVotes: Number(v.governor.gopVotes ?? gVotes),
              demPct: Number(v.governor.demPct ?? dPct),
              gopPct: Number(v.governor.gopPct ?? gPct),
              status: normalizeCallStatus(v.governor.status ?? status)
            }
          : {
              demVotes: dVotes,
              gopVotes: gVotes,
              demPct: dPct,
              gopPct: gPct,
              status
            },
        house:
          v.house || (v.houseDemSeats !== undefined && v.houseGopSeats !== undefined)
            ? {
                demSeats: Number(v.house?.demSeats ?? v.houseDemSeats ?? 0),
                gopSeats: Number(v.house?.gopSeats ?? v.houseGopSeats ?? 0),
                popularDemVotes: Number(v.house?.popularDemVotes ?? dVotes),
                popularGopVotes: Number(v.house?.popularGopVotes ?? gVotes)
              }
            : undefined
      };
    }
  }

  const explicitNatPct = Number(raw.nationalReportingPct ?? raw.national_reporting_pct ?? -1);
  const nationalReportingPct =
    explicitNatPct >= 0
      ? explicitNatPct
      : stateCount > 0
      ? Math.round(totalReporting / stateCount)
      : 0;

  return { nationalReportingPct, patches };
}

function normalizeCallStatus(rawStatus: any): 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call' {
  if (!rawStatus) return 'uncalled';
  const s = String(rawStatus).toLowerCase();
  if (s.includes('dem') || s === 'd') return 'called_dem';
  if (s.includes('gop') || s.includes('rep') || s === 'r') return 'called_gop';
  if (s.includes('close') || s.includes('tossup')) return 'too_close_to_call';
  return 'uncalled';
}

/**
 * Fetches live 2026 US Midterm election results via a public JSON URL (zero API keys, zero cost).
 */
export async function fetchFromCustomJsonEndpoint(url: string): Promise<LiveSyncResponse> {
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    cache: 'no-store'
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const rawData = await response.json();
  const { nationalReportingPct, patches } = parseExternalElectionJson(rawData);
  const statesUpdated = Object.keys(patches).length;

  let sourceHost = url;
  try {
    sourceHost = new URL(url, typeof window !== 'undefined' ? window.location.origin : 'http://localhost').hostname;
  } catch {
    // Keep raw url
  }

  return {
    timestamp: new Date().toISOString(),
    provider: 'public_json',
    sourceSummary: rawData.sourceSummary || `Public JSON Feed (${sourceHost})`,
    nationalReportingPct,
    statesUpdated,
    patches,
    rawPayload: rawData
  };
}

/**
 * Anchor hours elapsed since Nov 3, 2026 23:00 UTC (00:00 CET) for each HOURLY_TIMELINE wave:
 * - Index 0: 0h (Pre-Close / 00:00 CET · 0%)
 * - Index 1: 1h (01:00 CET · 9%)
 * - Index 2: 2h (02:00 CET · 26%)
 * - Index 3: 3h (03:00 CET · 46%)
 * - Index 4: 4h (04:00 CET · 59%)
 * - Index 5: 5h (05:00 CET · 68%)
 * - Index 6: 7h (07:00 CET · 76% — Alaska closes)
 * - Index 7: 8h (08:00 CET · 81% — Overnight metro batches)
 * - Index 8: 9h (09:00 CET · 85% — Early morning count)
 * - Index 9: 11h (11:00 CET · 89% — Late morning update)
 * - Index 10: 15h (15:00 CET · 94% — Wednesday afternoon mail drops)
 * - Index 11: 21h (21:00 CET · 100% — Final projection)
 */
const WAVE_HOURS_SINCE_MIDNIGHT_CET = [0, 1, 2, 3, 4, 5, 7, 8, 9, 11, 15, 21];

/**
 * Computes the appropriate hourly timeline index based on the real-world CET/UTC clock
 * for Election Night & Wednesday Counting (Nov 3-4, 2026).
 */
export function getTimelineIndexForRealTime(now: Date = new Date()): number {
  const midnightCetUtc = Date.UTC(2026, 10, 3, 23, 0, 0); // Nov 4, 2026 00:00 CET
  const hoursSinceMidnightCet = (now.getTime() - midnightCetUtc) / (1000 * 60 * 60);

  if (hoursSinceMidnightCet < 0.5) return 0; // Polls still open (0% counted)
  if (hoursSinceMidnightCet < 1.75) return 1; // 01:00 CET wave (9%)
  if (hoursSinceMidnightCet < 2.75) return 2; // 02:00 CET wave (26%)
  if (hoursSinceMidnightCet < 3.75) return 3; // 03:00 CET wave (46%)
  if (hoursSinceMidnightCet < 4.75) return 4; // 04:00 CET wave (59%)
  if (hoursSinceMidnightCet < 6.25) return 5; // 05:00 CET wave (68%)
  if (hoursSinceMidnightCet < 7.75) return 6; // 07:00 CET wave (76%)
  if (hoursSinceMidnightCet < 8.75) return 7; // 08:00 CET wave (81%)
  if (hoursSinceMidnightCet < 10.25) return 8; // 09:00 CET wave (85%)
  if (hoursSinceMidnightCet < 13.5) return 9;  // 11:00 CET wave (89%)
  if (hoursSinceMidnightCet < 20.5) return 10; // 15:00 CET wave (94%)
  return Math.min(HOURLY_TIMELINE.length - 1, 11); // Final Projection
}

/**
 * Generates a continuous, smooth minute-by-minute interpolated live feed response
 * between adjacent CET election night waves so the count progresses steadily in real time
 * instead of sitting frozen on a single percentage between hourly milestones.
 */
export function buildInterpolatedCetLiveSync(
  baseStates: StateElectionResult[],
  now: Date = new Date()
): LiveSyncResponse | null {
  const midnightCetUtc = Date.UTC(2026, 10, 3, 23, 0, 0); // Nov 4, 2026 00:00 CET
  const hours = (now.getTime() - midnightCetUtc) / (1000 * 60 * 60);

  // Before first poll closures or after final projection, rely on standard discrete snapshot
  if (hours < 0.5 || hours >= 21 || HOURLY_TIMELINE.length < 12) {
    return null;
  }

  let lowerIdx = 0;
  for (let i = 0; i < WAVE_HOURS_SINCE_MIDNIGHT_CET.length - 1; i++) {
    if (hours >= WAVE_HOURS_SINCE_MIDNIGHT_CET[i]) {
      lowerIdx = i;
    } else {
      break;
    }
  }
  const upperIdx = Math.min(HOURLY_TIMELINE.length - 1, lowerIdx + 1);
  const startH = WAVE_HOURS_SINCE_MIDNIGHT_CET[lowerIdx];
  const endH = WAVE_HOURS_SINCE_MIDNIGHT_CET[upperIdx];
  const fraction = endH > startH ? Math.max(0, Math.min(1, (hours - startH) / (endH - startH))) : 0;

  const snapA = HOURLY_TIMELINE[lowerIdx];
  const snapB = HOURLY_TIMELINE[upperIdx];

  const nationalReportingPct = Number(
    (snapA.nationalReportingPct + (snapB.nationalReportingPct - snapA.nationalReportingPct) * fraction).toFixed(1)
  );

  const patches: Record<string, LiveStatePatch> = {};
  let statesUpdated = 0;

  baseStates.forEach((st) => {
    const progA = snapA.stateProgress[st.id];
    const progB =
      upperIdx === HOURLY_TIMELINE.length - 1
        ? {
            reportingPct: 100,
            demVotes: st.senate?.demCandidate.votes ?? st.governor?.demCandidate.votes ?? st.house?.popularDemVotes ?? 0,
            gopVotes: st.senate?.gopCandidate.votes ?? st.governor?.gopCandidate.votes ?? st.house?.popularGopVotes ?? 0,
            status: st.senate?.status ?? 'uncalled',
            govDemVotes: st.governor?.demCandidate.votes ?? 0,
            govGopVotes: st.governor?.gopCandidate.votes ?? 0,
            govStatus: st.governor?.status ?? 'uncalled',
            houseDemVotes: st.house?.popularDemVotes ?? 0,
            houseGopVotes: st.house?.popularGopVotes ?? 0,
            houseDemSeats: st.house?.demSeats ?? 0,
            houseGopSeats: st.house?.gopSeats ?? 0
          }
        : snapB.stateProgress[st.id];

    if (!progA && !progB) return;

    const repA = progA?.reportingPct ?? 0;
    const repB = progB?.reportingPct ?? repA;
    const reportingPct = Math.round(repA + (repB - repA) * fraction);
    if (reportingPct <= 0) return;

    statesUpdated++;

    const senDemA = progA?.demVotes ?? 0;
    const senDemB = progB?.demVotes ?? senDemA;
    const senGopA = progA?.gopVotes ?? 0;
    const senGopB = progB?.gopVotes ?? senGopA;
    const senDemVotes = Math.round(senDemA + (senDemB - senDemA) * fraction);
    const senGopVotes = Math.round(senGopA + (senGopB - senGopA) * fraction);
    const senTot = senDemVotes + senGopVotes;
    const senDemPct = senTot > 0 ? Number(((senDemVotes / senTot) * 100).toFixed(1)) : 50;
    const senGopPct = senTot > 0 ? Number(((senGopVotes / senTot) * 100).toFixed(1)) : 50;

    const govDemA = progA?.govDemVotes ?? senDemA;
    const govDemB = progB?.govDemVotes ?? senDemB;
    const govGopA = progA?.govGopVotes ?? senGopA;
    const govGopB = progB?.govGopVotes ?? senGopB;
    const govDemVotes = Math.round(govDemA + (govDemB - govDemA) * fraction);
    const govGopVotes = Math.round(govGopA + (govGopB - govGopA) * fraction);
    const govTot = govDemVotes + govGopVotes;
    const govDemPct = govTot > 0 ? Number(((govDemVotes / govTot) * 100).toFixed(1)) : 50;
    const govGopPct = govTot > 0 ? Number(((govGopVotes / govTot) * 100).toFixed(1)) : 50;

    const hDemVotesA = progA?.houseDemVotes ?? senDemA;
    const hDemVotesB = progB?.houseDemVotes ?? senDemB;
    const hGopVotesA = progA?.houseGopVotes ?? senGopA;
    const hGopVotesB = progB?.houseGopVotes ?? senGopB;
    const houseDemVotes = Math.round(hDemVotesA + (hDemVotesB - hDemVotesA) * fraction);
    const houseGopVotes = Math.round(hGopVotesA + (hGopVotesB - hGopVotesA) * fraction);

    const hDemSeatsA = progA?.houseDemSeats ?? 0;
    const hDemSeatsB = progB?.houseDemSeats ?? hDemSeatsA;
    const hGopSeatsA = progA?.houseGopSeats ?? 0;
    const hGopSeatsB = progB?.houseGopSeats ?? hGopSeatsA;
    const houseDemSeats = Math.round(hDemSeatsA + (hDemSeatsB - hDemSeatsA) * fraction);
    const houseGopSeats = Math.round(hGopSeatsA + (hGopSeatsB - hGopSeatsA) * fraction);

    patches[st.id] = {
      stateCode: st.id,
      reportingPct,
      senate: st.senate
        ? {
            demVotes: senDemVotes,
            gopVotes: senGopVotes,
            demPct: senDemPct,
            gopPct: senGopPct,
            status: computeCallStatus(senDemVotes, senGopVotes, reportingPct, st.senate.status)
          }
        : undefined,
      governor: st.governor
        ? {
            demVotes: govDemVotes,
            gopVotes: govGopVotes,
            demPct: govDemPct,
            gopPct: govGopPct,
            status: computeCallStatus(govDemVotes, govGopVotes, reportingPct, st.governor.status)
          }
        : undefined,
      house: st.house
        ? {
            demSeats: houseDemSeats,
            gopSeats: houseGopSeats,
            popularDemVotes: houseDemVotes,
            popularGopVotes: houseGopVotes
          }
        : undefined
    };
  });

  const cetTimeStr = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Copenhagen'
  });

  return {
    timestamp: now.toISOString(),
    provider: 'cet_live_clock',
    sourceSummary: `${cetTimeStr} CET Live Wave (${snapA.cetLabel} → ${snapB.cetLabel})`,
    nationalReportingPct,
    statesUpdated,
    patches
  };
}

/**
 * Applies a map of live state patches onto our 50-state baseline dataset.
 */
export function applyLivePatchesToStates(
  baseStates: StateElectionResult[],
  patches: Record<string, LiveStatePatch>
): Record<string, StateElectionResult> {
  const result: Record<string, StateElectionResult> = {};

  baseStates.forEach(base => {
    const copy: StateElectionResult = JSON.parse(JSON.stringify(base));
    const patch = patches[base.id];

    if (patch && patch.reportingPct > 0) {
      if (copy.senate && patch.senate) {
        copy.senate.reportingPct = patch.reportingPct;
        copy.senate.demCandidate.votes = patch.senate.demVotes;
        copy.senate.gopCandidate.votes = patch.senate.gopVotes;
        copy.senate.demCandidate.pct = patch.senate.demPct;
        copy.senate.gopCandidate.pct = patch.senate.gopPct;
        copy.senate.status = patch.senate.status;
      }
      if (copy.governor && patch.governor) {
        copy.governor.reportingPct = patch.reportingPct;
        copy.governor.demCandidate.votes = patch.governor.demVotes;
        copy.governor.gopCandidate.votes = patch.governor.gopVotes;
        copy.governor.demCandidate.pct = patch.governor.demPct;
        copy.governor.gopCandidate.pct = patch.governor.gopPct;
        copy.governor.status = patch.governor.status;
      }
      if (copy.house) {
        copy.house.reportingPct = patch.reportingPct;
        if (patch.house) {
          copy.house.demSeats = patch.house.demSeats;
          copy.house.gopSeats = patch.house.gopSeats;
          copy.house.uncalledSeats = Math.max(0, copy.house.totalSeats - patch.house.demSeats - patch.house.gopSeats);
          copy.house.popularDemVotes = patch.house.popularDemVotes;
          copy.house.popularGopVotes = patch.house.popularGopVotes;
        }
      }
    } else {
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

    result[base.id] = copy;
  });

  return result;
}
