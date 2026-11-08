---
name: hook_first_reorder
description: "Use on footage edits to move the strongest self-contained line to the front, keeping or dropping the original intro, without misleading. Next skill: edit_plan_create."
kind: hybrid
tag: talking_head
category: footage
requires: [node>=20]
inputs: "{ source_id, hook_candidates[] (sentence ids) }"
outputs: "reorder plan: ranges with the hook first; F5 satisfied"
schema_refs: [footage_index.v1, video_spec.v1]
---
# hook_first_reorder
The hook line must make sense without its setup and must be delivered later in the video. Cut on the sentence boundary with a 30 ms audio crossfade (F2).
