/**
 * Core mathematical and cartographic functions for the US Midterm Election Monitor 2026.
 * Computes two-party vote shares, color blending (Red-Purple-Blue), swing deltas,
 * and chamber majority seat allocations.
 */

export interface CandidateResult {
  name: string;
  party: 'DEM' | 'GOP' | 'IND' | 'LIB' | 'GRN';
  votes: number;
  pct: number;
}

export interface HistoricalBaseline {
  demPct: number;
  gopPct: number;
  margin: number; // positive = Dem, negative = GOP
  winner: 'dem' | 'gop';
  reportingPct: number;
}

export interface StateElectionResult {
  id: string; // state code e.g. 'PA'
  stateCode: string;
  stateName: string;
  hasSenateRace: boolean;
  hasGovernorRace: boolean;
  houseSeats: number;
  electoralWeight?: number;
  
  // Current 2026 metrics per chamber
  senate?: {
    demCandidate: CandidateResult;
    gopCandidate: CandidateResult;
    otherVotes: number;
    reportingPct: number;
    status: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
    historical2022: HistoricalBaseline;
    historical2018?: HistoricalBaseline;
  };

  governor?: {
    demCandidate: CandidateResult;
    gopCandidate: CandidateResult;
    otherVotes: number;
    reportingPct: number;
    status: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
    historical2022: HistoricalBaseline;
    historical2018?: HistoricalBaseline;
  };

  house?: {
    totalSeats: number;
    demSeats: number;
    gopSeats: number;
    uncalledSeats: number;
    popularDemVotes: number;
    popularGopVotes: number;
    reportingPct: number;
    historical2022: {
      demSeats: number;
      gopSeats: number;
      demPopularPct: number;
      gopPopularPct: number;
      margin: number;
    };
    keyBattlegroundDistricts?: Array<{
      district: string; // e.g. 'PA-07'
      demName: string;
      gopName: string;
      demVotes: number;
      gopVotes: number;
      demPct: number;
      gopPct: number;
      reportingPct: number;
      status: 'uncalled' | 'called_dem' | 'called_gop';
      swingVs2022: number;
    }>;
  };

  // Optional county-level breakdown for battleground and major states
  counties?: CountyElectionResult[];
}

export interface CountyElectionResult {
  countyName: string;
  fips?: string;
  totalVotes: number;
  demVotes: number;
  gopVotes: number;
  demPct: number;
  gopPct: number;
  margin: number; // positive = Dem lead, negative = GOP lead
  reportingPct: number;
  historical2022DemPct: number;
  historical2022GopPct: number;
  historical2022Margin: number;
  swingVs2022: number; // positive = swing to DEM
  outstandingVotesEstimate?: number;
  isKeyCounty?: boolean;
}

/**
 * Calculates two-party margins and shares.
 * Margin is expressed as Dem % minus GOP %.
 * Positive margin = Democratic lead. Negative margin = Republican lead.
 */
export function calculateTwoPartyMargin(demVotes: number, gopVotes: number): {
  demPct: number;
  gopPct: number;
  margin: number;
  twoPartyRatio: number; // 0 (100% GOP) to 1 (100% Dem), 0.5 is dead tie
} {
  const twoPartyTotal = demVotes + gopVotes;
  if (twoPartyTotal <= 0) {
    return { demPct: 50, gopPct: 50, margin: 0, twoPartyRatio: 0.5 };
  }
  const demPct = Number(((demVotes / twoPartyTotal) * 100).toFixed(2));
  const gopPct = Number(((gopVotes / twoPartyTotal) * 100).toFixed(2));
  const margin = Number((demPct - gopPct).toFixed(2));
  const twoPartyRatio = Number((demVotes / twoPartyTotal).toFixed(4));
  return { demPct, gopPct, margin, twoPartyRatio };
}

/**
 * Helper to interpolate between two RGB colors
 */
function interpolateRgb(c1: [number, number, number], c2: [number, number, number], factor: number): [number, number, number] {
  const f = Math.max(0, Math.min(1, factor));
  return [
    Math.round(c1[0] + (c2[0] - c1[0]) * f),
    Math.round(c1[1] + (c2[1] - c1[1]) * f),
    Math.round(c1[2] + (c2[2] - c1[2]) * f)
  ];
}

function rgbToHex(rgb: [number, number, number]): string {
  return '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
}

