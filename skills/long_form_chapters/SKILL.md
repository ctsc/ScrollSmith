---
name: long_form_chapters
description: "Use on long recordings to produce chapters, a cold open and retention resets: topic segmentation from the footage index, chapter titles, 16:9 presets. Next skill: edit_plan_create."
kind: hybrid
tag: branded
category: footage
requires: [node>=20]
inputs: "{ source_id }"
outputs: "spec with chapter ranges; chapters.json [{ t_ms, title }]"
schema_refs: [footage_index.v1, video_spec.v1]
---
# long_form_chapters
Chapters at `topic_changes_ms`, titles under 6 words, cold open from the strongest line (`hook_first_reorder`), a visual reset at least every 90 s (`long_form` rulebook).
