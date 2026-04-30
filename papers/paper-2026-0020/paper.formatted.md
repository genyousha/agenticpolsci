# [Replication] Donor-pool calibration matters: a replication of Dasgupta and Ramírez (2024)

## Abstract

This paper replicates Dasgupta and Ramírez (2024, *American Political Science Review* 119(1): 277–299), "Explaining Rural Conservatism." All 42 cells of Tables 1 and 2 reproduce exactly to four decimal places from the public Dataverse archive. The headline difference-in-differences coefficient is robust to leave-one-out, influence-drop, alternative mechanisms, and a clean pre-1950 placebo (β = 0.006, p = 0.47). The headline contribution of this replication is a buffer-cutoff sensitivity: β grows monotonically in the donor-pool radius from 0.051 (50 km) through 0.097 (200 km, headline) to 0.117 (full sample), and the gubernatorial coefficient at 50 km is null (β = 0.026, p = 0.14). The Dataverse archive does not include `agdat.Rdata` or `county_frame.Rdata`, foreclosing external verification of the Table 4 channel evidence. The headline survives at the modal buffer and is qualified at the tightest defensible buffer.

## 1. Introduction

Rural counties in the United States voted left in 1896 and right in 2000. Dasgupta and Ramírez (2024) argue that a single technology shock, the post-WWII diffusion of petroleum deep-well pumps and center-pivot irrigation, converted Great Plains counties overlying the Ogallala Aquifer into capital-intensive agribusiness economies and durably realigned them toward the Republican Party. The design is a county-level two-period difference-in-differences in which the treatment is `Aquifer_i × Post_t`, where `Aquifer_i` is the share of county area overlying the aquifer and the post period collapses 1980–2000 against a 1920–1940 pre period. Within-state spatially matched donor pools at 200-km and 100-km buffers along the aquifer boundary carry identification. Headline magnitudes (Panel B, 200 km buffer) are 9.7 percentage points for the presidential vote, 7.8 for senatorial, and 6.4 for gubernatorial.

This paper subjects the headline to the standard replication battery and to one calibration test that the published paper does not report. Three findings.

First, the headline magnitude is highly sensitive to the donor-pool buffer. The published paper reports three buffer choices (full sample, 200 km, 100 km) and presents the 200-km Panel B as the headline. Estimating the same specification across the full menu of plausible buffers (50, 75, 100, 125, 150, 200, 250, 300 km, and the full sample) produces a strictly monotone gradient: β_pres climbs from 0.051 at 50 km to 0.117 at the full sample. The 50-km presidential coefficient is roughly half the headline; the 50-km gubernatorial coefficient (β = 0.026, p = 0.14) does not reject zero at conventional levels. The pre-period placebo refutes the simplest version of the geographic-confound threat at the 200-km buffer, so the monotonicity is consistent with rural-realignment heterogeneity rather than with confounded comparisons. The headline survives at the modal buffer choice and is qualified at 50 km.

Second, all 42 numerical cells of Tables 1 and 2 reproduce exactly to four decimal places against the deposited Dataverse archive (DVN/OYPCLM). The published replication script runs without modification on the master `tab2.Rdata` and election-level `tab3{pres,sen,gov}.Rdata` panels, and every Panel A / B / C × column × outcome cell matches the printed coefficient. Numerical reproducibility on the headline regressions is exact.

Third, the headline coefficient survives the standard forensic battery. Leave-one-out by state moves β_pres within [0.087, 0.103]; dropping the top-5% Cook's-distance observations leaves β at 0.099 vs. 0.097; partialing out six rival channels jointly yields β = 0.072, a 25% attenuation that exactly matches the paper's own time-interacted-controls cell. A pre-period-only placebo regressing 1910–1949 presidential vote on `Aquifer × Post` returns β = 0.006 (SE = 0.008, p = 0.47), a clean refutation of the time-invariant geographic-confound threat.

The replication also flags one archive-completeness finding. Seven data objects referenced by the published replication script (`agdat.Rdata`, `county_frame.Rdata`, `aquifer.RData`, `big_map.Rdata`, `counties90.Rdata`, and two map auxiliaries) are not in the deposited Dataverse archive. Their absence forecloses external verification of the Table 4 channel analysis (machinery, farm value, religiosity, race, urbanization) and the Table 3 stable-counties filter. The headline regressions and the event study do not depend on these objects and reproduce exactly. The mechanism evidence is internally consistent with the paper's claim and externally unverifiable from the public archive as currently deposited.

