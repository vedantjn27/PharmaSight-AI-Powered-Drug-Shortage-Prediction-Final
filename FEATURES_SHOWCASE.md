# 🎯 PharmaSight Features Showcase

**Complete visual guide to all 7 dashboard features + landing page**

---

## 📱 Landing Page

### Hero Section
```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│  PharmaSight                                             │
│  AI-Powered Drug Shortage Prediction                     │
│                                                           │
│  [Animated gradient background]                         │
│  [3 floating gradient orbs]                             │
│                                                           │
│  The Future of Pharmaceutical Supply Chain Intelligence │
│                                                           │
│  [Enter Dashboard]  [Learn More]                        │
│                                                           │
│  ✨ Real-time Predictions                               │
│  📊 Supply Chain Analytics                              │
│  🔮 Probabilistic Forecasts                             │
│  🚀 AI-Powered Insights                                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Problem / Solution / Features Sections
- Three problem cards (shortage risk, supply delays, demand variability)
- Three solution cards (predictions, optimization, simulation)
- Eight feature showcase cards

### CTA & Footer
- "Get Started" call-to-action
- "Explore Dashboard" button
- Footer with branding & links

---

## 🎨 Dashboard Navigation

### Top Navbar
```
┌──────────────────────────────────────────────────────────┐
│ 📊 PharmaSight  | Backend: 🟢 Healthy | Demo: Off       │
│                                                            │
│         Theme Toggle ☀️/🌙  Demo Button  ← Back           │
└──────────────────────────────────────────────────────────┘
```

### Tab Navigation
```
┌──────────────────────────────────────────────────────────┐
│ 🔌 Command   💰 Financial   🔮 Forecaster   🎮 Simulator │
│                                                            │
│ 🧠 Explain   🗺️ Supplier    🛒 Orders                   │
└──────────────────────────────────────────────────────────┘
  ▼ Underline indicates active tab
  Smooth animation when switching
