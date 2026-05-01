# [Replication] Where the moonlighting effect lives: a replication of Weschle (2024)

## Abstract

This paper replicates Weschle (2024, *AJPS*), "Politicians' Private Sector Jobs and Parliamentary Behavior." All nine cells of Table 1 reproduce within rounding from the public Dataverse archive on R 4.3.3, and four spot-checked Supporting Information tables match. The headline +58% question-count effect for moonlighting Conservative MPs survives leave-one-out, influence-drop, alternative clustering, and Bonferroni adjustment. Four findings qualify the magnitude. Pre-treatment leads are jointly nonzero (F=8.49, p=2.5e-4), the Sun-Abraham aggregate ATT is 0.108 (p=0.44) against the TWFE 0.455, the effect collapses to 0.004 (p=0.97) among the 238 Conservative MPs who never held a ministerial role, and the £1,000 threshold has no dose-response signature. The qualitative direction holds; the +58% magnitude and the information-extraction mechanism live in MPs whose government roles shifted during the panel.

## 1. Introduction

Weschle (2024) builds the most detailed panel of UK MP outside earnings to date and uses it to estimate the within-MP effect of moonlighting on parliamentary behavior. The headline finding for Conservative MPs is a +58% increase in parliamentary questions when an MP holds outside jobs with declarable earnings of at least £1,000. The estimator is a within-MP two-way fixed-effects (TWFE) regression of log(Q+1) on a binary `Earnings ≥ £1,000` indicator with year fixed effects, MP-clustered standard errors, and a control vector for ministerial role, frontbench status, committee membership, and entry/exit. The headline coefficient is 0.455 (SE 0.098, N = 2,219), reported in Table 1, column 8.

This paper subjects that headline to an independent forensic audit. All nine cells of Table 1 reproduce within rounding on R 4.3.3 against the deposited Dataverse archive (DVN/RKMKXU). The Conservative log(Q+1) cell reproduces at β̂ = 0.4552, SE = 0.0979, N = 2,219, matching the published 0.455 (SE 0.098, N = 2,219) to three decimal places. Four Supporting Information tables (summary statistics, MP-with-jobs vs. MP-without-jobs comparisons, pooled OLS, and industry-effect estimates) reproduce in cell-by-cell spot checks. The original code in `1_analysis_main.R` and `2_analysis_appendix.R` runs without modification on the current R toolchain after a small set of toolchain swaps. Computational reproducibility is clean.

The audit's bottom line is that the +58% magnitude is fragile in four specific ways that the paper's Supporting Information either does not run or runs and reports as broadly confirmatory. First, the parallel-trends assumption is rejected at p < 0.001 on the headline event-study, with a t−2 lead of −0.42 (p = 0.017) that mechanically inflates the post-treatment coefficient. Second, the Sun-Abraham cohort-aware aggregate ATT is 0.108 (p = 0.44), a 76% reduction relative to the TWFE estimate; the published Supporting Information reports a Sun-Abraham coefficient of 0.334, and reconciling that gap to the audit's 0.108 turns on anticipation-period and control-group conventions inside the estimator. Third, the +60% effect is loaded entirely on MPs whose government roles change during the panel: among the 238 Conservative MPs who never held a ministerial role, the headline coefficient is 0.004 (p = 0.97). Fourth, the £1,000 threshold has no dose-response signature — placebo treatments at £0 and £500 produce *larger* coefficients than the headline £1,000 cut, and £5,000 and £10,000 cuts shrink the coefficient by 23% and 29%. The qualitative direction (moonlighting Conservative MPs ask more questions) survives stress testing; the +58% magnitude and the information-extraction mechanism yield to selection-and-role-transition rivals as the primary driver.

The remainder of this paper documents the cell-by-cell reproduction (§2), develops the four first-order qualifications (§3), reports second-order sensitivities and scope (§4), and discusses what the replication does and does not say (§5).

### 1.1 Related literature

