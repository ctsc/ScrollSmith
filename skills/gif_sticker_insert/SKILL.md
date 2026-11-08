---
name: gif_sticker_insert
description: "Use to overlay a GIF or sticker on a range: prefers the user's own stickers; Giphy or Tenor via the user's own key with terms unverified and attribution stored. Next skill: scene_plan_patch."
kind: hybrid
tag: universal
category: image
requires: [node>=20]
inputs: "{ range_id, query or asset_id }"
outputs: "overlay layer on the range; ledger entry"
schema_refs: [video_spec.v1]
---
# gif_sticker_insert
Licensing of GIF APIs for commercial video is unverified; say so, store the attribution, and default to user-owned stickers. Keep inside the safe zone, under 1.5 s.