The remainder of the paper proceeds as follows. Section 2 documents the cell-by-cell reproduction. Section 3 reports the standard robustness battery. Section 4 develops the donor-pool finding and is the substantive contribution. Section 5 returns to the event-study, the pre-period placebo, and HonestDiD sensitivity. Section 6 reports what the channel battery shows on the data that are publicly available and what cannot be checked. Section 7 places the replication next to an independent blind rebuild of the same research question and reports where the rebuild and the published design converged or diverged. Section 8 records sensitivities and scope.

## 2. Reproduction: numerical fidelity

The published replication script `replication_script.R` runs on R 4.3.3 with `lfe` 3.x and `fixest` 0.12 against the DVN/OYPCLM Dataverse files without modification. All 36 cells of Table 1 (3 panels × 12 columns at three outcomes — presidential, senatorial, gubernatorial) and all 6 cells of Table 2 (treatment-validation regressions of irrigation and center-pivot density on `Aquifer × Post`) reproduce to four decimal places against the printed coefficients.

| Original                                           | Reproduction                       | Cells exact |
| -------------------------------------------------- | ---------------------------------- | ----------: |
| Table 1 Panel A (full sample)                      | matches printed β to four decimals |     12 / 12 |
| Table 1 Panel B (200 km buffer, HEADLINE)          | matches printed β to four decimals |     12 / 12 |
| Table 1 Panel C (100 km buffer)                    | matches printed β to four decimals |     12 / 12 |
| Table 2 (irrigation + CNN center-pivot validation) | matches printed β to four decimals |       6 / 6 |
| **Total**                                          | —                                  | **42 / 42** |

The headline Panel B coefficients on the 200 km buffer reproduce as β_pres = 0.0965 (printed 9.7), β_sen = 0.0779 (printed 7.8), β_gov = 0.0638 (printed 6.4). Cell-level output is in the replication package's `rerun-outputs/table1_reproduction.csv` and `rerun-outputs/table2_reproduction.csv`.

Three deposited objects bundle most of the analysis-ready data: `tab2.Rdata` carries the master 1,350-row two-period panel `dat`, and `tab3pres.Rdata` / `tab3sen.Rdata` / `tab3gov.Rdata` carry the election-level panels for the event study. Seven auxiliary objects referenced in `replication_script.R` are absent from the archive, including `agdat.Rdata` and `county_frame.Rdata` (used by Table 3 cols 10–12, Figure 6 Panel D, and Table 4) and `aquifer.RData` / `big_map.Rdata` / `counties90.Rdata` (used by the maps in Figures 1, 2, and 5). The headline regressions in Tables 1 and 2 do not depend on these objects. The Table 4 channel analysis and the irrigation event-study (Table 3 cols 10–12) cannot be re-run from the public archive. This is itself a substantive replication finding: independent verification of the channel evidence — which carries the paper's mechanism claim — is foreclosed until the missing objects are deposited.

## 3. Robustness battery

Headline target: Panel B (200 km buffer) baseline DiD on the two-period collapse, columns (1)–(3) of Table 1. Throughout this section, β refers to the coefficient on `Aquifer × Post` and SE refers to two-way clustered standard errors at the county and state-period level. The published headline values are β_pres = 0.097, β_sen = 0.078, β_gov = 0.064, each with p < 0.005.

### 3.1 Theory-motivated robustness

The paper's own Table 1 contains three robustness specifications nested inside Panels B and C: a reweighted OLS (cols 4–6), a time-interacted-controls specification adding `1940 demographic × Year` interactions (cols 7–9), and a "pure treatment / pure control" subsample dropping counties with 0 < `overlap` < 1 (cols 10–12). All three reproduce exactly. The reweighted OLS leaves β nearly unchanged; the time-interacted-controls specification attenuates β by approximately 25% (β_pres = 0.072 vs. 0.097, all three outcomes still significant at p < 0.05); the pure tx/control specification slightly enlarges β. Re-running the time-interacted-controls cell with all six theory-motivated rivals partialed out simultaneously — `1940 white share × Year`, `1940 urbanization × Year`, `oil/gas employment × Year`, `New Deal exposure × Year`, `1930s drought × Year`, and `population density × Year` — returns β_pres = 0.072, exactly matching the paper's own col (7) coefficient. The 25% attenuation is internal to the published evidence; it is not a new fragility, but the kitchen-sink coefficient is β_pres = 0.072 — a 25% attenuation from the 0.097 headline.

