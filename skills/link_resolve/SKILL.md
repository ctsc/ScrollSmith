---
name: link_resolve
description: "Use when the user gives a public video link instead of a file. Follows the honest fallback chain: text-only context from web access, local public download via the swappable adapter (yt-dlp) with terms caveats, the user's own signed-in browser, or ask for a local file or screen recording. Always returns analysis_depth. Never bypasses logins, private accounts, age gates or geo blocks and never uses stored cookies. Next skill: footage_ingest or competitor_breakdown."
kind: instruction
tag: universal
category: footage
inputs: "url, purpose (analysis or edit)"
outputs: "{ analysis_depth: full_video|text_only, local_path?, caveats[] }"
schema_refs: []
---
# link_resolve

1. Text-only: title, description, comments and any transcript your web access can read. Report `text_only`.
2. If the user wants full analysis and the video is public: offer `yt-dlp -f mp4 <url>` run by the user on their machine (`python toolkit/python/link_download.py`). State that platform terms may restrict downloading and that reliability varies; the adapter is swappable.
3. If the user's own browser is signed in, they can save the video themselves; you do not automate logins.
4. Otherwise ask for a local file or a screen recording.
Editing someone else's video needs their permission; remind the user. Downloaded files stay local and are registered with `source: downloaded, commercial_ok: false`.
