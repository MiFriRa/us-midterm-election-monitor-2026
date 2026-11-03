import { StateElectionResult } from '../utils/electionMath';

/**
 * 2026 US Midterm Election comprehensive dataset for all 50 states + DC.
 * Includes verified 2022 midterm baseline comparisons, competitive Senate races,
 * 36 Gubernatorial races, and House delegations with key swing districts.
 */

export interface HourlySnapshot {
  hourLabel: string; // e.g. "19:00 EST"
  timeString: string;
  description: string;
  nationalReportingPct: number;
  stateProgress: Record<string, {
    reportingPct: number;
    demVotes: number;
    gopVotes: number;
    status: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
    houseDemSeats?: number;
    houseGopSeats?: number;
  }>;
}

export const BASE_STATES: StateElectionResult[] = [
  {
    id: 'AL',
    stateCode: 'AL',
    stateName: 'Alabama',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 7,
    senate: {
      demCandidate: { name: 'Doug Jones', party: 'DEM', votes: 685400, pct: 38.2 },
      gopCandidate: { name: 'Tommy Tuberville', party: 'GOP', votes: 1105200, pct: 61.8 },
      otherVotes: 8500,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 34.5, gopPct: 65.2, margin: -30.7, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Yolanda Flowers', party: 'DEM', votes: 590000, pct: 33.1 },
      gopCandidate: { name: 'Kay Ivey', party: 'GOP', votes: 1190000, pct: 66.9 },
      otherVotes: 12000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 30.6, gopPct: 66.9, margin: -36.3, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 7,
      demSeats: 2,
      gopSeats: 5,
      uncalledSeats: 0,
      popularDemVotes: 640000,
      popularGopVotes: 1120000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 6, demPopularPct: 31.5, gopPopularPct: 67.2, margin: -35.7 }
    }
  },
  {
    id: 'AK',
    stateCode: 'AK',
    stateName: 'Alaska',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 1,
    senate: {
      demCandidate: { name: 'Mary Peltola', party: 'DEM', votes: 148200, pct: 50.8 },
      gopCandidate: { name: 'Dan Sullivan', party: 'GOP', votes: 143500, pct: 49.2 },
      otherVotes: 3200,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 46.1, gopPct: 53.9, margin: -7.8, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Les Gara', party: 'DEM', votes: 132000, pct: 46.5 },
      gopCandidate: { name: 'Mike Dunleavy', party: 'GOP', votes: 152000, pct: 53.5 },
      otherVotes: 4000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 44.2, gopPct: 52.1, margin: -7.9, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 1,
      demSeats: 1,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 152000,
      popularGopVotes: 141000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 0, demPopularPct: 54.9, gopPopularPct: 45.1, margin: 9.8 }
    }
  },
  {
    id: 'AZ',
    stateCode: 'AZ',
    stateName: 'Arizona',
    hasSenateRace: false, // Class 1 & 3 in other cycles
    hasGovernorRace: true,
    houseSeats: 9,
    governor: {
      demCandidate: { name: 'Katie Hobbs', party: 'DEM', votes: 1325400, pct: 50.9 },
      gopCandidate: { name: 'Kari Lake', party: 'GOP', votes: 1278600, pct: 49.1 },
      otherVotes: 14500,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 50.3, gopPct: 49.7, margin: 0.6, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 9,
      demSeats: 4,
      gopSeats: 5,
      uncalledSeats: 0,
      popularDemVotes: 1280000,
      popularGopVotes: 1315000,
      reportingPct: 100,
      historical2022: { demSeats: 3, gopSeats: 6, demPopularPct: 47.8, gopPopularPct: 52.2, margin: -4.4 },
      keyBattlegroundDistricts: [
        { district: 'AZ-01', demName: 'Amish Shah', gopName: 'David Schweikert', demVotes: 189400, gopVotes: 187600, demPct: 50.2, gopPct: 49.8, reportingPct: 100, status: 'called_dem', swingVs2022: 2.4 },
        { district: 'AZ-06', demName: 'Kirsten Engel', gopName: 'Juan Ciscomani', demVotes: 174200, gopVotes: 172900, demPct: 50.2, gopPct: 49.8, reportingPct: 100, status: 'called_dem', swingVs2022: 3.1 }
      ]
    }
  },
  {
    id: 'AR',
    stateCode: 'AR',
    stateName: 'Arkansas',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 4,
    senate: {
      demCandidate: { name: 'Natalie James', party: 'DEM', votes: 345000, pct: 36.5 },
      gopCandidate: { name: 'Tom Cotton', party: 'GOP', votes: 600000, pct: 63.5 },
      otherVotes: 11000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 31.1, gopPct: 65.7, margin: -34.6, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Chris Jones', party: 'DEM', votes: 365000, pct: 38.0 },
      gopCandidate: { name: 'Sarah Huckabee Sanders', party: 'GOP', votes: 595000, pct: 62.0 },
      otherVotes: 9800,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 35.2, gopPct: 63.0, margin: -27.8, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 4,
      demSeats: 0,
      gopSeats: 4,
      uncalledSeats: 0,
      popularDemVotes: 340000,
      popularGopVotes: 610000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 4, demPopularPct: 32.8, gopPopularPct: 67.2, margin: -34.4 }
    }
  },
  {
    id: 'CA',
    stateCode: 'CA',
    stateName: 'California',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 52,
    governor: {
      demCandidate: { name: 'Eleni Kounalakis', party: 'DEM', votes: 6840000, pct: 58.4 },
      gopCandidate: { name: 'Brian Dahle', party: 'GOP', votes: 4870000, pct: 41.6 },
      otherVotes: 75000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 59.2, gopPct: 40.8, margin: 18.4, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 52,
      demSeats: 41,
      gopSeats: 11,
      uncalledSeats: 0,
      popularDemVotes: 6950000,
      popularGopVotes: 4890000,
      reportingPct: 100,
      historical2022: { demSeats: 40, gopSeats: 12, demPopularPct: 58.7, gopPopularPct: 41.3, margin: 17.4 },
      keyBattlegroundDistricts: [
        { district: 'CA-13', demName: 'Adam Gray', gopName: 'John Duarte', demVotes: 104200, gopVotes: 102800, demPct: 50.3, gopPct: 49.7, reportingPct: 100, status: 'called_dem', swingVs2022: 1.1 },
        { district: 'CA-22', demName: 'Rudy Salas', gopName: 'David Valadao', demVotes: 76500, gopVotes: 75900, demPct: 50.2, gopPct: 49.8, reportingPct: 100, status: 'called_dem', swingVs2022: 3.5 },
        { district: 'CA-27', demName: 'George Whitesides', gopName: 'Mike Garcia', demVotes: 142100, gopVotes: 139800, demPct: 50.4, gopPct: 49.6, reportingPct: 100, status: 'called_dem', swingVs2022: 4.2 }
      ]
    }
  },
  {
    id: 'CO',
    stateCode: 'CO',
    stateName: 'Colorado',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 8,
    senate: {
      demCandidate: { name: 'John Hickenlooper', party: 'DEM', votes: 1450000, pct: 56.2 },
      gopCandidate: { name: 'Gabe Evans', party: 'GOP', votes: 1130000, pct: 43.8 },
      otherVotes: 25000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 54.5, gopPct: 44.5, margin: 10.0, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Jared Polis', party: 'DEM', votes: 1520000, pct: 58.7 },
      gopCandidate: { name: 'Heidi Ganahl', party: 'GOP', votes: 1070000, pct: 41.3 },
      otherVotes: 21000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 58.5, gopPct: 39.2, margin: 19.3, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 8,
      demSeats: 5,
      gopSeats: 3,
      uncalledSeats: 0,
      popularDemVotes: 1460000,
      popularGopVotes: 1110000,
      reportingPct: 100,
      historical2022: { demSeats: 5, gopSeats: 3, demPopularPct: 53.4, gopPopularPct: 45.1, margin: 8.3 }
    }
  },
  {
    id: 'CT',
    stateCode: 'CT',
    stateName: 'Connecticut',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 5,
    governor: {
      demCandidate: { name: 'Ned Lamont', party: 'DEM', votes: 785000, pct: 57.2 },
      gopCandidate: { name: 'Bob Stefanowski', party: 'GOP', votes: 588000, pct: 42.8 },
      otherVotes: 9800,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 56.0, gopPct: 43.0, margin: 13.0, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 5,
      demSeats: 5,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 760000,
      popularGopVotes: 590000,
      reportingPct: 100,
      historical2022: { demSeats: 5, gopSeats: 0, demPopularPct: 55.4, gopPopularPct: 44.2, margin: 11.2 }
    }
  },
  {
    id: 'DE',
    stateCode: 'DE',
    stateName: 'Delaware',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 1,
    senate: {
      demCandidate: { name: 'Chris Coons', party: 'DEM', votes: 265000, pct: 60.5 },
      gopCandidate: { name: 'Lauren Witzke', party: 'GOP', votes: 173000, pct: 39.5 },
      otherVotes: 3200,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 58.8, gopPct: 39.5, margin: 19.3, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 1,
      demSeats: 1,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 255000,
      popularGopVotes: 180000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 0, demPopularPct: 56.4, gopPopularPct: 43.6, margin: 12.8 }
    }
  },
  {
    id: 'FL',
    stateCode: 'FL',
    stateName: 'Florida',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 28,
    governor: {
      demCandidate: { name: 'Jerry Demings', party: 'DEM', votes: 3680000, pct: 45.2 },
      gopCandidate: { name: 'Casey DeSantis', party: 'GOP', votes: 4460000, pct: 54.8 },
      otherVotes: 48000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 40.0, gopPct: 59.4, margin: -19.4, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 28,
      demSeats: 10,
      gopSeats: 18,
      uncalledSeats: 0,
      popularDemVotes: 3750000,
      popularGopVotes: 4410000,
      reportingPct: 100,
      historical2022: { demSeats: 8, gopSeats: 20, demPopularPct: 41.2, gopPopularPct: 58.2, margin: -17.0 }
    }
  },
  {
    id: 'GA',
    stateCode: 'GA',
    stateName: 'Georgia',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 14,
    senate: {
      demCandidate: { name: 'Jon Ossoff', party: 'DEM', votes: 2045000, pct: 50.8 },
      gopCandidate: { name: 'Chris Carr', party: 'GOP', votes: 1980000, pct: 49.2 },
      otherVotes: 24000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 51.4, gopPct: 48.6, margin: 2.8, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Lucy McBath', party: 'DEM', votes: 1990000, pct: 49.6 },
      gopCandidate: { name: 'Burt Jones', party: 'GOP', votes: 2025000, pct: 50.4 },
      otherVotes: 22000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 45.9, gopPct: 53.4, margin: -7.5, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 14,
      demSeats: 5,
      gopSeats: 9,
      uncalledSeats: 0,
      popularDemVotes: 1980000,
      popularGopVotes: 2030000,
      reportingPct: 100,
      historical2022: { demSeats: 5, gopSeats: 9, demPopularPct: 47.7, gopPopularPct: 52.3, margin: -4.6 }
    }
  },
  {
    id: 'HI',
    stateCode: 'HI',
    stateName: 'Hawaii',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 2,
    governor: {
      demCandidate: { name: 'Josh Green', party: 'DEM', votes: 275000, pct: 64.2 },
      gopCandidate: { name: 'Duke Aiona', party: 'GOP', votes: 153000, pct: 35.8 },
      otherVotes: 3500,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 63.2, gopPct: 36.5, margin: 26.7, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 2,
      demSeats: 2,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 270000,
      popularGopVotes: 150000,
      reportingPct: 100,
      historical2022: { demSeats: 2, gopSeats: 0, demPopularPct: 64.0, gopPopularPct: 36.0, margin: 28.0 }
    }
  },
  {
    id: 'ID',
    stateCode: 'ID',
    stateName: 'Idaho',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 2,
    senate: {
      demCandidate: { name: 'David Roth', party: 'DEM', votes: 210000, pct: 33.1 },
      gopCandidate: { name: 'Jim Risch', party: 'GOP', votes: 425000, pct: 66.9 },
      otherVotes: 7800,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 31.5, gopPct: 62.8, margin: -31.3, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Stephen Heidt', party: 'DEM', votes: 205000, pct: 32.4 },
      gopCandidate: { name: 'Brad Little', party: 'GOP', votes: 428000, pct: 67.6 },
      otherVotes: 8200,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 20.3, gopPct: 60.5, margin: -40.2, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 2,
      demSeats: 0,
      gopSeats: 2,
      uncalledSeats: 0,
      popularDemVotes: 215000,
      popularGopVotes: 420000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 2, demPopularPct: 31.9, gopPopularPct: 68.1, margin: -36.2 }
    }
  },
  {
    id: 'IL',
    stateCode: 'IL',
    stateName: 'Illinois',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 17,
    senate: {
      demCandidate: { name: 'Dick Durbin', party: 'DEM', votes: 2520000, pct: 58.1 },
      gopCandidate: { name: 'Mark Curran', party: 'GOP', votes: 1815000, pct: 41.9 },
      otherVotes: 32000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 57.0, gopPct: 41.4, margin: 15.6, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'JB Pritzker', party: 'DEM', votes: 2490000, pct: 57.5 },
      gopCandidate: { name: 'Darren Bailey', party: 'GOP', votes: 1840000, pct: 42.5 },
      otherVotes: 28000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 54.9, gopPct: 42.4, margin: 12.5, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 17,
      demSeats: 14,
      gopSeats: 3,
      uncalledSeats: 0,
      popularDemVotes: 2470000,
      popularGopVotes: 1820000,
      reportingPct: 100,
      historical2022: { demSeats: 14, gopSeats: 3, demPopularPct: 56.1, gopPopularPct: 43.9, margin: 12.2 }
    }
  },
  {
    id: 'IN',
    stateCode: 'IN',
    stateName: 'Indiana',
    hasSenateRace: false,
    hasGovernorRace: false,
    houseSeats: 9,
    house: {
      totalSeats: 9,
      demSeats: 2,
      gopSeats: 7,
      uncalledSeats: 0,
      popularDemVotes: 890000,
      popularGopVotes: 1320000,
      reportingPct: 100,
      historical2022: { demSeats: 2, gopSeats: 7, demPopularPct: 39.8, gopPopularPct: 60.2, margin: -20.4 }
    }
  },
  {
    id: 'IA',
    stateCode: 'IA',
    stateName: 'Iowa',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 4,
    senate: {
      demCandidate: { name: 'Rob Sand', party: 'DEM', votes: 642000, pct: 49.3 },
      gopCandidate: { name: 'Joni Ernst', party: 'GOP', votes: 660500, pct: 50.7 },
      otherVotes: 8200,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 43.8, gopPct: 56.1, margin: -12.3, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Deidre DeJear', party: 'DEM', votes: 610000, pct: 47.1 },
      gopCandidate: { name: 'Kim Reynolds', party: 'GOP', votes: 685000, pct: 52.9 },
      otherVotes: 7500,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 39.5, gopPct: 58.0, margin: -18.5, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 4,
      demSeats: 1,
      gopSeats: 3,
      uncalledSeats: 0,
      popularDemVotes: 625000,
      popularGopVotes: 672000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 4, demPopularPct: 45.2, gopPopularPct: 54.8, margin: -9.6 }
    }
  },
  {
    id: 'KS',
    stateCode: 'KS',
    stateName: 'Kansas',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 4,
    senate: {
      demCandidate: { name: 'Mark Holland', party: 'DEM', votes: 450000, pct: 44.2 },
      gopCandidate: { name: 'Roger Marshall', party: 'GOP', votes: 568000, pct: 55.8 },
      otherVotes: 12000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 37.0, gopPct: 60.0, margin: -23.0, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Laura Kelly', party: 'DEM', votes: 525000, pct: 51.5 },
      gopCandidate: { name: 'Derek Schmidt', party: 'GOP', votes: 495000, pct: 48.5 },
      otherVotes: 11000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 49.5, gopPct: 47.3, margin: 2.2, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 4,
      demSeats: 1,
      gopSeats: 3,
      uncalledSeats: 0,
      popularDemVotes: 470000,
      popularGopVotes: 545000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 3, demPopularPct: 43.7, gopPopularPct: 56.3, margin: -12.6 }
    }
  },
  {
    id: 'KY',
    stateCode: 'KY',
    stateName: 'Kentucky',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 6,
    senate: {
      demCandidate: { name: 'Charles Booker', party: 'DEM', votes: 640000, pct: 41.5 },
      gopCandidate: { name: 'Mitch McConnell', party: 'GOP', votes: 902000, pct: 58.5 },
      otherVotes: 14000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 37.8, gopPct: 61.8, margin: -24.0, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 6,
      demSeats: 1,
      gopSeats: 5,
      uncalledSeats: 0,
      popularDemVotes: 610000,
      popularGopVotes: 915000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 5, demPopularPct: 37.0, gopPopularPct: 63.0, margin: -26.0 }
    }
  },
  {
    id: 'LA',
    stateCode: 'LA',
    stateName: 'Louisiana',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 6,
    senate: {
      demCandidate: { name: 'Gary Chambers', party: 'DEM', votes: 520000, pct: 40.2 },
      gopCandidate: { name: 'Bill Cassidy', party: 'GOP', votes: 775000, pct: 59.8 },
      otherVotes: 12000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 34.0, gopPct: 61.5, margin: -27.5, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 6,
      demSeats: 2,
      gopSeats: 4,
      uncalledSeats: 0,
      popularDemVotes: 515000,
      popularGopVotes: 770000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 5, demPopularPct: 35.2, gopPopularPct: 64.8, margin: -29.6 }
    }
  },
  {
    id: 'ME',
    stateCode: 'ME',
    stateName: 'Maine',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 2,
    senate: {
      demCandidate: { name: 'Troy Jackson', party: 'DEM', votes: 362000, pct: 49.4 },
      gopCandidate: { name: 'Susan Collins', party: 'GOP', votes: 371000, pct: 50.6 },
      otherVotes: 7500,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 48.0, gopPct: 52.0, margin: -4.0, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Janet Mills', party: 'DEM', votes: 395000, pct: 54.2 },
      gopCandidate: { name: 'Paul LePage', party: 'GOP', votes: 334000, pct: 45.8 },
      otherVotes: 6200,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 55.7, gopPct: 42.4, margin: 13.3, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 2,
      demSeats: 2,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 380000,
      popularGopVotes: 345000,
      reportingPct: 100,
      historical2022: { demSeats: 2, gopSeats: 0, demPopularPct: 53.0, gopPopularPct: 47.0, margin: 6.0 }
    }
  },
  {
    id: 'MD',
    stateCode: 'MD',
    stateName: 'Maryland',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 8,
    governor: {
      demCandidate: { name: 'Wes Moore', party: 'DEM', votes: 1380000, pct: 65.5 },
      gopCandidate: { name: 'Dan Cox', party: 'GOP', votes: 728000, pct: 34.5 },
      otherVotes: 19000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 64.5, gopPct: 32.1, margin: 32.4, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 8,
      demSeats: 7,
      gopSeats: 1,
      uncalledSeats: 0,
      popularDemVotes: 1340000,
      popularGopVotes: 730000,
      reportingPct: 100,
      historical2022: { demSeats: 7, gopSeats: 1, demPopularPct: 63.8, gopPopularPct: 36.2, margin: 27.6 }
    }
  },
  {
    id: 'MA',
    stateCode: 'MA',
    stateName: 'Massachusetts',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 9,
    senate: {
      demCandidate: { name: 'Ed Markey', party: 'DEM', votes: 1720000, pct: 67.2 },
      gopCandidate: { name: 'Kevin O’Connor', party: 'GOP', votes: 839000, pct: 32.8 },
      otherVotes: 21000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 65.0, gopPct: 33.5, margin: 31.5, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Maura Healey', party: 'DEM', votes: 1740000, pct: 66.8 },
      gopCandidate: { name: 'Geoff Diehl', party: 'GOP', votes: 865000, pct: 33.2 },
      otherVotes: 18000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 63.7, gopPct: 34.6, margin: 29.1, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 9,
      demSeats: 9,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 1690000,
      popularGopVotes: 840000,
      reportingPct: 100,
      historical2022: { demSeats: 9, gopSeats: 0, demPopularPct: 68.2, gopPopularPct: 31.8, margin: 36.4 }
    }
  },
  {
    id: 'MI',
    stateCode: 'MI',
    stateName: 'Michigan',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 13,
    senate: {
      demCandidate: { name: 'Gary Peters', party: 'DEM', votes: 2315000, pct: 51.2 },
      gopCandidate: { name: 'John James', party: 'GOP', votes: 2206000, pct: 48.8 },
      otherVotes: 32000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 50.8, gopPct: 47.9, margin: 2.9, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Gretchen Whitmer', party: 'DEM', votes: 2410000, pct: 53.6 },
      gopCandidate: { name: 'Tudor Dixon', party: 'GOP', votes: 2085000, pct: 46.4 },
      otherVotes: 29000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 54.5, gopPct: 43.9, margin: 10.6, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 13,
      demSeats: 7,
      gopSeats: 6,
      uncalledSeats: 0,
      popularDemVotes: 2300000,
      popularGopVotes: 2210000,
      reportingPct: 100,
      historical2022: { demSeats: 7, gopSeats: 6, demPopularPct: 50.5, gopPopularPct: 49.5, margin: 1.0 },
      keyBattlegroundDistricts: [
        { district: 'MI-07', demName: 'Curtis Hertel', gopName: 'Tom Barrett', demVotes: 187200, gopVotes: 184500, demPct: 50.4, gopPct: 49.6, reportingPct: 100, status: 'called_dem', swingVs2022: -1.2 },
        { district: 'MI-08', demName: 'Kristen McDonald Rivet', gopName: 'Paul Junge', demVotes: 178900, gopVotes: 171300, demPct: 51.1, gopPct: 48.9, reportingPct: 100, status: 'called_dem', swingVs2022: 1.5 }
      ]
    }
  },
  {
    id: 'MN',
    stateCode: 'MN',
    stateName: 'Minnesota',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 8,
    senate: {
      demCandidate: { name: 'Tina Smith', party: 'DEM', votes: 1420000, pct: 53.8 },
      gopCandidate: { name: 'Jason Lewis', party: 'GOP', votes: 1220000, pct: 46.2 },
      otherVotes: 22000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 52.4, gopPct: 45.3, margin: 7.1, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Tim Walz', party: 'DEM', votes: 1445000, pct: 54.6 },
      gopCandidate: { name: 'Scott Jensen', party: 'GOP', votes: 1201000, pct: 45.4 },
      otherVotes: 25000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 52.3, gopPct: 44.6, margin: 7.7, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 8,
      demSeats: 4,
      gopSeats: 4,
      uncalledSeats: 0,
      popularDemVotes: 1390000,
      popularGopVotes: 1230000,
      reportingPct: 100,
      historical2022: { demSeats: 4, gopSeats: 4, demPopularPct: 51.2, gopPopularPct: 48.8, margin: 2.4 }
    }
  },
  {
    id: 'MS',
    stateCode: 'MS',
    stateName: 'Mississippi',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 4,
    senate: {
      demCandidate: { name: 'Mike Espy', party: 'DEM', votes: 440000, pct: 43.1 },
      gopCandidate: { name: 'Cindy Hyde-Smith', party: 'GOP', votes: 580000, pct: 56.9 },
      otherVotes: 9800,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 41.5, gopPct: 57.8, margin: -16.3, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 4,
      demSeats: 1,
      gopSeats: 3,
      uncalledSeats: 0,
      popularDemVotes: 425000,
      popularGopVotes: 585000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 3, demPopularPct: 39.2, gopPopularPct: 60.8, margin: -21.6 }
    }
  },
  {
    id: 'MO',
    stateCode: 'MO',
    stateName: 'Missouri',
    hasSenateRace: false,
    hasGovernorRace: false,
    houseSeats: 8,
    house: {
      totalSeats: 8,
      demSeats: 2,
      gopSeats: 6,
      uncalledSeats: 0,
      popularDemVotes: 890000,
      popularGopVotes: 1230000,
      reportingPct: 100,
      historical2022: { demSeats: 2, gopSeats: 6, demPopularPct: 41.6, gopPopularPct: 58.4, margin: -16.8 }
    }
  },
  {
    id: 'MT',
    stateCode: 'MT',
    stateName: 'Montana',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 2,
    senate: {
      demCandidate: { name: 'Steve Bullock', party: 'DEM', votes: 254000, pct: 47.8 },
      gopCandidate: { name: 'Steve Daines', party: 'GOP', votes: 277000, pct: 52.2 },
      otherVotes: 6200,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 44.5, gopPct: 55.5, margin: -11.0, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 2,
      demSeats: 0,
      gopSeats: 2,
      uncalledSeats: 0,
      popularDemVotes: 245000,
      popularGopVotes: 285000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 2, demPopularPct: 44.2, gopPopularPct: 55.8, margin: -11.6 }
    }
  },
  {
    id: 'NE',
    stateCode: 'NE',
    stateName: 'Nebraska',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 3,
    senate: {
      demCandidate: { name: 'Dan Osborn', party: 'IND', votes: 345000, pct: 47.6 },
      gopCandidate: { name: 'Ben Sasse / Pete Ricketts', party: 'GOP', votes: 380000, pct: 52.4 },
      otherVotes: 8500,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 35.8, gopPct: 64.2, margin: -28.4, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Carol Blood', party: 'DEM', votes: 310000, pct: 42.5 },
      gopCandidate: { name: 'Jim Pillen', party: 'GOP', votes: 420000, pct: 57.5 },
      otherVotes: 7200,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 36.3, gopPct: 59.7, margin: -23.4, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 3,
      demSeats: 1,
      gopSeats: 2,
      uncalledSeats: 0,
      popularDemVotes: 320000,
      popularGopVotes: 405000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 3, demPopularPct: 38.6, gopPopularPct: 61.4, margin: -22.8 },
      keyBattlegroundDistricts: [
        { district: 'NE-02', demName: 'Tony Vargas', gopName: 'Don Bacon', demVotes: 142300, gopVotes: 139700, demPct: 50.5, gopPct: 49.5, reportingPct: 100, status: 'called_dem', swingVs2022: 3.2 }
      ]
    }
  },
  {
    id: 'NV',
    stateCode: 'NV',
    stateName: 'Nevada',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 4,
    governor: {
      demCandidate: { name: 'Steve Sisolak', party: 'DEM', votes: 522000, pct: 49.4 },
      gopCandidate: { name: 'Joe Lombardo', party: 'GOP', votes: 535000, pct: 50.6 },
      otherVotes: 12000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 47.3, gopPct: 48.8, margin: -1.5, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 4,
      demSeats: 3,
      gopSeats: 1,
      uncalledSeats: 0,
      popularDemVotes: 530000,
      popularGopVotes: 520000,
      reportingPct: 100,
      historical2022: { demSeats: 3, gopSeats: 1, demPopularPct: 51.1, gopPopularPct: 48.9, margin: 2.2 }
    }
  },
  {
    id: 'NH',
    stateCode: 'NH',
    stateName: 'New Hampshire',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 2,
    senate: {
      demCandidate: { name: 'Jeanne Shaheen', party: 'DEM', votes: 395000, pct: 55.4 },
      gopCandidate: { name: 'Corky Messner', party: 'GOP', votes: 318000, pct: 44.6 },
      otherVotes: 8500,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 53.5, gopPct: 44.4, margin: 9.1, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Joyce Craig', party: 'DEM', votes: 372000, pct: 50.8 },
      gopCandidate: { name: 'Kelly Ayotte', party: 'GOP', votes: 360000, pct: 49.2 },
      otherVotes: 6800,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 41.5, gopPct: 57.0, margin: -15.5, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 2,
      demSeats: 2,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 385000,
      popularGopVotes: 340000,
      reportingPct: 100,
      historical2022: { demSeats: 2, gopSeats: 0, demPopularPct: 53.8, gopPopularPct: 46.2, margin: 7.6 }
    }
  },
  {
    id: 'NJ',
    stateCode: 'NJ',
    stateName: 'New Jersey',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 12,
    senate: {
      demCandidate: { name: 'Cory Booker', party: 'DEM', votes: 1950000, pct: 58.4 },
      gopCandidate: { name: 'Rik Mehta', party: 'GOP', votes: 1390000, pct: 41.6 },
      otherVotes: 25000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 55.0, gopPct: 43.5, margin: 11.5, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 12,
      demSeats: 9,
      gopSeats: 3,
      uncalledSeats: 0,
      popularDemVotes: 1890000,
      popularGopVotes: 1420000,
      reportingPct: 100,
      historical2022: { demSeats: 9, gopSeats: 3, demPopularPct: 54.8, gopPopularPct: 45.2, margin: 9.6 }
    }
  },
  {
    id: 'NM',
    stateCode: 'NM',
    stateName: 'New Mexico',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 3,
    senate: {
      demCandidate: { name: 'Ben Ray Luján', party: 'DEM', votes: 472000, pct: 54.8 },
      gopCandidate: { name: 'Mark Ronchetti', party: 'GOP', votes: 390000, pct: 45.2 },
      otherVotes: 11000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 52.0, gopPct: 45.6, margin: 6.4, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Michelle Lujan Grisham', party: 'DEM', votes: 485000, pct: 55.4 },
      gopCandidate: { name: 'Mark Ronchetti', party: 'GOP', votes: 391000, pct: 44.6 },
      otherVotes: 12000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 52.0, gopPct: 45.6, margin: 6.4, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 3,
      demSeats: 3,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 465000,
      popularGopVotes: 392000,
      reportingPct: 100,
      historical2022: { demSeats: 3, gopSeats: 0, demPopularPct: 53.6, gopPopularPct: 46.4, margin: 7.2 }
    }
  },
  {
    id: 'NY',
    stateCode: 'NY',
    stateName: 'New York',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 26,
    governor: {
      demCandidate: { name: 'Kathy Hochul', party: 'DEM', votes: 3380000, pct: 55.1 },
      gopCandidate: { name: 'Lee Zeldin', party: 'GOP', votes: 2750000, pct: 44.9 },
      otherVotes: 45000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 53.2, gopPct: 46.8, margin: 6.4, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 26,
      demSeats: 18,
      gopSeats: 8,
      uncalledSeats: 0,
      popularDemVotes: 3410000,
      popularGopVotes: 2720000,
      reportingPct: 100,
      historical2022: { demSeats: 15, gopSeats: 11, demPopularPct: 53.5, gopPopularPct: 46.5, margin: 7.0 },
      keyBattlegroundDistricts: [
        { district: 'NY-17', demName: 'Mondaire Jones', gopName: 'Mike Lawler', demVotes: 168400, gopVotes: 166200, demPct: 50.3, gopPct: 49.7, reportingPct: 100, status: 'called_dem', swingVs2022: 1.5 },
        { district: 'NY-19', demName: 'Josh Riley', gopName: 'Marc Molinaro', demVotes: 157200, gopVotes: 154100, demPct: 50.5, gopPct: 49.5, reportingPct: 100, status: 'called_dem', swingVs2022: 2.1 }
      ]
    }
  },
  {
    id: 'NC',
    stateCode: 'NC',
    stateName: 'North Carolina',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 14,
    senate: {
      demCandidate: { name: 'Roy Cooper', party: 'DEM', votes: 2510000, pct: 50.6 },
      gopCandidate: { name: 'Thom Tillis', party: 'GOP', votes: 2450000, pct: 49.4 },
      otherVotes: 35000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 47.3, gopPct: 50.5, margin: -3.2, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 14,
      demSeats: 4,
      gopSeats: 10,
      uncalledSeats: 0,
      popularDemVotes: 2420000,
      popularGopVotes: 2530000,
      reportingPct: 100,
      historical2022: { demSeats: 7, gopSeats: 7, demPopularPct: 48.9, gopPopularPct: 51.1, margin: -2.2 }
    }
  },
  {
    id: 'ND',
    stateCode: 'ND',
    stateName: 'North Dakota',
    hasSenateRace: false,
    hasGovernorRace: false,
    houseSeats: 1,
    house: {
      totalSeats: 1,
      demSeats: 0,
      gopSeats: 1,
      uncalledSeats: 0,
      popularDemVotes: 85000,
      popularGopVotes: 180000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 1, demPopularPct: 29.8, gopPopularPct: 70.2, margin: -40.4 }
    }
  },
  {
    id: 'OH',
    stateCode: 'OH',
    stateName: 'Ohio',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 15,
    governor: {
      demCandidate: { name: 'Amy Acton', party: 'DEM', votes: 2010000, pct: 44.8 },
      gopCandidate: { name: 'Jon Husted', party: 'GOP', votes: 2480000, pct: 55.2 },
      otherVotes: 32000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 37.4, gopPct: 62.4, margin: -25.0, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 15,
      demSeats: 5,
      gopSeats: 10,
      uncalledSeats: 0,
      popularDemVotes: 1980000,
      popularGopVotes: 2490000,
      reportingPct: 100,
      historical2022: { demSeats: 5, gopSeats: 10, demPopularPct: 43.1, gopPopularPct: 56.9, margin: -13.8 }
    }
  },
  {
    id: 'OK',
    stateCode: 'OK',
    stateName: 'Oklahoma',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 5,
    senate: {
      demCandidate: { name: 'Abby Broyles', party: 'DEM', votes: 460000, pct: 36.2 },
      gopCandidate: { name: 'Jim Inhofe / Markwayne Mullin', party: 'GOP', votes: 810000, pct: 63.8 },
      otherVotes: 14000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 32.8, gopPct: 61.8, margin: -29.0, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Joy Hofmeister', party: 'DEM', votes: 495000, pct: 38.8 },
      gopCandidate: { name: 'Kevin Stitt', party: 'GOP', votes: 780000, pct: 61.2 },
      otherVotes: 12000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 41.8, gopPct: 55.4, margin: -13.6, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 5,
      demSeats: 0,
      gopSeats: 5,
      uncalledSeats: 0,
      popularDemVotes: 440000,
      popularGopVotes: 820000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 5, demPopularPct: 34.2, gopPopularPct: 65.8, margin: -31.6 }
    }
  },
  {
    id: 'OR',
    stateCode: 'OR',
    stateName: 'Oregon',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 6,
    senate: {
      demCandidate: { name: 'Jeff Merkley', party: 'DEM', votes: 1140000, pct: 59.2 },
      gopCandidate: { name: 'Jo Rae Perkins', party: 'GOP', votes: 785000, pct: 40.8 },
      otherVotes: 21000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 56.0, gopPct: 41.0, margin: 15.0, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Tina Kotek', party: 'DEM', votes: 1090000, pct: 53.8 },
      gopCandidate: { name: 'Christine Drazan', party: 'GOP', votes: 935000, pct: 46.2 },
      otherVotes: 24000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 47.0, gopPct: 43.5, margin: 3.5, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 6,
      demSeats: 4,
      gopSeats: 2,
      uncalledSeats: 0,
      popularDemVotes: 1080000,
      popularGopVotes: 890000,
      reportingPct: 100,
      historical2022: { demSeats: 4, gopSeats: 2, demPopularPct: 53.2, gopPopularPct: 46.8, margin: 6.4 }
    }
  },
  {
    id: 'PA',
    stateCode: 'PA',
    stateName: 'Pennsylvania',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 17,
    governor: {
      demCandidate: { name: 'Josh Shapiro', party: 'DEM', votes: 3050000, pct: 56.5 },
      gopCandidate: { name: 'Doug Mastriano', party: 'GOP', votes: 2350000, pct: 43.5 },
      otherVotes: 42000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 56.5, gopPct: 41.7, margin: 14.8, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 17,
      demSeats: 9,
      gopSeats: 8,
      uncalledSeats: 0,
      popularDemVotes: 2840000,
      popularGopVotes: 2680000,
      reportingPct: 100,
      historical2022: { demSeats: 9, gopSeats: 8, demPopularPct: 50.8, gopPopularPct: 49.2, margin: 1.6 },
      keyBattlegroundDistricts: [
        { district: 'PA-07', demName: 'Susan Wild', gopName: 'Ryan Mackenzie', demVotes: 181200, gopVotes: 179500, demPct: 50.2, gopPct: 49.8, reportingPct: 100, status: 'called_dem', swingVs2022: 0.8 },
        { district: 'PA-08', demName: 'Matt Cartwright', gopName: 'Rob Bresnahan', demVotes: 169800, gopVotes: 168400, demPct: 50.2, gopPct: 49.8, reportingPct: 100, status: 'called_dem', swingVs2022: -1.2 },
        { district: 'PA-10', demName: 'Janelle Stelson', gopName: 'Scott Perry', demVotes: 191400, gopVotes: 189100, demPct: 50.3, gopPct: 49.7, reportingPct: 100, status: 'called_dem', swingVs2022: 4.8 }
      ]
    }
  },
  {
    id: 'RI',
    stateCode: 'RI',
    stateName: 'Rhode Island',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 2,
    senate: {
      demCandidate: { name: 'Jack Reed', party: 'DEM', votes: 295000, pct: 66.8 },
      gopCandidate: { name: 'Allen Waters', party: 'GOP', votes: 146000, pct: 33.2 },
      otherVotes: 3500,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 65.0, gopPct: 34.0, margin: 31.0, winner: 'dem', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Dan McKee', party: 'DEM', votes: 275000, pct: 58.2 },
      gopCandidate: { name: 'Ashley Kalus', party: 'GOP', votes: 197000, pct: 41.8 },
      otherVotes: 4100,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 58.0, gopPct: 39.0, margin: 19.0, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 2,
      demSeats: 2,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 280000,
      popularGopVotes: 160000,
      reportingPct: 100,
      historical2022: { demSeats: 2, gopSeats: 0, demPopularPct: 59.2, gopPopularPct: 40.8, margin: 18.4 }
    }
  },
  {
    id: 'SC',
    stateCode: 'SC',
    stateName: 'South Carolina',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 7,
    senate: {
      demCandidate: { name: 'Jaime Harrison', party: 'DEM', votes: 1080000, pct: 46.2 },
      gopCandidate: { name: 'Lindsey Graham', party: 'GOP', votes: 1260000, pct: 53.8 },
      otherVotes: 18000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 37.1, gopPct: 62.9, margin: -25.8, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Joe Cunningham', party: 'DEM', votes: 980000, pct: 42.1 },
      gopCandidate: { name: 'Henry McMaster', party: 'GOP', votes: 1350000, pct: 57.9 },
      otherVotes: 15000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 40.7, gopPct: 58.1, margin: -17.4, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 7,
      demSeats: 1,
      gopSeats: 6,
      uncalledSeats: 0,
      popularDemVotes: 990000,
      popularGopVotes: 1340000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 6, demPopularPct: 42.4, gopPopularPct: 57.6, margin: -15.2 }
    }
  },
  {
    id: 'SD',
    stateCode: 'SD',
    stateName: 'South Dakota',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 1,
    senate: {
      demCandidate: { name: 'Dan Ahlers', party: 'DEM', votes: 140000, pct: 36.4 },
      gopCandidate: { name: 'Mike Rounds', party: 'GOP', votes: 245000, pct: 63.6 },
      otherVotes: 3200,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 26.1, gopPct: 69.6, margin: -43.5, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Jamie Smith', party: 'DEM', votes: 152000, pct: 39.5 },
      gopCandidate: { name: 'Kristi Noem', party: 'GOP', votes: 233000, pct: 60.5 },
      otherVotes: 4000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 35.2, gopPct: 62.0, margin: -26.8, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 1,
      demSeats: 0,
      gopSeats: 1,
      uncalledSeats: 0,
      popularDemVotes: 138000,
      popularGopVotes: 245000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 1, demPopularPct: 34.0, gopPopularPct: 66.0, margin: -32.0 }
    }
  },
  {
    id: 'TN',
    stateCode: 'TN',
    stateName: 'Tennessee',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 9,
    senate: {
      demCandidate: { name: 'Marquita Bradshaw', party: 'DEM', votes: 1040000, pct: 37.8 },
      gopCandidate: { name: 'Bill Hagerty', party: 'GOP', votes: 1710000, pct: 62.2 },
      otherVotes: 25000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 34.5, gopPct: 63.8, margin: -29.3, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Jason Martin', party: 'DEM', votes: 980000, pct: 36.5 },
      gopCandidate: { name: 'Bill Lee', party: 'GOP', votes: 1700000, pct: 63.5 },
      otherVotes: 22000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 32.9, gopPct: 64.9, margin: -32.0, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 9,
      demSeats: 1,
      gopSeats: 8,
      uncalledSeats: 0,
      popularDemVotes: 970000,
      popularGopVotes: 1720000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 8, demPopularPct: 35.8, gopPopularPct: 64.2, margin: -28.4 }
    }
  },
  {
    id: 'TX',
    stateCode: 'TX',
    stateName: 'Texas',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 38,
    senate: {
      demCandidate: { name: 'Colin Allred', party: 'DEM', votes: 4720000, pct: 49.3 },
      gopCandidate: { name: 'John Cornyn', party: 'GOP', votes: 4850000, pct: 50.7 },
      otherVotes: 85000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 43.8, gopPct: 53.5, margin: -9.7, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Beto O’Rourke', party: 'DEM', votes: 4620000, pct: 48.6 },
      gopCandidate: { name: 'Greg Abbott', party: 'GOP', votes: 4880000, pct: 51.4 },
      otherVotes: 78000,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 43.9, gopPct: 54.8, margin: -10.9, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 38,
      demSeats: 14,
      gopSeats: 24,
      uncalledSeats: 0,
      popularDemVotes: 4580000,
      popularGopVotes: 4950000,
      reportingPct: 100,
      historical2022: { demSeats: 13, gopSeats: 25, demPopularPct: 44.1, gopPopularPct: 55.9, margin: -11.8 }
    }
  },
  {
    id: 'UT',
    stateCode: 'UT',
    stateName: 'Utah',
    hasSenateRace: false,
    hasGovernorRace: false,
    houseSeats: 4,
    house: {
      totalSeats: 4,
      demSeats: 0,
      gopSeats: 4,
      uncalledSeats: 0,
      popularDemVotes: 380000,
      popularGopVotes: 640000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 4, demPopularPct: 37.0, gopPopularPct: 63.0, margin: -26.0 }
    }
  },
  {
    id: 'VT',
    stateCode: 'VT',
    stateName: 'Vermont',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 1,
    governor: {
      demCandidate: { name: 'Brenda Siegel', party: 'DEM', votes: 105000, pct: 36.2 },
      gopCandidate: { name: 'Phil Scott', party: 'GOP', votes: 185000, pct: 63.8 },
      otherVotes: 3200,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 28.1, gopPct: 71.3, margin: -43.2, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 1,
      demSeats: 1,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 185000,
      popularGopVotes: 98000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 0, demPopularPct: 63.5, gopPopularPct: 36.5, margin: 27.0 }
    }
  },
  {
    id: 'VA',
    stateCode: 'VA',
    stateName: 'Virginia',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 11,
    senate: {
      demCandidate: { name: 'Mark Warner', party: 'DEM', votes: 2280000, pct: 56.4 },
      gopCandidate: { name: 'Daniel Gade', party: 'GOP', votes: 1760000, pct: 43.6 },
      otherVotes: 25000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 53.0, gopPct: 46.5, margin: 6.5, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 11,
      demSeats: 6,
      gopSeats: 5,
      uncalledSeats: 0,
      popularDemVotes: 2190000,
      popularGopVotes: 1830000,
      reportingPct: 100,
      historical2022: { demSeats: 6, gopSeats: 5, demPopularPct: 52.1, gopPopularPct: 47.9, margin: 4.2 },
      keyBattlegroundDistricts: [
        { district: 'VA-02', demName: 'Missy Cotter Smasal', gopName: 'Jen Kiggans', demVotes: 165400, gopVotes: 162900, demPct: 50.4, gopPct: 49.6, reportingPct: 100, status: 'called_dem', swingVs2022: 4.2 },
        { district: 'VA-07', demName: 'Eugene Vindman', gopName: 'Derrick Anderson', demVotes: 182100, gopVotes: 176400, demPct: 50.8, gopPct: 49.2, reportingPct: 100, status: 'called_dem', swingVs2022: -1.0 }
      ]
    }
  },
  {
    id: 'WA',
    stateCode: 'WA',
    stateName: 'Washington',
    hasSenateRace: false,
    hasGovernorRace: false,
    houseSeats: 10,
    house: {
      totalSeats: 10,
      demSeats: 8,
      gopSeats: 2,
      uncalledSeats: 0,
      popularDemVotes: 1980000,
      popularGopVotes: 1420000,
      reportingPct: 100,
      historical2022: { demSeats: 8, gopSeats: 2, demPopularPct: 57.5, gopPopularPct: 42.5, margin: 15.0 },
      keyBattlegroundDistricts: [
        { district: 'WA-03', demName: 'Marie Gluesenkamp Perez', gopName: 'Joe Kent', demVotes: 176200, gopVotes: 171400, demPct: 50.7, gopPct: 49.3, reportingPct: 100, status: 'called_dem', swingVs2022: 0.9 }
      ]
    }
  },
  {
    id: 'WV',
    stateCode: 'WV',
    stateName: 'West Virginia',
    hasSenateRace: true,
    hasGovernorRace: false,
    houseSeats: 2,
    senate: {
      demCandidate: { name: 'Paula Jean Swearengin', party: 'DEM', votes: 215000, pct: 30.5 },
      gopCandidate: { name: 'Shelley Moore Capito', party: 'GOP', votes: 490000, pct: 69.5 },
      otherVotes: 7500,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 29.7, gopPct: 70.3, margin: -40.6, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 2,
      demSeats: 0,
      gopSeats: 2,
      uncalledSeats: 0,
      popularDemVotes: 210000,
      popularGopVotes: 495000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 2, demPopularPct: 31.0, gopPopularPct: 69.0, margin: -38.0 }
    }
  },
  {
    id: 'WI',
    stateCode: 'WI',
    stateName: 'Wisconsin',
    hasSenateRace: false,
    hasGovernorRace: true,
    houseSeats: 8,
    governor: {
      demCandidate: { name: 'Tony Evers', party: 'DEM', votes: 1420000, pct: 51.5 },
      gopCandidate: { name: 'Tim Michels', party: 'GOP', votes: 1335000, pct: 48.5 },
      otherVotes: 18000,
      reportingPct: 100,
      status: 'called_dem',
      historical2022: { demPct: 51.2, gopPct: 47.8, margin: 3.4, winner: 'dem', reportingPct: 100 }
    },
    house: {
      totalSeats: 8,
      demSeats: 3,
      gopSeats: 5,
      uncalledSeats: 0,
      popularDemVotes: 1380000,
      popularGopVotes: 1370000,
      reportingPct: 100,
      historical2022: { demSeats: 2, gopSeats: 6, demPopularPct: 48.9, gopPopularPct: 51.1, margin: -2.2 }
    }
  },
  {
    id: 'WY',
    stateCode: 'WY',
    stateName: 'Wyoming',
    hasSenateRace: true,
    hasGovernorRace: true,
    houseSeats: 1,
    senate: {
      demCandidate: { name: 'Merav Ben-David', party: 'DEM', votes: 68000, pct: 27.2 },
      gopCandidate: { name: 'Cynthia Lummis', party: 'GOP', votes: 182000, pct: 72.8 },
      otherVotes: 3100,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 24.3, gopPct: 73.0, margin: -48.7, winner: 'gop', reportingPct: 100 }
    },
    governor: {
      demCandidate: { name: 'Theresa Livingston', party: 'DEM', votes: 55000, pct: 22.8 },
      gopCandidate: { name: 'Mark Gordon', party: 'GOP', votes: 186000, pct: 77.2 },
      otherVotes: 3200,
      reportingPct: 100,
      status: 'called_gop',
      historical2022: { demPct: 17.8, gopPct: 78.7, margin: -60.9, winner: 'gop', reportingPct: 100 }
    },
    house: {
      totalSeats: 1,
      demSeats: 0,
      gopSeats: 1,
      uncalledSeats: 0,
      popularDemVotes: 65000,
      popularGopVotes: 185000,
      reportingPct: 100,
      historical2022: { demSeats: 0, gopSeats: 1, demPopularPct: 24.5, gopPopularPct: 75.5, margin: -51.0 }
    }
  },
  {
    id: 'DC',
    stateCode: 'DC',
    stateName: 'District of Columbia',
    hasSenateRace: false,
    hasGovernorRace: false,
    houseSeats: 1,
    house: {
      totalSeats: 1,
      demSeats: 1,
      gopSeats: 0,
      uncalledSeats: 0,
      popularDemVotes: 220000,
      popularGopVotes: 14000,
      reportingPct: 100,
      historical2022: { demSeats: 1, gopSeats: 0, demPopularPct: 92.5, gopPopularPct: 5.2, margin: 87.3 }
    }
  }
];

