# I4R-checkpoint comparison — paper-2026-0031 (comradeS) vs I4R DP 261

**Target paper**: Weiss, Siegel & Romney (2023), "How Threats of Exclusion Mobilize Palestinian Political Participation," *AJPS* 67(4): 1080–1095. DOI: 10.1111/ajps.12718.

**comradeS replication**: paper-2026-0031 (this submission). Blind-discipline: comradeS did NOT read I4R DP 261 until after polish and sim-review converged on the paper draft.

**I4R DP 261**: Bochkareva, Silagadze & Stephan (2025). "Replication of 'How Threats of Exclusion Mobilize Palestinian Political Participation'." [I4R DP 261](https://ideas.repec.org/p/zbw/i4rdps/261.html). The DP received a response from the original authors as I4R DP 262 (Weiss, Siegel & Romney 2025). Separately, I4R DP 262 in another lineage (Montpetit) flags religion-misclassification in unrelated papers; orthogonal to this comparison.

## 1. Convergence

The two replications agree on three substantive points.

**Computational reproducibility.** Both reproduce the published estimates cell-by-cell in R against the deposited Dataverse materials and find no numerical errors. comradeS reproduces all sixteen headline cells across Tables 1 and 2 byte-identical; BSS reproduce the analysis without substantial discrepancies, with their only flagged exception sitting in the Facebook-matching descriptive layer of Appendix Table A16 (where, lacking access to the raw Facebook data, they cannot test the matching).

**Treatment-definition sensitivity.** Both flag that the choice of treated set drives the headline. comradeS records this through a specification curve over sixteen combinations of (sample × treatment × FE × controls) showing that the four non-significant cells are exactly the "non-Jewish + 10-locality" cells — the pre-registered family. BSS make the same point directly: when only the six unmentioned (extended-Triangle) localities are treated, the turnout coefficient nearly doubles (0.048 → 0.080), and when the same six are isolated against a control set that excludes the ten named localities, the coefficient rises further (β = 0.082). Both replications converge on the conclusion that the headline is not driven by the ten localities Trump's plan actually names.

**Parallel-trends concern.** Both flag the parallel-trends assumption. comradeS's F6 within-pre placebo passes formally (β = 0.004, p = 0.86) but on only two pre-cycles, which the paper itself labels low-power. BSS run a leads-and-lags event study and conclude that pre-treatment parallel trends "do not unequivocally hold" — the 2015 estimate is significant; the 2019 estimate is marginally non-significant. Both replications stop short of declaring the assumption violated, but both place a flag on it.

## 2. comradeS-only findings

The following appear in comradeS's paper-2026-0031 but not in I4R DP 261.

- **Wild-cluster bootstrap inference (F3 / MF3).** comradeS finds WCB Rademacher p = 0.96 on the turnout headline (against conventional p = 0.13) and p = 0.97 on the mobilization headline (against conventional p below 10⁻⁵). BSS do not run any small-cluster bootstrap correction; their robustness section treats the published cluster-robust SEs as authoritative and audits only the design layer (treatment set, sample, outcome definition).
- **CR2 Satterthwaite via `clubSandwich` (F3).** comradeS triangulates the bootstrap with a CR2 small-cluster adjustment that reaches the same non-significant verdict. BSS do not report CR2.
- **Leave-one-treated-locality-out on the turnout arm (F2 / MF2).** comradeS shows 0/10 LOLO drops produce p < 0.05 on the pre-registered turnout cell, with coefficient range [0.014, 0.030]. BSS do not run LOLO.
- **Cook's-d influence drop (F9).** comradeS shows top-5% Cook's-d trimming flips the turnout sign from +0.024 to −0.003. BSS do not run influence diagnostics.
- **Locality-level concentration on the mobilization arm (MD3).** comradeS shows that Jaljulye (lcode 627) contributes 42% of post-period Triangle Standing Together signups. BSS do not decompose post-period treated activity by locality on the mobilization arm.
- **Control-group attrition on the mobilization arm (MA).** comradeS shows non-Triangle PCI signups dropped 34% across the matched post-period (5,118 → 3,390), implying that a flat Triangle trajectory against a falling control mechanically yields a positive DiD coefficient. BSS note Figure-5 instability in their §3.2.3 but do not quantify the control-side decline or its mechanical contribution to the DiD coefficient.
- **Bonferroni-4 multiplicity correction.** comradeS reports adjusted p-values across the four headline columns (0.52, 0.52, 0.002, ≈0). BSS do not adjust for multiple comparisons.
- **Data hygiene.** comradeS flags a Housing Density discrepancy between the published Tables A1/A2 (mean 7.5, max 202.2) and the deposited `clean_census.xlsx` (mean 0.88, range [0.5, 2.7]), plus the xlsx/Java/`dummies`/`Zelig`/`bucky` archived-package dependencies in the reproduction environment. BSS do not flag these.

## 3. I4R-only findings

The following appear in BSS but not in comradeS.

- **Facebook locality-matching audit (Table A16).** BSS independently re-estimate the propensity-score / nearest-neighbour match between Triangle and non-Triangle localities and recover a different set of ten matched controls than the original Table A16. They cannot test downstream impact without the raw Facebook data, but they document the divergence (their Table 3 vs the original's Table 2). comradeS reproduces Table A16 from the deposited code but does not re-derive the matches independently.
- **Vote-shares decomposition.** BSS extend the analysis to Blue-White party vote shares across the same four sample × treatment combinations (their Table 5) and show that, unlike turnout, the Blue-White effect is NOT driven solely by the six unmentioned localities — it appears across all four combinations. This is a substantive finding about which mechanism (mobilization vs strategic vote-switching) operates at which margin.
- **Event-study leads-and-lags on mobilization.** BSS run a ±60-day leads-and-lags event study on daily Standing Together registrations and conclude that (i) parallel trends hold imperfectly (six pre-treatment days show significant differences), and (ii) the effect emerges around 40 days post-announcement, near the March 2020 election, rather than immediately. comradeS does not run a leads-and-lags event study on the daily mobilization outcome.
- **Conservative outcome-threshold re-coding (≥ 3 joins/day).** BSS recode `join_binary` to require three or more registrations per locality-day and show that the mobilization effect loses conventional significance in 3 of 4 models (their Table 7). comradeS does not test alternative outcome thresholds on the mobilization arm.
- **Mechanism extension: institutionalized vs non-institutionalized participation.** BSS structure their conclusion around a refined theoretical claim — six-unmentioned localities (weak/ambiguous threat) drive institutionalized turnout; ten-mentioned localities (explicit/strong threat) drive non-institutionalized activism. This is the DP's headline theoretical contribution. comradeS notes the differential by treatment definition but does not articulate the ambiguous-vs-explicit-threat mechanism.

## 4. Framing / voice differences

The two replications reach the same data and roughly the same robustness flags, but they frame the headline impression differently.

**comradeS**: "FRAGILE-INFERENCE." The abstract leads with the wild-cluster bootstrap moving conventional p = 0.13 → 0.96 on turnout and p < 10⁻⁵ → 0.97 on mobilization. The paper's headline reading is that the design is excellent and the reproduction is exact, but the inferential machinery deployed against a ten-treated-cluster panel is below the methodological frontier the literature established by 2015–2018; under the small-cluster correction now standard, neither pre-registered cell survives.

**BSS**: "RESULTS GENERALLY SUPPORT THE MAIN ARGUMENT, WITH A MECHANISM REFINEMENT." The DP's headline reading is that the direction of the effect holds across robustness perimeters, and the substantive contribution is to refine the grievance mechanism by distinguishing weak/ambiguous threats (which channel into institutionalized voting) from strong/explicit threats (which channel into non-institutionalized activism).

The two verdicts are methodologically informative when read together. The same target paper, audited against two different methodological perimeters, produces opposite headline impressions: an inferential-machinery audit (small-cluster correction, LOLO, Cook's-d, multiplicity) reads the headline as fragile; a concept-mechanism-refinement audit (parallel-trends event study, treatment-set decomposition, alternative outcome thresholds) reads the headline as substantively supported with theoretical revision. Neither audit is wrong. They are answering different questions.

## 5. Methodological technique deltas

**comradeS uses (BSS does not)**: wild-cluster bootstrap with Rademacher weights (`fwildclusterboot`); CR2 Satterthwaite adjustment (`clubSandwich`); leave-one-treated-locality-out on the headline cell; Cook's-d influence trimming at the top 5%; Bonferroni-4 multiplicity correction across the four headline columns; formal joint within-pre placebo Wald test; specification curve across sixteen design combinations; HonestDiD M-bar* sensitivity benchmark; SUTVA/spillover sample restriction to Arab-only localities (`locality_relig == 2`); within-pre anticipation placebo (cycle 1 vs cycle 2).

**BSS uses (comradeS does not)**: independent re-estimation of the Facebook locality-match (their Table 3 vs the original Table 2); a Blue-White vote-share decomposition across the four sample × treatment combinations; a daily-and-monthly leads-and-lags event study on mobilization with ±60-day windows; a conservative outcome-threshold re-coding (`join_binary` requiring ≥ 3 registrations/day) tested across four model specifications; a weekly-aggregate visualisation of listserv registrations showing baseline instability.

**Both use**: cell-by-cell numerical reproduction; treatment-set sensitivity (10 vs 16 vs 6 vs "no 10"); parallel-trends scrutiny (different tools, same flag).

## 6. Bottom line

Two independent replications of the same paper, conducted blind of each other, agree on the facts and disagree on the verdict. They agree that the published estimates reproduce exactly, that the treatment definition is consequential, and that parallel trends are not unambiguously held. They disagree on which methodological perimeter is decisive. BSS audit the design layer — re-estimating matches, decomposing parties, testing outcome thresholds, examining leads-and-lags — and find the headline directionally supported with a mechanism refinement. comradeS audits the inferential layer — wild-cluster bootstrap, leave-one-out, Cook's-d, multiplicity correction — and finds the headline fragile under the small-cluster correction standard for designs with ten treated clusters. The verdict bifurcation is itself informative: it shows that "is the headline robust?" decomposes into "is the identification design robust to alternative definitions and outcomes?" (BSS: largely yes) and "is the inferential machinery robust under modern small-cluster corrections?" (comradeS: no). Readers of Weiss, Siegel & Romney (2023) who care about whether the substantive direction generalizes will read BSS as confirmatory with theoretical extension; readers who care about whether the published p-values support the rhetorical claim will read comradeS as a fragility result. Both perimeters are defensible, and the original paper's contribution — a sharp natural experiment, a three-outcome triangulation, transparent pre-registration disclosure — survives both audits intact at the design level even where the inferential and mechanism layers each take a hit.
