---
name: idea_generate
description: "Use when the user wants episode ideas for a series or a one-off video. Produces 10 ideas each with hook type, retention device and payoff, ranked by fit with the goals. Do not use to write the script (use script_write). Next skill: script_write."
kind: instruction
tag: universal
category: strategy
inputs: "Series or topic, goals from project.json, recent episodes from history/episodes.json"
outputs: "ideas[]: { title, hook_type, open_loop, payoff, format_type, est_duration_s, novelty_note }"
schema_refs: []
---
# idea_generate

Use the hook taxonomy (`hooks://taxonomy`) to vary hook types across the 10 ideas. Each idea must state the open loop (what the viewer waits for) and the payoff that closes it. Check `history/episodes.json` and avoid topics and hook types used in the last 20 episodes; say which axis each idea changes. Ideas that need real people's likeness, music, or copyrighted text are marked with the risk. Keep titles under 8 words.
