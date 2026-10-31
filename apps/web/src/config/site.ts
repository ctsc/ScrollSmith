export const site = {
  name: "Scrollsmith AI",
  shortName: "Scrollsmith",
  tagline: "The free MCP for faceless short-form video",
  description:
    "Add Scrollsmith to Claude, ChatGPT, Gemini CLI or Cursor in under a minute. Free skills for video, image and voice so your AI can turn one idea into a finished Reel, TikTok or YouTube Short.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.scroll-smith.com",
  social: {
    instagram: "https://www.instagram.com/cubestoriesdaily/",
    tiktok: "https://www.tiktok.com/@cubestoriesdaily",
    youtube: "https://www.youtube.com/@CubeStoriesDaily",
  },
  assistants: ["Claude", "ChatGPT", "Gemini", "Cursor"],
  mcpUrl: "https://mcp.scroll-smith.com/mcp",
  contactEmail: "hello@scroll-smith.com",
  legalUpdated: "October 30, 2026",
} as const;

export type Platform = "instagram" | "tiktok" | "youtube";

export const platforms: { id: Platform; label: string }[] = [
  { id: "instagram", label: "Instagram Reels" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube Shorts" },
];
