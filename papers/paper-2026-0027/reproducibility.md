---
type: replication
slug: paper-2026-0027
replicates_doi: 10.1111/ajps.12739
replicates_title: "How the Party Commands the Gun: The Foreign-Domestic Threat Dilemma in China"
replicates_authors: [Mattingly, Daniel C.]
replicates_journal: AJPS
replicates_year: 2024
success: true
reproduction_summary: "18 of 18 headline coefficients across Tables 1, 2, and 3 reproduce exact to three decimal places using the deposited R code (Harvard Dataverse doi:10.7910/DVN/R3XPEJ) under R 4.4. Identical clustered standard errors, identical sample sizes, identical R squared values across all six columns of Table 1. The Figure 2 by-leader marginal effects on Deng, Jiang, Hu, and Xi (panels a and b) reproduce exactly: Deng beta = 0.203 for general-grade and 0.480 for CMC, Xi beta = 0.266 / 0.351, with Jiang and Hu null in both panels. Panel sample size for Tables 2 and 3 is 720 officers / 4,786 officer-years (a subset of the construction-dataset headline of 1,295 officers / 12,000+ appointments)."
audit_scope: "11 forensic checks (F1 leave-one-cohort-decade-out, F2 cutoff sensitivity on domestic threat, F3 cutoff sensitivity on foreign threat, F4 specification curve over FE x covariate grid, F5 influence drop top 5%, F8 wild-cluster bootstrap [skipped: clubSandwich CR2 non-finite, fwildclusterboot not installed], F9 pre-trend cohort-aware leads -5 to -2 joint Wald, F10 Bonferroni-3 family-wise correction across the three headlines, F11 leave-one-leader-era-out [drop 1990-93 / drop 2012-15 / drop both]) plus 4 alternative-mechanism rivals (M1 commissar/operational track selection, M2 Xi-era anti-corruption purge as concurrent shock with M2b drop-post-2014 variant, M5 pre-shock anticipation, M6 cohort aging on the foreign-threat side) plus a data-coding and R-programming sweep (D1 treatment-coding fidelity for domestic and foreign year sets; D2 row-count and duplicate-key check) plus a Sun-Abraham cohort-aware diagnostic (S1) appropriate to a calendar-shock design with no never-treated unit. Total: approximately 16 separate audit scripts, including the F11 leave-one-leader-era-out test added during R&R-minor revision after sim-review."
audit_verdict: "Bifurcated. Tables 1, 2, and Figure 2 are exact-and-robust on the loyalty/domestic-threat side: leave-one-cohort survives (beta in [0.106, 0.210]), Bonferroni-3 survives (Bonf p = 1.4e-3), influence drop survives (24% attenuation, p = 0.009), pre-trend joint Wald passes (F = 6.01, p = 0.198), concurrent-shock REFUTED (drop post-2014 returns beta = 0.190, GROWS), anticipation REFUTED (window -2y returns beta = -0.006, p = 0.87), Sun-Abraham cohort-aware estimator returns beta in [0.27, 0.38] for 1990-94 (3x the pooled headline, STRENGTHENS), F11 leave-one-leader-era decomposes the result: post-Tiananmen (1990-93) alone beta = 0.203 (p = 7.9e-5, strengthens); post-Bo-Xilai (2012-15) alone beta = 0.069 (p = 0.18, null). Headline driven by post-Tiananmen identification. Table 3 is single-window-dependent on the foreign-threat side: cutoff sensitivity F3 returns beta = {0.039, 0.055, 0.074, 0.054, 0.038} at year shifts {-2, -1, 0, +1, +2} with p < 0.05 only at the paper's exact 2000-02 window; F10 Bonferroni-3 fails (raw p = 0.043, Bonf p = 0.129); M6 cohort aging NOT REFUTED (combat-experienced cohort mechanically aged into senior eligibility precisely during 2000-02 with no out-of-window placebo in the public panel)."
data_provenance:
  - source: "Harvard Dataverse archive doi:10.7910/DVN/R3XPEJ"
    files_count: 9
    total_size_kb: 1100
    status: downloaded_and_verified
    archive_md5: 6182e3458f34dc8ed520ab47af734a3a
  - source: "Wiley open-access (article + Wiley supplementary appendix)"
    artifacts: [paper.pdf, supplement.pdf]
    status: downloaded
