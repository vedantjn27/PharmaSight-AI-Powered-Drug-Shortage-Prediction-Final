# PharmaSight Frontend - Architecture & Component Hierarchy

## Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 (App Router)                   │
├─────────────────────────────────────────────────────────────┤
│  • Server-Side Rendering (RSC)                              │
│  • API Routes & Rewrites                                    │
│  • Static & Dynamic Pages                                   │
│  • Image Optimization                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
         ┌────────────────────┬─────────────────────┐
         ↓                    ↓                     ↓
    ┌─────────┐         ┌─────────┐         ┌─────────┐
    │  Pages  │         │Components│        │ Layouts │
    ├─────────┤         ├─────────┤        ├─────────┤
    │Landing  │         │Dashboard │        │ Root    │
    │Dashboard│         │Components│       │Dashboard│
    └─────────┘         └─────────┘        └─────────┘
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                     ↓
    ┌─────────────┐   ┌──────────────┐    ┌─────────────┐
    │ State Mgmt  │   │   Utilities  │    │ Styling     │
    │ (Zustand)   │   │ (API, Format)│    │ (Tailwind)  │
    ├─────────────┤   ├──────────────┤    ├─────────────┤
    │appStore.ts  │   │api.ts        │    │globals.css  │
    └─────────────┘   │format.ts     │    │tailwind.cfg │
                      │constants.ts  │    │postcss.cfg  │
                      └──────────────┘    └─────────────┘
                              ↓
         ┌────────────────────┼────────────────────┐
         ↓                    ↓                     ↓
    ┌─────────────┐   ┌──────────────┐    ┌─────────────┐
    │Backend API  │   │Mock Data     │    │ Animations  │
    │(localhost:  │   │(emergencyData)   │(Framer)     │
    │  8000)      │   └──────────────┘    └─────────────┘
    └─────────────┘
         ↓
    ┌─────────────────────────────────────┐
    │  PharmaSight Backend (Flask/FastAPI) │
    │  • TFT Inference Pipeline           │
    │  • 9 API Endpoints                  │
    │  • ML Model Predictions             │
    └─────────────────────────────────────┘
