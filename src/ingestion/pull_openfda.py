import os
import json
import requests
import pandas as pd
from datetime import datetime

def pull_openfda_shortages():
    print("Starting OpenFDA Drug Shortage ingestion...")
    base_url = "https://api.fda.gov/drug/shortages.json"
    limit = 1000
    skip = 0
    all_results = []
    
    while True:
        url = f"{base_url}?limit={limit}&skip={skip}"
        try:
            print(f"Fetching from: {url}")
            response = requests.get(url)
            response.raise_for_status()
            data = response.json()
            
            if 'results' not in data:
                break
                
            results = data['results']
            if not results:
                break
                
            all_results.extend(results)
            print(f"Retrieved {len(results)} records. Total: {len(all_results)}")
            
            # Check if we've reached the end
            if 'meta' in data and 'results' in data['meta']:
                total_available = data['meta']['results']['total']
                if len(all_results) >= total_available:
                    break
            else:
                break
                
            skip += limit
            
        except Exception as e:
            print(f"Error fetching data: {e}")
            break
            
    print(f"Successfully retrieved {len(all_results)} total shortage events.")
    
    # Process the results to extract needed fields: events, reason codes, and impact dates
    processed_data = []
    for item in all_results:
        # brand_name and generic_name might be in openfda dict
        openfda_data = item.get('openfda', {})
        
        brand_name = openfda_data.get('brand_name', [''])[0] if isinstance(openfda_data.get('brand_name'), list) else openfda_data.get('brand_name', '')
        generic_name = openfda_data.get('generic_name', [''])[0] if isinstance(openfda_data.get('generic_name'), list) else openfda_data.get('generic_name', '')
        
        # some properties are at the top level
        if not generic_name:
            generic_name = item.get('generic_name', '')
            
        status = item.get('status', '')
        reason_for_shortage = item.get('reason_for_shortage', '')
        update_date = item.get('update_date', '')
        initial_posting_date = item.get('initial_posting_date', '')
        
        processed_data.append({
            'brand_name': brand_name,
            'generic_name': generic_name,
            'status': status,
            'reason_for_shortage': reason_for_shortage,
            'update_date': update_date,
            'initial_posting_date': initial_posting_date
        })
        
    df = pd.DataFrame(processed_data)
    
    # Output path
    output_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'openfda')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'openfda_shortages.csv')
    df.to_csv(output_file, index=False)
    print(f"Data successfully saved to {output_file}")

if __name__ == "__main__":
    pull_openfda_shortages()
