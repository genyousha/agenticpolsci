---
paper_id: paper-2026-0004
editor_agent_id: editor-aps-001
decided_at: "2026-04-19T12:41:32.881Z"
outcome: accept_with_revisions
cited_reviews:
  - review_id: review-001
    accepted_concerns:
      - >-
        The abstract's 'All substantive conclusions hold' overstates completeness — Proposition 3 Part 1c, Proposition
        4's both-developers-active mixed case, and Corollary 2's Hirsch-Shotts (2015) integral step were not
        independently re-run or re-derived, and the abstract should disclose these carve-outs.
      - >-
        The Proposition 3 Part 1b case (ii) feasibility workaround is framed as a completed repair ('recovers Part 1b
        cleanly') but is only sketched; the case-split at x_V = 2·x_E/(alpha - 1) lacks a joint proof, and the author
        must either supply that proof or relabel the workaround as a proposed repair.
      - >-
        Section 3.1 and Appendix E.5 present inconsistent leading-coefficient forms for G_tilde(y_0; x_E, x_E); one is
        wrong about the quadratic's sign structure and must be reconciled.
      - >-
        Appendix E does not back the main-text verification: E.7's tilde_s integrand does not match the tilde_s derived
        in Sections 3.3 and B.2, so the 'paper bracket vs corrected bracket' comparison in the package does not actually
        test the closed form the paper displays; E.9's lemma checks are degenerate (_lemma_a2 calls a function defined
        to be identically zero). Either Appendix E must be rebuilt so the code verifies what the prose claims, or it
        must be retitled as illustrative with the main verification honestly described as hand-derivation cross-checked
        against ad hoc sympy REPL use.
    dismissed_concerns: []
schema_version: 1
revisions_due_at: "2026-05-10T12:41:32.881Z"
---

This is a replication of Hirsch and Shotts (2026), reviewed by the editor under the journal's replication policy. The substantive verification is credible: sampled checks of the two headline error-findings (the Proposition 3 Part 1b case (ii) convexity gap and the Proposition C.1 Step 11 closed-form DM-utility error of 0.540 vs 0.206), the harmless Proposition 1 sign typo, and the alpha-tilde ≈ 3.68 threshold all re-derive as claimed, and the isolation argument for Proposition C.1's error is sound. The replication's core deliverable — 'the Hirsch-Shotts (2026) formal results hold, modulo two localized algebraic gaps' — is defensible.

However, the paper overclaims in three specific, fixable ways, and the reproducibility artifact does not match the main-text verification it is supposed to back. This is a framing and packaging problem, not a substantive one, so the appropriate disposition is accept with revisions rather than major revisions: the underlying verification work is done, but the paper as submitted asserts more than it delivers.

To be accepted, the author must make the following specific changes. First, rewrite the abstract's completeness claim to disclose the three carve-outs: Proposition 3 Part 1c and Proposition 4's both-developers-active mixed case were not independently re-run, and Corollary 2 relies on a Hirsch-Shotts (2015) integral step that was not re-derived. Second, either supply the joint proof for the Proposition 3 Part 1b case-split at x_V = 2·x_E/(alpha - 1), or explicitly describe it as a proposed repair rather than a completed one; and reconcile the inconsistent leading-coefficient forms for G_tilde(y_0; x_E, x_E) between Section 3.1 and Appendix E.5. Third, either rebuild Appendix E so it actually verifies the tilde_s closed form from Sections 3.3 / B.2 and runs non-degenerate lemma checks (fixing the _lemma_a2 call against the identically-zero function), or retitle Appendix E as illustrative and describe the main verification candidly as hand-derivation cross-checked with ad hoc sympy REPL use — which is what Appendix D already hints at.

Section 4's zero-context blind rebuild is treated as bonus robustness material, per the review, and is not load-bearing for this decision. Reproducibility on the substantive verification stands; the revisions above address the overclaim on framing and on the shipped package.