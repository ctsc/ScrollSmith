---
name: edit_rulebook_get
description: "Use to read one section of a format rulebook (talking_head, faceless, ad_ugc, screen_demo, podcast_clip, long_form) instead of the whole file. Next skill: edit_plan_create."
kind: resource
tag: universal
category: footage
inputs: "{ format_type, section? }"
outputs: "Markdown section"
schema_refs: []
---
# edit_rulebook_get
`get_rulebook <format>` or resource `rulebook://<format>`; quote only the section you need.
