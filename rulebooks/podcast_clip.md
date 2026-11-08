# Podcast clip rulebook

Format: short clips from long conversations with one or more speakers. House rules.

## workflow
footage_ingest (diarize when available) -> pick the segment (self-contained, strongest claim) -> edit_plan_create -> caption_apply_style -> brand overlays -> audio_mix -> render_preview -> qa_check -> render_final.

## selection
- A clip must stand alone without the host's setup; add a 1 to 2 line text context card if it cannot.
- 30 to 90 s. Start on the strongest line (`hook_structure.cold_open_strongest_line`).

## framing
- Cut follows the active speaker with 350 ms minimum shot length; split layout (`split_vertical`) when two speakers talk over each other.
- Speaker card at each change; waveform layer under captions when there is no face footage.

## audio
- Match speaker loudness within 1.5 dB before the mix. Light denoise, -14 LUFS.

## captions
- `mino_clean_3word` or brand preset; speaker name color per speaker when the brand kit allows.

## export
- Vertical master plus 16:9 for the long-form channel when asked (`multi_platform_resize`).
