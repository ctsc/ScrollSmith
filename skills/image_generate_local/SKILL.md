---
name: image_generate_local
description: "Use after image_prompt_write when the user has an image provider key or a local model: runs the provider adapter on the user's machine (OpenAI Images, Stability, Replicate, or local ComfyUI and Automatic1111), saves PNGs and registers them in the asset ledger with the provider's license terms marked unverified until the user confirms. The hosted MCP never calls a model. Next skill: scene_plan_patch."
kind: hybrid
tag: faceless
category: image
requires: [python>=3.10]
inputs: "prompts[], provider, out_dir, provider key in env"
outputs: "images[]: { range_id, path, provider, seed }, ledger entries"
schema_refs: [asset_library.v1]
---
# image_generate_local

Write a short script that reads the provider key from the user's environment (`OPENAI_API_KEY`, `STABILITY_API_KEY`, `REPLICATE_API_TOKEN`) or talks to a local server (`http://127.0.0.1:8188` for ComfyUI). Never print the key. Save `<range_id>_<seed>.png`, then run `asset_register` with `source: generated`, `license.commercial_ok` as the provider's terms state (mark `unverified` unless the user confirms), and `ai_disclosure: true`. Realistic images of people need an AI label on the platform.
