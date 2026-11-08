---
name: caption_qa
description: "Use to check captions alone (overflow, safe zone, reading speed, sync drift) before a render; the same checks run inside qa_check and scene_plan_validate (S2, L2). Next skill: captions_build with fixes."
kind: script
tag: universal
category: captions
script: node/scene_plan_validate.mjs
requires: [node>=20]
inputs: "{ spec_path, captions_path }"
outputs: "report filtered to S2 and L2"
schema_refs: [captions.v1]
---
# caption_qa
Run `scene_plan_validate` and read S2 and L2. Sync drift: compare page times with word times (`captions_build` output keeps them equal; a mismatch means the words file changed).
