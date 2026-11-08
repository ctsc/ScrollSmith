---
name: hook_rewrite
description: "Use when a hook scores low or the user dislikes it. Rewrites one hook along a named axis (more specific, higher stakes, shorter, different hook type) while keeping it truthful to the payoff. Next skill: hook_grade."
kind: instruction
tag: universal
category: script
inputs: "hook, payoff, axis"
outputs: "variants[]: 5 rewrites with the axis applied"
schema_refs: []
---
# hook_rewrite

Produce 5 variants that change only the requested axis. Keep the loop that the payoff closes. Mute readability first: the on-screen version must stand alone.
