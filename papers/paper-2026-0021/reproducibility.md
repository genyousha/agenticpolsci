---
success: true
slug: paper-2026-0021
type: replication
replicates_doi: 10.1111/ajps.12721
replicates_title: "Politicians' Private Sector Jobs and Parliamentary Behavior"
replicates_authors: ["Weschle, Simon"]
replicates_journal: American Journal of Political Science
replicates_year: 2024
replication_archive_url: https://doi.org/10.7910/DVN/RKMKXU
toolchain:
  - R 4.3.3
  - lfe 2.9-0
  - fixest 0.12.x
  - did 2.1.2
  - bacondecomp 0.1.1
  - HonestDiD 0.2.x
  - clubSandwich
audit_artifacts:
  - env/comparison.md
  - env/audit/scripts/01_cell_match.R through 06_staggered_did.R
  - env/audit/results/*.rds
  - env/audit/logs/*.log
i4r_checkpoint: true
i4r_report_url: https://i4replication.org/discussion-papers/replication-report-a-comment-on-politicians-private-sector-job-and-parliamentary-behavior/
i4r_report_dp: I4R DP203 (Ganly, Lehner, Nguyen, Sutherland 2024)
i4r_report_pdf_md5: 4be00bf90326c544a3af4ff6e3d58914
i4r_comparison: env/i4r-comparison.md
package_url: https://www.dropbox.com/scl/fi/wwhh6pxttzsxu5w4cpzqi/paper-2026-0021-replication-20260501-1652.zip?rlkey=rmctrios838h2j44rsj5u9aus&dl=1
---

# Reproducibility report — paper-2026-0021

**Verdict on cell-by-cell reproduction**: clean. All nine cells of Table 1
of Weschle (2024) reproduce within rounding from the deposited Dataverse
archive (doi:10.7910/DVN/RKMKXU) on R 4.3.3. The headline cell (m3c,
Conservative log(Q+1)) reproduces to four decimal places: β̂ = 0.4552
(SE 0.0979, N = 2,219), matching the published 0.455 (SE 0.098, N = 2,219).
Outcome means match exactly (pooled log(Q+1) = 2.823, Conservative = 2.293,
Labour = 3.489 in both paper and rerun). Four Supporting Information
tables (A1.1, A2.1, A6, A14) reproduce in cell-by-cell spot checks.

**Toolchain accommodations**: three small swaps from the author's R 4.1.3
to the audit's R 4.3.3:
1. `rgdal` was archived from CRAN in late 2023; SI Figure 2(b) (UK
   constituency-level map) is the only output skipped.
2. `cairo_pdf` substituted for `pdf` in two figure scripts.
3. `didimputation` unavailable for R 4.3.3 on the audit machine;
   Borusyak-Jaravel-Spiess imputation reported as N/A.

Nothing in the headline regression pipeline was altered. The published
code in `1_analysis_main.R` and `2_analysis_appendix.R` runs without
modification on the current R toolchain. No coding bugs, no duplicate
keys, no time-invariant variables varying within MP, no row-explosion
on merges. `lfe::felm` and `fixest::feols` agree on the headline
coefficient to fourteen decimal places.

**Audit summary** (full detail in `env/comparison.md`): The qualitative
direction of the headline (moonlighting Conservative MPs ask more
parliamentary questions) survives every robustness check. The +58%
magnitude is fragile in four specific ways:

1. **Pre-trend Wald F = 8.49 (p = 2.5e-4)** — formal rejection of the
   parallel-trends assumption on the headline event-study. The t−2 lead
   is −0.42 (p = 0.017).
2. **Sun-Abraham aggregate ATT = 0.108 (SE 0.140, p = 0.444)** — a 76%
   reduction relative to the TWFE β̂ = 0.455. The published
   Supporting Information reports a Sun-Abraham aggregate of 0.334;
   the gap is sensitive to anticipation-period and event-time pooling
   conventions inside the estimator.
3. **Never-ministers null** — among the 238 Conservative MPs who never
   held a ministerial role across 1,247 MP-years, β̂ = 0.0040
   (SE 0.0998, p = 0.97). The +60% effect is loaded entirely on the
   972 ever-minister MP-years (β̂ = 0.7043, p < 0.001).
4. **Threshold dose-response inversion** — the £0 placebo (β̂ = 0.549)
   produces a *larger* coefficient than the £1,000 headline (0.455);
   £5,000 and £10,000 cuts shrink to 0.352 and 0.325. The signature is
   selection-into-employment rather than treatment intensity.

Second-order qualifications reported in §4 of the manuscript: the effect
is concentrated in the 2010-2014 coalition parliament; the +58%
magnitude depends on the +1 inside log(Q+1); a lagged-outcome placebo
recovers 68% of the magnitude using a prior-year outcome that cannot
be caused by current-year treatment.

**Replication-package zip**: see `package_url` in the frontmatter; the
zip bundles the manuscript, audit scripts and results, the I4R
discussion paper PDF and a head-to-head comparison report, the
patched runnable scripts, the simulated referee review, and the
distilled craft notes.

success: true
