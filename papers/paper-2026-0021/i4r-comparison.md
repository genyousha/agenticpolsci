# I4R vs comradeS Meta-Comparison — Weschle (2024) AJPS

**comradeS audit**: `papers/paper-2026-0021/env/comparison.md` (this repo)
**I4R report**: Ganly, Lehner, Nguyen, Sutherland (2025), I4R DP No. 203, "Replication Report: A Comment on 'Politicians' Private Sector Job and Parliamentary Behavior'", 16 pp, dated January 17, 2025.
**Original**: Weschle, S. (2024) AJPS 68(2), 390-407.

This document is an internal meta-comparison between two independent third-party replication exercises of the same paper. It names authors and quotes specific paragraphs from both reports; it is not a manuscript and does not follow CLAUDE.md Rule 2 (replication-paper voice).

---

## §1. Convergence — findings BOTH reports agree on

### C1. Computational reproducibility is clean.

- **I4R** (p.5): "we successfully reproduced the main results and all the analytical outputs from the published paper using the code provided, with the exception of Figure 2.B that relies on the use of the R package 'rgdal' which is no longer available." Table A1 (I4R p.9) reproduces all nine columns of Weschle's Table 1.
- **comradeS** (§1, lines 19-33): 9/9 main Table-1 cells pass, with the headline (m3c, log(Q+1), Conservative) reproducing β = 0.4552 vs published 0.455 to three decimal places. Four spot-checked SI tables (A1, A2, A6, A14) also reproduce.
- **Numbers agree exactly.** Both report β = 0.455, SE = 0.098, p ≈ 1e-5 for the headline; both report N = 2,219 and outcome mean 2.293 for Conservatives.

### C2. Removing the MP-position controls inflates the headline.

- **I4R** (p.7-8): "for the outcome related to Number of Parliamentary Questions, removal of all position related controls suggest a larger effect size for the treatment, but the direction and significance do not change." Their Table A8 col. 5 ("Remove all Controls") reports β = 0.695 (SE 0.095) — almost double the original 0.375.
- **comradeS** (§3 F5, lines 159-174): the specification curve shows the same pattern in reverse direction — adding controls reduces β, with a 4× spread (0.235 to 0.971) across 16 specs. Spec 5 (no MP-FE, no year-FE, controls on, balanced=0) yields 0.267; spec 8 (everything on) yields 0.455; spec 2 (MP-FE only, no controls) yields 0.912.
- **Direction agrees**: controls absorb a substantial share of the apparent treatment effect, and dropping them inflates β. Both reports document the magnitude instability.

### C3. Sample restrictions to a narrower year window leave the qualitative finding intact.

- **I4R** (Table A11, p.15): restricting to ≥2011 yields β = 0.427 (SE 0.087, p ≈ 1e-5); restricting to ≤2015 yields β = 0.359 (SE 0.081, p ≈ 2e-5). Both significant.
- **comradeS** (§3 F1, lines 113-123): leave-one-out by year yields a range of 0.350-0.557; dropping 2011 produces the lowest β (0.350) but it remains highly significant (p = 1e-3).
- **Direction agrees**: no single year drives the headline; the year-window robustness is genuine.

### C4. Bootstrapped sample stays in the ballpark for log(Q+1) but shows visible attenuation for the small voting outcomes.

- **I4R** (Table A11 col. 4, p.15): bootstrap β = 0.415 (SE 0.109, p = 2e-4), within ~10% of the headline.
- **I4R** (Table A9 col. 4, p.13): for Vote Rebellion, bootstrapping renders β = 0.001 non-significant (p = 0.199), which I4R attribute (p.8) to the underlying small-sample variance ("likely attributable to the random sampling process").
- **comradeS** does not run a bootstrap directly but converges on the magnitude-stability point through CR2 cluster correction (§3 F6) and the clustering battery (§2 R4), which both preserve the headline within ~5% of the published SE.

---

## §2. comradeS-only findings (qualifications I4R did NOT raise)

### S1. Pre-trends Wald F = 8.49 (p = 2.5e-4); t-2 lead is significantly NEGATIVE.

