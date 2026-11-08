---
name: ai_asset_generate
description: "Use when a range needs an AI image or clip and the user has a provider: wraps image_generate_local and the user's video provider adapter, registers the result with ai_generated true and sets ai_disclosure on the spec. Hosted MCP never calls a model. Next skill: scene_plan_patch."
kind: hybrid
tag: universal
category: image
requires: [python>=3.10]
inputs: "{ prompt, provider, kind: image|clip, out_dir }"
outputs: "asset registered with ai_generated true; spec.meta.ai_disclosure true"
schema_refs: [asset_library.v1]
---
# ai_asset_generate
Follow `image_generate_local` for stills. For clips, the same pattern with the user's video provider SDK and key in their environment; the adapter is the user's script, not ours. Realistic outputs need the platform's AI label (`metadata_write`).
