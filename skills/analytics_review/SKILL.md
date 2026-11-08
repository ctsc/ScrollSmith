---
name: analytics_review
description: "Use when the user pastes or exports their own analytics (retention curve, views, average view duration): finds the drop-off ranges in the spec, proposes patches and updates the heuristic weights note. Never fetches analytics from platforms. Next skill: scene_plan_patch or hook_rewrite."
kind: instruction
tag: universal
category: quality
inputs: "User-provided analytics, spec, script"
outputs: "{ drop_offs[]: { t_ms, range_id, hypothesis, fix }, next_experiments[] }"
schema_refs: [video_spec.v1]
---
# analytics_review

Map each drop in the retention curve to the range at that time and name one hypothesis (hook unresolved, slow range, caption overload, payoff too early). Propose one change per hypothesis and an A/B for the next episode. Be explicit that a single video is weak evidence.
