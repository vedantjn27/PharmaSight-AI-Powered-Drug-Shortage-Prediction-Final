import pandas as pd
import numpy as np
import random
import os

def generate_messy_cdsco_alerts(output_path, num_records=500):
    """
    Generates a proxy CDSCO (Not of Standard Quality - NSQ) alert dataset 
    with intentionally injected noise to simulate real-world scraped data.
    This allows the demonstration of a robust data cleaning pipeline.
    """
    np.random.seed(42)
    random.seed(42)
    
    drugs = ['Paracetamol', 'Amoxicillin', 'Pantoprazole', 'Metformin', 'Azithromycin', 
             'Telmisartan', 'Ciprofloxacin', 'Diclofenac', 'Ceftriaxone', 'Ibuprofen']
    
    reasons = ['Dissolution failure', 'Assay failure', 'Particulate matter', 'Discoloration', 'Misbranded']
    states = ['Maharashtra', 'Gujarat', 'Himachal Pradesh', 'Telangana', 'Uttar Pradesh']
    
    dates = pd.date_range(start='2021-01-01', end='2024-01-01', periods=num_records)
    
    data = []
    for _ in range(num_records):
        # Inject Date Noise
        date_val = pd.Timestamp(np.random.choice(dates))
        date_format = random.choice(["%Y-%m-%d", "%d/%m/%Y", "%d-%b-%y", ""])
        date_str = date_val.strftime(date_format) if date_format else np.nan
        
        # Inject Name Noise (Casing and typos)
        drug_name = np.random.choice(drugs)
        if random.random() < 0.15:
            drug_name = drug_name.lower()
        elif random.random() < 0.1:
            drug_name = drug_name.upper()
        
        # Inject Missing Manufacturer IDs
        mfg_id = f"SUPP_{random.randint(100, 150)}" if random.random() > 0.1 else np.nan
        
        # Inject extra whitespace into reason
        reason = np.random.choice(reasons)
        if random.random() < 0.2:
            reason = f"  {reason}  \n"
            
        data.append({
            'Report_Date': date_str,
            'Drug_Name_Raw': drug_name,
            'Batch_No': f"B{random.randint(1000, 9999)}" if random.random() > 0.05 else "UNKNOWN",
            'Manufacturer_ID': mfg_id,
            'Failure_Reason': reason,
            'Testing_State': np.random.choice(states) if random.random() > 0.1 else None,
            'Severity_Score': np.random.choice(['low', 'MED', 'High', 'CRITICAL', '1', '2'], p=[0.2, 0.2, 0.2, 0.2, 0.1, 0.1])
        })
        
    df = pd.DataFrame(data)
    
    # Shuffle slightly so dates aren't perfectly ordered
    df = df.sample(frac=1).reset_index(drop=True)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated MESSY CDSCO proxy alerts at: {output_path}")

if __name__ == "__main__":
    generate_messy_cdsco_alerts('data/raw/cdsco/cdsco_alerts_messy.csv')
