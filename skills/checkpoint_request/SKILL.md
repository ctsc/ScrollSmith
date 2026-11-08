---
name: checkpoint_request
description: "Use at every human gate (script, wireframe, preview, final): shows the artifacts, asks one clear approve or change question and waits. Recipes call it; never skip it to save time."
kind: instruction
tag: universal
category: orchestration
inputs: "{ stage, artifact_paths[] }"
outputs: "user decision: approve | changes[]"
schema_refs: []
---
# checkpoint_request
Summarize what will happen next and what it costs (render time, TTS characters). Offer at most 3 options. Record the decision in `run_state`.
