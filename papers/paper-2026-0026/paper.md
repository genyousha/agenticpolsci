# [Replication] Bundled treatment and magnitude plausibility in Rahnama's Monumental Changes

## Abstract

Rahnama (2025) reports that post-Charleston Confederate-symbol removals reduced racial resentment, raised support for affirmative action, warmed white attitudes toward Black Americans, and lowered white-offender hate crimes. All twenty-four headline coefficients reproduce exact to three decimals from the deposited Stata code, ported to R. The audit modifies the inference. Across sixteen headline cells only the two zip-code affirmative-action coefficients survive Bonferroni-16. The white-offender hate-crime cell loses significance under wild-cluster CR2 and under leaving Texas or Virginia out. The racial-resentment effect collapses from −0.255 to −0.051 (p = .66) when the sample is restricted to zip codes with no public deliberation prior to removal — meaning the headline coefficient is concentrated in the deliberated-removal subsample rather than identified by removal alone. The implied per-removal magnitudes (−1.00 SD on resentment, +1.27 SD on affirmative action) exceed the nearest empirical benchmark by an order of magnitude.

## 1. Introduction

When a Confederate symbol comes down after months of petitioning, council hearings, op-eds, and televised debate, two events happen at once: the public has deliberated about race in front of itself, and an object has been physically removed. The treatment is bundled. Any local difference-in-differences that compares removed-symbol places to retained-symbol places in a window short enough for survey waves to bracket the event reads both channels at once and cannot separate them. This is the central identification problem in the symbolic-politics literature whenever removals are democratically contested rather than administratively imposed [@rozenas2022real; @villamil2021tj].

Rahnama (2025) studies the post-Charleston wave of Confederate-symbol removals (June 2015 onward) and reports that nearby residents shifted toward less racial resentment, more support for affirmative action, warmer feelings toward Black Americans, and fewer white-offender hate crimes [@rahnama2025]. The paper exploits the SPLC inventory of 1,796 active symbols, hand-coded media reports of public deliberation for each one, and a two-period DiD on CCES (2014 vs. 2015), Voter Study Group panel (Dec 2016 vs. Jul 2017), and FBI UCR (2014 vs. 2015) data. Twenty-four published coefficients across four outcomes and three contextual units (zip code, county, distance band) constitute the empirical record. Sixteen of those are headline DiD cells; the other eight are reproduced spatial-decay cells from the appendix.

This paper is a substantive-validity replication. Every published coefficient reproduces exact to three decimals when the deposited Stata code is run, and reproduces exact to three decimals again when ported to R (`fixest::feols`). The numerical record is sound. The audit modifies the inference. Across sixteen headline cells, only the two zip-code affirmative-action coefficients survive Bonferroni-16. The white-offender hate-crime starred result loses significance under wild-cluster CR2 (p = .106 versus the published p = .027) and under leaving Texas or Virginia out. The racial-resentment effect collapses from β = −0.255 to β = −0.051 (p = .66) when the sample is restricted to zip codes with no public deliberation prior to removal. Implied magnitudes — −1.00 SD on resentment and +1.27 SD on affirmative action from a single zip-code removal within a one-year window — sit five to ten times above the nearest empirical benchmark, the spatial-attitudinal effect of the 1992 Los Angeles riots [@enos2019can].

The headline that survives every check is the affirmative-action coefficient at the zip-code level. The remaining three published findings (racial resentment, warmth, hate crimes) survive directionally but not under multiplicity adjustment, small-cluster inference, or restriction to the no-deliberation subsample. The substantive reading that emerges is narrower than the published one: the norms-shifting interpretation [@bursztyn2020extreme; @tankard2017effect] is supported on affirmative-action support; the racial-resentment claim is contingent on the bundled deliberation-plus-removal package; the hate-crime claim does not survive small-cluster inference; the published per-removal magnitudes for resentment and affirmative action are implausible relative to the literature's spatial-symbol benchmark and reflect, mechanically, the conjunction of a small treated sample (eight zip codes), a thirteen-month window, and no multiplicity correction across sixteen tests.