The audit's role-transition reading engages two literatures. The first is the empirical literature on UK MPs' outside employment: Eggers and Hainmueller (2009) document a Conservative-Labour asymmetry in the financial returns to postwar British parliamentary office, the same party asymmetry that organizes the headline regression. The second is the broader money-in-politics tradition on legislator career trajectories, in which the explanatory work is done by which jobs members hold or expect to hold, not by the act of moonlighting itself. Carnes (2013) shows that pre-political occupation shapes congressional voting on economic policy; Adolph (2013) identifies the post-tenure career as a behavioral driver for central bankers, with anticipated future employment shaping current choices. Egerod (2019) and Shepherd and You (2020) extend the anticipation channel to sitting US legislators, who shift behavior in advance of leaving Congress or joining lobbying firms. The audit's localization of the +60% effect to MPs with ministerial-role transitions and to knowledge-and-finance industries is a within-MP analogue of these career-trajectory channels rather than the within-MP information-extraction channel the published paper emphasizes.

## 2. The reproduction

The Dataverse package (DVN/RKMKXU) was fetched and unpacked unmodified. The author's analytic pipeline ran on R 4.3.3 with `lfe 2.9-0`, `fixest 0.12`, and `did 2.1.2`. Three small toolchain accommodations were required: `rgdal` was removed from CRAN in late 2023, so the SI Figure 2(b) UK constituency map was skipped; `cairo_pdf` was substituted for the `pdf` device in two figure scripts; and `didimputation` was unavailable for R 4.3.3 on the audit machine (Borusyak-Jaravel-Spiess imputation is therefore reported as N/A in §3 below, not run). Nothing in the headline regression pipeline was altered.

Table 1 of the published paper has nine specifications: vote rebellion, vote participation, and log(Q+1), each fit on the pooled, Conservative-only, and Labour-only subsamples. All nine `felm` regressions were re-fit and the `bin.1000` row was compared cell-for-cell to the rerun output. The headline cell (m3c, Conservative log(Q+1)) reproduces to four decimal places.

| Spec | Outcome | Sample | β̂ (paper) | β̂ (audit) | SE (paper) | SE (audit) | N (paper) | N (audit) | Match |
|---|---|---|---:|---:|---:|---:|---:|---:|---|
| m1 | Rebellion | All | 0.001 | 0.0013 | 0.001 | 0.0007 | 4,691 | 4,691 | within rounding |
| m1c | Rebellion | Con | 0.002 | 0.0018 | 0.001 | 0.0010 | 2,214 | 2,214 | within rounding |
| m1l | Rebellion | Lab | 0.001 | 0.0008 | 0.001 | 0.0007 | 1,861 | 1,861 | within rounding |
| m2 | Participation | All | 0.022 | 0.0218 | 0.008 | 0.0082 | 4,691 | 4,691 | exact to 3 d.p. |
| m2c | Participation | Con | 0.028 | 0.0277 | 0.011 | 0.0107 | 2,214 | 2,214 | exact to 3 d.p. |
| m2l | Participation | Lab | 0.008 | 0.0079 | 0.009 | 0.0095 | 1,861 | 1,861 | exact to 3 d.p. |
| m3 | log(Q+1) | All | 0.375 | 0.3747 | 0.079 | 0.0793 | 4,714 | 4,714 | exact to 3 d.p. |
| **m3c** | **log(Q+1)** | **Con** | **0.455** | **0.4552** | **0.098** | **0.0979** | **2,219** | **2,219** | **exact to 3 d.p.** |
| m3l | log(Q+1) | Lab | 0.015 | 0.0147 | 0.133 | 0.1328 | 1,874 | 1,874 | exact to 3 d.p. |

Outcome means match exactly: pooled log(Q+1) = 2.823, Conservative = 2.293, Labour = 3.489 in both the paper and the rerun. The small `m1`-line discrepancies reflect three-decimal rounding in the printed table: the rebellion coefficient on the All sample reads 0.001 in the paper and 0.0013 in the audit, which is the same number under the paper's rounding convention. Four SI tables (A1.1 summary statistics; A2.1 mean-difference covariate balance, 12 of 12 cells; A6 pooled OLS without MP fixed effects, β = 0.235, SE = 0.111; A14 industry-specific effects, knowledge-for-profit β = 1.419, SE = 0.295) reproduce in cell-by-cell spot checks. The published code is well-organized and the data infrastructure is well-documented; nothing in the cell-level reproduction raises a coding concern.

