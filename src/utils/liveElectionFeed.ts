/**
 * Real-Time Election Data Ingestion Service (2026 Midterms)
 *
 * 100% Free & Zero-API-Key Architecture:
 * 1. Public Election JSON Feed (`/live-election-2026.json` or any custom public JSON URL)
 * 2. Automatic CET Real-Time Election Night Schedule Engine
 * 3. Manual / Replay Timeline Mode
 *
 * No paid LLM or Gemini API keys are used or required.
 */

import { StateElectionResult } from './electionMath';

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
 * Computes the appropriate hourly timeline index based on the real-world CET/UTC clock
 * for Election Night & Wednesday Counting (Nov 3-4, 2026):
 * - Before Nov 3 23:30 UTC (00:30 CET): index 0 (0% Pre-Close)
 * - 00:30–01:45 CET: index 1 (19:00 EST / 01:00 CET · 9%)
 * - 01:45–02:45 CET: index 2 (20:00 EST / 02:00 CET · 26%)
 * - 02:45–03:45 CET: index 3 (21:00 EST / 03:00 CET · 46%)
 * - 03:45–04:45 CET: index 4 (22:00 EST / 04:00 CET · 59%)
 * - 04:45–06:15 CET: index 5 (23:00 EST / 05:00 CET · 68%)
 * - 06:15–09:30 CET: index 6 (01:00 EST / 07:00 CET · 76% — Alaska closes, overnight battlegrounds counting)
 * - 09:30–14:00 CET: index 7 (04:00 EST / 10:00 CET · 84% — Late urban & mail precincts)
 * - 14:00–21:00 CET: index 8 (09:00 EST / 15:00 CET · 92% — Wednesday day mail drops)
 * - After 21:00 CET (Wed): index 9 (Final Projection · 100%)
 */
export function getTimelineIndexForRealTime(now: Date = new Date()): number {
  const electionCloseStartUtc = Date.UTC(2026, 10, 3, 23, 30, 0); // Nov 3, 2026 23:30 UTC (00:30 CET)
  const diffHours = (now.getTime() - electionCloseStartUtc) / (1000 * 60 * 60);

  if (diffHours < 0) return 0; // Polls still open (0% counted)
  if (diffHours < 1.25) return 1; // 01:00 CET wave (9%)
  if (diffHours < 2.25) return 2; // 02:00 CET wave (26%)
  if (diffHours < 3.25) return 3; // 03:00 CET wave (46%)
  if (diffHours < 4.25) return 4; // 04:00 CET wave (59%)
  if (diffHours < 5.75) return 5; // 05:00 CET wave (68%)
  if (diffHours < 9.0) return 6;  // 07:00 CET wave (76% — Active Wednesday morning)
  if (diffHours < 13.5) return 7; // 10:00 CET wave (84%)
  if (diffHours < 20.5) return 8; // 15:00 CET wave (92%)
  return 9; // Final Projection
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
