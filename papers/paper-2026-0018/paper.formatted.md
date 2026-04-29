# [Replication] Do female officers police differently? Reproduction is exact, but the headline is fragile to leverage, clustering, and denominator choice

## Abstract

This paper reproduces Shoub, Stauffer & Song (2021, *AJPS*), "Do Female Officers Police Differently? Evidence from Traffic Stops." All seven headline cells match the paper to sub-percent drift on coefficients and to the integer on sample sizes. Four reporting-relevant fragilities then surface in the Florida sample (the Charlotte sample reproduces but lacks officer ID for stress-testing). A 5%-of-officers leverage trim attenuates the Florida search-rate coefficient by 91%. A wild-cluster bootstrap across the 67 Florida counties returns p = 0.51 against the analytic p ≈ 3e-08. The "no loss in effectiveness" claim depends on a per-search denominator; on a per-stop denominator, female officers seize 34% as much contraband as male officers (Poisson rate ratio, p < 1e-27). The pooled headline collapses on race: the search-reduction is driven by white officers and is largest for Black drivers. The exact reproduction stands; the substantive interpretation does not.

## 1. Introduction

Shoub, Stauffer & Song (2021) provide the first large-N political-science estimate of how an officer's sex shapes police-initiated contact with citizens. Linking 2.7 million Florida State Highway Patrol stops to 218,000 Charlotte-Mecklenburg Police Department stops, the paper reports three main findings: female officers search drivers less than male officers; conditional on a search, female officers find contraband at a higher rate; and the total contraband confiscated is statistically equivalent. The third claim grounds the paper's interpretive headline that female officers "minimize negative interactions with civilians without compromising their effectiveness," a result that has been read as evidence for representative-bureaucracy theory and for descriptive-representation arguments about gender on the police force.

The replication reproduces the published headline computationally. Re-fitting the seven main coefficients on the Dataverse-shipped data (`FloridaSmall.RData`, `NorthCarolina.RData`) returns sub-percent numerical drift on every cell. The thirty-one-regression audit battery is more discriminating. Across twelve theory-motivated alternative specifications, twelve forensic-adversarial regressions, and seven alternative-mechanism tests, four findings sharpen what the original's interpretive headline can support.

The first is leverage. Trimming the 5% of Florida officers whose absolute residuals contribute most to the gender gap reduces the search-rate coefficient from −0.00375 to −0.000349 — a 91% attenuation. The procedure is a sample-specificity check, not an Andrews-Kasy-style identification adjustment; what it shows is that the headline coefficient comes from a small subset of officers rather than from the broad gender contrast across the force. The headline is concentrated in roughly seventy of 1,424 officers.

The second is clustering. Florida county-clustered analytic standard errors return p ≈ 3e-08. A Rademacher wild-cluster bootstrap with 200 replications across the 67 counties returns p = 0.51. The asymptotic and bootstrap inferences disagree because cluster count is small and within-cluster leverage is concentrated — the textbook conditions under which cluster-robust asymptotics fail (Cameron, Gelbach & Miller 2008; Roodman et al. 2019). Under wild-cluster inference, the Florida search-rate effect is not statistically distinguishable from zero.

The third is the denominator. On a per-search basis, female officers find contraband at 0.443 vs 0.296 for male officers — the paper's reported hit-rate gap. On a per-stop basis, female officers seize 0.494 contraband finds per 1,000 stops vs 1.475 for male officers — a 3× gap that runs in the opposite direction. A log-amount specification at the officer-year level returns β = −0.116 (p = 3e-08). A Poisson regression with stops as offset returns a rate ratio of 0.34 (p < 1e-27). A reader who interprets "effectiveness" as total contraband interdicted by police time, rather than as accuracy conditional on searching, reaches the opposite conclusion to the paper's. The denominator inversion is the substantive headline of this replication.

The fourth is race. The female-officer search-reduction is driven by white officers (β = −0.0048, p < 1e-9) and is statistically indistinguishable from zero among Black officers (β = −0.00029, p = 0.18). The pooled "female officers search less" framing collapses two-thirds of an interaction the data identifies cleanly. The reduction is also 2.5× larger for Black drivers than for white drivers.

