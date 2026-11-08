---
name: account_link
description: "Use when the user wants their stats labelled per platform: saves only the public handle per platform in project.json. No login, no tokens, no OAuth. Next skill: account_stats_ingest."
kind: instruction
tag: branded
category: strategy
inputs: "{ platform, username }"
outputs: "project.json accounts[]: { platform, username }"
schema_refs: []
---
# account_link
Store the handle string only. Never ask for passwords, session cookies or API tokens; the toolkit has nowhere to put them and the hosted MCP never sees them.