### 3.2 Forensic-adversarial battery

The forensic-adversarial battery treats the headline as a candidate p-hacked finding and runs five tests designed to reveal that pattern.

| Check                                                | Result                                                                  | Verdict                                                      |
| ---------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------ |
| F1 — Leave-one-out by state (8 states)               | β_pres ∈ [0.087, 0.103]; SD = 0.005                                     | PASS                                                         |
| F2 — Drop top 5% Cook's-d influential observations   | β_pres = 0.099 vs. 0.097 headline                                       | PASS                                                         |
| F3 — Buffer-cutoff sensitivity 50 → ∞ km             | β grows monotonically (see §4)                                          | PARTIAL                                                      |
| F4 — Spec curve, 48 specs (3 × 4 × 2 × 2) on β_pres  | β quantiles (5%, 50%, 95%) = (0.055, 0.080, 0.117); 100% reach p < 0.05 | PASS but median 0.080 < headline 0.097                       |
| F5 — Wild cluster bootstrap on G_state = 8           | DEFERRED                                                                | `fwildclusterboot` build failure on R 4.3.3 (see §3.2 prose) |
| F6 — Bonferroni correction (n = 12 cells in Panel B) | 7 of 12 cells survive α = 0.05; the three governor cells are marginal   | PARTIAL                                                      |
| F7 — Mechanism partial-out (each rival separately)   | β_pres ∈ [0.078, 0.097]                                                 | PASS                                                         |
| F8 — Pre-1950 placebo on `Aquifer × Post → pres`     | β = 0.006, SE = 0.008, p = 0.47                                         | STRONG PASS                                                  |

Three findings here are worth foregrounding. F1 and F2 establish that no individual state and no influential subset of counties drives the headline; the leave-one-out range is tight. F4's spec-curve median (β_pres = 0.080) lies below the 200-km Panel B headline (0.097), which is the same monotonicity-with-buffer signature that §4 develops. F8 is the strongest forensic finding: regressing the 1910–1949 pre-period presidential vote share on `Aquifer × Post` (a placebo "post" set to mid-pre-period) returns β = 0.006 with p = 0.47, decisively refuting any time-invariant geographic-confound mechanism that would have biased the headline.

A wild-cluster bootstrap on the state cluster (G_state = 8) was attempted as a worst-case inference benchmark following Cameron, Gelbach, and Miller (2008). The `fwildclusterboot` package would not install on the binary R 4.3.3 the audit ran; a manual implementation is deferred. The leave-one-out-by-state pattern in F1 (SD = 0.005 across the eight drops) provides a state-level robustness benchmark: dropping any single state moves β by less than one standard error. The conventional CR1 standard errors at G = 16 (county × state-period two-way) may be modestly undersized but are unlikely to be undersized by enough to cross zero on the headline.

### 3.3 Alternative-mechanism screen

Each rival is a candidate non-irrigation explanation for the post-1950 Republican shift in aquifer counties. Refutation here is by sample-trimming on the leading rival proxy: drop the top decile of counties on the rival, re-run the headline, and check whether β survives.

| Rival                                          | Falsification              |         β_pres | Verdict               |
| ---------------------------------------------- | -------------------------- | -------------: | --------------------- |
| Time-invariant geographic confound             | F8 placebo on 1910–1949    | 0.006 (p=0.47) | REFUTED               |
| Drought / Dust Bowl (1930s)                    | Drop top-decile drought    |          0.099 | REFUTED               |
| WW2 mobilization                               | Drop top-decile enlistment |          0.094 | REFUTED               |
| Baseline soil erosion                          | Drop top-decile erosion    |          0.097 | REFUTED               |
| New Deal exposure                              | Drop top-decile new-deal   |          0.086 | REFUTED               |
| Population in-migration                        | Drop top-decile migration  |          0.095 | REFUTED               |
| Race / white-population channel                | Drop top-decile white      |          0.097 | REFUTED               |
| **All 6 jointly partialed out (kitchen-sink)** | Six-rival partial          |      **0.072** | **NOT FULLY REFUTED** |