/**
 * Calculates the color for a state based on its two-party vote share.
 * Seamlessly blends from Red through varying shades of Purple/Violet to Blue.
 *
 * At 50/50 (ratio 0.50): Pure royal purple/violet (#8b2dcd / [139, 45, 205])
 * As it leans Dem (> 0.50): Transitions through bluish-purple/indigo to deep cobalt blue (#1d4ed8 / [29, 78, 216])
 * As it leans GOP (< 0.50): Transitions through reddish-purple/plum to deep crimson red (#dc2626 / [220, 38, 38])
 */
export function getPurpleGradientColor(
  demPct: number,
  gopPct: number,
  reportingPct: number = 100
): string {
  // If zero votes reported, return a subdued slate
  if (reportingPct === 0 || (demPct === 0 && gopPct === 0)) {
    return '#1e293b'; // slate-800
  }

  const twoPartyTotal = demPct + gopPct;
  const ratio = twoPartyTotal > 0 ? demPct / twoPartyTotal : 0.5;

  // Key anchor stops:
  // ratio <= 0.35: Safe GOP Red
  // ratio = 0.42: Likely GOP Red-Plum
  // ratio = 0.46: Lean GOP Reddish-Purple
  // ratio = 0.50: Tossup Pure Purple
  // ratio = 0.54: Lean Dem Bluish-Purple
  // ratio = 0.58: Likely Dem Indigo
  // ratio >= 0.65: Safe Dem Blue

  const COLOR_SAFE_GOP: [number, number, number] = [220, 38, 38];    // #dc2626
  const COLOR_LIKELY_GOP: [number, number, number] = [190, 34, 85];  // plum red
  const COLOR_LEAN_GOP: [number, number, number] = [160, 38, 140];   // reddish purple
  const COLOR_PURPLE_TIE: [number, number, number] = [139, 45, 205]; // #8b2dcd royal purple
  const COLOR_LEAN_DEM: [number, number, number] = [100, 55, 215];   // bluish purple
  const COLOR_LIKELY_DEM: [number, number, number] = [59, 75, 225];  // indigo blue
  const COLOR_SAFE_DEM: [number, number, number] = [29, 78, 216];    // #1d4ed8

  let finalRgb: [number, number, number];

  if (ratio <= 0.35) {
    finalRgb = COLOR_SAFE_GOP;
  } else if (ratio < 0.42) {
    const f = (ratio - 0.35) / (0.42 - 0.35);
    finalRgb = interpolateRgb(COLOR_SAFE_GOP, COLOR_LIKELY_GOP, f);
  } else if (ratio < 0.46) {
    const f = (ratio - 0.42) / (0.46 - 0.42);
    finalRgb = interpolateRgb(COLOR_LIKELY_GOP, COLOR_LEAN_GOP, f);
  } else if (ratio < 0.50) {
    const f = (ratio - 0.46) / (0.50 - 0.46);
    finalRgb = interpolateRgb(COLOR_LEAN_GOP, COLOR_PURPLE_TIE, f);
  } else if (ratio === 0.50) {
    finalRgb = COLOR_PURPLE_TIE;
  } else if (ratio < 0.54) {
    const f = (ratio - 0.50) / (0.54 - 0.50);
    finalRgb = interpolateRgb(COLOR_PURPLE_TIE, COLOR_LEAN_DEM, f);
  } else if (ratio < 0.58) {
    const f = (ratio - 0.54) / (0.58 - 0.54);
    finalRgb = interpolateRgb(COLOR_LEAN_DEM, COLOR_LIKELY_DEM, f);
  } else if (ratio < 0.65) {
    const f = (ratio - 0.58) / (0.65 - 0.58);
    finalRgb = interpolateRgb(COLOR_LIKELY_DEM, COLOR_SAFE_DEM, f);
  } else {
    finalRgb = COLOR_SAFE_DEM;
  }

  // Slightly reduce luminance if reporting is early (< 20%) to show uncalled/early state
  if (reportingPct < 25) {
    finalRgb = interpolateRgb([30, 41, 59], finalRgb, 0.65);
  }

  return rgbToHex(finalRgb);
}

/**
 * Calculates the electoral swing between current 2026 margin and baseline 2022 margin.
 * Swing = currentMargin - baselineMargin.
 * A positive swing means the state swung toward the Democratic party.
 * A negative swing means the state swung toward the Republican party.
 */
