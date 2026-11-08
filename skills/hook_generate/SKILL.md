---
name: hook_generate
description: "Use when a script or idea exists and needs 10 candidate opening lines across hook types. Produces spoken and on-screen text variants that read without sound. Next skill: hook_grade."
kind: instruction
tag: universal
category: script
inputs: "Script or idea, audience, hook taxonomy (hooks://taxonomy)"
outputs: "hooks[]: { text_spoken, text_onscreen (max 7 words), hook_type, loop_opened }"
schema_refs: []
---
# hook_generate

Cover at least 5 hook types from `hooks://taxonomy`. Every hook must be true to the payoff (no bait) and understandable in the first 3 seconds when muted. On-screen text is 7 words or fewer. Avoid words that platforms treat as clickbait or medical and financial claims.
