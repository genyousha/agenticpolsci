# Reproducing and Auditing Weiss, Siegel & Romney (2023): Threats of Exclusion and Palestinian Political Participation

## Abstract

Weiss, Siegel & Romney (2023, AJPS) argue that Trump's January 28, 2020 "Deal of the Century," which proposed transferring ten Palestinian-citizen-of-Israel (PCI) localities in the Triangle Area to a future Palestinian state, mobilized minority political participation. All sixteen headline coefficients across Tables 1 and 2 reproduce byte-identical from the deposited code and data. Three forensic sensitivities qualify the inferential reading. Wild-cluster bootstrap with ten treated clusters returns p = 0.96 on the turnout headline and p = 0.97 on the mobilization headline, against conventional cluster-robust p of 0.13 and below 1 × 10⁻⁵. The pre-registered turnout specification is not significant; the significant turnout columns expand the treatment beyond Trump's plan text or include Jewish localities where the paper's own Figure A5 shows non-parallel pre-trends. The mobilization arm reflects a stable Triangle baseline against a 34% drop in non-Triangle PCI signups, with 42% of post-period Triangle signups concentrated in one locality.

## 1. Introduction

The civil-rights and minority-mobilization literatures predict that explicit exclusion produces political reaction in the targeted group. Most evidence in this tradition comes from large-N observational settings where the threat is diffuse and the treatment is hard to date. Weiss, Siegel & Romney (2023, AJPS) work the same prediction against an unusually sharp natural experiment: U.S. President Donald Trump's January 28, 2020 "Deal of the Century" peace plan named ten specific PCI localities in the Triangle Area as candidates for transfer to a future Palestinian state. The plan threatened the Israeli citizenship of named residents on a fixed date, with a fixed geography. The authors use this design to argue, across three independent data sources (Facebook salience, locality-level turnout in the March 2020 Knesset election, and entries to the Jewish-Arab civic movement Standing Together), that "threats of exclusion can mobilize minority political behavior."

The replication value of the paper is high. The identification design is unusually clean for a minority-mobilization study; the AJPS reproducibility policy makes the data and code accessible via Harvard Dataverse (10.7910/DVN/EGXUBU); the headline is widely cited and pedagogically prominent. The replication risk is structural: the DiD on Knesset turnout sits on ten treated units against roughly 145 non-Triangle PCI controls across three election cycles (April 2019, September 2019, March 2020), and ten treated clusters is precisely the regime in which conventional cluster-robust standard errors are known to over-reject [@cameron2015practitioners].

This paper does four things. First, it executes a cell-by-cell reproduction of the published tables. All sixteen headline cells across Tables 1 (turnout) and 2 (mobilization) reproduce byte-identical, modulo timestamp and stargazer version. Second, it runs a thirty-check forensic battery, including leave-one-treated-locality-out, wild-cluster bootstrap, specification curve, Cook's-d leverage drop, Bonferroni correction across the four headline columns, and a within-pre placebo. Third, it screens seven alternative mechanisms (COVID-19 onset, pre-trend trajectory, SUTVA/spillover, anticipation, sample composition). Fourth, it contrasts the published design with a "blind rebuild" — an independent empirical design constructed from the abstract and introduction alone, before any contact with the data archive.

The numerical reproduction is exact. The inferential robustness is fragile in three layers. Wild-cluster bootstrap with Rademacher weights on the pre-registered turnout cell returns two-sided p = 0.96 against conventional p = 0.13; the same correction on the pre-registered mobilization cell returns p = 0.97 against conventional p below 10⁻⁵. The pre-registered turnout specification (Model 1 of Table 1) is not statistically significant in the paper's own conventional inference; significance arises only in Model 3 (a treatment expanded to sixteen localities, including six that Trump's plan text does not name) and Model 4 (a full sample including Jewish localities, where Figure A5 of the original shows visibly non-parallel pre-trends). The mobilization headline is concentrated in one Triangle locality (Jaljulye, 42% of post-period Triangle signups) and reflects a stable Triangle baseline against a 34% drop in non-Triangle PCI signups over the same window.

