---
name: edit_plan_create
description: "Use when footage_index and a resolved decision list exist: builds a footage video_spec (ranges from sentence and topic boundaries, cuts, hook-first reorder), applies decisions with apply_decisions, and produces the decision_log for approval. Never decides based on the video itself, only the index. Next skill: caption_apply_style."
kind: hybrid
tag: talking_head
category: footage
requires: [node>=20]
inputs: "footage_index.json, decisions[], target_s, brand_kit?"
outputs: "specs/<id>.v1.json (video_spec.v1, format_type talking_head) plus decision_log"
schema_refs: [video_spec.v1, footage_index.v1, edit_decision.v1]
---
# edit_plan_create

1. Pick the hook line (self-contained, strongest claim, under 3 s when cut) and place it first (F5).
2. Ranges from sentence boundaries, each with one `footage` layer `{ source_id, in_ms, out_ms }`; aim for the target length by dropping tangents, not by speeding speech.
3. Run `node toolkit/node/apply_decisions.mjs` with the decision list; it writes the new spec version and `decision_log`.
4. Run `scene_plan_validate` with the footage index; fix F1 to F4 issues.
5. Show the user a table: range, source time, what happens (cut, punch-in, b-roll), and why (the decision id). Wait for approval: this is a checkpoint.