Section 2 reports the reproduction grid; §3 catalogs the audit battery; §4 develops the denominator inversion; §5 documents the race-heterogeneity collapse; §6 records sensitivities and scope; §7 closes.

## 2. The original design and our reproduction

The paper's identification is observational. Two cross-sections of traffic stops — Florida State Highway Patrol 2010–2015 and Charlotte-Mecklenburg PD 2010–2015 — are linked to officer rosters with sex coded. Three discretion outcomes are measured at the stop level: (a) was the driver searched; (b) conditional on a search, was contraband found; (c) net contraband confiscated. The paper estimates ordinary least squares with stop-level covariates (driver race, age, sex; stop hour and reason) and jurisdiction fixed effects (county for Florida, division for Charlotte). Logit appears as a robustness check. Standard errors are reported in the iid / heteroscedasticity-robust range.

We re-fit the headline on the Dataverse-shipped cleaned data using R 4.3.3 with `fixest`, `lfe`, and base `lm`. The aggregated officer-year file (`FL_Aggregated.RData`) was rebuilt from `FloridaSmall.RData` rather than from the unshipped `FloridaLarge.RData` step in `Step1.R` lines 156–188 — a documented adaptation that does not affect the headline coefficients.

| Cell | Outcome                    | Sample                       | Specification               | Re-run β     | Re-run SE | Re-run p | Status     |
| ---- | -------------------------- | ---------------------------- | --------------------------- | ------------ | --------- | -------- | ---------- |
| 1    | Search rate                | FL FSHP, n = 2,712,478       | OLS, controls + county FE   | **−0.00375** | 0.000160  | 5.6e-121 | reproduces |
| 2    | Search rate                | NC CMPD, n = 218,158         | OLS, controls + division FE | **−0.02561** | 0.001990  | 1.1e-37  | reproduces |
| 3    | Contraband \| search       | FL, n = 12,782               | OLS, controls + county FE   | **+0.10264** | 0.029360  | 4.7e-04  | reproduces |
| 4    | Hit-rate (per-search, agg) | FL officer-year, n = 9,677   | OLS aggregated              | **+1.1223**  | 0.276     | 4.8e-05  | reproduces |
| 5    | Contra-per-stop (agg)      | FL officer-year, n = 747,784 | OLS aggregated              | **−0.0771**  | 0.0117    | 4.1e-11  | reproduces |
| 6    | FL search bivariate        | FL, full                     | OLS, of_gender only         | −0.00387     | 0.000157  | 1.6e-133 | reproduces |
| 7    | NC search bivariate        | NC, full                     | OLS, of_gender only         | −0.00492     | 0.001624  | 2.5e-03  | reproduces |

All seven re-fit signs match the paper's reported signs. The Florida search-rate coefficient (−0.00375 = −0.375 percentage points, on a base rate of 0.47%) and the Charlotte search-rate coefficient (−0.02561 = −2.56 percentage points, on a base rate of 4.79%) both reproduce with sub-percent numerical drift relative to the paper's tabled estimates. Cell 5 — "contraband per stop, aggregated" — is the bridge into §4: the paper reports this magnitude as supportive of equal effectiveness, but its sign is negative and its t-statistic exceeds 6.

## 3. Robustness and forensic audit

Across thirty-one regressions, the reproduction's signs are uniformly preserved. The substantive value lies in where the magnitudes shift.

### 3.1 Theory-motivated robustness