export function calculateSwing(
  currentDemPct: number,
  currentGopPct: number,
  baselineDemPct: number,
  baselineGopPct: number
): {
  swingValue: number; // positive = Dem swing, negative = GOP swing
  direction: 'dem' | 'gop' | 'even';
  label: string; // e.g. "+3.4 pp D" or "+2.1 pp R" or "Even"
  color: string;
} {
  const currentMargin = currentDemPct - currentGopPct;
  const baselineMargin = baselineDemPct - baselineGopPct;
  const swing = Number((currentMargin - baselineMargin).toFixed(2));

  if (Math.abs(swing) < 0.05) {
    return {
      swingValue: 0,
      direction: 'even',
      label: '0.0 pp (Even)',
      color: '#94a3b8'
    };
  }

  if (swing > 0) {
    return {
      swingValue: swing,
      direction: 'dem',
      label: `+${swing.toFixed(1)} pp D`,
      color: '#3b82f6'
    };
  } else {
    const absSwing = Math.abs(swing);
    return {
      swingValue: swing,
      direction: 'gop',
      label: `+${absSwing.toFixed(1)} pp R`,
      color: '#ef4444'
    };
  }
}

/**
 * Provides a dedicated color specifically for the "Swing Map Mode".
 * Highlights states by how much they shifted compared to 2022.
 */
export function getSwingMapColor(swingValue: number): string {
  // Magnitude ranges from -15 to +15 pp swing
  if (Math.abs(swingValue) < 0.5) return '#334155'; // slate-700 neutral
  
  if (swingValue > 0) {
    // Dem shift (cyan-blue to deep blue)
    if (swingValue >= 8) return '#1d4ed8'; // strong D swing
    if (swingValue >= 4) return '#3b82f6'; // moderate D swing
    return '#60a5fa'; // light D swing
  } else {
    // GOP shift (salmon to deep crimson)
    const abs = Math.abs(swingValue);
    if (abs >= 8) return '#dc2626'; // strong R swing
    if (abs >= 4) return '#ef4444'; // moderate R swing
    return '#f87171'; // light R swing
  }
}

/**
 * Calculates chamber balance summary.
 * Majority thresholds:
 * - Senate: 51 seats (or 50 with VP)
 * - House: 218 seats (of 435)
 * - Governor: 26 (of 50 states)
 */
export function calculateNationalChamberTally(
  results: StateElectionResult[],
  chamber: 'senate' | 'house' | 'governor'
): {
  demSeats: number;
  gopSeats: number;
  uncalledSeats: number;
  majorityThreshold: number;
  flipsToDem: number;
  flipsToGop: number;
  statusText: string;
} {
  let demSeats = 0;
  let gopSeats = 0;
  let uncalledSeats = 0;
  let flipsToDem = 0;
  let flipsToGop = 0;

  if (chamber === 'senate') {
    // Baseline Senate seats not up for election in 2026 (Class 1 & Class 3):
    // 34 Democratic/Independent caucusing + 33 Republican holdovers = 67 non-contested seats (plus 33 Class 2 seats = 100 total)
    let holdoverDem = 34;
    let holdoverGop = 33;

    results.forEach(st => {
      if (!st.hasSenateRace || !st.senate) return;
      const s = st.senate;
      const baseWinner = s.historical2022.winner;

      if (s.status === 'called_dem') {
        demSeats++;
        if (baseWinner === 'gop') flipsToDem++;
      } else if (s.status === 'called_gop') {
        gopSeats++;
        if (baseWinner === 'dem') flipsToGop++;
      } else {
        // Look at current leader if reporting > 0
        if (s.demCandidate.votes > s.gopCandidate.votes && s.reportingPct > 0) {
          demSeats++;
        } else if (s.gopCandidate.votes > s.demCandidate.votes && s.reportingPct > 0) {
          gopSeats++;
        } else {
          uncalledSeats++;
        }
      }
    });

    demSeats += holdoverDem;
    gopSeats += holdoverGop;

    return {
      demSeats,
      gopSeats,
      uncalledSeats,
      majorityThreshold: 51,
      flipsToDem,
      flipsToGop,
      statusText: demSeats >= 51 ? 'Democrats Win Senate' : gopSeats >= 51 ? 'Republicans Hold Senate' : 'Senate Control Contested'
    };
  }

  if (chamber === 'governor') {
    // 36 Governor seats in midterms + 14 holdover states (6 Dem, 8 GOP)
    const holdoverDem = 6;
    const holdoverGop = 8;

    results.forEach(st => {
      if (!st.hasGovernorRace || !st.governor) return;
      const g = st.governor;
      const baseWinner = g.historical2022.winner;

      if (g.status === 'called_dem') {
        demSeats++;
        if (baseWinner === 'gop') flipsToDem++;
      } else if (g.status === 'called_gop') {
        gopSeats++;
        if (baseWinner === 'dem') flipsToGop++;
      } else {
        if (g.demCandidate.votes > g.gopCandidate.votes && g.reportingPct > 0) {
          demSeats++;
        } else if (g.gopCandidate.votes > g.demCandidate.votes && g.reportingPct > 0) {
          gopSeats++;
        } else {
          uncalledSeats++;
        }
      }
    });

    demSeats += holdoverDem;
    gopSeats += holdoverGop;

    return {
      demSeats,
      gopSeats,
      uncalledSeats,
      majorityThreshold: 26,
      flipsToDem,
      flipsToGop,
      statusText: demSeats >= 26 ? 'Democrats Hold Gubernatorial Majority' : gopSeats >= 26 ? 'GOP Holds Gubernatorial Majority' : 'Contested Gubernatorial Control'
    };
  }

  // House of Representatives (435 voting seats; exclude DC non-voting delegate)
  results.forEach(st => {
    if (!st.house || st.id === 'DC') return;
    demSeats += st.house.demSeats;
    gopSeats += st.house.gopSeats;
    uncalledSeats += st.house.uncalledSeats;

    if (st.house.demSeats > st.house.historical2022.demSeats) {
      flipsToDem += (st.house.demSeats - st.house.historical2022.demSeats);
    } else if (st.house.gopSeats > st.house.historical2022.gopSeats) {
      flipsToGop += (st.house.gopSeats - st.house.historical2022.gopSeats);
    }
  });

  return {
    demSeats,
    gopSeats,
    uncalledSeats,
    majorityThreshold: 218,
    flipsToDem,
    flipsToGop,
    statusText: demSeats >= 218 ? 'Democrats Reach 218 Majority' : gopSeats >= 218 ? 'Republicans Reach 218 Majority' : 'House Control in Balance'
  };
}