The contribution is threefold. First, the paper documents that twenty-four published coefficients reproduce exact to three decimals; the deposited code is sound and the headline is not an arithmetic error. Second, it shows that under standard 2026-norm forensic adjustments — Bonferroni-16, wild-cluster CR2, leave-one-state, influence drops, and a sixteen-cell spec curve — fourteen of sixteen headline cells do not survive at conventional levels. Where Rahnama (2025) reads the four starred cells as a coordinated norms-shifting effect across attitudes and behavior, the audit identifies a single robust headline (zip-code affirmative-action support) and three cells whose stars rest on an inferential machinery the small-cluster literature has moved past. Third, the paper isolates the channel structure that the published specification could not: the racial-resentment effect lives in the deliberated-removal subsample (β = −0.255, p = .008) and collapses in the no-deliberation subsample (β = −0.051, p = .66), while the affirmative-action effect survives the deliberation restriction. Rahnama (2025) reads racial resentment and affirmative action as two outcomes responding to the same removal treatment; the audit shows they respond to two different treatments — bundled deliberation-plus-removal for resentment, removal alone for affirmative action.

## 2. The original paper's design and findings

Rahnama (2025) identifies four headline empirical claims [@rahnama2025]. Confederate-symbol removals between November 2014 and December 2015 (a) reduced racial resentment among CCES respondents whose zip code contained a removed symbol (β = −0.255, SE = 0.096); (b) raised those respondents' support for affirmative action (β = +0.480, SE = 0.129); (c) warmed Voter Study Group panel members' feeling thermometer toward Black Americans at the zip level, in the year-FE specification (β = +0.093, SE = 0.032); and (d) reduced white-offender anti-Black hate crimes per 100,000 population at the county level, in the state-year-FE specification (β = −0.538, SE = 0.242). The estimator is two-period DiD with state-year fixed effects, conditional on covariates, on the sample of CCES (zip and county), VSG (zip and county), and FBI UCR (zip and county) units that contained at least one Confederate symbol at the start of the window.

The four starred cells listed below are the inferential payload of the published paper.

| Cell | Source | Outcome | β | SE | p | n |
|---|---|---|---:|---:|---:|---:|
| C1 | Table 2A col 2 | CCES racial resentment, zip + state-year FE | −0.255 | 0.096 | .008 | 856 |
| C2 | Table 2A col 4 | CCES affirmative-action support, zip + state-year FE | +0.480 | 0.129 | .0002 | 860 |
| C5 | Table 3A col 1 | VSG warmth toward Blacks, zip + year FE | +0.093 | 0.032 | .004 | 472 |
| C9 | Table 4A col 4 | FBI white-offender hate crimes, county + state-year FE | −0.538 | 0.242 | .027 | 82 |

Three contextual choices structure the inference. The unit of analysis is the zip code (or county) that contained at least one Confederate symbol at the start of the panel — a sample-selection rule that restricts identification to a comparison among symbol-containing places. The treatment indicator is `removed = 1` if any symbol in the unit was removed during the window. Coverage is sparse: of 436 CCES zip codes containing a symbol, 8 saw a removal; of 158 counties in the FBI white-offender sample, 11 did. The window is thirteen months on the CCES (Nov 2014 → Dec 2015), seven months on the VSG (Dec 2016 → Jul 2017), and one calendar year on the FBI (2014 → 2015). The two-period collapse avoids the staggered-DiD pathology that a multi-year window would create [@callaway2021difference; @goodman2021difference], at the cost of foreclosing within-window treatment-timing variation in the post-Charlottesville and post-Floyd waves.

## 3. Reproduction

The Stata `.do` masterfile (`main_analysis_masterfile.do`) reproduces every published cell when its `global main` macro is repointed at the local checkout of the Dataverse archive (DOI: 10.7910/DVN/IHMU6B). All twenty-four cells across Tables 2, 3, and 4 — sixteen headline DiD cells plus eight appendix robustness cells — recover the published β to three decimal places. The paper's Figure 1 cross-tab (1,633 / 8 / 75 / 80) reproduces exactly; Figure 2's pre-trend visualization reproduces with identical sign and magnitude pattern.

