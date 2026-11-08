---
name: project_create
description: "Use when the user starts a new series, channel or client project and no shortform-project folder exists yet. Do not use to change an existing project (edit project.json directly). Returns the created folder layout. Next skill: idea_generate (faceless) or goals_intake (branded)."
kind: script
tag: universal
category: workflow
requires: [node>=20]
script: "toolkit/node/project_create.mjs"
inputs: "{ path, name, platforms?, aspect?, fps?, style_pack_id?, language?, brand_kit? }"
outputs: "{ project_path, project_id, created[] }"
---

# project_create

Creates the local project folder. All later skills read and write inside it; nothing leaves the machine.

## Folder layout
```
shortform-project/
  project.json          name, platforms, defaults
  brand_kit.json        optional, brand_kit.v1
  tone_profile.json     from brand_voice_profile
  series/<series_id>.json
  specs/<spec_id>.v<N>.json
  footage/              raw footage, never uploaded
  assets/library.json   local asset index with license fields
  assets/ledger.json    license ledger for assets used in specs
  history/episodes.json past scripts and spec fingerprints (originality_check)
  renders/              previews, finals, receipts
  runs/<run_id>/run.json
```

## Steps
1. Ask for the project name and target platforms if not given. Defaults: platforms tiktok, reels, shorts; aspect 9:16; fps 30.
2. Run: `node toolkit/node/project_create.mjs '{"path": "./shortform-project", "name": "<name>", "platforms": ["tiktok", "shorts"]}'` (write the JSON to a file and pass the path if the shell makes quoting awkward).
3. Confirm the created paths to the user. If a brand kit exists, pass it as `brand_kit` so `brand_kit.json` is written.

## Rules
- Never store API keys in project.json. Providers read keys from environment variables.
- `local_only: true` is written into project.json and must stay true.
