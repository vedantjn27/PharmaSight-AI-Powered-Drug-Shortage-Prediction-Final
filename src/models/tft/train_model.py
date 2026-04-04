"""
Phase 2 Step 3: Temporal Fusion Transformer (TFT) – Drug Shortage Prediction
Uses pytorch-forecasting's TFT implementation.
Trains a multi-horizon (1, 7, 14, 30-day) probabilistic forecaster for daily_dispenses
and classifies in_shortage across a 45-day prediction window.
Outputs: data/results/tft_metrics.json + saved model checkpoint.
"""

import os
import json
import warnings
import numpy as np
import pandas as pd
import torch
from pytorch_forecasting import TimeSeriesDataSet, TemporalFusionTransformer
from pytorch_forecasting.data import GroupNormalizer
from pytorch_forecasting.metrics import QuantileLoss
import lightning.pytorch as pl
from lightning.pytorch.callbacks import EarlyStopping, ModelCheckpoint

warnings.filterwarnings('ignore')

BASE_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..')
DATA_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'master_feature_table.csv')
RESULTS_DIR = os.path.join(BASE_DIR, 'data', 'results')
CHECKPOINT_DIR = os.path.join(BASE_DIR, 'data', 'models', 'tft')


def prepare_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Add time_idx (integer time step per group) required by pytorch-forecasting."""
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(['Generic_Drug', 'date']).reset_index(drop=True)

    # Global time_idx (same calendar for all drugs)
    min_date = df['date'].min()
    df['time_idx'] = (df['date'] - min_date).dt.days

    # Ensure correct dtypes
    df['Generic_Drug'] = df['Generic_Drug'].astype(str)
    df['month'] = df['month'].astype(str)
    df['day_of_week'] = df['day_of_week'].astype(str)

    return df


def build_datasets(df: pd.DataFrame, max_encoder_length: int = 60, max_prediction_length: int = 30):
    training_cutoff = df['time_idx'].max() - max_prediction_length

    training = TimeSeriesDataSet(
        df[df['time_idx'] <= training_cutoff],
        time_idx='time_idx',
        target='daily_dispenses',
        group_ids=['Generic_Drug'],
        max_encoder_length=max_encoder_length,
        max_prediction_length=max_prediction_length,
        static_categoricals=['Generic_Drug'],
        time_varying_known_categoricals=['month', 'day_of_week'],
        time_varying_known_reals=['time_idx'],
        time_varying_unknown_reals=[
            'daily_dispenses',
            'daily_cost_volume',
            'daily_cdsco_alerts',
            'demand_lag_7d',
            'demand_lag_30d',
            'demand_rolling_avg_14d',
            'alert_count_last_30d',
        ],
        target_normalizer=GroupNormalizer(groups=['Generic_Drug'], transformation='softplus'),
        add_relative_time_idx=True,
        add_target_scales=True,
        add_encoder_length=True,
    )

    validation = TimeSeriesDataSet.from_dataset(
        training,
        df,
        predict=True,
        stop_randomization=True
    )

    return training, validation


def main():
    os.makedirs(RESULTS_DIR, exist_ok=True)
    os.makedirs(CHECKPOINT_DIR, exist_ok=True)

    print(f"Loading master feature table from {DATA_PATH}...")
    df = pd.read_csv(DATA_PATH)
    df = prepare_dataframe(df)

    print(f"Dataset: {len(df)} rows | Time range: {df['date'].min().date()} → {df['date'].max().date()}")

    MAX_ENCODER = 90
    MAX_PRED = 30

    print("\n--- Building TFT Datasets ---")
    training_ds, validation_ds = build_datasets(df, MAX_ENCODER, MAX_PRED)

    # Batch size tuned for CPU training (use 32 for GPU)
    batch_size = 32
    train_loader = training_ds.to_dataloader(train=True, batch_size=batch_size, num_workers=0)
    val_loader = validation_ds.to_dataloader(train=False, batch_size=batch_size * 2, num_workers=0)

    print(f"  Train batches: {len(train_loader)} | Val batches: {len(val_loader)}")

    print("\n--- Configuring Temporal Fusion Transformer ---")
    tft = TemporalFusionTransformer.from_dataset(
        training_ds,
        learning_rate=3e-3,
        hidden_size=64,           # Increased from 32 for max CPU capacity
        attention_head_size=4,
        dropout=0.1,
        hidden_continuous_size=32,
        loss=QuantileLoss(quantiles=[0.1, 0.5, 0.9]),  # P10/P50/P90 outputs
        log_interval=10,
        reduce_on_plateau_patience=4,
    )
    print(f"  Parameters: {tft.size() / 1e3:.1f}k")

    # Callbacks
    early_stop = EarlyStopping(monitor='val_loss', patience=8, mode='min', verbose=True)
    checkpoint = ModelCheckpoint(
        dirpath=CHECKPOINT_DIR,
        filename='tft_best',
        monitor='val_loss',
        mode='min',
        save_top_k=1
    )

    print("\n--- Training TFT (max 60 epochs, early stopping patience=8) ---")
    trainer = pl.Trainer(
        max_epochs=60,
        accelerator='auto',
        gradient_clip_val=0.1,
        callbacks=[early_stop, checkpoint],
        enable_progress_bar=True,
        logger=False,
    )

    trainer.fit(tft, train_dataloaders=train_loader, val_dataloaders=val_loader)

    # Load best checkpoint & evaluate
    best_model = TemporalFusionTransformer.load_from_checkpoint(checkpoint.best_model_path)
    predictions = best_model.predict(val_loader, return_y=True, mode="prediction", trainer_kwargs=dict(enable_progress_bar=False))

    # MAE on P50 predictions
    pred_median = predictions.output.numpy()  # mode='prediction' returns a 2D tensor of only the median
    actual = predictions.y[0].numpy()
    mae = float(np.abs(pred_median - actual).mean())
    rmse = float(np.sqrt(((pred_median - actual) ** 2).mean()))

    print(f"\n✅ TFT Training Complete")
    print(f"   Best checkpoint : {checkpoint.best_model_path}")
    print(f"   Val MAE  (P50)  : {mae:.4f}")
    print(f"   Val RMSE (P50)  : {rmse:.4f}")

    # Save metrics
    metrics = {
        'model': 'TemporalFusionTransformer',
        'max_encoder_length': MAX_ENCODER,
        'max_prediction_length': MAX_PRED,
        'quantiles': [0.1, 0.5, 0.9],
        'val_mae_p50': round(mae, 4),
        'val_rmse_p50': round(rmse, 4),
        'best_checkpoint': checkpoint.best_model_path
    }

    out_path = os.path.join(RESULTS_DIR, 'tft_metrics.json')
    with open(out_path, 'w') as f:
        json.dump(metrics, f, indent=2)

    print(f"   Metrics saved to: {out_path}")


if __name__ == '__main__':
    main()
