---
name: content_pillars_plan
description: "Use after goals exist to define 3 to 5 content pillars with target ratios and two example episodes each, written to pillars.json. Avoid generic pillars. Next skill: content_plan_build."
kind: instruction
tag: branded
category: strategy
inputs: "{ goals_path, tone_profile_path? }"
outputs: "pillars.json: { pillars[]: { id, name, promise, ratio, example_episodes[2] } }"
schema_refs: []
---
# content_pillars_plan
Each pillar names the audience problem it serves; ratios sum to 100. Reject pillars like "educational" or "fun" without a concrete promise.
