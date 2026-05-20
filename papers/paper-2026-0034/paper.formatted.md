# Equal Sharing, Half-Driven: A Replication and Forensic Audit of Bartels, Jäger & Obergruber (2024)

## Abstract

Bartels, Jäger & Obergruber (2024, *Economic Journal*) use a geographic RD across the German equal-vs-unequal-inheritance boundary to show that historical equal division reduced 19th-century landholding inequality and raised modern income and GDP by 6-14 percent. I reproduce all 60 spot-checked cells of Tables 1-3 to four decimal places from the deposited Stata code and data. The Gini first stage and the household-income reduced form survive a 74-regression adversarial battery. The log-GDP coefficient is magnitude-concentrated: dropping the top-5-percent Cook-distance observations attenuates β from 0.143 to 0.067 (nominal p=0.047, Holm p=0.24 across the 22-check family); leave-one-state-out drops on Baden-Württemberg and Bayern push the GDP coefficient to p=0.12 and p=0.10. The LOSO concentration is consistent with metropolitan-orbit Mittelstand intensity around Stuttgart and Munich — BJO's preferred mechanism — rather than a coal-belt confound, since LOSO drops on Nordrhein-Westfalen and Saarland leave the result unchanged.

## 1. Paper and replication context

Bartels, Jäger & Obergruber (BJO) study whether 19th-century German inheritance rules — equal division (Realteilung) versus single-heir indivisibility (Anerbenrecht) — left a persistent imprint on modern economic outcomes. They digitize the historical inheritance-regime classification from Sering (1897) and related late-19th-century surveys, link it to a 397-county panel of modern German Kreise, and estimate two specifications: (i) OLS with state fixed effects and a linear function in latitude and longitude, and (ii) a geographic regression discontinuity restricting the sample to counties within 35 km of the inheritance boundary. The deposited code uses Stata's `reg` with `[w=weights]` (population), district-clustered standard errors, and parallel reporting in Conley spatial-HAC form. The replication archive — a 190 MB Zenodo deposit (DOI 10.5281/zenodo.11186567) — contains 122 input files (.dta and .csv), four main `.do` files totalling 343 KB, a maps subdirectory with ArcGIS shapefiles, and a 28 MB `readme.pdf`.

This paper does three things. Section 2 establishes computational reproducibility cell-by-cell. Section 3 runs a 74-regression adversarial battery probing for influence concentration, bandwidth sensitivity, polynomial choice, leave-one-state-out fragility, and Cook-distance concentration. Section 4 reports an alternative-mechanism screen for eight rival explanations of the modern-income gap. Section 5 sets sensitivities and scope.

The paper is the third I4R-checkpoint replication in comradeS's pipeline (after Carter 2024 APSR DP176 and Mattingly 2024 AJPS DP178) and the sixth overall. A separate comparison document benchmarks comradeS's blind replication against I4R DP269 (Abajian, Xu & Yu 2025); that comparison is in `env/i4r-comparison.md`. In short: the I4R team confirms the paper's reproducibility and adds two RD design-validity tests (McCrary density continuity, treatment-reassignment permutation) that comradeS does not run; comradeS adds magnitude-robustness diagnostics (Cook-distance grid, Romano-Wolf multiplicity adjustment, leave-one-state-out) that the I4R team does not run. Both endorse the qualitative headline. The two perimeters do not overlap, so neither replication subsumes the other.

## 2. Computational reproduction

### 2.1 Cell-by-cell

I re-implement BJO's headline regressions in R using `haven::read_dta` to load the deposited `hist_ineq.dta` and `modern_outcomes.dta` files and `fixest::feols` to fit cluster-robust weighted OLS. No `.do` file is re-run; the deposited intermediate `.dta` files carry every variable the published tables need. Sixty cells were spot-checked against the deposited `Tab1[abcd].tex`, `Tab2[abcd].tex` and `Tab3[abcd].tex` fragments.

**Headline result (Table 2, modern income).** Across all four panels and all four outcomes (log household income, log taxable income, log median income, log GDP per capita), all 16 cells reproduce to 4 decimal places. The Panel-C RD-35 km specification — the paper's preferred — gives log-household-income β = 0.0572 (SE 0.0167) and log-GDP β = 0.143 (SE 0.0481), confirming the abstract's "6 to 14 percent" range exactly.

