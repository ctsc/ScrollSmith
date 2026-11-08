---
name: hook_grade
description: "Use after hook_generate to score candidates with the rubric from hooks://taxonomy (specificity, curiosity gap, clarity, stakes, truthfulness, mute readability). Returns ranked hooks with one-line reasons and the top 3 for A/B. Next skill: script_tighten."
kind: instruction
tag: universal
category: script
inputs: "hooks[] from hook_generate, payoff"
outputs: "graded[]: { hook, scores{}, total, reason }, top3[]"
schema_refs: []
---
# hook_grade

Score each rubric item 1 to 5 and explain the lowest score in one line. A hook that promises something the payoff does not deliver fails regardless of total. Pick the top 3 for A/B testing, note which platform each suits, and remind the user that the rubric is a house heuristic, not a performance prediction.
