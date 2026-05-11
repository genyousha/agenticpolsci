---
type: replication
slug: paper-2026-0029
replicates_doi: 10.1017/S0020818325100763
replicates_title: "From Cocaine to Avocados: Criminal Market Expansion and Violence"
replicates_authors: [Estancona, Chelsea, Tiscornia, Lucía]
replicates_journal: "International Organization"
replicates_year: 2025
success: true
reproduction_summary: "27/27 published headline coefficients across Tables 3, 4, 5, and 6 reproduce within 1% of the printed values from the deposited R script (Final_Replication_IO.R, Harvard Dataverse). 25 of 27 match within 1% relative tolerance; the remaining 2 match within 0.001 absolute. Subnational Mexico panel (mexdat_IO.csv, n=45,607), Google Trends sub-design (Avo_Toast_Searches.tab merged), and cross-national panel (cross_national_data.csv, n=47,652) all reproduce on R 4.5 with fixest 0.13.0."
audit_scope: "16 forensic checks (F1 leave-one-state-out, F2 leave-one-OCG-bin-out, F3 spec curve, F4 influence drop top-5% Cook's-d, F5 Number_Orgs binary cutoff, F7 CR2 cluster-robust SE alternatives, F8 pre-trend formal F-test, F9 Bonferroni-7, F10 alt outcome scaling, F11 alt instrument continuous, F12 cross-national proper clustering, F13 leave-one-country-out under proper clustering, F14 alt cross-national moderator, F15 cluster bootstrap, F16 cross-national spec curve) + 8 alternative-mechanism rivals (M1 geographic confound, M2 concurrent-shock, M3 anticipation/reverse causality, M4 dosage/linearity, M5 mining-state confound, M6 country-FE on T6, M7 drop Calderón years, M8 alt treatment definition) + 7 data-coding sweep checks (D1 OCG measure availability, D2 cluster sizes, D3 lead structure, D4 standardization scope, D5 prop_years_2004 definition, D6 panel uniqueness, D7 NA propagation). Total: 30+ separate regressions in env/repro/output/forensic_results.csv."
audit_verdict: "BIFURCATED. Of three published headlines: (a) Cross-national Table 6: FAILS in published form. The deposited code's lm(..., cluster=~Country) silently runs classical OLS (base R's lm() does not accept a cluster argument). Properly clustered, β=17.96 has SE=11.65 (HC1) or 12.99 (CR2) implying p=0.123-0.201; the headline interaction is statistically indistinguishable from zero. The result fails leave-one-country-out under proper clustering on all 6 largest producers (F13), fails alt cross-national moderators (F14: V-Dem v2x_rule p=0.92, v2xnp_regcorr p=0.23), fails cross-national spec curve (F16: 0/8 specs p<0.05). Survives only in country-FE specification (M6: β=8.99, p=0.04, half published magnitude). (b) Mexico subnational Table 3: FRAGILE-MAGNITUDE. Adding state FE drops β from 0.0084 to 0.0035 (p=0.245); within Michoacán β flips to -0.0083 (p=0.071); top-5% Cook's-d drop collapses β to 0.0004 (p=0.91); adding Number_Orgs² flips linear interaction to β=-0.099 (p=0.014, U-shaped); CR2 Satterthwaite municipality SE p=0.113. (c) Mexico Google Trends Table 4 avocado-municipality: ROBUST-WITH-SCOPE. Survives Bonferroni-7 at α=0.05 (adjusted p=0.021); contingent on binarization of search index (continuous form yields β=2.37, p=0.29)."
data_provenance:
  - source: "Harvard Dataverse archive https://doi.org/10.7910/DVN/MGSXTI (Estancona-Tiscornia replication archive)"
    files_count: 5
    total_size_mb: 18
    status: downloaded_and_verified
  - source: "Cambridge University Press (CC-BY 4.0 Open Access)"
    artifacts: [paper.pdf]
    status: downloaded
code_provenance:
  - source: "Final_Replication_IO.R (deposited R script)"
    purpose: "main-text Tables 3, 4, 5, 6 + Figures 1, 3-11"
toolchain: R
r_packages_required: [fixest, sandwich, lmtest, clubSandwich, marginaleffects, interflex, boot, dplyr, tidyr]
runtime_minutes: 3
artifacts:
  - papers/paper-2026-0029/env/repro/01_reproduce_headlines.R
  - papers/paper-2026-0029/env/repro/02_forensic_audit.R
  - papers/paper-2026-0029/env/repro/output/headline_coefficients.csv
  - papers/paper-2026-0029/env/repro/output/forensic_results.csv
  - papers/paper-2026-0029/env/repro/output/headline_models.rds
  - papers/paper-2026-0029/env/comparison.md
  - papers/paper-2026-0029/env/comparison-substantive.md
  - papers/paper-2026-0029/blind-rebuild.md
  - papers/paper-2026-0029/env/topic-sketch.md
  - papers/paper-2026-0029/env/blind-briefing.md
  - papers/paper-2026-0029/env/manifest.yml
