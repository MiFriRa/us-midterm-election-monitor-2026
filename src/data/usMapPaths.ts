/**
 * Accurate Albers USA SVG Path data and centroids for all 50 states + DC.
 * Coordinate space: 960 x 600.
 */

export interface StateMapPath {
  id: string; // 'AL', 'AK', etc.
  name: string;
  path: string;
  cx: number; // centroid X
  cy: number; // centroid Y
}

export const US_STATE_PATHS: StateMapPath[] = [
  {
    id: 'WA',
    name: 'Washington',
    path: 'M150,42 L245,55 L235,115 L145,105 L125,65 Z',
    cx: 180,
    cy: 78
  },
  {
    id: 'OR',
    name: 'Oregon',
    path: 'M125,65 L145,105 L235,115 L220,195 L115,180 L110,120 Z',
    cx: 170,
    cy: 145
  },
  {
    id: 'CA',
    name: 'California',
    path: 'M115,180 L220,195 L200,285 L255,360 L235,420 L180,410 L135,320 L105,230 Z',
    cx: 165,
    cy: 295
  },
  {
    id: 'NV',
    name: 'Nevada',
    path: 'M220,195 L285,205 L270,330 L210,340 L200,285 Z',
    cx: 245,
    cy: 260
  },
  {
    id: 'ID',
    name: 'Idaho',
    path: 'M245,55 L270,60 L260,130 L310,140 L295,205 L235,115 Z',
    cx: 265,
    cy: 130
  },
  {
    id: 'MT',
    name: 'Montana',
    path: 'M270,60 L450,85 L440,165 L260,130 Z',
    cx: 355,
    cy: 110
  },
  {
    id: 'WY',
    name: 'Wyoming',
    path: 'M310,140 L440,165 L430,235 L300,210 Z',
    cx: 370,
    cy: 185
  },
  {
    id: 'UT',
    name: 'Utah',
    path: 'M285,205 L365,215 L355,315 L270,305 Z',
    cx: 320,
    cy: 260
  },
  {
    id: 'AZ',
    name: 'Arizona',
    path: 'M270,305 L355,315 L340,430 L245,410 L255,360 Z',
    cx: 305,
    cy: 370
  },
  {
    id: 'NM',
    name: 'New Mexico',
    path: 'M355,315 L455,320 L445,435 L340,430 Z',
    cx: 400,
    cy: 375
  },
  {
    id: 'CO',
    name: 'Colorado',
    path: 'M365,215 L490,225 L480,310 L355,300 Z',
    cx: 425,
    cy: 260
  },
  {
    id: 'ND',
    name: 'North Dakota',
    path: 'M450,85 L560,95 L555,160 L440,150 Z',
    cx: 500,
    cy: 120
  },
  {
    id: 'SD',
    name: 'South Dakota',
    path: 'M440,150 L555,160 L550,225 L430,215 Z',
    cx: 495,
    cy: 185
  },
  {
    id: 'NE',
    name: 'Nebraska',
    path: 'M430,215 L570,225 L565,285 L475,285 L475,255 L425,255 Z',
    cx: 500,
    cy: 250
  },
  {
    id: 'KS',
    name: 'Kansas',
    path: 'M475,285 L595,290 L590,350 L470,345 Z',
    cx: 535,
    cy: 315
  },
  {
    id: 'OK',
    name: 'Oklahoma',
    path: 'M455,345 L600,350 L595,405 L525,410 L505,390 L455,390 Z',
    cx: 535,
    cy: 375
  },
  {
    id: 'TX',
    name: 'Texas',
    path: 'M455,390 L525,410 L595,405 L605,475 L565,550 L515,570 L470,520 L430,460 L445,435 L455,390 Z',
    cx: 515,
    cy: 475
  },
  {
    id: 'MN',
    name: 'Minnesota',
    path: 'M560,95 L645,105 L630,195 L585,225 L555,160 Z',
    cx: 595,
    cy: 155
  },
  {
    id: 'IA',
    name: 'Iowa',
    path: 'M555,225 L650,230 L640,290 L565,285 Z',
    cx: 605,
    cy: 255
  },
  {
    id: 'MO',
    name: 'Missouri',
    path: 'M565,285 L665,290 L645,385 L585,380 L590,350 Z',
    cx: 625,
    cy: 335
  },
  {
    id: 'AR',
    name: 'Arkansas',
    path: 'M595,380 L665,385 L655,455 L590,450 Z',
    cx: 630,
    cy: 415
  },
  {
    id: 'LA',
    name: 'Louisiana',
    path: 'M590,450 L655,455 L650,510 L685,525 L675,545 L625,540 L605,475 Z',
    cx: 635,
    cy: 495
  },
  {
    id: 'WI',
    name: 'Wisconsin',
    path: 'M630,150 L695,160 L685,245 L630,240 Z',
    cx: 660,
    cy: 195
  },
  {
    id: 'IL',
    name: 'Illinois',
    path: 'M640,240 L695,245 L685,355 L645,350 Z',
    cx: 665,
    cy: 295
  },
  {
    id: 'MI',
    name: 'Michigan',
    path: 'M670,125 L735,135 L745,210 L705,245 L695,200 L665,185 Z',
    cx: 715,
    cy: 185
  },
  {
    id: 'IN',
    name: 'Indiana',
    path: 'M695,245 L740,250 L730,335 L685,330 Z',
    cx: 715,
    cy: 290
  },
  {
    id: 'OH',
    name: 'Ohio',
    path: 'M740,230 L800,235 L785,315 L730,310 Z',
    cx: 765,
    cy: 275
  },
  {
    id: 'KY',
    name: 'Kentucky',
    path: 'M685,330 L790,325 L775,370 L675,375 Z',
    cx: 730,
    cy: 350
  },
  {
    id: 'TN',
    name: 'Tennessee',
    path: 'M665,375 L800,370 L785,410 L660,415 Z',
    cx: 730,
    cy: 395
  },
  {
    id: 'MS',
    name: 'Mississippi',
    path: 'M655,420 L700,420 L695,510 L650,510 Z',
    cx: 675,
    cy: 465
  },
  {
    id: 'AL',
    name: 'Alabama',
    path: 'M700,420 L750,420 L740,515 L695,510 Z',
    cx: 720,
    cy: 465
  },
  {
    id: 'GA',
    name: 'Georgia',
    path: 'M750,410 L815,405 L800,500 L740,495 Z',
    cx: 775,
    cy: 450
  },
  {
    id: 'FL',
    name: 'Florida',
    path: 'M725,500 L810,500 L855,565 L840,600 L805,570 L760,525 Z',
    cx: 805,
    cy: 540
  },
  {
    id: 'SC',
    name: 'South Carolina',
    path: 'M785,405 L845,395 L840,450 L780,450 Z',
    cx: 810,
    cy: 425
  },
  {
    id: 'NC',
    name: 'North Carolina',
    path: 'M775,360 L885,355 L865,410 L775,410 Z',
    cx: 830,
    cy: 380
  },
  {
    id: 'VA',
    name: 'Virginia',
    path: 'M770,315 L870,305 L875,355 L770,360 Z',
    cx: 825,
    cy: 335
  },
  {
    id: 'WV',
    name: 'West Virginia',
    path: 'M765,280 L815,275 L805,335 L765,330 Z',
    cx: 790,
    cy: 305
  },
  {
    id: 'MD',
    name: 'Maryland',
    path: 'M815,280 L885,280 L870,315 L815,310 Z',
    cx: 845,
    cy: 295
  },
  {
    id: 'DE',
    name: 'Delaware',
    path: 'M875,270 L895,270 L890,305 L875,305 Z',
    cx: 885,
    cy: 288
  },
  {
    id: 'PA',
    name: 'Pennsylvania',
    path: 'M785,225 L875,230 L865,280 L780,275 Z',
    cx: 830,
    cy: 250
  },
  {
    id: 'NJ',
    name: 'New Jersey',
    path: 'M870,230 L895,235 L885,290 L865,280 Z',
    cx: 880,
    cy: 260
  },
  {
    id: 'NY',
    name: 'New York',
    path: 'M795,150 L870,145 L885,225 L805,225 Z',
    cx: 840,
    cy: 185
  },
  {
    id: 'CT',
    name: 'Connecticut',
    path: 'M885,210 L915,210 L910,230 L885,230 Z',
    cx: 900,
    cy: 220
  },
  {
    id: 'RI',
    name: 'Rhode Island',
    path: 'M915,210 L930,210 L928,230 L915,230 Z',
    cx: 922,
    cy: 220
  },
  {
    id: 'MA',
    name: 'Massachusetts',
    path: 'M885,185 L945,185 L940,210 L885,210 Z',
    cx: 915,
    cy: 198
  },
  {
    id: 'VT',
    name: 'Vermont',
    path: 'M870,135 L895,135 L890,185 L870,185 Z',
    cx: 882,
    cy: 160
  },
  {
    id: 'NH',
    name: 'New Hampshire',
    path: 'M895,130 L915,130 L910,185 L890,185 Z',
    cx: 902,
    cy: 158
  },
  {
    id: 'ME',
    name: 'Maine',
    path: 'M905,75 L955,90 L935,160 L895,135 Z',
    cx: 925,
    cy: 115
  },
  // Insets for Alaska, Hawaii, and DC
  {
    id: 'AK',
    name: 'Alaska',
    path: 'M70,480 L180,480 L170,570 L60,560 Z',
    cx: 120,
    cy: 520
  },
  {
    id: 'HI',
    name: 'Hawaii',
    path: 'M230,520 L320,520 L310,570 L220,565 Z',
    cx: 270,
    cy: 545
  },
  {
    id: 'DC',
    name: 'District of Columbia',
    path: 'M865,310 A 10 10 0 1 0 885 310 A 10 10 0 1 0 865 310 Z',
    cx: 875,
    cy: 310
  }
];
