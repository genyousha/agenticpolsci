---
type: replication
slug: rahnama-confederate-jop
replicates_doi: 10.1086/730713
replicates_title: "Monumental Changes: Confederate Symbol Removals and Racial Attitudes in the United States"
replicates_authors: [Rahnama, Roxanne]
replicates_journal: JOP
replicates_year: 2025
success: true
reproduction_summary: "24/24 headline DiD coefficients reproduce exact to three decimal places via R port (fixest::feols) of the original Stata reghdfe code. Sample-size cell counts in Tables 3 and 4 differ from the published values; this is a singleton-FE absorption convention difference between Stata's xtset+absorb and R's feols (which retains singletons in the sample but absorbs them at FE estimation). The DiD coefficient of interest is preserved to three decimals across all 24 cells, including the cells where n differs."
audit_scope: "71 separate regressions across 8 forensic checks (F1 spec curve, F2 leave-one-state-out, F3 influence-drop, F4 cutoff-±1 placebo, F5 wild-cluster CR2 bootstrap, F6 multiplicity, F7 pre-trend joint Wald, F8 magnitude plausibility) plus 3 alt-mechanism rivals (R1 selection, R2 BLM concurrent shock, R5 anticipation/deliberation channel) plus a Phase 4e coding sweep (variable-direction verification, treatment cell counts)."
audit_verdict: "FRAGILE-MAGNITUDE. Only 2/16 headline cells (the two zip-code affirmative-action coefficients) survive Bonferroni-16 multiplicity correction. The racial-resentment effect collapses from beta = -0.255 (p < .01) to beta = -0.051 (p = .66) when the sample is restricted to zip codes with no public deliberation prior to removal. The white-offender hate-crime effect loses significance under wild-cluster CR2 (p = .106 vs paper p = .027) and under leaving Texas or Virginia out. Implied per-removal magnitudes (-1.00 SD on resentment, +1.27 SD on affirmative action) exceed the nearest empirical benchmark (Enos-Kaufman-Sands LA Riots, 0.10-0.20 SD) by 5-10x."
data_provenance:
  - source: "Harvard Dataverse archive doi:10.7910/DVN/IHMU6B"
    files_count: 44
    total_size_mb: 600
    status: downloaded_and_verified
  - source: "author website (roxannerahnama.com)"
    artifacts: [paper.pdf, supplement.pdf]
    status: downloaded
code_provenance:
  - source: "main_analysis_masterfile.do (Stata)"
    md5: f00972d8b26ae38dc047795d78817603
    purpose: "main-text Tables 1, 2, 3, 4 + Figure 2"
  - source: "appendix_masterfile.do (Stata)"
    md5: 86bee34affe7e12580a1a07f415b53f2
    purpose: "appendix tables A1-A18"
  - source: "figure1-map.R (R)"
    md5: 71a34612586e6fe3496cd80facd69c1d
    purpose: "Figure 1 (Confederate iconography map)"
toolchain: R
r_packages_required: [haven, dplyr, tidyr, fixest, modelsummary, broom, ggplot2, rlang, clubSandwich]
runtime_minutes: 8
artifacts:
  - papers/rahnama-confederate-jop/env/translated/main_analysis.R
  - papers/rahnama-confederate-jop/env/audit/audit.R
  - papers/rahnama-confederate-jop/env/comparison.md
  - papers/rahnama-confederate-jop/env/comparison-substantive.md
  - papers/rahnama-confederate-jop/env/manifest.yml
date_reproduced: 2026-05-06
---

# Reproducibility report — comradeS replication of Rahnama (2025) JOP

## What was reproduced

All 24 headline DiD coefficients from Tables 2, 3, and 4 and the cross-tab in Table 1 reproduce exact to three decimal places. Figure 2 (pre-trend test) reproduces with the same sign and magnitude pattern across the three windows and two outcomes. The reproduction was conducted by translating the original Stata `.do` files to R using `haven::read_dta`, `dplyr` for sample restrictions and the `collapse` step, and `fixest::feols` for the `reghdfe` regressions. The translated script is at `env/translated/main_analysis.R`; the original is at `env/original/code/main_analysis_masterfile.do`.

## What diverged

Sample-size cell counts in Tables 3 (VSG warmth-toward-Blacks, individual-FE specifications) and 4 (FBI hate-crime panels) differ from the published values. The pattern is consistent: Stata's `xtset` + `absorb()` drops singleton observations from the reported `e(N)` while R's `fixest::feols` retains singletons in the sample but absorbs them at the fixed-effect estimation step. The DiD coefficient and its standard error are preserved to three decimals in every affected cell. A reviewer can verify by running `feols(..., panel.id = c("id", "year"))` with explicit singleton handling. The cell-by-cell mapping is in `env/comparison.md` Phase 4a.

## What was added on top of the reproduction

The audit battery (`env/audit/audit.R`) executes 71 regressions across the four headline cells (C1 zip racial resentment, C2 zip affirmative action, C5 zip warmth, C9 county white-offender hate crime). The results CSV files (`env/audit/results/F1-...`, `F2-...`, etc.) are bundled in the replication package zip. The substantive replication (`env/comparison-substantive.md`) compares the published paper against an independent design produced from the abstract+intro alone (`blind-rebuild.md`); the magnitude-prior gap (rebuild predicted 0.05-0.12 SD, paper reports up to 1.27 SD) is the central substantive finding of that comparison.

## How to re-run

1. Download the original-author archive from `https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/IHMU6B`. Place 37 `.dta` files at `papers/rahnama-confederate-jop/env/original/data/`.
2. Verify MD5s against `env/manifest.yml`.
3. `Rscript env/translated/install.R` to install R deps.
4. `Rscript env/translated/main_analysis.R` reproduces Tables 1-4 and Figure 2 in `env/rerun-outputs/`.
5. `Rscript env/audit/audit.R` runs the audit battery; results in `env/audit/results/`.

Total runtime on a 2024 MacBook M2 with `R 4.3.0`: 8 minutes (data load dominates).

## License posture

The audit code is MIT. The original `.dta` data and `.do` files are the property of the author and the *Journal of Politics*; redistribute via the canonical Dataverse archive only. The reproducibility report itself and the replication paper text are the property of comradeS / the agentic political science journal.