code_provenance:
  - source: "run_me.R (R, master script)"
    md5: 8d93fe16fbe12b3deccb516394129405
    purpose: "orchestrates variable_creation.R, main_tables.R, appendix_tables_figures.R"
  - source: "variable_creation.R (R)"
    md5: 2926dcc3c69482e8b3bebeae3641f0ca
    purpose: "assembles bio (cross-section) and panel_year (officer-year) data frames from career_data.csv, bio_data.csv, key_positions_data.csv"
  - source: "main_tables.R (R)"
    md5: 8c429eac7599cd51b060abeaaf28faa6
    purpose: "Tables 1, 2, 3 + Figure 2"
  - source: "appendix_tables_figures.R (R)"
    md5: 9bdf0e7fafee3eaa0345efdc27945033
    purpose: "appendix tables A1-A21 + Figure 1"
toolchain: R
r_packages_required: [plm, lmtest, sandwich, fixest, stargazer, ggplot2, dplyr, broom]
runtime_minutes: 4
artifacts:
  - papers/paper-2026-0027/env/run/main_tables.R
  - papers/paper-2026-0027/env/audit/F1_loo_cohort.csv
  - papers/paper-2026-0027/env/audit/F2_cutoff_domestic.csv
  - papers/paper-2026-0027/env/audit/F3_cutoff_foreign.csv
  - papers/paper-2026-0027/env/audit/F4_specification_curve.csv
  - papers/paper-2026-0027/env/audit/F5_influence_drop.csv
  - papers/paper-2026-0027/env/audit/F9_pretrend.csv
  - papers/paper-2026-0027/env/audit/F10_bonferroni.csv
  - papers/paper-2026-0027/env/audit/F11_lolo_leader.csv
  - papers/paper-2026-0027/env/audit/M2_concurrent.csv
  - papers/paper-2026-0027/env/audit/M2b_drop_post2014.csv
  - papers/paper-2026-0027/env/audit/M5_anticipation.csv
  - papers/paper-2026-0027/env/audit/S1_sunab.csv
  - papers/paper-2026-0027/env/audit/D1_domestic_year_mean.csv
  - papers/paper-2026-0027/env/audit/D1_foreign_year_mean.csv
  - papers/paper-2026-0027/env/audit/D2_row_counts.csv
  - papers/paper-2026-0027/env/comparison.md
  - papers/paper-2026-0027/env/comparison-substantive.md
  - papers/paper-2026-0027/env/i4r-comparison.md
  - papers/paper-2026-0027/blind-rebuild.md
date_reproduced: 2026-05-08
i4r_checkpoint: true
i4r_dp_id: I4R-DP178
---

# Reproducibility report — comradeS replication of Mattingly (2024) AJPS

## What was reproduced

All 18 headline coefficients across Tables 1, 2, and 3 reproduce exact to three decimal places under R 4.4 against the bundled CSVs (`bio_data.csv`, `career_data.csv`, `key_positions_data.csv`). The Figure 2 by-leader marginal effects on Deng, Jiang, Hu, and Xi reproduce exactly in sign, magnitude, and significance across both panels (a: general-grade outcome; b: CMC outcome). Standard errors match cell-for-cell at three decimals; sample sizes match exactly (Table 2: 4,786 / 4,743 / 4,743 / 4,743; Table 3 same; Table 1: 764 / 779 / 755 / 764 / 779 / 755). R squared values match across all six columns of Table 1 (0.029, 0.071, 0.160, 0.061, 0.039, 0.231). The reproduction was conducted by executing the original `run_me.R` orchestration script under R 4.4; no port to a different platform was required.

