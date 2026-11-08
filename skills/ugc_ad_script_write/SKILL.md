---
name: ugc_ad_script_write
description: "Use to write an ad or UGC script from a product brief with a framework (PAS, testimonial, demo, before_after, objection_handling), with beat tags and a claims list for fact_check. Next skill: fact_check."
kind: instruction
tag: branded
category: script
inputs: "{ product_brief, framework, target_s }"
outputs: "script.v1 with beat tags and claims[]"
schema_refs: [script.v1]
---
# ugc_ad_script_write
Templates: PAS (problem, agitate, solution, proof, offer, CTA); testimonial (before, discovery, result, CTA); demo (hook, 3 features in use, proof, CTA). Every claim goes into `claims[]` for `fact_check`.
