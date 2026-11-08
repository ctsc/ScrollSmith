import manifest from "../manifest.json";
import type { VideoSpec } from "./types";

type Tokens = typeof manifest.tokens;

export function tokensFor(spec: VideoSpec): Tokens {
  const base = JSON.parse(JSON.stringify(manifest.tokens)) as Tokens;
  const palette = spec.style?.variation?.palette;
  const variants = base.palette_variants as Record<string, Record<string, string>>;
  if (palette && palette !== "default" && variants[palette]) Object.assign(base.color, variants[palette]);
  const o = spec.style?.token_overrides as Partial<Tokens> | undefined;
  if (o?.color) Object.assign(base.color, o.color);
  if (o?.type) Object.assign(base.type, o.type);
  return base;
}
