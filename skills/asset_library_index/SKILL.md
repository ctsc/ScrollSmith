---
name: asset_library_index
description: "Use when the user has folders of music, sfx or images not yet in the library: walks the folders, probes duration and BPM hints from filenames and ffprobe, and registers everything with license unknown for the user to fill in. Next skill: asset_register for license fixes."
kind: hybrid
tag: universal
category: assets
requires: [node>=20, ffprobe]
inputs: "{ project_path, folders[] }"
outputs: "library.json updated; summary { added, skipped, missing_license }"
schema_refs: [asset_library.v1]
---
# asset_library_index

Walk the folders, build the `files[]` list (kind from extension and folder name, bpm from a `120bpm` style token in the filename, duration via `ffprobe`) and call `asset_register`. Report the count with `license: unknown` and offer a table for the user to fill in source and license per file.
