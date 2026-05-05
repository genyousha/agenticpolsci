---
success: true
replication_kind: formal
paper_doi: 10.1111/ajps.70018
paper_title: "Reviewing Fast or Slow: A Theory of Summary Reversal in the Judicial Hierarchy"
paper_authors:
  - Alexander V. Hirsch
  - Jonathan P. Kastellec
  - Anthony R. Taboni
paper_journal: AJPS
paper_year: 2026
verification_summary:
  total_claims: 10
  pass: 8
  weak_pass: 2
  fail: 0
artifacts:
  - paper.md
  - blind-rebuild.md
  - env/verification.md
  - env/comparison-substantive.md
  - env/topic-sketch.md
  - env/blind-briefing.md
  - env/manifest.yml
  - env/formal-extract-main.md
  - env/formal-extract-appendix.md
  - library/craft/paper-2026-0025--puzzle-framing.md
  - library/craft/paper-2026-0025--analysis-strategy.md
  - library/craft/paper-2026-0025--validity-moves.md
  - library/craft/paper-2026-0025--narrative-arc.md
  - library/craft/paper-2026-0025--theory-setup.md
checked_pdf_md5: f8cc90666bdf5104f2856718c3ebd98b
date_completed: 2026-05-05
---

# Reproducibility report

This is a **formal-theory replication**. There is no empirical pipeline to re-run; the replication consists of an independent re-derivation of every closed-form expression and proof in the paper, plus a substantive blind rebuild from the abstract and introduction alone.

## What was reproduced

All ten labeled formal claims in Hirsch, Kastellec, and Taboni (2026):

| Claim | Verdict |
|---|---|
| Lemma 1 (equilibrium structural properties) | PASS |
| Lemma 2 (lower-court best-response cutpoints) | PASS |
| Lemma 3 (higher-court summary-reversal threshold) | PASS |
| Lemma 4 (lower-bound constraint on $x_M$) | PASS |
| Lemma 5 (pandering when $\alpha^* > 0$) | PASS |
| Proposition 1 (existence/uniqueness of no-SR equilibrium) | PASS |
| Proposition 2 (existence of SR equilibrium with pandering) | PASS |
| Proposition 3 (comparative statics of $x_A^*$) | PASS |
| Proposition 4 (HC strictly better off with SR for high $\bar{k}$) | WEAK-PASS (notation typo + asymptotic framing) |
| Proposition 5 (HC strictly worse off with SR for low $H$, low $M$) | WEAK-PASS (asymptotic framing) |

Total: 8 PASS · 2 WEAK-PASS · 0 FAIL.

## How to reproduce

1. The original paper PDF (60 pp., main + appendices A–D bundled) is at the author-hosted URL `https://www.its.caltech.edu/~avhirsch/hkt_ajps_for_web.pdf`. MD5 `f8cc90666bdf5104f2856718c3ebd98b`.
2. The verification report at `env/verification.md` walks through every closed-form expression and reports per-claim pass/fail verdicts.
3. The blind rebuild at `blind-rebuild.md` shows what an independent agent constructs given only the abstract and introduction.
4. The substantive comparison at `env/comparison-substantive.md` compares the blind rebuild against the published model on convergence, divergence, validity, and robustness dimensions.

The two minor flags raised against Propositions 4 and 5 (a notation typo `\tilde{x}_M(0)` for `\tilde{x}_M(H)` and asymptotic-existence framing) are typesetting and exposition issues, not substantive errors. The model is sound.

## Outcome

**success: true.** The formal model verifies under independent re-derivation. The substantive contribution survives the blind rebuild test: an agent given only the abstract and introduction reconstructs all three headline propositions and names the load-bearing welfare mechanism correctly.
