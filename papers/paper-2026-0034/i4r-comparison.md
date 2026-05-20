# I4R DP269 benchmark — comradeS vs Abajian, Xu & Yu (2025)

**Original paper**: Bartels, Jäger & Obergruber (2024) "Long-Term Effects of
Equal Sharing: Evidence from Inheritance Rules for Land." Economic Journal
134(664):3137-3172.

**I4R replicator**: Abajian, Alexander C., Cong Xu & Shuo Yu (2025). "A
comment on 'Long-Term Effects of Equal Sharing: Evidence from Inheritance
Rules for Land'." I4R Discussion Paper No. 269.
URL: https://ideas.repec.org/p/zbw/i4rdps/269.html

**comradeS submission**: paper-2026-0034, dated 2026-05-20.

This comparison is written AFTER comradeS's manuscript was drafted, audited,
sim-reviewed, and revised. Per blind discipline, the I4R DP269 report was
not consulted during the writing of comradeS's paper.md; it is read only
here.

## 1. Convergence

Both replications confirm the paper's central results.

- **Computational reproduction**: Both successfully reproduce the
  headline regressions from the deposited Stata code and data. comradeS
  reports 60/60 spot-checked cells matching the deposited `.tex` to
  4 decimal places; I4R reports successful reproduction overall.
- **Identification validity**: Neither raises a structural objection to
  the geographic RD design. Both treat the Sering 1897 inheritance
  boundary as plausibly exogenous given the smoothness of observables.
- **Headline qualitative finding**: Equal-division regions show lower
  historical landholding inequality and higher modern income and
  GDP. Both replications endorse this conclusion.

## 2. comradeS-only findings

The comradeS audit adds five findings beyond the I4R report:

1. **Cook-distance grid**. Top-{1, 2, 5, 10}% influence-drop sensitivity
   on the log-GDP coefficient: β attenuates from 0.143 (headline) to 0.107
   (top-1%), 0.076 (top-2%), 0.067 (top-5%), then *rebounds* to 0.113
   (top-10%). The non-monotonic pattern indicates magnitude concentration
   in a narrow band of influential observations.

2. **Romano-Wolf / Holm step-down across 22 forensic checks**. The Cook
   top-5% drop on log GDP has nominal p=0.047 but Holm-adjusted p=0.24.
   Conservative ceiling on family-wise error rate softens the magnitude
   verdict.

3. **Leave-one-state-out (LOSO)**. Drops of Baden-Württemberg and Bayern
   — the two largest equal-division states — push the log-GDP coefficient
   to p=0.12 and p=0.10 respectively. LOSO drops of Nordrhein-Westfalen
   (Ruhr coal belt) and Saarland leave the result unchanged.

4. **Metropolitan-orbit scope interpretation**. The LOSO concentration
   on BW and BY is consistent with the Stuttgart and Munich Mittelstand
   clusters that BJO's Section 6 mechanism predicts. This is a scope
   condition (which sub-population drives the GDP result) rather than a
   confound to refute.

5. **Independent blind-rebuild prediction**. comradeS dispatched a
   zero-context subagent given only the title + abstract + intro. That
   blind design independently flagged "effect concentrated entirely in
   one historical state (e.g., only Baden-Württemberg)" as the most
   plausible falsification — exactly the LOSO pattern the forensic
   battery then surfaced. This is a learnable craft signal: spatial-RD
   papers should always be LOSO-tested.

## 3. I4R-only findings

The I4R report (Abajian-Xu-Yu) contributes findings not in the comradeS
audit:

1. **McCrary-style density test on the running variable**. Tests whether
   the distribution of counties by signed distance to the boundary is
   continuous at d=0. Confirms continuity, ruling out a "boundary
   self-selection" interpretation in which counties strategically locate
   on one side of the inheritance line. comradeS did not run this test.

2. **Falsification by treatment reassignment**. Re-randomises the
   `Equal_Division` indicator across counties and re-estimates the
   headline; a placebo distribution of β's centred near zero is a
   stronger test of the design than the paper's smoothness-of-observables
   plot. comradeS did not run this permutation test.

3. **HAC standard-error coding error**. I4R reports a "minor coding error
   that affects their calculations of HAC standard errors" with no
   substantive impact. comradeS reproduces the published HAC SEs to 4
   decimal places via `conleyreg::conleyreg` and `fixest::feols`, so this
   coding error must be in a code path comradeS did not exercise.

## 4. Framing / voice differences

The I4R report is a referee-style replication note: it reproduces the
result, adds two independent design-validity tests, identifies a minor
coding bug, and explicitly endorses the headline. The comradeS paper is a
forensic-audit study: it reproduces the result, then runs 74 adversarial
regressions designed to find magnitude concentration, multiplicity
fragility, and state-level dependence, and frames the resulting pattern
as a scope condition on BJO's own mechanism.

The two reports are on **complementary perimeters**: I4R tests
design-validity (Is the RD identification credible?); comradeS tests
magnitude-robustness (Where does the headline magnitude come from?). They
do not contradict on any specific claim and together cover more of the
audit space than either alone.

## 5. Methodological technique deltas

| Technique | I4R DP269 | comradeS |
|-----------|-----------|----------|
| Software | Stata (re-runs the .do file) | R (`haven` + `fixest::feols`; independent re-implementation) |
| Cell reproduction | Confirmed in aggregate | 60/60 cells to 4 decimals |
| McCrary density test | Yes | No |
| Treatment-reassignment permutation | Yes | No |
| Cook-distance influence diagnostic | No | Yes, grid of 4 cutoffs |
| Romano-Wolf / Holm multiplicity adjustment | No | Yes, across 22 forensic checks |
| Leave-one-state-out | No | Yes, across all 10 states in the RD sample |
| Bandwidth grid (25, 35, 50 km) | No | Yes |
| Donut RD (drop ≤5 km) | No | Yes |
| Wild-cluster bootstrap (cluster count < 50 under LOSO) | No | Deferred — flagged as scope limit |
| Blind-rebuild design prediction | N/A | Topic-only sketch + abstract-only rebuild; both pre-data |

## 6. Bottom line

Both replications agree the paper's central qualitative finding survives.
I4R DP269 confirms RD design validity through density + permutation tests
and identifies a minor HAC coding bug. comradeS confirms magnitude
robustness for the Gini first stage and the household-income reduced form,
identifies magnitude concentration in the log-GDP result (top-5% Cook
drop attenuates β by 53%; LOSO on BW or BY pushes p above 0.10), and
re-frames the LOSO concentration as a scope condition consistent with
BJO's own Mittelstand mechanism rather than a coal-endowment confound.
The two reports test orthogonal perimeters and neither contradicts the
other. The published paper's GDP magnitude should be read with both
adjustments: design-validity-confirmed-by-I4R *and*
magnitude-concentrated-per-comradeS.
