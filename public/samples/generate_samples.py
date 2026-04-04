"""
Generate 10 realistic PharmaSight sample CSVs.
Run from the project root: python public/samples/generate_samples.py
"""
import pandas as pd
import numpy as np
import os
from datetime import date, timedelta

OUT = os.path.join(os.path.dirname(__file__))
os.makedirs(OUT, exist_ok=True)

SCENARIOS = [
    # (filename, drugs, base_qty, dispense_rate, cdsco_pattern, cost_base, supplier, scenario_desc)
    # 1. Critical shortage – antibiotics district hospital
    ("sample_01_critical_shortage.csv", [
        ("Amoxicillin",  120, 25, "spike",  180, "BioPharma India"),
        ("Azithromycin",  80, 18, "high",   210, "SunPharma Ltd"),
        ("Ciprofloxacin", 50, 22, "high",   290, "BioPharma India"),
    ], "Critical shortage - antibiotic stockout scenario"),

    # 2. Stable cardiac drugs
    ("sample_02_stable_cardiac.csv", [
        ("Atorvastatin",  600, 12, "none",  95,  "Cipla Mumbai"),
        ("Metoprolol",    540, 10, "none",  78,  "Dr Reddy Labs"),
        ("Amlodipine",    720, 14, "none",  62,  "Cipla Mumbai"),
        ("Ramipril",      480, 9,  "none",  88,  "Sun Pharma"),
    ], "Stable cardiac formulary - low risk"),

    # 3. Diabetes mid-level risk
    ("sample_03_diabetes_amber.csv", [
        ("Metformin",     300, 28, "low",   55,  "Lupin Pharma"),
        ("Glipizide",     180, 15, "low",   110, "Lupin Pharma"),
        ("Sitagliptin",   90,  8,  "medium", 340, "MSD India"),
        ("Insulin Glargine", 40, 5, "medium", 890, "Novo Nordisk"),
    ], "Diabetes formulary - amber risk due to rising costs"),

    # 4. Rural PHC – extreme shortage, single supplier
    ("sample_04_rural_phc_shortage.csv", [
        ("Paracetamol",    60, 35, "spike",  20,  "Govt Supply Chain"),
        ("ORS Sachets",    40, 42, "spike",  8,   "Govt Supply Chain"),
        ("Chloroquine",    25, 12, "high",   45,  "Govt Supply Chain"),
        ("Iron Folic Acid",30, 20, "medium", 18,  "NRHM Store"),
    ], "Rural PHC - extreme dispense pressure, single supplier"),

    # 5. Oncology specialty drugs - expensive, low volume
    ("sample_05_oncology_expensive.csv", [
        ("Imatinib",      15, 2,  "medium", 8500, "Novartis India"),
        ("Rituximab",      8, 1,  "low",    32000,"Roche India"),
        ("Capecitabine",  20, 3,  "none",   2100, "Roche India"),
        ("Lenalidomide",  10, 1,  "medium", 14000,"Celgene India"),
    ], "Oncology specialty - high cost, low dispense volume"),

    # 6. Respiratory drugs - seasonal spike (winter pattern)
    ("sample_06_respiratory_winter.csv", [
        ("Salbutamol",    250, 30, "low",   85,  "GSK India"),
        ("Budesonide",    180, 22, "low",   210, "AstraZeneca"),
        ("Theophylline",  120, 18, "medium",95,  "GSK India"),
        ("Montelukast",   200, 25, "none",  145, "MSD India"),
    ], "Respiratory - winter demand surge pattern"),

    # 7. Multi-supplier diversified - healthy procurement
    ("sample_07_multi_supplier_healthy.csv", [
        ("Paracetamol",   800, 45, "none",  18,  "Abbott India"),
        ("Ibuprofen",     600, 38, "none",  22,  "Cipla Mumbai"),
        ("Pantoprazole",  700, 35, "none",  35,  "Sun Pharma"),
        ("Cetirizine",    500, 30, "none",  28,  "Dr Reddy Labs"),
        ("Domperidone",   450, 28, "none",  42,  "Lupin Pharma"),
    ], "Multi-supplier healthy stock - benchmark scenario"),

    # 8. Supply disruption - manufacturer recall
    ("sample_08_supply_disruption.csv", [
        ("Ranitidine",    20, 40, "spike",  65,  "RECALLED - Sanofi"),
        ("Metoclopramide",30, 22, "high",   48,  "Pfizer India"),
        ("Ondansetron",   80, 18, "medium", 120, "GSK India"),
    ], "Supply disruption - manufacturer recall scenario"),

    # 9. Pediatric ward - weight-based dosing, low qty
    ("sample_09_pediatric_ward.csv", [
        ("Amoxicillin Syrup",  45, 12, "low",   95,  "Abbott India"),
        ("Azithromycin Syrup", 30,  8, "medium", 130, "Sun Pharma"),
        ("Paracetamol Syrup",  60, 20, "none",   35,  "Cipla Mumbai"),
        ("Cough Syrup DM",     50, 15, "low",    55,  "Lupin Pharma"),
    ], "Pediatric ward - liquid formulations"),

    # 10. Mixed urban hospital - balanced
    ("sample_10_urban_hospital_mixed.csv", [
        ("Metformin",       500, 22, "none",  55,  "Lupin Pharma"),
        ("Atorvastatin",    450, 15, "none",  95,  "Cipla Mumbai"),
        ("Amlodipine",      600, 14, "none",  62,  "Dr Reddy Labs"),
        ("Pantoprazole",    550, 20, "none",  35,  "Sun Pharma"),
        ("Amoxicillin",     200, 30, "low",   80,  "BioPharma India"),
        ("Paracetamol",     700, 50, "none",  18,  "Abbott India"),
    ], "Urban hospital - mixed formulary, balanced risk profile"),
]

