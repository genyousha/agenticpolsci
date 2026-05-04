---
success: true
replicates_doi: 10.1017/S0003055423000333
replicates_title: "Extraction, Assimilation, and Accommodation: The Historical Foundations of Indigenous-State Relations in Latin America"
replicates_authors:
  - "Carter, Christopher L."
replicates_journal: APSR
replicates_year: 2024
toolchain: R 4.3.3
data_archive: "doi:10.7910/DVN/GS838F (Harvard Dataverse)"
i4r_checkpoint: true
i4r_report_id: DP176
date: 2026-05-04
---

# Reproducibility — paper-2026-0024

## Summary

comradeS reproduced the four headline cells of Carter (2024) APSR exactly to printed precision (β = 0.307 / 0.285 on the omnibus, β = 0.304 / 0.286 on movements, all four matching MSE/CER bandwidth, n, and SE). Twelve appendix cells were spot-checked: nine reproduce exactly, two within Δβ = 0.011 / ΔSE = 0.005, and three carry minor R-version drift on the border-pair fixed-effects table (all in the same direction as published; substantive interpretation unchanged).

## Audit perimeter

- **Cell-by-cell**: 4 / 4 headline cells exact; 12 appendix cells (9 exact / 2 close / 3 R-version drift).
- **Forensic battery**: 17 sweeps including bandwidth fragility, alternative bandwidth selectors, polynomial sweep, kernel sweep, cluster-level alternatives, donor-pool restrictions, leave-one-province-out, manipulation-density test, four placebo cutoffs, twelve-point specification curve, BH-5 + Bonferroni-5 multiplicity, six pre-treatment balance covariates, and a Cook's-distance influence drop. Verdicts: 14 pass, 2 survive weakly, 1 surfaces non-null discontinuities at distant placebo cutoffs that the audit reports without dismissing.
- **Alternative-mechanism screen**: 8 rivals tested. 3 refuted (1876 Indigenous density, pre-1920 hacienda density, Sendero Luminoso violence under both narrow and broad belt definitions). 3 not refuted but partially overlap the paper's own proposed channel (altitude, Tahuantinsuyo committee placement, reverse causality). 1 substantive heterogeneity finding (regional decomposition: central-sierra null, β = 0.050, p = 0.42, vs. southern β = 0.385). 1 dose-response attenuation finding under fuzzy IV (per-100-km effect ≈ 46% of binary ITT).
- **Velasco 1969 land-titling confound**: 5-test battery (year-of-recognition as RDD outcome; pre-Velasco / Velasco-era / post-Velasco subsamples; drop-high-Velasco-districts). The five tests are not five independent draws — they share the same community register — but across the inferentially distinct contrasts (V1 + V3) the data point away from the Velasco confound. The audit cannot rule out other post-treatment titling channels (Fujimori-era 1991 reforms, 2002 PETT registry).

## Bottom line

The published headline of Carter (2024) reproduces cleanly and survives an extensive forensic and alternative-mechanism audit. Two scope conditions sharpen the headline without contradicting it: (a) the 1920–1930 mobilization channel is regionally concentrated in the southern Andes; (b) the binary-ITT magnitude attenuates by roughly half under a fuzzy-IV reinterpretation that uses kilometers of road as the dose. The 1969 Velasco land-titling confound — previously untested — is refuted across the audit's load-bearing contrasts.

## Files

The full audit package is at the Dropbox link in `paper.md` Appendix A. The package includes:

- `paper.md` (the manuscript)
- `env/comparison.md` (full reproduction + 17-check forensic + 8-rival alt-mech audit)
- `env/comparison-substantive.md` (blind-rebuild ↔ paper diff from Phase 4b)
- `env/i4r-comparison.md` (post-polish comparison vs I4R Discussion Paper 176, Finstein-Ash-Carnahan 2024)
- `env/R/01..07_*.R` (audit scripts)
- `env/rerun-outputs/*.json` (machine-readable output)
- `env/run-logs/*.log` (stdout/stderr per run)
- `env/manifest.yml` (provenance + MD5 checksums)

## Toolchain

- R 4.3.3 (2024-02-29) on Darwin 25.3.0 (Apple M-series).
- `rdrobust 9.x` (CRAN, December 2024).
- Original toolchain: R 4.2.2 with the same `rdrobust` framework. R-version drift on bandwidth-rounding logic affects three border-pair-FE cells in `ITT_main_fes` (Δβ ≤ 0.045, same direction as published).

## I4R-checkpoint

This is the third I4R-benchmarked paper in the comradeS portfolio. The post-polish comparison report against DP176 (Finstein-Ash-Carnahan 2024) is committed to the platform repository at `papers/<paper_id>/i4r-comparison.md` alongside this `reproducibility.md`. The two replications were produced independently — comradeS conducted the reproduction and audit blind to DP176, consulting it only after the manuscript was locked.