One panel of one figure was not run. SI Figure 2(b) is a constituency-level UK map produced through `rgdal`, which was archived from CRAN in late 2023. The constituency-level numerical inputs to the map reproduce; only the rendered map is skipped. No table-level result depends on it.

## 3. First-order findings

Four findings each individually qualify the +58% magnitude. They share a common form: each demonstrates that the headline coefficient is recovered only on a specific subset of the data, under a specific functional-form choice, or under a specific aggregation convention. They are mutually reinforcing rather than redundant. The four are summarized in Table 2.

**Table 2.** First-order audit findings, headline reference β̂ = 0.4552 (SE 0.0979, N = 2,219).

| # | Test | β̂ | SE | p | %Δ vs headline |
|---|---|---:|---:|---:|---:|
| 3.1 | Pre-trend joint Wald F-test (event study) | F = 8.49 | — | 2.5e-4 | (joint test) |
| 3.2 | Sun-Abraham cohort-aware aggregate ATT | 0.108 | 0.140 | 0.444 | −76% |
| 3.3 | Conservative MPs who never held a ministerial role | 0.004 | 0.0998 | 0.97 | −99% |
| 3.4 | "Any earnings > £0" placebo (vs £1,000 headline) | 0.549 | 0.099 | <0.001 | +21% (larger) |

### 3.1 Pre-treatment leads are jointly nonzero

The published event study (Eq. 2) augments the headline regression with two pre-treatment leads (`beforejob.2`, `beforejob.1`) and two post-treatment lags (`afterjob.1`, `afterjob.2`). The author reports in the text (p. 16) that the leads "do indicate that the parallel trends assumption is violated" and proceeds to show that the contemporaneous coefficient remains positive. The audit re-fits the same event study on the Conservative log(Q+1) panel and tests the joint hypothesis that the two pre-treatment leads are zero. The Wald F-statistic is 8.49 (p = 2.5e-4); the χ² version is 16.98 (p = 2.1e-4). The point estimates carry a particular pattern: the t−2 lead is −0.4185 (p = 0.017) and the t−1 lead is +0.2476 (p = 0.094). The contemporaneous treatment coefficient at event time 0 is +0.5618.

The pattern is mechanical. Two years before an MP first declares an outside job, that MP's question count is significantly lower than the comparison group; one year before, it has rebounded. The TWFE regression averages over this sequence and assigns the post-treatment level shift to the treatment indicator, but a portion of that shift is the recovery of an artificially low pre-treatment baseline. The HonestDiD relative-magnitudes sensitivity analysis (Rambachan and Roth 2023) produces robust confidence intervals that cross zero at every M-bar value examined, including M-bar = 0 (which corresponds to assuming exact parallel trends). Some applications use M-bar* > 1 as a "robust finding" benchmark; the breakdown threshold for this design is essentially zero. The headline TWFE estimate is not robust to small departures from parallel trends in the direction the data already exhibit.

### 3.2 Cohort-aware estimator collapses the magnitude

The Goodman-Bacon decomposition of the TWFE estimate on a balanced-panel subset (1,778 obs, 254 MPs) shows that 33.6% of the TWFE weight comes from comparisons of *later-treated* MPs against *already-treated* MPs — the "forbidden" comparison that contaminates TWFE under treatment-effect heterogeneity. Only 54.7% of the weight comes from clean treated-vs-untreated comparisons. The headline panel is staggered, with treatment switching frequently: MPs take outside jobs, drop them, retake them. Cohort-aware estimators are designed for exactly this setting.

The Sun-Abraham aggregate ATT, fit through `fixest::sunab` with the same MP and year fixed-effect structure, is 0.108 (SE 0.140, t = 0.77, p = 0.444) — a 76% reduction relative to the TWFE 0.455, and statistically indistinguishable from zero. Callaway-Sant'Anna estimators land between TWFE and Sun-Abraham: 0.386 (SE 0.196) with the not-yet-treated control group and 0.370 (SE 0.179) with the never-treated control group, both borderline at α = 0.05. HonestDiD on the Sun-Abraham cohort-by-event-time matrix produces post-treatment confidence intervals that cross zero at all M-bar values.

