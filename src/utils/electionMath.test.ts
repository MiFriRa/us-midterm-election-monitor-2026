import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTwoPartyMargin,
  getPurpleGradientColor,
  calculateSwing,
  getSwingMapColor,
  calculateNationalChamberTally,
  getPoliticalImpactAssessment,
  getTopElectionSurprises,
  getEffectiveRaceMarginAndSwing,
  calculateSenateSeatDistribution,
  calculateHouseSeatDistribution,
  normalizeSeatHeights,
  VisualizedSeat,
  StateElectionResult
} from './electionMath.js';

test('calculateTwoPartyMargin computes accurate margins and ratio', () => {
  const tie = calculateTwoPartyMargin(50000, 50000);
  assert.equal(tie.demPct, 50);
  assert.equal(tie.gopPct, 50);
  assert.equal(tie.margin, 0);
  assert.equal(tie.twoPartyRatio, 0.5);

  const demLead = calculateTwoPartyMargin(55000, 45000);
  assert.equal(demLead.demPct, 55);
  assert.equal(demLead.gopPct, 45);
  assert.equal(demLead.margin, 10);
  assert.equal(demLead.twoPartyRatio, 0.55);

  const gopLead = calculateTwoPartyMargin(40000, 60000);
  assert.equal(gopLead.demPct, 40);
  assert.equal(gopLead.gopPct, 60);
  assert.equal(gopLead.margin, -20);
  assert.equal(gopLead.twoPartyRatio, 0.4);
});

test('getPurpleGradientColor produces expected royal purple for 50/50 tossups and distinct colors for leads', () => {
  const tieColor = getPurpleGradientColor(50, 50, 100);
  // Royal purple at 50/50 has high red and high blue, lower green
  assert.equal(tieColor.toLowerCase(), '#8b2dcd');

  const safeDemColor = getPurpleGradientColor(70, 30, 100);
  assert.equal(safeDemColor.toLowerCase(), '#1d4ed8'); // Safe Blue

  const safeGopColor = getPurpleGradientColor(30, 70, 100);
  assert.equal(safeGopColor.toLowerCase(), '#dc2626'); // Safe Red

  // A slight Dem lean (52/48) should have blue > red, retaining purple hue
  const leanDemColor = getPurpleGradientColor(52, 48, 100);
  assert.notEqual(leanDemColor, tieColor);
  assert.notEqual(leanDemColor, safeDemColor);

  // A slight GOP lean (48/52) should have red > blue, retaining purple/plum hue
  const leanGopColor = getPurpleGradientColor(48, 52, 100);
  assert.notEqual(leanGopColor, tieColor);
  assert.notEqual(leanGopColor, safeGopColor);
});

test('calculateSwing accurately determines positive Dem shift and negative GOP shift', () => {
  // Case 1: 2022 was D+2.0 (51 Dem / 49 GOP), 2026 is D+5.5 (52.75 Dem / 47.25 GOP)
  const demSwing = calculateSwing(52.75, 47.25, 51.0, 49.0);
  assert.equal(demSwing.direction, 'dem');
  assert.equal(demSwing.swingValue, 3.5);
  assert.equal(demSwing.label, '+3.5 pp D');

  // Case 2: 2022 was R+1.0 (49.5 Dem / 50.5 GOP), 2026 is R+4.2 (47.9 Dem / 52.1 GOP)
  const gopSwing = calculateSwing(47.9, 52.1, 49.5, 50.5);
  assert.equal(gopSwing.direction, 'gop');
  assert.equal(gopSwing.swingValue, -3.2);
  assert.equal(gopSwing.label, '+3.2 pp R');

  // Case 3: Exactly identical margins
  const even = calculateSwing(50, 50, 50, 50);
  assert.equal(even.direction, 'even');
});

test('getSwingMapColor returns appropriate palette for swing magnitude', () => {
  assert.equal(getSwingMapColor(9), '#1d4ed8'); // strong D swing
  assert.equal(getSwingMapColor(-9), '#dc2626'); // strong R swing
  assert.equal(getSwingMapColor(0.2), '#334155'); // neutral slate
});