```

### Background
- 3 floating gradient orbs (slow animation)
- Glassmorphism effect on cards
- Dark/light mode support

---

## 💻 Feature Tabs

### Tab 1: 🔌 Command Center (CSV Upload)

**Primary Feature: Drag-and-Drop CSV Upload**

```
╔══════════════════════════════════════════════════════════╗
║                    COMMAND CENTER                        ║
║                                                           ║
║                 📤 DRAG CSV FILE HERE                    ║
║            or click to select from computer              ║
║                                                           ║
║             Supported: .csv files only                   ║
║         Expected columns: Date, Drug, Qty, Supplier     ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝
```

**After Upload - Upload Summary**
```
╔══════════════════════════════════════════════════════════╗
║ ✅ Upload Complete                                       ║
║                                                           ║
║ 📄 File: procurement_jan.csv                             ║
║ 📊 Rows Processed: 450                                   ║
║ 💊 Drugs Detected: 8                                     ║
║ 📅 Date Range: 2025-01-01 to 2025-01-31                 ║
║                                                           ║
║ Risk Summary: 🟢 4   🟡 2   🔴 2                         │
╚══════════════════════════════════════════════════════════╝
```

**Drug Triage Table**
```
┌──────────────────────────────────────────────────────────┐
│ Drug         │ Status  │ Alerts │ Demand │ Cost  │ Trend │
├──────────────────────────────────────────────────────────┤
│ Paracetamol  │ 🟡AMBER │   1    │  320   │ 64k   │ ↘️    │
│ Ibuprofen    │ 🟢GREEN │   0    │  450   │ 89k   │ ↗️    │
│ Aspirin      │ 🔴RED   │   3    │   95   │ 19k   │ ↙️    │
│ Metformin    │ 🟢GREEN │   0    │ 1200   │ 240k  │ ↗️    │
│ ... (4 more) │ ...     │ ...    │ ...    │ ...   │ ... │
└──────────────────────────────────────────────────────────┘
```

**Features:**
- ✅ Drag-and-drop file upload
- ✅ Real TFT inference (backend)
- ✅ Live vs. uploaded data toggle
- ✅ Risk color coding (GREEN/AMBER/RED)
- ✅ 7-day trend sparklines
- ✅ CDSCO alert indicators

---

### Tab 2: 💰 Financial Risk Analytics

```
╔══════════════════════════════════════════════════════════╗
║                  FINANCIAL RISK ANALYTICS                ║
║                                                           ║
║  ┌─────────────────────────────────────────────────────┐ ║
║  │  Projected Dollars at Risk                          │ ║
║  │                                                     │ ║
║  │            ₹48,75,000  (↑ 23%)                      │ ║
║  │                                                     │ ║
║  │  Based on current shortage patterns & demand       │ ║
║  └─────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌────────────────────┐  ┌────────────────────┐         ║
║  │ Units in Deficit   │  │ Days to Critical   │         ║
║  │                    │  │                    │         ║
║  │    12,450 units    │  │      3.2 days      │         ║
║  │   (Paracetamol)    │  │   (Ibuprofen)      │         ║
║  └────────────────────┘  └────────────────────┘         ║
║                                                           ║
║  🚨 Alert: Immediate action required for 2 drugs       ║
║     Paracetamol shortage risk very high                 ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝
```

**Features:**
- ✅ Large KPI display with animated counter
- ✅ Units in deficit calculation
- ✅ Days until critical shortage
- ✅ Alert indicators & recommendations
- ✅ Gradient styling & visual hierarchy

---

### Tab 3: 🔮 Crystal Ball Forecaster

```
╔══════════════════════════════════════════════════════════╗
║                  CRYSTAL BALL FORECASTER                 ║
║                                                           ║
║  Select Drug: [Paracetamol ▼]                           ║
║                                                           ║
║  ┌──────────────────────────────────────────────────────┐
║  │                30-Day Forecast                       │
║  │                                                      │
║  │   600│     ╱╲                                       │
║  │      │    ╱  ╲    ╱───────╲                        │
║  │   400│   ╱    ╲  ╱         ╲     P90               │
║  │      │  ╱      ╲╱           ╲                      │
║  │   200│                       ╲                     │
║  │      │  └─────────────────────┘                   │
║  │     0└──────────────────────────────────→ Days    │
║  │      Jan 1      Jan 15       Jan 31               │
║  │                                                     │
║  │ Legend:  ─── P10  ─── P50  ─── P90               │
║  └──────────────────────────────────────────────────────┘
║
║  Forecast Range: 150 - 450 units                       ║
║  Most Likely (P50): 300 units                          ║
║
╚══════════════════════════════════════════════════════════╝
```

**Features:**
- ✅ Drug selector dropdown
- ✅ Area chart with 3 confidence bands
- ✅ Color-coded forecast lines
- ✅ Interactive legend
- ✅ Smooth animations
- ✅ Tooltip on hover

---

### Tab 4: 🎮 What-If Simulator

```
╔══════════════════════════════════════════════════════════╗
║                  WHAT-IF SIMULATOR                       ║
║                                                           ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ CDSCO Alerts:  4 / 10                   [━━●━━━━]  │ ║
║  │ Simulates regulatory warnings                     │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Supply Delay:  12 / 30 days            [━━━●━━━━] │ ║
║  │ Days postponed for procurement                    │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Demand Multiplier:  1.5x / 2.0x        [━━●━━━━]  │ ║
║  │ How many times normal demand (0.5x - 2.0x)       │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                           ║
║  [Reset Simulation]                                   ║
║                                                           ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ SIMULATION RESULTS                                 │ ║
║  │                                                    │ ║
║  │ Drug: Paracetamol                                 │ ║
║  │ Baseline P50:     300 units                       │ ║
║  │ Simulated P50:    180 units  ↓ -40%              │ ║
║  │                                                    │ ║
║  │ Impact: CRITICAL - Demand surge + supply delay   │ ║
║  │ Recommendation: Increase safety stock now        │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝
```

**Features:**
- ✅ CDSCO alerts slider (0-10)
- ✅ Supply delay slider (0-30 days)
- ✅ Demand multiplier slider (0.5x-2.0x)
- ✅ Real-time simulation results
- ✅ Baseline vs. simulated comparison
- ✅ Reset button

---

### Tab 5: 🧠 Deep Learning Explainability

```
╔══════════════════════════════════════════════════════════╗
║               DEEP LEARNING EXPLAINABILITY              ║
║                                                           ║
║  Select Drug: [Paracetamol ▼]                           ║
║                                                           ║
║      ┌─────────────────────────────┐                    ║
║      │                             │                    ║
║      │    ╱─── Lead Time (28%)    │                    ║
║      │   ╱ ─── CDSCO (22%)         │                    ║
║      │  ╱   Demand Lag (18%)       │                    ║
║      │ ╱     Supplier Risk (20%)   │                    ║
║      │╱       Day of Week (12%)    │                    ║
║      └─────────────────────────────┘                    ║
║                                                           ║
║  Feature Explanations:                                  ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    ║
║                                                           ║
║  📊 Lead Time Variance (28%): Most important signal   ║
║     Long lead times increase shortage risk              ║
║                                                           ║
║  🚨 CDSCO Alerts (22%): Regulatory signals            ║
║     Higher alerts correlate with supply disruptions    ║
║                                                           ║
║  📈 Demand Lag-1 (18%): Yesterday's demand matters    ║
║     Current demand is influenced by previous day       ║
║                                                           ║
║  🏭 Supplier Risk (20%): Network health matters        ║
║     Upstream disruptions cascade downstream            ║
║                                                           ║
║  📅 Day of Week (12%): Temporal patterns exist        ║
║     Weekends show different demand patterns            ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝
```

**Features:**
- ✅ Drug selector dropdown
- ✅ Doughnut chart with feature importance
- ✅ Color-coded feature segments
- ✅ Percentage labels
- ✅ Feature explanations
- ✅ TFT attention weights

---

### Tab 6: 🗺️ Supplier Network Simulator

```
╔══════════════════════════════════════════════════════════╗
║              SUPPLIER NETWORK SIMULATOR                  ║
║                                                           ║
║        Supply Chain Network Visualization               ║
║        (Click nodes to simulate disruption)              ║
║                                                           ║
║       [Supplier A]          [Supplier B]                 ║
║        🟢 Risk: 15%         🟡 Risk: 32%               ║
║           ╲                    ╱                        ║
║            ╲                  ╱                         ║
║      ────────────────────────────                      ║
║     ╱          ╲          ╱          ╲                  ║
║    [Supplier C] [HQ]    [Supplier D]  [Supplier E]    ║
║    🟡 Risk: 28%  ▼      🔴 Risk: 51%  🟢 Risk: 8%    ║
║                         ↑                                ║
║            (Click to toggle offline)                    ║
║                                                           ║
║  Status: All suppliers online ✅                        ║
║  Network Health: 87% (GOOD)                             ║
║  Max Single Point Risk: 51% (Supplier D)                ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝

