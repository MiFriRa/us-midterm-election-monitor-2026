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


