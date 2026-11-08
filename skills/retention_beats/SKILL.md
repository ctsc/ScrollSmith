---
name: retention_beats
description: "Use to map script lines to beats with open loops and check every loop closes with the payoff in the last 25 percent; fails on unclosed loops. Next skill: scene_plan_create."
kind: hybrid
tag: universal
category: script
requires: [node>=20]
inputs: "{ script }"
outputs: "beats[]: { line_id, beat, open_loop?, closes_loop_id? }; pass"
schema_refs: [script.v1]
---
# retention_beats
Assign beats from the series template; a loop opened in the hook must close in the payoff. Checker: every `open_loop` id has a `closes_loop_id`; payoff start >= 60 percent and <= 90 percent of total.
