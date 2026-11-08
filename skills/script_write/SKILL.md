---
name: script_write
description: "Use when an idea is chosen and a narration script is needed. Writes script.v1 with beat-tagged lines, emphasis words, open loops and a CTA, sized to the target duration using duration_estimate. Do not use for hooks alone (hook_generate) or edits of existing scripts (script_tighten). Next skill: hook_generate."
kind: instruction
tag: universal
category: script
inputs: "Idea, goals, target_s, tone_profile.json if present"
outputs: "specs/<id>.script.json (script.v1)"
schema_refs: [script.v1]
---
# script_write

Write for the ear: short sentences, concrete nouns, one idea per line. Tag each line with its beat, mark 1 or 2 `emphasis_words` per line, open at least one loop in the hook and close every loop you open. Spell numbers the way they should be read. Keep the CTA to one sentence in the last quarter. Run `duration_estimate` on the draft and cut until it fits the target within 10 percent. Never reproduce copyrighted lyrics, articles or scripts; paraphrase and credit ideas. No claims about real people or products you cannot verify (run `fact_check` on anything factual). Validate against `schemas://script.v1`.
