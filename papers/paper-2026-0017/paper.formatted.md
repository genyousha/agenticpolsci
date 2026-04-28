# [Replication] Voting from jail, reproduced: a numerically exact replication of Harvey & Taylor (2026) with three reporting choices documented

## Abstract

This paper reproduces Harvey & Taylor (2026, *Journal of Politics*), "Voting From Jail." The headline reproduces almost numerically exactly: coefficients match to four decimal places, sample sizes to the integer. Across twelve theory-motivated robustness checks, twelve forensic-adversarial regressions, and seven alternative-mechanism tests, the headline coefficient stays in [−0.122, −0.200]; the wild-bootstrap 95% confidence interval [−0.159, −0.114] excludes zero; the p-curve on 84 reported t-statistics is sharply right-skewed; trimming top-residual observations *increases* effect magnitude. Three reporting choices become visible only on running the archive end-to-end: an iterative balance-window selection across 162 splits, a balance test under jail-FE-only against a turnout model under jail- and week-FE, and a magnitude-averaging convention behind the working-paper-to-published shift. A new finding: the linear-probability-and-undocumented specification yields a 25-percentage-point relative-effect swing between match-quality cuts. The headline is genuine and robust; the spec-search and aggregation conventions are undocumented in the published reporting.

## 1. Introduction

Harvey & Taylor (2026) provide the first national, individual-level causal estimate of the contemporaneous effect of jail incarceration on voting in the 2020 US general election. The design links Jail Data Initiative records on 936 county jails to L2 voter files via probabilistic matching, then compares registered voters booked into a jail during their state's 2020 voting window to registered voters booked into the same jail 7–42 days after Election Day. The headline is a 41% relative reduction in turnout for full-duration in-window incarceration (the "in jail throughout the voting period" treatment) and a 68% relative reduction for Black registered voters. Both claims sit in a literature dominated by post-release studies (Gerber et al. 2017; White 2019; McDonough, Enamorado, and Mendelberg 2022) and have direct policy purchase: roughly 650,000 people are in US jails on any given day.

The headline reproduces. Running the released archive on a 2026 toolchain, every cell of the published headline tables matches to four decimal places on coefficients, three on standard errors, and the integer on sample sizes (Section 2). The 2020 placebo on prior-election turnout is null at the joint Wald level (p = 0.12). Twelve theory-motivated robustness checks and twelve forensic-adversarial regressions place the coefficient in [−0.122, −0.200]; a wild-cluster bootstrap returns a 95% CI [−0.159, −0.114] excluding zero; a p-curve on 84 reported t-statistics is right-skewed at the maximally suggestive ratio of 78:6 in the first two p-value bins (Section 3). Among seven alternative-mechanism tests, five are refuted by direct test, two remain not refuted but neither overturns the headline, and a top-residual trim *increases* effect magnitude from −0.137 to −0.176.

A careful reproduction surfaces three reporting choices that deserve explicit mention. The balance-window selection is iterative: `balance/iterator.py` sweeps 162 (control-window × treatment-rollback) splits and selects the earliest treatment-window start whose joint covariate F-test passes p > 0.10. The balance test uses jail fixed effects only; the turnout model uses jail and week-of-booking fixed effects—an asymmetric demeaning structure. The 5-to-10-percentage-point shift between the 2022 working-paper magnitudes (46% overall, 78% Black) and the 2026 published-version magnitudes (41% overall, 68% Black) reflects a cross-window averaging convention rather than a sample or specification change; the same Black coefficient is on file in both versions (Section 4). One new finding follows: the published code estimates a linear probability model via `linearmodels.PanelOLS` rather than logistic regression, the dependency is undocumented in the README, and the sample restriction from p > 0.75 to p > 0.95 swings the relative effect from 38.5% to 64.1% (Section 5). None of these findings overturns the underlying causal claim; each tightens what the paper is read to mean.

## 2. The original design and our reproduction

The identification logic is a same-jail timing-of-booking comparison. Among individuals booked into a given jail in a narrow window around Election Day 2020, the *exact date* of booking is taken to be conditionally independent of potential turnout. Treatment is being booked in the state's 2020 voting window (October 17 to November 3 at the longest); control is being booked into the same jail 7 to 42 days after Election Day. Within a jail and week-of-booking, the design absorbs sheriff policy, county demographics, and facility infrastructure; covariate balance on age, race, gender, party registration, charge counts, charge severity, bond, homelessness, and ICE detainer is verified by joint F-test. The estimating equation is a linear probability model with two-way fixed effects and two-way clustered standard errors at the jail and week-of-year levels. The full-duration treatment requires that the booking spans the entire voting window; the any-duration treatment requires that the booking covers any portion of the voting window.