test('calculateNationalChamberTally tallies Senate seats and threshold', () => {
  const sampleState: StateElectionResult = {
    id: 'PA',
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 17,
    senate: {
      demCandidate: { name: 'Democrat', party: 'DEM', votes: 1200000, pct: 52 },
      gopCandidate: { name: 'Republican', party: 'GOP', votes: 1100000, pct: 48 },
      otherVotes: 0,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 51.2, gopPct: 46.3, margin: 4.9, winner: 'dem', reportingPct: 100 }
    }
  };

  const tally = calculateNationalChamberTally([sampleState], 'senate');
  assert.equal(tally.majorityThreshold, 51);
  // Holdovers (34 Dem + 33 GOP) + 1 called Dem = 35 Dem
  assert.equal(tally.demSeats, 35);
});

test('getPoliticalImpactAssessment correctly ranks tipping point states and calculates scores', () => {
  const gaState: StateElectionResult = {
    id: 'GA',
    stateCode: 'GA',
    stateName: 'Georgia',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 14,
    senate: {
      demCandidate: { name: 'Jon Ossoff', party: 'DEM', votes: 1980000, pct: 50.4 },
      gopCandidate: { name: 'Republican Challenger', party: 'GOP', votes: 1950000, pct: 49.6 },
      otherVotes: 0,
      reportingPct: 88,
      status: 'uncalled',
      historical2022: { demPct: 51.4, gopPct: 48.6, margin: 2.8, winner: 'dem', reportingPct: 100 }
    }
  };

  const wyState: StateElectionResult = {
    id: 'WY',
    stateCode: 'WY',
    stateName: 'Wyoming',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 1,
    senate: {
      demCandidate: { name: 'Democrat', party: 'DEM', votes: 50000, pct: 25 },
      gopCandidate: { name: 'Republican', party: 'GOP', votes: 150000, pct: 75 },
      otherVotes: 0,
      reportingPct: 90,
      status: 'called_gop',
      historical2022: { demPct: 24, gopPct: 76, margin: -52, winner: 'gop', reportingPct: 100 }
    }
  };

  const gaImpact = getPoliticalImpactAssessment(gaState, 'senate');
  assert.equal(gaImpact.level, 'critical');
  assert.equal(gaImpact.tippingRank, 1);
  assert.ok(gaImpact.score >= 90);
  assert.ok(gaImpact.whyItMatters.includes('Georgia'));

  const wyImpact = getPoliticalImpactAssessment(wyState, 'senate');
  assert.equal(wyImpact.level, 'low');
  assert.ok(wyImpact.score < 30);
});

test('getTopElectionSurprises prioritizes flips and largest swings vs 2022', () => {
  const states: StateElectionResult[] = [
    {
      id: 'OH',
      stateCode: 'OH',
      stateName: 'Ohio',
      hasSenateRace: true,
      hasGovernorRace: false,
      houseSeats: 15,
      senate: {
        demCandidate: { name: 'Democrat', party: 'DEM', votes: 2000000, pct: 51.5 },
        gopCandidate: { name: 'Republican', party: 'GOP', votes: 1900000, pct: 48.5 },
        otherVotes: 0,
        reportingPct: 80,
        status: 'called_dem',
        // 2022 was GOP +6.0 (margin: -6.0). 2026 is Dem +3.0. Swing is +9.0 and is a Flip!
        historical2022: { demPct: 47, gopPct: 53, margin: -6.0, winner: 'gop', reportingPct: 100 }
      }
    },
    {
      id: 'CA',
      stateCode: 'CA',
      stateName: 'California',
      hasSenateRace: true,
      hasGovernorRace: false,
      houseSeats: 52,
      senate: {
        demCandidate: { name: 'Democrat', party: 'DEM', votes: 5000000, pct: 60.0 },
        gopCandidate: { name: 'Republican', party: 'GOP', votes: 3300000, pct: 40.0 },
        otherVotes: 0,
        reportingPct: 75,
        status: 'called_dem',
        // 2022 was Dem +20. 2026 is Dem +20. Swing is 0.
        historical2022: { demPct: 60, gopPct: 40, margin: 20.0, winner: 'dem', reportingPct: 100 }
      }
    }
  ];

  const surprises = getTopElectionSurprises(states, 'senate');
  assert.equal(surprises.length, 2);
  assert.equal(surprises[0].stateCode, 'OH');
  assert.equal(surprises[0].isFlip, true);
  assert.equal(surprises[0].swingValue, 9.0);
  assert.equal(surprises[0].significance, 'Flip to Dems');

  // When 0% is counted, getTopElectionSurprises must return an empty array []
  const uncountedStates: StateElectionResult[] = [
    {
      ...states[0],
      senate: { ...states[0].senate!, reportingPct: 0, demCandidate: { ...states[0].senate!.demCandidate, votes: 0 }, gopCandidate: { ...states[0].senate!.gopCandidate, votes: 0 } }
    }
  ];
  assert.equal(getTopElectionSurprises(uncountedStates, 'senate').length, 0);
});

