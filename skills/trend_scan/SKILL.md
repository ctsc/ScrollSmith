---
name: trend_scan
description: "Use when the user asks what is trending in their niche. Uses whatever web access the assistant has and labels everything by source and date; without web access it says so and works from the user's observations. Never claims real-time platform data. Next skill: idea_generate."
kind: instruction
tag: universal
category: strategy
inputs: "Niche, platforms, date"
outputs: "trends[]: { trend, evidence_source, observed_date, fit_with_series, how_to_adapt }"
schema_refs: []
---
# trend_scan

Mark every trend with where you saw it and when. Separate durable formats from sounds and memes with short shelf lives. Trending audio carries license and Content ID risk when reused outside the platform's own library; say so. Suggest how to adapt a trend to the series' own style rather than copying it.