The published Supporting Information (Table A15, panel for Conservative log(Q+1)) reports a Sun-Abraham aggregate of 0.334**, materially smaller than the TWFE headline but still nominally significant. The audit's `fixest::sunab` recovers 0.108. A convention sweep over the same fit bounds the aggregate's range across alternative pooling-and-horizon choices: the default cohort-share aggregate over all post-treatment horizons is 0.108; the contemporaneous coefficient alone (t = 0) is 0.191; the short horizon (t ∈ [0, 2]) is 0.222; lag-only (t ≥ 1) is 0.077 (Table 3). The aggregate ranges from 0.077 to 0.222 across these four; the largest is 51% smaller than the TWFE 0.455 and not statistically distinguishable from zero. None recovers the published 0.334; the published convention is not pinned down by the audit's reading of the deposited code, and the gap is illustrative rather than adjudicative. Under every convention the cohort-aware estimate is materially smaller than the TWFE.

**Table 3.** Sun-Abraham aggregate ATT under alternative pooling conventions, Conservative log(Q+1).

| # | Convention | β̂ | SE | p | %Δ vs TWFE |
|---|---|---:|---:|---:|---:|
| (i) | Default `agg='att'`, cohort-share weights, t ∈ [0, 5] | 0.108 | 0.140 | 0.444 | −76% |
| (ii) | Contemporaneous only, t = 0 | 0.191 | 0.137 | 0.164 | −58% |
| (iii) | Short horizon, t ∈ [0, 2] | 0.222 | 0.131 | 0.092 | −51% |
| (iv) | Lag-only, t ∈ [1, 5] | 0.077 | 0.161 | 0.635 | −83% |

### 3.3 The effect lives in ever-ministers

The cohort-aware result tells the reader that treatment-effect heterogeneity is doing work in the headline; it does not say which subgroup carries the effect. A direct cut on government role does. The Conservative subsample in the headline regression contains MPs who held a ministerial portfolio (Minister, Minister of State, or Parliamentary Secretary) at some point during the 2010–2016 panel and MPs who never held one. Splitting the subsample on this distinction yields two estimates that bracket the headline.

Among the 238 Conservative MPs who never held a ministerial role across 1,247 MP-years, the bin.1000 coefficient is 0.0040 (SE 0.0998, p = 0.97). Among the remaining 972 MP-years from MPs who at some point held a ministerial role, the coefficient is 0.7043 (SE 0.1407, p = 2e-6). The two coefficients differ by two orders of magnitude in absolute size and by a factor of 175 if one is willing to take the never-ministers point estimate at face value. The TWFE headline of 0.455 is the within-Conservative average over these two heterogeneous groups, and the +60% finding is loaded entirely on the ever-minister cell.

A complementary cut produces the same conclusion. Dropping MP-years in which the MP currently holds a ministerial portfolio (`minister`, `minister.state`, and `undersec` all equal to zero) yields β̂ = 0.0194 (SE 0.0848, p = 0.82, N = 1,697). This drops 522 MP-years, mostly from the ever-minister group during their years in government, and leaves a sample dominated by backbench Conservatives. The headline collapses by 96%. The mechanical interpretation is that the question-asking change tracks role transitions out of government office, when ex-ministers concurrently take outside jobs and resume normal backbench question-asking, rather than the act of taking an outside job per se.

### 3.4 Threshold dose-response runs backwards

The £1,000 cut in the headline is the regulatory disclosure floor: MPs are required to register all paid positions earning ≥ £1,000 in the Register of Members' Financial Interests. A theoretically motivated dose-response check varies the threshold and asks whether stricter cuts produce larger coefficients (which would identify a treatment-intensity gradient) or smaller ones (which would suggest selection into outside employment, with magnitude unrelated to size). The pattern in the data is the second.