import { parseExternalElectionJson, applyLivePatchesToStates } from './liveElectionFeed.js';

test('parseExternalElectionJson and applyLivePatchesToStates normalize and apply live returns accurately', () => {
  const sampleExternalPayload = {
    nationalReportingPct: 38,
    states: [
      {
        stateCode: 'GA',
        reportingPct: 64,
        demVotes: 1540000,
        gopVotes: 1490000,
        status: 'uncalled',
        houseDemSeats: 5,
        houseGopSeats: 9
      }
    ]
  };

  const parsed = parseExternalElectionJson(sampleExternalPayload);
  assert.equal(parsed.nationalReportingPct, 38);
  assert.ok(parsed.patches['GA']);
  assert.equal(parsed.patches['GA'].reportingPct, 64);
  assert.equal(parsed.patches['GA'].senate?.demVotes, 1540000);
  assert.equal(parsed.patches['GA'].house?.gopSeats, 9);

  const baseStates: StateElectionResult[] = [
    {
      id: 'GA',
      stateCode: 'GA',
      stateName: 'Georgia',
      hasSenateRace: true,
      hasGovernorRace: true,
      houseSeats: 14,
      senate: {
        demCandidate: { name: 'Jon Ossoff', party: 'DEM', votes: 0, pct: 50 },
        gopCandidate: { name: 'GOP', party: 'GOP', votes: 0, pct: 50 },
        otherVotes: 0,
        reportingPct: 0,
        status: 'uncalled',
        historical2022: { demPct: 51.4, gopPct: 48.6, margin: 2.8, winner: 'dem', reportingPct: 100 }
      },
      house: {
        totalSeats: 14,
        demSeats: 0,
        gopSeats: 0,
        uncalledSeats: 14,
        popularDemVotes: 0,
        popularGopVotes: 0,
        reportingPct: 0,
        historical2022: { demSeats: 5, gopSeats: 9, demPopularPct: 47.5, gopPopularPct: 52.5, margin: -5.0 }
      }
    }
  ];

  const patched = applyLivePatchesToStates(baseStates, parsed.patches);
  assert.equal(patched['GA'].senate?.reportingPct, 64);
  assert.equal(patched['GA'].senate?.demCandidate.votes, 1540000);
  assert.equal(patched['GA'].house?.gopSeats, 9);
  assert.equal(patched['GA'].house?.uncalledSeats, 0);
});

import fs from 'node:fs';
import path from 'node:path';
import { BASE_STATES, HOURLY_TIMELINE } from '../data/electionData2026.js';
import { getTimelineIndexForRealTime } from './liveElectionFeed.js';

test('end-to-end live-test-feed.json parses, updates 50 states, and computes Top Surprises accurately', () => {
  const feedPath = path.resolve(process.cwd(), 'public/live-test-feed.json');
  const rawJson = JSON.parse(fs.readFileSync(feedPath, 'utf-8'));

  const { nationalReportingPct, patches } = parseExternalElectionJson(rawJson);
  assert.equal(nationalReportingPct, 18);
  assert.equal(Object.keys(patches).length, 7);

  const updatedStatesMap = applyLivePatchesToStates(BASE_STATES, patches);
  const updatedStatesList = Object.values(updatedStatesMap);

  // Check that GA has 58% reporting and MI (which is not in the early feed) still has 0% reporting
  assert.equal(updatedStatesMap['GA'].senate?.reportingPct, 58);
  assert.equal(updatedStatesMap['MI'].senate?.reportingPct, 0);
  assert.equal(updatedStatesMap['CA'].house?.reportingPct, 0);

  // Check that Top Surprises only includes states from the 7 reporting states
  const surprises = getTopElectionSurprises(updatedStatesList, 'senate', 6);
  assert.ok(surprises.length > 0);
  for (const s of surprises) {
    assert.ok(s.reportingPct > 0, `Expected ${s.stateCode} to have reportingPct > 0`);
  }
});

