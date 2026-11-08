# Talking-head edit rulebook

Format: one or two people speaking to camera. House rules, not platform rules. Each section is served separately by `get_rulebook`.

## workflow
1. `footage_ingest` every take. Read the transcript pack, never the raw video.
2. Load the edit style (`edit_style_get`) or create one from a reference the user has rights to (`edit_style_create`).
3. `edit_plan_create`: select registry decisions per range, apply with `apply_decisions`, validate (F1 to F7), show the decision log, wait for approval.
4. Captions (`caption_apply_style` with face avoidance), music and SFX, brand overlays, then `render_preview`, `qa_check`, approval, `render_final`.

## pacing
- Open on the strongest self-contained line (`cut_pacing.hook_first`). The proposition should be clear within 3 s.
- Remove dead air over about 450 ms and fillers; keep about 160 ms of breathing room so speech stays natural.
- A visual change (cut, punch-in, crop change, overlay) at least every 2.5 s in short-form, every 5 s in long-form.
- Cut on sentence boundaries. Never cut inside a word (F1). Every cut gets a 30 ms audio crossfade (F2).

## framing
- Vertical reframe follows the face with smoothing around 0.85 and headroom about 12 percent of frame height.
- Alternate two framings (A wide, B about 15 percent tighter) across cuts to simulate two cameras.
- Punch-ins of 1.08 to 1.25 on stressed words, at most about 10 per minute, never within 300 ms of a shot edge, face stays inside the safe zone (F3).

## captions
- Default preset `mino_clean_3word` (or the brand kit preset): 2 to 3 words per page, white, soft shadow, no animation, kept clear of platform buttons.
- Captions never cover the face (F4): shift within `universal_relaxed`, else fewer lines, else hide and warn.
- Hide captions while on-screen text occupies the same area.

## audio
- Voice first: denoise lightly, loudness to -14 LUFS integrated, true peak -1 dBTP.
- Music 16 to 20 dB under the voice, ducked on speech, cut or drop at the hook end, bar-aligned loop or fade.
- SFX sparingly: whoosh on transitions, pop on text-in, click on counters, at least 300 ms apart, never on a key word.

## brand
- Lower third at the first appearance of each speaker, 3 to 4 s, from the brand kit.
- Logo bug in a safe-zone-aware corner, low opacity. No other app's logos or watermarks.
- Intros eat hook time: default off for short-form; outro or end card at most 1.5 s with a single CTA.

## export
- Master at CRF 18 to 20, H.264 yuv420p, AAC 48 kHz. One variant per platform preset, re-validated per target.
- Attach sidecar SRT and VTT. Write the receipt and the attribution file.
