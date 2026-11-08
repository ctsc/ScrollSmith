# Screen demo rulebook

Format: software walkthroughs and tutorials recorded from a screen. House rules.

## workflow
footage_ingest (ocr true) -> edit_plan_create with `format_specific.screen_demo_*` decisions -> caption_apply_style -> audio_mix -> render_preview -> qa_check -> render_final.

## pacing
- Idle, loading and typing stretches are sped up 4x, not cut, so context survives. Cut only at sentence boundaries.
- Cursor zoom 1.4 to 1.8 on clicks, 500 ms ease-out, return to full view at the next topic change.

## privacy
- OCR blocks containing emails, keys, tokens or names not meant to be public get a blur layer. Ask the user when unsure.

## captions
- Bottom slot only, never over the UI area being shown. Hide while a title overlays the same slot.

## layout
- Vertical: `screen_demo` layout (screen in the upper two thirds, caption below) or `pip_corner` for a webcam.

## export
- 60 fps when the preset allows and the UI has fine motion; otherwise 30.
