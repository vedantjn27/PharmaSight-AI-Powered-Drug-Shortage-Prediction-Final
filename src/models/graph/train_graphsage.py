"""
Phase 2 Step 2: GraphSAGE Supplier Risk Embedding
Loads the supplier graph (nodes + edges) and trains a 2-layer GraphSAGE
model to produce per-supplier risk embedding vectors.
Outputs: data/processed/graph_embeddings.csv
"""

import os
import json
import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.data import Data
from torch_geometric.nn import SAGEConv

BASE_DIR = os.path.join(os.path.dirname(__file__), '..', '..', '..')
NODES_PATH = os.path.join(BASE_DIR, 'data', 'raw', 'graph', 'graph_nodes.csv')
EDGES_PATH = os.path.join(BASE_DIR, 'data', 'raw', 'graph', 'graph_edges.csv')
OUT_PATH = os.path.join(BASE_DIR, 'data', 'processed', 'graph_embeddings.csv')


class GraphSAGEEncoder(nn.Module):
    def __init__(self, in_channels: int, hidden_channels: int, out_channels: int):
        super().__init__()
        self.conv1 = SAGEConv(in_channels, hidden_channels)
        self.conv2 = SAGEConv(hidden_channels, out_channels)

    def forward(self, x, edge_index):
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = F.dropout(x, p=0.3, training=self.training)
        x = self.conv2(x, edge_index)
        return x


def build_graph_data(nodes_df: pd.DataFrame, edges_df: pd.DataFrame) -> Data:
    """Convert CSV nodes/edges into a PyG Data object."""

    # Node feature: encode node_type as int + risk_score
    type_map = {'manufacturer': 0, 'distributor': 1, 'hospital': 2}
    nodes_df['type_enc'] = nodes_df['node_type'].str.lower().map(type_map).fillna(0)
    
    # Coalesce the available numerical parameters into the node feature vector
    feat_cols = ['financial_health', 'delivery_reliability', 'demand_profile']
    node_features_df = nodes_df[feat_cols].fillna(0.0)
    
    features_array = np.hstack((nodes_df[['type_enc']].values, node_features_df.values))
    node_features = torch.tensor(features_array, dtype=torch.float)

    # Build edge index tensor
    node_id_map = {nid: i for i, nid in enumerate(nodes_df['node_id'])}
    edge_src = edges_df['source'].map(node_id_map).dropna().astype(int).tolist()
    edge_dst = edges_df['target'].map(node_id_map).dropna().astype(int).tolist()

    edge_index = torch.tensor([edge_src, edge_dst], dtype=torch.long)

    return Data(x=node_features, edge_index=edge_index)


def train_graphsage(data: Data, epochs: int = 100) -> nn.Module:
    model = GraphSAGEEncoder(
        in_channels=data.x.shape[1],
        hidden_channels=32,
        out_channels=16
    )
    optimizer = torch.optim.Adam(model.parameters(), lr=0.01, weight_decay=5e-4)

    # Unsupervised: minimize reconstruction loss (link prediction proxy)
    model.train()
    print(f"Training GraphSAGE for {epochs} epochs...")
    for epoch in range(epochs):
        optimizer.zero_grad()
        z = model(data.x, data.edge_index)

        # Positive pair loss: connected nodes should have similar embeddings
        src_z = z[data.edge_index[0]]
        dst_z = z[data.edge_index[1]]
        pos_loss = -F.cosine_similarity(src_z, dst_z).mean()

        # Negative pair loss: random node pairs should differ
        neg_idx = torch.randint(0, z.size(0), data.edge_index[0].shape)
        neg_z = z[neg_idx]
        neg_loss = F.cosine_similarity(src_z, neg_z).clamp(min=0).mean()

        loss = pos_loss + neg_loss
        loss.backward()
        optimizer.step()

        if (epoch + 1) % 25 == 0:
            print(f"  Epoch {epoch+1:3d}/{epochs} | Loss: {loss.item():.4f}")

    return model


def main():
    print("Loading graph topology...")
    nodes_df = pd.read_csv(NODES_PATH)
    edges_df = pd.read_csv(EDGES_PATH)
    
    # Generate unified 'risk_score' (0.0 to 1.0) dynamically for downstream UI
    # We invert 'financial_health' and 'delivery_reliability' so higher values = more risk
    np.random.seed(42)
    base_scores = nodes_df[['financial_health', 'delivery_reliability', 'demand_profile']].fillna(0.5).mean(axis=1)
    nodes_df['risk_score'] = np.clip(1.0 - base_scores + np.random.normal(0, 0.1, len(nodes_df)), 0.1, 0.95)
    
    print(f"  Nodes: {len(nodes_df)} | Edges: {len(edges_df)}")

    data = build_graph_data(nodes_df, edges_df)
    print(f"  PyG Data: x={data.x.shape}, edge_index={data.edge_index.shape}")

    model = train_graphsage(data, epochs=100)

    # Extract embeddings
    model.eval()
    with torch.no_grad():
        embeddings = model(data.x, data.edge_index).numpy()

    # Save embeddings aligned to node_ids
    emb_cols = [f'emb_{i}' for i in range(embeddings.shape[1])]
    emb_df = pd.DataFrame(embeddings, columns=emb_cols)
    emb_df.insert(0, 'node_id', nodes_df['node_id'].values)
    emb_df.insert(1, 'node_type', nodes_df['node_type'].values)
    emb_df.insert(2, 'risk_score', nodes_df['risk_score'].values)

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    emb_df.to_csv(OUT_PATH, index=False)

    print(f"\n✅ Graph embeddings saved to {OUT_PATH}")
    print(f"   Shape: {emb_df.shape} — {embeddings.shape[1]}-dim embedding per node")


if __name__ == '__main__':
    main()
