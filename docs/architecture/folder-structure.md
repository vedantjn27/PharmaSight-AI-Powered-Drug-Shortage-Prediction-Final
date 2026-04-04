# PharmaSight Project Folder Structure (Docs-Only Proposal)

## Proposed Structure
```text
PharmaSight/
  docs/
    architecture/
      folder-structure.md
      system-overview.md
    planning/
      implementation-plan.md
      one-week-submission-plan.md
    requirements/
      requirements-checklist.md
    data/
      dataset-access-without-full-download.md

  data/
    raw/
      synthea/
      openfda/
      pmbjp/
      cdsco/
    interim/
    processed/
    features/
    dictionaries/
    samples/

  src/
    ingestion/
    preprocessing/
    features/
    models/
      baselines/
      tft/
      graph/
      calibration/
    evaluation/
    serving/
    utils/

  frontend/
    src/

  tests/
    unit/
    integration/

  scripts/
```

## Why this layout
- Separates documentation, data lifecycle, model code, and app layers
- Supports rapid iteration and clear viva explanation
- Keeps risk module isolated so proxy-to-graph upgrades remain clean

## One-week priority implementation order
1. `docs/` complete and frozen first
2. `data/` ingestion and processed subset creation
3. `src/models/tft` and `src/models/baselines`
4. `src/serving` minimal API endpoints
5. `frontend` minimal dashboard screens

## Notes
- This document defines structure only; it does not enforce tooling.
- Keep naming stable to avoid report and demo drift.
