---
name: publish_checklist
description: "Use before the user posts: a per-platform checklist (format, length, captions, disclosures, music source, cover, first comment) that the user ticks off manually. No posting or scheduling integration. Next skill: analytics_review after 48 hours."
kind: instruction
tag: universal
category: workflow
inputs: "export manifest, metadata.json, platforms"
outputs: "Markdown checklist per platform"
schema_refs: []
---
# publish_checklist

Include the policy items from `platforms://presets` platform_rules (for example Shorts music over 60 s, AI disclosure, watermark rule on Reels). Mark unverified platform limits as such.