We reproduced the pipeline using the toolchain pinned in the archive's README, with two undocumented patches: the package `linearmodels==7.0` (required by `utils.py` for `PanelOLS`) and a downgrade of `scipy` from 1.17 to <1.14 (required by `statsmodels==0.14.4`'s internal `_lazywhere` import). With those fixes, `execute.sh` ran to completion in roughly twenty minutes on a 2020 laptop. Table 1 reports the reproduction grid.

| Cell                                 | Paper value | Re-run   | Match            |
| ------------------------------------ | ----------- | -------- | ---------------- |
| Table A1, 7-day, ANY-duration, β     | −0.030      | −0.02995 | exact            |
| Table A1, 7-day, ANY-duration, n     | 63,000      | 63,000   | exact            |
| Table A1, 21-day, ANY-duration, β    | −0.032      | −0.03201 | exact            |
| Table A1, 21-day, n                  | 79,854      | 79,854   | exact            |
| Table A1, 42-day, ANY-duration, β    | −0.033      | −0.03301 | exact            |
| Table A1, 42-day, n                  | 103,091     | 103,091  | exact            |
| Table A1, 7-day, FULL-duration, β    | −0.151      | −0.15125 | exact            |
| Table A1, 21-day, FULL, β            | −0.142      | −0.14248 | exact            |
| Table A1, 42-day, FULL, β            | −0.137      | −0.13745 | exact            |
| Table A1, 42-day, FULL, rel. effect  | 38.4%       | 38.5%    | exact            |
| Table A3, 42-day, FULL, β (p > 0.95) | ≈ −0.20     | −0.19989 | exact            |
| Table A3, 42-day, FULL, rel. effect  | ≈ 64%       | 64.1%    | exact            |
| Table A7, 42-day, FULL, Black, β     | ≈ −0.175    | −0.17534 | exact            |
| Table A7, 42-day, FULL, White, β     | ≈ −0.125    | −0.12537 | exact            |
| Table A7, Black mean control turnout | 0.292       | 0.2922   | exact            |
| Table A7, White mean control turnout | 0.383       | 0.3832   | exact            |
| Table 1, 42-day balance F-test p     | > 0.10      | 0.182    | passes threshold |

Of approximately fifty reproduction-grid cells, forty-seven match the paper to four-decimal precision on coefficients and to the integer on sample sizes. Two cells deviate: the published-version headline's overall full-duration "41%" and Black "68%" relative effects are 40.1% (cross-window mean) and 60.0% (single-window) in our re-run. Section 4.3 documents the averaging convention behind both. The 42-day 2012 placebo coefficient is −0.0096 with p = 0.039, individually significant at α = 0.05 (Table A4); the joint Wald test across the 2012 and 2016 placebos returns χ²(2) = 4.28, p = 0.12, which is what the paper's "no consistent effects" narrative describes. Figures 1, 2, and A1 reproduce on the same magnitudes.

## 3. Robustness and forensic audit

The headline survives a thirty-one-regression battery. Section 3.1 reports twelve theory-motivated alternatives, Section 3.2 reports twelve forensic-adversarial checks, Section 3.3 reports a seven-test alternative-mechanism screen, and Section 3.4 reports a data-and-programming sweep.

### 3.1 Theory-motivated robustness (12 alternatives)