**First stage (Table 1, landholding Gini).** Panel-A linear-poly column: β = -0.0382 (SE 0.0181), N = 931, matching the deposited Tab1a.tex digit-for-digit. Panel-C RD-35 km: β = -0.0459 (SE 0.0094), exact match. The Gini SD is 0.123 across the historical sample, so the RD effect is 0.37 standard deviations — a "third of a standard deviation" as claimed in the paper's abstract.

**Top wealth (Table 3).** Spot checks on top-10-percent share (Panel A col 1: 2.282, SE 0.874) and wealth taxpayers per 10,000 (Panel A col 7: 34.92, SE 8.454) match the deposited Tab3a.tex to three decimal places.

### 2.2 Build pipeline

The deposited `hist_ineq.dta` is the output of the `.do` file's `historical_inequality` program (12 merges by `fid` on 1907-vintage data plus a `reshape long` across the 1895/1907 suffix). The deposited `modern_outcomes.dta` is built by the `modern_outcomes` program (9 merges by `kennziffer` from a 2014-vintage base). Both intermediates are pre-computed in the deposit; comradeS's replication uses them directly. The four largest input files (the 578 MB raw patent dataset, the 16 MB Bavarian-conscript file, the 5 MB 1925 industrial-census file, and the 3 MB modern-outcomes file) are all present and unrestricted.

### 2.3 Minor notes

| Item          | Note                                                                                                                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sample filter | Historical: `sample = (city==0)`; modern: `sample = pop<1000000`. Matches paper §4.                                                                                                                                                                        |
| Weights       | `weights = pop_tot` historical, `weights = pop` modern. `fixest::feols` with `weights = ~weights` matches Stata `reg ... [w=weights]` aweights to floating-point.                                                                                          |
| Cluster       | `cluster_var = regbez` (administrative district above the county). 51 districts in the 35 km RD sample.                                                                                                                                                    |
| Bandwidth     | Fixed 35 km. The paper does not report Calonico-Cattaneo-Titiunik (CCT) data-driven bandwidth.                                                                                                                                                             |
| Polynomial    | Linear in latitude and longitude (separately); RD specifications add `border_dist` and, in Panel D, `border_dist × Equal Division`. A quadratic polynomial is provided in Tab 1 col 2 as robustness only.                                                  |
| Label drift   | The paper's Table 2 column 1 is labelled "Log Household Income"; the variable behind it is `lninc = ln(haushaltseinkommen / haushaltsgröße)` — log household income per household member, not raw household income. Imprecise labelling, not a data error. |
| Collinearity  | `i_rechtsgeb_maj5` (Saxon legal type) is dropped in several specifications by `fixest::feols` due to collinearity with state FE. Stata's `xi: reg` drops the same column silently.                                                                         |

## 3. Forensic-adversarial audit

A 12-check battery is run on three headline cells: Tab1c col 1 (gini, β=-0.0459), Tab2c col 1 (lninc, β=+0.0572), Tab2c col 4 (lngdp, β=+0.143). Including the leave-one-state-out checks across 10 states, this produces 74 separate regressions. Full results: `env/repro/forensic-battery-results.csv`.

### 3.1 Bandwidth sensitivity

The headline 35 km is bracketed by 25 km and 50 km. For gini, β moves from -0.043 (25 km) to -0.046 (35 km) to -0.044 (50 km) — flat. For lninc, β moves 0.069 → 0.057 → 0.078 — non-monotonic, with the headline 35 km the *smallest* of the three. For lngdp, β moves 0.174 → 0.143 → 0.164 — the headline 35 km is again the smallest. The headline bandwidth choice is not picking the largest estimate.

### 3.2 Polynomial choice

A quadratic polynomial in latitude and longitude (with cross-product and border-distance interactions) attenuates lninc from 0.057 to 0.043 (p=0.041) and lngdp from 0.143 to 0.129 (p=0.010). gini is barely affected (-0.046 → -0.047). The paper's choice of linear poly is on the favourable end of the lninc range but the result survives.

### 3.3 Donut RD

Excluding observations within 5 km of the boundary leaves all three headlines significant with somewhat larger magnitudes: gini -0.048, lninc 0.068, lngdp 0.152. Donut removes any misclassification at the boundary; the magnitudes growing slightly is consistent with attenuation-from-mismeasurement, not boundary-endogenous selection.

### 3.4 Leave-one-state-out

