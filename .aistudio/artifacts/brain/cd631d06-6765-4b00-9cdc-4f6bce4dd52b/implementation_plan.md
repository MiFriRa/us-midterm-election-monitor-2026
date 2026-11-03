# US Midterm Election Monitor 2026

An editorial-grade live monitoring and backtesting workstation for the 2026 US Midterm Elections, featuring an interactive color-blended (blue-purple-red) choropleth map, Senate/House/Governor race views, historical 2022/2018 baseline backtesting, and hourly live election night tally updates with shift/swing analysis.

## User Review & Critical Decisions

> [!IMPORTANT]
> The application is configured to reflect the clarified requirements from Phase 1:
> - **Chamber & Race Coverage**: Unified switcher across the **US Senate** (35 races), **House of Representatives** (435 seats aggregated by state with competitive district drill-downs), and **Governor Races** (36 states).
> - **Color-Graduated Purple Map**: True two-party vote share blending from solid blue (`#1D4ED8`) through nuanced shades of purple/violet (`#7C3AED` / `#9333EA`) to solid red (`#DC2626`), with hover tooltips displaying current margin, reporting %, and candidate vote counts.
> - **Swing & Historical Backtesting**: Comprehensive comparison against the 2022 midterm baseline with swing arrows (e.g. `+3.4 pp D` or `+5.1 pp R`) and interactive time-scrubber to simulate hourly returns or plug in live API feeds.

- **Confirmed Decision 1**: All three branches (Senate, House, Governors) supported with synchronized state data.
- **Confirmed Decision 2**: Hybrid data engine supporting both deterministic historical backtesting (2022 baseline replay) and live simulated/hourly election-night stream with manual API endpoint override.
- **Confirmed Decision 3**: Map visualizes both vote share hue (purple gradient) and swing shifts (arrow chips, margin diffs, and toggleable pure-swing heatmap mode).

---

## 1. Overview & Core Concept

- **What It Does**: Provides political analysts, journalists, and election followers with an interactive command center to follow the 2026 US Midterm results. It pairs real historical midterm data (2018 & 2022) with a live hourly polling and reporting simulation for election night (Nov 3, 2026), calculating swing deltas and projecting chamber control in real time.
- **Target Audience / Persona**: Political analysts, newsroom desks, campaign researchers, and election enthusiasts who need fast, legible cartographic insight without visual clutter.
- **Key Value**: Immediate visual comprehension of where swing states are trending relative to previous midterms, combining color-gradient map physics, live reporting counters, and backtesting validation tools.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Overview & National Balance**: The user lands on the national command center. Top summary cards display the balance of power (e.g., Senate 50-50 battle, House 218 threshold, Gubernatorial seats), current reporting progress, and national popular vote swing.
2. **Interactive Map Exploration**:
   - The US vector map renders all 50 states + DC colored by vote margin (deep red for R+15, lavender/purple for battlegrounds within 2 points, deep blue for D+15).
   - Hovering or clicking a state reveals a slide-out inspector showing candidate names, party affiliation, votes counted, percentage counted, and swing vs. 2022.
3. **Chamber Switcher**: Instant tab toggling between **Senate**, **House (State Aggregation & Key Districts)**, and **Governor** races.
4. **Time & Backtesting Controller**:
   - A bottom timeline controls the hour-by-hour reporting pace (`19:00 EST` polls close -> `02:00 EST` late western calls).
   - "Backtest Mode" allows running sanity checks against actual historical 2022 midterm results, testing external REST endpoint formats, and validating formula calculations.
5. **Swing Analysis Mode**: Toggle between "Vote Share Gradient" and "Pure Swing Shift (D-Shift vs R-Shift)", highlighting where the electorate moved most.

### Visual Identity & Theme
- **Aesthetic Direction**: High-density editorial cartography inspired by The New York Times, Washington Post, and financial terminal dashboards. Dark slate foundation with crisp hairline borders and high-legibility tabular typography.
- **Color Palette**:
  - Deep canvas neutral: `#090D16` (deep navy-black) with surface cards `#111827` and hairline borders `#1F2937`.
  - Blue spectrum: `#2563EB` (Safe D), `#3B82F6` (Likely D), `#60A5FA` (Lean D).
  - Purple/Violet spectrum (Tossup/Battleground): `#7C3AED` to `#9333EA` and `#A855F7` for tight 49-51% margins.
  - Red spectrum: `#F87171` (Lean R), `#EF4444` (Likely R), `#DC2626` (Safe R).
  - Accent / Ticker: Amber `#F59E0B` for uncalled / recounting states, Emerald `#10B981` for flips.
- **Typography**:
  - Display / Headings: `Plus Jakarta Sans` or `Outfit` (clean geometric weight).
  - Data, Timestamps & Percentages: Tabular monospace (`font-mono tabular-nums`).