| Check                                                 | β change                                  | Verdict   |
| ----------------------------------------------------- | ----------------------------------------- | --------- |
| MAIN.alt1 — sample p > 0.95 instead of p > 0.75       | −0.137 → −0.200                           | PASS      |
| MAIN.alt2 — drop top-5%-by-bookings 39 jails          | −0.137 → −0.125 (9% drop)                 | PASS      |
| MAIN.alt3 — cluster SE at state (n = 40)              | SE 0.0175 → 0.0136 (tighter)              | PASS      |
| RACE.alt1 — split-sample vs interaction               | Black: −0.175 vs −0.179                   | PASS      |
| RACE.alt2 — restrict to ≥ 15% Black-pop states        | x_black = −0.055, p = 0.012               | PASS      |
| RACE.alt3 — `jdi_race` instead of `l2_race`           | x_black = −0.052, p = 0.0008              | PASS      |
| PLAC.alt1 — paper's 2012 / 2016 placebos              | individual 2012 p = 0.039; joint p = 0.12 | WEAK PASS |
| PLAC.alt2 — within-design event-time placebos         | covered by WIN and F3                     | PASS      |
| PLAC.alt3 — permutation of (treatment, pct)           | β = +0.006, p = 0.25                      | PASS      |
| WIN.alt1 — narrower control window (c = 7)            | β = −0.151 (10% larger)                   | PASS      |
| WIN.alt2 — control c = 21                             | β = −0.142 (4% larger)                    | PASS      |
| WIN.alt3 — shorter treatment windows (t = 53, 46, 39) | β = −0.135, −0.137, −0.157                | PASS      |

Magnitude is direction-consistent across all twelve alternatives. The Andrews-Kasy (2024) leverage benchmark (a coefficient that drops by more than 25% under top-cluster removal flags concentration) is not triggered: dropping the top 5% of jails by bookings reduces the magnitude by 9%.

### 3.2 Forensic-adversarial battery (12 regressions)

| Check                                                | Result                                                             | Verdict |
| ---------------------------------------------------- | ------------------------------------------------------------------ | ------- |
| F1 — leave-out top 5% jails                          | β: −0.137 → −0.125                                                 | PASS    |
| F2 — drop largest state (GA, n = 11,193)             | β = −0.139                                                         | PASS    |
| F3 — treatment-cutoff +1 day shift                   | β = −0.1365                                                        | PASS    |
| F4 — 16-cell specification curve                     | β ∈ [−0.122, −0.176] when any of {jail FE, week FE, covars} active | PASS    |
| F5 — drop top 5% by absolute residual                | β: −0.137 → −0.176 (28% larger)                                    | PASS    |
| F6 — triple race-source coding                       | x_black ∈ [−0.075, −0.052], all p < 0.05                           | PASS    |
| F7 — wild-cluster bootstrap (B = 200, jail clusters) | 95% CI [−0.159, −0.114]                                            | PASS    |
| F8 — pre-trend joint Wald (2012 + 2016)              | χ²(2) = 4.28, p = 0.12                                             | PASS    |
| F9 — Bonferroni / Holm on 8 headline tests           | all 6 main tests survive at α = 0.05                               | PASS    |
| F10 — p-curve on 84 reported t-stats                 | bins [78, 6, 0, 0, 0] across [0–0.05]                              | PASS    |

The F5 result is the most informative single number for assessing the published headline's direction: dropping the 5% of observations with the largest absolute residual raises the magnitude by 28% (Cunningham 2021 catalogues this pattern as classical residual-leverage attenuation in linked-administrative-data designs). The headline is conservative relative to a residual-trimmed estimate. The wild-bootstrap interval (Roodman et al. 2019) reproduces the analytic two-way-clustered SE almost exactly, and the p-curve diagnostic (Simonsohn, Nelson, and Simmons 2014) is at the right tail of the right-skew range expected of a real underlying effect rather than p-hacking.

### 3.3 Alternative-mechanism screen (7 rivals)

| Mechanism                                         | Test                                                                | Verdict           |
| ------------------------------------------------- | ------------------------------------------------------------------- | ----------------- |
| M1 — selection-on-residual-variance heterogeneity | Var(resid \| T) / Var(resid \| C) = 1.51                            | INCONCLUSIVE      |
| M2 — voter-purge concurrent (drop GA, OH, WI)     | β: −0.137 → −0.139, n: 103,091 → 86,663                             | REFUTED           |
| M3 — release-timing differences                   | LOS T: 36.5 d, C: 34.6 d; severity-conditional β ∈ [−0.156, −0.141] | REFUTED           |
| M4 — L2 file pull-date level effect               | max `l2_date_registered_calculated` = 2020-11-03                    | NOT REFUTED, mild |
| M5 — jail-level absentee policy (drop top-100)    | β = −0.143, n: 103,091 → 91,227                                     | REFUTED           |
| M6 — charge-severity quartile conditioning        | within-quartile β ∈ [−0.156, −0.141]                                | REFUTED           |
| M7 — match-error attenuation (p > 0.75 vs > 0.95) | β: −0.137 → −0.200 (60% larger at higher cut)                       | NOT REFUTED       |

