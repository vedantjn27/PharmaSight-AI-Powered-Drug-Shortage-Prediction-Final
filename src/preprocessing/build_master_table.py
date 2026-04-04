import os
import pandas as pd
import numpy as np

def build_master_table():
    print("Starting Unified Master Feature Table Assembly...")
    
    base_dir = os.path.join(os.path.dirname(__file__), '..', '..')
    
    # 1. Define Target Generics & Mapping
    target_drugs = [
        'Paracetamol', 'Amoxicillin', 'Pantoprazole', 'Metformin', 'Azithromycin', 
        'Telmisartan', 'Ciprofloxacin', 'Diclofenac', 'Ceftriaxone', 'Ibuprofen'
    ]
    
    # Dictionary to map Synthea descriptions or OpenFDA terms to our target list
    mapping_dict = {
        'acetaminophen': 'Paracetamol',
        'paracetamol': 'Paracetamol',
        'amoxicillin': 'Amoxicillin',
        'pantoprazole': 'Pantoprazole',
        'metformin': 'Metformin',
        'azithromycin': 'Azithromycin',
        'telmisartan': 'Telmisartan',
        'ciprofloxacin': 'Ciprofloxacin',
        'diclofenac': 'Diclofenac',
        'ceftriaxone': 'Ceftriaxone',
        'ibuprofen': 'Ibuprofen'
    }

    def map_to_generic(desc):
        if pd.isna(desc):
            return None
        desc_lower = str(desc).lower()
        for k, v in mapping_dict.items():
            if k in desc_lower:
                return v
        return None

    # 2. Process Synthea Demands
    synthea_path = os.path.join(base_dir, 'data', 'raw', 'synthea', 'medications.csv')
    print(f"Loading Synthea demands from {synthea_path}...")
    df_synthea = pd.read_csv(synthea_path)
    
    # Ensure START is datetime and shift it forward 4 years to overlap with 2021-2024 CDSCO/FDA data
    df_synthea['date'] = pd.to_datetime(df_synthea['START'], errors='coerce')
    df_synthea.dropna(subset=['date'], inplace=True)
    df_synthea['date'] = df_synthea['date'] + pd.DateOffset(years=4)
    df_synthea['date'] = df_synthea['date'].dt.date
    
    df_synthea['Generic_Drug'] = df_synthea['DESCRIPTION'].apply(map_to_generic)
    df_filtered_syn = df_synthea[df_synthea['Generic_Drug'].notnull()].copy()
    
    # Group by date and drug to get daily volume
    df_demand = df_filtered_syn.groupby(['date', 'Generic_Drug']).agg(
        daily_dispenses=('DISPENSES', 'sum'),
        daily_cost_volume=('TOTALCOST', 'sum')
    ).reset_index()
    
    # Implement Date Pruning (Rule 3): Keep only recent years to match OpenFDA/CDSCO
    # Also provides a perfectly aligned 2019-2024 window for TFT learning.
    min_date = pd.to_datetime('2019-01-01').date()
    max_date = pd.to_datetime('2024-01-01').date()
    
    date_range = pd.date_range(start=min_date, end=max_date, freq='D')
    spine = pd.MultiIndex.from_product([date_range.date, target_drugs], names=['date', 'Generic_Drug']).to_frame(index=False)
    
    df_master = pd.merge(spine, df_demand, on=['date', 'Generic_Drug'], how='left')
    df_master['daily_dispenses'] = df_master['daily_dispenses'].fillna(0)
    
    # Inject Synthetic Regional Base-Load to eliminate sparse zeroes
    # Since 10k patients creates 87% zero-demand days (intermittent demand), 
    # we simulate continuous regional hospital procurement volume using Poisson noise.
    np.random.seed(42)
    base_load = np.random.poisson(lam=12, size=len(df_master))
    df_master['daily_dispenses'] += base_load
    
    df_master['daily_cost_volume'] = df_master['daily_cost_volume'].fillna(0)
    df_master['daily_cost_volume'] += (base_load * 12.50)  # average proxy cost
    
    print(f"Base spine created from {min_date} to {max_date} with {len(df_master)} rows.")

    # 3. Process CDSCO Alerts
    cdsco_path = os.path.join(base_dir, 'data', 'interim', 'cdsco_cleaned.csv')
    if os.path.exists(cdsco_path):
        print(f"Loading CDSCO alerts from {cdsco_path}...")
        df_cdsco = pd.read_csv(cdsco_path)
        df_cdsco['date'] = pd.to_datetime(df_cdsco['Report_Date'], errors='coerce').dt.date
        df_cdsco['Generic_Drug'] = df_cdsco['Drug_Name'].apply(map_to_generic)
        
        df_alerts = df_cdsco[df_cdsco['Generic_Drug'].notnull()].groupby(['date', 'Generic_Drug']).size().reset_index(name='daily_cdsco_alerts')
        df_master = pd.merge(df_master, df_alerts, on=['date', 'Generic_Drug'], how='left')
    else:
        df_master['daily_cdsco_alerts'] = np.nan
        
    df_master['daily_cdsco_alerts'] = df_master['daily_cdsco_alerts'].fillna(0)

    # 4. Process OpenFDA Shortages (The Target Label)
    fda_path = os.path.join(base_dir, 'data', 'raw', 'openfda', 'openfda_shortages.csv')
    df_master['in_shortage'] = 0
    if os.path.exists(fda_path):
        print(f"Loading OpenFDA Shortages from {fda_path}...")
        df_fda = pd.read_csv(fda_path)
        df_fda['Generic_Drug'] = df_fda['generic_name'].apply(map_to_generic)
        df_fda_filtered = df_fda[df_fda['Generic_Drug'].notnull()].copy()
        
        if not df_fda_filtered.empty:
            df_fda_filtered['update_date'] = pd.to_datetime(df_fda_filtered['update_date'], errors='coerce').dt.date
            
            # Simple Logic: A current shortage reported on a date marks the drug as in_shortage 
            # We will project this shortage 30 days forward for demo purposes since we don't have perfect resolution times
            for _, row in df_fda_filtered.iterrows():
                drug = row['Generic_Drug']
                status = row['status']
                start = row['update_date']
                
                if pd.notnull(start) and status in ['Current', 'To Be Discontinued']:
                    end = start + pd.Timedelta(days=30)
                    
                    df_master.loc[
                        (df_master['Generic_Drug'] == drug) & 
                        (df_master['date'] >= start) & 
                        (df_master['date'] <= end),
                        'in_shortage'
                    ] = 1
                    
    # Fallback to prevent ML crashing on 0 targets during Demo
    if df_master['in_shortage'].sum() == 0:
        print("Warning: Real OpenFDA signals fall outside our temporal 2019-2024 spine window! Injecting synthetic proxy shortages for demonstration ML training.")
        import random
        random.seed(42)
        for drug in target_drugs:
            if random.random() > 0.3:
                # Inject a 30-day shortage window randomly across 2022-2023
                rand_start = pd.to_datetime(f'202{random.randint(2,3)}-0{random.randint(1,9)}-15').date()
                df_master.loc[
                    (df_master['Generic_Drug'] == drug) & 
                    (df_master['date'] >= rand_start) & 
                    (df_master['date'] <= rand_start + pd.Timedelta(days=30)),
                    'in_shortage'
                ] = 1

    # 5. Create Time-Series Lags and Rolling Windows
    print("Computing Lags and Rolling Averages...")
    
    # Sort to ensure sequential math is correct
    df_master.sort_values(by=['Generic_Drug', 'date'], inplace=True)
    
    # Helper function to compute grouped features
    df_master['demand_lag_7d'] = df_master.groupby('Generic_Drug')['daily_dispenses'].shift(7)
    df_master['demand_lag_30d'] = df_master.groupby('Generic_Drug')['daily_dispenses'].shift(30)
    
    # Rolling averages over the past 14 days 
    # Use shift(1) so current day's demand isn't leaking into its own prediction average
    df_master['demand_rolling_avg_14d'] = df_master.groupby('Generic_Drug')['daily_dispenses'].transform(
        lambda x: x.shift(1).rolling(window=14, min_periods=1).mean()
    )
    
    # Alerts rolling sum over past 30 days (early warning signal proxy)
    df_master['alert_count_last_30d'] = df_master.groupby('Generic_Drug')['daily_cdsco_alerts'].transform(
        lambda x: x.shift(1).rolling(window=30, min_periods=1).sum()
    )
    
    # Add explicit Temporal Covariates (Crucial for TFT 'Known Future Inputs')
    # This allows the model to learn winter seasonality (e.g. antibiotics spike in Nov-Feb)
    df_master['day_of_week'] = pd.to_datetime(df_master['date']).dt.dayofweek
    df_master['month'] = pd.to_datetime(df_master['date']).dt.month
    
    # Fill NAs introduced by lags/rolling
    df_master.fillna(0, inplace=True)

    # 6. Save the final matrix
    output_dir = os.path.join(base_dir, 'data', 'processed')
    os.makedirs(output_dir, exist_ok=True)
    out_path = os.path.join(output_dir, 'master_feature_table.csv')
    
    df_master.to_csv(out_path, index=False)
    print(f"Master feature table success! Saved {len(df_master)} fine-grained instances to {out_path}.")

if __name__ == "__main__":
    build_master_table()
