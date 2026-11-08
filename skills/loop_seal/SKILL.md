---
name: loop_seal
description: "Use when a video should loop seamlessly: plans the last range so its end state matches frame 0 (state_match or match_cut), aligns the music cut to a bar, and after a preview render verifies first and last frame similarity with ffmpeg (SSIM 0.92 or more). Returns the loop report used by rule O1. Next skill: scene_plan_validate."
kind: hybrid
tag: faceless
category: motion
requires: [ffmpeg]
inputs: "spec, preview render path (optional), beats.json"
outputs: "loop_seal.json: { mode, music_cut_on_bar, ssim_first_last?, pass }"
schema_refs: [video_spec.v1]
---
# loop_seal

1. Set `loop.mode` and make the last range's camera and layer end state equal to range 1's start state (same layout, same object positions). Use `match_cut` when the content differs.
2. Music: end on a downbeat from `beats.json` (`music.bar_aligned_loop`).
3. After `render_preview`: extract the first and last frame with `ffmpeg -i preview.mp4 -frames:v 1 first.png` and `ffmpeg -sseof -0.05 -i preview.mp4 -frames:v 1 last.png`, then `ffmpeg -i first.png -i last.png -filter_complex ssim -f null -` and read the `All:` value. Pass at 0.92 or more.
4. Write `loop_seal.json` next to the spec and pass its path to `scene_plan_validate`.