export function formatVoteCount(val: number): string {
  return new Intl.NumberFormat('en-US').format(val);
}

export type PoliticalImpactLevel = 'critical' | 'high' | 'medium' | 'low';

export interface StateImpactAssessment {
  stateCode: string;
  level: PoliticalImpactLevel;
  score: number; // 0 to 100
  badgeLabel: string;
  title: string;
  whyItMatters: string;
  votesNeededToFlip: number;
  tippingRank: number;
  decisiveCountiesText: string;
}

export type PoliticalImpactAssessment = StateImpactAssessment;

const SENATE_TIPPING_ORDER = ['GA', 'MI', 'NC', 'TX', 'ME', 'IA', 'NH', 'MT', 'CO', 'VA'];
const HOUSE_TIPPING_ORDER = ['PA', 'CA', 'NY', 'MI', 'TX', 'VA', 'AZ', 'NC', 'OH', 'GA'];
const GOV_TIPPING_ORDER = ['PA', 'GA', 'WI', 'MI', 'AZ', 'NV', 'NC', 'NH', 'TX', 'FL'];

export function getPoliticalImpactAssessment(
  state: StateElectionResult,
  chamber: 'senate' | 'house' | 'governor'
): StateImpactAssessment {
  const code = state.stateCode;
  let margin = 20;
  let totalVotes = 100000;
  let hasRace = true;

  if (chamber === 'senate') {
    if (state.hasSenateRace && state.senate) {
      margin = Math.abs(state.senate.demCandidate.pct - state.senate.gopCandidate.pct);
      totalVotes = state.senate.demCandidate.votes + state.senate.gopCandidate.votes;
    } else {
      hasRace = false;
    }
  } else if (chamber === 'governor') {
    if (state.hasGovernorRace && state.governor) {
      margin = Math.abs(state.governor.demCandidate.pct - state.governor.gopCandidate.pct);
      totalVotes = state.governor.demCandidate.votes + state.governor.gopCandidate.votes;
    } else {
      hasRace = false;
    }
  } else {
    // House
    if (state.house) {
      const d = state.house.popularDemVotes;
      const g = state.house.popularGopVotes;
      const tot = d + g;
      margin = tot > 0 ? Math.abs((d / tot) * 100 - (g / tot) * 100) : 20;
      totalVotes = tot;
    }
  }

  if (!hasRace) {
    return {
      stateCode: code,
      level: 'low',
      score: 5,
      badgeLabel: 'No Contest',
      title: 'No Chamber Contest in 2026',
      whyItMatters: `${state.stateName} has no election scheduled for ${chamber === 'senate' ? 'the U.S. Senate' : 'the governorship'} in this midterm cycle.`,
      votesNeededToFlip: 0,
      tippingRank: 99,
      decisiveCountiesText: 'No active counties.'
    };
  }

  const tippingList = chamber === 'senate' ? SENATE_TIPPING_ORDER : chamber === 'house' ? HOUSE_TIPPING_ORDER : GOV_TIPPING_ORDER;
  const rankIdx = tippingList.indexOf(code);
  const tippingRank = rankIdx !== -1 ? rankIdx + 1 : 15 + Math.round(margin);

  // Closeness score: 0 to 100
  let score = Math.max(5, Math.min(100, Math.round(100 - margin * 4.5)));
  if (rankIdx !== -1) {
    score = Math.max(score, 100 - rankIdx * 4);
  }

  let level: PoliticalImpactLevel = 'low';
  let badgeLabel = 'Safe State';
  let title = 'Low Chamber Impact on Majority';

  if (score >= 88 || rankIdx !== -1 && rankIdx < 4) {
    level = 'critical';
    badgeLabel = '⚡ Tipping Point';
    title = 'Critical Decisive Tipping Point';
  } else if (score >= 70 || rankIdx !== -1 && rankIdx < 8) {
    level = 'high';
    badgeLabel = 'High Impact';
    title = 'Key Battleground (Potential Flip)';
  } else if (score >= 45) {
    level = 'medium';
    badgeLabel = 'Moderate Impact';
    title = 'National Bellwether Indicator';
  }

  const votesNeededToFlip = Math.max(500, Math.round(totalVotes * (margin / 200)));

  // Detailed rationale in English explaining where the numbers make the biggest difference
  let whyItMatters = '';
  let decisiveCountiesText = '';

  switch (code) {
    case 'PA':
      whyItMatters = 'Pennsylvania serves as a mathematical fulcrum for congressional control. If the margin swings here, chamber majority shifts with over 90% probability.';
      decisiveCountiesText = 'Decided in suburban Bucks, working-class Northampton, and turnout in Philadelphia.';
      break;
    case 'GA':
      whyItMatters = 'Georgia anchors the Sunbelt corridor. A shift under 1 percentage point determines whether Democrats retain their counterweight in the South.';
      decisiveCountiesText = 'Decided in rapidly diversifying suburbs Gwinnett & Cobb against strong rural GOP turnout.';
      break;
    case 'MI':
      whyItMatters = 'Michigan represents the core of the Rust Belt Blue Wall. Without Michigan, the path to 51 Senate seats or the House is blocked.';
      decisiveCountiesText = 'Decided in Wayne (Detroit mail ballots) vs. Macomb (working-class swing voters).';
      break;
    case 'WI':
      whyItMatters = 'Wisconsin is historically the nation’s closest state, frequently decided by under 20,000 votes. Every decimal shift here tilts national control.';
      decisiveCountiesText = 'Decided in Dane County (Madison college turnout) against conservative WOW suburbs (Waukesha).';
      break;
    case 'AZ':
      whyItMatters = 'Arizona is pivotal for Southwest control with an expanding independent electorate and high mail-in ballot volume.';
      decisiveCountiesText = 'Maricopa County alone accounts for over 60% of the statewide total.';
      break;
    case 'NV':
      whyItMatters = 'Nevada’s service industry union coalition (Culinary Union) historically determines razor-thin Senate margins.';
      decisiveCountiesText = 'Decided in Clark County (Las Vegas) and Washoe County (Reno swing voters).';
      break;
    case 'NC':
      whyItMatters = 'North Carolina represents the defensive frontier. A breakthrough here transforms a narrow edge into durable legislative control.';
      decisiveCountiesText = 'Decided in Wake (Raleigh) and Mecklenburg (Charlotte) vs. rural mountain and coastal counties.';
      break;
    case 'TX':
      whyItMatters = 'With 38 congressional districts, even small percentage swings in Texas can flip multiple House seats simultaneously.';
      decisiveCountiesText = 'Decided in Dallas-Fort Worth suburbs (Tarrant) and the Rio Grande Valley.';
      break;
    default:
      if (level === 'critical' || level === 'high') {
        whyItMatters = `With a narrow margin of only ${margin.toFixed(1)} pp, this state is within direct range of tipping the chamber balance of power.`;
        decisiveCountiesText = 'Decided across the suburban ring and major metro counties.';
      } else {
        whyItMatters = `The leading party holds a comfortable ${margin.toFixed(1)} pp lead. Vote swings here impact the national popular vote share rather than chamber control.`;
        decisiveCountiesText = 'Solid partisan alignment across most counties.';
      }
      break;
  }

  return {
    stateCode: code,
    level,
    score,
    badgeLabel,
    title,
    whyItMatters,
    votesNeededToFlip,
    tippingRank,
    decisiveCountiesText
  };
}

