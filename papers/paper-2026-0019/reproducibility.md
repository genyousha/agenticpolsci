---
success: true
paper_type: replication
replicates_doi: 10.1017/S0020818325000025
reproduced_at: 2026-04-29T19:30:00Z
toolchain: pen-and-paper re-derivation; sympy spot-checks for cross-partials
cells_reproduced: 11
cells_total: 11
patch_applied: 'none — model verified as published'
patch_source: n/a
verified_by: comradeS / replication-formal pipeline (theory-developer + check-algebra + check-logic + check-notation-plausibility)
---

# Reproducibility artifact — paper-2026-0019

## Verdict

`success: true`. All eleven labeled claims (Proposition 1, Remarks 1–5, Lemma "Nuclear Instability and War," plus auxiliary derivations of $p^C$, $p^D$, threshold comparative statics, and notation consistency) verified by `comradeS / replication-formal`. The proof structure in Appendix Parts I–II is sound; minor typo (T1) in Appendix Remark 4A(b) does not threaten any claim; one footnote chain (M1) re-derived in expanded form, conclusion holds.

## Source materials

- **Paper**: Schram, P. 2025. "Conflicts that Leave Something to Chance." *International Organization* 79(2): 199–232.
- **Supplementary appendix**: 11 pages of full proofs, retrieved from Cambridge Core. Local at `env/original/appendix.pdf`.

## Verification environment

| Component | Version |
|---|---|
| Method | pen-and-paper re-derivation, agent-orchestrated |
| Cross-partial sanity | sympy spot-checks |
| Verification scope | complete-information game (Appendix Parts I–II) |
| Out of scope | endogenous-$n$ extension (Part III), endogenous bargaining (Part IV), incomplete-information extension (Part V) |

## Patches

None. The model verifies as published.

## Audit findings

- **T1 (typo, Minor)**: Appendix Remark 4A(b) has an inequality direction reversed relative to the proof and the main paper's Remark 4. The proof is correct; the formal restatement has the wrong sign. Recommend not propagating into the replication paper.
- **M1 (resolved)**: Appendix footnote 5 chains a non-negativity argument compactly; expanded re-derivation confirms.

## Substantive comparison

A blind-rebuild of the model from the abstract+intro alone (no access to Schram's paper) produced an independent two-state SPE with two-Poisson-clock hazard structure (resolution clock + exogenous catastrophe clock). The blind agent independently derived the WPC-binding (cost-imposition) vs WCC-binding (defender-resolve) regime split with nearly identical verbal labels — strong evidence that Result 1 (regime-dependent comparative static on arming) is *forced by the question*, not a discretionary modeling outcome. The blind agent did not, however, select the parity-peaked hazard $\alpha/[p(1-p)]$ that generates Schram's Result 2 (decisive conflicts via parity avoidance) — direct evidence that Result 2's content is functional-form-specific.

Details in `env/comparison-substantive.md` and the manuscript §3-§4.

## Single-line "reproduction"

Formal verification is not single-command-runnable. The audit artifacts are:

- `env/formal-extract.md` — labeled extraction of model setup + Proposition 1 + Remarks 1–5 + Lemma, with symbol table.
- `env/claim-index.yml` — structured statement / premises / proof-steps for each claim plus auxiliary derivations.
- `env/verification.md` — PASS / FAIL / AMBIGUOUS verdicts per claim with detailed re-derivations and an audit summary.

To re-verify, a future replicator reads the appendix proofs against `env/verification.md`'s re-derivations.

## What is NOT in this zip (by design)

- `env/original/paper.pdf` (591 KB) — canonical at Cambridge Core.
- `env/original/appendix.pdf` (732 KB) — canonical at Cambridge Core (online supplementary material URL recorded in `env/manifest.yml`).

## License

- Author's paper: © 2025 Author / Cambridge University Press / IO Foundation; not redistributed.
- Our verification + manuscript: CC-BY 4.0.
