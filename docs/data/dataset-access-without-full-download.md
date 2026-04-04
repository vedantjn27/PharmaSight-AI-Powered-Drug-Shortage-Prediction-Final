# Using Free Datasets Without Downloading Everything

## Goal
Access and use large public datasets quickly for development and submission without full bulk downloads.

## 1. API-First Incremental Ingestion
Use paginated and date-filtered API calls whenever possible.

For openFDA:
- Query with date filters for recent changes
- Use page/limit offsets
- Store last successful sync timestamp and pull only deltas

Benefits:
- Fast startup
- Small local storage
- Easy daily refresh

## 2. Chunked CSV Processing
For large CSVs (PMBJP or exported files), process in chunks.

Pattern:
- Read with chunk size (e.g., 50k rows)
- Aggregate features per chunk
- Append results to compact parquet outputs

Benefits:
- Avoid memory crashes
- Works on standard laptops

## 3. Column and Date Pruning
Only load columns and date ranges required for current experiments.

Examples:
- Keep only last 12-24 months for forecasting windows
- Select minimal columns for baseline experiments

Benefits:
- Reduces I/O and preprocessing time

## 4. Partitioned Storage
Store processed data as parquet partitioned by year/month or source.

Suggested partitions:
- source=synthea/openfda/pmbjp/cdsco
- year=YYYY
- month=MM

Benefits:
- Read only relevant partitions
- Faster iterative training

## 5. Two-Tier Dataset Strategy
Tier A (development):
- Small, representative sample of drugs and time range

Tier B (final evaluation):
- Expanded subset for final metrics and report

Benefits:
- Fast experimentation
- Controlled runtime near deadline

## 6. Caching for External Calls
Cache API responses locally with TTL.

Implementation notes:
- Save normalized API pages to disk cache
- Reuse unless TTL expired or forced refresh requested

Benefits:
- Stable runs
- Offline-friendly after initial pull

## 7. Practical Dataset Plan for Next Week
1. Start with Synthea medication events subset (instant)
2. Pull openFDA shortage events for the last 2-3 years via API
3. Add PMBJP/CDSCO CSV or scraped tables in small batches
4. Build unified daily feature table from only required fields
5. Freeze a final evaluation subset for reproducibility

## 8. Minimum Data Package for Submission
To ensure repeatable demo and evaluation, keep a small bundled package:
- `data/samples/demo_procurement.csv`
- `data/processed/final_eval_subset.parquet`
- `data/dictionaries/drug_code_map.csv`
- `data/dictionaries/supplier_master.csv`

This allows offline demo without re-downloading anything.

## 9. Compliance and Attribution
- Keep source URLs and retrieval dates in a metadata file
- Record license/usage notes for each source
- Document any synthetic or proxy assumptions explicitly
