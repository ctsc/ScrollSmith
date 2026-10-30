export const site = {
  name: "Scrollsmith AI",
  shortName: "Scrollsmith",
  tagline: "The free MCP for faceless short-form video",
  description:
    "Add Scrollsmith to Claude, ChatGPT or Cursor and turn one idea into a finished Reel, TikTok or YouTube Short. Video, image and voice tools for faceless creators. Completely free.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://scrollsmith.ai",
  social: {
    instagram: "https://www.instagram.com/cubestoriesdaily/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/",
  },
  assistants: ["Claude", "ChatGPT", "Cursor"],
  launchCopy: {
    badge: "Launching soon · completely free",
    headline: ["Short-form videos", "Faceless content", "Made by AI", "Posted by you"],
    subheadline:
      "One idea generated into a finished Reel, TikTok or YouTube Short, straight from Claude, ChatGPT or Cursor. Scrollsmith is a free MCP that gives your AI video, image and voice tools. No new app. No learning curve.",
    cta: "Get early access",
    success: "You're on the list. We'll email you the moment the MCP goes live.",
    duplicate: "You're already on the list. We'll be in touch soon.",
  },
} as const;

export type Platform = "instagram" | "tiktok" | "youtube";

export const platforms: { id: Platform; label: string }[] = [
  { id: "instagram", label: "Instagram Reels" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube Shorts" },
];
