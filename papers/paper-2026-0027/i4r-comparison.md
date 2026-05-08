# I4R-DP178 vs. comradeS replication — Mattingly (2024 AJPS)

**comradeS slug**: paper-2026-0027
**I4R report**: Jetter, Michael & Adhipradana P. Swasito (2024). "A Comment on 'How the Party Commands the Gun: The Foreign-Domestic Threat Dilemma in China'." I4R Discussion Paper Series No. 178. October 2024.
**I4R PDF MD5**: `5971162c3bf7e7b4d35aabc41680b41e`
**Comparison written**: 2026-05-08 (post-polish, post-sim-review, blind-discipline released)

---

## 1. Convergence

Both replications **fully reproduce** Mattingly's headline cells from the deposited code under their respective default platforms (comradeS: R 4.4 with `plm`; I4R: R first, then Stata with `reghdfe`). I4R reports a maximum standard-error difference of 0.003 units (8.6% of the original SE) when porting to Stata, with one combat × foreign cell sliding from p < 0.05 to p < 0.10 — Mattingly's Table 3 column (1) under the Stata implementation. comradeS's R-only audit produces all 18 headline coefficients exact to three decimals with identical SE and N.

Both replications **identify threat-period coding as the binding methodological sensitivity** in the paper. The paper's two binary windows on the domestic side (1990–93, 2012–15) and one binary window on the foreign side (2000–02) are described in I4R as "essential elements of the second and third results" and in comradeS as "the most discretionary coding choice in the paper." Both replications prioritize this as the inferentially load-bearing dimension.

Both replications converge on the descriptive verdict that **the paper's reproducibility layer is exemplary** — clean R-only pipeline, three CSVs and four scripts, no proprietary data, no missing intermediate files.

---

## 2. comradeS-only findings (relative to I4R-DP178)

### 2.1 The bifurcated reading frames the trade-off asymmetrically

comradeS partitions the headline along two axes: (a) loyalty/domestic-threat side robust on cohort, anticipation, concurrent-shock, leverage, leader-era, multiplicity; (b) professionalism/foreign-threat side single-window-dependent with a cohort-aging confound. I4R does not bifurcate. I4R's finding is closer to "domestic-threat coding is more sensitive than foreign-threat coding under their alternative-data perimeter." The two verdicts sit on different diagnostic perimeters and are not contradictory (see §6).

### 2.2 Leave-one-leader-era-out (F11)

comradeS decomposes the pooled domestic-threat result by which of the two coded shocks identifies it: dropping 2012–15 returns β = 0.203 (p = 7.9 × 10⁻⁵, post-Tiananmen alone strengthens); dropping 1990–93 returns β = 0.069 (p = 0.18, post–Bo-Xilai alone null); dropping both leaves the interaction undefined. The headline is driven by post-Tiananmen identification. I4R does not run this decomposition. The leader-era contribution to identification is a comradeS-specific finding.

### 2.3 Sun–Abraham cohort-aware estimator (S1)

comradeS runs a cohort-aware event study with the 1980s cohort as reference, returning β ∈ [0.272, 0.383] for the 1990–94 post-Tiananmen window — approximately three times the pooled two-way FE headline of 0.129. Pre-shock placebo years 1984–88 are jointly insignificant. The implication is that Mattingly's TWFE design **understates** the loyalty effect during the post-1989 window, which is a positive-direction sensitivity. I4R does not run cohort-aware estimators.

### 2.4 Cutoff sensitivity (F2/F3) with mechanism interpretation

comradeS sweeps the cutoff through ±2 years on both threat windows. On the domestic side, the pattern is asymmetric — shifts earlier collapse to β = −0.006 (p = 0.87), shifts later strengthen — which comradeS uses to refute the anticipation alternative-mechanism (M5). On the foreign side, the pattern is symmetric and single-peaked at the paper's 2000–02 window, which comradeS reads as observationally consistent with both a temporally narrow real effect AND a cohort-aging correlation. I4R does not run cutoff sensitivity in this form.

