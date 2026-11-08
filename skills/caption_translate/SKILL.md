---
name: caption_translate
description: "Use for multi-language sidecars: the assistant translates each caption page keeping timings, then the reading-speed check flags pages that expanded too much. Next skill: export_package."
kind: hybrid
tag: universal
category: captions
requires: [node>=20]
inputs: "{ captions_path, langs[] }"
outputs: "captions.<lang>.srt and .vtt per language; warnings[]"
schema_refs: [captions.v1]
---
# caption_translate
Translate page by page; never merge pages. Run `caption_qa` per language; where L2 fails, shorten the translation rather than changing timings.