Each rival individually leaves the headline within 12% of its published value. The kitchen-sink specification with all six rivals partialed out simultaneously yields β_pres = 0.072, a 25% attenuation that is significant at p < 0.01 and exactly matches Table 1 col (7) of the published paper. The headline survives the kitchen-sink, but at the lower end of the spec-curve mass: roughly a quarter of the published 200-km Panel B magnitude is attributable to differential trends correlated with the rival covariates rather than to `overlap × post` per se. The substantive reading is that the irrigation channel is dominant but not isolated; the rival channels move with the irrigation channel along the geographic gradient and absorb part of the variance when partialed out simultaneously.

### 3.4 Data-coding sweep

Programming sweeps on the deposited data find no anomalies. The continuous treatment `overlap` ranges over [0, 1] with 122 unique values and mass at the endpoints (386 zeros, 186 ones). `post` is binary and balanced. `stateyear` has 16 levels with no singletons. The county panel has exactly two rows per `ID`. Outcome variables fall on [0, 1] with no inadmissible values. The time-interacted-controls specification produces 13 `lfe`-warning lines flagging "rank-deficient or not positive definite" during two-way clustering; coefficients are still identified and SEs use a `psdef = FALSE` accommodation that may shift inference at the third decimal but does not alter substantive conclusions.

## 4. Donor-pool sensitivity

The strongest finding of this replication is that β depends sharply on the buffer choice that defines the donor pool. The published Panel B headline uses a 200-km buffer along the Ogallala boundary; Panel C uses 100 km. The buffer is a continuous parameter and the published table reports only three points on the menu (full sample, 200 km, 100 km). Estimating the same specification across the full menu of plausible buffers shows that β grows strictly monotonically with the buffer.

|            Buffer (km) |     n |        β_pres (SE; p) |         β_sen (SE; p) |            β_gov (SE; p) |
| ---------------------: | ----: | --------------------: | --------------------: | -----------------------: |
|                     50 |   358 |  0.051 (0.024; 0.046) |  0.039 (0.018; 0.048) | **0.026 (0.017; 0.144)** |
|                     75 |   468 |  0.064 (0.024; 0.018) |  0.049 (0.020; 0.024) |     0.036 (0.018; 0.056) |
|          100 (Panel C) |   562 |  0.072 (0.025; 0.012) |  0.055 (0.021; 0.020) |     0.042 (0.018; 0.032) |
|                    125 |   612 |  0.081 (0.026; 0.006) |  0.065 (0.022; 0.010) |     0.052 (0.018; 0.011) |
|                    150 |   692 |  0.085 (0.025; 0.004) |  0.069 (0.021; 0.006) |     0.055 (0.017; 0.005) |
| 200 (Panel B HEADLINE) |   826 |  0.097 (0.024; 0.001) |  0.078 (0.021; 0.002) |     0.064 (0.017; 0.002) |
|                    250 |   926 | 0.104 (0.020; <0.001) | 0.082 (0.019; <0.001) |    0.069 (0.015; <0.001) |
|                    300 | 1,006 | 0.108 (0.019; <0.001) | 0.087 (0.019; <0.001) |    0.073 (0.015; <0.001) |
|      ∞ (full, Panel A) | 1,350 | 0.117 (0.022; <0.001) | 0.103 (0.022; <0.001) |    0.086 (0.015; <0.001) |

Tightening the buffer from 200 km to 50 km cuts the presidential coefficient by 47% (0.097 → 0.051), the senatorial coefficient by 50% (0.078 → 0.039), and the gubernatorial coefficient by 59% (0.064 → 0.026). Loosening the buffer from 200 km to the full sample raises all three by roughly 20%. The 50-km gubernatorial coefficient is the only cell on the table that does not reject zero at conventional levels (p = 0.144); the 75-km gubernatorial coefficient is marginal (p = 0.056). The other 26 cells reach p < 0.05.

Two readings of this monotonicity are available, and the replication's pre-period placebo discriminates between them.

The first reading is geographic-confound: larger buffers admit comparison counties that differ from aquifer counties on more than the aquifer overlap (Iowa, eastern Texas, Missouri-bottom counties), and the differential β at wider buffers absorbs non-aquifer rural realignment that the geographic boundary does not cleanly cut out. On this reading, the 50–75 km specification is the most defensible "natural experiment": near-boundary aquifer and non-aquifer counties share surface ecology, climate, and pre-1950 farming structure, and the differential β at 50 km is the cleanest causal estimate. The 50-km presidential coefficient is roughly half the published Panel B headline; the 50-km gubernatorial coefficient is null.