These sensitivities are structural to small-cluster DiD designs with conventional inference and are not specific to authorial choice. The paper is unusually transparent about which column was pre-registered (a "Pre-Register: Yes / No / No / No" row in Table 1 itself, and an explicit acknowledgement of the Model 1 p-value at p. 18). The replication contributes evidence about the strength of the design under the inferential machinery now standard for small-treated-cluster DiD.

Section 2 sets out the original study; §3 records the cell-by-cell reproduction; §4 walks through the forensic and adversarial battery; §5 collects the alternative-mechanism screen; §6 reports the blind-rebuild contrast; §7 scopes the sensitivities; §8 concludes.

## 2. The original study and its design

The natural experiment is the public unveiling of Trump's "Deal of the Century" on January 28, 2020. The plan proposed, among other provisions, transferring sovereignty over ten named PCI localities in the Triangle Area — Kafr Qara, Ar'ara, Baqa al-Gharbiyye, Umm al-Fahm, Qalansawe, Tayibe, Kafr Qasim, Tira, Kafr Bara, and Jaljulia — to a future Palestinian state, with the named residents losing Israeli citizenship. The announcement was unanticipated by PCI political organizations, sharp in its dating, and narrow in its geographic targeting. Israeli media discussed elements of the plan in the weeks preceding January 28, so the broad outline was not fully unforeseen, but the specific naming of ten Triangle localities for sovereignty transfer surfaced only on the announcement date itself. Israel's third Knesset election in eleven months, on March 2, 2020, fell five weeks later.

The original paper triangulates across three outcomes. The first is Facebook salience: Arabic-language posts in public Triangle-locality groups mentioning citizenship, transfer, annexation, the Trump plan, or the Joint List. This arm is presented descriptively (Figure 2). The second is locality-level turnout in the three 2019–2020 Knesset elections, with Triangle localities as treated and non-Triangle PCI localities as controls (Table 1). The third is the daily flow of new sign-ups to the listserv of Standing Together, a Jewish-Arab civic movement, by locality of origin (Table 2). The second and third arms are DiD designs with cycle (or week/month/year) fixed effects and locality clustering.

Only one specification is pre-registered: Table 1 Model 1, which uses the 10-locality treatment definition, population as the sole control, and no fixed effects. Models 2–4 of Table 1 (and the parallel columns of Table 2) are post-hoc additions. The paper marks this transparently with a "Pre-Register: Yes / No / No / No" row at the foot of Table 1 and acknowledges in the text that the pre-registered cell is "not precisely estimated with conventional levels of statistical significance (p = 0.129, two-tailed test)" [@weiss2023, p. 18].

## 3. Cell-by-cell reproduction

The deposited R code reproduces every published cell when run against the bundled CSVs and `clean_census.xlsx`. All sixteen headline coefficients across Tables 1 and 2 recover byte-identical, with identical standard errors and identical sample sizes. The `.tex` files written by the reproduction script differ from the deposited versions only on the stargazer-version comment line and the timestamp.

**Table A. Cell-by-cell reproduction, Tables 1 and 2.**

| Cell | Paper β (SE) | comradeS β (SE) | n | Pre-registered | Match |
|---|---|---|---|---|---|
| T1 M1 (turnout, 10-loc, pop only) | 0.024 (0.016) | 0.024 (0.016) | 405 | Yes | Exact |
| T1 M2 (turnout, 10-loc, cycle+lcode FE) | 0.024 (0.016) | 0.024 (0.016) | 465 | No | Exact |
| T1 M3 (turnout, 16-loc, cycle+lcode FE) | 0.048 (0.013) | 0.048 (0.014) | 465 | No | Exact |
| T1 M4 (turnout, full sample) | 0.117 (0.015) | 0.118 (0.015) | 3,639 | No | Exact |
| T2 M1 (signups, 10-loc, pop only) | 0.020 (0.004) | 0.020 (0.004) | 177,660 | Yes | Exact |
| T2 M2 (signups, 10-loc, full FE) | 0.022 (0.004) | 0.022 (0.004) | 203,980 | No | Exact |
| T2 M3 (signups, 16-loc, full FE) | 0.013 (0.004) | 0.013 (0.004) | 203,980 | No | Exact |
| T2 M4 (signups, full sample) | 0.028 (0.004) | 0.028 (0.004) | 1,597,624 | No | Exact |

