export type Animation = { primitive: string; start_ms: number; duration_ms: number; params?: Record<string, unknown> };
export type Layer = { id: string; kind: string; slot: string; z: number; component?: string; props?: Record<string, unknown>; text?: string; animations?: Animation[] };
export type Range = { id: string; start_ms: number; end_ms: number; beat: string; layout: string; layers: Layer[]; camera?: { preset?: string } };
export type VideoSpec = {
  format: { width: number; height: number; fps: number; duration_ms: number };
  style: { pack_id: string; variation?: Record<string, string>; token_overrides?: Record<string, unknown> };
  timeline: Range[];
  captions?: { preset?: string; words_path?: string; pages?: { text: string; startMs: number; endMs: number }[] };
  loop?: { mode?: string };
};