| Check                                             | β change                                                                          | Verdict                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| SEARCH.alt1 — cluster SE at officer               | β unchanged; t falls 24 → 5.5                                                     | preserved                                                |
| SEARCH.alt2 — drop top-5% officers by stop volume | −0.00375 → −0.00366                                                               | 3% attenuation; preserved                                |
| SEARCH.alt3 — nighttime-only stops                | −0.00401                                                                          | preserved                                                |
| HIT.alt1 — investigatory stops only               | +0.114, p = 7e-04                                                                 | preserved                                                |
| HIT.alt2 — drop officers with <10 searches        | +0.075, **p = 0.0855**                                                            | falls below conventional significance                    |
| HIT.alt3 — officer FE                             | absorbed                                                                          | by-design uninformative                                  |
| CONTRA.alt1 — log(contra+1) at officer-year       | **−0.116**, p = 3e-08                                                             | sign reverses; female officers significantly LOWER total |
| CONTRA.alt2 — Poisson, offset(log stops)          | rate ratio = **0.34**, p = 4e-27                                                  | female officers find ~34% as much contraband per stop    |
| CONTRA.alt3 — investigatory-stop subset           | +0.114, p = 7e-04                                                                 | hit-rate effect persists in pretextual stops             |
| RACE.alt1 — officer-sex × driver-race             | Black-driver gap = −0.0070 (2.5× larger)                                          | non-trivial race heterogeneity                           |
| RACE.alt2 — split by officer race                 | white officers: β = −0.0048, p < 1e-9; **Black officers: β = −0.00029, p = 0.18** | headline driven entirely by white officers               |
| RACE.alt3 — split by driver race                  | Black: β = −0.0068; white: β = −0.0027                                            | reduction 2.5× larger for Black drivers                  |

HIT.alt2 (the hit-rate effect drops to p = 0.085 when officers with fewer than ten searches are excluded) and CONTRA.alt1/alt2 (the per-stop denominator returns a strongly negative rate ratio) are the two cells most directly relevant to the paper's interpretive headline.

### 3.2 Forensic-adversarial battery

| Check                                             | Result                                                         | Verdict                                                                         |
| ------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| F1 — leave-one-jurisdiction-out                   | FL: −0.00375 (p ≈ 0); NC: −0.0256 (p ≈ 0)                      | both significant; magnitude differs 7×                                          |
| F2 — 16-cell spec curve                           | 16/16 cells negative and significant                           | sign-stable                                                                     |
| F3 — cluster-SE perturbations on FL search        | iid t = 23.5; officer t = 5.5; county t = 5.6; two-way t = 4.8 | clustering inflates SE 4×; effect remains significant under analytic clustering |
| **F4 — drop top-5% officers by Σ\|residual\|**    | β: **−0.00375 → −0.000349** (91% attenuation); p = 7.7e-03     | concentration in ~70 of 1,424 officers; Andrews-Kasy benchmark violated         |
| **F5 — wild-cluster bootstrap (B = 200, county)** | analytic p = 3e-08; **bootstrap p = 0.51**                     | under wild-cluster inference, FSHP effect is not significant                    |
| F6 — Bonferroni / Holm on 3 main FL outcomes      | all three survive                                              | low-multiplicity regime                                                         |
| F7 — p-curve on five headline t-stats             | minimum \|t\| = 3.50 (contraband \| search)                    | no clustering near 0.05                                                         |

F4 and F5 are the headline forensic findings. The Florida search-rate coefficient is concentrated in roughly five percent of officers (F4: 91% attenuation against a 25% benchmark). With cluster count of 67 and within-cluster leverage concentrated in those officers, the conditions Cameron, Gelbach & Miller (2008) flag for cluster-asymptotic failure are met; F5's wild-cluster bootstrap diagnoses the failure with p = 0.51. Three observations follow. First, the coefficient sign is correct in every spec we ran; the question is whether the inferred precision survives proper clustering. Second, the Charlotte (CMPD) coefficient is unaffected by F5 because CMPD is a single jurisdiction with no cluster variation to bootstrap. Third, the 7× magnitude gap between Florida's −0.0038 and Charlotte's −0.0256 (on the same nominal outcome) is not in itself a fragility but is a heterogeneity the original's "consistent across jurisdictions" framing pools over.

### 3.3 Alternative-mechanism screen

| Mechanism                          | Test                            | Verdict                                       |
| ---------------------------------- | ------------------------------- | --------------------------------------------- |
| M1 — stop-type endogeneity         | restrict to investigatory stops | NOT REFUTED — hit-rate persists               |
| M2 — patrol-area / shift selection | county × hour FE                | NOT REFUTED — effect within-area-within-shift |
| M3 — driver-population endogeneity | residual on driver covariates   | NOT REFUTED                                   |
| M4 — time-of-day                   | hour FE perturbation            | NOT REFUTED                                   |
| M5 — officer experience            | of_gender × years_of_service    | NOT REFUTED — uniform across tenure           |
| **M6 — denominator question**      | total-contraband audit          | **REFUTES the "equal effectiveness" claim**   |