comradeS §3 F7 (lines 184-200) jointly tests the two pre-treatment leads in Weschle's event-study (Eq. 2) and rejects parallel trends at p = 0.0002, with `beforejob.2` = -0.42 (p = 0.017). I4R does not run a Wald test on the leads, does not display the event-study coefficients, and does not flag the pre-trend issue at all. **I4R never engages the parallel-trends assumption.**

### S2. Sun-Abraham aggregate ATT = 0.108 (p = 0.44), a 76% reduction.

comradeS §6 S2 (lines 335-341) re-estimates the design with `fixest::sunab` and reports an aggregate ATT that is statistically indistinguishable from zero. comradeS also runs Goodman-Bacon (§6 S1: 33.6% of the TWFE β comes from "forbidden" later-vs-already-treated comparisons), Callaway-Sant'Anna (§6 S3: ATT 0.37-0.39, marginally significant), and HonestDiD (§6 S4: CI crosses zero at every M-bar including M-bar=0). **I4R does not run any cohort-aware estimator.** I4R's robustness battery is restricted to (i) sequential removal of TWFE controls and (ii) sample-window shifts plus a single bootstrap. The entire staggered-DiD literature post-2020 is absent from I4R's diagnostics.

### S3. Never-ministers null β = 0.004 (p = 0.97).

comradeS §4 M3 (lines 234-240) shows that among the 238 Conservative MPs who never held a ministerial role in the panel, the headline coefficient is essentially zero. Among ever-ministers it is 0.704. I4R does not partition the sample by ministerial career and does not report this stratified result. The closest I4R analogue is Table A7 col. 2 ("Remove Minister"): β = 8.467e? (printed as "8.467" — likely a typesetting artifact for a coefficient near 0.4) — but this only removes the *control variable* `minister`, not MP-years where the MP currently is a minister. comradeS R1a (drop ministerial MP-years entirely) is the substantive check; I4R does not run it.

### S4. Threshold dose-response inversion (£0 placebo > £1k headline > £5k cut > £10k cut).

comradeS §2 R3 (lines 75-83) varies the earnings cutoff: ≥£500 → 0.471; ≥£1,000 → 0.455 (headline); ≥£5,000 → 0.352; ≥£10,000 → 0.326; **any earnings > £0** → **0.549** (LARGER than at £1,000). comradeS reads this as a selection signature, not a dose-response. I4R does not vary the earnings threshold at all — `bin.1000` is treated as a fixed feature of the design. **This is the single most damaging finding comradeS catches that I4R misses entirely.**

### S5. Second-order findings absent from I4R.

- **Parliament-era heterogeneity (M2)**: 54th Parliament (2010-2014) β = 0.521; 55th (2015-2016) β = 0.169 (ns). I4R's `<=2015` and `>=2011` window shifts overlap with this question but never split at the parliament boundary or report effect-size heterogeneity across eras.
- **log(Q+1) functional-form fragility (R2c, R2d)**: log(Q) on Q≥1 sign-flips to -0.120; Poisson on Q yields 0.081 (p = 0.39). I4R never varies the outcome transformation.
- **Lagged-outcome selection signal (M1)**: bin.1000(t) predicts log(Q+1)(t-1) at β = 0.31 (p = 0.006), recovering 68% of the headline using an outcome that cannot be caused by current treatment. I4R has no analogue.
- **Industry concentration (F3)**: knowledge-for-profit and finance contribute 15-18% of the magnitude each. I4R does not run leave-one-industry-out.

---

## §3. I4R-only findings (qualifications comradeS did NOT raise)

### I1. Bootstrap-attenuated significance for the small voting outcomes.

I4R Table A9 col. 4 (Vote Rebellion bootstrap, p = 0.199) and Table A10 col. 4 (Vote Participation bootstrap, p = 0.127) make the rebellion and participation results non-significant. I4R reports these explicitly though they discount them (p.8) as a sampling artifact corrected at 1,000 reps. comradeS focuses entirely on the log(Q+1) outcome and does not stress-test the rebellion and participation columns. **This is a useful I4R-only contribution**: it shows the rebellion and participation findings are bootstrap-fragile in addition to being p ≈ 0.07 in the original specification.