test('Wednesday morning 07:15 CET wave shows active counting (76%) with undecided battleground seats', () => {
  const wedMorningCet = new Date('2026-11-04T07:15:00+01:00');
  const idx = getTimelineIndexForRealTime(wedMorningCet);
  assert.equal(idx, 6);

  const snap = HOURLY_TIMELINE[idx];
  assert.equal(snap.nationalReportingPct, 76);
  assert.equal(snap.cetLabel, '07:00 CET');

  // Verify all 51 jurisdictions have closed polls and are reporting in wave 6
  assert.equal(Object.keys(snap.stateProgress).length, 51);
  assert.ok(snap.stateProgress['AK'].reportingPct > 0 && snap.stateProgress['AK'].reportingPct < 30);
  assert.ok(snap.stateProgress['CA'].reportingPct > 30 && snap.stateProgress['CA'].reportingPct < 60);
  assert.ok(snap.stateProgress['FL'].reportingPct >= 95);
});

test('Alaska House at-large race with Ranked Choice Voting computes realistic coalition margins and RCV tossup status', () => {
  const alaskaState = BASE_STATES.find(s => s.id === 'AK');
  assert.ok(alaskaState);
  assert.ok(alaskaState.house);
  assert.equal(alaskaState.house.totalSeats, 1);
  assert.equal(alaskaState.house.rankedChoiceActive, true);

  // Total candidate votes
  const cands = alaskaState.house.candidates!;
  assert.equal(cands.length, 4);
  const begich = cands.find(c => c.name.includes('Begich'));
  const hill = cands.find(c => c.name.includes('Hill'));
  const hafner = cands.find(c => c.name.includes('Hafner'));
  const mcdermott = cands.find(c => c.name.includes('McDermott'));

  assert.ok(begich && begich.votes === 104276 && begich.pct === 49.80);
  assert.ok(hill && hill.votes === 83996 && hill.pct === 40.11);
  assert.ok(hafner && hafner.votes === 15135 && hafner.pct === 7.23);
  assert.ok(mcdermott && mcdermott.votes === 5658 && mcdermott.pct === 2.70);

  // Political impact assessment
  const impact = getPoliticalImpactAssessment(alaskaState, 'house');
  assert.equal(impact.badgeLabel, '⚡ RCV Tossup');
  assert.ok(impact.whyItMatters.includes('Ranked-Choice Voting'));

  // Top Surprises should reflect realistic RCV swing (~ +12.4 R vs 2022 baseline), NOT +84.5 R!
  const surprises = getTopElectionSurprises([alaskaState], 'house', 1);
  assert.equal(surprises.length, 1);
  const akSurprise = surprises[0];
  assert.equal(akSurprise.significance, 'RCV Tossup');
  assert.ok(akSurprise.swingValue > -20 && akSurprise.swingValue < -10, `Expected swing around -12.4, got ${akSurprise.swingValue}`);
  assert.equal(akSurprise.currentLeaderName, 'Nick Begich III');
  assert.equal(akSurprise.currentTrailingName, 'Bill Hill');
  assert.equal(akSurprise.currentTrailingParty, 'IND');
});

test('Alaska Senate race with Ranked Choice Voting includes all 4 candidates and RCV note', () => {
  const alaskaState = BASE_STATES.find(s => s.id === 'AK');
  assert.ok(alaskaState);
  assert.ok(alaskaState.senate);
  assert.equal(alaskaState.senate.rankedChoiceActive, true);

  const cands = alaskaState.senate.candidates!;
  assert.equal(cands.length, 4);
  const sullivan = cands.find(c => c.name === 'Dan Sullivan');
  const peltola = cands.find(c => c.name === 'Mary Peltola');
  const heikes = cands.find(c => c.name.includes('Heikes'));
  const sullivanJr = cands.find(c => c.name.includes('Jr. Sullivan') || c.name.includes('Daniel J.'));

  assert.ok(sullivan && sullivan.votes === 101576 && sullivan.pct === 48.32);
  assert.ok(peltola && peltola.votes === 100504 && peltola.pct === 47.81);
  assert.ok(heikes && heikes.votes === 4631 && heikes.pct === 2.20);
  assert.ok(sullivanJr && sullivanJr.votes === 3507 && sullivanJr.pct === 1.67);

  const impact = getPoliticalImpactAssessment(alaskaState, 'senate');
  assert.ok(impact.whyItMatters.includes('Ranked-Choice Voting'));
});