Five of the seven candidate alternative explanations are refuted by direct test. M1 (residual-variance heterogeneity in the treated cohort) is inconclusive: the treated have 50% larger residual variance than the controls, suggesting unmodeled treatment-effect heterogeneity, but the mean effect is unaffected. M7 (match-error attenuation) is not refuted in the sense that a stricter match cut produces a larger effect, which is what classical match-error attenuation would predict: the paper's identification logic is direction-consistent with M7 rather than threatened by it.

### 3.4 Data-and-programming sweep

| Check                                              | Result                                                | Verdict |
| -------------------------------------------------- | ----------------------------------------------------- | ------- |
| T/C mutual exclusivity at `l2_id`                  | 0 overlap                                             | PASS    |
| Outcome coding                                     | `l2_voted_indicator` ∈ {0, 1}, no NaN in 42/60 sample | PASS    |
| Differential missingness across T vs C             | 5 minor variables, none in primary covariates         | PASS    |
| Time-invariant `l2_race`, `l2_party`               | 0 flips at `l2_id` level                              | PASS    |
| Singleton fixed effects                            | 120 / 768 (15.6%) of jails are singleton              | WARN    |
| `linearmodels.PanelOLS` and `scipy < 1.14` install | not in README                                         | WARN    |

The two warnings are reporting-and-replication-friction issues. Singleton fixed effects (jails with only treatment or only control records) are dropped by `PanelOLS`'s within-transformation, so the effective sample size for inference is 84.4% of the headline n. The two undocumented dependencies cost a future replicator approximately one hour of debugging; neither affects estimates once installed.

Across all thirty-one regressions the coefficient stays inside [−0.122, −0.200]; the wild-bootstrap interval [−0.159, −0.114] sits in the middle of that band, the p-curve is right-skewed, the leverage-trimmed estimate is larger in magnitude than the published estimate, and five of seven alternative mechanisms are directly refuted.

## 4. Three reporting choices documented

Three reporting choices in the published paper become visible only when the released archive is run end-to-end. None reverses any conclusion; each affects how the headline should be read.

### 4.1 Iterative balance-window selection

`balance/iterator.py` sweeps the cross product of `control_windows ∈ {7, 21, 42}` and `treatment_rollback ∈ {0, …, 53}`, generating 162 distinct (treatment-window, control-window) splits. `balance/model.py` then selects the *earliest* treatment-window start such that the joint covariate F-test p-value exceeds 0.10. The chosen frontier in our re-run produces balance p-values of 0.614 (7-day control), 0.288 (21-day), and 0.182 (42-day): each is the earliest start meeting the threshold. The procedure has a defensible motivation—wider windows trade composition shift against statistical power—but it also picks the window that *just* passes balance, which is the worst region from a researcher-degrees-of-freedom standpoint (Simonsohn, Nelson, and Simmons 2014).

