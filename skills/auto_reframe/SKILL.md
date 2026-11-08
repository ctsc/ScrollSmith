---
name: auto_reframe
description: "Use to convert 16:9 footage to 9:16 with the subject kept in frame: face and pose boxes from footage_index, smoothed crop path as keyframes, split-screen or cut-follow-speaker for two speakers. Next skill: edit_plan_create."
kind: hybrid
tag: talking_head
category: footage
requires: [python>=3.10, ffmpeg]
inputs: "{ source_id, target_aspect: 9:16, smoothing?: 0.85 }"
outputs: "crop_path keyframes [{ t_ms, x, y, w, h }] added to the footage layer"
schema_refs: [footage_index.v1, video_spec.v1]
---
# auto_reframe
Exponential smoothing on the face center per sample (alpha 0.15), crop width = height * 9/16, clamp to frame, hold when the face is lost for under 1 s. Render with ffmpeg `crop` plus `sendcmd` or Remotion `<OffthreadVideo>` transform. Rule F3 checks the result.
