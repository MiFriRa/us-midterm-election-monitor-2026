/**
 * Real-Time Election Data Ingestion Service (2026 Midterms)
 *
 * Supports three live ingestion strategies:
 * 1. Public JSON API / Custom Endpoint (DDHQ, AP / State Board JSON, or user webhook)
 * 2. Gemini 3.8 Flash Live Grounding with Google Search (Fetches real-time AP/Reuters/NYT/CNN 2026 election results)
 * 3. Deterministic Simulation Fallback (when polls are not yet closed or offline)
 */

import { GoogleGenAI } from '@google/genai';
import { StateElectionResult } from './electionMath';

export type LiveFeedProvider = 'gemini_live_search' | 'custom_json' | 'simulation';

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
  citations?: string[];
  rawPayload?: unknown;
}

/**
 * Normalizes an arbitrary external JSON payload into our internal `LiveStatePatch` map.
 * Supports:
 * - Standard `{ patches: { PA: { ... } } }` or `{ states: [ { stateCode: 'PA', ... } ] }`
 * - Direct key-value `{ PA: { reportingPct: 45, demVotes: 120000, gopVotes: 118000 } }`
 * - DDHQ / AP style race arrays
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

  // Case 1: Array of state objects (either root array or raw.states / raw.races / raw.results)
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

      // Check nested senate or flat demVotes/gopVotes
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
      if (gov) {
        const dVotes = Number(gov.demVotes ?? gov.dem_votes ?? 0);
        const gVotes = Number(gov.gopVotes ?? gov.gop_votes ?? 0);
        const tot = dVotes + gVotes;
        const dPct = Number(gov.demPct ?? gov.dem_pct ?? (tot > 0 ? ((dVotes / tot) * 100).toFixed(1) : 50));
        const gPct = Number(gov.gopPct ?? gov.gop_pct ?? (tot > 0 ? ((gVotes / tot) * 100).toFixed(1) : 50));
        patch.governor = {
          demVotes: dVotes,
          gopVotes: gVotes,
          demPct: dPct,
          gopPct: gPct,
          status: normalizeCallStatus(gov.status || gov.called)
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
    // Case 2: Map of stateCode -> object (e.g. raw.patches or raw.stateProgress or direct object)
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
 * Fetches live 2026 US Midterm election results via a custom JSON URL.
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

  return {
    timestamp: new Date().toISOString(),
    provider: 'custom_json',
    sourceSummary: `External JSON Feed (${new URL(url).hostname})`,
    nationalReportingPct,
    statesUpdated,
    patches,
    rawPayload: rawData
  };
}

/**
 * Fetches live 2026 US Midterm election results using Gemini 3.8 Flash with Google Search Grounding.
 * Queries Associated Press (AP), Decision Desk HQ, Reuters, NYT, and state election boards in real time.
 */
export async function fetchLiveViaGeminiSearch(apiKey?: string): Promise<LiveSyncResponse> {
  const resolvedKey =
    apiKey ||
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && (process as any).env?.GEMINI_API_KEY) ||
    localStorage.getItem('GEMINI_API_KEY') ||
    '';

  if (!resolvedKey || resolvedKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'Missing Gemini API Key. Enter your Gemini API Key in Data & Tools -> Live Ingestion, or set VITE_GEMINI_API_KEY.'
    );
  }

  const client = new GoogleGenAI({ apiKey: resolvedKey });

  const prompt = `Search for the latest live 2026 US Midterm Election results (November 3, 2026) from Associated Press (AP), Decision Desk HQ, NBC, CNN, NYT, or official State Boards of Elections.
If polls have not closed yet or 0% of votes are reported in a state, set reportingPct to 0 and votes to 0.
Do NOT invent or hallucinate vote counts if polls are still open! Only report actual counted votes and projections that have been reported so far today (Nov 3, 2026).
Return a JSON object containing:
- nationalReportingPct (0 to 100)
- sourceSummary (short description of current election status and sources used)
- states: array of key reporting states (or battlegrounds IN, KY, GA, NC, VA, PA, OH, FL, MI, WI, TX, AZ, NV, ME, NH, IA, CA, NY) with their current reportingPct, Senate/Governor/House vote counts and percentages.`;

  const interaction = await client.interactions.create({
    model: 'gemini-3.8-flash',
    input: prompt,
    tools: [{ type: 'google_search' }],
    response_format: {
      type: 'text',
      mime_type: 'application/json',
      schema: {
        type: 'object',
        properties: {
          nationalReportingPct: { type: 'number' },
          sourceSummary: { type: 'string' },
          states: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                stateCode: { type: 'string' },
                reportingPct: { type: 'number' },
                demVotes: { type: 'number' },
                gopVotes: { type: 'number' },
                demPct: { type: 'number' },
                gopPct: { type: 'number' },
                status: {
                  type: 'string',
                  enum: ['uncalled', 'called_dem', 'called_gop', 'too_close_to_call']
                },
                houseDemSeats: { type: 'number' },
                houseGopSeats: { type: 'number' }
              },
              required: ['stateCode', 'reportingPct', 'demVotes', 'gopVotes', 'status']
            }
          }
        },
        required: ['nationalReportingPct', 'sourceSummary', 'states']
      }
    }
  });

  const text = interaction.output_text || '{}';
  const parsed = JSON.parse(text);
  const { nationalReportingPct, patches } = parseExternalElectionJson(parsed);

  return {
    timestamp: new Date().toISOString(),
    provider: 'gemini_live_search',
    sourceSummary: parsed.sourceSummary || 'Gemini 3.8 Flash + Google Search Grounding (AP / DDHQ)',
    nationalReportingPct,
    statesUpdated: Object.keys(patches).length,
    patches,
    rawPayload: parsed
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
      // State has 0% reporting in the live feed
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
