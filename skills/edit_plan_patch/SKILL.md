---
name: edit_plan_patch
description: "Use for a targeted change to a footage edit (tighter pacing in the middle, drop a tangent): same RFC 6902 patching as scene_plan_patch with range hashing so only changed ranges re-render. Next skill: scene_plan_validate."
kind: script
tag: universal
category: footage
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, ops[] }"
outputs: "new spec version; changed_ranges[]"
schema_refs: [video_spec.v1]
---
# edit_plan_patch
Alias of `scene_plan_patch` for footage specs. Translate the user's request into ops over `timeline[]` and `decision_log`.
