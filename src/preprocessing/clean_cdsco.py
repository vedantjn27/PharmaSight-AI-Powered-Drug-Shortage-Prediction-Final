import pandas as pd
import numpy as np
import os
import argparse

def clean_cdsco_data(input_path, output_path):
    """
    Cleans raw, unstructured CDSCO scraped alerts.
    Simulates fixing dates, resolving casing, removing nulls, and standardizing categorical columns.
    """
    print(f"Loading raw CDSCO data from {input_path}...")
    df = pd.read_csv(input_path)
    
    initial_count = len(df)
    
    # 1. Handle Dates
    print("Normalizing Date formats...")
    # Convert mixed formats into a standard datetime. Using errors='coerce' to turn invalid/missing into NaT
    df['Report_Date'] = pd.to_datetime(df['Report_Date'], errors='coerce')
    
    # Drop rows without a valid report date since we need it for time-series forecasting
    df.dropna(subset=['Report_Date'], inplace=True)
    
    # 2. Clean Drug Names
    print("Standardizing Drug Names...")
    df['Drug_Name_Clean'] = df['Drug_Name_Raw'].str.strip().str.title()
    
    # 3. Clean and Standardize Severity
    print("Mapping Severity categories...")
    # Map mixed inputs like 'MED', '1' to Standard Categories: Low, Medium, High, Critical
    severity_map = {
        'low': 'Low', '1': 'Low',
        'MED': 'Medium', '2': 'Medium',
        'High': 'High',
        'CRITICAL': 'Critical'
    }
    df['Severity_Clean'] = df['Severity_Score'].str.strip().map(severity_map).fillna('Medium') # Default to Medium if undefined
    
    # 4. Clean Text Columns (strip whitespace/newlines)
    df['Failure_Reason'] = df['Failure_Reason'].str.strip()
    
    # 5. Handle Missing Manufacturer IDs
    print("Imputing missing manufacturer IDs...")
    # For a missing manufacturer, assign a generic proxy 'SUPP_UNKNOWN'
    df['Manufacturer_ID'].fillna('SUPP_UNKNOWN', inplace=True)
    
    # 6. Reorganize Columns & Sort
    df = df[['Report_Date', 'Drug_Name_Clean', 'Batch_No', 'Manufacturer_ID', 'Failure_Reason', 'Severity_Clean', 'Testing_State']]
    df.rename(columns={'Drug_Name_Clean': 'Drug_Name', 'Severity_Clean': 'Severity'}, inplace=True)
    df.sort_values('Report_Date', inplace=True)
    
    final_count = len(df)
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    
    print(f"Cleaning complete. Reduced rows from {initial_count} to {final_count} (Dropped {initial_count - final_count} invalid records).")
    print(f"Cleaned dataset saved to: {output_path}")

if __name__ == "__main__":
    clean_cdsco_data(
        input_path='data/raw/cdsco/cdsco_alerts_messy.csv', 
        output_path='data/interim/cdsco_cleaned.csv'
    )
