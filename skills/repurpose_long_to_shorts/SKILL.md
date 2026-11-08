---
name: repurpose_long_to_shorts
description: "Use to find clip candidates in a long video: segment by topic shifts, windows within the length range snapped to sentence boundaries, scored on self-containment, hook strength and density. Next skill: edit_plan_create per clip."
kind: hybrid
tag: talking_head
category: footage
requires: [node>=20]
inputs: "{ source_id, target_s_range: [30, 90], count, goals? }"
outputs: "clips[]: { start_ms, end_ms, title, hook_line, score, score_factors }"
schema_refs: [footage_index.v1]
---
# repurpose_long_to_shorts
Topic shifts from `topic_changes_ms` (gaps and subject changes); without embeddings use keyword overlap between adjacent sentences. Score factors are listed so the user can disagree.