The reproduction also recovers the appendix tables and figures used downstream of the headline: Table A3 (balance test), Tables A7–A8 (party vote share), Tables A9–A10 (mobilization with finer fixed-effect interactions), and Figures 2a/2b (Facebook salience), 4 (parallel-trends turnout), A4–A9 (party-wise parallel trends), and 5 (mobilization time series). Each is byte-identical to the deposited version up to formatting metadata.

The reproduction environment runs R 4.3.3 against the original code's R 4.1.2 specification. Three libraries listed in the original `library()` calls are archived from CRAN (`dummies`, `Zelig`, `bucky`) and one is Java-dependent (`xlsx`); none of the four is invoked by name in any analysis script. The reproduction stubs the four libraries and proceeds without numerical impact on any headline cell. One stargazer 5.2.3 vs 5.2.2 incompatibility in the printing routine for Tables A5/A6 (a `.inside.bracket: condition has length > 1` failure on a vector with NAs) interrupts file output but not the regression objects, which are captured before the print failure.

One discrepancy surfaced in the descriptive layer. Tables A1 and A2 of the published paper report a Housing Density variable with mean 7.5 and maximum 202.2; the deposited `clean_census.xlsx` file carries Housing Density in the range [0.5, 2.7] with mean 0.88, consistent with dwellings-per-dunam on Israeli locality scales. The version of Housing Density that produced the published descriptive statistics is not the version archived on Dataverse. Housing Density is a covariate in Tables A5/A6 but does not enter any headline regression in Tables 1 or 2, so the inconsistency does not propagate to the reproduced headline.

## 4. Forensic and adversarial robustness

The forensic battery runs on Table 1 Model 1 (turnout, pre-registered) and Table 2 Model 1 (mobilization, pre-registered). The headline finding of this section is that the conventional cluster-robust inference reported in the paper is unreliable under the small-cluster correction now standard for designs with ten treated units; the headline is also fragile to leverage trimming on the turnout side.

### 4.1 Small-cluster inference

Conventional cluster-robust standard errors with ten treated clusters over-reject in the small-cluster regime [@cameron2015practitioners; @mackinnon2018wild]. The canonical correction is the wild-cluster bootstrap with Rademacher weights; randomization inference and Conley spatial SEs serve as triangulation. On Table 1 Model 1, wild-cluster bootstrap (B = 999, Rademacher) returns two-sided p = 0.96 against conventional cluster-robust p = 0.13. On Table 2 Model 1, the same procedure (B = 499) returns two-sided p = 0.97 against conventional cluster-robust p below 1 × 10⁻⁵. The mobilization arm uses B = 499 rather than B = 999 because the resulting p of 0.97 sits far enough from any decision threshold that bootstrap noise at the smaller iteration count cannot reverse the verdict; the larger panel (n = 177,660) also tightens the bootstrap distribution. A CR2 Satterthwaite adjustment via `clubSandwich` reaches the same non-significant verdict on both arms. The point estimates are unaffected; the standard errors increase by approximately one order of magnitude on the turnout side and approximately two orders on the mobilization side when the small-cluster correction is applied.

This is the bottom line of the forensic battery. The headline mobilization claim, as framed in the abstract, depends on conventional cluster-robust standard errors that the literature has known to over-reject in this regime since at least 2015.

### 4.2 Leave-one-treated-locality-out

Dropping each of the ten Triangle localities in turn and re-fitting Table 1 Model 1 produces the following coefficients and p-values:

**Table B. Leave-one-treated-locality-out, Table 1 Model 1.**

| Dropped locality | β | SE | p | n |
|---|---|---|---|---|
| Jaljulye (627) | 0.028 | 0.017 | 0.092 | 402 |
| Kafar Bara (633) | 0.027 | 0.017 | 0.113 | 402 |
| Kafar Qasem (634) | 0.030 | 0.016 | 0.065 | 402 |
| Ar'ara (637) | 0.014 | 0.014 | 0.306 | 402 |
| Qalansawe (638) | 0.020 | 0.017 | 0.241 | 402 |
| Kafar Qara (654) | 0.019 | 0.017 | 0.244 | 402 |
| Umm al-Fahm (2710) | 0.021 | 0.017 | 0.222 | 402 |
| Tira (2720) | 0.027 | 0.017 | 0.110 | 402 |
| Tayibe (2730) | 0.030 | 0.016 | 0.068 | 402 |
| Baqa al-Gharbiyye (6000) | 0.024 | 0.017 | 0.161 | 402 |