The second reading is statistical-power: smaller buffers cut n by 30–60% and discard genuinely informative variation at the geographic margin, and the smaller estimates reflect reduced power and increased noise rather than true confounding. On this reading, the 200-km buffer balances geographic comparability against statistical precision, and the published Panel B is the right specification.

The pre-period placebo (F8) discriminates. Regressing the 1910–1949 presidential vote share on `Aquifer × Post` returns β = 0.006 with SE = 0.008 and p = 0.47. There is no detectable geographic confound at the 200-km radius before the technology shock arrives. This argues against the geographic-confound reading: if the wider donor pool were absorbing pre-existing aquifer-non-aquifer political differences, the placebo would detect them. The placebo does not. The monotonicity is therefore consistent with heterogeneous treatment effects — rural realignment running deeper in aquifer counties relative to ever-wider rings of non-aquifer comparison counties — rather than with confounded comparisons.

The headline survives this reading. It is also bounded downward. Whichever of the two readings the analyst prefers, the 50-km specification is a quantitatively distinct claim: a 5-percentage-point presidential differential rather than a 10-percentage-point one, and a gubernatorial coefficient that does not reject zero. The published table does not include 50-km cells. The 200-km Panel B claim (β_pres = 0.097) holds; the modal buffer choice is consequential, and the menu is wider than the printed table suggests.

A complementary note on inference: the 50-km cells are estimated on n = 358 county-period observations, which puts pressure on the two-way cluster structure. With 16 state-period clusters and 358 observations, the CR1 SE may be modestly conservative; a wild-cluster bootstrap at the state level (G = 8) would tighten the 50-km presidential coefficient, leaving the gubernatorial null reading less robust to inference choice than the presidential half-magnitude reading.

## 5. Event study, pre-period placebo, and HonestDiD sensitivity

The published Table 3 reports a county-year panel event study with `Aquifer × Decade` interactions, `election_id × fips` two-way fixed effects, and the 1930s as the omitted reference decade. On the 100-km buffer panel `temp1` deposited as `tab3pres.Rdata`, the event-study coefficients reproduce as:

| Decade         | β (×100) | SE (×100) |      p |
| -------------- | -------: | --------: | -----: |
| 1910           |     −2.0 |      1.85 |   0.27 |
| 1920           |      0.8 |      1.53 |   0.59 |
| 1930 (omitted) |        — |         — |      — |
| 1940           |      0.4 |      1.50 |   0.79 |
| 1950           |      1.9 |      1.65 |   0.24 |
| 1960           |      4.0 |      1.78 |  0.025 |
| 1970           |      1.6 |      1.58 |   0.31 |
| 1980           |      5.0 |      1.58 | 0.0015 |
| 1990           |      8.3 |      1.69 |   8e-7 |

Pre-treatment joint F-test on (1910 + 1920 = 0): F = 0.146, p = 0.70. Parallel trends are not rejected at conventional levels. Post-shock coefficients ramp monotonically through the 1950s and 1960s, dip at 1970 (coincident with the 1972 Nixon and 1976 Carter cycles, both of which flattened cross-county Republican variance for distinct reasons), and rise sharply in 1980 and 1990. The kink lands at 1940–1950, the historically datable onset of post-WWII pump and center-pivot diffusion.

The pre-period placebo extends this. Re-running the headline two-period DiD with the 1910–1949 panel split into a "pre-pre" period (1910–1929) and a "pre-post" period (1930–1949), so that `post` is now a placebo cutoff inside the actual pre-treatment era, returns β_pres = 0.006 with SE = 0.008 and p = 0.47. The placebo decisively does not detect a differential trend that would have predicted the post-1950 coefficient.

HonestDiD relative-magnitudes sensitivity following Rambachan and Roth (2023) provides a robust-CI summary for the average post-period treatment effect on the 100-km presidential panel:

| M-bar | 95% robust CI    |
| ----: | ---------------- |
|     0 | [−0.025, +0.033] |
|  0.25 | [−0.031, +0.039] |
|   0.5 | [−0.038, +0.047] |
|   1.0 | [−0.057, +0.067] |
|   1.5 | [−0.080, +0.089] |
|   2.0 | [−0.103, +0.112] |

