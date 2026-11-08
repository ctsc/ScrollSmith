---
name: local_env_check
description: "Use when starting any script skill on a machine for the first time, or when a script fails with ENV_MISSING. Do not use for validating a spec (use scene_plan_validate). Returns a JSON report of installed tools, what is missing and exact install steps for this OS. Next skill: project_create."
kind: script
tag: universal
category: footage
requires: [node>=20]
script: "toolkit/node/local_env_check.mjs"
inputs: "{ probe_python?: boolean, probe_optional?: boolean }"
outputs: "{ ok, platform, found, missing[], optional_missing[], install_steps, notes[] }"
---

# local_env_check

Verifies that this computer can run the Scrollsmith script skills. Nothing is uploaded; no account is needed.

## When to run
- First time in a project, before `project_create`.
- Any time a script prints `{"code": "ENV_MISSING"}`.

## Steps
1. Make sure the toolkit is present locally (see the `toolkit` resource: fetch `toolkit://manifest`, write the files into `./toolkit/`, then run `npm install` inside `toolkit/`).
2. Run: `node toolkit/node/local_env_check.mjs`
3. Read `missing[]`. Each entry has `tool`, `why` and `install`. Tell the user the exact command for their OS and stop until the required tools exist. Required: ffmpeg, ffprobe, Node 20+, Python 3.10+ (Python only for audio and footage skills).
4. `optional_missing[]` lists whisperx, mediapipe, librosa, tesseract, yt-dlp and Chromium. Explain which skills need them (the `why` field) and let the user decide.
5. Repeat the `notes[]` to the user, including the Remotion license note: because rendering is local, the user or their organization is the Remotion licensee. Free for individuals and teams of up to 3; organizations of 4 or more may need a company license. HyperFrames (Apache 2.0) is the license-free engine alternative.

## Client capability
- Claude Code, Cursor and other clients with local code execution: full capability.
- Claude web or mobile chat without local file access: script skills cannot run. Say so plainly and offer the instruction skills (strategy, hooks, scripts, scene plans, text-only reviews).

## Output example
```json
{"ok": false, "platform": "darwin-arm64", "found": {"node": "v22.1.0", "ffmpeg": "ffmpeg version 7.1"}, "missing": [{"tool": "ffprobe", "why": "needed by every audio, caption, QA and render script", "install": "brew install ffmpeg"}], "optional_missing": [], "notes": ["..."]}
```
