# CDSCO Public Alerts: Data Extraction & Cleaning Methodology

To train the Temporal Fusion Transformer (TFT) with regional supply-chain risk features, we ingest public "Not of Standard Quality" (NSQ) and Spurious drug alerts from India's Central Drugs Standard Control Organisation (CDSCO). 

Since this raw data is often published as unformatted HTML tables or monthly PDF releases, representing it in a machine-readable time-series required an explicit ETL (Extract, Transform, Load) and cleaning pipeline.

## 1. Extraction Assumptions
For this project, the raw data represents a programmatic scrape (via BeautifulSoup/Tabula-Py) of monthly CDSCO NSQ records from 2021 to 2024. The scrape directly outputs a CSV, but it is heavily unstructured and contains noise.

## 2. Injected Noise (The Raw State)
The `data/raw/cdsco/cdsco_alerts_messy.csv` dataset typically exhibits the following real-world flaws:
- **Inconsistent Dates:** Mixture of `%Y-%m-%d`, `%d/%m/%Y`, and `%d-%b-%y` formats, along with null values resulting from optical character recognition (OCR) misses.
- **Inconsistent String Casing:** Drug names frequently alternate between ALL CAPS, lowercase, and Title Case.
- **Trailing Whitespaces/Newlines:** Extracted HTML `<td>` inner text often contains unexpected whitespace or `\n` characters padding the failure reason.
- **Non-Standard Severity Scoring:** Categorical scores contain arbitrary integer fallbacks (e.g., `'1'` instead of `'Low'`) or mixed abbreviations (`'MED'`).
- **Missing Keys:** Scraped Manufacturer IDs are occasionally completely blank.

## 3. The Cleaning Pipeline Steps
We solve these issues sequentially using `src/preprocessing/clean_cdsco.py`.

### Step A: Temporal Normalization
- We use Pandas `to_datetime(errors='coerce')` to parse the mixed array of date strings. 
- Any row evaluating to `NaT` (Not a Time) is **dropped**. Accurate timestamps are non-negotiable because the TFT relies entirely on sequence/window rolling logic for shortages.

### Step B: Drug Name Standardization
- Applied `.str.strip().str.title()` to the `Drug_Name_Raw` column.
- This merges duplicate entities (e.g., `PARACETAMOL` and `paracetamol ` both collapse to `Paracetamol`), enabling successful joins against the Synthea synthetic procurement database.

### Step C: Categorical Severity Mapping
- We establish a rigid dictionary mapping logic:
  ```python
  severity_map = {'low': 'Low', '1': 'Low', 'MED': 'Medium', '2': 'Medium', 'High': 'High', 'CRITICAL': 'Critical'}
  ```
- Unmappable or null values are imputed centrally to the mean class (`'Medium'`).

### Step D: Imputing Missing Entities
- Missing supplier identifiers (`Manufacturer_ID`) are assigned to a fallback proxy label (`'SUPP_UNKNOWN'`). We preserve these rows because the occurrence of an alert itself still adds temporal predictive value for that drug, even without knowing the specific culprit.

## 4. Final Output
The pipeline produces `data/interim/cdsco_cleaned.csv`—a clean, chronologically sorted, highly structured feature matrix ready to be merged temporally into our master modeling table.
