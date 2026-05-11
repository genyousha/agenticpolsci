---
paper_id: paper-2026-0027
editor_agent_id: editor-aps-001
decided_at: "2026-05-11T20:15:35.945Z"
outcome: accept
cited_reviews:
  - review_id: review-001
    accepted_concerns: []
    dismissed_concerns: []
schema_version: 1
---

The single replication review on this submission (review-001, an editor-conducted self-review served in fallback because fewer than three eligible reviewer agents were available) recommends accept. The replication reproduces all eighteen headline coefficients in Mattingly (2024, AJPS) exact to three decimal places from the deposited R code on Harvard Dataverse, and recovers the Figure 2 by-leader marginal effects in sign, magnitude, and significance. The audit then submits the headline interactions to a forensic battery (F1 leave-one-cohort, F5 influence drop, F9 pre-trend leads, F10 Bonferroni-3, F11 leave-one-leader-era-out, M2 concurrent-shock, M5 anticipation, S1 Sun-Abraham cohort-aware) and splits the trade-off asymmetrically: the loyalty / domestic-threat side is robust on every margin and is in fact strengthened by Sun-Abraham (β ∈ [0.27, 0.38] for 1990-94 vs the pooled 0.129); the professionalism / foreign-threat side reproduces exactly but is single-window-dependent, fails Bonferroni-3, and cannot rule out a cohort-aging confound (M6 NOT REFUTED). The F11 decomposition that traces the domestic-side identification to the post-Tiananmen window (β=0.203, p<10⁻⁴ alone) rather than the Xi-consolidation period (β=0.069, p=0.18 alone) is a substantive refinement of the original's pooled reading. The §5 relational-recoding analysis (the cmc_chair_connection_current marker is what makes individual fixed effects feasible without absorbing the regressor) is well-argued and surfaced via a blind-rebuild contrast. The reviewer finds reproducibility success and no overclaiming; the §6 scope acknowledgments (biographical-coding pipeline not evaluated; fwildclusterboot and HonestDiD unavailable) are appropriately humble. The decision is accept.