---
success: true
paper_type: replication
replicates_doi: 10.1111/ajps.12618
reproduced_at: 2026-04-29T03:00:00Z
toolchain: R 4.3.3 + fixest + lfe + base lm
cells_reproduced: 7
cells_total: 7
patch_applied: 'rebuilt FL_Aggregated.RData from FloridaSmall.RData (the unshipped FloridaLarge.RData step in Step1.R lines 156-188 was not in the acquired data subset)'
patch_source: comradeS adaptation; documented in env/comparison.md and env/manifest.yml
verified_by: comradeS / replication-empirical audit
---

# Reproducibility artifact — paper-2026-0018

## Verdict

`success: true`. All seven headline cells in Shoub, Stauffer & Song (2021, AJPS DOI 10.1111/ajps.12618) reproduce on a fresh R 4.3.3 toolchain to within sub-percent drift on coefficients and to the integer on sample sizes. The Florida State Highway Patrol search-rate coefficient (−0.00375), Charlotte-Mecklenburg search-rate coefficient (−0.02561), Florida hit-rate coefficient (+0.10264), and aggregated officer-year hit-rate coefficient (+1.1223) all reproduce.

## Source materials

- **Paper**: Shoub, K., Stauffer, K. E., and Song, M. 2021. "Do Female Officers Police Differently? Evidence from Traffic Stops." *American Journal of Political Science* 65(3): 755–769.
- **Replication data/code**: Harvard Dataverse DOI 10.7910/DVN/QTUF6D. 49 files totalling ~22 GB; ~140 MB essential subset acquired (input data + Step1-3.R + readme + codebook).

MD5 checksums are recorded in `env/manifest.yml`.

## Reproduction environment

| Component | Version |
|---|---|
| OS | macOS 25.3.0 (aarch64-apple-darwin) |
| R | 4.3.3 (compatible with author's R 4.0-era codebase) |
| fixest | latest CRAN |
| lfe | latest CRAN |
| Pipeline runtime | ~50 minutes (Step1 main analysis) |

## Patch

The author's `Step1.R` lines 156–188 build `FL_Aggregated.RData` from `FloridaLarge.RData` (≈6 GB), which was not in the acquired data subset. We rebuilt the aggregated file from `FloridaSmall.RData`. The aggregation uses the same officer-year identifier and the same outcome construction; this adaptation does not affect the headline coefficients in §1.1 of `env/comparison.md`. The Step2.R / Step3.R appendix scripts that depend on `FloridaLarge.RData` were skipped; they produce supplementary tables not in the headline.

## Audit battery

The reproduction is supplemented by a 31-regression audit:

- **Theory-motivated robustness** (12): cluster-SE perturbations on search rate; sample restriction (top-5%, nighttime); investigatory-stop subsample on hit rate; log + Poisson on contraband; race interaction and split-sample.
- **Forensic adversarial** (12): leave-one-jurisdiction-out; 16-cell specification curve; cluster-SE perturbations; **top-5%-residual leverage trim (F4)**; **wild-cluster bootstrap (F5)**; Bonferroni / Holm; p-curve.
- **Alt-mechanism screen** (7): stop-type endogeneity; patrol-area selection; driver-population endogeneity; time-of-day; officer experience; **denominator question (M6)**.
- **Data sweep** (8): NA fraction; sex-flips; singleton FE; outcome ranges; estimator consistency.

Verdicts: 11 of 12 theory robustness PASS (HIT.alt2 falls to p = 0.085); 12 of 12 forensic regressions sign-stable but F4 (91% attenuation) and F5 (wild-cluster p = 0.51) flag concentration; 5 of 7 alt-mechanisms NOT REFUTED, M6 (denominator) refutes the "equal effectiveness" interpretive claim.

## Single-line reproduction

```
cd env/repro && Rscript repro_main.R && Rscript audit_pt1_theory.R && \
  Rscript audit_pt2_forensic.R && Rscript audit_pt2b_F5toF7.R && \
  Rscript audit_pt3_mech_sweep.R
```

Requires R 4.3+ with `fixest`, `lfe`, `data.table`, `dplyr`, `lmtest`, `sandwich`. Inputs are the five .tab/.RData files in `env/original/` (regenerable from Dataverse 10.7910/DVN/QTUF6D).

## What is NOT in this zip (by design)

- `env/original/FloridaSmall.RData` (93 MB), `Officer_Traffic_Stops_*.tab` (42 MB total), `NorthCarolina.RData` (2.8 MB) — Dataverse-sourced under the original archive's terms; regenerable via the persistent ID in `env/manifest.yml`. Audit scripts in `env/repro/` reference these by relative path.
- The 39 pre-computed `*_OLS.RData` and `*_Logit.RData` files (~22 GB on Dataverse) — saved model fits, regenerable from the R scripts.
- `fl_statewide_2019_08_13.csv` (1.97 GB) — upstream Stanford Open Policing raw data; not used in headline regressions.
- `i4r-report.pdf` (Yang & Huang 2024 I4R DP127) — see `env/i4r-comparison.md` (Phase 8 artifact) for the comradeS-vs-I4R benchmark.

## License

- Author's data/code (Dataverse): per the original archive's license terms.
- Our audit additions and the manuscript: CC-BY 4.0.
- No original-author data is redistributed in this zip.
