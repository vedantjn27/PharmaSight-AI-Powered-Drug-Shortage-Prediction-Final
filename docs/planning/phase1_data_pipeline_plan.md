# Phase 1: Data Ingestion & Preprocessing Architecture

## Goal
Build a completely automated, daily-grained timeline merging raw CSV procurement data with external datasets (Synthea patients, CDSCO API alerts, OpenFDA) to synthesize a mathematically viable feature table for downstream Deep Learning.

## Completed Implementation Steps

### 1. Ingestion Layer
- **Synthea Mock Data (Patients):** Parsed `medications.csv` to capture random regional patient demand spikes. Shifted static 2011-2015 data artificially forward by +4 years to align perfectly with the modern 2019-2024 modeling spine.
- **OpenFDA Shortages:** Implemented a targeted API pull (`shortages.json`) to extract verified national drug outages spanning from Jan 2021 onwards. Configured the script to specifically filter for the 10 target critical drugs and format the nested JSON outputs.
- **CDSCO Alerts (Proxy NSQ):** Bootstrapped simulated Non-Standard Quality (NSQ) Alert data capturing mock Indian pharmaceutical manufacturing alerts to test our automated cleaning pipeline.

### 2. Preprocessing & Unification Layer
- **Handling Sparsity:** Because a finite cohort of 10,000 Synthea patients generates extremely sparse (intermittent) drug demand vectors, we structurally eliminated massive 0-matrices (87% 0-padding) by artificially injecting a "Poisson-distributed base hospital load". This mathematically anchored the data, raising the floor so the AI could detect patterns rather than staring at zeros.
- **Temporal Alignment:** Designed a strictly localized Pandas alignment forcing all timelines onto a unified daily format. Handled missing days via forward-fills and specific median imputations.
- **Covariate Injection:** Appended cyclic categorical columns (`month`, `day_of_week`) that the Temporal Fusion Transformer will require for multi-horizon decoding.
- **Feature Engineering Windows:** Generated rolling metrics (`demand_rolling_avg_14d`, `demand_lag_7d`, `alert_count_last_30d`) so the AI algorithms wouldn't have to learn time correlations from scratch.

## Final Output Structure
Generated `data/processed/master_feature_table.csv`, a highly dense, temporally continuous, feature-engineered matrix specifically molded for `pytorch-forecasting`. Length: 18,270 rows (10 Drugs x ~1827 Days).
