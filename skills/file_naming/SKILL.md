---
name: file_naming
description: "Use to name outputs consistently: {project}/{series}/{episode}_{variant}_{platform}_{w}x{h}_{fps}_{spec_hash8}.mp4. Next skill: export_package."
kind: resource
tag: universal
category: workflow
inputs: "none"
outputs: "Naming rule"
schema_refs: []
---
# file_naming
`spec_hash8` is the first 8 hex chars of the sha256 of the spec file. Lowercase, underscores, no spaces.
