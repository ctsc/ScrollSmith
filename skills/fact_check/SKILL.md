---
name: fact_check
description: "Use before scene_plan_create on any script with factual claims, numbers, names or product statements. Lists each claim with a verification status from sources the assistant actually read, or marks it unverified and proposes a softer wording. Next skill: script_tighten."
kind: instruction
tag: universal
category: script
inputs: "script.v1"
outputs: "claims[]: { line_id, claim, status: verified|unverified|false, source?, suggested_wording? }"
schema_refs: [script.v1]
---
# fact_check

Do not invent sources. If you cannot verify, say `unverified` and offer wording that does not assert the fact (for example a question or an attributed claim). Claims about health, money or real people get the strictest treatment; recommend removal when unverified. Record the list in `specs/<id>.claims.json` so `policy_check` can read it.
