// TypeScript interfaces matching the Python Backend API Responses 

export interface DrugRow {
  drug: string;
  category: string;
  current_stock: number;
  reorder_point: number;
  risk_score: number;
  trend: number[];
  status: "Safe" | "Warning" | "Critical";
  latest_demand: number;
  cost_volume: number;
  risk_status: "GREEN" | "AMBER" | "RED";
}

export interface ForecastPoint {
  date: string;
  p10_units: number;
  p50_units: number;
  p90_units: number;
}

export interface SupplierNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: "green" | "amber" | "red";
  risk_score: number;
  downstream_ids: string[];
  impact_value: number;
}

export interface ExplainabilitySegment {
  label: string;
  weight: number;
  explanation: string;
}

export interface PurchaseOrder {
  drug_name: string;
  supplier: string;
  units: number;
  estimated_cost: number;
  priority: "High" | "Medium" | "Low";
}

export interface FinancialRiskSummary {
  revenue_at_risk: number;
  units_in_deficit: number;
  days_to_critical: number;
}