### 2.5 Alternative-mechanism screen (M1, M2, M5, M6)

comradeS enumerates rival explanations and tests each:

- M1 (commissar/operational track selection): not driving (F4 spec curve).
- M2 (Xi-era anti-corruption purge as concurrent shock): REFUTED — restricting to pre-2015 panel returns β = 0.190 (the headline grows when the purge years are dropped).
- M5 (pre-shock anticipation): REFUTED — shifting domestic window 2y earlier returns β = −0.006.
- **M6 (cohort aging on foreign-threat side): NOT REFUTED — the binding identification concern.** The combat-experienced cohort (Sino-Vietnamese-war veterans of 1979 and 1980s border-conflict participants) mechanically aged into senior-grade eligibility precisely during 2000–02. With one 3-year window and no out-of-window placebo at a different point in the cohort life cycle, the panel cannot separately identify the cohort-aging channel from the foreign-threat channel.

I4R does not run an alt-mechanism screen. M6 in particular is a mechanism-level claim that I4R's threat-redefinition perimeter does not reach.

### 2.6 Multiplicity (F10)

comradeS applies Bonferroni-3 across the three headlines (tie main, tie × domestic, combat × foreign). The first two survive comfortably (Bonf p = 9.96 × 10⁻⁵ and 1.4 × 10⁻³); combat × foreign fails (Bonf p = 0.129). I4R does not apply family-wise correction.

### 2.7 Influence drop (F5)

comradeS trims the top 5% of officer-years by within-FE residual magnitude and re-fits the headline. β = 0.098 (vs. baseline 0.129; 24% attenuation, p = 0.009). I4R does not run influence-drop.

### 2.8 Substantive blind-rebuild contrast: the relational-tie design move

comradeS runs a parallel blind empirical rebuild from briefing alone (abstract + intro). The rebuild explicitly rejects officer FE because "Tie and Combat are largely time-invariant for an officer; officer FE would absorb the regressor of interest." The contrast with the actual paper surfaces that Mattingly **recodes "tie" relationally**: `Tie_{it} = 1` only when officer i has a prior posting overlap with the *currently sitting* CMC Chairman in year t. This recoding makes individual FE feasible (and necessary) and gives the within-officer interaction its identification leverage from rotational variation in the referent. comradeS frames this as the design move on which the loyalty-side headline rests. I4R takes the design as given and does not engage with the relational coding as the pivotal craft move.

### 2.9 Sample-size disclosure

comradeS foregrounds that the panel for Tables 2–3 fits on 720 officers / 4,786 officer-years — a subset of the construction-dataset headline of 1,200+ officers / 12,000+ appointments. I4R notes a different but related point: the difference between 4,743 (R / plm) and 4,372 (Stata / reghdfe) is reghdfe's automatic singleton dropping. The two replications surface adjacent but distinct N-disclosure issues; neither is in tension with the other.

---

## 3. I4R-only findings (relative to comradeS)

### 3.1 CNTS-based alternative coding of domestic threat

I4R re-codes domestic threat using the Cross-National Time-Series Data Archive (Banks & Wilson 2023) — specifically demonstrations, riots, government crises, and a weighted conflict index. Re-estimating Mattingly's Table 2 column (4) specification with these alternatives:

| I4R alternative measure | β (Tie × DomThreat) | SE | p | comradeS perimeter |
|---|---:|---:|---:|---|
| Mattingly's original | 0.170 | 0.050 | < 0.01 | matched |
| × govt crises | **−0.132** | 0.098 | n.s. | not run |
| × demonstrations | **−0.080** | 0.035 | < 0.05 | not run |
| × riots | **−0.001** | 0.047 | n.s. | not run |
| × WCI > median | 0.029 | 0.057 | n.s. (p=0.605) | not run |
| × WCI > 75th pctile | 0.042 | 0.067 | n.s. (p=0.535) | not run |
| × WCI > 90th pctile | 0.073 | 0.057 | n.s. (p=0.204) | not run |

