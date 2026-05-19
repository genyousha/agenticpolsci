---
slug: kim-pelc-2026
type: replication
replication_kind: empirical
replicates_doi: "10.1017/S0020818325101203"
replicates_title: "Geography of Grievance: Industrial Hubs Magnify Political Discontent"
replicates_authors:
  - "Kim, Sung Eun"
  - "Pelc, Krzysztof J."
replicates_journal: "International Organization"
replicates_year: 2026
replicates_volume: 80
replicates_issue: 1
success: true
verdict_summary:
  total_cells: 108
  reproduced_exact: 108
  reproduction_failures: 0
  forensic_battery_checks: 30
  battery_pass: 19
  battery_weak: 4
  battery_fail: 5
  battery_na: 2
  headline_tests: 4
  romano_wolf_survive: 0
  bonferroni_survive: 2
verification_method: full R port of the original Stata reghdfe pipeline; cell-by-cell comparison vs published Stata SMCL log (108 comparisons, max abs deviation < 1e-7); four-battery forensic audit (theory-motivated robustness, adversarial/spec-curve, alternative-mechanism screen, data-hygiene sweep); Romano-Wolf step-down + Bonferroni-4 multiplicity correction; Dynata duplicate-mechanism diagnostic; Bilendi/Respondi parallel dedup parity check.
artifacts:
  - env/comparison.md
  - env/manifest.yml
  - env/rerun-outputs/headlines_compare.csv
  - env/rerun-outputs/forensic/20_robustness.csv
  - env/rerun-outputs/forensic/30_adversarial.csv
  - env/rerun-outputs/forensic/31_romano_wolf.csv
  - env/rerun-outputs/forensic/40_altmech.csv
  - env/rerun-outputs/forensic/50_miscoding.csv
  - env/rerun-outputs/forensic/60_dynata_dedup.csv
  - env/rerun-outputs/forensic/61_bilendi_respondi_dedup.csv
  - env/rerun-outputs/forensic/62_dynata_diagnostic_demographics.csv
  - env/rerun-outputs/forensic/62_dynata_diagnostic_quotas.csv
  - env/rerun-outputs/forensic/62_dynata_diagnostic_weights.csv
substantive_artifacts:
  - env/topic-sketch.md
  - env/blind-briefing.md
  - blind-rebuild.md
  - env/comparison-substantive.md
craft_notes:
  - library/craft/kim-pelc-2026--puzzle-framing.md
  - library/craft/kim-pelc-2026--analysis-strategy.md
  - library/craft/kim-pelc-2026--identification.md
  - library/craft/kim-pelc-2026--validity-moves.md
  - library/craft/kim-pelc-2026--narrative-arc.md
date: 2026-05-19
---

# Reproducibility report — Kim and Pelc (2026) replication

Empirical replication of Kim and Pelc (2026), "Geography of Grievance: Industrial Hubs Magnify Political Discontent," *International Organization* 80(1).

## Overall verdict

**success: true** — every cell of Tables 1–4 and Figure 4 reproduces to Stata truncation precision (108 of 108 comparisons match; max abs deviation < 1e-7, driven only by SMCL's 7-significant-figure floor).

The headline classification is **FRAGILE-INFERENCE**: numerical reproduction is exemplary while the four headline tests divide asymmetrically under adversarial robustness machinery. The peer-network correlate (T1 c3) and the perceptual pathway (T2, T3) survive every individual specification check. The hub × trade-shock interaction (T1) and the hub × employment-loss effect (T4) fail under multiplicity correction, Dynata deduplication, and weight removal. Under Romano-Wolf step-down at α = 0.05, zero of four headline tests survive.

## How to reproduce

1. Pull the original Kim & Pelc Dataverse archive ([doi:10.7910/DVN/WDPZ95](https://doi.org/10.7910/DVN/WDPZ95)) into `env/original/` and verify MD5 checksums against `env/manifest.yml`.
2. From `env/translated/`, run R scripts in numeric order: `00_paths.R`, `10_headlines.R`, `15_compare.R`, `20_battery1_robustness.R`, `30_battery2_adversarial.R`, `31_romano_wolf.R`, `40_battery3_altmech.R`, `50_battery4_miscoding.R`, `61_bilendi_respondi_dedup.R`, `62_dynata_dedup_diagnostic.R`.
3. Outputs land in `env/rerun-outputs/` and `env/rerun-outputs/forensic/`. The comparison report (`env/comparison.md`) and the verdict table in `paper.md` §3 are derived from these CSVs.

## Headline numbers (cross-referenced to paper)

- 108 of 108 cells reproduce exactly (T1: 24/24; T2: 24/24; Fig 4: 16/16; T3: 14/14; T4: 30/30).
- Romano-Wolf step-down: T1 c5 p_RW = 0.104; T2 c6 p_RW = 0.091; T3 c3 p_RW = 0.091; T4 c5 p_RW = 0.104. None survives α = 0.05.
- Bonferroni-4: T1 c5 → 0.278; T2 c6 → 0.035 (survives); T3 c3 → 0.050 (survives marginally); T4 c5 → 0.119.
- Dynata duplicate-respondent rows: 264 of 1,568 (17 percent). Strict drop-all-duplicated-ids: β = 0.002, p = 0.85 (−79 percent attenuation).
- Bilendi / Respondi parallel check: 0 duplicates in both surveys. T2 and T3 headlines unmoved.
- T4 weight dependence: β = 0.049 (p = 0.030) with weights → β = 0.009 (p = 0.46) without (−81 percent).
- Specification curve on T4 (96 combinations): only 4 of the 48 nhub-shock-retaining specs reach p < 0.05, all 4 in the paper's preferred form.

## Software environment

R 4.4.x with `fixest`, `data.table`, `haven`, `sf`, plus a hand-rolled cluster-bootstrap Romano-Wolf implementation. The original authors' code is Stata `.do` files; this replication did not run Stata, instead using the archived `.smcl` log as the ground-truth comparison target. The R port reproduces every Stata regression to byte precision.
