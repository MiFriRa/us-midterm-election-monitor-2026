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
    candidates?: CandidateResult[];
    rankedChoiceActive?: boolean;
    rankedChoiceNote?: string;
    historical2022: HistoricalBaseline;
    historical2018?: HistoricalBaseline;
  };

  governor?: {
    demCandidate: CandidateResult;
    gopCandidate: CandidateResult;
    otherVotes: number;
    reportingPct: number;
    status: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
    candidates?: CandidateResult[];
    rankedChoiceActive?: boolean;
    rankedChoiceNote?: string;
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
    popularOtherVotes?: number;
    popularIndVotes?: number;
    reportingPct: number;
    status?: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
    candidates?: CandidateResult[];
    rankedChoiceActive?: boolean;
    rankedChoiceNote?: string;
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
    const contestedCount = results.filter(st => st.hasSenateRace && st.senate).length;
    const holdoverDem = 34;
    const holdoverGop = contestedCount >= 35 ? 31 : 33;

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
      } else if (s.reportingPct >= 100 && s.demCandidate.votes !== s.gopCandidate.votes) {
        if (s.demCandidate.votes > s.gopCandidate.votes) {
          demSeats++;
          if (baseWinner === 'gop') flipsToDem++;
        } else {
          gopSeats++;
          if (baseWinner === 'dem') flipsToGop++;
        }
      } else {
        uncalledSeats++;
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
      } else if (g.reportingPct >= 100 && g.demCandidate.votes !== g.gopCandidate.votes) {
        if (g.demCandidate.votes > g.gopCandidate.votes) {
          demSeats++;
          if (baseWinner === 'gop') flipsToDem++;
        } else {
          gopSeats++;
          if (baseWinner === 'dem') flipsToGop++;
        }
      } else {
        uncalledSeats++;
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
      totalVotes = tot + (state.house.popularOtherVotes || 0);
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
  if (chamber === 'house' && state.house?.rankedChoiceActive) {
    score = 86;
  }

  let level: PoliticalImpactLevel = 'low';
  let badgeLabel = 'Safe State';
  let title = 'Low Chamber Impact on Majority';

  if (score >= 88 || rankIdx !== -1 && rankIdx < 4) {
    level = 'critical';
    badgeLabel = '⚡ Tipping Point';
    title = 'Critical Decisive Tipping Point';
  } else if (score >= 70 || (rankIdx !== -1 && rankIdx < 8) || (chamber === 'house' && state.house?.rankedChoiceActive)) {
    level = 'high';
    badgeLabel = state.house?.rankedChoiceActive ? '⚡ RCV Tossup' : 'High Impact';
    title = state.house?.rankedChoiceActive ? 'Ranked-Choice Instant Runoff' : 'Key Battleground (Potential Flip)';
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
    case 'AK':
      if (chamber === 'house' && state.house?.rankedChoiceActive) {
        whyItMatters = 'Alaska uses Ranked-Choice Voting (RCV). With Nick Begich III at 49.80% (< 50% outright victory threshold), instant runoff reallocation of eliminated candidates (Hafner 7.23% and McDermott 2.70%) will decide whether independent challenger Bill Hill can overcome the preliminary lead.';
        decisiveCountiesText = 'Anchorage metro, Mat-Su Borough, Fairbanks, and remote bush absentee precincts.';
      } else if (chamber === 'senate') {
        whyItMatters = 'Alaska uses Ranked-Choice Voting (RCV). Dan Sullivan (48.32%) and Mary Peltola (47.81%) are in a razor-thin race under the 50% threshold, meaning second choices from Heikes (2.20%) and Sullivan Jr. (1.67%) will decide the Senate seat.';
        decisiveCountiesText = 'Anchorage, Fairbanks North Star, Mat-Su Borough, and bush absentee ballots.';
      } else {
        whyItMatters = 'Alaska is a pivotal battleground where mail ballots and ranked-choice tabulation determine the outcome.';
        decisiveCountiesText = 'Anchorage and interior boroughs against bush Alaska.';
      }
      break;
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
  currentTrailingParty: 'DEM' | 'GOP' | 'IND';
  currentTrailingPct: number;
  impactScore: number;
}

/**
 * Computes effective two-coalition / top-2 margin and swing.
 * Generalizes across all states and chambers: if a candidate list with 3rd-party
 * or Independent contenders is present (e.g. Montana, Alaska, Nebraska, Maine),
 * it measures the true Direct Competitor Margin (Top 1 vs. Top 2) rather than
 * artificially inflating margins when an Independent splits the vote.
 */
export function getEffectiveRaceMarginAndSwing(contest: {
  demCandidate: CandidateResult;
  gopCandidate: CandidateResult;
  candidates?: CandidateResult[];
  historical2022: HistoricalBaseline;
  reportingPct: number;
}): {
  effectiveMargin2026: number; // Signed: positive = Dem / anti-GOP lead, negative = GOP lead
  margin2022: number;
  swingVs2022: number; // Signed swing vs 2022 (positive = swung Dem/anti-GOP, negative = swung GOP)
  leadCandidate: CandidateResult;
  runnerUpCandidate: CandidateResult;
  isMultiCandidate: boolean;
} {
  const { demCandidate, gopCandidate, candidates, historical2022, reportingPct } = contest;
  const margin2022 = historical2022.margin;

  // If a multi-candidate list exists with at least 2 candidates
  if (candidates && candidates.length >= 2 && reportingPct > 0) {
    const sorted = [...candidates].sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return b.pct - a.pct;
    });

    const top1 = sorted[0];
    const top2 = sorted[1];
    const directMargin = Number(Math.abs(top1.pct - top2.pct).toFixed(2));

    // Polarity: If the leader is GOP, margin is negative; if DEM or anti-GOP IND, positive
    const isGopLeader = top1.party === 'GOP';
    const effectiveMargin2026 = Number((isGopLeader ? -directMargin : directMargin).toFixed(1));
    const swingVs2022 = Number((effectiveMargin2026 - margin2022).toFixed(1));

    return {
      effectiveMargin2026,
      margin2022,
      swingVs2022,
      leadCandidate: top1,
      runnerUpCandidate: top2,
      isMultiCandidate: true
    };
  }

  // Standard two-party contest
  const demPct = reportingPct > 0 ? demCandidate.pct : 50;
  const gopPct = reportingPct > 0 ? gopCandidate.pct : 50;
  const effectiveMargin2026 = reportingPct > 0 ? Number((demPct - gopPct).toFixed(1)) : 0;
  const swingVs2022 = Number((effectiveMargin2026 - margin2022).toFixed(1));

  const leadCandidate = demPct >= gopPct ? demCandidate : gopCandidate;
  const runnerUpCandidate = demPct >= gopPct ? gopCandidate : demCandidate;

  return {
    effectiveMargin2026,
    margin2022,
    swingVs2022,
    leadCandidate,
    runnerUpCandidate,
    isMultiCandidate: false
  };
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
    let trailParty: 'DEM' | 'GOP' | 'IND' = 'GOP';
    let trailPct = 50;

    if (chamber === 'senate' && st.senate) {
      hasContest = true;
      repPct = st.senate.reportingPct;
      const effective = getEffectiveRaceMarginAndSwing(st.senate);
      margin2026 = effective.effectiveMargin2026;
      margin2022 = effective.margin2022;
      votesCounted = st.senate.demCandidate.votes + st.senate.gopCandidate.votes + (st.senate.otherVotes || 0);

      leadName = effective.leadCandidate.name;
      leadParty = effective.leadCandidate.party === 'IND' ? 'IND' : effective.leadCandidate.party === 'GOP' ? 'GOP' : 'DEM';
      leadPct = effective.leadCandidate.pct;
      trailName = effective.runnerUpCandidate.name;
      trailParty = effective.runnerUpCandidate.party === 'IND' ? 'IND' : effective.runnerUpCandidate.party === 'GOP' ? 'GOP' : 'DEM';
      trailPct = effective.runnerUpCandidate.pct;
    } else if (chamber === 'governor' && st.governor) {
      hasContest = true;
      repPct = st.governor.reportingPct;
      const effective = getEffectiveRaceMarginAndSwing(st.governor);
      margin2026 = effective.effectiveMargin2026;
      margin2022 = effective.margin2022;
      votesCounted = st.governor.demCandidate.votes + st.governor.gopCandidate.votes + (st.governor.otherVotes || 0);

      leadName = effective.leadCandidate.name;
      leadParty = effective.leadCandidate.party === 'IND' ? 'IND' : effective.leadCandidate.party === 'GOP' ? 'GOP' : 'DEM';
      leadPct = effective.leadCandidate.pct;
      trailName = effective.runnerUpCandidate.name;
      trailParty = effective.runnerUpCandidate.party === 'IND' ? 'IND' : effective.runnerUpCandidate.party === 'GOP' ? 'GOP' : 'DEM';
      trailPct = effective.runnerUpCandidate.pct;
    } else if (chamber === 'house' && st.house) {
      if (st.id === 'DC') return;
      hasContest = true;
      repPct = st.house.reportingPct;
      const totalPop = repPct > 0 ? (st.house.popularDemVotes + st.house.popularGopVotes) : 0;
      const demPct = totalPop > 0 ? (st.house.popularDemVotes / totalPop) * 100 : 50;
      const gopPct = totalPop > 0 ? (st.house.popularGopVotes / totalPop) * 100 : 50;
      margin2026 = totalPop > 0 ? Number((demPct - gopPct).toFixed(1)) : 0;
      margin2022 = st.house.historical2022.margin;
      votesCounted = totalPop + (st.house.popularOtherVotes || 0);

      // If at-large single district with candidate list (e.g. Alaska AK-AL)
      if (st.houseSeats === 1 && st.house.candidates && st.house.candidates.length >= 2) {
        const sortedCands = [...st.house.candidates].sort((a, b) => b.votes - a.votes);
        const top1 = sortedCands[0];
        const top2 = sortedCands[1];
        leadName = top1.name;
        leadParty = top1.party === 'IND' ? 'IND' : top1.party === 'GOP' ? 'GOP' : 'DEM';
        leadPct = top1.pct;
        trailName = top2.name;
        trailParty = top2.party === 'IND' ? 'IND' : top2.party === 'GOP' ? 'GOP' : 'DEM';
        trailPct = top2.pct;
        const directMargin = Number(Math.abs(top1.pct - top2.pct).toFixed(1));
        margin2026 = top1.party === 'GOP' ? -directMargin : directMargin;
      } else if (st.house.demSeats >= st.house.gopSeats) {
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
    if (chamber === 'house' && st.house?.rankedChoiceActive) {
      significance = 'RCV Tossup';
    } else if (isFlip) {
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

/**
 * VisualizedSeat represents an individual seat in the Senate (100) or House (435)
 * for the compact binary surprise balance line.
 */
export interface VisualizedSeat {
  id: string;
  stateCode: string;
  label: string;
  chamber: 'senate' | 'house';
  party: 'dem' | 'gop';
  isHoldover?: boolean;
  isFlip: boolean;
  swingVs2022: number;
  rawSurpriseScore: number;
  normalizedHeight: number; // 0.20 (min baseline) to 1.0 (full container height)
  reportingPct: number;
  margin2026: number;
  margin2022: number;
  district?: string;
}

export interface ChamberSurpriseDistribution {
  chamber: 'senate' | 'house';
  totalSeats: number;
  majorityThreshold: number;
  demSeats: VisualizedSeat[]; // Sorted by surprise ASCENDING (safest on left flank, biggest surprises towards center)
  gopSeats: VisualizedSeat[]; // Sorted by surprise DESCENDING (biggest surprises towards center, safest on right flank)
  uncalledCount: number;
  maxRawSurprise: number;
}

/**
 * Normalizes seat heights linearly between minHeightRatio (default 0.20) and 1.0.
 * Ensures the single biggest surprise reaches exactly 1.0 (full container height),
 * and completely predictable/holdover seats have minHeightRatio (always visible).
 */
export function normalizeSeatHeights(
  demSeats: VisualizedSeat[],
  gopSeats: VisualizedSeat[],
  minHeightRatio = 0.20
): { demSeats: VisualizedSeat[]; gopSeats: VisualizedSeat[]; maxRawSurprise: number } {
  const allScores = [...demSeats.map(s => s.rawSurpriseScore), ...gopSeats.map(s => s.rawSurpriseScore)];
  const maxRawSurprise = allScores.length > 0 ? Math.max(0, ...allScores) : 0;

  const normalize = (seat: VisualizedSeat): VisualizedSeat => {
    if (seat.isHoldover || maxRawSurprise <= 0) {
      return { ...seat, normalizedHeight: minHeightRatio };
    }
    const norm = Math.max(0, Math.min(1, seat.rawSurpriseScore / maxRawSurprise));
    const height = Number((minHeightRatio + (1.0 - minHeightRatio) * norm).toFixed(3));
    return { ...seat, normalizedHeight: height };
  };

  return {
    demSeats: demSeats.map(normalize),
    gopSeats: gopSeats.map(normalize),
    maxRawSurprise
  };
}

/**
 * Computes the 100-seat distribution for the U.S. Senate.
 * 34 Democratic holdovers + 31/33 Republican holdovers + 35 contested seats.
 * Sorted according to Option 1B: safe seats on outer flanks, flips/surprises push towards the center.
 */
export function calculateSenateSeatDistribution(
  results: StateElectionResult[],
  minHeightRatio = 0.20
): ChamberSurpriseDistribution {
  const contestedCount = results.filter(st => st.hasSenateRace && st.senate).length;
  const holdoverDemCount = 34;
  const holdoverGopCount = contestedCount >= 35 ? 31 : 33;

  const rawDemSeats: VisualizedSeat[] = [];
  const rawGopSeats: VisualizedSeat[] = [];
  let uncalledCount = 0;

  // Add Dem holdovers (placed at the outer left edge)
  for (let i = 1; i <= holdoverDemCount; i++) {
    rawDemSeats.push({
      id: `sen-dem-holdover-${i}`,
      stateCode: 'USA',
      label: `Democrat Non-Contested Holdover #${i}`,
      chamber: 'senate',
      party: 'dem',
      isHoldover: true,
      isFlip: false,
      swingVs2022: 0,
      rawSurpriseScore: 0,
      normalizedHeight: minHeightRatio,
      reportingPct: 100,
      margin2026: 0,
      margin2022: 0
    });
  }

  // Add GOP holdovers (placed at the outer right edge)
  for (let i = 1; i <= holdoverGopCount; i++) {
    rawGopSeats.push({
      id: `sen-gop-holdover-${i}`,
      stateCode: 'USA',
      label: `GOP Non-Contested Holdover #${i}`,
      chamber: 'senate',
      party: 'gop',
      isHoldover: true,
      isFlip: false,
      swingVs2022: 0,
      rawSurpriseScore: 0,
      normalizedHeight: minHeightRatio,
      reportingPct: 100,
      margin2026: 0,
      margin2022: 0
    });
  }

  results.forEach(st => {
    if (!st.hasSenateRace || !st.senate) return;
    const s = st.senate;
    const baseWinner = s.historical2022.winner;
    const isDemCalled = s.status === 'called_dem' || (s.reportingPct >= 100 && s.demCandidate.votes > s.gopCandidate.votes);
    const isGopCalled = s.status === 'called_gop' || (s.reportingPct >= 100 && s.gopCandidate.votes > s.demCandidate.votes);

    if (isDemCalled) {
      const isFlip = baseWinner === 'gop';
      const effective = getEffectiveRaceMarginAndSwing(s);
      const swing = effective.swingVs2022;
      const swingBonus = Math.max(0, swing);
      const flipBonus = isFlip ? 15.0 : 0.0;
      const rawSurpriseScore = Number((swingBonus + flipBonus).toFixed(2));

      rawDemSeats.push({
        id: `sen-${st.stateCode}`,
        stateCode: st.stateCode,
        label: `${st.stateName}: ${effective.leadCandidate.name} (${effective.leadCandidate.party})`,
        chamber: 'senate',
        party: 'dem',
        isHoldover: false,
        isFlip,
        swingVs2022: swing,
        rawSurpriseScore,
        normalizedHeight: minHeightRatio,
        reportingPct: s.reportingPct,
        margin2026: effective.effectiveMargin2026,
        margin2022: effective.margin2022
      });
    } else if (isGopCalled) {
      const isFlip = baseWinner === 'dem';
      const effective = getEffectiveRaceMarginAndSwing(s);
      // For GOP, positive swing means GOP expanded lead vs 2022
      const swing = Number((-effective.swingVs2022).toFixed(1));
      const swingBonus = Math.max(0, swing);
      const flipBonus = isFlip ? 15.0 : 0.0;
      const rawSurpriseScore = Number((swingBonus + flipBonus).toFixed(2));

      rawGopSeats.push({
        id: `sen-${st.stateCode}`,
        stateCode: st.stateCode,
        label: `${st.stateName}: ${effective.leadCandidate.name} (${effective.leadCandidate.party})`,
        chamber: 'senate',
        party: 'gop',
        isHoldover: false,
        isFlip,
        swingVs2022: swing,
        rawSurpriseScore,
        normalizedHeight: minHeightRatio,
        reportingPct: s.reportingPct,
        margin2026: -effective.effectiveMargin2026,
        margin2022: -effective.margin2022
      });
    } else {
      uncalledCount++;
    }
  });

  // Normalize heights across called seats
  const { demSeats: normDem, gopSeats: normGop, maxRawSurprise } = normalizeSeatHeights(
    rawDemSeats,
    rawGopSeats,
    minHeightRatio
  );

  // Option 1B Sorting:
  // Democrats: ASCENDING (safe seats on outer left flank, surprises toward center)
  normDem.sort((a, b) => a.rawSurpriseScore - b.rawSurpriseScore);

  // Republicans: DESCENDING (surprises toward center, safe seats on outer right flank)
  normGop.sort((a, b) => b.rawSurpriseScore - a.rawSurpriseScore);

  return {
    chamber: 'senate',
    totalSeats: 100,
    majorityThreshold: 51,
    demSeats: normDem,
    gopSeats: normGop,
    uncalledCount,
    maxRawSurprise
  };
}

/**
 * Computes the 435-seat distribution for the U.S. House of Representatives.
 * Normalizes heights and sorts according to Option 1B (surprises pushing towards center).
 */
export function calculateHouseSeatDistribution(
  results: StateElectionResult[],
  minHeightRatio = 0.20
): ChamberSurpriseDistribution {
  const rawDemSeats: VisualizedSeat[] = [];
  const rawGopSeats: VisualizedSeat[] = [];
  let uncalledCount = 0;

  results.forEach(st => {
    if (!st.house || st.id === 'DC') return;
    const h = st.house;
    const totalDem = h.demSeats;
    const totalGop = h.gopSeats;
    uncalledCount += h.uncalledSeats;

    const totalPop = (h.popularDemVotes || 0) + (h.popularGopVotes || 0);
    let currMargin = totalPop > 0
      ? Number((((h.popularDemVotes - h.popularGopVotes) / totalPop) * 100).toFixed(1))
      : h.historical2022.margin;

    // Use Top-2 Direct Competitor margin if at-large multi-candidate contest (e.g. Alaska)
    if (st.houseSeats === 1 && h.candidates && h.candidates.length >= 2) {
      const sorted = [...h.candidates].sort((a, b) => b.votes - a.votes);
      const top1 = sorted[0];
      const top2 = sorted[1];
      const directMargin = Number(Math.abs(top1.pct - top2.pct).toFixed(1));
      currMargin = top1.party === 'GOP' ? -directMargin : directMargin;
    }

    const demStateSwing = Number((currMargin - h.historical2022.margin).toFixed(1));
    const gopStateSwing = Number((-demStateSwing).toFixed(1));

    const histDem = h.historical2022.demSeats;
    const histGop = h.historical2022.gopSeats;
    const flipsToDemCount = Math.max(0, totalDem - histDem);
    const flipsToGopCount = Math.max(0, totalGop - histGop);

    const bgDemDistricts = (h.keyBattlegroundDistricts || []).filter(
      d => d.status === 'called_dem' || (d.reportingPct >= 100 && d.demVotes > d.gopVotes)
    );
    const bgGopDistricts = (h.keyBattlegroundDistricts || []).filter(
      d => d.status === 'called_gop' || (d.reportingPct >= 100 && d.gopVotes > d.demVotes)
    );

    // Build DEM seats for this state
    let remainingDem = totalDem;
    let bgDemIdx = 0;
    let demFlipsAssigned = 0;

    while (remainingDem > 0) {
      const seatIndex = totalDem - remainingDem + 1;
      let districtLabel = `${st.stateCode}-Seat ${seatIndex}`;
      let swing = demStateSwing;
      let isFlip = false;

      if (bgDemIdx < bgDemDistricts.length) {
        const bg = bgDemDistricts[bgDemIdx++];
        districtLabel = `${bg.district} (${bg.demName})`;
        swing = bg.swingVs2022;
        isFlip = swing > 3.0 || demFlipsAssigned < flipsToDemCount;
        if (isFlip) demFlipsAssigned++;
      } else if (demFlipsAssigned < flipsToDemCount) {
        isFlip = true;
        demFlipsAssigned++;
        districtLabel = `${st.stateCode}-Flip to Dem #${demFlipsAssigned}`;
        swing = Math.max(demStateSwing, 4.0);
      } else {
        districtLabel = `${st.stateCode}-Held Dem #${seatIndex}`;
      }

      const swingBonus = Math.max(0, swing);
      const flipBonus = isFlip ? 15.0 : 0.0;
      const rawSurpriseScore = Number((swingBonus + flipBonus).toFixed(2));

      rawDemSeats.push({
        id: `house-dem-${st.stateCode}-${seatIndex}`,
        stateCode: st.stateCode,
        label: `${st.stateName}: ${districtLabel}`,
        chamber: 'house',
        party: 'dem',
        isHoldover: false,
        isFlip,
        swingVs2022: swing,
        rawSurpriseScore,
        normalizedHeight: minHeightRatio,
        reportingPct: h.reportingPct,
        margin2026: currMargin,
        margin2022: h.historical2022.margin
      });

      remainingDem--;
    }

    // Build GOP seats for this state
    let remainingGop = totalGop;
    let bgGopIdx = 0;
    let gopFlipsAssigned = 0;

    while (remainingGop > 0) {
      const seatIndex = totalGop - remainingGop + 1;
      let districtLabel = `${st.stateCode}-Seat ${seatIndex}`;
      let swing = gopStateSwing;
      let isFlip = false;

      if (bgGopIdx < bgGopDistricts.length) {
        const bg = bgGopDistricts[bgGopIdx++];
        districtLabel = `${bg.district} (${bg.gopName})`;
        swing = -bg.swingVs2022;
        isFlip = swing > 3.0 || gopFlipsAssigned < flipsToGopCount;
        if (isFlip) gopFlipsAssigned++;
      } else if (gopFlipsAssigned < flipsToGopCount) {
        isFlip = true;
        gopFlipsAssigned++;
        districtLabel = `${st.stateCode}-Flip to GOP #${gopFlipsAssigned}`;
        swing = Math.max(gopStateSwing, 4.0);
      } else {
        districtLabel = `${st.stateCode}-Held GOP #${seatIndex}`;
      }

      const swingBonus = Math.max(0, swing);
      const flipBonus = isFlip ? 15.0 : 0.0;
      const rawSurpriseScore = Number((swingBonus + flipBonus).toFixed(2));

      rawGopSeats.push({
        id: `house-gop-${st.stateCode}-${seatIndex}`,
        stateCode: st.stateCode,
        label: `${st.stateName}: ${districtLabel}`,
        chamber: 'house',
        party: 'gop',
        isHoldover: false,
        isFlip,
        swingVs2022: swing,
        rawSurpriseScore,
        normalizedHeight: minHeightRatio,
        reportingPct: h.reportingPct,
        margin2026: -currMargin,
        margin2022: -h.historical2022.margin
      });

      remainingGop--;
    }
  });

  // Normalize heights across called seats
  const { demSeats: normDem, gopSeats: normGop, maxRawSurprise } = normalizeSeatHeights(
    rawDemSeats,
    rawGopSeats,
    minHeightRatio
  );

  // Option 1B Sorting:
  // Democrats: ASCENDING (safe seats on outer left flank, surprises toward center)
  normDem.sort((a, b) => a.rawSurpriseScore - b.rawSurpriseScore);

  // Republicans: DESCENDING (surprises toward center, safe seats on outer right flank)
  normGop.sort((a, b) => b.rawSurpriseScore - a.rawSurpriseScore);

  return {
    chamber: 'house',
    totalSeats: 435,
    majorityThreshold: 218,
    demSeats: normDem,
    gopSeats: normGop,
    uncalledCount,
    maxRawSurprise
  };
}