### I2. Sequential / "leave-out" removal of MP-position controls one at a time.

I4R Tables A3, A5, A7 each remove one of the nine MP-position controls (minister, minister.state, undersec, frontbench.team, shadow.cabinet, com.chair, com.member) sequentially, reporting nine columns each. comradeS examines control inclusion at the binary on/off level in the spec curve but does not catalog which individual control matters most. I4R's catalog reveals (Table A7) that removing minister, minister.state, or undersec individually shifts log(Q+1) β by single-digit percent each, while removing all three simultaneously is what produces the larger inflation — useful incremental information.

### I3. Cleaning-code gap in the replication archive.

I4R Table 1 (p.7) and Conclusion (p.8): "While some of the raw data was included, we did not find any code to replicate the data cleaning process. … the main independent variable (bin.1000) was 'created by going through the register of interest and manually tallying up the earnings reported for each MP-year.'" comradeS §5 D1 catches a related issue (the ≥ vs > coding boundary at £1,000) but does not flag the broader missing cleaning pipeline. **I4R is correct that the hand-coded treatment variable is unauditable from raw sources within the package.** This is a procedural-replication gap that comradeS understated.

### I4. Pre-analysis plan absence.

I4R §2.1 (p.7): "To our knowledge, the author did not create or register a pre-analysis plan (PAP). Thus, we present our reproduction results and robustness checks, reported below." comradeS does not flag PAP absence. (Of course, AJPS 2024 papers in this domain rarely have one, so this is more a procedural note than a substantive finding.)

### I5. Computational-environment dependency on `rgdal`.

I4R p.5 footnote 1 notes that Figure 2.B cannot be reproduced without an old R version because `rgdal` was removed from CRAN. comradeS encounters parallel infrastructure issues (`didimputation` and `fwildclusterboot` not available for R 4.3.3, §6 S5) but does not flag the `rgdal` issue specifically because comradeS does not attempt to reproduce Figure 2.B.

---

## §4. Framing & voice differences

**I4R framing.** I4R's bottom line is unambiguously affirmative. From the abstract (p.3): "Overall, the replication package was well-organized, and the analysis could be fully reproduced using the provided cleaned data. Further, the main outcomes proved consistent across a number of robustness checks." Conclusion (p.8): "Overall, the replication package was well-organized, and the analysis could be fully reproduced using the provided cleaned data. … the main outcomes proved very robust to a number of robustness checks." On §3.1 (controls): "the results remain robust to changes in the inclusion or exclusion of control variables." On §3.2 (sample): "the results remain highly robust to sample variations." This is a textbook "broadly robust" verdict.

**comradeS framing.** comradeS §7 (line 389): **"Verdict: FRAGILE."** comradeS frames the cell-by-cell match as clean *but* the causal interpretation as undermined by eight independent stress tests, of which the most damaging are pre-trends rejection (F = 8.49), Sun-Abraham collapse (-76%), threshold inversion (placebo > headline), and the never-ministers null (β = 0.004).

**Where they diverge on calibration.** This is the core split. I4R reads "robust to controls" and "robust to sample variations" as evidence the headline is solid. comradeS reads the same control-variation pattern (the 0.235-0.971 spread in the spec curve) as a magnitude-instability concern, and adds three orthogonal failure modes (pre-trends, cohort heterogeneity, threshold inversion) that I4R never tests for. **The two reports are not contradicting each other on shared tests** — both find the controls battery preserves significance. **They are diverging on which tests count.** I4R's robustness perimeter is small (controls, time-window, bootstrap); comradeS's is large (selection, functional form, threshold, parallel trends, staggered-DiD). Within I4R's perimeter, "broadly robust" is defensible; within comradeS's perimeter, "FRAGILE" is defensible. The reports are calibrating against different definitions of robustness.

---

## §5. Methodological technique deltas