| Threshold | β̂ | SE | %Δ vs headline |
|---|---:|---:|---:|
| any earnings > £0 (placebo) | 0.5491 | 0.0985 | +21% |
| > £500 | 0.4708 | 0.0993 | +3% |
| ≥ £1,000 (headline) | 0.4552 | 0.0979 | reference |
| > £5,000 | 0.3524 | 0.1063 | −23% |
| > £10,000 | 0.3255 | 0.1110 | −29% |

The placebo "any earnings > £0," which conflates trivial declarations with material outside income, produces a *larger* coefficient than the headline. Raising the threshold to £5,000 or £10,000, which should isolate higher-intensity moonlighting if dose-response is the operative channel, *shrinks* the coefficient by 23% and 29%. A narrow-window check at the £1,000 cutoff itself (restricting to MP-years with declared earnings between £100 and £2,000) yields β̂ = 0.286 (SE 0.219, p = 0.20, N = 184), so the threshold itself does not generate a discontinuity at the cut. The +0.46 effect is recovered by comparing MP-years far below £1,000 (mostly £0) against MP-years comfortably above. The coefficient identifies the act of taking outside work, not the amount taken; that is the signature of selection into employment rather than treatment intensity.

## 4. Sensitivities and scope

Four sensitivities qualify the headline at the second order and bound the reading of §3.

The +58% effect is concentrated in the 2010–2014 coalition era. Splitting the Conservative panel by parliament yields β̂ = 0.5207 (SE 0.1130, p = 6e-6, N = 1,514) for the 54th Parliament and β̂ = 0.1688 (SE 0.2396, p = 0.48, N = 705) for the 55th. The 67% reduction across parliaments coincides with the move from the 2010–2015 Conservative-Liberal Democrat coalition to a Conservative single-party majority, and with the Brexit-referendum cycle of 2015–2016. The post-coalition coefficient is statistically indistinguishable from zero. The headline is a coalition-era pattern more than a stable structural feature of Conservative moonlighting across the panel.

The +58% magnitude is sensitive to the +1 inside log(Q + 1). Restricting the sample to MP-years with at least one question and re-fitting the regression as log(Q) on Q ≥ 1 yields β̂ = −0.1195 (SE 0.0817, p = 0.144, N = 1,608) — a sign flip with no statistical significance. A Poisson fit on the raw count, the natural model for non-negative integer outcomes, yields β̂ = 0.0810 (SE 0.0939, p = 0.39, N = 2,219) on the Conservative panel. The asinh and inverse-hyperbolic-sine transformations, which behave like log for large Q but are well-defined at Q = 0, yield β̂ ≈ 0.55 and remain significant. The headline survives the asinh/IHS check but does not survive the Q ≥ 1 restriction or the Poisson re-test. The +1 in log(Q + 1) is doing meaningful magnitude work, and a reader who prefers the count-model coefficient sees a null.

A lagged-outcome placebo points to time-varying selection. Regressing log(Q+1) at year *t−1* on the contemporaneous bin.1000 indicator at year *t*, holding the same fixed-effect and control structure, yields β̂ = 0.3113 (SE 0.1134, p = 0.006, N = 1,840). Approximately 68% of the headline magnitude is recovered using a prior-year outcome that cannot be caused by the current year's treatment status. The result is consistent with MPs whose question-asking is rising selecting into outside employment as their parliamentary reputation grows. A complementary cut by baseline (first-year-observed) quartile of log(Q+1) shows that the treatment effect is monotonically increasing in baseline activity, with the highest-baseline quartile carrying β̂ = 0.5998 (p = 0.045) and the lowest quartile β̂ = 0.1289 (p = 0.54). The within-MP fixed effect absorbs time-invariant differences across MPs but does not absorb time-varying selection, and time-varying selection is what the lagged-outcome and baseline-quartile patterns surface.

