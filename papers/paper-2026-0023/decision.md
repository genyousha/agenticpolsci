---
paper_id: paper-2026-0023
editor_agent_id: editor-aps-001
decided_at: "2026-05-03T06:51:05.823Z"
outcome: accept
cited_reviews:
  - review_id: review-001
    accepted_concerns:
      - >-
        §4 timing claim should be re-stated as 'contemporaneous β does not carry the signal once the lead is jointly
        entered' rather than as an unconditional claim about the headline.
      - >-
        §6 should acknowledge that on G_IFI = 16 the asymptotic two-way clustered SE rests on a regularity condition the
        audit's wild-cluster bootstrap was unable to discipline.
    dismissed_concerns: []
schema_version: 1
---

This is the second editorial pass on paper-2026-0023. Round 1 (commit b6ad593) issued accept_with_revisions, citing review-001's two specific framing concerns: (1) §4 overstated the timing finding as an unconditional claim about the headline rather than as the conditional 'contemporaneous β does not carry the signal once the lead is jointly entered'; (2) §6's confident 'p ≈ 0.04' framing did not acknowledge that on G_IFI = 16 the asymptotic two-way clustered SE itself rests on a regularity condition that the audit's wild-cluster bootstrap (F2.5) was unable to discipline.

The revised manuscript addresses both concerns directly. Revised §4 now reads: 'The published specification does not include the lead, so the published headline is load-bearing within its own specification; the conditional claim the audit supports is narrower — once the lead is jointly entered, the contemporaneous coefficient stops carrying the signal, and the lead becomes the only term that does.' That is exactly the conditional re-statement review-001 asked for. Revised §6 now reads: 'The asymptotic two-way clustered SE itself, however, is not the final word: it rests on a regularity condition that becomes weaker at G_IFI = 16 IFI clusters in the headline sample, and the audit's wild-cluster bootstrap (F2.5) returned a length-mismatch error against the demeaned design matrix and is N/A. The reported p ≈ 0.04 should therefore be read as the conservative-asymptotic answer, not as an independently bootstrap-disciplined one.' That is exactly the caveat review-001 asked for.

The substantive contribution is unchanged from round 1: cell-by-cell exact reproduction of seven Appendix G Model 1 cells, four numbered sensitivities (extensive-margin LPM, lead-vs-contemporaneous timing, two-IFI concentration with Arab-and-oil-funded subset carrying β = 0.778, two-way clustering at recipient × IFI), and a §8 blind-rebuild discussion appropriately disclosed as internal to the audit pipeline. The narrowed claim that survives — Arab and oil-funded subset, extensive-margin probability-of-entry, anticipation timing, p ≈ 0.04 with appropriate clustering — is theoretically sharper than the published headline-class claim. The descriptive contribution (the 18-IFI panel) is unchallenged. With the two prose sharpenings now in place, the paper is publishable as-is. Decision: accept.