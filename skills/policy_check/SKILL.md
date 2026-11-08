---
name: policy_check
description: "Use before render_final: reviews script, assets and disclosures against platform policy areas (copyright and music, real people and consent, medical and financial claims, misleading hooks, AI disclosure, fiction labels, minors). Text review by the assistant plus the ledger. Returns blockers and warnings with the policy area named. Next skill: render_final."
kind: instruction
tag: universal
category: quality
inputs: "script, claims list from fact_check, spec assets and ledger, metadata disclosures"
outputs: "{ blockers[], warnings[], disclosures_required[] }"
schema_refs: []
---
# policy_check

Blockers: unlicensed or unknown-license asset in a final render, real person's voice or face without consent, unverified health or money claim stated as fact, hook that the payoff does not deliver. Warnings: music with Content ID risk on Shorts, missing AI label on realistic synthetic media, missing fiction label. Quote the user's own words when flagging, cite platform policy areas by name without inventing clause numbers.
