---
name: review_compare_posts
description: "Use with stats.json to compare recent posts against the user's median and name patterns (hook type, length, format) without filling missing metrics. Next skill: content_plan_build."
kind: instruction
tag: branded
category: quality
inputs: "{ stats_path, window_days }"
outputs: "{ posts[], vs_median[], patterns[] }"
schema_refs: []
---
# review_compare_posts
Median per metric over the window; flag posts above 1.5x and below 0.5x; look for shared traits in each group. Small samples: say the pattern is weak.
