---
name: scene_plan_patch
description: "Use when the user asks for a targeted change to an existing spec (\"make range r03 faster\", \"swap the hook\") or when scene_plan_validate reports errors. Do not use to build a spec from scratch (use scene_plan_create). Returns the new versioned spec path and the changed range ids. Next skill: scene_plan_validate."
kind: script
tag: universal
category: scene
requires: [node>=20]
script: "toolkit/node/scene_plan_patch.mjs"
inputs: "{ spec_path, ops: RFC6902[], out_path? }"
outputs: "{ spec_path, version, changed_range_ids[], removed_range_ids[], added_range_ids[] }"
schema_refs: [video_spec.v1]
---

# scene_plan_patch

Applies RFC 6902 JSON Patch operations to a spec and writes a new version file (`name.v2.json` -> `name.v3.json`). The old version is kept. Per-range hashes tell you which ranges changed so only those need re-rendering.

## Run
```
node toolkit/node/scene_plan_patch.mjs '{"spec_path": "specs/ep001.v1.json", "ops": [
  {"op": "replace", "path": "/timeline/2/end_ms", "value": 9000},
  {"op": "replace", "path": "/timeline/3/start_ms", "value": 9000}
]}'
```

## Writing ops
- Use the `path` from a validator error directly as the op path.
- Keep the timeline contiguous: when you change one range's `end_ms`, change the next range's `start_ms` in the same patch, and update `/format/duration_ms` if the last range moved.
- To remove a range: `{"op": "remove", "path": "/timeline/3"}` then fix the neighbours.
- To add a layer: `{"op": "add", "path": "/timeline/1/layers/-", "value": {...}}`.
- Never patch `meta.local_only`.

## After patching
Run `scene_plan_validate` on the new path. Report `changed_range_ids` so `render_preview` can reuse cached ranges.