| Diagnostic | I4R | comradeS | Convention notes |
|---|---|---|---|
| Cell-by-cell reproduction of Table 1 | Table A1, A2 (full 9-col, with p-values) | §1 cell-by-cell | Both pass; comradeS extends to 4 SI tables |
| Sequential removal of single position controls | Tables A3, A5, A7 (9 cols each) | Not run individually | I4R-only; useful incremental view |
| Sequential removal of enter/leave | Tables A4, A6, A8 (5 cols each) | Subsumed in §3 F5 spec curve | I4R more granular |
| Time-window sample shifts (>=2011, <=2015) | Tables A9-A11 col 2-3 | §3 F1 leave-one-year-out | comradeS more granular |
| Bootstrap on full sample | Tables A9-A11 col 4 | Not run | **I4R-only** |
| Cluster-robust SE alternatives | Not run | §2 R4 (constituency, year, two-way) | **comradeS-only** |
| Wild-cluster bootstrap (`fwildclusterboot`) | Not run | Attempted; package not available for R 4.3.3, substituted CR2 (§3 F6) | Both have a small-cluster limit |
| CR2 / Satterthwaite df | Not run | §3 F6 (clubSandwich) | **comradeS-only** |
| Cook's d influence diagnostics | Not run | §3 F2 (top-5%), F4 (>4/N) | **comradeS-only** |
| Specification curve | Not run | §3 F5 (16 combinations) | **comradeS-only** |
| Bonferroni / multiplicity | Not run | §3 F8 (K=26) | **comradeS-only** |
| Pre-trend Wald F-test | Not run | §3 F7 | **comradeS-only** |
| Goodman-Bacon decomposition | Not run | §6 S1 | **comradeS-only** |
| Sun-Abraham (`fixest::sunab`) | Not run | §6 S2 | **comradeS-only** |
| Callaway-Sant'Anna (`did::att_gt`) | Not run | §6 S3 | **comradeS-only** |
| HonestDiD parallel-trends sensitivity | Not run | §6 S4 (M-bar grid) | **comradeS-only** |
| Borusyak-Jaravel-Spiess imputation | Not run | §6 S5 (package N/A on R 4.3.3) | Both blocked |
| Outcome transformation alts (asinh, IHS, log-on-Q≥1, Poisson) | Not run | §2 R2a-d | **comradeS-only** |
| Earnings-threshold alts (£500, £5k, £10k, £0 placebo, log-continuous) | Not run | §2 R3 | **comradeS-only** |
| FE alts (year×party, distance-tercile, drop MP-FE) | Not run | §2 R5 | **comradeS-only** |
| Mechanism rivals (selection, role-transition, anticipation, RDD) | Not run | §4 M1-M7 | **comradeS-only** |
| PAP audit | Noted in §2.1 | Not flagged | **I4R-only** |
| Cleaning-code completeness | Noted in §4 conclusion | Partial (D1, D5) | **I4R-only** for the broader audit |

I4R's diagnostic toolkit is intentionally narrow: leave-one-out for controls, time-window shifts, and a single bootstrap. comradeS's toolkit is much broader and includes essentially the entire post-2020 staggered-DiD diagnostic suite plus a forensic-adversarial battery and an alternative-mechanism screen.

---

## Bottom line

The single most informative delta is that **I4R's robustness battery never engages the parallel-trends assumption or treatment-cohort heterogeneity** — the two issues that, in 2024-25 staggered-DiD practice, are the standard first-line stress tests for any TWFE design. As a result, I4R's "broadly robust" verdict is correctly describing what they tested (controls + time-window + bootstrap) but is silent on what they did not test (pre-trends Wald, Sun-Abraham, Goodman-Bacon, HonestDiD, threshold variation, mechanism rivals). comradeS's "FRAGILE" verdict captures the additional fragility surface that I4R's perimeter excludes by construction. Within their respective perimeters, neither report is wrong on the shared tests — both find that controls and sample-window shifts preserve the qualitative direction. **comradeS is methodologically more thorough** (six diagnostic families to I4R's two) **and substantively more informative** (it identifies the never-ministers null, the threshold inversion, and the Sun-Abraham collapse, none of which I4R surfaces). I4R contributes two findings comradeS misses: the bootstrap-attenuated rebellion/participation columns, and the absent cleaning code for the hand-coded treatment variable. The two reports do not contradict each other; they operate at different scopes, and the comparison reveals that "broadly robust" and "FRAGILE" can both be honest descriptions of the same paper when the diagnostic perimeters differ this much.
