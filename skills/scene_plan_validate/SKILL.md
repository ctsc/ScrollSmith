---
name: scene_plan_validate
description: "Use when a video_spec exists and must be checked before any render, and after every scene_plan_patch or apply_decisions. Do not use for footage QA after render (use qa_check). Returns {valid, errors, warnings, metrics} with a fix_hint per issue. Next skill: wireframe_render (if valid) or scene_plan_patch (if not)."
kind: script
tag: universal
category: scene
requires: [node>=20]
script: "toolkit/node/scene_plan_validate.mjs"
inputs: "{ spec_path, footage_index_paths?, ledger_path?, beats_path?, loop_seal_path?, wps? }"
outputs: "{ valid, errors: error.v1[], warnings: error.v1[], metrics }"
schema_refs: [video_spec.v1, error.v1]
---

# scene_plan_validate

Runs the JSON Schema check and every rule in the table below against a `video_spec.v1` file. Must pass (no errors) before `render_preview` or `render_final`.

## Run
`node toolkit/node/scene_plan_validate.mjs '{"spec_path": "specs/ep001.v1.json"}'`

For footage edits also pass `footage_index_paths` (one per source) so F1 to F4 can run. Pass `beats_path` for B1 and `loop_seal_path` for O1.

## Rules
| Rule | Check | Severity |
|---|---|---|
| T1 | Ranges sorted, no gaps unless allow_gap, no overlaps, first starts at 0, last end_ms equals duration_ms | error |
| T2 | Hook range starts at 0 and ends by 3000 ms | warn |
| T3 | Faceless range longer than 4000 ms | warn |
| T4 | Narration fits the range (+/-150 ms) at the voice's words per second | error |
| S1 | Every text layer slot inside the safe-zone preset | error |
| S2 | Caption slot inside universal_relaxed; captions never overlap a text slot | error |
| L1 | Body text at least 48 px, titles at least 72 px (house rule) | warn |
| L2 | At most 3 on-screen words per second per range (house heuristic) | warn |
| P1 | A visual change at least every 2.5 s (house heuristic) | warn |
| A1 / F6 | Every asset_id in the ledger, commercial_ok true, music not high Content ID risk | error |
| A2 | Shorts over 60 s with non YouTube Audio Library music | warn |
| B1 | Snapped cuts within 1 frame of the beat grid | warn |
| O1 | Loop enabled: loop_seal report present and SSIM at least 0.92 | error |
| C1 | CTA exists and sits in the second half unless cta_policy early | warn |
| F1 | Footage cuts never inside a word | error |
| F2 | Every footage cut has an audio crossfade | error |
| F3 | Face bbox inside the safe zone after reframe | error |
| F4 | Captions never cover the face | error |
| F5 | hook_first on: a hook range in the first 3 s | warn |
| F7 | Cloned or changed voice requires meta.voice_consent true | error |

House heuristics (T3, L1, L2, P1) are defaults, not platform rules. Calibrate them with the user's own analytics.

## How to fix
- Read `errors[]` in order. Each has `path` (JSON pointer) and `fix_hint`. Apply the hint with `scene_plan_patch` (RFC 6902 ops), then validate again. Two passes usually suffice; if a third pass still fails, show the remaining errors to the user instead of guessing.
- Warnings do not block rendering. Mention them to the user once.

## Metrics
`metrics` includes range count, average range length, visual changes per minute and hook end time. Quote them when asking the user to approve the plan.