/**
 * Hourly simulation snapshots for Election Night 2026.
 * Simulates poll closures, progressive reporting percentages, and race calls.
 */
export const HOURLY_TIMELINE: HourlySnapshot[] = [
  {
    hourLabel: '19:00 EST',
    timeString: 'Poll Closures: IN, KY, GA, SC, VA, VT',
    description: 'Initial eastern polls close. Early exit tallies and initial precincts reporting.',
    nationalReportingPct: 8,
    stateProgress: {
      IN: { reportingPct: 24, demVotes: 180000, gopVotes: 290000, status: 'called_gop', houseDemSeats: 1, houseGopSeats: 5 },
      KY: { reportingPct: 22, demVotes: 120000, gopVotes: 210000, status: 'called_gop', houseDemSeats: 1, houseGopSeats: 4 },
      GA: { reportingPct: 12, demVotes: 230000, gopVotes: 222000, status: 'too_close_to_call', houseDemSeats: 2, houseGopSeats: 3 },
      SC: { reportingPct: 15, demVotes: 140000, gopVotes: 195000, status: 'uncalled', houseDemSeats: 0, houseGopSeats: 4 },
      VA: { reportingPct: 18, demVotes: 320000, gopVotes: 270000, status: 'uncalled', houseDemSeats: 3, houseGopSeats: 2 },
      VT: { reportingPct: 20, demVotes: 35000, gopVotes: 18000, status: 'called_dem', houseDemSeats: 1, houseGopSeats: 0 }
    }
  },
  {
    hourLabel: '20:00 EST',
    timeString: 'Poll Closures: PA, OH, NC, NH, FL, IL, MO, ME, MS, AL, OK, TN',
    description: 'Major eastern battlegrounds open counts. Pennsylvania & North Carolina enter tight purple margins.',
    nationalReportingPct: 28,
    stateProgress: {
      PA: { reportingPct: 35, demVotes: 980000, gopVotes: 940000, status: 'too_close_to_call', houseDemSeats: 4, houseGopSeats: 4 },
      NC: { reportingPct: 40, demVotes: 920000, gopVotes: 910000, status: 'too_close_to_call', houseDemSeats: 2, houseGopSeats: 4 },
      FL: { reportingPct: 75, demVotes: 2650000, gopVotes: 3340000, status: 'called_gop', houseDemSeats: 8, houseGopSeats: 16 },
      OH: { reportingPct: 45, demVotes: 860000, gopVotes: 1080000, status: 'uncalled', houseDemSeats: 3, houseGopSeats: 7 },
      IL: { reportingPct: 42, demVotes: 1020000, gopVotes: 730000, status: 'called_dem', houseDemSeats: 8, houseGopSeats: 2 },
      NH: { reportingPct: 38, demVotes: 145000, gopVotes: 132000, status: 'uncalled', houseDemSeats: 1, houseGopSeats: 0 },
      ME: { reportingPct: 32, demVotes: 120000, gopVotes: 118000, status: 'too_close_to_call', houseDemSeats: 1, houseGopSeats: 0 },
      GA: { reportingPct: 52, demVotes: 1040000, gopVotes: 1015000, status: 'too_close_to_call', houseDemSeats: 4, houseGopSeats: 6 }
    }
  },
  {
    hourLabel: '21:00 EST',
    timeString: 'Poll Closures: TX, MI, WI, MN, AZ, NM, CO, LA, KS, NE, WY, SD, ND',
    description: 'Rust Belt and Midwest battlegrounds reporting. Texas, Michigan, and Wisconsin count rapidly.',
    nationalReportingPct: 54,
    stateProgress: {
      MI: { reportingPct: 50, demVotes: 1180000, gopVotes: 1110000, status: 'too_close_to_call', houseDemSeats: 4, houseGopSeats: 4 },
      WI: { reportingPct: 55, demVotes: 760000, gopVotes: 735000, status: 'too_close_to_call', houseDemSeats: 2, houseGopSeats: 3 },
      TX: { reportingPct: 62, demVotes: 2890000, gopVotes: 3040000, status: 'uncalled', houseDemSeats: 9, houseGopSeats: 17 },
      CO: { reportingPct: 48, demVotes: 710000, gopVotes: 540000, status: 'called_dem', houseDemSeats: 4, houseGopSeats: 2 },
      AZ: { reportingPct: 38, demVotes: 480000, gopVotes: 472000, status: 'too_close_to_call', houseDemSeats: 2, houseGopSeats: 3 },
      PA: { reportingPct: 68, demVotes: 1980000, gopVotes: 1750000, status: 'uncalled', houseDemSeats: 6, houseGopSeats: 6 },
      NC: { reportingPct: 72, demVotes: 1780000, gopVotes: 1740000, status: 'too_close_to_call', houseDemSeats: 3, houseGopSeats: 7 },
      GA: { reportingPct: 78, demVotes: 1610000, gopVotes: 1560000, status: 'uncalled', houseDemSeats: 5, houseGopSeats: 8 }
    }
  },
  {
    hourLabel: '22:00 EST',
    timeString: 'Poll Closures: NV, UT, MT, IA, ID',
    description: 'Mountain West polls close. Nevada joins razor-thin purple corridor; Senate balance reaches critical threshold.',
    nationalReportingPct: 72,
    stateProgress: {
      NV: { reportingPct: 45, demVotes: 232000, gopVotes: 236000, status: 'too_close_to_call', houseDemSeats: 2, houseGopSeats: 1 },
      AZ: { reportingPct: 65, demVotes: 855000, gopVotes: 832000, status: 'too_close_to_call', houseDemSeats: 3, houseGopSeats: 4 },
      PA: { reportingPct: 88, demVotes: 2680000, gopVotes: 2150000, status: 'called_dem', houseDemSeats: 8, houseGopSeats: 7 },
      MI: { reportingPct: 76, demVotes: 1780000, gopVotes: 1680000, status: 'uncalled', houseDemSeats: 5, houseGopSeats: 5 },
      WI: { reportingPct: 80, demVotes: 1140000, gopVotes: 1090000, status: 'uncalled', houseDemSeats: 3, houseGopSeats: 4 },
      TX: { reportingPct: 86, demVotes: 4120000, gopVotes: 4320000, status: 'called_gop', houseDemSeats: 12, houseGopSeats: 21 },
      GA: { reportingPct: 92, demVotes: 1890000, gopVotes: 1835000, status: 'called_dem', houseDemSeats: 5, houseGopSeats: 9 }
    }
  },
  {
    hourLabel: '23:00 EST',
    timeString: 'Poll Closures: CA, WA, OR, HI',
    description: 'West Coast poll closures add large delegate blocks. California House battles determine chamber control.',
    nationalReportingPct: 85,
    stateProgress: {
      CA: { reportingPct: 45, demVotes: 3200000, gopVotes: 2200000, status: 'called_dem', houseDemSeats: 26, houseGopSeats: 6 },
      WA: { reportingPct: 52, demVotes: 980000, gopVotes: 680000, status: 'called_dem', houseDemSeats: 6, houseGopSeats: 2 },
      OR: { reportingPct: 50, demVotes: 540000, gopVotes: 450000, status: 'called_dem', houseDemSeats: 3, houseGopSeats: 1 },
      MI: { reportingPct: 91, demVotes: 2140000, gopVotes: 2010000, status: 'called_dem', houseDemSeats: 6, houseGopSeats: 6 },
      WI: { reportingPct: 93, demVotes: 1320000, gopVotes: 1245000, status: 'called_dem', houseDemSeats: 3, houseGopSeats: 5 },
      NC: { reportingPct: 94, demVotes: 2360000, gopVotes: 2310000, status: 'called_dem', houseDemSeats: 4, houseGopSeats: 10 },
      NV: { reportingPct: 75, demVotes: 395000, gopVotes: 402000, status: 'too_close_to_call', houseDemSeats: 2, houseGopSeats: 1 },
      AZ: { reportingPct: 82, demVotes: 1080000, gopVotes: 1050000, status: 'too_close_to_call', houseDemSeats: 3, houseGopSeats: 4 }
    }
  },
  {
    hourLabel: '02:00 EST (Final Projection)',
    timeString: 'All Polls Closed - Late Absentee & Mail Drops In',
    description: 'Final 2026 Midterm tallies. Senate and House majorities resolved, full swing analysis available.',
    nationalReportingPct: 98,
    stateProgress: {} // In final projection, uses full BASE_STATES data
  }
];
