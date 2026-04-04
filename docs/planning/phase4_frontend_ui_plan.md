# Phase 4: Frontend UI Engineering Plan

## Tech Stack (Frontend-Only Architecture)
- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`) + Glassmorphism Variables
- **UI Components:** `shadcn/ui` (Button, Badge, Slider, Tooltip, Card)
- **Data Visualization:** `Recharts` (AreaChart, PieChart) & `react-leaflet` (Geo-Heatmap MapContainer)
- **State Management & Animation:** `Zustand` (Global Sim Store) & `Framer Motion` (Shockwaves, Modals, Staggered Loaders)
- **Network Hooks:** `axios` (REST) & native `WebSocket` (Live Triage Feed)

## Structural Repository Mapping (Mono-repo compatible)
```text
src/
├── main.tsx
├── App.tsx             (Full viewport height, CSS Grid Layout)
├── index.css           (Tailwind + glassmorphism + shimmer keyframes)
├── store/
│   └── useSimStore.ts  (Zustand: sliders, emergencyMode, impact_total)
├── hooks/
│   ├── useTriageFeed.ts       (WebSocket feed logic)
│   ├── useForecaster.ts       (REST: /api/forecast?recall=X)
│   ├── useSuppliers.ts        (REST: /api/suppliers)
│   └── usePurchaseOrders.ts   (REST: /api/purchase-orders)
├── components/
│   ├── Navbar.tsx             (Logo, Clock, Emergency Simulate Button)
│   ├── FinancialRisk.tsx      (KPI Card with animated motion values)
│   ├── CommandCenter.tsx      (Sortable Triage Table & SVG Sparkline)
│   ├── CrystalBallForecaster.tsx  (Recharts AreaChart P10/P50/P90)
│   ├── SimulationSliders.tsx      (CDSCO / Delay / Surge hooks)
│   ├── ExplainabilityDoughnut.tsx (Recharts PieChart + API Weights)
│   ├── SupplierGeoMap.tsx         (Leaflet CircularMarkers + Shockwave CSS)
│   └── PurchaseOrderLedger.tsx    (CSV Blob Exporter)
├── utils/
│   └── format.ts       (formatCurrency INR, roundTo, formatDate)
└── types/
    └── api.ts          (TypeScript Interfaces: DrugRow, ForecastPoint, etc.)
```

## Global Design: Glassmorphism Dark Mode
```css
:root {
  --bg-base: #080B18;
  --bg-glass: rgba(255,255,255,0.04);
  --border-glass: rgba(255,255,255,0.09);
  --accent-blue: #00C2FF;
  --accent-amber: #FFB800;
  --accent-red: #FF3B5C;
  --accent-green: #00E5A0;
}
.glass-card { backdrop-filter: blur(14px); border: 1px solid var(--border-glass); }
```

## Additional Features (No Backend Required)
1. **The "Simulate Emergency" Button:** Located securely in the Navbar. Modifies global Zustand state `emergencyMode=true`. This magically triggers staggered Framer animations across all connected components simultaneously.
2. **Dynamic Live Background:** A purely CSS/Canvas mesh background acting as an immersive tracking grid behind the Glassmorphism cards.
3. **Immersive Light/Dark Switch:** A persistent toggle mutating CSS variables from the default `#080B18` to a bright clinical white palette instantly.

## Execution Sequence
*(Awaiting user trigger to commence build process inside `src/`).*