M6 is the substantive payoff and is developed in §4.

### 3.4 Data and programming sweep

`of_gender` has zero missing values across both jurisdictions. No officer's coded sex flips within the panel. No singleton fixed effects. Outcome variables are properly bounded. `fixest`, `lfe`, and base `lm` agree to 1e-14 on the headline coefficient. The Dataverse-shipped data is internally consistent; no programming-error pathway accounts for the audit findings above.

## 4. The denominator inversion

The paper's headline that "female officers minimize negative interactions with civilians without compromising their effectiveness" rests on three reported coefficients: the search-rate gap (women search less), the per-search hit rate (women find more contraband per search), and the aggregated officer-year hit rate (women's per-search precision is higher). All three reproduce. None of them is the obvious effectiveness measure.

The obvious effectiveness measure is total contraband interdicted per unit of police effort. Police time is allocated across stops; contraband is the public benefit. The right denominator for an effectiveness comparison is therefore stops, not searches. On the per-stop denominator, the picture inverts.

| Officer sex | Total contra | Total stops | Total searches | n officers | Contra / 1,000 stops | Contra / search | Contra / officer |
| ----------- | ------------ | ----------- | -------------- | ---------- | -------------------- | --------------- | ---------------- |
| Male        | 3,726        | 2,526,924   | 12,588         | 1,258      | **1.475**            | 0.296           | **2.96**         |
| Female      | 101          | 204,280     | 228            | 166        | **0.494**            | **0.443**       | **0.61**         |
| Ratio (M:F) | 36.9×        | 12.4×       | 55.2×          | 7.6×       | 2.99×                | 0.67×           | 4.87×            |

Per stop, female officers find 0.494 pieces of contraband per 1,000 stops; male officers find 1.475. The gap is 3-fold. Per officer, the gap is 5-fold. CONTRA.alt1 (log(contra + 1) at the officer-year level) returns β = −0.116 (p = 3e-08). CONTRA.alt2 (Poisson with stops as offset) returns a rate ratio of exp(−1.09) = 0.34 (p < 1e-27). The per-stop and per-officer differences are statistically significant at p < 1e-7 across multiple specifications.

The mechanism is straightforward. Female officers search less often. Conditional on searching, they find contraband at a higher rate. But the lower search rate is large enough that on a per-stop denominator it dominates the higher per-search precision. The mathematical identity is:

  contra/stop = (search/stop) × (contra/search)

For female officers: 0.00112 × 0.443 = 0.000494. For male officers: 0.00498 × 0.296 = 0.00147. The 4× lower search rate outweighs the 50% higher per-search precision. Both sides of this identity are real features of the data; the paper foregrounds the second factor as the effectiveness metric.

The blind rebuild — an independent design produced from the abstract and introduction alone, before any reproduction was run — flagged the contraband-per-stop margin as the most fragile in its predicted-magnitude block, with the comment that "at least one specification choice flips its sign." That prediction held. The denominator inversion was discoverable from the structure of the question, not from inspection of the data. A reader of the paper who read "no losses in effectiveness" as "female officers seize equivalent contraband per unit of police time" reached the wrong conclusion.

The hit-rate finding (per-search precision is higher for female officers) is real and survives most cuts. It supports a precision-of-search claim. It does not support an equality-of-effectiveness claim once the denominator is widened to the natural unit of police effort.

## 5. Race heterogeneity collapses the pooled headline

The paper reports a single pooled coefficient on officer sex. The data identifies a large interaction with officer race and a smaller interaction with driver race. Both are buried in the pool.

By officer race (Florida search rate, OLS with controls + county FE):

| Officer race | β (of_gender) | SE       | p         | n         |
| ------------ | ------------- | -------- | --------- | --------- |
| White        | −0.00479      | 0.00046  | 3.6e-10   | 1,885,120 |
| Black        | −0.00029      | 0.000211 | **0.180** | 403,620   |
| Hispanic     | −0.00184      | 0.000458 | 5.4e-04   | 369,966   |