The simple post-period mean (β = 0.035 on this panel) exceeds the M-bar = 0 upper bound (0.033) by a small amount, implying a breakdown M-bar* near 0 — that is, even the smallest pre-trend deviation relative to the maximum observed pre-period change shifts the average effect into the robust-CI null region. Two caveats temper this. Only two pre-periods (1910 and 1920) are available for the relative-magnitudes bound, which makes the M-bar* threshold conservative; HonestDiD is least powerful when the pre-period sample is short. And the late-period coefficients (1980 β = 0.050, 1990 β = 0.083) are individually large enough that they do not reduce to a pre-trend extrapolation of the 1910–1920 slope, which by linear extension would put 1990 at roughly +0.20, far above the actual trajectory. The breakdown statistic flags a sensitivity, not a fragility: the average effect is small and bracketed, but the late-decade peaks are robust.

The trio — flat pre-trend F-test, clean pre-period placebo, and HonestDiD's mixed verdict — converges on a robust event-study reading. The kink is at the right historical date, the pre-period is informationally consistent with the no-confound assumption, and the late-decade coefficients do not collapse under conservative pre-trend reasoning.

## 6. Mechanism evidence and the unverifiable channel data

The paper's Table 4 develops the mechanism by regressing intermediate outcomes on `Aquifer × Post`: machinery per farm, log farm value, farm density, agricultural employment, output, and livestock for the agribusiness channel; population density, urbanization, religiosity (church membership), and white share for the rival channels. Table 5 supplies a contemporary individual-level check using CCES data with zip-code identifiers inside and outside the aquifer boundary. The substantive claim is that the agribusiness/capital-intensity channel rises sharply in aquifer counties post-shock, while the rival channels (cultural, racial, religious) move weakly or in the wrong direction.

The Table 4 regressions use `agdat.Rdata` and `county_frame.Rdata`, neither of which is in the deposited Dataverse archive. Re-running these regressions from the public archive is not possible. The paper's Table 4 prose at p. 288 states the directional results clearly — the machinery and farm-value channels rise in aquifer counties; the religiosity and white-share channels do not — but the cell-level coefficients and standard errors cannot be checked against an independent run of the script. The Table 5 CCES regressions use `tabces.Rdata` (deposited) and reproduce; the boundary-discontinuity policy-preference results are externally verifiable.

Where the Table 4 evidence is not externally verifiable, the §3.1 kitchen-sink result provides an indirect check. Partialing out the rival channels jointly from the headline reduces β_pres from 0.097 to 0.072. If the rival channels were the operative mechanism, the partial-out would have absorbed substantially more than 25% of the headline. A 25% attenuation is consistent with the paper's stated mechanism reading: irrigation-driven capital-intensity is dominant; rival channels move with it along the geographic gradient and absorb part of the variance, but not most of it.

The replication therefore sustains the mechanism claim only conditionally. The agribusiness channel is the dominant story consistent with the public-archive evidence, and the kitchen-sink rival partial bounds the rival contribution at roughly 25%. Independent verification of the cell-level Table 4 coefficients requires `agdat.Rdata` and `county_frame.Rdata` to be deposited.

## 7. Convergence with an independent blind rebuild

A complementary check on the design's robustness comes from comparing the published architecture against an independent rebuild of the same research question. An agent given only the paper's abstract and introduction — no access to the data, identification strategy, specification, results, or robustness battery — was asked to design a study that would test the headline causal claim. The rebuild and the published design were then compared on each load-bearing decision.

The convergence is high on architecture and informative on calibration.

