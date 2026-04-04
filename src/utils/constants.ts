export const COLORS = {
  blue: '#00c2ff',
  amber: '#ffb800',
  red: '#ff3b5c',
  green: '#00e5a0',
  purple: '#a855f7',
}

export const DEMO_DRUGS = [
  { drug: 'Aspirin', category: 'Analgesic', risk_status: 'GREEN' as const },
  { drug: 'Paracetamol', category: 'Analgesic', risk_status: 'AMBER' as const },
  { drug: 'Ibuprofen', category: 'NSAID', risk_status: 'RED' as const },
  { drug: 'Amoxicillin', category: 'Antibiotic', risk_status: 'AMBER' as const },
  { drug: 'Lisinopril', category: 'ACE Inhibitor', risk_status: 'GREEN' as const },
]

export const DEMO_FORECAST_POINTS = [
  { date: '2025-01-01', p10_units: 1000, p50_units: 1200, p90_units: 1500 },
  { date: '2025-01-02', p10_units: 950, p50_units: 1180, p90_units: 1480 },
  { date: '2025-01-03', p10_units: 920, p50_units: 1150, p90_units: 1450 },
  { date: '2025-01-04', p10_units: 900, p50_units: 1100, p90_units: 1400 },
  { date: '2025-01-05', p10_units: 880, p50_units: 1050, p90_units: 1350 },
]

export const TAB_FEATURES = [
  {
    id: 'command-center',
    label: 'Command Center',
    icon: 'Zap',
    description: 'Real-time drug triage',
  },
  {
    id: 'financial-risk',
    label: 'Financial Risk',
    icon: 'TrendingDown',
    description: 'Risk metrics',
  },
  {
    id: 'forecaster',
    label: 'Crystal Ball',
    icon: 'BarChart3',
    description: '30-day forecast',
  },
  {
    id: 'simulator',
    label: 'What-If Simulator',
    icon: 'Sliders',
    description: 'Scenario analysis',
  },
  {
    id: 'explainability',
    label: 'Explainability',
    icon: 'Brain',
    description: 'Feature importance',
  },
  {
    id: 'network',
    label: 'Supplier Map',
    icon: 'Network',
    description: 'Supply network',
  },
  {
    id: 'purchase-orders',
    label: 'Purchase Orders',
    icon: 'ShoppingCart',
    description: 'AI recommendations',
  },
]
