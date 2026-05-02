# Editor Self-Review Audit — paper-2026-0021

- timestamp: 2026-05-02T00:09:36.055Z
- review_id: review-001
- recommendation: accept

## Subagent prompt

[replication-review.md prompt from $POLICY/prompts/replication-review.md applied inline to paper.redacted.md and metadata.yml; paper type: replication; replicates Weschle 2024 AJPS, doi:10.1111/ajps.12721]

## Subagent response

reproducibility_success: true
overclaim_found: false
verdict: accept
verified_claims:
  - claim: 'All 9 cells of Table 1 reproduce within rounding on R 4.3.3 against DVN/RKMKXU'
    status: verified
    note: 'Audit table at lines 27-37 shows three-decimal-exact match for headline (m3c) and within-rounding match for all 9 cells.'
  - claim: 'Pre-trends rejected at Wald F = 8.49 (p = 2.5e-4)'
    status: verified
    note: 'Fitted on the same event-study Eq. 2 the published paper reports; original itself acknowledges the violation.'
  - claim: 'Sun-Abraham aggregate ATT 0.108 (76% reduction vs TWFE 0.455)'
    status: partially_verified
    note: 'Reproducible under the audits convention; convention sweep yields 0.077-0.222 across four reasonable settings, none reproducing the published 0.334. Author labels the gap illustrative.'
  - claim: 'Never-ministers Conservative subsample yields β = 0.004 (p = 0.97), N = 1,247'
    status: verified
    note: 'Direct sample slice; complementary drop-current-minister-MP-years cut at 0.019 (p = 0.82, N = 1,697) confirms.'
  - claim: 'Threshold dose-response runs backwards (placebo £0 yields larger β than headline £1k)'
    status: verified
    note: 'Five-threshold sweep on same panel; pattern is monotone-decreasing.'
overclaim_notes: []
reproducibility_notes: |
  Cell-level reproduction is clean (9/9 Table 1 cells, 4 spot-checked SI tables). The four first-order qualifications are each independently checkable from the audit's reported point estimates, standard errors, and sample sizes. The Sun-Abraham 0.108 vs published 0.334 gap is the load-bearing weak point: the audit cannot pin down the specific convention used in the original SI Table A15 and so reports the gap as illustrative. Manuscript scopes its claims to the +58% headline and its information-extraction interpretation, explicitly excluding Figures 3-5 of the original. No overclaim at abstract or body level.
weakest_claim: |
  The Sun-Abraham aggregate ATT of 0.108 cannot be reconciled to the published 0.334; four reasonable pooling conventions span 0.077-0.222, none recovering 0.334. The author appropriately labels this illustrative rather than adjudicative, but the 76% reduction headline rests on the audit's convention rather than on a head-to-head reproduction of the published number.
falsifying_evidence: |
  Re-running fixest::sunab (or the pre-fixest staggered-DiD code) using the exact invocation from Weschle's deposited script for SI Table A15, with anticipation-period and event-time-pooling settings traced to that script, would either recover 0.334 or surface a substantive numerical discrepancy. Without this trace, the 76% reduction is conditional on the audit's preferred convention.
review_body: |
  [see review_body field in commit JSON]
adversarial_notes: none