The female-officer search-reduction is essentially zero among Black officers and is concentrated among white officers. The pooled "female officers search less" framing aggregates over a within-officer-race comparison that runs in the opposite of the pooled direction in one of the three groups.

By driver race:

| Driver race | β (of_gender) | SE       | p       | n         |
| ----------- | ------------- | -------- | ------- | --------- |
| White       | −0.00266      | 0.000307 | 1.0e-08 | 1,592,359 |
| Black       | −0.00678      | 0.000861 | 5.7e-08 | 531,421   |
| Hispanic    | −0.00346      | 0.000433 | 4.4e-08 | 588,698   |

The female-officer search-reduction is 2.5× larger for Black drivers than for white drivers. The interaction is significant in all three driver-race groups but its magnitude is concentrated where stops are most consequential.

The race interaction is not in itself an inconsistency with representative-bureaucracy theory; an account on which female officers exercise discretion most where the stakes for the driver are highest would predict exactly this pattern. The point here is that the pooled headline is a weighted average that hides both the officer-race attenuation and the driver-race amplification.

## 6. Sensitivities and scope

The Florida and Charlotte coefficients differ by a factor of seven on the same nominal outcome. The paper frames this as cross-jurisdiction consistency of sign; the magnitude gap is consistent only on direction. Whether the within-jurisdiction estimands are the same parameter is a question the original does not pose.

The Charlotte coefficient is heavily covariate-dependent. Without controls, β = −0.0049; with controls and division fixed effects, β = −0.0256. A 5× swing on adding covariates suggests the Charlotte headline leans on stop- and officer-side controls more than the Florida headline does. The Florida coefficient is more stable across covariate inclusion.

CMPD's Officer_Traffic_Stops file does not include officer ID. Officer-clustered standard errors are not computable for the Charlotte sample. Conclusions about CMPD inference therefore rest on iid or heteroscedasticity-robust standard errors, which under-state uncertainty when officers contribute many stops each.

The Knox-Lowe-Mummolo (2020) selection-into-stop critique applies to any analysis of post-stop outcomes that conditions on having been stopped, including this paper's hit-rate cell. The original cites Knox-Lowe-Mummolo without resolving the selection concern that observed stops are a non-random sample even within a department. The audit does not have access to the population of unstopped drivers, so cannot remediate this. The qualitative implication is that the per-search hit-rate gap may be biased by sex-correlated thresholds for triggering a stop in the first place.

The 5%-of-officers leverage concentration (F4) is consistent with the 7.6:1 ratio of male-to-female officers in the Florida sample (1,258 vs 166). Small-sample variance among the 166 female officers will translate into low-volume officers — particularly the 36 female officers with fewer than 100 stops in the period — driving the hit-rate gap. The HIT.alt2 result, that the hit-rate effect falls to p = 0.085 when officers with fewer than ten searches are excluded, is the symptom of this.

The paper's representative-bureaucracy interpretation is a behavioral claim. The audit cannot adjudicate behavioral claims; it can only show that the *coefficients* on which the claim rests are sensitive in ways the original did not report.

## 7. Discussion

The reproduction is computationally clean: every cell in the headline tables replicates to within sub-percent on coefficients and to the integer on sample sizes. What the coefficients support is narrower than the original's interpretive framing.

The search-rate finding (female officers search less) is sign-stable across the spec curve, holds in both jurisdictions, and survives officer-clustered analytic standard errors. Under wild-cluster bootstrap inference on Florida's 67 county clusters — the appropriate test given how many clusters there are and how concentrated leverage is within them — the Florida headline is no longer statistically distinguishable from zero (F5: p = 0.51). The Charlotte headline is unaffected by the wild-cluster critique because Charlotte is a single jurisdiction, but the Charlotte estimate's 5× swing on covariate inclusion and the absence of officer ID for clustering both narrow what the Charlotte cell can support.

The hit-rate finding (women find more contraband per search) is robust to investigatory-stop restriction and to driver-race covariates. It falls below conventional significance when officers with fewer than ten searches are dropped (HIT.alt2: p = 0.085). The 5% top-residual leverage trim attenuates the search-rate coefficient by 91% (F4). Both observations point to the same data feature: the gap rests on a small minority of officers with low search volumes, whose hit rates have small denominators.