After clicking a supplier:

╔══════════════════════════════════════════════════════════╗
║              DISRUPTION IMPACT ANALYSIS                  ║
║                                                           ║
║  🚨 WARNING: Supplier D is OFFLINE                       ║
║                                                           ║
║  Cascading Impact:                                       ║
║  • 3 upstream suppliers affected                         ║
║  • 5 drugs at risk of shortage                           ║
║  • Estimated impact: ₹15,20,000                          ║
║                                                           ║
║  Affected Nodes:                                         ║
║  ├─ Supplier D: OFFLINE ❌                              ║
║  ├─ HQ: DEGRADED ⚠️                                     ║
║  ├─ Supplier B: DEGRADED ⚠️                             ║
║  └─ Supplier E: DEGRADED ⚠️                             ║
║                                                           ║
║  Affected Drugs:                                         ║
║  • Paracetamol → 🔴 CRITICAL                            ║
║  • Ibuprofen → 🟡 WARNING                                ║
║  • Aspirin → 🟢 OK                                      ║
║  • Metformin → 🟡 WARNING                                ║
║  • Atorvastatin → 🔴 CRITICAL                           ║
║                                                           ║
║  [Reset Network]                                         ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝
```

**Features:**
- ✅ Network node visualization
- ✅ Click-to-disrupt functionality
- ✅ Offline state tracking
- ✅ Cascading impact display
- ✅ Risk score indicators
- ✅ Impact summary card

---

### Tab 7: 🛒 Purchase Order Ledger

```
╔══════════════════════════════════════════════════════════╗
║              PURCHASE ORDER LEDGER                       ║
║                                                           ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Selected Orders: 3                                 │ ║
║  │ Total Estimated Cost: ₹7,85,500                   │ ║
║  │ [☑] Export to CSV                                 │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                           ║
║  ┌────────────────────────────────────────────────────┐ ║
║  │ Drug       │ Supplier │ Units │ Cost  │ Priority  │ ║
║  ├────────────────────────────────────────────────────┤ ║
║  │ ☑ Paracet  │ S1       │ 500   │ 2.5L  │ 🔴 HIGH  │ ║
║  │ ☑ Ibupro   │ S2       │ 300   │ 1.8L  │ 🔴 HIGH  │ ║
║  │ ☐ Aspirin  │ S3       │ 200   │ 1.2L  │ 🟡 MED   │ ║
║  │ ☑ Metform  │ S1       │ 1000  │ 2.0L  │ 🟡 MED   │ ║
║  │ ☐ Atorvast │ S4       │ 600   │ 3.6L  │ 🟡 MED   │ ║
║  │ ☐ Lisinop  │ S2       │ 400   │ 2.4L  │ 🟢 LOW   │ ║
║  │ ☐ Omepraz  │ S5       │ 800   │ 2.8L  │ 🟢 LOW   │ ║
║  │ ☐ Dolostan │ S1       │ 300   │ 0.9L  │ 🟢 LOW   │ ║
║  │ ☐ Levoflox │ S3       │ 250   │ 2.5L  │ 🟢 LOW   │ ║
║  │ ☐ Atenolol │ S4       │ 350   │ 1.4L  │ 🟢 LOW   │ ║
║  └────────────────────────────────────────────────────┘ ║
║                                                           ║
║  Selected 3 orders ready for export and procurement   ║
║                                                           ║
╚══════════════════════════════════════════════════════════╝
```

**Features:**
- ✅ AI-recommended orders table
- ✅ Checkbox selection per row
- ✅ Select all functionality
- ✅ Cost calculation & totals
- ✅ Priority-based styling
- ✅ Export to CSV button

---

## 🌙 Dark/Light Mode

### Dark Mode (Default)
```
Dark blue/purple background
Light text on dark
Glassmorphism with dark blur
Status badges clearly visible
Animations smooth and visible
```

### Light Mode
```
White/light gray background
Dark text on light
Glassmorphism with light blur
Status badges clearly visible
Animations smooth and visible
```

**Toggle**: Sun/Moon icon in navbar (top right)
**Persistence**: Saved in localStorage

---

## 🎬 Emergency Demo Mode

**When Backend is Offline:**

- All 7 feature tabs continue to work
- 8 realistic mock drugs with data
- Complete forecast, simulation, and network data
- Visual "Demo Mode" indicator in navbar
- All interactions fully functional
- Can manually toggle with "Demo" button

**Demo Data Includes:**
- 8 drugs with varying risk levels
- 10-day historical + 30-day forecast
- 5 suppliers in network
- 5 AI-recommended purchase orders
- Feature importance weights

---

## 🎨 Design Features

### Glassmorphism Cards
```css
Background: rgba(255, 255, 255, 0.05)
Backdrop blur: 10px
Border: 1px solid rgba(255, 255, 255, 0.1)
Rounded: 12px
Transition: 300ms smooth
```

### Status Colors
```
🟢 GREEN   #00e5a0  (Good / OK)
🟡 AMBER   #ffb800  (Warning / Caution)
🔴 RED     #ff3b5c  (Critical / Alert)
🔵 BLUE    #00c2ff  (Primary / Info)
```

### Animations
- **Staggered Lists**: Rows animate in sequence (100ms stagger)
- **Number Counters**: KPI values count up (1s duration)
- **Page Transitions**: Fade in/out (300ms)
- **Hover Effects**: Subtle scale & glow
- **Background Orbs**: Slow floating animation

---

## 📱 Responsive Design

### Mobile (< 768px)
- Stacked layouts
- Touch-friendly buttons
- Scrollable tables
- Readable typography
- Collapsible sections

### Tablet (768px - 1024px)
- Two-column grids
- Optimized spacing
- Accessible touch targets
- Readable text

### Desktop (> 1024px)
- Full-width layouts
- Multi-column grids
- Optimal spacing
- All animations

---

## ✅ Summary

**7 Interactive Feature Tabs:**
1. 🔌 Command Center - CSV upload + drug table
2. 💰 Financial Risk - KPI metrics
3. 🔮 Crystal Ball - Probabilistic forecasts
4. 🎮 What-If - Simulation scenarios
5. 🧠 Explainability - Feature importance
6. 🗺️ Supplier Map - Network visualization
7. 🛒 Purchase Orders - Order management

**Additional Features:**
- 🎨 Dark/light mode toggle
- 🎬 Emergency demo mode
- 📤 CSV drag-and-drop upload (PRIMARY)
- 🎭 Smooth animations throughout
- 📱 Fully responsive design
- 🔄 Real-time health checks
- 🚨 Error handling & fallbacks

---

**All features production-ready and fully integrated with backend!** 🚀

