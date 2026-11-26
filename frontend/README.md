# CloudSentinel — Frontend v2

Premium React frontend for the CloudSentinel Automated Cloud Security Audit Engine.

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS (custom `cs-*` palette) |
| Routing | React Router v6 |
| Charts | Recharts (findings donut + service bar) |
| Icons | Lucide React |
| Font | Inter + JetBrains Mono (Google Fonts) |

## Quick start

**Prerequisites:** Node.js ≥ 18 and the Django backend running on port 8000.

```bash
cd cloudsentinel-v2
npm install
npm run dev        # → http://localhost:3000
```

The Vite dev server proxies `/api/*` to `http://127.0.0.1:8000` automatically.

## Environment

```bash
# .env (already committed)
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

Override for a deployed backend:

```bash
VITE_API_BASE_URL=https://your-api.example.com/api npm run build
```

## Project structure

```
src/
├── App.jsx                        # BrowserRouter + Layout + Routes
├── main.jsx                       # React entry
├── index.css                      # Tailwind layers + design tokens
│
├── components/
│   ├── common/
│   │   ├── Badge.jsx              # Severity / status / risk badges
│   │   ├── Button.jsx             # Variants: primary, secondary, ghost, danger
│   │   ├── EmptyState.jsx         # Consistent empty UI
│   │   ├── ErrorState.jsx         # Network/API error display
│   │   ├── LoadingState.jsx       # Skeleton + spinner
│   │   └── Modal.jsx              # Centred modal + side drawer
│   ├── layout/
│   │   ├── Sidebar.jsx            # Fixed nav (desktop) + drawer (mobile)
│   │   └── Header.jsx             # Page header utility
│   ├── dashboard/
│   │   └── WelcomeDashboard.jsx   # First-time + returning-user states
│   ├── infrastructure/
│   │   └── UploadSnapshot.jsx     # Drag-drop upload + ConnectAWS (coming soon)
│   └── reports/
│       ├── AuditReports.jsx       # Scan history table with search/filter
│       ├── ReportDetails.jsx      # Individual scan report
│       ├── SecurityFindings.jsx   # Filterable findings table
│       ├── FindingDetails.jsx     # Side drawer with AI placeholder
│       ├── SeveritySummary.jsx    # Risk ring + severity bars
│       └── RiskChart.jsx          # Donut + bar charts (Recharts)
│
├── pages/
│   ├── WelcomePage.jsx            # / 
│   ├── InfrastructurePage.jsx     # /connect
│   └── ReportsPage.jsx            # /reports  and  /reports/:scanId
│
├── services/
│   ├── api.js                     # Base fetch wrapper + APIError
│   └── scanService.js             # runScan, listScans, getScan, exportScanJson
│
├── hooks/
│   └── useScans.js                # useScans() + useScan(id)
│
└── utils/
    ├── formatters.js              # Date, file size, relative time
    └── severity.js                # Severity / risk colours + sorting
```

## Backend API

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/scans/` | Submit config JSON → returns full scan result |
| GET | `/api/scans/` | List all historical scan summaries |
| GET | `/api/scans/:id/` | Get one scan with findings |

All endpoints are consumed from `src/services/api.js`. Errors surface to the
user via `ErrorState` — there is no silent fallback to mock data.

## Features checklist

- [x] Welcome dashboard (first-time + returning-user state)
- [x] Drag-and-drop JSON snapshot upload with validation
- [x] Real-time scan progress UI (6 stages)
- [x] POST to `api/scans/` with parsed JSON body
- [x] Automatic redirect to report on completion
- [x] Audit reports list with search, risk-level filter, date sort
- [x] Individual report page with severity summary + analytics
- [x] Findings table with multi-filter (severity, service, search) + sort
- [x] Finding detail drawer with copy-evidence action
- [x] AI explanation placeholder (Coming soon — NVIDIA NIM)
- [x] JSON export (functional)
- [x] PDF export (disabled — backend not implemented)
- [x] AWS live connection (disabled — Coming soon)
- [x] Responsive layout (desktop → mobile)
- [x] Error / loading / empty states throughout
- [x] Zero mock data in production paths

## Analytics placement

Charts appear **only** inside an individual audit report (`/reports/:id`),
and only when findings exist:

- **Severity donut** — always shown when `total_findings > 0`
- **Service bar chart** — shown only when findings span more than one service

No charts on the Welcome page, no decorative graphs anywhere.
