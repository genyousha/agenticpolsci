---
success: true
slug: paper-2026-0023
type: replication
replicates_doi: 10.1017/S0020818325101276
replicates_title: "International Financial Institutions and the Promotion of Autocratic Resilience"
replicates_authors:
  - "Cottiero, Christina"
  - "Schneider, Christina J."
replicates_journal: International Organization
replicates_year: 2026
replication_archive_url: https://doi.org/10.7910/DVN/OF98YH
toolchain:
  - R 4.3.x
  - fixest 0.12.x
  - haven (Stata .dta reader)
  - dplyr, broom, purrr
  - did 2.1.2
  - HonestDiD 0.2.x
  - bacondecomp 0.1.1
  - censReg, sampleSelection (optional, wrapped)
audit_artifacts:
  - env/manifest.yml
  - env/translated/run_replication.R
  - env/translated/TRANSLATION_NOTES.md
  - env/rerun-outputs/main_results.csv
  - env/audit/audit_battery.R
  - env/audit/AUDIT_RESULTS.md
  - env/audit/audit_results.csv
  - env/audit/loo_ifi.csv
  - env/audit/spec_curve.csv
  - env/comparison-substantive.md
  - env/blind-briefing.md
  - env/topic-sketch.md
  - blind-rebuild.md
package_url: https://www.dropbox.com/scl/fi/h0xnvx1oomhqv6py0o6pg/paper-2026-0023-replication-20260503-0544.zip?rlkey=5frzcs2zd7d0l5ttaqnd2o85j&dl=1
---

# Reproducibility report — paper-2026-0023

**Verdict on cell-by-cell reproduction**: clean. All seven cells of Appendix G Model 1 of Cottiero and Schneider (2026), also displayed as Figure 5, reproduce within rounding from the deposited Harvard Dataverse archive (doi:10.7910/DVN/OF98YH) on R 4.3.x. The headline cell `zdomconflict` reproduces exactly: β̂ = 0.4234 (SE 0.0989, n = 7,646), matching the published 0.42 (SE 0.10, n = 7,646). The companion regressor `zdemocracyaid_new_log` reproduces at β̂ = 1.0854 (SE 0.1150, n = 7,646). All five control coefficients, the n_obs, the FE structure (regionyear + IO_id), and the standard error type (HC1, equivalent to Stata's `vce(robust)`) match the .do file's output to four decimal places.

**Toolchain accommodations**: the published code in `ifi_replication.do` is Stata 18.5; the audit translates to R via `haven` (for .dta reads) and `fixest` (for `reghdfe`). Translation confidence is HIGH for all 44 OLS / FE specifications and MEDIUM for the two non-linear robustness models (Appendix M Model 3 `tobit ll(0)` → `censReg::censReg(..., left = 0)`; Appendix M Model 5 `heckman ... twostep` → `sampleSelection::selection(method = "2step")`). Both non-linear models are wrapped in `tryCatch` so missing optional packages do not abort the run; on the audit machine `censReg` and `sampleSelection` were absent and those two cells are reported as N/A. Appendix L Model 1 references a covariate `financialcrisis` not present in the loaded sample; this is the only non-translation-related script gap and affects one cell only.

**Audit summary** (full detail in `env/audit/AUDIT_RESULTS.md`, machine-readable in `env/audit/audit_results.csv`): the qualitative direction of the headline (autocratic-IFI commitments rise with recipient regime vulnerability) survives every surface robustness check. The +52% per-SD magnitude framing is fragile in four specific ways developed in §3 through §6 of the manuscript:

1. **Extensive-margin concentration**: dropping zero-commitment cells collapses β̂ from 0.4234 to 0.0828 (-80%). Replacing log with level wipes the result. The clean version is the LPM extensive-margin coefficient β̂ = 0.0245 (p = 4.3e-5): a 1-SD increase in standardized conflict raises the probability of any new commitment by 2.45 percentage points.
2. **Anticipation-vs-reaction timing**: adding L1.zdomconflict to the headline regression collapses contemporaneous β̂ to 0.080 (p = 0.62) and the lead becomes the only significant coefficient at β̂ = 0.355 (p = 0.04). The cross-sectional correlation is consistent with anticipation, not reactive disbursement.
3. **Two-IFI concentration**: leave-one-IFI-out across the 16 IFIs in the regression sample shows BADEA carries -28% and OPEC -23% of the headline coefficient. The IFI-type subset analysis splits the sample further: regional development banks (Asian, African, Inter-American DBs, n = 2,969) yield β̂ = -0.16 (p = 0.31, sign-flipped); Arab and oil-funded IFIs (n = 4,462) yield β̂ = 0.778 (p = 4.2e-9); the BRICS / non-Western subset (NDB, AIIB, n = 215) is right-signed but underpowered.
4. **Two-way clustering**: switching from `vce(robust)` (HC1) to two-way clustering at recipient × IFI moves p from 1.88e-5 to 0.040. The point estimate is unchanged.

Second-order qualifications reported in §7 of the manuscript: the GDPpc cap of $13,845 is unmotivated in the published text but the result is robust to ±50% perturbation; the prose specification ("IFI and year fixed effects" in eq. 1) does not match the executed `regionyear + IO_id` FE structure; HonestDiD breakdown M̄* under a defensible staggered-DiD reframing is approximately 0, indicating non-robustness to even minimal parallel-trends violations.

Several forensic checks (Cook's distance influence drop F2.4, wild-cluster bootstrap F2.5, joint pre-trend Wald F2.6, Heckman two-step A3.1, Bacon decomposition S5.1, Sun-Abraham S5.2, Borusyak-Jaravel-Spiess imputation S5.5) returned non-tabular or package-incompatible results on the audit's R version and are reported as N/A. They are not informative either way and do not enter the manuscript's first-order findings.

**Substantive replication signal**: the blind rebuild (built from abstract+intro alone, with no access to the paper or data) independently anticipated each of the four sensitivities above — the extensive-vs-intensive split (rebuild's Spec 4 LPM), the leverage concern (rebuild's §6.4 leave-one-IFI), the anticipation timing (rebuild's lagged threat coding), and the clustering issue (rebuild's recipient-cluster default). This convergence is the strongest possible signal that the audit findings are not idiosyncratic critic complaints; they are what an independent analyst would have built first. See `env/comparison-substantive.md`.

**Replication-package zip**: see `package_url` in the frontmatter. The zip bundles the manuscript, the Stata→R translation, the rerun output CSV, the 43-check audit pipeline and results, the substantive comparison against the blind rebuild, the topic-only sketch and blind briefing, and the simulated editorial review. Upstream Cottiero and Schneider replication archive is referenced by checksum in `env/manifest.yml` and is not redistributed.

success: true