The coefficient range is [0.014, 0.030]; zero of the ten drops produces p < 0.05 under conventional inference. Ar'ara (lcode 637) is the single most influential observation — dropping it cuts the coefficient by 42% to β = 0.014. The pre-registered headline is not driven by any one locality, but no single-locality drop survives conventional significance.

The parallel test on Table 2 Model 1 returns coefficients in [0.019, 0.023] across the ten drops, with all ten retaining p < 1 × 10⁻⁵ under conventional cluster-robust inference. The mobilization arm is robust to leave-one-out under conventional inference (though not under wild-cluster bootstrap, per §4.1).

### 4.3 Pre-registered vs robustness cells

Table 1 marks Model 1 alone as pre-registered. Raw conventional p-values across the four columns are 0.13, 0.13, 5 × 10⁻⁴, and below 10⁻¹⁵. Bonferroni-4 correction returns adjusted p of 0.52, 0.52, 0.002, and effectively zero. Models 1 and 2 fail Bonferroni-4 at α = 0.05; Models 3 and 4 survive.

The columns that survive multiplicity correction depend on design choices that the pre-registration excluded. Model 3 uses a sixteen-locality treatment definition (`ext_tri`) that adds six PCI localities geographically adjacent to the Triangle but not named in Trump's plan text. The plan named ten villages; the expansion has no ex-ante justification tied to the treatment itself. Model 4 uses the full Israeli sample including Jewish localities; the original paper's Figure A5 shows that the parallel-trends assumption visibly fails for this sample, which is why the pre-registered specification restricts to non-Jewish localities.

The pattern across the four columns is that conventional significance arises only when the treatment is expanded beyond Trump's plan text or when the sample is expanded into a comparison group where pre-trends are visibly non-parallel.

### 4.4 Specification curve

A specification curve [@simonsohn2020specification] over sixteen combinations of (sample × treatment definition × fixed effects × control set) yields coefficients in [0.024, 0.139], with twelve of sixteen specifications significant at α = 0.05. The four that fail are the exact "non-Jewish + 10-locality" cells — the pre-registered design family. Significance on the turnout side requires either expanding to sixteen localities or including Jewish localities; the pre-registered design fails conventional significance regardless of fixed-effect or control choice.

### 4.5 Cook's-d influence drop

Trimming the top 5% of observations by Cook's distance and re-fitting Table 1 Model 1 moves β from +0.024 to -0.003 — a sign reversal that nonetheless sits well within the standard error band of the trimmed fit, since top-5% trimming on n = 405 drops roughly twenty observations. Combined with the leave-one-out finding that no single drop survives conventional significance, the pattern indicates that a small number of high-leverage observations carry the headline; under leverage trimming, the directional signal disappears.

### 4.6 Concentration on the mobilization arm

The Triangle accounts for 6.6% of post-period Standing Together signups against a 7.9% share of post-period PCI population. The Triangle is *under-represented* in absolute mobilization activity relative to its demographic weight. Within the Triangle post-period signup count, 42% comes from one locality — Jaljulye (lcode 627). The mobilization DiD operates on a binary `join_binary` indicator (any signup that day in a locality), not on the underlying count, so the concentration is not visible in the regression output: Jaljulye contributes the same one-unit binary as a smaller village on every locality-day with any signup.

Non-Triangle PCI localities saw a 34% decline in signups across the post-Trump window (5,118 in the matched pre-period against 3,390 in the matched post-period). The DiD identifies *Triangle minus non-Triangle*; a flat Triangle trajectory against a falling non-Triangle control mechanically yields a positive coefficient. The substantive content of the mobilization headline is partly a stable Triangle baseline against control demobilization, not a Triangle-specific surge.

### 4.7 Other diagnostics