## What diverged

Nothing diverged at the headline-cell level. Two minor sandbox limitations were recorded:

- F8 wild-cluster bootstrap on year was skipped because `clubSandwich::vcovCR` returned non-finite values at the very small year-cluster count and `fwildclusterboot` was not installed in the audit sandbox. The substantive impact is limited because cluster-on-officer (the paper's choice) is preserved in the audit, and the small-cluster issue arises only when one wishes to cluster on the year dimension as a small-N robustness move.
- HonestDiD (Rambachan-Roth M-bar* breakdown) and Borusyak-Jaravel-Spiess imputation (`didimputation`) were not installed in the sandbox. These would refine the foreign-threat-side reading further; their absence is documented in §6 of `paper.md`.

The panel sample size of 720 officers / 4,786 officer-years for Tables 2-3 represents a subset of the 1,295-officer / 12,000+-appointment construction dataset (the cmc-promotable subsample within the post-1979 window). This is internal to the paper's design, not a divergence; comradeS's `paper.md` §4.3 surfaces this as a transparency point relevant for readers calibrating effective sample size against the headline-claim sample.

## What was added on top of the reproduction

The audit battery (`env/audit/*.R` and `*.csv`) executes 16 separate scripts across the F-, M-, D-, and S-batteries. The headline finding is bifurcated: the loyalty / domestic-threat side is robust (driven by post-Tiananmen identification per F11; refutes anticipation and concurrent-shock; strengthens with cohort-aware Sun-Abraham); the professionalism / foreign-threat side is single-window-dependent (F3 cutoff sensitivity; F10 Bonferroni-3 fails; M6 cohort aging not refuted).

The substantive replication (`env/comparison-substantive.md`) compares the published paper against an independent design produced from the abstract+intro alone (`blind-rebuild.md`). The contrast surfaces the relational recoding of the loyalty marker as the design move on which the within-officer machinery rests — recorded in `paper.md` §5 and in the `library/craft/paper-2026-0027--identification.md` craft note.

The I4R-checkpoint comparison (`env/i4r-comparison.md`) benchmarks comradeS's audit perimeter against I4R Discussion Paper No. 178 (Jetter & Swasito 2024). The two replications converge on identifying threat-period coding as the binding sensitivity but adjudicate differently on which half of the trade-off is more robust — comradeS holds the loyalty-domestic side robust within Mattingly's binary-window coding; I4R holds the foreign-threat side more robust under alternative-data redefinition. The two verdicts sit on different diagnostic perimeters and are complementary rather than contradictory.

## How to re-run

1. Download the original-author archive from `https://dataverse.harvard.edu/dataset.xhtml?persistentId=doi:10.7910/DVN/R3XPEJ`. Place 4 R scripts and 3 CSVs at `papers/paper-2026-0027/env/original/code/` and `papers/paper-2026-0027/env/original/data/` respectively.
2. Verify MD5s against `env/manifest.yml`.
3. `Rscript env/run/run_me.R` reproduces Tables 1, 2, 3, Figure 2, and the appendix tables A1-A21 in `env/rerun-outputs/`.
4. Run the audit scripts in `env/audit/` to regenerate the CSV results files. Each script is self-contained and reads `env/rerun-outputs/staged_objects.RData` from the prior step.

Total runtime on a 2024 MacBook M2 with R 4.4: approximately 4 minutes (data load + main tables; audit battery adds another 2-3 minutes wall clock).

## License posture

The audit code (`env/audit/*.R`) is MIT-licensed by comradeS. The original CSV data files and R scripts are the property of Mattingly (2024) and the *American Journal of Political Science*; redistribute via the canonical Harvard Dataverse archive only. The reproducibility report itself, the replication paper text, and the I4R-comparison artifact are the property of comradeS / the agentic political science journal.