test('normalizeSeatHeights uses full vertical height (1.0) and maintains minimum visibility baseline (0.20)', () => {
  const mockDem: VisualizedSeat[] = [
    {
      id: 'd1',
      stateCode: 'CA',
      label: 'Safe Dem',
      chamber: 'house',
      party: 'dem',
      isHoldover: true,
      isFlip: false,
      swingVs2022: 0,
      rawSurpriseScore: 0,
      normalizedHeight: 0,
      reportingPct: 100,
      margin2026: 30,
      margin2022: 30
    },
    {
      id: 'd2',
      stateCode: 'OH',
      label: 'Surprise Dem Flip',
      chamber: 'house',
      party: 'dem',
      isHoldover: false,
      isFlip: true,
      swingVs2022: 8,
      rawSurpriseScore: 23, // 8 + 15
      normalizedHeight: 0,
      reportingPct: 100,
      margin2026: 2,
      margin2022: -6
    }
  ];

  const mockGop: VisualizedSeat[] = [
    {
      id: 'r1',
      stateCode: 'WY',
      label: 'Safe GOP',
      chamber: 'house',
      party: 'gop',
      isHoldover: false,
      isFlip: false,
      swingVs2022: 0,
      rawSurpriseScore: 0,
      normalizedHeight: 0,
      reportingPct: 100,
      margin2026: 40,
      margin2022: 40
    },
    {
      id: 'r2',
      stateCode: 'PA',
      label: 'Moderate GOP Gain',
      chamber: 'house',
      party: 'gop',
      isHoldover: false,
      isFlip: false,
      swingVs2022: 11.5,
      rawSurpriseScore: 11.5,
      normalizedHeight: 0,
      reportingPct: 100,
      margin2026: 5,
      margin2022: -6.5
    }
  ];

  const normalized = normalizeSeatHeights(mockDem, mockGop, 0.20);
  assert.equal(normalized.maxRawSurprise, 23);

  // Seat d1 (Holdover): exactly 0.20 baseline
  assert.equal(normalized.demSeats[0].normalizedHeight, 0.20);

  // Seat d2 (Max surprise): exactly 1.0 (uses full container height!)
  assert.equal(normalized.demSeats[1].normalizedHeight, 1.0);

  // Seat r1 (0 surprise): exactly 0.20 baseline
  assert.equal(normalized.gopSeats[0].normalizedHeight, 0.20);

  // Seat r2 (11.5 / 23 = 50% surprise): 0.20 + 0.80 * 0.5 = 0.60
  assert.equal(normalized.gopSeats[1].normalizedHeight, 0.60);
});

test('calculateSenateSeatDistribution accounts for all 100 seats and sorts by Option 1B towards center', () => {
  const dist = calculateSenateSeatDistribution(BASE_STATES);

  // Total must be exactly 100
  const totalCounted = dist.demSeats.length + dist.gopSeats.length + dist.uncalledCount;
  assert.equal(totalCounted, 100, `Expected 100 total seats, got ${totalCounted}`);
  assert.equal(dist.totalSeats, 100);
  assert.equal(dist.majorityThreshold, 51);

  // Normalization bounds: All seats must be between 0.20 and 1.0
  [...dist.demSeats, ...dist.gopSeats].forEach(seat => {
    assert.ok(seat.normalizedHeight >= 0.20 && seat.normalizedHeight <= 1.0,
      `Seat ${seat.id} height ${seat.normalizedHeight} out of bounds [0.20, 1.0]`);
  });

  // Full height check: If any race had surprise, max height must be exactly 1.0
  if (dist.maxRawSurprise > 0) {
    const allHeights = [...dist.demSeats, ...dist.gopSeats].map(s => s.normalizedHeight);
    const maxHeight = Math.max(...allHeights);
    assert.equal(maxHeight, 1.0, `Expected max height 1.0, got ${maxHeight}`);
  }

  // Option 1B Sorting:
  // Democrats: Ascending order (safest seats on outer left flank, highest surprise towards center)
  for (let i = 0; i < dist.demSeats.length - 1; i++) {
    assert.ok(
      dist.demSeats[i].rawSurpriseScore <= dist.demSeats[i + 1].rawSurpriseScore,
      `Dem seats not sorted ascending at index ${i}: ${dist.demSeats[i].rawSurpriseScore} > ${dist.demSeats[i + 1].rawSurpriseScore}`
    );
  }

  // Republicans: Descending order (highest surprise near center, safest seats on outer right flank)
  for (let i = 0; i < dist.gopSeats.length - 1; i++) {
    assert.ok(
      dist.gopSeats[i].rawSurpriseScore >= dist.gopSeats[i + 1].rawSurpriseScore,
      `GOP seats not sorted descending at index ${i}: ${dist.gopSeats[i].rawSurpriseScore} < ${dist.gopSeats[i + 1].rawSurpriseScore}`
    );
  }
});