```

---

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── Fonts: Geist Sans, Geist Mono
├── Metadata: Title, Description, Viewport
└── Body
    ├── Landing Page (app/page.tsx)
    │   ├── Header (sticky, glassmorphism)
    │   │   ├── Logo + Branding
    │   │   └── "Enter Dashboard" CTA
    │   ├── Hero Section (animated background)
    │   │   ├── Floating gradient orbs (3)
    │   │   ├── Main Headline
    │   │   ├── Subheadline
    │   │   ├── CTA Buttons (2)
    │   │   └── Stats Grid (4 items)
    │   ├── Problem Section
    │   │   └── Problem Cards (3)
    │   ├── Solution Section
    │   │   └── Solution Cards (3)
    │   ├── Features Showcase
    │   │   └── Feature Cards (8 total)
    │   ├── CTA Section
    │   │   └── Large Call-to-Action
    │   └── Footer
    │
    └── Dashboard (app/dashboard/page.tsx)
        ├── DashboardLayout
        │   └── Metadata
        ├── Background Animations
        │   └── Floating gradient orbs (3)
        ├── Navbar
        │   ├── Logo + Branding
        │   ├── Status Indicators
        │   │   ├── Backend Status
        │   │   └── Demo Mode Indicator
        │   ├── Controls
        │   │   ├── Demo Mode Toggle Button
        │   │   ├── Theme Toggle (Sun/Moon)
        │   │   └── Back to Landing Button
        │   └── Sticky positioning
        ├── TabNavigation
        │   ├── 7 Feature Tabs
        │   │   ├── Command Center
        │   │   ├── Financial Risk
        │   │   ├── Crystal Ball Forecaster
        │   │   ├── What-If Simulator
        │   │   ├── Explainability
        │   │   ├── Supplier Map
        │   │   └── Purchase Orders
        │   ├── Icon + Label per tab
        │   ├── Active tab indicator (underline)
        │   └── Animated layout ID
        ├── Main Content (animated transitions)
        │   │
        │   ├── [Tab: Command Center]
        │   │   ├── Title + Description
        │   │   ├── CSVUploadZone
        │   │   │   ├── Drag-drop zone (glassmorphism)
        │   │   │   ├── File input (hidden)
        │   │   │   ├── Upload states
        │   │   │   │   ├── Idle (Upload here)
        │   │   │   │   ├── Uploading (spinner)
        │   │   │   │   ├── Success (checkmark)
        │   │   │   │   └── Error (alert)
        │   │   │   └── Summary stats (file, rows, drugs, date range)
        │   │   │       └── Risk distribution (GREEN/AMBER/RED)
        │   │   ├── Data Source Toggle (if uploaded)
        │   │   │   ├── Live Data button
        │   │   │   └── Uploaded Data button
        │   │   └── Drug Triage Table
        │   │       ├── Header row
        │   │       │   ├── Drug Name
        │   │       │   ├── Category
        │   │       │   ├── Risk Status
        │   │       │   ├── CDSCO Alerts
        │   │       │   ├── Demand
        │   │       │   ├── Cost Volume
        │   │       │   └── 7-Day Trend
        │   │       └── Data rows (animated)
        │   │           ├── Drug info
        │   │           ├── Status badge
        │   │           ├── Alert icon (if any)
        │   │           ├── Numeric values
        │   │           ├── Cost display
        │   │           └── Sparkline chart
        │   │
        │   ├── [Tab: Financial Risk]
        │   │   ├── Data Source Toggle (if uploaded)
        │   │   │   ├── Live Data button
        │   │   │   └── Uploaded Data button
        │   │   ├── Main KPI Card
        │   │   │   ├── "Projected Dollars at Risk"
        │   │   │   ├── Large number display (animated)
        │   │   │   ├── Gradient background
        │   │   │   ├── Icon (TrendingDown)
        │   │   │   └── Supporting text
        │   │   ├── Stats Grid (2 columns)
        │   │   │   ├── Units in Deficit card
        │   │   │   └── Days Until Critical card
        │   │   └── Alert Card
        │   │       ├── Alert icon
        │   │       ├── Title: "Immediate Action Required"
        │   │       └── Recommendation text
        │   │
        │   ├── [Tab: Crystal Ball Forecaster]
        │   │   ├── Drug Selector Dropdown
        │   │   │   └── List of all drugs
        │   │   ├── Forecast Chart Card
        │   │   │   ├── Title + Description
        │   │   │   └── Area Chart (Recharts)
        │   │   │       ├── P10 area (blue)
        │   │   │       ├── P50 area (purple)
        │   │   │       ├── P90 area (red)
        │   │   │       ├── Grid lines
        │   │   │       ├── X/Y axes
        │   │   │       ├── Tooltip on hover
        │   │   │       └── Legend
        │   │   └── Loading state (if fetching)
        │   │
        │   ├── [Tab: What-If Simulator]
        │   │   ├── Slider Cards
        │   │   │   ├── CDSCO Alerts Slider
        │   │   │   │   ├── Label + current value
        │   │   │   │   ├── Range input (0-10)
        │   │   │   │   └── Description
        │   │   │   ├── Supply Delay Slider
        │   │   │   │   ├── Label + current value
        │   │   │   │   ├── Range input (0-30 days)
        │   │   │   │   └── Description
        │   │   │   ├── Demand Multiplier Slider
        │   │   │   │   ├── Label + current value (2 decimals)
        │   │   │   │   ├── Range input (0.5-2.0x)
        │   │   │   │   └── Description
        │   │   │   └── Reset Button
        │   │   └── Results Card (conditional)
        │   │       ├── Drug name
        │   │       ├── Baseline P50
        │   │       ├── Simulated P50 (highlighted)
        │   │       └── Impact summary
        │   │
        │   ├── [Tab: Explainability]
        │   │   ├── Drug Selector Dropdown
        │   │   │   └── List of all drugs
        │   │   ├── Chart Card
        │   │   │   ├── Title + Description
        │   │   │   └── Doughnut Chart (Recharts)
        │   │   │       ├── Feature segments (5 colors)
        │   │   │       ├── Labels with percentages
        │   │   │       ├── Tooltip
        │   │   │       └── Legend
        │   │   └── Explanations Card
        │   │       ├── CDSCO Alerts explanation
        │   │       ├── Demand Lag-1 explanation
        │   │       └── Day of Week explanation
        │   │
        │   ├── [Tab: Supplier Map]
        │   │   ├── Network Visualization Card
        │   │   │   ├── Title + Instructions
        │   │   │   └── Node Buttons (5 suppliers)
        │   │   │       ├── Status indicator dot
        │   │   │       ├── Supplier name
        │   │   │       ├── Risk score %
        │   │   │       └── Hover states
        │   │   ├── Impact Summary Card (conditional)
        │   │   │   ├── Alert icon
        │   │   │   ├── "Disruption Impact" title
        │   │   │   ├── Count of offline suppliers
        │   │   │   ├── Affected nodes
        │   │   │   └── List of offline suppliers
        │   │   └── Reset Network Button (conditional)
        │   │
        │   └── [Tab: Purchase Orders]
        │       ├── Summary Card
        │       │   ├── Selected Orders count
        │       │   └── Total Cost (right-aligned)
        │       ├── Orders Table Card
        │       │   ├── Header row
        │       │   │   ├── Select All checkbox
        │       │   │   ├── Drug Name
        │       │   │   ├── Supplier
        │       │   │   ├── Units
        │       │   │   ├── Est. Cost
        │       │   │   └── Priority
        │       │   ├── Data rows (animated)
        │       │   │   ├── Checkbox per row
        │       │   │   ├── Drug name
        │       │   │   ├── Supplier name
        │       │   │   ├── Unit count
        │       │   │   ├── Cost (formatted)
        │       │   │   └── Priority badge
        │       │   └── Export Button (conditional)
        │       └── Loading state
        │
        └── Footer
            ├── Branding text
            └── Backend status indicator
```

