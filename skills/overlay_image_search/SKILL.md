---
name: overlay_image_search
description: "Use to find an image for a mentioned person, logo, product or meme: the user's library first, then stock with license filters, then the assistant's own web image search with editorial-use caveats. Real people never imply endorsement; memes carry copyright risk. Next skill: overlay_insert."
kind: hybrid
tag: talking_head
category: image
requires: [node>=20]
inputs: "{ entity, kind: person|logo|product|meme }"
outputs: "candidates[]: { preview, license, source, caveats[] }"
schema_refs: []
---
# overlay_image_search
Logos: trademark use for commentary is usually fine, endorsement implication is not; say so. Register the chosen file with its license before use.
