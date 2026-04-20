---
success: true
paper_type: replication
replicates_doi: 10.1017/S0003055426101440
reproduced_at: 2026-04-19T15:53:44Z
toolchain: R 4.3.3 + fixest 0.12.1
cells_reproduced: 40
cells_total: 40
patch_applied: 'fixef.rm "infinite_coef" → "perfect" at 29 sites'
patch_source: author README
verified_by: comradeS / replication-empirical audit
---

# Reproducibility artifact — paper-2026-0006

## Verdict

`success: true`. All forty reported `modelsummary` cells across ten tables in Fukumoto (2026, *APSR* DOI `10.1017/S0003055426101440`) reproduce exactly on a fresh R 4.3.3 + `fixest` 0.12.1 environment, to three decimal places on β, to three decimals on SE, and exactly on *N*, after applying a single 29-site `fixef.rm` substitution that the author's README prescribes for `fixest` 0.13+.

## Source materials

- **Paper**: Fukumoto, M. 2026. "The Cornered Mouse: Sanctioned Elites and Authoritarian Realignment in the Japanese Legislature, 1936–1942." *American Political Science Review*, forthcoming. DOI `10.1017/S0003055426101440`.
- **Replication data/code**: Harvard Dataverse DOI `10.7910/DVN/O3VHIX`, CC0 1.0. APSR Data-Editor-verified.

MD5 checksums for every file in the Dataverse package are recorded in `env/manifest.yml`.

## Reproduction environment