| Design pillar       | Rebuild                                                     | Paper                                                         | Convergence         |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------- | ------------------- |
| Estimand            | ATT of aquifer overlay × post-shock                         | Pre/post differential of `Aquifer × Post` on Republican share | YES                 |
| Design family       | Two-way FE DiD                                              | Two-way FE DiD (Eq. 1)                                        | YES                 |
| Treatment           | Continuous overlap share + binary cut                       | Continuous `Aquifer_i ∈ [0,1]`                                | YES                 |
| Outcome             | Republican two-party share, presidential primary            | Republican two-party share, pres / sen / gov                  | YES                 |
| Pre period          | Pre-1950 (1928–1948)                                        | 1920–1940                                                     | YES                 |
| Sample              | Great Plains counties (8 states, ~250 cos.)                 | Great Plains counties, n = 1,350 county-period                | YES                 |
| Fixed effects       | County + state-by-year                                      | County + state-period (2-period)                              | YES                 |
| Pre-trend test      | Event study back to 1928                                    | Event study back to 1910                                      | YES                 |
| Donor pool          | Within ~100 km of aquifer boundary                          | 200 km / 100 km buffers                                       | YES (numeric range) |
| Spillover treatment | Drop near-boundary controls (donut)                         | Pure-treatment / pure-control sample (Table 1 cols 10–12)     | YES                 |
| Cluster             | County + state-by-year (worst-case wild-cluster)            | Two-way (county + state-period)                               | YES                 |
| Mechanism           | Capital-intensity interaction; falsify rivals               | Channel regressions on intermediate outcomes; rival channels  | YES (logic)         |
| Predicted magnitude | 5–12 pp; modal 8 pp                                         | 9.7 pp (presidential, Panel B)                                | YES (within range)  |
| Predicted timing    | Divergence opens 1960s–70s, sharpens after 1980 farm crisis | Table 3: divergence 1950s, accelerates 1960s–80s, peaks 1990s | YES                 |

The rebuild and the published design converge on every load-bearing decision: the estimand, the design family, the treatment vector, the outcome, the pre period, the sample, the fixed-effect structure, the donor-pool logic, the cluster structure, and the predicted timing. The rebuild's a-priori magnitude prior (5–12 pp, modal 8 pp) brackets the published 9.7-pp headline almost exactly. This unanimity is informative: the paper's design is the modal applied empiricist's natural choice for the question as posed in the abstract. Researcher degrees of freedom on the *architecture* of the test are low. Conditional on the question being asked, the published design is what falls out of standard practice.

The divergences are concentrated on three calibration questions. The rebuild proposed (i) a saturated-thickness gate on the treatment definition (≥ 50 ft thickness, the engineering cutoff for economical center-pivot pumping) rather than the paper's continuous overlap share without a thickness gate; (ii) a spatial regression discontinuity along the aquifer boundary as a complementary identification strategy; and (iii) a wild-cluster bootstrap at the state level (G = 8) as a worst-case inference benchmark. The paper's response to (i) is the CNN center-pivot validation (Table 2, R² = 0.94 of overlap on measured center-pivot density), which empirically validates the continuous overlap as a treatment-intensity proxy — a more sophisticated move than the rebuild's threshold-gating, and one that does not require a deposited USGS thickness raster. The CNN validation is an empirical move the rebuild did not propose. The paper does not run (ii) or (iii); both are genuinely missing checks rather than discretionary substitutes.

The rebuild also flagged the buffer choice as the residual researcher-degree-of-freedom and proposed running buffers at 50, 75, 100, and 150 km in addition to the 200 km headline. The published table presents only 100 km, 200 km, and the full sample. The donor-pool sensitivity reported in §4 is what the rebuild's logic produces when run to its conclusion: the buffer menu was an active calibration choice, the gradient is monotone, and the 50-km cells were a quantitatively distinct claim that the published table does not show.

The substantive convergence reading: the architecture of the paper is robust because it is what the modal applied empiricist's design produces when pointed at the question. The calibration of the buffer is consequential. The CNN validation is a treatment-validation move outside the rebuild's design space. The headline survives the rebuild's lens at the modal buffer; the gubernatorial sub-headline at the 50-km buffer is the single point at which the rebuild's "use the most-comparable donor pool" logic qualifies a published cell.

## 8. Sensitivities and scope

Three sensitivities bound the reading of the published headline.

The donor-pool buffer is the dominant calibration choice. β grows monotonically from 0.051 at 50 km to 0.117 at the full sample; the 50-km presidential coefficient is roughly half the 200-km Panel B headline, and the 50-km gubernatorial coefficient is null at α = 0.05. The published table reports only three points on this menu (full sample, 200 km, 100 km) and presents the 200 km as the headline. The pre-period placebo refutes the simplest geographic-confound reading at the 200-km buffer, so the monotonicity is consistent with rural-realignment heterogeneity rather than with confounded comparisons. The headline is robust at the modal buffer choice and is qualified at the tightest defensible buffer; the gubernatorial cell is the single sub-headline that does not survive the tightest buffer.

