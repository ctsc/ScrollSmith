---
name: motion_primitive_pick
description: "Use when choosing animations for layers in a range: maps intent (reveal, emphasize, count, transition, hold) to primitives from platforms://presets motion_primitives with duration and easing. Returns animations per layer. Next skill: scene_plan_patch."
kind: instruction
tag: faceless
category: motion
inputs: "range layers with intent, pack motion defaults, beat"
outputs: "animations[]: { layer_id, primitive, start_ms, duration_ms, easing }"
schema_refs: [video_spec.v1]
---
# motion_primitive_pick

Rules: one entrance per layer, entrances staggered 60 to 120 ms, no primitive longer than 600 ms except holds and slow pushes, emphasis primitives on emphasis words only, at most one `word_slam` per range. Snap to beats when the range has `beat_sync`. Keep every animated text box inside its slot at every keyframe.