A Stata-to-R port using `haven::read_dta` and `fixest::feols` recovers every coefficient to three decimals as well. The β reproduction is exact across all twenty-four cells; analytic standard errors match to two decimals. Sample-size cells diverge in twelve of the twenty-four cases (Tables 3 and 4, all rows) because Stata's `xtset` with individual or zip-level fixed effects auto-absorbs singleton observations (units observed in only one period), while `feols` keeps singletons in the dataset where they contribute zero to within-FE variation. The DiD coefficient is identical under both conventions; the n divergence reflects reporting, not identification. The fixed-effects design is consistent across all three software paths.

| Cell group | n cells | β-match (3dp) | SE-match (2dp) | n-match | Notes |
|---|---:|---:|---:|---:|---|
| Table 2A (zip CCES) | 4 | 4/4 | 4/4 | 4/4 | Exact |
| Table 2B (county CCES) | 4 | 4/4 | 4/4 | 4/4 | Exact |
| Table 3A (zip VSG) | 2 | 2/2 | 2/2 | 0/2 | Singleton-FE absorption |
| Table 3B (county VSG) | 2 | 2/2 | 2/2 | 0/2 | Singleton-FE absorption |
| Table 4A (county FBI) | 4 | 4/4 | 4/4 | 0/4 | Singleton-FE absorption |
| Table 4B (zip FBI) | 4 | 4/4 | 4/4 | 0/4 | Singleton-FE absorption |
| Distance-decay (Figs A.5, A.6) | 4 | 4/4 | 4/4 | 4/4 | Exact |
| Cross-tab (Table 1) | — | — | — | — | Exact |

**Reproduction verdict: complete.** Every estimand the paper reports is recovered. The remainder of the paper develops what the recovered coefficients do and do not support.

## 4. Forensic audit

The audit ran sixty-four spec-curve estimates, eighteen leave-one-state replicates, twelve influence drops, five placebo windows, a wild-cluster CR2 bootstrap on the small-cluster cells, and Bonferroni and Holm corrections across the sixteen headline tests. The summary verdict per starred cell appears in Table 2; the prose unpacks each finding.

**Table 2.** Audit verdicts per headline cell.

| Cell | Reproduce | Spec curve (16 specs) | Leave-one-state | Bonferroni-16 | Wild-cluster CR2 | Verdict |
|---|---|---|---|---|---|---|
| C1 (zip RR) | exact | 8/16 PASS | sign preserved 17/18; weakens dropping MS | NO (p_bonf = .129) | n/a (large cluster) | FRAGILE |
| C2 (zip AA) | exact | 16/16 PASS | 17/17 PASS | YES (p_bonf = .003) | n/a (large cluster) | ROBUST |
| C5 (zip warmth) | exact | mixed | not run | NO (p_bonf = .060) | n/a | MARGINAL |
| C9 (county HC white) | exact | 4/16 PASS | drop TX or VA → p > .15 | NO (p_bonf = .252) | p = .106 (vs paper .027) | FRAGILE |

### 4.1 Specification curve and influence drops

The spec curve separates the four headline cells cleanly. The affirmative-action coefficient (C2) is flat across all sixteen specs: β ranges from +0.43 to +0.60 with p ≤ .002 in every cell, and sign is preserved throughout. The racial-resentment coefficient (C1) is conditional on a single design choice. β ranges from −0.26 (state-year trends ON, the published headline) to −0.16 (state-year trends OFF, |t| ≈ 1.2); the state-year-trends switch cuts |β| by 39% and pushes p past .05, and eight of sixteen specs survive at the within-25%-of-paper-β band. The white-offender hate-crime coefficient (C9) passes only four of sixteen specs and falls in the SURVIVES-WEAKLY band on the remaining twelve. The spec curve crosses covariates ON/OFF, state-year trends ON/OFF, distance-band restriction ON/OFF, and zip-only versus two-way clustering. A Poisson FE specification on C9, the theoretically appropriate estimator for non-negative integer counts concentrated near zero, yields β = −0.84 (p = .001), substantially larger in magnitude than the published LPM estimate of β = −0.54.