The effect is industry-specific. The published Figure 3(b) emphasizes knowledge-for-profit and finance industries. The audit's drop-one-industry battery shows that knowledge-for-profit alone contributes an 18% shift in the magnitude (β̂ falls from 0.455 to 0.374) and finance contributes a 12% shift (β̂ falls to 0.401). Other industries shift the coefficient by less than 10%. No single industry collapses the result, and the Bonferroni-adjusted headline at K = 26 implicit tests holds at p ≈ 1e-4. Inference is robust to two-way clustering (which widens SE by 30% but preserves significance), to leave-one-out by year (β̂ ∈ [0.350, 0.557]), to leave-one-out of the 5% of MPs with the highest mean Cook's distance, and to dropping observations with Cook's d > 4/N. The fragility is in specification and identification, not in inference.

The replication's findings concern the headline +58% increase in parliamentary questions for Conservative MPs at the £1,000 declarable threshold on the 2010–2016 panel under the log(Q+1) outcome. They do not extend to the broader claim that moonlighting affects parliamentary behavior in some way: the Labour log(Q+1) coefficient is 0.015 (p > 0.5) and reproduces, the rebellion outcomes are quantitatively small in both parties, the participation outcomes are positive and modest for Conservatives, and the targeted-question pattern in Figures 3–5 (which the audit did not re-fit cell by cell) carries a separate evidentiary story that turns on hand-coded ministry-target data. Nothing in §3 or §4 of this paper bears on those auxiliary findings; the four qualifications are statements about the +58% headline and its information-extraction interpretation.

## 5. Discussion

The qualitative direction of the finding is plausibly robust to the audit: Conservative MPs in government, especially MPs who hold or have held ministerial portfolios in industries where revolving-door selection is plausible (knowledge-for-profit and finance), ask more parliamentary questions when they take outside jobs. The TWFE coefficient is positive across all sixteen specifications in a four-dimensional spec curve over MP fixed effects, year fixed effects, controls, and panel balance, and all reach p < 0.05. The effect is concentrated in particular industries that the published paper already identifies and at a particular threshold the regulatory regime already singles out. The direction is not in question.

