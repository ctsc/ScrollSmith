---
name: niche_research
description: "Use when the user has a broad topic and needs angles, sub-niches and recurring formats before committing to a series. Works from the user's own knowledge plus any web access the assistant has. Returns 5 to 8 angles with audience, promise, and format fit. Next skill: series_plan."
kind: instruction
tag: universal
category: strategy
inputs: "Topic, audience guess, platforms"
outputs: "angles[]: { angle, audience, promise, format_type, why_now, risks }"
schema_refs: []
---
# niche_research

For each angle give the audience in one line, the repeatable promise (what every episode delivers), the best `format_type` from the rulebooks, and the risks (saturation, policy, factual load). Cite sources only when you actually read them; mark everything else as your inference. Flag angles that depend on copyrighted material (lyrics, film clips, articles read aloud) as not usable. Do not report view counts or statistics you cannot verify.