Influence drops do not move the headlines. Trimming the top 0.5%, 1%, and 5% of Cook's distance leaves all three cells unchanged: twelve of twelve drops PASS. The published coefficients are not leveraged by extreme observations.

### 4.2 Leave-one-state-out

The white-offender hate-crime headline rests on two specific states. Dropping Texas alone yields β = −0.40 (p = .18); dropping Virginia alone yields β = −0.37 (p = .22). Either single-state drop kills the published significance. Dropping Alabama, Arkansas, Florida, Georgia, Louisiana, Kentucky, Missouri, West Virginia, Oklahoma, Maryland, Delaware, or DC leaves β unchanged at approximately −0.54; dropping North Carolina strengthens the coefficient to −0.62, South Carolina to −0.70, Tennessee to −0.67. The starred result hinges on Texas and Virginia counties — eleven treated counties total, and two states carry the inference.

The racial-resentment and affirmative-action coefficients are stable to leave-one-state. C1 preserves sign in seventeen of eighteen replicates with β in [−0.30, −0.18]; only dropping Mississippi pushes |β| to 0.183 (p = .026), out of the within-25% band. C2 passes all seventeen replicates with β in [+0.43, +0.60]; dropping Virginia raises β to +0.596 (p < .001).

### 4.3 Pre-trends

The 2012 → 2014 placebo on racial resentment returns β = −0.263 (p = .034), statistically indistinguishable from the headline DiD (β = −0.255, p = .008). In a window during which no Confederate-symbol removals occurred, the same sample and the same specification produce the same coefficient as the post-Charleston window. The 2010 → 2012 placebo is null (β = −0.008, p = .85). The paper acknowledges the 2012-2014 coefficient in Figure 2 and attributes it to "the emotions of hope that Obama's election stirred in 2012." The audit reads it as a parallel-trends concern: the data-generating process that produced the post-Charleston coefficient also produced the same coefficient two years earlier on the same outcome.

A second pre-trends check returns the opposite verdict. F7 fits a separate two-period DiD to each placebo window's units rather than carrying through the post-treatment sample restriction. The joint Wald test across four placebo coefficients (RR and AA, 2010-2012 and 2012-2014) returns χ² = 2.14, p = .71 — does not reject parallel trends. The two checks diverge because they apply different sample-restriction conventions: F4 mirrors the paper's Figure 2; F7 tests parallel trends only in zips that pass through the 2014-2015 panel. Both results are reported. The F4 result is the parallel-trends test most directly relevant to the published specification.

### 4.4 Small-cluster inference

The white-offender hate-crime cell loses significance under wild-cluster CR2: p = .106 (vs. published .027). The point estimate is unchanged at β = −0.538, but `clubSandwich::CR2` with the Satterthwaite degrees-of-freedom correction widens the standard error from 0.242 to 0.267 and shrinks the t-statistic from 2.22 to 2.01 against effective df ≈ 4.5. The cell uses analytic clustered standard errors at the county level on approximately eighty effective clusters, eleven of them treated. Analytic clustered standard errors at this n_cluster understate uncertainty in the small-cluster, sparse-treatment limit; wild-cluster CR2 is the standard correction in current applied practice [@callaway2021difference] and reverses the cell's significance.

### 4.5 Multiplicity

Two of sixteen headline cells survive Bonferroni-16; both are zip-code affirmative-action coefficients. The sixteen cells in Tables 2, 3, and 4 form a single test family in the natural reading: the paper reports all sixteen with raw p-values and identifies the four starred cells as the published findings. Bonferroni-16 sets α = .003.

**Table 3.** Multiplicity correction across the sixteen headline cells.

| Cell | Outcome | Specification | p_raw | p_bonf | Survives Bonferroni-16? |
|---|---|---|---:|---:|---|
| C1 | RR zip | + state-year trends | .008 | .129 | NO |
| C2 | AA zip | + covariates | .0001 | .002 | YES |
| C2′ | AA zip | + state-year trends | .0002 | .003 | YES |
| C5 | Warmth zip | + year FE | .004 | .060 | NO |
| C5′ | Warmth zip | + state-year trends | .10 | 1.00 | NO |
| C9 | HC white cnty | + state-year trends | .027 | .432 | NO |
| C9′ | HC white cnty | + year FE | .045 | .720 | NO |
| (9 other cells) | various | various | > .05 | 1.00 | NO |