---

## Data Flow Diagram

```
User Action
    ↓
    ├─→ Landing Page
    │   ├─→ [Enter Dashboard]
    │   └─→ Navigate to /dashboard
    │
    └─→ Dashboard Page
        ├─→ Health Check (every 30s)
        │   ├─→ Success: Backend healthy, use live data
        │   └─→ Fail: Enable demo mode
        │
        ├─→ CSV Upload
        │   ├─→ User drags CSV
        │   ├─→ CSVUploadZone validates
        │   ├─→ Backend: POST /api/v1/upload
        │   ├─→ Response: Triage results
        │   ├─→ setUploadedData() in store
        │   └─→ Command Center updates
        │
        ├─→ Feature Tab Click
        │   ├─→ setActiveTab() in store
        │   ├─→ Fetch data from backend
        │   ├─→ On error: Use emergencyData
        │   ├─→ Update component state
        │   └─→ Render with animations
        │
        ├─→ Drug Selection (Forecaster/Explainability)
        │   ├─→ setSelectedDrug() in store
        │   ├─→ GET /api/v1/forecast/{drug}
        │   ├─→ GET /api/v1/explain/{drug}
        │   └─→ Update chart/table
        │
        ├─→ What-If Simulation
        │   ├─→ Slider change
        │   ├─→ setSimulation() in store
        │   ├─→ POST /api/v1/forecast/simulate
        │   ├─→ Response: Simulated values
        │   └─→ Update comparison view
        │
        ├─→ Supplier Disruption
        │   ├─→ Node click
        │   ├─→ Toggle offline state
        │   ├─→ POST /api/v1/network/simulate_disruption
        │   ├─→ Calculate impact
        │   └─→ Show affected nodes
        │
        ├─→ Theme Toggle
        │   ├─→ setDarkMode() in store
        │   ├─→ Save to localStorage
        │   ├─→ Update HTML class
        │   └─→ CSS variables adapt
        │
        └─→ Demo Mode Toggle
            ├─→ setEmergencyMode() in store
            ├─→ Use emergencyData instead of API
            ├─→ All features work normally
            └─→ Show "Demo Mode" indicator
```

---

## State Management (Zustand Store)

```
useAppStore
├── Theme
│   ├── isDarkMode: boolean (persisted)
│   ├── setDarkMode(isDark): void
│   └── toggleDarkMode(): void
│
├── Emergency Mode
│   ├── emergencyMode: boolean
│   └── setEmergencyMode(isEmergency): void
│
├── Navigation
│   ├── selectedDrug: string | null
│   ├── setSelectedDrug(drug): void
│   ├── activeTab: string
│   └── setActiveTab(tab): void
│
├── Simulation State
│   ├── simulation: SimulationState
│   │   ├── cdscoAlerts: number
│   │   ├── supplyDelayDays: number
│   │   └── demandMultiplier: number
│   ├── setSimulation(state): void
│   └── resetSimulation(): void
│
├── Data
│   ├── uploadedData: any | null
│   └── setUploadedData(data): void
│
└── Backend Health
    ├── backendHealthy: boolean
    └── setBackendHealthy(healthy): void
```

---

## API Client Architecture

