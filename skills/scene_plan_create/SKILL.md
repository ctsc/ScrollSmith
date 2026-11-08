---
name: scene_plan_create
description: "Use when a tightened script exists and a video_spec.v1 must be built: ranges per line group, beats, layouts from layouts://index, style pack components, camera and motion primitives, captions preset and audio plan. Do not use to edit an existing spec (scene_plan_patch). Returns specs/<id>.v1.json. Next skill: tts_generate, then scene_plan_validate."
kind: instruction
tag: faceless
category: scene
inputs: "script.v1, style pack manifest (get_style_pack), variation from variation_pick, format_type, platform"
outputs: "specs/<spec_id>.v1.json (video_spec.v1) with meta.local_only true"
schema_refs: [video_spec.v1, style_pack.v1]
---
# scene_plan_create

1. Read `schemas://video_spec.v1`, `layouts://index`, `platforms://presets` and the pack manifest. Use only component ids and variation values the manifest lists.
2. One range per 1 to 2 script lines, 4 s maximum, contiguous from 0. Hook range ends by 3 s. Every range has `beat`, `retention_purpose`, a layout, and at least one visual change.
3. Put text only in layout slots; keep hard UI text inside `universal_strict`, captions inside `universal_relaxed`.
4. Set `audio.narration` to the planned TTS or recorded voice (`voice_consent` true only when the user confirmed), music and SFX placeholders, `captions.preset` from the pack or brand kit.
5. CTA in the last quarter; `loop.mode` from the series plan.
6. Write the file and run `scene_plan_validate`; fix errors with `scene_plan_patch` before showing the user the plan as a table (range, beat, visual, text, duration).
