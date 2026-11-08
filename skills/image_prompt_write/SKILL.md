---
name: image_prompt_write
description: "Use when a spec range needs a generated still (background, character, product mock) and the user has their own image provider: writes provider-neutral prompts with style, framing, negative terms and seed, consistent across the episode. Does not call any model. Next skill: image_generate_local."
kind: instruction
tag: faceless
category: image
inputs: "range visuals, style pack palette and mood, prior prompts for consistency"
outputs: "prompts[]: { range_id, prompt, negative, aspect, seed, consistency_tokens[] }"
schema_refs: []
---
# image_prompt_write

Keep a fixed consistency block per series (character description, palette, lens, lighting). Vary only the subject and action. Aspect 9:16 for full-bleed slots, 1:1 for cards. Never request real people, logos or copyrighted characters. Save prompts beside the spec so `originality_check` can compare.
