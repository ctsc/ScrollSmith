---
name: goals_intake
description: "Use at the start of a new project or channel when the user has not stated goals, audience, format and constraints. Asks at most 6 questions and writes project.json goals. Do not use when project.json already has goals (read it instead). Next skill: niche_research or idea_generate."
kind: instruction
tag: universal
category: strategy
inputs: "Conversation with the user; existing project.json if any"
outputs: "project.json goals block: { audience, promise, formats[], platforms[], cadence, constraints[], voice_consent, brand_kit_path? }"
schema_refs: []
---
# goals_intake

Ask only what the project needs, in one message, with defaults the user can accept: who the video is for, what it promises them, format (faceless, talking head, ad or UGC, screen demo, podcast clip), platforms, posting cadence, hard constraints (no faces, no music with Content ID risk, brand colors), and whether any voice used is the user's own or consented. Write the answers into `project.json` under `goals` (use `project_create` if there is no project yet). Never promise reach or revenue; frame goals as a hypothesis to test over 20 posts.