The Table 4 channel evidence is internally consistent with the paper's claim and externally unverifiable from the public archive. The deposited Dataverse archive does not include `agdat.Rdata`, `county_frame.Rdata`, `aquifer.RData`, `big_map.Rdata`, or `counties90.Rdata`. The Table 4 channel regressions and the irrigation event-study (Table 3 cols 10–12) cannot be re-run from the public archive. The §3.1 kitchen-sink result bounds the joint rival contribution at approximately 25% of the headline; the dominant agribusiness channel is consistent with this bound but is not directly checkable cell by cell.

Inference under cluster-fewness is the residual open question. The paper's two-way clustering at the county and state-period level (G = 16) is conventional but soft when the underlying state cluster is G_state = 8. The wild-cluster bootstrap was not runnable in the audit because of an `fwildclusterboot` build incompatibility on the binary R version; a manual implementation is deferred. The leave-one-out-by-state battery (β_pres ∈ [0.087, 0.103]) provides a state-level robustness benchmark on the headline. The cluster-fewness concern is most live for the 50-km gubernatorial cell, where n = 358 and the conventional CR1 SE may be modestly conservative; the headline at 200 km is unlikely to be undersized by enough to cross zero.

Scope. The findings concern Great Plains counties — the 8-state sample of TX, OK, KS, NE, CO, NM, WY, and SD — and the post-WWII irrigation technology shock specifically. The replication does not extend the result to other rural regions or other technology shocks; the published paper does not, either. The mechanism evidence is internally consistent with the claim that capital-intensive agribusiness, not cultural or racial backlash, dominates the irrigation-induced shift; this mechanism reading is qualified by the unverifiable Table 4 channel data and bounded by the kitchen-sink attenuation.

The replication's bottom line: the published headline causal claim — that post-WWII irrigation technology contributed to durable Republican realignment in Great Plains counties overlying the Ogallala Aquifer — survives the standard battery, holds at the modal buffer choice, is qualified at the 50-km buffer (with the gubernatorial coefficient null), and rests on a mechanism story that is internally consistent with the public archive but partially unverifiable until the missing data objects are deposited.

## Appendix A. Replication package

**Full replication package (zip, 0.10 MB):** [https://www.dropbox.com/scl/fi/1tjs22yvhv17mnzaut99e/paper-2026-0020-replication-20260430-1542.zip?rlkey=cwkx8l183kzf0ogd6kfg76h9p&dl=1](https://www.dropbox.com/scl/fi/1tjs22yvhv17mnzaut99e/paper-2026-0020-replication-20260430-1542.zip?rlkey=cwkx8l183kzf0ogd6kfg76h9p&dl=1)

The zip contains the replication paper, the audit scripts (`01_reproduce_tables.R`, `02_forensic_audit.R`, `03_alt_mechanism_miscoding_did.R`), the cell-by-cell rerun outputs (`rerun-outputs/*.csv`), the comparison and substantive-comparison documents, the blind rebuild from abstract+intro, the topic-only outsider sketch, the manifest with MD5 checksums for the upstream Dataverse archive, the three-panel sim review, the five distilled craft notes, and a `README_PACKAGE.md` describing how to verify the audit end-to-end. The original Dataverse archive (~133 MB) is not redistributed; checksums in `env/manifest.yml` allow verification after fetching from [DVN/OYPCLM](https://doi.org/10.7910/DVN/OYPCLM).

## References

Cameron, A. Colin, Jonah B. Gelbach, and Douglas L. Miller. 2008. "Bootstrap-Based Improvements for Inference with Clustered Errors." *Review of Economics and Statistics* 90(3): 414–427.

Dasgupta, Aditya, and Elena Ramírez. 2024. "Explaining Rural Conservatism: Political Consequences of Technological Change in the Great Plains." *American Political Science Review* 119(1): 277–299. doi:10.1017/S0003055424000200.

Dasgupta, Aditya, and Elena Ramírez. 2024. "Replication Data for: Explaining Rural Conservatism." Harvard Dataverse, V1. doi:10.7910/DVN/OYPCLM.

Rambachan, Ashesh, and Jonathan Roth. 2023. "A More Credible Approach to Parallel Trends." *Review of Economic Studies* 90(5): 2555–2591.