Three sign flips and zero positive-and-significant coefficients across six CNTS-based alternative measures. This is a coding-concept variation that comradeS does not run, and it is the strongest single piece of evidence in I4R-DP178. The verdict — "Mattingly's results are highly sensitive to how a period of domestic threat is defined" — is grounded in this table.

### 3.2 CINC- and MMP-based alternative coding of foreign threat

I4R re-codes foreign threat using the Composite Index of National Capability (Singer et al. 1972) and the Material Military Power index (Souva 2022), aggregated over China's strategic rivals (Thompson et al. 2021). Across multiple specifications using either the sum-of-rivals' or the largest-rival's military strength, with binary thresholds at median / 75th / 90th percentile and continuous variants:

- The combat × foreign coefficient generally preserves sign (positive) when using sum-of-rivals' aggregation.
- Statistical precision varies: some specs significant at 5%, some at 10%, some not at conventional levels.
- "Largest-rival" specifications switch sign to negative but remain statistically irrelevant.

I4R's overall reading: foreign-threat results are "more robust in sign but also vary in terms of magnitude and levels of statistical relevance." comradeS does not run rivalry-CINC/MMP redefinitions of foreign threat.

### 3.3 Cross-platform R ↔ Stata replication

I4R explicitly re-runs the full pipeline in Stata (`regress` for Table 1; `reghdfe` for Tables 2–3). The cross-platform check identifies one cell where significance changes from 5% to 10% in Stata, attributed to package-level differences in standard-error calculation. comradeS runs only the R pipeline.

### 3.4 Singleton-observation accounting

I4R documents that R's `plm::within` keeps singleton observations (officers with one panel-year), while Stata's `reghdfe` automatically drops them, producing the 4,743 vs. 4,372 N discrepancy across the two platforms. This is an "explainable discrepancy," inconsequential for headline magnitudes but worth recording. comradeS does not surface this specific R/Stata-package difference.

### 3.5 Year-FE collinearity with binary threat dummies

I4R notes that with year FE included, the standalone "Period of domestic threat" / "Period of foreign threat" dummies are mechanically nested in the year FE and yield β = 0 in some columns. I4R flags this as inconsequential for the interaction coefficients. comradeS does not address this collinearity issue.

---

## 4. Framing / voice differences

### 4.1 Adjudication versus agnosticism

I4R explicitly remains "agnostic about which definition strictly dominates others" and presents alternatives without selecting between them. The conclusion is "data-driven approaches reveal statistical precision, sign, and magnitude can differ, depending on the definition of threat. … We remain agnostic about which is the correct specification."

comradeS takes a stronger stance — the bifurcated verdict is asymmetric: the loyalty side is robust within-window (post-Tiananmen identification, refutes anticipation, refutes concurrent-shock, strengthens with cohort-aware estimator); the professionalism side is temporally localized with a cohort-aging confound that cannot be ruled out. comradeS does not adjudicate between definitions of threat externally; it adjudicates between mechanism-level alternatives within Mattingly's coding choices.

### 4.2 Naming the design move

I4R takes Mattingly's design as given (officer FE + year FE + binary threat windows) and asks whether the headline coefficient survives substitution of the threat indicator. comradeS identifies the relational recoding of "tie" as the pivotal design move that makes the design work, foregrounds it as a §5 standalone section, and ties the loyalty-side robustness to the design move rather than to the FE machinery alone.

### 4.3 Replication-paper voice

Both replications hold a clean third-person indicative voice. Neither addresses Mattingly with imperatives. I4R's title is "A Comment on …" — the I4R-genre convention. comradeS's title leads with the substantive finding ("The asymmetric trade-off: loyalty robustness and professionalism fragility").

---

## 5. Methodological technique deltas

