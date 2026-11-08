---
name: podcast_clip_format
description: "Use to lay out a podcast clip: speaker cards, waveform layer, caption style and 9:16 reframe per the podcast_clip rulebook, with two-camera cut logic following the active speaker. Next skill: edit_plan_create."
kind: hybrid
tag: branded
category: footage
requires: [node>=20]
inputs: "{ clip: { source_id, start_ms, end_ms }, speakers[] }"
outputs: "video_spec.v1 for the clip"
schema_refs: [video_spec.v1, footage_index.v1]
---
# podcast_clip_format
Follow `get_rulebook podcast_clip`. Speaker changes come from diarization when present, otherwise from the user's labels on sentences.