- **Cartography**:
  - Full responsive SVG Albers USA projection with clickable states, district overlays for House battlegrounds, and dedicated insets for AK, HI, and DC.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: SVG Vector Map vs Canvas/Leaflet**:
  - *Chosen Approach*: Self-contained, ultra-crisp responsive SVG US Map with accurate Albers USA state paths and projection math.
  - *Why*: Instant loading, zero external map tile dependencies, crisp scaling on any screen size, direct reactive fill color interpolation, and accessible keyboard/focus navigation.
  - *Alternatives Considered*: Leaflet or Mapbox would add heavy external tile network latency and fragile API key requirements.
- **Decision 2: Color Blending Mathematics**:
  - *Chosen Approach*: Continuous HSL/RGB interpolation anchored by two-party vote share:
    $$\text{Margin} = \%D - \%R$$
    $$\text{Ratio}_D = \frac{\%D}{\%D + \%R}$$
    When $\text{Ratio}_D \approx 0.50$, the state renders in balanced royal violet (`#7C3AED`); as one party leads by $>15\%$, it transitions smoothly to full Red or Blue.
  - *Why*: Fulfills the user's specific request for varying degrees of purple according to color blending, giving instant visual intuition of razor-thin vs safe races.
- **Decision 3: Dual Engine (Historical Backtesting + Live Simulation + Custom API)**:
  - *Chosen Approach*: Built-in verified 2022 midterm baseline for all 50 states (Senate, Governor, House seats), with an hourly playback simulation for Nov 3, 2026, plus a "Custom API Endpoint" modal where users can paste their own live JSON feed URL.
  - *Why*: Allows immediate testing and verification right now, while being fully operational for live election night counts.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                   US Midterm Election Monitor 2026                     │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
         ┌─────────────────────────┴─────────────────────────┐
         ▼                                                   ▼
┌────────────────────────────────┐         ┌───────────────────────────────┐
│     National Balance Header    │         │     Chamber & Mode Toolbar    │
│ Senate (50/50) | House (218)   │         │ Senate / House / Governor     │
│ Gubernatorial (36 Seats)       │         │ Vote Margin / Swing Map Mode  │
└────────────────┬───────────────┘         └───────────────┬───────────────┘
                 │                                         │
                 └────────────────────┬────────────────────┘
                                      ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Interactive US SVG Map                          │
│  - 50 States + DC with Albers USA projection & Island Insets          │
│  - Dynamic Hex Color Blending (Blue ↔ Purple ↔ Red)                    │
│  - State Hover Popover & Swing Indicator (+/- pp D/R)                  │
└────────────────┬───────────────────────────────────────┬───────────────┘
                 │                                       │
                 ▼                                       ▼
┌────────────────────────────────┐         ┌───────────────────────────────┐
│       State Detail Drawer      │         │   Hourly Simulation Bar       │
│  - Candidate vote totals & %   │         │  - 19:00 EST to 04:00 EST     │
│  - 2022 vs 2026 Comparison     │         │  - Play / Pause / Step Hour   │
│  - Swing arrow & margin delta  │         │  - Backtest vs Live API Mode  │
└────────────────────────────────┘         └───────────────────────────────┘
```

### Data Models
- **`StateElectionResult`**:
  - `stateCode`: string (e.g. `'PA'`)
  - `stateName`: string
  - `chamber`: `'senate' | 'house' | 'governor'`
  - `demCandidate`: `{ name: string, votes: number, pct: number }`
  - `gopCandidate`: `{ name: string, votes: number, pct: number }`
  - `otherVotes`: number
  - `reportingPct`: number (0 to 100)
  - `status`: `'uncalled' | 'called_dem' | 'called_gop' | 'runoff'`
  - `historical2022`: `{ demPct: number, gopPct: number, margin: number, winner: 'dem' | 'gop' }`
  - `historical2018`: `{ demPct: number, gopPct: number, margin: number, winner: 'dem' | 'gop' }`
  - `swingVs2022`: number (positive = D-shift, negative = R-shift)
  - `keyDistricts` (for House view): array of competitive congressional districts

### Verification Strategy (Ultra Mode)
1. **Unit Tests (`src/utils/electionMath.test.ts`)**:
   - Verify color blending math (exact hex values for D 50% / R 50% producing vibrant purple; D 70% producing blue; R 70% producing red).
   - Verify swing delta calculation (`currentMargin - baselineMargin`).
   - Verify national seat tally math (majority thresholds: 51 Senate, 218 House).
2. **Browser Verification (`playwright-cli`)**:
   - Verify map renders all 50 states cleanly without overlap.
   - Verify clicking a swing state (e.g., PA, GA, NV, AZ) opens detail drawer with complete 2022 vs 2026 comparison.
   - Verify switching chambers (Senate -> House -> Governor) updates map fills and national seat counts.
   - Verify stepping through the timeline updates state reporting % and color transitions.