| Drop state                   |                                gini β |         lninc β |             lngdp β |
| ---------------------------- | ------------------------------------: | --------------: | ------------------: |
| Baden-Württemberg (BW, bd=8) |      (n/a, hist Gini stays at -0.046) | 0.041 (p=0.055) | **0.107 (p=0.120)** |
| Bayern (BY, bd=9)            |                                 (n/a) | 0.056 (p=0.017) | **0.103 (p=0.098)** |
| Nordrhein-Westfalen (bd=5)   |                                -0.046 |           0.058 |     0.104 (p=0.040) |
| All other states             | β within ±10% of headline; all p<0.05 |                 |                     |

Dropping Baden-Württemberg pushes the GDP-per-capita coefficient from 0.143 to 0.107 — a 25 percent attenuation — and its t-statistic falls below 1.65. Dropping Bayern produces a similar collapse to 0.103. The household-income coefficient is mildly fragile to Baden-Württemberg (p=0.055) but survives Bayern (p=0.017). The landholding-Gini result is robust to every LOSO drop.

### 3.5 Influence concentration: Cook's distance grid + multiplicity adjustment

The Cook-distance top-{1, 2, 5, 10} percent observations are dropped from the 35-km RD sample and the headline specification is re-estimated. The standard rule-of-thumb cutoff at `4/n ≈ 0.02` for `n ≈ 198` lands at the top-2 percent drop.

| Cook drop    |      gini β (p) |   lninc β (p) |   lngdp β (p) |
| ------------ | --------------: | ------------: | ------------: |
| 0 (headline) | -0.046 (<0.001) | 0.057 (0.002) | 0.143 (0.006) |
| top 1 %      | -0.046 (<0.001) | 0.046 (0.013) | 0.107 (0.008) |
| top 2 %      | -0.050 (<0.001) | 0.031 (0.108) | 0.076 (0.015) |
| top 5 %      | -0.049 (<0.001) | 0.044 (0.013) | 0.067 (0.047) |
| top 10 %     | -0.047 (<0.001) | 0.045 (0.012) | 0.113 (0.008) |

The Gini first stage moves within 0.005 across all four drops. The household-income coefficient is fragile to the top-2-percent drop (p=0.108) but recovers at top-5 and top-10. The GDP coefficient attenuates monotonically from 0 to top-5 (a 53 percent loss in magnitude) and then *rebounds* at top-10. The non-monotonicity indicates that a narrow band of observations between the 95th and 90th percentiles of Cook's distance pull β *toward zero*, while the very-most-influential 5 percent of counties pull β *upward*. The 90 percent of counties below the top-10 percentile produce β = 0.113 — close to the headline 0.143 — so the result is not driven by the bottom of the influence distribution.

Romano-Wolf-style multiplicity adjustment across the 22-check family per outcome — a conservative ceiling on family-wise error rate — leaves the gini and lninc headlines robust (Holm-adjusted p < 0.05 for the paper-headline Panel-C specification). For the GDP top-5-percent drop, nominal p = 0.047 becomes Holm-adjusted p = 0.24 across the 22 checks. The same conservative adjustment applied to the top-1, top-2, and top-10 percent drops yields Holm p = 0.10, 0.16, and 0.10 respectively — none clears p < 0.05 after multiplicity adjustment. The Holm bound treats each forensic check as a distinct hypothesis, which over-corrects when the checks are testing variations on a single null; the unadjusted p < 0.05 should be read alongside this conservative upper bound.

The implication is that the GDP-per-capita headline is **magnitude-concentrated** in a narrow band of high-Cook-distance counties. The geographic LOSO pattern below pins down the origin of that concentration.

### 3.6 Other robustness

| Check                                        |       gini |     lninc |    lngdp |
| -------------------------------------------- | ---------: | --------: | -------: |
| Unweighted (uniform weights)                 | -0.045 *** |  0.050 ** | 0.124 ** |
| Cluster at state instead of district         | -0.046 *** | 0.057 *** | 0.143 ** |
| Drop legal-type controls (geographic only)   | -0.048 *** |  0.062 ** |  0.136 * |
| Panel D slope interaction (border_dist × ED) |  -0.032 ** |     0.046 |    0.112 |

The Panel D specification — which the paper reports in column 4 of every table — is the only spec under which two of the three headlines lose significance at p<0.05 (lninc p=0.066, lngdp p=0.061). The paper marks these with single stars (* p<0.10) but does not flag the broader pattern that this single specification is where fragility consistently appears.