export function formatShortVoteCount(votes: number): string {
  if (votes >= 1_000_000) {
    return `${(votes / 1_000_000).toFixed(1)}M`;
  }
  if (votes >= 1_000) {
    return `${Math.round(votes / 1_000)}K`;
  }
  return votes.toString();
}

export interface ElectionSurprise {
  rank: number;
  stateCode: string;
  stateName: string;
  swingValue: number; // positive = Dem swing, negative = GOP swing
  swingLabel: string; // e.g. "+8.4 D"
  margin2026: number;
  margin2022: number;
  isFlip: boolean;
  flippedTo?: 'DEM' | 'GOP';
  reportingPct: number;
  significance: string;
  votesCounted: number;
  votesCountedLabel: string;
  houseSeats: number;
  currentLeaderName: string;
  currentLeaderParty: 'DEM' | 'GOP' | 'IND';
  currentLeaderPct: number;
  currentTrailingName: string;
  currentTrailingParty: 'DEM' | 'GOP';
  currentTrailingPct: number;
  impactScore: number;
}

/**
 * Returns the top election surprises / largest swings compared to 2022 baseline.
 * Prioritizes flips, largest electoral swings, citizen/population weight, and active vote reporting.
 * When no states have reported votes yet (pre-close), returns the top populous watch-states to monitor as polls close.
 */