CDSCO_PATTERNS = {
    "none":   lambda i: 0,
    "low":    lambda i: int(np.random.choice([0,0,0,0,1], p=[0.7,0.1,0.1,0.05,0.05])),
    "medium": lambda i: int(np.random.choice([0,1,2], p=[0.5,0.35,0.15])),
    "high":   lambda i: int(np.random.choice([1,2,3], p=[0.4,0.4,0.2])),
    "spike":  lambda i: int(np.random.choice([2,3,4,5], p=[0.2,0.3,0.3,0.2])),
}

np.random.seed(42)

for filename, drugs, scenario_desc in [(s[0], s[1], s[2]) for s in SCENARIOS]:
    rows = []
    start = date(2024, 1, 1)
    for drug_name, base_qty, base_disp, cdsco_pat, cost_base, supplier in drugs:
        for day_offset in range(90):  # 90 days of data
            d = start + timedelta(days=day_offset)
            # Simulate realistic day-to-day variation
            dispense = max(1, int(base_disp + np.random.normal(0, base_disp * 0.12)))
            # Stock decreases as dispenses happen, restocked every ~14 days
            restock_day = (day_offset % 14 == 0)
            qty = base_qty if restock_day else max(1, int(base_qty - (day_offset % 14) * base_disp * 0.7))
            cost_vol = round(dispense * cost_base * np.random.uniform(0.95, 1.05), 2)
            cdsco = CDSCO_PATTERNS[cdsco_pat](day_offset)
            in_shortage = 1 if qty < dispense * 7 else 0

            rows.append({
                "date": d.isoformat(),
                "Generic_Drug": drug_name,
                "quantity_available": qty,
                "daily_dispenses": dispense,
                "daily_cost_volume": cost_vol,
                "daily_cdsco_alerts": cdsco,
                "in_shortage": in_shortage,
                "Supplier": supplier,
                "Lead_Time_Days": np.random.choice([5, 7, 10, 14]),
                "demand_lag_7d": round(base_disp * np.random.uniform(0.9, 1.1), 2),
                "demand_lag_30d": round(base_disp * np.random.uniform(0.85, 1.15), 2),
                "demand_rolling_avg_14d": round(base_disp * np.random.uniform(0.92, 1.08), 2),
                "alert_count_last_30d": max(0, cdsco * np.random.randint(1, 8)),
            })

    df = pd.DataFrame(rows)
    out_path = os.path.join(OUT, filename)
    df.to_csv(out_path, index=False)
    print(f"✅ Generated {filename} ({len(df)} rows, {df['Generic_Drug'].nunique()} drugs) - {scenario_desc}")

print("\n✅ All 10 sample CSVs generated in public/samples/")
