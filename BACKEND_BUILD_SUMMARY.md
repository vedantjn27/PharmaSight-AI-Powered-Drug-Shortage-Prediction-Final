# 🛠️ Backend Build Summary

This document provides a technical overview of the PharmaSight AI Engine, detailing the architecture, models, and API interfaces.

---

## 🏗️ Architecture Overview

The backend is built as a high-performance **FastAPI** service designed to serve deep learning predictions in real-time. It operates as a stateless engine where data is primarily driven by user-uploaded procurement trajectories.

### Core Stack
- **Framework**: FastAPI (Asynchronous Python)
- **Server**: Uvicorn
- **ML Engine**: PyTorch Lightning & PyTorch Forecasting
- **Data Processing**: Pandas, NumPy, Scikit-learn
- **Network Analysis**: NetworkX

---

## 🧠 AI Models & Inference

PharmaSight utilizes two primary state-of-the-art architectures:

### 1. Temporal Fusion Transformer (TFT)
- **Purpose**: Multi-horizon probabilistic forecasting.
- **Input**: Historical dispense data, CDSCO alert frequency, cost volume, and temporal features (day of week, month).
- **Output**: Quantile forecasts (P10, P50, P90) for a 30-day horizon.
- **Mechanism**: Utilizes self-attention to identify long-term dependencies and Gated Residual Networks (GRNs) to suppress irrelevant features.

### 2. GraphSAGE (Supplier Network Risk)
- **Purpose**: Modeling cascading disruptions in the pharmaceutical supply chain.
- **Input**: Graph topology of manufacturers, distributors, and hospitals.
- **Logic**: Learns topological embeddings to predict the "disruption potential" of specific nodes in the network.

---

## 🔌 API Endpoints

The backend exposes a RESTful API organized into 7 core functional areas:

| Category | Endpoint | Method | Description |
| :--- | :--- | :--- | :--- |
| **System** | `/health` | `GET` | Service status monitor. |
| **Ingestion** | `/api/v1/upload` | `POST` | Ingests and normalizes procurement CSVs. |
| **Inventory** | `/api/v1/drugs` | `GET` | Returns the drug triage list with risk status. |
| **Forecasting** | `/api/v1/forecast/{drug}` | `GET` | Generates 30-day quantile predictions. |
| **Simulation** | `/api/v1/forecast/simulate` | `POST` | Performs "What-If" injection of alerts/delays. |
| **Explainability** | `/api/v1/explain/{drug}` | `GET` | Returns TFT attention weights & explanations. |
| **Supply Chain** | `/api/v1/network` | `GET` | Returns topology for network visualization. |
| **Procurement** | `/api/v1/purchase_orders` | `GET` | Translates P90 forecasts into PO recommendations. |

---

## ⚖️ Business Logic: Risk Triage

Risk classification is calculated dynamically based on real-time dispensing rates:

- 🔴 **High Risk**: 
  - Days of Supply < 7 days.
  - OR Daily CDSCO Alerts ≥ 3.
- 🟡 **Moderate Risk**:
  - 7 ≤ Days of Supply < 14 days.
  - OR Daily CDSCO Alerts ≥ 1.
  - OR Daily Cost Volume > ₹500 units.
- 🟢 **Low Risk**:
  - Days of Supply ≥ 14 days.
  - No active regulatory alerts.

---

## 📁 Project Structure (Backend)

```text
src/
├── ingestion/       # CSV parsing & normalization logic
├── models/          # TFT and GraphSAGE model definitions
├── preprocessing/   # Feature engineering & scaling
├── serving/
│   └── app.py       # Main API entry point (FastAPI)
├── store/           # Mock/State management
└── utils/           # Helper functions for calculations
```

---

> [!NOTE]
> The backend is designed for deployment in high-availability environments. Model artifacts are loaded into memory during the `lifespan` event to ensure low-latency inference.