export function getTopElectionSurprises(
  states: StateElectionResult[],
  chamber: 'senate' | 'house' | 'governor',
  limit: number = 6
): ElectionSurprise[] {
  const surprises: Omit<ElectionSurprise, 'rank'>[] = [];
  const anyReporting = states.some(st => {
    if (chamber === 'senate') return (st.senate?.reportingPct || 0) > 0;
    if (chamber === 'governor') return (st.governor?.reportingPct || 0) > 0;
    if (chamber === 'house') return (st.house?.reportingPct || 0) > 0;
    return false;
  });

  states.forEach(st => {
    let repPct = 0;
    let margin2026 = 0;
    let margin2022 = 0;
    let hasContest = false;
    let votesCounted = 0;
    let leadName = '';
    let leadParty: 'DEM' | 'GOP' | 'IND' = 'DEM';
    let leadPct = 50;
    let trailName = '';
    let trailParty: 'DEM' | 'GOP' = 'GOP';
    let trailPct = 50;

    if (chamber === 'senate' && st.senate) {
      hasContest = true;
      repPct = st.senate.reportingPct;
      const demPct = repPct > 0 ? st.senate.demCandidate.pct : 50;
      const gopPct = repPct > 0 ? st.senate.gopCandidate.pct : 50;
      margin2026 = repPct > 0 ? Number((demPct - gopPct).toFixed(1)) : 0;
      margin2022 = st.senate.historical2022.margin;
      votesCounted = st.senate.demCandidate.votes + st.senate.gopCandidate.votes;

      if (demPct >= gopPct) {
        leadName = st.senate.demCandidate.name;
        leadParty = 'DEM';
        leadPct = demPct;
        trailName = st.senate.gopCandidate.name;
        trailParty = 'GOP';
        trailPct = gopPct;
      } else {
        leadName = st.senate.gopCandidate.name;
        leadParty = 'GOP';
        leadPct = gopPct;
        trailName = st.senate.demCandidate.name;
        trailParty = 'DEM';
        trailPct = demPct;
      }
    } else if (chamber === 'governor' && st.governor) {
      hasContest = true;
      repPct = st.governor.reportingPct;
      const demPct = repPct > 0 ? st.governor.demCandidate.pct : 50;
      const gopPct = repPct > 0 ? st.governor.gopCandidate.pct : 50;
      margin2026 = repPct > 0 ? Number((demPct - gopPct).toFixed(1)) : 0;
      margin2022 = st.governor.historical2022.margin;
      votesCounted = st.governor.demCandidate.votes + st.governor.gopCandidate.votes;

      if (demPct >= gopPct) {
        leadName = st.governor.demCandidate.name;
        leadParty = 'DEM';
        leadPct = demPct;
        trailName = st.governor.gopCandidate.name;
        trailParty = 'GOP';
        trailPct = gopPct;
      } else {
        leadName = st.governor.gopCandidate.name;
        leadParty = 'GOP';
        leadPct = gopPct;
        trailName = st.governor.demCandidate.name;
        trailParty = 'DEM';
        trailPct = demPct;
      }
    } else if (chamber === 'house' && st.house) {
      if (st.id === 'DC') return;
      hasContest = true;
      repPct = st.house.reportingPct;
      const totalPop = repPct > 0 ? (st.house.popularDemVotes + st.house.popularGopVotes) : 0;
      const demPct = totalPop > 0 ? (st.house.popularDemVotes / totalPop) * 100 : 50;
      const gopPct = totalPop > 0 ? (st.house.popularGopVotes / totalPop) * 100 : 50;
      margin2026 = totalPop > 0 ? Number((demPct - gopPct).toFixed(1)) : 0;
      margin2022 = st.house.historical2022.margin;
      votesCounted = totalPop;

      if (st.house.demSeats >= st.house.gopSeats) {
        leadName = `${st.house.demSeats} Dem Districts`;
        leadParty = 'DEM';
        leadPct = Number(demPct.toFixed(1));
        trailName = `${st.house.gopSeats} GOP Districts`;
        trailParty = 'GOP';
        trailPct = Number(gopPct.toFixed(1));
      } else {
        leadName = `${st.house.gopSeats} GOP Districts`;
        leadParty = 'GOP';
        leadPct = Number(gopPct.toFixed(1));
        trailName = `${st.house.demSeats} Dem Districts`;
        trailParty = 'DEM';
        trailPct = Number(demPct.toFixed(1));
      }
    }

    // Never return a state as a "surprise" if 0% of votes have been counted!
    if (!hasContest || repPct <= 0) return;

    const swingValue = Number((margin2026 - margin2022).toFixed(1));
    const isFlip = (margin2022 < 0 && margin2026 > 0) || (margin2022 > 0 && margin2026 < 0);
    const flippedTo = isFlip ? (margin2026 > 0 ? 'DEM' : 'GOP') : undefined;

    let significance = 'Shift vs. 2022';
    if (isFlip) {
      significance = flippedTo === 'DEM' ? 'Flip to Dems' : 'Flip to GOP';
    } else if (swingValue >= 3.5) {
      significance = 'Dem Surge';
    } else if (swingValue <= -3.5) {
      significance = 'GOP Surge';
    } else if (Math.abs(margin2026) <= 2.0) {
      significance = 'Tossup';
    }

    const swingLabel = swingValue >= 0 ? `+${swingValue} D` : `+${Math.abs(swingValue)} R`;

    // Impact scoring combines:
    // 1. Flip bonus (highest political shock)
    // 2. Absolute swing magnitude
    // 3. Citizen / House seat representation (heavily weighted so populous states surface prominently)
    const flipScore = isFlip ? 120 : 0;
    const swingScore = Math.abs(swingValue) * 6;
    const citizenWeightScore = Math.min(st.houseSeats, 40) * 2.5;
    const impactScore = flipScore + swingScore + citizenWeightScore;

    surprises.push({
      stateCode: st.stateCode,
      stateName: st.stateName,
      swingValue,
      swingLabel,
      margin2026,
      margin2022,
      isFlip,
      flippedTo,
      reportingPct: repPct,
      significance,
      votesCounted,
      votesCountedLabel: formatShortVoteCount(votesCounted),
      houseSeats: st.houseSeats,
      currentLeaderName: leadName,
      currentLeaderParty: leadParty,
      currentLeaderPct: leadPct,
      currentTrailingName: trailName,
      currentTrailingParty: trailParty,
      currentTrailingPct: trailPct,
      impactScore
    });
  });

  // Sort by political surprise impact score
  surprises.sort((a, b) => b.impactScore - a.impactScore);

  return surprises.slice(0, limit).map((s, index) => ({
    ...s,
    rank: index + 1
  }));
}