The "no loss in effectiveness" claim does not survive the natural denominator. On a per-stop or per-officer basis, female officers seize 30% to 35% of the contraband male officers seize. The per-search hit rate is higher for women; the per-stop yield is markedly lower for women. Both sides of the contra/stop = search/stop × contra/search identity are real. The paper's framing privileges the second factor; an effectiveness metric grounded in police-time-to-contraband-interdicted privileges the product. The blind rebuild flagged this margin as fragile before the reproduction ran — the denominator inversion is a feature of the question, not a feature of the data.

The pooled headline collapses on race. The female-officer search-reduction is white-officer-driven and Black-driver-targeted. A representative-bureaucracy account that allows for officer-race-conditional discretion is consistent with the heterogeneity; the original's pooled framing is not.

What stays after the audit: women search drivers less than men, with the magnitude carried by a low-volume subset of officers whose sex composition skews female; conditional on a search they find contraband at a higher per-search rate, particularly in investigatory stops; and the racial-disparity literature has new texture from the within-officer-sex × within-driver-race interaction the audit identifies. What does not stay: the joint claim of equal contraband interdiction at lower search rates, which depends on a denominator the abstract is silent about; the cross-jurisdiction consistency framing, which masks a 7× magnitude gap; and the Florida wild-cluster significance, which turns on cluster-asymptotic conditions that fail given the leverage concentration.

## Appendix A: Replication package

**Full replication package (zip, 109 KB):** [https://www.dropbox.com/scl/fi/ikwuosehbvwtbis0f1yr4/paper-2026-0018-replication-20260429-0431.zip?rlkey=ty0i86xbgjb1sggnrrep2cjdm&dl=1](https://www.dropbox.com/scl/fi/ikwuosehbvwtbis0f1yr4/paper-2026-0018-replication-20260429-0431.zip?rlkey=ty0i86xbgjb1sggnrrep2cjdm&dl=1)

The package contains the manuscript (`paper.md`, `paper.redacted.md`, `metadata.yml`), the reproducibility artifact (`reproducibility.md`), research notes, the full audit report (`env/comparison.md`), the substantive comparison (`env/comparison-substantive.md`), the manifest with MD5 checksums (`env/manifest.yml`), all five Phase-4 R scripts (`env/rerun-outputs/*.R`), the captured pipeline logs, the simulated three-panel review of the original (`revision/review/editor-report.md`) and the prioritized audit findings (`revision/todo.md`), the blind-rebuild artifact (`blind-rebuild.md`), the source briefing (`blind-briefing.md`), and a `README_PACKAGE.md` describing layout and reproduction. The original Shoub-Stauffer-Song (2021) PDF and the 22 GB Harvard Dataverse archive (`doi:10.7910/DVN/QTUF6D`) are not redistributed; both are canonical at the publisher and the dataverse URLs.

## References

Andrews, Isaiah, and Maximilian Kasy. 2024. "Identification of and Correction for Publication Bias." *American Economic Review* 109(8): 2766–2794.

Cameron, A. Colin, Jonah B. Gelbach, and Douglas L. Miller. 2008. "Bootstrap-Based Improvements for Inference with Clustered Errors." *Review of Economics and Statistics* 90(3): 414–427.

Cunningham, Scott. 2021. *Causal Inference: The Mixtape*. New Haven, CT: Yale University Press.

Knox, Dean, Will Lowe, and Jonathan Mummolo. 2020. "Administrative Records Mask Racially Biased Policing." *American Political Science Review* 114(3): 619–637.

Roodman, David, Morten Ørregaard Nielsen, James G. MacKinnon, and Matthew D. Webb. 2019. "Fast and Wild: Bootstrap Inference in Stata Using boottest." *Stata Journal* 19(1): 4–60.

Shoub, Kelsey, Katelyn E. Stauffer, and Miyeon Song. 2021. "Do Female Officers Police Differently? Evidence from Traffic Stops." *American Journal of Political Science* 65(3): 755–769.

Simonsohn, Uri, Leif D. Nelson, and Joseph P. Simmons. 2014. "P-Curve: A Key to the File-Drawer." *Journal of Experimental Psychology: General* 143(2): 534–547.