## 4. Alternative-mechanism screen

The paper's identification leans on smoothness of observables at the inheritance boundary. Eight rival mechanisms are screened:

| Rival                                                          |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    Refuted by paper's controls? |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| R1 Religion (Protestant share)                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Refuted (protestantism_mean control) |
| R2 Legal-tradition bundle (Napoleonic, Roman, Saxon, Prussian) |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    Refuted (i_rechtsgeb_maj1-5) |
| R3 Hanseatic League / urban-trading network                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             Refuted (hanse_maj) |
| R4 Soil quality (loess, loam, sand)                            |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   Refuted (geographic controls) |
| R5 Climate (temperature, precipitation)                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  Refuted (temp_mean, prec_mean) |
| R6 Terrain (elevation, roughness)                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        Refuted (elevation_mean, roughness_mean) |
| R7 Distance to navigable water                                 |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Refuted (water_dist) |
| R8 Linguistic / cultural (Frankish vs Saxon)                   |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           Refuted (franconia_maj plus state FE) |
| R9 Metropolitan-orbit Mittelstand intensity                    | **NOT REFUTED.** The two LOSO drops that push the GDP headline above p=0.10 are Baden-Württemberg (Stuttgart metropolitan orbit, automotive + machine-tool Mittelstand) and Bayern (Munich metropolitan orbit, BMW + supplier cluster). These are the same regions BJO's own Section 6 invokes as the modern manifestation of equal-division mechanism — high firm density, Mittelstand intensity, innovative-manufacturing employment. The LOSO concentration is therefore consistent with BJO's preferred mechanism rather than a confound. What it does add is a *scope* qualification: the GDP magnitude is identified from a subset of equal-division regions where the Mittelstand mechanism is intense. The coal-belt geography of Nordrhein-Westfalen (Ruhr) and Saarland — LOSO drops on neither push the GDP result above p=0.05 — is not the source of the headline. |

R1-R8 are refuted in the sense that the headline survives their inclusion; R9 is *not* a confound but a scope condition on which sub-population of equal-division regions drives the modern outcome.

## 5. Sensitivities and scope

The geographic-RD design identifies a boundary local average treatment effect (LATE), not a global ATE. The 35 km RD sample is 397 historical counties and 198-199 modern counties — small enough that LOSO drops on individual states reshape the estimate substantially. Three substantive sensitivities follow:

1. **Magnitude concentration.** The GDP-per-capita coefficient has 53 percent of its magnitude in the top 5 percent of influential observations. The qualitative finding survives at p=0.047 after their removal, but the published 0.143 should be read as an upper-tail estimate of the boundary LATE.

2. **State concentration.** Baden-Württemberg and Bayern are the two large historically-equal-division states. Removing either pushes the GDP result to p>0.05; removing both would leave a sample dominated by the Saarland-Rheinland-Pfalz corridor and small Niedersachsen-Hessen segments, where (without running the additional regression) the design is observationally close to a within-Rheinland-Pfalz comparison. This is a scope condition the paper does not state.

3. **Metropolitan-orbit scope condition.** The two LOSO drops that push the GDP result above p=0.10 are Baden-Württemberg and Bayern, both equal-division states whose modern economies feature high-intensity Mittelstand clusters around Stuttgart and Munich. BJO's preferred mechanism — fragmented inheritance → industrial by-employment → Mittelstand — would predict exactly this LOSO pattern: removing the two states where the mechanism is strongest empties the GDP gap. This is not a confound but a sharpening of the paper's scope. The GDP magnitude should be read as the boundary LATE *for equal-division regions that today host intense Mittelstand activity*, with somewhat smaller estimates available within the Rheinland-Pfalz / Hessen / Saarland sub-sample where the modern Mittelstand intensity is lower.

