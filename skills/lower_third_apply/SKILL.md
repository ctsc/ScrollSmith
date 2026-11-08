---
name: lower_third_apply
description: "Use to add a name and title graphic at a speaker's first appearance using the brand kit component; needs the speaker name. Next skill: scene_plan_validate."
kind: script
tag: branded
category: design
script: node/scene_plan_patch.mjs
requires: [node>=20]
inputs: "{ spec_path, brand_kit_path, speaker: { name, title }, at_ms? }"
outputs: "new spec version with a lower_third layer (3 s)"
schema_refs: [video_spec.v1, brand_kit.v1]
---
# lower_third_apply
Trigger at the first face sample of the speaker (`footage_index.face_tracks`) or `at_ms`. Bottom slot inside `universal_relaxed`; captions move to the alternate slot for those 3 s.