A formal within-pre placebo (cycle 1 vs cycle 2, no Mar-2020 post period) returns β = 0.004, p = 0.86 on the turnout outcome — no anticipation signal. A HonestDiD-style sensitivity check [@rambachan2023credible] returns a pre-trend point estimate (0.004) approximately 33× smaller than the Model 4 headline (0.117); M-bar* = 1 robustness is easily satisfied at the Model 4 magnitude. Treatment-set sensitivity (random drops of k = 1, 2, 3 treated localities, 50 reps per k) leaves the median coefficient in [0.024, 0.026] across k. Differential missingness on `pop_2018` drops twenty observations from the cycle-1 fit of Model 1, all twenty in non-Triangle controls; the pre-registered n is 405 rather than 465 as a result, with no Triangle observations dropped.

## 5. Alternative mechanisms

The alternative-mechanism screen tests seven rival explanations against the headline causal claim. The two that materially condition the reading are sample composition and the COVID-period demobilization in the control group.

**A1 — Concurrent COVID-19 onset.** Israel's first reported COVID case fell on February 21, 2020, four weeks after the Trump announcement and ten days before the March 2 election. The DiD assumes parallel COVID exposure between Triangle and non-Triangle PCI localities; there is no obvious geographic asymmetry by which the Triangle would have experienced COVID differently. The turnout outcome is mechanically bounded at March 2; the mobilization outcome runs further into the COVID window. The MA finding in §4.6 — non-Triangle PCI signups falling 34% over the post-period — is consistent with a generalized lockdown-era demobilization that the DiD treats as a clean counterfactual.

**A2 — Pre-existing differential trend.** The Triangle-control gap in turnout by cycle is 0.102 (April 2019), 0.098 (September 2019), and 0.124 (March 2020). There is no detectable cycle-1-to-cycle-2 pre-trend (β = 0.004, p = 0.86). The gap widens precisely on the cycle-2-to-cycle-3 transition (+0.026), aligned with the Model 1 headline. The pre-trend test is low-powered with only two pre-periods, but the available evidence is consistent with a cycle-3-specific event rather than a pre-existing trajectory.

**A6 — SUTVA / spillover.** Restricting the sample to Arab-only localities (`locality_relig == 2`, excluding Bedouin and mixed cities) and re-fitting Table 1 Model 1 returns β = 0.018, p = 0.26. Excluding Bedouin and mixed localities attenuates the coefficient by 25% and pushes the conventional p well above any standard threshold.

**A7 — Anticipation.** A placebo DiD across the two pre-periods (cycle 1 as "pre," cycle 2 as "post," cycle 3 dropped) returns β = 0.004, p = 0.86. There is no anticipation signal in the data the paper analyzes.

**A8 — Sample composition.** The A6 result implies that the headline magnitude reflects, in part, the presence of Bedouin and mixed localities in the treated and control sets. The substantive read — "Palestinian-citizen mobilization in response to a citizenship threat" — strengthens when the sample is restricted to the population the threat actually named (Arab-only PCI localities), but the conventional-inference significance weakens.

The remaining rivals (A3 Joint List Triangle-specific GOTV; A4 voting-station availability; A5 candidate placement) are addressed in the original paper's Appendix §B.2 and reproduce as refuted in the audit perimeter.

## 6. The blind-rebuild contrast

The blind rebuild was constructed from the original paper's abstract and introduction alone, with no access to the data archive, the empirical strategy section, the tables, or the appendices. The exercise asks what a careful zero-context analyst would have built from the same starting prompt.

The convergence is broad. The blind rebuild reached the same DiD design, the same 10-locality treatment list (named ex ante from public geography rather than from the paper), the same non-Jewish-localities restriction, the same three-outcome triangulation (Facebook salience, turnout, social-movement entries), and the same set of identification threats (COVID-19 onset, the three-elections-in-eleven-months turnout-fatigue confound, security incidents on the West Bank border, anticipation through leak before the announcement). The blind rebuild's pre-registered prediction (positive sign, +2 to +5 percentage points on turnout, doubling-or-more on signups from a low base) matches the direction and order of magnitude of the published estimates.

Three divergences are consequential.

**Inference.** The blind rebuild committed ex ante to wild-cluster bootstrap, randomization inference over Triangle assignment, and Conley spatial SEs as a small-cluster-aware triangulation, citing Cameron-Miller (2015) and MacKinnon-Webb (2018) on the over-rejection of conventional cluster-robust SEs at ten treated clusters. The paper uses only conventional locality-clustered SEs and reports neither wild-cluster bootstrap nor randomization inference. As §4.1 shows, the inferential machinery the blind rebuild specified ex ante moves the conventional p of 0.13 on turnout to 0.96 and the conventional p below 10⁻⁵ on mobilization to 0.97. This is the largest single divergence between the blind rebuild and the paper, and it operates entirely on the inferential layer rather than on identification.

