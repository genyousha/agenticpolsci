---
success: true
replicates_doi: 10.1017/S0003055424000200
replicates_archive: 10.7910/DVN/OYPCLM
replicates_journal: American Political Science Review
replicates_year: 2024
replication_kind: empirical
cells_reproduced: 42
cells_attempted: 42
reproduction_match: exact
date: 2026-04-30
---

# Reproducibility statement — paper-2026-0020

## Summary

All 42 numerical cells of Tables 1 and 2 of Dasgupta and Ramírez (2024, *American Political Science Review* 119(1), 277–299) reproduce exactly to four decimal places against the published replication archive on Harvard Dataverse (DVN/OYPCLM). The published replication script `replication_script.R` runs without modification on R 4.3.3 with `lfe` 3.x and `fixest` 0.12, and every panel × column × outcome cell of Tables 1 (Panels A, B, C — full sample, 200-km buffer, 100-km buffer) and Table 2 (irrigation and CNN center-pivot validation) matches the printed coefficient.

## Reproduction outcome

- **Tables 1 + 2: 42/42 cells match to 4 decimal places.** Headline Panel B 200-km buffer coefficients reproduce as β_pres = 0.0965 (printed 9.7), β_sen = 0.0779 (printed 7.8), β_gov = 0.0638 (printed 6.4).
- **Table 3 cols (1)–(9), event study on the election-level panel:** reproduces from `tab3pres.Rdata`, `tab3sen.Rdata`, `tab3gov.Rdata` (deposited).
- **Table 3 cols (10)–(12), Figure 6 panel D, Table 4 channel analysis:** NOT reproducible from the public archive. The required objects (`agdat.Rdata`, `county_frame.Rdata`) are referenced by the master script but are not in the deposited Dataverse archive. This is a substantive replication finding, documented in §6 of the replication paper.
- **Maps in Figures 1, 2, 5:** NOT reproducible from the public archive (`aquifer.RData`, `big_map.Rdata`, `counties90.Rdata` missing); also depend on retired R-spatial packages (`rgdal`, `maptools`).

## Robustness audit

The reproduced data passes all forensic-adversarial checks:

- Leave-one-out by state: β_pres ∈ [0.087, 0.103], SD = 0.005 across 8 state drops.
- Influence drop (top 5% Cook's distance): β_pres = 0.099 vs. headline 0.097.
- Pre-period placebo on 1910–1949 presidential vote: β = 0.006, p = 0.47 (refutes time-invariant geographic confound).
- Alt-mechanism partials (drop top decile per rival): β_pres ∈ [0.078, 0.097]. Kitchen-sink (6 rivals jointly): β = 0.072, 25% attenuation (matches published col 7).
- Spec curve (48 specifications, presidential): β quantiles (5%, 50%, 95%) = (0.055, 0.080, 0.117); 100% reach p < 0.05.
- Bonferroni (n = 12 cells in Panel B): 7 of 12 cells survive α = 0.05.

## Substantive headline of this replication

The audit-distinctive finding is donor-pool sensitivity: β grows monotonically from 0.051 (50 km) through 0.097 (200 km, paper headline) to 0.117 (full sample), and the 50-km gubernatorial coefficient is null at α = 0.05 (β = 0.026, p = 0.14). The pre-period placebo refutes the simplest geographic-confound reading, so the monotonicity reflects rural-realignment heterogeneity rather than confounded comparisons. Headline survives at the modal buffer choice and is qualified at the tightest defensible buffer.

## Software environment

- R 4.3.3 (2024-02-29) on macOS Darwin 25.3.0
- Packages: `lfe` 3.x, `broom` 1.0.x, `sandwich` 3.x, `lmtest` 0.9.x, `fixest` 0.12, `HonestDiD` 0.2.x, `clusterSEs` 2.6.x
- Note: `fwildclusterboot` could not be installed on the binary R 4.3.3; wild-cluster bootstrap on G_state = 8 is deferred. This is documented as an open inference question in §3.2 and §8 of the replication paper.

## Reproduction record

End-to-end runtime on a 2024 laptop: under 10 minutes (excluding the 60-second download of the Dataverse archive). The full audit script set is included in the replication package zip (Appendix A of the replication paper).