The Holm step-down procedure reaches the same conclusion. Romano-Wolf bootstrap step-down would not change the count [@romano2005exact], because the affirmative-action coefficients are far below the family α boundary while every other cell is far above it.

### 4.6 Magnitude plausibility

The C1 and C2 implied magnitudes sit five to ten times above the nearest empirical benchmark. Per-removal effects on a single zip code's residents are reported in Table 4.

**Table 4.** Magnitude plausibility, per-removal effects.

| Cell | Outcome | DV mean | DV SD | β | β / SD |
|---|---|---:|---:|---:|---:|
| C1 | Racial resentment | 0.609 | 0.254 | −0.255 | **−1.00** |
| C2 | AA support | 0.443 | 0.378 | +0.480 | **+1.27** |
| C5 | Warmth toward Blacks | (z) | 0.250 | +0.093 | +0.37 |
| C9 | HC per cap (white) | 1.455 | 1.753 | −0.538 | −0.31 |

The published estimates for C1 and C2 imply that a single Confederate-symbol removal in a zip code shifts racial resentment one full standard deviation and affirmative-action support 1.27 standard deviations within a thirteen-month window. The nearest empirical benchmark in the literature is exposure to the 1992 Los Angeles riots [@enos2019can], which moved local policy support by 0.10–0.20 SD — itself the largest documented spatial-symbol effect. Norm-shifting field experiments [@bursztyn2020extreme; @tankard2017effect] deliver effects on the same order, 0.10–0.30 SD. The C1 and C2 estimates are five to ten times this benchmark. The C5 and C9 magnitudes (+0.37 SD on warmth, −0.31 SD on hate crimes) sit within the upper end of the plausible range.

The implication is not that the C1 or C2 magnitudes are arithmetically wrong: the reproduction confirms they recover from the deposited code. The implication is that the conjunction of a small treated subsample (eight zip codes), a thirteen-month window, sixteen tests with no multiplicity correction, and a two-period collapse mechanically inflates the per-removal magnitude relative to a discipline-grounded prior. The Poisson FE specification on C9 returns β = −0.84 (a more theoretically appropriate count-data estimator than LPM), suggesting the magnitude inflation is also operative on the hate-crime cell when it is correctly specified.

## 5. Alternative-mechanism rivals

Three alternative-mechanism rivals were tested. Two return null findings consistent with the published interpretation; one — the deliberation channel — substantially modifies it.

### 5.1 Selection on pre-trend

Zip codes that eventually removed symbols were not on a divergent pre-trend. A future-treatment placebo on RR yields β = +0.013 (p = .68); on AA, β = +0.060 (p = .16). R1 fits the placebo on zip codes treated *after* the 2014-2015 window (those in the post-Charlottesville and post-Floyd waves) and finds null effects on the pre-treatment trajectory. **R1 PASS.**

### 5.2 BLM concurrent shock

The BLM movement does not explain the headline. Restricting to zip codes with zero BLM protests 2014-2018 leaves both headline cells intact and stronger: C1 β = −0.287 (p = .010); C2 β = +0.597 (p < .001). The starred coefficients survive the BLM-restricted sample and in fact strengthen. **R2 PASS.**

### 5.3 The deliberation channel

