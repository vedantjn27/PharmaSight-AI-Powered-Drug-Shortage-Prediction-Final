# Data Requirements and Ingestion Plan

To satisfy the fast-track 2-day delivery constraint without compromising modeling depth, PharmaSight relies on 4 distinct open data vectors that require absolutely NO credentialing or approvals to use.

## Required Datasets & Retrieval Links

### 1. OpenFDA Drug Shortages
- **Source Method:** API Only (Direct JSON requests). No download required.
- **Link:** `https://api.fda.gov/drug/shortage.json`
- **Action Required:** None. Python scripts in `src/ingestion` will extract paginated shortage events, reason codes, and impact dates to:
  - `data/raw/openfda/`

### 2. Synthea (Synthetic EMR & Procurement Data)
- **Source Method:** Open-source local Java Generator / Instant CSV Download.
- **Link:** `https://github.com/synthetichealth/synthea` OR pre-generated samples at `https://synthea.mitre.org/downloads` (COVID-19 10k patients).
- **Action Required:** Download compiling pre-generated CSVs or run `java -jar synthea-with-dependencies.jar -p 1000`. We need `medications.csv` to mimic local hospital procurement volumes.
  - Drop the resulting `.csv` files into: `data/raw/synthea/`

### 3. India CDSCO Public Drug Alerts (NSQ Data)
- **Source Method:** Publicly accessible web datasets/Kaggle snippet. 
- **Link/Mock Generation:** For instant availability, utilizing a standard "Not of Standard Quality" (NSQ) simulation or direct Github/Kaggle public snapshot of CDSCO monthly statements representing recall/alert markers. We provide a lightweight script `generate_cdsco.py` to rapidly prototype this regional vector without complex data cleaning.
- **Action Required:** Execute `python scripts/generate_cdsco.py`.
  - Destination: `data/raw/cdsco/cdsco_alerts_messy.csv` generated, and subsequently cleaned by `src/preprocessing/clean_cdsco.py` down to `data/interim/cdsco_cleaned.csv`. Read `docs/data/cdsco_cleaning_methodology.md` for evaluating the exact cleaning pipeline.

### 4. Supplier Risk Index
- **Source Method:** Synthetic Simulation Proxy. Since PMBJP manufacturer risk metadata is extremely challenging to aggregate natively in a 2-day run, we logically map specific drug classes to proxy generic suppliers and add deterministic Gaussian distribution variables for delay tendencies.
- **Action Required:** Feature pipeline generates this automatically via `scripts/generate_supplier_index.py`.
  - Destination: `data/dictionaries/supplier_master.csv`

## Critical Rules for Use
**Do Not** commit full `.csv` outputs situated in the `data/` core directories to version control. Proceed to follow `docs/step_by_step_instructions.md` to run the active pipelines.