| Technique | I4R-DP178 | comradeS |
|---|---|---|
| Cell-by-cell reproduction | ✓ (R + Stata) | ✓ (R only, 18/18 exact) |
| Cross-platform R ↔ Stata | ✓ | ✗ |
| Alternative-data threat redefinition (CNTS) | ✓ (6 alts on domestic) | ✗ |
| Alternative-data threat redefinition (CINC, MMP) | ✓ (multiple foreign) | ✗ |
| Cutoff sensitivity (year shifts on author's window) | ✗ | ✓ (F2, F3 ±2y sweeps) |
| Leave-one-cohort-decade-out | ✗ | ✓ (F1) |
| Leave-one-leader-era-out (drop one shock at a time) | ✗ | ✓ (F11 — comradeS-only contribution) |
| Influence drop (top 5% by residual) | ✗ | ✓ (F5) |
| Specification curve over FE × covariate grid | ✗ | ✓ (F4) |
| Cohort-aware event study (Sun–Abraham) | ✗ | ✓ (S1) |
| Pre-trend joint Wald | ✗ | ✓ (F9) |
| Family-wise multiplicity correction (Bonferroni-3) | ✗ | ✓ (F10) |
| Concurrent-shock subsetting (drop post-2014) | ✗ | ✓ (M2) |
| Anticipation refutation (window −2y) | ✗ | ✓ (M5) |
| Cohort-aging mechanism named | ✗ | ✓ (M6, NOT REFUTED) |
| Singleton / reghdfe-handling explainer | ✓ | ✗ |
| Year-FE collinearity note | ✓ | ✗ |
| Substantive blind-rebuild contrast | ✗ | ✓ (relational-tie design move) |
| Verdict adjudication | agnostic | bifurcated (asymmetric robustness) |

---

## 6. Bottom line

**The two replications converge on identifying threat-period coding as the binding sensitivity in Mattingly (2024) but diverge on which half of the trade-off is more robust** — and the divergence is a function of which diagnostic perimeter each replication runs.

I4R's perimeter is alternative-data redefinition: replace Mattingly's hand-coded binary windows with off-the-shelf event-data measures (CNTS, CINC, MMP). Under this perimeter, the **domestic-threat side fragmens** (three sign flips out of six CNTS-based redefinitions; zero positive-and-significant coefficients) while the **foreign-threat side is more robust** (sign generally preserved with sum-of-rivals' military-strength aggregation, though precision varies).

comradeS's perimeter is within-coding forensic and alt-mechanism: leave-one-cohort, leave-one-leader-era, cutoff sensitivity, influence drop, anticipation, concurrent-shock, multiplicity, and cohort-aging-as-mechanism. Under this perimeter, the **domestic-threat side is robust** (driven by post-Tiananmen, refutes anticipation and concurrent-shock, strengthens with cohort-aware estimator) while the **foreign-threat side is single-window-dependent with an unrejected cohort-aging confound**.

These two verdicts are not contradictory. They are two different second-order findings about Mattingly's design choice:

1. **comradeS's verdict** (timing-internal forensic): IF you accept Mattingly's binary-window framing as the right operationalization of threat, the domestic-threat result is identifiably real (specifically post-Tiananmen) and the foreign-threat result is observationally consistent with cohort aging and is single-window-dependent.

2. **I4R's verdict** (concept-external redefinition): IF you swap Mattingly's binary windows for off-the-shelf CNTS/CINC alternatives, the domestic-threat result is highly sensitive to choice of indicator (event-based vs. window-based), while the foreign-threat result is more robust to alternative measures of military rivalry.

A reader integrating both replications gets a **layered reading of the paper**: Mattingly's headline of "loyalty up during domestic threat, professionalism up during foreign threat" survives in its specific binary-window operationalization (comradeS-confirmed for the domestic side, comradeS-flagged for the foreign side) but does not generalize to alternative threat-concept operationalizations on the domestic side (I4R-flagged), and is more robust to alternative measures on the foreign side (I4R-confirmed, with the cohort-aging-confound caveat from comradeS).

The most useful single sentence summary is: **the loyalty-domestic finding is identification-robust within Mattingly's coding (post-Tiananmen-driven) but coding-fragile across off-the-shelf threat indicators; the professionalism-foreign finding is coding-robust across military-rivalry indicators but identification-fragile within Mattingly's coding (single-window-dependent, cohort-aging not refuted).** Each replication surfaces one half of this picture; together they surface both.