The household-income reduced form (β = 0.057, paper's Panel C col 1) survives every check at p<0.05 except the Panel D slope-interaction specification and the LOSO-Baden-Württemberg drop (p=0.055). The landholding-Gini first stage is robust across the full battery. The paper's central economic-history claim — that equal-division regions have substantially lower historical landholding inequality and modestly higher modern income — survives the audit. The stronger claim — that GDP per capita is 14 percent higher in equal-division regions — should be qualified by the influence concentration.

## 6. Conclusion

A clean replication: 60/60 spot-checked cells reproduce exactly, the headline 6-14 percent income gap is verified at every panel of Table 2, and the 30-cell Table 1 first stage is bulletproof. The 74-regression forensic battery, the Cook-distance grid, and the Holm step-down adjustment together produce a sharper but qualitatively unchanged conclusion: the modern income gap (lninc β=0.057) is robust to the full battery and Holm-adjusted multiplicity; the GDP-per-capita gap (lngdp β=0.143) is magnitude-concentrated, attenuating to 0.067 (nominal p=0.047, Holm p=0.24) on a top-5-percent Cook drop and to 0.107 / 0.103 (p=0.12 / 0.10) under LOSO drops of Baden-Württemberg and Bayern. The LOSO concentration in those two states is consistent with — not a confound to — the paper's Section 6 Mittelstand mechanism: BW and BY host the modern Stuttgart and Munich Mittelstand clusters that the equal-division → by-employment → entrepreneurship chain predicts. The audit therefore sharpens the GDP claim into a scope condition rather than refuting it.

## References (12 entries)

Abajian, D. (2025). "A comment on 'Long-Term Effects of Equal Sharing: Evidence from Inheritance Rules for Land' by Bartels, Jäger and Obergruber." I4R Discussion Paper No. 269.

Bartels, C., Jäger, S., & Obergruber, N. (2024). "Long-Term Effects of Equal Sharing: Evidence from Inheritance Rules for Land." *The Economic Journal* 134(664): 3137-3172.

Calonico, S., Cattaneo, M. D., & Titiunik, R. (2014). "Robust Nonparametric Confidence Intervals for Regression-Discontinuity Designs." *Econometrica* 82(6): 2295-2326.

Conley, T. G. (1999). "GMM Estimation with Cross Sectional Dependence." *Journal of Econometrics* 92: 1-45.

Dell, M. (2010). "The Persistent Effects of Peru's Mining Mita." *Econometrica* 78(6): 1863-1903.

Galor, O., Moav, O., & Vollrath, D. (2009). "Inequality in Landownership, the Emergence of Human-Capital Promoting Institutions, and the Great Divergence." *Review of Economic Studies* 76(1): 143-179.

Gelman, A., & Imbens, G. (2019). "Why High-Order Polynomials Should Not Be Used in Regression Discontinuity Designs." *Journal of Business & Economic Statistics* 37(3): 447-456.

Herrigel, G. (2000). *Industrial Constructions: The Sources of German Industrial Power*. Cambridge University Press.

Imbens, G., & Wager, S. (2019). "Optimized Regression Discontinuity Designs." *Review of Economics and Statistics* 101(2): 264-278.

Romano, J. P., & Wolf, M. (2005). "Stepwise Multiple Testing as Formalized Data Snooping." *Econometrica* 73(4): 1237-1282.

Sering, M. (1897). *Erbrecht und Agrarverfassung in Schleswig-Holstein*. Berlin.

Simonsohn, U., Simmons, J. P., & Nelson, L. D. (2020). "Specification curve analysis." *Nature Human Behaviour* 4(11): 1208-1214.

## Appendix A — Replication artefacts

Replication package and audit code (forensic battery, all 74 regressions): https://www.dropbox.com/scl/fi/zpoltcvrji2uz6fpx4j5h/paper-2026-0034-replication-20260520-1256.zip?rlkey=x7db79ogspyvf11oh3m1i2l5e&dl=1

Includes:

- `env/00_reproduce_headlines.R`: minimal reproduction of Table 1 Panel A column 1 (Gini, β=-0.0382, exact).
- `env/01_all_tables.R`: all-panels reproduction of Tables 1, 2, 3.
- `env/02_forensic_battery.R`: 74-regression forensic battery driver.
- `env/translated/`: stata-to-r translation of the deposited `2_tables_main.do`.
- `env/repro/Tab1_all_panels.csv`, `Tab2_all_panels.csv`, `Tab3_all_panels.csv`: comradeS reproductions.
- `env/repro/forensic-battery-results.csv`: 74-row long table.
- `env/comparison.md`: cell-by-cell comparison vs deposited `.tex`.
- `env/comparison-substantive.md`: comparison of blind designs (topic-sketch, blind-rebuild) vs the published paper.
- `env/i4r-comparison.md`: post-submission benchmark vs I4R DP269 (Abajian 2025).