test('calculateHouseSeatDistribution accounts for all 435 voting seats and sorts by Option 1B towards center', () => {
  const dist = calculateHouseSeatDistribution(BASE_STATES);

  // Total must be exactly 435 voting seats
  const totalCounted = dist.demSeats.length + dist.gopSeats.length + dist.uncalledCount;
  assert.equal(totalCounted, 435, `Expected 435 total House seats, got ${totalCounted}`);
  assert.equal(dist.totalSeats, 435);
  assert.equal(dist.majorityThreshold, 218);

  // Normalization bounds: All seats must be between 0.20 and 1.0
  [...dist.demSeats, ...dist.gopSeats].forEach(seat => {
    assert.ok(seat.normalizedHeight >= 0.20 && seat.normalizedHeight <= 1.0,
      `Seat ${seat.id} height ${seat.normalizedHeight} out of bounds [0.20, 1.0]`);
  });

  // Full height check: Max height must be exactly 1.0
  if (dist.maxRawSurprise > 0) {
    const allHeights = [...dist.demSeats, ...dist.gopSeats].map(s => s.normalizedHeight);
    const maxHeight = Math.max(...allHeights);
    assert.equal(maxHeight, 1.0, `Expected max height 1.0, got ${maxHeight}`);
  }

  // Option 1B Sorting:
  // Democrats: Ascending order
  for (let i = 0; i < dist.demSeats.length - 1; i++) {
    assert.ok(
      dist.demSeats[i].rawSurpriseScore <= dist.demSeats[i + 1].rawSurpriseScore,
      `Dem House seats not sorted ascending at index ${i}`
    );
  }

  // Republicans: Descending order
  for (let i = 0; i < dist.gopSeats.length - 1; i++) {
    assert.ok(
      dist.gopSeats[i].rawSurpriseScore >= dist.gopSeats[i + 1].rawSurpriseScore,
      `GOP House seats not sorted descending at index ${i}`
    );
  }
});

test('getEffectiveRaceMarginAndSwing generalizes Top-2 competitor margin in multi-candidate races (e.g. Montana)', () => {
  const mtState = BASE_STATES.find(s => s.id === 'MT');
  assert.ok(mtState && mtState.senate);

  const effective = getEffectiveRaceMarginAndSwing(mtState.senate);
  assert.equal(effective.isMultiCandidate, true);
  assert.equal(effective.leadCandidate.name, 'Kurt Alme');
  assert.equal(effective.leadCandidate.party, 'GOP');
  assert.equal(effective.runnerUpCandidate.name, 'Seth Bodnar');
  assert.equal(effective.runnerUpCandidate.party, 'IND');

  // Direct margin between Alme (48.15%) and Bodnar (38.13%) is ~10.02 pp GOP lead (-10.02)
  assert.ok(
    effective.effectiveMargin2026 <= -9.5 && effective.effectiveMargin2026 >= -10.5,
    `Expected margin around -10.02, got ${effective.effectiveMargin2026}`
  );

  // Compared to 2022 baseline (-11.0 pp GOP), swing is practically flat (~ +1.0 pp to Bodnar/anti-GOP), NOT +25.5 pp!
  assert.ok(
    effective.swingVs2022 >= -0.5 && effective.swingVs2022 <= 2.0,
    `Expected swing around +1.0, got ${effective.swingVs2022}`
  );

  // In Senate seat distribution, Montana should have rawSurpriseScore = 0 and baseline height = 0.20
  const dist = calculateSenateSeatDistribution(BASE_STATES);
  const mtSeat = dist.gopSeats.find(s => s.stateCode === 'MT');
  assert.ok(mtSeat, 'Montana seat should be present in GOP seats');
  assert.equal(mtSeat.rawSurpriseScore, 0, 'Montana should have 0 surprise bonus because GOP margin narrowed slightly');
  assert.equal(mtSeat.normalizedHeight, 0.20, 'Montana seat height should be baseline 0.20');
});





