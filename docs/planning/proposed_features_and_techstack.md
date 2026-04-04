# Proposed Features and Tech Stack (Finalized 7-Feature Suite)

Because we are not strictly adhering to a 5-module constraint, we have officially decoupled the architecture into **7 distinct software features**. Psychologically, bringing these features out of hiding and giving them their own dedicated widgets on the dashboard makes the project look like a massive, multi-million dollar enterprise SaaS product rather than a simple school script.

## Proposed Technical Stack
- **Backend Architecture:** `FastAPI` (Python)
  - Lightning-fast asynchronous web server capable of actively pre-loading the heavy mathematical PyTorch and PyG embeddings directly into your laptop's `.venv` RAM.
- **Frontend Architecture:** Pure HTML & Vanilla JavaScript 
  - Avoiding heavy Node.js or React.js bloat strictly to ensure the 7-step interactive dashboard rendering runs flawlessly fast natively in the browser.
- **Styling UI/UX:** Vanilla CSS (Glassmorphism Dark Mode)
  - Highly professional interface utilizing dark themes with glowing neon accent alerts to immediately draw the examiners' eyes to critical shortages.
- **Data Visualizations:** `Chart.js` & `Vis.js` (or similar).

---

## The 7 Core Features of PharmaSight

### 1. The Command Center (Real-Time Drug Triage Table)
- A central ledger that instantly parses the raw data stream and sorts the entire catalogue by "Impending Shortage Risk." It uses traffic light logic (Green/Amber/Red) to aggressively prioritize what the examiner should look at first.

### 2. The Financial Risk Calculator (Widget)
- A standalone, massive red "KPI" widget at the top of the screen. Instead of just showing units missing, it cross-references the predicted deficit with `daily_cost_volume` to calculate the exact **Projected Dollars Lost** to the hospital if action isn't taken.

### 3. The "Crystal Ball" Forecaster (Temporal Chart)
- A massive interactive graph outlining the 30-day temporal runway. It plots the AI's complex **P50 (Expected), P90 (Worst-Case), and P10 (Best-Case)** boundaries allowing the user to visually perceive the AI's 'confidence' level.

### 4. "What-If" Regulatory Simulation Engine
- A dedicated slider panel next to the Forecaster. You can manually drag a slider to "Simulate CDSCO FDA Actions." The backend engine intercepts this, reruns the PyTorch math live, and instantly warps the Crystal Ball graph on screen to simulate the outcome of a sudden quality recall.

### 5. DL Explainability Overlay ("Why did the AI say this?")
- A dedicated Doughnut Chart tracking the neural network's Attention Heads. It tells the user exactly *why* a shortage is predicted (e.g., "45% weighting given to Demand Lag vs 15% to Day of Week"). This solves the classic "Black Box" criticism from professors.

### 6. Supplier Geo-Heatmap & Disruption Simulator
- A visual spatial network mapping the underlying GraphSAGE PyG matrices. The manufacturer nodes pulse red or green based on their mathematically generated Risk Embeddings. 
- You can physically click a manufacturer to shut them "Offline," triggering a visual shockwave of red alerts bleeding across the map into the affected downstream hospitals.

### 7. Generative Purchase Orders & Ledger
- A highly actionable exporting tool. The AI mathematically compares the P90 deficit against safety stock, recommends exactly how many pills need to be ordered today, and allows the user to click **"Export Order to CSV"** to complete the software loop.