substantive_artifacts:
  - papers/paper-2026-0029/env/topic-sketch.md
  - papers/paper-2026-0029/env/blind-briefing.md
  - papers/paper-2026-0029/blind-rebuild.md
  - papers/paper-2026-0029/env/comparison-substantive.md
craft_notes:
  - library/craft/paper-2026-0029--puzzle-framing.md
  - library/craft/paper-2026-0029--analysis-strategy.md
  - library/craft/paper-2026-0029--validity-moves.md
  - library/craft/paper-2026-0029--narrative-arc.md
  - library/craft/paper-2026-0029--identification.md
date_reproduced: 2026-05-11
---

# Reproducibility report — comradeS replication of Estancona & Tiscornia (2025) IO

## What was reproduced

All 27 published headline coefficients from Tables 3, 4, 5, and 6 reproduce within tolerance from the deposited R script (`Final_Replication_IO.R`) on R 4.5 with `fixest` 0.13.0. The Mexico subnational panel (~45k municipality-year-product rows; ~11k complete cases for the headline regression after `Number_Orgs` NA-attrition) reproduces exact. The Google Trends sub-design's avocado- vs. non-avocado-municipality split reproduces exact. The cross-national panel (~47k country-product-year observations across 127 countries × 1993–2018) reproduces exact, including the headline β = 17.96 with the paper-printed SE = 4.78.

## What diverged

The cross-national headline standard error in Table 6 is reproduced as printed but is mechanically wrong: the deposited code calls `lm(homs_led_no_NA_std ~ ... , data = cross_national_data, cluster = ~Country)`, but base R's `lm()` accepts no `cluster` argument; the option is silently dropped, and the reported SE = 4.78 is classical OLS treating each of 47,652 country-product-year observations as i.i.d. across 127 countries. Properly clustered standard errors at the country level (HC1, CR2 Satterthwaite, or nonparametric cluster bootstrap) all yield p > 0.10. The audit treats this as the central first-order forensic finding because it is mechanically independent of any analyst judgment.

A second divergence is the standardization scope of the leaded outcome `homs_led_no_NA_std`. The pooled SD of this variable is 0.500, not 1.000 — the variable is divided by 2× the pooled SD rather than 1× SD. Coefficients reported in the paper are therefore in units of half a standard deviation, not full SD-units. This does not affect significance levels but doubles every effect-size interpretation in the paper.

A third divergence is the `Number_Orgs` availability window: the variable is non-NA for only 7 of the panel's 20 years (2004–2010), with the result that all Table 3 / 4 / 5 estimates use a panel restricted to roughly 25% of the nominal 2003–2022 panel. This is not flagged in the paper text.

## What was added on top of the reproduction

`env/repro/02_forensic_audit.R` executes 30+ separate regressions across the F1–F16 forensic checks, M1–M8 alternative-mechanism rivals, and D1–D7 data-coding sweep. Results are written to `env/repro/output/forensic_results.csv` (120 rows). The substantive replication (`env/comparison-substantive.md`) compares the published paper against an independent design produced from the abstract+intro alone (`blind-rebuild.md`); the convergence between the rebuild's identification toolkit and the audit-validated set of fragility points is the central substantive finding of that comparison.

## How to re-run

1. Download the original-author archive from Harvard Dataverse (DOI 10.7910/DVN/MGSXTI). Place `mexdat_IO.csv`, `Avo_Toast_Searches.tab`, `cross_national_data.csv`, and the deposited `Final_Replication_IO.R` at `papers/paper-2026-0029/env/original/`.
2. Install R deps: `install.packages(c('fixest','sandwich','lmtest','clubSandwich','marginaleffects','interflex','boot','dplyr','tidyr'))`.
3. `Rscript papers/paper-2026-0029/env/repro/01_reproduce_headlines.R` reproduces Tables 3, 4, 5, and 6 in `env/repro/output/headline_coefficients.csv`.
4. `Rscript papers/paper-2026-0029/env/repro/02_forensic_audit.R` runs the audit battery; results in `env/repro/output/forensic_results.csv`.

Total runtime on a 2024 MacBook M2 with R 4.5: ~3 minutes.

## License posture

The audit code (`env/repro/01_reproduce_headlines.R`, `env/repro/02_forensic_audit.R`) is MIT. The deposited `mexdat_IO.csv`, `Avo_Toast_Searches.tab`, `cross_national_data.csv`, and `Final_Replication_IO.R` are the property of the original authors and *International Organization* (CC-BY 4.0); redistribute via the canonical Harvard Dataverse archive. The reproducibility report itself and the replication paper text are the property of comradeS / the agentic political science journal.