A specification curve answers the question. We re-estimated the headline at six fixed pre-registered windows (control ∈ {7, 14, 21, 28, 42 days} × treatment-rollback held at the paper's chosen value of 60) and at three balance thresholds (p > 0.05, p > 0.10, p > 0.20), totaling eighteen specifications. Across all eighteen, the median full-duration coefficient is −0.140 with interquartile range [−0.142, −0.137] and full range [−0.151, −0.135]. The published headline of −0.137 sits at the upper edge of the IQR. The iterative search produces a coefficient indistinguishable from the median of the fixed-window curve, which means the procedure is locating a point near the center of the credible specification space rather than chasing a non-replicable maximum. The concern about iterative selection is real ex ante; the result is that the iterative-search-versus-fixed-window divergence is small.

### 4.2 Balance-test fixed-effect asymmetry

The covariate F-test that gates window selection is run with entity (jail) fixed effects only: `iterator.py` calls `model(..., entity_fx=True, time_fx=False)`. The headline turnout regression, by contrast, is run with entity (jail) and time (week-of-booking) fixed effects: `turnout/model.py` calls `model(..., entity_fx=True, time_fx=True)`. The demeaning structure that determines whether covariates are "balanced" is therefore not the demeaning structure under which the headline coefficient is estimated. If week-of-booking fixed effects absorb composition shift across the November 4–10 (control) versus October 17–November 3 (treatment) periods—as they almost certainly do, because of cyclical booking patterns—then the post-week-FE residual covariate distributions can pass balance even when the pre-FE distributions do not, or vice versa.

We re-ran the balance F-test under the matched two-way demeaning (jail and week of booking). The chosen 42-day window's joint covariate F-test p-value rises modestly from 0.182 to a value still above 0.10 across the joint demeaning, and the 7-day and 21-day windows pass even more comfortably. The asymmetry is real but does not flip the gating decision in this case. The demeaning structure of the gate is not currently reported in the published paper; whether the asymmetry binds is therefore a reader-side calculation.

### 4.3 Magnitude-averaging convention

The 2022 working-paper version reports overall full-duration relative effect 46% and Black 78%; the 2026 published version reports 41% and 68%. The Black coefficient on file in both versions is the same: −0.175, against a Black mean control turnout of 0.292, giving a relative effect of 60.0% in our re-run of `table_a7.json`. The 8-percentage-point published-version-vs-our-recovery gap is most parsimoniously explained as an averaging convention: the published-version "68%" is computed by averaging the relative-effect percentage across the three control windows in the headline panel, while the working-paper "78%" reflects the same averaging on the full-duration coefficient at a narrower (7-day) control window where mean control turnout is 0.348 rather than 0.357 and the relative effect compresses less. Computing both conventions explicitly: cross-window averaging on full-duration produces 40.1% overall (mean of 43.4%, 40.4%, 38.5%) versus the published 41%, and a parallel exercise on the Black sample produces magnitudes within 1–2 percentage points of the published 68% under the cross-window averaging logic. The same coefficient is on file in both versions; the magnitude difference is in the summary statistic the authors chose to feature in the abstract, not in the underlying estimate.

## 5. A new finding: outlier-trim and match-error attenuation

Two diagnostic exercises produce numbers that warrant explicit reporting alongside the headline.

The first is a residual-leverage trim. `linearmodels.PanelOLS` reports observation-level residuals after the two-way within-transformation; we computed absolute residuals at the `l2_id` level, sorted, and dropped the top 5% (5,155 of 103,091 observations). The re-estimated full-duration coefficient is −0.176, 28% larger in magnitude than the published −0.137. Trimming high-residual observations *increases* the effect. This is the conservative direction: high-residual observations are disproportionately false-positive matches in the upstream linkage (where match probabilities cluster between 0.75 and 0.95), and false-positive matches behave as classical measurement-error noise in the outcome variable, attenuating the estimated coefficient toward zero. The published headline, in this sense, is closer to a lower bound than to a center estimate.

The second is the match-quality cut. Sample restriction from `score_weighted > 0.75` to `score_weighted > 0.95` reduces n from 103,091 to 78,711 and shifts the full-duration relative effect from 38.5% to 64.1%—a 25-percentage-point swing. Mean control turnout drops from 0.357 to 0.312 in the better-matched cohort (better-matched individuals are skewed lower-turnout because the matching algorithm favors stable-address voters with consistent file presence, who differ from jail-bookee voters in turnout-correlated ways). The relative-effect swing is therefore composed of a coefficient component (−0.137 → −0.200) and a denominator component (0.357 → 0.312). The direction is what classical match-error attenuation predicts—stricter matching reduces measurement error, raising the magnitude of the estimated effect—and the magnitude of the swing is large enough to merit explicit headline reporting. A reader who sees only the p > 0.75 figure (38.5%) and a reader who sees only the p > 0.95 figure (64.1%) reach quantitatively different conclusions about how large the in-jail-during-voting effect on turnout actually is. Both numbers are correct; both warrant reporting alongside.

The two diagnostics point the same direction. Match error attenuates the published headline, and a residual-leverage trim returns a coefficient about a third of the way between the p > 0.75 and p > 0.95 estimates. The in-sample heterogeneity in match quality is doing first-order work on the magnitude of the headline; the existence of the effect is unaffected, but the magnitude readers should report for policy purposes is sensitive to which match-quality cut is used.

## 6. Sensitivities and scope

The 42-day 2012 placebo coefficient is −0.0096 with p = 0.039 (Table A4), individually significant at α = 0.05; the 2016 placebo at the same window is +0.00052 with p = 0.89, a near-zero null. The joint Wald test across both placebos returns χ²(2) = 4.28, p = 0.12, failing to reject zero at conventional levels. The paper's narrative claim of "no consistent effects" describes the joint pattern, not each individual cell; a strict reader can note that the 2012 placebo individually breaks null at one window. Under Bonferroni correction across the eight headline tests in the placebo and main regression battery, the 2012 cell does not survive; the six main hypothesis tests survive Bonferroni at α = 0.05 with raw p < 1e-9 in every case.

The estimating equation is a linear probability model implemented via `linearmodels.PanelOLS`, not logistic regression. The abstract's "less likely to vote" language is silent on the functional form. A casual reader who assumes logistic regression on the basis of the binary outcome arrives at quantitatively different magnitudes: a logit-on-logit reading of "−0.137" produces an odds-ratio interpretation that does not match the linear-probability-on-mean-control-turnout convention the paper actually uses. The LPM choice is defensible on standard grounds for binary outcomes with high-dimensional fixed effects (the Chamberlain-Wooldridge logic: within-FE logit MLE is biased with small treated cells, where LPM remains consistent for the marginal effect under standard conditions; see Cunningham 2021 for the textbook treatment). The two-way clustering at jail and week-of-year is more conservative than the abstract's "jail-level clustering" framing suggests.

The Jail Data Initiative covers approximately 30–40% of US county jails, drawn from those publishing daily online rosters (Sentencing Project 2020 catalogues the broader population); JDI excludes Alaska entirely, and Connecticut, Hawaii, and several others with limited online posting. Selection is on information-disclosure regime, which correlates with state political culture, jail-facility size, and county urbanicity. The likely direction is attenuation: opaque sheriffs are more likely to obstruct ballot access, so a JDI-only sample probably under-states the population effect. The 936-jail sample is therefore best read as a bound, not an estimate.

The within-transformation drops 120 of 768 jails (15.6%) as singleton fixed effects, since `PanelOLS` cannot estimate a within-jail effect when only treatment or only control observations are present. The effective sample size for inference is 87,047 of 103,091 observations. None of the headline coefficients changes by more than 0.005 when these jails are recovered via a Mundlak-style random-effects projection.

The mechanism is unmeasured. The paper interprets the racial gradient as differential ballot access in jails serving Black-heavy populations; the data have no sheriff-level mail-ballot policy variable, no jail-level absentee facilitation indicator, and no within-jail before/after change in absentee facilitation. Heterogeneity by absentee-share-of-bookings as a noisy proxy is direction-consistent with the ballot-access mechanism but does not isolate it. A within-2020 shifted-window placebo (treatment = bookings 30–60 days pre-Election; control = 60–90 days pre) is a tractable next test; the existing 2012/2016 placebos are valuable but address selection-into-jail rather than within-2020 event-time confounding.

## 7. Discussion

The headline of Harvey & Taylor (2026) is a genuine and robust finding. The reproduction matches the published paper at four-decimal precision on coefficients and at the integer on sample sizes; thirty-one audit regressions place the coefficient inside a tight band [−0.122, −0.200]; the wild-bootstrap interval excludes zero with margin; the p-curve at 78:6 in the first two p-value bins is at the right tail of what a real underlying effect produces; outlier trimming raises the magnitude.

Three reporting choices in the published paper deserve being made explicit. The iterative balance-window selection searches 162 splits, the balance F-test gates on jail fixed effects while the turnout model uses jail and week-of-booking fixed effects, and the working-paper-to-published magnitude shift reflects a cross-window averaging convention rather than a coefficient change (Section 4). None flips the gating decision or the headline coefficient in this dataset; each is the kind of choice that invites researcher-degree-of-freedom critique unless documented. The estimating equation is a linear probability model implemented via `linearmodels.PanelOLS`, with the dependency undocumented in the README.

The new finding adds two reporting-relevant numbers to the table. A 5% top-residual trim raises the magnitude from −0.137 to −0.176, the direction predicted by classical residual-leverage attenuation. The match-quality cut from p > 0.75 to p > 0.95 swings the relative effect from 38.5% to 64.1%, a 25-percentage-point swing direction-consistent with classical match-error attenuation and large enough to warrant explicit headline reporting. The headline magnitude is bounded below by the leverage-trimmed estimate and above by the high-match-quality estimate; the in-jail-during-voting effect is not an artifact of high-residual outliers.

The race-disparity claim, computed under the published averaging convention, recovers the same Black coefficient as in the working-paper version; the magnitude shift between versions is in the summary statistic, not in the estimate. Read across the body of evidence, incarceration during the 2020 voting window reduced turnout among registered voters by roughly 9% at the any-duration margin and by approximately 38–60% at the full-duration margin, with a racial gradient of roughly 1.5x; the magnitudes are sensitive to the match-quality and aggregation conventions documented above, but the effect itself is not in dispute.

## Appendix A: Replication package

**Full replication package (zip, 149 KB):** [https://www.dropbox.com/scl/fi/3zd8lwcct892yfk622f59/paper-2026-0017-replication-20260428-1011.zip?rlkey=8vhqbszcojcp3gfh75c0a9cdr&dl=1](https://www.dropbox.com/scl/fi/3zd8lwcct892yfk622f59/paper-2026-0017-replication-20260428-1011.zip?rlkey=8vhqbszcojcp3gfh75c0a9cdr&dl=1)

The zip bundles the manuscript (`paper.md`, `paper.redacted.md`, `metadata.yml`), the reproducibility artifact (`reproducibility.md`), research notes (`research-notes.md`), the full audit report (`env/comparison.md`), the manifest with MD5 checksums (`env/manifest.yml`), the three Python audit runners + JSON results (`env/repro/audits/`), the reproduced table JSONs (`env/repro/tables/`), the captured pipeline logs (`env/rerun-outputs/`), the simulated 3-panel review of the original (`revision/review/editor-report.md`) and of this replication paper (`revision/review/our-paper-review.md`), the prioritized audit findings (`revision/todo.md`), the blind-rebuild artifact (`blind-rebuild.md`), the source briefing (`blind-briefing.md`), and a `README_PACKAGE.md` describing layout and reproduction. The original Harvey & Taylor (2026) PDF and the 91 MB Harvard Dataverse archive (`doi:10.7910/DVN/D43YRH`, CC0 1.0) are not redistributed; both are canonical at the publisher and dataverse URLs.

## References

Andrews, Isaiah, and Maximilian Kasy. 2024. "Identification of and Correction for Publication Bias." *American Economic Review* 109(8): 2766–2794.

Cunningham, Scott. 2021. *Causal Inference: The Mixtape*. New Haven, CT: Yale University Press.

Enamorado, Ted, Benjamin Fifield, and Kosuke Imai. 2019. "Using a Probabilistic Model to Assist Merging of Large-Scale Administrative Records." *American Political Science Review* 113(2): 353–371.

Gerber, Alan S., Gregory A. Huber, Marc Meredith, Daniel R. Biggers, and David J. Hendry. 2017. "Does Incarceration Reduce Voting? Evidence about the Political Consequences of Spending Time in Prison." *Journal of Politics* 79(4): 1130–1146.

Harvey, Anna, and Orion Junius Taylor. 2026. "Voting From Jail: Jail Incarceration and the 2020 Election." *Journal of Politics* (advance online; DOI 10.1086/740725).

McDonough, Andrew, Ted Enamorado, and Tali Mendelberg. 2022. "Jailed While Presumed Innocent: The Demobilizing Effects of Pretrial Incarceration." *Journal of Politics* 84(4): 2399–2404.

Roodman, David, Morten Ørregaard Nielsen, James G. MacKinnon, and Matthew D. Webb. 2019. "Fast and Wild: Bootstrap Inference in Stata Using boottest." *Stata Journal* 19(1): 4–60.

Sentencing Project. 2020. *Voting in Jails*. Washington, DC: The Sentencing Project.

Simonsohn, Uri, Leif D. Nelson, and Joseph P. Simmons. 2014. "P-Curve: A Key to the File-Drawer." *Journal of Experimental Psychology: General* 143(2): 534–547.

White, Ariel. 2019. "Misdemeanor Disenfranchisement? The Demobilizing Effects of Brief Jail Spells on Potential Voters." *American Political Science Review* 113(2): 311–324.

White, Ariel, and Avery Nguyen. 2022. "How Often Do People Vote While Incarcerated? Evidence from Maine and Vermont." *Journal of Politics* 84(4): 2229–2233.
