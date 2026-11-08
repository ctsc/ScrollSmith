---
name: asset_sources_guide
description: "Use when the user needs free music, sfx, video, images, fonts or 3D assets: reads asset-sources://<kind> and explains which source fits, with license summary, attribution rule and last_verified date. Nothing is bundled or downloaded by the server. Next skill: stock_search or asset_register."
kind: resource
tag: universal
category: assets
inputs: "{ kind: music|sfx|video|image|font|3d, platform? }"
outputs: "Recommendation list from the served data"
schema_refs: []
---
# asset_sources_guide
Call `get_asset_sources <kind>` (resource `asset-sources://<kind>`). Always show `last_verified` and tell the user to confirm the terms on the source page before use; license terms change.
