# Faceless code-driven rulebook

Videos generated from a `video_spec` with a style pack. House rules.

## workflow
idea_generate -> script_write -> hook_generate -> hook_grade -> script_tighten (checkpoint: script) -> variation_pick -> scene_plan_create -> tts_generate -> audio_align -> music_select -> beat_detect -> beat_sync_apply -> sfx_place -> captions_build -> loop_seal (if loop) -> scene_plan_validate -> wireframe_render (checkpoint) -> render_preview -> qa_check (checkpoint) -> originality_check -> policy_check -> render_final -> qa_check -> cover_frame -> metadata_write -> export_package.

## structure
- Beats: hook (0 to 3 s), context, escalation x N, payoff, optional twist, CTA in the last 25 percent, loop_bridge if looping.
- Every range states its `retention_purpose` (an open loop, a reveal, a question). If you cannot name one, merge the range.
- Max range 4 s. Visual change at least every 2.5 s.

## visuals
- One layout per range from `layouts://index`; text only in safe-zone slots.
- Body text at least 48 px, titles at least 72 px at 1080 width; contrast at least 4.5:1.
- At most 3 on-screen words per second. Captions hide while a title occupies the same area.
- Variation: palette, camera and motion axes change per episode (`variation_pick`); the same template every day is penalized by platforms.

## audio
- Narration drives timing; snap cuts to beats only when the narration still fits.
- Music above 120 BPM for energetic formats (TikTok ads guidance), ducked -12 dB under narration, drop at the hook end.
- Loudness -14 LUFS, -1 dBTP.

## loop
- `state_match`: the last range ends in frame 0's state; verify with SSIM at least 0.92 between the first and last frame; music cut on a bar boundary.

## compliance
- Label fiction as fiction (chat stories). No real people's faces or voices without consent. Realistic AI media gets `ai_disclosure`.
- Run `originality_check` against the last 20 episodes and `policy_check` before the final render.