| Component | Version |
|---|---|
| OS | macOS 25.3.0 (aarch64-apple-darwin) |
| R | 4.3.3 (author tested 4.4.3) |
| fixest | 0.12.1 (matches author's 0.12.x lineage) |
| knit runtime | ≈ 3 minutes for all 281 chunks |
| knit errors | 0 (after the prescribed patch) |

## Patch

The uploaded `Fukumoto_APSR1.Rmd` ships with `fixef.rm = "infinite_coef"` at 29 sites — not a valid `fixest::feols` argument in either the 0.12.x or 0.13.x series. The author's README instructs the substitution to `"perfect"` for compatibility. We applied it mechanically:

```
sed 's/fixef.rm = "infinite_coef"/fixef.rm = "perfect"/g' Fukumoto_APSR1.Rmd
```

29 substitutions, all on the same argument position. The substitution is invariant on the coefficient and standard-error output.

## Cell-level match

| Table (paper Table / set) | Coefficient | Orig β / SE / *N* | Repro β / SE / *N* |
|---|---|---|---|
| T1 M1 (all sessions, 1-way) | Treatment × Sanctioned | 0.158 / 0.048 / 4,833 | 0.158 / 0.048 / 4,833 |
| T1 M2 (2-way) | Treatment × Sanctioned | 0.158 / 0.055 / 4,833 | 0.158 / 0.055 / 4,833 |
| T1 M3 (restricted) | Treatment × Sanctioned | 0.168 / 0.052 / 3,960 | 0.168 / 0.052 / 3,960 |
| T1 M4 (restricted, twoway) | Treatment × Sanctioned | 0.168 / 0.063 / 3,960 | 0.168 / 0.063 / 3,960 |
| T2 M1 (main-text spec) | Treatment × Sanctioned | 0.159 / 0.048 / 4,648 | 0.159 / 0.048 / 4,648 |
| T2 M2 | Treatment × Sanctioned | 0.159 / 0.055 / 4,648 | 0.159 / 0.055 / 4,648 |
| T2 M3 | Treatment × Sanctioned | 0.169 / 0.052 / 3,779 | 0.169 / 0.052 / 3,779 |
| T2 M4 | Treatment × Sanctioned | 0.169 / 0.063 / 3,779 | 0.169 / 0.063 / 3,779 |
| T3 M1 (common-names) | Treatment × Sanctioned | 0.154 / 0.055 / 3,039 | 0.154 / 0.055 / 3,039 |
| T3 M2 | Treatment × Sanctioned | 0.154 / 0.053 / 3,039 | 0.154 / 0.053 / 3,039 |
| T3 M3 (restricted) | Treatment × Sanctioned | 0.140 / 0.060 / 2,432 | 0.140 / 0.060 / 2,432 |
| T3 M4 | Treatment × Sanctioned | 0.140 / 0.052 / 2,432 | 0.140 / 0.052 / 2,432 |
| T4 M1–M4 (spec summary) | Treatment × Sanctioned | matches T1–T3 at reorganized positions | ✓ |
| T5 M1–M4 (spec summary, twoway) | Treatment × Sanctioned | matches T1–T3 at twoway SEs | ✓ |
| T6 M1 (procurement placebo) | Treatment × Procured | 0.044 / 0.051 / 4,833 | 0.044 / 0.051 / 4,833 |
| T6 M2 | Treatment × Procured | 0.044 / 0.049 / 4,833 | 0.044 / 0.049 / 4,833 |
| T6 M3 | Treatment × Procured | −0.036 / 0.084 / 4,833 | −0.036 / 0.084 / 4,833 |
| T6 M4 | Treatment × Procured | −0.036 / 0.039 / 4,833 | −0.036 / 0.039 / 4,833 |
| T7 M1–M4 (procurement robustness) | Treatment × Procured | matches T6 | ✓ |
| T8 M1–M4 (procurement + common) | Treatment × Procured | 0.044 / −0.036 / 0.049 / −0.067 | ✓ |
| T9 M1 (late heterogeneity appendix) | Treatment × Sanctioned | 0.197 / 0.060 / 2,113 | 0.197 / 0.060 / 2,113 |
| T9 M2 | Treatment × Sanctioned | 0.111 / 0.050 / 2,720 | 0.111 / 0.050 / 2,720 |
| T9 M3 | Treatment × Sanctioned | 0.161 / 0.045 / 5,739 | 0.161 / 0.045 / 5,739 |
| T9 M4 | Treatment × Sanctioned | 0.130 / 0.040 / 5,092 | 0.130 / 0.040 / 5,092 |
| T10 M1 (robustness) | Treatment × Sanctioned | 0.110 / 0.048 / 4,424 | 0.110 / 0.048 / 4,424 |
| T10 M2 | Treatment × Sanctioned | 0.155 / 0.049 / 4,510 | 0.155 / 0.049 / 4,510 |
| T10 M3 | Treatment × Sanctioned | 0.157 / 0.050 / 4,005 | 0.157 / 0.050 / 4,005 |
| T10 M4 | Treatment × Sanctioned | 0.126 / 0.050 / 3,251 | 0.126 / 0.050 / 3,251 |

**Total: 40 cells, 40 match.**

## What is and isn't covered

Covered by `success: true`:

- All `modelsummary` tables rendered in the author's `Fukumoto_APSR1.html` and recomputed in our re-knit.
- The event-study coefficient decomposition (9 `Sanctioned × treatment_factor` interactions); all values match the author's knit.
- The Goodman-Bacon single 2×2 decomposition weight (1.0) and its point estimate (0.146, vs. 0.158 on the exact TWFE panel — within 8%, difference attributable to the Goodman-Bacon balanced-panel restriction).

Not part of the `success` gate (but documented for completeness in `comparison.md`):

- Event-study figures (107 inline base64 PNGs in the author's HTML) — pixel-level comparison not performed; visual inspection of a sample plot showed identical lead/lag pattern and confidence-interval shape.
- Network/igraph analysis in the author's appendix — runs without error; no numerical targets extracted for line-level comparison.
- Audit layer (robustness, forensic, staggered sensitivity, alt-mech, data-code sweep, wild-cluster bootstrap) — these go beyond the reproduction gate; see `paper.md` §5 and `comparison.md`.

## Dependencies verified

`library(here); library(ggplot2); library(dplyr); library(tidyr); library(fixest); library(modelsummary); library(stargazer); library(tidyverse); library(igraph); library(reshape2); library(rgenoud); library(glmnet);` — all present; no missing-package failure.

## Reproducibility command

```
unzip paper-2026-0006-replication-*.zip
cd paper-2026-0006
Rscript -e 'knitr::knit("env/repro/Fukumoto_APSR1.Rmd", output = "env/repro/Fukumoto_APSR1.knit.md")'
```

Expected output: `Fukumoto_APSR1.knit.md` 592 KB, all 281 chunks processed, zero R errors. Compare its modelsummary tables against those in the author's `Fukumoto_APSR1.html` — every cell matches.

## Full replication package

- Zip: https://www.dropbox.com/scl/fi/fckmz8d7k4x0oq5ao1c1g/paper-2026-0006-replication-20260419-2133.zip?rlkey=xikf1rj6nghk9cwbmd8levj8w&dl=1
- Audit report: `comparison.md` (40/40 cells + H1–H7 forensic + S0–S7 staggered sensitivity + M1–M7 alt-mechanism + D1–D10 data/code sweep + wild-cluster bootstrap).
