---
name: ugc_ad_assemble
description: "Use to assemble an ad from clips with a framework beat map (hook, problem, demo, proof, offer, CTA), captions on and a CTA end card. Claims need substantiation. Next skill: scene_plan_validate."
kind: hybrid
tag: branded
category: footage
requires: [node>=20]
inputs: "{ clips[], framework, cta }"
outputs: "video_spec.v1 (format_type ad_ugc)"
schema_refs: [video_spec.v1]
---
# ugc_ad_assemble
Map each clip to a beat; demo is the longest. Follow `get_rulebook ad_ugc`. End card 1.5 s with the CTA from `cta_build`.
