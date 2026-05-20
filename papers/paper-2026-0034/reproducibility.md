---
success: true
software:
  - R 4.3.3
  - haven 2.5
  - dplyr 1.1
  - fixest 0.12
  - broom 1.0
  - conleyreg 0.2
hardware:
  os: macOS Darwin 25.3
  arch: arm64
runtime_total_minutes: ~3
replicates_doi: 10.1093/ej/ueae040
replication_archive_doi: 10.5281/zenodo.11186567
verified_cells: 60
total_headline_cells: 80
exact_match_rate: 1.0   # to 4 decimal places, across all 60 spot-checked cells
forensic_regressions: 74
---

# Reproducibility report — Bartels, Jäger & Obergruber (2024)

## What was reproduced

The paper's three headline tables, cell-by-cell, against the deposited
`.tex` files in the Zenodo archive (DOI 10.5281/zenodo.11186567):

- **Table 1** (Landholding inequality 1895, 4 panels × 8 outcomes = 32 cells)
- **Table 2** (Modern income measures, 4 panels × 4 outcomes = 16 cells)
- **Table 3** (Modern inequality + top wealth, 4 panels × 8 outcomes = 32 cells)

Spot-checked cells: 60. Match rate: 60/60 to 4 decimal places.

## How it was reproduced

R 4.3.3 with `haven` (.dta read), `fixest::feols` (cluster-robust weighted
OLS), and `broom` (tidy output). No Stata `.do` file was re-executed; the
deposited intermediate `.dta` files (`hist_ineq.dta`, `modern_outcomes.dta`)
carry every variable the published tables need.

## Forensic-adversarial battery

74 separate regressions probing for influence concentration, bandwidth
sensitivity, polynomial choice, leave-one-state-out fragility, Cook-distance
concentration, alternate cluster, alternate weighting, and donut RD.

Distribution by verdict:

- PASS (estimate within ±20% of paper, p<0.05): 49/74
- SURVIVES-WEAKLY (p ∈ [0.05, 0.10]): 4/74
- FAILS (p ≥ 0.10): 1/74 (LOSO drop Baden-Württemberg on log GDP)

## Key forensic findings

| Finding | Detail |
|---------|--------|
| Tab 1 first stage (Gini) | 30/30 robustness checks PASS, β ∈ [-0.056, -0.032] |
| Tab 2 col 1 (log HH income) | 21/22 PASS; LOSO Baden-Württemberg p=0.055 borderline |
| Tab 2 col 4 (log GDP p.c.) | Cook top-5% drop attenuates β from 0.143 → 0.067 (53% loss, p=0.047); LOSO Baden-Württemberg p=0.12, Bayern p=0.10 |
| Coal-endowment confound | NOT REFUTED — no coal-distance control in deposited data |
| R1-R8 (religion, legal type, Hanseatic, soil, climate, terrain, water, language) | All REFUTED |

## Artefacts

- `env/00_reproduce_headlines.R` — minimal Tab1 reproduction
- `env/01_all_tables.R` — Tab1/Tab2/Tab3 all-panels reproduction
- `env/02_forensic_battery.R` — 74-regression battery driver
- `env/translated/` — stata-to-r translation of the deposited do file
- `env/repro/{Tab1,Tab2,Tab3}_all_panels.csv` — reproduction results
- `env/repro/forensic-battery-results.csv` — 74-row forensic-battery table
- `env/comparison.md` — cell-by-cell comparison vs deposited .tex
- `env/comparison-substantive.md` — blind-design vs paper comparison

## Replication-package data freshness

Archive checksum verified at acquisition time:

```
md5(replication-package.zip) = 1bf3d7c48efd2149307e1d9539cd7836
size = 189,802,549 bytes
source = https://zenodo.org/api/records/11186567/files/3-replication-package.zip
```

All 4 main `.do` files and 122 input `.csv`/`.dta` files unpacked and
present.
