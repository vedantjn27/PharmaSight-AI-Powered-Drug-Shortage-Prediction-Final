"""
Phase 2 Step 1: Baseline Models
Trains LightGBM (classification) and a naive ARIMA baseline for demand forecasting.
Outputs metrics to data/results/baseline_metrics.json
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import (
    classification_report, roc_auc_score, f1_score, accuracy_score
)
import lightgbm as lgb

warnings.filterwarnings('ignore')

BASE_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..')
DATA_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'master_feature_table.csv')
RESULTS_DIR = os.path.join(BASE_DIR, 'data', 'results')


def run_lightgbm_baseline(df: pd.DataFrame) -> dict:
    print("\n--- Training LightGBM Baseline Classifier ---")

    feature_cols = [
        'daily_dispenses', 'daily_cost_volume', 'daily_cdsco_alerts',
        'demand_lag_7d', 'demand_lag_30d', 'demand_rolling_avg_14d',
        'alert_count_last_30d', 'day_of_week', 'month'
    ]
    target_col = 'in_shortage'

    # Encode drug as an integer category feature
    df['drug_enc'] = df['Generic_Drug'].astype('category').cat.codes
    feature_cols.append('drug_enc')

    X = df[feature_cols].values
    y = df[target_col].values

    # Time-Series safe split: 80% train, 20% test (no shuffle)
    split_idx = int(len(df) * 0.8)
    X_train, X_test = X[:split_idx], X[split_idx:]
    y_train, y_test = y[:split_idx], y[split_idx:]

    # Class imbalance weight
    pos_weight = (y_train == 0).sum() / max((y_train == 1).sum(), 1)

    model = lgb.LGBMClassifier(
        n_estimators=300,
        learning_rate=0.05,
        max_depth=6,
        num_leaves=31,
        scale_pos_weight=pos_weight,
        random_state=42,
        verbose=-1
    )
    model.fit(X_train, y_train, eval_set=[(X_test, y_test)])

    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    try:
        auc = roc_auc_score(y_test, y_prob)
    except Exception:
        auc = 0.5

    print(classification_report(y_test, y_pred, zero_division=0))
    print(f"  Accuracy : {acc:.4f}")
    print(f"  F1 Score : {f1:.4f}")
    print(f"  ROC-AUC  : {auc:.4f}")

    # Feature importance
    importances = dict(zip(feature_cols, model.feature_importances_.tolist()))

    return {
        'model': 'LightGBM',
        'accuracy': round(acc, 4),
        'f1_score': round(f1, 4),
        'roc_auc': round(auc, 4),
        'feature_importances': importances
    }


def run_naive_demand_baseline(df: pd.DataFrame) -> dict:
    """
    Naive persistence model for demand forecasting:
    Predicts today's demand = yesterday's demand.
    Baseline to beat with TFT.
    """
    print("\n--- Running Naive Demand Baseline (Persistence Model) ---")

    results = {}
    for drug in df['Generic_Drug'].unique():
        drug_df = df[df['Generic_Drug'] == drug].copy().reset_index(drop=True)
        split_idx = int(len(drug_df) * 0.8)
        test_df = drug_df.iloc[split_idx:].copy()
        test_df['naive_pred'] = test_df['daily_dispenses'].shift(1).fillna(method='bfill')
        mae = (test_df['daily_dispenses'] - test_df['naive_pred']).abs().mean()
        results[drug] = round(float(mae), 4)

    avg_mae = round(float(np.mean(list(results.values()))), 4)
    print(f"  Naive Persistence MAE per drug: {results}")
    print(f"  Average MAE (baseline to beat): {avg_mae}")
    return {
        'model': 'NaivePersistence',
        'avg_mae': avg_mae,
        'per_drug_mae': results
    }


def main():
    os.makedirs(RESULTS_DIR, exist_ok=True)

    print(f"Loading master feature table from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    df['date'] = pd.to_datetime(df['date'])
    df.sort_values(['Generic_Drug', 'date'], inplace=True)
    df.reset_index(drop=True, inplace=True)

    print(f"Dataset: {len(df)} rows | {df['Generic_Drug'].nunique()} drugs")
    print(f"Shortage prevalence: {df['in_shortage'].mean() * 100:.2f}%")

    lgbm_metrics = run_lightgbm_baseline(df)
    naive_metrics = run_naive_demand_baseline(df)

    all_metrics = {
        'baselines': [lgbm_metrics, naive_metrics]
    }

    out_path = os.path.join(RESULTS_DIR, 'baseline_metrics.json')
    with open(out_path, 'w') as f:
        json.dump(all_metrics, f, indent=2)

    print(f"\n✅ Baseline metrics saved to {out_path}")
    print(f"\n📊 Summary:")
    print(f"   LightGBM ROC-AUC : {lgbm_metrics['roc_auc']}")
    print(f"   LightGBM F1      : {lgbm_metrics['f1_score']}")
    print(f"   Naive Demand MAE : {naive_metrics['avg_mae']}")


if __name__ == '__main__':
    main()
