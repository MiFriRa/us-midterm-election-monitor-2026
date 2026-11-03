# US Midterm Election Monitor 2026

An interactive, real-time election monitoring dashboard for the **2026 United States Midterm Elections** (**U.S. Senate**, **U.S. House of Representatives**, and **State Governors**), comparing incoming 2026 precinct returns directly against the certified **2022 midterm baseline**.

Built by **[Frimer-Rasmussen Consulting](https://frimer-rasmussen.dk)**.

---

## Core Design & UX Architecture

The interface is structured around classic **Gestalt visual perception principles** (*Figure-Ground*, *Similarity*, *Proximity*, and *Law of Prägnanz*) so that **color hue is reserved strictly for political meaning** (Blue = Democratic, Red = Republican, Royal Purple = 50/50 Tossup), while all UI chrome uses an achromatic slate hierarchy.

The cockpit is organized into three primary analytical pillars:

1. **Counting Status (Single Source of Truth)**
   - Displays national reporting progress (`0%` while polls are open before `00:00 CET / 18:00 EST`), live synchronization state, and the current Central European Time (CET) / Eastern Standard Time (EST) election-night clock.
2. **Biggest Surprises Relative to 2022**
   - Ranks the states with the largest demographic/partisan margin shifts (`Swing vs. 2022`), unexpected party seat flips, and high-population House delegation shifts as returns arrive.
   - Remains quiet (*Awaiting First Returns*) while `0%` of precincts have reported, preventing premature or artificial "surprises" before polls close.
3. **Seat Distribution Across All Three Chambers**
   - Simultaneous side-by-side majority bars and seat tallies for:
     - **U.S. Senate** (`51` seats for majority; includes the 65 non-up seats `34 DEM / 31 GOP` + 35 Class 2 contested seats in 2026)
     - **U.S. House** (`218` seats for majority; all 435 congressional districts contested)
     - **State Governors** (`26` states for majority; 14 non-up governors `6 DEM / 8 GOP` + 36 contested gubernatorial races in 2026)

---

## Map Projections & Color Modes

- **Equal-Area Cartogram (Default):** Every state is rendered with equal visual weight so small, high-impact battleground states (e.g., New Hampshire, Maine, Rhode Island, Delaware, Connecticut) are immediately legible without geographic land-area distortion.
- **Geographic Projection (Albers USA):** Classic D3 Albers Equal-Area Conic projection using TopoJSON boundaries (`us-atlas`).
- **Three Analytical Color Scales:**
  - **2026 Live Margin:** Continuous Red–Purple–Blue spectrum (`#EF4444` ↔ `#7C3AED` ↔ `#3B82F6`), where royal purple highlights razor-thin tossups with maximum majority leverage.
  - **Swing vs. 2022:** Highlights partisan shift (`Δ Margin`) relative to the certified 2022 midterm election in each state.
  - **2022 Result:** Certified 2022 baseline results for instant historical comparison.

---

## Election-Night Timeline & Live Data Sync (Zero API Cost)

The application operates 100% client-side with **no paid API keys or LLM dependencies**:

- **Real-Time CET Election Clock (`00:00 CET` – `09:00 CET`):**
  - Tracks official state poll-closing waves hour-by-hour from **Tue 21:00 CET (15:00 EST Pre-Close)** through **Wed 09:00 CET (03:00 EST)** as precinct counts progress from East Coast closings (`IN`, `KY`, `GA`, `VA`, `NC`, `OH`) to West Coast and Alaska closings.
- **Public JSON Endpoint & Custom Feed Adapter:**
  - Supports automatic polling (15s–120s intervals) or manual JSON ingestion via the **Live Data Sync** modal.
  - Includes a built-in end-to-end test feed (`/live-test-feed.json`) covering all 50 states to verify parsing, map rendering, and surprise ranking at any time.

### Live JSON Feed Schema

You can point the **Public JSON Endpoint** adapter to any CORS-enabled URL or paste JSON matching either an array of state patches or a keyed object:

```json
{
  "timestamp": "2026-11-04T03:00:00Z",
  "source": "Election Night Feed",
  "states": {
    "GA": {
      "senate": { "demPct": 49.4, "gopPct": 49.1, "reportingPct": 88, "called": false },
      "house":  { "demPct": 47.8, "gopPct": 51.2, "reportingPct": 86, "called": false, "demSeats": 5, "gopSeats": 9 },
      "governor": { "demPct": 48.2, "gopPct": 50.8, "reportingPct": 88, "called": false }
    },
    "MI": {
      "senate": { "demPct": 49.8, "gopPct": 48.7, "reportingPct": 79, "called": false }
    }
  }
}
```

---

## Getting Started

### Prerequisites
- **Node.js** `>= 20.x`
- **npm** `>= 10.x`

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server at http://localhost:3000
npm run dev
```

### Verification & Production Build

```bash
# Run the election math & live-feed unit test suite
npx tsx --test src/utils/electionMath.test.ts

# Run TypeScript type checking
npm run lint

# Build for production (outputs to dist/)
npm run build
```

---

## Project Structure

```text
├── public/
│   └── live-test-feed.json              # Full 50-state test payload for verifying live data sync
├── src/
│   ├── components/
│   │   ├── Header.tsx                   # Top navigation bar, sync trigger, and Frimer-Rasmussen link
│   │   ├── ChamberBalanceBar.tsx        # Pillar 1 (Counting Status) & Pillar 3 (Senate/House/Governors)
│   │   ├── TopSurprisesDeck.tsx         # Pillar 2 (Biggest Surprises vs. 2022 sidebar)
│   │   ├── USMap.tsx                    # Equal-Area Cartogram & Albers USA map with 2026/Swing/2022 views
│   │   ├── HourlyTimelineController.tsx # Bottom CET/EST election-night scrubber & playback controls
│   │   ├── StateDetailPanel.tsx         # Drill-down slide-over for individual state races & 2022 comparison
│   │   ├── LiveAdapterModal.tsx         # Live Data Sync configuration & 1-click connection test
│   │   └── TimelapseStudioModal.tsx     # WebM timelapse video recorder & exporter
│   ├── data/
│   │   ├── electionData2026.ts          # 50-state 2022 baselines, 2026 candidates, and seat baselines
│   │   └── hourlyTimelineData.ts        # Poll-closing schedule (EST/CET) and hourly reporting waves
│   ├── utils/
│   │   ├── electionMath.ts              # Margin math, swing calculation, chamber tallies, surprise ranking
│   │   ├── electionMath.test.ts         # Automated unit & integration tests
│   │   └── liveElectionFeed.ts          # Client-side CET clock & JSON feed synchronization engine
│   └── types/
│       └── election.ts                  # TypeScript interfaces for states, chambers, and live patches
└── package.json
```

---

## Attribution

Designed and engineered by **[Frimer-Rasmussen Consulting](https://frimer-rasmussen.dk)**.