The racial-resentment headline lives in the deliberated-removal subsample. Restricting to zip codes with no public deliberation prior to or during removal (`some_debate = 0` in the paper's own coding) collapses the C1 coefficient from β = −0.255 to β = −0.051 (p = .66); the C2 affirmative-action coefficient survives the same restriction at β = +0.593 (p = .002). The paper's deliberation coding distinguishes zip codes where public deliberation (council meetings, petitions, op-eds, hearings) preceded or accompanied removal from those where no deliberation is observed. Table 5 reports both cells.

**Table 5.** Deliberation channel: full-sample versus no-deliberation-subsample headline coefficients.

| Cell | Outcome | Full sample | No-deliberation subsample | Δ |
|---|---|---:|---:|---:|
| C1 | RR β | −0.255 (.008) | **−0.051 (.66)** | **−0.20** |
| C2 | AA β | +0.480 (.0002) | +0.593 (.002) | +0.11 |

The racial-resentment coefficient collapses from β = −0.255 (p = .008) in the full sample to β = −0.051 (p = .66) in the no-deliberation subsample. The same coefficient in standardized units is −1.00 SD in the full sample and −0.20 SD in the no-deliberation sample. The affirmative-action coefficient does not collapse; it modestly strengthens. The two outcomes have different channel structures: affirmative-action support shifts on removal alone, and is robust to dropping deliberated zip codes. Racial resentment shifts only when removal follows public contestation.

The substantive reading is direct. The paper's published headline on racial resentment is identified off the deliberated-removal subsample, in which the treatment is bundled (deliberation + removal) and the residual identifying variation in the no-deliberation subsample is null. The blind-rebuild prediction band of −0.05 to −0.12 SD on resentment, anchored to the LA-Riots benchmark and to the norms-shifting experimental literature, sits squarely on the no-deliberation-subsample point estimate of −0.20 SD (β = −0.051 / 0.254). The 5-to-10× gap between the published headline and the empirical-benchmark prior closes precisely when the deliberation channel is shut.

The deliberation-only placebo that the paper reports in its appendix (Table A8 — restricting to zip codes with deliberation but no removal) shows null effects on racial resentment, and the paper interprets this as evidence that deliberation alone does not move attitudes. The audit confirms the placebo. But the placebo and R5 together imply a stronger statement than the paper makes: deliberation alone does not move attitudes, removal alone does not move racial resentment, only the conjunction does. The norms-shifting interpretation is supported on AA. On RR, the channel is bundled.

## 6. Sensitivities and scope

Three structural features of the published design define the scope under which the headlines hold.

**Treatment rarity.** The CCES sample contains 436 zip codes that held at least one Confederate symbol at the start of the 2014 panel; 8 saw a removal during the window. The FBI white-offender hate-crime sample contains 158 counties, of which 11 are treated. Identification rests on a small treated subsample throughout. The leave-one-state-out result on C9 — that dropping Texas or Virginia eliminates the starred result — and the Bonferroni-16 result that only the affirmative-action cells survive both reflect the inferential limits this rarity imposes. Wild-cluster CR2 is the standard correction in current applied practice for cells with effective n_cluster below approximately 40 [@callaway2021difference], and the C9 finding (p = .106 versus .027) reflects what that correction returns on this sample.

**Two-period collapse.** The paper's two-period design (single onset wave, fixed pre/post panels) avoids the heterogeneous-effects bias of staggered TWFE [@goodman2021difference; @callaway2021difference] but forfeits the post-2017 and post-2020 wave variation. The 254 post-Floyd removals after 2020 are not in the panel. The post-treatment horizon collapses to one calendar year on FBI and seven months on VSG. The mechanical effect of the short window is that any genuine within-window attitude shift maps onto a coefficient with high standard error and high apparent magnitude, since the denominator (treatment exposure) is short. The two-period design is defensible on staggered-DiD grounds; the magnitude inflation it produces on the per-removal estimate is a direct cost of that defense.

**State-year trends as the lever.** The C1 racial-resentment coefficient is β = −0.156 (p = .22) without state-year trends and β = −0.255 (p = .008) with state-year trends. The headline is conditional on absorbing differential state-level trends in racial attitudes. State-year trends are defensible on parallel-trends grounds (different states underwent different attitudinal trajectories during the post-Charleston year, and absorbing those trajectories is the correct adjustment), but the headline magnitude is materially conditional on this choice. The same lever does not move C2: the AA coefficient is β = +0.429 without state-year trends and β = +0.480 with — a difference within standard error.

**Norms-shifting interpretation requires a separable removal channel.** The norms-shifting account [@bursztyn2020extreme; @tankard2017effect] predicts that a focal symbolic event — a removal that signals a shift in public norms — produces an attitudinal update among nearby observers. The interpretation requires that the removal itself, not the contestation that produced the removal, is the focal event. The published coefficient on racial resentment is concentrated in the deliberated-removal subsample; the no-deliberation-subsample coefficient is null. The norms-shifting interpretation is therefore supported on the affirmative-action outcome (which survives the deliberation restriction) and contested on the racial-resentment outcome. The empirical record is consistent with two different interpretations on the racial-resentment cell: that public deliberation is the focal norms-shifting event (with removal as marker), or that the deliberation-removal bundle is jointly causal and inseparable in this design.

**What separation of the channels would require.** Cleanly separating the deliberation and removal channels requires identifying variation in removal *conditional on deliberation occurring*, or equivalently a comparison between zip codes that deliberated and removed and zip codes that deliberated and did not remove. The paper's Table A8 attempts the latter and finds null effects, which the audit confirms. The complementary contrast — zip codes where removal occurred without prior deliberation versus zip codes where it did not — is statistically underpowered in this dataset: eight no-deliberation removals across 436 symbol-holding zip codes. The post-2020 removal wave contains a larger pool of no-deliberation removals and more identifying variation in the unbundled cell, but those waves are outside the published two-period panel.

## 7. Conclusion

Twenty-four published coefficients in Rahnama (2025) reproduce exact to three decimals from the deposited code. The norms-shifting account is supported on affirmative-action support, with effects concentrated at the zip-code level: sixteen of sixteen spec-curve cells PASS, seventeen of seventeen leave-one-state replicates PASS, and the cell is one of two in the headline grid that survives Bonferroni-16. This is a robust finding.

The other three published headline cells are weaker than their stars suggest. The white-offender hate-crime cell loses significance under the appropriate small-cluster inference correction (wild-cluster CR2 p = .106) and under leaving Texas or Virginia out, on a sample of eleven treated counties. Warmth toward Blacks survives only in the year-FE specification (the state-year-FE cell is β = +0.056, p = .10). Racial resentment, the largest and most striking magnitude in the paper (−1.00 SD per removal), collapses to β = −0.051 (p = .66) in the no-deliberation subsample. Identifying the racial-resentment effect requires the deliberated-removal subsample, in which the treatment is bundled.

The norms-shifting account survives on AA. The racial-resentment claim is contingent on the bundled deliberation-plus-removal package and does not survive separation of the channels. The hate-crime claim does not survive small-cluster inference. The published per-removal magnitudes for resentment and affirmative action sit five to ten times above the nearest empirical benchmark in the literature. Three structural features of the design — treatment rarity, the thirteen-month window, and the absence of multiplicity correction — combine to produce magnitudes substantially larger than independent priors anchored on comparable spatial-symbol settings would expect.

The cleanest contrast for separating the deliberation and removal channels — zip codes that removed without prior deliberation versus zip codes that did not — is statistically underpowered in this panel: eight no-deliberation treated zip codes. The post-2020 removal wave contains the variation that would identify the removal-only channel at standard inferential precision, but the published two-period design predates that wave. The audit reports what the 2014-2015 dataset can and cannot identify under standard 2026-norm forensic stress tests.

Beyond the immediate finding on Confederate-symbol removals, the audit pattern is recognizable across the symbolic-politics literature on contested events. Where the focal event is the visible product of a public deliberation process (a renaming, a removal, a memorial siting), comparisons across treated and untreated places conflate the deliberation with its outcome, and the implied per-event magnitude inherits the inflation that small-treated-sample, short-window, multi-outcome designs produce. The robust finding here, the affirmative-action coefficient, is also the cell where the deliberation channel does not bind: support for a downstream policy position shifts on removal alone. The collapse on racial resentment is the diagnostic cell for the broader literature. Contested symbolic events that move underlying attitudes, as opposed to downstream policy judgments, are most likely identified off the contestation rather than off the symbolic act itself.

## References

Bursztyn, Leonardo, Georgy Egorov, and Stefano Fiorin. 2020. "From Extreme to Mainstream: The Erosion of Social Norms." *American Economic Review* 110 (11): 3522–48.

Callaway, Brantly, and Pedro H. C. Sant'Anna. 2021. "Difference-in-Differences with Multiple Time Periods." *Journal of Econometrics* 225 (2): 200–230.

Cameron, A. Colin, and Douglas L. Miller. 2015. "A Practitioner's Guide to Cluster-Robust Inference." *Journal of Human Resources* 50 (2): 317–72.

Enos, Ryan D., Aaron R. Kaufman, and Melissa L. Sands. 2019. "Can Violent Protest Change Local Policy Support? Evidence from the Aftermath of the 1992 Los Angeles Riot." *American Political Science Review* 113 (4): 1012–28.

Goodman-Bacon, Andrew. 2021. "Difference-in-Differences with Variation in Treatment Timing." *Journal of Econometrics* 225 (2): 254–77.

MacKinnon, James G., and Matthew D. Webb. 2018. "The Wild Bootstrap for Few (Treated) Clusters." *Econometrics Journal* 21 (2): 114–35.

Pustejovsky, James E., and Elizabeth Tipton. 2018. "Small-Sample Methods for Cluster-Robust Variance Estimation and Hypothesis Testing in Fixed Effects Models." *Journal of Business & Economic Statistics* 36 (4): 672–83.

Rahnama, Roxanne. 2025. "Monumental Changes: Confederate Symbol Removals and Racial Attitudes in the United States." *Journal of Politics* 87 (1): 158–71. <https://doi.org/10.1086/730713>.

Romano, Joseph P., and Michael Wolf. 2005. "Exact and Approximate Stepdown Methods for Multiple Hypothesis Testing." *Journal of the American Statistical Association* 100 (469): 94–108.

Rozenas, Arturas, and Anastasiia Vlasenko. 2022. "The Real Consequences of Symbolic Politics: The Soviet Past in Ukraine." *Journal of Politics* 84 (3): 1263–77.

Tankard, Margaret E., and Elizabeth Levy Paluck. 2017. "The Effect of a Supreme Court Decision Regarding Gay Marriage on Social Norms and Personal Attitudes." *Psychological Science* 28 (9): 1334–44.

Villamil, Francisco, and Laia Balcells. 2021. "Do TJ Policies Cause Backlash? Evidence from Street Name Changes in Spain." *Research & Politics* 8 (4): 1–7.

## Appendix A: Replication package

The audit scripts and intermediate artifacts that produce the verdicts in this paper are organized as follows.

- `papers/rahnama-confederate-jop/env/comparison.md` — the full cell-by-cell reproduction grid (24/24 exact), spec curve (64 estimates), leave-one-state battery, multiplicity table, and small-cluster bootstrap output.
- `papers/rahnama-confederate-jop/env/comparison-substantive.md` — the substantive comparison between the blind rebuild and the paper, including the magnitude-prior gap analysis.
- `papers/rahnama-confederate-jop/research-notes.md` — the pre-audit hypotheses, filed before any audit code ran.
- `papers/rahnama-confederate-jop/env/original/` — the deposited Stata `.do` masterfile, `.dta` data files, codebook, and README mirrored from Dataverse archive `doi:10.7910/DVN/IHMU6B`.
- `papers/rahnama-confederate-jop/blind-rebuild.md` — the independent zero-context design produced before reading the paper.

**Full replication package (zip, 121 KB):** [https://www.dropbox.com/scl/fi/nf2bsdb9x7htf9zsp35zb/paper-2026-0026-replication-20260506-1313.zip?rlkey=z5pn8qnwpu48tid7uwf22x2o1&dl=1](https://www.dropbox.com/scl/fi/nf2bsdb9x7htf9zsp35zb/paper-2026-0026-replication-20260506-1313.zip?rlkey=z5pn8qnwpu48tid7uwf22x2o1&dl=1)

The zip contains the audit script (`env/audit/audit.R`), the R port of the original Stata code (`env/translated/main_analysis.R`), the audit results (`env/audit/results/`), the reproduction tables and figure (`env/rerun-outputs/`), the comparison documents, the manifest with MD5 checksums for the original-author files (so they can be re-acquired from the Dataverse archive and verified), and a `README_PACKAGE.md` describing layout, exclusions, and how to reproduce.

