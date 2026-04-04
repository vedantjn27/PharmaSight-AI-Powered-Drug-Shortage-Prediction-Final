import pandas as pd
import numpy as np
import os

def generate_supplier_graph(output_dir):
    """
    Generates a mock B2B supply chain graph required to train the GraphSAGE network.
    The real open datasets (OpenFDA, Synthea) only contain flat transactional data,
    so we simulate the Manufacturer -> Distributor -> Hospital topology to build our Graph Layer.
    """
    np.random.seed(42)
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Create Manufacturer Nodes (30)
    manufacturers = pd.DataFrame({
        'node_id': [f"MFG_{i}" for i in range(1, 31)],
        'node_type': 'manufacturer',
        'production_capacity': np.random.randint(50000, 500000, 30),
        'financial_health': np.random.uniform(0.1, 1.0, 30).round(2)
    })
    
    # 2. Create Distributor Nodes (10)
    distributors = pd.DataFrame({
        'node_id': [f"DIST_{i}" for i in range(1, 11)],
        'node_type': 'distributor',
        'delivery_reliability': np.random.beta(a=8, b=2, size=10).round(2),
        'geo_coverage': np.random.choice(['National', 'Regional_North', 'Regional_South', 'Regional_West', 'Regional_East'], 10)
    })
    
    # 3. Create Hospital Nodes (50 from Synthea context)
    hospitals = pd.DataFrame({
        'node_id': [f"HOSP_{i}" for i in range(1, 51)],
        'node_type': 'hospital',
        'demand_profile': np.random.uniform(0.5, 2.5, 50).round(2),
        'criticality_tier': np.random.choice(['High', 'Medium', 'Low'], 50)
    })
    
    # Save Nodes
    nodes_df = pd.concat([manufacturers, distributors, hospitals], ignore_index=True)
    nodes_df.to_csv(os.path.join(output_dir, 'graph_nodes.csv'), index=False)
    
    # 4. Generate Edges (Manufacturer -> Distributor)
    mfg_dist_edges = []
    for dist in distributors['node_id']:
        # Each distributor connects to 3-5 manufacturers
        connected_mfgs = np.random.choice(manufacturers['node_id'], size=np.random.randint(3, 6), replace=False)
        for mfg in connected_mfgs:
            mfg_dist_edges.append({
                'source': mfg,
                'target': dist,
                'edge_type': 'supplies_to',
                'transport_delay_days': np.random.randint(2, 7)
            })
            
    # 5. Generate Edges (Distributor -> Hospital)
    dist_hosp_edges = []
    for hosp in hospitals['node_id']:
        # Each hospital relies on 1-3 distributors
        connected_dists = np.random.choice(distributors['node_id'], size=np.random.randint(1, 4), replace=False)
        for dist in connected_dists:
            dist_hosp_edges.append({
                'source': dist,
                'target': hosp,
                'edge_type': 'delivers_to',
                'transport_delay_days': np.random.randint(1, 4)
            })
            
    # Save Edges
    edges_df = pd.DataFrame(mfg_dist_edges + dist_hosp_edges)
    edges_df.to_csv(os.path.join(output_dir, 'graph_edges.csv'), index=False)
    
    print(f"Generated {len(nodes_df)} nodes and {len(edges_df)} edge connections.")
    print(f"Graph files saved to: {output_dir}")

if __name__ == "__main__":
    generate_supplier_graph('data/raw/graph/')
