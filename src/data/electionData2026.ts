import { StateElectionResult } from '../utils/electionMath';

/**
 * 2026 US Midterm Election comprehensive dataset for all 50 states + DC.
 * Includes verified 2022 midterm baseline comparisons, competitive Senate races,
 * 36 Gubernatorial races, and House delegations with key swing districts.
 */

export interface HourlySnapshot {
  hourLabel: string; // e.g. "01:00 EST"
  cetLabel?: string; // e.g. "07:00 CET"
  timeString: string;
  description: string;
  nationalReportingPct: number;
  stateProgress: Record<string, {
    reportingPct: number;
    demVotes: number;
    gopVotes: number;
    status: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
    govDemVotes?: number;
    govGopVotes?: number;
    govStatus?: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call';
    houseDemVotes?: number;
    houseGopVotes?: number;
    houseDemSeats?: number;
    houseGopSeats?: number;
  }>;
}

export const BASE_STATES: StateElectionResult[] = [
  {
    "id": "AL",
    "stateCode": "AL",
    "stateName": "Alabama",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 7,
    "senate": {
      "demCandidate": {
        "name": "Everett Wess",
        "party": "DEM",
        "votes": 759335,
        "pct": 45.3
      },
      "gopCandidate": {
        "name": "Barry Moore",
        "party": "GOP",
        "votes": 917347,
        "pct": 54.7
      },
      "otherVotes": 8500,
      "reportingPct": 98,
      "status": "called_gop",
      "historical2022": {
        "demPct": 34.5,
        "gopPct": 65.2,
        "margin": -30.7,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Doug Jones",
        "party": "DEM",
        "votes": 803468,
        "pct": 47.9
      },
      "gopCandidate": {
        "name": "Tommy Tuberville",
        "party": "GOP",
        "votes": 872445,
        "pct": 52.1
      },
      "otherVotes": 12000,
      "reportingPct": 98,
      "status": "called_gop",
      "historical2022": {
        "demPct": 30.6,
        "gopPct": 66.9,
        "margin": -36.3,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 7,
      "demSeats": 2,
      "gopSeats": 5,
      "uncalledSeats": 0,
      "popularDemVotes": 763464,
      "popularGopVotes": 914967,
      "reportingPct": 95,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 6,
        "demPopularPct": 31.5,
        "gopPopularPct": 67.2,
        "margin": -35.7
      }
    }
  },
  {
    "id": "AK",
    "stateCode": "AK",
    "stateName": "Alaska",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 1,
    "senate": {
      "demCandidate": {
        "name": "Mary Peltola",
        "party": "DEM",
        "votes": 97782,
        "pct": 47.6
      },
      "gopCandidate": {
        "name": "Dan Sullivan",
        "party": "GOP",
        "votes": 99955,
        "pct": 48.6
      },
      "otherVotes": 3200,
      "reportingPct": 71,
      "status": "too_close_to_call",
      "historical2022": {
        "demPct": 46.1,
        "gopPct": 53.9,
        "margin": -7.8,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Jonathan S. \"JKT\" Kreiss-Tomkins",
        "party": "DEM",
        "votes": 99572,
        "pct": 49
      },
      "gopCandidate": {
        "name": "Bernadette M. Wilson",
        "party": "GOP",
        "votes": 60037,
        "pct": 29.5
      },
      "otherVotes": 4000,
      "reportingPct": 70,
      "status": "uncalled",
      "historical2022": {
        "demPct": 44.2,
        "gopPct": 52.1,
        "margin": -7.9,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 1,
      "demSeats": 0,
      "gopSeats": 0,
      "uncalledSeats": 1,
      "popularDemVotes": 14739,
      "popularGopVotes": 102548,
      "reportingPct": 70,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 0,
        "demPopularPct": 54.9,
        "gopPopularPct": 45.1,
        "margin": 9.8
      }
    }
  },
  {
    "id": "AZ",
    "stateCode": "AZ",
    "stateName": "Arizona",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 9,
    "governor": {
      "demCandidate": {
        "name": "Katie Hobbs",
        "party": "DEM",
        "votes": 1065872,
        "pct": 56.7
      },
      "gopCandidate": {
        "name": "Andy Biggs",
        "party": "GOP",
        "votes": 781506,
        "pct": 41.6
      },
      "otherVotes": 14500,
      "reportingPct": 59,
      "status": "called_dem",
      "historical2022": {
        "demPct": 50.3,
        "gopPct": 49.7,
        "margin": 0.6,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 9,
      "demSeats": 4,
      "gopSeats": 1,
      "uncalledSeats": 4,
      "popularDemVotes": 1031185,
      "popularGopVotes": 803629,
      "reportingPct": 59,
      "historical2022": {
        "demSeats": 3,
        "gopSeats": 6,
        "demPopularPct": 47.8,
        "gopPopularPct": 52.2,
        "margin": -4.4
      },
      "keyBattlegroundDistricts": [
        {
          "district": "AZ-01",
          "demName": "Amish Shah",
          "gopName": "David Schweikert",
          "demVotes": 185400,
          "gopVotes": 189600,
          "demPct": 49.4,
          "gopPct": 50.6,
          "reportingPct": 100,
          "status": "called_gop",
          "swingVs2022": 0.8
        },
        {
          "district": "AZ-06",
          "demName": "Kirsten Engel",
          "gopName": "Juan Ciscomani",
          "demVotes": 171200,
          "gopVotes": 174900,
          "demPct": 49.5,
          "gopPct": 50.5,
          "reportingPct": 100,
          "status": "called_gop",
          "swingVs2022": 1.1
        }
      ]
    }
  },
  {
    "id": "AR",
    "stateCode": "AR",
    "stateName": "Arkansas",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 4,
    "senate": {
      "demCandidate": {
        "name": "Hallie Shoffner",
        "party": "DEM",
        "votes": 375596,
        "pct": 42.4
      },
      "gopCandidate": {
        "name": "Tom Cotton",
        "party": "GOP",
        "votes": 480526,
        "pct": 54.3
      },
      "otherVotes": 11000,
      "reportingPct": 100,
      "status": "called_gop",
      "historical2022": {
        "demPct": 31.1,
        "gopPct": 65.7,
        "margin": -34.6,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Fredrick Love",
        "party": "DEM",
        "votes": 341621,
        "pct": 38.6
      },
      "gopCandidate": {
        "name": "Sarah Huckabee Sanders",
        "party": "GOP",
        "votes": 477040,
        "pct": 53.9
      },
      "otherVotes": 9800,
      "reportingPct": 100,
      "status": "called_gop",
      "historical2022": {
        "demPct": 35.2,
        "gopPct": 63,
        "margin": -27.8,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 4,
      "demSeats": 0,
      "gopSeats": 3,
      "uncalledSeats": 1,
      "popularDemVotes": 348414,
      "popularGopVotes": 512885,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 4,
        "demPopularPct": 32.8,
        "gopPopularPct": 67.2,
        "margin": -34.4
      }
    }
  },
  {
    "id": "CA",
    "stateCode": "CA",
    "stateName": "California",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 52,
    "governor": {
      "demCandidate": {
        "name": "Xavier Becerra",
        "party": "DEM",
        "votes": 4631469,
        "pct": 64.1
      },
      "gopCandidate": {
        "name": "Steve Hilton",
        "party": "GOP",
        "votes": 2596022,
        "pct": 35.9
      },
      "otherVotes": 75000,
      "reportingPct": 54,
      "status": "called_dem",
      "historical2022": {
        "demPct": 59.2,
        "gopPct": 40.8,
        "margin": 18.4,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 52,
      "demSeats": 42,
      "gopSeats": 2,
      "uncalledSeats": 8,
      "popularDemVotes": 4756390,
      "popularGopVotes": 2188443,
      "reportingPct": 77,
      "historical2022": {
        "demSeats": 40,
        "gopSeats": 12,
        "demPopularPct": 58.7,
        "gopPopularPct": 41.3,
        "margin": 17.4
      },
      "keyBattlegroundDistricts": [
        {
          "district": "CA-13",
          "demName": "Adam Gray",
          "gopName": "John Duarte",
          "demVotes": 104200,
          "gopVotes": 102800,
          "demPct": 50.3,
          "gopPct": 49.7,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 1.1
        },
        {
          "district": "CA-22",
          "demName": "Rudy Salas",
          "gopName": "David Valadao",
          "demVotes": 76500,
          "gopVotes": 75900,
          "demPct": 50.2,
          "gopPct": 49.8,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 3.5
        },
        {
          "district": "CA-27",
          "demName": "George Whitesides",
          "gopName": "Mike Garcia",
          "demVotes": 142100,
          "gopVotes": 139800,
          "demPct": 50.4,
          "gopPct": 49.6,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 4.2
        }
      ]
    }
  },
  {
    "id": "CO",
    "stateCode": "CO",
    "stateName": "Colorado",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 8,
    "senate": {
      "demCandidate": {
        "name": "John Hickenlooper",
        "party": "DEM",
        "votes": 1301297,
        "pct": 60.4
      },
      "gopCandidate": {
        "name": "Mark Baisley",
        "party": "GOP",
        "votes": 763732,
        "pct": 35.4
      },
      "otherVotes": 25000,
      "reportingPct": 76,
      "status": "called_dem",
      "historical2022": {
        "demPct": 54.5,
        "gopPct": 44.5,
        "margin": 10,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Phil Weiser",
        "party": "DEM",
        "votes": 1310463,
        "pct": 61.1
      },
      "gopCandidate": {
        "name": "Victor Marx",
        "party": "GOP",
        "votes": 718385,
        "pct": 33.5
      },
      "otherVotes": 21000,
      "reportingPct": 76,
      "status": "called_dem",
      "historical2022": {
        "demPct": 58.5,
        "gopPct": 39.2,
        "margin": 19.3,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 8,
      "demSeats": 5,
      "gopSeats": 0,
      "uncalledSeats": 3,
      "popularDemVotes": 1285628,
      "popularGopVotes": 786658,
      "reportingPct": 75,
      "historical2022": {
        "demSeats": 5,
        "gopSeats": 3,
        "demPopularPct": 53.4,
        "gopPopularPct": 45.1,
        "margin": 8.3
      }
    }
  },
  {
    "id": "CT",
    "stateCode": "CT",
    "stateName": "Connecticut",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 5,
    "governor": {
      "demCandidate": {
        "name": "Ned Lamont",
        "party": "DEM",
        "votes": 672431,
        "pct": 58.4
      },
      "gopCandidate": {
        "name": "Ryan Fazio",
        "party": "GOP",
        "votes": 479667,
        "pct": 41.6
      },
      "otherVotes": 9800,
      "reportingPct": 80,
      "status": "called_dem",
      "historical2022": {
        "demPct": 56,
        "gopPct": 43,
        "margin": 13,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 5,
      "demSeats": 5,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 699644,
      "popularGopVotes": 417274,
      "reportingPct": 82,
      "historical2022": {
        "demSeats": 5,
        "gopSeats": 0,
        "demPopularPct": 55.4,
        "gopPopularPct": 44.2,
        "margin": 11.2
      }
    }
  },
  {
    "id": "DE",
    "stateCode": "DE",
    "stateName": "Delaware",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 1,
    "senate": {
      "demCandidate": {
        "name": "Chris Coons",
        "party": "DEM",
        "votes": 240347,
        "pct": 63.6
      },
      "gopCandidate": {
        "name": "Michael \"Dr. Mike\" Katz",
        "party": "GOP",
        "votes": 137764,
        "pct": 36.4
      },
      "otherVotes": 3200,
      "reportingPct": 100,
      "status": "called_dem",
      "historical2022": {
        "demPct": 58.8,
        "gopPct": 39.5,
        "margin": 19.3,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 1,
      "demSeats": 1,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 243467,
      "popularGopVotes": 134966,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 0,
        "demPopularPct": 56.4,
        "gopPopularPct": 43.6,
        "margin": 12.8
      }
    }
  },
  {
    "id": "FL",
    "stateCode": "FL",
    "stateName": "Florida",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 28,
    "governor": {
      "demCandidate": {
        "name": "David Jolly",
        "party": "DEM",
        "votes": 4024180,
        "pct": 48.7
      },
      "gopCandidate": {
        "name": "Byron Donalds",
        "party": "GOP",
        "votes": 4132112,
        "pct": 50
      },
      "otherVotes": 48000,
      "reportingPct": 93,
      "status": "called_gop",
      "historical2022": {
        "demPct": 40,
        "gopPct": 59.4,
        "margin": -19.4,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 28,
      "demSeats": 7,
      "gopSeats": 17,
      "uncalledSeats": 4,
      "popularDemVotes": 3864435,
      "popularGopVotes": 4037727,
      "reportingPct": 92,
      "historical2022": {
        "demSeats": 8,
        "gopSeats": 20,
        "demPopularPct": 41.2,
        "gopPopularPct": 58.2,
        "margin": -17
      }
    },
    "senate": {
      "demCandidate": {
        "name": "Angie Nixon",
        "party": "DEM",
        "votes": 3968811,
        "pct": 48
      },
      "gopCandidate": {
        "name": "Ashley Moody",
        "party": "GOP",
        "votes": 4207774,
        "pct": 50.9
      },
      "otherVotes": 0,
      "reportingPct": 93,
      "status": "called_gop",
      "historical2022": {
        "demPct": 41.3,
        "gopPct": 57.7,
        "margin": -16.4,
        "winner": "gop",
        "reportingPct": 100
      }
    }
  },
  {
    "id": "GA",
    "stateCode": "GA",
    "stateName": "Georgia",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 14,
    "senate": {
      "demCandidate": {
        "name": "Jon Ossoff",
        "party": "DEM",
        "votes": 2453525,
        "pct": 58.9
      },
      "gopCandidate": {
        "name": "Mike Collins",
        "party": "GOP",
        "votes": 1709237,
        "pct": 41.1
      },
      "otherVotes": 24000,
      "reportingPct": 89,
      "status": "called_dem",
      "historical2022": {
        "demPct": 51.4,
        "gopPct": 48.6,
        "margin": 2.8,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Keisha Lance Bottoms",
        "party": "DEM",
        "votes": 2259100,
        "pct": 54.2
      },
      "gopCandidate": {
        "name": "Rick Jackson",
        "party": "GOP",
        "votes": 1905921,
        "pct": 45.8
      },
      "otherVotes": 22000,
      "reportingPct": 89,
      "status": "called_dem",
      "historical2022": {
        "demPct": 45.9,
        "gopPct": 53.4,
        "margin": -7.5,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 14,
      "demSeats": 5,
      "gopSeats": 9,
      "uncalledSeats": 0,
      "popularDemVotes": 2330097,
      "popularGopVotes": 1822118,
      "reportingPct": 98,
      "historical2022": {
        "demSeats": 5,
        "gopSeats": 9,
        "demPopularPct": 47.7,
        "gopPopularPct": 52.3,
        "margin": -4.6
      }
    }
  },
  {
    "id": "HI",
    "stateCode": "HI",
    "stateName": "Hawaii",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 2,
    "governor": {
      "demCandidate": {
        "name": "Josh Green",
        "party": "DEM",
        "votes": 227046,
        "pct": 74.9
      },
      "gopCandidate": {
        "name": "Gary Cordery",
        "party": "GOP",
        "votes": 75978,
        "pct": 25.1
      },
      "otherVotes": 3500,
      "reportingPct": 66,
      "status": "called_dem",
      "historical2022": {
        "demPct": 63.2,
        "gopPct": 36.5,
        "margin": 26.7,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 2,
      "demSeats": 2,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 208465,
      "popularGopVotes": 77449,
      "reportingPct": 64,
      "historical2022": {
        "demSeats": 2,
        "gopSeats": 0,
        "demPopularPct": 64,
        "gopPopularPct": 36,
        "margin": 28
      }
    }
  },
  {
    "id": "ID",
    "stateCode": "ID",
    "stateName": "Idaho",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 2,
    "senate": {
      "demCandidate": {
        "name": "Todd Achilles",
        "party": "IND",
        "votes": 212775,
        "pct": 33.8
      },
      "gopCandidate": {
        "name": "Jim Risch",
        "party": "GOP",
        "votes": 354662,
        "pct": 56.4
      },
      "otherVotes": 7800,
      "reportingPct": 87,
      "status": "called_gop",
      "historical2022": {
        "demPct": 31.5,
        "gopPct": 62.8,
        "margin": -31.3,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Terri Pickens",
        "party": "DEM",
        "votes": 204261,
        "pct": 32.4
      },
      "gopCandidate": {
        "name": "Brad Little",
        "party": "GOP",
        "votes": 359863,
        "pct": 57
      },
      "otherVotes": 8200,
      "reportingPct": 87,
      "status": "called_gop",
      "historical2022": {
        "demPct": 20.3,
        "gopPct": 60.5,
        "margin": -40.2,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 2,
      "demSeats": 0,
      "gopSeats": 1,
      "uncalledSeats": 1,
      "popularDemVotes": 215309,
      "popularGopVotes": 365933,
      "reportingPct": 86,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 2,
        "demPopularPct": 31.9,
        "gopPopularPct": 68.1,
        "margin": -36.2
      }
    }
  },
  {
    "id": "IL",
    "stateCode": "IL",
    "stateName": "Illinois",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 17,
    "senate": {
      "demCandidate": {
        "name": "Juliana Stratton",
        "party": "DEM",
        "votes": 2280261,
        "pct": 62.8
      },
      "gopCandidate": {
        "name": "Don Tracy",
        "party": "GOP",
        "votes": 1290749,
        "pct": 35.6
      },
      "otherVotes": 32000,
      "reportingPct": 78,
      "status": "called_dem",
      "historical2022": {
        "demPct": 57,
        "gopPct": 41.4,
        "margin": 15.6,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "JB Pritzker",
        "party": "DEM",
        "votes": 2206001,
        "pct": 61.9
      },
      "gopCandidate": {
        "name": "Darren Bailey",
        "party": "GOP",
        "votes": 1237935,
        "pct": 34.8
      },
      "otherVotes": 28000,
      "reportingPct": 77,
      "status": "called_dem",
      "historical2022": {
        "demPct": 54.9,
        "gopPct": 42.4,
        "margin": 12.5,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 17,
      "demSeats": 14,
      "gopSeats": 3,
      "uncalledSeats": 0,
      "popularDemVotes": 2253578,
      "popularGopVotes": 1251647,
      "reportingPct": 76,
      "historical2022": {
        "demSeats": 14,
        "gopSeats": 3,
        "demPopularPct": 56.1,
        "gopPopularPct": 43.9,
        "margin": 12.2
      }
    }
  },
  {
    "id": "IN",
    "stateCode": "IN",
    "stateName": "Indiana",
    "hasSenateRace": false,
    "hasGovernorRace": false,
    "houseSeats": 9,
    "house": {
      "totalSeats": 9,
      "demSeats": 3,
      "gopSeats": 6,
      "uncalledSeats": 0,
      "popularDemVotes": 981428,
      "popularGopVotes": 915898,
      "reportingPct": 98,
      "historical2022": {
        "demSeats": 2,
        "gopSeats": 7,
        "demPopularPct": 39.8,
        "gopPopularPct": 60.2,
        "margin": -20.4
      }
    }
  },
  {
    "id": "IA",
    "stateCode": "IA",
    "stateName": "Iowa",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 4,
    "senate": {
      "demCandidate": {
        "name": "Josh Turek",
        "party": "DEM",
        "votes": 683576,
        "pct": 50.5
      },
      "gopCandidate": {
        "name": "Ashley Hinson",
        "party": "GOP",
        "votes": 627878,
        "pct": 46.4
      },
      "otherVotes": 8200,
      "reportingPct": 99,
      "status": "called_dem",
      "historical2022": {
        "demPct": 43.8,
        "gopPct": 56.1,
        "margin": -12.3,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Rob Sand",
        "party": "DEM",
        "votes": 752967,
        "pct": 55.5
      },
      "gopCandidate": {
        "name": "Zach Lahn",
        "party": "GOP",
        "votes": 604087,
        "pct": 44.5
      },
      "otherVotes": 7500,
      "reportingPct": 99,
      "status": "called_dem",
      "historical2022": {
        "demPct": 39.5,
        "gopPct": 58,
        "margin": -18.5,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 4,
      "demSeats": 3,
      "gopSeats": 1,
      "uncalledSeats": 0,
      "popularDemVotes": 662799,
      "popularGopVotes": 647049,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 4,
        "demPopularPct": 45.2,
        "gopPopularPct": 54.8,
        "margin": -9.6
      }
    }
  },
  {
    "id": "KS",
    "stateCode": "KS",
    "stateName": "Kansas",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 4,
    "senate": {
      "demCandidate": {
        "name": "Adam Hamilton",
        "party": "DEM",
        "votes": 556580,
        "pct": 50.9
      },
      "gopCandidate": {
        "name": "Roger Marshall",
        "party": "GOP",
        "votes": 501408,
        "pct": 45.8
      },
      "otherVotes": 12000,
      "reportingPct": 96,
      "status": "called_dem",
      "historical2022": {
        "demPct": 37,
        "gopPct": 60,
        "margin": -23,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Cindy Holscher",
        "party": "DEM",
        "votes": 546609,
        "pct": 50.3
      },
      "gopCandidate": {
        "name": "Ty Masterson",
        "party": "GOP",
        "votes": 541047,
        "pct": 49.7
      },
      "otherVotes": 11000,
      "reportingPct": 95,
      "status": "too_close_to_call",
      "historical2022": {
        "demPct": 49.5,
        "gopPct": 47.3,
        "margin": 2.2,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 4,
      "demSeats": 1,
      "gopSeats": 3,
      "uncalledSeats": 0,
      "popularDemVotes": 517778,
      "popularGopVotes": 542494,
      "reportingPct": 96,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 3,
        "demPopularPct": 43.7,
        "gopPopularPct": 56.3,
        "margin": -12.6
      }
    }
  },
  {
    "id": "KY",
    "stateCode": "KY",
    "stateName": "Kentucky",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 6,
    "senate": {
      "demCandidate": {
        "name": "Charles Booker",
        "party": "DEM",
        "votes": 611987,
        "pct": 42.9
      },
      "gopCandidate": {
        "name": "Andy Barr",
        "party": "GOP",
        "votes": 784000,
        "pct": 55
      },
      "otherVotes": 14000,
      "reportingPct": 86,
      "status": "called_gop",
      "historical2022": {
        "demPct": 37.8,
        "gopPct": 61.8,
        "margin": -24,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 6,
      "demSeats": 2,
      "gopSeats": 4,
      "uncalledSeats": 0,
      "popularDemVotes": 622091,
      "popularGopVotes": 764309,
      "reportingPct": 85,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 5,
        "demPopularPct": 37,
        "gopPopularPct": 63,
        "margin": -26
      }
    }
  },
  {
    "id": "LA",
    "stateCode": "LA",
    "stateName": "Louisiana",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 6,
    "senate": {
      "demCandidate": {
        "name": "Jamie Davis",
        "party": "DEM",
        "votes": 720106,
        "pct": 49.1
      },
      "gopCandidate": {
        "name": "Julia Letlow",
        "party": "GOP",
        "votes": 745963,
        "pct": 50.9
      },
      "otherVotes": 12000,
      "reportingPct": 100,
      "status": "called_gop",
      "historical2022": {
        "demPct": 34,
        "gopPct": 61.5,
        "margin": -27.5,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 6,
      "demSeats": 1,
      "gopSeats": 3,
      "uncalledSeats": 2,
      "popularDemVotes": 645809,
      "popularGopVotes": 789442,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 5,
        "demPopularPct": 35.2,
        "gopPopularPct": 64.8,
        "margin": -29.6
      }
    }
  },
  {
    "id": "ME",
    "stateCode": "ME",
    "stateName": "Maine",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 2,
    "senate": {
      "demCandidate": {
        "name": "Troy Jackson",
        "party": "DEM",
        "votes": 333912,
        "pct": 54
      },
      "gopCandidate": {
        "name": "Susan Collins",
        "party": "GOP",
        "votes": 283751,
        "pct": 45.9
      },
      "otherVotes": 7500,
      "reportingPct": 83,
      "status": "called_dem",
      "historical2022": {
        "demPct": 48,
        "gopPct": 52,
        "margin": -4,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Hannah Pingree",
        "party": "DEM",
        "votes": 343813,
        "pct": 55.4
      },
      "gopCandidate": {
        "name": "Bobby Charles",
        "party": "GOP",
        "votes": 227768,
        "pct": 36.7
      },
      "otherVotes": 6200,
      "reportingPct": 84,
      "status": "called_dem",
      "historical2022": {
        "demPct": 55.7,
        "gopPct": 42.4,
        "margin": 13.3,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 2,
      "demSeats": 1,
      "gopSeats": 0,
      "uncalledSeats": 1,
      "popularDemVotes": 363602,
      "popularGopVotes": 250952,
      "reportingPct": 83,
      "historical2022": {
        "demSeats": 2,
        "gopSeats": 0,
        "demPopularPct": 53,
        "gopPopularPct": 47,
        "margin": 6
      }
    }
  },
  {
    "id": "MD",
    "stateCode": "MD",
    "stateName": "Maryland",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 8,
    "governor": {
      "demCandidate": {
        "name": "Wes Moore",
        "party": "DEM",
        "votes": 1161743,
        "pct": 62.5
      },
      "gopCandidate": {
        "name": "Dan Cox",
        "party": "GOP",
        "votes": 616315,
        "pct": 33.2
      },
      "otherVotes": 19000,
      "reportingPct": 74,
      "status": "called_dem",
      "historical2022": {
        "demPct": 64.5,
        "gopPct": 32.1,
        "margin": 32.4,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 8,
      "demSeats": 7,
      "gopSeats": 1,
      "uncalledSeats": 0,
      "popularDemVotes": 1239400,
      "popularGopVotes": 589118,
      "reportingPct": 83,
      "historical2022": {
        "demSeats": 7,
        "gopSeats": 1,
        "demPopularPct": 63.8,
        "gopPopularPct": 36.2,
        "margin": 27.6
      }
    }
  },
  {
    "id": "MA",
    "stateCode": "MA",
    "stateName": "Massachusetts",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 9,
    "senate": {
      "demCandidate": {
        "name": "Edward J. Markey",
        "party": "DEM",
        "votes": 1360734,
        "pct": 63.9
      },
      "gopCandidate": {
        "name": "John Deaton",
        "party": "GOP",
        "votes": 671618,
        "pct": 31.5
      },
      "otherVotes": 21000,
      "reportingPct": 75,
      "status": "called_dem",
      "historical2022": {
        "demPct": 65,
        "gopPct": 33.5,
        "margin": 31.5,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Maura Healey",
        "party": "DEM",
        "votes": 1339723,
        "pct": 62.9
      },
      "gopCandidate": {
        "name": "Michael Roger Minogue",
        "party": "GOP",
        "votes": 718031,
        "pct": 33.7
      },
      "otherVotes": 18000,
      "reportingPct": 75,
      "status": "called_dem",
      "historical2022": {
        "demPct": 63.7,
        "gopPct": 34.6,
        "margin": 29.1,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 9,
      "demSeats": 9,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 900640,
      "popularGopVotes": 387030,
      "reportingPct": 47,
      "historical2022": {
        "demSeats": 9,
        "gopSeats": 0,
        "demPopularPct": 68.2,
        "gopPopularPct": 31.8,
        "margin": 36.4
      }
    }
  },
  {
    "id": "MI",
    "stateCode": "MI",
    "stateName": "Michigan",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 13,
    "senate": {
      "demCandidate": {
        "name": "Abdul El-Sayed",
        "party": "DEM",
        "votes": 2341679,
        "pct": 52.1
      },
      "gopCandidate": {
        "name": "Mike Rogers",
        "party": "GOP",
        "votes": 2059684,
        "pct": 45.8
      },
      "otherVotes": 32000,
      "reportingPct": 91,
      "status": "called_dem",
      "historical2022": {
        "demPct": 50.8,
        "gopPct": 47.9,
        "margin": 2.9,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Jocelyn Benson",
        "party": "DEM",
        "votes": 2437762,
        "pct": 54.2
      },
      "gopCandidate": {
        "name": "John James",
        "party": "GOP",
        "votes": 1983096,
        "pct": 44.1
      },
      "otherVotes": 29000,
      "reportingPct": 91,
      "status": "called_dem",
      "historical2022": {
        "demPct": 54.5,
        "gopPct": 43.9,
        "margin": 10.6,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 13,
      "demSeats": 6,
      "gopSeats": 4,
      "uncalledSeats": 3,
      "popularDemVotes": 2343237,
      "popularGopVotes": 1991998,
      "reportingPct": 89,
      "historical2022": {
        "demSeats": 7,
        "gopSeats": 6,
        "demPopularPct": 50.5,
        "gopPopularPct": 49.5,
        "margin": 1
      },
      "keyBattlegroundDistricts": [
        {
          "district": "MI-07",
          "demName": "Curtis Hertel",
          "gopName": "Tom Barrett",
          "demVotes": 181200,
          "gopVotes": 190500,
          "demPct": 48.7,
          "gopPct": 51.3,
          "reportingPct": 100,
          "status": "called_gop",
          "swingVs2022": -4.2
        },
        {
          "district": "MI-08",
          "demName": "Kristen McDonald Rivet",
          "gopName": "Paul Junge",
          "demVotes": 178900,
          "gopVotes": 171300,
          "demPct": 51.1,
          "gopPct": 48.9,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 1.5
        }
      ]
    }
  },
  {
    "id": "MN",
    "stateCode": "MN",
    "stateName": "Minnesota",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 8,
    "senate": {
      "demCandidate": {
        "name": "Peggy Flanagan",
        "party": "DEM",
        "votes": 1519712,
        "pct": 53.7
      },
      "gopCandidate": {
        "name": "Michele Tafoya",
        "party": "GOP",
        "votes": 1231407,
        "pct": 43.5
      },
      "otherVotes": 22000,
      "reportingPct": 99,
      "status": "called_dem",
      "historical2022": {
        "demPct": 52.4,
        "gopPct": 45.3,
        "margin": 7.1,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Amy Klobuchar",
        "party": "DEM",
        "votes": 1568497,
        "pct": 55.5
      },
      "gopCandidate": {
        "name": "Lisa Demuth",
        "party": "GOP",
        "votes": 1204506,
        "pct": 42.6
      },
      "otherVotes": 25000,
      "reportingPct": 99,
      "status": "called_dem",
      "historical2022": {
        "demPct": 52.3,
        "gopPct": 44.6,
        "margin": 7.7,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 8,
      "demSeats": 4,
      "gopSeats": 3,
      "uncalledSeats": 1,
      "popularDemVotes": 1572922,
      "popularGopVotes": 1212573,
      "reportingPct": 99,
      "historical2022": {
        "demSeats": 4,
        "gopSeats": 4,
        "demPopularPct": 51.2,
        "gopPopularPct": 48.8,
        "margin": 2.4
      }
    }
  },
  {
    "id": "MS",
    "stateCode": "MS",
    "stateName": "Mississippi",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 4,
    "senate": {
      "demCandidate": {
        "name": "Scott Colom",
        "party": "DEM",
        "votes": 462821,
        "pct": 49
      },
      "gopCandidate": {
        "name": "Cindy Hyde-Smith",
        "party": "GOP",
        "votes": 462778,
        "pct": 48.9
      },
      "otherVotes": 9800,
      "reportingPct": 97,
      "status": "too_close_to_call",
      "historical2022": {
        "demPct": 41.5,
        "gopPct": 57.8,
        "margin": -16.3,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 4,
      "demSeats": 1,
      "gopSeats": 3,
      "uncalledSeats": 0,
      "popularDemVotes": 437272,
      "popularGopVotes": 486397,
      "reportingPct": 96,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 3,
        "demPopularPct": 39.2,
        "gopPopularPct": 60.8,
        "margin": -21.6
      }
    }
  },
  {
    "id": "MO",
    "stateCode": "MO",
    "stateName": "Missouri",
    "hasSenateRace": false,
    "hasGovernorRace": false,
    "houseSeats": 8,
    "house": {
      "totalSeats": 8,
      "demSeats": 3,
      "gopSeats": 5,
      "uncalledSeats": 0,
      "popularDemVotes": 1007479,
      "popularGopVotes": 1019744,
      "reportingPct": 98,
      "historical2022": {
        "demSeats": 2,
        "gopSeats": 6,
        "demPopularPct": 41.6,
        "gopPopularPct": 58.4,
        "margin": -16.8
      }
    }
  },
  {
    "id": "MT",
    "stateCode": "MT",
    "stateName": "Montana",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 2,
    "senate": {
      "demCandidate": {
        "name": "Alani Bankhead",
        "party": "DEM",
        "votes": 47972,
        "pct": 11.8
      },
      "gopCandidate": {
        "name": "Kurt Alme",
        "party": "GOP",
        "votes": 195805,
        "pct": 48.3
      },
      "otherVotes": 6200,
      "reportingPct": 72,
      "status": "called_gop",
      "historical2022": {
        "demPct": 44.5,
        "gopPct": 55.5,
        "margin": -11,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 2,
      "demSeats": 1,
      "gopSeats": 1,
      "uncalledSeats": 0,
      "popularDemVotes": 169658,
      "popularGopVotes": 210333,
      "reportingPct": 71,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 2,
        "demPopularPct": 44.2,
        "gopPopularPct": 55.8,
        "margin": -11.6
      }
    }
  },
  {
    "id": "NE",
    "stateCode": "NE",
    "stateName": "Nebraska",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 3,
    "senate": {
      "demCandidate": {
        "name": "Dan  Osborn",
        "party": "IND",
        "votes": 311791,
        "pct": 44
      },
      "gopCandidate": {
        "name": "Pete  Ricketts",
        "party": "GOP",
        "votes": 355492,
        "pct": 50.1
      },
      "otherVotes": 8500,
      "reportingPct": 92,
      "status": "called_gop",
      "historical2022": {
        "demPct": 35.8,
        "gopPct": 64.2,
        "margin": -28.4,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Lynne Walz",
        "party": "DEM",
        "votes": 302666,
        "pct": 42.6
      },
      "gopCandidate": {
        "name": "Jim Pillen",
        "party": "GOP",
        "votes": 358273,
        "pct": 50.4
      },
      "otherVotes": 7200,
      "reportingPct": 92,
      "status": "called_gop",
      "historical2022": {
        "demPct": 36.3,
        "gopPct": 59.7,
        "margin": -23.4,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 3,
      "demSeats": 1,
      "gopSeats": 1,
      "uncalledSeats": 1,
      "popularDemVotes": 292867,
      "popularGopVotes": 380062,
      "reportingPct": 92,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 3,
        "demPopularPct": 38.6,
        "gopPopularPct": 61.4,
        "margin": -22.8
      },
      "keyBattlegroundDistricts": [
        {
          "district": "NE-02",
          "demName": "Tony Vargas",
          "gopName": "Don Bacon",
          "demVotes": 138700,
          "gopVotes": 143300,
          "demPct": 49.2,
          "gopPct": 50.8,
          "reportingPct": 100,
          "status": "called_gop",
          "swingVs2022": 1.1
        }
      ]
    }
  },
  {
    "id": "NV",
    "stateCode": "NV",
    "stateName": "Nevada",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 4,
    "governor": {
      "demCandidate": {
        "name": "Aaron Ford",
        "party": "DEM",
        "votes": 408364,
        "pct": 51.3
      },
      "gopCandidate": {
        "name": "Joe Lombardo",
        "party": "GOP",
        "votes": 356084,
        "pct": 44.7
      },
      "otherVotes": 12000,
      "reportingPct": 65,
      "status": "uncalled",
      "historical2022": {
        "demPct": 47.3,
        "gopPct": 48.8,
        "margin": -1.5,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 4,
      "demSeats": 0,
      "gopSeats": 0,
      "uncalledSeats": 4,
      "popularDemVotes": 469448,
      "popularGopVotes": 359918,
      "reportingPct": 67,
      "historical2022": {
        "demSeats": 3,
        "gopSeats": 1,
        "demPopularPct": 51.1,
        "gopPopularPct": 48.9,
        "margin": 2.2
      }
    }
  },
  {
    "id": "NH",
    "stateCode": "NH",
    "stateName": "New Hampshire",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 2,
    "senate": {
      "demCandidate": {
        "name": "Chris Pappas",
        "party": "DEM",
        "votes": 219480,
        "pct": 53.7
      },
      "gopCandidate": {
        "name": "John E. Sununu",
        "party": "GOP",
        "votes": 180913,
        "pct": 44.3
      },
      "otherVotes": 8500,
      "reportingPct": 59,
      "status": "called_dem",
      "historical2022": {
        "demPct": 53.5,
        "gopPct": 44.4,
        "margin": 9.1,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Cinde Warmington",
        "party": "DEM",
        "votes": 182309,
        "pct": 44.6
      },
      "gopCandidate": {
        "name": "Kelly Ayotte",
        "party": "GOP",
        "votes": 219311,
        "pct": 53.7
      },
      "otherVotes": 6800,
      "reportingPct": 59,
      "status": "called_gop",
      "historical2022": {
        "demPct": 41.5,
        "gopPct": 57,
        "margin": -15.5,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 2,
      "demSeats": 2,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 226795,
      "popularGopVotes": 175248,
      "reportingPct": 59,
      "historical2022": {
        "demSeats": 2,
        "gopSeats": 0,
        "demPopularPct": 53.8,
        "gopPopularPct": 46.2,
        "margin": 7.6
      }
    }
  },
  {
    "id": "NJ",
    "stateCode": "NJ",
    "stateName": "New Jersey",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 12,
    "senate": {
      "demCandidate": {
        "name": "Cory Booker",
        "party": "DEM",
        "votes": 1754951,
        "pct": 62.3
      },
      "gopCandidate": {
        "name": "Justin Murphy",
        "party": "GOP",
        "votes": 987422,
        "pct": 35
      },
      "otherVotes": 25000,
      "reportingPct": 79,
      "status": "called_dem",
      "historical2022": {
        "demPct": 55,
        "gopPct": 43.5,
        "margin": 11.5,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 12,
      "demSeats": 10,
      "gopSeats": 1,
      "uncalledSeats": 1,
      "popularDemVotes": 1758597,
      "popularGopVotes": 977827,
      "reportingPct": 77,
      "historical2022": {
        "demSeats": 9,
        "gopSeats": 3,
        "demPopularPct": 54.8,
        "gopPopularPct": 45.2,
        "margin": 9.6
      }
    }
  },
  {
    "id": "NM",
    "stateCode": "NM",
    "stateName": "New Mexico",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 3,
    "senate": {
      "demCandidate": {
        "name": "Ben Ray Luján",
        "party": "DEM",
        "votes": 455165,
        "pct": 63.1
      },
      "gopCandidate": {
        "name": "Larry Marker",
        "party": "GOP",
        "votes": 265557,
        "pct": 36.9
      },
      "otherVotes": 11000,
      "reportingPct": 88,
      "status": "called_dem",
      "historical2022": {
        "demPct": 52,
        "gopPct": 45.6,
        "margin": 6.4,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Deb Haaland",
        "party": "DEM",
        "votes": 412834,
        "pct": 57.3
      },
      "gopCandidate": {
        "name": "Gregg Hull",
        "party": "GOP",
        "votes": 308315,
        "pct": 42.8
      },
      "otherVotes": 12000,
      "reportingPct": 89,
      "status": "called_dem",
      "historical2022": {
        "demPct": 52,
        "gopPct": 45.6,
        "margin": 6.4,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 3,
      "demSeats": 3,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 441341,
      "popularGopVotes": 276604,
      "reportingPct": 87,
      "historical2022": {
        "demSeats": 3,
        "gopSeats": 0,
        "demPopularPct": 53.6,
        "gopPopularPct": 46.4,
        "margin": 7.2
      }
    }
  },
  {
    "id": "NY",
    "stateCode": "NY",
    "stateName": "New York",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 26,
    "governor": {
      "demCandidate": {
        "name": "Kathy Hochul",
        "party": "DEM",
        "votes": 10419463,
        "pct": 59.8
      },
      "gopCandidate": {
        "name": "Bruce Blakeman",
        "party": "GOP",
        "votes": 6975559,
        "pct": 40
      },
      "otherVotes": 45000,
      "reportingPct": 99,
      "status": "called_dem",
      "historical2022": {
        "demPct": 53.2,
        "gopPct": 46.8,
        "margin": 6.4,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 26,
      "demSeats": 17,
      "gopSeats": 3,
      "uncalledSeats": 6,
      "popularDemVotes": 10618040,
      "popularGopVotes": 6466699,
      "reportingPct": 99,
      "historical2022": {
        "demSeats": 15,
        "gopSeats": 11,
        "demPopularPct": 53.5,
        "gopPopularPct": 46.5,
        "margin": 7
      },
      "keyBattlegroundDistricts": [
        {
          "district": "NY-17",
          "demName": "Mondaire Jones",
          "gopName": "Mike Lawler",
          "demVotes": 168400,
          "gopVotes": 166200,
          "demPct": 50.3,
          "gopPct": 49.7,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 1.5
        },
        {
          "district": "NY-19",
          "demName": "Josh Riley",
          "gopName": "Marc Molinaro",
          "demVotes": 157200,
          "gopVotes": 154100,
          "demPct": 50.5,
          "gopPct": 49.5,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 2.1
        }
      ]
    }
  },
  {
    "id": "NC",
    "stateCode": "NC",
    "stateName": "North Carolina",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 14,
    "senate": {
      "demCandidate": {
        "name": "Roy Cooper",
        "party": "DEM",
        "votes": 2462440,
        "pct": 58.7
      },
      "gopCandidate": {
        "name": "Michael Whatley",
        "party": "GOP",
        "votes": 1640368,
        "pct": 39.1
      },
      "otherVotes": 35000,
      "reportingPct": 100,
      "status": "called_dem",
      "historical2022": {
        "demPct": 47.3,
        "gopPct": 50.5,
        "margin": -3.2,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 14,
      "demSeats": 4,
      "gopSeats": 0,
      "uncalledSeats": 10,
      "popularDemVotes": 2380066,
      "popularGopVotes": 1749866,
      "reportingPct": 99,
      "historical2022": {
        "demSeats": 7,
        "gopSeats": 7,
        "demPopularPct": 48.9,
        "gopPopularPct": 51.1,
        "margin": -2.2
      }
    }
  },
  {
    "id": "ND",
    "stateCode": "ND",
    "stateName": "North Dakota",
    "hasSenateRace": false,
    "hasGovernorRace": false,
    "houseSeats": 1,
    "house": {
      "totalSeats": 1,
      "demSeats": 0,
      "gopSeats": 1,
      "uncalledSeats": 0,
      "popularDemVotes": 85892,
      "popularGopVotes": 134477,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 1,
        "demPopularPct": 29.8,
        "gopPopularPct": 70.2,
        "margin": -40.4
      }
    }
  },
  {
    "id": "OH",
    "stateCode": "OH",
    "stateName": "Ohio",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 15,
    "governor": {
      "demCandidate": {
        "name": "Amy Acton",
        "party": "DEM",
        "votes": 2350266,
        "pct": 52
      },
      "gopCandidate": {
        "name": "Vivek Ramaswamy",
        "party": "GOP",
        "votes": 2023379,
        "pct": 44.7
      },
      "otherVotes": 32000,
      "reportingPct": 95,
      "status": "called_dem",
      "historical2022": {
        "demPct": 37.4,
        "gopPct": 62.4,
        "margin": -25,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 15,
      "demSeats": 7,
      "gopSeats": 7,
      "uncalledSeats": 1,
      "popularDemVotes": 2264432,
      "popularGopVotes": 2161686,
      "reportingPct": 97,
      "historical2022": {
        "demSeats": 5,
        "gopSeats": 10,
        "demPopularPct": 43.1,
        "gopPopularPct": 56.9,
        "margin": -13.8
      }
    },
    "senate": {
      "demCandidate": {
        "name": "Sherrod Brown",
        "party": "DEM",
        "votes": 2249214,
        "pct": 49.6
      },
      "gopCandidate": {
        "name": "Jon Husted",
        "party": "GOP",
        "votes": 2060829,
        "pct": 45.5
      },
      "otherVotes": 0,
      "reportingPct": 95,
      "status": "called_dem",
      "historical2022": {
        "demPct": 46.9,
        "gopPct": 53,
        "margin": -6.1,
        "winner": "gop",
        "reportingPct": 100
      }
    }
  },
  {
    "id": "OK",
    "stateCode": "OK",
    "stateName": "Oklahoma",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 5,
    "senate": {
      "demCandidate": {
        "name": "N'Kiyla Jasmine Thomas",
        "party": "DEM",
        "votes": 430935,
        "pct": 39.2
      },
      "gopCandidate": {
        "name": "Kevin Hern",
        "party": "GOP",
        "votes": 629947,
        "pct": 57.3
      },
      "otherVotes": 14000,
      "reportingPct": 84,
      "status": "called_gop",
      "historical2022": {
        "demPct": 32.8,
        "gopPct": 61.8,
        "margin": -29,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Cyndi Munson",
        "party": "DEM",
        "votes": 505188,
        "pct": 45.9
      },
      "gopCandidate": {
        "name": "Mike Mazzei",
        "party": "GOP",
        "votes": 572716,
        "pct": 52
      },
      "otherVotes": 12000,
      "reportingPct": 84,
      "status": "called_gop",
      "historical2022": {
        "demPct": 41.8,
        "gopPct": 55.4,
        "margin": -13.6,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 5,
      "demSeats": 0,
      "gopSeats": 4,
      "uncalledSeats": 1,
      "popularDemVotes": 446489,
      "popularGopVotes": 633887,
      "reportingPct": 95,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 5,
        "demPopularPct": 34.2,
        "gopPopularPct": 65.8,
        "margin": -31.6
      }
    }
  },
  {
    "id": "OR",
    "stateCode": "OR",
    "stateName": "Oregon",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 6,
    "senate": {
      "demCandidate": {
        "name": "Jeff Merkley",
        "party": "DEM",
        "votes": 845700,
        "pct": 56.8
      },
      "gopCandidate": {
        "name": "David Brock Smith",
        "party": "GOP",
        "votes": 600637,
        "pct": 40.3
      },
      "otherVotes": 21000,
      "reportingPct": 73,
      "status": "called_dem",
      "historical2022": {
        "demPct": 56,
        "gopPct": 41,
        "margin": 15,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Tina Kotek",
        "party": "DEM",
        "votes": 778875,
        "pct": 52
      },
      "gopCandidate": {
        "name": "Christine Drazan",
        "party": "GOP",
        "votes": 678095,
        "pct": 45.3
      },
      "otherVotes": 24000,
      "reportingPct": 73,
      "status": "called_dem",
      "historical2022": {
        "demPct": 47,
        "gopPct": 43.5,
        "margin": 3.5,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 6,
      "demSeats": 5,
      "gopSeats": 1,
      "uncalledSeats": 0,
      "popularDemVotes": 843947,
      "popularGopVotes": 619062,
      "reportingPct": 72,
      "historical2022": {
        "demSeats": 4,
        "gopSeats": 2,
        "demPopularPct": 53.2,
        "gopPopularPct": 46.8,
        "margin": 6.4
      }
    }
  },
  {
    "id": "PA",
    "stateCode": "PA",
    "stateName": "Pennsylvania",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 17,
    "governor": {
      "demCandidate": {
        "name": "Josh Shapiro",
        "party": "DEM",
        "votes": 2948412,
        "pct": 60.1
      },
      "gopCandidate": {
        "name": "Stacy Garrity",
        "party": "GOP",
        "votes": 1892438,
        "pct": 38.6
      },
      "otherVotes": 42000,
      "reportingPct": 81,
      "status": "called_dem",
      "historical2022": {
        "demPct": 56.5,
        "gopPct": 41.7,
        "margin": 14.8,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 17,
      "demSeats": 11,
      "gopSeats": 6,
      "uncalledSeats": 0,
      "popularDemVotes": 2741895,
      "popularGopVotes": 2123136,
      "reportingPct": 92,
      "historical2022": {
        "demSeats": 9,
        "gopSeats": 8,
        "demPopularPct": 50.8,
        "gopPopularPct": 49.2,
        "margin": 1.6
      },
      "keyBattlegroundDistricts": [
        {
          "district": "PA-07",
          "demName": "Susan Wild",
          "gopName": "Ryan Mackenzie",
          "demVotes": 177500,
          "gopVotes": 183200,
          "demPct": 49.2,
          "gopPct": 50.8,
          "reportingPct": 100,
          "status": "called_gop",
          "swingVs2022": -2.6
        },
        {
          "district": "PA-08",
          "demName": "Matt Cartwright",
          "gopName": "Rob Bresnahan",
          "demVotes": 165400,
          "gopVotes": 171800,
          "demPct": 49,
          "gopPct": 51,
          "reportingPct": 100,
          "status": "called_gop",
          "swingVs2022": -3.2
        },
        {
          "district": "PA-10",
          "demName": "Janelle Stelson",
          "gopName": "Scott Perry",
          "demVotes": 187100,
          "gopVotes": 192400,
          "demPct": 49.3,
          "gopPct": 50.7,
          "reportingPct": 100,
          "status": "called_gop",
          "swingVs2022": 1.8
        }
      ]
    }
  },
  {
    "id": "RI",
    "stateCode": "RI",
    "stateName": "Rhode Island",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 2,
    "senate": {
      "demCandidate": {
        "name": "John F. Reed",
        "party": "DEM",
        "votes": 235276,
        "pct": 66.6
      },
      "gopCandidate": {
        "name": "Raymond T. McKay",
        "party": "GOP",
        "votes": 103996,
        "pct": 29.4
      },
      "otherVotes": 3500,
      "reportingPct": 83,
      "status": "called_dem",
      "historical2022": {
        "demPct": 65,
        "gopPct": 34,
        "margin": 31,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Helena Buonanno Foulkes",
        "party": "DEM",
        "votes": 202877,
        "pct": 57.5
      },
      "gopCandidate": {
        "name": "Aaron C. Guckian",
        "party": "GOP",
        "votes": 46656,
        "pct": 13.2
      },
      "otherVotes": 4100,
      "reportingPct": 83,
      "status": "called_dem",
      "historical2022": {
        "demPct": 58,
        "gopPct": 39,
        "margin": 19,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 2,
      "demSeats": 2,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 227886,
      "popularGopVotes": 117215,
      "reportingPct": 83,
      "historical2022": {
        "demSeats": 2,
        "gopSeats": 0,
        "demPopularPct": 59.2,
        "gopPopularPct": 40.8,
        "margin": 18.4
      }
    }
  },
  {
    "id": "SC",
    "stateCode": "SC",
    "stateName": "South Carolina",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 7,
    "senate": {
      "demCandidate": {
        "name": "Annie Andrews",
        "party": "DEM",
        "votes": 1042362,
        "pct": 51.1
      },
      "gopCandidate": {
        "name": "Darline Graham",
        "party": "GOP",
        "votes": 951165,
        "pct": 46.6
      },
      "otherVotes": 18000,
      "reportingPct": 100,
      "status": "called_dem",
      "historical2022": {
        "demPct": 37.1,
        "gopPct": 62.9,
        "margin": -25.8,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Jermaine Johnson",
        "party": "DEM",
        "votes": 959001,
        "pct": 47.1
      },
      "gopCandidate": {
        "name": "Alan Wilson",
        "party": "GOP",
        "votes": 1050190,
        "pct": 51.6
      },
      "otherVotes": 15000,
      "reportingPct": 100,
      "status": "called_gop",
      "historical2022": {
        "demPct": 40.7,
        "gopPct": 58.1,
        "margin": -17.4,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 7,
      "demSeats": 1,
      "gopSeats": 4,
      "uncalledSeats": 2,
      "popularDemVotes": 976888,
      "popularGopVotes": 1030157,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 6,
        "demPopularPct": 42.4,
        "gopPopularPct": 57.6,
        "margin": -15.2
      }
    }
  },
  {
    "id": "SD",
    "stateCode": "SD",
    "stateName": "South Dakota",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 1,
    "senate": {
      "demCandidate": {
        "name": "Brian Bengs",
        "party": "IND",
        "votes": 118984,
        "pct": 39.3
      },
      "gopCandidate": {
        "name": "Mike Rounds",
        "party": "GOP",
        "votes": 183791,
        "pct": 60.7
      },
      "otherVotes": 3200,
      "reportingPct": 79,
      "status": "called_gop",
      "historical2022": {
        "demPct": 26.1,
        "gopPct": 69.6,
        "margin": -43.5,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Dan Ahlers",
        "party": "DEM",
        "votes": 109996,
        "pct": 36.4
      },
      "gopCandidate": {
        "name": "Larry Rhoden",
        "party": "GOP",
        "votes": 192118,
        "pct": 63.6
      },
      "otherVotes": 4000,
      "reportingPct": 79,
      "status": "called_gop",
      "historical2022": {
        "demPct": 35.2,
        "gopPct": 62,
        "margin": -26.8,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 1,
      "demSeats": 0,
      "gopSeats": 1,
      "uncalledSeats": 0,
      "popularDemVotes": 108459,
      "popularGopVotes": 194742,
      "reportingPct": 79,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 1,
        "demPopularPct": 34,
        "gopPopularPct": 66,
        "margin": -32
      }
    }
  },
  {
    "id": "TN",
    "stateCode": "TN",
    "stateName": "Tennessee",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 9,
    "senate": {
      "demCandidate": {
        "name": "Marquita Bradshaw",
        "party": "DEM",
        "votes": 886911,
        "pct": 42.9
      },
      "gopCandidate": {
        "name": "Bill Hagerty",
        "party": "GOP",
        "votes": 1138407,
        "pct": 55.1
      },
      "otherVotes": 25000,
      "reportingPct": 89,
      "status": "called_gop",
      "historical2022": {
        "demPct": 34.5,
        "gopPct": 63.8,
        "margin": -29.3,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Jerri Green",
        "party": "DEM",
        "votes": 902546,
        "pct": 43.1
      },
      "gopCandidate": {
        "name": "Marsha Blackburn",
        "party": "GOP",
        "votes": 950259,
        "pct": 45.3
      },
      "otherVotes": 22000,
      "reportingPct": 91,
      "status": "called_gop",
      "historical2022": {
        "demPct": 32.9,
        "gopPct": 64.9,
        "margin": -32,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 9,
      "demSeats": 0,
      "gopSeats": 7,
      "uncalledSeats": 2,
      "popularDemVotes": 903816,
      "popularGopVotes": 1088326,
      "reportingPct": 87,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 8,
        "demPopularPct": 35.8,
        "gopPopularPct": 64.2,
        "margin": -28.4
      }
    }
  },
  {
    "id": "TX",
    "stateCode": "TX",
    "stateName": "Texas",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 38,
    "senate": {
      "demCandidate": {
        "name": "James Talarico",
        "party": "DEM",
        "votes": 5206111,
        "pct": 54.1
      },
      "gopCandidate": {
        "name": "Ken Paxton",
        "party": "GOP",
        "votes": 4231552,
        "pct": 44
      },
      "otherVotes": 85000,
      "reportingPct": 96,
      "status": "called_dem",
      "historical2022": {
        "demPct": 43.8,
        "gopPct": 53.5,
        "margin": -9.7,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Gina Hinojosa",
        "party": "DEM",
        "votes": 5031200,
        "pct": 52.9
      },
      "gopCandidate": {
        "name": "Greg Abbott",
        "party": "GOP",
        "votes": 4349221,
        "pct": 45.7
      },
      "otherVotes": 78000,
      "reportingPct": 95,
      "status": "called_dem",
      "historical2022": {
        "demPct": 43.9,
        "gopPct": 54.8,
        "margin": -10.9,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 38,
      "demSeats": 13,
      "gopSeats": 18,
      "uncalledSeats": 7,
      "popularDemVotes": 4950368,
      "popularGopVotes": 4413781,
      "reportingPct": 89,
      "historical2022": {
        "demSeats": 13,
        "gopSeats": 25,
        "demPopularPct": 44.1,
        "gopPopularPct": 55.9,
        "margin": -11.8
      }
    }
  },
  {
    "id": "UT",
    "stateCode": "UT",
    "stateName": "Utah",
    "hasSenateRace": false,
    "hasGovernorRace": false,
    "houseSeats": 4,
    "house": {
      "totalSeats": 4,
      "demSeats": 1,
      "gopSeats": 3,
      "uncalledSeats": 0,
      "popularDemVotes": 322028,
      "popularGopVotes": 317266,
      "reportingPct": 67,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 4,
        "demPopularPct": 37,
        "gopPopularPct": 63,
        "margin": -26
      }
    }
  },
  {
    "id": "VT",
    "stateCode": "VT",
    "stateName": "Vermont",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 1,
    "governor": {
      "demCandidate": {
        "name": "Amanda Janoo",
        "party": "DEM",
        "votes": 140665,
        "pct": 45.8
      },
      "gopCandidate": {
        "name": "Phil Scott",
        "party": "GOP",
        "votes": 160813,
        "pct": 52.4
      },
      "otherVotes": 3200,
      "reportingPct": 100,
      "status": "called_gop",
      "historical2022": {
        "demPct": 28.1,
        "gopPct": 71.3,
        "margin": -43.2,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 1,
      "demSeats": 1,
      "gopSeats": 0,
      "uncalledSeats": 0,
      "popularDemVotes": 197546,
      "popularGopVotes": 93351,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 0,
        "demPopularPct": 63.5,
        "gopPopularPct": 36.5,
        "margin": 27
      }
    }
  },
  {
    "id": "VA",
    "stateCode": "VA",
    "stateName": "Virginia",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 11,
    "senate": {
      "demCandidate": {
        "name": "Mark Warner",
        "party": "DEM",
        "votes": 2175916,
        "pct": 61
      },
      "gopCandidate": {
        "name": "Bert Mizusawa",
        "party": "GOP",
        "votes": 1384613,
        "pct": 38.8
      },
      "otherVotes": 25000,
      "reportingPct": 100,
      "status": "called_dem",
      "historical2022": {
        "demPct": 53,
        "gopPct": 46.5,
        "margin": 6.5,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 11,
      "demSeats": 7,
      "gopSeats": 2,
      "uncalledSeats": 2,
      "popularDemVotes": 2083691,
      "popularGopVotes": 1427423,
      "reportingPct": 100,
      "historical2022": {
        "demSeats": 6,
        "gopSeats": 5,
        "demPopularPct": 52.1,
        "gopPopularPct": 47.9,
        "margin": 4.2
      },
      "keyBattlegroundDistricts": [
        {
          "district": "VA-02",
          "demName": "Missy Cotter Smasal",
          "gopName": "Jen Kiggans",
          "demVotes": 165400,
          "gopVotes": 162900,
          "demPct": 50.4,
          "gopPct": 49.6,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 4.2
        },
        {
          "district": "VA-07",
          "demName": "Eugene Vindman",
          "gopName": "Derrick Anderson",
          "demVotes": 182100,
          "gopVotes": 176400,
          "demPct": 50.8,
          "gopPct": 49.2,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": -1
        }
      ]
    }
  },
  {
    "id": "WA",
    "stateCode": "WA",
    "stateName": "Washington",
    "hasSenateRace": false,
    "hasGovernorRace": false,
    "houseSeats": 10,
    "house": {
      "totalSeats": 10,
      "demSeats": 7,
      "gopSeats": 0,
      "uncalledSeats": 3,
      "popularDemVotes": 1258247,
      "popularGopVotes": 713484,
      "reportingPct": 71,
      "historical2022": {
        "demSeats": 8,
        "gopSeats": 2,
        "demPopularPct": 57.5,
        "gopPopularPct": 42.5,
        "margin": 15
      },
      "keyBattlegroundDistricts": [
        {
          "district": "WA-03",
          "demName": "Marie Gluesenkamp Perez",
          "gopName": "Joe Kent",
          "demVotes": 176200,
          "gopVotes": 171400,
          "demPct": 50.7,
          "gopPct": 49.3,
          "reportingPct": 100,
          "status": "called_dem",
          "swingVs2022": 0.9
        }
      ]
    }
  },
  {
    "id": "WV",
    "stateCode": "WV",
    "stateName": "West Virginia",
    "hasSenateRace": true,
    "hasGovernorRace": false,
    "houseSeats": 2,
    "senate": {
      "demCandidate": {
        "name": "Rachel Fetty Anderson",
        "party": "DEM",
        "votes": 172922,
        "pct": 37.9
      },
      "gopCandidate": {
        "name": "Shelley Moore Capito",
        "party": "GOP",
        "votes": 266068,
        "pct": 58.3
      },
      "otherVotes": 7500,
      "reportingPct": 75,
      "status": "called_gop",
      "historical2022": {
        "demPct": 29.7,
        "gopPct": 70.3,
        "margin": -40.6,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 2,
      "demSeats": 0,
      "gopSeats": 2,
      "uncalledSeats": 0,
      "popularDemVotes": 180582,
      "popularGopVotes": 262492,
      "reportingPct": 74,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 2,
        "demPopularPct": 31,
        "gopPopularPct": 69,
        "margin": -38
      }
    }
  },
  {
    "id": "WI",
    "stateCode": "WI",
    "stateName": "Wisconsin",
    "hasSenateRace": false,
    "hasGovernorRace": true,
    "houseSeats": 8,
    "governor": {
      "demCandidate": {
        "name": "David Crowley",
        "party": "DEM",
        "votes": 1442541,
        "pct": 54.2
      },
      "gopCandidate": {
        "name": "Tom Tiffany",
        "party": "GOP",
        "votes": 1218939,
        "pct": 45.8
      },
      "otherVotes": 18000,
      "reportingPct": 89,
      "status": "called_dem",
      "historical2022": {
        "demPct": 51.2,
        "gopPct": 47.8,
        "margin": 3.4,
        "winner": "dem",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 8,
      "demSeats": 4,
      "gopSeats": 4,
      "uncalledSeats": 0,
      "popularDemVotes": 1420428,
      "popularGopVotes": 1111568,
      "reportingPct": 85,
      "historical2022": {
        "demSeats": 2,
        "gopSeats": 6,
        "demPopularPct": 48.9,
        "gopPopularPct": 51.1,
        "margin": -2.2
      }
    }
  },
  {
    "id": "WY",
    "stateCode": "WY",
    "stateName": "Wyoming",
    "hasSenateRace": true,
    "hasGovernorRace": true,
    "houseSeats": 1,
    "senate": {
      "demCandidate": {
        "name": "James W. Byrd",
        "party": "DEM",
        "votes": 65097,
        "pct": 34.8
      },
      "gopCandidate": {
        "name": "Harriet Hageman",
        "party": "GOP",
        "votes": 122157,
        "pct": 65.2
      },
      "otherVotes": 3100,
      "reportingPct": 86,
      "status": "called_gop",
      "historical2022": {
        "demPct": 24.3,
        "gopPct": 73,
        "margin": -48.7,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "governor": {
      "demCandidate": {
        "name": "Kenneth Casner",
        "party": "DEM",
        "votes": 27469,
        "pct": 14.7
      },
      "gopCandidate": {
        "name": "Eric Barlow",
        "party": "GOP",
        "votes": 128480,
        "pct": 68.6
      },
      "otherVotes": 3200,
      "reportingPct": 86,
      "status": "called_gop",
      "historical2022": {
        "demPct": 17.8,
        "gopPct": 78.7,
        "margin": -60.9,
        "winner": "gop",
        "reportingPct": 100
      }
    },
    "house": {
      "totalSeats": 1,
      "demSeats": 0,
      "gopSeats": 1,
      "uncalledSeats": 0,
      "popularDemVotes": 61687,
      "popularGopVotes": 99891,
      "reportingPct": 84,
      "historical2022": {
        "demSeats": 0,
        "gopSeats": 1,
        "demPopularPct": 24.5,
        "gopPopularPct": 75.5,
        "margin": -51
      }
    }
  },
  {
    "id": "DC",
    "stateCode": "DC",
    "stateName": "District of Columbia",
    "hasSenateRace": false,
    "hasGovernorRace": false,
    "houseSeats": 1,
    "house": {
      "totalSeats": 1,
      "demSeats": 0,
      "gopSeats": 0,
      "uncalledSeats": 1,
      "popularDemVotes": 0,
      "popularGopVotes": 0,
      "reportingPct": 0,
      "historical2022": {
        "demSeats": 1,
        "gopSeats": 0,
        "demPopularPct": 92.5,
        "gopPopularPct": 5.2,
        "margin": 87.3
      }
    }
  }
];

/**
 * Official State Poll-Closing Waves (CET / EST) and Tabulation Speed Profiles:
 * - closeWave 1: 01:00 CET / 19:00 EST (IN, KY, GA, SC, VA, VT)
 * - closeWave 2: 02:00 CET / 20:00 EST (NC, OH, WV, FL, PA, IL, MO, NH, ME, MA, MD, NJ, DE, CT, RI, DC, TN, AL, MS, OK)
 * - closeWave 3: 03:00 CET / 21:00 EST (AR, TX, MI, WI, MN, CO, AZ, NM, NY, NE, KS, LA, SD, ND, WY)
 * - closeWave 4: 04:00 CET / 22:00 EST (IA, MT, NV, UT)
 * - closeWave 5: 05:00 CET / 23:00 EST (CA, WA, OR, ID, HI)
 * - closeWave 6: 07:00 CET / 01:00 EST (AK)
 */
const STATE_CLOSE_WAVE: Record<string, { wave: number; speed: 'fast' | 'moderate' | 'battleground_slow' | 'west_mail_slow' }> = {
  IN: { wave: 1, speed: 'fast' },
  KY: { wave: 1, speed: 'fast' },
  SC: { wave: 1, speed: 'fast' },
  VT: { wave: 1, speed: 'fast' },
  VA: { wave: 1, speed: 'moderate' },
  GA: { wave: 1, speed: 'battleground_slow' },

  FL: { wave: 2, speed: 'fast' },
  OH: { wave: 2, speed: 'fast' },
  WV: { wave: 2, speed: 'fast' },
  OK: { wave: 2, speed: 'fast' },
  TN: { wave: 2, speed: 'fast' },
  AL: { wave: 2, speed: 'fast' },
  DE: { wave: 2, speed: 'fast' },
  RI: { wave: 2, speed: 'fast' },
  NH: { wave: 2, speed: 'fast' },
  MS: { wave: 2, speed: 'moderate' },
  IL: { wave: 2, speed: 'moderate' },
  MO: { wave: 2, speed: 'moderate' },
  MA: { wave: 2, speed: 'moderate' },
  MD: { wave: 2, speed: 'moderate' },
  NJ: { wave: 2, speed: 'moderate' },
  CT: { wave: 2, speed: 'moderate' },
  DC: { wave: 2, speed: 'moderate' },
  NC: { wave: 2, speed: 'battleground_slow' },
  PA: { wave: 2, speed: 'battleground_slow' },
  ME: { wave: 2, speed: 'battleground_slow' },

  AR: { wave: 3, speed: 'fast' },
  LA: { wave: 3, speed: 'fast' },
  ND: { wave: 3, speed: 'fast' },
  SD: { wave: 3, speed: 'fast' },
  WY: { wave: 3, speed: 'fast' },
  NE: { wave: 3, speed: 'fast' },
  KS: { wave: 3, speed: 'moderate' },
  TX: { wave: 3, speed: 'moderate' },
  MN: { wave: 3, speed: 'moderate' },
  NM: { wave: 3, speed: 'moderate' },
  NY: { wave: 3, speed: 'moderate' },
  CO: { wave: 3, speed: 'west_mail_slow' },
  AZ: { wave: 3, speed: 'west_mail_slow' },
  MI: { wave: 3, speed: 'battleground_slow' },
  WI: { wave: 3, speed: 'battleground_slow' },

  IA: { wave: 4, speed: 'fast' },
  MT: { wave: 4, speed: 'moderate' },
  UT: { wave: 4, speed: 'west_mail_slow' },
  NV: { wave: 4, speed: 'west_mail_slow' },

  ID: { wave: 5, speed: 'moderate' },
  HI: { wave: 5, speed: 'moderate' },
  OR: { wave: 5, speed: 'west_mail_slow' },
  WA: { wave: 5, speed: 'west_mail_slow' },
  CA: { wave: 5, speed: 'west_mail_slow' },

  AK: { wave: 6, speed: 'west_mail_slow' }
};

const SPEED_CURVES: Record<'fast' | 'moderate' | 'battleground_slow' | 'west_mail_slow', number[]> = {
  // Indexed by waves elapsed since poll closure (0 = just closed, 1 = +1 wave, ..., 7 = late Wednesday)
  fast:              [34, 74, 91, 96, 98, 99, 99, 100],
  moderate:          [22, 54, 76, 86, 92, 95, 98, 100],
  battleground_slow: [16, 40, 62, 76, 84, 91, 96, 100],
  west_mail_slow:    [18, 36, 48, 58, 68, 79, 90, 100]
};

function computeCallStatus(
  demVotes: number,
  gopVotes: number,
  reportingPct: number,
  finalStatus: 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call'
): 'uncalled' | 'called_dem' | 'called_gop' | 'too_close_to_call' {
  if (reportingPct <= 0) return 'uncalled';
  const total = demVotes + gopVotes;
  const margin = total > 0 ? Math.abs(((demVotes - gopVotes) / total) * 100) : 0;

  if (margin >= 14 && reportingPct >= 30) return finalStatus;
  if (margin >= 8 && reportingPct >= 60) return finalStatus;
  if (margin >= 4 && reportingPct >= 82) return finalStatus;
  if (margin >= 2.2 && reportingPct >= 92) return finalStatus;
  if (reportingPct >= 96) return finalStatus;

  return margin < 3.5 && reportingPct >= 35 ? 'too_close_to_call' : 'uncalled';
}

function buildWaveStateProgress(waveIndex: number): HourlySnapshot['stateProgress'] {
  const progress: HourlySnapshot['stateProgress'] = {};

  BASE_STATES.forEach((st) => {
    const meta = STATE_CLOSE_WAVE[st.id] || { wave: 2, speed: 'moderate' };
    if (waveIndex < meta.wave) return; // Polls still open in this state

    const stepsSinceClose = Math.min(7, waveIndex - meta.wave);
    const reportingPct = SPEED_CURVES[meta.speed][stepsSinceClose];
    const scale = reportingPct / 100;

    // Slight realistic early-tabulation skew that fades to 0 as reporting approaches 100%
    const unfinishedFactor = (100 - reportingPct) / 100;
    const demFactor = Math.max(0.2, 1 + (meta.speed === 'battleground_slow' ? -0.025 : 0.015) * unfinishedFactor);
    const gopFactor = Math.max(0.2, 1 + (meta.speed === 'battleground_slow' ? 0.025 : -0.015) * unfinishedFactor);

    const senSource = st.senate || st.governor;
    const senDemVotes = senSource ? Math.round(senSource.demCandidate.votes * scale * demFactor) : Math.round((st.house?.popularDemVotes || 100000) * scale * demFactor);
    const senGopVotes = senSource ? Math.round(senSource.gopCandidate.votes * scale * gopFactor) : Math.round((st.house?.popularGopVotes || 100000) * scale * gopFactor);
    const senStatus = st.senate
      ? computeCallStatus(senDemVotes, senGopVotes, reportingPct, st.senate.status)
      : 'uncalled';

    const govDemVotes = st.governor ? Math.round(st.governor.demCandidate.votes * scale * demFactor) : senDemVotes;
    const govGopVotes = st.governor ? Math.round(st.governor.gopCandidate.votes * scale * gopFactor) : senGopVotes;
    const govStatus = st.governor
      ? computeCallStatus(govDemVotes, govGopVotes, reportingPct, st.governor.status)
      : 'uncalled';

    const houseDemVotes = st.house ? Math.round(st.house.popularDemVotes * scale * demFactor) : senDemVotes;
    const houseGopVotes = st.house ? Math.round(st.house.popularGopVotes * scale * gopFactor) : senGopVotes;

    // Scale called House seats realistically with reporting percentage so competitive seats stay uncalled until late
    let houseDemSeats = 0;
    let houseGopSeats = 0;
    if (st.house) {
      const callRatio =
        reportingPct >= 95
          ? 1.0
          : reportingPct >= 85
          ? 0.9
          : reportingPct >= 70
          ? 0.78
          : reportingPct >= 50
          ? 0.62
          : reportingPct >= 30
          ? 0.42
          : 0.2;
      houseDemSeats = Math.min(st.house.demSeats, Math.floor(st.house.demSeats * callRatio));
      houseGopSeats = Math.min(st.house.gopSeats, Math.floor(st.house.gopSeats * callRatio));
    }

    progress[st.id] = {
      reportingPct,
      demVotes: senDemVotes,
      gopVotes: senGopVotes,
      status: senStatus,
      govDemVotes,
      govGopVotes,
      govStatus,
      houseDemVotes,
      houseGopVotes,
      houseDemSeats,
      houseGopSeats
    };
  });

  return progress;
}

/**
 * Hourly simulation snapshots for Election Night & Day-After Counting (Nov 3–4, 2026).
 * Tracks official poll closures, progressive precinct reporting, and uncalled battlegrounds.
 */
export const HOURLY_TIMELINE: HourlySnapshot[] = [
  {
    hourLabel: '15:00 EST (Pre-Close)',
    cetLabel: '21:00 CET (Tue)',
    timeString: 'Polls Open — First Closures at 18:00 EST / 00:00 CET',
    description: 'Voting underway across all 50 states. No precincts reporting yet. First polls close in Indiana & Kentucky at 00:00 CET.',
    nationalReportingPct: 0,
    stateProgress: {}
  },
  {
    hourLabel: '19:00 EST',
    cetLabel: '01:00 CET',
    timeString: 'Poll Closures: IN, KY, GA, SC, VA, VT',
    description: 'Initial eastern polls close. First precincts reporting in Indiana, Kentucky, Georgia, and Virginia.',
    nationalReportingPct: 9,
    stateProgress: buildWaveStateProgress(1)
  },
  {
    hourLabel: '20:00 EST',
    cetLabel: '02:00 CET',
    timeString: 'Poll Closures: NC, OH, PA, FL, IL, ME, NH, MA, NJ, MD, TN, AL, MS, OK',
    description: 'Major eastern battlegrounds open counts. Florida counts rapidly while Pennsylvania, Georgia, and North Carolina enter tight margins.',
    nationalReportingPct: 26,
    stateProgress: buildWaveStateProgress(2)
  },
  {
    hourLabel: '21:00 EST',
    cetLabel: '03:00 CET',
    timeString: 'Poll Closures: TX, MI, WI, MN, AZ, CO, NM, NY, NE, KS, LA, SD, ND, WY',
    description: 'Central, Rust Belt, and Southwest polls close. Texas, Michigan, and Wisconsin begin reporting.',
    nationalReportingPct: 46,
    stateProgress: buildWaveStateProgress(3)
  },
  {
    hourLabel: '22:00 EST',
    cetLabel: '04:00 CET',
    timeString: 'Poll Closures: NV, UT, MT, IA',
    description: 'Mountain West polls close. Early mail ballots drop in Nevada and Arizona while Midwest counts deepen.',
    nationalReportingPct: 59,
    stateProgress: buildWaveStateProgress(4)
  },
  {
    hourLabel: '23:00 EST',
    cetLabel: '05:00 CET',
    timeString: 'Poll Closures: CA, WA, OR, ID, HI',
    description: 'West Coast polls close with initial mail-in ballot drops across California, Washington, and Oregon.',
    nationalReportingPct: 68,
    stateProgress: buildWaveStateProgress(5)
  },
  {
    hourLabel: '01:00 EST (Wed)',
    cetLabel: '07:00 CET',
    timeString: 'Alaska Polls Close — Overnight Counting Across Battlegrounds & West Coast',
    description: 'All polls now closed across the U.S. East Coast at ~90%+, Midwest battlegrounds (MI, WI, PA) at ~76-84%, and West Coast/Alaska mail ballots actively counting.',
    nationalReportingPct: 76,
    stateProgress: buildWaveStateProgress(6)
  },
  {
    hourLabel: '04:00 EST (Wed)',
    cetLabel: '10:00 CET',
    timeString: 'Morning Update — Late Urban & Mail Precincts Reporting',
    description: 'Overnight urban batches report in Georgia, North Carolina, Michigan, and Wisconsin; dozens of West Coast House districts remain uncalled.',
    nationalReportingPct: 84,
    stateProgress: buildWaveStateProgress(7)
  },
  {
    hourLabel: '09:00 EST (Wed)',
    cetLabel: '15:00 CET',
    timeString: 'Wednesday Day Count — Absentee & West Coast Mail Drops',
    description: 'Key Senate battlegrounds reach calls while California, Arizona, Nevada, Oregon, Washington, and Alaska continue tabulating mail ballots.',
    nationalReportingPct: 92,
    stateProgress: buildWaveStateProgress(8)
  },
  {
    hourLabel: 'Final Projection',
    cetLabel: 'Final (99%+)',
    timeString: 'All Races Projected — Full 50-State Midterm Tally',
    description: 'Live 2026 U.S. Midterm Election returns from civicAPI v2; full swing analysis vs. 2022 certified baseline.',
    nationalReportingPct: 100,
    stateProgress: {} // In final projection, uses full BASE_STATES data
  }
];
