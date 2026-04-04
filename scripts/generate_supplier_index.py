import pandas as pd
import numpy as np
import os

def generate_supplier_master(output_path):
    """
    Generates a mock supplier dictionary to map Synthea/OpenFDA drugs
    to hypothetical Indian suppliers for the risk integration module.
    """
    np.random.seed(42)
    
    num_suppliers = 50
    data = []
    
    for i in range(100, 100 + num_suppliers):
        # Assign a random reliability score and typical lead time
        reliability = np.random.beta(a=8, b=2) # Mostly reliable, some trailing off
        lead_time = int(np.random.normal(loc=14, scale=5))
        lead_time = max(3, lead_time) # Minimum 3 days
        
        data.append({
            'manufacturer_proxy_id': f"SUPP_{i}",
            'supplier_name': f"Pharma_Corp_{i}",
            'reliability_score': round(reliability, 3),
            'avg_lead_time_days': lead_time,
            'lead_time_variance': round(np.random.uniform(1.0, 7.0), 2),
            'region': np.random.choice(['North', 'South', 'East', 'West', 'Central']),
            'is_active': np.random.choice([1, 0], p=[0.95, 0.05])
        })
        
    df = pd.DataFrame(data)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Generated Supplier Master Index at: {output_path}")

if __name__ == "__main__":
    generate_supplier_master('data/dictionaries/supplier_master.csv')