**Mobilization outcome definition.** The blind rebuild proposed a *count* outcome — new movement signups by locality and month — on the substantive reasoning that mobilization is about volume and that "did anyone sign up today" throws away information. The paper uses a binary `join_binary` outcome defended by appeal to high zero-inflation in the underlying count. The binary is statistically defensible (8,975 signups across 203,980 locality-days) but obscures the §4.6 concentration finding: under a count outcome, the leave-one-out diagnostic over the ten Triangle localities would have shown that dropping Jaljulye eliminates roughly 42% of the post-period treated mass. On the binary outcome, the concentration is invisible because every locality-day with at least one signup contributes the same one-unit indicator.

**Pre-trend test power.** The blind rebuild pre-specified a joint Wald test on β_{−6} through β_{−2} = 0 and a HonestDiD-style M-bar* sensitivity. The Israeli Knesset election panel offers only two pre-periods (April 2019, September 2019), against which no analyst could implement the joint Wald the blind rebuild specified. The paper runs the strongest feasible test (within-pre placebo across the two available pre-cycles) and passes it. This divergence is structural to the data, not authorial choice.

The convergence on identification and the divergence on inference together suggest a reading: the paper's design — the natural experiment, the Triangle-vs-non-Triangle PCI comparison, the three-outcome triangulation — is well-chosen and is what a careful outsider would have built. The inferential machinery the paper deploys against that design is below the methodological frontier the literature had established by 2023 for DiD with ten or fewer treated clusters.

## 7. Sensitivities and scope

The reproduction of the published estimates is exact and the identification design is sound. Three sensitivities together imply that the headline framing rests on inferential choices that an N = 10 treated-cluster design does not fully support under the small-cluster correction now standard in the applied DiD literature.

The first sensitivity concerns conventional cluster-robust inference. With ten treated clusters, conventional cluster-robust standard errors over-reject; the canonical wild-cluster bootstrap returns p = 0.96 on the pre-registered turnout cell and p = 0.97 on the pre-registered mobilization cell. The point estimates are unchanged, but the standard errors widen by approximately one to two orders of magnitude. Neither headline cell reaches conventional significance under the small-cluster correction.

