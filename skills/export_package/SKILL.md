---
name: export_package
description: "Use last: gathers renders, covers, SRT and VTT, metadata.json, attribution.txt (from the asset ledger), receipts and the spec into exports/<id>/ with a manifest. Next skill: publish_checklist."
kind: hybrid
tag: universal
category: workflow
requires: [node>=20]
inputs: "project_path, spec_id"
outputs: "exports/<spec_id>/manifest.json plus files"
schema_refs: [render_receipt.v1]
---
# export_package

Copy, do not move. `attribution.txt` lists every asset with `attribution` text from the ledger; include it even when empty so the user sees what was used. The manifest has sha256 per file. Then call `originality_check` with `action: record`.
