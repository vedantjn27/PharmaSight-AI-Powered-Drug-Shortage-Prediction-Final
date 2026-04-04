# PharmaSight Requirements Checklist

## 1. Functional Requirements (Live Demo Setup)
- **Step 1: Upload Procurement CSV:** Pre-sorted display processing ~2 seconds to identify the top-5 critical drugs with traffic lighting (green/amber/red).
- **Step 2: Explore Probabilistic Forecast Fan:** Display active P10/P50/P90 projections. Include a dynamic Service Level Slider (e.g., set to 95%) that instantly recalculates Safety Stock reorder quantities.
- **Step 3: Variable Selection Explainability:** "Explain this forecast" UI button displaying TFT variable importance weights (e.g. Lead time variance 38%).
- **Step 4: Supplier Disruption Simulation:** Graph View illustrating Distributor/Manufacturer disruption cascade. Support toggling nodes offline to view temporal cascade across connected drugs.
- **Step 5: Generate Purchase Orders:** Output a prioritized reorder list and trigger CSV Export capabilities.

## 2. Non-Functional Requirements
- End-to-end inference under 5 seconds for demo dataset.
- Offline-capable demo mode mapping strictly pre-cached CSV inputs without internet queries.
- Reproducible MLflow model runs reflecting proper architecture inputs.

## 3. Data Dictionary Requirements (System Architecture Layers)
### 3.1 Input CSV Layer
- Drug name & NDC code
- Order qty & dates
- Delivery date & lead time
- Dispensing rate per drug/day
- Supplier ID & price/unit
- Historical stockout events
- External: FDA shortage signals

### 3.2 Feature Engineering Layer
- **Static Features:** Drug category, Criticality tier, Supplier ID embed, NDC code embed
- **Known Future:** Festival calendar, Day/month/season, Procurement cycle, Scheduled deliveries
- **Observed Past:** Daily dispense rate, Rolling demand avg, Lead time actuals, ERP stock level

## 4. Modeling Requirements (Model & Graph Layers)
- **Variable Selection Networks:** Learns specific influential inputs per drug.
- **LSTM Encoder & Multi-Head Self-Attention:** Temporal capture and cross-time dependency matching.
- **Quantile Output Heads:** Generates boundaries directly from the TFT architecture without external wrappers.
- **GraphSAGE Propagation:** Supplier Graph layer projecting risk scores (Manufacturer/Distributor node vulnerabilities) directly back into the TFT representation.
- **Conformal Calibration:** Enforces robust probabilistic adherence.

## 5. Deployment and Demo Requirements
- UI Dashboard Output matches architecture mapping (Forecasts, Alerting, Reorders).
- Pre-scripted 5-step live defense script documented inside `docs/step_by_step_instructions.md`.
