# Phase 2: AI Model Construction & Training Architecture

## Goal
Build, train, and test three separate predictive and evaluative models using modern Neural Network architectures to forecast supply chain disturbances and drug shortages.

## Completed Implementation Steps

### 1. LightGBM Baseline Benchmark
- **Architecture Setup:** Built a standard, simple LightGBM gradient-boosting classifier.
- **Logic:** Served as our mathematical benchmark. Advanced Neural Networks must outperform this standard threshold to prove their complex architecture is actually valuable.

### 2. GraphSAGE Vulnerability Map
- **Architecture Setup:** Built a Graph Neural Network (GNN) using `PyTorch Geometric`.
- **Logic:** Took raw CSV topology representing 90 physical nodes in your supply chain (`Manufacturers`, `Distributors`, `Hospitals`). Mapped financial health and delivery reliability scores into edges.
- **Output:** The GNN mathematically compressed the vulnerabilities of complex distribution lines into structured "Risk Embeddings." These 16-Dimensional risk scores (`risk_score`) quantify a node's downstream reliability. 

### 3. Temporal Fusion Transformer (TFT) Engine
- **Architecture Setup:** Using `pytorch-forecasting`, structured our `master_feature_table` into a `TimeSeriesDataSet` feeding into a multi-head Attention TFT network.
- **Hyperparameter Tuning:** Optimized network capacity up to `hidden_size=64` to maximize local CPU utilization. Configured the context sliding-window to look `90 days` into the past, predicting `30 days` into the future.
- **Probabilistic Forecasting:** Added `QuantileLoss` (10%, 50%, 90% percentiles) so the network produces confidence sweeps (Best-case, Expected, Worst-case demand) rather than fragile singular predictions.
- **Training Constraints:** Capped at 60 epochs manually enforced by an automated `EarlyStopping(patience=8)` monitor scanning for Validation Loss plateaus to structurally block synthetic memorization (Overfitting).

## Final Output Structure
Generated mathematically optimized node weights targeting `data/models/tft/tft_best.ckpt` alongside evaluation logs tracking testing loss bounds metrics.