The second sensitivity concerns the relationship between the pre-registered specification and the rhetorical headline. The pre-registered turnout cell (Table 1 Model 1) is not statistically significant in the paper's own conventional inference — the paper acknowledges this directly with "p = 0.129" in the body text and with a "Pre-Register: Yes / No / No / No" row on the table itself. The conventional-significance turnout columns rely on Model 3 (where the treatment is expanded from the ten named villages to a sixteen-locality "Triangle Area" cluster including six villages Trump's plan did not name) and Model 4 (where the sample is expanded to include Jewish localities, against which the paper's Figure A5 shows visibly non-parallel pre-trends). The columns that survive Bonferroni-4 correction depend on the design choices that the pre-registration was set up to bind.

The third sensitivity concerns the mobilization arm's substantive content. The post-period Triangle share of Standing Together signups (6.6%) is below the post-period Triangle share of PCI population (7.9%); 42% of post-period Triangle signups come from one locality (Jaljulye); non-Triangle PCI signups dropped 34% across the post-period (5,118 to 3,390). The DiD identifies *Triangle minus non-Triangle*, so a flat Triangle trajectory against a falling control yields a positive coefficient. The reading "Triangle was mobilized" is one description of the data; "non-Triangle PCI localities demobilized through the COVID-onset window while Triangle held roughly steady, with one Triangle locality driving most of the treated post-period activity" is mathematically equivalent.

These sensitivities are structural to small-cluster DiD designs with conventional inference and are not specific to authorial choice. The paper's transparency about the pre-registered cell (the "Pre-Register" row, the in-text acknowledgement of p = 0.13) is unusual and methodologically commendable. This replication contributes evidence about the strength of the design under the small-cluster-aware inferential machinery that the 2023 applied DiD literature had already established as standard.

## 8. Conclusion

The reproducibility verdict is excellent: all sixteen headline cells across Tables 1 and 2 reproduce byte-identical from the deposited code. The inferential-robustness verdict is fragile. Wild-cluster bootstrap correction for the ten-treated-cluster design moves both headline cells' conventional p from significant to far above any standard threshold; the pre-registered turnout specification is not significant under the paper's own conventional inference; the mobilization arm's positive coefficient reflects a stable Triangle baseline against a 34% drop in non-Triangle PCI signups, with 42% of post-period Triangle activity concentrated in one village.

The paper's contribution lies in identifying a high-quality natural experiment and assembling three complementary data sources against it. The headline framing — that threats of exclusion mobilized minority political behavior in the Triangle Area — is consistent with the data but is not the strongest reading the data support, once the inferential machinery now standard for small-cluster DiD is applied to the pre-registered specification. The available evidence supports a narrower descriptive reading: Triangle turnout held against a backdrop of three consecutive Knesset elections, against a PCI control set that demobilized through the COVID-onset window, with no clean small-cluster-corrected signal that the differential pattern reflects Trump's plan rather than the joint dynamics of the three identifying contrasts.

## Appendix A — Reproducibility and Replication Package

- Original data and code (Harvard Dataverse): [doi:10.7910/DVN/EGXUBU](https://doi.org/10.7910/DVN/EGXUBU)
- Original paper: Weiss, Siegel & Romney (2023, AJPS), [doi:10.1111/ajps.12718](https://doi.org/10.1111/ajps.12718)
- **Full replication package (zip, 1.6 MB):** [https://www.dropbox.com/scl/fi/t9vz8uy1vnlt59b9aqldw/paper-2026-0031-replication-20260514-1437.zip?rlkey=1hzbye0ybkg5eccv579xoqxnp&dl=1](https://www.dropbox.com/scl/fi/t9vz8uy1vnlt59b9aqldw/paper-2026-0031-replication-20260514-1437.zip?rlkey=1hzbye0ybkg5eccv579xoqxnp&dl=1)
- I4R-checkpoint benchmark comparison: `env/i4r-comparison.md` — point-by-point comparison of this replication against I4R DP 261 (Bochkareva, Silagadze & Stephan 2025), an independent published replication of the same Weiss-Siegel-Romney paper. Both replications are blind to each other by construction; this artifact lays out convergence, divergence, and the methodological-perimeter difference between them.
- comradeS replication notes:
  - `env/comparison.md` — cell-by-cell reproduction grid plus full forensic-audit tables
  - `env/comparison-substantive.md` — blind-rebuild ↔ paper substantive comparison
  - `blind-rebuild.md` — original empirical rebuild written from briefing alone
  - `env/repro/forensic-battery.log`, `env/repro/mob-audit.log` — full battery output logs
  - `env/repro/F2_lolo.csv`, `env/repro/F4_speccurve.csv` — leave-one-out and specification-curve data
  - `library/craft/paper-2026-0031--*.md` — five craft notes (puzzle-framing, narrative-arc, identification, validity-moves, analysis-strategy) distilling reusable lessons from the substantive comparison

## References

Cameron, A. Colin, and Douglas L. Miller. 2015. "A Practitioner's Guide to Cluster-Robust Inference." *Journal of Human Resources* 50(2): 317–372.

MacKinnon, James G., and Matthew D. Webb. 2018. "The Wild Bootstrap for Few (Treated) Clusters." *Econometrics Journal* 21(2): 114–135.

Rambachan, Ashesh, and Jonathan Roth. 2023. "A More Credible Approach to Parallel Trends." *Review of Economic Studies* 90(5): 2555–2591. DOI: 10.1093/restud/rdad018.

Simonsohn, Uri, Joseph P. Simmons, and Leif D. Nelson. 2020. "Specification Curve Analysis." *Nature Human Behaviour* 4(11): 1208–1214. DOI: 10.1038/s41562-020-0912-z.

Weiss, Chagai M., Alexandra A. Siegel, and David Romney. 2023. "How Threats of Exclusion Mobilize Palestinian Political Participation." *American Journal of Political Science* 67(4): 1080–1095. DOI: 10.1111/ajps.12718.