```
axios instance (api.ts)
    ↓
├─→ checkBackendHealth()
│   └─→ GET /health
│
├─→ getDrugs()
│   └─→ GET /api/v1/drugs
│
├─→ uploadCSV(file)
│   └─→ POST /api/v1/upload
│
├─→ getForecast(drugName)
│   └─→ GET /api/v1/forecast/{drugName}
│
├─→ simulateForecast(drug, alerts, delay, multiplier)
│   └─→ POST /api/v1/forecast/simulate
│
├─→ getExplainability(drugName)
│   └─→ GET /api/v1/explain/{drugName}
│
├─→ getNetwork()
│   └─→ GET /api/v1/network
│
├─→ simulateDisruption(supplierId)
│   └─→ POST /api/v1/network/simulate_disruption
│
└─→ getPurchaseOrders()
    └─→ GET /api/v1/purchase_orders
```

---

## Error Handling Flow

```
API Call
    ↓
    ├─→ Success (200)
    │   └─→ Update state
    │       └─→ Render data
    │
    └─→ Error
        ├─→ Is Backend Health? (checkBackendHealth)
        │   ├─→ Yes: Set backendHealthy=false
        │   └─→ Auto-enable emergencyMode
        │
        ├─→ Show Error Toast/Message
        │
        └─→ Use emergencyData as fallback
            └─→ Feature still works with demo data
```

---

## Styling Architecture

```
globals.css (Global styles)
├── CSS Variables (design tokens)
│   ├── Colors (primary, accent, status)
│   ├── Glass effects (background, border)
│   └── Animations (shimmer, float, fadeIn)
│
└── Component Classes
    ├── .glass (glassmorphism effect)
    ├── .status-badge-green/amber/red
    ├── .button-primary/secondary
    └── .input-field

tailwind.config.ts (Tailwind customization)
├── Custom colors (via CSS variables)
├── Custom animations
├── Glassmorphism utilities
└── Responsive breakpoints

Component Level
└── Tailwind utility classes (responsive prefixes)
    ├── Layout (flex, grid, gap)
    ├── Spacing (px, py, mt, mb)
    ├── Colors (text, bg, border)
    ├── Effects (shadow, blur, opacity)
    └── Interactions (hover, active, focus)
```

---

## Performance Optimization

```
React Compiler
├── Automatic memoization of components
├── Dead code elimination
└── Optimized re-renders

Next.js Optimizations
├── Image optimization (next/image)
├── Code splitting (per route)
├── Static generation where possible
├── Incremental Static Regeneration (ISR)
└── API route compression

Framer Motion
├── GPU acceleration (transform, opacity)
├── Hardware acceleration
└── Optimized re-renders

Bundle Size
├── Tree shaking (unused code removed)
├── Lazy loading (dynamic imports)
├── Code splitting (per feature)
└── Minification & compression
```

---

## Deployment Architecture

```
Local Development
├── Next.js dev server (port 3000)
├── Backend (localhost:8000)
└── Hot Module Replacement (HMR)

Production Build
├── Static optimization
├── Code splitting
├── Image optimization
└── Minified assets

Vercel Deployment
├── Serverless functions (Next.js API routes)
├── Automatic scaling
├── CDN distribution
├── Performance monitoring
└── Built-in CI/CD

Docker Deployment
├── Multi-stage build (builder → runtime)
├── Production dependencies only
├── Health check endpoint
└── Environment variables

Traditional Server
├── Build artifacts
├── PM2 process management
├── Nginx reverse proxy
├── SSL/TLS certificates
└── Log rotation
```

---

## Security Architecture

```
Frontend Security
├── No secrets in code
├── Environment variables (NEXT_PUBLIC_ prefix)
├── HTTPS/TLS in production
├── CSP headers configured
├── X-Frame-Options set
├── CORS origin validation
└── Input sanitization

API Security
├── CORS configured on backend
├── Rate limiting (backend)
├── Request validation (backend)
├── Authentication/Authorization (backend)
└── Secure session handling (backend)

Data Security
├── Encrypted transit (HTTPS)
├── No sensitive data in localStorage
├── Secure session cookies (HttpOnly)
└── CSRF protection (backend)
```

---

This architecture ensures:
- ✅ **Scalability**: Modular components, separated concerns
- ✅ **Maintainability**: Clear structure, consistent patterns
- ✅ **Performance**: Optimized rendering, lazy loading
- ✅ **Reliability**: Error handling, fallback mechanisms
- ✅ **Security**: No exposed secrets, HTTPS, proper validation