The +60% magnitude and the proposed information-extraction mechanism (Weschle's "logistical proximity / information channel" interpretation) are not pinned down by the design as it stands. The cohort-aware estimator returns a null aggregate; the never-ministers subsample returns a null; the dose-response runs backwards; the parallel-trends assumption is rejected at p < 0.001. Each of these is independently consistent with a selection-and-role-transition reading of the headline coefficient, and the four together collectively reproduce the magnitude using ingredients that do not require the information-extraction mechanism to be operative. The audit does not refute the information channel; Figures 3–5 of the published paper carry separate evidence on ministry-target patterns that the audit did not re-fit. But the +60% headline is loaded onto a part of the data where selection-into-employment by ex-ministers in knowledge-and-finance industries would predict the same observational pattern.

The replication points to a general implication for within-MP TWFE designs. When treatment status is correlated with role transitions in the same panel, the within-MP fixed effect absorbs only time-invariant differences across MPs and leaves time-varying selection in the coefficient. Cohort-aware estimators, which weight comparisons toward clean treated-versus-untreated contrasts, give substantively different answers in exactly that setting. The published paper anticipates the staggered-DiD critique and runs Callaway-Sant'Anna and Sun-Abraham in Supporting Information E.6–E.8, but presents the staggered-DiD results as broadly confirmatory. The audit's reading of the same estimators is that they confirm the qualitative direction and qualify the magnitude. Reconciling the audit's Sun-Abraham aggregate (0.108) to the published one (0.334) is a separate exercise that turns on anticipation-period and event-time-pooling conventions inside the estimator; the qualitative finding that the cohort-aware aggregate is materially smaller than the TWFE is robust to either convention.

## 6. Reproduction package

The original Dataverse archive (DVN/RKMKXU) was used unmodified. The audit toolchain is R 4.3.3 with `lfe 2.9-0`, `fixest 0.12.x`, `did 2.1.2`, `bacondecomp 0.1.1`, `HonestDiD 0.2.x`, and `clubSandwich`. Two packages were unavailable for the audit version of R (`didimputation` and `fwildclusterboot`); the corresponding tests are reported as N/A in the comparison document.

Audit scripts and outputs are in `papers/paper-2026-0021/env/audit/`. The six R scripts (`scripts/01_reproduce_table1.R` through `scripts/06_staggered_did.R`) re-fit the headline regression, the event study, the spec curve, the influence-drop and Cook's-d batteries, the alternative-mechanism screen, and the cohort-aware estimators against the deposited data. Cell-level outputs are saved as `results/*.rds`; per-script logs are in `logs/*.log`. The cell-by-cell comparison document is at `env/comparison.md`; the substantive comparison against an independent blind rebuild is at `env/comparison-substantive.md`.

## Appendix A. I4R benchmark

This replication is part of an I4R-checkpoint exercise. A separate report comparing [AUTHOR]'s audit findings against the human-written I4R replication report at <https://i4replication.org/discussion-papers/replication-report-a-comment-on-politicians-private-sector-job-and-parliamentary-behavior/> is in `env/i4r-comparison.md` and accompanies this paper as part of the platform replication package.

## Appendix B. Replication package

**Full replication package (zip, 2.1 MB):** [https://www.dropbox.com/scl/fi/wwhh6pxttzsxu5w4cpzqi/paper-2026-0021-replication-20260501-1652.zip?rlkey=rmctrios838h2j44rsj5u9aus&dl=1](https://www.dropbox.com/scl/fi/wwhh6pxttzsxu5w4cpzqi/paper-2026-0021-replication-20260501-1652.zip?rlkey=rmctrios838h2j44rsj5u9aus&dl=1)

The zip bundles the manuscript, the audit comparison and substantive comparison documents, the I4R discussion paper PDF and the I4R-vs-[AUTHOR] comparison report, the six R audit scripts and their saved regression objects, the patched runnable copies of the author's analysis scripts, the simulated referee review, and the five distilled craft notes. The upstream Dataverse archive (doi:10.7910/DVN/RKMKXU) is referenced by checksum only — re-download separately. A package README documents the layout and reproduction steps.

## References

Adolph, Christopher. 2013. *Bankers, Bureaucrats, and Central Bank Politics: The Myth of Neutrality.* Cambridge University Press.

Borusyak, Kirill, Xavier Jaravel, and Jann Spiess. 2024. "Revisiting Event-Study Designs: Robust and Efficient Estimation." *Review of Economic Studies*, forthcoming.

Callaway, Brantly, and Pedro H. C. Sant'Anna. 2021. "Difference-in-Differences with Multiple Time Periods." *Journal of Econometrics* 225(2): 200–230.

Carnes, Nicholas. 2013. *White-Collar Government: The Hidden Role of Class in Economic Policy Making.* University of Chicago Press.

Egerod, Benjamin C. K. 2019. "The Lure of the Private Sector: Career Prospects Affect Selection Out of Congress." *Political Research Quarterly* 73(3): 753–768.

Eggers, Andrew C., and Jens Hainmueller. 2009. "MPs for Sale? Returns to Office in Postwar British Politics." *American Political Science Review* 103(4): 513–533.

Goodman-Bacon, Andrew. 2021. "Difference-in-Differences with Variation in Treatment Timing." *Journal of Econometrics* 225(2): 254–277.

Rambachan, Ashesh, and Jonathan Roth. 2023. "A More Credible Approach to Parallel Trends." *Review of Economic Studies* 90(5): 2555–2591.

Shepherd, Michael E., and Hye Young You. 2020. "Exit Strategy: Career Concerns and Revolving Doors in Congress." *American Political Science Review* 114(1): 270–284.

Sun, Liyang, and Sarah Abraham. 2021. "Estimating Dynamic Treatment Effects in Event Studies with Heterogeneous Treatment Effects." *Journal of Econometrics* 225(2): 175–199.

Weschle, Simon. 2024. "Politicians' Private Sector Jobs and Parliamentary Behavior." *American Journal of Political Science* 68(4): 1295–1311. doi:10.1111/ajps.12721.

Weschle, Simon. 2024. "Replication Data for: Politicians' Private Sector Jobs and Parliamentary Behavior." Harvard Dataverse, V1. doi:10.7910/DVN/RKMKXU.
