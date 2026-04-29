# i4r-comparison.md — comradeS vs Yang & Huang (2024, I4R DP127)

Benchmark of comradeS's blind replication of Shoub, Stauffer & Song (2021, AJPS) — `papers/paper-2026-0018/paper.md` and the 31-regression audit in `env/comparison.md` — against the human-written I4R Discussion Paper No. 127 by Yang and Huang (May 2024). Neither team saw the other; comradeS executed Phase 4 blind to the I4R PDF, which was opened only at this Phase 8 benchmark step.

The two artifacts disagree slightly on what the original paper reported (e.g., I4R says 2,708 unique FSHP officers and 4,408,628 FSHP stops; comradeS works from `FloridaSmall.RData` with 1,424 officers and 2,712,478 stops in the analysis sample after the original's data-cleaning filter). These are sample-construction differences, not reproduction failures. I4R also flags a discrepancy in the original's Table 1 stop count (4,626,789 vs 4,626,786) and search count (20,404 vs I4R's 27,800) that comradeS did not catch.

---

## 1. Convergence — what both replications caught

The two replications independently converged on **four core findings**, three of them substantive and one numerical.

**(1) Computational reproduction passes.** Both confirm that the published headline cells reproduce. comradeS reports sub-percent drift across all seven cells; I4R says "we have successfully reproduced all figures and tables in Shoub, Stauffer, and Song (2021) except for Table 1." Both confirm the search-rate coefficients (CMPD ≈ −0.026, FSHP ≈ −0.004) and the per-search hit-rate coefficient (≈ +0.103).

**(2) The denominator inversion (M6 in comradeS, "Alternative Interpretation" §5 in I4R) — the headline finding both teams reach.** Both teams independently identified that the original's "no losses in effectiveness" claim depends on a per-search denominator and inverts on a per-stop denominator. Both teams resist the original's rounding-to-zero of the per-100-stop coefficient (β = −0.077, p < 0.001 in both reproductions). I4R writes: "rather than being a Pareto improvement, female officers could imply a trade-off between benign police-citizen contact and effectiveness." comradeS writes: "On a per-stop basis, female officers seize 0.494 contraband finds per 1,000 stops vs 1.475 for male officers — a 3× gap that runs in the opposite direction." This is the I4R DP's headline; it is also comradeS's M6 / paper §4. **Convergent without coordination.**

**(3) Cluster-robust standard errors.** Both teams refit with clustered SEs. I4R clusters at division (CMPD) and county (FHP) and reports nearly identical results (their Table 2b "Clustered" columns). comradeS additionally clusters at officer (F3) and reports the 4× t-stat inflation. Both note the SE understatement in the original. **Convergent.**

**(4) Wild-cluster bootstrap on CMPD.** I4R applies wild-cluster bootstrap to CMPD specifically because the cluster count is small (13 divisions); they cite Webb (2014). comradeS applies wild-cluster bootstrap to FSHP (67 counties) and finds p = 0.51. Both teams independently reach for WCB as the appropriate diagnostic for few-cluster inference. **Methodologically convergent; substantively divergent in which sample to apply it to** (I4R picks CMPD because it has 13 clusters; comradeS picks FSHP because of leverage concentration).

**Convergence summary**: both teams hit denominator inversion (the substantive headline) and the SE / WCB methodology cluster. The two reports would, in tandem, deliver a coherent revise-and-resubmit demand to AJPS.

---

## 2. comradeS-only findings — what comradeS caught that I4R missed

This section is the strongest case for comradeS's audit pipeline; several findings here are first-order and are absent from I4R entirely.

**(a) F4 leverage trim — 91% attenuation when top-5% of officers by Σ|residual| are removed.** I4R does not run any leverage diagnostic. comradeS shows that the FSHP search-rate coefficient is concentrated in roughly 70 officers out of 1,424. This is a finding I4R cannot make because their report does not engage with within-sample concentration; it is the single most consequential audit result against the FSHP headline that I4R missed.

**(b) F5 wild-cluster bootstrap on FSHP — p = 0.51.** I4R applies WCB to CMPD (13 clusters) but not to FSHP (67 clusters). The CGM (2008) trigger condition for WCB-asymptotic divergence — concentrated within-cluster leverage — is what F4 demonstrates and what I4R has no diagnostic for. comradeS therefore reaches the conclusion "FSHP search-rate is not statistically distinguishable from zero under appropriate inference" that I4R does not.

**(c) Race heterogeneity collapses the pooled headline.** RACE.alt2 in comradeS shows that the female-officer search reduction is concentrated among white officers (β = −0.0048, p < 1e-9) and is statistically zero among Black officers (β = −0.00029, p = 0.18). RACE.alt3 shows the reduction is 2.5× larger for Black drivers. **I4R reports nothing on race-by-officer-sex or race-by-driver-sex interactions.** This is a substantive heterogeneity that the I4R report skips entirely; the original AJPS paper has a partial treatment in its SI but not in the headline. comradeS's §5 makes this a centerpiece.

**(d) HIT.alt2 — hit-rate coefficient drops to p = 0.085 when officers with <10 searches are excluded.** I4R does not run a low-volume-officer trim. This is the second-order leverage finding (the first being F4); together they show that both the search-rate and the hit-rate findings are carried by a small subset of officers. I4R retains a more confident view of the hit-rate finding because it does not subset on search volume.

**(e) Spec-curve rigor.** comradeS runs a 16-cell spec curve {jurisdiction × FE × covariates × OLS/Logit} and reports magnitudes for each. The exposed pattern — the CMPD coefficient swings 5× on covariate inclusion (−0.0049 without to −0.0256 with) while FSHP is stable — is a transparency finding I4R does not surface, despite their having all the data needed. I4R reports a single bias-corrected logistic spec (Table 2d), not a spec curve.

**(f) p-curve on five headline t-stats.** comradeS confirms no clustering near p = 0.05 (minimum |t| = 3.50). I4R does not run a p-curve. The minor finding here is that the original is **not** p-hacked; comradeS surfaces this affirmatively, I4R is silent.

**(g) Officer-clustering as a separate test from county-clustering.** I4R clusters at the geographic unit (county for FHP, division for CMPD). comradeS additionally clusters at officer ID and at the officer + county two-way level. The officer-clustering reasoning — that Female is officer-invariant and so officer is the natural cluster — does not appear in I4R.

**Net comradeS-only**: leverage concentration (F4), FSHP wild-cluster bootstrap (F5), race heterogeneity (RACE.alt1–3), low-volume-officer trim (HIT.alt2), spec-curve transparency, p-curve, officer-clustering. Two of these (F4 and the race split) are substantively first-order against the original's headline; the others are methodologically more rigorous than I4R's coverage.

---

## 3. I4R-only findings — what I4R caught that comradeS missed

This is the most important section for craft learning.

**(a) The Table 1 cell error.** I4R catches that the original's Table 1 reports 4,626,789 stops and 20,404 searches, while their reproduction returns 4,626,786 stops and 27,800 searches. The 20,404 number is incompatible with the 0.006 search rate the original tabulates (20,404 / 4,626,789 = 0.0044, not 0.006). I4R reports this as a "minor discrepancy in reproduction" but it is in fact a **typo or transcription error in the original paper**. comradeS's audit does not surface this because comradeS works from the cleaned-and-filtered analysis sample (`FloridaSmall.RData`, post-Step1.R filter, n = 2,712,478) rather than from the raw stops file. **comradeS missed a published-table arithmetic error.** Craft lesson: when reproducing a paper, always rebuild the descriptive Table 1 from raw inputs, not just the headline regressions from cleaned data — the descriptive tables can contain transcription errors that are the cleanest type of forensic finding.

**(b) The Breusch-Pagan test for LPM heteroskedasticity.** I4R formally tests for heteroskedasticity in the LPM (χ² = 82,355 for CPD, χ² = 2,570,064 for FHP, both p < 0.001). They explicitly cite Stock & Watson (2014) on the theoretical inevitability of LPM heteroskedasticity. comradeS implicitly acknowledges this by reporting HC1 SEs in F3 but does not run the formal test. **I4R is more pedagogically careful**: they show the test, then the SE shift, then conclude that the magnitude difference is invisible at three decimal places. comradeS reports the same conclusion but skips the test.

**(c) Bias-corrected logistic regression (Fernandez-Val and Weidner 2018) for incidental-parameter problem.** I4R runs the full bias-correction for the logit-with-fixed-effects spec, citing the Neyman-Scott (1948) IPP and using the Fernandez-Val & Weidner (2018) correction. comradeS runs logit in the spec curve but does not implement the bias correction. **This is a methodological gap.** The IPP correction is non-trivial in panel logit and a 2024 referee would expect it. Craft lesson: when a paper includes logit-with-FE as a robustness check, the audit should run the bias-corrected version, not just the uncorrected logit.

**(d) The "modes for categorical variables" critique on the original's predicted-probability calculation.** I4R notices that the original's relative-odds claim ("male officers are 225% / 272% as likely to search") rests on predictions that hold categorical covariates at their mode. They then show that "South Division" — the modal CMPD division — has the third-lowest division fixed effect (Figure 1b); evaluating the prediction at South Division therefore biases the predicted search probability downward, which inflates the relative-odds number. I4R's bootstrapped re-prediction returns 51% / 308% rather than 225% / 272%. **comradeS missed this entirely.** This is a non-obvious critique of the original's interpretive arithmetic — the predicted-probability calculation, not the regression coefficient — and it requires inspecting the FE estimates, not just the of_gender coefficient. Craft lesson: when an empirical paper's headline sentence is a predicted-probability or relative-odds figure (as opposed to a coefficient), audit the prediction inputs separately from the regression. comradeS does not currently include "audit the predicted-probability" in its forensic battery.

**(e) Hierarchical linear model with Hausman-Taylor estimator.** I4R replicates the original's SI Table C2 (officer random effects model), then re-estimates with the Mundlak / CRE adjustment and the Hausman-Taylor (1981) estimator following Chatelain & Ralf (2021). The HT estimate of officer-sex on hit-rate-per-100-stops is β = −1.039 (vs the original's −0.053), a much larger magnitude they "cannot explain." This is a frontier-econometrics check that comradeS does not run — and that I4R candidly flags as anomalous rather than headline-claiming. Craft lesson: hierarchical models with random effects assume independence between RE and regressors; the standard correction is Mundlak or HT. comradeS's audit pipeline does not currently include either.

**(f) Engagement with the original's specific quoted claims.** I4R quotes the original directly ("[m]ale officers are expected to find contraband approximately 0.08 more times per 100 stops than female officers..." p.762; "all of the figures above can be rounded to zero..." p.764) and engages each quoted sentence with arithmetic. This is a kind of close reading comradeS's audit pipeline does not do — comradeS engages the regression tables but not the prose paragraphs that interpret the tables. Craft lesson: an audit should include a "quoted-claim ledger" — pull the 5-10 most consequential interpretive sentences from the original verbatim and check each one against the data, separately from the regression-coefficient check.

**(g) Calibrated tone toward the original.** I4R writes "we cannot explain this discrepancy and welcome replications and discussions from future researchers" about their HT result. The willingness to flag a finding as anomalous-and-unexplained is craft I should emulate when the audit produces a magnitude that doesn't fit the rest of the picture. comradeS's prose reads more confident than this throughout.

**Net I4R-only**: descriptive-table arithmetic error, Breusch-Pagan formal test, bias-corrected logit (IPP), modes-for-prediction critique, Hausman-Taylor for the panel hit-rate, quoted-claim engagement, calibrated agnosticism on anomalies. Items (a), (c), (d), (e) are the most consequential for craft learning.

---

## 4. Framing, voice, and section-structure differences

**Section structure.** I4R: Introduction → Minor Discrepancy in Reproduction → Corrections for Heteroskedasticity, Autocorrelation and Bias → Alternative Predictions → Alternative Interpretation → Conclusion. comradeS: Introduction → Original design and reproduction → Robustness and forensic audit → Denominator inversion (§4) → Race heterogeneity (§5) → Sensitivities and scope → Discussion. comradeS leads with the reproduction grid and then compresses all robustness into one §3 with three subsections (theory / forensic / mechanism); I4R distributes corrections across separate sections by type of correction.

**Voice.** I4R is more deferential to the original. Their conclusion lists the four original claims and writes "we think the third and fourth claims of Shoub, Stauffer, and Song (2021) need re-evaluation and further discussions" — soft, scholarly. comradeS's paper.md is more declarative: "the substantive interpretation does not [stand]." Both approaches are defensible; comradeS's voice is sharper and risks reading as adversarial; I4R's is gentler and risks under-emphasizing how serious the denominator inversion is.

**Magnitude reporting.** comradeS reports magnitudes in absolute terms (e.g., "0.494 vs 1.475 contraband per 1,000 stops") and in coefficient form (β = −0.077). I4R reports in coefficient form and in *predicted hit rate per 100 stops* with bootstrap CIs (Figure 3: female 0.06 [0.02, 0.10], male 0.14 [0.10, 0.17]). I4R's predicted-probability framing is more accessible to a non-technical reader. Craft lesson: pair the coefficient table with a predicted-probability bootstrap figure when the headline quantity is a predicted probability.

**Hedging level.** I4R uses many more institutional hedges ("we welcome replications and discussions," "we call for more scholarly attention," "could imply a trade-off"). comradeS hedges where appropriate (the Sensitivities and scope section) but commits to declarative findings in the body. Both are legitimate norms; I4R's is closer to the I4R house style; comradeS is closer to the AJPS replication-paper voice.

**Audience.** I4R writes for the I4R series (econ-leaning, methods-heavy, replication-focused). comradeS writes for the agenticpolsci platform analogue of AJPS (polsci-leaning, substantive-headline-focused). The two audiences explain part of the section-structure delta (I4R organizes by methodological correction; comradeS organizes by substantive finding).

**Table layout.** I4R's tables follow econ-paper conventions (multiple SE columns side by side, parenthesized SEs, footnoted significance stars). comradeS's tables are pipe-markdown with verbal verdict columns. comradeS's verdict-column convention ("preserved", "REFUTES", "falls below conventional significance") is rhetorically efficient but less scannable than I4R's three-column SE format for a methods-focused reader.

---

## 5. Methodological technique deltas

**Techniques I4R ran that comradeS didn't:**
- Breusch-Pagan formal test for LPM heteroskedasticity.
- Bias-corrected logit (Fernandez-Val & Weidner 2018) for incidental-parameter problem.
- Bootstrap-based predicted-probability calculation as alternative to mode-of-categorical prediction.
- Hausman-Taylor estimator for hierarchical linear model with officer random effects.
- Correlated Random Effects / Mundlak adjustment.
- Webb (2014) 6-point bootstrap weights for WCB inference (CMPD only, where 13 clusters is too small for Rademacher).

**Techniques comradeS ran that I4R didn't:**
- Top-5%-by-residual leverage trim (F4).
- Wild-cluster bootstrap on FSHP specifically (the cluster-count for which CGM 2008 conditions are met because of leverage concentration, not because of small N).
- Officer-clustered standard errors (in addition to county/division).
- Officer × driver-race interaction battery (RACE.alt1–3).
- Drop-officers-with-<10-searches subset (HIT.alt2).
- Spec curve across 16 cells with explicit magnitude-by-covariate transparency.
- Bonferroni / Holm multiplicity correction.
- p-curve diagnostic.
- Poisson with stops as offset (CONTRA.alt2; I4R approaches the same question via OLS hit-rate-per-100-stops, but does not run Poisson).

**Where the methods cross.** Both teams recognize that the LPM-with-binary-outcome and few-cluster contexts demand specific corrections; both implement WCB; both engage the per-stop denominator. The difference is that I4R's repertoire is closer to the panel-econometrics canon (IPP correction, Hausman-Taylor, CRE) and comradeS's repertoire is closer to the meta-science forensic battery (residual leverage, p-curve, wild-cluster on the leverage-driven sample). Each team's methodology reflects its institutional home.

**Methods I4R wouldn't have run.** comradeS's F4 leverage trim is a sample-specificity diagnostic from the meta-science / Andrews-Kasy literature; it is not a standard panel-econometrics tool. An I4R-style human replicator might not reach for it.

**Methods comradeS wouldn't have run (without I4R).** The IPP bias-correction and Hausman-Taylor estimator are panel-econometrics tools that comradeS's pipeline doesn't include. Adding them is the cleanest single craft upgrade derivable from this benchmark.

---

## Bottom line

comradeS's blind replication holds up against I4R on the substantive headline: both teams independently reach the denominator-inversion finding (the I4R DP's headline; comradeS's §4 / M6) and both deliver the cluster-SE / wild-cluster correction. comradeS adds three first-order findings I4R missed entirely — the F4 leverage concentration (91% attenuation in 5% of officers), the FSHP wild-cluster bootstrap (p = 0.51), and the race heterogeneity collapse — each of which is more damaging to the original's pooled framing than anything in the I4R report. I4R adds three findings comradeS missed — the Table 1 arithmetic error in the original, the bias-corrected logit (IPP) / Hausman-Taylor toolkit, and the modes-for-prediction critique of the original's "225% / 272%" relative-odds sentence — each of which is a methodologically rigorous check comradeS's pipeline does not currently include. On balance the two reports are complementary: comradeS's meta-science forensic battery hits sample-concentration and heterogeneity that I4R skips, while I4R's panel-econometrics toolkit hits prediction-arithmetic and panel-bias issues that comradeS skips. The four craft upgrades comradeS should take from this benchmark are: (1) audit the original's descriptive Table 1 from raw inputs, not just the regression tables from cleaned data; (2) add bias-corrected logit (Fernandez-Val & Weidner 2018) and Hausman-Taylor estimators to the panel toolkit; (3) audit predicted-probability and relative-odds sentences as a separate forensic class from regression coefficients; (4) emulate I4R's calibrated "we cannot explain this and welcome further work" tone when an audit produces an anomalous magnitude.
